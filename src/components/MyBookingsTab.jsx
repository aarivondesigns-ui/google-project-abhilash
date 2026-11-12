import React, { useState, useEffect } from 'react';
import { 
  QrCode, KeyRound, Navigation, Phone, Clock, AlertTriangle, 
  CheckCircle2, Zap, Shield, ArrowUpRight, Copy, Share2, Sparkles, AlertOctagon, Camera 
} from 'lucide-react';
import OverstaySimulationModal from './OverstaySimulationModal';
import PhotoModal from './PhotoModal';
import { triggerOverstayInDB } from '../api/client';

export default function MyBookingsTab({ activeBooking, onUpdateBooking, onNavigateToExplore, onOpenReportIssue }) {
  const [showOverstayModal, setShowOverstayModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [countdownMinutes, setCountdownMinutes] = useState(activeBooking?.remainingMinutes || 47);
  const [countdownSeconds, setCountdownSeconds] = useState(30);

  // Live timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((sec) => {
        if (sec > 0) return sec - 1;
        setCountdownMinutes((min) => (min > 0 ? min - 1 : 0));
        return 59;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleResolveConflict = async () => {
    try {
      await triggerOverstayInDB(activeBooking.bookingId);
    } catch (e) {}
    onUpdateBooking({
      ...activeBooking,
      overstaySimulated: true,
      overstayFine: 145,
    });
  };

  if (!activeBooking) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#161920] border border-cardBorder flex items-center justify-center text-gray-400 mb-4">
          <KeyRound className="w-8 h-8 text-brandYellow" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">No Active Booking Pass</h3>
        <p className="text-xs text-gray-400 max-w-xs mb-5">
          You don't have an ongoing parking or EV session right now. Explore spots around Hyderabad to reserve one.
        </p>
        <button
          onClick={onNavigateToExplore}
          className="px-5 py-2.5 bg-brandYellow hover:bg-brandYellow-hover text-black font-extrabold rounded-xl text-xs glow-yellow transition-all"
        >
          Explore Parking Spots
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-24">
      {/* Hackathon Judge Banner for Overstay Simulator */}
      <div className="bg-gradient-to-r from-demandRed/25 via-[#161920] to-demandRed/20 border-2 border-demandRed/70 rounded-2xl p-3.5 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-demandRed/30 text-demandRed flex items-center justify-center flex-shrink-0 animate-pulse mt-0.5">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-demandRed bg-demandRed/20 px-1.5 py-0.5 rounded">
                  Judges Demo Tool
                </span>
                <span className="text-xs font-bold text-white">Overstay & Dispute Simulator</span>
              </div>
              <p className="text-[11px] text-gray-300 mt-1 leading-snug">
                Simulate what happens when Driver 1 stays beyond time: auto-penalizes Driver 1 & instantly reroutes Order #2.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowOverstayModal(true)}
          className="mt-3 w-full py-2 px-3 bg-demandRed hover:bg-demandRed-hover text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 glow-red transition-all active:scale-98 shadow-md"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Simulate Overstay / Conflict Demo</span>
        </button>
      </div>

      {/* Active Pass Card */}
      <div className="bg-[#161920] border border-cardBorder rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        {/* Top pass badge */}
        <div className="flex items-center justify-between border-b border-cardBorder pb-3.5">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neonGreen animate-ping-slow"></span>
            <span className="text-xs font-black uppercase tracking-wider text-neonGreen">
              Active Gate Pass
            </span>
            <span className="text-[10px] text-gray-500">• {activeBooking.bookingId}</span>
          </div>

          <div className="bg-[#0B0D10] px-2.5 py-1 rounded-full border border-cardBorder text-[11px] font-mono text-brandYellow flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>
              {String(countdownMinutes).padStart(2, '0')}:{String(countdownSeconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Spot Details Header */}
        <div className="mt-4">
          <div className="text-[11px] font-bold text-brandYellow uppercase tracking-wider">
            {activeBooking.type}
          </div>
          <h2 className="text-lg font-black text-white leading-tight mt-0.5">
            {activeBooking.spotTitle}
          </h2>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <span>📍 {activeBooking.location}</span>
          </p>
        </div>

        {/* Gate Check-In: QR Code & 4-Digit OTP */}
        <div className="my-5 p-4 bg-[#0B0D10] border border-cardBorder rounded-2xl flex flex-col items-center text-center space-y-4">
          <div className="text-xs font-semibold text-gray-300">
            Show this OTP or scan QR at the apartment/office security gate or boom barrier to enter.
          </div>

          {/* High-res Scannable SVG QR Code */}
          <div className="p-3 bg-white rounded-2xl shadow-xl flex items-center justify-center relative group">
            <svg
              className="w-40 h-40"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer square frames */}
              <rect width="120" height="120" fill="white" />
              {/* Top-Left Finder */}
              <rect x="10" y="10" width="30" height="30" rx="4" fill="black" />
              <rect x="15" y="15" width="20" height="20" rx="2" fill="white" />
              <rect x="20" y="20" width="10" height="10" rx="1" fill="black" />

              {/* Top-Right Finder */}
              <rect x="80" y="10" width="30" height="30" rx="4" fill="black" />
              <rect x="85" y="15" width="20" height="20" rx="2" fill="white" />
              <rect x="90" y="20" width="10" height="10" rx="1" fill="black" />

              {/* Bottom-Left Finder */}
              <rect x="10" y="80" width="30" height="30" rx="4" fill="black" />
              <rect x="15" y="85" width="20" height="20" rx="2" fill="white" />
              <rect x="20" y="90" width="10" height="10" rx="1" fill="black" />

              {/* Simulated QR data grid */}
              <rect x="50" y="12" width="6" height="6" fill="black" />
              <rect x="62" y="12" width="6" height="6" fill="black" />
              <rect x="50" y="24" width="6" height="6" fill="black" />
              <rect x="58" y="32" width="6" height="6" fill="black" />
              <rect x="70" y="24" width="6" height="6" fill="black" />
              <rect x="12" y="50" width="6" height="6" fill="black" />
              <rect x="24" y="50" width="6" height="6" fill="black" />
              <rect x="36" y="50" width="6" height="6" fill="black" />
              <rect x="48" y="50" width="6" height="6" fill="black" />
              <rect x="60" y="50" width="6" height="6" fill="black" />
              <rect x="72" y="50" width="6" height="6" fill="black" />
              <rect x="84" y="50" width="6" height="6" fill="black" />
              <rect x="96" y="50" width="6" height="6" fill="black" />

              <rect x="50" y="62" width="6" height="6" fill="black" />
              <rect x="64" y="62" width="6" height="6" fill="black" />
              <rect x="78" y="62" width="6" height="6" fill="black" />
              <rect x="90" y="62" width="6" height="6" fill="black" />

              <rect x="50" y="74" width="6" height="6" fill="black" />
              <rect x="64" y="80" width="6" height="6" fill="black" />
              <rect x="76" y="90" width="6" height="6" fill="black" />
              <rect x="92" y="78" width="6" height="6" fill="black" />
              <rect x="104" y="88" width="6" height="6" fill="black" />
              <rect x="60" y="100" width="6" height="6" fill="black" />
              <rect x="85" y="102" width="6" height="6" fill="black" />

              {/* Center ParkNest mini brand emblem */}
              <circle cx="60" cy="60" r="10" fill="#F5B800" />
              <text x="56" y="64" fill="black" fontSize="11" fontWeight="900" fontFamily="sans-serif">
                P
              </text>
            </svg>
          </div>

          {/* 4-Digit Gate OTP Pill */}
          <div className="w-full">
            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
              4-Digit Security Gate OTP
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="font-mono text-3xl font-black text-brandYellow tracking-widest bg-[#161920] border-2 border-brandYellow/50 px-6 py-2 rounded-2xl shadow-lg glow-yellow">
                {activeBooking.gateOTP}
              </div>
              <button
                onClick={() => copyToClipboard(activeBooking.gateOTP)}
                className="w-10 h-10 rounded-xl bg-[#161920] border border-cardBorder flex items-center justify-center text-gray-300 hover:text-white transition-all active:scale-95"
                title="Copy OTP"
              >
                {copiedOtp ? (
                  <CheckCircle2 className="w-4 h-4 text-neonGreen" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            {copiedOtp && (
              <span className="text-[10px] text-neonGreen mt-1 block">OTP copied to clipboard!</span>
            )}
          </div>
        </div>

        {/* EV Add-On Indicator if active */}
        {activeBooking.hasEVAddon && (
          <div className="mb-4 p-3 rounded-2xl bg-neonGreen/10 border border-neonGreen/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-neonGreen/20 text-neonGreen flex items-center justify-center">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">EV Charger Session Active</div>
                <div className="text-[10px] text-gray-300">{activeBooking.evChargerType || 'Fast Charger'}</div>
              </div>
            </div>
            <span className="text-[10px] bg-neonGreen/20 text-neonGreen font-bold px-2 py-0.5 rounded-full border border-neonGreen/30">
              ⚡ LIVE
            </span>
          </div>
        )}

        {/* Overstay Penalty Alert notice if simulated */}
        {activeBooking.overstaySimulated && (
          <div className="mb-4 p-3 rounded-2xl bg-demandRed/15 border border-demandRed/50 space-y-1">
            <div className="text-xs font-bold text-demandRed flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Overstay Penalty Debited</span>
            </div>
            <p className="text-[11px] text-gray-300">
              ₹145 debited from linked UPI (+₹100 fine & surge). Please vacate slot to clear gate exit.
            </p>
          </div>
        )}

        {/* Quick Driver Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => {
              alert(`Opening Google Maps navigation to: ${activeBooking.location}`);
            }}
            className="py-3 px-3 rounded-xl bg-brandYellow hover:bg-brandYellow-hover text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all glow-yellow active:scale-95"
          >
            <Navigation className="w-4 h-4" />
            <span>Navigate in Maps</span>
          </button>

          <button
            onClick={() => {
              alert(`Calling Security Gate Guard for ${activeBooking.slotNumber}...`);
            }}
            className="py-3 px-3 rounded-xl bg-[#0B0D10] hover:bg-[#262A34] text-white border border-cardBorder font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Call Security Gate</span>
          </button>
        </div>

        {/* Clickable Photo Inspection Button */}
        <button
          onClick={() => setShowPhotoModal(true)}
          className="mt-2.5 w-full py-2.5 px-3 rounded-xl bg-[#0B0D10] hover:bg-[#262A34] text-gray-200 border border-cardBorder text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
        >
          <Camera className="w-3.5 h-3.5 text-brandYellow" />
          <span>📸 View Security Gate & Bay Photo Proof</span>
        </button>
      </div>

      {/* Booking summary breakdown */}
      <div className="bg-[#161920] border border-cardBorder rounded-2xl p-4 space-y-2 text-xs">
        <div className="font-bold text-gray-300 uppercase tracking-wider text-[11px]">
          Booking Information
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Assigned Slot</span>
          <span className="text-white font-semibold">{activeBooking.slotNumber}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Paid Total</span>
          <span className="text-brandYellow font-bold">₹{activeBooking.paidTotal}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Payment Mode</span>
          <span className="text-white">UPI Instant AutoPay</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Gate Pass Validity</span>
          <span className="text-emerald-400 font-medium">Valid until {activeBooking.endTime}</span>
        </div>

        {/* 1-Tap Incident Report Link */}
        <div className="pt-2 border-t border-cardBorder/60">
          <button
            onClick={onOpenReportIssue}
            className="w-full py-2 px-3 rounded-xl bg-demandRed/10 hover:bg-demandRed/20 text-demandRed border border-demandRed/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Facing an issue? Report Slot or Gate Problem</span>
          </button>
        </div>
      </div>

      {/* Modal Dialog */}
      {showOverstayModal && (
        <OverstaySimulationModal
          booking={activeBooking}
          onClose={() => setShowOverstayModal(false)}
          onResolveConflict={handleResolveConflict}
        />
      )}

      {/* Photo Inspection Modal */}
      {showPhotoModal && (
        <PhotoModal
          title={activeBooking.spotTitle}
          spot={{
            name: activeBooking.spotTitle,
            hasEV: activeBooking.hasEVAddon,
            image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
          }}
          onClose={() => setShowPhotoModal(false)}
        />
      )}
    </div>
  );
}
