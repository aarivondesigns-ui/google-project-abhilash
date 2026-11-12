import React, { useState } from 'react';
import { 
  X, UserCheck, ShieldCheck, Car, Building2, KeyRound, 
  CheckCircle2, Copy, ArrowRight, Zap, Star, ExternalLink, Sparkles 
} from 'lucide-react';

export default function CredentialsModal({ currentRole, onSelectPersona, onClose }) {
  const [copiedId, setCopiedId] = useState(null);

  const personas = [
    {
      id: 'driver-rohit',
      role: 'driver',
      name: 'Rohit Varma',
      title: 'EV Driver & Tech Lead',
      company: 'WaveRock IT Park, Hyderabad',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      badge: 'VERIFIED DRIVER',
      badgeColor: '#10B981',
      details: [
        { label: 'Vehicle', value: 'Hyundai Ioniq 5 (TS 09 EB 4421)' },
        { label: 'RFID Tag ID', value: 'NETC-ICICI-882190' },
        { label: 'UPI AutoPay', value: 'rohit.varma@okhdfcbank' },
        { label: 'Gate Access', value: 'DLF Basement Slot A12' },
      ],
      description: 'Daily commuter from Jubilee Hills to Financial District. Uses smart boom barrier auto-debit.',
    },
    {
      id: 'host-ananya',
      role: 'host',
      name: 'Ananya Reddy',
      title: 'Airbnb & Driveway SuperHost',
      company: 'Road No. 36, Jubilee Hills',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      badge: 'SUPERHOST ★ 4.9',
      badgeColor: '#F5B800',
      details: [
        { label: 'Property', value: 'Villa 14 Gated Driveway' },
        { label: 'Payout UPI', value: 'ananya.reddy@okaxis' },
        { label: 'Listed Spots', value: '2 Spots (₹20/hr & ₹40/hr)' },
        { label: 'Today Revenue', value: '₹640.00' },
      ],
      description: 'Lists private bungalow driveway during work hours. Earns passive income via automated gate OTPs.',
    },
    {
      id: 'guard-security',
      role: 'driver',
      name: 'Bahadur Singh',
      title: 'Head Gate Security Guard',
      company: 'DLF Cybercity Gate 2, Gachibowli',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      badge: 'SECURITY CHIEF',
      badgeColor: '#3B82F6',
      details: [
        { label: 'Post', value: 'Boom Barrier Inbound Gate 2' },
        { label: 'Gate OTP', value: '4829 (Valid Slot A12)' },
        { label: 'ANPR Cam', value: 'Optical Cam #04 Active' },
        { label: 'Gate Sensor', value: 'Auto-Scanner 865 MHz' },
      ],
      description: 'Verifies 4-digit ParkNest OTP and scans digital QR codes at apartment and office boom barriers.',
    },
  ];

  const handleCopy = (val, id) => {
    navigator.clipboard?.writeText(val);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#161920] border-2 border-brandYellow/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#161920] border-b border-cardBorder px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brandYellow/20 text-brandYellow flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-brandYellow uppercase tracking-wider flex items-center gap-1.5">
                <span>Hackathon Demo Credentials</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brandYellow"></span>
                <span className="text-gray-400">1-Tap Switch</span>
              </div>
              <h2 className="text-sm font-extrabold text-white">
                Test Personas & Digital ID Badges
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#262A34] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Persona Cards Container */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          <p className="text-xs text-gray-400 leading-relaxed">
            Click any persona card below to instantly adopt their credentials, load their verified photos, vehicle registrations, and live gate access keys:
          </p>

          <div className="space-y-3.5">
            {personas.map((persona) => {
              const isActive =
                (persona.role === 'host' && currentRole === 'host') ||
                (persona.role === 'driver' && currentRole === 'driver' && persona.id === 'driver-rohit');

              return (
                <div
                  key={persona.id}
                  className={`bg-[#0B0D10] border rounded-2xl p-4 transition-all relative overflow-hidden group ${
                    isActive
                      ? 'border-brandYellow shadow-lg glow-yellow ring-1 ring-brandYellow/50'
                      : 'border-cardBorder hover:border-gray-500'
                  }`}
                >
                  {/* Photo & Identity Row */}
                  <div className="flex items-start gap-3.5">
                    {/* User Photo */}
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-cardBorder group-hover:border-brandYellow transition-colors shadow">
                      <img
                        src={persona.photo}
                        alt={persona.name}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute bottom-0 inset-x-0 text-[8px] font-black uppercase text-center py-0.5"
                        style={{ backgroundColor: persona.badgeColor, color: '#000000' }}
                      >
                        {persona.role}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-white">{persona.name}</h4>
                        <span
                          className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
                          style={{
                            backgroundColor: `${persona.badgeColor}20`,
                            color: persona.badgeColor,
                            border: `1px solid ${persona.badgeColor}40`,
                          }}
                        >
                          {persona.badge}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-gray-300 mt-0.5">
                        {persona.title}
                      </div>
                      <div className="text-[10px] text-gray-400 truncate">
                        {persona.company}
                      </div>
                    </div>
                  </div>

                  {/* Credentials Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-cardBorder/70 text-xs">
                    {persona.details.map((d) => (
                      <div
                        key={d.label}
                        onClick={() => handleCopy(d.value, `${persona.id}-${d.label}`)}
                        className="bg-[#161920] p-2 rounded-xl border border-cardBorder/60 cursor-pointer hover:border-brandYellow/50 transition-colors"
                        title="Click to copy"
                      >
                        <div className="text-[9px] text-gray-400 font-medium flex items-center justify-between">
                          <span>{d.label}</span>
                          {copiedId === `${persona.id}-${d.label}` ? (
                            <CheckCircle2 className="w-3 h-3 text-neonGreen" />
                          ) : (
                            <Copy className="w-2.5 h-2.5 opacity-60" />
                          )}
                        </div>
                        <div className="font-mono text-[11px] font-bold text-white truncate mt-0.5">
                          {d.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Persona description */}
                  <p className="text-[10px] text-gray-400 mt-2.5 italic">
                    "{persona.description}"
                  </p>

                  {/* 1-Click Action Button */}
                  <button
                    onClick={() => {
                      onSelectPersona(persona);
                      onClose();
                    }}
                    className={`mt-3 w-full py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98 ${
                      persona.role === 'host'
                        ? 'bg-neonGreen hover:bg-neonGreen-hover text-black glow-green'
                        : 'bg-brandYellow hover:bg-brandYellow-hover text-black glow-yellow'
                    }`}
                  >
                    <span>Use {persona.name}'s Credentials</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0B0D10] border-t border-cardBorder p-3 text-center">
          <button
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Dismiss & Keep Current Profile
          </button>
        </div>
      </div>
    </div>
  );
}
