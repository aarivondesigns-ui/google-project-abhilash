import React, { useState } from 'react';
import { X, Zap, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BookingModal({ spot, onClose, onBookingSuccess }) {
  const [duration, setDuration] = useState(2); // hours
  const [startSlot, setStartSlot] = useState('Now (Immediate entry)');
  const [addEV, setAddEV] = useState(spot.hasEV);
  const [selectedChargerIndex, setSelectedChargerIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('gpay'); // gpay, phonepe, paytm, upiqr

  const selectedCharger = spot.hasEV && spot.evDetails ? spot.evDetails.types[selectedChargerIndex] : null;
  const evHourlyRate = selectedCharger ? selectedCharger.addOnPrice : 0;

  // Calculation
  const parkingFee = spot.basePrice * duration;
  const evFee = addEV && spot.hasEV ? evHourlyRate * duration : 0;
  const subtotal = parkingFee + evFee;
  const platformFee = Math.round(subtotal * 0.15); // 15% ParkNest Platform fee
  const totalAmount = subtotal + platformFee;

  const handlePayAndReserve = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F5B800', '#10B981', '#3B82F6', '#FFFFFF'],
        });
      } catch (e) {
        // Fallback if confetti blocked
      }

      const newBooking = {
        bookingId: `PN-HYD-${Math.floor(10000 + Math.random() * 90000)}`,
        spotId: spot.id,
        spotTitle: spot.name,
        slotNumber: spot.slotNumber,
        location: spot.address,
        distance: `${spot.distanceKm} km (${spot.durationMin} min away)`,
        type: spot.type,
        gateOTP: spot.gateAccessCode || '4829',
        qrData: `PARKNEST:${spot.slotNumber}:AUTH-${spot.gateAccessCode || '4829'}:${spot.area}`,
        startTime: 'Now',
        endTime: `in ${duration} hours`,
        remainingMinutes: duration * 60,
        totalAmount: subtotal,
        platformFee: platformFee,
        paidTotal: totalAmount,
        hasEVAddon: addEV && spot.hasEV,
        evChargerType: addEV && selectedCharger ? selectedCharger.name : null,
        status: 'ACTIVE',
        overstaySimulated: false,
      };

      onBookingSuccess(newBooking);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#161920] border border-cardBorder rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#161920]/95 backdrop-blur-md border-b border-cardBorder px-5 py-4 flex items-center justify-between z-10">
          <div>
            <div className="text-[11px] font-semibold tracking-wider text-brandYellow uppercase flex items-center gap-1.5">
              <span>Instant Gate Reservation</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brandYellow"></span>
              <span className="text-gray-400 font-normal">Hyderabad</span>
            </div>
            <h3 className="text-base font-bold text-white truncate max-w-[280px]">
              {spot.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#262A34] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-gray-200 flex-1">
          {/* AI Probability banner */}
          <div
            className="p-3 rounded-2xl flex items-start gap-3 border"
            style={{
              backgroundColor: `${spot.aiStatusColor}12`,
              borderColor: `${spot.aiStatusColor}35`,
            }}
          >
            <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: spot.aiStatusColor }} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold" style={{ color: spot.aiStatusColor }}>
                  {spot.aiProbability}% AI Availability Confidence
                </span>
                <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded text-gray-300">
                  {spot.aiStatus}
                </span>
              </div>
              <p className="text-[11px] text-gray-300 mt-0.5 leading-snug">
                {spot.aiInsight}
              </p>
            </div>
          </div>

          {/* 1. Duration Picker */}
          <div>
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block mb-2">
              Select Parking Duration (Hours)
            </label>
            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setDuration(hrs)}
                  className={`py-2.5 rounded-xl font-bold text-xs transition-all flex flex-col items-center justify-center border ${
                    duration === hrs
                      ? 'bg-brandYellow text-black border-brandYellow shadow-lg glow-yellow scale-105'
                      : 'bg-[#0B0D10] text-gray-300 border-cardBorder hover:border-gray-600'
                  }`}
                >
                  <span>{hrs}h</span>
                  <span className="text-[9px] font-normal opacity-80">₹{hrs * spot.basePrice}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Picker */}
          <div>
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block mb-2">
              Arrival Time
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {['Now (Immediate)', 'In 15 mins', 'In 30 mins'].map((time) => (
                <button
                  key={time}
                  onClick={() => setStartSlot(time)}
                  className={`p-2 rounded-xl text-center border font-medium transition-all ${
                    startSlot === time
                      ? 'bg-white/10 text-white border-brandYellow'
                      : 'bg-[#0B0D10] text-gray-400 border-cardBorder'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Swiggy-Style Dining VIP Perk Section (if restaurant/cafe) */}
          {(spot.bayPerk || spot.parkingPerk || spot.swiggyPerk || spot.tag) && (
            <div className="border border-brandYellow/40 bg-gradient-to-br from-brandYellow/10 via-[#0B0D10] to-[#161920] rounded-2xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brandYellow/20 text-brandYellow flex items-center justify-center text-sm shadow-sm">
                    🛡️
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">
                        ParkNest Auto-Gate Clearance Included
                      </span>
                      <span className="text-[9px] bg-brandYellow/20 text-brandYellow font-extrabold px-1.5 py-0.5 rounded border border-brandYellow/30">
                        VERIFIED BAY
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-300 mt-0.5">
                      {spot.bayPerk || spot.parkingPerk || spot.swiggyPerk || 'Automatic barrier ANPR sensor scan & guaranteed slot reservation'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black text-brandYellow whitespace-nowrap">FREE</span>
              </div>
            </div>
          )}

          {/* 3. Swiggy-Style EV Add-On Section */}
          {spot.hasEV && spot.evDetails && (
            <div className="border border-neonGreen/40 bg-gradient-to-br from-neonGreen/10 via-[#0B0D10] to-[#161920] rounded-2xl p-4 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-neonGreen/20 text-neonGreen flex items-center justify-center border border-neonGreen/40">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">
                        Swiggy-Style EV Add-on
                      </span>
                      <span className="text-[9px] bg-neonGreen/20 text-neonGreen font-semibold px-1.5 py-0.5 rounded-full border border-neonGreen/30">
                        ⚡ LIVE DISCOVERY
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-300">
                      Charge while parked at ₹{spot.evDetails.chargerPrice}/hr
                    </p>
                  </div>
                </div>

                {/* Swiggy Style Toggle Switch */}
                <button
                  type="button"
                  onClick={() => setAddEV(!addEV)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                    addEV ? 'bg-neonGreen' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      addEV ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {addEV && (
                <div className="pt-2 border-t border-cardBorder/80 space-y-2 animate-in fade-in duration-150">
                  <div className="text-[11px] font-semibold text-gray-300">
                    Select EV Charger Speed:
                  </div>
                  <div className="space-y-2">
                    {spot.evDetails.types.map((charger, idx) => (
                      <div
                        key={charger.name}
                        onClick={() => setSelectedChargerIndex(idx)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          selectedChargerIndex === idx
                            ? 'bg-neonGreen/15 border-neonGreen text-white'
                            : 'bg-[#0B0D10] border-cardBorder text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              selectedChargerIndex === idx
                                ? 'border-neonGreen bg-neonGreen'
                                : 'border-gray-500'
                            }`}
                          >
                            {selectedChargerIndex === idx && (
                              <div className="w-1.5 h-1.5 rounded-full bg-black" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-200">
                              {charger.name}
                            </div>
                            <div className="text-[10px] text-gray-400">
                              Plug: {charger.plug} • {charger.speed}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-neonGreen">
                            +₹{charger.addOnPrice}/hr
                          </div>
                          <div className="text-[9px] text-emerald-400 font-medium">
                            {charger.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. Unified Checkout & Itemized Breakdown */}
          <div className="bg-[#0B0D10] border border-cardBorder rounded-2xl p-4 space-y-2.5">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Itemized Fare Breakdown</span>
              <span className="text-[10px] font-normal text-gray-400">GST 18% inclusive</span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-300">
              <span>
                Parking Slot ({spot.slotNumber} • {duration}h @ ₹{spot.basePrice}/h)
              </span>
              <span className="font-semibold text-white">₹{parkingFee}</span>
            </div>

            {addEV && spot.hasEV && (
              <div className="flex items-center justify-between text-xs text-neonGreen">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3" /> EV Session ({selectedCharger?.name} • {duration}h)
                </span>
                <span className="font-semibold">₹{evFee}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <span>ParkNest Platform Fee (15%)</span>
                <span className="text-[10px] bg-brandYellow/10 text-brandYellow px-1 rounded">
                  Secured Gate
                </span>
              </span>
              <span>₹{platformFee}</span>
            </div>

            <div className="pt-2 border-t border-cardBorder flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-400">Total Payable Amount</div>
                <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Barrier / Gate OTP auto-synced
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-extrabold text-white">
                  ₹{totalAmount}
                </div>
                <div className="text-[10px] text-gray-400">for {duration} hrs</div>
              </div>
            </div>
          </div>

          {/* UPI Payment selector */}
          <div>
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block mb-2">
              Pay using Instant UPI
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'gpay', label: 'Google Pay', badge: 'Fastest' },
                { id: 'phonepe', label: 'PhonePe', badge: 'AutoPay' },
                { id: 'paytm', label: 'Paytm / UPI', badge: 'Zero fee' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    paymentMethod === m.id
                      ? 'bg-brandYellow/15 border-brandYellow text-brandYellow font-bold'
                      : 'bg-[#0B0D10] border-cardBorder text-gray-400'
                  }`}
                >
                  <div className="text-xs">{m.label}</div>
                  <div className="text-[9px] opacity-75">{m.badge}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Action CTA */}
        <div className="sticky bottom-0 bg-[#161920]/95 backdrop-blur-md border-t border-cardBorder p-4">
          <button
            disabled={isProcessing}
            onClick={handlePayAndReserve}
            className="w-full py-3.5 px-4 bg-brandYellow hover:bg-brandYellow-hover text-black font-extrabold rounded-2xl flex items-center justify-center space-x-2 transition-all glow-yellow active:scale-98 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                <span>Authorizing UPI & Generating Gate OTP...</span>
              </>
            ) : (
              <>
                <span>Pay ₹{totalAmount} via UPI & Reserve</span>
                <ArrowRight className="w-4 h-4 ml-1 stroke-[3]" />
              </>
            )}
          </button>
          <div className="text-center text-[10px] text-gray-400 mt-2 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brandYellow" />
            <span>Instant gate access pass & security OTP issued upon payment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
