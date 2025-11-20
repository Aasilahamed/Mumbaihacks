import React from 'react';
import { Card, CardContent, CardHeader, Badge, Button } from '../components/Common';
import { 
  Users, Bed, Activity, DollarSign, AlertTriangle, Clock, Plus, Pill
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useHospital } from '../contexts/HospitalContext';

const analyticsData = [
  { time: '8am', patients: 12 },
  { time: '10am', patients: 35 },
  { time: '12pm', patients: 48 },
  { time: '2pm', patients: 40 },
  { time: '4pm', patients: 25 },
  { time: '6pm', patients: 18 },
];

export const HospitalDashboard: React.FC = () => {
  const { staff, beds, inventory, appointments, alerts, resolveAlert } = useHospital();

  // --- Computed Stats from Context ---
  const doctorsOnDuty = staff.filter(s => s.role === 'Doctor' && s.status === 'On Duty').length;
  const bedsAvailable = beds.filter(b => b.status === 'Available').length;
  const activePatients = beds.filter(b => b.status === 'Occupied').length;
  const revenue = 42500; // Static for now as invoicing logic is simple

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Admin Dashboard</h1>
           <p className="text-slate-500 dark:text-slate-400">Real-time Hospital Overview</p>
        </div>
        <div className="flex items-center gap-2">
           <Button icon={Plus}>New Admission</Button>
           <Button variant="secondary">Generate Report</Button>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
            { label: 'Active In-Patients', val: activePatients, sub: 'Live Count', icon: Users, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Beds Available', val: bedsAvailable, sub: bedsAvailable < 3 ? 'Critical Low' : 'Stable', icon: Bed, color: bedsAvailable < 3 ? 'text-red-600 bg-red-50' : 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
            { label: 'Doctors On Duty', val: doctorsOnDuty, sub: 'Shift A', icon: Activity, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
            { label: 'Est. Revenue', val: `$${(revenue/1000).toFixed(1)}k`, sub: 'Today', icon: DollarSign, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' }
         ].map((stat, i) => (
             <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                   <div className="flex justify-between items-start">
                      <div>
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{stat.val}</h3>
                          <span className={`text-xs font-medium ${String(stat.sub).includes('Critical') ? 'text-red-500' : 'text-emerald-500'}`}>{stat.sub}</span>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.color}`}>
                          <stat.icon className="w-5 h-5" />
                      </div>
                   </div>
                </CardContent>
             </Card>
         ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Real-Time Analytics */}
          <Card className="lg:col-span-2">
              <CardHeader title="Patient Flow" subtitle="Admissions Today" />
              <div className="h-80 w-full p-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData}>
                        <defs>
                            <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none'}} />
                        <Area type="monotone" dataKey="patients" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPatients)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
          </Card>

          {/* Notifications / ER Alerts */}
          <Card className="lg:col-span-1 bg-slate-900 text-white border-slate-800 max-h-[400px] overflow-y-auto">
              <CardHeader title={`Live Alerts (${alerts.length})`} icon={<AlertTriangle className="w-5 h-5 text-red-400" />} />
              <CardContent className="space-y-4">
                  {alerts.length === 0 ? (
                      <div className="text-center text-slate-500 py-10">No active alerts</div>
                  ) : alerts.map((alert) => (
                      <div key={alert.id} className={`p-3 rounded-xl border border-slate-700 bg-slate-800/50 animate-in slide-in-from-right-5 ${alert.severity === 'critical' || alert.severity === 'high' ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-amber-500'}`}>
                          <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-sm text-slate-200">{alert.type}</h4>
                              <span className="text-xs text-slate-500">{alert.time}</span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{alert.location}</p>
                          <div className="mt-2 flex gap-2">
                              <button onClick={() => resolveAlert(alert.id)} className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded transition-colors">Resolve</button>
                          </div>
                      </div>
                  ))}
              </CardContent>
          </Card>

          {/* Appointments List */}
          <Card className="lg:col-span-2">
              <CardHeader title="Today's Appointments" action={<Button variant="ghost" className="text-xs">View All</Button>} />
              <CardContent>
                  <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                          <thead className="text-xs text-slate-400 uppercase bg-slate-50 dark:bg-slate-700/50">
                              <tr>
                                  <th className="px-4 py-3">Patient</th>
                                  <th className="px-4 py-3">Doctor</th>
                                  <th className="px-4 py-3">Type</th>
                                  <th className="px-4 py-3">Time</th>
                                  <th className="px-4 py-3 text-right">Status</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                              {appointments.slice(0, 5).map((appt) => (
                                  <tr key={appt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{appt.patientName}</td>
                                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{appt.doctorName}</td>
                                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{appt.type}</td>
                                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 flex items-center gap-2"><Clock className="w-3 h-3" /> {appt.time}</td>
                                      <td className="px-4 py-3 text-right">
                                          <Badge variant={appt.status === 'Checked In' ? 'success' : 'neutral'}>{appt.status}</Badge>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </CardContent>
          </Card>

          {/* Low Stock Warning */}
          <Card className="lg:col-span-1">
              <CardHeader title="Low Inventory" icon={<Pill className="w-5 h-5 text-purple-500" />} />
              <CardContent>
                  <div className="space-y-3">
                      {inventory.filter(i => i.status !== 'Good').length === 0 ? (
                          <p className="text-sm text-slate-500">All stock levels optimal.</p>
                      ) : inventory.filter(i => i.status !== 'Good').slice(0, 4).map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                              <div>
                                  <p className="text-sm font-medium text-slate-800 dark:text-white">{item.name}</p>
                                  <p className="text-xs text-slate-400">{item.stock} {item.unit} remaining</p>
                              </div>
                              <Badge variant={item.status === 'Critical' ? 'danger' : 'warning'}>{item.status}</Badge>
                          </div>
                      ))}
                  </div>
              </CardContent>
          </Card>
      </div>
    </div>
  );
};
