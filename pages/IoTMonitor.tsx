import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Badge, Button } from '../components/Common';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Activity, Zap, AlertCircle, Wifi, Clock, Filter } from 'lucide-react';

type TimeRange = 'Live' | '1h' | '6h' | '24h';

const getVitalStatus = (value: number, type: 'hr' | 'spo2' | 'glucose') => {
  if (type === 'hr') {
    if (value > 120 || value < 50) return { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', label: 'Critical' };
    if (value > 100 || value < 60) return { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', label: 'Caution' };
    return { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', label: 'Normal' };
  }
  if (type === 'spo2') {
    if (value < 90) return { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', label: 'Critical' };
    if (value < 95) return { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', label: 'Low' };
    return { color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-900/20', border: 'border-sky-200 dark:border-sky-800', label: 'Normal' };
  }
  if (type === 'glucose') {
     if (value > 180 || value < 70) return { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', label: 'Critical' };
     if (value > 140 || value < 80) return { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', label: 'Check' };
     return { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', label: 'Normal' };
  }
  return { color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200', label: 'Unknown' };
};

// Generate mock historical data based on range
const generateData = (range: TimeRange) => {
    const now = new Date();
    const points = range === 'Live' ? 20 : range === '1h' ? 60 : range === '6h' ? 72 : 48;
    const intervalMinutes = range === 'Live' ? 0 : range === '1h' ? 1 : range === '6h' ? 5 : 30;
    
    return Array.from({ length: points }, (_, i) => {
        const time = new Date(now.getTime() - (points - 1 - i) * (range === 'Live' ? 1000 : intervalMinutes * 60000));
        return {
            time: range === 'Live' ? time.toLocaleTimeString([], { second: '2-digit', minute: '2-digit' }) : time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            heartRate: 70 + Math.sin(i * 0.2) * 5 + Math.random() * 10 + (Math.random() > 0.95 ? 20 : 0),
            spo2: 96 + Math.random() * 3 - (Math.random() > 0.9 ? 2 : 0),
            glucose: 95 + Math.sin(i * 0.1) * 10 + Math.random() * 5
        };
    });
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-slate-100 dark:border-slate-700 shadow-xl rounded-xl backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" /> {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {entry.name}: <span className="font-mono">{Math.round(entry.value)}</span>
                </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
};

export const IoTMonitor: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('Live');
  const [data, setData] = useState(generateData('Live'));
  const [isConnected, setIsConnected] = useState(true);

  // Handle Live Updates
  useEffect(() => {
    if (timeRange !== 'Live') {
        setData(generateData(timeRange));
        return;
    }

    // Reset to initial live data when switching back to live
    setData(generateData('Live'));

    const interval = setInterval(() => {
      setData(prev => {
        const lastTime = new Date();
        const newDataPoint = {
          time: lastTime.toLocaleTimeString([], { second: '2-digit', minute: '2-digit' }),
          heartRate: 70 + Math.random() * 10 + (Math.random() > 0.9 ? 15 : 0), 
          spo2: 96 + Math.random() * 3,
          glucose: 95 + Math.random() * 5
        };
        return [...prev.slice(1), newDataPoint];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRange]);

  const currentData = data[data.length - 1];
  const hrStatus = getVitalStatus(currentData.heartRate, 'hr');
  const spo2Status = getVitalStatus(currentData.spo2, 'spo2');
  const glucoseStatus = getVitalStatus(currentData.glucose, 'glucose');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Live IoT Vitals Monitor</h1>
           <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               Real-time data stream from wearable sensors.
            </p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                {(['Live', '1h', '6h', '24h'] as TimeRange[]).map((range) => (
                    <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                            timeRange === range 
                            ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 shadow-sm' 
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                    >
                        {range === 'Live' ? 'LIVE' : range}
                    </button>
                ))}
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isConnected ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
                <Wifi className="w-3 h-3" />
                <span className="text-xs font-bold">{isConnected ? 'ONLINE' : 'OFFLINE'}</span>
            </div>
        </div>
      </div>

      {/* Live Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Heart Rate Card */}
        <Card className={`border transition-colors duration-300 ${hrStatus.bg} ${hrStatus.border}`}>
            <CardContent className="flex items-center justify-between">
                <div>
                    <p className={`font-medium mb-1 flex items-center gap-2 ${hrStatus.color}`}><Activity className="w-4 h-4" /> Heart Rate</p>
                    <h2 className={`text-4xl font-bold ${hrStatus.color}`}>{Math.round(currentData.heartRate)} <span className="text-lg font-normal opacity-70">bpm</span></h2>
                    <Badge className={`mt-2 ${hrStatus.color} bg-white/50 dark:bg-black/20 border-0`}>{hrStatus.label}</Badge>
                </div>
                <div className="h-16 w-24 flex items-end justify-between gap-1 opacity-60">
                   {[...Array(10)].map((_, i) => (
                      <div key={i} className={`w-2 rounded-t-sm transition-all duration-500 ${hrStatus.color.replace('text-', 'bg-')}`} style={{ height: `${Math.random() * 80 + 20}%` }}></div>
                   ))}
                </div>
            </CardContent>
        </Card>
        
        {/* SpO2 Card */}
        <Card className={`border transition-colors duration-300 ${spo2Status.bg} ${spo2Status.border}`}>
            <CardContent className="flex items-center justify-between">
                <div>
                    <p className={`font-medium mb-1 flex items-center gap-2 ${spo2Status.color}`}><Zap className="w-4 h-4" /> SpO2</p>
                    <h2 className={`text-4xl font-bold ${spo2Status.color}`}>{Math.round(currentData.spo2)} <span className="text-lg font-normal opacity-70">%</span></h2>
                    <Badge className={`mt-2 ${spo2Status.color} bg-white/50 dark:bg-black/20 border-0`}>{spo2Status.label}</Badge>
                </div>
                 <div className="h-16 w-24 flex items-end justify-between gap-1 opacity-60">
                      {[...Array(10)].map((_, i) => (
                          <div key={i} className={`w-2 rounded-t-sm transition-all duration-500 ${spo2Status.color.replace('text-', 'bg-')}`} style={{ height: `${80 + Math.random() * 20}%` }}></div>
                      ))}
                   </div>
            </CardContent>
        </Card>

        {/* Glucose Card */}
        <Card className={`border transition-colors duration-300 ${glucoseStatus.bg} ${glucoseStatus.border}`}>
            <CardContent className="flex items-center justify-between">
                <div>
                     <p className={`font-medium mb-1 flex items-center gap-2 ${glucoseStatus.color}`}><Activity className="w-4 h-4" /> Glucose</p>
                     <h2 className={`text-4xl font-bold ${glucoseStatus.color}`}>{Math.round(currentData.glucose)} <span className="text-lg font-normal opacity-70">mg/dL</span></h2>
                     <Badge className={`mt-2 ${glucoseStatus.color} bg-white/50 dark:bg-black/20 border-0`}>{glucoseStatus.label}</Badge>
                </div>
                 <div className="h-16 w-24 flex items-end justify-between gap-1 opacity-60">
                      {[...Array(10)].map((_, i) => (
                          <div key={i} className={`w-2 rounded-t-sm transition-all duration-500 ${glucoseStatus.color.replace('text-', 'bg-')}`} style={{ height: `${Math.random() * 60 + 20}%` }}></div>
                      ))}
                   </div>
            </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heart Rate Area Chart */}
        <Card>
          <CardHeader 
            title="Heart Rate Trend" 
            subtitle={`Showing data for: ${timeRange}`} 
            icon={<Activity className="w-5 h-5 text-rose-500" />}
          />
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="time" tick={{fontSize: 10, fill: '#94a3b8'}} minTickGap={30} />
                <YAxis domain={['auto', 'auto']} tick={{fontSize: 12, fill: '#94a3b8'}} width={30} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                    type="monotone" 
                    dataKey="heartRate" 
                    stroke="#e11d48" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorHr)" 
                    animationDuration={1000}
                    isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* SpO2 & Glucose Line Chart */}
        <Card>
          <CardHeader 
            title="SpO2 & Glucose Levels" 
            subtitle={`Showing data for: ${timeRange}`} 
            icon={<Zap className="w-5 h-5 text-sky-500" />}
          />
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="time" tick={{fontSize: 10, fill: '#94a3b8'}} minTickGap={30} />
                <YAxis yAxisId="left" domain={[90, 100]} tick={{fontSize: 12, fill: '#0ea5e9'}} width={30} />
                <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']} tick={{fontSize: 12, fill: '#10b981'}} width={30} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="spo2" 
                    stroke="#0ea5e9" 
                    strokeWidth={3} 
                    dot={false} 
                    activeDot={{r: 6, strokeWidth: 0}} 
                    animationDuration={1500}
                />
                <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="glucose" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={false} 
                    activeDot={{r: 6, strokeWidth: 0}} 
                    animationDuration={1500}
                    strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* AI Analysis Footer */}
      <Card className="bg-indigo-600 text-white border-indigo-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
             <CardContent className="relative z-10">
                <div className="flex items-start gap-3">
                   <div className="p-2 bg-white/10 rounded-lg mt-1"><AlertCircle className="w-6 h-6 text-white" /></div>
                   <div>
                       <h4 className="font-bold text-lg">Real-time AI Analysis</h4>
                       <p className="text-indigo-100 text-sm mt-1 leading-relaxed">
                           {timeRange === 'Live' 
                             ? "Analyzing current data stream. Heart rate variability is within acceptable limits, but SpO2 shows minor fluctuations. Recommended to maintain steady breathing."
                             : "Historical analysis complete. No significant anomalies detected in the selected time range. Vitals remained 98% stable."
                           }
                       </p>
                   </div>
                </div>
             </CardContent>
      </Card>
    </div>
  );
};