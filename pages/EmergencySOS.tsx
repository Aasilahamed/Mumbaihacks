import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components/Common';
import { AlertCircle, Phone, Ambulance, MapPin, CheckCircle, ShieldAlert } from 'lucide-react';

export const EmergencySOS: React.FC = () => {
  const [active, setActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [alertSent, setAlertSent] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (active && countdown > 0) {
      interval = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (active && countdown === 0) {
      setAlertSent(true);
      setActive(false);
    }
    return () => clearInterval(interval);
  }, [active, countdown]);

  const handleSOS = () => {
    if (alertSent) return;
    setActive(true);
    setCountdown(3);
  };

  const cancelSOS = () => {
    setActive(false);
    setCountdown(3);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-center pt-10">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Emergency Assistance</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Pressing the button will alert your emergency contacts and nearby ambulance services.</p>
        </div>

        <div className="relative flex justify-center">
             {/* Ripple Effects */}
             {active && (
                <>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-64 bg-red-500 rounded-full animate-ping opacity-20"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-80 h-80 bg-red-500 rounded-full animate-ping opacity-10 animation-delay-200"></div>
                    </div>
                </>
             )}

            <button 
                onClick={handleSOS}
                disabled={alertSent}
                className={`relative z-10 w-64 h-64 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl ${
                    alertSent 
                    ? 'bg-emerald-500 cursor-default' 
                    : active 
                        ? 'bg-red-600 scale-95' 
                        : 'bg-gradient-to-b from-red-500 to-red-600 hover:scale-105 hover:shadow-red-500/50'
                }`}
            >
                {alertSent ? (
                    <>
                        <CheckCircle className="w-20 h-20 text-white mb-2" />
                        <span className="text-white font-bold text-xl">Alert Sent</span>
                    </>
                ) : active ? (
                    <>
                        <span className="text-6xl font-black text-white mb-2">{countdown}</span>
                        <span className="text-white/80 font-medium uppercase text-sm tracking-widest">Cancel</span>
                    </>
                ) : (
                    <>
                        <ShieldAlert className="w-20 h-20 text-white mb-4" />
                        <span className="text-white font-black text-3xl tracking-widest">SOS</span>
                        <span className="text-white/70 text-sm mt-2 font-medium">TAP FOR HELP</span>
                    </>
                )}
            </button>
        </div>

        {active && (
            <div className="flex justify-center">
                 <button onClick={cancelSOS} className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-8 py-3 rounded-xl font-bold transition-colors">
                     CANCEL REQUEST
                 </button>
            </div>
        )}

        {alertSent && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-emerald-800 dark:text-emerald-400 font-bold text-lg">Help is on the way!</h3>
                <p className="text-emerald-600 dark:text-emerald-300">Ambulance dispatched. ETA: 8 minutes.</p>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mt-12">
            <Card className="p-6 border-l-4 border-l-brand-500">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                    <Ambulance className="w-5 h-5 text-brand-500" /> Nearest Hospital
                </h3>
                <div className="space-y-2">
                    <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">St. Mary's General Hospital</p>
                    <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 text-sm"><MapPin className="w-4 h-4" /> 2.4 miles away (approx 8 mins)</p>
                    <div className="mt-3 bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 w-3/4 h-full"></div>
                    </div>
                    <p className="text-xs text-slate-400 text-right">Traffic: Light</p>
                </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-blue-500">
                 <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                    <Phone className="w-5 h-5 text-blue-500" /> Emergency Contacts
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-700 dark:text-slate-200">John Jenkins (Husband)</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">+1 (555) 123-4567</p>
                        </div>
                        <Button variant="secondary" className="px-3 py-1.5 text-xs">Call</Button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-700 dark:text-slate-200">Dr. A. Richards</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">+1 (555) 987-6543</p>
                        </div>
                         <Button variant="secondary" className="px-3 py-1.5 text-xs">Call</Button>
                    </div>
                </div>
            </Card>
        </div>
    </div>
  );
};