import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { Home, CheckSquare, Calendar, Brain, Bell, Settings } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function Layout() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  const mobileNavItems = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/calendar', label: 'Cal', icon: Calendar },
    { path: '/ai-tools', label: 'AI', icon: Brain },
    { path: '/notices', label: 'Notices', icon: Bell },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-primary">
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none z-0"></div>
      
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Top Navigation */}
        <TopBar />
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>

      {/* Mobile Floating Bottom Navigation */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 bg-bg-surface/90 backdrop-blur-lg border border-border-subtle rounded-2xl p-2 shadow-2xl flex justify-around items-center z-40">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-150 ${
                isActive 
                  ? 'text-accent-primary scale-110 font-medium' 
                  : 'text-text-muted hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="text-[10px]">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
