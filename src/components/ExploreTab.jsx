import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, MapPin, Star, Zap, Shield, 
  Navigation, Sparkles, ChevronRight, Map, List, X, Camera
} from 'lucide-react';
import MapCanvas from './MapCanvas';
import BookingModal from './BookingModal';
import PhotoModal from './PhotoModal';

export default function ExploreTab({ spots, onBookSpot }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedSpot, setSelectedSpot] = useState(spots[0]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'
  const [showMapCallout, setShowMapCallout] = useState(true);
  const [highlightCard, setHighlightCard] = useState(false);
  const scrollRef = useRef(null);
  const headerRef = useRef(null);
  const selectedCardRef = useRef(null);

  // Directly navigate to spot on map view
  const handleLookOnMap = (spot, e) => {
    if (e) e.stopPropagation();
    setSelectedSpot(spot);
    setViewMode('map');
    setShowMapCallout(false);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // When a spot is selected, automatically scroll to the Reserve Spot card at the top
  const handleSpotSelect = (spot, shouldScrollToReserve = true) => {
    setSelectedSpot(spot);
    setHighlightCard(true);
    setTimeout(() => setHighlightCard(false), 2000);

    if (shouldScrollToReserve) {
      setTimeout(() => {
        if (selectedCardRef.current && scrollRef.current) {
          const containerRect = scrollRef.current.getBoundingClientRect();
          const cardRect = selectedCardRef.current.getBoundingClientRect();
          const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 115;

          const currentScroll = scrollRef.current.scrollTop;
          const relativeOffset = cardRect.top - containerRect.top;
          const targetScroll = currentScroll + relativeOffset - headerHeight - 8;

          scrollRef.current.scrollTo({
            top: Math.max(0, targetScroll),
            behavior: 'smooth',
          });
        }
      }, 50);
    }
  };

  const filters = [
    { id: 'All', label: 'All Spots' },
    { id: 'EV Charging', label: '⚡ EV Charging' },
    { id: 'CCTV', label: '📹 CCTV Monitored' },
    { id: 'Covered', label: '☂️ Covered Bay' },
    { id: 'Security Guard', label: '🛡️ Security Guard' },
    { id: 'Boom Barrier', label: '🚧 Auto Barrier' },
    { id: 'Valet', label: '🚗 Valet Assist' },
    { id: 'Tech Park', label: '🏢 Tech Parks & Hubs' },
    { id: 'Late Night', label: '🌙 Open Till 3 AM' },
    { id: 'Budget', label: '💰 Under ₹30/h' },
  ];

  // Filtered spots based on user search and amenity options
  const filteredSpots = spots.filter((spot) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      spot.name.toLowerCase().includes(q) ||
      spot.address.toLowerCase().includes(q) ||
      spot.area.toLowerCase().includes(q) ||
      (spot.tag && spot.tag.toLowerCase().includes(q)) ||
      (spot.cuisineTag && spot.cuisineTag.toLowerCase().includes(q)) ||
      (spot.offerBadge && spot.offerBadge.toLowerCase().includes(q));

    if (!matchesQuery) return false;

    if (activeFilter === 'All') return true;
    if (activeFilter === 'EV Charging') return spot.hasEV;
    if (activeFilter === 'CCTV') return spot.perks?.some((p) => p.toLowerCase().includes('cctv'));
    if (activeFilter === 'Covered') return spot.perks?.some((p) => p.toLowerCase().includes('covered') || p.toLowerCase().includes('shaded'));
    if (activeFilter === 'Security Guard') return spot.perks?.some((p) => p.toLowerCase().includes('guard') || p.toLowerCase().includes('security'));
    if (activeFilter === 'Boom Barrier') return spot.perks?.some((p) => p.toLowerCase().includes('barrier') || p.toLowerCase().includes('boom') || p.toLowerCase().includes('fastag'));
    if (activeFilter === 'Valet') return spot.perks?.some((p) => p.toLowerCase().includes('valet'));
    if (activeFilter === 'Tech Park') return spot.category?.toLowerCase().includes('office') || spot.category?.toLowerCase().includes('tech') || spot.category?.toLowerCase().includes('commercial') || spot.category?.toLowerCase().includes('corporate');
    if (activeFilter === 'Late Night') return spot.perks?.some((p) => p.toLowerCase().includes('3 am') || p.toLowerCase().includes('late') || p.toLowerCase().includes('24x7'));
    if (activeFilter === 'Budget') return spot.basePrice <= 30;
    return true;
  });

  // Automatically keep selected spot synchronized with active filter
  useEffect(() => {
    if (filteredSpots.length > 0 && !filteredSpots.some((s) => s.id === selectedSpot?.id)) {
      setSelectedSpot(filteredSpots[0]);
    }
  }, [activeFilter, filteredSpots]);

  return (
    <div ref={scrollRef} className="flex-1 flex flex-col h-full overflow-y-auto relative no-scrollbar">
      {/* Top Search Bar & Filter Pills (Sticky) */}
      <div ref={headerRef} className="sticky top-0 bg-[#0B0D10]/95 backdrop-blur-md px-4 pt-3 pb-2.5 border-b border-cardBorder space-y-2.5 z-30 flex-shrink-0 shadow-lg">
        {/* Clean, Modern Search Bar */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-brandYellow absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search areas, landmarks, or EV charging bays..."
            className="w-full bg-[#161920] border border-cardBorder rounded-2xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brandYellow transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 w-5 h-5 rounded-full bg-gray-700/80 hover:bg-gray-600 text-gray-300 flex items-center justify-center text-xs transition-colors"
              title="Clear Search"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Swiggy Style Filter Pills with View Switcher */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1.5 flex-1 overflow-x-auto no-scrollbar">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 border ${
                    isActive
                      ? 'bg-brandYellow text-black border-brandYellow glow-yellow font-bold shadow-md'
                      : 'bg-[#161920] text-gray-400 border-cardBorder hover:text-white hover:border-gray-600'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* Prominent Segmented Map / List Switcher */}
          <div className="relative flex items-center flex-shrink-0">
            <div className="flex items-center bg-[#161920] p-1 rounded-xl border border-cardBorder shadow-sm">
              <button
                onClick={() => {
                  setViewMode('map');
                  setShowMapCallout(false);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'map'
                    ? 'bg-brandYellow text-black shadow-md glow-yellow font-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Map</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'list'
                    ? 'bg-brandYellow text-black shadow-md glow-yellow font-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
            </div>

            {/* "Look in Map" Tooltip / Popup Callout with Bouncing Arrow */}
            {viewMode === 'list' && showMapCallout && (
              <div 
                onClick={() => {
                  setViewMode('map');
                  setShowMapCallout(false);
                }}
                className="absolute right-0 -bottom-9 z-40 cursor-pointer animate-bounce flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-400 text-black text-[10px] font-black px-2.5 py-1 rounded-xl shadow-2xl border border-yellow-200 whitespace-nowrap"
              >
                <span>🗺️ Look in Map ↗</span>
                <span className="text-[11px]">👆</span>
                {/* Arrow pointing up to Map button */}
                <div className="absolute -top-1 right-7 w-2 h-2 bg-yellow-400 rotate-45 border-t border-l border-yellow-200"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main View Area: Map View or List View */}
      {viewMode === 'map' ? (
        <div className="flex flex-col">
          {/* Hyderabad Interactive Map Canvas (Scrolls with the feed) */}
          <div className="h-[260px] w-full flex-shrink-0 relative border-b border-cardBorder isolate z-0">
            <MapCanvas
              spots={filteredSpots}
              selectedSpot={selectedSpot}
              onSelectSpot={(spot) => handleSpotSelect(spot, false)}
            />

            {/* Map Guidance Overlay Pill */}
            <div className="absolute top-2.5 left-3 z-10 pointer-events-none">
              <div className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-gray-200 border border-white/10 flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Live Map Radar • Tap any pin to view</span>
              </div>
            </div>
          </div>

          {/* Content Area Below Map */}
          <div className="px-4 py-3 space-y-3 pb-28">
            {/* Selected Spot Bottom Sheet Card */}
            {selectedSpot && (
              <div className="bg-[#161920] border border-cardBorder hover:border-brandYellow/50 rounded-3xl p-4 shadow-2xl transition-all relative">
                {/* AI Probability Badge & Swiggy Offer Top Row */}
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                    style={{
                      backgroundColor: `${selectedSpot.aiStatusColor}15`,
                      color: selectedSpot.aiStatusColor,
                      borderColor: `${selectedSpot.aiStatusColor}40`,
                    }}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{selectedSpot.aiProbability}% AI Availability • {selectedSpot.aiStatus}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                    <Navigation className="w-3 h-3 text-brandYellow" />
                    <span>{selectedSpot.distanceKm} km ({selectedSpot.durationMin}m)</span>
                  </div>
                </div>

                {/* Spot Thumbnail & Swiggy Restaurant Details */}
                <div className="flex items-start gap-3">
                  <div
                    onClick={() => setIsPhotoOpen(true)}
                    className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-cardBorder cursor-pointer group/img shadow-md hover:border-brandYellow transition-colors"
                    title="Click to view 4 spot photos"
                  >
                    <img
                      src={selectedSpot.image}
                      alt={selectedSpot.name}
                      className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                    />
                    {/* Clickable 4 Photos Pill */}
                    <div className="absolute top-1 left-1 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[8px] font-bold text-white flex items-center gap-1 border border-white/20">
                      <Camera className="w-2.5 h-2.5 text-brandYellow" />
                      <span>4 Photos</span>
                    </div>

                    {/* Swiggy Offer Ribbon Badge */}
                    {selectedSpot.offerBadge && (
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent py-1 px-1 text-center">
                        <span className="text-[8px] font-black uppercase text-brandYellow tracking-tight block truncate">
                          🏷️ {selectedSpot.offerBadge}
                        </span>
                      </div>
                    )}
                    {selectedSpot.hasEV && (
                      <div className="absolute top-1 right-1 bg-neonGreen text-black p-1 rounded-lg shadow font-black text-[9px] flex items-center">
                        <Zap className="w-3 h-3 fill-current" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-brandYellow uppercase tracking-wider">
                      <span>{selectedSpot.type}</span>
                    </div>

                    <h3 className="text-sm font-black text-white leading-tight truncate mt-0.5">
                      {selectedSpot.name}
                    </h3>

                    {/* Cuisine / Specialty Subtitle */}
                    {selectedSpot.cuisineTag && (
                      <p className="text-[11px] text-amber-300/90 font-medium truncate mt-0.5">
                        🍽️ {selectedSpot.cuisineTag}
                      </p>
                    )}

                    <p className="text-[10px] text-gray-400 truncate">
                      {selectedSpot.area}
                    </p>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-1 mt-1 text-xs">
                      <div className="flex items-center text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-current mr-0.5" />
                        <span>{selectedSpot.rating}</span>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        ({selectedSpot.reviewsCount} verified parkers)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Spot Bay Perk Pill */}
                {(selectedSpot.bayPerk || selectedSpot.parkingPerk || selectedSpot.swiggyPerk) && (
                  <div className="mt-2.5 p-2 rounded-xl bg-gradient-to-r from-brandYellow/10 to-transparent border border-brandYellow/30 flex items-center gap-1.5 text-[10px] text-amber-200">
                    <Shield className="w-3.5 h-3.5 text-brandYellow flex-shrink-0" />
                    <span className="truncate"><strong>Bay Advantage:</strong> {selectedSpot.bayPerk || selectedSpot.parkingPerk || selectedSpot.swiggyPerk}</span>
                  </div>
                )}

                {/* Perks Pills (Covered, CCTV, 24x7, Valet) */}
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {selectedSpot.perks.slice(0, 4).map((perk) => (
                    <span
                      key={perk}
                      className="text-[9px] bg-[#0B0D10] text-gray-300 px-2 py-0.5 rounded-md border border-cardBorder font-medium"
                    >
                      ✓ {perk}
                    </span>
                  ))}
                  {selectedSpot.hasEV && (
                    <span className="text-[9px] bg-neonGreen/10 text-neonGreen px-2 py-0.5 rounded-md border border-neonGreen/30 font-bold flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5 fill-current" /> EV Charger Ready
                    </span>
                  )}
                </div>

                {/* Pricing & "Book Now" Primary CTA */}
                <div className="mt-3.5 pt-3 border-t border-cardBorder flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">Parking Slot Rate</div>
                    <div className="text-base font-black text-white">
                      ₹{selectedSpot.basePrice}
                      <span className="text-xs font-normal text-gray-400">/hr</span>
                      {selectedSpot.hasEV && (
                        <span className="text-[10px] text-neonGreen ml-1.5 font-bold">
                          +₹{selectedSpot.evDetails.chargerPrice}/h EV
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPhotoOpen(true)}
                      className="px-2.5 py-3 bg-[#0B0D10] hover:bg-[#262A34] text-gray-300 hover:text-white border border-cardBorder rounded-xl flex items-center gap-1 transition-all shadow active:scale-95 text-xs font-semibold"
                      title="View all 4 spot photos"
                    >
                      <Camera className="w-4 h-4 text-brandYellow" />
                      <span className="text-[11px] hidden sm:inline">Photos</span>
                    </button>

                    <button
                      onClick={() => setIsBookingOpen(true)}
                      className="px-5 py-3 bg-brandYellow hover:bg-brandYellow-hover text-black font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-lg glow-yellow transition-all active:scale-95"
                    >
                      <span>Reserve Spot</span>
                      <ChevronRight className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Other Nearby Spots in Hyderabad (Scrollable Section) */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  More Hyderabad Dining & Parking ({filteredSpots.length - 1})
                </span>
                <span className="text-[10px] text-brandYellow">Tap to view on map</span>
              </div>

              <div className="space-y-2">
                {filteredSpots
                  .filter((s) => s.id !== selectedSpot?.id)
                  .map((spot) => (
                    <div
                      key={spot.id}
                      onClick={() => handleSpotSelect(spot, true)}
                      className="bg-[#161920]/80 border border-cardBorder hover:border-brandYellow/60 rounded-2xl p-2.5 flex items-center justify-between cursor-pointer transition-all active:scale-98"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative flex-shrink-0">
                          <img
                            src={spot.image}
                            alt={spot.name}
                            className="w-14 h-14 rounded-xl object-cover"
                          />
                          {spot.hasEV && (
                            <span className="absolute top-1 right-1 bg-neonGreen text-black text-[8px] p-0.5 rounded font-black">
                              ⚡
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate max-w-[170px]">
                            {spot.name}
                          </h4>
                          {spot.cuisineTag && (
                            <div className="text-[10px] text-amber-400/90 truncate max-w-[170px]">
                              {spot.cuisineTag}
                            </div>
                          )}
                          <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <span>{spot.distanceKm} km</span> •{' '}
                            <span style={{ color: spot.aiStatusColor }}>{spot.aiProbability}% AI</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-xs font-extrabold text-white">
                          ₹{spot.basePrice}/hr
                        </div>
                        {spot.offerBadge && (
                          <div className="text-[8px] text-brandYellow font-semibold truncate max-w-[80px]">
                            {spot.offerBadge}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Full List View (Swiggy Restaurant Directory Style) */
        <div className="p-4 space-y-3 pb-28 relative">
          {/* Quick Banner: Look in Map with Arrow */}
          <div
            onClick={() => {
              setViewMode('map');
              setShowMapCallout(false);
            }}
            className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#161920] to-yellow-500/10 border border-brandYellow/40 hover:border-brandYellow flex items-center justify-between cursor-pointer transition-all group shadow-md"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brandYellow/20 border border-brandYellow/40 flex items-center justify-center text-brandYellow group-hover:scale-110 transition-transform">
                <Map className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-white flex items-center gap-1.5">
                  <span>Look in Interactive Map</span>
                  <span className="text-[9px] bg-brandYellow text-black px-1.5 py-0.2 rounded font-black">7 SPOTS</span>
                </div>
                <div className="text-[10px] text-gray-400">
                  Tap to look in map with walking routes & live pins ↗
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-extrabold text-brandYellow group-hover:translate-x-1 transition-transform">
              <span>View Map</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 px-1">
            <span>Showing {filteredSpots.length} dining, parking & EV hubs</span>
            <span className="text-brandYellow font-semibold">Hyderabad Corridor</span>
          </div>

          {filteredSpots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => {
                setSelectedSpot(spot);
                setIsBookingOpen(true);
              }}
              className="bg-[#161920] border border-cardBorder hover:border-brandYellow/60 rounded-2xl p-3.5 space-y-2.5 cursor-pointer transition-all shadow-md group"
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={spot.image}
                    alt={spot.name}
                    className="w-20 h-20 rounded-xl object-cover border border-cardBorder"
                  />
                  {spot.hasEV && (
                    <span className="absolute top-1 right-1 bg-neonGreen text-black text-[9px] p-0.5 px-1 rounded font-black flex items-center">
                      <Zap className="w-2.5 h-2.5 fill-current" />
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-brandYellow uppercase">
                      {spot.type}
                    </span>
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${spot.aiStatusColor}20`,
                        color: spot.aiStatusColor,
                      }}
                    >
                      {spot.aiProbability}% Free
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate mt-0.5">
                    {spot.name}
                  </h4>
                  {spot.cuisineTag && (
                    <p className="text-[10px] text-amber-300 font-medium truncate">
                      🍽️ {spot.cuisineTag}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-400 truncate">{spot.address}</p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-cardBorder/60">
                    <div className="text-xs font-black text-white">
                      ₹{spot.basePrice}/hr
                      {spot.hasEV && (
                        <span className="text-[10px] text-neonGreen font-semibold ml-1">
                          • ⚡ EV
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      {/* Direct Look on Map Action Button with Arrow */}
                      <button
                        type="button"
                        onClick={(e) => handleLookOnMap(spot, e)}
                        className="px-2.5 py-1 bg-[#0B0D10] hover:bg-brandYellow/15 border border-brandYellow/40 hover:border-brandYellow text-brandYellow text-[11px] font-bold rounded-lg flex items-center gap-1 transition-all shadow-sm active:scale-95"
                        title="Look on Map"
                      >
                        <MapPin className="w-3 h-3 text-brandYellow" />
                        <span>Look in Map ↗</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSpot(spot);
                          setIsBookingOpen(true);
                        }}
                        className="px-2.5 py-1 bg-brandYellow hover:bg-brandYellow-hover text-black text-[11px] font-black rounded-lg flex items-center gap-0.5 shadow transition-all active:scale-95"
                      >
                        <span>Reserve</span>
                        <ChevronRight className="w-3 h-3 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Floating Action Pill at bottom of List View */}
          <div className="sticky bottom-4 left-0 right-0 flex justify-center pointer-events-none z-30 pt-2">
            <button
              onClick={() => {
                setViewMode('map');
                setShowMapCallout(false);
              }}
              className="pointer-events-auto px-4 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs rounded-full shadow-2xl flex items-center gap-2 glow-yellow border border-yellow-200 transition-all active:scale-95 animate-pulse"
            >
              <Map className="w-4 h-4" />
              <span>Look in Map ({filteredSpots.length} Spots) ↗</span>
            </button>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isBookingOpen && selectedSpot && (
        <BookingModal
          spot={selectedSpot}
          onClose={() => setIsBookingOpen(false)}
          onBookingSuccess={(booking) => {
            setIsBookingOpen(false);
            onBookSpot(booking);
          }}
        />
      )}

      {/* Photo Inspection Modal */}
      {isPhotoOpen && selectedSpot && (
        <PhotoModal
          spot={selectedSpot}
          onClose={() => setIsPhotoOpen(false)}
        />
      )}
    </div>
  );
}
