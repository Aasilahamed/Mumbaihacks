import React from 'react';

export enum Page {
  DASHBOARD = 'dashboard',
  CHAT = 'chat',
  MEDICAL_TRACKER = 'medical_tracker',
  IOT_MONITOR = 'iot_monitor',
  SOS = 'sos',
  INSURANCE = 'insurance',
  HOSPITAL_ADMIN = 'hospital_admin',
  ALERTS = 'alerts',
  COMMUNITY = 'community',
  SETTINGS = 'settings',
  MAP = 'map',
  // Admin Specific Pages
  ADMIN_DASHBOARD = 'admin_dashboard',
  STAFF_MANAGEMENT = 'staff_management',
  BED_ALLOCATION = 'bed_allocation',
  PHARMACY = 'pharmacy',
  BILLING = 'billing',
  APPOINTMENTS = 'appointments'
}

export type UserRole = 'patient' | 'admin';

export interface NavItem {
  id: Page;
  label: string;
  icon: React.FC<any>;
}

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  height?: string;
  weight?: string;
  bloodType?: string;
  gender?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  avatar?: string;
}

// --- Domain Types ---

export interface Staff {
  id: number;
  name: string;
  role: 'Doctor' | 'Nurse' | 'Admin' | 'Support';
  department: string;
  status: 'On Duty' | 'Off Duty' | 'On Break';
  shift: 'Morning' | 'Night' | 'Evening';
  contact: string;
  image: string;
}

export interface Bed {
  id: string;
  ward: string;
  number: number;
  status: 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';
  patientName?: string;
  admissionTime?: string;
  type: 'ICU' | 'General' | 'Emergency' | 'Private';
}

export interface InventoryItem {
  id: number;
  name: string;
  category: 'Medicine' | 'Equipment' | 'Consumable';
  stock: number;
  unit: string;
  minLevel: number;
  expiry: string;
  status: 'Good' | 'Low' | 'Critical';
}

export interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  type: string;
  time: string;
  date: string;
  status: 'Scheduled' | 'Checked In' | 'Completed' | 'Cancelled' | 'Pending';
  notes?: string;
}

export interface Invoice {
  id: string;
  patientName: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  items: string[];
}

export interface AlertIncident {
  id: string;
  type: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  time: string;
  distance: string;
  description?: string;
  status: 'New' | 'Acknowledged' | 'Resolved';
}

export interface Hospital {
  id: number;
  name: string;
  distance: string;
  rating: number;
  bedsAvailable: number;
  waitList: number;
  specialties: string[];
  coords: { x: number; y: number };
  address?: string;
}

// --- Chat/Notification Types ---
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert';
  time: string;
  read: boolean;
}