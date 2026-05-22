import React from "react";
import { CloudRain, Wind, Mountain, Layers, Eye } from "lucide-react";

export default function PhysicsBasics() {
  return (
    <div id="physics_basics_container" className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-2">
          Atmospheric Physics & Monsoon Initiation Dynamics
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          The South Asian monsoon represents a giant seasonal sea-breeze circulation driven by the pressure and heat contrast between the colossal landmass of India and the massive Indian Ocean. Capturing these movements with high accuracy requires a firm grounding in cloud thermodynamic feedback loops and spatial topography barriers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dynamic 1: Orographic Uplift */}
        <div id="physics_card_orographic" className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl w-fit mb-4">
              <Mountain className="w-6 h-6" />
            </div>
            <h4 className="text-md font-semibold text-slate-800 mb-1">
              Western Ghats Orographic Barrier
            </h4>
            <p className="text-slate-600 text-xs leading-relaxed mb-4">
              Kerala's unique topography forms a narrow windward plain bordered by the massive Western Ghats mountain range rising to 2,000+ meters. As moist seasonal winds arrive from the Arabian Sea, they are forced upwards along steep geographical walls.
            </p>
          </div>
          <div className="mt-2 p-3 bg-emerald-50 text-emerald-900 rounded-lg text-[11px] font-mono leading-relaxed">
            <strong>Physics Rule:</strong> Adiabatic cooling (9.8°C/km dry, 6°C/km moist) drives absolute moisture saturation, forcing extreme condensation directly on the windward mountain face.
          </div>
        </div>

        {/* Dynamic 2: Convective Instability */}
        <div id="physics_card_convective" className="bg-slate-55 rounded-2xl p-6 border border-slate-100 bg-slate-50 flex flex-col justify-between">
          <div>
            <div className="p-3 bg-sky-100 text-sky-700 rounded-xl w-fit mb-4">
              <CloudRain className="w-6 h-6" />
            </div>
            <h4 className="text-md font-semibold text-slate-800 mb-1">
              SST Anomalies & Convection
            </h4>
            <p className="text-slate-600 text-xs leading-relaxed mb-4">
              Warm Sea Surface Temperatures (SST) in the Arabian Sea induce intense low-latitude moisture evaporation. Incoming solar radiation heating the land sets up deep convective updrafts.
            </p>
          </div>
          <div className="mt-2 p-3 bg-sky-50 text-sky-900 rounded-lg text-[11px] font-mono leading-relaxed">
            <strong>Physics Rule:</strong> Warm waters enhance latent heat release in condensation columns, feeding a positive thermal feedback loop that shapes regional cloud burst clusters.
          </div>
        </div>

        {/* Dynamic 3: Somali Jet Core */}
        <div id="physics_card_windward" className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl w-fit mb-4">
              <Wind className="w-6 h-6" />
            </div>
            <h4 className="text-md font-semibold text-slate-800 mb-1">
              Somali Wind Jet & Latent Heat
            </h4>
            <p className="text-slate-600 text-xs leading-relaxed mb-4">
              At 850 hPa, cross-equatorial southerly winds form the Findlater Somali Jet. This jet acts as an atmospheric conveyor belt transporting oceanic moisture towards the Indian peninsula.
            </p>
          </div>
          <div className="mt-2 p-3 bg-indigo-50 text-indigo-900 rounded-lg text-[11px] font-mono leading-relaxed">
            <strong>Physics Rule:</strong> Wind speed determines air-sea turbulent fluxes, directly steering moisture mass convergence and subsequent rainband precipitation volume.
          </div>
        </div>
      </div>

      {/* Dataset integration explanation */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h4 className="text-md font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <Layers className="w-5 h-5 text-slate-600" />
          Integrating Multi-Resolution Datasets for AI Training
        </h4>
        <p className="text-slate-600 text-xs leading-relaxed mb-4">
          To build a highly accurate rainfall projection system, your models should combine ground observations, satellite measurements and atmospheric reanalysis models. This hybrid multi-source ingestion is critical to overcome the individual limits of each sensor:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h5 className="font-semibold text-slate-800 text-xs mb-1">CHIRPS Satellite Estimates</h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Infrared cold-cloud duration combined with rain gauge observations. Provides exceptional gridded spatiotemporal density ($0.05^\circ$ resolution) over long timelines.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h5 className="font-semibold text-slate-800 text-xs mb-1">ERA5 Climate Reanalysis</h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Combines physics-based atmospheric models with advanced historical data assimilation. Provides key vertical variables like wind vectors, moisture divergence, and clouds.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h5 className="font-semibold text-slate-800 text-xs mb-1">IMD Station Rain Gauges</h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Quality-controlled, direct direct-physical measurements. Serves as the golden truth to calibrate satellite bias anomalies (like rain-intensity overestimation on sloped hills).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
