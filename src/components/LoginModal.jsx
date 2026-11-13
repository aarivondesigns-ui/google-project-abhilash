import React, { useState } from 'react';
import { 
  X, ArrowRight, CheckCircle2, Car, Bell, RefreshCw 
} from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [loginMode, setLoginMode] = useState('quick'); // 'quick' | 'phone'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState(1); // 1: phone input, 2: OTP verification
  const [otpDigits, setOtpDigits] = useState(['5', '8', '2', '1']);
  const [simulatedSms, setSimulatedSms] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-configured Test Personas & Credentials
  const credentials = [
    {
      id: 'driver-rohit',
      role: 'driver',
      name: 'Rohit Varma',
      phone: '+91 98490 88214',
      badge: 'VERIFIED DRIVER',
      badgeColor: '#10B981',
      title: 'EV Driver (Tech Lead @ WaveRock)',
      vehicle: 'Hyundai Ioniq 5 EV (TS 09 EB 4421)',
      fastagId: 'NETC-ICICI-882190',
      walletBalance: 850,
      upiId: 'rohit.varma@okhdfcbank',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'host-ananya',
      role: 'host',
      name: 'Ananya Reddy',
      phone: '+91 98765 43210',
      badge: 'SUPERHOST ★ 4.9',
      badgeColor: '#F5B800',
      title: 'Driveway Host (Villa 14, Jubilee Hills)',
      vehicle: 'Mercedes C-Class (TS 08 FA 1122)',
      fastagId: 'NETC-HDFC-310452',
      walletBalance: 640,
      upiId: 'ananya.reddy@okaxis',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'guard-bahadur',
      role: 'driver',
      name: 'Bahadur Singh',
      phone: '+91 99000 11223',
      badge: 'DLF SECURITY GUARD',
      badgeColor: '#3B82F6',
      title: 'Gate 2 Boom Barrier Security Chief',
      vehicle: 'Security Patrol (TS 09 DLF 02)',
      fastagId: 'NETC-ANPR-GATE02',
      walletBalance: 200,
      upiId: 'dlf.security@upi',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
  ];

  if (!isOpen) return null;

  // 1-Tap Quick Persona Login
  const handleSelectCredential = (persona) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(persona);
      onClose();
    }, 600);
  };

  // Manual Phone Number Flow
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phoneNumber.length < 10) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(2);
      setSimulatedSms('💬 SMS: Your ParkNest login code is 5821. Valid for 10 mins.');
    }, 800);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const customUser = {
        id: `user-${Date.now()}`,
        role: 'driver',
        name: `Driver (${phoneNumber.slice(-4)})`,
        phone: `+91 ${phoneNumber}`,
        badge: 'REGISTERED DRIVER',
        badgeColor: '#10B981',
        title: 'Hyderabad Driver',
        vehicle: 'Car (TS 09 HYD 9999)',
        fastagId: 'NETC-NEW-112233',
        walletBalance: 500,
        upiId: `${phoneNumber}@upi`,
        photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      };
      onLoginSuccess(customUser);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#161920] border-2 border-brandYellow/70 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-[#161920] border-b border-cardBorder px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-brandYellow text-black font-black flex items-center justify-center text-sm glow-yellow">
              P
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-sm">
                  Park<span className="text-brandYellow">Nest</span>
                </span>
                <span className="text-[9px] bg-brandYellow/15 text-brandYellow font-extrabold px-1.5 py-0.2 rounded border border-brandYellow/30">
                  LOGIN
                </span>
              </div>
              <div className="text-[10px] text-gray-400">Hyderabad P2P Parking & EV Network</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#262A34] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Simulated Incoming SMS Toast if OTP requested */}
        {simulatedSms && (
          <div className="bg-emerald-950/90 border-b border-neonGreen/40 p-2.5 px-4 text-xs text-emerald-200 flex items-center gap-2 animate-in slide-in-from-top-2">
            <Bell className="w-4 h-4 text-neonGreen animate-bounce flex-shrink-0" />
            <span className="font-mono text-[11px] font-bold">{simulatedSms}</span>
          </div>
        )}

        {/* Tab Switcher: 1-Tap Credentials vs Mobile OTP */}
        <div className="bg-[#0B0D10] border-b border-cardBorder p-2 px-4 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-gray-400">Select Login Method:</span>
          <div className="flex bg-[#161920] p-1 rounded-xl border border-cardBorder space-x-1 text-xs">
            <button
              onClick={() => {
                setLoginMode('quick');
                setStep(1);
              }}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                loginMode === 'quick'
                  ? 'bg-brandYellow text-black shadow glow-yellow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              1-Tap Credentials
            </button>
            <button
              onClick={() => setLoginMode('phone')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                loginMode === 'phone'
                  ? 'bg-brandYellow text-black shadow glow-yellow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Phone + OTP
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {loginMode === 'quick' ? (
            /* 1. 1-TAP TEST CREDENTIALS PHOTO CARDS */
            <div className="space-y-3">
              <div className="text-[11px] text-gray-300 font-medium">
                Tap any test persona to log in immediately with realistic Hyderabad credentials, verified vehicles & gate keys:
              </div>

              {credentials.map((persona) => (
                <div
                  key={persona.id}
                  onClick={() => handleSelectCredential(persona)}
                  className="p-3.5 rounded-2xl bg-[#0B0D10] border border-cardBorder hover:border-brandYellow cursor-pointer transition-all hover:scale-[1.01] shadow-md group relative overflow-hidden"
                >
                  <div className="flex items-start gap-3">
                    {/* Persona Photo Thumbnail */}
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-cardBorder group-hover:border-brandYellow transition-colors shadow">
                      <img
                        src={persona.photo}
                        alt={persona.name}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute bottom-0 inset-x-0 text-[7px] font-black uppercase text-center py-0.5 text-black"
                        style={{ backgroundColor: persona.badgeColor }}
                      >
                        {persona.role}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-white group-hover:text-brandYellow transition-colors">
                          {persona.name}
                        </h4>
                        <span
                          className="text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase"
                          style={{
                            backgroundColor: `${persona.badgeColor}20`,
                            color: persona.badgeColor,
                            border: `1px solid ${persona.badgeColor}40`,
                          }}
                        >
                          {persona.badge}
                        </span>
                      </div>

                      <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                        {persona.phone}
                      </div>
                      <div className="text-[10px] text-gray-300 font-semibold truncate mt-0.5">
                        {persona.vehicle}
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-cardBorder/70 flex items-center justify-between text-[10px]">
                        <span className="text-gray-400">RFID: {persona.fastagId}</span>
                        <span className="text-brandYellow font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                          <span>Log In</span>
                          <ArrowRight className="w-3 h-3 stroke-[3]" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 2. MANUAL PHONE NUMBER + OTP FLOW */
            <div className="space-y-4">
              {step === 1 ? (
                <form onSubmit={handleSendOtp} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block mb-1.5">
                      Enter Mobile Number
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-bold text-gray-400">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        maxLength="10"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="98490 12345"
                        autoFocus
                        className="w-full bg-[#0B0D10] border border-cardBorder rounded-xl pl-16 pr-4 py-3 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-brandYellow"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      We'll send an instant 4-digit SMS OTP for gate boom barrier authorization.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={phoneNumber.length !== 10 || isSubmitting}
                    className="w-full py-3 bg-brandYellow hover:bg-brandYellow-hover text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 glow-yellow transition-all disabled:opacity-40"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Get 4-Digit OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Enter 4-Digit OTP
                      </label>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-[10px] text-brandYellow hover:underline"
                      >
                        Change +91 {phoneNumber}
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2.5">
                      {otpDigits.map((digit, idx) => (
                        <div
                          key={idx}
                          className="h-14 bg-[#0B0D10] border-2 border-brandYellow rounded-2xl flex items-center justify-center text-xl font-mono font-black text-white shadow-inner"
                        >
                          {digit}
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-emerald-400 mt-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Auto-filled from SMS notification (5821)
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-neonGreen hover:bg-neonGreen-hover text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 glow-green transition-all"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Verify & Enter ParkNest</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#0B0D10] border-t border-cardBorder p-3 text-center">
          <p className="text-[10px] text-gray-500">
            By continuing, you agree to ParkNest Gate Access & AutoPay Terms.
          </p>
        </div>
      </div>
    </div>
  );
}
