import express from 'express';
import cors from 'cors';
import { db, initDB } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
initDB();

// Helper to format spot from DB row
function formatSpotRow(row) {
  if (!row) return null;
  return {
    ...row,
    perks: row.perks ? JSON.parse(row.perks) : [],
    hasEV: Boolean(row.hasEV),
    evDetails: row.evDetails ? JSON.parse(row.evDetails) : null,
    coords: { x: 50, y: 50 },
    realCoords: { lat: row.realLat, lng: row.realLng },
    host: {
      name: row.hostName,
      phone: row.hostPhone,
      rating: row.hostRating,
      verified: true,
    },
  };
}

// 1. GET /api/spots - Retrieve all parking & EV spots from SQLite database
app.get('/api/spots', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM spots ORDER BY createdAt DESC').all();
    const spots = rows.map(formatSpotRow);
    res.json({ success: true, count: spots.length, data: spots });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. POST /api/spots - List a new parking / EV space into SQLite database
app.post('/api/spots', (req, res) => {
  try {
    const s = req.body;
    const spotId = s.id || `spot-${Date.now()}`;
    const perksStr = JSON.stringify(s.perks || ['Host Verified', 'Gated Society']);
    const evDetailsStr = s.evDetails ? JSON.stringify(s.evDetails) : null;

    const stmt = db.prepare(`
      INSERT INTO spots (
        id, name, category, type, slotNumber, address, area, basePrice, rating,
        reviewsCount, distanceKm, durationMin, perks, hasEV, evDetails,
        aiProbability, aiStatus, aiStatusColor, aiInsight, cuisineTag,
        offerBadge, swiggyPerk, hostName, hostPhone, hostRating,
        realLat, realLng, image, totalSlots, availableSlots, gateAccessCode, gateType
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);

    stmt.run(
      spotId,
      s.name,
      s.category || 'Homes',
      s.type || 'Home Driveway',
      s.slotNumber || `Slot ${Math.floor(10 + Math.random() * 90)}`,
      s.address,
      s.area || 'Hyderabad',
      Number(s.basePrice) || 30,
      s.rating || 5.0,
      s.reviewsCount || 1,
      s.distanceKm || 1.0,
      s.durationMin || 4,
      perksStr,
      s.hasEV ? 1 : 0,
      evDetailsStr,
      s.aiProbability || 88,
      s.aiStatus || 'Newly Listed Slot',
      s.aiStatusColor || '#10B981',
      s.aiInsight || 'Newly listed by verified host.',
      s.cuisineTag || null,
      s.offerBadge || null,
      s.swiggyPerk || null,
      s.host?.name || 'You (Host)',
      s.host?.phone || '+91 99000 88888',
      s.host?.rating || 5.0,
      s.realCoords?.lat || 17.4375,
      s.realCoords?.lng || 78.375,
      s.image || 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
      s.totalSlots || 1,
      s.availableSlots || 1,
      s.gateAccessCode || `${Math.floor(1000 + Math.random() * 9000)}`,
      s.gateType || 'Host OTP & Guard Pass'
    );

    const insertedRow = db.prepare('SELECT * FROM spots WHERE id = ?').get(spotId);
    res.status(201).json({ success: true, data: formatSpotRow(insertedRow) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. GET /api/bookings/active - Retrieve current active booking pass from SQLite
app.get('/api/bookings/active', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM bookings WHERE status = "ACTIVE" ORDER BY createdAt DESC LIMIT 1').get();
    if (!row) {
      return res.json({ success: true, data: null });
    }
    res.json({
      success: true,
      data: {
        bookingId: row.id,
        spotId: row.spotId,
        spotTitle: row.spotTitle,
        slotNumber: row.slotNumber,
        location: row.location,
        distance: row.distance,
        type: row.type,
        gateOTP: row.gateOTP,
        qrData: row.qrData,
        startTime: row.startTime,
        endTime: row.endTime,
        remainingMinutes: row.remainingMinutes,
        totalAmount: row.totalAmount,
        platformFee: row.platformFee,
        paidTotal: row.paidTotal,
        hasEVAddon: Boolean(row.hasEVAddon),
        evChargerType: row.evChargerType,
        status: row.status,
        overstaySimulated: Boolean(row.overstaySimulated),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. POST /api/bookings - Create new gate reservation in SQLite DB
app.post('/api/bookings', (req, res) => {
  try {
    const b = req.body;
    const bookingId = b.bookingId || `PN-HYD-${Math.floor(10000 + Math.random() * 90000)}`;

    const stmt = db.prepare(`
      INSERT INTO bookings (
        id, spotId, spotTitle, slotNumber, location, distance, type, gateOTP,
        qrData, startTime, endTime, remainingMinutes, totalAmount, platformFee,
        paidTotal, hasEVAddon, evChargerType, status, overstaySimulated
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', 0
      )
    `);

    stmt.run(
      bookingId,
      b.spotId,
      b.spotTitle,
      b.slotNumber,
      b.location,
      b.distance,
      b.type,
      b.gateOTP || '4829',
      b.qrData || `PARKNEST:${b.slotNumber}:AUTH-${b.gateOTP || '4829'}:HYD`,
      b.startTime || 'Now',
      b.endTime || 'in 2 hours',
      b.remainingMinutes || 120,
      Number(b.totalAmount) || 60,
      Number(b.platformFee) || 9,
      Number(b.paidTotal) || 69,
      b.hasEVAddon ? 1 : 0,
      b.evChargerType || null
    );

    // Record Fastag AutoPay transaction
    db.prepare(`
      INSERT INTO transactions (id, title, subtitle, amount, isCredit, tag, time)
      VALUES (?, ?, ?, ?, 0, 'Fastag Gate Pass', 'Just now')
    `).run(
      `tx-${Date.now()}`,
      `Reserved ${b.slotNumber}`,
      b.spotTitle,
      `-₹${b.paidTotal}`
    );

    // Update spot availability in SQLite
    if (b.spotId) {
      db.prepare('UPDATE spots SET availableSlots = MAX(0, availableSlots - 1) WHERE id = ?').run(b.spotId);
    }

    res.status(201).json({
      success: true,
      bookingId,
      data: {
        ...b,
        bookingId,
        status: 'ACTIVE',
        overstaySimulated: false,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. POST /api/bookings/overstay - Simulate overstay in SQLite DB
app.post('/api/bookings/overstay', (req, res) => {
  try {
    const { bookingId } = req.body;
    db.prepare('UPDATE bookings SET overstaySimulated = 1 WHERE id = ?').run(bookingId || 'PN-HYD-98214');

    // Insert penalty debit transaction
    db.prepare(`
      INSERT INTO transactions (id, title, subtitle, amount, isCredit, tag, time)
      VALUES (?, 'Overstay Penalty Debited', 'Slot A12 • Fine + 1.5x Hourly Surge', '-₹145.00', 0, 'AutoPay Fine', 'Just now')
    `).run(`tx-overstay-${Date.now()}`);

    // Insert Order #2 apology refund + credit
    db.prepare(`
      INSERT INTO transactions (id, title, subtitle, amount, isCredit, tag, time)
      VALUES (?, 'Order #2 Apology Inconvenience Credit', 'ParkNest Conflict Avoidance protocol', '+₹50.00', 1, 'Wallet Credit', 'Just now')
    `).run(`tx-credit-${Date.now()}`);

    // Credit ₹50 to wallet
    db.prepare("UPDATE wallet SET walletCredits = walletCredits + 50 WHERE id = 'default-wallet'").run();

    res.json({
      success: true,
      message: 'Overstay penalty and compensation processed in SQLite database',
      penaltyAmount: 145,
      compensationAmount: 50,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. GET /api/wallet - Fastag balance & transaction history
app.get('/api/wallet', (req, res) => {
  try {
    const wallet = db.prepare("SELECT * FROM wallet WHERE id = 'default-wallet'").get();
    const transactions = db.prepare('SELECT * FROM transactions ORDER BY createdAt DESC LIMIT 10').all();
    res.json({
      success: true,
      fastagBalance: wallet?.fastagBalance || 850.0,
      walletCredits: wallet?.walletCredits || 150.0,
      autoRecharge: Boolean(wallet?.autoRecharge),
      transactions: transactions.map((t) => ({ ...t, isCredit: Boolean(t.isCredit) })),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. POST /api/wallet/topup - Top up Fastag balance via UPI in SQLite
app.post('/api/wallet/topup', (req, res) => {
  try {
    const { amount } = req.body;
    const addAmt = Number(amount) || 500;

    db.prepare("UPDATE wallet SET fastagBalance = fastagBalance + ? WHERE id = 'default-wallet'").run(addAmt);

    db.prepare(`
      INSERT INTO transactions (id, title, subtitle, amount, isCredit, tag, time)
      VALUES (?, 'UPI Top-Up via PhonePe/GPay', 'Instant Fastag Reload', ?, 1, 'UPI Top-Up', 'Just now')
    `).run(`tx-${Date.now()}`, `+₹${addAmt.toFixed(2)}`);

    const wallet = db.prepare("SELECT * FROM wallet WHERE id = 'default-wallet'").get();
    res.json({ success: true, newBalance: wallet.fastagBalance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 8. GET /api/host - Host metrics, earnings, and gate telemetry logs
app.get('/api/host', (req, res) => {
  try {
    const profile = db.prepare("SELECT * FROM host_profile WHERE id = 'host-1'").get();
    const logs = db.prepare('SELECT * FROM gate_logs ORDER BY createdAt DESC LIMIT 10').all();
    res.json({
      success: true,
      profile: {
        ...profile,
        masterActive: Boolean(profile?.masterActive),
      },
      gateLogs: logs,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 9. POST /api/host/payout - Withdraw host earnings to bank UPI
app.post('/api/host/payout', (req, res) => {
  try {
    const profile = db.prepare("SELECT * FROM host_profile WHERE id = 'host-1'").get();
    const payoutAmount = profile?.pendingPayout || 280;

    db.prepare("UPDATE host_profile SET pendingPayout = 0 WHERE id = 'host-1'").run();

    res.json({
      success: true,
      message: `₹${payoutAmount} transferred to linked UPI ID (ananya.reddy@okaxis)`,
      withdrawnAmount: payoutAmount,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[ParkNest SQLite Backend] REST API Server running on http://localhost:${PORT}`);
});
