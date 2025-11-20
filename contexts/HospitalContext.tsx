import React, { createContext, useContext, useState, useEffect } from 'react';
import { Staff, Bed, InventoryItem, Appointment, Invoice, AlertIncident } from '../types';

interface HospitalContextType {
  staff: Staff[];
  beds: Bed[];
  inventory: InventoryItem[];
  appointments: Appointment[];
  invoices: Invoice[];
  alerts: AlertIncident[];
  
  // Actions
  addStaff: (staff: Staff) => void;
  updateStaff: (staff: Staff) => void;
  updateStaffStatus: (id: number, status: Staff['status']) => void;
  assignBed: (bedId: string, patientName: string) => void;
  dischargeBed: (bedId: string) => void;
  updateInventory: (id: number, newStock: number) => void;
  addAppointment: (appt: Appointment) => void;
  updateAppointmentStatus: (id: number, status: Appointment['status']) => void;
  createInvoice: (invoice: Invoice) => void;
  resolveAlert: (id: string) => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Initial Data ---
  const [staff, setStaff] = useState<Staff[]>([
    { id: 1, name: "Dr. Sarah Richards", role: "Doctor", department: "Cardiology", status: "On Duty", shift: "Morning", contact: "555-0101", image: "https://i.pravatar.cc/150?img=5" },
    { id: 2, name: "Dr. James Wilson", role: "Doctor", department: "Emergency", status: "On Duty", shift: "Morning", contact: "555-0102", image: "https://i.pravatar.cc/150?img=11" },
    { id: 3, name: "Nurse Emily Blunt", role: "Nurse", department: "ICU", status: "On Duty", shift: "Morning", contact: "555-0103", image: "https://i.pravatar.cc/150?img=9" },
    { id: 4, name: "Dr. Mike Chen", role: "Doctor", department: "Neurology", status: "Off Duty", shift: "Night", contact: "555-0104", image: "https://i.pravatar.cc/150?img=3" },
  ]);

