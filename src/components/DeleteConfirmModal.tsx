interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
}

export function DeleteConfirmModal({ open, onClose, onConfirm, name }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-[400px] max-w-[94vw] bg-card border border-destructive/20 rounded-xl p-8 shadow-2xl text-center" onClick={e => e.stopPropagation()}>
        <div className="text-4xl mb-3">🗑️</div>
        <h3 className="text-sm font-bold tracking-widest text-destructive uppercase mb-2">Удалить запись?</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
          Вы уверены, что хотите удалить договор<br />
          <span className="font-semibold text-foreground">{name}</span>?
        </p>
        <div className="flex justify-center gap-2">
          <button onClick={onClose} className="h-9 px-5 rounded-md border border-border text-muted-foreground text-[10px] font-semibold uppercase tracking-wider hover:border-primary hover:text-primary transition-all">
            Отмена
          </button>
          <button onClick={onConfirm} className="h-9 px-5 rounded-md bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground text-[10px] font-semibold uppercase tracking-wider shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}
