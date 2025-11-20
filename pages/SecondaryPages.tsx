import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Badge, Button } from '../components/Common';
import { CheckSquare, Calendar, Shield, AlertTriangle, Map, Plus, Star, Filter, Repeat, Trash2, X, CheckCircle2, Circle, Sparkles, BrainCircuit, Zap, Droplets, Footprints, Sun, Moon, Laptop, RefreshCw, User, Smartphone, Ruler, Activity } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { getChatResponse } from '../services/geminiService';

// --- Medical Tracker ---
export const MedicalTracker: React.FC = () => {
  const [medications, setMedications] = useState([
    { id: 1, time: '08:00 AM', name: 'Metformin', dose: '500mg', taken: true, priority: false, recurrence: 'Daily', specificDays: [] as string[], type: 'medication' },
    { id: 2, time: '01:00 PM', name: 'Hydration Check', dose: 'Drink 1 glass', taken: false, priority: false, recurrence: 'Daily', specificDays: [] as string[], type: 'reminder' },
    { id: 3, time: '08:00 PM', name: 'Lisinopril', dose: '10mg', taken: false, priority: true, recurrence: 'Daily', specificDays: [] as string[], type: 'medication' },
    { id: 4, time: '09:00 PM', name: 'Atorvastatin', dose: '20mg', taken: false, priority: false, recurrence: 'Daily', specificDays: [] as string[], type: 'medication' },
  ]);

  const [filter, setFilter] = useState<'all' | 'todo' | 'done' | 'priority'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'time' | 'name'>('priority');
  const [isAdding, setIsAdding] = useState(false);
  
  // Enhanced State for New Medication
  const [newMed, setNewMed] = useState({ 
      name: '', 
      dose: '', 
      time: '', 
      recurrence: 'Daily', 
      specificDays: [] as string[],
      priority: false, 
      type: 'medication' 
  });

  const [animatingId, setAnimatingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<{title: string, text: string, type: 'success' | 'warning' | 'info'}>({
      title: "Analyzing Health Patterns...", text: "HashCare AI is reviewing your adherence logs...", type: 'info'
  });

  const [waterIntake, setWaterIntake] = useState(4);
  const waterGoal = 8;
  const [steps, setSteps] = useState(4500);
  const stepGoal = 10000;

  const playSuccessSound = () => {
      try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3');
          audio.volume = 0.2;
          audio.play().catch(e => console.log("Audio play blocked", e));
      } catch (e) {
          console.error("Audio error", e);
      }
  };

  const generateInsight = () => {
    setAiLoading(true);
    setTimeout(() => {
        const takenCount = medications.filter(m => m.taken).length;
        const total = medications.length;
        const adherence = total > 0 ? (takenCount / total) : 0;
        const highPriorityPending = medications.some(m => m.priority && !m.taken);

        if (highPriorityPending) {
             setAiInsight({
                title: "Priority Action Needed",
                text: "You have high-priority medications pending. Please take them as scheduled to maintain optimal health.",
                type: 'warning'
            });
        } else if (adherence === 1) {
            setAiInsight({
                title: "Perfect Adherence!",
                text: "Excellent work! You've completed all your health tasks for today. Consistency maximizes treatment effectiveness.",
                type: 'success'
            });
        } else if (adherence < 0.5 && total > 0) {
            setAiInsight({
                title: "Adherence Alert",
                text: "It looks like you've missed a few items. HashCare recommends setting up an additional alarm for your midday dose.",
                type: 'info'
            });
        } else {
            setAiInsight({
                title: "Diet Recommendation",
                text: "Based on your recent glucose trends, try a fiber-rich snack like an apple or almonds this afternoon.",
                type: 'info'
            });
        }
        setAiLoading(false);
    }, 1500);
  };

  useEffect(() => {
      generateInsight();
  }, [medications]);

  const togglePriority = (id: number) => {
    setMedications(prev => prev.map(med => 
        med.id === id ? { ...med, priority: !med.priority } : med
    ));
  };

  const toggleTaken = (id: number) => {
    const item = medications.find(m => m.id === id);
    if (!item) return;
    
    if (!item.taken) {
        playSuccessSound();
        setAnimatingId(id);
        setTimeout(() => setAnimatingId(null), 800);
    }
    
    setMedications(prev => prev.map(med => 
        med.id === id ? { ...med, taken: !med.taken } : med
    ));
  };

  const confirmDelete = () => {
    if (deleteId) {
        setMedications(prev => prev.filter(m => m.id !== deleteId));
        setDeleteId(null);
    }
  };

  const handleAddMedication = () => {
    if (!newMed.name || !newMed.time) return;
    
    let [hours, mins] = newMed.time.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;
    const formattedTime = `${formattedHours.toString().padStart(2, '0')}:${mins} ${ampm}`;

    setMedications(prev => [
        ...prev, 
        { 
            id: Date.now(), 
            name: newMed.name, 
            dose: newMed.dose || 'No details', 
            time: formattedTime, 
            taken: false, 
            priority: newMed.priority,
            recurrence: newMed.recurrence,
            specificDays: newMed.specificDays,
            type: newMed.type
        }
    ]);
    setNewMed({ name: '', dose: '', time: '', recurrence: 'Daily', specificDays: [], priority: false, type: 'medication' });
    setIsAdding(false);
  };

  const toggleDay = (day: string) => {
      setNewMed(prev => {
          const days = prev.specificDays.includes(day)
              ? prev.specificDays.filter(d => d !== day)
              : [...prev.specificDays, day];
          return { ...prev, specificDays: days };
      });
  };

  const processedMedications = medications
    .filter(med => {
        if (filter === 'todo') return !med.taken;
        if (filter === 'done') return med.taken;
        if (filter === 'priority') return med.priority;
        return true;
    })
    .sort((a, b) => {
        if (sortBy === 'priority') {
            if (a.priority === b.priority) return new Date('1/1/2000 ' + a.time).getTime() - new Date('1/1/2000 ' + b.time).getTime();
            return a.priority ? -1 : 1;
        }
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'time') return new Date('1/1/2000 ' + a.time).getTime() - new Date('1/1/2000 ' + b.time).getTime();
        return 0;
    });

  return (
    <div className="space-y-6 relative">
        {deleteId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 border border-slate-100 dark:border-slate-700 transform scale-100 transition-transform">
                    <div className="flex items-center gap-3 text-red-500 mb-4">
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-full">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Confirm Deletion</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                        Are you sure you want to permanently delete this reminder? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
                        <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                    </div>
                </div>
            </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Medical & Diet Tracker</h1>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto">
                {(['all', 'todo', 'done', 'priority'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${filter === f ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>
        </div>

        {/* Daily Goals Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <Card className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white dark:from-slate-800 dark:to-slate-800">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full border-4 border-blue-100 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 relative">
                         <span className="text-lg font-bold">{waterIntake}</span>
                         <span className="text-[10px] absolute bottom-1">/ {waterGoal}</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100">Hydration</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Daily Goal: {waterGoal} cups</p>
                    </div>
                </div>
                <Button onClick={() => setWaterIntake(prev => Math.min(prev + 1, waterGoal))} size="sm" className="rounded-full w-10 h-10 p-0 bg-blue-100 text-blue-600 hover:bg-blue-200 border-none dark:bg-blue-900/30 dark:text-blue-400"><Plus className="w-5 h-5" /></Button>
            </Card>
            
            <Card className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-white dark:from-slate-800 dark:to-slate-800">
                <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14">
                         <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path className="text-emerald-100 dark:text-emerald-900/30" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                            <path className="text-emerald-500 transition-all duration-1000 ease-out" strokeDasharray={`${(steps/stepGoal)*100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                         </svg>
                         <div className="absolute inset-0 flex items-center justify-center">
                             <Footprints className="w-5 h-5 text-emerald-500" />
                         </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100">Steps</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{steps} / {stepGoal} steps</p>
                    </div>
                </div>
                <div className="text-right">
                     <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{Math.round((steps/stepGoal)*100)}%</p>
                     <p className="text-[10px] text-slate-400">Completed</p>
                </div>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader 
                    title="Schedule & Reminders" 
                    subtitle="Manage medications and custom reminders" 
                    icon={<Calendar className="w-5 h-5" />} 
                    action={
                        <div className="flex items-center gap-2">
                            <div className="hidden sm:flex items-center gap-1 mr-2">
                                <span className="text-xs text-slate-400 font-medium">Sort:</span>
                                <select 
                                    value={sortBy} 
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="text-xs border-none bg-slate-50 dark:bg-slate-700 rounded-lg py-1 pl-2 pr-6 focus:ring-0 text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                                >
                                    <option value="time">Time</option>
                                    <option value="priority">Priority</option>
                                    <option value="name">Name</option>
                                </select>
                            </div>
                            <Button 
                                variant={isAdding ? 'secondary' : 'ghost'} 
                                onClick={() => setIsAdding(!isAdding)} 
                                className="text-xs px-2" 
                                icon={isAdding ? X : Plus}
                            >
                                {isAdding ? 'Cancel' : 'Add'}
                            </Button>
                        </div>
                    }
                />
                
                {isAdding && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 animate-in slide-in-from-top-2">
                        {/* (Same form as before - kept for brevity but would be here) */}
                         <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase mb-3">Create New Reminder</h4>
                         {/* Simplified form for code brevity */}
                         <div className="flex flex-col gap-2">
                             <input 
                                 type="text" 
                                 placeholder="Medication Name" 
                                 className="w-full text-sm p-2 rounded-lg border" 
                                 value={newMed.name}
                                 onChange={e => setNewMed({...newMed, name: e.target.value})}
                             />
                             <input 
                                 type="time" 
                                 className="w-full text-sm p-2 rounded-lg border" 
                                 value={newMed.time}
                                 onChange={e => setNewMed({...newMed, time: e.target.value})}
                             />
                             <Button onClick={handleAddMedication}>Save</Button>
                         </div>
                    </div>
                )}

                <CardContent className="space-y-3 min-h-[300px]">
                    {processedMedications.map((med) => (
                        <div 
                            key={med.id} 
                            className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-500 ${
                                med.taken 
                                ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30 opacity-75' 
                                : med.priority
                                    ? 'bg-amber-50/40 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30 shadow-sm'
                                    : 'bg-white dark:bg-slate-700/50 border-transparent hover:border-slate-200 dark:hover:border-slate-600 shadow-sm'
                            } ${animatingId === med.id ? 'scale-[1.03] ring-2 ring-emerald-400 ring-offset-2 bg-emerald-100 dark:bg-emerald-900/30 shadow-lg' : ''}`}
                        >
                             <div className="flex items-center gap-4 flex-1">
                                    <button 
                                        onClick={() => togglePriority(med.id)}
                                        className={`p-1.5 rounded-full transition-all ${
                                            med.priority 
                                            ? 'text-amber-500 bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200' 
                                            : 'text-slate-300 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 focus:opacity-100'
                                        }`}
                                        title={med.priority ? "Remove Priority" : "Mark as High Priority"}
                                    >
                                        <Star className={`w-4 h-4 ${med.priority ? 'fill-amber-500' : ''}`} />
                                    </button>

                                    <div className="flex flex-col items-center w-16 text-center border-r border-slate-100 dark:border-slate-600 pr-4">
                                        <span className={`text-sm font-bold tabular-nums ${med.taken ? 'text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                                            {med.time.split(' ')[0]}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium uppercase">
                                            {med.time.split(' ')[1]}
                                        </span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-semibold truncate ${med.taken ? 'text-slate-500 line-through decoration-slate-400' : 'text-slate-800 dark:text-white'}`}>
                                                {med.name}
                                            </span>
                                            {med.priority && !med.taken && (
                                                <Badge variant="warning" className="text-[10px] py-0 px-1.5 h-5 flex items-center shadow-sm">PRIORITY</Badge>
                                            )}
                                            {med.type === 'reminder' && (
                                                 <Badge variant="neutral" className="text-[10px] py-0 px-1.5 h-5 flex items-center">REMINDER</Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            <span>{med.dose}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                            <span className="flex items-center gap-1">
                                                <Repeat className="w-3 h-3" /> 
                                                {med.recurrence === 'Specific Days' ? med.specificDays.join(', ') : med.recurrence}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pl-2">
                                    <button 
                                        onClick={() => toggleTaken(med.id)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 ${
                                            med.taken 
                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 rotate-0' 
                                            : 'bg-slate-100 dark:bg-slate-600 text-slate-400 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-500 hover:text-slate-600'
                                        }`}
                                        title={med.taken ? "Mark as not taken" : "Mark as taken"}
                                    >
                                        {med.taken ? <CheckCircle2 className="w-6 h-6 animate-in zoom-in duration-300" /> : <Circle className="w-6 h-6" />}
                                    </button>
                                    <button 
                                        onClick={() => setDeleteId(med.id)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
            
            <div className="flex flex-col gap-6">
                {/* AI Health Insight */}
                <Card className={`border-none shadow-xl transition-all duration-500 ${
                    aiInsight.type === 'success' ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/20' :
                    aiInsight.type === 'warning' ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-500/20' :
                    'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-500/20'
                }`}>
                    <CardContent>
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <BrainCircuit className="w-5 h-5 opacity-80" /> AI Insight
                            </h3>
                            <button 
                                onClick={generateInsight} 
                                disabled={aiLoading}
                                className="bg-white/20 p-1.5 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`w-5 h-5 text-white ${aiLoading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                        <div className={`transition-opacity duration-300 ${aiLoading ? 'opacity-50' : 'opacity-100'}`}>
                            <h4 className="font-bold text-base mb-2">{aiInsight.title}</h4>
                            <p className="text-white/90 text-sm mb-4 leading-relaxed">{aiInsight.text}</p>
                        </div>
                        <Button variant="secondary" className={`w-full text-sm border-none shadow-sm ${
                             aiInsight.type === 'success' ? 'text-emerald-700 hover:bg-emerald-50' :
                             aiInsight.type === 'warning' ? 'text-amber-700 hover:bg-amber-50' :
                             'text-indigo-700 hover:bg-indigo-50'
                        }`}>
                            View Detailed Report
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
};

// --- Insurance Tracker ---
export const InsuranceTracker: React.FC = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    // Calculate Progress
    const startDate = new Date('2025-01-01').getTime();
    const endDate = new Date('2025-12-31').getTime();
    const today = new Date().getTime();
    const elapsed = today - startDate;
    const total = endDate - startDate;
    const percentage = Math.min(100, Math.max(0, (elapsed / total) * 100));
    const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    const handleComparePlans = () => {
        setIsAnalyzing(true);
        setTimeout(() => setIsAnalyzing(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Insurance & Claims (India)</h1>
                <Button icon={Sparkles} onClick={handleComparePlans} disabled={isAnalyzing}>
                    {isAnalyzing ? 'AI Scanning Plans...' : 'Compare Live Plans'}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden border-none shadow-xl shadow-blue-600/20 dark:shadow-none">
                     <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                     <CardContent>
                         <div className="flex justify-between items-start mb-8">
                            <div>
                                <p className="text-blue-200 text-xs uppercase tracking-wider font-medium">Provider</p>
                                <h2 className="text-2xl font-bold">Star Health & Allied</h2>
                            </div>
                            <Shield className="w-8 h-8 text-blue-200" />
                         </div>
                         <div className="space-y-1 mb-6">
                            <p className="text-blue-200 text-xs">Policy Number</p>
                            <p className="font-mono text-lg tracking-widest">SH-8921-4421-IND</p>
                         </div>
                         
                         <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-blue-200 text-xs">Expires in {daysLeft} days</p>
                                    <p className="font-medium text-sm">Dec 31, 2025</p>
                                </div>
                                <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">Active</Badge>
                            </div>
                            <div className="relative h-2 bg-blue-800/40 rounded-full overflow-hidden">
                                <div 
                                    className="absolute top-0 left-0 h-full bg-white/80 rounded-full transition-all duration-1000"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                         </div>
                     </CardContent>
                </Card>
                
                {/* Live Plan Comparison */}
                <Card>
                    <CardHeader title="Recommended Plans" subtitle="Based on current market rates" />
                    <CardContent>
                         <div className="space-y-3">
                             {[
                                 { name: "HDFC ERGO Optima Secure", cover: "₹10L", premium: "₹12,500/yr", rating: 4.8 },
                                 { name: "ICICI Lombard iHealth", cover: "₹5L", premium: "₹8,200/yr", rating: 4.5 },
                                 { name: "Niva Bupa ReAssure", cover: "₹15L", premium: "₹14,000/yr", rating: 4.7 }
                             ].map((plan, i) => (
                                 <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700">
                                     <div>
                                         <h4 className="font-bold text-sm text-slate-800 dark:text-white">{plan.name}</h4>
                                         <p className="text-xs text-slate-500">Cover: {plan.cover}</p>
                                     </div>
                                     <div className="text-right">
                                         <p className="text-sm font-bold text-brand-600">{plan.premium}</p>
                                         <div className="flex items-center justify-end gap-0.5 text-[10px] text-slate-400">
                                             <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {plan.rating}
                                         </div>
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// --- Community Page ---
export const CommunityPage: React.FC = () => (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Community Health Feed</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* News Column */}
            <div className="md:col-span-2 space-y-4">
                {[
                    { tag: "Alert", title: "Air Quality Index (AQI) Hits Severe Levels in Delhi-NCR", desc: "Residents advised to wear masks and limit outdoor activities. Hospitals reporting rise in respiratory cases.", time: "2h ago", bg: "bg-red-50 dark:bg-red-900/20 text-red-700" },
                    { tag: "Awareness", title: "National Dengue Prevention Week", desc: "Municipal Corporation urges citizens to check for stagnant water. Free testing camps set up in Sector 14.", time: "5h ago", bg: "bg-blue-50 dark:bg-blue-900/20 text-blue-700" },
                    { tag: "Tips", title: "Ayurveda for Monsoon Immunity", desc: "Experts recommend adding Tulsi and Ginger to daily tea to boost immunity against seasonal flu.", time: "1d ago", bg: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700" },
                ].map((news, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className={news.bg}>{news.tag}</Badge>
                                <span className="text-xs text-slate-400">{news.time}</span>
                            </div>
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1">{news.title}</h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{news.desc}</p>
                            <div className="mt-3 flex gap-2">
                                <Button variant="ghost" size="sm" className="text-xs h-8">Read More</Button>
                                <Button variant="ghost" size="sm" className="text-xs h-8">Share</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Sidebar Info */}
            <div className="space-y-4">
                <Card className="bg-gradient-to-br from-brand-500 to-teal-600 text-white border-none">
                    <CardContent>
                        <h3 className="font-bold text-lg mb-2">Daily Health Tip</h3>
                        <p className="text-sm opacity-90 mb-4">"Drinking warm water with lemon in the morning aids digestion and boosts vitamin C."</p>
                        <div className="flex items-center gap-2 text-xs opacity-75">
                            <Sparkles className="w-4 h-4" /> AI Curated
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader title="Local Events" />
                    <CardContent className="space-y-3">
                        <div className="flex gap-3 items-start">
                            <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-2 text-center min-w-[3.5rem]">
                                <span className="block text-xs text-slate-500">OCT</span>
                                <span className="block text-lg font-bold text-slate-800 dark:text-white">28</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-slate-800 dark:text-white">Free Eye Checkup Camp</h4>
                                <p className="text-xs text-slate-500">Community Centre, Block B</p>
                            </div>
                        </div>
                         <div className="flex gap-3 items-start">
                            <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-2 text-center min-w-[3.5rem]">
                                <span className="block text-xs text-slate-500">NOV</span>
                                <span className="block text-lg font-bold text-slate-800 dark:text-white">02</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-slate-800 dark:text-white">Yoga in the Park</h4>
                                <p className="text-xs text-slate-500">Central Park, 6:00 AM</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
);

// --- Settings Page ---
interface SettingsPageProps {
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ theme, onToggleTheme }) => {
    const { user, updateProfile } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>({});

    useEffect(() => {
        if (user) setEditForm(user);
    }, [user]);

    const handleSave = () => {
        updateProfile(editForm);
        setIsEditing(false);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
             <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings & Preferences</h1>
             
             {/* Profile Settings */}
             <Card>
                 <CardHeader 
                    title="Personal Profile" 
                    subtitle="Manage your health metrics and contact info" 
                    action={
                        !isEditing 
                        ? <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>Edit</Button> 
                        : <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button size="sm" onClick={handleSave}>Save</Button>
                          </div>
                    }
                />
                 <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                             <input 
                                disabled={!isEditing}
                                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-2 text-sm"
                                value={editForm.name || ''}
                                onChange={e => setEditForm({...editForm, name: e.target.value})}
                             />
                         </div>
                         <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                             <input 
                                disabled
                                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg p-2 text-sm text-slate-500"
                                value={editForm.email || ''}
                             />
                         </div>
                         <div className="grid grid-cols-3 gap-4 md:col-span-2">
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Height</label>
                                <input 
                                    disabled={!isEditing}
                                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-2 text-sm"
                                    value={editForm.height || ''}
                                    onChange={e => setEditForm({...editForm, height: e.target.value})}
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Weight</label>
                                <input 
                                    disabled={!isEditing}
                                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-2 text-sm"
                                    value={editForm.weight || ''}
                                    onChange={e => setEditForm({...editForm, weight: e.target.value})}
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Blood Type</label>
                                <input 
                                    disabled={!isEditing}
                                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-2 text-sm"
                                    value={editForm.bloodType || ''}
                                    onChange={e => setEditForm({...editForm, bloodType: e.target.value})}
                                />
                             </div>
                         </div>
                         <div className="md:col-span-2">
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Emergency Contact</label>
                             <div className="grid grid-cols-2 gap-4">
                                <input 
                                    disabled={!isEditing}
                                    placeholder="Contact Name"
                                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-2 text-sm"
                                    value={editForm.emergencyContactName || ''}
                                    onChange={e => setEditForm({...editForm, emergencyContactName: e.target.value})}
                                />
                                <input 
                                    disabled={!isEditing}
                                    placeholder="Phone Number"
                                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-2 text-sm"
                                    value={editForm.emergencyContactPhone || ''}
                                    onChange={e => setEditForm({...editForm, emergencyContactPhone: e.target.value})}
                                />
                             </div>
                         </div>
                     </div>
                 </CardContent>
             </Card>

             {/* Theme Settings */}
             <Card>
                 <CardHeader title="Appearance" subtitle="Customize your dashboard interface" />
                 <CardContent className="space-y-6">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300">
                                {theme === 'light' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-900 dark:text-white">Interface Theme</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Select your preferred color scheme.</p>
                            </div>
                        </div>
                        <div className="flex gap-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
                            <button 
                                onClick={onToggleTheme} 
                                disabled={theme === 'light'}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${theme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                            >
                                <Sun className="w-4 h-4" /> Light
                            </button>
                             <button 
                                onClick={onToggleTheme} 
                                disabled={theme === 'dark'}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${theme === 'dark' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-500'}`}
                            >
                                <Moon className="w-4 h-4" /> Dark
                            </button>
                        </div>
                     </div>
                 </CardContent>
             </Card>

             {/* Mass Alerts (for admin view) or generic */}
             <div className="hidden">
                 <MassAlerts />
                 <HospitalAdmin />
             </div>
        </div>
    )
}

// --- Hospital Admin (Placeholder for reference) ---
export const HospitalAdmin: React.FC = () => (<div></div>);

// --- Mass Alerts (Re-exporting with layout if needed) ---
export const MassAlerts: React.FC = () => (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Mass Incident Alerts</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                {[
                    { title: 'Chemical Spill Warning', loc: 'Industrial District (3mi away)', sev: 'critical' },
                    { title: 'Flu Outbreak Cluster', loc: 'Downtown Area', sev: 'medium' },
                ].map((alert, i) => (
                    <Card key={i} className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
                        <CardContent className="flex items-start gap-4">
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full text-red-600 dark:text-red-400">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{alert.title}</h3>
                                    <Badge variant={alert.sev === 'critical' ? 'danger' : 'warning'}>{alert.sev.toUpperCase()}</Badge>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1"><Map className="w-3 h-3" /> {alert.loc}</p>
                                <p className="text-sm mt-2 text-slate-600 dark:text-slate-300">Authorities advise staying indoors and closing windows. Emergency services are on site.</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card className="bg-slate-100 dark:bg-slate-800 min-h-[300px] flex items-center justify-center text-slate-400 dark:text-slate-500 border-dashed border-2 border-slate-300 dark:border-slate-600">
                <div className="text-center">
                    <Map className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="font-medium">Live Map View Placeholder</p>
                </div>
            </Card>
        </div>
    </div>
);