import { Station, ReanalysisFeature, ClimateScenario } from "../types";

export const STATIONS: Station[] = [
  {
    id: "tvm",
    name: "Thiruvananthapuram (Station IMD-43371)",
    state: "Kerala",
    lat: 8.506,
    lon: 76.956,
    elevation: 64,
    avgAnnualRainfall: 1826,
    terrain: "Coastal Flat & Lowlands",
    microclimate: "Humid Tropical Wet-Dry (Aw) - Highly impacted by the Arabian Sea windward initiation."
  },
  {
    id: "kochi",
    name: "Kochi (Station IMD-43353)",
    state: "Kerala",
    lat: 9.931,
    lon: 76.267,
    elevation: 4,
    avgAnnualRainfall: 3015,
    terrain: "Coastal Estuarine lagoons",
    microclimate: "Tropical Monsoon (Am) - Extreme convective bursts during Southwest onset."
  },
  {
    id: "kozhikode",
    name: "Kozhikode (Station IMD-43314)",
    state: "Kerala",
    lat: 11.258,
    lon: 75.780,
    elevation: 1,
    avgAnnualRainfall: 3267,
    terrain: "Coastal Plain & Windward Foothills",
    microclimate: "Tropical Monsoon (Am) - Excessive rainfall due to immediate orographic uplift."
  },
  {
    id: "wayanad",
    name: "Ambalavayal / Wayanad Highland",
    state: "Kerala",
    lat: 11.626,
    lon: 76.214,
    elevation: 974,
    avgAnnualRainfall: 2450,
    terrain: "Highland Orographic Plateau",
    microclimate: "Sub-humid Tropical Highland - Steep microclimatic temperature gradients, sensitive to Western Ghats shadow shifts."
  },
  {
    id: "kolkata",
    name: "Kolkata (Alipore Observatory)",
    state: "West Bengal",
    lat: 22.525,
    lon: 88.324,
    elevation: 6,
    avgAnnualRainfall: 1656,
    terrain: "Ganges Delta Lowlands",
    microclimate: "Tropical Wet-Dry (Aw) - Prone to Bay of Bengal depressions and pre-monsoon Nor'westers."
  },
  {
    id: "kalahandi",
    name: "Bhawanipatna (Kalahandi)",
    state: "Odisha",
    lat: 20.143,
    lon: 83.164,
    elevation: 248,
    avgAnnualRainfall: 1350,
    terrain: "Inland Undulating Plateau",
    microclimate: "Semi-Arid Dry Tropical - High coefficient of variation, excessive vulnerability to monsoon breaks and agricultural droughts."
  }
];

export const PREDICTORS_ERA5: ReanalysisFeature[] = [
  {
    name: "convective_precipitation_rate",
    description: "Rate of precipitation produced by convective updrafts, reflecting localized monsoonal instability.",
    unit: "kg / m² / s",
    useCase: "Captures thermal convective bursts prior to systematic monsoon onset."
  },
  {
    name: "vertically_integrated_moisture_divergence",
    description: "Horizontal flux convergence of humidity across vertical atmospheric columns.",
    unit: "g / kg * m / s",
    useCase: "Key indicator of atmospheric transport carrying oceanic moisture onto the landmass."
  },
  {
    name: "low_cloud_cover_fraction",
    description: "Fraction of grid cell occupied by clouds in the lowest atmospheric boundary layers.",
    unit: "dimensionless (0-1)",
    useCase: "Reflects incoming solar radiation blockage and dampening of day-night surface temperatures."
  },
  {
    name: "sea_surface_temperature_anomaly",
    description: "Arabian Sea or Indian Ocean Warm Pool thermal variations (linked to ENSO and IOD).",
    unit: "°C (Kelvin anomaly)",
    useCase: "Acts as a macro-climatic remote predictor shaping the onset dates and total monsoonal volume."
  },
  {
    name: "u_v_wind_vectors_850hPa",
    description: "Zonal and meridional winds at the 850 hPa pressure level, tracing low-level jet streams.",
    unit: "m / s",
    useCase: "Monitors the cross-equatorial Somali jet intensity driving rainbands toward the Western Ghats."
  }
];

