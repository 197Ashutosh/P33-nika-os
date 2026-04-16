import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Target, CheckCircle, Activity, Users, UserCircle, 
  Briefcase, Lock, Send, Check, X, Sparkles, Download, BarChart2, 
  Calendar, AlertCircle, Settings, FileText, RefreshCw, Archive, Save, ChevronRight, Zap, TrendingUp, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE = 'https://nika-backend-xn5r.onrender.com/api';

const containerVar = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVar = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Home'); 
  const [goals, setGoals] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [sysConfig, setSysConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [gRes, fRes, cRes] = await Promise.all([
        axios.get(`${API_BASE}/goals`), axios.get(`${API_BASE}/feedback`), axios.get(`${API_BASE}/config`)
      ]);
      setGoals(gRes.data); setFeedback(fRes.data); setSysConfig(cRes.data);
    } catch (err) {
      console.error("Backend Connection Error.", err);
    } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (isLoading) return (
    <div className="min-h-screen bg-[#05050A] flex flex-col items-center justify-center text-fuchsia-400 font-mono tracking-widest relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-fuchsia-600/20 blur-[150px] rounded-full animate-pulse"></div>
      <div className="w-20 h-20 border-t-4 border-fuchsia-500 border-solid rounded-full animate-spin mb-6 relative z-10 shadow-[0_0_30px_rgba(217,70,239,0.5)]"></div>
      <p className="relative z-10 text-lg">IGNITING NIKA KERNEL...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05050A] text-gray-100 font-sans selection:bg-fuchsia-500 selection:text-white pb-20 relative overflow-x-hidden">
      
      {/* PRISMATIC AMBIENT LIGHTING (New Gen Graphics) */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-900/20 blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-900/20 blur-[150px] pointer-events-none"></div>
      <div className="fixed top-[30%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-fuchsia-900/10 blur-[120px] pointer-events-none"></div>

      <div className="pt-6 px-6 max-w-7xl mx-auto relative z-10">
        <nav className="bg-white/[0.02] border border-white/[0.05] backdrop-blur-3xl rounded-3xl px-8 h-24 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-5">
            <div className="bg-gradient-to-br from-teal-400 via-indigo-500 to-fuchsia-500 p-3 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              <Zap className="text-white" size={28} />
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-500 uppercase text-3xl drop-shadow-lg">
                N I K A
              </span>
              <span className="font-mono text-fuchsia-400 text-xs tracking-widest mt-1">ENTERPRISE OS // L2</span>
            </div>
          </div>
          <div className="flex bg-black/50 p-2 rounded-2xl border border-white/[0.03] backdrop-blur-md">
            {['Home', 'Employee', 'Manager', 'Admin'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl text-sm font-black tracking-wider transition-all duration-500 ${activeTab === tab ? 'bg-gradient-to-r from-teal-500 via-indigo-500 to-fuchsia-600 shadow-[0_0_25px_rgba(168,85,247,0.4)] text-white scale-105' : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'}`}>
                {tab === 'Home' ? 'COMMAND CENTER' : `${tab.toUpperCase()} NODE`}
              </button>
            ))}
          </div>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'Home' && <HomeOverview key="home" goals={goals} feedback={feedback} fetchDB={fetchData} />}
          {activeTab === 'Employee' && <EmployeeModule key="emp" goals={goals} fetchDB={fetchData} feedback={feedback} sysConfig={sysConfig} />}
          {activeTab === 'Manager' && <ManagerModule key="mgr" goals={goals} fetchDB={fetchData} feedback={feedback} />}
          {activeTab === 'Admin' && <AdminModule key="adm" goals={goals} feedback={feedback} sysConfig={sysConfig} fetchDB={fetchData} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ==========================================
// 1. HOME OVERVIEW 
// ==========================================
function HomeOverview({ goals, feedback, fetchDB }) {
  const activeGoalsCount = goals.filter(g => g.status === 'Active' || g.status === 'Completed').length;
  const flagCount = feedback ? ((feedback.is_flagged ? 1 : 0) + (feedback.is_soft_flag ? 1 : 0)) : 0;
  
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'Completed').length;
  const realGoalCompletionRate = totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100);
  const activeTrackers = totalGoals > 0 ? 1 : 0; 
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dynamicMonths = Array.from({length: 6}).map((_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i)); return monthNames[d.getMonth()];
  });

  const chartData = [
    { label: dynamicMonths[0], val: 0, isLive: false },
    { label: dynamicMonths[1], val: 0, isLive: false },
    { label: dynamicMonths[2], val: 0, isLive: false },
    { label: dynamicMonths[3], val: 0, isLive: false },
    { label: dynamicMonths[4], val: 0, isLive: false },
    { label: `${dynamicMonths[5]} (Live)`, val: realGoalCompletionRate, isLive: true }
  ];

  const resetDemo = async () => {
    if(!feedback) return;
    try {
      await axios.put(`${API_BASE}/feedback/${feedback.id}`, { 
        employee_submitted: false, employee_rating: '', manager_submitted: false, manager_rating: '', 
        manager_text: '', is_flagged: false, is_soft_flag: false, sentiment_label: 'UNSCANNED' 
      });
      await fetchDB();
      alert("Nika Database Reset. Ready for demonstration.");
    } catch(e) { alert("Backend synchronization failed."); }
  };

  const handleExportCSV = () => {
    if (goals.length === 0) return alert("No database records available to export!");
    const headers = ["Goal ID", "Title", "Completion %", "Weightage %", "Hierarchy", "Status", "Creation Date"];
    const csvRows = goals.map(g => `"${g.id}","${g.title}",${g.completion_percentage},${g.weight},"${g.hierarchy_level}","${g.status}","${g.created_at}"`);
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `NIKA_DB_Export_${dynamicMonths[5]}.csv`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  return (
    <motion.div variants={containerVar} initial="hidden" animate="show">
      <motion.header variants={itemVar} className="mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 className="text-6xl font-black tracking-tight text-white mb-4 drop-shadow-2xl">Operations<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-500">.Matrix</span></h1>
          <div className="flex items-center gap-3 text-fuchsia-300 font-mono text-xs bg-fuchsia-950/30 px-4 py-2 rounded-full border border-fuchsia-500/30 backdrop-blur-md w-fit">
            <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-ping"></div> Live PostgreSQL Synchronization Active
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={resetDemo} className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all backdrop-blur-md"><RefreshCw size={18} /> Cycle Reset</button>
          <button onClick={handleExportCSV} className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 hover:scale-105 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-[0_0_25px_rgba(192,38,211,0.4)] transition-all"><Download size={18} /> Export Intel</button>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { title: "Active DB Goals", val: activeGoalsCount, icon: Target, bg: "from-teal-500/20 to-teal-900/20", color: "text-teal-400", border: "border-teal-500/30" },
          { title: "Total Velocity", val: `${realGoalCompletionRate}%`, icon: TrendingUp, bg: "from-indigo-500/20 to-indigo-900/20", color: "text-indigo-400", border: "border-indigo-500/30" },
          { title: "Active Trackers", val: activeTrackers, icon: Activity, bg: "from-purple-500/20 to-purple-900/20", color: "text-purple-400", border: "border-purple-500/30" }
        ].map((card, i) => (
          <motion.div key={i} variants={itemVar} className={`bg-gradient-to-br ${card.bg} border ${card.border} p-8 rounded-[2rem] backdrop-blur-xl hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden group`}>
            <div className="absolute -right-6 -top-6 opacity-10 group-hover:scale-110 transition-transform duration-700"><card.icon size={120}/></div>
            <div className={`p-4 rounded-2xl bg-black/40 w-fit mb-6 shadow-xl ${card.color}`}><card.icon size={28}/></div>
            <p className="text-xs text-gray-400 uppercase tracking-[0.2em] font-black">{card.title}</p>
            <p className="text-5xl font-black mt-3 text-white drop-shadow-lg">{card.val}</p>
          </motion.div>
        ))}

        <motion.div variants={itemVar} className={`p-8 rounded-[2rem] backdrop-blur-xl transition-all duration-700 relative overflow-hidden group ${flagCount > 0 ? 'bg-gradient-to-br from-rose-600/20 to-rose-900/20 border border-rose-500/50 shadow-[0_0_50px_rgba(244,63,94,0.3)]' : 'bg-white/[0.02] border border-white/[0.05]'}`}>
          <div className="absolute -right-6 -top-6 opacity-5 group-hover:scale-110 transition-transform duration-700"><ShieldAlert size={120}/></div>
          {flagCount > 0 && <div className="absolute top-8 right-8 w-4 h-4 bg-rose-500 rounded-full animate-ping"></div>}
          <div className={`p-4 rounded-2xl bg-black/40 w-fit mb-6 shadow-xl ${flagCount > 0 ? "text-rose-400" : "text-gray-600"}`}><ShieldAlert size={28}/></div>
          <p className="text-xs text-gray-400 uppercase tracking-[0.2em] font-black">AI Flags Detected</p>
          <p className={`text-5xl font-black mt-3 drop-shadow-lg ${flagCount > 0 ? "text-rose-400" : "text-white"}`}>{flagCount}</p>
        </motion.div>
      </div>

      <motion.div variants={itemVar} className="bg-white/[0.02] border border-white/[0.05] p-10 rounded-[2rem] backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>
        <h2 className="text-2xl font-black mb-10 flex items-center gap-4 text-white relative z-10"><BarChart2 className="text-fuchsia-400" size={32}/> Organizational Output Trend</h2>
        <div className="h-72 flex justify-between px-4 pb-4 border-b border-white/10 items-end relative z-10">
          {chartData.map((data, i) => (
            <div key={i} className="flex flex-col justify-end items-center group w-full h-full relative">
              <div className="absolute -top-10 text-sm text-fuchsia-300 font-black opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-3 py-1 rounded-lg border border-fuchsia-500/30">{data.val}%</div>
              <div className={`w-12 md:w-24 rounded-t-2xl transition-all duration-1000 ease-out ${data.isLive ? 'bg-gradient-to-t from-fuchsia-600 via-indigo-500 to-teal-400 shadow-[0_0_30px_rgba(217,70,239,0.3)]' : 'bg-gradient-to-t from-gray-800/80 to-gray-700/50 border-t border-gray-600/50'}`} style={{ height: `${Math.max(data.val, 3)}%` }}></div>
              <span className={`mt-6 text-sm tracking-widest uppercase font-black ${data.isLive ? 'text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-fuchsia-400' : 'text-gray-600'}`}>{data.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==========================================
// 2. EMPLOYEE MODULE
// ==========================================
function EmployeeModule({ goals, fetchDB, feedback, sysConfig }) {
  const [title, setTitle] = useState('');
  const [weight, setWeight] = useState(0);
  const [hierarchy, setHierarchy] = useState('Individual');
  const [aiTip, setAiTip] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selfRating, setSelfRating] = useState('Meets Expectations');

  const activeWeight = goals.reduce((sum, g) => sum + (['Active', 'Pending Approval'].includes(g.status) ? Number(g.weight) : 0), 0) + Number(weight);
  const hasActiveGoals = goals.some(g => g.status === 'Active' || g.status === 'Completed');

  const handleSaveGoal = async (status) => {
    if (status === 'Pending Approval' && activeWeight !== 100) return alert("Total active weight must equal 100%.");
    setIsProcessing(true);
    await axios.post(`${API_BASE}/goals`, { title, weight: Number(weight), level: hierarchy, status });
    await fetchDB(); 
    if (status === 'Pending Approval') {
      try {
        const res = await axios.post(`${API_BASE}/ai/smart-goal`, { title });
        setAiTip(`NIKA AI: ${res.data.suggestion}`);
      } catch (e) { setAiTip("Cloud AI Offline."); }
    }
    setTitle(''); setWeight(0); setIsProcessing(false);
  };

  const updateGoalStatus = async (id, status) => { await axios.put(`${API_BASE}/goals/${id}/status`, { status }); await fetchDB(); };
  const updateGoalProgress = async (id, currentProgress) => { 
    const newProgress = Math.min(100, currentProgress + 25);
    await axios.put(`${API_BASE}/goals/${id}/status`, { completion_percentage: newProgress, status: newProgress === 100 ? 'Completed' : 'Active' }); 
    await fetchDB(); 
  };
  const deleteGoal = async (id) => { await axios.delete(`${API_BASE}/goals/${id}`); await fetchDB(); };
  const submitSelfReview = async () => { await axios.put(`${API_BASE}/feedback/${feedback.id}`, { employee_submitted: true, employee_rating: selfRating }); await fetchDB(); };

  return (
    <motion.div variants={containerVar} initial="hidden" animate="show">
      <header className="mb-12"><h1 className="text-5xl font-black text-white flex items-center gap-5 drop-shadow-xl"><UserCircle className="text-teal-400" size={48}/> Personal Node</h1></header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <motion.div variants={itemVar} className="lg:col-span-2 bg-white/[0.02] border border-white/[0.05] p-10 rounded-[2.5rem] backdrop-blur-2xl">
          <h2 className="text-2xl font-black mb-8 text-white flex items-center gap-4"><Award className="text-fuchsia-400" size={28}/> Objective Definition Engine</h2>
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-fuchsia-500 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-500"></div>
              <select value={hierarchy} onChange={(e)=>setHierarchy(e.target.value)} className="relative w-full p-5 bg-black/60 border border-white/10 rounded-2xl text-gray-200 outline-none appearance-none cursor-pointer font-bold tracking-wide">
                <option value="Company">Global Company Cascade</option><option value="Team">Team Objective Segment</option><option value="Individual">Individual Performance Node</option>
              </select>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-fuchsia-500 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-500"></div>
              <input value={title} onChange={(e)=>setTitle(e.target.value)} className="relative w-full p-5 bg-black/60 border border-white/10 rounded-2xl text-white outline-none placeholder-gray-500 font-medium" placeholder="Declare your strategic objective..." />
            </div>
            
            <div className="relative group">
               <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-fuchsia-500 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-500"></div>
               <input type="number" value={weight} onChange={(e)=>setWeight(e.target.value)} className="relative w-full p-5 bg-black/60 border border-white/10 rounded-2xl text-white outline-none placeholder-gray-500 font-medium" placeholder="Weightage Allocation (0-100%)" />
            </div>
            
            <div className={`p-5 rounded-2xl text-sm font-black tracking-wider border flex items-center justify-between ${activeWeight === 100 ? 'bg-teal-950/30 text-teal-400 border-teal-500/40 shadow-[0_0_20px_rgba(20,184,166,0.2)]' : 'bg-rose-950/30 text-rose-400 border-rose-500/40'}`}>
                <span>DB ALLOCATION RADAR</span>
                <span>{activeWeight}% {activeWeight !== 100 && "(SEALED UNTIL 100%)"}</span>
            </div>

            <div className="flex gap-5 pt-4">
              <button onClick={() => handleSaveGoal('Draft')} disabled={title === '' || isProcessing} className="flex-1 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black tracking-widest uppercase transition-all backdrop-blur-md"><Save size={20} className="inline mr-3"/> Save To Drafts</button>
              <button onClick={() => handleSaveGoal('Pending Approval')} disabled={activeWeight !== 100 || title === '' || isProcessing} className={`flex-1 py-5 rounded-2xl font-black tracking-widest uppercase transition-all ${activeWeight === 100 && title !== '' ? 'bg-gradient-to-r from-teal-500 via-indigo-500 to-fuchsia-600 hover:scale-105 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)]' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}>
                {isProcessing ? <Activity className="animate-spin mx-auto" size={24}/> : <><Send size={20} className="inline mr-3"/> Deploy Objective</>}
              </button>
            </div>
            {aiTip && <div className="p-6 bg-gradient-to-r from-indigo-900/40 to-fuchsia-900/40 border border-fuchsia-500/30 rounded-2xl text-fuchsia-200 text-sm leading-relaxed shadow-[0_0_20px_rgba(217,70,239,0.15)]"><Sparkles size={20} className="inline mr-3 text-fuchsia-400"/>{aiTip}</div>}
          </div>

          <div className="mt-16">
            <h3 className="text-sm font-black text-gray-500 mb-6 uppercase tracking-[0.3em] flex items-center gap-3"><Activity size={18}/> Active Database Synapse</h3>
            <div className="space-y-4">
              {goals.length === 0 && <p className="text-gray-600 text-sm italic p-6 bg-black/40 rounded-2xl border border-white/5 text-center">Data structure is empty.</p>}
              {goals.map(g => (
                <div key={g.id} className="p-6 bg-black/50 border border-white/[0.08] rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-6 hover:border-fuchsia-500/30 transition-colors group">
                  <div className="flex-1">
                    <span className={`font-black text-xl tracking-wide ${g.status === 'Archived' ? 'text-gray-600 line-through' : 'text-gray-100 group-hover:text-fuchsia-100 transition-colors'}`}>{g.title}</span>
                    <div className="flex items-center gap-4 mt-3 mb-4">
                      <span className="text-xs text-fuchsia-300 font-bold tracking-widest uppercase bg-fuchsia-950/40 px-3 py-1.5 rounded-lg border border-fuchsia-500/30">{g.hierarchy_level}</span>
                      <span className="text-xs text-teal-400 font-bold font-mono bg-teal-950/40 px-3 py-1.5 rounded-lg border border-teal-500/30">WT: {g.weight}%</span>
                    </div>
                    {['Active', 'Completed'].includes(g.status) && (
                      <div className="w-full flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="flex-1 bg-black rounded-full h-3 overflow-hidden border border-white/10"><div className={`h-full transition-all duration-1000 ${g.status === 'Completed' ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500' : 'bg-gradient-to-r from-teal-500 to-emerald-400'}`} style={{width: `${g.completion_percentage}%`}}></div></div>
                        <span className="text-xs font-black font-mono text-gray-300 w-10">{g.completion_percentage}%</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 bg-black/50 p-2 rounded-xl border border-white/5">
                    <span className={`text-xs px-4 py-2 font-black uppercase tracking-widest rounded-lg border ${g.status === 'Completed' ? 'bg-fuchsia-900/30 text-fuchsia-400 border-fuchsia-500/30' : g.status === 'Active' ? 'bg-teal-900/30 text-teal-400 border-teal-500/30' : 'bg-gray-800 text-gray-400 border-gray-600'}`}>{g.status}</span>
                    {g.status === 'Draft' && <button onClick={() => updateGoalStatus(g.id, 'Pending Approval')} className="p-3 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-lg transition-all"><Send size={18}/></button>}
                    {g.status === 'Active' && <button onClick={() => updateGoalProgress(g.id, g.completion_percentage)} className="p-3 bg-teal-500/20 text-teal-400 hover:bg-teal-500 hover:text-white rounded-lg transition-all shadow-[0_0_10px_rgba(20,184,166,0.2)]" title="Log Progress (+25%)"><TrendingUp size={18}/></button>}
                    {(g.status === 'Completed' || g.status === 'Rejected') && <button onClick={() => updateGoalStatus(g.id, 'Archived')} className="p-3 bg-gray-500/20 text-gray-400 hover:bg-gray-500 hover:text-white rounded-lg transition-all"><Archive size={18}/></button>}
                    <button onClick={() => deleteGoal(g.id)} className="p-3 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition-all"><X size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="space-y-10">
          <motion.div variants={itemVar} className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2.5rem] backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-[50px] rounded-full"></div>
            <h2 className="text-lg font-black mb-8 text-white uppercase tracking-[0.2em] flex items-center gap-3"><Calendar size={20} className="text-teal-400"/> Chronology</h2>
            <div className="relative border-l-2 border-white/10 ml-5 space-y-10 pb-4">
              <div className="relative pl-10">
                <div className={`absolute w-5 h-5 rounded-full -left-[11px] top-0 border-4 border-[#05050A] ${goals.length > 0 ? 'bg-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.8)]' : 'bg-gray-700'}`}></div>
                <p className={`text-sm font-black tracking-wide ${goals.length > 0 ? 'text-white' : 'text-gray-500'}`}>Day 30 Anchor</p>
                <p className="text-xs text-gray-400 mt-2 font-mono bg-black/40 px-3 py-1 rounded-md w-fit border border-white/5">Checkpoint Secured</p>
              </div>
              <div className="relative pl-10">
                <div className={`absolute w-5 h-5 rounded-full -left-[11px] top-0 border-4 border-[#05050A] ${goals.length > 0 ? 'bg-fuchsia-500 animate-pulse shadow-[0_0_20px_rgba(217,70,239,0.8)]' : 'bg-gray-700'}`}></div>
                <p className={`text-sm font-black tracking-wide ${goals.length > 0 ? 'text-fuchsia-300' : 'text-gray-500'}`}>Day 60 Review</p>
                <p className="text-xs text-fuchsia-400/70 mt-2 font-mono bg-fuchsia-950/30 px-3 py-1 rounded-md w-fit border border-fuchsia-500/20">Current Active Cycle</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVar} className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2.5rem] backdrop-blur-2xl">
            <h2 className="text-lg font-black mb-8 text-white uppercase tracking-[0.2em] flex items-center gap-3"><Lock size={20} className="text-indigo-400"/> Action Protocols</h2>
            {!sysConfig?.is_configured ? (
               <div className="p-6 bg-orange-950/30 border border-orange-500/40 rounded-2xl text-center shadow-[0_0_30px_rgba(249,115,22,0.15)]"><AlertCircle className="mx-auto text-orange-400 mb-4 animate-bounce" size={32} /><p className="text-sm text-orange-300 font-black tracking-widest uppercase">System Awaiting Config</p></div>
            ) : !hasActiveGoals ? (
              <div className="p-6 bg-rose-950/30 border border-rose-500/40 rounded-2xl text-center shadow-[0_0_30px_rgba(244,63,94,0.15)]"><Lock className="mx-auto text-rose-400 mb-4" size={32} /><p className="text-sm text-rose-300 font-black tracking-widest uppercase">Access Denied: 0 Goals</p></div>
            ) : feedback?.employee_submitted ? (
              <div className="p-6 bg-teal-950/30 border border-teal-500/40 rounded-2xl text-center shadow-[0_0_30px_rgba(20,184,166,0.15)]"><CheckCircle className="mx-auto text-teal-400 mb-4" size={32} /><p className="text-sm text-teal-300 font-black tracking-widest uppercase mb-3">Protocol Executed</p><div className="inline-block bg-black/50 px-4 py-2 rounded-xl border border-teal-500/30 text-xs font-mono text-teal-100">Rating: {feedback.employee_rating}</div></div>
            ) : (
              <div className="space-y-5">
                <div className="relative group">
                   <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-500"></div>
                   <select value={selfRating} onChange={(e)=>setSelfRating(e.target.value)} className="relative w-full p-5 bg-black/60 border border-white/10 rounded-2xl text-white outline-none cursor-pointer font-bold tracking-wide appearance-none">
                     <option value="Below Expectations">Rating: Below Expectations</option><option value="Meets Expectations">Rating: Meets Expectations</option><option value="Above Expectations">Rating: Above Expectations</option>
                   </select>
                </div>
                <button onClick={submitSelfReview} className="w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:scale-105 transition-transform text-white py-5 rounded-2xl text-sm font-black tracking-widest uppercase shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center justify-center gap-3">Submit Evaluation <ChevronRight size={20}/></button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 3. MANAGER MODULE
// ==========================================
function ManagerModule({ goals, fetchDB, feedback }) {
  const [managerText, setManagerText] = useState('');
  const [managerRating, setManagerRating] = useState('Meets Expectations');
  const [isEditing, setIsEditing] = useState(false);
  const [playerCoachMode, setPlayerCoachMode] = useState('team');
  const [isProcessing, setIsProcessing] = useState(false);

  const updateGoalStatus = async (id, status) => { await axios.put(`${API_BASE}/goals/${id}/status`, { status }); await fetchDB(); };

  const handleManagerReview = async () => {
    setIsProcessing(true);
    if(!managerText) {
      await axios.put(`${API_BASE}/feedback/${feedback.id}`, { manager_submitted: true, manager_rating: managerRating, manager_text: 'BLANK', is_soft_flag: true, is_flagged: false, sentiment_label: 'BLANK' });
    } else {
      try {
        const res = await axios.post(`${API_BASE}/ai/sentiment`, { comment: managerText });
        await axios.put(`${API_BASE}/feedback/${feedback.id}`, { manager_submitted: true, manager_rating: managerRating, manager_text: managerText, is_flagged: res.data.is_flagged, is_soft_flag: false, sentiment_label: res.data.sentiment });
      } catch (e) {
        const isToxic = managerText.toLowerCase().includes("worst") || managerText.toLowerCase().includes("hate") || managerText.toLowerCase().includes("terrible");
        const fallbackSentiment = isToxic ? "NEGATIVE" : "POSITIVE";
        await axios.put(`${API_BASE}/feedback/${feedback.id}`, { manager_submitted: true, manager_rating: managerRating, manager_text: managerText, is_flagged: isToxic, is_soft_flag: false, sentiment_label: fallbackSentiment });
      }
    }
    setIsEditing(false); setIsProcessing(false); await fetchDB();
  };

  return (
    <motion.div variants={containerVar} initial="hidden" animate="show">
      <header className="mb-12 flex flex-col md:flex-row justify-between md:items-center gap-6">
        <h1 className="text-5xl font-black text-white flex items-center gap-5 drop-shadow-xl"><Users className="text-indigo-400" size={48}/> Leadership Node</h1>
        <div className="flex bg-black/60 border border-white/10 rounded-2xl p-2 w-fit shadow-2xl backdrop-blur-md">
           <button onClick={()=>setPlayerCoachMode('team')} className={`px-6 py-3 text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all ${playerCoachMode === 'team' ? 'bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-105' : 'text-gray-400 hover:text-white'}`}>Team Matrix</button>
           <button onClick={()=>setPlayerCoachMode('self')} className={`px-6 py-3 text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all ${playerCoachMode === 'self' ? 'bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-105' : 'text-gray-400 hover:text-white'}`}>My Metrics</button>
        </div>
      </header>

      {playerCoachMode === 'self' ? (
        <motion.div variants={itemVar} className="p-20 border-2 border-dashed border-indigo-500/30 rounded-[3rem] text-center bg-indigo-950/10 backdrop-blur-sm"><Activity className="mx-auto text-indigo-500/50 mb-6 animate-pulse" size={48}/><p className="text-indigo-300 tracking-[0.3em] uppercase text-sm font-black">Context Switched to Individual Node</p></motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div variants={itemVar} className="bg-white/[0.02] border border-white/[0.05] p-10 rounded-[2.5rem] backdrop-blur-2xl">
            <h2 className="text-2xl font-black mb-8 text-white flex items-center gap-4"><Settings className="text-teal-400" size={28}/> Database Approval Ledger</h2>
            {goals.filter(g => g.status === 'Pending Approval').length === 0 && <p className="text-gray-500 italic p-6 bg-black/40 rounded-2xl text-center border border-white/5">Ledger is clear. No actions required.</p>}
            {goals.filter(g => g.status === 'Pending Approval').map(g => (
                <div key={g.id} className="p-8 bg-gradient-to-br from-indigo-900/20 to-black/60 border border-indigo-500/30 rounded-3xl mb-6 hover:border-indigo-400/60 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-all group">
                  <p className="font-black text-2xl text-white tracking-wide">{g.title}</p>
                  <div className="flex items-center gap-3 mt-4">
                     <p className="text-xs text-fuchsia-300 font-bold tracking-widest uppercase bg-fuchsia-950/40 px-3 py-1 rounded-lg border border-fuchsia-500/30">{g.hierarchy_level}</p>
                     <p className="text-xs text-indigo-300 font-mono bg-indigo-950/40 px-3 py-1 rounded-lg border border-indigo-500/30">Weight: {g.weight}%</p>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button onClick={() => updateGoalStatus(g.id, 'Active')} className="flex-1 py-4 bg-teal-500/10 hover:bg-teal-500 hover:scale-105 text-teal-400 hover:text-white border border-teal-500/30 rounded-xl text-sm font-black tracking-widest uppercase flex justify-center items-center transition-all shadow-[0_0_15px_rgba(20,184,166,0.1)]"><Check size={20} className="mr-2"/> Authorize</button>
                    <button onClick={() => updateGoalStatus(g.id, 'Rejected')} className="flex-1 py-4 bg-rose-500/10 hover:bg-rose-500 hover:scale-105 text-rose-400 hover:text-white border border-rose-500/30 rounded-xl text-sm font-black tracking-widest uppercase flex justify-center items-center transition-all shadow-[0_0_15px_rgba(244,63,94,0.1)]"><X size={20} className="mr-2"/> Reject</button>
                  </div>
                </div>
            ))}
          </motion.div>

          <motion.div variants={itemVar} className="bg-white/[0.02] border border-white/[0.05] p-10 rounded-[2.5rem] backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-fuchsia-500/10 blur-[60px] rounded-full pointer-events-none"></div>
            <h2 className="text-2xl font-black mb-8 text-white flex items-center gap-4 relative z-10"><FileText className="text-fuchsia-400" size={28}/> Evaluation Matrix</h2>
            
            {feedback?.manager_submitted && !isEditing ? (
              <div className="text-center p-10 bg-gradient-to-b from-teal-900/20 to-black/60 rounded-3xl border border-teal-500/30 relative z-10 shadow-[0_0_40px_rgba(20,184,166,0.1)]">
                <CheckCircle className="mx-auto text-teal-400 mb-4" size={48}/>
                <p className="text-teal-300 font-black tracking-widest uppercase text-lg mb-4">Evaluation Secured</p>
                <div className="inline-block bg-black/50 px-5 py-3 rounded-xl border border-teal-500/20 text-sm font-mono text-teal-100 mb-8">Rating: {feedback.manager_rating}</div><br/>
                <button onClick={() => setIsEditing(true)} className="text-sm font-black tracking-widest uppercase text-gray-400 hover:text-white transition-colors border-b-2 border-gray-600 hover:border-white pb-1">Unlock for Testing</button>
              </div>
            ) : (
              <div className="space-y-6 relative z-10">
                <div className="relative group">
                   <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-500 to-indigo-500 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-500"></div>
                   <select value={managerRating} onChange={(e)=>setManagerRating(e.target.value)} className="relative w-full p-5 bg-black/60 border border-white/10 rounded-2xl text-white outline-none cursor-pointer font-bold tracking-wide appearance-none">
                     <option value="Below Expectations">Final Rating: Below Expectations</option><option value="Meets Expectations">Final Rating: Meets Expectations</option><option value="Above Expectations">Final Rating: Above Expectations</option>
                   </select>
                </div>
                <div className="relative group">
                   <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-500 to-indigo-500 rounded-3xl blur opacity-20 group-focus-within:opacity-50 transition duration-500"></div>
                   <textarea value={managerText} onChange={(e)=>setManagerText(e.target.value)} className="relative w-full p-6 bg-black/60 border border-white/10 rounded-3xl text-white h-48 outline-none placeholder-gray-500 transition-colors resize-none text-base font-medium leading-relaxed" placeholder="Input analytical text here... NIKA AI will parse sentiment and generate data nodes upon submission."></textarea>
                </div>
                <div className="flex gap-4 pt-2">
                  {isEditing && <button onClick={() => setIsEditing(false)} className="bg-white/5 hover:bg-white/10 text-white font-black tracking-widest uppercase py-5 px-8 rounded-2xl transition-colors border border-white/10 backdrop-blur-md">Abort</button>}
                  <button onClick={handleManagerReview} disabled={isProcessing} className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:scale-105 text-white font-black tracking-widest uppercase py-5 flex-1 rounded-2xl transition-all shadow-[0_0_30px_rgba(217,70,239,0.4)]">
                    {isProcessing ? <Activity className="animate-spin mx-auto" size={24}/> : "Execute Assessment"}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-10 p-6 bg-black/60 border border-white/10 rounded-2xl flex items-start gap-5 relative z-10 backdrop-blur-md">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5"><Lock className="text-gray-400" size={24}/></div>
              <div>
                <p className="text-sm font-black text-gray-200 tracking-[0.2em] uppercase">Cryptographic Seal</p>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed font-medium">{feedback?.employee_submitted && feedback?.manager_submitted ? "Conditions met. Dual-party visibility matrix enabled." : "Information sealed. Awaiting dual confirmation protocol."}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

// ==========================================
// 4. ADMIN MODULE
// ==========================================
function AdminModule({ goals, feedback, sysConfig, fetchDB }) {
  const pendingGoals = goals.filter(g => g.status === 'Pending Approval');
  const toggleConfig = async () => { await axios.put(`${API_BASE}/config`, { is_configured: !sysConfig?.is_configured }); await fetchDB(); };
  const resolveGoalException = async (id) => { await axios.put(`${API_BASE}/goals/${id}/status`, { status: 'Active' }); await fetchDB(); };

  return (
    <motion.div variants={containerVar} initial="hidden" animate="show">
      <header className="mb-12"><h1 className="text-5xl font-black text-white flex items-center gap-5 drop-shadow-xl"><Briefcase className="text-fuchsia-400" size={48}/> Operations Command</h1></header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <motion.div variants={itemVar} className="bg-white/[0.02] border border-white/[0.05] p-10 rounded-[2.5rem] backdrop-blur-2xl">
           <h2 className="text-2xl font-black mb-8 flex items-center gap-4 text-white"><ShieldAlert className="text-teal-400" size={32}/> NIKA Sentiment Radar</h2>
           
           {feedback?.manager_submitted ? (
             feedback?.sentiment_label === 'NEGATIVE' || feedback?.is_flagged ? (
               <div className="p-10 bg-gradient-to-br from-rose-950/50 to-black/80 border border-rose-500/50 rounded-3xl mt-6 relative overflow-hidden shadow-[0_0_50px_rgba(244,63,94,0.2)] hover:shadow-[0_0_70px_rgba(244,63,94,0.3)] transition-shadow">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/20 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none"></div>
                 <span className="bg-rose-500/20 text-rose-400 border border-rose-500/50 text-xs font-black px-4 py-2 rounded-xl tracking-widest uppercase animate-pulse flex items-center gap-2 w-fit"><ShieldAlert size={14}/> Critical Flag</span>
                 <p className="text-4xl font-black text-white mt-8 mb-4 drop-shadow-lg">Toxicity Detected</p>
                 <div className="bg-[#05050A]/80 p-6 rounded-2xl border border-rose-500/30 mt-6 relative z-10 backdrop-blur-md">
                   <p className="text-base text-gray-300 font-mono leading-relaxed tracking-wide">"{feedback.manager_text}"</p>
                 </div>
               </div>
             ) : feedback?.is_soft_flag || feedback?.sentiment_label === 'BLANK' ? (
               <div className="p-10 bg-gradient-to-br from-orange-950/50 to-black/80 border border-orange-500/50 rounded-3xl mt-6 shadow-[0_0_40px_rgba(249,115,22,0.15)]">
                 <span className="bg-orange-500/20 text-orange-400 border border-orange-500/50 text-xs font-black px-4 py-2 rounded-xl tracking-widest uppercase flex items-center gap-2 w-fit"><AlertCircle size={14}/> Soft Flag Anomaly</span>
                 <p className="text-3xl font-black text-white mt-8 drop-shadow-lg">Null Response Logged</p>
               </div>
             ) : feedback?.sentiment_label === 'POSITIVE' ? (
               <div className="p-10 bg-gradient-to-br from-teal-950/50 to-black/80 border border-teal-500/50 rounded-3xl mt-6 relative overflow-hidden shadow-[0_0_50px_rgba(20,184,166,0.15)]">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/20 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none"></div>
                 <span className="bg-teal-500/20 text-teal-400 border border-teal-500/50 text-xs font-black px-4 py-2 rounded-xl tracking-widest uppercase flex items-center gap-2 w-fit"><CheckCircle size={14}/> Validated Positive</span>
                 <p className="text-4xl font-black text-white mt-8 mb-4 drop-shadow-lg">Optimal Flow State</p>
                 <div className="bg-[#05050A]/80 p-6 rounded-2xl border border-teal-500/30 mt-6 relative z-10 backdrop-blur-md">
                   <p className="text-base text-gray-300 font-mono leading-relaxed tracking-wide">"{feedback.manager_text}"</p>
                 </div>
               </div>
             ) : (
               <div className="p-10 bg-gradient-to-br from-indigo-950/50 to-black/80 border border-indigo-500/50 rounded-3xl mt-6 shadow-[0_0_40px_rgba(99,102,241,0.15)]">
                 <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 text-xs font-black px-4 py-2 rounded-xl tracking-widest uppercase flex items-center gap-2 w-fit"><Activity size={14}/> Validated Neutral</span>
                 <p className="text-3xl font-black text-white mt-8 mb-4 drop-shadow-lg">Standard Data Output</p>
                 <div className="bg-[#05050A]/80 p-6 rounded-2xl border border-indigo-500/30 mt-6 backdrop-blur-md">
                   <p className="text-base text-gray-300 font-mono leading-relaxed tracking-wide">"{feedback.manager_text}"</p>
                 </div>
               </div>
             )
           ) : (
             <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/10 rounded-3xl mt-8 bg-black/40 backdrop-blur-sm">
                <div className="p-5 bg-white/5 rounded-full mb-6 border border-white/5"><Activity className="text-teal-500 animate-spin" size={36}/></div>
                <p className="text-gray-400 font-black text-sm tracking-[0.3em] uppercase">Awaiting DB Ingestion...</p>
             </div>
           )}
        </motion.div>

        <div className="space-y-10">
          <motion.div variants={itemVar} className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2.5rem] backdrop-blur-2xl">
            <h2 className="text-lg font-black mb-6 text-white uppercase tracking-[0.2em] flex items-center gap-4"><Settings size={24} className="text-gray-400"/> Core Infrastructure</h2>
            <div className="p-8 bg-black/60 border border-white/10 rounded-3xl shadow-xl">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <span className={`text-sm font-black tracking-[0.2em] uppercase flex items-center gap-2 ${sysConfig?.is_configured ? 'text-teal-400' : 'text-rose-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${sysConfig?.is_configured ? 'bg-teal-400 animate-pulse' : 'bg-rose-400'}`}></div>
                      {sysConfig?.is_configured ? 'System Online (L2)' : 'Offline: Config Required'}
                    </span>
                    <p className="text-sm text-gray-500 mt-3 font-medium">Dictates global access to review modules.</p>
                  </div>
                  <button onClick={toggleConfig} className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-black tracking-widest uppercase text-white transition-all backdrop-blur-md">Toggle State</button>
               </div>
            </div>
          </motion.div>

          <motion.div variants={itemVar} className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2.5rem] backdrop-blur-2xl">
            <h2 className="text-lg font-black mb-6 text-white uppercase tracking-[0.2em] flex items-center gap-4"><FileText size={24} className="text-gray-400"/> Real-Time Anomaly Queue</h2>
            
            {pendingGoals.length === 0 ? (
              <div className="p-10 bg-black/40 border border-white/10 rounded-3xl text-center shadow-inner">
                 <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-500/20"><CheckCircle className="text-teal-400" size={32}/></div>
                 <p className="text-sm text-teal-400 font-black tracking-[0.2em] uppercase">Zero Anomalies Detected</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingGoals.map(pg => (
                  <div key={pg.id} className="p-6 bg-gradient-to-r from-orange-950/30 to-black/60 border border-orange-500/30 rounded-2xl shadow-lg">
                     <p className="font-black text-orange-400 text-sm flex items-center gap-3 uppercase tracking-wider"><AlertCircle size={18}/> Bottleneck: Approval</p>
                     <p className="text-sm text-gray-300 mb-5 mt-3 font-medium leading-relaxed">Goal <span className="text-white font-bold">"{pg.title}"</span> is pending manager action. Escalation required.</p>
                     <button onClick={() => resolveGoalException(pg.id)} className="w-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 px-5 py-4 rounded-xl text-xs font-black tracking-widest uppercase border border-orange-500/30 transition-all">Force Approval (Override)</button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <motion.div variants={itemVar} className="bg-white/[0.02] border border-white/[0.05] p-10 rounded-[2.5rem] backdrop-blur-2xl mt-10 max-w-7xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[30%] h-[100%] bg-indigo-500/5 pointer-events-none"></div>
        <h2 className="text-xl font-black mb-8 text-white uppercase tracking-[0.2em] flex items-center gap-4 relative z-10"><Target size={28} className="text-fuchsia-400"/> Corporate Objective Matrix</h2>
        <div className="space-y-4 relative z-10">
          {goals.filter(g => g.hierarchy_level === 'Company').length === 0 ? (
            <p className="text-gray-500 text-sm font-medium p-8 bg-black/40 rounded-2xl border border-white/5 text-center">No Global Company objectives established in DB.</p>
          ) : (
            goals.filter(g => g.hierarchy_level === 'Company').map(g => (
              <div key={g.id} className="p-8 bg-black/60 border border-white/10 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-6 hover:border-fuchsia-500/30 transition-colors group">
                <div>
                  <span className="font-black text-2xl text-white tracking-wide group-hover:text-fuchsia-100 transition-colors">{g.title}</span>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-fuchsia-300 font-black tracking-widest uppercase bg-fuchsia-950/40 px-3 py-1.5 rounded-lg border border-fuchsia-500/30">GLOBAL PRIORITY</span>
                    <span className="text-xs text-gray-400 font-black font-mono tracking-wider">{g.status} | WT: {g.weight}%</span>
                  </div>
                </div>
                <div className="w-full md:w-64 bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between text-xs font-black text-gray-400 mb-3 tracking-widest uppercase"><span>Execution</span><span className="text-white">{g.completion_percentage}%</span></div>
                  <div className="w-full bg-black rounded-full h-3 border border-white/10 overflow-hidden"><div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-full rounded-full transition-all duration-1000" style={{width: `${g.completion_percentage}%`}}></div></div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}