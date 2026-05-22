export interface Station {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  elevation: number; // in meters
  avgAnnualRainfall: number; // in mm
  terrain: string; // "coastal flat", "orographic foothills", "mountain pass", etc.
  microclimate: string;
}

export interface TrainingParams {
  modelType: "stacked_lstm" | "bidirectional_lstm" | "xgboost" | "hybrid_cnn_lstm";
  epochs: number;
  learningRate: number;
  batchSize: number;
  hiddenLayers: number;
  timeSteps: number; // input sequence window in days/months
  optimizer: "Adam" | "SGD" | "RMSprop";
  activation: "tanh" | "relu" | "elu";
}

export interface MetricResults {
  rmse: number;
  mae: number;
  rmsle: number;
  correlation: number; // R value
  valLossHistory: { epoch: number; trainLoss: number; valLoss: number }[];
}

export interface ClimateScenario {
  year: number;
  historical: number | null;
  projectedLSTM: number | null;
  cmip6_ssp126: number; // SSP1-2.6
  cmip6_ssp245: number; // SSP2-4.5 (Moderate scenario)
  cmip6_ssp585: number; // SSP5-8.5 (High emissions scenario)
}

export interface ReanalysisFeature {
  name: string;
  description: string;
  unit: string;
  useCase: string; // predictor role
}
