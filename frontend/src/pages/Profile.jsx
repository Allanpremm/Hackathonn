import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, BookOpen, GraduationCap, Edit, Check, MessageSquare, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: localStorage.getItem('student_name') || 'Allan Developer',
    email: 'allan@example.com',
    phone: '919876543210',
    branch: 'CSE',
    year: '1',
    avatar: ''
  });

  const [googleConnected, setGoogleConnected] = useState(true);
  const [whatsappConnected, setWhatsappConnected] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('student_name', profileData.name);
    setIsEditing(false);
    toast.success('Profile details updated successfully!');
    // Trigger global event so header updates if needed
    window.dispatchEvent(new Event('storage'));
  };

  const toggleGoogle = () => {
    setGoogleConnected(!googleConnected);
    toast.success(googleConnected ? 'Google Account disconnected' : 'Google Account connected successfully!');
  };

  const toggleWhatsapp = () => {
    setWhatsappConnected(!whatsappConnected);
    toast.success(whatsappConnected ? 'WhatsApp Service disconnected' : 'WhatsApp Service connected successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 pb-24">
      {/* Left: Avatar Card */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="card-glass p-6 rounded-2xl flex flex-col items-center text-center border-border-subtle/70 bg-bg-surface/40 relative overflow-hidden select-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

          {/* Avatar Picture */}
          <div className="w-24 h-24 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary font-bold text-3xl border border-accent-primary/30 shrink-0 relative group mb-4">
            <span className="group-hover:opacity-20 transition-opacity">
              {profileData.name[0].toUpperCase()}
            </span>
            <div className="absolute inset-0 rounded-full bg-bg-primary/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-semibold cursor-pointer transition-all border border-border-subtle" onClick={() => toast('Photo upload coming soon in v2!')}>
              Upload
            </div>
          </div>

          <h3 className="font-display font-bold text-lg text-white mb-1 leading-tight">{profileData.name}</h3>
          <span className="text-xs text-accent-primary font-semibold uppercase tracking-wider block mb-4">B.Tech Student</span>

          <div className="flex flex-col gap-2 w-full pt-4 border-t border-border-subtle/50 text-left text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-bg-primary/30">
              <span className="text-text-muted">Academic Branch</span>
              <span className="font-semibold text-white">{profileData.branch}</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-bg-primary/30">
              <span className="text-text-muted">Current Year</span>
              <span className="font-semibold text-white">Year {profileData.year}</span>
            </div>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="card-glass p-5 rounded-2xl flex flex-col gap-4 border-border-subtle bg-bg-surface/30">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider pb-2 border-b border-border-subtle">Connected Accounts</h4>
          
          <div className="flex flex-col gap-3">
            {/* Google */}
            <div className="flex justify-between items-center p-3 bg-bg-primary/45 rounded-xl border border-border-subtle">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/15">
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Google Account</span>
                  <span className="text-[10px] text-text-muted">Calendar blocks & invites sync</span>
                </div>
              </div>
              <button 
                onClick={toggleGoogle}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider border transition-colors ${
                  googleConnected 
                    ? 'border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/20' 
                    : 'border-border-subtle bg-bg-elevated text-text-muted hover:text-white'
                }`}
              >
                {googleConnected ? 'Connected' : 'Connect'}
              </button>
            </div>

            {/* WhatsApp */}
            <div className="flex justify-between items-center p-3 bg-bg-primary/45 rounded-xl border border-border-subtle">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center border border-green-500/15">
                  <MessageSquare size={15} />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">WhatsApp Number</span>
                  <span className="text-[10px] text-text-muted">Auto nudges & notice alerts</span>
                </div>
              </div>
              <button 
                onClick={toggleWhatsapp}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider border transition-colors ${
                  whatsappConnected 
                    ? 'border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/20' 
                    : 'border-border-subtle bg-bg-elevated text-text-muted hover:text-white'
                }`}
              >
                {whatsappConnected ? 'Connected' : 'Connect'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Profile Details Form */}
      <div className="flex-[1.5] flex flex-col">
        <div className="card-glass p-6 rounded-2xl flex-1 flex flex-col justify-between border-border-subtle/80 bg-bg-surface/50">
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
              <h3 className="font-bold text-white text-base">Account Profile Settings</h3>
              {!isEditing && (
                <button 
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-3.5 py-1.5 bg-accent-primary/10 border border-accent-primary/20 text-accent-primary rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-accent-primary/15 transition-all active:scale-[0.97]"
                >
                  <Edit size={12} /> Edit Details
                </button>
              )}
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 text-text-muted w-4.5 h-4.5" />
                  <input 
                    required 
                    disabled={!isEditing}
                    type="text" 
                    className="w-full bg-bg-primary/50 border border-border-subtle rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-accent-primary text-sm disabled:opacity-55"
                    value={profileData.name} 
                    onChange={e => setProfileData({...profileData, name: e.target.value})} 
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 text-text-muted w-4.5 h-4.5" />
                  <input 
                    required 
                    disabled={!isEditing}
                    type="email" 
                    className="w-full bg-bg-primary/50 border border-border-subtle rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-accent-primary text-sm disabled:opacity-55"
                    value={profileData.email} 
                    onChange={e => setProfileData({...profileData, email: e.target.value})} 
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">WhatsApp Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 text-text-muted w-4.5 h-4.5" />
                  <input 
                    required 
                    disabled={!isEditing}
                    type="tel" 
                    className="w-full bg-bg-primary/50 border border-border-subtle rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-accent-primary text-sm disabled:opacity-55"
                    value={profileData.phone} 
                    onChange={e => setProfileData({...profileData, phone: e.target.value})} 
                  />
                </div>
              </div>

              {/* Branch / Year */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Branch</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3.5 top-3 text-text-muted w-4 h-4" />
                    <select 
                      disabled={!isEditing}
                      className="w-full bg-bg-primary/50 border border-border-subtle rounded-xl pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-accent-primary text-sm appearance-none disabled:opacity-55"
                      value={profileData.branch} 
                      onChange={e => setProfileData({...profileData, branch: e.target.value})}
                    >
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                      <option value="ME">ME</option>
                      <option value="CE">CE</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Year</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3.5 top-3 text-text-muted w-4 h-4" />
                    <select 
                      disabled={!isEditing}
                      className="w-full bg-bg-primary/50 border border-border-subtle rounded-xl pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-accent-primary text-sm appearance-none disabled:opacity-55"
                      value={profileData.year} 
                      onChange={e => setProfileData({...profileData, year: e.target.value})}
                    >
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Buttons */}
            {isEditing && (
              <div className="flex gap-3 justify-end mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-border-subtle hover:bg-bg-elevated text-white rounded-xl text-xs font-bold transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-accent-primary text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:scale-[1.01] transition-all shadow-md active:scale-[0.98]"
                >
                  <Check size={14} /> Save Profile Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
