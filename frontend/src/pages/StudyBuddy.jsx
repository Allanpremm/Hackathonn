import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function StudyBuddy() {
  const [notes, setNotes] = useState('');
  const [subject, setSubject] = useState('OS');
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});

  const handleGenerate = async () => {
    if (!notes) {
      toast.error('Please paste your notes');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/ai/flashcards', { notes, subject });
      setFlashcards(res.data.cards);
      setFlippedCards({});
      toast.success('Flashcards generated!');
    } catch (err) {
      toast.error('Failed to generate cards');
    } finally {
      setLoading(false);
    }
  };

  const toggleFlip = (index) => {
    setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-12">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2">AI Study Buddy</h1>
        <p className="text-text-muted">Turn your messy lecture notes into interactive flashcards instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="card-glass p-6 rounded-2xl flex flex-col gap-4 h-full">
            <div className="flex items-center gap-2 text-white font-medium">
              <Brain size={18} className="text-accent-primary" />
              <span>Input Material</span>
            </div>
            
            <div>
              <label className="block text-sm text-text-muted mb-2">Subject</label>
              <select className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent-primary"
                value={subject} onChange={e => setSubject(e.target.value)}>
                <option>OS</option><option>DBMS</option><option>CN</option><option>AI</option>
              </select>
            </div>
            
            <textarea 
              className="w-full flex-1 min-h-[300px] bg-bg-elevated border border-border-subtle rounded-xl p-4 text-white focus:outline-none focus:border-accent-primary transition-colors resize-none custom-scrollbar"
              placeholder="Paste your lecture notes or transcript here..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            ></textarea>
            
            <button 
              onClick={handleGenerate} 
              disabled={loading || !notes}
              className="btn-primary mt-2 py-3 flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={18} /> Generate Flashcards</>}
            </button>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="card-glass p-6 rounded-2xl h-full min-h-[500px] bg-bg-surface/50 border-dashed">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-text-muted">
                <Loader2 className="animate-spin text-accent-primary mb-4" size={40} />
                <p className="animate-pulse">Analyzing notes and extracting key concepts...</p>
              </div>
            ) : !flashcards ? (
              <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-50">
                <Brain size={64} className="mb-4 text-border-subtle" />
                <p>Generated flashcards will appear here</p>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-white text-lg">Your Flashcards ({flashcards.length})</h3>
                  <button onClick={() => setFlippedCards({})} className="flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors">
                    <RefreshCw size={14} /> Reset All
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {flashcards.map((card, i) => (
                    <div 
                      key={i} 
                      className="relative h-48 w-full cursor-pointer perspective-1000"
                      onClick={() => toggleFlip(i)}
                    >
                      <motion.div
                        className="w-full h-full transform-style-3d transition-all duration-500 relative"
                        initial={false}
                        animate={{ rotateY: flippedCards[i] ? 180 : 0 }}
                      >
                        {/* Front */}
                        <div className="absolute inset-0 backface-hidden card-glass rounded-xl p-6 flex flex-col justify-center items-center text-center border-accent-primary/20 hover:border-accent-primary/50 transition-colors">
                          <span className="absolute top-3 left-3 text-xs font-bold text-text-muted">Q{i+1}</span>
                          <p className="text-white font-medium text-lg">{card.question}</p>
                          <span className="absolute bottom-3 text-xs text-text-muted flex items-center gap-1"><RefreshCw size={12}/> Click to flip</span>
                        </div>
                        
                        {/* Back */}
                        <div className="absolute inset-0 backface-hidden card-glass rounded-xl p-6 flex flex-col justify-center items-center text-center bg-accent-primary/5 border-accent-primary shadow-[0_0_15px_rgba(108,99,255,0.1)] rotate-y-180">
                          <span className="absolute top-3 left-3 text-xs font-bold text-accent-primary">Answer</span>
                          <p className="text-white text-base leading-relaxed">{card.answer}</p>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
