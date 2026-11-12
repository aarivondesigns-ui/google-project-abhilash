import React, { useState } from 'react';
import { 
  Cpu, Sparkles, TrendingUp, Clock, Zap, ShieldCheck, 
  BarChart3, RefreshCw, Eye, Calendar, Layers, Activity 
} from 'lucide-react';
import { AI_BRAIN_FACTORS } from '../data/spots';

export default function AIBrainTab() {
  const [dynamicPricing, setDynamicPricing] = useState(true);
  const [simulatedHour, setSimulatedHour] = useState('6:00 PM (Evening Peak)');

  const hourScenarios = {
    '10:00 AM (Morning Rush)': {
      gachibowliRate: '₹35/hr',
      financialRate: '₹75/hr',
      inorbitRate: '₹45/hr',
      jubileeRate: '₹20/hr',
      demandTag: 'High Office Demand',
    },
    '2:30 PM (Midday Lull)': {
      gachibowliRate: '₹25/hr',
      financialRate: '₹50/hr',
      inorbitRate: '₹55/hr',
      jubileeRate: '₹18/hr',
      demandTag: 'Mall & Retail Peak',
    },
    '6:00 PM (Evening Peak)': {
      gachibowliRate: '₹30/hr',
      financialRate: '₹85/hr (Surge 1.4x)',
      inorbitRate: '₹65/hr',
      jubileeRate: '₹25/hr',
      demandTag: 'Cyberabad Rush Hour',
    },
    '11:00 PM (Night Low)': {
      gachibowliRate: '₹20/hr',
      financialRate: '₹35/hr',
      inorbitRate: '₹30/hr',
      jubileeRate: '₹15/hr',
      demandTag: 'Low Traffic Overnight',
    },
  };

  const currentScenario = hourScenarios[simulatedHour];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-24 text-gray-200">
      {/* AI Brain Header Hero */}
      <div className="bg-gradient-to-br from-[#161920] via-[#10141D] to-[#0B0D10] border border-cardBorder rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-brandYellow/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-neonGreen/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold tracking-widest text-brandYellow uppercase bg-brandYellow/15 px-2 py-0.5 rounded-full border border-brandYellow/30 flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-brandYellow" />
              <span>Software-Only AI Engine</span>
            </span>
            <span className="flex items-center gap-1 text-[10px] text-neonGreen font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-neonGreen animate-ping"></span>
              98.4% Accuracy
            </span>
          </div>

          <h2 className="text-lg font-black text-white">
            Predictive Availability Without IoT Sensors
          </h2>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Eliminates costly ₹50,000 physical ground ultrasonic sensors by synthesizing host Google calendars, boom barrier telemetry logs, and Hyderabad traffic flow.
          </p>

          {/* Impact Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-cardBorder/60">
            <div className="bg-[#0B0D10]/80 p-2.5 rounded-xl border border-cardBorder text-center">
              <div className="text-base font-black text-brandYellow">30%</div>
              <div className="text-[9px] text-gray-400 font-medium">Faster Parking Search</div>
            </div>
            <div className="bg-[#0B0D10]/80 p-2.5 rounded-xl border border-cardBorder text-center">
              <div className="text-base font-black text-neonGreen">25%</div>
              <div className="text-[9px] text-gray-400 font-medium">Less Time on Road</div>
            </div>
            <div className="bg-[#0B0D10]/80 p-2.5 rounded-xl border border-cardBorder text-center">
              <div className="text-base font-black text-white">180 kg</div>
              <div className="text-[9px] text-gray-400 font-medium">CO2 Saved Cyberabad</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Pricing Interactive Engine */}
      <div className="bg-[#161920] border border-cardBorder rounded-2xl p-4 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-brandYellow/15 text-brandYellow flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Dynamic Pricing Engine</span>
                <span className="text-[9px] bg-brandYellow/20 text-brandYellow px-1.5 py-0.2 rounded font-bold">
                  {dynamicPricing ? 'AI ACTIVE' : 'FIXED RATES'}
                </span>
              </div>
              <div className="text-[10px] text-gray-400">
                Adjusts spot rates automatically by real-time demand surge
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDynamicPricing(!dynamicPricing)}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
              dynamicPricing ? 'bg-brandYellow' : 'bg-gray-700'
            }`}
          >
            <div
              className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                dynamicPricing ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {dynamicPricing && (
          <div className="pt-2 border-t border-cardBorder space-y-2">
            <div className="text-[11px] font-semibold text-gray-300 flex items-center justify-between">
              <span>Simulate Hyderabad Rush Hour:</span>
              <span className="text-brandYellow font-mono text-[10px]">{currentScenario.demandTag}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {Object.keys(hourScenarios).map((timeStr) => (
                <button
                  key={timeStr}
                  onClick={() => setSimulatedHour(timeStr)}
                  className={`p-2 rounded-xl text-left border text-[11px] font-medium transition-all ${
                    simulatedHour === timeStr
                      ? 'bg-brandYellow/15 border-brandYellow text-brandYellow font-bold'
                      : 'bg-[#0B0D10] border-cardBorder text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {timeStr}
                </button>
              ))}
            </div>

            {/* Dynamic Rates for Key Hyderabad Hubs */}
            <div className="bg-[#0B0D10] p-3 rounded-xl border border-cardBorder text-xs space-y-1.5">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Current Algorithmic Hourly Rates
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">WaveRock Financial District:</span>
                <span className="text-demandRed font-bold">{currentScenario.financialRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Inorbit Mall Commercial Lot:</span>
                <span className="text-brandYellow font-bold">{currentScenario.inorbitRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Gachibowli Office Basement:</span>
                <span className="text-neonGreen font-bold">{currentScenario.gachibowliRate}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Probability Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-neonGreen" />
            <span>Hyderabad Live Probability Radar</span>
          </h3>
          <span className="text-[10px] text-gray-400">Updated 10s ago</span>
        </div>

        {AI_BRAIN_FACTORS.map((factor) => (
          <div
            key={factor.title}
            className="bg-[#161920] border border-cardBorder hover:border-gray-600 rounded-2xl p-3.5 space-y-2.5 transition-all shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">{factor.title}</h4>
                <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{factor.driversDwell}</span> • <span>{factor.trend}</span>
                </div>
              </div>

              {/* Big Probability Badge */}
              <div
                className="flex flex-col items-end px-3 py-1 rounded-xl border"
                style={{
                  backgroundColor: `${factor.color}15`,
                  borderColor: `${factor.color}40`,
                }}
              >
                <div className="text-base font-black" style={{ color: factor.color }}>
                  {factor.probability}%
                </div>
                <div className="text-[8px] uppercase tracking-wider font-bold text-gray-400">
                  Vacancy Chance
                </div>
              </div>
            </div>

            {/* Probability Progress Bar */}
            <div className="w-full bg-[#0B0D10] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${factor.probability}%`,
                  backgroundColor: factor.color,
                }}
              />
            </div>

            <p className="text-[11px] text-gray-300 bg-[#0B0D10] p-2 rounded-xl border border-cardBorder/70 leading-relaxed">
              <strong className="text-gray-400 font-semibold">AI Signal:</strong> {factor.signal}
            </p>
          </div>
        ))}
      </div>

      {/* How It Works (Without IoT) Accordion / Guide */}
      <div className="bg-[#161920] border border-cardBorder rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-brandYellow" />
          <span>How ParkNest Eliminates ₹50,000 IoT Sensors</span>
        </h3>

        <div className="space-y-2.5 text-[11px] text-gray-300">
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-lg bg-brandYellow/15 text-brandYellow text-center font-bold flex-shrink-0 mt-0.5">
              1
            </span>
            <div>
              <strong className="text-white">Host Work Calendar Sync:</strong> Residential driveway hosts connect Google Calendar / Office shift timings. Slots auto-open when hosts leave for Hitec City or Gachibowli.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-lg bg-brandYellow/15 text-brandYellow text-center font-bold flex-shrink-0 mt-0.5">
              2
            </span>
            <div>
              <strong className="text-white">Gate ANPR Telemetry:</strong> Integrates with existing apartment & tech park boom barriers to record entry and exit timestamps with zero new hardware.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-lg bg-brandYellow/15 text-brandYellow text-center font-bold flex-shrink-0 mt-0.5">
              3
            </span>
            <div>
              <strong className="text-white">Aggregated Traffic & Dwell Curves:</strong> Machine learning models trained on 100,000+ Hyderabad commute patterns predict spot turnover 25 minutes before physical clearance.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
