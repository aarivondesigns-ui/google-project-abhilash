import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Power, ArrowUpRight, PlusCircle
} from 'lucide-react';
import HostSpaceTab from './HostSpaceTab';
import { fetchHostDataFromDB, withdrawHostPayoutFromDB } from '../api/client';

export default function HostDashboard({ spots, onSwitchToDriverMode, onAddNewSpot, hostActiveTab, onHostTabChange, onInspect, onManualClick }) {
  const [internalTab, setInternalTab] = useState('overview'); // 'overview' | 'list' | 'listings' | 'logs'
  const currentTab = hostActiveTab || internalTab;
  const setTab = onHostTabChange || setInternalTab;

  const [slotActive, setSlotActive] = useState(true);
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [pendingPayout, setPendingPayout] = useState(280);
  const [todayEarnings, setTodayEarnings] = useState(640);

  // Sync from SQLite DB on mount
  useEffect(() => {
    async function loadHostData() {
      try {
        const res = await fetchHostDataFromDB();
        if (res && res.profile) {
          setTodayEarnings(res.profile.todayEarnings || 640);
          setPendingPayout(res.profile.pendingPayout ?? 280);
        }
      } catch (e) {}
    }
    loadHostData();
  }, []);

  const handleInstantPayout = async () => {
    try {
      await withdrawHostPayoutFromDB();
      setPendingPayout(0);
    } catch (e) {}
    setPayoutSuccess(true);
    setTimeout(() => setPayoutSuccess(false), 3000);
  };

  // Host's personal listings
  const [hostSpots, setHostSpots] = useState([
    {
      id: 'h-1',
      name: 'Jubilee Hills Private Driveway (Road 36)',
      type: 'Home Villa Driveway',
      rate: 20,
      active: true,
      todayEarnings: 240,
      hasEV: false,
      gateOTP: '3104',
      address: 'Villa 14, Rd No. 36, Jubilee Hills',
    },
    {
      id: 'h-2',
      name: 'CyberGateway Reserved Office Bay',
      type: 'Office Basement Slot',
      rate: 40,
      active: true,
      todayEarnings: 400,
      hasEV: true,
      gateOTP: '7819',
      address: 'DLF Cybercity Level B1, Gachibowli',
    },
  ]);

  const toggleSpotActive = (id) => {
    setHostSpots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const handleSpotCreated = (newSpot) => {
    setHostSpots((prev) => [
      {
        id: newSpot.id,
        name: newSpot.name,
        type: newSpot.type,
        rate: newSpot.basePrice,
        active: true,
        todayEarnings: 0,
        hasEV: newSpot.hasEV,
        gateOTP: newSpot.gateAccessCode || '5521',
        address: newSpot.address,
      },
      ...prev,
    ]);
    if (onAddNewSpot) {
      onAddNewSpot(newSpot);
    }
    setTab('listings');
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-24 text-gray-200">
      {/* 1. OVERVIEW & EARNINGS TAB */}
      {currentTab === 'overview' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Host Revenue Card */}
          <div 
            className="bg-white dark:bg-gradient-to-br dark:from-[#161920] dark:via-[#10141D] dark:to-[#0B0D10] border border-gray-200 dark:border-cardBorder rounded-3xl p-5 shadow-2xl relative overflow-hidden host-revenue-card cursor-pointer"
            onMouseEnter={() => onInspect?.('host-earnings-card')}
            onClick={() => onManualClick?.('host-earnings-card')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-neonGreen">
                  Host Partner Portal
                </span>
              </div>
              <span className="text-[10px] bg-amber-500/15 text-amber-700 dark:text-brandYellow font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                2 Active Spots in Hyderabad
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Today's Earnings (Direct UPI)</div>
              <div className="text-3xl font-black text-gray-900 dark:text-white flex items-center">
                <span className="text-brandYellow mr-1 font-black">₹</span>
                <span className="text-gray-900 dark:text-white host-revenue-earnings">{todayEarnings}</span>
                <span className="text-xs font-bold text-emerald-700 dark:text-neonGreen bg-emerald-500/15 dark:bg-neonGreen/10 border border-emerald-500/30 px-2 py-0.5 rounded-lg ml-2">
                  +18% vs avg
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-cardBorder/70 text-xs">
              <div>
                <div className="text-gray-500 dark:text-gray-400 text-[10px]">Total Parkers Hosted</div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">4 Parkers Today</div>
              </div>
              <div>
                <div className="text-gray-500 dark:text-gray-400 text-[10px]">Pending Bank Payout</div>
                <div className="text-sm font-bold text-amber-600 dark:text-brandYellow">₹{pendingPayout.toFixed(2)}</div>
              </div>
            </div>

            <button
              disabled={pendingPayout <= 0}
              onClick={handleInstantPayout}
              className="mt-4 w-full py-2.5 bg-brandYellow hover:bg-brandYellow-hover text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all glow-yellow active:scale-95 disabled:opacity-50"
            >
              {payoutSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>Transferred to ananya.reddy@okaxis!</span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Withdraw ₹{pendingPayout.toFixed(2)} to PhonePe / UPI</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Driveway Status Toggle */}
          <div className="bg-[#161920] border border-cardBorder rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white">Driveway Master Switch</h3>
                <p className="text-[10px] text-gray-400">
                  Instantly hide all your slots if family returns home early
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSlotActive(!slotActive)}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                  slotActive ? 'bg-neonGreen' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    slotActive ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                slotActive
                  ? 'bg-neonGreen/10 border-neonGreen/30 text-emerald-300'
                  : 'bg-[#0B0D10] border-cardBorder text-gray-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Power className="w-3.5 h-3.5" />
                <span className="text-[11px]">
                  {slotActive ? 'LIVE: Slots accepting driver bookings' : 'PAUSED: All spots hidden from map'}
                </span>
              </div>
              <span className="text-[10px] font-bold">
                {slotActive ? '2 Spots Live' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. LIST SPACE TAB (Inside Host Mode!) */}
      {currentTab === 'list' && (
        <div className="animate-in fade-in duration-150">
          <HostSpaceTab 
            onAddNewSpot={handleSpotCreated} 
            onInspect={onInspect}
            onManualClick={onManualClick}
          />
        </div>
      )}

      {/* 3. MY SPOTS TAB */}
      {currentTab === 'listings' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              My Listed Spots in Hyderabad ({hostSpots.length})
            </h3>
            <button
              onClick={() => setTab('list')}
              className="text-xs font-bold text-neonGreen hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" /> + Add Spot
            </button>
          </div>

          <div className="space-y-2.5">
            {hostSpots.map((spot) => (
              <div
                key={spot.id}
                className="bg-[#161920] border border-cardBorder rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-brandYellow uppercase">
                      {spot.type}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{spot.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">{spot.address}</p>
                  </div>

                  {/* Spot Active Toggle */}
                  <button
                    onClick={() => toggleSpotActive(spot.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${
                      spot.active
                        ? 'bg-neonGreen/20 text-neonGreen border-neonGreen/40'
                        : 'bg-gray-800 text-gray-400 border-gray-700'
                    }`}
                  >
                    {spot.active ? '● LIVE' : '○ PAUSED'}
                  </button>
                </div>

                <div className="pt-2 border-t border-cardBorder/70 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-400 text-[10px]">Hourly Rate: </span>
                    <span className="font-extrabold text-white">₹{spot.rate}/hr</span>
                    {spot.hasEV && (
                      <span className="text-neonGreen text-[10px] font-bold ml-1.5">⚡ EV Ready</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px]">Gate OTP: </span>
                    <span className="font-mono font-bold text-brandYellow">{spot.gateOTP}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. GATE TELEMETRY LOGS */}
      {currentTab === 'logs' && (
        <div 
          className="space-y-3 animate-in fade-in duration-150"
          onMouseEnter={() => onInspect?.('host-gate-logs')}
          onClick={() => onManualClick?.('host-gate-logs')}
        >
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Live Gate Sensor & OTP Check-ins
            </h3>
            <span className="text-[10px] text-gray-400">Auto-synced</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-[#0B0D10] border border-cardBorder flex items-center justify-between">
              <div>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-neonGreen animate-pulse"></span>
                  <span>Hyundai Ioniq 5 (TS09-EB-4421)</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">
                  Gate OTP: <span className="font-mono text-brandYellow">3104</span> • Parked at 11:15 AM
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-400">+₹80</span>
                <div className="text-[9px] text-gray-500">2h active</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#0B0D10] border border-cardBorder flex items-center justify-between opacity-80">
              <div>
                <div className="font-bold text-gray-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                  <span>Tata Nexon EV (TS07-FA-8890)</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">
                  Checked out • 3h session • EV charged 14 kWh
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-white">+₹150</span>
                <div className="text-[9px] text-gray-500">Completed</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Switch back button */}
      <div className="pt-2">
        <button
          onClick={onSwitchToDriverMode}
          className="w-full py-3 bg-[#0B0D10] border border-cardBorder hover:border-gray-500 rounded-xl text-xs font-bold text-gray-300 hover:text-white flex items-center justify-center gap-2 transition-all"
        >
          <span>Return to Driver Search Mode</span>
        </button>
      </div>
    </div>
  );
}
