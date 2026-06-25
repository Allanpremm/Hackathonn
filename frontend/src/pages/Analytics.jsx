import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle, AlertTriangle, Clock, BarChart2, PieChart, Info, BookOpen } from 'lucide-react';

export default function Analytics() {
  // Statistics metrics
  const stats = [
    { label: 'Total Tasks Created', value: 12, icon: BarChart2, color: 'text-blue-400 bg-blue-500/10' },
    { label: 'Tasks Completed', value: 9, icon: CheckCircle, color: 'text-green-400 bg-green-500/10' },
    { label: 'Tasks Missed / Overdue', value: 1, icon: AlertTriangle, color: 'text-red-400 bg-red-500/10' },
    { label: 'Average Study Time', value: '3.8 hrs/day', icon: Clock, color: 'text-accent-primary bg-accent-primary/10' }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Productivity Analytics</h1>
        <p className="text-sm text-text-muted">Interactive telemetry monitoring task completions, class attendance, and study velocity metrics.</p>
      </div>

      {/* METRIC SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="card-glass p-5 rounded-2xl border border-border-subtle flex items-center justify-between">
            <div>
              <span className="text-xs text-text-muted font-semibold block uppercase tracking-wider mb-1">{stat.label}</span>
              <span className="text-2xl font-extrabold text-white">{stat.value}</span>
            </div>
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <stat.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: Task Completion Trend (Line Chart) */}
        <div className="card-glass p-6 rounded-2xl flex flex-col gap-4">
          <div className="flex justify-between items-center pb-3 border-b border-border-subtle">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <TrendingUp size={16} className="text-accent-primary" /> Task Completion Trend
            </h3>
            <span className="text-[10px] text-text-muted font-mono">Last 7 Days</span>
          </div>

          <div className="h-56 w-full relative">
            <svg viewBox="0 0 500 200" className="w-full h-full">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6C63FF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6C63FF" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
              <line x1="40" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
              <line x1="40" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
              <line x1="40" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.05)" />

              {/* Area Under Curve */}
              <path 
                d="M 40,170 C 100,120 160,150 220,80 C 280,110 340,60 400,30 L 400,170 Z" 
                fill="url(#lineGrad)" 
              />

              {/* Curve Line */}
              <path 
                d="M 40,170 C 100,120 160,150 220,80 C 280,110 340,60 400,30" 
                fill="none" 
                stroke="#6C63FF" 
                strokeWidth="4" 
                strokeLinecap="round"
              />

              {/* Grid Data Points */}
              <circle cx="40" cy="170" r="5" fill="#0A0C10" stroke="#6C63FF" strokeWidth="3" />
              <circle cx="100" cy="120" r="5" fill="#0A0C10" stroke="#6C63FF" strokeWidth="3" />
              <circle cx="160" cy="150" r="5" fill="#0A0C10" stroke="#6C63FF" strokeWidth="3" />
              <circle cx="220" cy="80" r="5" fill="#0A0C10" stroke="#6C63FF" strokeWidth="3" />
              <circle cx="280" cy="110" r="5" fill="#0A0C10" stroke="#6C63FF" strokeWidth="3" />
              <circle cx="340" cy="60" r="5" fill="#0A0C10" stroke="#6C63FF" strokeWidth="3" />
              <circle cx="400" cy="30" r="5" fill="#0A0C10" stroke="#6C63FF" strokeWidth="3" />

              {/* Labels */}
              <text x="40" y="192" fill="#7A8299" fontSize="10" textAnchor="middle">Mon</text>
              <text x="100" y="192" fill="#7A8299" fontSize="10" textAnchor="middle">Tue</text>
              <text x="160" y="192" fill="#7A8299" fontSize="10" textAnchor="middle">Wed</text>
              <text x="220" y="192" fill="#7A8299" fontSize="10" textAnchor="middle">Thu</text>
              <text x="280" y="192" fill="#7A8299" fontSize="10" textAnchor="middle">Fri</text>
              <text x="340" y="192" fill="#7A8299" fontSize="10" textAnchor="middle">Sat</text>
              <text x="400" y="192" fill="#7A8299" fontSize="10" textAnchor="middle">Sun</text>
            </svg>
          </div>
        </div>

        {/* CHART 2: Weekly Productivity Score (Bar Chart) */}
        <div className="card-glass p-6 rounded-2xl flex flex-col gap-4">
          <div className="flex justify-between items-center pb-3 border-b border-border-subtle">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <BarChart2 size={16} className="text-accent-secondary" /> Weekly Productivity Score
            </h3>
            <span className="text-[10px] text-text-muted font-mono">Overall: 88/100</span>
          </div>

          <div className="h-56 w-full relative">
            <svg viewBox="0 0 500 200" className="w-full h-full">
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D4AA" />
                  <stop offset="100%" stopColor="#00A584" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="30" y1="170" x2="470" y2="170" stroke="rgba(255,255,255,0.08)" />

              {/* Bars */}
              {/* Mon */}
              <rect x="55" y="60" width="28" height="110" fill="url(#barGrad)" rx="6" />
              <text x="69" y="190" fill="#7A8299" fontSize="10" textAnchor="middle">M</text>
              <text x="69" y="50" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">70</text>
              
              {/* Tue */}
              <rect x="115" y="40" width="28" height="130" fill="url(#barGrad)" rx="6" />
              <text x="129" y="190" fill="#7A8299" fontSize="10" textAnchor="middle">T</text>
              <text x="129" y="30" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">85</text>

              {/* Wed */}
              <rect x="175" y="80" width="28" height="90" fill="url(#barGrad)" rx="6" />
              <text x="189" y="190" fill="#7A8299" fontSize="10" textAnchor="middle">W</text>
              <text x="189" y="70" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">55</text>

              {/* Thu */}
              <rect x="235" y="30" width="28" height="140" fill="url(#barGrad)" rx="6" />
              <text x="249" y="190" fill="#7A8299" fontSize="10" textAnchor="middle">T</text>
              <text x="249" y="20" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">92</text>

              {/* Fri */}
              <rect x="295" y="50" width="28" height="120" fill="url(#barGrad)" rx="6" />
              <text x="309" y="190" fill="#7A8299" fontSize="10" textAnchor="middle">F</text>
              <text x="309" y="40" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">78</text>

              {/* Sat */}
              <rect x="355" y="20" width="28" height="150" fill="url(#barGrad)" rx="6" />
              <text x="369" y="190" fill="#7A8299" fontSize="10" textAnchor="middle">S</text>
              <text x="369" y="10" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">98</text>

              {/* Sun */}
              <rect x="415" y="110" width="28" height="60" fill="url(#barGrad)" rx="6" />
              <text x="429" y="190" fill="#7A8299" fontSize="10" textAnchor="middle">S</text>
              <text x="429" y="100" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">40</text>
            </svg>
          </div>
        </div>

        {/* CHART 3: Attendance Analytics (Pie/Donut Grid) */}
        <div className="card-glass p-6 rounded-2xl flex flex-col gap-4">
          <div className="flex justify-between items-center pb-3 border-b border-border-subtle">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <PieChart size={16} className="text-orange-400" /> Course Attendance Analytics
            </h3>
            <span className="text-[10px] text-text-muted font-mono">Min Requirement: 75%</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 h-56">
            {/* Donut SVG */}
            <div className="w-36 h-36 relative flex items-center justify-center shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#FF6B35" 
                  strokeWidth="8" 
                  strokeDasharray="251.2"
                  strokeDashoffset="55" // ~78%
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-white">78%</span>
                <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider">Average</span>
              </div>
            </div>

            {/* Attendance Legends */}
            <div className="flex flex-col gap-2.5 w-full">
              {[
                { subject: 'Operating Systems (OS)', percent: 80, color: 'bg-green-500' },
                { subject: 'Database Systems (DBMS)', percent: 85, color: 'bg-green-500' },
                { subject: 'Computer Networks (CN)', percent: 68, color: 'bg-red-400' },
                { subject: 'Artificial Intelligence (AI)', percent: 79, color: 'bg-green-500' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-bg-surface/50 border border-border-subtle">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                    <span className="font-semibold text-text-primary">{item.subject}</span>
                  </div>
                  <span className={`font-bold font-mono ${item.percent < 75 ? 'text-red-400' : 'text-white'}`}>{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHART 4: Study Hours (Bar Chart) */}
        <div className="card-glass p-6 rounded-2xl flex flex-col gap-4">
          <div className="flex justify-between items-center pb-3 border-b border-border-subtle">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <Clock size={16} className="text-accent-primary" /> Study Hours Velocity
            </h3>
            <span className="text-[10px] text-text-muted font-mono">Week Average: 26.5 hrs</span>
          </div>

          <div className="h-56 w-full flex flex-col justify-around">
            {[
              { label: 'OS prep', hours: 8, pct: 'w-[65%]', color: 'bg-accent-primary' },
              { label: 'DBMS lab questions', hours: 10, pct: 'w-[85%]', color: 'bg-accent-secondary' },
              { label: 'CN socket scripting', hours: 4.5, pct: 'w-[40%]', color: 'bg-accent-warning' },
              { label: 'LeetCode coding problems', hours: 6, pct: 'w-[50%]', color: 'bg-accent-gold' }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-semibold text-text-primary">
                  <span>{item.label}</span>
                  <span className="font-mono text-white font-bold">{item.hours} hrs</span>
                </div>
                {/* Custom Bar progress indicator */}
                <div className="w-full h-2.5 rounded-full bg-white/5 border border-border-subtle overflow-hidden">
                  <div className={`h-full rounded-full ${item.color} ${item.pct}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
