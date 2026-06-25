import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import CalendarPage from './pages/CalendarPage';
import AITools from './pages/AITools';
import NoticesPage from './pages/NoticesPage';
import Automations from './pages/Automations';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Layout from './components/Layout/Layout';
import './App.css';

function App() {
  return (
    <Router>
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#111318', color: '#F0F2F7', border: '1px solid rgba(255,255,255,0.06)' }
      }} />
      <Routes>
        <Route path="/" element={<Landing />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/ai-tools" element={<AITools />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/automations" element={<Automations />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
