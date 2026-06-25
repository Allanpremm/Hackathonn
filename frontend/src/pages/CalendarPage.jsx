import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  addDays, addMonths, subMonths, isSameMonth, isSameDay, 
  parseISO, addWeeks, subWeeks, addDays as addDaysFn, subDays
} from 'date-fns';
import { 
  Calendar as CalIcon, ChevronLeft, ChevronRight, Clock, Users,
  BookOpen, Sparkles, AlertCircle, Loader2, Plus
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'day', 'week', 'month'
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const studentId = localStorage.getItem('student_id') || '11111111-2222-3333-4444-555555555555';

  // Realistic mock schedule items
  const classesAndExams = [
    { id: 'c1', title: 'DBMS Lecture', type: 'class', desc: 'Lecture on relational algebra & SQL queries.', start: '09:00', end: '10:30', days: [1, 3], participants: ['Prof. Sharma', 'CSE-A Students'] },
    { id: 'c2', title: 'CN Lecture', type: 'class', desc: 'Lecture on TCP/IP stack layers and protocols.', start: '11:00', end: '12:30', days: [1, 5], participants: ['Prof. Roy', 'CSE-A Students'] },
    { id: 'c3', title: 'OS Lecture', type: 'class', desc: 'Lecture on process scheduling and semaphores.', start: '14:00', end: '15:30', days: [2, 4], participants: ['Prof. Varma', 'CSE-B Students'] },
    { id: 'e1', title: 'OS Midterm Examination', type: 'exam', desc: 'Covers CPU scheduling, synchronization, and deadlock prevention.', date: new Date(2026, 5, 28, 10, 0), duration: 120, participants: ['All CSE 1st Year', 'Exam Invigilator'] },
    { id: 'e2', title: 'DBMS Lab Practical Quiz', type: 'exam', desc: 'Hands-on query execution & B-Tree indexes assessment.', date: new Date(2026, 6, 2, 14, 0), duration: 60, participants: ['Group A Students', 'DBMS Lab Evaluator'] },
    { id: 's1', title: 'OS Team Revision Session', type: 'study', desc: 'Peer group discussion on dining philosophers problem.', start: '16:00', end: '18:00', days: [6], participants: ['Allan Developer', 'Maya Jones', 'Sam Chen'] },
    { id: 's2', title: 'CN Group Lab Practice', type: 'study', desc: 'Setting up socket programming scripts together.', start: '15:00', end: '17:00', days: [0], participants: ['Allan Developer', 'Devon Patel'] }
  ];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/tasks/${studentId}`);
      setTasks(res.data);
    } catch (e) {
      toast.error('Failed to sync tasks to calendar');
    } finally {
      setLoading(false);
    }
  };

  // Compile all events on a specific day
  const getEventsForDate = (date) => {
    const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday...
    const events = [];

    // 1. Add Class & Study recurring events
    classesAndExams.forEach(item => {
      if (item.days && item.days.includes(dayOfWeek)) {
        const [sh, sm] = item.start.split(':').map(Number);
        const [eh, em] = item.end.split(':').map(Number);
        
        const eventStart = new Date(date);
        eventStart.setHours(sh, sm, 0, 0);

        const eventEnd = new Date(date);
        eventEnd.setHours(eh, em, 0, 0);

        events.push({
          id: `${item.id}-${date.toDateString()}`,
          title: item.title,
          type: item.type,
          desc: item.desc,
          start: eventStart,
          end: eventEnd,
          participants: item.participants
        });
      }
    });

    // 2. Add Fixed Date Exams
    classesAndExams.forEach(item => {
      if (item.date && isSameDay(item.date, date)) {
        const start = new Date(item.date);
        const end = new Date(start.getTime() + item.duration * 60000);
        events.push({
          id: item.id,
          title: item.title,
          type: item.type,
          desc: item.desc,
          start,
          end,
          participants: item.participants
        });
      }
    });

    // 3. Add Deadlines/Assignments from tasks database
    tasks.forEach(task => {
      const deadlineDate = parseISO(task.deadline);
      if (isSameDay(deadlineDate, date)) {
        const start = new Date(deadlineDate);
        const end = new Date(start.getTime() + 60 * 60000); // 1hr block
        events.push({
          id: task.id,
          title: `[Task] ${task.title}`,
          type: 'assignment',
          desc: `Assignment for ${task.subject}. Priority: ${task.priority.toUpperCase()}. WhatsApp Sync: ${task.reminder_24h ? 'ON' : 'OFF'}.`,
          start,
          end,
          participants: ['Student (Self)', 'Course Instructor'],
          taskDetails: task
        });
      }
    });

    // Sort by start time
    return events.sort((a, b) => a.start - b.start);
  };

  // Date navigation handlers
  const handlePrev = () => {
    if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDaysFn(currentDate, 1));
  };

  // Color coding helper
  const getEventStyles = (type) => {
    switch (type) {
      case 'exam': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'assignment': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      case 'class': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'study': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      default: return 'bg-bg-elevated text-text-primary border border-border-subtle';
    }
  };

  // RENDER MONTH VIEW
  const renderMonth = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(cloneDay, currentDate);
        const isToday = isSameDay(cloneDay, new Date());
        const dayEvents = getEventsForDate(cloneDay);

        days.push(
          <div 
            key={cloneDay.toString()} 
            className={`min-h-[120px] p-2 border border-border-subtle/50 flex flex-col gap-1.5 transition-colors relative ${
              isCurrentMonth ? 'bg-bg-surface/30' : 'bg-bg-primary/20 opacity-30 pointer-events-none'
            } ${isToday ? 'bg-accent-primary/5 ring-1 ring-accent-primary/20' : ''}`}
          >
            {/* Date Number Label */}
            <span className={`text-xs font-bold font-mono self-end flex items-center justify-center w-5 h-5 rounded-full ${
              isToday ? 'bg-accent-primary text-white shadow-[0_0_8px_rgba(108,99,255,0.4)]' : 'text-text-muted'
            }`}>
              {format(cloneDay, 'd')}
            </span>

            {/* Events summary */}
            <div className="flex flex-col gap-1 overflow-y-auto max-h-[85px] custom-scrollbar">
              {dayEvents.map(evt => (
                <div 
                  key={evt.id} 
                  onClick={() => setSelectedEvent(evt)}
                  className={`text-[10px] px-2 py-0.5 rounded font-semibold truncate cursor-pointer transition-transform hover:scale-[1.02] ${getEventStyles(evt.type)}`}
                  title={`${format(evt.start, 'hh:mm a')} - ${evt.title}`}
                >
                  {format(evt.start, 'hh:mm')} {evt.title}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }

    return (
      <div className="card-glass rounded-2xl overflow-hidden border border-border-subtle">
        {/* Days of Week header */}
        <div className="grid grid-cols-7 border-b border-border-subtle bg-bg-surface">
          {weekDays.map(d => (
            <div key={d} className="text-center py-2.5 text-xs font-bold text-text-muted uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>
        {/* Days grid */}
        <div className="divide-y divide-border-subtle/50">
          {rows}
        </div>
      </div>
    );
  };

  // RENDER WEEK VIEW
  const renderWeek = () => {
    const weekStart = startOfWeek(currentDate);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      const isToday = isSameDay(day, new Date());
      const dayEvents = getEventsForDate(day);

      days.push(
        <div key={day.toString()} className={`flex-1 min-w-[120px] border-r border-border-subtle/40 last:border-0 flex flex-col ${isToday ? 'bg-accent-primary/5' : ''}`}>
          <div className="p-3 border-b border-border-subtle bg-bg-surface text-center flex flex-col items-center">
            <span className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">{format(day, 'EEE')}</span>
            <span className={`text-sm font-bold font-mono w-6 h-6 rounded-full flex items-center justify-center ${
              isToday ? 'bg-accent-primary text-white shadow-md' : 'text-white'
            }`}>
              {format(day, 'dd')}
            </span>
          </div>

          <div className="flex-1 p-2 flex flex-col gap-2 min-h-[400px]">
            {dayEvents.map(evt => (
              <div 
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className={`p-2.5 rounded-xl text-xs font-medium cursor-pointer hover:border-accent-primary/50 transition-all flex flex-col gap-1 border ${getEventStyles(evt.type)}`}
              >
                <div className="flex items-center gap-1 font-bold text-[11px] truncate">
                  <Clock size={10} />
                  {format(evt.start, 'hh:mm a')}
                </div>
                <div className="font-semibold text-white leading-snug">{evt.title}</div>
                <div className="text-[10px] text-text-muted truncate">{evt.desc}</div>
              </div>
            ))}

            {dayEvents.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-text-muted opacity-40 text-[10px]">No events</div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="card-glass rounded-2xl overflow-x-auto border border-border-subtle custom-scrollbar">
        <div className="flex min-w-[840px]">
          {days}
        </div>
      </div>
    );
  };

  // RENDER DAY VIEW
  const renderDay = () => {
    const dayEvents = getEventsForDate(currentDate);
    const isToday = isSameDay(currentDate, new Date());

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-glass p-6 rounded-2xl">
          <div className="flex justify-between items-center pb-4 border-b border-border-subtle mb-6">
            <h3 className="font-bold text-white text-base">
              Agenda for {format(currentDate, 'MMMM do, yyyy')}
            </h3>
            {isToday && (
              <span className="text-[10px] uppercase font-bold tracking-widest text-accent-secondary bg-accent-secondary/15 px-2 py-0.5 rounded">
                Today
              </span>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {dayEvents.map(evt => (
              <div 
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className={`p-4 rounded-xl border cursor-pointer hover:scale-[1.01] transition-transform flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${getEventStyles(evt.type)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-white/5 text-current shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base">{evt.title}</h4>
                    <p className="text-xs text-text-muted mt-0.5">{evt.desc}</p>
                    <div className="flex items-center gap-1 text-[10px] text-text-muted mt-2 font-mono">
                      <Clock size={11} /> {format(evt.start, 'hh:mm a')} - {format(evt.end, 'hh:mm a')}
                    </div>
                  </div>
                </div>

                <span className="self-start sm:self-center text-[10px] uppercase font-extrabold tracking-widest px-3 py-1 rounded bg-white/5 border border-border-subtle">
                  {evt.type}
                </span>
              </div>
            ))}

            {dayEvents.length === 0 && (
              <div className="py-12 text-center text-text-muted opacity-60">
                <CalIcon size={40} className="mx-auto text-text-muted mb-2 opacity-50" />
                <p className="text-sm font-medium">No classes, exams, or tasks scheduled for this day.</p>
              </div>
            )}
          </div>
        </div>

        {/* Legend sidebar */}
        <div className="card-glass p-6 rounded-2xl h-fit flex flex-col gap-4 border-border-subtle">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider pb-2 border-b border-border-subtle">Schedule Color Codes</h4>
          <div className="flex flex-col gap-3">
            {[
              { type: 'exam', label: 'Exams & Quizzes', dot: 'bg-red-500 shadow-red-500/50' },
              { type: 'assignment', label: 'Assignments & Deadlines', dot: 'bg-orange-500 shadow-orange-500/50' },
              { type: 'class', label: 'Academic Lectures', dot: 'bg-blue-500 shadow-blue-500/50' },
              { type: 'study', label: 'Self Study & Rev Sessions', dot: 'bg-green-500 shadow-green-500/50' }
            ].map((legend, lidx) => (
              <div key={lidx} className="flex items-center gap-3 p-2 rounded-lg bg-bg-surface/35 border border-border-subtle/50 text-xs text-text-primary">
                <span className={`w-3 h-3 rounded-full shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.4)] ${legend.dot}`}></span>
                <span className="font-semibold">{legend.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-accent-primary" size={40} />
        <p className="text-text-muted text-sm animate-pulse">Syncing Google Calendar timeline...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-24">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Navigation buttons */}
        <div className="flex items-center gap-4">
          <h1 className="font-display text-xl sm:text-2xl font-bold text-white shrink-0">
            {format(currentDate, viewMode === 'month' ? 'MMMM yyyy' : 'MMMM do, yyyy')}
          </h1>
          <div className="flex rounded-xl bg-bg-elevated border border-border-subtle p-0.5 shrink-0">
            <button onClick={handlePrev} className="p-2 text-text-muted hover:text-white rounded-lg transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 text-xs font-semibold text-text-muted hover:text-white rounded-lg transition-colors border-l border-r border-border-subtle">
              Today
            </button>
            <button onClick={handleNext} className="p-2 text-text-muted hover:text-white rounded-lg transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* View Mode Selector Tabs */}
        <div className="flex rounded-xl bg-bg-elevated border border-border-subtle p-1 w-full sm:w-auto">
          {['day', 'week', 'month'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold uppercase rounded-lg transition-all ${
                viewMode === mode 
                  ? 'bg-accent-primary text-white shadow-md' 
                  : 'text-text-muted hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* RENDER ACTIVE CALENDAR VIEW */}
      {viewMode === 'month' && renderMonth()}
      {viewMode === 'week' && renderWeek()}
      {viewMode === 'day' && renderDay()}

      {/* EVENT DETAIL MODAL */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/80 backdrop-blur-sm animate-fade-in">
            <div className="fixed inset-0" onClick={() => setSelectedEvent(null)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card-glass w-full max-w-md p-6 rounded-2xl relative border border-border-subtle bg-bg-surface z-10 flex flex-col gap-4 shadow-2xl"
            >
              <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors">✕</button>
              
              <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
                <span className={`px-2.5 py-0.5 rounded text-[9px] uppercase font-extrabold tracking-widest ${getEventStyles(selectedEvent.type)}`}>
                  {selectedEvent.type}
                </span>
                <span className="text-[10px] text-text-muted font-mono ml-auto">Google Calendar Sync</span>
              </div>

              <div>
                <h3 className="font-display font-bold text-white text-lg leading-tight mb-2">
                  {selectedEvent.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  {selectedEvent.desc}
                </p>
              </div>

              {/* Time Schedule Details */}
              <div className="flex items-center gap-3 p-3 bg-white/5 border border-border-subtle rounded-xl text-xs text-text-primary">
                <Clock size={16} className="text-accent-primary shrink-0" />
                <div>
                  <span className="font-bold text-white block">Schedule Timing</span>
                  <span className="text-text-muted text-[11px] font-mono">
                    {format(selectedEvent.start, 'EEE MMM dd, hh:mm a')} - {format(selectedEvent.end, 'hh:mm a')}
                  </span>
                </div>
              </div>

              {/* Participants */}
              {selectedEvent.participants && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Participants & Contacts</span>
                  <div className="flex flex-col gap-1.5">
                    {selectedEvent.participants.map((person, pidx) => (
                      <div key={pidx} className="flex items-center gap-2 text-xs text-text-primary">
                        <Users size={12} className="text-accent-secondary" />
                        <span className="font-medium">{person}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={() => setSelectedEvent(null)}
                className="btn-primary mt-2 py-2 text-xs font-semibold"
              >
                Close details
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
