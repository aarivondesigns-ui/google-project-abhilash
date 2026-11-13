import React from 'react';
import { 
  Compass, Zap, Sparkles, Wallet, KeyRound, 
  Home, Crosshair, Shield, PlusCircle, TrendingUp,
  Search, Sliders, Smartphone, CheckCircle, ArrowRight
} from 'lucide-react';
import { MANUAL_ENTRIES } from '../data/appManualData';

export default function InteractiveFeatureIndex({ activeManualKey, onSelectManualKey, role, onToggleRole }) {
  const driverTopics = [
    { key: 'role-switcher', label: 'Role Switcher', icon: Smartphone },
    { key: 'search-bar', label: 'Search Bar', icon: Search },
    { key: 'filter-pills', label: 'EV & CCTV Filters', icon: Sliders },
    { key: 'view-toggle', label: 'Map / List Toggle', icon: Compass },
    { key: 'map-canvas', label: 'Interactive Radar Map', icon: Compass },
    { key: 'ai-predictor', label: 'DeepMind AI Predictor', icon: Sparkles },
    { key: 'reserve-button', label: 'Atomic Spot Reservation', icon: CheckCircle },
    { key: 'nav-wallet', label: 'In-App Wallet & UPI', icon: Wallet },
    { key: 'nav-bookings', label: 'Touchless Gate Passes', icon: KeyRound },
  ];

  const hostTopics = [
    { key: 'role-switcher', label: 'Role Switcher', icon: Smartphone },
    { key: 'host-earnings-card', label: 'Revenue & UPI Payouts', icon: TrendingUp },
    { key: 'host-gps-lock', label: '1-Tap GPS Location Lock', icon: Crosshair },
    { key: 'host-property-type', label: 'Property & Custom Other', icon: Home },
    { key: 'host-pricing-schedule', label: 'Pricing & Yield Calculator', icon: PlusCircle },
    { key: 'host-gate-logs', label: 'ANPR Gate Telemetry Logs', icon: Shield },
  ];

  const topics = role === 'host' ? hostTopics : driverTopics;

  return (
    <aside className="hidden lg:flex flex-col w-[300px] xl:w-[330px] ml-6 xl:ml-10 select-none z-10 space-y-3.5 my-auto">
      {/* Feature Index Header Card */}
      <div className="bg-white/95 dark:bg-[#12151D]/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-5 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Feature Manual Index
            </div>
            <h3 className="text-base font-black text-gray-900 dark:text-white leading-tight">
              {role === 'host' ? 'Host System Manual' : 'Driver System Manual'}
            </h3>
          </div>

          <button
            type="button"
            onClick={onToggleRole}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all active:scale-95 flex items-center gap-1 ${
              role === 'host'
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-neonGreen border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 text-amber-700 dark:text-brandYellow border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            <span>Switch to {role === 'host' ? 'Driver' : 'Host'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-snug">
          Click any component below to instantly pull up its user manual, purpose, and live walkthrough.
        </p>

        {/* Clickable Topics Grid */}
        <div className="grid grid-cols-1 gap-1.5 pt-1">
          {topics.map((topic) => {
            const Icon = topic.icon;
            const isSelected = activeManualKey === topic.key;

            return (
              <button
                key={topic.key}
                type="button"
                onClick={() => onSelectManualKey(topic.key)}
                onMouseEnter={() => onSelectManualKey(topic.key)}
                className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all duration-200 ${
                  isSelected
                    ? 'bg-amber-500/15 dark:bg-brandYellow/15 border-brandYellow text-gray-900 dark:text-white font-black shadow-sm ring-1 ring-brandYellow/40'
                    : 'bg-gray-50/70 dark:bg-white/[0.03] hover:bg-gray-100 dark:hover:bg-white/[0.06] border-gray-200 dark:border-white/5 text-gray-700 dark:text-gray-300 font-semibold'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isSelected 
                      ? 'bg-brandYellow text-black font-black' 
                      : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs truncate">{topic.label}</span>
                </div>

                <span className="text-[9.5px] font-mono text-gray-400">
                  {isSelected ? '● Active' : 'Inspect ➔'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
