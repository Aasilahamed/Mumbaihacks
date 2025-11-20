import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Badge, Button } from '../components/Common';
import { 
  Users, Bed, Pill, CreditCard, Calendar, Search, Filter, Plus, 
  Trash2, CheckCircle, Clock, MoreHorizontal, AlertCircle, CheckSquare, X,
  UserPlus, Briefcase, Phone, DollarSign, FileText, Edit2, Eye, AlertTriangle
} from 'lucide-react';
import { useHospital } from '../contexts/HospitalContext';
import { Staff, Appointment, InventoryItem } from '../types';

// --- STAFF MANAGEMENT MODULE ---
export const StaffManagement: React.FC = () => {
  const { staff, addStaff, updateStaff, updateStaffStatus } = useHospital();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Staff>>({ role: 'Doctor', status: 'On Duty', shift: 'Morning' });
  const [viewingId, setViewingId] = useState<number | null>(null);

  const handleAdd = () => {
    if (formData.name && formData.department) {
      addStaff({
        id: Date.now(),
        name: formData.name,
        role: formData.role as any,
        department: formData.department,
        status: 'Off Duty',
        shift: formData.shift as any,
        contact: formData.contact || '555-0000',
        image: `https://i.pravatar.cc/150?u=${Date.now()}`
      } as Staff);
      setIsAdding(false);
      setFormData({ role: 'Doctor', status: 'On Duty', shift: 'Morning' });
    }
  };

  const startEdit = (member: Staff) => {
      setEditingId(member.id);
      setFormData(member);
      setViewingId(null);
      setIsAdding(false);
  };

  const handleEditSave = () => {
      if (editingId && formData.name) {
          updateStaff(formData as Staff);
          setEditingId(null);
          setFormData({ role: 'Doctor', status: 'On Duty', shift: 'Morning' });
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Staff Management</h2>
        <Button icon={Plus} onClick={() => { setIsAdding(!isAdding); setEditingId(null); }}>{isAdding ? 'Cancel' : 'Add Staff'}</Button>
      </div>

      {(isAdding || editingId) && (
        <Card className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-2">
            <div className="p-4">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4">{editingId ? 'Edit Staff Details' : 'Add New Staff'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input placeholder="Name" className="p-2 rounded border dark:bg-slate-800 dark:border-slate-600 dark:text-white" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <input placeholder="Department" className="p-2 rounded border dark:bg-slate-800 dark:border-slate-600 dark:text-white" value={formData.department || ''} onChange={e => setFormData({...formData, department: e.target.value})} />
                    <input placeholder="Contact" className="p-2 rounded border dark:bg-slate-800 dark:border-slate-600 dark:text-white" value={formData.contact || ''} onChange={e => setFormData({...formData, contact: e.target.value})} />
                    <select className="p-2 rounded border dark:bg-slate-800 dark:border-slate-600 dark:text-white" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as any})}>
                        <option>Doctor</option><option>Nurse</option><option>Admin</option>
                    </select>
                    <select className="p-2 rounded border dark:bg-slate-800 dark:border-slate-600 dark:text-white" value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value as any})}>
                        <option>Morning</option><option>Evening</option><option>Night</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <Button onClick={editingId ? handleEditSave : handleAdd}>{editingId ? 'Save Changes' : 'Create Staff'}</Button>
                    <Button variant="secondary" onClick={() => { setIsAdding(false); setEditingId(null); }}>Cancel</Button>
                </div>
            </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map(member => (
          <Card 
            key={member.id} 
            className={`transition-all duration-300 group cursor-pointer ${viewingId === member.id ? 'ring-2 ring-brand-500 scale-[1.02] shadow-lg' : 'hover:shadow-md'}`}
            onClick={() => setViewingId(member.id === viewingId ? null : member.id)}
          >
            <CardContent className="flex flex-col gap-4 p-4">
              <div className="flex items-start gap-4">
                  <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white truncate">{member.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{member.role} • {member.department}</p>
                        </div>
                        <Badge variant={member.status === 'On Duty' ? 'success' : 'neutral'}>{member.status}</Badge>
                    </div>
                  </div>
              </div>

              {/* Expanded Details */}
              {viewingId === member.id && (
                   <div className="pt-4 border-t border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-top-1">
                       <div className="grid grid-cols-2 gap-2 mb-4">
                           <div className="text-xs">
                               <span className="text-slate-400 block uppercase font-bold">Shift</span>
                               <span className="text-slate-700 dark:text-slate-200 font-medium">{member.shift}</span>
                           </div>
                           <div className="text-xs">
                               <span className="text-slate-400 block uppercase font-bold">Contact</span>
                               <span className="text-slate-700 dark:text-slate-200 font-medium">{member.contact}</span>
                           </div>
                       </div>
                       <div className="flex gap-2">
                           <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={(e) => { e.stopPropagation(); startEdit(member); }}>
                               <Edit2 className="w-3 h-3 mr-1" /> Edit
                           </Button>
                           <Button size="sm" variant="danger" className="flex-1 h-8 text-xs" onClick={(e) => { e.stopPropagation(); updateStaffStatus(member.id, 'Off Duty'); }}>
                               End Shift
                           </Button>
                       </div>
                   </div>
              )}
              
              {/* Hover Hint */}
              {viewingId !== member.id && (
                 <div className="text-xs text-slate-400 text-center opacity-0 group-hover:opacity-100 transition-opacity">Click to view details & actions</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- BED ALLOCATION MODULE ---
export const BedAllocation: React.FC = () => {
  const { beds, assignBed, dischargeBed } = useHospital();
  const [selectedBed, setSelectedBed] = useState<string | null>(null);
  const [patientName, setPatientName] = useState("");
  const [recentlyOccupied, setRecentlyOccupied] = useState<string | null>(null);

  const handleAssign = () => {
    if (selectedBed && patientName) {
      assignBed(selectedBed, patientName);
      setRecentlyOccupied(selectedBed);
      setTimeout(() => setRecentlyOccupied(null), 2000); // Remove highlight after animation
      setSelectedBed(null);
      setPatientName("");
    }
  };

  const stats = {
    total: beds.length,
    available: beds.filter(b => b.status === 'Available').length,
    occupied: beds.filter(b => b.status === 'Occupied').length,
    maintenance: beds.filter(b => b.status === 'Maintenance' || b.status === 'Cleaning').length
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800"><CardContent className="p-4 text-center"><h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</h3><p className="text-xs font-medium text-blue-500">Total Beds</p></CardContent></Card>
        <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800"><CardContent className="p-4 text-center"><h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.available}</h3><p className="text-xs font-medium text-emerald-500">Available</p></CardContent></Card>
        <Card className="bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800"><CardContent className="p-4 text-center"><h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.occupied}</h3><p className="text-xs font-medium text-rose-500">Occupied</p></CardContent></Card>
        <Card className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"><CardContent className="p-4 text-center"><h3 className="text-2xl font-bold text-slate-600 dark:text-slate-400">{stats.maintenance}</h3><p className="text-xs font-medium text-slate-500">Maintenance</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['ICU', 'General', 'Emergency'].map(ward => (
          <Card key={ward} className="h-full">
            <CardHeader title={`${ward} Ward`} subtitle={`${beds.filter(b => b.ward === ward && b.status === 'Available').length} beds available`} />
            <CardContent className="grid grid-cols-2 gap-3">
              {beds.filter(b => b.ward === ward).map(bed => (
                <button
                  key={bed.id}
                  onClick={() => setSelectedBed(bed.id)}
                  className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                    bed.status === 'Available' ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-900/30' :
                    bed.status === 'Occupied' ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700' :
                    'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60'
                  } ${recentlyOccupied === bed.id ? 'ring-4 ring-emerald-400 ring-opacity-50 animate-pulse' : ''}`}
                >
                  {recentlyOccupied === bed.id && (
                      <span className="absolute inset-0 bg-emerald-400/20 animate-ping"></span>
                  )}
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <span className="font-bold text-slate-700 dark:text-slate-200">#{bed.number}</span>
                    <div className={`w-2 h-2 rounded-full ${
                        bed.status === 'Available' ? 'bg-emerald-500' : 
                        bed.status === 'Occupied' ? 'bg-rose-500' : 'bg-amber-500'
                    }`}></div>
                  </div>
                  <p className="text-xs text-slate-500 truncate relative z-10">{bed.patientName || bed.status}</p>
                </button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedBed && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Manage Bed {selectedBed}</h3>
            
            {beds.find(b => b.id === selectedBed)?.status === 'Available' ? (
              <div className="space-y-4">
                <p className="text-slate-600 dark:text-slate-300">Assign a patient to this bed.</p>
                <input 
                  autoFocus
                  placeholder="Patient Name" 
                  className="w-full p-3 rounded-xl border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                />
                <div className="flex gap-3">
                  <Button onClick={handleAssign} disabled={!patientName}>Assign Bed</Button>
                  <Button variant="secondary" onClick={() => setSelectedBed(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
               <div className="space-y-4">
                 <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 uppercase font-bold">Current Patient</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">{beds.find(b => b.id === selectedBed)?.patientName}</p>
                    <p className="text-xs text-slate-400 mt-1">Admitted: {beds.find(b => b.id === selectedBed)?.admissionTime}</p>
                 </div>
                 <div className="flex gap-3">
                    <Button variant="danger" onClick={() => { dischargeBed(selectedBed); setSelectedBed(null); }}>Discharge Patient</Button>
                    <Button variant="secondary" onClick={() => setSelectedBed(null)}>Close</Button>
                 </div>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- PHARMACY MODULE ---
export const Pharmacy: React.FC = () => {
  const { inventory, updateInventory } = useHospital();
  
  const criticalItems = inventory.filter(i => i.status === 'Critical');

  return (
    <div className="space-y-6">
      {criticalItems.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-4 animate-pulse">
              <div className="p-2 bg-red-100 dark:bg-red-800 rounded-full text-red-600 dark:text-red-200">
                  <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                  <h3 className="font-bold text-red-800 dark:text-red-200">Critical Stock Alert</h3>
                  <p className="text-sm text-red-600 dark:text-red-300">
                      {criticalItems.length} items have fallen below critical levels. Immediate restock required.
                  </p>
              </div>
              <Button variant="danger" size="sm" className="ml-auto">Order All</Button>
          </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Pharmacy Inventory</h2>
        <div className="flex gap-2">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input placeholder="Search items..." className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
             </div>
             <Button icon={Filter} variant="secondary">Filter</Button>
             <Button icon={Plus}>Add Item</Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Stock Level</th>
                <th className="px-6 py-4">Expiry</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {inventory.map(item => (
                <tr key={item.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${item.status === 'Critical' ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-white flex items-center gap-2">
                      {item.status === 'Critical' && <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>}
                      {item.name}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{item.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold">{item.stock}</span>
                      <span className="text-xs text-slate-400">{item.unit}</span>
                    </div>
                    <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
                       <div 
                          className={`h-full rounded-full ${
                              item.status === 'Good' ? 'bg-emerald-500' : item.status === 'Low' ? 'bg-amber-500' : 'bg-red-500'
                          }`} 
                          style={{ width: `${Math.min(100, (item.stock / (item.minLevel * 2)) * 100)}%` }}
                       ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{item.expiry}</td>
                  <td className="px-6 py-4">
                    <Badge variant={item.status === 'Critical' ? 'danger' : item.status === 'Low' ? 'warning' : 'success'}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex justify-end gap-2">
                        <button onClick={() => updateInventory(item.id, item.stock + 10)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"><Plus className="w-4 h-4 text-slate-600 dark:text-slate-400" /></button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// --- APPOINTMENTS MODULE ---
export const Appointments: React.FC = () => {
    const { appointments, updateAppointmentStatus } = useHospital();
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [dateFilter, setDateFilter] = useState<string>('');
  
    const filteredAppointments = appointments.filter(appt => {
        const matchesStatus = statusFilter === 'All' || appt.status === statusFilter;
        const matchesDate = !dateFilter || appt.date === dateFilter;
        return matchesStatus && matchesDate;
    });
  
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Appointments</h2>
          <div className="flex flex-wrap items-center gap-3">
             <div className="flex bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1">
                 {['All', 'Scheduled', 'Checked In', 'Completed', 'Cancelled'].map(status => (
                     <button 
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                            statusFilter === status 
                            ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300' 
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                     >
                         {status}
                     </button>
                 ))}
             </div>
             <div className="relative">
                 <input 
                    type="date" 
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="pl-3 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none dark:text-white" 
                 />
             </div>
             <Button icon={Plus}>New Appointment</Button>
          </div>
        </div>
  
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Doctor</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredAppointments.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No appointments found matching your filters.</td></tr>
                ) : filteredAppointments.map(appt => (
                  <tr key={appt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">
                        {appt.patientName}
                        <span className="block text-xs text-slate-400 font-normal">ID: #P-{1000 + appt.id}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{appt.doctorName}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {appt.date}</div>
                        <div className="flex items-center gap-2 mt-1"><Clock className="w-3 h-3" /> {appt.time}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{appt.type}</td>
                    <td className="px-6 py-4">
                      <Badge variant={
                          appt.status === 'Checked In' ? 'success' : 
                          appt.status === 'Cancelled' ? 'danger' : 
                          appt.status === 'Completed' ? 'neutral' : 'warning'
                      }>
                        {appt.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2">
                          {appt.status === 'Scheduled' && (
                              <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={() => updateAppointmentStatus(appt.id, 'Checked In')}>Check In</Button>
                          )}
                          {appt.status === 'Checked In' && (
                              <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={() => updateAppointmentStatus(appt.id, 'Completed')}>Complete</Button>
                          )}
                          <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400"><MoreHorizontal className="w-4 h-4" /></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

// --- BILLING MODULE ---
export const Billing: React.FC = () => {
  const { invoices, createInvoice } = useHospital();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Invoices & Payments</h2>
        <Button icon={Plus}>Create Invoice</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {invoices.map(inv => (
              <Card key={inv.id}>
                  <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <p className="text-xs text-slate-400 uppercase font-bold">{inv.id}</p>
                              <h3 className="font-bold text-lg text-slate-800 dark:text-white">{inv.patientName}</h3>
                          </div>
                          <Badge variant={inv.status === 'Paid' ? 'success' : 'warning'}>{inv.status}</Badge>
                      </div>
                      <div className="space-y-2 mb-4">
                          {inv.items.map((item, i) => (
                              <div key={i} className="text-sm text-slate-500 flex justify-between border-b border-dashed border-slate-100 dark:border-slate-700 pb-1 last:border-0">
                                  <span>{item}</span>
                              </div>
                          ))}
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-700">
                          <span className="text-sm text-slate-400">{inv.date}</span>
                          <span className="font-bold text-xl text-slate-800 dark:text-white">${inv.amount}</span>
                      </div>
                  </CardContent>
              </Card>
          ))}
      </div>
    </div>
  );
};