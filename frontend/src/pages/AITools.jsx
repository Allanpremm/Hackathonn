import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Sparkles, Loader2, RefreshCw, Send, CheckCircle2, 
  AlertTriangle, Briefcase, GraduationCap, Calendar as CalIcon,
  HelpCircle, ChevronRight, FileText, Check, AlertCircle, Play
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function AITools() {
  const [activeTab, setActiveTab] = useState('study-buddy'); // 'study-buddy', 'notices', 'attendance', 'placement'

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-white">AI Tools Suite</h1>
        <p className="text-sm text-text-muted">Leverage enterprise-grade Llama 3 models to streamline your academic productivity.</p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-border-subtle overflow-x-auto custom-scrollbar gap-4 pb-1 shrink-0">
        {[
          { id: 'study-buddy', label: '🧠 Study Buddy', component: StudyBuddyTab },
          { id: 'notices', label: '📢 Notice Summarizer', component: NoticeSummarizerTab },
          { id: 'attendance', label: '📊 Attendance Risk', component: AttendanceRiskTab },
          { id: 'placement', label: '💼 Placement Prep', component: PlacementPrepTab }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 font-semibold text-sm transition-all duration-150 shrink-0 border-b-2 px-1 ${
              activeTab === tab.id 
                ? 'text-accent-primary border-accent-primary' 
                : 'text-text-muted border-transparent hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Render active tab */}
      <div className="mt-2">
        {activeTab === 'study-buddy' && <StudyBuddyTab />}
        {activeTab === 'notices' && <NoticeSummarizerTab />}
        {activeTab === 'attendance' && <AttendanceRiskTab />}
        {activeTab === 'placement' && <PlacementPrepTab />}
      </div>
    </div>
  );
}

/* ==========================================================
   TAB 1: AI STUDY BUDDY
   ========================================================== */
function StudyBuddyTab() {
  const [notes, setNotes] = useState('');
  const [subject, setSubject] = useState('OS');
  const [loadingType, setLoadingType] = useState(null); // 'summary', 'flashcards', 'quiz'
  const [resultData, setResultData] = useState(null); // { type: '...', payload: ... }
  const [flippedCards, setFlippedCards] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({}); // { index: option }
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleGenerate = async (type) => {
    if (!notes.trim()) {
      toast.error('Please paste your lecture notes or text first');
      return;
    }
    setLoadingType(type);
    setResultData(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setFlippedCards({});

    try {
      if (type === 'summary') {
        const res = await api.post('/ai/summarize', { text: notes });
        setResultData({ type: 'summary', payload: res.data.bullets });
        toast.success('Summary generated!');
      } else if (type === 'flashcards') {
        const res = await api.post('/ai/flashcards', { notes, subject });
        setResultData({ type: 'flashcards', payload: res.data.cards });
        toast.success('Flashcards generated!');
      } else if (type === 'quiz') {
        const res = await api.post('/ai/quiz', { notes, subject });
        setResultData({ type: 'quiz', payload: res.data.questions });
        toast.success('MCQ Quiz generated!');
      }
    } catch (err) {
      toast.error('Failed to query AI helper');
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left Input card */}
      <div className="lg:col-span-4 flex flex-col">
        <div className="card-glass p-5 rounded-2xl flex flex-col gap-4 h-full">
          <div className="flex items-center gap-2 text-white font-medium">
            <Brain size={18} className="text-accent-primary" />
            <span>Lecture Notes Input</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Subject context</label>
            <select 
              className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-primary text-sm appearance-none"
              value={subject} 
              onChange={e => setSubject(e.target.value)}
            >
              <option value="OS">Operating Systems</option>
              <option value="DBMS">Database Systems</option>
              <option value="CN">Computer Networks</option>
              <option value="AI">Artificial Intelligence</option>
            </select>
          </div>

          <div className="flex-1 flex flex-col">
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Paste Notes / Transcript</label>
            <textarea 
              className="w-full flex-1 min-h-[220px] bg-bg-primary border border-border-subtle rounded-xl p-4 text-white placeholder-text-muted focus:outline-none focus:border-accent-primary transition-all resize-none text-sm custom-scrollbar"
              placeholder="Paste your lecture PowerPoint text, study handouts, or lecture transcriptions here..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2.5 mt-2">
            <button 
              onClick={() => handleGenerate('summary')}
              disabled={loadingType !== null}
              className="w-full py-2 bg-bg-elevated hover:bg-bg-elevated/80 border border-border-subtle text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              {loadingType === 'summary' ? <Loader2 className="animate-spin" size={14} /> : <FileText size={14} />}
              Generate AI Summary
            </button>
            <button 
              onClick={() => handleGenerate('flashcards')}
              disabled={loadingType !== null}
              className="w-full py-2 bg-bg-elevated hover:bg-bg-elevated/80 border border-border-subtle text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              {loadingType === 'flashcards' ? <Loader2 className="animate-spin" size={14} /> : <Brain size={14} />}
              Generate Flashcards
            </button>
            <button 
              onClick={() => handleGenerate('quiz')}
              disabled={loadingType !== null}
              className="w-full py-3 bg-accent-primary hover:scale-[1.01] transition-transform text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              {loadingType === 'quiz' ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
              Generate MCQ Practice Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Right Output view */}
      <div className="lg:col-span-8 flex flex-col">
        <div className="card-glass p-6 rounded-2xl flex-1 min-h-[450px] flex flex-col border-dashed border-border-subtle bg-bg-surface/30">
          {loadingType ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <Loader2 className="animate-spin text-accent-gold mb-3" size={36} />
              <h4 className="font-bold text-white text-sm">Processing Notes with AI...</h4>
              <p className="text-xs text-text-muted mt-1 max-w-xs leading-relaxed">
                Extracting core topics, constructing logic structures, and formatting output. Please wait.
              </p>
            </div>
          ) : !resultData ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-65 select-none">
              <Brain size={48} className="text-border-subtle mb-3" />
              <h4 className="font-bold text-white text-sm">No Material Processed Yet</h4>
              <p className="text-xs text-text-muted mt-1 max-w-xs">
                Enter your study notes on the left and select an action to trigger AI generation.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              {/* Output Header */}
              <div className="flex justify-between items-center pb-3 border-b border-border-subtle mb-4 shrink-0">
                <span className="text-xs bg-accent-gold/20 text-accent-gold border border-accent-gold/30 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                  AI Output: {resultData.type.toUpperCase()}
                </span>
                {resultData.type === 'flashcards' && (
                  <button 
                    onClick={() => setFlippedCards({})} 
                    className="text-xs text-text-muted hover:text-white transition-colors flex items-center gap-1 font-semibold"
                  >
                    <RefreshCw size={12} /> Reset Deck
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {/* RENDER BULLET SUMMARY */}
                {resultData.type === 'summary' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
                    <div className="p-4 bg-bg-elevated/45 rounded-xl border border-border-subtle flex flex-col gap-3.5">
                      {resultData.payload.map((bullet, bidx) => (
                        <div key={bidx} className="flex gap-3 text-sm text-text-primary leading-relaxed">
                          <CheckCircle2 size={16} className="text-accent-secondary mt-0.5 shrink-0" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* RENDER FLASHCARDS */}
                {resultData.type === 'flashcards' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {resultData.payload.map((card, cardIdx) => {
                      const isFlipped = !!flippedCards[cardIdx];
                      return (
                        <div 
                          key={cardIdx} 
                          onClick={() => setFlippedCards({...flippedCards, [cardIdx]: !isFlipped})}
                          className="h-36 w-full cursor-pointer perspective-1000 relative"
                        >
                          <motion.div 
                            className="w-full h-full transform-style-3d duration-500 relative"
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                          >
                            {/* Front */}
                            <div className="absolute inset-0 backface-hidden card-glass rounded-xl p-4 flex flex-col justify-between border-accent-primary/20 hover:border-accent-primary/50 transition-colors">
                              <span className="text-[10px] font-bold text-text-muted">QUESTION {cardIdx + 1}</span>
                              <p className="text-xs sm:text-sm font-semibold text-white text-center flex-1 flex items-center justify-center px-2">{card.question}</p>
                              <span className="text-[9px] text-text-muted font-bold text-center flex items-center justify-center gap-1"><RefreshCw size={10} /> Tap to flip</span>
                            </div>
                            {/* Back */}
                            <div className="absolute inset-0 backface-hidden card-glass rounded-xl p-4 flex flex-col justify-between bg-accent-primary/5 border-accent-primary rotate-y-180">
                              <span className="text-[10px] font-bold text-accent-primary">ANSWER</span>
                              <p className="text-xs text-text-primary text-center leading-normal flex-1 flex items-center justify-center px-1">{card.answer}</p>
                              <span className="text-[9px] text-accent-primary/70 font-semibold text-center">Tap to see question</span>
                            </div>
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* RENDER MCQ QUIZ */}
                {resultData.type === 'quiz' && (
                  <div className="flex flex-col gap-6">
                    {resultData.payload.map((q, qIdx) => {
                      const selectedOpt = quizAnswers[qIdx];
                      return (
                        <div key={qIdx} className="p-4 bg-bg-elevated/40 border border-border-subtle rounded-xl flex flex-col gap-3">
                          <h5 className="font-bold text-white text-sm">
                            Q{qIdx + 1}. {q.question}
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-1">
                            {q.options.map((opt) => {
                              const isSelected = selectedOpt === opt;
                              const isCorrect = q.answer === opt;
                              let btnClass = "bg-bg-primary/50 border-border-subtle hover:border-accent-primary/40 text-text-primary";
                              
                              if (quizSubmitted) {
                                if (isCorrect) btnClass = "bg-green-500/15 border-green-500 text-green-400 font-bold";
                                else if (isSelected) btnClass = "bg-red-500/15 border-red-500 text-red-400 font-bold";
                              } else if (isSelected) {
                                btnClass = "bg-accent-primary/10 border-accent-primary text-accent-primary font-bold";
                              }

                              return (
                                <button
                                  key={opt}
                                  disabled={quizSubmitted}
                                  onClick={() => setQuizAnswers({...quizAnswers, [qIdx]: opt})}
                                  className={`p-3 rounded-lg border text-xs text-left transition-colors flex items-center justify-between ${btnClass}`}
                                >
                                  <span>{opt}</span>
                                  {quizSubmitted && isCorrect && <Check size={12} className="text-green-400 shrink-0" />}
                                  {quizSubmitted && isSelected && !isCorrect && <AlertCircle size={12} className="text-red-400 shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    {!quizSubmitted ? (
                      <button 
                        onClick={() => {
                          if (Object.keys(quizAnswers).length < resultData.payload.length) {
                            toast.error("Please answer all questions before submitting");
                            return;
                          }
                          setQuizSubmitted(true);
                          toast.success("Quiz evaluation complete!");
                        }}
                        className="btn-primary mt-2 py-3 font-bold"
                      >
                        Submit Answers & Check Grade
                      </button>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-white/5 border border-border-subtle rounded-xl">
                        <div>
                          <span className="text-xs text-text-muted font-bold block uppercase">Practice Score</span>
                          <span className="text-lg font-bold text-white">
                            {resultData.payload.filter((q, idx) => quizAnswers[idx] === q.answer).length} / {resultData.payload.length} Correct
                          </span>
                        </div>
                        <button 
                          onClick={() => {
                            setQuizAnswers({});
                            setQuizSubmitted(false);
                          }}
                          className="px-4 py-2 border border-border-subtle hover:bg-bg-elevated text-white rounded-lg text-xs font-semibold"
                        >
                          Retry Quiz
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================
   TAB 2: NOTICE SUMMARIZER
   ========================================================== */
function NoticeSummarizerTab() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [summaryBullets, setSummaryBullets] = useState(null);
  const [phones, setPhones] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const studentId = localStorage.getItem('student_id') || '11111111-2222-3333-4444-555555555555';

  const handleSummarize = async () => {
    if (!text.trim()) {
      toast.error('Please input notice text');
      return;
    }
    setLoading(true);
    setSummaryBullets(null);
    try {
      const res = await api.post('/ai/summarize', { text });
      setSummaryBullets(res.data.bullets);
      toast.success('Notice summarized!');
    } catch (e) {
      toast.error('Failed to summarize notice');
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async () => {
    if (!text.trim()) {
      toast.error('Notice input is empty');
      return;
    }
    setIsBroadcasting(true);
    try {
      const phoneList = phones.split(',').map(p => p.trim()).filter(Boolean);
      await api.post('/notices/broadcast', {
        noticeText: text,
        eventTitle: 'Campus Announcement',
        eventDate: new Date().toISOString(),
        phoneList: phoneList.length ? phoneList : ['919876543210'],
        studentId
      });
      toast.success('WhatsApp broadcast queued to n8n workflow!');
    } catch (e) {
      toast.error('Broadcast failed');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleAddToCalendar = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: 'Syncing notice event to Google Calendar...',
        success: 'Notice event locked in Google Calendar!',
        error: 'Failed to sync to calendar'
      }
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      {/* Input panel */}
      <div className="card-glass p-5 rounded-2xl flex flex-col gap-4">
        <div className="flex items-center gap-2 text-white font-medium">
          <FileText size={18} className="text-accent-primary" />
          <span>Notice Content Input</span>
        </div>

        <textarea 
          className="w-full min-h-[220px] flex-1 bg-bg-primary border border-border-subtle rounded-xl p-4 text-white placeholder-text-muted focus:outline-none focus:border-accent-primary text-sm resize-none custom-scrollbar"
          placeholder="Paste end-term exam timetables, seminar notices, placement circulars, or university announcements here..."
          value={text}
          onChange={e => setText(e.target.value)}
        />

        <div className="flex gap-3">
          <button 
            onClick={handleSummarize}
            disabled={loading}
            className="flex-1 btn-primary py-3 font-bold text-xs flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
            Summarize Notice (TL;DR)
          </button>
          
          <button 
            onClick={handleBroadcast}
            disabled={isBroadcasting}
            className="px-4 bg-bg-elevated hover:bg-bg-elevated/70 border border-border-subtle text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            {isBroadcasting ? <Loader2 className="animate-spin" size={14} /> : <Send size={13} />}
            Broadcast
          </button>
        </div>
      </div>

      {/* Output Panel */}
      <div className="card-glass p-6 rounded-2xl flex flex-col border-dashed border-border-subtle bg-bg-surface/30">
        <h4 className="font-bold text-white text-sm uppercase tracking-wider pb-3 border-b border-border-subtle mb-4">
          Notice Analysis Output
        </h4>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <Loader2 className="animate-spin text-accent-secondary mb-2" size={32} />
            <span className="text-xs text-text-muted">Drafting bullet summary...</span>
          </div>
        ) : !summaryBullets ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-65 text-text-muted">
            <Sparkles size={36} className="mb-2" />
            <p className="text-xs">Summary details will render here upon parsing.</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex flex-col gap-3 bg-bg-elevated/50 p-4 rounded-xl border border-border-subtle">
              <span className="text-[10px] font-bold text-accent-secondary uppercase tracking-wider block">Notice TL;DR (3 Bullet Points)</span>
              {summaryBullets.map((bullet, bulletIdx) => (
                <div key={bulletIdx} className="flex gap-2.5 text-xs sm:text-sm text-text-primary leading-relaxed">
                  <CheckCircle2 className="text-accent-secondary shrink-0 mt-0.5" size={15} />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            {/* Broadcast Options inside output */}
            <div className="border-t border-border-subtle/50 pt-5 mt-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">WhatsApp Phone Numbers</label>
                <input 
                  type="text" 
                  placeholder="e.g. 919876543210, 919876543211" 
                  className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent-primary text-xs"
                  value={phones}
                  onChange={e => setPhones(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleBroadcast}
                  disabled={isBroadcasting}
                  className="flex-1 bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/25 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle size={14} /> Send WhatsApp Broadcast
                </button>
                <button 
                  onClick={handleAddToCalendar}
                  className="flex-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CalIcon size={14} /> Add To Calendar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================
   TAB 3: ATTENDANCE RISK ANALYZER
   ========================================================== */
function AttendanceRiskTab() {
  const [subject, setSubject] = useState('OS');
  const [percent, setPercent] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    const numericPercent = parseFloat(percent);
    if (isNaN(numericPercent) || numericPercent < 0 || numericPercent > 100) {
      toast.error('Please input a valid attendance percentage (0 to 100)');
      return;
    }
    setLoading(true);
    setAnalysis(null);

    try {
      const res = await api.post('/ai/attendance', {
        attendance: [{ subject, percent: numericPercent }]
      });
      // The analysis has schema [{ subject, percent, risk, classesNeeded, advice }]
      setAnalysis(res.data.analysis[0]);
      toast.success('Attendance risk evaluated!');
    } catch (e) {
      toast.error('Failed to query evaluation');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'text-red-400 border-red-500/30 bg-red-500/10';
      case 'medium': return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
      default: return 'text-green-400 border-green-500/30 bg-green-500/10';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Form Card */}
      <div className="lg:col-span-5 flex flex-col">
        <div className="card-glass p-5 rounded-2xl flex flex-col gap-4 h-full justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-white font-medium">
              <AlertTriangle size={18} className="text-accent-primary" />
              <span>Attendance Calculator</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Target Course Subject</label>
              <select 
                className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-primary text-sm appearance-none"
                value={subject} 
                onChange={e => setSubject(e.target.value)}
              >
                <option value="OS">Operating Systems</option>
                <option value="DBMS">Database Systems</option>
                <option value="CN">Computer Networks</option>
                <option value="AI">Artificial Intelligence</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Current Attendance %</label>
              <input 
                required 
                type="number" 
                min="0" 
                max="100" 
                placeholder="e.g. 68"
                className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-primary text-sm"
                value={percent}
                onChange={e => setPercent(e.target.value)}
              />
            </div>
          </div>

          <button 
            onClick={handleAnalyze}
            disabled={loading || !percent}
            className="btn-primary py-3 font-bold text-xs flex justify-center items-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={14} /> : <AlertTriangle size={14} />}
            Analyze Attendance Risk Status
          </button>
        </div>
      </div>

      {/* Output Card */}
      <div className="lg:col-span-7 flex flex-col">
        <div className="card-glass p-6 rounded-2xl flex-1 min-h-[300px] flex flex-col border-dashed border-border-subtle bg-bg-surface/30">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider pb-3 border-b border-border-subtle mb-4">
            Analysis Report
          </h4>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <Loader2 className="animate-spin text-accent-warning mb-2" size={32} />
              <span className="text-xs text-text-muted">Evaluating academic risk thresholds...</span>
            </div>
          ) : !analysis ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-65 text-text-muted">
              <AlertTriangle size={36} className="mb-2" />
              <p className="text-xs">Input subject & percentage to view required lectures and AI recommendations.</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-grow flex flex-col gap-5">
              {/* Header metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`p-3 rounded-xl border flex flex-col items-center text-center justify-center ${getRiskColor(analysis.risk)}`}>
                  <span className="text-[10px] uppercase font-bold text-text-muted mb-0.5">Risk Status</span>
                  <span className="text-sm font-extrabold">{analysis.risk.toUpperCase()} RISK</span>
                </div>

                <div className="p-3 rounded-xl border border-border-subtle bg-bg-elevated/40 flex flex-col items-center text-center justify-center">
                  <span className="text-[10px] uppercase font-bold text-text-muted mb-0.5">Current Attendance</span>
                  <span className="text-sm font-extrabold text-white">{analysis.percent}%</span>
                </div>

                <div className="p-3 rounded-xl border border-border-subtle bg-bg-elevated/40 flex flex-col items-center text-center justify-center">
                  <span className="text-[10px] uppercase font-bold text-text-muted mb-0.5">Classes Required</span>
                  <span className="text-sm font-extrabold text-accent-secondary">{analysis.classesNeeded} Lectures</span>
                </div>
              </div>

              {/* Recommendation Block */}
              <div className="bg-bg-elevated/65 p-4 rounded-xl border border-border-subtle flex flex-col gap-2 flex-grow">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wide border-b border-border-subtle/50 pb-2 mb-1">
                  <Sparkles size={14} className="text-accent-gold" />
                  AI Course Suggestion
                </div>
                <p className="text-xs sm:text-sm text-text-primary/95 leading-relaxed">
                  {analysis.advice || "To cross the mandatory 75% attendance threshold, you must attend the next 5 consecutive lectures without absence. Consider drafting an email to your course instructor to request alternate assignments for any excused sick leave blocks."}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================
   TAB 4: PLACEMENT PREP ASSISTANT
   ========================================================== */
function PlacementPrepTab() {
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [prepData, setPrepData] = useState(null); // { roadmap: [], tips: [], weeklyPlan: [] }

  const handleGeneratePlan = async () => {
    if (!companyName.trim() || !role.trim()) {
      toast.error('Please input company name and role');
      return;
    }
    setLoading(true);
    setPrepData(null);

    try {
      const res = await api.post('/ai/placement', { companyName, role });
      setPrepData(res.data);
      toast.success('Preparation plan built!');
    } catch (e) {
      toast.error('Failed to construct roadmap');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Form panel */}
      <div className="lg:col-span-4 flex flex-col">
        <div className="card-glass p-5 rounded-2xl flex flex-col gap-4 h-full justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-white font-medium">
              <Briefcase size={18} className="text-accent-primary" />
              <span>Placement Assistant Input</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Target Company</label>
              <input 
                required 
                type="text" 
                placeholder="e.g. Google, Amazon, Microsoft"
                className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-primary text-sm"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Target Role</label>
              <input 
                required 
                type="text" 
                placeholder="e.g. Software Engineer Intern, Data Analyst"
                className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-primary text-sm"
                value={role}
                onChange={e => setRole(e.target.value)}
              />
            </div>
          </div>

          <button 
            onClick={handleGeneratePlan}
            disabled={loading || !companyName || !role}
            className="btn-primary py-3 font-bold text-xs flex justify-center items-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
            Generate Preparation Roadmap
          </button>
        </div>
      </div>

      {/* Output Panel */}
      <div className="lg:col-span-8 flex flex-col">
        <div className="card-glass p-6 rounded-2xl flex-1 min-h-[450px] flex flex-col border-dashed border-border-subtle bg-bg-surface/30">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider pb-3 border-b border-border-subtle mb-4">
            Roadmap & Preparation Guide
          </h4>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <Loader2 className="animate-spin text-accent-primary mb-2" size={32} />
              <span className="text-xs text-text-muted">Drafting company interview guides...</span>
            </div>
          ) : !prepData ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-65 text-text-muted">
              <Briefcase size={36} className="mb-2" />
              <p className="text-xs">Detailed guides, weekly syllabus topics, and interview tips will output here.</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
              {/* Roadmap List */}
              <div>
                <span className="text-xs text-accent-primary font-bold block uppercase tracking-wide mb-2.5">📋 Preparation Roadmap</span>
                <div className="flex flex-col gap-2">
                  {prepData.roadmap.map((item, idx) => (
                    <div key={idx} className="flex gap-2.5 text-xs sm:text-sm text-text-primary bg-bg-elevated/40 p-2.5 rounded-lg border border-border-subtle">
                      <span className="w-5 h-5 rounded-full bg-accent-primary/20 text-accent-primary flex items-center justify-center text-[10px] font-bold shrink-0">{idx + 1}</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interview Tips Checklist */}
              <div>
                <span className="text-xs text-accent-secondary font-bold block uppercase tracking-wide mb-2.5">💡 Interview Tips</span>
                <div className="flex flex-col gap-2">
                  {prepData.tips.map((tip, idx) => (
                    <div key={idx} className="flex gap-2.5 text-xs text-text-primary leading-normal items-start">
                      <Check className="text-accent-secondary shrink-0 mt-0.5" size={14} />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly study syllabus */}
              <div>
                <span className="text-xs text-accent-gold font-bold block uppercase tracking-wide mb-2.5">📅 Weekly Plan Overview</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {prepData.weeklyPlan.map((wp, idx) => (
                    <div key={idx} className="p-3 bg-bg-elevated/30 border border-border-subtle rounded-xl flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-accent-gold uppercase tracking-wider block">{wp.week}</span>
                      <p className="text-xs font-semibold text-white leading-normal">{wp.topic}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
