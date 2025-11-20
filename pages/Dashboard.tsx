
import React, { useEffect, useState } from 'react';
import { 
  Activity, Heart, Wind, TrendingUp, TrendingDown, 
  CheckCircle2, Clock, Calendar, ChevronRight, Zap, 
  Droplets, Footprints, BrainCircuit, Moon, Sun, ArrowRight, MapPin
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, CartesianGrid
} from 'recharts';
import { getDailyTip } from '../services/geminiService';
import { useUser } from '../contexts/UserContext';

// --- Mock Data ---
const activityData = [
  { name: 'Mon', steps: 6500, calories: 2100 },
  { name: 'Tue', steps: 8200, calories: 2400 },
  { name: 'Wed', steps: 9100, calories: 2600 },
  { name: 'Thu', steps: 7800, calories: 2300 },
  { name: 'Fri', steps: 5500, calories: 1900 },
  { name: 'Sat', steps: 10200, calories: 2800 },
  { name: 'Sun', steps: 9800, calories: 2700 },
];

const heartData = [
  { time: '00:00', bpm: 62 }, { time: '04:00', bpm: 58 },
  { time: '08:00', bpm: 85 }, { time: '12:00', bpm: 72 },
  { time: '16:00', bpm: 90 }, { time: '20:00', bpm: 78 },
];

// --- Components ---

const GlassCard: React.FC<{ children: React.ReactNode; className?: string; noPadding?: boolean }> = ({ children, className = '', noPadding = false }) => (
  <div className={`bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-700 shadow-sm rounded-3xl overflow-hidden transition-all hover:shadow-md hover:scale-[1.005] ${className}`}>
    <div className={noPadding ? '' : 'p-6'}>
      {children}
    </div>
  </div>
);

const StatCard: React.FC<{ 
  title: string; 
  value: string; 
  unit: string; 
  trend: string; 
  trendUp: boolean; 
  icon: React.ReactNode; 
  color: string 
}> = ({ title, value, unit, trend, trendUp, icon, color }) => (
  <GlassCard className="relative overflow-hidden group cursor-pointer">
    {/* Background Gradient Blob */}
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 blur-2xl transition-all group-hover:opacity-20 group-hover:scale-150 ${color}`}></div>
    
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20 text-slate-700 dark:text-white`}>
        {React.isValidElement(icon) 
            ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-6 h-6" })
            : icon}
      </div>
      <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-rose-600 bg-rose-50 dark:bg-rose-900/20'}`}>
        {trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
        {trend}
      </div>
    </div>
    
    <div>
      <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">{value}</span>
        <span className="text-sm font-medium text-slate-400">{unit}</span>
      </div>
    </div>
  </GlassCard>
);

