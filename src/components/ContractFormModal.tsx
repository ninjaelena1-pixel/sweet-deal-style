import { useEffect, useState } from 'react';
import { Contract, REGION_OPTIONS, KAM_OPTIONS, SPEC_OPTIONS, TIP_DOG_OPTIONS, TIP_SOG_OPTIONS, STATUS_OPTIONS } from '@/data/contracts';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Contract>) => void;
  contract: Contract | null;
}

export function ContractFormModal({ open, onClose, onSave, contract }: Props) {
  const [form, setForm] = useState<Record<string, any>>({});

  useEffect(() => {
    if (contract) {
      setForm({ ...contract });
    } else {
      setForm({});
    }
  }, [contract, open]);

  if (!open) return null;

  const set = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.nameAs) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-[820px] max-w-[96vw] max-h-[94vh] overflow-y-auto bg-card border border-border rounded-xl shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-card border-b border-border">
          <h2 className="text-xs font-bold tracking-widest text-primary uppercase flex items-center gap-2">
            <span className="w-4 h-0.5 bg-primary rounded" />
            {contract ? `Редактировать · ${contract.nameAs}` : 'Новый договор ДПП'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border text-muted-foreground flex items-center justify-center hover:border-destructive hover:text-destructive transition-all">✕</button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          <SectionHeader label="Идентификация" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <FormField label="№ договора 2026" required>
              <input className="form-inp" value={form.numDog || ''} onChange={e => set('numDog', e.target.value)} placeholder="11/06-М-01/26" />
            </FormField>
            <FormField label="ID Соглашения">
              <input className="form-inp" type="number" value={form.idSog || ''} onChange={e => set('idSog', e.target.value)} />
            </FormField>
            <FormField label="Тип договора">
              <select className="form-inp" value={form.tipDog || ''} onChange={e => set('tipDog', e.target.value)}>
                <option value="">— выберите —</option>
                {TIP_DOG_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </FormField>
            <FormField label="Дата заключения">
              <input className="form-inp" type="date" value={form.dataDog || ''} onChange={e => set('dataDog', e.target.value)} />
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FormField label="Статус договора">
              <select className="form-inp" value={form.statusDog || ''} onChange={e => set('statusDog', e.target.value)}>
                <option value="">— выберите —</option>
                {STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </FormField>
            <FormField label="Статус соглашения">
              <select className="form-inp" value={form.statusSog || ''} onChange={e => set('statusSog', e.target.value)}>
                <option value="">— выберите —</option>
                {STATUS_OPTIONS.filter(s => s !== '—').map(o => <option key={o}>{o}</option>)}
              </select>
            </FormField>
            <FormField label="ФИО Подписанта">
              <input className="form-inp" value={form.podpisant || ''} onChange={e => set('podpisant', e.target.value)} placeholder="Иванов И.И." />
            </FormField>
          </div>

          <SectionHeader label="Аптечная сеть / Контрагент" />
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Название АС/Аптеки" required>
              <input className="form-inp" value={form.nameAs || ''} onChange={e => set('nameAs', e.target.value)} placeholder="АС Ромашка" />
            </FormField>
            <FormField label="Юр. лицо">
              <input className="form-inp" value={form.yurLico || ''} onChange={e => set('yurLico', e.target.value)} />
            </FormField>
            <FormField label="ИНН">
              <input className="form-inp" value={form.inn || ''} onChange={e => set('inn', e.target.value)} placeholder="7700000000" />
            </FormField>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <FormField label="ID АС">
              <input className="form-inp" type="number" value={form.idAs || ''} onChange={e => set('idAs', e.target.value)} />
            </FormField>
            <FormField label="Регион">
              <select className="form-inp" value={form.region || ''} onChange={e => set('region', e.target.value)}>
                <option value="">— выберите —</option>
                {REGION_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </FormField>
            <FormField label="КАМ">
              <select className="form-inp" value={form.kam || ''} onChange={e => set('kam', e.target.value)}>
                <option value="">— выберите —</option>
                {KAM_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </FormField>
            <FormField label="Отв. специалист">
              <select className="form-inp" value={form.specOtv || ''} onChange={e => set('specOtv', e.target.value)}>
                <option value="">— выберите —</option>
                {SPEC_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </FormField>
          </div>

          <SectionHeader label="Количество аптек по кварталам" />
          <div className="grid grid-cols-4 gap-3">
            {[1,2,3,4].map(q => (
              <FormField key={q} label={`${['I','II','III','IV'][q-1]} квартал`}>
                <input className="form-inp" type="number" min="0" value={form[`aptQ${q}`] || 0} onChange={e => set(`aptQ${q}`, parseInt(e.target.value) || 0)} />
              </FormField>
            ))}
          </div>

          {[1,2,3,4].map(q => (
            <div key={q}>
              <SectionHeader label={`${['I','II','III','IV'][q-1]} квартал — план / факт / премия`} />
              <div className="grid grid-cols-2 gap-3 mb-2">
                <FormField label={`Тип соглашения ${['I','II','III','IV'][q-1]} КВ`}>
                  <select className="form-inp" value={form[`tipSogQ${q}`] || ''} onChange={e => set(`tipSogQ${q}`, e.target.value)}>
                    <option value="">— выберите —</option>
                    {TIP_SOG_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </FormField>
                <FormField label={`% премии ${['I','II','III','IV'][q-1]} КВ`}>
                  <input className="form-inp" value={form[`percQ${q}`] || ''} onChange={e => set(`percQ${q}`, e.target.value)} placeholder="5%,10%,15%" />
                </FormField>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <FormField label={`План ${['I','II','III','IV'][q-1]} КВ, ₽`}>
                  <input className="form-inp" type="number" min="0" value={form[`planQ${q}`] || 0} onChange={e => set(`planQ${q}`, parseInt(e.target.value) || 0)} />
                </FormField>
                <FormField label={`Факт ${['I','II','III','IV'][q-1]} КВ, ₽`}>
                  <input className="form-inp" type="number" min="0" value={form[`faktQ${q}`] || 0} onChange={e => set(`faktQ${q}`, parseInt(e.target.value) || 0)} />
                </FormField>
                <FormField label={`Премия ${['I','II','III','IV'][q-1]} КВ, ₽`}>
                  <input className="form-inp" type="number" min="0" value={form[`premQ${q}`] || 0} onChange={e => set(`premQ${q}`, parseInt(e.target.value) || 0)} />
                </FormField>
              </div>
            </div>
          ))}

          <SectionHeader label="Годовые итоги" />
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Годовой план, ₽">
              <input className="form-inp" type="number" min="0" value={form.godPlan || 0} onChange={e => set('godPlan', parseInt(e.target.value) || 0)} />
            </FormField>
            <FormField label="Годовой факт, ₽">
              <input className="form-inp" type="number" min="0" value={form.godFakt || 0} onChange={e => set('godFakt', parseInt(e.target.value) || 0)} />
            </FormField>
            <FormField label="Годовая премия, ₽">
              <input className="form-inp" type="number" min="0" value={form.godPrem || 0} onChange={e => set('godPrem', parseInt(e.target.value) || 0)} />
            </FormField>
          </div>

          <SectionHeader label="Примечание" />
          <FormField label="Общий комментарий">
            <textarea className="form-inp min-h-[65px] resize-y" value={form.komGen || ''} onChange={e => set('komGen', e.target.value)} placeholder="Дополнительная информация..." />
          </FormField>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-border">
          <button onClick={onClose} className="h-9 px-5 rounded-lg border border-border text-muted-foreground text-[11px] font-semibold uppercase tracking-wider hover:border-destructive hover:text-destructive transition-all">
            Отмена
          </button>
          <button onClick={handleSave} className="h-9 px-5 rounded-lg bg-gradient-to-r from-primary/90 to-primary text-primary-foreground text-[11px] font-semibold uppercase tracking-wider shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
            {contract ? 'Сохранить' : 'Создать'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5 my-1">
      <span className="flex-1 h-px bg-border" />
      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{label}</span>
      <span className="flex-1 h-px bg-border" />
    </div>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
