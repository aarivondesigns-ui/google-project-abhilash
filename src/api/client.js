import { supabase } from '../lib/supabase';

const API_BASE = '/api';

// 1. Fetch Spots: Try Supabase first, then Express/SQLite backend, fallback to null
export async function fetchSpotsFromDB() {
  try {
    const { data, error } = await supabase.from('spots').select('*');
    if (!error && data && data.length > 0) {
      return data.map((spot) => ({
        ...spot,
        perks: typeof spot.perks === 'string' ? JSON.parse(spot.perks) : spot.perks || [],
        hasEV: Boolean(spot.hasEV),
        evDetails: typeof spot.evDetails === 'string' ? JSON.parse(spot.evDetails) : spot.evDetails,
        coords: { x: 50, y: 50 },
        realCoords: { lat: Number(spot.realLat), lng: Number(spot.realLng) },
        host: {
          name: spot.hostName,
          phone: spot.hostPhone,
          rating: Number(spot.hostRating),
          verified: true,
        },
      }));
    }
  } catch (err) {
    // Supabase query failed or table not migrated yet, gracefully fall back
  }

  // Fallback to Express backend or local
  try {
    const res = await fetch(`${API_BASE}/spots`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    return null;
  }
}

// 2. Insert new spot: Insert into Supabase and/or Express
export async function createSpotInDB(spotData) {
  try {
    const row = {
      id: spotData.id,
      name: spotData.name,
      category: spotData.category,
      type: spotData.type,
      slotNumber: spotData.slotNumber,
      address: spotData.address,
      area: spotData.area,
      basePrice: spotData.basePrice,
      rating: spotData.rating,
      reviewsCount: spotData.reviewsCount,
      distanceKm: spotData.distanceKm,
      durationMin: spotData.durationMin,
      perks: spotData.perks,
      hasEV: Boolean(spotData.hasEV),
      evDetails: spotData.evDetails,
      aiProbability: spotData.aiProbability,
      aiStatus: spotData.aiStatus,
      aiStatusColor: spotData.aiStatusColor,
      aiInsight: spotData.aiInsight,
      cuisineTag: spotData.cuisineTag,
      offerBadge: spotData.offerBadge,
      swiggyPerk: spotData.swiggyPerk || null,
      hostName: spotData.host?.name || 'Host',
      hostPhone: spotData.host?.phone || '+91 98490 00000',
      hostRating: spotData.host?.rating || 4.9,
      realLat: spotData.realCoords?.lat || 17.44,
      realLng: spotData.realCoords?.lng || 78.36,
      image: spotData.image,
      totalSlots: spotData.totalSlots,
      availableSlots: spotData.availableSlots,
      gateAccessCode: spotData.gateAccessCode,
      gateType: spotData.gateType,
    };
    await supabase.from('spots').insert([row]);
  } catch (e) {
    // Fall back to Express API
  }

  try {
    const res = await fetch(`${API_BASE}/spots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spotData),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    return spotData;
  }
}

// 3. Fetch Active Gate Booking Pass
export async function fetchActiveBookingFromDB() {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', 'ACTIVE')
      .order('createdAt', { ascending: false })
      .limit(1);

    if (!error && data && data.length > 0) {
      return data[0];
    }
  } catch (err) {}

  try {
    const res = await fetch(`${API_BASE}/bookings/active`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    return null;
  }
}

// 4. Create new Gate Booking Reservation
export async function createBookingInDB(bookingData) {
  try {
    await supabase.from('bookings').insert([bookingData]);
  } catch (err) {}

  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    return bookingData;
  }
}

// 5. Trigger Overstay Simulation
export async function triggerOverstayInDB(bookingId) {
  try {
    await supabase
      .from('bookings')
      .update({ overstaySimulated: true })
      .eq('id', bookingId);
  } catch (err) {}

  try {
    const res = await fetch(`${API_BASE}/bookings/overstay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

// 6. Fetch Wallet & Transactions
export async function fetchWalletFromDB() {
  try {
    const { data: walletData, error: wErr } = await supabase
      .from('wallet')
      .select('*')
      .eq('id', 'default-wallet')
      .single();

    const { data: txData, error: txErr } = await supabase
      .from('transactions')
      .select('*')
      .order('createdAt', { ascending: false });

    if (!wErr && walletData) {
      return {
        success: true,
        fastagBalance: Number(walletData.fastagBalance),
        walletCredits: Number(walletData.walletCredits),
        autoRecharge: Boolean(walletData.autoRecharge),
        transactions: txData || [],
      };
    }
  } catch (err) {}

  try {
    const res = await fetch(`${API_BASE}/wallet`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

// 7. Top Up Wallet via UPI
export async function topUpWalletInDB(amount) {
  try {
    const { data: wallet } = await supabase
      .from('wallet')
      .select('fastagBalance')
      .eq('id', 'default-wallet')
      .single();

    if (wallet) {
      const newBalance = Number(wallet.fastagBalance) + amount;
      await supabase
        .from('wallet')
        .update({ fastagBalance: newBalance, updatedAt: new Date().toISOString() })
        .eq('id', 'default-wallet');

      await supabase.from('transactions').insert([
        {
          id: `tx-${Date.now()}`,
          title: 'UPI Top-Up via PhonePe/GPay',
          subtitle: 'Instant Wallet Reload',
          amount: `+₹${amount.toFixed(2)}`,
          isCredit: true,
          tag: 'Supabase Cloud Persisted',
          time: 'Just now',
        },
      ]);

      return { success: true, newBalance };
    }
  } catch (err) {}

  try {
    const res = await fetch(`${API_BASE}/wallet/topup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

// 8. Fetch Host Dashboard metrics
export async function fetchHostDataFromDB() {
  try {
    const { data: profile } = await supabase
      .from('host_profile')
      .select('*')
      .eq('id', 'host-1')
      .single();

    const { data: logs } = await supabase
      .from('gate_logs')
      .select('*')
      .order('createdAt', { ascending: false });

    if (profile) {
      return {
        success: true,
        profile: {
          ...profile,
          todayEarnings: Number(profile.todayEarnings),
          pendingPayout: Number(profile.pendingPayout),
          masterActive: Boolean(profile.masterActive),
        },
        gateLogs: logs || [],
      };
    }
  } catch (err) {}

  try {
    const res = await fetch(`${API_BASE}/host`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

// 9. Process Host Payout
export async function withdrawHostPayoutFromDB() {
  try {
    await supabase
      .from('host_profile')
      .update({ pendingPayout: 0 })
      .eq('id', 'host-1');
  } catch (err) {}

  try {
    const res = await fetch(`${API_BASE}/host/payout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}
