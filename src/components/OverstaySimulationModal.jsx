import React, { useState, useEffect } from 'react';
import { 
  X, AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight, 
  RotateCcw, DollarSign, Navigation, PhoneCall, Bell, RefreshCw, Zap
} from 'lucide-react';

export default function OverstaySimulationModal({ booking, onClose, onResolveConflict }) {
  const [activeView, setActiveView] = useState('split'); // 'split' | 'driver1' | 'driver2'
  const [simulationStep, setSimulationStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(1);

    // Sequence through the resolution steps
    setTimeout(() => setSimulationStep(2), 1200);
    setTimeout(() => setSimulationStep(3), 2500);
    setTimeout(() => {
      setSimulationStep(4);
      setIsSimulating(false);
    }, 3800);
  };

  useEffect(() => {
    startSimulation();
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-[#161920] border-2 border-demandRed/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Header with Judge Badge */}
        <div className="bg-gradient-to-r from-demandRed/20 via-[#161920] to-demandRed/10 border-b border-demandRed/30 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-demandRed/20 text-demandRed flex items-center justify-center font-black animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-demandRed tracking-wider uppercase">
                  Hackathon AI Conflict Engine
                </span>
                <span className="bg-demandRed/20 text-demandRed text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-demandRed/30">
                  LIVE DEMO
                </span>
              </div>
              <h2 className="text-sm font-extrabold text-white">
                Autonomous Overstay & Conflict Resolution
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#262A34] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Perspective Switcher Tabs */}
        <div className="bg-[#0B0D10] border-b border-cardBorder px-4 py-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-gray-400">View Simulation Angle:</span>
          <div className="flex bg-[#161920] p-1 rounded-xl border border-cardBorder space-x-1 text-xs">
            <button
              onClick={() => setActiveView('split')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activeView === 'split' ? 'bg-brandYellow text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              Dual Perspective
            </button>
            <button
              onClick={() => setActiveView('driver1')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activeView === 'driver1' ? 'bg-demandRed text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Driver 1 (Violator)
            </button>
            <button
              onClick={() => setActiveView('driver2')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activeView === 'driver2' ? 'bg-neonGreen text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              Next Driver (Order #2)
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Timeline Process Status */}
          <div className="bg-[#0B0D10] border border-cardBorder rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 font-semibold flex items-center gap-1.5">
                <RefreshCw className={`w-3.5 h-3.5 text-brandYellow ${isSimulating ? 'animate-spin' : ''}`} />
                AI Arbitration Protocol State
              </span>
              <span className="text-[11px] font-bold text-brandYellow">
                {simulationStep < 4 ? `Executing Step ${simulationStep}/4...` : 'Resolution Fully Executed'}
              </span>
            </div>

            <div className="w-full bg-[#1C212D] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-demandRed via-brandYellow to-neonGreen h-full transition-all duration-500"
                style={{ width: `${(simulationStep / 4) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-4 text-[10px] text-gray-400 text-center pt-1 font-medium">
              <span className={simulationStep >= 1 ? 'text-demandRed font-bold' : ''}>1. Detect Breach</span>
              <span className={simulationStep >= 2 ? 'text-demandRed font-bold' : ''}>2. Fine Driver 1</span>
              <span className={simulationStep >= 3 ? 'text-brandYellow font-bold' : ''}>3. Refund Driver 2</span>
              <span className={simulationStep >= 4 ? 'text-neonGreen font-bold' : ''}>4. Auto-Reroute</span>
            </div>
          </div>

          {/* Perspective Views */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* 1. Driver 1 View (Violator) */}
            {(activeView === 'split' || activeView === 'driver1') && (
              <div className="bg-[#0B0D10] border border-demandRed/50 rounded-2xl p-4 flex flex-col justify-between space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-demandRed text-white text-[9px] font-black px-2 py-0.5 rounded-bl-xl uppercase tracking-wider">
                  Driver 1 Overstay
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-demandRed mb-1">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-xs font-extrabold uppercase">Driver 1 Mobile Screen</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {booking.slotNumber} • DLF Basement
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Slot expired at 1:30 PM. Current dwell: +24 mins overstay.
                  </p>
                </div>

                {/* Overstay Penalty Card */}
                <div className="bg-demandRed/10 border border-demandRed/40 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-demandRed font-bold flex items-center gap-1">
                      <Bell className="w-3.5 h-3.5 animate-bounce" /> Push Alert Sent
                    </span>
                    <span className="text-[10px] text-gray-400">UPI AutoPay</span>
                  </div>

                  <div className="text-xs text-gray-200">
                    <div className="font-semibold text-demandRed">
                      Overstay Penalty Auto-Applied:
                    </div>
                    <ul className="text-[11px] text-gray-300 space-y-1 mt-1 pl-1">
                      <li>• Inconvenience Fine: <strong className="text-white">+₹100</strong></li>
                      <li>• 1.5x Hourly Surge: <strong className="text-white">₹45/hr</strong></li>
                      <li>• Security gate boom barrier blocked until exit scan.</li>
                    </ul>
                  </div>

                  <div className="pt-1.5 border-t border-demandRed/20 flex justify-between items-center text-xs">
                    <span className="text-gray-400">Auto-Debited Total:</span>
                    <span className="text-sm font-black text-demandRed">₹145.00</span>
                  </div>
                </div>

                <div className="text-[10px] text-gray-400 italic">
                  Note: Driver 1's ParkNest trust score dropped from 4.9 → 4.5.
                </div>
              </div>
            )}

            {/* 2. Driver 2 View (Incoming Order #2) */}
            {(activeView === 'split' || activeView === 'driver2') && (
              <div className="bg-[#0B0D10] border border-neonGreen/50 rounded-2xl p-4 flex flex-col justify-between space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-neonGreen text-black text-[9px] font-black px-2 py-0.5 rounded-bl-xl uppercase tracking-wider">
                  Order #2 Autonomous Savior
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-neonGreen mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-extrabold uppercase">Next Driver Mobile Screen</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    Proactive Conflict Avoidance
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    ParkNest AI detected delay BEFORE Driver 2 arrived at the gate! Zero confrontation.
                  </p>
                </div>

                {/* Instant Compensation & Backup Spot */}
                <div className="bg-neonGreen/10 border border-neonGreen/40 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neonGreen font-bold flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" /> Instant Refund + Credit
                    </span>
                    <span className="text-[10px] bg-neonGreen/20 text-neonGreen px-1.5 py-0.2 rounded font-bold">
                      PROCESSED
                    </span>
                  </div>

                  <div className="text-[11px] text-gray-300 space-y-1">
                    <div className="flex justify-between">
                      <span>Original Order #2 Amount:</span>
                      <span className="text-white font-bold">₹90.00 Refunded</span>
                    </div>
                    <div className="flex justify-between text-neonGreen font-semibold">
                      <span>Apology Inconvenience Credit:</span>
                      <span>+₹50.00 to Wallet</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neonGreen/20">
                    <div className="text-[11px] font-bold text-white flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 text-brandYellow" />
                      Auto-Rerouted to Backup Spot:
                    </div>
                    <div className="mt-1 bg-black/40 p-2 rounded-lg border border-gray-700 text-xs">
                      <div className="font-bold text-brandYellow">
                        Gachibowli CyberTower Slot A14
                      </div>
                      <div className="text-[10px] text-gray-300">
                        200m away (1 min) • 85% AI Probability • Gate OTP: 9142
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-emerald-400 font-medium">
                  ✓ Driver 2 avoids parking frustration; seamless autonomous experience!
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#161920] border-t border-cardBorder p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={startSimulation}
            disabled={isSimulating}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-cardBorder bg-[#0B0D10] hover:bg-[#262A34] text-xs font-bold text-gray-200 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Simulation</span>
          </button>

          <button
            onClick={() => {
              onResolveConflict();
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-neonGreen hover:bg-neonGreen-hover text-black font-extrabold text-xs flex items-center justify-center gap-2 glow-green transition-all active:scale-95"
          >
            <span>Acknowledge & Return to Booking Pass</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
