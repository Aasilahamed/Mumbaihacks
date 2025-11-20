import React, { useState } from 'react';
import { Page, NavItem, UserRole } from '../types';
import { 
  LayoutDashboard, Stethoscope, Activity, HeartPulse, AlertCircle, 
  ShieldCheck, Building2, Users, Settings, Menu, Bell, 
  Search, LogOut, ChevronRight, Map, FileText, Pill, CreditCard, Bed, User, Smartphone, Ruler, Sun, Moon
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';

// --- Navigation Configurations ---

const PATIENT_NAV_ITEMS: NavItem[] = [
  { id: Page.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { id: Page.MAP, label: 'Find Hospitals', icon: Map },
  { id: Page.CHAT, label: 'Health Assistant', icon: Stethoscope },
  { id: Page.MEDICAL_TRACKER, label: 'Medical & Diet', icon: Activity },
  { id: Page.IOT_MONITOR, label: 'IoT Monitor', icon: HeartPulse },
  { id: Page.SOS, label: 'Emergency SOS', icon: AlertCircle },
  { id: Page.INSURANCE, label: 'Insurance', icon: ShieldCheck },
  { id: Page.COMMUNITY, label: 'Community', icon: Users },
  { id: Page.SETTINGS, label: 'Settings', icon: Settings },
];

const ADMIN_NAV_ITEMS: NavItem[] = [
  { id: Page.ADMIN_DASHBOARD, label: 'Admin Dashboard', icon: LayoutDashboard },
  { id: Page.STAFF_MANAGEMENT, label: 'Staff Management', icon: Users },
  { id: Page.BED_ALLOCATION, label: 'Bed Allocation', icon: Bed },
  { id: Page.APPOINTMENTS, label: 'Appointments', icon: CalendarIcon },
  { id: Page.PHARMACY, label: 'Pharmacy & Inventory', icon: Pill },
  { id: Page.BILLING, label: 'Billing & Invoices', icon: CreditCard },
  { id: Page.ALERTS, label: 'Emergency Alerts', icon: AlertCircle },
  { id: Page.SETTINGS, label: 'Settings', icon: Settings },
];

function CalendarIcon(props: any) { return <FileText {...props} /> }

interface LayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
  userRole: UserRole;
  onLogout: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

const Sidebar: React.FC<{ currentPage: Page; onNavigate: (page: Page) => void; isOpen: boolean; onClose: () => void; userRole: UserRole; onLogout: () => void }> = ({ currentPage, onNavigate, isOpen, onClose, userRole, onLogout }) => {
  const items = userRole === 'admin' ? ADMIN_NAV_ITEMS : PATIENT_NAV_ITEMS;

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 shadow-xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-full flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-50 dark:border-slate-700">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-lg ${userRole === 'admin' ? 'bg-indigo-600' : 'bg-gradient-to-br from-brand-400 to-brand-600'}`}>
            {userRole === 'admin' ? <Building2 className="text-white w-5 h-5" /> : <HeartPulse className="text-white w-5 h-5" />}
          </div>
          <div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-400">HashCare AI</span>
            {userRole === 'admin' && <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Admin Portal</span>}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 no-scrollbar">
          {items.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); onClose(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive 
                      ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                  {item.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
                </button>
              );
          })}
        </div>

        <div className="p-4 border-t border-slate-50 dark:border-slate-700">
           <button 
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
                <LogOut className="w-5 h-5" />
                Sign Out
            </button>
        </div>
      </div>
    </aside>
  );
};

