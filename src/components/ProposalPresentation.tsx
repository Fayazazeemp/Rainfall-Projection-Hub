import React, { useState } from "react";
import {
  Presentation,
  ArrowLeft,
  ArrowRight,
  Cpu,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  HelpCircle,
  FileSpreadsheet,
  MonitorPlay,
  Lightbulb,
  Award,
  Download
} from "lucide-react";
import { Station } from "../types";

interface ProposalPresentationProps {
  selectedStation: Station;
}

export default function ProposalPresentation({ selectedStation }: ProposalPresentationProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleDownloadPresentation = () => {
    const latStr = selectedStation.lat.toFixed(3);
    const lonStr = selectedStation.lon.toFixed(3);
    const stationName = selectedStation.name;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Proposal - AI-Driven Rainfall Projections over India</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
    body { font-family: 'Inter', sans-serif; }
    h1, h2, h3, h4 { font-family: 'Space Grotesk', sans-serif; }
    code, pre { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen flex flex-col justify-between">
  <!-- Header -->
  <header class="bg-white border-b border-slate-100 py-4 px-6 md:px-12 flex justify-between items-center shadow-xs">
    <div class="flex items-center gap-3">
      <div class="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
      </div>
      <div>
        <h1 class="font-bold text-slate-900 leading-tight">Rainfall Projection Hub</h1>
        <p class="text-[10px] text-slate-500 font-mono">STANDALONE PROJECT PROPOSAL DECK</p>
      </div>
    </div>
    <div class="text-[11px] bg-indigo-50 text-indigo-700 rounded-md px-2.5 py-1 font-semibold">
      Station: \${stationName} (\${latStr}° N | \${lonStr}° E)
    </div>
  </header>

  <!-- Slide Wrapper -->
  <main class="flex-1 flex items-center justify-center p-4 md:p-8">
    <div class="max-w-4xl w-full bg-white rounded-3xl border border-slate-200/60 shadow-xl p-8 md:p-12 min-h-[480px] flex flex-col justify-between relative overflow-hidden">
      
      <!-- Slide 1 -->
      <div class="slide-item block" id="slide-0">
        <div class="space-y-6">
          <div class="flex justify-between items-start">
            <span class="text-[10px] font-bold text-indigo-650 bg-indigo-50 px-2.5 py-1 rounded-md uppercase tracking-wider">OVERVIEW OF RESEARCH SYSTEM</span>
            <span class="text-xs font-mono text-slate-400">Slide 1 of 5</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">1. Climatological Project Title & Scope</h2>
          <div class="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Active Project Focus</h4>
            <h3 class="text-lg md:text-xl font-bold text-indigo-950">AI‑Driven Long‑Term Rainfall Projection over India: Regional Scaling on Kerala Monsoons</h3>
            <p class="text-slate-600 text-xs mt-3 leading-relaxed">
              This study develops a highly robust, deep learning-based meteorological projection framework to capture regional atmospheric dynamics over a 30-year future horizon. Monsoonal precipitation features chaotic, multi-scale physical feedback loops that cause standard linear statistical techniques or general circulation models to drift, especially near steep topographic features like the Western Ghats.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div class="p-4 bg-white border border-slate-100 rounded-xl">
              <h4 class="font-bold text-slate-800">Initial Scale Validation</h4>
              <p class="text-slate-500 mt-1">To maximize baseline model accuracy, the initial framework is trained and validated on high-density observational stations across Kerala (such as <strong>\${stationName}</strong>) before spreading to 34 meteorological sub-divisions.</p>
            </div>
            <div class="p-4 bg-white border border-slate-100 rounded-xl">
              <h4 class="font-bold text-slate-800">Multi-Sensor Data Ingestion</h4>
              <p class="text-slate-500 mt-1">By integrating CHIRPS satellite gridded datasets, IMD physical rain gauge stations, and ERA5 atmospheric moisture vectors, the neural network resolves complex, local multi-dimensional profiles.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide 2 -->
      <div class="slide-item hidden" id="slide-1">
        <div class="space-y-6">
          <div class="flex justify-between items-start">
            <span class="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-wider">PROJECT OBJECTIVES</span>
            <span class="text-xs font-mono text-slate-400">Slide 2 of 5</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">2. Scientific Research Goals & Core Objective</h2>
          <div class="bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl">
            <h4 class="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1">Core Technical Goal</h4>
            <h3 class="text-lg md:text-xl font-bold text-slate-900 leading-relaxed">To construct a hybrid deep learning model capable of high-fidelity 30-year precipitation projections that outperform standard CMIP6 scenario biases.</h3>
          </div>
          <div class="space-y-4">
            <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">Primary Scientific Inquiries:</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div class="p-4 bg-white border border-slate-100 rounded-xl">
                <span class="font-bold text-emerald-700 text-lg block mb-1">01</span>
                <span class="font-semibold text-slate-800 block mb-1">Non-Linear Dynamics Mapping</span>
                <p class="text-slate-500 leading-relaxed">How can Bidirectional LSTM network layers optimize memory retention curves to capture multi-decade cyclical rainfall patterns where standard models show sudden drift?</p>
              </div>
              <div class="p-4 bg-white border border-slate-100 rounded-xl">
                <span class="font-bold text-emerald-700 text-lg block mb-1">02</span>
                <span class="font-semibold text-slate-800 block mb-1">Topographic Precipitation Calibrations</span>
                <p class="text-slate-500 leading-relaxed">Can deep learning resolve local cloud convective cloudburst rates along windward foothill gradients in coastal zones like the Kerala plains?</p>
              </div>
              <div class="p-4 bg-white border border-slate-100 rounded-xl">
                <span class="font-bold text-emerald-700 text-lg block mb-1">03</span>
                <span class="font-semibold text-slate-800 block mb-1">Scenario Bias Diagnostics</span>
                <p class="text-slate-500 leading-relaxed">How do the AI model outputs agree or disagree with CMIP6 climate model projections (SSP1-2.6, ssp2-4.5, SSP5-8.5) over the focus timeline?</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide 3 -->
      <div class="slide-item hidden" id="slide-2">
        <div class="space-y-6">
          <div class="flex justify-between items-start">
            <span class="text-[10px] font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-md uppercase tracking-wider">THEORETICAL MODEL PIPELINE</span>
            <span class="text-xs font-mono text-slate-400">Slide 3 of 5</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight">3. Climatological Modeling Methodology</h2>
          <p class="text-slate-600 text-xs text-slate-550">The mathematical formulation integrates physical dynamics with deep sequential architectures in 4 progressive development cycles:</p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div class="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center space-y-1">
              <div class="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold mx-auto text-xs">1</div>
              <h5 class="font-bold text-slate-800">Observation Grids</h5>
              <p class="text-slate-500 text-[10px]">Ingesting 0.25° gridded IMD rainfall and high-res CHIRPS maps.</p>
            </div>
            <div class="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center space-y-1">
              <div class="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold mx-auto text-xs">2</div>
              <h5 class="font-bold text-slate-800">ERA5 Correlatives</h5>
              <p class="text-slate-500 text-[10px]">Extracting moisture divergence, wind vectors, and SST values.</p>
            </div>
            <div class="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center space-y-1">
              <div class="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold mx-auto text-xs">3</div>
              <h5 class="font-bold text-slate-800">Bi-LSTM Solving</h5>
              <p class="text-slate-500 text-[10px]">Recursive sequential training loop (1980-2010) and parameter tuning.</p>
            </div>
            <div class="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center space-y-1">
              <div class="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold mx-auto text-xs">4</div>
              <h5 class="font-bold text-slate-800">CMIP6 Validation</h5>
              <p class="text-slate-500 text-[10px]">Spatio-temporal comparison on future climate pathways.</p>
            </div>
          </div>
          <div class="bg-slate-950 text-slate-300 p-4 rounded-xl text-xs font-mono leading-relaxed">
            <strong>Theoretical Formula:</strong> Projecting Rainfall R_(t+n) = f(R_(t-lag), SST_t, convective_rate_t, moisture_divergence_t) where f represents the optimized weights of the Bidirectional-LSTM recurrent layers.
          </div>
        </div>
      </div>

      <!-- Slide 4 -->
      <div class="slide-item hidden" id="slide-3">
        <div class="space-y-6">
          <div class="flex justify-between items-start">
            <span class="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md uppercase tracking-wider">EXPECTED OUTCOMES</span>
            <span class="text-xs font-mono text-slate-400">Slide 4 of 5</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">4. Expected Project Deliverables & Key Outcomes</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div class="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-3">
              <h4 class="font-bold text-slate-850 text-sm">💡 Climate-Smart Actionable Insights</h4>
              <ul class="space-y-2 list-disc list-inside text-slate-600">
                <li>30-year high-resolution gridded rainfall maps for agricultural water management.</li>
                <li>Quantitative projection shifts in Southwest monsoon onset behaviors over southern India.</li>
                <li>Empirical estimates of climate change intensity impacts on extreme localized cloudbursts.</li>
              </ul>
            </div>
            <div class="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-3">
              <h4 class="font-bold text-slate-855 text-sm">📋 Tangible Software Assets</h4>
              <ul class="space-y-2 list-disc list-inside text-slate-600">
                <li>Fully tested Python/Google Colab notebooks with integrated imdlib arrays.</li>
                <li>Fitted Bidirectional-LSTM and stacked neural models weights.</li>
                <li>Statistical validation reports showing calibrated RMSE, MAE, and correlation diagnostics.</li>
              </ul>
            </div>
          </div>
          <div class="p-3 bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-xl text-xs">
            <strong>Key Benefit:</strong> Bridging the gap between macro-level climate simulation databases (CMIP6 grids) and localized agricultural observational scales to preserve water security.
          </div>
        </div>
      </div>

      <!-- Slide 5 -->
      <div class="slide-item hidden" id="slide-4">
        <div class="space-y-6">
          <div class="flex justify-between items-start">
            <span class="text-[10px] font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-md uppercase tracking-wider text-purple-800">MILESTONES & WORKFLOW GANTT</span>
            <span class="text-xs font-mono text-slate-400">Slide 5 of 5</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">5. Detailed 4‑Month Project Timeline</h2>
          <p class="text-slate-600 text-xs">A precise, structured 4-month meteorological workflow designed to achieve the highest model training accuracy and report deliverables:</p>
          <div class="overflow-x-auto border border-slate-100 rounded-xl bg-white text-xs">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                  <th class="py-3 px-4">Timeline</th>
                  <th class="py-3 px-4">Core Focus</th>
                  <th class="py-3 px-4">Concrete Milestone & Deadlines</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-600">
                <tr class="hover:bg-slate-50">
                  <td class="py-3 px-4 font-bold text-slate-900">Month 1</td>
                  <td class="py-3 px-4">Data Sourcing & Grid Aggregation</td>
                  <td class="py-3 px-4">Download IMD daily precipitation files and CHIRPS NetCDF arrays (1980–2025). Establish spatial coordinates extraction.</td>
                </tr>
                <tr class="hover:bg-slate-50">
                  <td class="py-3 px-4 font-bold text-slate-900">Month 2</td>
                  <td class="py-3 px-4">Feature Physics Engineering</td>
                  <td class="py-3 px-4">Ingest and scale hourly climate variables from ESA ECMWF (ERA5 models). Extract vertically integrated humidity vectors.</td>
                </tr>
                <tr class="hover:bg-slate-50">
                  <td class="py-3 px-4 font-bold text-slate-900">Month 3</td>
                  <td class="py-3 px-4">Model Construction & Training</td>
                  <td class="py-3 px-4">Build Bidirectional-LSTM layers. Execute supervised sliding sequence loops (Train: 1980–2010; Cross-validate: 0.15 split).</td>
                </tr>
                <tr class="hover:bg-slate-50">
                  <td class="py-3 px-4 font-bold text-slate-900">Month 4</td>
                  <td class="py-3 px-4">Scenario Comparison & Final Wrap</td>
                  <td class="py-3 px-4">Generate 30-year projections. Compare predictions to CMIP6 (SSP1/SSP2/SSP5). Package notebooks and evaluations.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Controls Row -->
      <div class="flex justify-between items-center pt-8 mt-8 border-t border-slate-100">
        <button id="prevBtn" class="flex items-center gap-1.5 text-xs font-bold py-2.5 px-5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50/80 active:scale-95 transition-all">
          ← Previous
        </button>
        <div class="flex items-center gap-1.5" id="dotsContainer"></div>
        <button id="nextBtn" class="flex items-center gap-1.5 text-xs font-bold py-2.5 px-5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition-all">
          Next →
        </button>
      </div>

    </div>
  </main>

  <footer class="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400">
    <p>Rainfall Projection Hub — Standalone Project Proposal Slide Deck. Saved on coordinates \${latStr}° N | \${lonStr}° E.</p>
  </footer>

  <script>
    let activeSlide = 0;
    const totalSlides = 5;

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('dotsContainer');

    // Create Navigation dots
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = \`h-2 rounded-full transition-all \${i === 0 ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}\`;
      dot.addEventListener('click', () => showSlide(i));
      dotsContainer.appendChild(dot);
    }

    function showSlide(idx) {
      if (idx < 0 || idx >= totalSlides) return;
      
      // Toggle slides
      document.querySelectorAll('.slide-item').forEach((item, index) => {
        if (index === idx) {
          item.classList.remove('hidden');
          item.classList.add('block');
        } else {
          item.classList.remove('block');
          item.classList.add('hidden');
        }
      });

      // Update dots
      Array.from(dotsContainer.children).forEach((dot, index) => {
        if (index === idx) {
          dot.className = 'h-2 rounded-full transition-all w-8 bg-indigo-600';
        } else {
          dot.className = 'h-2 rounded-full transition-all w-2 bg-slate-200';
        }
      });

      activeSlide = idx;
      prevBtn.disabled = (idx === 0);
      nextBtn.disabled = (idx === totalSlides - 1);
    }

    prevBtn.addEventListener('click', () => {
      showSlide(activeSlide - 1);
    });

    nextBtn.addEventListener('click', () => {
      showSlide(activeSlide + 1);
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        showSlide(activeSlide + 1);
      } else if (e.key === 'ArrowLeft') {
        showSlide(activeSlide - 1);
      }
    });

    // Initial load
    showSlide(0);
  </script>
</body>
</html>`;

    // Download behavior
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Project_Proposal_Presentation_" + selectedStation.name.replace(/\s+/g, "_") + ".html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 5 slides requested by the user
  const slides = [
    {
      id: "topic",
      title: "1. Climatological Project Title & Scope",
      icon: <Layers className="w-8 h-8 text-indigo-600" />,
      tag: "OVERVIEW OF RESEARCH SYSTEM",
      content: (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">
              Active Project Focus
            </h4>
            <h3 className="text-xl md:text-2xl font-bold text-indigo-950 tracking-tight leading-8">
              AI‑Driven Long‑Term Rainfall Projection over India: Regional Scaling on Kerala Monsoons
            </h3>
            <p className="text-slate-600 text-xs mt-3 leading-relaxed">
              This study develops a highly robust, deep learning-based meteorological projection framework to capture regional atmospheric dynamics over a 30-year future horizon. Monsoonal precipitation features chaotic, multi-scale physical feedback loops that cause standard linear statistical techniques or general circulation models to drift, especially near steep topographic features like the Western Ghats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 bg-white border border-slate-100 rounded-xl space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Initial scale validation
              </h4>
              <p className="text-slate-500 leading-relaxed">
                To maximize baseline model accuracy, the initial framework is trained and validated on high-density observational stations across Kerala (such as <strong>{selectedStation.name}</strong>) before spreading to 34 meteorological sub-divisions.
              </p>
            </div>

            <div className="p-5 bg-white border border-slate-100 rounded-xl space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-650" />
                Multi-Sensor Data Ingestion
              </h4>
              <p className="text-slate-500 leading-relaxed">
                By integrating CHIRPS satellite gridded datasets, IMD physical rain gauge stations, and ERA5 atmospheric moisture vectors, the neural network resolves complex, local multi-dimensional profiles.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "objective",
      title: "2. Scientific Research Goals & Core Objective",
      icon: <HelpCircle className="w-8 h-8 text-emerald-600" />,
      tag: "PROJECT OBJECTIVES",
      content: (
        <div className="space-y-6">
          <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1.5">
              Core Technical Goal
            </h4>
            <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-relaxed">
              To construct a hybrid deep learning model capable of high-fidelity 30-year precipitation projections that outperform standard CMIP6 scenario biases.
            </h3>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Primary Scientific Inquiries:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-white border border-slate-100 rounded-xl">
                <span className="font-bold text-emerald-700 text-lg block mb-1">01</span>
                <span className="font-semibold text-slate-850 block mb-1">Non-Linear Dynamics Mapping</span>
                <p className="text-slate-550 leading-relaxed">
                  How can Bidirectional LSTM network layers optimize memory retention curves to capture multi-decade cyclical rainfall patterns where standard models show sudden drift?
                </p>
              </div>

              <div className="p-4 bg-white border border-slate-100 rounded-xl">
                <span className="font-bold text-emerald-700 text-lg block mb-1">02</span>
                <span className="font-semibold text-slate-850 block mb-1">Topographic Precipitation Calibrations</span>
                <p className="text-slate-550 leading-relaxed">
                  Can deep learning resolve local cloud convective cloudburst rates along windward foothill gradients in coastal zones like the Kerala plains?
                </p>
              </div>

              <div className="p-4 bg-white border border-slate-100 rounded-xl">
                <span className="font-bold text-emerald-700 text-lg block mb-1">03</span>
                <span className="font-semibold text-slate-850 block mb-1">Scenario Bias Diagnostics</span>
                <p className="text-slate-550 leading-relaxed">
                  How do the AI model outputs agree or disagree with CMIP6 climate model projections (SSP1-2.6, ssp2-4.5, SSP5-8.5) over the focus timeline?
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "methodology",
      title: "3. Climatological Modeling Methodology",
      icon: <Cpu className="w-8 h-8 text-cyan-600" />,
      tag: "THEORETICAL MODEL PIPELINE",
      content: (
        <div className="space-y-6">
          <p className="text-slate-600 text-xs leading-relaxed">
            The mathematical formulation integrates physical dynamics with deep sequential architectures in 4 progressive development cycles:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold mx-auto text-xs">1</div>
              <h5 className="font-bold text-slate-800">Observation Grids</h5>
              <p className="text-slate-550 text-[10px] leading-relaxed">
                Ingesting 0.25° gridded IMD rainfall and high-resolution CHIRPS satellite maps (1980–2025).
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold mx-auto text-xs">2</div>
              <h5 className="font-bold text-slate-800">ERA5 Correlatives</h5>
              <p className="text-slate-550 text-[10px] leading-relaxed">
                Extracting moisture divergence, convective rate, wind vectors, and Sea Surface Temperature indices (SST).
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold mx-auto text-xs">3</div>
              <h5 className="font-bold text-slate-800">Bi-LSTM Solving</h5>
              <p className="text-slate-550 text-[10px] leading-relaxed">
                Recursive sequential training loop (1980–2010), cross-validation, and hyperparameter tuning optimizations.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold mx-auto text-xs">4</div>
              <h5 className="font-bold text-slate-800">CMIP6 Validation</h5>
              <p className="text-slate-550 text-[10px] leading-relaxed">
                Spatio-temporal comparison on future climate pathways to validate statistical consistency and bias offsets.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 text-slate-300 p-4 rounded-xl text-[11px] font-mono leading-relaxed">
            <strong>Theoretical Formula:</strong> Projecting Rainfall R_(t+n) = f(R_(t-lag), SST_t, convective_rate_t, moisture_divergence_t) where f represents the optimized weights of the Bidirectional-LSTM recurrent layers.
          </div>
        </div>
      )
    },
    {
      id: "outcomes",
      title: "4. Expected Project Deliverables & Key Outcomes",
      icon: <Award className="w-8 h-8 text-amber-600" />,
      tag: "EXPECTED OUTCOMES",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-3">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Climate-Smart Actionable Insights
              </h4>
              <ul className="space-y-2 list-disc list-inside text-slate-600 pl-1">
                <li>30-year high-resolution gridded rainfall maps for agricultural water management.</li>
                <li>Quantitative projection shifts in Southwest monsoon onset behaviors over southern India.</li>
                <li>Empirical estimates of climate change intensity impacts on extreme localized cloudbursts.</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-3">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                Tangible Software Assets
              </h4>
              <ul className="space-y-2 list-disc list-inside text-slate-600 pl-1">
                <li>Fully tested Python/Google Colab notebooks with integrated <code>imdlib</code> grids.</li>
                <li>Fitted Bidirectional-LSTM and stacked neural models weight files.</li>
                <li>Statistical validation reports showing calibrated RMSE, MAE, and correlation diagnostics.</li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-xl text-xs space-y-1">
            <strong>Key Benefit:</strong> Bridging the gap between macro-level climate simulation databases (CMIP6 grids) and localized agricultural observational scales to preserve water security.
          </div>
        </div>
      )
    },
    {
      id: "timeline",
      title: "5. Detailed 4‑Month Project Timeline",
      icon: <Calendar className="w-8 h-8 text-purple-600" />,
      tag: "MILESTONES & WORKFLOW GANTT",
      content: (
        <div className="space-y-6">
          <p className="text-slate-600 text-xs leading-relaxed">
            A precise, structured 4-month meteorological workflow designed to achieve the highest model training accuracy and report deliverables:
          </p>

          <div className="overflow-x-auto border border-slate-100 rounded-xl bg-white">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-5050 text-slate-500 font-bold">
                  <th className="py-3 px-4">Timeline</th>
                  <th className="py-3 px-4">Core Focus</th>
                  <th className="py-3 px-4">Concrete Milestone & Deadlines</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-650">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900">Month 1</td>
                  <td className="py-3 px-4">Data Sourcing & Grid Aggregation</td>
                  <td className="py-3 px-4 leading-relaxed">
                    Download IMD daily precipitation files and CHIRPS netCDF arrays (1980–2025). Establish spatial coordinates extraction for testing observatory (Kerala boundaries).
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900">Month 2</td>
                  <td className="py-3 px-4">Feature Physics Engineering</td>
                  <td className="py-3 px-4 leading-relaxed">
                    Ingest and scale hourly climate variables from ESA ECMWF (ERA5 models). Extract vertically integrated humidity vectors and convective rain rates.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900">Month 3</td>
                  <td className="py-3 px-4">Model Construction & Training</td>
                  <td className="py-3 px-4 leading-relaxed">
                    Build and compile Bidirectional-LSTM layers. Execute supervised sliding sequence loops (Train: 1980–2010; Cross-validate: 0.15 split). Run hyperparameter optimization to reduce validation losses.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900">Month 4</td>
                  <td className="py-3 px-4">Scenario Comparison & Final Wrap</td>
                  <td className="py-3 px-4 leading-relaxed">
                    Generate 30-year projections. Compare AI projections to CMIP6 climate scenarios (SSP1/SSP2/SSP5). Package source notebooks and publish evaluation reports.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    }
  ];

  return (
    <div id="proposal_presentation_deck" className="space-y-6">
      {/* Indicator progress bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Presentation className="w-5 h-5 text-indigo-600" />
          <span className="text-xs font-bold text-slate-800">PROJECT PROPOSAL PRESENTATION</span>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? "w-8 bg-indigo-600" : "w-2 bg-slate-250 bg-slate-200"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleDownloadPresentation}
            className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100/80 font-bold px-3.5 py-1.5 rounded-xl cursor-pointer transition-all shadow-2xs"
            title="Download Standalone Interactive Slide Deck (.html)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download HTML Presentation</span>
          </button>
        </div>
      </div>

      {/* Main Slide Card */}
      <div
        id={`proposal_slide_card_${slides[currentSlide].id}`}
        className="bg-white rounded-2xl border border-slate-200/60 p-6 md:p-8 min-h-[460px] shadow-xs flex flex-col justify-between"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <div className="flex items-center gap-3">
              <span className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 block">
                {slides[currentSlide].icon}
              </span>
              <div>
                <span className="text-[10px] font-bold text-indigo-650 bg-indigo-50 px-2.5 py-1 rounded-md uppercase tracking-wider block w-fit mb-1">
                  {slides[currentSlide].tag}
                </span>
                <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                  {slides[currentSlide].title}
                </h2>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Slide {currentSlide + 1} of {slides.length}
            </span>
          </div>

          <div>{slides[currentSlide].content}</div>
        </div>

        {/* Slide navigation controls */}
        <div className="flex justify-between items-center pt-6 mt-8 border-t border-slate-50">
          <button
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className={`flex items-center gap-1 text-xs font-bold py-2 px-4 rounded-xl border transition-all cursor-pointer ${
              currentSlide === 0
                ? "text-slate-300 border-slate-100 bg-slate-50 cursor-not-allowed"
                : "text-slate-750 text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous Slide
          </button>

          <button
            onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlide === slides.length - 1}
            className={`flex items-center gap-1 text-xs font-bold py-2 px-4 rounded-xl border transition-all cursor-pointer ${
              currentSlide === slides.length - 1
                ? "text-slate-300 border-slate-100 bg-slate-50 cursor-not-allowed"
                : "bg-indigo-650 bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 shadow-sm"
            }`}
          >
            Next Slide
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
