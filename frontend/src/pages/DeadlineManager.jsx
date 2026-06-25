import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalIcon, Smartphone, Brain, Plus } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function DeadlineManager() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    subject: 'OS',
    deadline: '',
    priority: 'medium',
    reminder_24h: true,
    reminder_1h: true,
    add_to_calendar: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const studentId = localStorage.getItem('student_id');
      await api.post('/tasks', { ...formData, student_id: studentId });
      toast.success('Task created! n8n webhooks triggered.');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-12">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2">Smart Deadline Manager</h1>
        <p className="text-text-muted">Create assignments. We'll handle the calendar invites and WhatsApp nudges.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 card-glass p-6 md:p-8 rounded-2xl"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Task Title</label>
              <input required type="text" placeholder="e.g. B-Tree Implementation" className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-primary transition-colors"
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Subject</label>
                <select className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-primary transition-colors"
                  value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}>
                  <option>OS</option><option>DBMS</option><option>CN</option><option>AI</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Deadline</label>
                <input required type="datetime-local" className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-primary transition-colors [color-scheme:dark]"
                  value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
              </div>
            </div>

            <div className="border-t border-border-subtle pt-6">
              <h3 className="font-medium text-white mb-4">Automations</h3>
              
              <div className="flex flex-col gap-3">
                <label className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated border border-border-subtle cursor-pointer hover:border-accent-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-secondary/20 flex items-center justify-center text-accent-secondary"><Smartphone size={16} /></div>
                    <div>
                      <div className="text-sm font-medium text-white">WhatsApp Nudges</div>
                      <div className="text-xs text-text-muted">Remind me 24h & 1h before via n8n</div>
                    </div>
                  </div>
                  <input type="checkbox" className="w-5 h-5 accent-accent-secondary cursor-pointer" 
                    checked={formData.reminder_24h} onChange={e => setFormData({...formData, reminder_24h: e.target.checked, reminder_1h: e.target.checked})} />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated border border-border-subtle cursor-pointer hover:border-accent-primary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary"><CalIcon size={16} /></div>
                    <div>
                      <div className="text-sm font-medium text-white">Google Calendar Sync</div>
                      <div className="text-xs text-text-muted">Create a block in my schedule</div>
                    </div>
                  </div>
                  <input type="checkbox" className="w-5 h-5 accent-accent-primary cursor-pointer" 
                    checked={formData.add_to_calendar} onChange={e => setFormData({...formData, add_to_calendar: e.target.checked})} />
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-2 py-3 flex justify-center items-center gap-2">
              {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : <><Plus size={18} /> Create Task & Automate</>}
            </button>
          </form>
        </motion.div>

        {/* AI Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="card-glass border-accent-gold/20 p-6 rounded-2xl h-fit flex flex-col gap-4 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="w-12 h-12 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold">
            <Brain size={24} />
          </div>
          <h3 className="font-bold text-lg text-white">Need a study plan?</h3>
          <p className="text-sm text-text-muted">Fill out the task details first, then our AI can generate a day-by-day roadmap for you.</p>
          <button type="button" onClick={() => toast("AI Generation available after saving task!")} className="mt-2 w-full py-2 bg-bg-elevated hover:bg-accent-gold/20 text-accent-gold border border-accent-gold/30 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2">
            <Sparkles size={16} /> Generate Plan
          </button>
        </motion.div>
      </div>
    </div>
  );
}
