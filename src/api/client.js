const API_BASE = '/api';

// 1. Fetch Spots from SQLite database
export async function fetchSpotsFromDB() {
  try {
    const res = await fetch(`${API_BASE}/spots`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('[API Client] Falling back to local cache for spots:', err.message);
    return null;
  }
}

// 2. Insert new spot into SQLite database
export async function createSpotInDB(spotData) {
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
    console.warn('[API Client] Error persisting spot:', err.message);
    return spotData;
  }
}

// 3. Fetch Active Gate Booking Pass from SQLite
export async function fetchActiveBookingFromDB() {
  try {
    const res = await fetch(`${API_BASE}/bookings/active`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('[API Client] Error fetching active booking:', err.message);
    return null;
  }
}

// 4. Create new Gate Booking Reservation in SQLite
export async function createBookingInDB(bookingData) {
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
    console.warn('[API Client] Error creating booking:', err.message);
    return bookingData;
  }
}

// 5. Trigger Overstay Simulation & Conflict Penalty in SQLite
export async function triggerOverstayInDB(bookingId) {
  try {
    const res = await fetch(`${API_BASE}/bookings/overstay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API Client] Error recording overstay:', err.message);
    return { success: false };
  }
}

// 6. Fetch Fastag Wallet & Transactions from SQLite
export async function fetchWalletFromDB() {
  try {
    const res = await fetch(`${API_BASE}/wallet`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API Client] Error fetching wallet:', err.message);
    return null;
  }
}

// 7. Top Up Fastag via UPI in SQLite
export async function topUpWalletInDB(amount) {
  try {
    const res = await fetch(`${API_BASE}/wallet/topup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API Client] Error topping up wallet:', err.message);
    return null;
  }
}

// 8. Fetch Host Dashboard metrics from SQLite
export async function fetchHostDataFromDB() {
  try {
    const res = await fetch(`${API_BASE}/host`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API Client] Error fetching host data:', err.message);
    return null;
  }
}

// 9. Process Host Payout in SQLite
export async function withdrawHostPayoutFromDB() {
  try {
    const res = await fetch(`${API_BASE}/host/payout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API Client] Error processing payout:', err.message);
    return null;
  }
}
