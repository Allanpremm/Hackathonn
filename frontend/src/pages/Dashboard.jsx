import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Sparkles, Plus, Loader2, BookOpen, Calendar as CalIcon, 
  CheckSquare, CheckCircle, TrendingUp, AlertTriangle, 
  MessageCircle, Zap, Bell, Trash2, Edit, ShieldAlert,
  Clock, Smartphone, RefreshCw, User
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tip, setTip] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Add task form state
  const [formData, setFormData] = useState({
    title: '',
    subject: 'OS',
    deadline: '',
    priority: 'medium',
    reminder_24h: true,
    reminder_1h: true,
    add_to_calendar: true
  });

  const studentName = localStorage.getItem('student_name') || 'Allan Developer';
  const studentId = localStorage.getItem('student_id') || '11111111-2222-3333-4444-555555555555';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [tasksRes, tipRes, logsRes] = await Promise.all([
        api.get(`/tasks/${studentId}`),
        api.get('/ai/tip'),
        api.get(`/logs/${studentId}`)
      ]);
      setTasks(tasksRes.data);
      setTip(tipRes.data.tip);
      setLogs(logsRes.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (taskId) => {
    try {
      const res = await api.patch(`/tasks/${taskId}/status`);
      setTasks(tasks.map(t => t.id === taskId ? res.data : t));
      toast.success('Task status updated');
    } catch (e) {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(t => t.id !== taskId));
      toast.success('Task deleted');
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post('/tasks', { ...formData, student_id: studentId });
      setTasks(prev => [...prev, res.data].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)));
      setShowAddModal(false);
      setFormData({
        title: '',
        subject: 'OS',
        deadline: '',
        priority: 'medium',
        reminder_24h: true,
        reminder_1h: true,
        add_to_calendar: true
      });
      toast.success('Task created successfully!');
      // Refresh logs because task creation triggers webhook
      const logsRes = await api.get(`/logs/${studentId}`);
      setLogs(logsRes.data);
    } catch (err) {
      toast.error('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compute stats
  const totalSubjects = 4; // OS, DBMS, CN, AI
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'done');
  
  const productivityScore = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 85; // Default score

  // Days remaining helper
  const getDaysRemaining = (deadline) => {
    const diffTime = new Date(deadline) - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 0) {
      return { text: `Overdue by ${Math.abs(Math.floor(diffHours / 24))}d`, color: 'text-red-400 bg-red-500/10' };
    }
    if (diffHours <= 24) {
      return { text: `Due in ${diffHours}h`, color: 'text-orange-400 bg-orange-500/10 font-bold' };
    }
    return { text: `${diffDays} days left`, color: 'text-accent-secondary bg-accent-secondary/10' };
  };

  // Priority styling helper
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'medium': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    }
  };

  // Mock timeline events for Section 2
  const timelineEvents = [
    { time: '09:00 AM - 10:30 AM', title: 'Database Management Systems (DBMS)', type: 'class', color: 'border-blue-500' },
    { time: '11:00 AM - 12:30 PM', title: 'Computer Networks Lecture (CN)', type: 'class', color: 'border-blue-500' },
    { time: '02:00 PM - 03:30 PM', title: 'Operating Systems (OS) Lab', type: 'class', color: 'border-blue-500' },
    { time: '05:00 PM - 06:30 PM', title: 'AI Exam Prep Group Session', type: 'study', color: 'border-green-500' }
  ];

  if (loading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-accent-primary" size={40} />
        <p className="text-text-muted text-sm animate-pulse">Loading personalized dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-24 relative">
      {/* GREETING BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
      >
        <div>
          <p className="text-text-muted text-sm font-medium mb-1">{format(new Date(), 'EEEE, MMMM do yyyy')}</p>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white">Welcome back, {studentName} 👋</h1>
        </div>
        <div className="flex gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-elevated border border-border-subtle text-xs">
            <span className="w-2 h-2 rounded-full bg-accent-primary shadow-[0_0_8px_rgba(108,99,255,0.8)]"></span>
            <span className="text-text-primary font-medium">B.Tech CSE • Year 1</span>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="p-1.5 rounded-xl bg-bg-elevated border border-border-subtle text-text-muted hover:text-white transition-colors"
            title="Refresh Dashboard"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </motion.div>

      {/* SECTION 1: STATISTICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Subjects', value: totalSubjects, icon: BookOpen, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
          { label: 'Upcoming Deadlines', value: pendingTasks.length, icon: Clock, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
          { label: 'Completed Tasks', value: completedTasks.length, icon: CheckCircle, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
          { label: 'Productivity Score', value: `${productivityScore}%`, icon: TrendingUp, color: 'text-accent-primary bg-accent-primary/10 border-accent-primary/20' }
        ].map((card, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={i} 
            className={`card-glass p-5 rounded-2xl border flex items-center justify-between ${card.color}`}
          >
            <div>
              <span className="text-xs text-text-muted font-medium uppercase tracking-wider block mb-1">{card.label}</span>
              <span className="text-2xl md:text-3xl font-extrabold text-white">{card.value}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 text-current">
              <card.icon size={22} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* SECTION 2: TIMELINE + AI ASSISTANT CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Schedule Timeline */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="card-glass p-6 rounded-2xl h-full">
            <h3 className="font-display font-bold text-lg text-white mb-6 flex items-center gap-2">
              <CalIcon className="text-accent-primary" size={20} />
              Today's Schedule Timeline
            </h3>
            
            <div className="relative border-l border-border-subtle ml-3 pl-6 flex flex-col gap-6">
              {timelineEvents.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline Dot */}
                  <span className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-bg-surface border-2 border-accent-primary shadow-[0_0_10px_rgba(108,99,255,0.4)] group-hover:scale-125 transition-transform"></span>
                  <div>
                    <span className="text-xs font-mono text-text-muted block mb-0.5">{item.time}</span>
                    <h4 className="text-sm font-semibold text-white group-hover:text-accent-primary transition-colors">{item.title}</h4>
                    <span className="inline-block text-[10px] uppercase font-bold text-accent-secondary mt-1 bg-accent-secondary/10 px-2 py-0.5 rounded-md">
                      {item.type}
                    </span>
                  </div>
                </div>
              ))}
              
              {/* Overdue Tasks due today */}
              {tasks.filter(t => {
                const today = new Date().toDateString();
                return new Date(t.deadline).toDateString() === today && t.status === 'pending';
              }).map((task) => (
                <div key={task.id} className="relative group">
                  <span className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-bg-surface border-2 border-orange-500 shadow-[0_0_10px_rgba(255,107,53,0.4)] animate-ping"></span>
                  <span className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-bg-surface border-2 border-orange-500"></span>
                  <div>
                    <span className="text-xs font-mono text-orange-400 block mb-0.5">ASSIGNMENT DUE TODAY</span>
                    <h4 className="text-sm font-semibold text-white">{task.title} ({task.subject})</h4>
                    <span className="inline-block text-[10px] uppercase font-bold text-red-400 mt-1 bg-red-500/10 px-2 py-0.5 rounded-md">
                      Task Deadline
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: AI Productivity Assistant Card */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="card-glass border-accent-gold/20 p-6 rounded-2xl h-full relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            
            <div>
              <div className="flex items-center gap-2 pb-4 border-b border-border-subtle mb-4">
                <div className="w-9 h-9 rounded-xl bg-accent-gold/20 flex items-center justify-center text-accent-gold shadow-[0_0_15px_rgba(245,200,66,0.3)] shrink-0">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">AI Productivity Assistant</h3>
                  <p className="text-[10px] text-accent-gold font-semibold uppercase tracking-wider">Copilot Dashboard</p>
                </div>
              </div>

              {/* Suggestions */}
              <div className="flex flex-col gap-4">
                <div>
                  <span className="text-xs text-text-muted font-bold block uppercase tracking-wide mb-1.5">Daily Suggestion</span>
                  <p className="text-sm text-text-primary/95 leading-relaxed bg-bg-elevated/40 p-3 rounded-xl border border-border-subtle">
                    {tip || "Review OS Processes scheduling. Allocate at least 90 minutes to sketch flow diagrams today."}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-text-muted font-bold block uppercase tracking-wide mb-1.5">Priority Recommendation</span>
                  <div className="flex items-start gap-2.5 bg-accent-primary/5 border border-accent-primary/20 p-3 rounded-xl">
                    <CheckSquare className="text-accent-primary mt-0.5 shrink-0" size={16} />
                    <p className="text-xs text-text-primary leading-normal">
                      Focus on <strong className="text-white">DBMS B-Tree</strong>. It has a high priority weighting and is due within 24 hours.
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-text-muted font-bold block uppercase tracking-wide mb-1.5">Upcoming Risk Alert</span>
                  <div className="flex items-start gap-2.5 bg-red-500/5 border border-red-500/20 p-3 rounded-xl">
                    <ShieldAlert className="text-red-400 mt-0.5 shrink-0" size={16} />
                    <p className="text-xs text-text-primary leading-normal">
                      Your attendance in <strong className="text-white">Computer Networks</strong> is <strong className="text-red-400">65%</strong>. Attend the next 3 classes to cross 75% threshold.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: UPCOMING DEADLINES */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="text-accent-primary" size={20} />
            Upcoming Deadlines ({pendingTasks.length})
          </h2>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="text-xs text-accent-primary hover:underline font-semibold flex items-center gap-1"
          >
            <Plus size={14} /> Add new task
          </button>
        </div>

        {pendingTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingTasks.map((task) => {
              const daysInfo = getDaysRemaining(task.deadline);
              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={task.id} 
                  className="card-glass p-5 rounded-2xl flex flex-col justify-between gap-4 border-border-subtle group hover:border-accent-primary/30 transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-md bg-accent-primary/10 text-accent-primary border border-accent-primary/20 uppercase tracking-widest">
                      {task.subject}
                    </span>
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${daysInfo.color}`}>
                      {daysInfo.text}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-white text-base leading-tight mb-2 group-hover:text-accent-primary transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-xs text-text-muted font-mono flex items-center gap-1">
                      <Clock size={12} />
                      Due: {format(new Date(task.deadline), "EEE MMM dd, hh:mm a")}
                    </p>
                  </div>

                  {/* Automation Status Tags */}
                  <div className="flex gap-2">
                    {task.reminder_24h && (
                      <span className="flex items-center gap-1 text-[9px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/15" title="WhatsApp reminder enabled">
                        <Smartphone size={10} /> WA Sync
                      </span>
                    )}
                    {task.add_to_calendar && (
                      <span className="flex items-center gap-1 text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/15" title="Synced with Google Calendar">
                        <CalIcon size={10} /> Cal Sync
                      </span>
                    )}
                    <span className={`ml-auto text-[9px] uppercase font-bold px-2 py-0.5 rounded ${getPriorityBadge(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between border-t border-border-subtle/50 pt-3 mt-1">
                    <button 
                      onClick={() => handleStatusToggle(task.id)}
                      className="text-xs text-accent-secondary hover:underline flex items-center gap-1 font-semibold"
                    >
                      <CheckCircle size={12} /> Complete
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(task.id)}
                      className="p-1 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="card-glass p-8 rounded-2xl text-center border-dashed border-border-subtle/60">
            <CheckSquare size={36} className="mx-auto text-text-muted mb-2 opacity-50" />
            <p className="text-text-muted text-sm font-medium">All caught up! No upcoming deadlines found. 🎉</p>
          </div>
        )}
      </div>

      {/* SECTION 4: RECENT ACTIVITY FEED */}
      <div>
        <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Bell className="text-accent-primary" size={20} />
          Recent Activity Feed
        </h2>
        
        <div className="card-glass rounded-2xl overflow-hidden divide-y divide-border-subtle">
          {logs.length > 0 ? (
            logs.slice(0, 5).map((log) => {
              const dateText = format(new Date(log.triggered_at), 'MMM dd • hh:mm a');
              return (
                <div key={log.id} className="p-4 flex items-center justify-between hover:bg-bg-elevated/20 transition-all duration-150">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-accent-secondary/10 text-accent-secondary flex items-center justify-center border border-accent-secondary/15 shrink-0">
                      {log.workflow_name.includes('Reminder') ? <Smartphone size={16} /> :
                       log.workflow_name.includes('Broadcast') ? <Zap size={16} /> : <CalIcon size={16} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{log.workflow_name}</h4>
                      <p className="text-xs text-text-muted font-mono mt-0.5">Payload: {JSON.stringify(log.payload)}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[10px] text-text-muted font-mono">{dateText}</span>
                    <span className="flex items-center gap-1 text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20 font-semibold uppercase">
                      Success
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-text-muted text-sm font-medium">No automation logs captured yet.</div>
          )}
        </div>
      </div>

      {/* FLOATING ACTION BUTTON */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-accent-primary rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(108,99,255,0.4)] hover:shadow-[0_0_30px_rgba(108,99,255,0.6)] hover:scale-105 transition-all duration-200 active:scale-95 z-40"
        title="Add Task"
      >
        <Plus size={28} />
      </button>

      {/* ADD TASK MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/80 backdrop-blur-sm">
            <div className="fixed inset-0" onClick={() => setShowAddModal(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card-glass w-full max-w-lg p-6 rounded-2xl relative border border-border-subtle bg-bg-surface z-10"
            >
              <button 
                onClick={() => setShowAddModal(false)} 
                className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors"
              >
                ✕
              </button>
              
              <h3 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
                <CheckSquare size={20} className="text-accent-primary" /> Create New Academic Task
              </h3>
              
              <form onSubmit={handleAddTask} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">Task Name / Description</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. B-Tree Implementation in C++"
                    className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-primary text-sm transition-colors"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">Subject</label>
                    <select 
                      className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-primary text-sm appearance-none"
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                    >
                      <option value="OS">OS</option>
                      <option value="DBMS">DBMS</option>
                      <option value="CN">CN</option>
                      <option value="AI">AI</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">Priority</label>
                    <select 
                      className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-primary text-sm appearance-none"
                      value={formData.priority}
                      onChange={e => setFormData({...formData, priority: e.target.value})}
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">Deadline</label>
                  <input 
                    required 
                    type="datetime-local" 
                    className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-primary text-sm transition-colors [color-scheme:dark]"
                    value={formData.deadline}
                    onChange={e => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>

                {/* Automation Toggles */}
                <div className="border-t border-border-subtle pt-4 mt-2 flex flex-col gap-3">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Trigger Automations</span>
                  
                  <label className="flex items-center justify-between p-3 rounded-xl bg-bg-primary border border-border-subtle cursor-pointer hover:border-accent-secondary/55 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-secondary/20 flex items-center justify-center text-accent-secondary"><Smartphone size={16} /></div>
                      <div>
                        <span className="text-xs font-bold text-white block">WhatsApp Reminders</span>
                        <span className="text-[10px] text-text-muted block">Remind me 24h & 1h before via WhatsApp</span>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-accent-secondary cursor-pointer"
                      checked={formData.reminder_24h}
                      onChange={e => setFormData({...formData, reminder_24h: e.target.checked, reminder_1h: e.target.checked})}
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-bg-primary border border-border-subtle cursor-pointer hover:border-accent-primary/55 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary"><CalIcon size={16} /></div>
                      <div>
                        <span className="text-xs font-bold text-white block">Google Calendar Sync</span>
                        <span className="text-[10px] text-text-muted block">Sync this event blocker to Google Calendar</span>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-accent-primary cursor-pointer"
                      checked={formData.add_to_calendar}
                      onChange={e => setFormData({...formData, add_to_calendar: e.target.checked})}
                    />
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="btn-primary mt-4 py-3 w-full flex justify-center items-center gap-2 font-semibold"
                >
                  {isSubmitting ? (
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                  ) : (
                    <>
                      <Plus size={18} /> Create Task & Automate
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
