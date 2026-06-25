import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Plus, CheckCircle, Trash2, Edit2, Calendar as CalIcon, Smartphone,
  KanbanSquare, List, AlertCircle, Clock, Loader2, Sparkles, Filter, ChevronRight
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'completed', 'overdue'
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const studentId = localStorage.getItem('student_id') || '11111111-2222-3333-4444-555555555555';

  const [formData, setFormData] = useState({
    title: '',
    subject: 'OS',
    deadline: '',
    priority: 'medium',
    reminder_24h: true,
    reminder_1h: true,
    add_to_calendar: true
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/tasks/${studentId}`);
      setTasks(res.data);
    } catch (e) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingTask) {
        // Edit mode
        const res = await api.put(`/tasks/${editingTask.id}`, formData);
        setTasks(tasks.map(t => t.id === editingTask.id ? res.data : t));
        toast.success('Task updated!');
      } else {
        // Create mode
        const res = await api.post('/tasks', { ...formData, student_id: studentId });
        setTasks([...tasks, res.data]);
        toast.success('Task created & synced!');
      }
      setShowModal(false);
      setEditingTask(null);
      resetForm();
    } catch (err) {
      toast.error('Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    // Format deadline to match datetime-local input (YYYY-MM-DDTHH:MM)
    const formattedDeadline = task.deadline ? task.deadline.slice(0, 16) : '';
    setFormData({
      title: task.title,
      subject: task.subject,
      deadline: formattedDeadline,
      priority: task.priority,
      reminder_24h: task.reminder_24h,
      reminder_1h: task.reminder_1h,
      add_to_calendar: task.add_to_calendar
    });
    setShowModal(true);
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

  const resetForm = () => {
    setFormData({
      title: '',
      subject: 'OS',
      deadline: '',
      priority: 'medium',
      reminder_24h: true,
      reminder_1h: true,
      add_to_calendar: true
    });
  };

  const isOverdue = (task) => {
    return new Date(task.deadline) < new Date() && task.status !== 'done';
  };

  // Filter tasks based on the active tab
  const getFilteredTasks = () => {
    switch (activeTab) {
      case 'pending':
        return tasks.filter(t => t.status === 'pending' && !isOverdue(t));
      case 'completed':
        return tasks.filter(t => t.status === 'done');
      case 'overdue':
        return tasks.filter(t => isOverdue(t));
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'medium': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-accent-primary" size={40} />
        <p className="text-text-muted text-sm animate-pulse">Loading tasks schedule...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-24">
      {/* Header and Toggles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Task Management</h1>
          <p className="text-sm text-text-muted">Organize academic deliverables and track WhatsApp & GCal sync status.</p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          {/* View Toggler */}
          <div className="flex rounded-xl bg-bg-elevated border border-border-subtle p-1 shrink-0">
            <button 
              onClick={() => setViewMode('kanban')} 
              className={`p-2 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-accent-primary text-white shadow-md' : 'text-text-muted hover:text-white'}`}
              title="Kanban Board View"
            >
              <KanbanSquare size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')} 
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-accent-primary text-white shadow-md' : 'text-text-muted hover:text-white'}`}
              title="Detailed List View"
            >
              <List size={18} />
            </button>
          </div>

          <button 
            onClick={() => { setEditingTask(null); resetForm(); setShowModal(true); }}
            className="btn-primary flex items-center justify-center gap-2 text-sm font-semibold py-2 px-4 shadow-lg hover:shadow-accent-primary/20 shrink-0 w-full sm:w-auto"
          >
            <Plus size={18} /> Add Task
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-border-subtle overflow-x-auto custom-scrollbar gap-6 pb-1">
        {[
          { id: 'all', label: 'All Tasks', count: tasks.length },
          { id: 'pending', label: 'Pending', count: tasks.filter(t => t.status === 'pending' && !isOverdue(t)).length },
          { id: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'done').length },
          { id: 'overdue', label: 'Overdue', count: tasks.filter(t => isOverdue(t)).length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 font-semibold text-sm transition-all duration-200 shrink-0 border-b-2 flex items-center gap-2 ${
              activeTab === tab.id 
                ? 'text-accent-primary border-accent-primary' 
                : 'text-text-muted border-transparent hover:text-white'
            }`}
          >
            {tab.label}
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-text-muted border border-border-subtle font-mono">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* RENDER KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Pending */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2.5 py-1 bg-bg-surface border border-border-subtle rounded-xl text-sm">
              <span className="font-bold text-white flex items-center gap-2">
                <Clock size={16} className="text-blue-400" /> Pending
              </span>
              <span className="text-xs bg-white/5 border border-border-subtle rounded px-2 py-0.5 text-text-muted font-bold font-mono">
                {tasks.filter(t => t.status === 'pending' && !isOverdue(t)).length}
              </span>
            </div>
            
            <div className="flex flex-col gap-4 min-h-[40vh] rounded-2xl bg-bg-surface/30 p-2 border border-dashed border-border-subtle/50">
              {tasks.filter(t => t.status === 'pending' && !isOverdue(t)).map(task => (
                <TaskCard key={task.id} task={task} onEdit={handleEditClick} onToggleStatus={handleStatusToggle} onDelete={handleDelete} isOverdueTask={false} />
              ))}
              {tasks.filter(t => t.status === 'pending' && !isOverdue(t)).length === 0 && <EmptyState text="No pending tasks" />}
            </div>
          </div>

          {/* Column 2: Overdue */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2.5 py-1 bg-bg-surface border border-border-subtle rounded-xl text-sm">
              <span className="font-bold text-white flex items-center gap-2">
                <AlertCircle size={16} className="text-red-400" /> Overdue
              </span>
              <span className="text-xs bg-white/5 border border-border-subtle rounded px-2 py-0.5 text-text-muted font-bold font-mono">
                {tasks.filter(t => isOverdue(t)).length}
              </span>
            </div>

            <div className="flex flex-col gap-4 min-h-[40vh] rounded-2xl bg-bg-surface/30 p-2 border border-dashed border-border-subtle/50">
              {tasks.filter(t => isOverdue(t)).map(task => (
                <TaskCard key={task.id} task={task} onEdit={handleEditClick} onToggleStatus={handleStatusToggle} onDelete={handleDelete} isOverdueTask={true} />
              ))}
              {tasks.filter(t => isOverdue(t)).length === 0 && <EmptyState text="No overdue tasks" />}
            </div>
          </div>

          {/* Column 3: Completed */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2.5 py-1 bg-bg-surface border border-border-subtle rounded-xl text-sm">
              <span className="font-bold text-white flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" /> Completed
              </span>
              <span className="text-xs bg-white/5 border border-border-subtle rounded px-2 py-0.5 text-text-muted font-bold font-mono">
                {tasks.filter(t => t.status === 'done').length}
              </span>
            </div>

            <div className="flex flex-col gap-4 min-h-[40vh] rounded-2xl bg-bg-surface/30 p-2 border border-dashed border-border-subtle/50">
              {tasks.filter(t => t.status === 'done').map(task => (
                <TaskCard key={task.id} task={task} onEdit={handleEditClick} onToggleStatus={handleStatusToggle} onDelete={handleDelete} isOverdueTask={false} />
              ))}
              {tasks.filter(t => t.status === 'done').length === 0 && <EmptyState text="No completed tasks" />}
            </div>
          </div>
        </div>
      )}

      {/* RENDER LIST VIEW */}
      {viewMode === 'list' && (
        <div className="card-glass rounded-2xl overflow-hidden divide-y divide-border-subtle">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => {
              const overdue = isOverdue(task);
              const isDone = task.status === 'done';
              return (
                <div key={task.id} className={`p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-bg-elevated/25 transition-all duration-150 ${isDone ? 'opacity-65' : ''}`}>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleStatusToggle(task.id)}
                      className={`w-5 h-5 rounded-full border flex items-center justify-center hover:bg-accent-secondary/10 hover:border-accent-secondary transition-all shrink-0 ${
                        isDone ? 'bg-accent-secondary border-accent-secondary text-bg-primary' : 'border-border-subtle'
                      }`}
                    >
                      {isDone && <CheckCircle size={12} className="text-white fill-accent-secondary" />}
                    </button>
                    <div>
                      <h4 className={`text-sm font-semibold text-white ${isDone ? 'line-through text-text-muted' : ''}`}>{task.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase font-bold text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded">
                          {task.subject}
                        </span>
                        <span className="text-[10px] text-text-muted font-mono flex items-center gap-1">
                          <Clock size={10} />
                          {format(new Date(task.deadline), "EEE MMM dd, hh:mm a")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    {/* Badges */}
                    <div className="flex gap-2">
                      {task.reminder_24h && (
                        <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/15 rounded-md px-2 py-0.5 flex items-center gap-1">
                          <Smartphone size={10} /> WA Sync
                        </span>
                      )}
                      {task.add_to_calendar && (
                        <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/15 rounded-md px-2 py-0.5 flex items-center gap-1">
                          <CalIcon size={10} /> Cal Sync
                        </span>
                      )}
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${getPriorityBadgeColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {overdue && (
                        <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 rounded-md px-2 py-0.5 font-bold uppercase animate-pulse">
                          Overdue
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1">
                      <button onClick={() => handleEditClick(task)} className="p-1.5 text-text-muted hover:text-white rounded-lg hover:bg-bg-elevated transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(task.id)} className="p-1.5 text-text-muted hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-text-muted font-medium text-sm">No tasks matching the criteria found.</div>
          )}
        </div>
      )}

      {/* TASK COMPONENT CARD (KANBAN) */}
      {/* Defined locally or imported. Using clean inline implementation */}
      
      {/* ADD/EDIT TASK MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/80 backdrop-blur-sm">
            <div className="fixed inset-0" onClick={() => { setShowModal(false); setEditingTask(null); }}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card-glass w-full max-w-lg p-6 rounded-2xl relative border border-border-subtle bg-bg-surface z-10"
            >
              <button 
                onClick={() => { setShowModal(false); setEditingTask(null); }} 
                className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors"
              >
                ✕
              </button>
              
              <h3 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
                <KanbanSquare size={20} className="text-accent-primary" />
                {editingTask ? 'Edit Academic Task' : 'Create New Academic Task'}
              </h3>
              
              <form onSubmit={handleCreateOrUpdateTask} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">Task Name</label>
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
                      {editingTask ? 'Update Task Details' : 'Create Task & Automate'}
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

// Kanban Task Card Component
function TaskCard({ task, onEdit, onToggleStatus, onDelete, isOverdueTask }) {
  const isDone = task.status === 'done';
  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'medium': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    }
  };

  return (
    <motion.div 
      layout
      whileHover={{ y: -2 }}
      className={`card-glass p-4 rounded-xl flex flex-col gap-3 border-border-subtle group hover:border-accent-primary/20 transition-all ${
        isDone ? 'opacity-65' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <span className="px-2.5 py-0.5 text-[9px] font-extrabold rounded-md bg-accent-primary/10 text-accent-primary border border-accent-primary/20 uppercase tracking-widest">
          {task.subject}
        </span>
        
        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${getPriorityBadgeColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      <div>
        <h3 className={`font-semibold text-white text-sm leading-snug group-hover:text-accent-primary transition-colors ${
          isDone ? 'line-through text-text-muted font-normal' : ''
        }`}>
          {task.title}
        </h3>
        <p className="text-[10px] text-text-muted font-mono flex items-center gap-1 mt-1.5">
          <Clock size={10} />
          {format(new Date(task.deadline), "EEE MMM dd, hh:mm a")}
        </p>
      </div>

      {/* Automations status */}
      <div className="flex gap-2.5 pt-1.5 border-t border-border-subtle/50">
        {task.reminder_24h && (
          <span className="flex items-center gap-1 text-[9px] text-green-400/90" title="WhatsApp enabled">
            <Smartphone size={10} /> WA Enabled
          </span>
        )}
        {task.add_to_calendar && (
          <span className="flex items-center gap-1 text-[9px] text-blue-400/90" title="Calendar synced">
            <CalIcon size={10} /> Cal Synced
          </span>
        )}
        {isOverdueTask && (
          <span className="flex items-center gap-1 text-[9px] text-red-400 font-bold uppercase tracking-wider animate-pulse ml-auto">
            Overdue
          </span>
        )}
      </div>

      {/* Card actions */}
      <div className="flex items-center justify-between border-t border-border-subtle/40 pt-2.5 mt-0.5">
        <button 
          onClick={() => onToggleStatus(task.id)}
          className={`text-[11px] font-bold transition-colors ${isDone ? 'text-text-muted hover:text-white' : 'text-accent-secondary hover:underline'}`}
        >
          {isDone ? 'Mark Pending' : 'Complete'}
        </button>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(task)} className="p-1 text-text-muted hover:text-white rounded hover:bg-bg-elevated transition-colors">
            <Edit2 size={12} />
          </button>
          <button onClick={() => onDelete(task.id)} className="p-1 text-text-muted hover:text-red-400 rounded hover:bg-red-500/10 transition-colors">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Empty state subcomponent
function EmptyState({ text }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-text-muted">
      <p className="text-xs font-semibold">{text}</p>
    </div>
  );
}
