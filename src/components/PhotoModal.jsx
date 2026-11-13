import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

export default function PhotoModal({ title, spot, initialCategory = 'all', onClose }) {
  // Generate 100% unique, customized photo sets for every specific Hyderabad venue
  const getContextualPhotos = (s) => {
    if (s?.gallery && s.gallery.length > 0) return s.gallery;

    const name = s?.name || '';
    const type = s?.type || '';
    const cat = s?.category || '';

    // 1. DLF Cybercity North Gate Multi-Deck Bay
    if (name.includes('DLF') || name.includes('Street Food') || name.includes('Maggi') || s?.id === 'spot-5') {
      return [
        {
          id: 1,
          title: 'DLF Cybercity North Gate Parking Facility',
          tag: 'Multi-Deck Bay',
          url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
          desc: 'High-turnover multi-level garage right opposite DLF Cybercity Gate 1.',
        },
        {
          id: 2,
          title: 'Covered Multi-Deck Ramp & Wide Stalls',
          tag: 'Covered Bay',
          url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
          desc: 'Spacious concrete stalls with painted lane markers, rubber corner guards, and bright LED illumination.',
        },
        {
          id: 3,
          title: 'Automated ANPR Sensor Boom Barrier',
          tag: 'Auto-Gate Entry',
          url: 'https://images.unsplash.com/photo-1617886322207-6f504e7472c5?auto=format&fit=crop&w=1200&q=80',
          desc: 'Automated barrier gate with real-time license plate detection and guard intercom.',
        },
        {
          id: 4,
          title: '15kW DC Quick EV Charger & Guard Post',
          tag: 'EV Fast Top-up',
          url: 'https://images.unsplash.com/photo-1558441719-81fc5a953a99?auto=format&fit=crop&w=1200&q=80',
          desc: 'CCS-2 fast charging station allowing you to top up your EV battery quickly.',
        },
      ];
    }

    // 2. Road 45 Jubilee Hills Commercial Valet Bay
    if (name.includes('Road 45') || name.includes('Conç') || name.includes('Patisserie') || s?.id === 'spot-6') {
      return [
        {
          id: 1,
          title: 'Road 45 Jubilee Hills Commercial Valet Bay',
          tag: 'Valet Concierge',
          url: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1200&q=80',
          desc: 'Commercial district parking facility on Road 45, Jubilee Hills with professional valets.',
        },
        {
          id: 2,
          title: 'Uniformed Valet Desk & Digital Key Escrow',
          tag: 'Key Escrow',
          url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
          desc: 'Digital handover inspection, barcode key tags, and secure biometric key locker.',
        },
        {
          id: 3,
          title: 'Reserved Shaded Commercial Bays',
          tag: 'Shaded Parking',
          url: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80',
          desc: 'Clean interlocking paved bays with dedicated security guard attendance.',
        },
        {
          id: 4,
          title: '11kW Dual Type-2 AC EV Pedestal',
          tag: 'EV Charging',
          url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
          desc: 'Smart RFID-enabled EV charger ready for a full top-up.',
        },
      ];
    }

    // 3. WaveRock Financial District Commercial Lot & Supercharger (Image 1 fix)
    if (name.includes('WaveRock') || name.includes('Zero40') || name.includes('Brewery') || s?.id === 'spot-8') {
      return [
        {
          id: 1,
          title: 'WaveRock Financial District Commercial Bay',
          tag: 'Commercial Lot',
          url: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1200&q=80',
          desc: 'High-capacity commercial parking lot located near WaveRock IT Gateway in Nanakramguda.',
        },
        {
          id: 2,
          title: '50kW DC Fast EV Supercharger Pedestal',
          tag: '50kW Supercharger',
          url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
          desc: 'High-speed 50kW CCS-2 supercharger gun that replenishes 0-80% in 28 minutes.',
        },
        {
          id: 3,
          title: 'Covered Vehicle Stalls & Concrete Paving',
          tag: 'Covered Lot',
          url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
          desc: 'Weather-protected shaded stalls with individual vehicle stoppers and rubber corner guards.',
        },
        {
          id: 4,
          title: '24x7 Security Guard Cabin & Boom Barrier',
          tag: 'Guarded Gate',
          url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
          desc: 'Round-the-clock physical security outpost with CCTV monitors and automatic license plate scanning.',
        },
      ];
    }

    // 4. Cyber Towers Junction Commercial Plaza Parking
    if (name.includes('Cyber Towers') || name.includes('Paradise') || name.includes('Biryani') || s?.id === 'spot-7') {
      return [
        {
          id: 1,
          title: 'Cyber Towers Junction Commercial Plaza Entrance',
          tag: 'Plaza Entry',
          url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
          desc: 'High-visibility commercial parking facility beside Cyber Towers, Madhapur.',
        },
        {
          id: 2,
          title: 'Underground Multi-Bay Facility',
          tag: 'Basement Bays',
          url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
          desc: 'Spacious air-conditioned facility with dedicated lanes and elevator access to the main road.',
        },
        {
          id: 3,
          title: '30kW DC Fast EV Charging Gun',
          tag: '30kW Fast DC',
          url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
          desc: 'CCS-2 fast charging station allowing complete recharge while you work or commute.',
        },
        {
          id: 4,
          title: 'Direct Covered Walkway to Hitec City Metro',
          tag: 'Metro Access',
          url: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80',
          desc: 'Protected direct pedestrian skywalk connecting directly into Hitec City Metro Station.',
        },
      ];
    }

    // 5. Inorbit Mall Mindspace Commercial Lot
    if (name.includes('Inorbit') || name.includes('Mall')) {
      return [
        {
          id: 1,
          title: 'Inorbit Mall Mindspace Multi-Deck Garage',
          tag: 'Mall Garage P2',
          url: 'https://images.unsplash.com/photo-1519642918688-7e43b19245d8?auto=format&fit=crop&w=1200&q=80',
          desc: 'Multi-level parking facility with overhead vacancy light indicators and wide parking aisles.',
        },
        {
          id: 2,
          title: '30kW DC Dual-Gun Fast EV Station',
          tag: '30kW DC Fast',
          url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80',
          desc: 'CCS-2 fast charging station capable of full recharge during shopping or dining.',
        },
        {
          id: 3,
          title: 'Direct Mall & Food Court Express Lobby',
          tag: 'Mall Entrance',
          url: 'https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=1200&q=80',
          desc: 'Convenient glass elevators leading directly into Inorbit food court and shopping floors.',
        },
        {
          id: 4,
          title: 'High-Speed ANPR Boom Barrier Gate',
          tag: 'ANPR Gate Pass',
          url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
          desc: 'Automatic gate lifting in 1.8 seconds via ANPR optical number-plate scanner.',
        },
      ];
    }

    // 6. Knowledge City Gourmet Hub & T-Hub
    if (name.includes('Knowledge City') || name.includes('T-Hub')) {
      return [
        {
          id: 1,
          title: 'Knowledge City Innovation Glass Towers',
          tag: 'Tech Campus',
          url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
          desc: 'Iconic architectural high-rises housing Hyderabad’s premier tech innovators and global hubs.',
        },
        {
          id: 2,
          title: 'Corporate Multi-Level Underground Facility',
          tag: 'Basement Deck',
          url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
          desc: 'Clean painted basement lanes with digital occupancy displays, speed bumps, and high-speed elevator lobbies.',
        },
        {
          id: 3,
          title: 'Solar-Canopy Executive Parking Deck',
          tag: 'Solar Bays',
          url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1200&q=80',
          desc: 'Solar panel roof providing continuous cool shade and weather protection for parked vehicles.',
        },
        {
          id: 4,
          title: '60kW Ultra-Fast EV Supercharger Pod',
          tag: '60kW Supercharger',
          url: 'https://images.unsplash.com/photo-1558441719-81fc5a953a99?auto=format&fit=crop&w=1200&q=80',
          desc: 'High-speed fast charging pedestal delivering 100km range in under 15 minutes.',
        },
      ];
    }

    // 7. Jubilee Hills Residential Villa Driveway
    if (name.includes('Jubilee Hills') || name.includes('Driveway') || cat === 'Homes') {
      return [
        {
          id: 1,
          title: 'Jubilee Hills Luxury Villa Gated Driveway',
          tag: 'Private Gated',
          url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
          desc: 'Private residential compound in Jubilee Hills with mature trees and discrete access.',
        },
        {
          id: 2,
          title: 'Granite-Paved Shaded Portico Bay',
          tag: 'Car Portico',
          url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
          desc: 'Covered architectural portico with polished granite flooring protecting vehicles from dust and sun.',
        },
        {
          id: 3,
          title: 'Motorized Sliding Gate with Video Access',
          tag: 'Smart Gate',
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          desc: 'Remote motorized sliding gate unlocked automatically via your ParkNest 4-digit OTP.',
        },
        {
          id: 4,
          title: 'Night Security Camera & Garden Perimeter',
          tag: 'CCTV Security',
          url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
          desc: 'Illuminated perimeter with 24x7 recorded high-definition CCTV security surveillance.',
        },
      ];
    }

    // 8. WaveRock IT SEZ & Financial District Tech Park
    if (name.includes('WaveRock') || name.includes('Financial District')) {
      return [
        {
          id: 1,
          title: 'WaveRock IT SEZ Campus Architecture',
          tag: 'SEZ Campus',
          url: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1200&q=80',
          desc: 'LEED Gold certified IT SEZ campus in Nanakramguda, Financial District.',
        },
        {
          id: 2,
          title: 'Corporate Executive Underground Bay (Level 1)',
          tag: 'Level 1 Bay',
          url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
          desc: 'Epoxy-coated floor with numbered pillars, directional arrows, and clear clearance markers.',
        },
        {
          id: 3,
          title: 'Double-Lane Security Boom Barriers',
          tag: 'Corporate Boom',
          url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
          desc: 'Dedicated visitor and corporate pass automated barrier lanes with smart RFID clearance.',
        },
        {
          id: 4,
          title: '50kW Supercharger DC Fast Station',
          tag: '50kW Supercharger',
          url: 'https://images.unsplash.com/photo-1558441719-81fc5a953a99?auto=format&fit=crop&w=1200&q=80',
          desc: 'Dual CCS-2 fast chargers ready for heavy business day top-ups.',
        },
      ];
    }

    // 9. Roastery Coffee House Banjara Hills
    if (name.includes('Roastery') || name.includes('Coffee')) {
      return [
        {
          id: 1,
          title: 'Roastery Heritage Bungalow Facade',
          tag: 'Colonial Villa',
          url: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1200&q=80',
          desc: 'Historic whitewashed colonial bungalow transformed into Hyderabad’s celebrated roastery.',
        },
        {
          id: 2,
          title: 'Specialty Cold Brews & Coffee Roaster',
          tag: 'Artisan Roast',
          url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
          desc: 'On-site coffee bean roasting and pour-overs made with award-winning Indian estate beans.',
        },
        {
          id: 3,
          title: 'Shaded Garden Courtyard Dining',
          tag: 'Garden Cafe',
          url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
          desc: 'Lush tree-canopied courtyard with rustic seating and peaceful ambiance.',
        },
        {
          id: 4,
          title: 'Bungalow Compound Gravel Parking Lot',
          tag: 'Compound Lot',
          url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
          desc: 'Enclosed gravel parking lot inside the property gates with dedicated guard assistance.',
        },
      ];
    }

    // 10. Default / Gachibowli Office Basement (Slot A12)
    return [
      {
        id: 1,
        title: 'Office Basement Parking Bay (Slot A12)',
        tag: 'Allocated Bay',
        url: s?.image || 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
        desc: 'Designated parking bay with clear overhead numbering, rubberized wheel stops, and bright LED lighting.',
      },
      {
        id: 2,
        title: 'DLF Cybercity Gate 2 Boom Barrier',
        tag: 'ANPR Gate',
        url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
        desc: 'Optical ANPR camera and RFID antenna recognizing license plates upon approach.',
      },
      {
        id: 3,
        title: 'Level B1 EV Charging Station',
        tag: s?.hasEV ? '30kW DC Fast' : 'EV Ready Bay',
        url: 'https://images.unsplash.com/photo-1558441719-81fc5a953a99?auto=format&fit=crop&w=1200&q=80',
        desc: 'Dedicated electric vehicle charging stall with live LED status and surge protector.',
      },
      {
        id: 4,
        title: '24x7 Security Control Booth & Guard Desk',
        tag: 'Guard Post',
        url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
        desc: 'Full perimeter coverage with high-definition night-vision CCTV cameras and on-site guard.',
      },
    ];
  };

  const photos = getContextualPhotos(spot);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPhoto = photos[currentIndex] || photos[0];

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#161920] border border-cardBorder rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="bg-[#161920]/95 px-4 py-3 border-b border-cardBorder flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brandYellow/15 text-brandYellow flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-brandYellow uppercase tracking-wider">
                Photo Gallery Inspection
              </div>
              <h3 className="text-xs font-bold text-white truncate max-w-[260px]">
                {spot?.name || title || 'Location Photo Proof'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#262A34] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Photo Display */}
        <div className="relative w-full h-64 sm:h-72 bg-black flex items-center justify-center overflow-hidden">
          <img
            src={currentPhoto.url}
            alt={currentPhoto.title}
            className="w-full h-full object-cover transition-all duration-300"
          />

          {/* Photo Tag Badge */}
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-cardBorder px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neonGreen animate-pulse"></span>
            <span>{currentPhoto.tag}</span>
          </div>

          {/* Counter pill */}
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-mono text-gray-300">
            {currentIndex + 1} / {photos.length}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevPhoto}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-all shadow-md active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextPhoto}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-all shadow-md active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Photo Captions & Info */}
        <div className="p-4 space-y-3">
          <div>
            <h4 className="text-sm font-bold text-white">{currentPhoto.title}</h4>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              {currentPhoto.desc}
            </p>
          </div>

          {/* Thumbnail Strip */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-cardBorder/60">
            {photos.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative rounded-xl overflow-hidden h-14 border-2 transition-all ${
                  currentIndex === idx
                    ? 'border-brandYellow scale-105 shadow-md glow-yellow'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <div className="p-3 bg-[#0B0D10] border-t border-cardBorder text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#161920] hover:bg-[#262A34] text-xs font-bold text-gray-200 border border-cardBorder transition-colors"
          >
            Close Photo Inspection
          </button>
        </div>
      </div>
    </div>
  );
}
