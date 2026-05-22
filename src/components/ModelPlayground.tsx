import React, { useState, useEffect } from "react";
import { Play, TrendingUp, Cpu, Sliders, CheckCircle2, RotateCcw } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { TrainingParams, MetricResults, Station } from "../types";
import { getConvergenceHistory } from "../data/monsoonData";

interface ModelPlaygroundProps {
  selectedStation: Station;
}

export default function ModelPlayground({ selectedStation }: ModelPlaygroundProps) {
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [compareModelType, setCompareModelType] = useState<string>("hybrid_cnn_lstm");

  const [params, setParams] = useState<TrainingParams>({
    modelType: "bidirectional_lstm",
    epochs: 100,
    learningRate: 0.001,
    batchSize: 32,
    hiddenLayers: 2,
    timeSteps: 15,
    optimizer: "Adam",
    activation: "tanh"
  });

  const [isTraining, setIsTraining] = useState(false);
  const [trainingEpoch, setTrainingEpoch] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const [metrics, setMetrics] = useState<MetricResults>({
    rmse: 0,
    mae: 0,
    rmsle: 0,
    correlation: 0,
    valLossHistory: []
  });

  const [compareMetrics, setCompareMetrics] = useState<{
    rmseA: number;
    maeA: number;
    rmsleA: number;
    correlationA: number;
    rmseB: number;
    maeB: number;
    rmsleB: number;
    correlationB: number;
    valLossHistory: {
      epoch: number;
      trainLossA: number;
      valLossA: number;
      trainLossB: number;
      valLossB: number;
    }[];
  } | null>(null);

  const getModelName = (type: string) => {
    switch (type) {
      case "bidirectional_lstm":
        return "Bi-LSTM";
      case "stacked_lstm":
        return "Stacked-LSTM";
      case "xgboost":
        return "XGBoost";
      case "hybrid_cnn_lstm":
      default:
        return "CNN-LSTM Hybrid";
    }
  };

  // Default benchmarks for all model types (precomputed based on selected station)
  const getModelBenchmarks = (type: string, stationId: string) => {
    const isKerala = ["tvm", "kochi", "kozhikode", "wayanad"].includes(stationId);
    
    switch (type) {
      case "bidirectional_lstm":
        return {
          rmse: isKerala ? 12.1 : 14.8,
          mae: isKerala ? 8.4 : 9.5,
          rmsle: 0.024,
          correlation: 0.91,
          description: "Bidirectional LSTM cells read the weather context both forwards (historical lag forces) and backward (future trend assimilation sequences) creating a dense temporal extraction."
        };
      case "stacked_lstm":
        return {
          rmse: isKerala ? 12.8 : 15.3,
          mae: isKerala ? 8.9 : 10.1,
          rmsle: 0.027,
          correlation: 0.89,
          description: "Layers of Recurrent cells stacked in series. Extracted high-dimensional non-linear features, though vulnerable to gradient saturation if learning rates exceed 0.01."
        };
      case "xgboost":
        return {
          rmse: isKerala ? 21.4 : 26.2,
          mae: isKerala ? 14.2 : 17.5,
          rmsle: 0.075,
          correlation: 0.76,
          description: "Gradient boosted tabular trees. Excellent as a fast, low-compute baseline, but lacks recurrent cells to trace fluid, sequential atmospheric vectors cleanly."
        };
      case "hybrid_cnn_lstm":
      default:
        return {
          rmse: isKerala ? 11.5 : 13.9,
          mae: isKerala ? 7.9 : 8.8,
          rmsle: 0.021,
          correlation: 0.93,
          description: "1D CNN filters capture spatial boundary reanalysis features (ERA5 vectors) first, while subsequent Recurrent LSTM cells map their temporal propagation across months."
        };
    }
  };

  const currentBenchmark = getModelBenchmarks(params.modelType, selectedStation.id);

  // Simulated live epoch-by-epoch training sequence
  const handleTrainModel = () => {
    setIsTraining(true);
    setShowResults(false);
    setTrainingEpoch(1);
    
    if (isComparisonMode) {
      const historyA = getConvergenceHistory(
        params.modelType,
        params.learningRate,
        params.epochs,
        params.hiddenLayers
      );

      const historyB = getConvergenceHistory(
        compareModelType,
        params.learningRate,
        params.epochs,
        params.hiddenLayers
      );

      // Merge both convergence histories for plotting side-by-side on a single chart
      const mergedHistory = historyA.map((item, idx) => {
        const itemB = historyB[idx] || { trainLoss: item.trainLoss, valLoss: item.valLoss };
        return {
          epoch: item.epoch,
          trainLossA: item.trainLoss,
          valLossA: item.valLoss,
          trainLossB: itemB.trainLoss,
          valLossB: itemB.valLoss
        };
      });

      let progress = 1;
      const interval = setInterval(() => {
        progress += Math.max(1, Math.round(params.epochs / 15));
        if (progress >= params.epochs) {
          clearInterval(interval);
          setTrainingEpoch(params.epochs);

          const benchmarkA = getModelBenchmarks(params.modelType, selectedStation.id);
          const benchmarkB = getModelBenchmarks(compareModelType, selectedStation.id);

          const lrRatio = params.learningRate === 0.001 ? 1.0 : params.learningRate < 0.005 ? 1.08 : 1.25;
          const timeStepsRatio = params.timeSteps === 15 ? 1.0 : params.timeSteps > 15 ? 0.96 : 1.15;

          const rmseA = parseFloat((benchmarkA.rmse * lrRatio * timeStepsRatio).toFixed(3));
          const maeA = parseFloat((benchmarkA.mae * lrRatio * timeStepsRatio).toFixed(3));
          const rmsleA = parseFloat((benchmarkA.rmsle * lrRatio).toFixed(4));
          const corrA = parseFloat(Math.min(0.98, benchmarkA.correlation * (2 - lrRatio) * (2 - timeStepsRatio)).toFixed(3));

          const rmseB = parseFloat((benchmarkB.rmse * lrRatio * timeStepsRatio).toFixed(3));
          const maeB = parseFloat((benchmarkB.mae * lrRatio * timeStepsRatio).toFixed(3));
          const rmsleB = parseFloat((benchmarkB.rmsle * lrRatio).toFixed(4));
          const corrB = parseFloat(Math.min(0.98, benchmarkB.correlation * (2 - lrRatio) * (2 - timeStepsRatio)).toFixed(3));

          setCompareMetrics({
            rmseA,
            maeA,
            rmsleA,
            correlationA: corrA,
            rmseB,
            maeB,
            rmsleB,
            correlationB: corrB,
            valLossHistory: mergedHistory
          });

          setIsTraining(false);
          setShowResults(true);
        } else {
          setTrainingEpoch(progress);
        }
      }, 70);
    } else {
      const fullHistory = getConvergenceHistory(
        params.modelType,
        params.learningRate,
        params.epochs,
        params.hiddenLayers
      );

      let progress = 1;
      const interval = setInterval(() => {
        progress += Math.max(1, Math.round(params.epochs / 15));
        if (progress >= params.epochs) {
          clearInterval(interval);
          setTrainingEpoch(params.epochs);
          
          // Finalize state and calculate fine-tuned metrics based on hyperparameters
          const lrRatio = params.learningRate === 0.001 ? 1.0 : params.learningRate < 0.005 ? 1.08 : 1.25;
          const timeStepsRatio = params.timeSteps === 15 ? 1.0 : params.timeSteps > 15 ? 0.96 : 1.15;
          const finalRmse = parseFloat((currentBenchmark.rmse * lrRatio * timeStepsRatio).toFixed(3));
          const finalMae = parseFloat((currentBenchmark.mae * lrRatio * timeStepsRatio).toFixed(3));
          const finalR = parseFloat(Math.min(0.98, currentBenchmark.correlation * (2 - lrRatio) * (2 - timeStepsRatio)).toFixed(3));

          setMetrics({
            rmse: finalRmse,
            mae: finalMae,
            rmsle: parseFloat((currentBenchmark.rmsle * lrRatio).toFixed(4)),
            correlation: finalR,
            valLossHistory: fullHistory
          });
          
          setIsTraining(false);
          setShowResults(true);
        } else {
          setTrainingEpoch(progress);
        }
      }, 70);
    }
  };

  return (
    <div id="model_playground_container" className="space-y-6">
      {/* Hyperparameter Controls Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="w-5 h-5 text-indigo-600" />
              <h4 className="text-md font-bold text-slate-800">
                AI Optimization Lab
              </h4>
            </div>

            {/* Toggle Switch */}
            <div className="flex bg-slate-50 p-1 rounded-xl mb-4 border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setIsComparisonMode(false);
                  setShowResults(false);
                }}
                className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  !isComparisonMode
                    ? "bg-white text-indigo-700 shadow-2xs"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Single Model
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsComparisonMode(true);
                  setShowResults(false);
                }}
                className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isComparisonMode
                    ? "bg-white text-indigo-700 shadow-2xs"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Compare Models
              </button>
            </div>

            <div className="space-y-4">
              {/* Architecture Choices */}
              {!isComparisonMode ? (
                <div>
                  <label className="block text-slate-500 text-xs font-semibold mb-1">
                    Architecture Framework
                  </label>
                  <select
                    value={params.modelType}
                    onChange={(e) => setParams({ ...params, modelType: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="bidirectional_lstm">Bidirectional-LSTM Network</option>
                    <option value="stacked_lstm">Stacked-LSTM (Two Hidden Layers)</option>
                    <option value="hybrid_cnn_lstm">Hybrid CNN-LSTM Framework</option>
                    <option value="xgboost">XGBoost Regressor (Tree Baseline)</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-indigo-700 text-xs font-bold mb-1">
                      Model A (Primary Model)
                    </label>
                    <select
                      value={params.modelType}
                      onChange={(e) => setParams({ ...params, modelType: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    >
                      <option value="bidirectional_lstm">Bidirectional-LSTM Network</option>
                      <option value="stacked_lstm">Stacked-LSTM (Two layers)</option>
                      <option value="hybrid_cnn_lstm">Hybrid CNN-LSTM Framework</option>
                      <option value="xgboost">XGBoost Regressor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-amber-600 text-xs font-bold mb-1">
                      Model B (Secondary Model)
                    </label>
                    <select
                      value={compareModelType}
                      onChange={(e) => setCompareModelType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    >
                      <option value="bidirectional_lstm">Bidirectional-LSTM Network</option>
                      <option value="stacked_lstm">Stacked-LSTM (Two layers)</option>
                      <option value="hybrid_cnn_lstm">Hybrid CNN-LSTM Framework</option>
                      <option value="xgboost">XGBoost Regressor</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Epochs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 text-xs font-semibold mb-1">
                    Optimizer Steps (Epochs)
                  </label>
                  <select
                    value={params.epochs}
                    onChange={(e) => setParams({ ...params, epochs: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-1.5 text-xs"
                  >
                    <option value="50">50 Epochs</option>
                    <option value="100">100 Epochs</option>
                    <option value="200">200 Epochs (Max Accuracy)</option>
                    <option value="500">500 Epochs (Slow)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 text-xs font-semibold mb-1">
                    Sliding Window (Lag)
                  </label>
                  <select
                    value={params.timeSteps}
                    onChange={(e) => setParams({ ...params, timeSteps: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-1.5 text-xs"
                  >
                    <option value="5">5 steps (Dry)</option>
                    <option value="12">12 steps (Typical)</option>
                    <option value="15">15 steps (Optimal Memory)</option>
                  </select>
                </div>
              </div>

              {/* Learning Rate & Layers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 text-xs font-semibold mb-1">
                    Learning Rate (η)
                  </label>
                  <select
                    value={params.learningRate}
                    onChange={(e) => setParams({ ...params, learningRate: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-1.5 text-xs"
                  >
                    <option value="0.001">0.001 (Recommended)</option>
                    <option value="0.005">0.005</option>
                    <option value="0.01">0.01 (High)</option>
                    <option value="0.1">0.1 (Unstable)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 text-xs font-semibold mb-1">
                    Recursive Depth
                  </label>
                  <select
                    value={params.hiddenLayers}
                    onChange={(e) => setParams({ ...params, hiddenLayers: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-1.5 text-xs"
                  >
                    <option value="1">1 Hidden Layer</option>
                    <option value="2">2 Hidden Layers</option>
                    <option value="3">3 Hidden Layers</option>
                  </select>
                </div>
              </div>

              {/* Activation & Optimizer */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 text-xs font-semibold mb-1">
                    Gates Activator
                  </label>
                  <select
                    value={params.activation}
                    onChange={(e) => setParams({ ...params, activation: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-1.5 text-xs"
                  >
                    <option value="tanh">tanh</option>
                    <option value="relu">ReLU</option>
                    <option value="elu">ELU</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-550 text-slate-500 text-xs font-semibold mb-1">
                    Weight Solver
                  </label>
                  <select
                    value={params.optimizer}
                    onChange={(e) => setParams({ ...params, optimizer: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-1.5 text-xs"
                  >
                    <option value="Adam">Adam Solver</option>
                    <option value="SGD">SGD Momentum</option>
                    <option value="RMSprop">RMSprop</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={handleTrainModel}
              disabled={isTraining}
              className={`w-full flex items-center justify-center gap-2 text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer ${
                isTraining
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-indigo-650 hover:bg-indigo-700 text-white bg-indigo-600 shadow-md shadow-indigo-100"
              }`}
            >
              {isTraining ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-350 border-t-indigo-600 mr-2" />
                  Epoch {trainingEpoch} / {params.epochs} Training...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  {isComparisonMode ? `Compare ${getModelName(params.modelType)} & ${getModelName(compareModelType)}` : "Execute Hybrid AI Training Loop"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real-time Loss History Plot */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <h4 className="text-md font-bold text-slate-800">
                  {isComparisonMode ? "Comparative Loss Convergence Plot" : "Loss Convergence & Bias Metrics"}
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md">
                Station: {selectedStation.name}
              </span>
            </div>

            <div id="loss_chart_wrapper" className="h-[220px] w-full flex items-center justify-center text-slate-400 text-xs">
              {isTraining || showResults ? (
                <ResponsiveContainer width="100%" height="100%">
                  {isComparisonMode && compareMetrics ? (
                    <LineChart
                      data={compareMetrics.valLossHistory}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="epoch"
                        label={{ value: "Epochs trained", position: "bottom", offset: 10, size: 10 }}
                        tick={{ fontSize: 9 }}
                      />
                      <YAxis tick={{ fontSize: 9 }} />
                      <Tooltip contentStyle={{ fontSize: 11 }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      
                      {/* Model A lines */}
                      <Line
                        type="monotone"
                        name={`${getModelName(params.modelType)} (Train)`}
                        dataKey="trainLossA"
                        stroke="#4f46e5"
                        strokeDasharray="3 3"
                        strokeWidth={1.5}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        name={`${getModelName(params.modelType)} (Val)`}
                        dataKey="valLossA"
                        stroke="#4f46e5"
                        strokeWidth={2.5}
                        dot={false}
                      />

                      {/* Model B lines */}
                      <Line
                        type="monotone"
                        name={`${getModelName(compareModelType)} (Train)`}
                        dataKey="trainLossB"
                        stroke="#f59e0b"
                        strokeDasharray="3 3"
                        strokeWidth={1.5}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        name={`${getModelName(compareModelType)} (Val)`}
                        dataKey="valLossB"
                        stroke="#f59e0b"
                        strokeWidth={2.5}
                        dot={false}
                      />
                    </LineChart>
                  ) : (
                    <LineChart
                      data={metrics.valLossHistory}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="epoch"
                        label={{ value: "Epochs trained", position: "bottom", offset: 10, size: 10 }}
                        tick={{ fontSize: 9 }}
                      />
                      <YAxis tick={{ fontSize: 9 }} />
                      <Tooltip contentStyle={{ fontSize: 11 }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Line
                        type="monotone"
                        name="Training Loss (L2)"
                        dataKey="trainLoss"
                        stroke="#4f46e5"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        name="Cross-Validation Loss"
                        dataKey="valLoss"
                        stroke="#059669"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <div className="text-center p-8">
                  <Cpu className="w-8 h-8 mx-auto mb-2 text-indigo-400 animate-pulse" />
                  <p className="font-semibold text-slate-700">Ready to train model</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-sm">
                    {isComparisonMode 
                      ? "Select two model architectures on the left and click 'Compare & Train' to observe comparative optimization curves side-by-side."
                      : "Select hyperparameters on the left and click 'Execute' to observe real-time non-linear optimization of rainfall layers."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {(showResults || isTraining) && (
            isComparisonMode && compareMetrics ? (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Model A Results */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-indigo-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        Model A: {getModelName(params.modelType)}
                      </span>
                      {(!isTraining && compareMetrics.rmseA <= compareMetrics.rmseB) && (
                        <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                          ⭐ Superior Accuracy
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-450 text-slate-500 uppercase tracking-tight block">RMSE</span>
                        <span className="font-bold text-slate-800">
                          {isTraining ? "estimating..." : `${compareMetrics.rmseA} mm`}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-450 text-slate-500 uppercase tracking-tight block">MAE</span>
                        <span className="font-bold text-slate-800">
                          {isTraining ? "estimating..." : `${compareMetrics.maeA} mm`}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-450 text-slate-500 uppercase tracking-tight block">RMSLE Log Error</span>
                        <span className="font-bold text-slate-800 font-mono">
                          {isTraining ? "estimating..." : compareMetrics.rmsleA}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-450 text-slate-500 uppercase tracking-tight block">Pearson R</span>
                        <span className="font-bold text-slate-800">
                          {isTraining ? "estimating..." : compareMetrics.correlationA}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Model B Results */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-amber-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                        Model B: {getModelName(compareModelType)}
                      </span>
                      {(!isTraining && compareMetrics.rmseB < compareMetrics.rmseA) && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                          ⭐ Superior Accuracy
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-450 text-slate-500 uppercase tracking-tight block">RMSE</span>
                        <span className="font-bold text-slate-800">
                          {isTraining ? "estimating..." : `${compareMetrics.rmseB} mm`}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-450 text-slate-500 uppercase tracking-tight block">MAE</span>
                        <span className="font-bold text-slate-800">
                          {isTraining ? "estimating..." : `${compareMetrics.maeB} mm`}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-450 text-slate-500 uppercase tracking-tight block">RMSLE Log Error</span>
                        <span className="font-bold text-slate-800 font-mono">
                          {isTraining ? "estimating..." : compareMetrics.rmsleB}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-450 text-slate-500 uppercase tracking-tight block">Pearson R</span>
                        <span className="font-bold text-slate-800">
                          {isTraining ? "estimating..." : compareMetrics.correlationB}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                <div>
                  <dt className="text-[10px] text-slate-500 uppercase tracking-wider">Testing RMSE</dt>
                  <dd className="text-sm font-bold text-slate-800">
                    {isTraining ? "Estimating..." : `${metrics.rmse} mm`}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] text-slate-500 uppercase tracking-wider">Testing MAE</dt>
                  <dd className="text-sm font-bold text-slate-800">
                    {isTraining ? "Estimating..." : `${metrics.mae} mm`}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] text-slate-500 uppercase tracking-wider">RMSLE Log Error</dt>
                  <dd className="text-sm font-bold text-slate-800">
                    {isTraining ? "Estimating..." : metrics.rmsle}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] text-slate-500 uppercase tracking-wider">Pearson Correlation (R)</dt>
                  <dd className="text-sm font-bold text-slate-800 flex items-center gap-1">
                    {isTraining ? "Estimating..." : `${metrics.correlation}`}
                    {metrics.correlation >= 0.9 && !isTraining && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-sm">High</span>
                    )}
                  </dd>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Model Comparison Breakdown & Analysis Guidelines */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
        <h4 className="text-md font-bold text-slate-800 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Model Task Analysis: Maximizing Accuracy in Rainfall Projections
        </h4>
        <p className="text-slate-650 text-xs leading-relaxed mb-4 text-slate-500">
          Rainfall data spans high extreme values (convective cloudburst anomalies) alongside long sequences of zeroes (monsoon breaks). Utilizing standard regression of MSE might overfit towards extreme peaks. To obtain maximum testing accuracy and performance, implement the following strategies:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="flex items-center justify-center bg-indigo-50 text-indigo-700 text-xs w-6 h-6 rounded-full font-bold">1</span>
              <div>
                <h5 className="text-xs font-semibold text-slate-800 mb-0.5">Use MinMax Rescaling in Sliding Sequences</h5>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Weather parameters (Temperature, Wind, evapo-transpiration) sit in diverse physical dimensions. Apply standard Sci-kit Learn <code>MinMaxScaler(feature_range=(0,1))</code> inside temporal windows <em>before</em> feeding them to the LSTM cells. Correctly map them back during testing.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="flex items-center justify-center bg-indigo-50 text-indigo-700 text-xs w-6 h-6 rounded-full font-bold">2</span>
              <div>
                <h5 className="text-xs font-semibold text-slate-800 mb-0.5">Bidirectional LSTMs Yield Superior Temporal Extraction</h5>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Standard LSTMs only trace memory cells forward. Bidirectional layers (Bi-LSTM) process atmospheric vector loops forward and backward simultaneously, catching key lagging moisture boundaries before they dump heavy rains.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="flex items-center justify-center bg-indigo-50 text-indigo-700 text-xs w-6 h-6 rounded-full font-bold">3</span>
              <div>
                <h5 className="text-xs font-semibold text-slate-800 mb-0.5">Stacked LSTM Layers vs Dimensional Noise</h5>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Adding too many layers (like 4+ Stacked LSTMs with 128 cells) leads to immediate over-fitting on your training data (1980-2010), causing high losses in testing data (2010-2025). Stick to 1 or 2 high-quality layers paired with dropout layers (value of 0.2).
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="flex items-center justify-center bg-indigo-50 text-indigo-700 text-xs w-6 h-6 rounded-full font-bold">4</span>
              <div>
                <h5 className="text-xs font-semibold text-slate-800 mb-0.5">Use RMSprompt/Adam with Smooth Activation Functions</h5>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  ReLU thresholds zeroes, losing gradient paths when modeling severe microclimatic droughts. Prefer <code>tanh</code> in cell recurrent gates to maintain steady gradient flows across long decades.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
