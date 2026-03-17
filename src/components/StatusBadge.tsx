interface StatusBadgeProps {
  status: string;
  variant?: 'contract' | 'type';
}

export function StatusBadge({ status, variant = 'contract' }: StatusBadgeProps) {
  if (!status || status === '—') {
    return <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
      —
    </span>;
  }

  if (variant === 'type') {
    const isDppAgent = status === 'ДПП/Агент';
    return (
      <span className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded ${
        isDppAgent
          ? 'bg-purple/10 text-purple border border-purple/20'
          : 'bg-primary/10 text-primary border border-primary/15'
      }`}>
        {status}
      </span>
    );
  }

  let className = '';
  let dotClassName = '';

  switch (status) {
    case 'Оригинал в офисе':
      className = 'bg-success/15 text-success border-success/25';
      dotClassName = 'bg-success shadow-[0_0_5px] shadow-success';
      break;
    case 'Проверка':
      className = 'bg-warning/15 text-warning border-warning/25';
      dotClassName = 'bg-warning shadow-[0_0_5px] shadow-warning animate-pulse-dot';
      break;
    case 'Скан':
      className = 'bg-primary/12 text-primary border-primary/25';
      dotClassName = 'bg-primary';
      break;
    case 'Согласование условий':
      className = 'bg-[hsl(25,70%,50%)]/12 text-[hsl(25,70%,50%)] border-[hsl(25,70%,50%)]/22';
      dotClassName = 'bg-[hsl(25,70%,50%)] animate-pulse-dot';
      break;
    default:
      className = 'bg-muted text-muted-foreground border-border';
      dotClassName = 'bg-muted-foreground';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase px-2.5 py-1 rounded-full border ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClassName}`} />
      {status}
    </span>
  );
}
