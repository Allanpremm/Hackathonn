import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle2, XCircle, Clock, Loader2, RefreshCw, Smartphone, Calendar, Sparkles, Server } from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Automations() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const studentId = localStorage.getItem('student_id') || '11111111-2222-3333-4444-555555555555';

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      if (studentId) {
        const res = await api.get(`/logs/${studentId}`);
        setLogs(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': 
        return (
          <span className="flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/25 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
            <CheckCircle2 size={10} /> Success
          </span>
        );
      case 'failed': 
        return (
          <span className="flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/25 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
            <XCircle size={10} /> Failed
          </span>
        );
      default: 
        return (
          <span className="flex items-center gap-1 bg-orange-500/10 text-orange-400 border border-orange-500/25 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
            <Clock size={10} /> Pending
          </span>
        );
    }
  };

  // Enterprise Status Card Config
  const statusCards = [
    { name: 'WhatsApp Service', icon: Smartphone, status: 'Active', color: 'text-green-400', lastExec: '3 mins ago', rate: '99.2%' },
    { name: 'Google Calendar Service', icon: Calendar, status: 'Active', color: 'text-green-400', lastExec: '12 mins ago', rate: '100%' },
    { name: 'AI Service (Llama 3)', icon: Sparkles, status: 'Active', color: 'text-green-400', lastExec: '1 min ago', rate: '98.5%' },
    { name: 'n8n Workflow Engine', icon: Server, status: 'Connected', color: 'text-accent-secondary', lastExec: 'Active', rate: '99.9%' }
  ];

  // Static mock definitions of work flows
  const defaultWorkflows = [
    { name: 'Deadline Reminder', trigger: 'Task Created / Deadline Approaches', status: 'Active', type: 'WhatsApp' },
    { name: 'Notice Broadcast', trigger: 'Notice Summarizer Form Submit', status: 'Active', type: 'WhatsApp / GCal' },
    { name: 'Attendance Alert', trigger: 'Attendance dropping below 75%', status: 'Active', type: 'AI Analysis' },
    { name: 'Placement Reminder', trigger: 'Placement prep assistant request', status: 'Active', type: 'AI Prep Roadmap' }
  ];

  if (loading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-accent-primary" size={40} />
        <p className="text-text-muted text-sm animate-pulse">Connecting to n8n node agent...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-24">
      {/* Page Title & Refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">n8n Automation Console</h1>
          <p className="text-sm text-text-muted">Enterprise dashboard monitor for background notifications, API integrations, and webhook actions.</p>
        </div>
        <button 
          onClick={() => fetchLogs()} 
          disabled={isRefreshing}
          className="p-2 rounded-xl bg-bg-elevated border border-border-subtle text-text-muted hover:text-white transition-colors"
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* AUTOMATION STATUS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusCards.map((card, idx) => (
          <div key={idx} className="card-glass p-5 rounded-2xl border border-border-subtle flex flex-col justify-between gap-4">
            <div className="flex justify-between items-start">
              <div className="p-2.5 rounded-xl bg-white/5 text-accent-primary">
                <card.icon size={20} />
              </div>
              <span className="text-[10px] text-text-muted font-bold font-mono">Rate: {card.rate}</span>
            </div>
            
            <div>
              <h3 className="font-semibold text-white text-sm">{card.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent-secondary animate-pulse shadow-[0_0_8px_rgba(0,212,170,0.8)]"></span>
                  <span className="text-xs text-accent-secondary font-bold uppercase">{card.status}</span>
                </div>
                <span className="text-[10px] text-text-muted font-mono">{card.lastExec}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* WORKFLOW DIRECTORY */}
      <div>
        <h2 className="font-display text-lg font-bold text-white mb-4">Configured Automations</h2>
        <div className="card-glass rounded-2xl overflow-hidden divide-y divide-border-subtle/50">
          {defaultWorkflows.map((flow, fidx) => (
            <div key={fidx} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-bg-elevated/10 transition-colors">
              <div>
                <h4 className="font-bold text-white text-sm">{flow.name}</h4>
                <p className="text-xs text-text-muted mt-0.5">Trigger: {flow.trigger}</p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6">
                <span className="text-[10px] font-mono bg-white/5 border border-border-subtle text-text-muted px-2.5 py-0.5 rounded font-semibold uppercase">
                  {flow.type}
                </span>
                
                <span className="flex items-center gap-1.5 text-xs text-accent-secondary font-bold uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary shadow-md"></span>
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LIVE EXECUTION LOGS TABLE */}
      <div>
        <h2 className="font-display text-lg font-bold text-white mb-4">Live Execution logs</h2>
        <div className="card-glass rounded-2xl overflow-hidden">
          {logs.length === 0 ? (
            <div className="p-12 text-center text-text-muted text-sm font-semibold border-dashed">No recent webhooks captured yet.</div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-border-subtle bg-bg-surface/50 text-text-muted font-bold text-[10px] uppercase tracking-wider">
                    <th className="p-4">Workflow</th>
                    <th className="p-4">Trigger Time</th>
                    <th className="p-4">Payload Logs</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/40">
                  {logs.map((log) => {
                    const dateText = format(new Date(log.triggered_at), 'yyyy-MM-dd HH:mm:ss');
                    return (
                      <tr key={log.id} className="hover:bg-bg-elevated/20 transition-colors">
                        <td className="p-4 font-bold text-white">{log.workflow_name}</td>
                        <td className="p-4 text-text-muted font-mono text-[11px]">{dateText}</td>
                        <td className="p-4 font-mono text-[10px] text-text-muted truncate max-w-xs" title={JSON.stringify(log.payload)}>
                          {JSON.stringify(log.payload)}
                        </td>
                        <td className="p-4 text-right">{getStatusIcon(log.status)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
