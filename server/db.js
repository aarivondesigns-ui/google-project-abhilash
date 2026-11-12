import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'parknest.db');

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Initialize Database Tables
export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS spots (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,
      type TEXT,
      slotNumber TEXT,
      address TEXT,
      area TEXT,
      basePrice REAL,
      rating REAL,
      reviewsCount INTEGER,
      distanceKm REAL,
      durationMin INTEGER,
      perks TEXT,
      hasEV INTEGER,
      evDetails TEXT,
      aiProbability INTEGER,
      aiStatus TEXT,
      aiStatusColor TEXT,
      aiInsight TEXT,
      cuisineTag TEXT,
      offerBadge TEXT,
      swiggyPerk TEXT,
      hostName TEXT,
      hostPhone TEXT,
      hostRating REAL,
      realLat REAL,
      realLng REAL,
      image TEXT,
      totalSlots INTEGER,
      availableSlots INTEGER,
      gateAccessCode TEXT,
      gateType TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      spotId TEXT,
      spotTitle TEXT,
      slotNumber TEXT,
      location TEXT,
      distance TEXT,
      type TEXT,
      gateOTP TEXT,
      qrData TEXT,
      startTime TEXT,
      endTime TEXT,
      remainingMinutes INTEGER,
      totalAmount REAL,
      platformFee REAL,
      paidTotal REAL,
      hasEVAddon INTEGER,
      evChargerType TEXT,
      status TEXT,
      overstaySimulated INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS wallet (
      id TEXT PRIMARY KEY,
      fastagBalance REAL,
      walletCredits REAL,
      autoRecharge INTEGER,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      title TEXT,
      subtitle TEXT,
      amount TEXT,
      isCredit INTEGER,
      tag TEXT,
      time TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS host_profile (
      id TEXT PRIMARY KEY,
      name TEXT,
      propertyName TEXT,
      todayEarnings REAL,
      pendingPayout REAL,
      masterActive INTEGER,
      totalHosted INTEGER
    );

    CREATE TABLE IF NOT EXISTS gate_logs (
      id TEXT PRIMARY KEY,
      vehicleNo TEXT,
      vehicleModel TEXT,
      gateOTP TEXT,
      time TEXT,
      action TEXT,
      fee REAL,
      status TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default data if spots table is empty
  const count = db.prepare('SELECT count(*) as count FROM spots').get().count;
  if (count === 0) {
    seedInitialData();
  }
}

function seedInitialData() {
  const insertSpot = db.prepare(`
    INSERT INTO spots (
      id, name, category, type, slotNumber, address, area, basePrice, rating,
      reviewsCount, distanceKm, durationMin, perks, hasEV, evDetails,
      aiProbability, aiStatus, aiStatusColor, aiInsight, cuisineTag,
      offerBadge, swiggyPerk, hostName, hostPhone, hostRating,
      realLat, realLng, image, totalSlots, availableSlots, gateAccessCode, gateType
    ) VALUES (
      @id, @name, @category, @type, @slotNumber, @address, @area, @basePrice, @rating,
      @reviewsCount, @distanceKm, @durationMin, @perks, @hasEV, @evDetails,
      @aiProbability, @aiStatus, @aiStatusColor, @aiInsight, @cuisineTag,
      @offerBadge, @swiggyPerk, @hostName, @hostPhone, @hostRating,
      @realLat, @realLng, @image, @totalSlots, @availableSlots, @gateAccessCode, @gateType
    )
  `);

  const initialSpots = [
    {
      id: 'spot-1',
      name: 'Gachibowli Office Basement (Slot A12)',
      category: 'Offices',
      type: 'Office',
      slotNumber: 'Slot A12',
      address: 'Opp. DLF Cybercity Gate 2, Gachibowli, Hyderabad 500032',
      area: 'Gachibowli',
      basePrice: 30,
      rating: 4.8,
      reviewsCount: 120,
      distanceKm: 0.8,
      durationMin: 3,
      perks: JSON.stringify(['Covered', 'CCTV', '24x7 Access', 'Security Guard', 'Boom Barrier']),
      hasEV: 0,
      evDetails: null,
      aiProbability: 85,
      aiStatus: 'High Probability',
      aiStatusColor: '#10B981',
      aiInsight: 'Historical turnover peak at 11:30 AM. 42 vehicles vacated in last 2 hrs.',
      cuisineTag: 'Tech Park • Workday Parking',
      offerBadge: 'AI Fast-Pass',
      swiggyPerk: null,
      hostName: 'Venkatesh Rao (CyberTower Facility)',
      hostPhone: '+91 98490 12345',
      hostRating: 4.9,
      realLat: 17.4435,
      realLng: 78.3582,
      image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
      totalSlots: 15,
      availableSlots: 4,
      gateAccessCode: '4829',
      gateType: 'Automated ANPR + Security OTP',
    },
    {
      id: 'spot-5',
      name: 'DLF Cybercity North Gate Multi-Deck Bay',
      category: 'Offices & Commercial',
      type: 'Multi-Deck Garage + Fast EV',
      slotNumber: 'North Deck Lot P1',
      address: 'Opp DLF Cybercity Gate 1, Gachibowli, Hyderabad 500032',
      area: 'Gachibowli',
      basePrice: 25,
      rating: 4.9,
      reviewsCount: 480,
      distanceKm: 0.6,
      durationMin: 2,
      perks: JSON.stringify(['Open Till 3 AM', 'Valet Assist', 'Auto Barrier Entry', 'CCTV Monitored', 'Quick Exit']),
      hasEV: 1,
      evDetails: JSON.stringify({
        chargerPrice: 25,
        types: [
          { name: '15kW Fast DC Gun', power: '15kW', plug: 'CCS-2', status: 'Available Now', speed: 'High speed top-up', addOnPrice: 25 },
          { name: '3.3kW 15A Socket', power: '3.3kW', plug: 'Standard 15A', status: 'Available Now', speed: 'Slow trickle', addOnPrice: 15 },
        ],
        currentQueue: 0,
      }),
      aiProbability: 88,
      aiStatus: 'High Turnover / Quick Spots',
      aiStatusColor: '#10B981',
      aiInsight: 'Rapid parking turnover every 25 mins. Vacant slots opening continuously.',
      cuisineTag: 'DLF IT Corridor • Fast Barrier Bay',
      offerBadge: 'FLAT ₹15 OFF (Code PARK15)',
      swiggyPerk: 'Guaranteed reserved bay near express exit boom barrier',
      hostName: 'DLF Facility Operations',
      hostPhone: '+91 97000 11223',
      hostRating: 4.9,
      realLat: 17.4475,
      realLng: 78.3565,
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
      totalSlots: 20,
      availableSlots: 7,
      gateAccessCode: '2981',
      gateType: 'QR Token & Guard Pass',
    },
    {
      id: 'spot-6',
      name: 'Road 45 Jubilee Hills Commercial Valet Bay',
      category: 'Commercial & Valet',
      type: 'Premium Covered Bay + EV',
      slotNumber: 'Commercial Valet Bay 3',
      address: 'Plot 716, Road Number 45, Jubilee Hills, Hyderabad 500033',
      area: 'Jubilee Hills',
      basePrice: 40,
      rating: 4.8,
      reviewsCount: 340,
      distanceKm: 1.8,
      durationMin: 7,
      perks: JSON.stringify(['Valet Parking', 'Dedicated EV Stall', 'Covered Bay', 'CCTV Security']),
      hasEV: 1,
      evDetails: JSON.stringify({
        chargerPrice: 30,
        types: [
          { name: '11kW AC Dual Type-2', power: '11kW', plug: 'Type-2', status: 'Available Now', speed: 'Full vehicle charge', addOnPrice: 25 },
        ],
        currentQueue: 0,
      }),
      aiProbability: 82,
      aiStatus: 'High Probability',
      aiStatusColor: '#10B981',
      aiInsight: 'Commercial turnaround avg 45 mins. 3 EV valet spots ready right now.',
      cuisineTag: 'Road 45 Commercial Strip • Valet Bay',
      offerBadge: 'FREE Valet (Code VALETFREE)',
      swiggyPerk: 'Trained valet assistance with digital handover verification',
      hostName: 'Jubilee Commercial Hospitality',
      hostPhone: '+91 98480 99887',
      hostRating: 4.9,
      realLat: 17.4355,
      realLng: 78.4020,
      image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80',
      totalSlots: 10,
      availableSlots: 3,
      gateAccessCode: '5512',
      gateType: 'Boutique Valet Ticket',
    },
    {
      id: 'spot-7',
      name: 'Cyber Towers Junction Commercial Plaza Parking',
      category: 'Commercial & Metro',
      type: 'Basement Lot + 30kW DC EV',
      slotNumber: 'Plaza Slot D04',
      address: 'Beside Cyber Towers, Main Hitec City Road, Madhapur, Hyderabad 500081',
      area: 'Hitec City',
      basePrice: 35,
      rating: 4.7,
      reviewsCount: 620,
      distanceKm: 1.2,
      durationMin: 5,
      perks: JSON.stringify(['Auto Barrier Entry', 'AC Waiting Lounge', 'Covered Lot', 'Security Guard', 'Metro Walkway']),
      hasEV: 1,
      evDetails: JSON.stringify({
        chargerPrice: 30,
        types: [
          { name: '30kW DC Fast Gun', power: '30kW', plug: 'CCS-2', status: 'Available Now', speed: '0-80% in 35 mins', addOnPrice: 30 },
        ],
        currentQueue: 0,
      }),
      aiProbability: 72,
      aiStatus: 'High Turnover',
      aiStatusColor: '#10B981',
      aiInsight: 'Business rush active; 12 commuter vehicles clearing out.',
      cuisineTag: 'Madhapur Metro • Auto Barrier Gate',
      offerBadge: '₹25 Wallet Cashback',
      swiggyPerk: 'Direct covered walkway to Hitec City Metro Station',
      hostName: 'Cyber Towers Facility Corp',
      hostPhone: '+91 98850 44332',
      hostRating: 4.8,
      realLat: 17.4502,
      realLng: 78.3812,
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
      totalSlots: 25,
      availableSlots: 5,
      gateAccessCode: '7721',
      gateType: 'Smart RFID & QR Pass',
    },
    {
      id: 'spot-2',
      name: 'Inorbit Mall Commercial Lot (Slot B04)',
      category: 'EV Charging',
      type: 'Commercial Multi-Level + EV',
      slotNumber: 'Slot B04',
      address: 'Inorbit Mall Basement Level P2, Mindspace Cyberabad, Madhapur, Hyderabad 500081',
      area: 'Hitec City / Madhapur',
      basePrice: 50,
      rating: 4.7,
      reviewsCount: 95,
      distanceKm: 1.5,
      durationMin: 6,
      perks: JSON.stringify(['Covered', 'Valet Assist', 'CCTV', 'Wheelchair Friendly', 'Near Mall Elevators']),
      hasEV: 1,
      evDetails: JSON.stringify({
        chargerPrice: 30,
        types: [
          { name: '30kW DC Fast Charger', power: '30kW', plug: 'CCS-2', status: 'Available Now', speed: '0-80% in 45m', addOnPrice: 30 },
          { name: '7.4kW AC Type-2', power: '7.4kW', plug: 'Type-2', status: 'Available Now', speed: 'Regular Top-up', addOnPrice: 20 },
        ],
        currentQueue: 0,
      }),
      aiProbability: 60,
      aiStatus: 'Medium Probability',
      aiStatusColor: '#F5B800',
      aiInsight: 'Commercial mall influx detected. Expect vacancy shift in 22 mins.',
      cuisineTag: 'Mindspace Cyberabad • P2 Multi-Deck Deck',
      offerBadge: '30% OFF (Code WEEKENDHYD)',
      swiggyPerk: 'Priority multi-deck covered spot right next to passenger elevators',
      hostName: 'Mindspace Inorbit Hub',
      hostPhone: '+91 99890 54321',
      hostRating: 4.8,
      realLat: 17.4340,
      realLng: 78.3866,
      image: 'https://images.unsplash.com/photo-1519642918688-7e43b19245d8?auto=format&fit=crop&w=800&q=80',
      totalSlots: 40,
      availableSlots: 6,
      gateAccessCode: '6194',
      gateType: 'Auto Barrier & QR Pass',
    },
    {
      id: 'spot-8',
      name: 'WaveRock Financial District Commercial Lot & Supercharger',
      category: 'Tech Park & EV Hub',
      type: 'Commercial Deck + 50kW EV Supercharger',
      slotNumber: 'WaveRock West Bay 08',
      address: 'Near WaveRock IT Gateway, Nanakramguda, Financial District, Hyderabad 500032',
      area: 'Financial District',
      basePrice: 45,
      rating: 4.9,
      reviewsCount: 410,
      distanceKm: 2.1,
      durationMin: 8,
      perks: JSON.stringify(['50kW EV Supercharger', 'Shaded Bay', 'Security Guard', '24x7 Boom Barrier']),
      hasEV: 1,
      evDetails: JSON.stringify({
        chargerPrice: 35,
        types: [
          { name: '50kW Supercharger CCS-2', power: '50kW', plug: 'CCS-2', status: 'Available Now', speed: '0-80% in 28m', addOnPrice: 35 },
        ],
        currentQueue: 0,
      }),
      aiProbability: 75,
      aiStatus: 'Optimal Availability',
      aiStatusColor: '#10B981',
      aiInsight: 'Workday turnover active; 6 supercharger stalls available right now.',
      cuisineTag: 'Financial District • 50kW Fast EV Supercharger',
      offerBadge: 'FLAT ₹100 EV Credit (Code EVSUPER100)',
      swiggyPerk: 'Reserved 50kW supercharger bay with complimentary windshield wipe',
      hostName: 'WaveRock Parking & Mobility Ops',
      hostPhone: '+91 99123 77665',
      hostRating: 4.9,
      realLat: 17.4210,
      realLng: 78.3490,
      image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80',
      totalSlots: 18,
      availableSlots: 6,
      gateAccessCode: '4040',
      gateType: 'Valet Concierge Pass',
    },
    {
      id: 'spot-4',
      name: 'Jubilee Hills Residential Driveway',
      category: 'Homes',
      type: 'Home (Airbnb-Style Host)',
      slotNumber: 'Private Driveway Slot',
      address: 'Villa 14, Rd Number 36, Near Peddamma Temple Metro, Jubilee Hills, Hyderabad 500033',
      area: 'Jubilee Hills',
      basePrice: 20,
      rating: 4.6,
      reviewsCount: 42,
      distanceKm: 1.1,
      durationMin: 4,
      perks: JSON.stringify(['Gated Society', 'Security Guard', 'Shaded Tree Cover', 'Safe Quiet Lane']),
      hasEV: 0,
      evDetails: null,
      aiProbability: 92,
      aiStatus: 'High Probability',
      aiStatusColor: '#10B981',
      aiInsight: 'Host Ananya is at office till 7 PM. Slot guaranteed 100% empty.',
      cuisineTag: 'Road 36 Residential Strip • Quiet Secure Bay',
      offerBadge: 'Budget Pick ₹20/h',
      swiggyPerk: 'Peaceful private residential driveway with security gate phone verify',
      hostName: 'Ananya Reddy (Homeowner)',
      hostPhone: '+91 98765 43210',
      hostRating: 4.9,
      realLat: 17.4319,
      realLng: 78.4073,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      totalSlots: 2,
      availableSlots: 2,
      gateAccessCode: '3104',
      gateType: 'Gated Society Guard Call',
    },
  ];

  initialSpots.forEach((spot) => insertSpot.run(spot));

  // Seed default wallet
  db.prepare(`
    INSERT INTO wallet (id, fastagBalance, walletCredits, autoRecharge)
    VALUES ('default-wallet', 850.00, 150.00, 1)
  `).run();

  // Seed default booking (Slot A12)
  db.prepare(`
    INSERT INTO bookings (
      id, spotId, spotTitle, slotNumber, location, distance, type, gateOTP,
      qrData, startTime, endTime, remainingMinutes, totalAmount, platformFee,
      paidTotal, hasEVAddon, evChargerType, status, overstaySimulated
    ) VALUES (
      'PN-HYD-98214', 'spot-1', 'Gachibowli Office Basement (Slot A12)', 'Slot A12',
      'Opp. DLF Cybercity Gate 2, Gachibowli, Hyderabad 500032', '0.8 km (3 min away)',
      'Office Basement', '4829', 'PARKNEST:SLOT-A12:AUTH-4829:DLF-GACHIBOWLI',
      '10:30 AM', '1:30 PM', 47, 90.0, 13.5, 103.5, 0, NULL, 'ACTIVE', 0
    )
  `).run();

  // Seed transactions
  const insertTx = db.prepare(`
    INSERT INTO transactions (id, title, subtitle, amount, isCredit, tag, time)
    VALUES (@id, @title, @subtitle, @amount, @isCredit, @tag, @time)
  `);

  [
    {
      id: 'tx-1',
      title: 'Inconvenience Compensation Credit',
      subtitle: 'Order #2 Conflict Auto-Refund & Credit',
      amount: '+₹50.00',
      isCredit: 1,
      tag: 'ParkNest Apology Credit',
      time: 'Today, 1:32 PM',
    },
    {
      id: 'tx-2',
      title: 'DLF Cybercity Gate 2 Boom Barrier',
      subtitle: 'Slot A12 • Auto-Pay Barrier Debit',
      amount: '-₹30.00',
      isCredit: 0,
      tag: 'Gate Barrier Auto-Pay',
      time: 'Today, 10:30 AM',
    },
    {
      id: 'tx-3',
      title: 'Inorbit Mall Mindspace P2 EV',
      subtitle: '30kW DC Fast Charge (18.4 kWh)',
      amount: '-₹180.00',
      isCredit: 0,
      tag: 'EV Fast Charging',
      time: 'Yesterday, 6:45 PM',
    },
  ].forEach((tx) => insertTx.run(tx));

  // Seed Host profile
  db.prepare(`
    INSERT INTO host_profile (id, name, propertyName, todayEarnings, pendingPayout, masterActive, totalHosted)
    VALUES ('host-1', 'Ananya Reddy', 'Jubilee Hills Villa & DLF Bay', 640.00, 280.00, 1, 4)
  `).run();

  // Seed Gate telemetry logs
  const insertGate = db.prepare(`
    INSERT INTO gate_logs (id, vehicleNo, vehicleModel, gateOTP, time, action, fee, status)
    VALUES (@id, @vehicleNo, @vehicleModel, @gateOTP, @time, @action, @fee, @status)
  `);

  [
    {
      id: 'gate-1',
      vehicleNo: 'TS 09 EB 4421',
      vehicleModel: 'Hyundai Ioniq 5',
      gateOTP: '3104',
      time: 'Today, 11:15 AM',
      action: 'Inbound Boom Barrier Lifted',
      fee: 80.0,
      status: 'Active Parked',
    },
    {
      id: 'gate-2',
      vehicleNo: 'TS 07 FA 8890',
      vehicleModel: 'Tata Nexon EV',
      gateOTP: '7819',
      time: 'Today, 8:45 AM',
      action: 'Outbound Barrier Cleared',
      fee: 150.0,
      status: 'Completed',
    },
  ].forEach((g) => insertGate.run(g));
}
