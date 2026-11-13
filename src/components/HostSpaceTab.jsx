import React, { useState, useEffect } from 'react';
import { 
  Home, Building2, Briefcase, ShoppingBag, 
  Zap, CheckCircle2, ArrowRight, Sparkles, 
  Navigation, Crosshair, Lock, Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

const HYD_COORDS_MAP = {
  'Gachibowli': { lat: 17.4435, lng: 78.3582, address: 'Near DLF Cybercity Gate 1 & ORR, Gachibowli, Hyderabad 500032' },
  'Hitec City / Madhapur': { lat: 17.4502, lng: 78.3812, address: 'Near Cyber Towers & Metro Station, Hitec City, Madhapur 500081' },
  'Financial District': { lat: 17.4210, lng: 78.3490, address: 'WaveRock IT Gateway Road, Nanakramguda, Financial District 500032' },
  'Jubilee Hills': { lat: 17.4355, lng: 78.4020, address: 'Road Number 45 / 36, Jubilee Hills, Hyderabad 500033' },
  'Kondapur': { lat: 17.4650, lng: 78.3620, address: 'Near Botanical Garden Road, Kondapur, Hyderabad 500084' },
  'Manikonda': { lat: 17.4010, lng: 78.3850, address: 'Near Lanco Hills & Outer Ring Road, Manikonda 500089' }
};

export default function HostSpaceTab({ onAddNewSpot }) {
  const [step, setStep] = useState(1);

  // Form State
  const [propertyType, setPropertyType] = useState('Home Driveway');
  const [title, setTitle] = useState('');
  const [area, setArea] = useState('Gachibowli');
  const [address, setAddress] = useState('');

  // GPS Location Lock State
  const [lockedCoords, setLockedCoords] = useState(HYD_COORDS_MAP['Gachibowli']);
  const [isLocating, setIsLocating] = useState(false);
  const [isLocationLocked, setIsLocationLocked] = useState(false);
  const [lockMethod, setLockMethod] = useState('preset'); // 'gps' | 'preset'
  const [gpsAccuracy, setGpsAccuracy] = useState(null);

  // Auto-update coordinates preset when area dropdown changes (if not locked by physical GPS)
  useEffect(() => {
    if (!isLocationLocked || lockMethod === 'preset') {
      const preset = HYD_COORDS_MAP[area] || HYD_COORDS_MAP['Gachibowli'];
      setLockedCoords(preset);
      if (!address || address.includes('Hyderabad')) {
        setAddress(preset.address);
      }
    }
  }, [area]);

  const handleDetectGPS = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(6));
          const lng = parseFloat(pos.coords.longitude.toFixed(6));
          const acc = Math.round(pos.coords.accuracy);
          setLockedCoords({ lat, lng, address: address || `Near ${area}, Hyderabad` });
          setIsLocationLocked(true);
          setLockMethod('gps');
          setGpsAccuracy(acc);
          setIsLocating(false);
        },
        (err) => {
          // Graceful fallback to locality preset
          const preset = HYD_COORDS_MAP[area] || HYD_COORDS_MAP['Gachibowli'];
          setLockedCoords(preset);
          setIsLocationLocked(true);
          setLockMethod('preset');
          setGpsAccuracy(12);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      const preset = HYD_COORDS_MAP[area] || HYD_COORDS_MAP['Gachibowli'];
      setLockedCoords(preset);
      setIsLocationLocked(true);
      setLockMethod('preset');
      setIsLocating(false);
    }
  };

  
  // Schedule & Rate
  const [scheduleType, setScheduleType] = useState('Mon–Fri (9 AM – 6 PM)');
  const [hourlyRate, setHourlyRate] = useState(35);
  
  // EV Charger
  const [hasEV, setHasEV] = useState(false);
  const [evChargerType, setEvChargerType] = useState('7.4kW AC Slow/Medium');
  const [evPrice, setEvPrice] = useState(25);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Estimated Monthly Earnings: hourlyRate * 7 hours/day * 26 days
  const monthlyEst = hourlyRate * 7 * 24 + (hasEV ? evPrice * 4 * 20 : 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#F5B800', '#10B981', '#3B82F6'],
        });
      } catch (err) {}

      const newSpotObj = {
        id: `spot-${Date.now()}`,
        name: title.trim() || `${propertyType} (${area})`,
        category: hasEV ? 'EV Charging' : propertyType.includes('Home') ? 'Homes' : 'Offices',
        type: propertyType + (hasEV ? ' + EV' : ''),
        slotNumber: `Slot ${Math.floor(10 + Math.random() * 90)}`,
        address: address.trim() || `Plot 104, Near Main Road, ${area}, Hyderabad 500084`,
        area: area,
        basePrice: Number(hourlyRate),
        rating: 5.0,
        reviewsCount: 1,
        distanceKm: 0.9,
        durationMin: 3,
        perks: ['Host Verified', 'Gated Security', hasEV ? 'EV Fast Charger' : 'Covered'],
        hasEV: hasEV,
        evDetails: hasEV
          ? {
              chargerPrice: Number(evPrice),
              types: [
                {
                  name: evChargerType,
                  power: evChargerType.includes('30kW') ? '30kW' : '7.4kW',
                  plug: 'Type-2 / CCS-2',
                  status: 'Available Now',
                  speed: 'Fast Top-up',
                  addOnPrice: Number(evPrice),
                },
              ],
              currentQueue: 0,
            }
          : null,
        aiProbability: 88,
        aiStatus: 'Newly Listed Slot',
        aiStatusColor: '#10B981',
        aiInsight: `Listed by verified Hyderabad host on ${scheduleType}. Ready for instant booking.`,
        host: {
          name: 'You (Host)',
          verified: true,
          phone: '+91 99000 88888',
          rating: 5.0,
          superHost: true,
        },
        // Position near center of Hyderabad canvas
        coords: { x: 55 + (Math.random() * 16 - 8), y: 45 + (Math.random() * 16 - 8) },
        realCoords: { 
          lat: lockedCoords.lat || 17.4435, 
          lng: lockedCoords.lng || 78.3582 
        },
        image: propertyType.includes('Home')
          ? 'https://images.unsplash.com/photo-1584463699042-3a33994a50d8?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
        totalSlots: 1,
        availableSlots: 1,
        gateAccessCode: `${Math.floor(1000 + Math.random() * 9000)}`,
        gateType: 'Host OTP & Guard Verification',
      };

      setTimeout(() => {
        onAddNewSpot(newSpotObj);
      }, 1500);
    }, 1000);
  };

  const propertyOptions = [
    { label: 'Home Driveway', icon: Home, desc: 'Independent villa or bungalow gate' },
    { label: 'Apartment Society', icon: Building2, desc: 'Gated community RWA slot' },
    { label: 'Office Lot', icon: Briefcase, desc: 'Commercial tech park basement' },
    { label: 'Commercial / Mall', icon: ShoppingBag, desc: 'Retail store or plaza parking' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-24 text-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#161920] to-[#0B0D10] border border-cardBorder rounded-3xl p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-extrabold tracking-widest text-brandYellow uppercase bg-brandYellow/15 px-2 py-0.5 rounded-full border border-brandYellow/30">
            Airbnb For Parking
          </span>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> ₹0 Listing Fee
          </span>
        </div>
        <h2 className="text-lg font-black text-white">
          Monetize Your Idle Parking Spot
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Turn your empty driveway or reserved office slot in Hyderabad into passive income while you are away.
        </p>

        {/* Live Monthly Earnings Card */}
        <div className="mt-4 p-3 bg-[#0B0D10] border border-brandYellow/30 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-semibold">
              Estimated Monthly Earnings
            </div>
            <div className="text-xl font-black text-brandYellow">
              ₹{monthlyEst.toLocaleString('en-IN')}{' '}
              <span className="text-xs font-normal text-gray-400">/month</span>
            </div>
          </div>
          <div className="text-right text-[10px] text-emerald-400 font-medium">
            Based on ₹{hourlyRate}/hr • ~7 hrs/day
          </div>
        </div>
      </div>

      {/* 3-Step Wizard Indicator */}
      <div className="flex items-center justify-between bg-[#161920] border border-cardBorder rounded-2xl p-2.5 px-4 text-xs">
        <div
          onClick={() => setStep(1)}
          className={`cursor-pointer flex items-center gap-1.5 font-bold ${
            step === 1 ? 'text-brandYellow' : 'text-gray-400'
          }`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
            step === 1 ? 'bg-brandYellow text-black' : 'bg-gray-800 text-gray-300'
          }`}>1</span>
          <span>Property</span>
        </div>

        <div className="w-6 h-0.5 bg-cardBorder" />

        <div
          onClick={() => setStep(2)}
          className={`cursor-pointer flex items-center gap-1.5 font-bold ${
            step === 2 ? 'text-brandYellow' : 'text-gray-400'
          }`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
            step === 2 ? 'bg-brandYellow text-black' : 'bg-gray-800 text-gray-300'
          }`}>2</span>
          <span>Schedule & Rate</span>
        </div>

        <div className="w-6 h-0.5 bg-cardBorder" />

        <div
          onClick={() => setStep(3)}
          className={`cursor-pointer flex items-center gap-1.5 font-bold ${
            step === 3 ? 'text-brandYellow' : 'text-gray-400'
          }`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
            step === 3 ? 'bg-brandYellow text-black' : 'bg-gray-800 text-gray-300'
          }`}>3</span>
          <span>EV Charger</span>
        </div>
      </div>

      {/* Step 1: Property Type */}
      {step === 1 && (
        <div className="bg-gradient-to-b from-[#181C25] to-[#101319] border border-white/10 rounded-2xl p-4.5 space-y-4 shadow-xl">
          <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
            Step 1: Choose Property Type
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {propertyOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = propertyType === opt.label;
              return (
                <div
                  key={opt.label}
                  onClick={() => setPropertyType(opt.label)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-brandYellow/15 border-brandYellow text-white glow-yellow scale-[1.02]'
                      : 'bg-[#151821] border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-brandYellow' : 'text-gray-400'}`} />
                  <div className="font-bold text-xs text-white">{opt.label}</div>
                  <div className="text-[10px] text-gray-400 leading-tight mt-0.5">{opt.desc}</div>
                </div>
              );
            })}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              Spot Title / Label
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. My Gated Villa Driveway (Near DLF Gate)"
              className="w-full bg-[#151821] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brandYellow focus:ring-1 focus:ring-brandYellow/40 transition-all shadow-inner"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              Hyderabad Locality
            </label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full bg-[#151821] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brandYellow focus:ring-1 focus:ring-brandYellow/40 transition-all shadow-inner"
            >
              <option value="Gachibowli">Gachibowli (Near ORR / DLF)</option>
              <option value="Hitec City / Madhapur">Hitec City / Madhapur (Cyber Towers)</option>
              <option value="Financial District">Financial District (WaveRock / ISB)</option>
              <option value="Jubilee Hills">Jubilee Hills (Road 36 & 45)</option>
              <option value="Kondapur">Kondapur (Botanical Garden)</option>
              <option value="Manikonda">Manikonda / Puppalguda</option>
            </select>
          </div>

          {/* GPS Location Lock Section */}
          <div className="bg-[#0D1016] border border-white/10 rounded-2xl p-3.5 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isLocationLocked ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-brandYellow/20 text-brandYellow'
                }`}>
                  {isLocationLocked ? <Lock className="w-3.5 h-3.5" /> : <Crosshair className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>GPS Spot Coordinates</span>
                    {isLocationLocked && (
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                        ✓ Locked
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {isLocationLocked 
                      ? `${lockedCoords.lat.toFixed(4)}° N, ${lockedCoords.lng.toFixed(4)}° E (${lockMethod === 'gps' ? 'Live GPS' : 'Locality Pin'})`
                      : 'Lock accurate coordinates for drivers to navigate'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={isLocating}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-brandYellow/40 rounded-xl text-[11px] font-bold text-brandYellow flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                {isLocating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Locating...</span>
                  </>
                ) : isLocationLocked ? (
                  <>
                    <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Re-detect GPS</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Lock GPS Location</span>
                  </>
                )}
              </button>
            </div>

            {/* Address / Landmark detail */}
            <div>
              <label className="text-[11px] font-medium text-gray-400 block mb-1">
                Street Address / Landmark (Auto-filled from locked location)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Plot number, apartment name, street or gate info"
                className="w-full bg-[#151821] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brandYellow focus:ring-1 focus:ring-brandYellow/40 transition-all shadow-inner"
              />
            </div>
          </div>

          <button
            onClick={() => {
              if (!isLocationLocked) {
                setIsLocationLocked(true);
              }
              setStep(2);
            }}
            className="w-full py-3 bg-gradient-to-r from-amber-400 via-brandYellow to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-black rounded-xl text-xs flex items-center justify-center gap-2 glow-yellow transition-all active:scale-95 shadow-lg"
          >
            <span>Continue to Schedule & Pricing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Schedule & Rate */}
      {step === 2 && (
        <div className="bg-[#161920] border border-cardBorder rounded-2xl p-4 space-y-4">
          <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
            Step 2: Availability Schedule & Rate
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-2">
              When is this spot vacant?
            </label>
            <div className="space-y-2">
              {[
                { title: 'Mon–Fri (9 AM – 6 PM)', desc: 'While you commute to your workplace' },
                { title: '24x7 Unrestricted Access', desc: 'Spare lot always ready for rent' },
                { title: 'Weekends Only (Sat–Sun)', desc: 'Ideal for tech park spaces' },
                { title: 'Night Hours (8 PM – 8 AM)', desc: 'For residents near commercial clubs' },
              ].map((sch) => (
                <div
                  key={sch.title}
                  onClick={() => setScheduleType(sch.title)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    scheduleType === sch.title
                      ? 'bg-brandYellow/15 border-brandYellow text-white'
                      : 'bg-[#0B0D10] border-cardBorder text-gray-400'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white">{sch.title}</div>
                    <div className="text-[10px] text-gray-400">{sch.desc}</div>
                  </div>
                  {scheduleType === sch.title && <CheckCircle2 className="w-4 h-4 text-brandYellow" />}
                </div>
              ))}
            </div>
          </div>

          {/* Rate Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-300">
                Set Hourly Rate:
              </label>
              <span className="text-lg font-black text-brandYellow">
                ₹{hourlyRate}/hr
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full accent-brandYellow h-2 bg-gray-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>₹20/hr (Fast booking)</span>
              <span>₹60/hr (Optimal)</span>
              <span>₹100/hr (Premium)</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="w-1/3 py-3 border border-cardBorder text-gray-300 rounded-xl text-xs font-bold"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="w-2/3 py-3 bg-brandYellow hover:bg-brandYellow-hover text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 glow-yellow transition-all"
            >
              <span>Next: EV Charger Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Swiggy-Style EV Listing */}
      {step === 3 && (
        <div className="bg-[#161920] border border-cardBorder rounded-2xl p-4 space-y-4">
          <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
            Step 3: EV Charging Capability
          </div>

          {/* EV Toggle (Swiggy style) */}
          <div className="p-4 rounded-2xl border border-neonGreen/40 bg-gradient-to-r from-neonGreen/10 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neonGreen/20 text-neonGreen flex items-center justify-center">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Has EV Charger Available?</span>
                  <span className="text-[9px] bg-neonGreen/20 text-neonGreen font-semibold px-1.5 py-0.2 rounded">
                    HIGH DEMAND IN HYD
                  </span>
                </div>
                <div className="text-[10px] text-gray-400">
                  Allow EV drivers to pay for slow or fast charging sessions
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHasEV(!hasEV)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                hasEV ? 'bg-neonGreen' : 'bg-gray-700'
              }`}
            >
              <div
                className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  hasEV ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {hasEV && (
            <div className="space-y-3 p-3 bg-[#0B0D10] border border-cardBorder rounded-xl animate-in fade-in">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Charger Power Specification
                </label>
                <select
                  value={evChargerType}
                  onChange={(e) => setEvChargerType(e.target.value)}
                  className="w-full bg-[#161920] border border-cardBorder rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-neonGreen"
                >
                  <option value="7.4kW AC Type-2 (Wallbox)">7.4kW AC Type-2 (Wallbox Home Charger)</option>
                  <option value="30kW DC Fast Charger (Commercial)">30kW DC Fast Charger (Commercial Gun)</option>
                  <option value="3.3kW 15A Smart Socket">3.3kW 15A Smart Socket (Slow Charge)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300 font-semibold">EV Add-on Tariff:</span>
                  <span className="font-bold text-neonGreen">+₹{evPrice}/hr</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  step="5"
                  value={evPrice}
                  onChange={(e) => setEvPrice(Number(e.target.value))}
                  className="w-full accent-neonGreen h-2 bg-gray-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          <div className="p-3 bg-[#0B0D10] rounded-xl border border-cardBorder text-xs text-gray-300 space-y-1">
            <div className="font-semibold text-white flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-neonGreen" /> Automatic Barrier & OTP Gate Sync
            </div>
            <p className="text-[10px] text-gray-400">
              When booked, ParkNest sends your security gate an automated 4-digit OTP. You get instant UPI payout as soon as session ends.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(2)}
              className="w-1/3 py-3 border border-cardBorder text-gray-300 rounded-xl text-xs font-bold"
            >
              Back
            </button>
            <button
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-2/3 py-3.5 bg-neonGreen hover:bg-neonGreen-hover text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 glow-green transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Publishing Spot to Map...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publish & List on Hyderabad Map</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
