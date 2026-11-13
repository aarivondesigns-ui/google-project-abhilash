import React from 'react';
import { 
  Compass, Wallet, KeyRound, Tag, PlusCircle, 
  TrendingUp, Building2, Shield 
} from 'lucide-react';

export default function BottomNav({ role, activeTab, onTabChange, hasActiveBooking }) {
  const driverTabs = [
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'offers', label: 'Offers & Coupons', icon: Tag, badge: '10 Deals' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, badge: '₹850' },
    { id: 'bookings', label: 'My Bookings', icon: KeyRound, hasNotification: hasActiveBooking },
  ];

  const hostTabs = [
    { id: 'overview', label: 'Earnings', icon: TrendingUp },
    { id: 'list', label: 'List Space', icon: PlusCircle, badge: 'New' },
    { id: 'listings', label: 'My Spots', icon: Building2 },
    { id: 'logs', label: 'Gate Logs', icon: Shield },
  ];

  const tabs = role === 'host' ? hostTabs : driverTabs;
  const activeColor = role === 'host' ? 'text-neonGreen' : 'text-brandYellow';
  const pillColor = role === 'host' ? 'bg-neonGreen glow-green' : 'bg-brandYellow glow-yellow';

  return (
    <nav className="sticky bottom-0 bg-[#0B0D10]/90 backdrop-blur-xl border-t border-white/10 px-3 py-2 flex items-center justify-around z-40 max-w-md mx-auto w-full select-none shadow-2xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-2 rounded-2xl transition-all duration-200 relative ${
              isActive
                ? `${activeColor} bg-white/[0.04] font-extrabold shadow-sm`
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.02]'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                }`}
              />

              {/* Notification dot for active booking */}
              {tab.hasNotification && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping-slow" />
              )}

              {/* Badge */}
              {tab.badge && (
                <span
                  className={`absolute -top-1.5 -right-3 text-[7.5px] font-black px-1.5 py-0.2 rounded-full border shadow-sm ${
                    role === 'host'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-brandYellow/20 text-brandYellow border-brandYellow/30'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </div>

            <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
              {tab.label}
            </span>

            {/* Active Pill Indicator */}
            {isActive && (
              <span className={`w-5 h-0.5 rounded-full ${pillColor} mt-0.5`} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
