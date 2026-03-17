import { useTheme } from '@/contexts/ThemeContext';

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-3 bg-card border-b border-border shrink-0 shadow-sm relative z-10">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-success flex items-center justify-center text-primary-foreground font-bold text-sm shadow-md">
          R
        </div>
        <div>
          <div className="text-sm font-bold tracking-widest uppercase text-primary leading-none">Renewal CRM</div>
          <div className="text-[11px] text-muted-foreground tracking-wide uppercase mt-0.5">v6.0 · Защищено</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="hidden md:flex gap-1">
        <button className="px-4 py-2 rounded text-xs font-semibold tracking-wide uppercase text-primary relative">
          Договоры
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/5 h-0.5 bg-gradient-to-r from-primary to-success rounded-full shadow-sm" />
        </button>
      </nav>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <div className="flex items-center gap-1 px-1.5 py-1 bg-muted rounded-full border border-border">
          <button
            onClick={() => setTheme('night')}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all ${theme === 'night' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
            title="Ночная"
          >🌙</button>
          <div className="w-px h-4 bg-border" />
          <button
            onClick={() => setTheme('slate')}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all ${theme === 'slate' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
            title="Серая"
          >🌫️</button>
          <div className="w-px h-4 bg-border" />
          <button
            onClick={() => setTheme('white')}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all ${theme === 'white' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
            title="Светлая"
          >☀️</button>
        </div>

        {/* User */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="text-right">
            <div className="text-[11px] font-bold tracking-wider text-foreground uppercase">ADMIN</div>
            <div className="text-[11px] text-muted-foreground uppercase">Суперадмин</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-success flex items-center justify-center text-sm font-bold text-primary-foreground shadow-md">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
