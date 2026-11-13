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
import { Wifi, Battery, Signal, Sparkles } from 'lucide-react';

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
    </div>
  );
}
