import { Contract, formatCurrency } from '@/data/contracts';

interface KPIProps {
  contracts: Contract[];
}

export function ContractKPI({ contracts }: KPIProps) {
  const total = contracts.length;
  const originals = contracts.filter(c => c.statusDog === 'Оригинал в офисе').length;
  const pending = contracts.filter(c => c.statusDog === 'Проверка' || c.statusDog === 'Согласование условий').length;
  const totalPlan = contracts.reduce((s, c) => s + c.godPlan, 0);
  const totalFakt = contracts.reduce((s, c) => s + c.godFakt, 0);
  const totalPrem = contracts.reduce((s, c) => s + c.godPrem, 0);

  const cards = [
    { icon: '📋', label: 'Всего договоров', value: String(total), color: 'text-primary', gradient: 'from-primary to-success' },
    { icon: '✅', label: 'Оригинал в офисе', value: String(originals), color: 'text-success', gradient: 'from-success to-primary' },
    { icon: '⏳', label: 'На проверке / согл.', value: String(pending), color: 'text-warning', gradient: 'from-warning to-warning' },
    { icon: '📊', label: 'Годовой план', value: formatCurrency(totalPlan) + ' ₽', color: 'text-primary', gradient: 'from-primary to-blue' },
    { icon: '💰', label: 'Годовой факт', value: formatCurrency(totalFakt) + ' ₽', color: 'text-success', gradient: 'from-success to-green' },
    { icon: '🏆', label: 'Премии', value: formatCurrency(totalPrem) + ' ₽', color: 'text-gold', gradient: 'from-gold to-warning' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {cards.map((card, i) => (
        <div
          key={i}
          className="animate-kpi-in bg-card border border-border rounded-lg p-4 relative overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-lg hover:-translate-y-0.5 cursor-default group"
          style={{ animationDelay: `${i * 0.06}s` }}
        >
          <div className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-lg bg-gradient-to-r ${card.gradient}`} />
          <div className="text-lg mb-1.5 opacity-90 group-hover:scale-110 transition-transform">{card.icon}</div>
          <div className={`text-2xl font-bold leading-none ${card.color}`}>{card.value}</div>
          <div className="text-[11px] text-muted-foreground uppercase tracking-wide mt-1.5">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
