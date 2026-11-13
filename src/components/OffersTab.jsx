import React, { useState } from 'react';
import { 
  Tag, Sparkles, Copy, CheckCircle2, 
  ArrowRight, ShieldCheck, Flame, Check
} from 'lucide-react';

export default function OffersTab({ onSelectSpotToBook, onSwitchToExplore }) {
  const [copiedCode, setCopiedCode] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [inputCode, setInputCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  const coupons = [
    {
      code: 'PARK50',
      category: 'welcome',
      title: 'Flat 50% OFF First Booking',
      desc: 'Valid on your first hourly or daily parking reservation anywhere in Hyderabad.',
      discount: '50% OFF',
      savings: 'Up to ₹50',
      tag: 'WELCOME DEAL',
      minDuration: 'Min. 1 hr',
      validTill: 'Valid for next 14 days',
      terms: 'Applicable once per user on all covered & open bays.',
      color: 'from-amber-500/20 to-brandYellow/10 border-brandYellow/50 text-brandYellow',
    },
    {
      code: 'AUTOPAY25',
      category: 'autopay',
      title: 'Instant ₹25 Auto-Pay Cashback',
      desc: 'Automatic boom barrier clearance via ParkNest smart wallet integration.',
      discount: '₹25 CASHBACK',
      savings: 'Direct to Wallet',
      tag: 'AUTO PASS',
      minDuration: 'Auto Exit',
      validTill: 'Auto-credited instantly',
      terms: 'Instant wallet cashback upon automated exit barrier scan.',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/50 text-neonGreen',
    },
    {
      code: 'EVSUPER100',
      category: 'ev',
      title: 'Flat ₹100 Fast DC EV Credit',
      desc: 'Supercharge your EV at 30kW, 50kW or 60kW DC guns with ₹100 fee waiver.',
      discount: '₹100 CREDIT',
      savings: 'Free 5-8 kWh charge',
      tag: 'SUPERCHARGER',
      minDuration: '45+ min EV',
      validTill: 'Valid all month',
      terms: 'Applicable at WaveRock, Knowledge City, and Inorbit EV hubs.',
      color: 'from-green-500/20 to-emerald-500/10 border-neonGreen/60 text-neonGreen',
    },
    {
      code: 'AIRPORT150',
      category: 'airport',
      title: 'Flat ₹150 OFF RGIA Airport Parking',
      desc: 'Long-duration multi-day terminal parking with CCTV surveillance & shuttle assist.',
      discount: '₹150 OFF',
      savings: 'On 24hr+ bookings',
      tag: 'AIRPORT TERMINAL',
      minDuration: 'Min. 24 hrs',
      validTill: 'Valid till month end',
      terms: 'Pre-book at least 2 hours before flight check-in.',
      color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/50 text-blue-400',
    },
    {
      code: 'NIGHTOWL',
      category: 'night',
      title: 'Flat ₹15/hr Late-Night Parking',
      desc: 'Safe & secure overnight parking across Gachibowli, Madhapur & Jubilee Hills.',
      discount: 'FLAT ₹15/hr',
      savings: 'Save ₹30/hr',
      tag: 'NIGHT RATE',
      minDuration: '10 PM – 5 AM',
      validTill: 'Active every night',
      terms: 'Applicable between 10 PM and 5 AM at 24x7 gated premises.',
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/50 text-purple-400',
    },
    {
      code: 'WEEKENDHYD',
      category: 'weekend',
      title: '30% OFF Weekend Mall & Cinema',
      desc: 'Skip chaotic mall queues at Inorbit, Sarath City Capital & Nexus Hyderabad.',
      discount: '30% OFF',
      savings: 'Up to ₹75',
      tag: 'WEEKEND SPECIAL',
      minDuration: 'Sat & Sun',
      validTill: 'Valid this weekend',
      terms: 'Guaranteed reserved bay with priority entry pass.',
      color: 'from-orange-500/20 to-amber-500/10 border-orange-500/50 text-orange-400',
    },
    {
      code: 'TECHCORP',
      category: 'corporate',
      title: 'Save ₹500 on Monthly Office Pass',
      desc: 'Dedicated assigned basement slot near DLF, WaveRock, Mindspace or Knowledge City.',
      discount: '₹500 OFF',
      savings: 'Monthly subscription',
      tag: 'WORKDAY PASS',
      minDuration: '30-Day Pass',
      validTill: 'Limited slots left',
      terms: 'Includes reserved personalized stall badge and 24x7 security.',
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/50 text-cyan-400',
    },
    {
      code: 'METRORIDE',
      category: 'commute',
      title: 'Flat ₹20 OFF Park & Ride Metro',
      desc: 'Seamless metro transfers at Raidurg, Hitec City, and Durgam Cheruvu stations.',
      discount: '₹20 OFF',
      savings: 'Daily Commute',
      tag: 'METRO COMMUTE',
      minDuration: 'Min. 2 hrs',
      validTill: 'Monday to Friday',
      terms: 'Stall located within 100 meters of Hyderabad Metro entry.',
      color: 'from-teal-500/20 to-emerald-500/10 border-teal-500/50 text-teal-400',
    },
    {
      code: 'VALETFREE',
      category: 'valet',
      title: '100% Free Valet Assist Upgrade',
      desc: 'Hand over your keys to uniformed ParkNest valets at Road 36 & Road 45 Jubilee Hills.',
      discount: 'FREE VALET',
      savings: '₹50 fee waived',
      tag: 'VALET ASSIST',
      minDuration: 'Jubilee Hills',
      validTill: 'Available daily',
      terms: 'Trained professional valets with digital handover inspection.',
      color: 'from-brandYellow/20 to-amber-500/10 border-brandYellow/60 text-brandYellow',
    },
    {
      code: 'ZEROCOMM',
      category: 'welcome',
      title: 'Zero Platform Convenience Fee',
      desc: 'Pay strictly the host parking fare with 0% platform surcharge.',
      discount: '100% FEE WAIVER',
      savings: 'Zero extra charge',
      tag: 'NO CONVENIENCE FEE',
      minDuration: 'All Bookings',
      validTill: 'Auto-activates',
      terms: 'Enjoy wholesale parking rates direct from space owners.',
      color: 'from-emerald-500/20 to-green-500/10 border-emerald-500/50 text-emerald-400',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Coupons (10)' },
    { id: 'welcome', label: '🎉 First Booking' },
    { id: 'autopay', label: '🚧 Auto-Pay Cashback' },
    { id: 'ev', label: '⚡ EV Supercharge' },
    { id: 'weekend', label: '🛍️ Weekend Malls' },
    { id: 'airport', label: '✈️ Airport Terminal' },
    { id: 'corporate', label: '🏢 Monthly Pass' },
  ];

  const filteredCoupons = activeCategory === 'all'
    ? coupons
    : coupons.filter(c => c.category === activeCategory);

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleApplyInput = (e) => {
    e?.preventDefault();
    setPromoError('');
    const clean = inputCode.trim().toUpperCase();
    if (!clean) return;

    const matched = coupons.find(c => c.code === clean);
    if (matched) {
      setAppliedPromo(matched);
      setPromoError('');
    } else {
      setPromoError(`Coupon "${clean}" is not recognized or has expired. Try PARK50 or AUTOPAY25.`);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-24 text-gray-200">
      {/* Coupons Header Banner */}
      <div className="bg-gradient-to-br from-[#161920] via-[#10141D] to-[#0B0D10] border border-cardBorder rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-brandYellow/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-extrabold tracking-widest text-brandYellow uppercase bg-brandYellow/15 px-2.5 py-0.5 rounded-full border border-brandYellow/30 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            <span>ParkNest Promo Hub</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> 10 Live Coupons
          </span>
        </div>
        
        <h2 className="text-xl font-black text-white">
          Parking, EV & Auto-Pay Discounts
        </h2>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
          Unlock verified coupons, instant barrier cashback, and EV charging credits across 250+ parking bays in Hyderabad.
        </p>

        {/* Interactive Promo Code Tester */}
        <div className="mt-4 pt-3 border-t border-cardBorder/60">
          <form onSubmit={handleApplyInput} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter promo code (e.g. PARK50)"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                className="w-full bg-[#0B0D10] border border-cardBorder rounded-xl px-3 py-2 text-xs font-mono font-bold text-brandYellow uppercase placeholder:text-gray-500 placeholder:font-sans focus:outline-none focus:border-brandYellow"
              />
              {inputCode && (
                <button
                  type="button"
                  onClick={() => setInputCode('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-brandYellow hover:bg-yellow-400 text-black font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              Apply
            </button>
          </form>

          {appliedPromo && (
            <div className="mt-2.5 p-2.5 rounded-xl bg-neonGreen/10 border border-neonGreen/40 flex items-center justify-between text-xs animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neonGreen shrink-0" />
                <div>
                  <span className="font-bold text-white">Code "{appliedPromo.code}" Applied!</span>
                  <span className="text-neonGreen block text-[10px] font-semibold">{appliedPromo.title} • {appliedPromo.savings}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (onSwitchToExplore) onSwitchToExplore();
                }}
                className="text-[11px] font-bold text-black bg-neonGreen px-2.5 py-1 rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-1"
              >
                <span>Find Spots</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {promoError && (
            <p className="mt-2 text-[11px] text-red-400 font-medium">{promoError}</p>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap text-[11px] font-bold transition-all ${
              activeCategory === cat.id
                ? 'bg-brandYellow text-black shadow-md shadow-brandYellow/20'
                : 'bg-[#161920] text-gray-300 border border-cardBorder hover:border-gray-500'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Coupons List */}
      <div className="space-y-3">
        {filteredCoupons.map((coupon) => {
          const isCopied = copiedCode === coupon.code;
          const isApplied = appliedPromo?.code === coupon.code;

          return (
            <div
              key={coupon.code}
              className={`bg-[#161920] border rounded-2xl p-4 space-y-3 transition-all shadow-md relative overflow-hidden group ${
                isApplied ? 'border-neonGreen/80 ring-1 ring-neonGreen/50' : 'border-cardBorder hover:border-brandYellow/40'
              }`}
            >
              {/* Top Banner Tag & Discount Pill */}
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-white/5 text-gray-300 border border-cardBorder flex items-center gap-1">
                  <Flame className="w-2.5 h-2.5 text-brandYellow" />
                  {coupon.tag}
                </span>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full border bg-neonGreen/10 text-neonGreen border-neonGreen/30">
                  {coupon.discount}
                </span>
              </div>

              {/* Title, Desc, and Duration */}
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-brandYellow transition-colors flex items-center justify-between">
                  <span>{coupon.title}</span>
                  <span className="text-[11px] font-semibold text-brandYellow">{coupon.savings}</span>
                </h3>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{coupon.desc}</p>
              </div>

              {/* Terms Badge */}
              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#0B0D10] border border-gray-200 dark:border-cardBorder/80 text-[10px] text-gray-700 dark:text-gray-300 flex items-center justify-between gap-2 overflow-hidden shadow-sm">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-neonGreen shrink-0" />
                  <span className="truncate font-medium">{coupon.terms}</span>
                </div>
                <span className="text-[9.5px] text-gray-600 dark:text-gray-400 font-mono shrink-0 whitespace-nowrap bg-gray-200/70 dark:bg-white/5 px-2 py-0.5 rounded-md border border-gray-300/70 dark:border-white/10">
                  {coupon.minDuration}
                </span>
              </div>

              {/* Coupon Code Action Strip */}
              <div className="pt-2 border-t border-cardBorder/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="font-mono text-xs font-black text-brandYellow bg-[#0B0D10] px-3 py-1.5 rounded-xl border border-dashed border-brandYellow/50 tracking-wider">
                    {coupon.code}
                  </div>
                  
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      isCopied
                        ? 'bg-neonGreen text-black'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-cardBorder'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => {
                    setAppliedPromo(coupon);
                    setInputCode(coupon.code);
                    if (onSwitchToExplore) onSwitchToExplore();
                  }}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                    isApplied
                      ? 'bg-neonGreen text-black font-extrabold'
                      : 'bg-brandYellow hover:bg-yellow-400 text-black'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <span>Active</span>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </>
                  ) : (
                    <>
                      <span>Use Coupon</span>
                      <ArrowRight className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}