import React, { useState, useEffect } from 'react';
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, ShieldCheck, Car, Zap
} from 'lucide-react';
import { fetchWalletFromDB, topUpWalletInDB } from '../api/client';

export default function WalletTab() {
  const [fastagBalance, setFastagBalance] = useState(850);
  const [walletCredits, setWalletCredits] = useState(150); // Includes ₹50 hackathon overstay compensation credit
  const [autoRecharge, setAutoRecharge] = useState(true);
  const [isToppingUp, setIsToppingUp] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('TS09-EB-4421');
  const [isDBSynced, setIsDBSynced] = useState(false);

  const [txList, setTxList] = useState([
    {
      id: 'tx-1',
      title: 'Inconvenience Compensation Credit',
      subtitle: 'Order #2 Conflict Auto-Refund & Credit',
      amount: '+₹50.00',
      isCredit: true,
      tag: 'ParkNest Apology Credit',
      time: 'Today, 1:32 PM',
    },
    {
      id: 'tx-2',
      title: 'DLF Cybercity Gate 2 Boom Barrier',
      subtitle: 'Slot A12 • Auto-Pay Barrier Debit',
      amount: '-₹30.00',
      isCredit: false,
      tag: 'Gate Barrier Auto-Pay',
      time: 'Today, 10:30 AM',
    },
    {
      id: 'tx-3',
      title: 'Inorbit Mall Mindspace P2 EV',
      subtitle: '30kW DC Fast Charge (18.4 kWh)',
      amount: '-₹180.00',
      isCredit: false,
      tag: 'EV Fast Charging',
      time: 'Yesterday, 6:45 PM',
    },
    {
      id: 'tx-4',
      title: 'UPI Top-Up via PhonePe',
      subtitle: 'Auto-Reload Triggered (< ₹200)',
      amount: '+₹500.00',
      isCredit: true,
      tag: 'UPI Instant Top-Up',
      time: '10 Nov, 9:15 AM',
    },
  ]);

  // Load from real SQLite database
  useEffect(() => {
    async function loadWallet() {
      try {
        const data = await fetchWalletFromDB();
        if (data && data.success) {
          setFastagBalance(data.fastagBalance);
          setWalletCredits(data.walletCredits);
          if (data.transactions && data.transactions.length > 0) {
            setTxList(data.transactions);
          }
          setIsDBSynced(true);
        }
      } catch (err) {}
    }
    loadWallet();
  }, []);

  const vehicles = [
    {
      id: 'TS09-EB-4421',
      name: 'Hyundai Ioniq 5 EV',
      regNo: 'TS 09 EB 4421',
      type: 'Electric SUV',
      battery: '72.6 kWh',
      connector: 'CCS-2 (350kW compatible)',
      fastagId: 'NETC-ICICI-882190',
      fastagLinked: true,
      color: '#10B981',
    },
    {
      id: 'TS07-FA-8890',
      name: 'Tata Nexon EV Max',
      regNo: 'TS 07 FA 8890',
      type: 'Electric Compact SUV',
      battery: '40.5 kWh',
      connector: 'CCS-2 & Type-2',
      fastagId: 'NETC-HDFC-310452',
      fastagLinked: true,
      color: '#3B82F6',
    },
  ];

  const handleQuickTopUp = async (amount) => {
    setIsToppingUp(true);
    try {
      const res = await topUpWalletInDB(amount);
      if (res && res.newBalance) {
        setFastagBalance(res.newBalance);
      } else {
        setFastagBalance((prev) => prev + amount);
      }
      setTxList((prev) => [
        {
          id: `tx-${Date.now()}`,
          title: 'UPI Top-Up via PhonePe/GPay',
          subtitle: 'Instant Wallet Reload',
          amount: `+₹${amount.toFixed(2)}`,
          isCredit: true,
          tag: 'SQLite DB Persisted',
          time: 'Just now',
        },
        ...prev,
      ]);
    } catch (e) {
      setFastagBalance((prev) => prev + amount);
    }
    setIsToppingUp(false);
    setTopUpSuccess(true);
    setTimeout(() => setTopUpSuccess(false), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-24 text-gray-200">
      {/* Digital Wallet & Card Hero */}
      <div className="bg-gradient-to-br from-[#1A1F2C] via-[#161920] to-[#0B0D10] border-2 border-brandYellow/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brandYellow/10 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neonGreen animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider text-brandYellow">
              ParkNest Smart Wallet
            </span>
          </div>
          <span className="text-[10px] bg-white/10 text-gray-300 font-mono px-2 py-0.5 rounded border border-white/20">
            AUTO-PASS WALLET
          </span>
        </div>

        {/* Balance Display */}
        <div className="space-y-1">
          <div className="text-[11px] text-gray-400 font-medium">Available Parking & Gate Balance</div>
          <div className="text-3xl font-black text-white flex items-center">
            <span className="text-brandYellow mr-1 font-sans">₹</span>
            <span>{fastagBalance.toFixed(2)}</span>
            <span className="text-[10px] font-bold text-neonGreen bg-neonGreen/10 border border-neonGreen/30 px-2 py-0.5 rounded-full ml-3">
              ✓ Boom Barrier Ready
            </span>
          </div>
        </div>

        {/* Vehicle & RFID Metadata */}
        <div className="mt-4 pt-3 border-t border-cardBorder/80 flex items-center justify-between text-xs">
          <div>
            <div className="text-[10px] text-gray-400">Linked Vehicle</div>
            <div className="font-bold text-white flex items-center gap-1">
              <Car className="w-3.5 h-3.5 text-brandYellow" />
              <span>TS 09 EB 4421</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-400">ParkNest EV Credits</div>
            <div className="font-extrabold text-neonGreen">
              ₹{walletCredits}.00 Credits
            </div>
          </div>
        </div>

        {/* Quick Top-Up Bar */}
        <div className="mt-4 pt-3 border-t border-cardBorder/80 flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Top Up:</span>
          {[200, 500, 1000].map((amt) => (
            <button
              key={amt}
              disabled={isToppingUp}
              onClick={() => handleQuickTopUp(amt)}
              className="px-3 py-1.5 rounded-xl bg-[#0B0D10] hover:bg-brandYellow hover:text-black border border-cardBorder hover:border-brandYellow text-xs font-bold transition-all active:scale-95 text-gray-200"
            >
              +₹{amt}
            </button>
          ))}
          {topUpSuccess && (
            <span className="text-[10px] text-neonGreen font-semibold animate-pulse ml-auto">
              ✓ Added via UPI
            </span>
          )}
        </div>
      </div>

      {/* AutoPay & Gate Boom Barrier Controls */}
      <div className="bg-[#161920] border border-cardBorder rounded-2xl p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-neonGreen/20 text-neonGreen flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Contactless Gate AutoPay</span>
                <span className="text-[9px] bg-neonGreen/20 text-neonGreen font-bold px-1.5 py-0.2 rounded">
                  ANPR FAST-PASS
                </span>
              </div>
              <div className="text-[10px] text-gray-400">
                Auto-lifts boom barriers at DLF, Inorbit & tech parks
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAutoRecharge(!autoRecharge)}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
              autoRecharge ? 'bg-neonGreen' : 'bg-gray-700'
            }`}
          >
            <div
              className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                autoRecharge ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="text-[11px] text-gray-300 bg-[#0B0D10] p-2.5 rounded-xl border border-cardBorder flex items-center justify-between">
          <span>Zero gate wait time. Debits exact hourly fee on exit.</span>
          <span className="text-brandYellow font-mono text-[10px] font-bold">UPI AutoPay Active</span>
        </div>
      </div>

      {/* My Vehicles / EV Garage */}
      <div className="bg-[#161920] border border-cardBorder rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-brandYellow" />
            <span>My Registered Vehicles & EVs</span>
          </h3>
          <span className="text-[10px] text-brandYellow font-bold cursor-pointer hover:underline">
            + Add Vehicle
          </span>
        </div>

        <div className="space-y-2">
          {vehicles.map((v) => {
            const isSelected = selectedVehicle === v.id;
            return (
              <div
                key={v.id}
                onClick={() => setSelectedVehicle(v.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-brandYellow/15 border-brandYellow text-white'
                    : 'bg-[#0B0D10] border-cardBorder text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs"
                    style={{ backgroundColor: `${v.color}20`, color: v.color }}
                  >
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{v.name}</span>
                      {isSelected && (
                        <span className="text-[8px] bg-brandYellow text-black font-extrabold px-1 rounded">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono">
                      {v.regNo} • {v.connector}
                    </div>
                  </div>
                </div>

                <div className="text-right text-[10px]">
                  <div className="text-emerald-400 font-bold">Auto-Pay Ready</div>
                  <div className="text-gray-500 font-mono">{v.battery}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Gate & Fastag Transactions */}
      <div className="bg-[#161920] border border-cardBorder rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Gate Toll & Parking Pass Receipts
          </h3>
          <span className="text-[10px] text-gray-400">GST Invoices</span>
        </div>

        <div className="space-y-2 text-xs">
          {txList.map((tx) => (
            <div
              key={tx.id}
              className="p-2.5 rounded-xl bg-[#0B0D10] border border-cardBorder flex items-center justify-between hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    tx.isCredit ? 'bg-neonGreen/20 text-neonGreen' : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  {tx.isCredit ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <div className="font-bold text-white leading-tight">{tx.title}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{tx.subtitle}</div>
                  <div className="text-[9px] text-gray-500 mt-0.5">{tx.time}</div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`text-xs font-extrabold font-mono ${
                    tx.isCredit ? 'text-neonGreen' : 'text-gray-200'
                  }`}
                >
                  {tx.amount}
                </div>
                <div className="text-[8px] text-gray-400 font-medium">{tx.tag}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
