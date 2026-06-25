import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Bell, Search, Calendar as CalIcon, MessageCircle, Bookmark, BookmarkCheck, 
  ChevronRight, Sparkles, Filter, AlertCircle, Send
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function NoticesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'academic', 'exam', 'placement', 'events'
  const [bookmarkedNotices, setBookmarkedNotices] = useState({}); // { id: boolean }

  const studentId = localStorage.getItem('student_id') || '11111111-2222-3333-4444-555555555555';

  const noticesList = [
    {
      id: 'n1',
      title: 'Google Recruitment Drive 2026',
      date: '2026-06-24',
      category: 'placement',
      summary: 'Google is conducting off-campus recruitment for Software Engineer Intern roles. Eligible branches: CSE, ECE with CGPA > 8.0. Registrations close on June 30.',
    },
    {
      id: 'n2',
      title: 'End-Semester Lab Internals Schedule',
      date: '2026-06-20',
      category: 'academic',
      summary: 'Practical exams for CSE lab courses are scheduled between June 28 and July 5. Detailed lab allocations are posted on the departmental dashboard.',
    },
    {
      id: 'n3',
      title: 'DBMS Lab Quiz Syllabus Details',
      date: '2026-06-22',
      category: 'exam',
      summary: 'The upcoming DBMS lab assessment covers SQL indexing, relational query execution, B-Trees, and database connections. Heavy weightage on query tuning.',
    },
    {
      id: 'n4',
      title: 'Annual Campus Hackathon 2026',
      date: '2026-06-25',
      category: 'events',
      summary: 'Registration is live for the Campus Hackathon. Develop AI solutions or web applications. Grand prize pool of $5,000. Registration ends in 3 days.',
    },
    {
      id: 'n5',
      title: 'Mid-Semester Examinations Announcement',
      date: '2026-06-15',
      category: 'exam',
      summary: 'Mid-semester exams will begin on July 10. Venue codes and seating plans will be released soon. Hall tickets can be collected from academic block desk.',
    },
    {
      id: 'n6',
      title: 'Amazon Pre-Placement Talk Session',
      date: '2026-06-19',
      category: 'placement',
      summary: 'Amazon recruiter talks about SDE hiring patterns, career tracks, and compensation packages. Attendance mandatory for all final and pre-final year students.',
    },
    {
      id: 'n7',
      title: 'Course Registration for Semester II',
      date: '2026-06-18',
      category: 'academic',
      summary: 'The elective portal opens next Monday. Secure seats for advanced AI and Cryptography electives. Ensure all semester fees are paid to clear hold flags.',
    },
    {
      id: 'n8',
      title: 'Annual Cultural Fest Dates Released',
      date: '2026-06-10',
      category: 'events',
      summary: 'Annual cultural celebrations are scheduled for July 18-20. Event lists, stalls registries, and speaker announcements are published on official pages.',
    }
  ];

  const handleBroadcast = async (notice) => {
    toast.promise(
      api.post('/notices/broadcast', {
        noticeText: notice.summary,
        eventTitle: notice.title,
        eventDate: notice.date,
        phoneList: ['919876543210'],
        studentId
      }),
      {
        loading: 'Broadcasting summarized alert via WhatsApp...',
        success: 'Notice summarized & broadcasted to WhatsApp study groups!',
        error: 'Failed to broadcast alert'
      }
    );
  };

  const handleAddToCalendar = (notice) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: 'Syncing notice event block to Google Calendar...',
        success: `"${notice.title}" successfully added to Google Calendar!`,
        error: 'Calendar sync failed'
      }
    );
  };

  const toggleBookmark = (id) => {
    const nextVal = !bookmarkedNotices[id];
    setBookmarkedNotices({ ...bookmarkedNotices, [id]: nextVal });
    toast.success(nextVal ? 'Notice bookmarked' : 'Bookmark removed');
  };

  // Filter & Search Logic
  const filteredNotices = noticesList.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          notice.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeFilter === 'all' || notice.category === activeFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-24">
      {/* Search and Filters panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 text-text-muted w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search notices, exams, job drives..."
            className="w-full bg-bg-surface border border-border-subtle rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-accent-primary text-sm transition-colors"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories Tab Toggles */}
        <div className="flex rounded-xl bg-bg-elevated border border-border-subtle p-1 overflow-x-auto w-full md:w-auto custom-scrollbar shrink-0">
          {[
            { id: 'all', label: 'All' },
            { id: 'academic', label: 'Academic' },
            { id: 'exam', label: 'Exams' },
            { id: 'placement', label: 'Placement' },
            { id: 'events', label: 'Events' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex-grow md:flex-grow-0 px-4 py-1.5 text-xs font-bold uppercase rounded-lg transition-all shrink-0 ${
                activeFilter === tab.id 
                  ? 'bg-accent-primary text-white shadow-md' 
                  : 'text-text-muted hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notices Cards Grid */}
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotices.map((notice) => {
            const isBookmarked = !!bookmarkedNotices[notice.id];
            
            const categoryTags = {
              placement: 'bg-red-500/10 text-red-400 border-red-500/20',
              academic: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
              exam: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
              events: 'bg-green-500/10 text-green-400 border-green-500/20'
            };

            return (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                key={notice.id}
                className="card-glass p-6 rounded-2xl flex flex-col justify-between gap-5 hover:border-accent-primary/20 transition-all border-border-subtle/60 group relative overflow-hidden"
              >
                <div className="flex justify-between items-start gap-4">
                  <span className={`px-2.5 py-0.5 text-[9px] font-extrabold rounded-md border uppercase tracking-widest ${categoryTags[notice.category]}`}>
                    {notice.category}
                  </span>
                  
                  <div className="flex gap-2">
                    <span className="text-[10px] text-text-muted font-mono self-center">
                      {format(new Date(notice.date), 'MMM dd, yyyy')}
                    </span>
                    <button 
                      onClick={() => toggleBookmark(notice.id)}
                      className="text-text-muted hover:text-accent-gold transition-colors p-1"
                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Notice'}
                    >
                      {isBookmarked ? <BookmarkCheck size={16} className="text-accent-gold" /> : <Bookmark size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-bold text-white text-base leading-snug mb-2 group-hover:text-accent-primary transition-colors">
                    {notice.title}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {notice.summary}
                  </p>
                </div>

                {/* Actions Panel */}
                <div className="flex items-center gap-3 border-t border-border-subtle/50 pt-4 mt-1">
                  <button 
                    onClick={() => handleAddToCalendar(notice)}
                    className="flex-1 py-2 bg-bg-primary hover:bg-bg-elevated border border-border-subtle text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CalIcon size={12} className="text-blue-400" /> Calendar
                  </button>
                  <button 
                    onClick={() => handleBroadcast(notice)}
                    className="flex-1 py-2 bg-bg-primary hover:bg-bg-elevated border border-border-subtle text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageCircle size={12} className="text-green-400" /> WhatsApp Summarizer
                  </button>
                </div>
              </motion.div>
            );
          })}

          {filteredNotices.length === 0 && (
            <div className="col-span-full card-glass p-12 text-center text-text-muted border-dashed border-border-subtle flex flex-col items-center justify-center gap-2">
              <Bell size={32} className="opacity-45" />
              <p className="text-sm font-semibold">No campus announcements match your criteria.</p>
            </div>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
}
