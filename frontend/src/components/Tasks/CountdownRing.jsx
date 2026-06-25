import useCountdown from '../../hooks/useCountdown';

export default function CountdownRing({ deadline, totalDurationDays = 7 }) {
  const timeLeft = useCountdown(deadline);
  
  if (!timeLeft) return null;

  const { days, hours, total } = timeLeft;
  const isUrgent = total > 0 && total < 24 * 3600; // less than 24h
  const isOverdue = total <= 0;

  // Calculate percentage (max 7 days for the ring)
  const maxSecs = totalDurationDays * 24 * 3600;
  let percent = isOverdue ? 0 : (total / maxSecs) * 100;
  if (percent > 100) percent = 100;

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  let colorClass = 'text-accent-secondary';
  if (isUrgent) colorClass = 'text-accent-warning animate-pulse';
  if (isOverdue) colorClass = 'text-red-500';

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center">
        <svg className="w-10 h-10 transform -rotate-90">
          <circle cx="20" cy="20" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-border-subtle" />
          <circle 
            cx="20" cy="20" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent"
            strokeDasharray={circumference} strokeDashoffset={offset}
            className={`transition-all duration-1000 ease-linear ${colorClass}`}
          />
        </svg>
        <div className="absolute flex items-center justify-center inset-0 text-[10px] font-bold font-mono">
          {isOverdue ? '0d' : (days > 0 ? `${days}d` : `${hours}h`)}
        </div>
      </div>
      <div className="text-xs font-mono font-medium text-text-muted">
        {isOverdue ? 'Overdue' : (days > 0 ? `${days}d ${hours}h left` : `${hours}h ${timeLeft.minutes}m left`)}
      </div>
    </div>
  );
}