const Header: React.FC<{ onMenuClick: () => void; userRole: UserRole; theme?: 'light' | 'dark'; onToggleTheme?: () => void }> = ({ onMenuClick, userRole, theme, onToggleTheme }) => {
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user } = useUser();

    return (
        <header className="sticky top-0 z-30 h-16 px-4 lg:px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-700 flex items-center justify-between transition-colors duration-300">
            <div className="flex items-center gap-4">
                <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
                    <Menu className="w-5 h-5" />
                </button>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder={userRole === 'admin' ? "Search patients, staff..." : "Search health records..."}
                        className="bg-transparent border-none focus:outline-none text-sm w-48 placeholder:text-slate-400 text-slate-700 dark:text-slate-200"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                {/* Theme Toggle */}
                {onToggleTheme && (
                    <button 
                        onClick={onToggleTheme}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </button>
                )}
                
                 {/* Notifications */
                 <div className="relative">
                    <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative text-slate-500 dark:text-slate-400 transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                    </button>
                    {notificationsOpen && (
                        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 animate-in fade-in slide-in-from-top-5 z-50">
                            <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Recent Alerts</div>
                            {[1, 2, 3].map(i => (
                                <div key={i} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl cursor-pointer flex gap-3 items-start">
                                    <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${i === 1 ? 'bg-red-500' : 'bg-brand-500'}`}></div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                            {userRole === 'admin' ? 'New Emergency Admission' : 'High Heart Rate Detected'}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">2 mins ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-3 p-1.5 pr-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                    >
                        <img 
                            src={user?.avatar || "https://i.pravatar.cc/150?img=3"} 
                            alt="Profile" 
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 shadow-sm" 
                        />
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user?.name || 'User'}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{userRole === 'admin' ? 'Admin' : 'Patient ID: #8492'}</p>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-slate-400 hidden md:block transition-transform ${profileOpen ? 'rotate-90' : ''}`} />
                    </button>
                    
                    {profileOpen && (
                         <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-4 animate-in fade-in slide-in-from-top-5 z-50">
                             <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700 mb-3">
                                <img src={user?.avatar} className="w-12 h-12 rounded-full bg-slate-100" />
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-white">{user?.name}</p>
                                    <p className="text-xs text-slate-500">{user?.email}</p>
                                </div>
                             </div>
                             
                             {userRole === 'patient' && (
                                 <div className="grid grid-cols-2 gap-2 mb-3">
                                     <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded-lg">
                                         <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                                            <Ruler className="w-3 h-3" /> Height
                                         </div>
                                         <div className="text-sm font-semibold text-slate-800 dark:text-white">{user?.height || '--'}</div>
                                     </div>
                                     <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded-lg">
                                         <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                                            <Activity className="w-3 h-3" /> Weight
                                         </div>
                                         <div className="text-sm font-semibold text-slate-800 dark:text-white">{user?.weight || '--'}</div>
                                     </div>
                                     <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded-lg">
                                         <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                                            <User className="w-3 h-3" /> Gender
                                         </div>
                                         <div className="text-sm font-semibold text-slate-800 dark:text-white">{user?.gender || '--'}</div>
                                     </div>
                                      <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded-lg">
                                         <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                                            <Activity className="w-3 h-3" /> Blood
                                         </div>
                                         <div className="text-sm font-semibold text-slate-800 dark:text-white">{user?.bloodType || '--'}</div>
                                     </div>
                                 </div>
                             )}

                             <div className="bg-red-50 dark:bg-red-900/10 p-2 rounded-lg flex items-start gap-2 border border-red-100 dark:border-red-900/20">
                                 <Smartphone className="w-4 h-4 text-red-500 mt-0.5" />
                                 <div>
                                     <p className="text-xs font-bold text-red-600 dark:text-red-400">Emergency Contact</p>
                                     <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{user?.emergencyContactName || 'Not Set'}</p>
                                     <p className="text-[10px] text-slate-500">{user?.emergencyContactPhone}</p>
                                 </div>
                             </div>
                         </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export const Layout: React.FC<LayoutProps> = ({ currentPage, onNavigate, children, userRole, onLogout, theme, onToggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900 flex transition-colors duration-300">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={onNavigate} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        userRole={userRole}
        onLogout={onLogout}
      />
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col lg:ml-64 min-w-0 transition-all duration-300">
        <Header onMenuClick={() => setSidebarOpen(true)} userRole={userRole} theme={theme} onToggleTheme={onToggleTheme} />
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden overflow-y-auto relative">
          <div className="max-w-7xl mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};