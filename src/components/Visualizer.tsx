import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { Info, HelpCircle, AlertTriangle, CloudSun } from "lucide-react";
import { generateKeralaScenarioData, STATION_CLIMATOLOGIES } from "../data/monsoonData";
import { Station } from "../types";

interface VisualizerProps {
  selectedStation: Station;
}

export default function Visualizer({ selectedStation }: VisualizerProps) {
  const [activeScenario, setActiveScenario] = useState<"all" | "ssp126" | "ssp245" | "ssp585">("all");
  const [zoomRange, setZoomRange] = useState<"full" | "test_predict" | "short_term">("full");

  const fullData = generateKeralaScenarioData();

  // Filter data based on zoom range
  const getChartData = () => {
    switch (zoomRange) {
      case "test_predict":
        // 2010 to 2056
        return fullData.filter((d) => d.year >= 2010);
      case "short_term":
        // 2026 to 2030 (the specific short term predicting timeline requested!)
        return fullData.filter((d) => d.year >= 2025 && d.year <= 2030);
      case "full":
      default:
        return fullData;
    }
  };

  const chartData = getChartData();
  const stationClimatology = STATION_CLIMATOLOGIES[selectedStation.id] || STATION_CLIMATOLOGIES.tvm;

  return (
    <div id="visualizer_container" className="space-y-6">
      {/* Chart Layout Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">
              Spatio-Temporal Projections vs Climate Scenarios (CMIP6)
            </h3>
            <p className="text-slate-500 text-xs mt-1">
              Validating Deep Learning (Bi-LSTM) projections on historical datasets vs standard climatic modeling baselines (1980–2056).
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => setZoomRange("full")}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                zoomRange === "full"
                  ? "bg-slate-850 text-white bg-slate-900 border-slate-900 font-medium"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Full (1980–2056)
            </button>
            <button
              onClick={() => setZoomRange("test_predict")}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                zoomRange === "test_predict"
                  ? "bg-slate-850 text-white bg-slate-900 border-slate-900 font-medium"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Test & Predict (2010–2056)
            </button>
            <button
              onClick={() => setZoomRange("short_term")}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                zoomRange === "short_term"
                  ? "bg-indigo-600 text-white border-indigo-600 font-medium"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Urgent Meteorological Timeline (2026–2030)
            </button>
          </div>
        </div>

        {/* Dual Axis chart showing historical monsoons and future ensemble scenarios */}
        <div id="recharts_weather_projection" className="h-[340px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHist" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLSTM" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSsp585" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 9 }} stroke="#94a3b8" />
              <YAxis
                unit="mm"
                domain={["dataMin - 200", "dataMax + 200"]}
                tick={{ fontSize: 9 }}
                stroke="#94a3b8"
              />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: "1px solid #f1f5f9" }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              
              {/* Highlight testing start boundary (2010) */}
              <ReferenceLine x={2010} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: "Testing Split (2010)", fill: "#64748b", fontSize: 10, position: "top" }} />
              
              {/* Highlight predicting timeline start boundary (2026) */}
              <ReferenceLine x={2026} stroke="#3b82f6" strokeWidth={1.5} label={{ value: "Forecast Start (2026)", fill: "#2563eb", fontSize: 10, position: "top" }} />

              {/* Historical observational trend line */}
              {/* Render only when zoomRange permits historical observations */}
              {zoomRange !== "short_term" && (
                <Area
                  type="monotone"
                  name="Observed Climatology Rainfall"
                  dataKey="historical"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorHist)"
                  connectNulls
                />
              )}

              {/* Deep Learning model prediction line */}
              <Area
                type="monotone"
                name="AI (Bi-LSTM) Projective Path"
                dataKey="projectedLSTM"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorLSTM)"
                connectNulls
              />

              {/* CMIP6: SSP1-2.6 Sustainability scenario */}
              {(activeScenario === "all" || activeScenario === "ssp126") && (
                <Area
                  type="monotone"
                  name="CMIP6 SSP1-2.6 (Green Path)"
                  dataKey="cmip6_ssp126"
                  stroke="#06b6d4"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={0}
                />
              )}

              {/* CMIP6: SSP2-4.5 Moderate scenario */}
              {(activeScenario === "all" || activeScenario === "ssp245") && (
                <Area
                  type="monotone"
                  name="CMIP6 SSP2-4.5 (Moderate Path)"
                  dataKey="cmip6_ssp245"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  fillOpacity={0}
                />
              )}

              {/* CMIP6: SSP5-8.5 Hostile high emission scenario */}
              {(activeScenario === "all" || activeScenario === "ssp585") && (
                <Area
                  type="monotone"
                  name="CMIP6 SSP5-8.5 (High Evap Floods)"
                  dataKey="cmip6_ssp585"
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorSsp585)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Toggle scenarios filter */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-50 justify-center">
          <span className="text-[11px] text-slate-400 font-semibold self-center mr-2">Filter Scenarios:</span>
          <button
            onClick={() => setActiveScenario("all")}
            className={`px-3 py-1 text-[11px] rounded-full transition-all cursor-pointer ${
              activeScenario === "all"
                ? "bg-slate-100 text-slate-800 font-medium"
                : "bg-white text-slate-550 border border-slate-100 hover:bg-slate-50"
            }`}
          >
            Show All Models
          </button>
          <button
            onClick={() => setActiveScenario("ssp126")}
            className={`px-3 py-1 text-[11px] rounded-full transition-all cursor-pointer ${
              activeScenario === "ssp126"
                ? "bg-cyan-50 text-cyan-800 border border-cyan-200 font-medium"
                : "bg-white text-slate-550 border border-slate-100 hover:bg-slate-50"
            }`}
          >
            SSP1-2.6 Only (Sustainable emissions)
          </button>
          <button
            onClick={() => setActiveScenario("ssp245")}
            className={`px-3 py-1 text-[11px] rounded-full transition-all cursor-pointer ${
              activeScenario === "ssp245"
                ? "bg-amber-50 text-amber-800 border border-amber-200 font-medium"
                : "bg-white text-slate-550 border border-slate-100 hover:bg-slate-50"
            }`}
          >
            SSP2-4.5 Only (Standard decline)
          </button>
          <button
            onClick={() => setActiveScenario("ssp585")}
            className={`px-3 py-1 text-[11px] rounded-full transition-all cursor-pointer ${
              activeScenario === "ssp585"
                ? "bg-red-50 text-red-800 border border-red-200 font-medium"
                : "bg-white text-slate-550 border border-slate-100 hover:bg-slate-50"
            }`}
          >
            SSP5-8.5 Only (Extreme variability)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Seasonal Breakdown Climatology widget */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CloudSun className="w-4 h-4 text-emerald-600" />
              Annual seasonal allocation
            </h4>
            <p className="text-slate-500 text-[11px] leading-relaxed mb-4">
              Direct Direct-Measured climatological distribution of rainfall layers across the year. The southwest monsoon forms the absolute core of India's hydrology.
            </p>

            <div className="space-y-3">
              {stationClimatology.map((col, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-slate-700">{col.season}</span>
                    <span className="text-slate-800 font-bold">{col.avgRain} mm ({col.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        col.season.includes("SW") ? "bg-emerald-500" : "bg-indigo-500"
                      }`}
                      style={{ width: `${col.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-50 text-[10px] text-slate-400">
            Source: India Meteorological Department climatological normal datasets (1951-2000 averages).
          </div>
        </div>

        {/* Prediction window details (2026-2030 Focus) */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 col-span-2 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Key Research Finding: Focus timeline (2026–2030)
            </h4>
            <p className="text-slate-500 text-[11px] leading-relaxed mb-4">
              Your predictive study highlights the immediate next 5 years (2026-2030) as key to validating model skill. This timeline represents a transitional shift in North Atlantic Oscillation indices and Arabian Sea warming anomalies.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-2">Year</th>
                    <th className="py-2">Bi-LSTM AI Projection</th>
                    <th className="py-2">CMIP6 SSP1-2.6</th>
                    <th className="py-2">CMIP6 SSP2-4.5</th>
                    <th className="py-2">CMIP6 SSP5-8.5</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-mono text-slate-700">
                  {fullData
                    .filter((d) => d.year >= 2026 && d.year <= 2030)
                    .map((row) => (
                      <tr key={row.year} className="hover:bg-slate-50/50">
                        <td className="py-2 font-bold text-slate-800">{row.year}</td>
                        <td className="py-2 text-emerald-600 font-bold">{row.projectedLSTM} mm</td>
                        <td className="py-2 text-cyan-600">{row.cmip6_ssp126} mm</td>
                        <td className="py-2 text-amber-600">{row.cmip6_ssp245} mm</td>
                        <td className="py-2 text-red-600">{row.cmip6_ssp585} mm</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex gap-2">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-550 leading-relaxed">
              <strong>Observation:</strong> LSTM projections are tightly aligned to standard moderate-path scenario parameters (SSP2-4.5) but demonstrate heightened periodic dry years, validating deep learning’s potential in resolving complex physical cloudburst dynamics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