  const [beds, setBeds] = useState<Bed[]>([
    { id: "ICU-01", ward: "ICU", number: 1, status: "Occupied", patientName: "John Doe", type: "ICU" },
    { id: "ICU-02", ward: "ICU", number: 2, status: "Available", type: "ICU" },
    { id: "ICU-03", ward: "ICU", number: 3, status: "Maintenance", type: "ICU" },
    { id: "GEN-01", ward: "General", number: 101, status: "Occupied", patientName: "Jane Smith", type: "General" },
    { id: "GEN-02", ward: "General", number: 102, status: "Available", type: "General" },
    { id: "GEN-03", ward: "General", number: 103, status: "Available", type: "General" },
    { id: "ER-01", ward: "Emergency", number: 1, status: "Occupied", patientName: "Emergency Patient #42", type: "Emergency" },
    { id: "ER-02", ward: "Emergency", number: 2, status: "Occupied", patientName: "Accident Victim A", type: "Emergency" },
  ]);

  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: "Paracetamol 500mg", category: "Medicine", stock: 500, unit: "strips", minLevel: 100, expiry: "2025-12", status: "Good" },
    { id: 2, name: "Syringes 5ml", category: "Consumable", stock: 45, unit: "boxes", minLevel: 50, expiry: "2026-01", status: "Low" },
    { id: 3, name: "Insulin Glargine", category: "Medicine", stock: 12, unit: "vials", minLevel: 20, expiry: "2024-11", status: "Critical" },
    { id: 4, name: "Sterile Bandages", category: "Consumable", stock: 200, unit: "rolls", minLevel: 50, expiry: "2028-01", status: "Good" },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, patientName: "Alice Brown", doctorName: "Dr. Sarah Richards", type: "Check-up", time: "09:00 AM", date: "2023-10-25", status: "Checked In" },
    { id: 2, patientName: "Bob White", doctorName: "Dr. James Wilson", type: "Emergency Follow-up", time: "10:30 AM", date: "2023-10-25", status: "Scheduled" },
    { id: 3, patientName: "Charlie Green", doctorName: "Dr. Sarah Richards", type: "Consultation", time: "02:00 PM", date: "2023-10-25", status: "Pending" },
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: "INV-001", patientName: "John Doe", amount: 1200.50, date: "2023-10-24", status: "Pending", items: ["ICU Stay (1 day)", "MRI Scan"] },
    { id: "INV-002", patientName: "Jane Smith", amount: 450.00, date: "2023-10-23", status: "Paid", items: ["General Ward (2 days)", "Medication"] },
  ]);

  const [alerts, setAlerts] = useState<AlertIncident[]>([
    { id: "ALT-1", type: "Cardiac Arrest", location: "ER - Bed 2", severity: "critical", time: "Now", distance: "0m", status: "New" },
  ]);

  // --- Simulation Effects ---
  useEffect(() => {
    const interval = setInterval(() => {
      let inventoryUpdated = false;
      let newAlerts: AlertIncident[] = [];

      // 1. Update Inventory
      setInventory(prev => prev.map(item => {
        if (Math.random() > 0.7) {
          const newStock = Math.max(0, item.stock - Math.floor(Math.random() * 5));
          let status: 'Good' | 'Low' | 'Critical' = 'Good';
          if (newStock < item.minLevel / 2) status = 'Critical';
          else if (newStock < item.minLevel) status = 'Low';
          
          // If critical and not already alerted (simplified logic for demo)
          if (status === 'Critical' && item.status !== 'Critical') {
             newAlerts.push({
                id: `INV-${Date.now()}-${item.id}`,
                type: "Critical Low Stock",
                location: "Pharmacy Storage",
                severity: "medium",
                time: "Just now",
                distance: "-",
                status: "New",
                description: `${item.name} is critically low (${newStock} ${item.unit}). Restock immediately.`
             });
          }

          inventoryUpdated = true;
          return { ...item, stock: newStock, status };
        }
        return item;
      }));

      if (newAlerts.length > 0) {
          setAlerts(prev => [...newAlerts, ...prev]);
      }

      // 2. Random Clinical Alert (Rare)
      if (Math.random() > 0.98) {
        const types = ["Hypotension Alert", "Arrhythmia Detected", "Oxygen Supply Low", "Fall Detected"];
        const locs = ["Ward A", "ICU", "ER", "Ward B"];
        const newAlert: AlertIncident = {
          id: `ALT-${Date.now()}`,
          type: types[Math.floor(Math.random() * types.length)],
          location: locs[Math.floor(Math.random() * locs.length)],
          severity: Math.random() > 0.5 ? 'high' : 'medium',
          time: 'Just now',
          distance: '0m',
          status: 'New'
        };
        setAlerts(prev => [newAlert, ...prev]);
      }

    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // --- Actions ---
  const addStaff = (newStaff: Staff) => setStaff([...staff, newStaff]);
  const updateStaff = (updatedMember: Staff) => {
    setStaff(prevStaff => prevStaff.map(s => s.id === updatedMember.id ? updatedMember : s));
  };
  const updateStaffStatus = (id: number, status: Staff['status']) => {
    setStaff(prevStaff => prevStaff.map(s => s.id === id ? { ...s, status } : s));
  };

  const assignBed = (bedId: string, patientName: string) => {
    setBeds(prevBeds => prevBeds.map(b => b.id === bedId ? { ...b, status: 'Occupied', patientName, admissionTime: new Date().toLocaleTimeString() } : b));
  };
  const dischargeBed = (bedId: string) => {
    setBeds(prevBeds => prevBeds.map(b => b.id === bedId ? { ...b, status: 'Cleaning', patientName: undefined, admissionTime: undefined } : b));
  };

  const updateInventory = (id: number, newStock: number) => {
    setInventory(prevInventory => prevInventory.map(i => {
      if (i.id === id) {
        let status: 'Good' | 'Low' | 'Critical' = 'Good';
        if (newStock < i.minLevel / 2) status = 'Critical';
        else if (newStock < i.minLevel) status = 'Low';
        return { ...i, stock: newStock, status };
      }
      return i;
    }));
  };

  const addAppointment = (appt: Appointment) => setAppointments([...appointments, appt]);
  const updateAppointmentStatus = (id: number, status: Appointment['status']) => {
    setAppointments(prevAppts => prevAppts.map(a => a.id === id ? { ...a, status } : a));
  };

  const createInvoice = (invoice: Invoice) => setInvoices([invoice, ...invoices]);
  const resolveAlert = (id: string) => setAlerts(prevAlerts => prevAlerts.filter(a => a.id !== id));

  return (
    <HospitalContext.Provider value={{
      staff, beds, inventory, appointments, invoices, alerts,
      addStaff, updateStaff, updateStaffStatus, assignBed, dischargeBed, updateInventory,
      addAppointment, updateAppointmentStatus, createInvoice, resolveAlert
    }}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (context === undefined) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};