export const STATION_CLIMATOLOGIES: Record<string, { season: string; avgRain: number; percentage: number }[]> = {
  tvm: [
    { season: "Pre-Monsoon (Mar-May)", avgRain: 320, percentage: 17.5 },
    { season: "SW Monsoon (Jun-Sep)", avgRain: 890, percentage: 48.7 },
    { season: "NE Monsoon (Oct-Dec)", avgRain: 540, percentage: 29.6 },
    { season: "Winter (Jan-Feb)", avgRain: 76, percentage: 4.2 }
  ],
  kochi: [
    { season: "Pre-Monsoon (Mar-May)", avgRain: 310, percentage: 10.3 },
    { season: "SW Monsoon (Jun-Sep)", avgRain: 2050, percentage: 68.0 },
    { season: "NE Monsoon (Oct-Dec)", avgRain: 580, percentage: 19.2 },
    { season: "Winter (Jan-Feb)", avgRain: 75, percentage: 2.5 }
  ],
  kozhikode: [
    { season: "Pre-Monsoon (Mar-May)", avgRain: 250, percentage: 7.7 },
    { season: "SW Monsoon (Jun-Sep)", avgRain: 2580, percentage: 79.0 },
    { season: "NE Monsoon (Oct-Dec)", avgRain: 397, percentage: 12.1 },
    { season: "Winter (Jan-Feb)", avgRain: 40, percentage: 1.2 }
  ],
  wayanad: [
    { season: "Pre-Monsoon (Mar-May)", avgRain: 220, percentage: 9.0 },
    { season: "SW Monsoon (Jun-Sep)", avgRain: 1890, percentage: 77.1 },
    { season: "NE Monsoon (Oct-Dec)", avgRain: 290, percentage: 11.8 },
    { season: "Winter (Jan-Feb)", avgRain: 50, percentage: 2.1 }
  ],
  kolkata: [
    { season: "Pre-Monsoon (Mar-May)", avgRain: 205, percentage: 12.4 },
    { season: "SW Monsoon (Jun-Sep)", avgRain: 1245, percentage: 75.2 },
    { season: "NE Monsoon (Oct-Dec)", avgRain: 181, percentage: 10.9 },
    { season: "Winter (Jan-Feb)", avgRain: 25, percentage: 1.5 }
  ],
  kalahandi: [
    { season: "Pre-Monsoon (Mar-May)", avgRain: 60, percentage: 4.4 },
    { season: "SW Monsoon (Jun-Sep)", avgRain: 1130, percentage: 83.7 },
    { season: "NE Monsoon (Oct-Dec)", avgRain: 115, percentage: 8.5 },
    { season: "Winter (Jan-Feb)", avgRain: 45, percentage: 3.4 }
  ]
};