export const Dashboard: React.FC = () => {
  const { user } = useUser();
  const [tip, setTip] = useState("Analyzing biometrics...");
  const [greeting, setGreeting] = useState("");
  const [activeTab, setActiveTab] = useState<'activity' | 'heart'>('activity');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    getDailyTip().then(setTip);
    const hr = new Date().getHours();
    if (hr < 12) setGreeting("Good Morning");
    else if (hr < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 pb-10">
      {/* --- Aesthetic Background --- */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-[100px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-teal-200/30 dark:bg-teal-900/20 rounded-full blur-[100px]"></div>
      </div>

      {/* --- Header Section --- */}
      <div className="flex flex-col gap-6">
        <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-600">{user?.name}</span>
            </h1>
            
            {/* Real-time Clock */}
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium flex items-center gap-2">
               <Clock className="w-5 h-5 text-brand-500" />
               <span>{currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</span>
               <span className="text-slate-300">•</span>
               <span className="tabular-nums font-mono text-slate-600 dark:text-slate-300">
                 {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
               </span>
            </p>
        </div>
        
        {/* Controls - Left Aligned */}
        <div className="flex flex-wrap items-center gap-4">
           <div className="flex bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
              {['Daily', 'Weekly', 'Monthly'].map(t => (
                 <button key={t} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${t === 'Daily' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                    {t}
                 </button>
              ))}
           </div>
           
           <div className="relative">
               <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg hover:scale-105 transition-transform font-semibold text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Choose Date</span>
               </button>
               <input 
                  type="date" 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  onChange={(e) => console.log("Date selected:", e.target.value)} 
               />
           </div>
        </div>
      </div>

      {/* --- AI Hero Insight --- */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <GlassCard className="relative !bg-gradient-to-r from-slate-900 to-slate-800 border-none text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-500/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
               <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10 shrink-0">
                  <BrainCircuit className="w-7 h-7 text-brand-300" />
               </div>
               <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="px-2 py-0.5 rounded bg-brand-500/20 border border-brand-500/30 text-brand-300 text-[10px] font-bold uppercase tracking-widest">AI Insight</span>
                     <span className="text-slate-400 text-xs">Just now</span>
                  </div>
                  <p className="text-xl md:text-2xl font-medium leading-relaxed text-slate-100">"{tip}"</p>
               </div>
               <button className="group/btn flex items-center gap-2 px-5 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-brand-50 transition-colors whitespace-nowrap shadow-lg shadow-white/10">
                  View Analysis
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
               </button>
            </div>
        </GlassCard>
      </div>

      {/* --- Vitals Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard 
            title="Heart Rate" 
            value="72" 
            unit="bpm" 
            trend="+2%" 
            trendUp={true} 
            icon={<Heart />} 
            color="bg-rose-500" 
         />
         <StatCard 
            title="Blood Pressure" 
            value="118/78" 
            unit="mmHg" 
            trend="-1%" 
            trendUp={false} // Actually good for BP
            icon={<Activity />} 
            color="bg-blue-500" 
         />
         <StatCard 
            title="Blood Glucose" 
            value="96" 
            unit="mg/dL" 
            trend="Stable" 
            trendUp={true} 
            icon={<Droplets />} 
            color="bg-emerald-500" 
         />
         <StatCard 
            title="SpO2 Level" 
            value="98" 
            unit="%" 
            trend="Perfect" 
            trendUp={true} 
            icon={<Wind />} 
            color="bg-cyan-500" 
         />
      </div>

      {/* --- Main Content Area --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Left Col: Health Trends */}
         <div className="lg:col-span-2 space-y-6">
            <GlassCard className="min-h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                   <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white">Health Trends</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Activity & Biometrics over last 7 days</p>
                   </div>
                   <div className="flex bg-slate-100 dark:bg-slate-700/50 p-1 rounded-xl">
                      <button 
                        onClick={() => setActiveTab('activity')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'activity' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500'}`}
                      >
                        Activity
                      </button>
                      <button 
                        onClick={() => setActiveTab('heart')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'heart' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500'}`}
                      >
                        Heart
                      </button>
                   </div>
                </div>

                <div className="flex-1 w-full h-64">
                   <ResponsiveContainer width="100%" height="100%">
                      {activeTab === 'activity' ? (
                        <BarChart data={activityData} barGap={8}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                           <Tooltip 
                              cursor={{fill: '#f1f5f9', radius: 8}} 
                              contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                           />
                           <Bar dataKey="steps" fill="#14b8a6" radius={[6, 6, 6, 6]} barSize={32}>
                              {activityData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 5 ? '#0f766e' : '#2dd4bf'} />
                              ))}
                           </Bar>
                        </BarChart>
                      ) : (
                        <AreaChart data={heartData}>
                          <defs>
                            <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                          <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                          <Area type="monotone" dataKey="bpm" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#colorBpm)" />
                        </AreaChart>
                      )}
                   </ResponsiveContainer>
                </div>
            </GlassCard>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                  { label: 'Log Food', icon: Zap, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
                  { label: 'Record Vitals', icon: Activity, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
                  { label: 'Symptoms', icon: BrainCircuit, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
                  { label: 'Medication', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
               ].map((action, i) => (
                  <GlassCard key={i} className="flex flex-col items-center justify-center p-4 hover:bg-white dark:hover:bg-slate-800 cursor-pointer group">
                     <div className={`p-3 rounded-2xl mb-3 transition-transform group-hover:scale-110 ${action.color}`}>
                        <action.icon className="w-6 h-6" />
                     </div>
                     <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{action.label}</span>
                  </GlassCard>
               ))}
            </div>
         </div>

         {/* Right Col: Health Score & Appointments */}
         <div className="space-y-6">
            {/* Wellness Score Card */}
            <GlassCard className="relative overflow-hidden bg-slate-900 dark:bg-black border-none text-white">
               <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-black"></div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-[60px] opacity-40"></div>
               
               <div className="relative z-10 flex flex-col items-center py-4">
                  <h3 className="text-slate-300 text-sm font-bold uppercase tracking-widest mb-6">Wellness Score</h3>
                  
                  <div className="relative w-48 h-48 flex items-center justify-center">
                     {/* Decorative Rings */}
                     <div className="absolute inset-0 rounded-full border-8 border-slate-700/50"></div>
                     <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle 
                           cx="50" cy="50" r="42" 
                           fill="none" stroke="#2dd4bf" strokeWidth="8" 
                           strokeDasharray="264" strokeDashoffset={264 - (264 * 0.88)} 
                           strokeLinecap="round"
                           className="drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]"
                        />
                     </svg>
                     <div className="text-center">
                        <span className="text-6xl font-bold text-white block">88</span>
                        <span className="text-emerald-400 font-medium text-sm">Excellent</span>
                     </div>
                  </div>

                  <div className="mt-6 w-full space-y-3">
                     <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Physical</span>
                        <span className="text-white font-bold">92/100</span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full w-[92%]"></div>
                     </div>
                     
                     <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Mental</span>
                        <span className="text-white font-bold">85/100</span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-400 rounded-full w-[85%]"></div>
                     </div>
                  </div>
               </div>
            </GlassCard>

            {/* Next Appointment */}
            <GlassCard>
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 dark:text-white">Up Next</h3>
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                     <ChevronRight className="w-5 h-5 text-slate-400" />
                  </button>
               </div>
               <div className="flex gap-4 items-center mb-4">
                   <img src="https://i.pravatar.cc/150?img=11" alt="Doctor" className="w-14 h-14 rounded-2xl object-cover shadow-md" />
                   <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-lg">Dr. Richards</h4>
                      <p className="text-sm text-brand-600 dark:text-brand-400 font-medium">Cardiologist</p>
                   </div>
               </div>
               <div className="space-y-3">
                   <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>Tomorrow, 10:00 AM</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>St. Mary's Hospital</span>
                   </div>
               </div>
            </GlassCard>
         </div>
      </div>

      {/* --- Bottom Section: Daily Timeline --- */}
      <div>
         <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 px-1">Today's Timeline</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
               { title: 'Morning Meds', time: '08:00 AM', status: 'Taken', icon: CheckCircle2, color: 'text-emerald-600' },
               { title: 'Glucose Check', time: '12:30 PM', status: 'Pending', icon: Activity, color: 'text-amber-600' },
               { title: 'Evening Walk', time: '06:00 PM', status: 'Scheduled', icon: Footprints, color: 'text-blue-600' },
            ].map((item, i) => (
               <GlassCard key={i} className="flex items-center gap-4" noPadding>
                  <div className="p-4 flex items-center gap-4 w-full">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 ${item.color}`}>
                         <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                         <h4 className="font-bold text-slate-800 dark:text-white">{item.title}</h4>
                         <p className="text-xs text-slate-500 dark:text-slate-400">{item.time}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 ${item.color}`}>
                         {item.status}
                      </div>
                  </div>
               </GlassCard>
            ))}
         </div>
      </div>
    </div>
  );
};