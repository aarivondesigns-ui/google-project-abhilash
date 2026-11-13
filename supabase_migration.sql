-- ParkNest Hyderabad Supabase Schema Migration
-- Run this in Supabase Dashboard -> SQL Editor

CREATE TABLE IF NOT EXISTS public.spots (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  type TEXT,
  "slotNumber" TEXT,
  address TEXT,
  area TEXT,
  "basePrice" NUMERIC,
  rating NUMERIC,
  "reviewsCount" INTEGER,
  "distanceKm" NUMERIC,
  "durationMin" INTEGER,
  perks JSONB DEFAULT '[]'::jsonb,
  "hasEV" BOOLEAN DEFAULT false,
  "evDetails" JSONB,
  "aiProbability" INTEGER,
  "aiStatus" TEXT,
  "aiStatusColor" TEXT,
  "aiInsight" TEXT,
  "cuisineTag" TEXT,
  "offerBadge" TEXT,
  "swiggyPerk" TEXT,
  "hostName" TEXT,
  "hostPhone" TEXT,
  "hostRating" NUMERIC,
  "realLat" NUMERIC,
  "realLng" NUMERIC,
  image TEXT,
  "totalSlots" INTEGER,
  "availableSlots" INTEGER,
  "gateAccessCode" TEXT,
  "gateType" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  "spotId" TEXT,
  "spotTitle" TEXT,
  "slotNumber" TEXT,
  location TEXT,
  distance TEXT,
  type TEXT,
  "gateOTP" TEXT,
  "qrData" TEXT,
  "startTime" TEXT,
  "endTime" TEXT,
  "remainingMinutes" INTEGER,
  "totalAmount" NUMERIC,
  "platformFee" NUMERIC,
  "paidTotal" NUMERIC,
  "hasEVAddon" BOOLEAN DEFAULT false,
  "evChargerType" TEXT,
  status TEXT DEFAULT 'ACTIVE',
  "overstaySimulated" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wallet (
  id TEXT PRIMARY KEY,
  "fastagBalance" NUMERIC DEFAULT 850.00,
  "walletCredits" NUMERIC DEFAULT 150.00,
  "autoRecharge" BOOLEAN DEFAULT true,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  title TEXT,
  subtitle TEXT,
  amount TEXT,
  "isCredit" BOOLEAN DEFAULT false,
  tag TEXT,
  time TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.host_profile (
  id TEXT PRIMARY KEY,
  name TEXT,
  "propertyName" TEXT,
  "todayEarnings" NUMERIC DEFAULT 0,
  "pendingPayout" NUMERIC DEFAULT 0,
  "masterActive" BOOLEAN DEFAULT true,
  "totalHosted" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.gate_logs (
  id TEXT PRIMARY KEY,
  "vehicleNo" TEXT,
  "vehicleModel" TEXT,
  "gateOTP" TEXT,
  time TEXT,
  action TEXT,
  fee NUMERIC,
  status TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) with full public read/write for demo hackathon
ALTER TABLE public.spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gate_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-write for spots" ON public.spots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for wallet" ON public.wallet FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for host_profile" ON public.host_profile FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for gate_logs" ON public.gate_logs FOR ALL USING (true) WITH CHECK (true);

-- Seed initial spots
INSERT INTO public.spots (
  id, name, category, type, "slotNumber", address, area, "basePrice", rating,
  "reviewsCount", "distanceKm", "durationMin", perks, "hasEV", "evDetails",
  "aiProbability", "aiStatus", "aiStatusColor", "aiInsight", "cuisineTag",
  "offerBadge", "swiggyPerk", "hostName", "hostPhone", "hostRating",
  "realLat", "realLng", image, "totalSlots", "availableSlots", "gateAccessCode", "gateType"
) VALUES 
(
  'spot-1',
  'Gachibowli Office Basement (Slot A12)',
  'Offices',
  'Office Basement',
  'Slot A12',
  'Opp. DLF Cybercity Gate 2, Gachibowli, Hyderabad 500032',
  'Gachibowli',
  30, 4.8, 120, 0.8, 3,
  '["Covered", "CCTV", "24x7 Access", "Security Guard", "Boom Barrier"]'::jsonb,
  false, null,
  85, 'High Probability', '#10B981',
  'Historical turnover peak at 11:30 AM. 42 vehicles vacated in last 2 hrs.',
  'Tech Park • Workday Parking',
  'AI Fast-Pass',
  'ANPR fast barrier entry and 24x7 guarded basement slot',
  'Venkatesh Rao (CyberTower Facility)', '+91 98490 12345', 4.9,
  17.4435, 78.3582,
  'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
  15, 4, '4829', 'Automated ANPR + Security OTP'
),
(
  'spot-5',
  'DLF Cybercity North Gate Multi-Deck Bay',
  'Offices & Commercial',
  'Multi-Deck Garage + Fast EV',
  'North Deck Lot P1',
  'Opp DLF Cybercity Gate 1, Gachibowli, Hyderabad 500032',
  'Gachibowli',
  25, 4.9, 480, 0.6, 2,
  '["Open Till 3 AM", "Valet Assist", "Auto Barrier Entry", "CCTV Monitored", "Quick Exit"]'::jsonb,
  true,
  '{"chargerPrice": 25, "types": [{"name": "15kW Fast DC Gun", "power": "15kW", "plug": "CCS-2", "status": "Available Now", "speed": "High speed top-up", "addOnPrice": 25}]}'::jsonb,
  88, 'High Turnover / Quick Spots', '#10B981',
  'Rapid parking turnover every 25 mins. Vacant slots opening continuously.',
  'DLF IT Corridor • Fast Barrier Bay',
  'FLAT ₹15 OFF (Code PARK15)',
  'Guaranteed reserved bay near express exit boom barrier',
  'DLF Facility Operations', '+91 97000 11223', 4.9,
  17.4475, 78.3565,
  'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
  20, 7, '2981', 'QR Token & Guard Pass'
),
(
  'spot-6',
  'Road 45 Jubilee Hills Commercial Valet Bay',
  'Commercial & Valet',
  'Premium Covered Bay + EV',
  'Commercial Valet Bay 3',
  'Plot 716, Road Number 45, Jubilee Hills, Hyderabad 500033',
  'Jubilee Hills',
  40, 4.8, 340, 1.8, 7,
  '["Valet Parking", "Dedicated EV Stall", "Covered Bay", "CCTV Security"]'::jsonb,
  true,
  '{"chargerPrice": 30, "types": [{"name": "11kW AC Dual Type-2", "power": "11kW", "plug": "Type-2", "status": "Available Now", "speed": "Full vehicle charge", "addOnPrice": 25}]}'::jsonb,
  82, 'High Probability', '#10B981',
  'Commercial turnaround avg 45 mins. 3 EV valet spots ready right now.',
  'Road 45 Commercial Strip • Valet Bay',
  'FREE Valet (Code VALETFREE)',
  'Trained valet assistance with digital handover verification',
  'Jubilee Commercial Hospitality', '+91 98480 99887', 4.9,
  17.4355, 78.4020,
  'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80',
  10, 3, '5512', 'Boutique Valet Ticket'
),
(
  'spot-7',
  'Cyber Towers Junction Commercial Plaza Parking',
  'Commercial & Metro',
  'Basement Lot + 30kW DC EV',
  'Plaza Slot D04',
  'Beside Cyber Towers, Main Hitec City Road, Madhapur, Hyderabad 500081',
  'Hitec City',
  35, 4.7, 620, 1.2, 5,
  '["Auto Barrier Entry", "AC Waiting Lounge", "Covered Lot", "Security Guard", "Metro Walkway"]'::jsonb,
  true,
  '{"chargerPrice": 30, "types": [{"name": "30kW DC Fast Gun", "power": "30kW", "plug": "CCS-2", "status": "Available Now", "speed": "0-80% in 35 mins", "addOnPrice": 30}]}'::jsonb,
  72, 'High Turnover', '#10B981',
  'Business rush active; 12 commuter vehicles clearing out.',
  'Madhapur Metro • Auto Barrier Gate',
  '₹25 Wallet Cashback',
  'Direct covered walkway to Hitec City Metro Station',
  'Cyber Towers Facility Corp', '+91 98850 44332', 4.8,
  17.4502, 78.3812,
  'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
  25, 5, '7721', 'Smart RFID & QR Pass'
),
(
  'spot-2',
  'Inorbit Mall Commercial Lot (Slot B04)',
  'EV Charging',
  'Commercial Multi-Level + EV',
  'Slot B04',
  'Inorbit Mall Basement Level P2, Mindspace Cyberabad, Madhapur, Hyderabad 500081',
  'Hitec City / Madhapur',
  50, 4.7, 95, 1.5, 6,
  '["Covered", "Valet Assist", "CCTV", "Wheelchair Friendly", "Near Mall Elevators"]'::jsonb,
  true,
  '{"chargerPrice": 30, "types": [{"name": "30kW DC Fast Charger", "power": "30kW", "plug": "CCS-2", "status": "Available Now", "speed": "0-80% in 45m", "addOnPrice": 30}]}'::jsonb,
  60, 'Medium Probability', '#F5B800',
  'Commercial mall influx detected. Expect vacancy shift in 22 mins.',
  'Mindspace Cyberabad • P2 Multi-Deck Deck',
  '30% OFF (Code WEEKENDHYD)',
  'Priority multi-deck covered spot right next to passenger elevators',
  'Mindspace Inorbit Hub', '+91 99890 54321', 4.8,
  17.4340, 78.3866,
  'https://images.unsplash.com/photo-1519642918688-7e43b19245d8?auto=format&fit=crop&w=800&q=80',
  40, 6, '6194', 'Auto Barrier & QR Pass'
),
(
  'spot-8',
  'WaveRock Financial District Commercial Lot & Supercharger',
  'Tech Park & EV Hub',
  'Commercial Deck + 50kW EV Supercharger',
  'WaveRock West Bay 08',
  'Near WaveRock IT Gateway, Nanakramguda, Financial District, Hyderabad 500032',
  'Financial District',
  45, 4.9, 410, 2.1, 8,
  '["50kW EV Supercharger", "Shaded Bay", "Security Guard", "24x7 Boom Barrier"]'::jsonb,
  true,
  '{"chargerPrice": 35, "types": [{"name": "50kW Supercharger CCS-2", "power": "50kW", "plug": "CCS-2", "status": "Available Now", "speed": "0-80% in 28m", "addOnPrice": 35}]}'::jsonb,
  75, 'Optimal Availability', '#10B981',
  'Workday turnover active; 6 supercharger stalls available right now.',
  'Financial District • 50kW Fast EV Supercharger',
  'FLAT ₹100 EV Credit (Code EVSUPER100)',
  'Reserved 50kW supercharger bay with complimentary windshield wipe',
  'WaveRock Parking & Mobility Ops', '+91 99123 77665', 4.9,
  17.4210, 78.3490,
  'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80',
  18, 6, '4040', 'Valet Concierge Pass'
),
(
  'spot-4',
  'Jubilee Hills Residential Driveway',
  'Homes',
  'Home (Airbnb-Style Host)',
  'Private Driveway Slot',
  'Villa 14, Rd Number 36, Near Peddamma Temple Metro, Jubilee Hills, Hyderabad 500033',
  'Jubilee Hills',
  20, 4.6, 42, 1.1, 4,
  '["Gated Society", "Security Guard", "Shaded Tree Cover", "Safe Quiet Lane"]'::jsonb,
  false, null,
  92, 'High Probability', '#10B981',
  'Host Ananya is at office till 7 PM. Slot guaranteed 100% empty.',
  'Road 36 Residential Strip • Quiet Secure Bay',
  'Budget Pick ₹20/h',
  'Peaceful private residential driveway with security gate phone verify',
  'Ananya Reddy (Homeowner)', '+91 98765 43210', 4.9,
  17.4319, 78.4073,
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  2, 2, '3104', 'Gated Society Guard Call'
)
ON CONFLICT (id) DO NOTHING;

-- Seed default wallet
INSERT INTO public.wallet (id, "fastagBalance", "walletCredits", "autoRecharge")
VALUES ('default-wallet', 850.00, 150.00, true)
ON CONFLICT (id) DO NOTHING;

-- Seed default active booking
INSERT INTO public.bookings (
  id, "spotId", "spotTitle", "slotNumber", location, distance, type, "gateOTP",
  "qrData", "startTime", "endTime", "remainingMinutes", "totalAmount", "platformFee",
  "paidTotal", "hasEVAddon", "evChargerType", status, "overstaySimulated"
) VALUES (
  'PN-HYD-98214', 'spot-1', 'Gachibowli Office Basement (Slot A12)', 'Slot A12',
  'Opp. DLF Cybercity Gate 2, Gachibowli, Hyderabad 500032', '0.8 km (3 min away)',
  'Office Basement', '4829', 'PARKNEST:SLOT-A12:AUTH-4829:DLF-GACHIBOWLI',
  '10:30 AM', '1:30 PM', 47, 90.0, 13.5, 103.5, false, null, 'ACTIVE', false
)
ON CONFLICT (id) DO NOTHING;

-- Seed initial transactions
INSERT INTO public.transactions (id, title, subtitle, amount, "isCredit", tag, time)
VALUES 
  ('tx-1', 'Inconvenience Compensation Credit', 'Order #2 Conflict Auto-Refund & Credit', '+₹50.00', true, 'ParkNest Apology Credit', 'Today, 1:32 PM'),
  ('tx-2', 'DLF Cybercity Gate 2 Boom Barrier', 'Slot A12 • Auto-Pay Barrier Debit', '-₹30.00', false, 'Gate Barrier Auto-Pay', 'Today, 10:30 AM'),
  ('tx-3', 'Inorbit Mall Mindspace P2 EV', '30kW DC Fast Charge (18.4 kWh)', '-₹180.00', false, 'EV Fast Charging', 'Yesterday, 6:45 PM')
ON CONFLICT (id) DO NOTHING;

-- Seed host profile
INSERT INTO public.host_profile (id, name, "propertyName", "todayEarnings", "pendingPayout", "masterActive", "totalHosted")
VALUES ('host-1', 'Ananya Reddy', 'Jubilee Hills Villa & DLF Bay', 640.00, 280.00, true, 4)
ON CONFLICT (id) DO NOTHING;
