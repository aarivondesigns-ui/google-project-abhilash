import React from 'react';
import { User, Car, Store, MapPin, UserCheck, Sun, Moon, Settings } from 'lucide-react';

export default function Header({ 
  role, 
  onRoleChange, 
  hasActiveBooking, 
  onOpenLogin, 
  currentUser,
  theme = 'dark',
  onToggleTheme,
  onOpenSupportSettings
}) {
  return (
    <header className="sticky top-0 bg-[#0B0D10]/95 backdrop-blur-md border-b border-cardBorder px-3 py-2 flex items-center justify-between z-40 select-none">
      {/* Brand Logo & Hyderabad Tag */}
      <div className="flex items-center space-x-2 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brandYellow to-amber-500 text-black flex items-center justify-center font-black text-sm shadow-md glow-yellow flex-shrink-0">
          P
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-white text-sm tracking-tight leading-none">
              Park<span className="text-brandYellow">Nest</span>
            </span>
            <span className="text-[9px] bg-brandYellow/15 text-brandYellow font-extrabold px-1.5 py-0.2 rounded border border-brandYellow/30">
              AI
            </span>
          </div>
          <div className="flex items-center text-[10px] text-gray-400 font-medium">
            <MapPin className="w-2.5 h-2.5 text-brandYellow mr-0.5" />
            <span>Hyderabad</span>
            <span className="mx-1 text-gray-600">•</span>
            <span className="text-neonGreen flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neonGreen animate-pulse"></span>
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls: [Role Switcher] -> [Profile] -> [Theme] -> [Settings (LAST)] */}
      <div className="flex items-center gap-1.5">
        {/* 1. Primary Role Switcher: Driver | Host */}
        <div className="flex items-center bg-[#161920] border border-cardBorder p-0.5 rounded-xl shadow-inner text-xs">
          <button
            onClick={() => onRoleChange('driver')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg font-bold transition-all ${
              role === 'driver'
                ? 'bg-brandYellow text-black shadow-md glow-yellow'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Switch to Driver Portal"
          >
            <Car className="w-3 h-3" />
            <span className="text-[10px]">Driver</span>
          </button>

          <button
            onClick={() => onRoleChange('host')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg font-bold transition-all ${
              role === 'host'
                ? 'bg-neonGreen text-black shadow-md glow-green'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Switch to Host Partner Portal"
          >
            <Store className="w-3 h-3" />
            <span className="text-[10px]">Host</span>
          </button>
        </div>

        {/* 2. User Profile / Account Switcher */}
        <button
          onClick={onOpenLogin}
          className="relative w-7 h-7 rounded-xl bg-[#161920] border border-cardBorder hover:border-brandYellow text-gray-200 transition-all flex items-center justify-center flex-shrink-0 shadow-sm active:scale-95 group overflow-hidden"
          title={`Signed in as ${currentUser?.name || 'User'} (Tap to switch account)`}
        >
          {currentUser?.photo ? (
            <img
              src={currentUser.photo}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserCheck className="w-3.5 h-3.5 text-brandYellow" />
          )}
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-neonGreen border border-[#0B0D10]" />
        </button>

        {/* 3. Theme Quick Switcher (Light / Dark) */}
        <button
          onClick={onToggleTheme}
          className="w-7 h-7 rounded-xl bg-[#161920] border border-cardBorder hover:border-brandYellow text-gray-200 hover:text-white transition-all flex items-center justify-center text-xs shadow-sm active:scale-95 flex-shrink-0"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? (
            <Moon className="w-3.5 h-3.5 text-amber-500" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-brandYellow" />
          )}
        </button>

        {/* 4. Settings & Support Hub — ALWAYS AT THE VERY LAST */}
        <button
          onClick={onOpenSupportSettings}
          className="w-7 h-7 rounded-xl bg-[#161920] border border-cardBorder hover:border-brandYellow text-gray-300 hover:text-white transition-all flex items-center justify-center text-xs shadow-sm active:scale-95 flex-shrink-0"
          title="App Settings, 24x7 Help Desk & Report Issue"
        >
          <Settings className="w-3.5 h-3.5 hover:rotate-45 transition-transform duration-200" />
        </button>
      </div>
    </header>
  );
}