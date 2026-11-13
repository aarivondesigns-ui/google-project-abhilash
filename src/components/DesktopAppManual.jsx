import React, { useState } from 'react';
import { 
  Compass, Zap, Sparkles, Wallet, KeyRound, 
  Home, Crosshair, Shield, PlusCircle, TrendingUp,
  ChevronDown, Play, BookOpen, CheckCircle2, 
  Layers, Cpu, Smartphone
} from 'lucide-react';

export default function DesktopAppManual({ role, onNavigate, side }) {
  // side: 'left' (Driver Manual) | 'right' (Host Manual)
  const [expandedId, setExpandedId] = useState(side === 'left' ? 'driver-map' : 'host-monetize');
  const [hoveredId, setHoveredId] = useState(null);

  const driverFeatures = [
    {
      id: 'driver-map',
      title: 'Interactive Map Radar & Pins',
      category: 'Geospatial Discovery',
      badge: 'Live Radar',
      color: 'amber',
      icon: Compass,
      quickSummary: 'Real-time GPS map pins with walking routes around Hitec City & Gachibowli.',
      details: {
        whatItDoes: 'Displays available parking bays on an interactive Leaflet radar map with walking distance, hourly pricing, and route directions.',
        howToUse: '1. Tap any map pin or the toggle icon in the search bar.\n2. Tap "Reserve Spot" to select parking duration & vehicle type.',
        techPoweredBy: 'Google Maps OpenStreetMap Leaflet Engine + Haversine Distance Matrix',
        actionLabel: 'Open Map in Simulator',
        onTrigger: () => onNavigate('driver', 'explore')
      }
    },
    {
      id: 'driver-ev',
      title: '⚡ EV Fast Charging Bays',
      category: 'Clean Mobility',
      badge: '7.4kW - 30kW',
      color: 'emerald',
      icon: Zap,
      quickSummary: 'Filter by 7.4kW Type-2 AC or 30kW CCS2 DC fast-chargers across Hyderabad.',
      details: {
        whatItDoes: 'Identifies parking slots with dedicated EV chargers so electric vehicle owners can charge while they park.',
        howToUse: '1. Tap the "⚡ EV Charging" filter pill in the Explore tab.\n2. Add EV charging power units directly during spot checkout.',
        techPoweredBy: 'OCPP 2.0.1 Protocol Telemetry & Kilowatt Hour Billing Engine',
        actionLabel: 'Filter EV Spots in Simulator',
        onTrigger: () => onNavigate('driver', 'explore')
      }
    },
    {
      id: 'driver-ai',
      title: 'DeepMind AI Vacancy Predictor',
      category: 'Predictive Intelligence',
      badge: '94% Confidence',
      color: 'blue',
      icon: Sparkles,
      quickSummary: 'Machine learning forecasting spot availability based on peak IT shift churn.',
      details: {
        whatItDoes: 'Predicts parking space availability hours ahead so drivers never circle tech parks looking for spots.',
        howToUse: 'Look for the green AI Confidence pill (e.g. "88% Free") on spot cards before booking.',
        techPoweredBy: 'Gemini 2.5 Flash + Temporal Occupancy Neural Predictor',
        actionLabel: 'Inspect AI Confidence Scores',
        onTrigger: () => onNavigate('driver', 'explore')
      }
    },
    {
      id: 'driver-wallet',
      title: '1-Click UPI & In-App Wallet',
      category: 'Fintech Payments',
      badge: '₹850 Active',
      color: 'purple',
      icon: Wallet,
      quickSummary: 'Instant slot checkout with zero OTP payment friction and transparent refund ledger.',
      details: {
        whatItDoes: 'Enables rapid 1-tap bookings without re-entering card details every time, with automated promo coupon discounts.',
        howToUse: '1. Switch to the "Wallet" tab in the bottom bar.\n2. Top up ₹500, ₹1000 or apply coupon codes like "PARK50".',
        techPoweredBy: 'Direct UPI Settlement & Mock Razorpay Webhook Simulation',
        actionLabel: 'Inspect Wallet & Top-ups',
        onTrigger: () => onNavigate('driver', 'wallet')
      }
    },
    {
      id: 'driver-pass',
      title: 'Touchless Gate Passes & ANPR',
      category: 'Smart Security',
      badge: 'Active OTP Pass',
      color: 'cyan',
      icon: KeyRound,
      quickSummary: 'Digital gate pass with countdown timer, dynamic OTP, and vehicle license plate link.',
      details: {
        whatItDoes: 'Generates secure barrier entry passes that boom barriers and security guards scan for contact-free entry.',
        howToUse: '1. Reserve any parking bay.\n2. View your active pass with OTP and one-click Google Maps navigation under "Bookings".',
        techPoweredBy: 'Computer Vision ANPR Plate Matcher + Dynamic QR Generator',
        actionLabel: 'View Active Passes',
        onTrigger: () => onNavigate('driver', 'bookings')
      }
    }
  ];

  const hostFeatures = [
    {
      id: 'host-monetize',
      title: 'Monetize Idle Driveways & Plots',
      category: 'Host Income',
      badge: '₹5k–₹12k / mo',
      color: 'emerald',
      icon: Home,
      quickSummary: 'Turn unused villa driveways, plots or commercial basements into recurring revenue.',
      details: {
        whatItDoes: 'Enables property owners to list unused slots for tech workers, receiving direct UPI settlements daily.',
        howToUse: '1. Switch role to "Host" using the top-right header toggle.\n2. Open "List Space" to configure your driveway rules and schedule.',
        techPoweredBy: 'P2P Micro-Asset Monetization Engine & Dynamic Yield Calculator',
        actionLabel: 'Switch to Host Portal',
        onTrigger: () => onNavigate('host', 'overview')
      }
    },
    {
      id: 'host-gps',
      title: '1-Tap GPS Spot Location Lock',
      category: 'Precision Mapping',
      badge: '6-Decimal Precision',
      color: 'amber',
      icon: Crosshair,
      quickSummary: 'Locks high-precision physical GPS coordinates so drivers navigate straight to your slot.',
      details: {
        whatItDoes: 'Uses browser geolocation sensors to pin the exact driveway entrance coordinates without manual address errors.',
        howToUse: 'In Step 1 of the Host Wizard, tap "Lock GPS Location" to auto-fetch latitude, longitude, and street landmark.',
        techPoweredBy: 'W3C Geolocation API + Reverse Geocoding Bounds',
        actionLabel: 'Test 3-Step Space Wizard',
        onTrigger: () => onNavigate('host', 'list')
      }
    },
    {
      id: 'host-wizard',
      title: '3-Step Space Onboarding Wizard',
      category: 'Listing Flow',
      badge: 'Custom "Other" Type',
      color: 'purple',
      icon: PlusCircle,
      quickSummary: 'Select Driveway, Commercial, or custom Other types with hourly pricing & EV setup.',
      details: {
        whatItDoes: 'Guided wizard for host listing: Step 1 (Property & GPS), Step 2 (Schedule & Pricing), Step 3 (EV Charger toggle).',
        howToUse: 'Choose property type (including custom text input for "Other"), set ₹/hr rate, and toggle 7.4kW EV charging.',
        techPoweredBy: 'SQLite Cloud DB Persistence via Express REST APIs',
        actionLabel: 'Launch Space Listing Wizard',
        onTrigger: () => onNavigate('host', 'list')
      }
    },
    {
      id: 'host-logs',
      title: 'Live ANPR Gate Telemetry Logs',
      category: 'Security Automation',
      badge: 'Boom Barrier Sync',
      color: 'blue',
      icon: Shield,
      quickSummary: 'Real-time vehicle entry/exit logging with simulated license plate camera telemetry.',
      details: {
        whatItDoes: 'Monitors boom barrier telemetry, vehicle registration numbers (e.g., TS 09 EQ 4412), check-in time, and overstay alerts.',
        howToUse: 'Navigate to "Gate Logs" tab in Host mode to view real-time entry events and barrier status.',
        techPoweredBy: 'Real-time IoT Telemetry Stream + Camera Plate Recognition',
        actionLabel: 'View Gate Telemetry Logs',
        onTrigger: () => onNavigate('host', 'logs')
      }
    },
    {
      id: 'host-earnings',
      title: 'Earnings Ledger & UPI Settlement',
      category: 'Financial Analytics',
      badge: 'Daily Payouts',
      color: 'emerald',
      icon: TrendingUp,
      quickSummary: 'Track today’s revenue, hosted parkers, and upcoming slot occupancy at a glance.',
      details: {
        whatItDoes: 'Provides high-contrast revenue metrics, weekly earnings analytics (+18% vs avg), and direct UPI account integration.',
        howToUse: 'Open the "Earnings" tab in Host mode to inspect today’s earnings and active spot performance.',
        techPoweredBy: 'Financial Ledger Engine with Automated UPI Direct Transfer',
        actionLabel: 'View Host Earnings Portal',
        onTrigger: () => onNavigate('host', 'overview')
      }
    }
  ];

  const features = side === 'left' ? driverFeatures : hostFeatures;
  const isDriver = side === 'left';

  return (
    <aside className="hidden lg:flex flex-col w-[310px] xl:w-[340px] select-none z-10 space-y-3.5 my-auto max-h-[92vh] overflow-y-auto no-scrollbar py-2">
      {/* App Manual Header Card */}
      <div className="bg-white/95 dark:bg-[#12151D]/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-4 shadow-xl space-y-2 relative overflow-hidden transition-all">
        {/* Subtle decorative glow */}
        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-40 ${
          isDriver ? 'bg-amber-400' : 'bg-emerald-400'
        }`} />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${
              isDriver 
                ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-black glow-yellow'
                : 'bg-gradient-to-br from-emerald-400 to-teal-500 text-black glow-green'
            }`}>
              <BookOpen className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Interactive Manual
              </div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                <span>{isDriver ? 'Driver App Guide' : 'Host Monetization Guide'}</span>
              </h3>
            </div>
          </div>

          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
            isDriver
              ? 'bg-amber-500/10 text-amber-700 dark:text-brandYellow border-amber-500/30'
              : 'bg-emerald-500/10 text-emerald-700 dark:text-neonGreen border-emerald-500/30'
          }`}>
            {features.length} Features
          </span>
        </div>

        <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-snug">
          {isDriver 
            ? 'Explore how drivers search, reserve, and navigate to private bays & EV fast chargers.'
            : 'Explore how villa owners & office lots list empty parking bays to earn passive income.'}
        </p>

        <div className="flex items-center gap-1.5 pt-1 text-[10px] font-bold text-gray-500 dark:text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-brandYellow animate-ping"></span>
          <span>Click any feature below to expand details & test in mockup</span>
        </div>
      </div>

      {/* Feature Accordion Items */}
      <div className="space-y-2.5">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          const isExpanded = expandedId === feature.id;
          const isHovered = hoveredId === feature.id;

          return (
            <div
              key={feature.id}
              onMouseEnter={() => setHoveredId(feature.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isExpanded
                  ? 'bg-white dark:bg-[#161A23] border-brandYellow/60 dark:border-brandYellow/50 shadow-xl ring-1 ring-brandYellow/30'
                  : 'bg-white/85 dark:bg-[#12151D]/80 hover:bg-white dark:hover:bg-[#161A23] border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 shadow-md'
              }`}
            >
              {/* Item Header (Always Visible, Click to Toggle) */}
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : feature.id)}
                className="w-full p-3.5 flex items-start gap-2.5 text-left transition-colors"
              >
                {/* Number / Icon Badge */}
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform ${
                  isExpanded || isHovered ? 'scale-110' : ''
                } ${
                  isDriver 
                    ? 'bg-amber-500/15 text-amber-700 dark:text-brandYellow border border-amber-500/30'
                    : 'bg-emerald-500/15 text-emerald-700 dark:text-neonGreen border border-emerald-500/30'
                }`}>
                  <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {feature.category}
                    </span>
                    <span className={`text-[8.5px] font-black px-1.5 py-0.2 rounded-full border whitespace-nowrap leading-tight ${
                      isDriver
                        ? 'bg-amber-500/10 text-amber-700 dark:text-brandYellow border-amber-500/25'
                        : 'bg-emerald-500/10 text-emerald-700 dark:text-neonGreen border-emerald-500/25'
                    }`}>
                      {feature.badge}
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-gray-900 dark:text-white leading-tight mt-0.5 truncate">
                    {feature.title}
                  </h4>

                  {!isExpanded && (
                    <p className="text-[10.5px] text-gray-500 dark:text-gray-400 line-clamp-1 leading-snug mt-1">
                      {feature.quickSummary}
                    </p>
                  )}
                </div>

                <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-1 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180 text-brandYellow' : ''
                }`} />
              </button>

              {/* Expanded Manual Details Section */}
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-1 space-y-2.5 border-t border-gray-100 dark:border-white/5 text-xs animate-fadeIn">
                  {/* What it does */}
                  <div className="space-y-1">
                    <div className="text-[9.5px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-brandYellow" />
                      <span>Capability & Value</span>
                    </div>
                    <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-snug">
                      {feature.details.whatItDoes}
                    </p>
                  </div>

                  {/* How to use */}
                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#0E1117] border border-gray-100 dark:border-white/5 space-y-1">
                    <div className="text-[9.5px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>Step-by-Step Walkthrough</span>
                    </div>
                    <div className="text-[10.5px] text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed font-medium">
                      {feature.details.howToUse}
                    </div>
                  </div>

                  {/* Tech Stack Indicator */}
                  <div className="flex items-center gap-1.5 text-[9.5px] text-gray-500 dark:text-gray-400 font-mono bg-amber-500/5 dark:bg-brandYellow/5 p-1.5 rounded-lg border border-brandYellow/20">
                    <Cpu className="w-3 h-3 text-brandYellow flex-shrink-0" />
                    <span className="truncate">{feature.details.techPoweredBy}</span>
                  </div>

                  {/* Interactive Trigger CTA Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      feature.details.onTrigger();
                    }}
                    className={`w-full py-2 px-3 rounded-xl font-black text-[11px] flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 ${
                      isDriver
                        ? 'bg-gradient-to-r from-amber-400 via-brandYellow to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black glow-yellow'
                        : 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black glow-green'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current stroke-none" />
                    <span>{feature.details.actionLabel}</span>
                    <ArrowRightIcon className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Manual Quick Switcher Footer Tip */}
      <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/10 via-transparent to-emerald-500/10 border border-gray-200 dark:border-white/10 text-center space-y-1">
        <div className="text-[10px] font-bold text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-brandYellow" />
          <span>Switch roles inside simulator anytime</span>
        </div>
        <p className="text-[9.5px] text-gray-500 dark:text-gray-400">
          Toggle <strong>[ 🚗 Driver | 🏠 Host ]</strong> in the phone's top header to test opposite workflows.
        </p>
      </div>
    </aside>
  );
}

function ArrowRightIcon(props) {
  return (
    <svg 
      className="w-3 h-3 stroke-[2.5]" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
