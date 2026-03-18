import { useState } from 'react';
import { Search, Plus, Download, SlidersHorizontal, X } from 'lucide-react';

interface ToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  regionFilter: string;
  onRegionChange: (v: string) => void;
  statusFilter: string;
  onStatusChange: (v: string) => void;
  quarterFilter: string;
  onQuarterChange: (v: string) => void;
  onAdd: () => void;
  onExport: () => void;
  regions: string[];
}

export function ContractToolbar({
  search, onSearchChange, regionFilter, onRegionChange,
  statusFilter, onStatusChange, quarterFilter, onQuarterChange,
  onAdd, onExport, regions
}: ToolbarProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilters = [regionFilter, statusFilter, quarterFilter].filter(Boolean).length;

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      {/* Main row */}
      <div className="flex items-center gap-2 p-2 md:p-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[140px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Поиск..."
            className="w-full h-9 bg-input border border-border rounded-md text-foreground text-sm pl-9 pr-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-blue-glow placeholder:text-muted-foreground"
          />
        </div>

        {/* Filters toggle (mobile) */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="md:hidden h-9 px-3 rounded-md border border-border text-muted-foreground text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all hover:border-primary hover:text-primary relative"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Фильтры
          {activeFilters > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
              {activeFilters}
            </span>
          )}
        </button>

        {/* Desktop filters */}
        <select
          value={regionFilter}
          onChange={e => onRegionChange(e.target.value)}
          className="hidden md:block h-9 bg-input border border-border rounded-md text-foreground text-[11px] font-medium uppercase tracking-wide px-2.5 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-blue-glow min-w-[130px] cursor-pointer"
        >
          <option value="">Все регионы</option>
          {regions.map(r => <option key={r}>{r}</option>)}
        </select>

        <select
          value={statusFilter}
          onChange={e => onStatusChange(e.target.value)}
          className="hidden md:block h-9 bg-input border border-border rounded-md text-foreground text-[11px] font-medium uppercase tracking-wide px-2.5 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-blue-glow min-w-[130px] cursor-pointer"
        >
          <option value="">Все статусы</option>
          <option>Оригинал в офисе</option>
          <option>Проверка</option>
          <option>Скан</option>
          <option>Согласование условий</option>
        </select>

        {/* Quarter tabs (desktop) */}
        <div className="hidden md:flex items-center gap-0.5 bg-input border border-border rounded-md p-0.5">
          {['Год', 'I КВ', 'II КВ', 'III КВ', 'IV КВ'].map(q => (
            <button
              key={q}
              onClick={() => onQuarterChange(q === 'Год' ? '' : q)}
              className={`h-7 px-3 rounded text-[10px] font-semibold uppercase tracking-wider transition-all ${
                (q === 'Год' && !quarterFilter) || quarterFilter === q
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >{q}</button>
          ))}
        </div>

        {/* Actions */}
        <button
          onClick={onExport}
          className="h-9 px-3 md:px-4 rounded-md text-[11px] font-semibold uppercase tracking-wider border border-border text-muted-foreground transition-all hover:border-success hover:text-success flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">CSV</span>
        </button>
        <button
          onClick={onAdd}
          className="h-9 px-3 md:px-4 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-gradient-to-r from-primary/90 to-primary text-primary-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Добавить</span>
        </button>
      </div>

      {/* Mobile filters drawer */}
      {filtersOpen && (
        <div className="md:hidden border-t border-border p-3 flex flex-col gap-2.5 animate-kpi-in">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Фильтры</span>
            <button onClick={() => setFiltersOpen(false)} className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <select
            value={regionFilter}
            onChange={e => onRegionChange(e.target.value)}
            className="h-9 bg-input border border-border rounded-md text-foreground text-[11px] font-medium uppercase tracking-wide px-2.5 outline-none w-full"
          >
            <option value="">Все регионы</option>
            {regions.map(r => <option key={r}>{r}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={e => onStatusChange(e.target.value)}
            className="h-9 bg-input border border-border rounded-md text-foreground text-[11px] font-medium uppercase tracking-wide px-2.5 outline-none w-full"
          >
            <option value="">Все статусы</option>
            <option>Оригинал в офисе</option>
            <option>Проверка</option>
            <option>Скан</option>
            <option>Согласование условий</option>
          </select>
          {/* Quarter tabs (mobile) */}
          <div className="flex items-center gap-0.5 bg-input border border-border rounded-md p-0.5 overflow-x-auto">
            {['Год', 'I КВ', 'II КВ', 'III КВ', 'IV КВ'].map(q => (
              <button
                key={q}
                onClick={() => onQuarterChange(q === 'Год' ? '' : q)}
                className={`h-7 px-3 rounded text-[10px] font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  (q === 'Год' && !quarterFilter) || quarterFilter === q
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >{q}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}