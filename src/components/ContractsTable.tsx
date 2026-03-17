import { Contract, formatCurrency, formatDate, pct } from '@/data/contracts';
import { StatusBadge } from './StatusBadge';
import { Eye, Pencil, Trash2, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface TableProps {
  contracts: Contract[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  sortKey: string;
  sortDir: 'asc' | 'desc';
  onSort: (key: string) => void;
  quarterFilter: string;
}

function getInitials(name: string) {
  if (!name) return '?';
  const parts = name.split(' ');
  return parts.length >= 2 ? parts[0][0] + parts[1][0] : name[0];
}

function getQuarterSuffix(q: string): string {
  switch (q) {
    case 'I КВ': return 'Q1';
    case 'II КВ': return 'Q2';
    case 'III КВ': return 'Q3';
    case 'IV КВ': return 'Q4';
    default: return '';
  }
}

function SortIcon({ sortKey, currentSort, sortDir }: { sortKey: string; currentSort: string; sortDir: 'asc' | 'desc' }) {
  if (currentSort !== sortKey) return <ChevronsUpDown className="w-3 h-3 opacity-40 ml-1 inline" />;
  return sortDir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-primary ml-1 inline" />
    : <ChevronDown className="w-3 h-3 text-primary ml-1 inline" />;
}

export function ContractsTable({
  contracts, page, pageSize, total, onPageChange,
  onView, onEdit, onDelete, sortKey, sortDir, onSort, quarterFilter
}: TableProps) {
  const pages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;

  const qSfx = getQuarterSuffix(quarterFilter);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col flex-1 min-h-0 shadow-sm animate-kpi-in" style={{ animationDelay: '0.2s' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-widest text-primary uppercase">
          <span className="w-4 h-0.5 bg-primary rounded-sm" />
          Реестр договоров ДПП 2026
        </div>
        <div className="text-[11px] text-muted-foreground uppercase tracking-wide">
          {total > 0 ? `${start + 1}–${Math.min(start + pageSize, total)} из ${total}` : 'Нет записей'}
        </div>
      </div>

      {/* Table scroll */}
      <div className="overflow-auto flex-1">
        <table className="w-full border-collapse min-w-[1100px]">
          <thead>
            <tr className="border-b-2 border-border">
              {[
                { key: 'id', label: '№', sortable: true },
                { key: 'numDog', label: '№ договора', sortable: true },
                { key: 'nameAs', label: 'Аптечная сеть', sortable: true },
                { key: 'region', label: 'Регион', sortable: true },
                { key: 'kam', label: 'КАМ', sortable: true },
                { key: 'tipDog', label: 'Тип', sortable: false },
                { key: 'statusDog', label: 'Статус дог.', sortable: true },
                { key: 'statusSog', label: 'Статус согл.', sortable: true },
                { key: 'apt', label: 'Аптек', sortable: false },
                { key: 'plan', label: 'План', sortable: false },
                { key: 'fakt', label: 'Факт', sortable: false },
                { key: 'prem', label: 'Премия', sortable: false },
                { key: 'actions', label: '', sortable: false },
              ].map(col => (
                <th
                  key={col.key}
                  className={`text-[11px] font-semibold text-muted-foreground uppercase tracking-wide py-3 px-3.5 text-left whitespace-nowrap sticky top-0 bg-th-bg z-[2] border-b-2 border-border select-none ${
                    col.sortable ? 'cursor-pointer hover:text-primary transition-colors' : ''
                  }`}
                  onClick={() => col.sortable && onSort(col.key)}
                >
                  {col.label}
                  {col.sortable && <SortIcon sortKey={col.key} currentSort={sortKey} sortDir={sortDir} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contracts.length === 0 ? (
              <tr>
                <td colSpan={13} className="py-16 text-center">
                  <div className="text-4xl opacity-30 mb-3">📋</div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-widest">Нет записей по фильтру</div>
                </td>
              </tr>
            ) : (
              contracts.map((c, i) => {
                const plan = qSfx ? (c as any)[`plan${qSfx}`] : c.godPlan;
                const fakt = qSfx ? (c as any)[`fakt${qSfx}`] : c.godFakt;
                const prem = qSfx ? (c as any)[`prem${qSfx}`] : c.godPrem;
                const apt = qSfx ? (c as any)[`apt${qSfx}`] : (c.aptQ1 + c.aptQ2 + c.aptQ3 + c.aptQ4);
                const percent = pct(fakt, plan);
                const pctColor = percent >= 100 ? 'text-success' : percent >= 70 ? 'text-warning' : 'text-destructive';

                return (
                  <tr
                    key={c.id}
                    className="animate-row-in border-b border-border last:border-b-0 transition-colors duration-100 hover:bg-row-hover even:bg-row-stripe"
                    style={{ animationDelay: `${i * 0.025}s` }}
                  >
                    <td className="py-3 px-3.5 text-xs font-semibold text-muted-foreground">{c.id}</td>
                    <td className="py-3 px-3.5 text-xs font-semibold text-foreground/80">{c.numDog || '—'}</td>
                    <td className="py-3 px-3.5 max-w-[180px] overflow-hidden text-ellipsis" title={c.nameAs}>
                      <div className="text-[13px] font-semibold text-foreground leading-tight">{c.nameAs || '—'}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{c.yurLico}</div>
                    </td>
                    <td className="py-3 px-3.5 text-xs text-muted-foreground">{c.region || '—'}</td>
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-md bg-gradient-to-br from-primary/80 to-success/80 inline-flex items-center justify-center text-[9px] font-bold text-primary-foreground shrink-0 shadow-sm">
                          {getInitials(c.kam)}
                        </span>
                        <span className="text-xs text-foreground">{c.kam || '—'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3.5"><StatusBadge status={c.tipDog} variant="type" /></td>
                    <td className="py-3 px-3.5"><StatusBadge status={c.statusDog} /></td>
                    <td className="py-3 px-3.5"><StatusBadge status={c.statusSog} /></td>
                    <td className="py-3 px-3.5 text-center text-[13px] font-bold text-foreground">{apt || '—'}</td>
                    <td className="py-3 px-3.5 text-[13px] font-bold text-primary whitespace-nowrap">{formatCurrency(plan)}</td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className={`text-[13px] font-bold ${pctColor}`}>{formatCurrency(fakt)}</span>
                      {plan > 0 && (
                        <>
                          <span className={`text-[10px] ml-1 ${pctColor}`}>{percent}%</span>
                          <div className="w-full h-[3px] bg-border rounded-full mt-1">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${percent >= 100 ? 'bg-success' : percent >= 70 ? 'bg-warning' : 'bg-destructive'}`}
                              style={{ width: `${Math.min(100, percent)}%` }}
                            />
                          </div>
                        </>
                      )}
                    </td>
                    <td className="py-3 px-3.5 text-[13px] font-bold text-gold whitespace-nowrap">{formatCurrency(prem)}</td>
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <button onClick={() => onView(c.id)} className="w-7 h-7 rounded-md border border-border text-muted-foreground inline-flex items-center justify-center transition-all hover:border-success hover:text-success hover:bg-success/5 ml-1" title="Карточка">
                        <Eye className="w-3 h-3" />
                      </button>
                      <button onClick={() => onEdit(c.id)} className="w-7 h-7 rounded-md border border-border text-muted-foreground inline-flex items-center justify-center transition-all hover:border-primary hover:text-primary hover:bg-primary/5 ml-1" title="Редактировать">
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button onClick={() => onDelete(c.id)} className="w-7 h-7 rounded-md border border-border text-muted-foreground inline-flex items-center justify-center transition-all hover:border-destructive hover:text-destructive hover:bg-destructive/5 ml-1" title="Удалить">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border shrink-0">
          <div className="text-[11px] text-muted-foreground uppercase tracking-wide">
            {start + 1}–{Math.min(start + pageSize, total)} из {total}
          </div>
          <div className="flex gap-1 items-center">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="min-w-[30px] h-8 rounded-md border border-border text-muted-foreground text-[11px] flex items-center justify-center transition-all hover:border-primary hover:text-primary disabled:opacity-30 disabled:pointer-events-none"
            >‹</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => {
              if (pages <= 7 || p === 1 || p === pages || Math.abs(p - page) <= 1) {
                return (
                  <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`min-w-[30px] h-8 rounded-md text-[11px] flex items-center justify-center transition-all ${
                      p === page
                        ? 'border border-primary bg-primary text-primary-foreground shadow-sm'
                        : 'border border-border text-muted-foreground hover:border-primary hover:text-primary'
                    }`}
                  >{p}</button>
                );
              }
              if (Math.abs(p - page) === 2) {
                return <span key={p} className="text-muted-foreground px-1">…</span>;
              }
              return null;
            })}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= pages}
              className="min-w-[30px] h-8 rounded-md border border-border text-muted-foreground text-[11px] flex items-center justify-center transition-all hover:border-primary hover:text-primary disabled:opacity-30 disabled:pointer-events-none"
            >›</button>
          </div>
        </div>
      )}
    </div>
  );
}
