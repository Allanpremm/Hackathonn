import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  CheckSquare, 
  Brain, 
  Calendar, 
  BarChart2, 
  Bell, 
  Settings,
  LogOut,
  Menu,
  Zap,
  User
} from 'lucide-react';
import api from '../../services/api';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/tasks', label: 'Tasks', icon: CheckSquare },
  { path: '/calendar', label: 'Calendar', icon: Calendar },
  { path: '/ai-tools', label: 'AI Tools', icon: Brain },
  { path: '/notices', label: 'Notices', icon: Bell },
  { path: '/automations', label: 'Automations', icon: Zap },
  { path: '/analytics', label: 'Analytics', icon: BarChart2 },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [n8nLive, setN8nLive] = useState(false);
  const navigate = useNavigate();
  const studentName = localStorage.getItem('student_name') || 'Student';

  useEffect(() => {
    api.get('/health').then(res => setN8nLive(res.data.n8nLive)).catch(() => {});
    
    const handleResize = () => setIsExpanded(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('student_id');
    localStorage.removeItem('student_name');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <aside className={`h-screen flex flex-col transition-all duration-300 border-r border-border-subtle bg-bg-surface z-30 ${isExpanded ? 'w-64' : 'w-20'} fixed md:relative`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-border-subtle shrink-0">
        {isExpanded && (
          <span className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-2">
            <span className="text-accent-primary">Campus</span>Flow
          </span>
        )}
        <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 rounded-lg hover:bg-bg-elevated transition-colors text-text-muted hover:text-white mx-auto md:mx-0">
          <Menu size={20} />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-3 custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-accent-primary/10 text-accent-primary font-semibold' 
                  : 'text-text-muted hover:bg-bg-elevated hover:text-white'
              }`
            }
          >
            <item.icon size={20} className="shrink-0" />
            {isExpanded && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Profile & Logout */}
      <div className="p-4 border-t border-border-subtle flex flex-col gap-3 shrink-0">
        {/* n8n Status indicator */}
        {isExpanded && (
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-bg-elevated/40 text-xs border border-border-subtle/50">
            <span className="text-text-muted">Automation Status</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${n8nLive ? 'bg-accent-secondary shadow-[0_0_8px_rgba(0,212,170,0.8)] animate-pulse' : 'bg-accent-warning'}`}></span>
              <span className={n8nLive ? 'text-accent-secondary font-medium' : 'text-accent-warning font-medium'}>
                {n8nLive ? 'Active' : 'Offline'}
              </span>
            </div>
          </div>
        )}

        {/* User Info Block */}
        <div className="flex items-center gap-3 p-1">
          <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary font-bold border border-accent-primary/30 shrink-0">
            {studentName[0].toUpperCase()}
          </div>
          {isExpanded && (
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-white truncate">{studentName}</h4>
              <p className="text-xs text-text-muted truncate">Student Account</p>
            </div>
          )}
          {isExpanded && (
            <button 
              onClick={handleLogout} 
              className="p-1.5 text-text-muted hover:text-accent-warning hover:bg-accent-warning/10 rounded-lg transition-colors shrink-0"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>

        {!isExpanded && (
          <button 
            onClick={handleLogout} 
            className="mx-auto flex p-2.5 text-text-muted hover:text-accent-warning transition-colors rounded-xl hover:bg-accent-warning/10"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        )}
      </div>
    </aside>
  );
}
