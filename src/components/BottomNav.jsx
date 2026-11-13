import React from 'react';
import { 
  Compass, Wallet, KeyRound, Tag, PlusCircle, 
  TrendingUp, Building2, Shield 
} from 'lucide-react';

export default function BottomNav({ role, activeTab, onTabChange, hasActiveBooking, onInspect, onManualClick }) {
  const driverTabs = [
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'offers', label: 'Offers', icon: Tag, badge: '10' },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'bookings', label: 'Bookings', icon: KeyRound, hasNotification: hasActiveBooking },
  ];

  const hostTabs = [
    { id: 'overview', label: 'Earnings', icon: TrendingUp },
    { id: 'list', label: 'List Space', icon: PlusCircle, badge: 'NEW' },
    { id: 'listings', label: 'My Spots', icon: Building2 },
    { id: 'logs', label: 'Gate Logs', icon: Shield },
  ];

  const manualKeyMap = {
    explore: 'nav-explore',
    offers: 'nav-offers',
    wallet: 'nav-wallet',
    bookings: 'nav-bookings',
    overview: 'host-earnings-card',
    list: 'host-property-type',
    listings: 'host-property-type',
    logs: 'host-gate-logs',
  };

  const tabs = role === 'host' ? hostTabs : driverTabs;
  const activeColor = role === 'host' ? 'text-emerald-600 dark:text-neonGreen' : 'text-amber-600 dark:text-brandYellow';
  const pillColor = role === 'host' ? 'bg-emerald-500 dark:bg-neonGreen glow-green' : 'bg-amber-500 dark:bg-brandYellow glow-yellow';

  return (
    <nav className="sticky bottom-0 bg-white/95 dark:bg-[#0B0D10]/95 backdrop-blur-md border-t border-gray-200 dark:border-cardBorder px-2 py-1.5 flex items-center justify-around z-40 max-w-md mx-auto w-full transition-colors">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const manualKey = manualKeyMap[tab.id];

        return (
          <button
            key={tab.id}
            onClick={() => {
              onTabChange(tab.id);
              onManualClick?.(manualKey);
            }}
            onMouseEnter={() => onInspect?.(manualKey)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all relative group ${
              isActive
                ? `${activeColor} font-black`
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8] group-hover:scale-105'
                }`}
              />

              {/* Notification dot for active booking pass */}
              {tab.hasNotification && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white dark:border-[#0B0D10]"></span>
                </span>
              )}

              {/* High-visibility clean micro-badge */}
              {tab.badge && (
                <span
                  className={`absolute -top-1.5 -right-3.5 px-1.5 min-w-[16px] h-3.5 text-[8.5px] font-black rounded-full flex items-center justify-center shadow-md whitespace-nowrap leading-none border transition-all ${
                    role === 'host'
                      ? 'bg-emerald-500 text-black border-emerald-400'
                      : 'bg-gradient-to-r from-amber-400 to-yellow-400 text-black border-yellow-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </div>

            <span className={`text-[10px] mt-1 tracking-tight transition-colors ${isActive ? 'font-black' : 'font-semibold'}`}>
              {tab.label}
            </span>

            {/* Active Pill Indicator */}
            {isActive && (
              <span className={`w-4 h-0.5 rounded-full ${pillColor} mt-0.5 transition-all`} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
