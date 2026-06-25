import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Calendar, Sparkles, LogIn, UserPlus, Lock, Mail, Phone, BookOpen, GraduationCap, ChevronRight } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Landing() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    branch: 'CSE',
    year: '1',
    phone: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        // Login endpoint
        const res = await api.post('/auth/login', { email: formData.email, password: formData.password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('student_id', res.data.student_id);
        localStorage.setItem('student_name', res.data.name);
        toast.success(`Welcome back, ${res.data.name}!`);
        navigate('/dashboard');
      } else {
        // Register endpoint
        const res = await api.post('/auth/register', { 
          name: formData.name, 
          email: formData.email, 
          password: formData.password, 
          branch: formData.branch, 
          year: parseInt(formData.year), 
          phone: formData.phone,
          subjects: ['OS', 'DBMS', 'CN', 'AI'] 
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('student_id', res.data.student_id);
        localStorage.setItem('student_name', res.data.name);
        toast.success('Registration successful!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(isLogin ? 'Login failed' : 'Registration failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Connecting to Google...',
        success: () => {
          localStorage.setItem('token', 'mock_google_token');
          localStorage.setItem('student_id', '11111111-2222-3333-4444-555555555555');
          localStorage.setItem('student_name', 'Allan Developer');
          navigate('/dashboard');
          return 'Google Account connected!';
        },
        error: 'Google login failed'
      }
    );
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Please enter your email first");
      return;
    }
    toast.success(`Password reset link sent to ${formData.email}`);
  };

  return (
    <div className="min-h-screen bg-bg-primary relative overflow-hidden flex flex-col md:flex-row">
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-mesh opacity-30 z-0"></div>
      
      {/* LEFT: Hero Section & Illustration */}
      <div className="flex-1 flex flex-col justify-center px-8 py-16 md:px-16 lg:px-24 relative z-10 select-none bg-gradient-to-br from-bg-primary via-bg-primary to-accent-primary/5">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-accent-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent-secondary/5 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-12">
          <div className="w-10 h-10 rounded-xl bg-accent-primary flex items-center justify-center text-white shadow-[0_0_20px_rgba(108,99,255,0.4)]">
            <GraduationCap size={24} />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-white">Campus<span className="text-accent-primary">Flow</span></span>
        </div>

        {/* Tagline & Headline */}
        <h1 className="font-display text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
          Never Miss a <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary">Deadline</span> Again.
        </h1>
        <p className="text-lg text-text-muted mb-10 max-w-lg leading-relaxed">
          The ultimate student productivity platform. CampusFlow integrates your academic tasks, WhatsApp reminders, and Google Calendar into one AI-driven dashboard.
        </p>

        {/* Graphic Illustration */}
        <div className="flex gap-4 max-w-md">
          <div className="card-glass flex-1 p-5 rounded-2xl border-accent-primary/20 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary"><Sparkles size={20} /></div>
            <h4 className="font-bold text-white text-sm">AI Study Assistant</h4>
            <p className="text-xs text-text-muted">Personal roadmaps, summaries, and smart quizzes.</p>
          </div>
          <div className="card-glass flex-1 p-5 rounded-2xl border-accent-secondary/20 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-secondary/20 flex items-center justify-center text-accent-secondary"><MessageCircle size={20} /></div>
            <h4 className="font-bold text-white text-sm">WhatsApp Alerts</h4>
            <p className="text-xs text-text-muted">Auto reminders sent to your phone before due dates.</p>
          </div>
        </div>
      </div>

      {/* RIGHT: Login / Register card */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16 relative z-10">
        <motion.div 
          layout
          className="card-glass w-full max-w-md p-8 rounded-2xl shadow-2xl relative border border-border-subtle bg-bg-surface/80"
        >
          {/* Form Tabs */}
          <div className="flex border-b border-border-subtle mb-6 pb-2">
            <button 
              onClick={() => { setIsLogin(true); }}
              className={`flex-1 text-center pb-2 font-display font-semibold transition-all duration-200 ${isLogin ? 'text-white border-b-2 border-accent-primary' : 'text-text-muted hover:text-white'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setIsLogin(false); }}
              className={`flex-1 text-center pb-2 font-display font-semibold transition-all duration-200 ${!isLogin ? 'text-white border-b-2 border-accent-primary' : 'text-text-muted hover:text-white'}`}
            >
              Register
            </button>
          </div>

          <h3 className="text-xl font-bold text-white mb-6 font-display flex items-center gap-2">
            {isLogin ? <><LogIn size={20} className="text-accent-primary" /> Log In to CampusFlow</> : <><UserPlus size={20} className="text-accent-primary" /> Create Student Account</>}
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {/* Full Name (Register Only) */}
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  key="fullname-container"
                >
                  <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Full Name</label>
                  <div className="relative">
                    <UserPlus className="absolute left-3.5 top-3 text-text-muted w-4 h-4" />
                    <input 
                      required={!isLogin} 
                      type="text" 
                      placeholder="John Doe" 
                      className="w-full bg-bg-primary/50 border border-border-subtle rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-accent-primary transition-all text-sm"
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>
                </motion.div>
              )}

              {/* Email */}
              <div key="email-container">
                <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 text-text-muted w-4 h-4" />
                  <input 
                    required 
                    type="email" 
                    placeholder="john@university.edu" 
                    className="w-full bg-bg-primary/50 border border-border-subtle rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-accent-primary transition-all text-sm"
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
              </div>

              {/* Password */}
              <div key="password-container">
                <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 text-text-muted w-4 h-4" />
                  <input 
                    required 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full bg-bg-primary/50 border border-border-subtle rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-accent-primary transition-all text-sm"
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                  />
                </div>
              </div>

              {/* Phone (Register Only) */}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-4"
                  key="register-fields-container"
                >
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">WhatsApp Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 text-text-muted w-4 h-4" />
                      <input 
                        required={!isLogin} 
                        type="tel" 
                        placeholder="919876543210 (with country code)" 
                        className="w-full bg-bg-primary/50 border border-border-subtle rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-accent-primary transition-all text-sm"
                        value={formData.phone} 
                        onChange={e => setFormData({...formData, phone: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Branch</label>
                      <div className="relative">
                        <BookOpen className="absolute left-3.5 top-3 text-text-muted w-4 h-4 animate-none" />
                        <select 
                          className="w-full bg-bg-primary/50 border border-border-subtle rounded-xl pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-accent-primary transition-all text-sm appearance-none"
                          value={formData.branch} 
                          onChange={e => setFormData({...formData, branch: e.target.value})}
                        >
                          <option value="CSE">CSE</option>
                          <option value="ECE">ECE</option>
                          <option value="ME">ME</option>
                          <option value="CE">CE</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Academic Year</label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3.5 top-3 text-text-muted w-4 h-4 animate-none" />
                        <select 
                          className="w-full bg-bg-primary/50 border border-border-subtle rounded-xl pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-accent-primary transition-all text-sm appearance-none"
                          value={formData.year} 
                          onChange={e => setFormData({...formData, year: e.target.value})}
                        >
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Remember Me / Forgot Password (Login Only) */}
            {isLogin && (
              <div className="flex items-center justify-between mt-1 text-xs" key="login-options">
                <label className="flex items-center gap-2 cursor-pointer text-text-muted hover:text-white transition-colors select-none">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 accent-accent-primary border-border-subtle rounded cursor-pointer"
                    checked={formData.rememberMe}
                    onChange={e => setFormData({...formData, rememberMe: e.target.checked})}
                  />
                  Remember Me
                </label>
                <a href="#" onClick={handleForgotPassword} className="text-accent-primary hover:underline font-medium">Forgot Password?</a>
              </div>
            )}

            {/* Google Account Link Check (Register Only) */}
            {!isLogin && (
              <div className="mt-1 text-xs text-text-muted flex items-start gap-2" key="register-options">
                <input 
                  required 
                  type="checkbox" 
                  id="glink"
                  className="mt-0.5 w-4 h-4 accent-accent-primary border-border-subtle rounded cursor-pointer"
                />
                <label htmlFor="glink" className="cursor-pointer hover:text-white transition-colors">
                  I agree to link my Google Account for Calendar automation
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary mt-3 py-3 w-full flex justify-center items-center gap-2 font-semibold shadow-lg hover:shadow-accent-primary/20"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                <>
                  {isLogin ? 'Sign In to Dashboard' : 'Complete Registration'}
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <span className="h-[1px] bg-border-subtle flex-1"></span>
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Or continue with</span>
            <span className="h-[1px] bg-border-subtle flex-1"></span>
          </div>

          {/* Social Sign-In */}
          <button 
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 bg-bg-primary/50 hover:bg-bg-elevated border border-border-subtle rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98]"
          >
            <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            {isLogin ? 'Google Sign In' : 'Link Google Account'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
