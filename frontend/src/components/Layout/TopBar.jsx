import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, Sun, Moon, Sparkles, Calendar, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TopBar() {
  const location = useLocation();
  const studentName = localStorage.getItem('student_name') || 'Student';
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Dynamic Page Title
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return '🏠 Dashboard';
      case '/tasks': return '✅ Task Management';
      case '/calendar': return '📅 Calendar Schedule';
      case '/ai-tools': return '🤖 AI Study Tools';
      case '/notices': return '📢 Notice Board';
      case '/automations': return '⚡ Automations Monitoring';
      case '/analytics': return '📊 Productivity Analytics';
      case '/profile': return '👤 User Profile';
      case '/settings': return '⚙️ System Settings';
      default: return 'CampusFlow';
    }
  };

  const notifications = [
    { id: 1, text: 'WhatsApp Reminder: DBMS Assignment due in 5 hours!', type: 'warning', icon: Bell },
    { id: 2, text: 'Google Calendar: Connected successfully.', type: 'success', icon: Calendar },
    { id: 3, text: 'AI Study Buddy: New flashcards generated for OS.', type: 'info', icon: Sparkles },
    { id: 4, text: 'Notice Board: Exam schedules updated.', type: 'important', icon: CheckSquare }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.success(`Searching for "${searchQuery}"...`);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    toast.success(`Switched to ${isDarkMode ? 'Light' : 'Dark'} Mode (Demo Mode)`);
  };

  return (
    <header className="h-16 border-b border-border-subtle bg-bg-surface/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 relative z-20">
      {/* Left: Dynamic Title */}
      <div className="flex items-center gap-2">
        <h2 className="font-display font-bold text-lg text-white md:text-xl transition-all duration-300">
          {getPageTitle()}
        </h2>
      </div>

      {/* Center: Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative w-96 max-w-lg">
        <Search className="absolute left-3 text-text-muted w-4 h-4 pointer-events-none" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks, notices, classes..." 
          className="w-full bg-bg-primary/50 border border-border-subtle hover:border-accent-primary/45 rounded-full pl-10 pr-4 py-1.5 text-sm text-white placeholder-text-muted focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20 transition-all duration-200"
        />
      </form>

      {/* Right: Notifications, Theme, Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-text-muted hover:text-white hover:bg-bg-elevated transition-all active:scale-95 relative"
            title="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-bg-surface animate-pulse"></span>
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
              <div className="absolute right-0 mt-2 w-80 bg-bg-elevated border border-border-subtle rounded-2xl shadow-2xl p-4 z-20 flex flex-col gap-3 animate-in fade-in-50 slide-in-from-top-2 duration-150">
                <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
                  <h4 className="font-bold text-white text-sm">Alerts & Notifications</h4>
                  <button onClick={() => toast.success('Cleared all notifications')} className="text-xs text-accent-primary hover:underline">Mark as read</button>
                </div>
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {notifications.map((n) => (
                    <div key={n.id} className="flex gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer" onClick={() => toast(`Alert details: ${n.text}`)}>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-accent-primary shrink-0">
                        <n.icon size={14} />
                      </div>
                      <p className="text-xs text-text-primary leading-tight">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl text-text-muted hover:text-white hover:bg-bg-elevated transition-all active:scale-95"
          title="Toggle Theme"
        >
          {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-border-subtle">
          <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary font-bold border border-accent-primary/30 shrink-0">
            {studentName[0].toUpperCase()}
          </div>
          <span className="hidden sm:inline text-sm font-medium text-white truncate max-w-[120px]">{studentName}</span>
        </div>
      </div>
    </header>
  );
}
