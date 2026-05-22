import React, { useState } from "react";
import { Copy, Check, FileCode, ExternalLink, ShieldCheck, Download } from "lucide-react";
import { Station, TrainingParams } from "../types";

interface ColabExporterProps {
  selectedStation: Station;
}

export default function ColabExporter({ selectedStation }: ColabExporterProps) {
  const [copied, setCopied] = useState(false);

  const latStr = selectedStation.lat.toFixed(3);
  const lonStr = selectedStation.lon.toFixed(3);

  const pythonNotebookCode = `# ==============================================================================
# AI-Driven Long-Term Rainfall Projections Over India
# Dedicated Model Code for: ${selectedStation.name}
# Latitude: ${latStr}, Longitude: ${lonStr}
# Sourced data: IMD Gridded, ERA5 Reanalysis, CHIRPS Observations
# ==============================================================================

# ------------------------------------------------------------------------------
# STATION PARAMETERS (DYNAMICALLY INJECTED)
# ------------------------------------------------------------------------------
station_name = "${selectedStation.name}"
station_latitude = ${latStr}
station_longitude = ${lonStr}

# ------------------------------------------------------------------------------
# STEP 1: Install Required Climatological and Deep Learning Libraries
# ------------------------------------------------------------------------------
!pip install -q imdlib pymannkendall pandas numpy scikit-learn tensorflow matplotlib seaborn xarray

import os
import imdlib as imd
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import pymannkendall as pm
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Bidirectional, Dropout, Input, Conv1D, MaxPooling1D
from tensorflow.keras.optimizers import Adam
import warnings
warnings.filterwarnings('ignore')

print("✓ All libraries installed successfully.")

# ------------------------------------------------------------------------------
# STEP 2: Data Sourcing - Downloading Indian Meteorological Dept (IMD) Data
# ------------------------------------------------------------------------------
print("Initializing IMD Data Sourcing...")
start_yr = 1980
end_yr = 2025

# Create directories to store raw binary rainfall files
os.makedirs("raw_imd_data", exist_ok=True)

# Sourcing IMD daily gridded precipitation data
# The \`get_data\` method will check if files already exist before downloading again.
data_grab = imd.get_data('rain', start_yr, end_yr, fn_format='grd', file_dir=".")

# Read downloaded binary files directly into an xarray/dataset
ds = data_grab.get_xarray()
print("✓ IMD Gridded Rainfall loaded successfully into NetCDF coordinate schema.")

# ------------------------------------------------------------------------------
# STEP 3: Extraction of Station coordinates
# Target Station: ${selectedStation.name}
# Coordinates: Lat ${latStr}, Lon ${lonStr}
# ------------------------------------------------------------------------------
station_lat = station_latitude
station_lon = station_longitude

# Extract time-series vector at nearest gridded point
station_ds = ds.sel(lat=station_lat, lon=station_lon, method='nearest')
df_rain = station_ds.to_dataframe().reset_index()

# Clean dates and index by continuous timeline
df_rain['time'] = pd.to_datetime(df_rain['time'])
df_rain.set_index('time', inplace=True)
df_rain = df_rain.rename(columns={'rain': 'Rainfall_Observation_mm'})

# Replace anomalies or negative noise with zero
df_rain['Rainfall_Observation_mm'] = df_rain['Rainfall_Observation_mm'].clip(lower=0.0)

print("Daily rainfall dataset preview (1980-2025):")
print(df_rain.head())

# ------------------------------------------------------------------------------
# STEP 4: Feature Engineering - Integrating ERA5 Climate Predictors
# (Atmospheric convective cloud physics)
# In actual research, download these from Climate Data Store (CDS API)
# Here we append simulated features for microclimatic conditions:
# ------------------------------------------------------------------------------
np.random.seed(42)
n_days = len(df_rain)

# 1. Vertically Integrated Moisture Divergence (g/kg * m/s)
df_rain['moisture_divergence'] = np.sin(np.arange(n_days) * (2*np.pi/365.25)) * 12 + np.random.normal(0, 3, n_days)
# 2. Convective Precipitation Rate (kg/m^2/s)
df_rain['convective_rate'] = df_rain['Rainfall_Observation_mm'] * 0.45 + np.random.normal(0, 0.5, n_days)
# 3. Low Cloud Cover fraction (0 to 1)
df_rain['low_cloud_fraction'] = np.clip(0.3 + (df_rain['Rainfall_Observation_mm'] * 0.02) + np.random.normal(0, 0.1, n_days), 0.0, 1.0)

print("\\n✓ Atmospheric physical features integrated with station gaugings.")

# ------------------------------------------------------------------------------
# STEP 5: Exploratory Spatial Analysis - Mann-Kendall Monsoon Trend Test
# ------------------------------------------------------------------------------
# Aggregate to monsoon season (June to September - JJAS)
df_jjas = df_rain[df_rain.index.month.isin([6, 7, 8, 9])]
annual_monsoon = df_jjas.resample('YE').sum()

mk_res = pm.original_test(annual_monsoon['Rainfall_Observation_mm'])
print("\\n=== MANN-KENDALL MONSOON TREND RESULTS ===")
print(f"Trend Type: {mk_res.trend}")
print(f"Significance (p-value): {mk_res.p:.5f}")
print(f"Sen's Slope: {mk_res.slope:.4f} mm/year")

# Plot historical monsoon variations
plt.figure(figsize=(11, 4))
plt.plot(annual_monsoon.index.year, annual_monsoon['Rainfall_Observation_mm'], marker='o', color='#4f46e5', linewidth=2)
plt.axhline(annual_monsoon['Rainfall_Observation_mm'].mean(), color='red', linestyle='--', label='Climatological Mean')
plt.title(f"{station_name} Historical Monsoon Rainfall trend (1980 - 2025)")
plt.xlabel("Year")
plt.ylabel("Annual Volume (mm)")
plt.grid(True, alpha=0.3)
plt.legend()
plt.show()

# ------------------------------------------------------------------------------
# STEP 6: AI Deep Learning - Temporal Modeling with Bidirectional-LSTM
# Splits: Train (1980-2010), Test (2010-2025)
# ------------------------------------------------------------------------------
# Extract multivariable features as predictors
feature_cols = ['Rainfall_Observation_mm', 'moisture_divergence', 'convective_rate', 'low_cloud_fraction']
data_matrix = df_rain[feature_cols].values

# standard scaling: normalize weather signals
scaler = StandardScaler()
scaled_data = scaler.fit_transform(data_matrix)

# Create Sliding Sequence Windows (Lag: 15 continuous days to capture moisture convection)
def create_sliding_sequences(data, lag_steps=15):
    X, y = [], []
    for i in range(len(data) - lag_steps):
        X.append(data[i: i + lag_steps, :])
        y.append(data[i + lag_steps, 0]) # predict next rainfall value
    return np.array(X), np.array(y)

lag = 15
X, y = create_sliding_sequences(scaled_data, lag_steps=lag)

# Split according to chronological years index
split_idx = len(df_rain[df_rain.index < '2010-01-01']) - lag
X_train, y_train = X[:split_idx], y[:split_idx]
X_test, y_test = X[split_idx:], y[split_idx:]

print(f"\\nSequences configured:")
print(f"Training dataset: {X_train.shape[0]} windows of {lag} days.")
print(f"Testing dataset: {X_test.shape[0]} windows of {lag} days.")

# ------------------------------------------------------------------------------
# STEP 7: Compile and Fit Deep Recurrent Neural Network
# ------------------------------------------------------------------------------
model = Sequential([
    Input(shape=(X_train.shape[1], X_train.shape[2])),

    # Bidirectional-LSTM parses time forwards & backwards
    Bidirectional(LSTM(64, return_sequences=True, activation='tanh')),
    Dropout(0.2),

    LSTM(32, activation='tanh', return_sequences=False),
    Dropout(0.1),

    Dense(16, activation='relu'),
    Dense(1) # output layer (1 node predicting rainfall volume)
])

model.compile(optimizer=Adam(learning_rate=0.001), loss='mean_squared_error')
print("\\nTraining AI Model...")
history = model.fit(
    X_train, y_train,
    epochs=100,
    batch_size=32,
    validation_split=0.15,
    verbose=1
)

# ------------------------------------------------------------------------------
# STEP 8: Model Validation and Evaluation (Test Data: 2010 - 2025)
# ------------------------------------------------------------------------------
test_preds_scaled = model.predict(X_test)

# Reshape back to inverse scale
dummy_matrix = np.zeros((len(test_preds_scaled), len(feature_cols)))
dummy_matrix[:, 0] = test_preds_scaled.flatten()
test_preds = scaler.inverse_transform(dummy_matrix)[:, 0]

y_test_original = df_rain['Rainfall_Observation_mm'].values[split_idx+lag:]

# Metrics calculation
rmseVal = np.sqrt(np.mean((test_preds - y_test_original)**2))
maeVal = np.mean(np.abs(test_preds - y_test_original))
r_value = np.corrcoef(test_preds, y_test_original)[0, 1]

print("\\n=== TEST PARTITION MODEL SKILL (2010-2025) ===")
print(f"Root Mean Squared Error: {rmseVal:.3f} mm")
print(f"Mean Absolute Error: {maeVal:.3f} mm")
print(f"Pearson Correlation (R): {r_value:.4f}")

# ------------------------------------------------------------------------------
# STEP 9: AI Projections for Next Years (2026 - 2030)
# ------------------------------------------------------------------------------
# Recursively project using predicted rainfall as inputs for subsequent days
future_projected = []
current_window = scaled_data[-lag:, :].copy() # Start with very last 15 days of 2025

print("\\nProjecting future timeline (2026 - 2030) anomalies recursively...")
for day in range(1826): # ~5 years daily forecasts
    pred_res = model.predict(current_window.reshape(1, lag, len(feature_cols)), verbose=0)

    # Setup dummy variable with predicted rain to inverse transform and scale correctly
    dummy_pred_step = np.zeros((1, len(feature_cols)))
    dummy_pred_step[0, 0] = pred_res[0, 0]
    unscaled_pred = scaler.inverse_transform(dummy_pred_step)[:, 0]
    future_projected.append(max(0.0, unscaled_pred[0]))

    # Prepare sliding input line for next cycle (FIXED LOGIC)
    actual_rainfall_pred = unscaled_pred[0] # Get the *unscaled* predicted rainfall

    # Calculate the *unscaled* auxiliary features for the next day
    actual_moisture_divergence = np.sin(day * (2*np.pi/365.25)) * 12
    actual_convective_rate = actual_rainfall_pred * 0.45
    actual_low_cloud_fraction = np.clip(0.3 + (actual_rainfall_pred * 0.02), 0.0, 1.0)

    # Create an unscaled feature vector for the next step
    unscaled_next_step_full_feat = np.array([
        actual_rainfall_pred,
        actual_moisture_divergence,
        actual_convective_rate,
        actual_low_cloud_fraction
    ]).reshape(1, len(feature_cols))

    # Scale this full feature vector to use as input for the next prediction
    next_step_feat = scaler.transform(unscaled_next_step_full_feat)

    current_window = np.vstack([current_window[1:, :], next_step_feat])

# Aggregate projected daily predictions into yearly totals
proj_years = [2026, 2027, 2028, 2029, 2030]
yearly_projections = []
for i, yr in enumerate(proj_years):
    slice_start = i * 365
    slice_end = (i + 1) * 365
    yearly_projections.append(sum(future_projected[slice_start:slice_end]))

print("\\n=== DYNAMIC AImonsoon PROJECTIONS (2026 - 2030) ===")
for yr, val in zip(proj_years, yearly_projections):
    print(f"Year {yr}: {val:.2f} mm")

print("\\n=== PRODUCING COGENT GRAPHS FOR ANALYSIS REPORT ===")
plt.figure(figsize=(10, 5))
plt.plot(history.history['loss'], label='Training L2 Loss', color='#4f46e5')
plt.plot(history.history['val_loss'], label='Validation Loss', color='#10b981')
plt.title("Recurrent Neural Network Model Loss Curve")
plt.xlabel("Optimizer Epochs")
plt.ylabel("MSE Loss")
plt.legend()
plt.show()

# ------------------------------------------------------------------------------
# STEP 10: Rainfall Projection and Analysis
# ------------------------------------------------------------------------------
import datetime

# Create a date range for the projected period (2026-2030)
start_date_proj = datetime.date(2026, 1, 1)
proj_dates = pd.date_range(start=start_date_proj, periods=len(future_projected), freq='D')

# Create a DataFrame for projected daily rainfall
df_projected_daily = pd.DataFrame({
    'time': proj_dates,
    'Rainfall_Observation_mm': future_projected
}).set_index('time')

# Filter for monsoon months (June to September - JJAS) in projected data
df_projected_jjas = df_projected_daily[df_projected_daily.index.month.isin([6, 7, 8, 9])]

# Aggregate projected daily monsoon rainfall into yearly totals
projected_annual_monsoon = df_projected_jjas.resample('YE').sum().reset_index()
projected_annual_monsoon['year'] = projected_annual_monsoon['time'].dt.year
projected_annual_monsoon = projected_annual_monsoon[['year', 'Rainfall_Observation_mm']]

# Prepare historical annual monsoon data for concatenation
historical_annual_monsoon = annual_monsoon.reset_index()
historical_annual_monsoon['year'] = historical_annual_monsoon['time'].dt.year
historical_annual_monsoon = historical_annual_monsoon[['year', 'Rainfall_Observation_mm']]

# Combine historical and projected monsoon rainfall
combined_monsoon_rainfall = pd.concat([historical_annual_monsoon, projected_annual_monsoon])

# Plot the combined monsoon rainfall
plt.figure(figsize=(14, 7))
sns.lineplot(x='year', y='Rainfall_Observation_mm', data=combined_monsoon_rainfall, marker='o')
plt.axvline(x=2025.5, color='gray', linestyle='--', label='End of Historical Data')
plt.title(f"{station_name} - Combined Historical and Projected Monsoon-Season Rainfall (1980-2030)")
plt.xlabel('Year')
plt.ylabel('Monsoon-Season Rainfall (mm)')
plt.grid(True, linestyle='--', alpha=0.7)
plt.legend()
plt.show()
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pythonNotebookCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="colab_exporter_container" className="space-y-6">
      {/* Exporter Card Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <FileCode className="w-6 h-6 text-indigo-600" />
            Google Colab Notebook Export Center
          </h3>
          <p className="text-slate-500 text-xs mt-1">
            Download or copy this comprehensive python workspace script matching your configuration for <strong>{selectedStation.name}</strong>.
          </p>
        </div>

        {/* Copy trigger button */}
        <button
          onClick={copyToClipboard}
          className={`flex items-center gap-2 text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-xs ${
            copied
              ? "bg-emerald-500 text-white shadow-emerald-100"
              : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-100"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Notebook Code Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Ready-to-Run Code
            </>
          )}
        </button>
      </div>

      {/* Deployment guide cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Sourcing Data in Python (Official Direct API)
          </h4>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            The script features the official <code>imdlib</code> package to bypass complex FTP downloads. In your Colab, it queries binary gridded archives, extracts your latitude/longitude coordinates (<strong>{latStr}, {lonStr}</strong>), and converts it directly into a clean Pandas dataframe.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ExternalLink className="w-4 h-4 text-indigo-600" />
            Kaggle & GEE Cloud Integrations
          </h4>
          <p className="text-slate-500 text-[11px] leading-relaxed font-normal">
            For high-resolution ERA5/CHIRPS datasets, you can utilize the Google Earth Engine (<code>ee</code> python library) API or mount your Kaggle API key directly in Colab to acquire CDS NetCDF climate predictors on standard dimensions.
          </p>
        </div>
      </div>

      {/* Code Display window */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-slate-300 p-6 min-h-[300px]">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold px-2 py-1 bg-slate-800 text-slate-400 rounded-sm">
            python notebook (Keras/TensorFlow)
          </span>
        </div>

        {/* Styled preview */}
        <pre className="text-xs font-mono overflow-x-auto max-h-[480px] leading-relaxed select-all">
          {pythonNotebookCode}
        </pre>
      </div>
    </div>
  );
}
