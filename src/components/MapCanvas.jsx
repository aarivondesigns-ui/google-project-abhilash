import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import { Navigation, Plus, Minus, LocateFixed, MapPin, Zap } from 'lucide-react';

export default function MapCanvas({ spots, selectedSpot, onSelectSpot }) {
  // Mode: 'google' (Google Maps Dark Roadmap) | 'satellite' (Google Hybrid Satellite) | 'mappls' (Mappls Live India SDK)
  // Vector mode is completely removed per user request
  const [mapEngine, setMapEngine] = useState('google');

  // Leaflet map refs
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersGroupRef = useRef(null);
  const routeLineRef = useRef(null);
  const userMarkerRef = useRef(null);

  // Mappls map refs
  const mapplsContainerRef = useRef(null);
  const mapplsMapRef = useRef(null);
  const mapplsMarkersRef = useRef([]);

  // User Location (Hyderabad Tech Corridor / Gachibowli DLF junction)
  const userLoc = { lat: 17.4415, lng: 78.3610 };

  // Helper to update Leaflet markers (User Location + All Places)
  const updateLeafletMarkers = (map) => {
    if (!map) return;

    // Clear previous markers
    if (markersGroupRef.current) {
      markersGroupRef.current.clearLayers();
    } else {
      markersGroupRef.current = L.layerGroup().addTo(map);
    }

    // 1. POINT USER LOCATION ON THE MAP ("You")
    const userHtml = `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></div>
        <div class="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-xl flex items-center justify-center">
          <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
        </div>
        <div class="absolute -top-6 bg-blue-600 text-[9px] text-white font-extrabold px-1.5 py-0.5 rounded-md shadow-lg border border-blue-400 whitespace-nowrap flex items-center gap-0.5">
          <span>➤</span> <span>You</span>
        </div>
      </div>
    `;

    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: userHtml,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }
    userMarkerRef.current = L.marker([userLoc.lat, userLoc.lng], {
      icon: userIcon,
      zIndexOffset: 1000,
    }).addTo(map);

    // 2. POINT ALL PLACES LOCATIONS ON THE MAP
    spots.forEach((spot) => {
      const lat = spot.realCoords?.lat;
      const lng = spot.realCoords?.lng;
      if (!lat || !lng) return;

      const isSelected = selectedSpot?.id === spot.id;
      const isEV = spot.hasEV;

      const bg = isSelected
        ? isEV
          ? 'bg-[#10B981] text-black border-white ring-4 ring-neonGreen/50 scale-110 shadow-lg'
          : 'bg-[#F5B800] text-black border-white ring-4 ring-brandYellow/50 scale-110 shadow-lg'
        : isEV
        ? 'bg-[#161920] text-neonGreen border-neonGreen/80 hover:border-neonGreen hover:scale-105'
        : 'bg-[#161920] text-brandYellow border-brandYellow/80 hover:border-brandYellow hover:scale-105';

      const icon = isEV ? '⚡' : '🅿️';

      const spotHtml = `
        <div class="relative cursor-pointer transition-all duration-200">
          <div class="flex items-center gap-1 px-2 py-0.5 rounded-xl text-xs font-black shadow-2xl border ${bg} whitespace-nowrap">
            <span class="text-[10px]">${icon}</span>
            <span class="text-[11px]">₹${spot.basePrice}/h</span>
          </div>
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${
            isSelected ? (isEV ? 'bg-[#10B981]' : 'bg-[#F5B800]') : 'bg-[#161920]'
          } border-r border-b ${isSelected ? 'border-white' : 'border-cardBorder'}"></div>
        </div>
      `;

      const spotIcon = L.divIcon({
        className: 'custom-spot-marker',
        html: spotHtml,
        iconSize: [60, 28],
        iconAnchor: [30, 28],
      });

      const marker = L.marker([lat, lng], {
        icon: spotIcon,
        zIndexOffset: isSelected ? 900 : 500,
      });

      marker.on('click', () => {
        onSelectSpot(spot);
      });

      markersGroupRef.current.addLayer(marker);
    });

    // 3. DRAW GLOWING DASHED ROUTE POLYLINE FROM USER TO SELECTED SPOT
    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    if (selectedSpot?.realCoords?.lat && selectedSpot?.realCoords?.lng) {
      routeLineRef.current = L.polyline(
        [
          [userLoc.lat, userLoc.lng],
          [selectedSpot.realCoords.lat, selectedSpot.realCoords.lng],
        ],
        {
          color: '#F5B800',
          weight: 3.5,
          opacity: 0.85,
          dashArray: '6, 8',
        }
      ).addTo(map);
    }
  };

  // Initialize or reconfigure Leaflet Map (for Google & Satellite modes)
  useEffect(() => {
    if (mapEngine === 'google' || mapEngine === 'satellite') {
      if (!mapContainerRef.current) return;

      // Clean up previous instance or leaflet IDs to avoid React StrictMode conflicts
      if (mapContainerRef.current._leaflet_id) {
        delete mapContainerRef.current._leaflet_id;
      }

      if (!mapInstanceRef.current) {
        const initialCenter = selectedSpot?.realCoords
          ? [selectedSpot.realCoords.lat, selectedSpot.realCoords.lng]
          : [userLoc.lat, userLoc.lng];

        const map = L.map(mapContainerRef.current, {
          center: initialCenter,
          zoom: 14,
          zoomControl: false,
          attributionControl: false,
        });

        mapInstanceRef.current = map;

        // Add Tile Layer
        const tileUrl =
          mapEngine === 'satellite'
            ? 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
            : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

        const tileClass = mapEngine === 'satellite' ? 'google-sat-tiles' : 'google-dark-tiles';

        tileLayerRef.current = L.tileLayer(tileUrl, {
          maxZoom: 20,
          className: tileClass,
        }).addTo(map);

        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 150);

        updateLeafletMarkers(map);
      } else {
        // Switch tile layer if engine changed
        const map = mapInstanceRef.current;
        if (tileLayerRef.current) {
          map.removeLayer(tileLayerRef.current);
        }

        const tileUrl =
          mapEngine === 'satellite'
            ? 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
            : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

        const tileClass = mapEngine === 'satellite' ? 'google-sat-tiles' : 'google-dark-tiles';

        tileLayerRef.current = L.tileLayer(tileUrl, {
          maxZoom: 20,
          className: tileClass,
        }).addTo(map);

        updateLeafletMarkers(map);
      }
    }

    return () => {
      // Cleanup if switching away from Leaflet
      if (mapEngine === 'mappls' && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapEngine]);

  // Update markers and center on selectedSpot change
  useEffect(() => {
    if (mapInstanceRef.current && (mapEngine === 'google' || mapEngine === 'satellite')) {
      mapInstanceRef.current.invalidateSize();
      updateLeafletMarkers(mapInstanceRef.current);

      if (selectedSpot?.realCoords?.lat && selectedSpot?.realCoords?.lng) {
        mapInstanceRef.current.panTo([selectedSpot.realCoords.lat, selectedSpot.realCoords.lng], {
          animate: true,
          duration: 0.5,
        });
      }
    }
  }, [spots, selectedSpot]);

  // Handle Mappls SDK initialization if user selects Mappls
  useEffect(() => {
    let timer = null;
    let isCancelled = false;

    if (mapEngine === 'mappls') {
      const initMappls = () => {
        if (isCancelled) return;
        const MapplsClass = window.mappls || window.Mappls;
        if (!MapplsClass || !mapplsContainerRef.current) return;

        try {
          if (!mapplsMapRef.current) {
            const initialCenter = selectedSpot?.realCoords
              ? { lat: selectedSpot.realCoords.lat, lng: selectedSpot.realCoords.lng }
              : { lat: userLoc.lat, lng: userLoc.lng };

            const map = new MapplsClass.Map(mapplsContainerRef.current, {
              center: initialCenter,
              zoom: 14,
              zoomControl: false,
              traffic: true,
            });
            mapplsMapRef.current = map;

            map.on('load', () => {
              if (isCancelled) return;

              // User marker on Mappls
              try {
                new MapplsClass.Marker({
                  map: map,
                  position: { lat: userLoc.lat, lng: userLoc.lng },
                  popupHtml: '<b>You Are Here</b>',
                });
              } catch (e) {}

              // Spot markers on Mappls
              spots.forEach((s) => {
                if (s.realCoords?.lat && s.realCoords?.lng) {
                  try {
                    const marker = new MapplsClass.Marker({
                      map: map,
                      position: { lat: s.realCoords.lat, lng: s.realCoords.lng },
                      popupHtml: `<b>${s.name}</b><br/>₹${s.basePrice}/hr`,
                    });
                    if (marker.on) {
                      marker.on('click', () => onSelectSpot(s));
                    }
                    mapplsMarkersRef.current.push(marker);
                  } catch (e) {}
                }
              });
            });
          } else if (selectedSpot?.realCoords && mapplsMapRef.current.setCenter) {
            mapplsMapRef.current.setCenter({
              lat: selectedSpot.realCoords.lat,
              lng: selectedSpot.realCoords.lng,
            });
          }
        } catch (err) {
          console.warn('Mappls note:', err);
        }
      };

      if (window.mappls || window.Mappls) {
        initMappls();
      } else {
        timer = setInterval(() => {
          if (window.mappls || window.Mappls) {
            clearInterval(timer);
            initMappls();
          }
        }, 200);
      }
    }

    return () => {
      isCancelled = true;
      if (timer) clearInterval(timer);
      if (mapEngine !== 'mappls' && mapplsMapRef.current) {
        try {
          mapplsMapRef.current.remove?.();
        } catch (e) {}
        mapplsMapRef.current = null;
      }
    };
  }, [mapEngine, spots, selectedSpot]);

  // Zoom controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([userLoc.lat, userLoc.lng], 14, { animate: true });
    }
  };

  return (
    <div
      className="relative w-full h-[260px] bg-[#07090C] overflow-hidden select-none border-b border-cardBorder isolate z-0"
      style={{ touchAction: 'pan-y' }}
    >
      {/* 1. GOOGLE MAPS (DARK ROADMAP / SATELLITE HYBRID) */}
      {(mapEngine === 'google' || mapEngine === 'satellite') && (
        <div
          ref={mapContainerRef}
          className="w-full h-full relative"
          style={{ touchAction: 'pan-y' }}
        />
      )}

      {/* 2. MAPPLS LIVE INDIA MAP (API KEY dzrgoiizjotallcgznaruukumfgnjlqmidle) */}
      {mapEngine === 'mappls' && (
        <div
          ref={mapplsContainerRef}
          id="mappls-map-canvas"
          className="w-full h-full relative bg-[#07090C]"
          style={{ touchAction: 'pan-y' }}
        />
      )}

      {/* Floating Header Tag: Map Mode & Active City */}
      <div className="absolute top-3 left-3 flex items-center space-x-1.5 bg-[#161920]/95 backdrop-blur-md border border-cardBorder px-2.5 py-1 rounded-full text-xs text-gray-200 shadow-lg z-30 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-neonGreen animate-pulse"></span>
        <span className="font-semibold text-[11px]">
          {mapEngine === 'google'
            ? 'Google Maps Live'
            : mapEngine === 'satellite'
            ? 'Google Satellite'
            : 'Mappls Live Map'}
        </span>
      </div>

      {/* Top-Right Map Controls: Switcher (Vector is Removed) & Zoom Controls */}
      <div className="absolute top-3 right-3 flex flex-col items-end space-y-1.5 z-30">
        {/* Switcher without Vector */}
        <div className="flex items-center bg-[#161920]/95 backdrop-blur-md border border-cardBorder rounded-xl p-0.5 shadow-md space-x-0.5">
          <button
            onClick={() => setMapEngine('google')}
            className={`px-2 py-1 rounded-lg text-[9px] font-black transition-all ${
              mapEngine === 'google'
                ? 'bg-brandYellow text-black shadow glow-yellow'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Google Maps Dark Mode"
          >
            Google
          </button>
          <button
            onClick={() => setMapEngine('satellite')}
            className={`px-2 py-1 rounded-lg text-[9px] font-black transition-all ${
              mapEngine === 'satellite'
                ? 'bg-brandYellow text-black shadow glow-yellow'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Google Satellite Hybrid"
          >
            Satellite
          </button>
          <button
            onClick={() => setMapEngine('mappls')}
            className={`px-2 py-1 rounded-lg text-[9px] font-black transition-all ${
              mapEngine === 'mappls'
                ? 'bg-brandYellow text-black shadow glow-yellow'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Mappls Live India SDK"
          >
            Mappls
          </button>
        </div>

        {/* Zoom In, Out, Recenter on You */}
        {(mapEngine === 'google' || mapEngine === 'satellite') && (
          <div className="flex flex-col space-y-1">
            <button
              onClick={handleZoomIn}
              className="w-7 h-7 bg-[#161920]/90 backdrop-blur-md border border-cardBorder hover:border-brandYellow text-gray-200 rounded-lg flex items-center justify-center transition-all shadow-md active:scale-95"
              title="Zoom in"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-7 h-7 bg-[#161920]/90 backdrop-blur-md border border-cardBorder hover:border-brandYellow text-gray-200 rounded-lg flex items-center justify-center transition-all shadow-md active:scale-95"
              title="Zoom out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRecenter}
              className="w-7 h-7 bg-[#161920]/90 backdrop-blur-md border border-cardBorder hover:border-brandYellow text-gray-300 hover:text-brandYellow rounded-lg flex items-center justify-center transition-all shadow-md active:scale-95"
              title="Recenter on You"
            >
              <LocateFixed className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Active Route Info Badge at Bottom of Map */}
      {selectedSpot && (
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between bg-[#161920]/95 backdrop-blur-md border border-cardBorder px-3 py-1.5 rounded-xl shadow-lg z-30 text-xs">
          <div className="flex items-center space-x-2 truncate">
            <Navigation className="w-3.5 h-3.5 text-brandYellow flex-shrink-0" />
            <span className="font-semibold text-white text-[11px] truncate">
              {selectedSpot.name}
            </span>
          </div>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex-shrink-0"
            style={{
              backgroundColor: `${selectedSpot.aiStatusColor}20`,
              color: selectedSpot.aiStatusColor,
              border: `1px solid ${selectedSpot.aiStatusColor}40`,
            }}
          >
            {selectedSpot.aiProbability}% Open
          </span>
        </div>
      )}
    </div>
  );
}
