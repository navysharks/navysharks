import React, { useState, useRef, useEffect } from 'react';
import Map, { Source, Layer, Marker, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Plane, MapPin, Check } from 'lucide-react';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const ROUTES = [
  {
    id: "hkt-patong",
    country: "Thailand",
    origin: "Phuket Airport (HKT)",
    destination: "Patong Helipad",
    price: 349,
    time: "15m",
    coordinates: [
      [98.3065, 8.1111], // HKT
      [98.2980, 7.8931]  // Patong
    ]
  },
  {
    id: "hkt-phiphi",
    country: "Thailand",
    origin: "Phuket (HKT)",
    destination: "Phi Phi Islands",
    price: 899,
    time: "25m",
    coordinates: [
      [98.3065, 8.1111], // HKT
      [98.7784, 7.7407]  // Phi Phi
    ]
  },
  {
    id: "hkt-samui",
    country: "Thailand",
    origin: "Phuket (HKT)",
    destination: "Koh Samui (USM)",
    price: 1899,
    time: "45m",
    coordinates: [
      [98.3065, 8.1111], // HKT
      [100.0614, 9.5484] // Samui
    ]
  },
  {
    id: "mnl-boracay",
    country: "Philippines",
    origin: "Manila (MNL)",
    destination: "Boracay (MPH)",
    price: 2499,
    time: "1h 15m",
    coordinates: [
      [121.0194, 14.5090], // Manila
      [121.9544, 11.9333]  // Boracay
    ]
  },
  {
    id: "mnl-palawan",
    country: "Philippines",
    origin: "Manila (MNL)",
    destination: "El Nido (ENI)",
    price: 3199,
    time: "1h 30m",
    coordinates: [
      [121.0194, 14.5090], // Manila
      [119.3833, 11.2000]  // El Nido
    ]
  },
  {
    id: "mnl-siargao",
    country: "Philippines",
    origin: "Manila (MNL)",
    destination: "Siargao (IAO)",
    price: 3899,
    time: "2h 15m",
    coordinates: [
      [121.0194, 14.5090], // Manila
      [126.0125, 9.8595]   // Siargao
    ]
  }
];