// Generate high quality pseudo-climatological annual precipitation datasets (1980-2056)
// Incorporating high variations, and long term projection matching various emissions scenarios.
// Station: Kerala (comprising tvm, kochi, kozhikode combined state average)
export const generateKeralaScenarioData = (): ClimateScenario[] => {
  const data: ClimateScenario[] = [];
  
  // Base long-term average around 2850 mm
  // Cycles with periodic dry years (El nino: 1982, 1987, 1997, 2002, 2009, 2015, 2023)
  // and wet years (La nina: 1988, 1998, 2007, 2010, 2018, 2020)
  for (let yr = 1980; yr <= 2056; yr++) {
    let base = 2850;
    
    // Simulate natural decadal oscillation
    base += Math.sin((yr - 1980) * 0.4) * 210;
    
    // El nino / La Nina impacts
    const elNinos = [1982, 1987, 1997, 2002, 2009, 2015, 2023, 2031, 2038, 2045, 2052];
    const laNinas = [1988, 1998, 2007, 2010, 2018, 2020, 2024, 2029, 2036, 2048, 2055];
    
    if (elNinos.includes(yr)) {
      base -= 650 + Math.random() * 200; // Strong drought deficit
    } else if (laNinas.includes(yr)) {
      base += 580 + Math.random() * 250; // Heavy surplus
    } else {
      // Small random variations
      base += (Math.random() - 0.5) * 280;
    }

    // Historical record goes up directly to 2025 (current year is 2026)
    const isHistorical = yr <= 2025;
    
    // CMIP6 Scenarios starting onwards from 2015/2026
    let ssp126 = base; // Green sustainability: stable or slightly increasing rain but lower climate intensity
    let ssp245 = base; // Moderate path: moderate decline + higher variability
    let ssp585 = base; // High fossil fuel: extreme high anomalies, huge floods, intense wet seasons & severe droughts
    
    if (yr > 2015) {
      const diff = yr - 2015;
      
      // SSP1-2.6: gradual stabilized rise (+0.4% per year)
      ssp126 = Math.max(1600, base + diff * 6);
      
      // SSP2-4.5: climate-induced moderate drying trend (-0.5% per year)
      ssp245 = Math.max(1400, base - diff * 12 + Math.cos(yr * 0.8) * 120);
      
      // SSP5-8.5: high-fever climate, chaotic swings (-0.9% trend, but massive extremes)
      const extremes = Math.sin(yr * 0.6) * (200 + diff * 10);
      ssp585 = Math.max(1100, base - diff * 22 + extremes);
    }
    
    // Simulated deep learning LSTMs projection model (trained 1980-2010; tested 2010-2025; predicting 2026-2056)
    let projectedLSTM: number | null = null;
    if (yr >= 2010) {
      // Trained model captures key non-linearities, performs closely with SSP2-4.5 validation
      const trendDecline = (yr - 2010) * 11;
      const cyclical = Math.sin((yr - 2010) * 0.35) * 160;
      projectedLSTM = Math.max(1300, Math.round(2820 - trendDecline + cyclical + (Math.sin(yr) * 80)));
    }

    data.push({
      year: yr,
      historical: isHistorical ? Math.round(base) : null,
      projectedLSTM: projectedLSTM,
      cmip6_ssp126: Math.round(ssp126),
      cmip6_ssp245: Math.round(ssp245),
      cmip6_ssp585: Math.round(ssp585)
    });
  }
  
  return data;
};

// Returns standard simulated model convergence logs for user interaction
export const getConvergenceHistory = (
  modelType: string,
  lr: number,
  epochs: number,
  hiddenLayers: number
): { epoch: number; trainLoss: number; valLoss: number }[] => {
  const logs = [];
  let trainLoss = 0.45;
  let valLoss = 0.48;
  
  // High learning rates cause chaotic weights or gradients overflow
  const decayRate = lr > 0.1 ? 0.95 : lr > 0.005 ? 0.92 : 0.97;
  const complexityFactor = Math.max(1, hiddenLayers / 2); // deeper layers might overfit faster

  for (let e = 1; e <= epochs; e++) {
    // Neural weights optimization convergence simulation
    const randNoiseTrain = (Math.random() - 0.48) * 0.012;
    trainLoss = trainLoss * decayRate + randNoiseTrain;
    
    let randNoiseVal = (Math.random() - 0.45) * 0.015;
    if (e > epochs * 0.6) {
      // Deeper models with high parameters show over-fitting if training is too long (Validation loss stagnates or increases)
      const overfitGrowth = (e - epochs * 0.6) * (0.0008 * complexityFactor);
      valLoss = valLoss * (decayRate * 1.01) + randNoiseVal + overfitGrowth;
    } else {
      valLoss = valLoss * decayRate + randNoiseVal;
    }
    
    // Bounds
    trainLoss = Math.max(0.002, trainLoss);
    valLoss = Math.max(0.004, valLoss);
    
    // Keep logs highly dense but complete
    if (epochs <= 50 || e % Math.ceil(epochs / 30) === 0 || e === epochs) {
      logs.push({
        epoch: e,
        trainLoss: parseFloat(trainLoss.toFixed(5)),
        valLoss: parseFloat(valLoss.toFixed(5))
      });
    }
  }
  
  return logs;
};
