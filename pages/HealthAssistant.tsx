import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../components/Common';
import { Send, User, Bot, Sparkles, Loader2 } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';
import { Message } from '../types';

export const HealthAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hello Sarah, I am your HashCare Health Companion. How are you feeling today?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const responseText = await getChatResponse(input);
    
    const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat Area */}
      <Card className="lg:col-span-2 flex flex-col h-full border-0 shadow-lg bg-white dark:bg-slate-800">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800 z-10 rounded-t-2xl">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-md">
                  <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">HashCare Companion</h3>
                  <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Online & Ready</span>
                  </div>
              </div>
           </div>
           <button className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              <Sparkles className="w-5 h-5" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900/50 scroll-smooth">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'}`}>
                        {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className={`max-w-[80%] space-y-1`}>
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            msg.role === 'user' 
                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-600'
                        }`}>
                            {msg.content}
                        </div>
                        <span className={`text-[10px] text-slate-400 block ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            ))}
            {isTyping && (
                 <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div className="bg-white dark:bg-slate-700 p-4 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-600 shadow-sm">
                        <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />
                    </div>
                 </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 rounded-b-2xl">
            <div className="flex gap-3">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about your diet, vitals, or symptoms..." 
                    className="flex-1 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-white transition-all"
                />
                <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-xl px-4 py-3 transition-colors shadow-lg shadow-brand-500/20"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
      </Card>

      {/* Side Info Panel */}
      <div className="hidden lg:flex flex-col gap-6">
        <Card>
            <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                    <img src="https://picsum.photos/id/64/100/100" className="w-16 h-16 rounded-full border-4 border-white dark:border-slate-800 shadow-md" alt="Profile" />
                </div>
            </div>
            <div className="pt-10 pb-6 px-6 text-center">
                <h2 className="font-bold text-lg text-slate-800 dark:text-white">Sarah Jenkins</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Age: 45 • Blood: O+</p>
                <div className="mt-4 flex justify-center gap-2">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full">Diabetes T2</span>
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full">Hypertension</span>
                </div>
            </div>
        </Card>
        
        <Card className="flex-1">
            <div className="p-5 border-b border-slate-50 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-100">Quick Context</div>
            <div className="p-5 space-y-4 text-sm">
                <div>
                    <p className="text-xs text-slate-400 font-medium uppercase mb-1">Current Medications</p>
                    <ul className="space-y-2">
                        <li className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                            <span>Metformin</span>
                            <span className="text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 px-2 py-0.5 rounded">500mg</span>
                        </li>
                        <li className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                            <span>Lisinopril</span>
                            <span className="text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 px-2 py-0.5 rounded">10mg</span>
                        </li>
                    </ul>
                </div>
                <div>
                     <p className="text-xs text-slate-400 font-medium uppercase mb-1">Recent Vitals</p>
                     <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded-lg">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Glucose</p>
                            <p className="font-bold text-slate-800 dark:text-slate-100">96 mg/dL</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded-lg">
                            <p className="text-xs text-slate-500 dark:text-slate-400">BP</p>
                            <p className="font-bold text-slate-800 dark:text-slate-100">118/78</p>
                        </div>
                     </div>
                </div>
                <div>
                     <p className="text-xs text-slate-400 font-medium uppercase mb-1">Primary Doctor</p>
                     <p className="font-medium text-slate-800 dark:text-slate-100">Dr. A. Richards</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400">Cardiology • St. Mary's</p>
                </div>
            </div>
        </Card>
      </div>
    </div>
  );
};