export function AviationMap({ onSelectRoute, selectedRouteId }: { onSelectRoute: (route: any) => void, selectedRouteId?: string }) {
  const mapRef = useRef<MapRef>(null);

  const [viewState, setViewState] = useState({
    longitude: 110.0,
    latitude: 12.0,
    zoom: 4.5,
    pitch: 35,
    bearing: -10
  });

  const selectedRoute = ROUTES.find(r => r.id === selectedRouteId);

  useEffect(() => {
    // Force a resize slightly after mount to fix the issue where the map 
    // renders incorrectly if the modal is still animating its open state
    const timer = setTimeout(() => {
      mapRef.current?.resize();
    }, 300);
    
    if (selectedRoute && mapRef.current) {
      const [start, end] = selectedRoute.coordinates;
      // Simple bounds calculation
      const minLng = Math.min(start[0], end[0]);
      const maxLng = Math.max(start[0], end[0]);
      const minLat = Math.min(start[1], end[1]);
      const maxLat = Math.max(start[1], end[1]);

      mapRef.current.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat]
        ],
        { padding: 50, duration: 2000 }
      );
    }
    
    return () => clearTimeout(timer);
  }, [selectedRoute]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full mt-4">
      {/* Route List */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {['Thailand', 'Philippines'].map(country => (
          <div key={country} className="flex flex-col gap-3">
            <h4 className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.2em] pl-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500/50"></div>
              {country}
            </h4>
            {ROUTES.filter(r => r.country === country).map(route => {
              const isSelected = selectedRouteId === route.id;
              return (
                <button
                  key={route.id}
                  onClick={() => onSelectRoute(route)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${
                    isSelected 
                      ? "border-cyan-500 bg-gradient-to-br from-cyan-900/20 to-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.15)]" 
                      : "border-slate-800 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-800/60"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 blur-[30px] pointer-events-none rounded-full" />
                  )}
                  
                  <div className="flex flex-col relative z-10">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-slate-300 font-semibold text-xs tracking-wide">{route.origin}</div>
                      {isSelected && <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
                    </div>
                    
                    <div className="flex items-center gap-3 my-2">
                      <div className={`w-2 h-2 rounded-full border-2 ${isSelected ? 'border-cyan-400 bg-slate-900' : 'border-slate-500 bg-slate-800'}`}></div>
                      <div className="flex-1 relative flex items-center justify-center h-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className={`w-full border-t border-dashed ${isSelected ? 'border-cyan-500/50' : 'border-slate-700'}`}></div>
                        </div>
                        <Plane className={`w-4 h-4 relative z-10 ${isSelected ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-400'} transition-colors`} />
                      </div>
                      <div className={`w-2 h-2 rounded-full border-2 ${isSelected ? 'border-cyan-400 bg-slate-900' : 'border-slate-500 bg-slate-800'}`}></div>
                    </div>
                    
                    <div className="flex justify-end items-center mb-4">
                      <div className="text-slate-300 font-semibold text-xs tracking-wide">{route.destination}</div>
                    </div>
                    
                    <div className="flex justify-between items-end pt-3 border-t border-slate-800/80">
                      <span className="text-slate-500 font-medium tracking-widest text-[10px] uppercase bg-slate-950/50 px-2 py-1 rounded">
                        {route.time}
                      </span>
                      <span className={`text-xl font-extrabold ${isSelected ? 'text-cyan-400' : 'text-slate-200 group-hover:text-white'} transition-colors`}>
                        ${route.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Map Container */}
      <div className="w-full lg:w-2/3 h-[400px] lg:h-[500px] rounded-2xl overflow-hidden border border-slate-700 relative shadow-2xl bg-slate-900">
        <Map
          ref={mapRef}
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle={MAP_STYLE}
          style={{ width: '100%', height: '100%' }}
          attributionControl={false}
          renderWorldCopies={false}
        >
          {selectedRoute && (
            <Source
              id="route"
              type="geojson"
              data={{
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: selectedRoute.coordinates
                }
              }}
            >
              <Layer
                id="route-line-bg"
                type="line"
                layout={{
                  'line-join': 'round',
                  'line-cap': 'round'
                }}
                paint={{
                  'line-color': '#06b6d4',
                  'line-width': 8,
                  'line-opacity': 0.2,
                  'line-blur': 4
                }}
              />
              <Layer
                id="route-line"
                type="line"
                layout={{
                  'line-join': 'round',
                  'line-cap': 'round'
                }}
                paint={{
                  'line-color': '#06b6d4',
                  'line-width': 3,
                  'line-dasharray': [1, 2]
                }}
              />
            </Source>
          )}

          {selectedRoute && (
            <>
              <Marker longitude={selectedRoute.coordinates[0][0]} latitude={selectedRoute.coordinates[0][1]}>
                <div className="w-4 h-4 bg-white rounded-full border-[3px] border-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.6)]" />
              </Marker>
              <Marker longitude={selectedRoute.coordinates[1][0]} latitude={selectedRoute.coordinates[1][1]}>
                <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.8)]">
                  <div className="w-full h-full rounded-full animate-ping absolute bg-cyan-500/50" />
                  <MapPin className="w-3 h-3 text-slate-950 relative z-10" />
                </div>
              </Marker>
            </>
          )}
        </Map>

        {/* Overlay Vignette */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_60px_rgba(0,0,0,0.6)] border border-slate-700/50" />
        
        {/* Map Header Overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
           <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl p-3 inline-flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <Plane className="w-4 h-4 text-cyan-400" />
             </div>
             <div>
                <div className="text-white font-bold text-sm">Aviation Tracker</div>
                <div className="text-cyan-400 text-[10px] uppercase tracking-wider font-semibold">Live Route</div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
