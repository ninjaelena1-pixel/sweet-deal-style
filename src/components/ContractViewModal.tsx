import { Contract, formatCurrency, formatDate, pct } from '@/data/contracts';
import { StatusBadge } from './StatusBadge';

interface Props {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  contract: Contract | null;
}

function getInitials(name: string) {
  if (!name) return '?';
  const parts = name.split(' ');
  return parts.length >= 2 ? parts[0][0] + parts[1][0] : name[0];
}

export function ContractViewModal({ open, onClose, onEdit, contract }: Props) {
  if (!open || !contract) return null;
  const c = contract;

  const quarters = [
    { q: 'I', plan: c.planQ1, fakt: c.faktQ1, prem: c.premQ1, tip: c.tipSogQ1, perc: c.percQ1, apt: c.aptQ1 },
    { q: 'II', plan: c.planQ2, fakt: c.faktQ2, prem: c.premQ2, tip: c.tipSogQ2, perc: c.percQ2, apt: c.aptQ2 },
    { q: 'III', plan: c.planQ3, fakt: c.faktQ3, prem: c.premQ3, tip: c.tipSogQ3, perc: c.percQ3, apt: c.aptQ3 },
    { q: 'IV', plan: c.planQ4, fakt: c.faktQ4, prem: c.premQ4, tip: c.tipSogQ4, perc: c.percQ4, apt: c.aptQ4 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-[820px] max-w-[96vw] max-h-[94vh] overflow-y-auto bg-card border border-border rounded-xl shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-card border-b border-border">
          <h2 className="text-xs font-bold tracking-widest text-primary uppercase flex items-center gap-2">
            <span className="w-4 h-0.5 bg-primary rounded" />
            ДПП · {c.nameAs || '—'} · {c.numDog || 'б/н'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border text-muted-foreground flex items-center justify-center hover:border-destructive hover:text-destructive transition-all">✕</button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            <StatusBadge status={c.tipDog} variant="type" />
            <StatusBadge status={c.statusDog} />
            {c.statusSog && c.statusSog !== c.statusDog && <StatusBadge status={c.statusSog} />}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-3 gap-x-5 gap-y-3">
            <ViewField label="Аптечная сеть" value={c.nameAs} bold />
            <ViewField label="Юридическое лицо" value={c.yurLico} />
            <ViewField label="ИНН" value={c.inn} mono />
            <ViewField label="№ договора" value={c.numDog} big />
            <ViewField label="ID соглашения" value={c.idSog} />
            <ViewField label="Дата заключения" value={formatDate(c.dataDog)} />
            <ViewField label="Регион" value={c.region} />
            <ViewField label="КАМ" value={c.kam} avatar />
            <ViewField label="Отв. специалист" value={c.specOtv} />
            <ViewField label="Подписант" value={c.podpisant} />
            <ViewField label="ID АС" value={c.idAs} mono />
          </div>

          {/* Quarter dynamics */}
          <div className="flex items-center gap-2.5 mt-2">
            <span className="flex-1 h-px bg-border" />
            <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">Квартальная динамика</span>
            <span className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {quarters.map(q => {
              const percent = pct(q.fakt, q.plan);
              const pctColor = percent >= 100 ? 'text-success' : percent >= 70 ? 'text-warning' : 'text-destructive';
              return (
                <div key={q.q} className="bg-muted/50 border border-border rounded-lg p-3.5">
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wide mb-2">{q.q} квартал · {q.apt || 0} аптек</div>
                  {q.tip && (
                    <span className="inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-success/10 text-success border border-success/20 mb-2">{q.tip}</span>
                  )}
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase">План</div>
                      <div className="text-sm font-bold text-primary">{formatCurrency(q.plan)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase">Факт</div>
                      <div className={`text-sm font-bold ${pctColor}`}>
                        {formatCurrency(q.fakt)}
                        {q.plan > 0 && <span className="text-[10px] ml-0.5 text-muted-foreground">{percent}%</span>}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase">Премия</div>
                      <div className="text-sm font-bold text-gold">{formatCurrency(q.prem)}</div>
                    </div>
                  </div>
                  {q.plan > 0 && (
                    <div className="w-full h-[3px] bg-border rounded-full mt-2">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${percent >= 100 ? 'bg-success' : percent >= 70 ? 'bg-warning' : 'bg-destructive'}`}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Yearly */}
          <div className="flex items-center gap-2.5">
            <span className="flex-1 h-px bg-border" />
            <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">Годовые итоги</span>
            <span className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/50 border border-border rounded-lg p-3.5">
              <div className="text-[11px] text-muted-foreground uppercase">Годовой план</div>
              <div className="text-xl font-bold text-primary">{formatCurrency(c.godPlan)}</div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3.5">
              <div className="text-[11px] text-muted-foreground uppercase">Годовой факт</div>
              <div className={`text-xl font-bold ${pct(c.godFakt, c.godPlan) >= 100 ? 'text-success' : pct(c.godFakt, c.godPlan) >= 70 ? 'text-warning' : 'text-destructive'}`}>
                {formatCurrency(c.godFakt)}
                {c.godPlan > 0 && <span className="text-xs ml-1 text-muted-foreground">{pct(c.godFakt, c.godPlan)}%</span>}
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3.5">
              <div className="text-[11px] text-muted-foreground uppercase">Годовая премия</div>
              <div className="text-xl font-bold text-gold">{formatCurrency(c.godPrem)}</div>
            </div>
          </div>

          {c.komGen && (
            <div className="p-3.5 bg-muted/50 border border-border rounded-lg text-sm text-foreground leading-relaxed italic">
              {c.komGen}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-border">
          <button onClick={onClose} className="h-9 px-5 rounded-lg border border-border text-muted-foreground text-[11px] font-semibold uppercase tracking-wider hover:border-primary hover:text-primary transition-all">
            Закрыть
          </button>
          <button onClick={onEdit} className="h-9 px-5 rounded-lg bg-gradient-to-r from-primary/90 to-primary text-primary-foreground text-[11px] font-semibold uppercase tracking-wider shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
            ✏️ Редактировать
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewField({ label, value, bold, big, mono, avatar }: { label: string; value: string; bold?: boolean; big?: boolean; mono?: boolean; avatar?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className={`text-sm text-foreground leading-relaxed ${bold ? 'font-semibold text-[15px]' : ''} ${big ? 'text-lg font-bold text-primary' : ''} ${mono ? 'tracking-wider' : ''}`}>
        {avatar && value ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-md bg-gradient-to-br from-primary/80 to-success/80 inline-flex items-center justify-center text-[9px] font-bold text-primary-foreground">
              {value.split(' ').length >= 2 ? value.split(' ')[0][0] + value.split(' ')[1][0] : value[0]}
            </span>
            {value}
          </span>
        ) : (value || '—')}
      </span>
    </div>
  );
}
