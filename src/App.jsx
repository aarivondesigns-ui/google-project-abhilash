import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ExploreTab from './components/ExploreTab';
import WalletTab from './components/WalletTab';
import OffersTab from './components/OffersTab';
import MyBookingsTab from './components/MyBookingsTab';
import HostDashboard from './components/HostDashboard';
import LoginModal from './components/LoginModal';
import SupportSettingsModal from './components/SupportSettingsModal';
import { INITIAL_SPOTS, INITIAL_ACTIVE_BOOKING } from './data/spots';
import { 
  fetchSpotsFromDB, fetchActiveBookingFromDB, 
  createSpotInDB, createBookingInDB 
} from './api/client';
import { Wifi, Battery, Signal, Sparkles, Compass, Zap, Shield, Home, Navigation, ArrowRight, Smartphone } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState('driver'); // 'driver' | 'host'
  const [driverActiveTab, setDriverActiveTab] = useState('explore'); // 'explore' | 'offers' | 'wallet' | 'bookings'
  const [hostActiveTab, setHostActiveTab] = useState('overview'); // 'overview' | 'list' | 'listings' | 'logs'
  const [spots, setSpots] = useState(INITIAL_SPOTS);
  const [activeBooking, setActiveBooking] = useState(INITIAL_ACTIVE_BOOKING);
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportInitialTab, setSupportInitialTab] = useState('settings');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('parknest-theme') || 'dark';
  });

  // Apply theme class to <html> document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('parknest-theme', next);
      showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`);
      return next;
    });
  };
  const [currentUser, setCurrentUser] = useState({
    id: 'driver-rohit',
    role: 'driver',
    name: 'Rohit Varma',
    phone: '+91 98490 88214',
    badge: 'VERIFIED DRIVER',
    vehicle: 'Hyundai Ioniq 5 EV (TS 09 EB 4421)',
    fastagId: 'NETC-ICICI-882190',
    walletBalance: 850,
    upiId: 'rohit.varma@okhdfcbank',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  });
  const [isDBConnected, setIsDBConnected] = useState(false);

  // Load real data from SQLite database on mount
  useEffect(() => {
    async function loadDataFromSQLite() {
      try {
        const dbSpots = await fetchSpotsFromDB();
        if (dbSpots && dbSpots.length > 0) {
          setSpots(dbSpots);
          setIsDBConnected(true);
        }
        const dbBooking = await fetchActiveBookingFromDB();
        if (dbBooking) {
          setActiveBooking(dbBooking);
        }
      } catch (err) {
        console.warn('Using local fallback:', err);
      }
    }
    loadDataFromSQLite();
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setRole(user.role);
    if (user.role === 'host') {
      setHostActiveTab('overview');
      showToast(`Welcome ${user.name}! Logged in as Property Host`);
    } else if (user.id === 'guard-bahadur') {
      setDriverActiveTab('bookings');
      showToast(`Welcome Bahadur Singh! DLF Gate 2 Boom Barrier Active`);
    } else {
      setDriverActiveTab('explore');
      showToast(`Welcome back, ${user.name}! Connected with ${user.vehicle}`);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleBookingSuccess = async (newBooking) => {
    try {
      await createBookingInDB(newBooking);
    } catch (e) {}
    setActiveBooking(newBooking);
    setDriverActiveTab('bookings');
    showToast(`🎉 Slot Reserved in SQLite! Gate OTP: ${newBooking.gateOTP}`);
  };

  const handleAddNewSpot = async (newSpot) => {
    try {
      const persisted = await createSpotInDB(newSpot);
      setSpots((prev) => [persisted || newSpot, ...prev]);
    } catch (e) {
      setSpots((prev) => [newSpot, ...prev]);
    }
    showToast(`📍 Your spot "${newSpot.name}" is saved in SQLite & live on map!`);
  };

  const handleUpdateBooking = (updatedBooking) => {
    setActiveBooking(updatedBooking);
  };

  const currentTab = role === 'host' ? hostActiveTab : driverActiveTab;
  const handleTabChange = (tabId) => {
    if (role === 'host') {
      setHostActiveTab(tabId);
    } else {
      setDriverActiveTab(tabId);
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] flex items-center justify-center p-0 sm:p-4 text-gray-100 font-sans relative selection:bg-brandYellow selection:text-black">
      {/* Background ambient lighting */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-brandYellow/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-neonGreen/5 rounded-full blur-3xl pointer-events-none" />

      {/* Desktop Feature Showcase - Left Column (Visible on lg/xl screens) */}
      <aside className="hidden lg:flex flex-col justify-center w-72 xl:w-80 mr-6 xl:mr-10 space-y-4 select-none z-10">
        {/* Brand Hero Card */}
        <div className="bg-white/90 dark:bg-[#151821]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-brandYellow to-yellow-500 text-black font-black flex items-center justify-center text-lg shadow-md glow-yellow">
              P
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900 dark:text-white leading-tight">
                ParkNest <span className="text-amber-600 dark:text-brandYellow">AI</span>
              </h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Hyderabad P2P Smart Parking & EV</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pt-1">
            Zero circular driving in tech corridors. Reserve private villa gates, office bays & fast EV chargers in seconds.
          </p>
        </div>

        {/* Driver Highlights */}
        <div className="bg-white/90 dark:bg-[#151821]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-3xl p-5 shadow-xl space-y-3.5">
          <div className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-brandYellow flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-brandYellow" />
            <span>Driver Platform Features</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-amber-500/10 border border-brandYellow/30 flex items-center justify-center flex-shrink-0 text-amber-600 dark:text-brandYellow font-bold">
                1
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Interactive Map Radar</h4>
                <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-snug">
                  Toggle between List view and live GPS radar pins around Hitec City & Gachibowli.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400 font-bold">
                2
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">⚡ EV Fast Charging Bays</h4>
                <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-snug">
                  Filter by 7.4kW AC or 30kW DC chargers with instant spot reservation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400 font-bold">
                3
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">DeepMind AI Predictor</h4>
                <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-snug">
                  Real-time vacancy confidence score (e.g., 94% availability) to beat rush-hour traffic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Mobile App Frame Container (max-width: 430px, rounded phone shell) */}
      <main className="w-full sm:max-w-[430px] h-screen sm:h-[880px] bg-[#0B0D10] sm:border-2 sm:border-cardBorder sm:rounded-[42px] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Mobile Status Bar Simulation */}
        <div className="bg-[#0B0D10] px-6 pt-3 pb-1.5 flex items-center justify-between text-xs text-gray-400 select-none z-50">
          <span className="font-semibold text-white text-[11px]">9:41</span>
          
          {/* Dynamic Island / Speaker Notch */}
          <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center px-2">
            <div className="w-2 h-2 rounded-full bg-[#1A1F2B] mr-2" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>

          <div className="flex items-center space-x-1.5 text-gray-300">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        {/* Sticky App Header */}
        <Header
          role={role}
          currentUser={currentUser}
          theme={theme}
          onToggleTheme={toggleTheme}
          onRoleChange={(newRole) => {
            setRole(newRole);
            if (newRole === 'host') {
              showToast('Switched to Host Partner Portal');
            } else {
              showToast('Switched to Driver Mode');
            }
          }}
          hasActiveBooking={!!activeBooking}
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenSupportSettings={(tab = 'settings') => {
            setSupportInitialTab(tab);
            setIsSupportOpen(true);
          }}
        />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="absolute top-16 left-4 right-4 z-50 bg-[#161920]/95 backdrop-blur-md border border-brandYellow text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Sparkles className="w-4 h-4 text-brandYellow flex-shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </div>
        )}

        {/* Tab Content Display */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {role === 'host' ? (
            <HostDashboard
              spots={spots}
              hostActiveTab={hostActiveTab}
              onHostTabChange={setHostActiveTab}
              onSwitchToDriverMode={() => setRole('driver')}
              onAddNewSpot={handleAddNewSpot}
            />
          ) : (
            <>
              {driverActiveTab === 'explore' && (
                <ExploreTab
                  spots={spots}
                  onBookSpot={handleBookingSuccess}
                />
              )}

              {driverActiveTab === 'offers' && (
                <OffersTab
                  spots={spots}
                  onSelectSpotToBook={(spotId) => {
                    setDriverActiveTab('explore');
                  }}
                  onSwitchToExplore={() => setDriverActiveTab('explore')}
                />
              )}

              {driverActiveTab === 'wallet' && <WalletTab />}

              {driverActiveTab === 'bookings' && (
                <MyBookingsTab
                  activeBooking={activeBooking}
                  onUpdateBooking={handleUpdateBooking}
                  onNavigateToExplore={() => setDriverActiveTab('explore')}
                  onOpenReportIssue={() => {
                    setSupportInitialTab('report');
                    setIsSupportOpen(true);
                  }}
                />
              )}
            </>
          )}
        </div>

        {/* Bottom Navigation Bar (Adapts strictly to active Role) */}
        <BottomNav
          role={role}
          activeTab={currentTab}
          onTabChange={handleTabChange}
          hasActiveBooking={role === 'driver' && !!activeBooking}
        />

        {/* Login & Demo Credentials Modal */}
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* 24x7 Support, Incident Reporting & App Settings Modal */}
        <SupportSettingsModal
          isOpen={isSupportOpen}
          initialTab={supportInitialTab}
          activeBooking={activeBooking}
          currentUser={currentUser}
          theme={theme}
          onToggleTheme={toggleTheme}
          onShowToast={showToast}
          onClose={() => setIsSupportOpen(false)}
        />
      </main>

      {/* Desktop Feature Showcase - Right Column (Visible on lg/xl screens) */}
      <aside className="hidden lg:flex flex-col justify-center w-72 xl:w-80 ml-6 xl:ml-10 space-y-4 select-none z-10">
        {/* Host Highlights */}
        <div className="bg-white/90 dark:bg-[#151821]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-3xl p-5 shadow-xl space-y-3.5">
          <div className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-neonGreen flex items-center gap-1.5">
            <Home className="w-4 h-4 text-emerald-500" />
            <span>Host Monetization Features</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400 font-bold">
                4
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Earn Passive Income</h4>
                <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-snug">
                  Monetize idle villa driveways, plots & commercial parking for ₹5,000–₹12,000/mo.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-amber-500/10 border border-brandYellow/30 flex items-center justify-center flex-shrink-0 text-amber-600 dark:text-brandYellow font-bold">
                5
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">🎯 1-Tap GPS Location Lock</h4>
                <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-snug">
                  Locks high-precision coordinates so incoming drivers navigate straight to your slot.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-400 font-bold">
                6
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">🛡️ Touchless Gate Passes</h4>
                <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-snug">
                  Auto OTP generation, boom barrier telemetry, and automatic overstay resolution.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Exploration Guide Card */}
        <div className="bg-gradient-to-br from-amber-500/10 via-white/90 to-yellow-500/10 dark:from-amber-500/10 dark:via-[#151821]/80 dark:to-yellow-500/5 border border-brandYellow/40 rounded-3xl p-4.5 shadow-xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">
              Try It in Phone Mockup
            </span>
          </div>
          <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-snug">
            Switch between <strong>[ 🚗 Driver | 🏠 Host ]</strong> in the top-right header to test live booking, wallet top-ups, and the 3-step host listing wizard.
          </p>
        </div>
      </aside>
    </div>
  );
}
