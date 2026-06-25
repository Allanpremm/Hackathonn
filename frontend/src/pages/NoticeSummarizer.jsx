import { useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Sparkles, Send, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function NoticeSummarizer() {
  const [text, setText] = useState('');
  const [phones, setPhones] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleBroadcast = async () => {
    if (!text) {
      toast.error("Please paste the notice text first");
      return;
    }
    
    setLoading(true);
    try {
      const studentId = localStorage.getItem('student_id');
      const phoneList = phones.split(',').map(p => p.trim()).filter(Boolean);
      
      const res = await api.post('/notices/broadcast', {
        noticeText: text,
        eventTitle: 'Campus Notice',
        eventDate: new Date().toISOString(),
        phoneList: phoneList.length ? phoneList : ['1234567890'],
        studentId
      });
      
      setResult(res.data.summary);
      toast.success("Notice summarized & broadcasted via n8n!");
    } catch (err) {
      toast.error("Failed to process notice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-12">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2">Notice Summarizer</h1>
        <p className="text-text-muted">Paste long, boring college PDFs/emails. AI summarizes it and broadcasts to your study group via WhatsApp.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
          <div className="card-glass p-6 rounded-2xl flex flex-col gap-4 h-full">
            <div className="flex items-center gap-2 text-white font-medium mb-2">
              <Megaphone size={18} className="text-accent-primary" />
              <span>Input Notice</span>
            </div>
            
            <textarea 
              className="w-full flex-1 min-h-[250px] bg-bg-elevated border border-border-subtle rounded-xl p-4 text-white focus:outline-none focus:border-accent-primary transition-colors resize-none custom-scrollbar"
              placeholder="Paste college notice text here..."
              value={text}
              onChange={e => setText(e.target.value)}
            ></textarea>
            
            <div>
              <label className="block text-sm text-text-muted mb-2">Broadcast to (comma separated numbers)</label>
              <input 
                type="text" 
                placeholder="e.g. 919876543210, 919876543211" 
                className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent-primary"
                value={phones}
                onChange={e => setPhones(e.target.value)}
              />
            </div>
            
            <button 
              onClick={handleBroadcast} 
              disabled={loading || !text}
              className="btn-primary mt-2 py-3 flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={18} /> Summarize & Broadcast</>}
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-4">
          <div className="card-glass p-6 rounded-2xl flex flex-col h-full border-accent-secondary/20 relative overflow-hidden">
            {result && <div className="absolute top-0 right-0 w-32 h-32 bg-accent-secondary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>}
            
            <div className="flex items-center gap-2 text-white font-medium mb-6">
              <Send size={18} className="text-accent-secondary" />
              <span>Broadcast Output</span>
            </div>

            {!result && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-text-muted opacity-50">
                <Sparkles size={48} className="mb-4 text-border-subtle" />
                <p>AI summary will appear here</p>
              </div>
            )}
            
            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent-secondary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 rounded-full bg-accent-secondary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 rounded-full bg-accent-secondary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <p className="mt-4 text-text-muted text-sm animate-pulse">Reading 10-page notice...</p>
              </div>
            )}

            {result && !loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
                <div className="bg-bg-elevated rounded-xl p-5 mb-4 border border-border-subtle">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border-subtle">
                    <span className="text-xs bg-accent-secondary/20 text-accent-secondary px-2 py-1 rounded-md font-bold uppercase">TL;DR</span>
                    <span className="text-sm text-text-muted">Generated by Llama 3</span>
                  </div>
                  <div className="space-y-3">
                    {result.split('\n').map((line, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }}
                        key={i} className="text-white text-sm md:text-base leading-relaxed flex gap-2"
                      >
                        {line}
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-auto bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle2 className="text-green-400" size={24} />
                  <div>
                    <h4 className="text-green-400 font-bold text-sm">Successfully Broadcasted</h4>
                    <p className="text-green-400/70 text-xs">Triggered n8n Workflow 2 via Webhook</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
