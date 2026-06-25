import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Smartphone, Sliders, Key, Eye, EyeOff, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  // Notification States
  const [notifications, setNotifications] = useState({
    whatsapp: true,
    email: false,
    calendar: true
  });

  // Appearance State
  const [appearanceMode, setAppearanceMode] = useState('dark'); // 'dark', 'light', 'system'

  // Security State
  const [twoFactor, setTwoFactor] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleNotificationChange = (key) => {
    const nextVal = !notifications[key];
    setNotifications({ ...notifications, [key]: nextVal });
    toast.success(`Notifications ${nextVal ? 'enabled' : 'disabled'}`);
  };

  const handleAppearanceChange = (mode) => {
    setAppearanceMode(mode);
    toast.success(`Appearance set to ${mode.toUpperCase()} mode (Demo Mode)`);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Updating credentials security keys...',
        success: 'Password updated successfully!',
        error: 'Failed to update password'
      }
    );
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-24">
      {/* 1. NOTIFICATIONS */}
      <div className="card-glass p-6 rounded-2xl border border-border-subtle bg-bg-surface/50">
        <h3 className="font-display font-bold text-white text-base mb-6 flex items-center gap-2.5 pb-2 border-b border-border-subtle">
          <Bell size={18} className="text-accent-primary" /> Notifications Settings
        </h3>

        <div className="flex flex-col gap-4">
          {[
            { key: 'whatsapp', label: 'Enable WhatsApp Reminders', desc: 'Get automatic ping alerts 24 hours & 1 hour prior to any due date.' },
            { key: 'email', label: 'Enable Email Notifications', desc: 'Receive daily recap notifications summarizing upcoming tasks.' },
            { key: 'calendar', label: 'Enable Calendar Sync', desc: 'Auto-sync task deadline markers as blocker invite cards.' }
          ].map((item) => (
            <div key={item.key} className="flex justify-between items-center p-3 rounded-xl bg-bg-primary/30 border border-border-subtle/50">
              <div>
                <span className="text-sm font-semibold text-white block">{item.label}</span>
                <span className="text-xs text-text-muted">{item.desc}</span>
              </div>
              
              {/* Custom Switch Slider */}
              <button 
                onClick={() => handleNotificationChange(item.key)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-none shrink-0 ${
                  notifications[item.key] ? 'bg-accent-primary' : 'bg-bg-elevated border border-border-subtle'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                  notifications[item.key] ? 'translate-x-5' : 'translate-x-0'
                }`}></div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. APPEARANCE */}
      <div className="card-glass p-6 rounded-2xl border border-border-subtle bg-bg-surface/50">
        <h3 className="font-display font-bold text-white text-base mb-6 flex items-center gap-2.5 pb-2 border-b border-border-subtle">
          <Sliders size={18} className="text-accent-secondary" /> Theme & Appearance
        </h3>

        <div className="flex flex-col sm:flex-row gap-4">
          {[
            { id: 'light', label: 'Light Mode', desc: 'Classic bright paper style' },
            { id: 'dark', label: 'Dark Mode (Recommended)', desc: 'Premium deep space space-grade aesthetic' },
            { id: 'system', label: 'System Mode', desc: 'Follow system default themes' }
          ].map((theme) => (
            <div 
              key={theme.id}
              onClick={() => handleAppearanceChange(theme.id)}
              className={`flex-1 p-4 rounded-xl border cursor-pointer flex flex-col gap-2 transition-all ${
                appearanceMode === theme.id 
                  ? 'border-accent-primary bg-accent-primary/5 text-white shadow-lg' 
                  : 'border-border-subtle bg-bg-primary/20 text-text-muted hover:border-accent-primary/45 hover:text-white'
              }`}
            >
              <span className="text-sm font-bold block">{theme.label}</span>
              <span className="text-[11px] leading-relaxed">{theme.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. INTEGRATIONS */}
      <div className="card-glass p-6 rounded-2xl border border-border-subtle bg-bg-surface/50">
        <h3 className="font-display font-bold text-white text-base mb-6 flex items-center gap-2.5 pb-2 border-b border-border-subtle">
          <Smartphone size={18} className="text-accent-gold" /> System Integrations
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: 'Google Calendar Sync', status: 'Connected', badge: 'bg-green-500/10 text-green-400 border-green-500/20' },
            { name: 'WhatsApp Twilio Reminders', status: 'Connected', badge: 'bg-green-500/10 text-green-400 border-green-500/20' },
            { name: 'AI Service Gateway (Llama 3)', status: 'Connected', badge: 'bg-green-500/10 text-green-400 border-green-500/20' }
          ].map((integ, idx) => (
            <div key={idx} className="p-4 bg-bg-primary/30 border border-border-subtle rounded-xl flex flex-col gap-2.5">
              <span className="text-xs text-text-muted font-bold block uppercase">{integ.name}</span>
              <div className="flex justify-between items-center mt-1">
                <span className={`text-[10px] font-bold uppercase border px-2 py-0.5 rounded-md ${integ.badge}`}>
                  {integ.status}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SECURITY */}
      <div className="card-glass p-6 rounded-2xl border border-border-subtle bg-bg-surface/50">
        <h3 className="font-display font-bold text-white text-base mb-6 flex items-center gap-2.5 pb-2 border-b border-border-subtle">
          <Shield size={18} className="text-red-400" /> Security Configurations
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Change Password Form */}
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">Update password</span>

            <div>
              <label className="block text-[11px] font-semibold text-text-muted mb-1 uppercase">Current Password</label>
              <div className="relative">
                <input 
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-bg-primary/50 border border-border-subtle rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent-primary text-xs"
                  value={passwordForm.currentPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-text-muted mb-1 uppercase">New Password</label>
              <div className="relative">
                <input 
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-bg-primary/50 border border-border-subtle rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent-primary text-xs"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-text-muted mb-1 uppercase">Confirm New Password</label>
              <div className="relative">
                <input 
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-bg-primary/50 border border-border-subtle rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent-primary text-xs"
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-between items-center gap-3 mt-1">
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-text-muted hover:text-white flex items-center gap-1 font-semibold"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />} Show Passwords
              </button>

              <button 
                type="submit"
                className="px-4 py-2 bg-accent-primary text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:scale-[1.01] transition-transform shadow-md"
              >
                <Save size={14} /> Save Password
              </button>
            </div>
          </form>

          {/* Two Factor Authentication Toggle */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">Two-factor credentials authentication</span>
            <div className="p-4 bg-bg-primary/30 border border-border-subtle rounded-xl flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-white block mb-1">Request 2FA OTP codes</span>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Require a verification code sent to your WhatsApp number or email address each time you attempt to authenticate your student session.
                </p>
              </div>

              {/* Slider switch */}
              <button 
                onClick={() => {
                  const nextVal = !twoFactor;
                  setTwoFactor(nextVal);
                  toast.success(`Two-factor Authentication ${nextVal ? 'enabled' : 'disabled'}`);
                }}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-none shrink-0 ${
                  twoFactor ? 'bg-accent-primary' : 'bg-bg-elevated border border-border-subtle'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                  twoFactor ? 'translate-x-5' : 'translate-x-0'
                }`}></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
