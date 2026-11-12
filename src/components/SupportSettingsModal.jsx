import React, { useState } from 'react';
import { 
  X, Settings, AlertTriangle, HelpCircle, Phone, MessageSquare, 
  Shield, Bell, Car, Check, ChevronDown, ChevronRight, FileText, 
  Camera, Send, CheckCircle2, RefreshCw, Smartphone, Download, Globe, Sparkles
} from 'lucide-react';

export default function SupportSettingsModal({ 
  isOpen, 
  onClose, 
  initialTab = 'settings',
  activeBooking,
  currentUser,
  theme,
  onToggleTheme,
  onShowToast
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'settings' | 'report' | 'help'

  // Settings State
  const [autoBarrier, setAutoBarrier] = useState(true);
  const [evAlerts, setEvAlerts] = useState(true);
  const [overstayWarnings, setOverstayWarnings] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedVehicle, setSelectedVehicle] = useState('Hyundai Ioniq 5 EV (TS 09 EB 4421)');

  // Report Issue State
  const [issueCategory, setIssueCategory] = useState('Bay Blocked / Someone in Slot');
  const [reportDetails, setReportDetails] = useState('');
  const [hasPhotoAttached, setHasPhotoAttached] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // FAQ Accordion Open State
  const [openFaq, setOpenFaq] = useState(null);

  if (!isOpen) return null;

  const issueCategories = [
    { id: 'bay', label: '🚫 Bay Blocked / Car in Slot' },
    { id: 'barrier', label: '🚧 Boom Barrier Stuck' },
    { id: 'ev', label: '⚡ EV Gun / Cable Stuck' },
    { id: 'billing', label: '💳 Double Deduction Dispute' },
    { id: 'safety', label: '⚠️ Guard / Security Issue' },
  ];

  const handleReportSubmit = (e) => {
    e.preventDefault();
    setIsSubmittingReport(true);
    setTimeout(() => {
      setIsSubmittingReport(false);
      const ticketId = `PN-TKT-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedTicket({
        id: ticketId,
        category: issueCategory,
        slot: activeBooking?.slot || 'Slot A12',
        time: 'Just now',
        status: 'DISPATCHED',
        assignedTo: 'DLF Gate 2 Guard (Bahadur Singh)',
        eta: '2 mins',
      });
      if (onShowToast) {
        onShowToast(`Ticket ${ticketId} dispatched to security guard!`);
      }
    }, 800);
  };

  const faqs = [
    {
      q: 'How does the automated boom barrier open?',
      a: 'ParkNest uses Smart RFID scanners and High-Speed ANPR (Automatic Number Plate Recognition). As you approach Gate 2, your number plate is verified, your gate OTP (4829) is logged, and the barrier lifts in under 2 seconds.',
    },
    {
      q: 'What if someone is already parked in my booked spot?',
      a: 'Use the "Report an Issue" tab right here. Our AI Conflict Engine immediately levies an overstay fine on the violator and automatically reroutes you to the adjacent VIP reserve slot with ₹50 apology credit.',
    },
    {
      q: 'How is EV charging billed?',
      a: 'You can choose between Slow AC (₹25/hr) or Fast DC (₹50/hr). Units are metered directly through the smart charger. The total is deducted from your linked ParkNest or UPI wallet upon session termination.',
    },
    {
      q: 'Can I cancel or extend my parking booking?',
      a: 'Free cancellation is allowed up to 15 minutes before your scheduled arrival. Extensions can be made with 1 tap in the "My Bookings" pass if the slot has no back-to-back reservation.',
    },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#161920] border-2 border-brandYellow/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-[#161920] border-b border-cardBorder px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-brandYellow text-black font-black flex items-center justify-center text-sm glow-yellow">
              ⚙️
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm">Support & Settings</h3>
              <p className="text-[10px] text-gray-400">ParkNest Hyderabad • 24x7 Help Desk</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#262A34] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs: Settings | Report Issue | Help Center */}
        <div className="bg-[#0B0D10] border-b border-cardBorder p-1.5 px-3 flex items-center justify-between gap-1">
          <button
            onClick={() => {
              setActiveTab('settings');
              setSubmittedTicket(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex-1 justify-center ${
              activeTab === 'settings'
                ? 'bg-brandYellow text-black shadow glow-yellow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex-1 justify-center ${
              activeTab === 'report'
                ? 'bg-demandRed text-white shadow glow-red'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Report Issue</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('help');
              setSubmittedTicket(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex-1 justify-center ${
              activeTab === 'help'
                ? 'bg-neonGreen text-black shadow glow-green'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help Desk</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* =========================================================
              1. SETTINGS TAB
             ========================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              {/* Theme & Appearance */}
              <div className="bg-[#0B0D10] border border-cardBorder rounded-2xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🎨</span>
                    <div>
                      <div className="font-bold text-white text-xs">App Theme</div>
                      <div className="text-[10px] text-gray-400">Switch between Dark and Light mode</div>
                    </div>
                  </div>
                  <button
                    onClick={onToggleTheme}
                    className="px-2.5 py-1 bg-[#161920] border border-cardBorder rounded-lg text-brandYellow font-bold text-[10px] flex items-center gap-1 active:scale-95"
                  >
                    <span>{theme === 'light' ? '☀️ Light' : '🌙 Dark'}</span>
                    <RefreshCw className="w-2.5 h-2.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-cardBorder/60">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-brandYellow" />
                    <div>
                      <div className="font-bold text-white text-xs">Language / భాష / भाषा</div>
                      <div className="text-[10px] text-gray-400">Hyderabad regional localization</div>
                    </div>
                  </div>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => {
                      setSelectedLanguage(e.target.value);
                      if (onShowToast) onShowToast(`Language set to ${e.target.value}`);
                    }}
                    className="bg-[#161920] border border-cardBorder text-gray-200 text-[10px] font-bold rounded-lg px-2 py-1 focus:outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Telugu">తెలుగు (Telugu)</option>
                    <option value="Hindi">हिंदी (Hindi)</option>
                  </select>
                </div>
              </div>

              {/* Smart Barrier & Gate Automation */}
              <div className="bg-[#0B0D10] border border-cardBorder rounded-2xl p-3.5 space-y-3">
                <div className="font-bold text-white text-xs flex items-center justify-between">
                  <span>Smart Barrier & Gate Automation</span>
                  <span className="text-[9px] bg-neonGreen/15 text-neonGreen font-bold px-1.5 py-0.5 rounded border border-neonGreen/30">
                    ANPR ACTIVE
                  </span>
                </div>

                {/* Auto Barrier Switch */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="font-semibold text-gray-200 text-xs">Auto Boom Barrier Clearance Lift</div>
                    <div className="text-[10px] text-gray-400">Clear gates instantly without showing QR code</div>
                  </div>
                  <button
                    onClick={() => {
                      setAutoBarrier(!autoBarrier);
                      if (onShowToast) onShowToast(`Auto Barrier ${!autoBarrier ? 'Enabled' : 'Disabled'}`);
                    }}
                    className={`w-10 h-5 rounded-full transition-colors p-0.5 flex items-center ${
                      autoBarrier ? 'bg-neonGreen justify-end' : 'bg-gray-700 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
                  </button>
                </div>

                {/* Registered Vehicles */}
                <div className="pt-2 border-t border-cardBorder/60 space-y-1.5">
                  <div className="text-[10px] text-gray-400 font-semibold">Active Registered Vehicle:</div>
                  <div className="bg-[#161920] border border-cardBorder rounded-xl p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-brandYellow" />
                      <div>
                        <div className="text-white font-bold text-[11px]">{selectedVehicle}</div>
                        <div className="text-[9px] text-gray-400">RFID Tag: NETC-ICICI-882190</div>
                      </div>
                    </div>
                    <span className="text-[9px] text-neonGreen font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Default
                    </span>
                  </div>
                </div>
              </div>

              {/* Push Notifications & Overstay Warning */}
              <div className="bg-[#0B0D10] border border-cardBorder rounded-2xl p-3.5 space-y-2.5">
                <div className="font-bold text-white text-xs">Alerts & Notifications</div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-200 text-[11px] font-semibold">15-Min Overstay Warning</div>
                    <div className="text-[10px] text-gray-400">Prevents ₹100 overstay fine</div>
                  </div>
                  <button
                    onClick={() => setOverstayWarnings(!overstayWarnings)}
                    className={`w-9 h-4.5 rounded-full transition-colors p-0.5 flex items-center ${
                      overstayWarnings ? 'bg-brandYellow justify-end' : 'bg-gray-700 justify-start'
                    }`}
                  >
                    <div className="w-3.5 h-3.5 rounded-full bg-black"></div>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="text-gray-200 text-[11px] font-semibold">EV 80% Full Charge Push Alert</div>
                    <div className="text-[10px] text-gray-400">Alerts when battery reaches optimal charge</div>
                  </div>
                  <button
                    onClick={() => setEvAlerts(!evAlerts)}
                    className={`w-9 h-4.5 rounded-full transition-colors p-0.5 flex items-center ${
                      evAlerts ? 'bg-neonGreen justify-end' : 'bg-gray-700 justify-start'
                    }`}
                  >
                    <div className="w-3.5 h-3.5 rounded-full bg-black"></div>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="text-gray-200 text-[11px] font-semibold">Gate Entry & Exit SMS</div>
                    <div className="text-[10px] text-gray-400">Instant SMS with boom barrier timestamp</div>
                  </div>
                  <button
                    onClick={() => setSmsAlerts(!smsAlerts)}
                    className={`w-9 h-4.5 rounded-full transition-colors p-0.5 flex items-center ${
                      smsAlerts ? 'bg-brandYellow justify-end' : 'bg-gray-700 justify-start'
                    }`}
                  >
                    <div className="w-3.5 h-3.5 rounded-full bg-black"></div>
                  </button>
                </div>
              </div>

              {/* Tax Invoices & App Version */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0D10] border border-cardBorder text-gray-400 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-brandYellow" />
                  <span>Download GST Parking Invoice (PDF)</span>
                </div>
                <button
                  onClick={() => {
                    if (onShowToast) onShowToast('Invoice PDF downloaded: GST-HYD-88219.pdf');
                  }}
                  className="text-brandYellow hover:underline font-bold flex items-center gap-0.5"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>

              <div className="text-center text-[10px] text-gray-500 font-mono">
                ParkNest Hyderabad • Version 2.4.0 (Build 2026.11)
              </div>
            </div>
          )}

          {/* =========================================================
              2. REPORT AN ISSUE TAB
             ========================================================= */}
          {activeTab === 'report' && (
            <div className="space-y-4">
              {submittedTicket ? (
                /* Ticket Success State */
                <div className="bg-gradient-to-br from-emerald-950/80 via-[#161920] to-[#0B0D10] border border-neonGreen/60 rounded-3xl p-5 text-center space-y-3.5 animate-in zoom-in-95">
                  <div className="w-12 h-12 rounded-full bg-neonGreen/20 text-neonGreen mx-auto flex items-center justify-center border border-neonGreen">
                    <CheckCircle2 className="w-6 h-6 stroke-[3]" />
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-neonGreen tracking-wider bg-neonGreen/10 px-2 py-0.5 rounded-full border border-neonGreen/30">
                      TICKET {submittedTicket.id}
                    </span>
                    <h4 className="text-base font-black text-white mt-1">Guard Dispatched!</h4>
                    <p className="text-xs text-gray-300 mt-1">
                      {submittedTicket.assignedTo} has been notified and is heading to {submittedTicket.slot}.
                    </p>
                  </div>

                  <div className="bg-[#0B0D10] border border-cardBorder rounded-2xl p-3 text-left space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-400">
                      <span>Issue:</span>
                      <span className="text-white font-semibold truncate max-w-[200px]">{submittedTicket.category}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Location:</span>
                      <span className="text-brandYellow font-bold">{submittedTicket.slot} • DLF Gate 2</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Response SLA:</span>
                      <span className="text-neonGreen font-bold">Estimated {submittedTicket.eta}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-brandYellow/10 border border-brandYellow/30 text-[10px] text-amber-200 text-left flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brandYellow flex-shrink-0" />
                    <span>A ₹50 inconvenience credit has been automatically credited to your ParkNest wallet.</span>
                  </div>

                  <button
                    onClick={() => setSubmittedTicket(null)}
                    className="w-full py-2.5 bg-[#262A34] hover:bg-gray-700 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Report Another Issue
                  </button>
                </div>
              ) : (
                /* Report Submission Form */
                <form onSubmit={handleReportSubmit} className="space-y-3.5">
                  <div className="bg-[#0B0D10] border border-cardBorder rounded-2xl p-3.5 space-y-3">
                    <div className="text-[11px] text-gray-300 font-bold">
                      What issue are you facing at the parking spot?
                    </div>

                    {/* Category Selection Pills */}
                    <div className="space-y-1.5">
                      {issueCategories.map((cat) => (
                        <div
                          key={cat.id}
                          onClick={() => setIssueCategory(cat.label)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            issueCategory === cat.label
                              ? 'bg-demandRed/15 border-demandRed text-white font-bold'
                              : 'bg-[#161920] border-cardBorder text-gray-400 hover:text-white'
                          }`}
                        >
                          <span className="text-xs">{cat.label}</span>
                          {issueCategory === cat.label && (
                            <div className="w-2 h-2 rounded-full bg-demandRed animate-pulse"></div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Active Booking Ref */}
                    <div className="pt-2 border-t border-cardBorder/60 flex items-center justify-between text-[11px]">
                      <span className="text-gray-400">Current Slot Ref:</span>
                      <span className="text-brandYellow font-mono font-bold">
                        {activeBooking?.slot || 'Slot A12'} • DLF Gate 2
                      </span>
                    </div>

                    {/* Detailed Notes */}
                    <div className="space-y-1 pt-1">
                      <label className="text-[10px] text-gray-400 uppercase font-semibold">
                        Describe what happened (optional):
                      </label>
                      <textarea
                        value={reportDetails}
                        onChange={(e) => setReportDetails(e.target.value)}
                        placeholder="e.g. White Swift Dzire (TS 07...) is parked across bay A12 blocking access..."
                        rows={3}
                        className="w-full bg-[#161920] border border-cardBorder rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-demandRed"
                      />
                    </div>

                    {/* Photo Proof Attachment */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-[11px] text-gray-300 flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-brandYellow" />
                        <span>Attach Bay / Gate Photo:</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setHasPhotoAttached(!hasPhotoAttached);
                          if (onShowToast) onShowToast(hasPhotoAttached ? 'Photo removed' : '📸 Bay photo attached');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                          hasPhotoAttached
                            ? 'bg-neonGreen/20 border-neonGreen text-neonGreen'
                            : 'bg-[#161920] border-cardBorder text-gray-400 hover:text-white'
                        }`}
                      >
                        {hasPhotoAttached ? '✓ Photo Attached' : '+ Upload Photo'}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReport}
                    className="w-full py-3 bg-demandRed hover:bg-demandRed-hover text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg glow-red transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSubmittingReport ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Notifying DLF Security Guard...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Report & Call Guard</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* =========================================================
              3. 24x7 HELP DESK & FAQS TAB
             ========================================================= */}
          {activeTab === 'help' && (
            <div className="space-y-4">
              {/* Emergency DLF Guard Hotline */}
              <div className="bg-gradient-to-r from-amber-500/15 via-[#161920] to-[#0B0D10] border border-brandYellow/40 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brandYellow text-black flex items-center justify-center font-bold">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">24x7 DLF Gate 2 Guard Desk</h4>
                    <p className="text-[10px] text-gray-400">Chief Guard Bahadur Singh on duty</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <a
                    href="tel:+914068291100"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onShowToast) onShowToast('Calling DLF Gate 2 Security Booth: 040-6829-1100');
                    }}
                    className="flex-1 py-2 bg-brandYellow hover:bg-brandYellow-hover text-black font-extrabold rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors shadow text-[11px]"
                  >
                    <Phone className="w-3.5 h-3.5 fill-current" />
                    <span>Call Guard</span>
                  </a>

                  <a
                    href="https://wa.me/919849088214"
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onShowToast) onShowToast('Opening WhatsApp Help Desk (+91 98490 88214)...');
                    }}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors shadow text-[11px]"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* FAQs Accordion */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-gray-300 px-1">Frequently Asked Questions</div>

                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0B0D10] border border-cardBorder rounded-2xl overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full p-3 text-left font-semibold text-white flex items-center justify-between text-xs hover:text-brandYellow transition-colors"
                    >
                      <span className="pr-2">{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${
                          openFaq === idx ? 'rotate-180 text-brandYellow' : ''
                        }`}
                      />
                    </button>

                    {openFaq === idx && (
                      <div className="px-3 pb-3 text-[11px] text-gray-300 leading-relaxed border-t border-cardBorder/60 pt-2 animate-in fade-in">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Hyderabad Municipal Help Note */}
              <div className="p-3 rounded-2xl bg-[#0B0D10] border border-cardBorder text-[10px] text-gray-400 space-y-1">
                <div className="text-white font-bold flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-neonGreen" />
                  <span>GHMC & Cyberabad Police Certified</span>
                </div>
                <p>
                  All ParkNest bays are verified in accordance with Telangana Smart City Infrastructure standards.
                  Emergency SOS: Dial 100 or 112.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
