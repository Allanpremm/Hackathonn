import { format } from 'date-fns';
import { Smartphone, Calendar as CalIcon, Edit2, Trash2 } from 'lucide-react';
import CountdownRing from './CountdownRing';

export default function TaskCard({ task, onUpdate, onDelete }) {
  const isDone = task.status === 'done';

  return (
    <div className={`card-glass p-4 rounded-xl flex flex-col gap-3 min-w-[300px] flex-1 ${isDone ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start">
        <span className="px-2 py-1 text-xs font-semibold rounded-md bg-accent-primary/20 text-accent-primary uppercase tracking-wider">
          {task.subject}
        </span>
        {!isDone && <CountdownRing deadline={task.deadline} />}
      </div>
      
      <div className="mt-1">
        <h3 className={`font-display font-bold text-lg text-white ${isDone ? 'line-through text-text-muted' : ''}`}>
          {task.title}
        </h3>
        <p className="text-sm font-mono text-text-muted mt-1">
          Due: {format(new Date(task.deadline), "EEE dd MMM, hh:mm a")}
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-subtle">
        <div className="flex gap-2">
          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md ${task.reminder_24h ? 'bg-accent-secondary/10 text-accent-secondary' : 'bg-bg-elevated text-text-muted'}`}>
            <Smartphone size={12} /> {task.reminder_24h ? 'WA ON' : 'WA OFF'}
          </div>
          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md ${task.add_to_calendar ? 'bg-accent-secondary/10 text-accent-secondary' : 'bg-bg-elevated text-text-muted'}`}>
            <CalIcon size={12} /> {task.add_to_calendar ? 'Cal ON' : 'Cal OFF'}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => onUpdate(task.id, { status: isDone ? 'pending' : 'done' })} className="p-1.5 rounded-md hover:bg-bg-elevated text-text-muted transition-colors">
            <Edit2 size={16} />
          </button>
          <button onClick={() => onDelete(task.id)} className="p-1.5 rounded-md hover:bg-red-500/20 text-red-400 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
