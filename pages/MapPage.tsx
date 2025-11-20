import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../components/Common';
import { MapPin, Search, Navigation, Phone, Clock, Star, Crosshair, Bed, Stethoscope, Plus, Loader2 } from 'lucide-react';
import { Hospital } from '../types';

const MOCK_HOSPITALS: Hospital[] = [
  { id: 1, name: "St. Mary's General", distance: "2.4 mi", rating: 4.8, bedsAvailable: 12, waitList: 5, specialties: ["Cardiology", "ER"], coords: { x: 40, y: 30 } },
  { id: 2, name: "City Central Clinic", distance: "1.1 mi", rating: 4.2, bedsAvailable: 0, waitList: 24, specialties: ["General", "Pediatrics"], coords: { x: 60, y: 55 } },
  { id: 3, name: "Westside Trauma Center", distance: "5.8 mi", rating: 4.9, bedsAvailable: 8, waitList: 2, specialties: ["Trauma", "Ortho"], coords: { x: 25, y: 70 } },
  { id: 4, name: "Green Valley Health", distance: "3.2 mi", rating: 4.5, bedsAvailable: 20, waitList: 0, specialties: ["Neurology"], coords: { x: 80, y: 20 } },
];

export const MapPage: React.FC = () => {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error fetching location", error);
          setErrorMsg("Unable to access location. Showing default map.");
          // Fallback default (e.g., New York or New Delhi based on preference)
          setUserLocation({ lat: 28.6139, lng: 77.2090 }); // New Delhi default
          setLoadingLocation(false);
        }
      );
    } else {
      setErrorMsg("Geolocation not supported");
      setLoadingLocation(false);
    }
  }, []);

  const filteredHospitals = MOCK_HOSPITALS.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const mapSrc = userLocation 
    ? `https://maps.google.com/maps?q=${userLocation.lat},${userLocation.lng}&z=13&output=embed`
    : "";

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col lg:flex-row gap-4">
       {/* Sidebar List */}
       <Card className="w-full lg:w-96 flex flex-col h-full shadow-xl border-0 rounded-none lg:rounded-2xl overflow-hidden z-10">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 space-y-4 bg-white dark:bg-slate-800">
             <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Find Care Nearby</h2>
                <p className="text-xs text-slate-500">
                    {loadingLocation ? "Locating you..." : userLocation ? "Based on your current location" : "Live availability"}
                </p>
             </div>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search hospitals, specialties..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:text-white"
                />
             </div>
             <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer">Emergency</span>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer">Cardiology</span>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer">Open Now</span>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 p-2 space-y-2">
             {filteredHospitals.map(hospital => (
                 <div 
                    key={hospital.id}
                    onClick={() => setSelectedHospital(hospital)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedHospital?.id === hospital.id ? 'bg-white dark:bg-slate-800 border-brand-500 shadow-md ring-1 ring-brand-500' : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}
                 >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm">{hospital.name}</h3>
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {hospital.rating}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                        <span className="flex items-center gap-1"><Navigation className="w-3 h-3" /> {hospital.distance}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {hospital.waitList}m wait</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {hospital.bedsAvailable > 0 ? (
                            <Badge variant="success" className="text-[10px]">{hospital.bedsAvailable} Beds</Badge>
                        ) : (
                            <Badge variant="danger" className="text-[10px]">Full Capacity</Badge>
                        )}
                        {hospital.specialties.map(s => <Badge key={s} variant="neutral" className="text-[10px]">{s}</Badge>)}
                    </div>
                 </div>
             ))}
          </div>
       </Card>

       {/* Map Visualization Area */}
       <div className="flex-1 relative rounded-2xl overflow-hidden shadow-inner bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group">
            {loadingLocation ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-10 h-10 animate-spin text-brand-500 mb-2" />
                        <p className="text-sm text-slate-500">Acquiring Satellite Location...</p>
                    </div>
                </div>
            ) : (
                <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={mapSrc}
                    title="Google Maps Embed"
                ></iframe>
            )}

            {/* Floating Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                <button onClick={() => navigator.geolocation.getCurrentPosition(p => setUserLocation({lat: p.coords.latitude, lng: p.coords.longitude}))} className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300" title="Recenter">
                    <Crosshair className="w-5 h-5" />
                </button>
                <button className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300" title="Zoom In">
                    <Plus className="w-5 h-5" />
                </button>
            </div>
       </div>
    </div>
  );
};