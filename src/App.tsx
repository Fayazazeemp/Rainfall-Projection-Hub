import React, { useState } from "react";
import { CloudRain, BookOpen, Cpu, BarChart2, FileCode, MapPin, Presentation } from "lucide-react";
import { STATIONS } from "./data/monsoonData";
import { Station } from "./types";

import PhysicsBasics from "./components/PhysicsBasics";
import ModelPlayground from "./components/ModelPlayground";
import Visualizer from "./components/Visualizer";
import ColabExporter from "./components/ColabExporter";
import ProposalPresentation from "./components/ProposalPresentation";

export default function App() {
  const [selectedStation, setSelectedStation] = useState<Station>(STATIONS[0]);
  const [activeTab, setActiveTab ] = useState<"physics" | "playground" | "climate_models" | "google_colab" | "proposal_presentation">("physics");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Premium Content Banner Header */}
      <header className="bg-white border-b border-slate-150 sticky top-0 z-50 shadow-xs">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                <CloudRain className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none mb-0.5">
                  Rainfall Projection Hub
                </h1>
                <p className="text-[10px] text-slate-500 font-mono">
                  INDIA SPATIO-TEMPORAL AI MODELING AND RESEARCH ANALYSIS
                </p>
              </div>
            </div>

            {/* Micro-indicators */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-medium px-2.5 py-1 rounded-md">
                CMIP6 Ensemble Calibrated
              </span>
              <span className="text-[10px] bg-slate-150 text-slate-800 font-medium px-2.5 py-1 rounded-md">
                v2.1 Stable Pipeline
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Workspace Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Core Quick Selection Strip */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-md font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Select Target Observatory (Kerala / Boundary benchmarks)
            </h2>
            <p className="text-slate-500 text-xs font-normal">
              For initial scale setup, focus on Kerala's coastal lines (windward barrier) or individual stations to calibrate training loops.
            </p>
          </div>

          <div>
            <select
              value={selectedStation.id}
              onChange={(e) => {
                const found = STATIONS.find((s) => s.id === e.target.value);
                if (found) setSelectedStation(found);
              }}
              className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer shadow-2xs"
            >
              {STATIONS.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Station detailed microclinic profile card */}
        <div id="station_micro_card" className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 border border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded-sm">Coordinates</span>
              <h3 className="text-lg font-bold mt-1 text-white">Observational Grids</h3>
            </div>
            <div className="mt-4 space-y-1 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-450">Latitude:</span>
                <span className="text-white font-medium">{selectedStation.lat.toFixed(3)}° N</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450">Longitude:</span>
                <span className="text-white font-medium">{selectedStation.lon.toFixed(3)}° E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450">Elevation:</span>
                <span className="text-white font-medium">{selectedStation.elevation} meters</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs md:col-span-2 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono uppercase bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-sm">Geography & Terrain</span>
              <h3 className="text-md font-bold mt-1 text-slate-800">{selectedStation.terrain}</h3>
              <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                {selectedStation.microclimate}
              </p>
            </div>
            <div className="mt-4 text-[10px] text-slate-400 font-mono">
              Climatological Normal: ~{selectedStation.avgAnnualRainfall} mm annual rainfall volume.
            </div>
          </div>

          <div className="bg-indigo-650 hover:bg-slate-900 border border-slate-100 bg-white rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-sm">Interactive Lab code</span>
              <h3 className="text-md font-bold mt-1 text-slate-800">Generated Python Notebook</h3>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                Tailored with coordinate arrays matching {selectedStation.name} for immediate execution.
              </p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => setActiveTab("google_colab")}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                Go to Notebook Center →
              </button>
            </div>
          </div>
        </div>

        {/* Tab Selection Row */}
        <div id="navigation_tabs_wrapper" className="flex flex-wrap border-b border-slate-200">
          {/* <button
            onClick={() => setActiveTab("proposal_presentation")}
            className={`flex items-center gap-2 py-3 px-6 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "proposal_presentation"
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200"
            }`}
          >
            <Presentation className="w-4 h-4" />
            Proposal Presentation Slides
          </button> */}

          <button
            onClick={() => setActiveTab("physics")}
            className={`flex items-center gap-2 py-3 px-6 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "physics"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            1. Monsoon Physics & Predictors
          </button>
          
          <button
            onClick={() => setActiveTab("playground")}
            className={`flex items-center gap-2 py-3 px-6 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "playground"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200"
            }`}
          >
            <Cpu className="w-4 h-4" />
            2. Interactive Deep Learning Lab
          </button>

          <button
            onClick={() => setActiveTab("climate_models")}
            className={`flex items-center gap-2 py-3 px-6 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "climate_models"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200"
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            3. Spatio-Temporal Projections
          </button>

          <button
            onClick={() => setActiveTab("google_colab")}
            className={`flex items-center gap-2 py-3 px-6 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "google_colab"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200"
            }`}
          >
            <FileCode className="w-4 h-4" />
            4. Ready-to-Run Colab Notebook
          </button>
        </div>

        {/* Interactive Tab Render Area */}
        <div id="main_tab_pane" className="min-h-[400px]">
          {activeTab === "physics" && <PhysicsBasics />}
          {activeTab === "playground" && <ModelPlayground selectedStation={selectedStation} />}
          {activeTab === "climate_models" && <Visualizer selectedStation={selectedStation} />}
          {activeTab === "google_colab" && <ColabExporter selectedStation={selectedStation} />}
        </div>
      </main>

      {/* Simplified, Professional Footer */}
      <footer className="bg-white border-t border-slate-150 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-normal font-sans text-slate-500 leading-relaxed">
            Rainfall Projection Hub — Built as a highly robust development companion for climatology research.
          </p>
        </div>
      </footer>
    </div>
  );
}
