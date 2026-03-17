import { useState, useMemo } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { ContractKPI } from '@/components/ContractKPI';
import { ContractToolbar } from '@/components/ContractToolbar';
import { ContractsTable } from '@/components/ContractsTable';
import { ContractFormModal } from '@/components/ContractFormModal';
import { ContractViewModal } from '@/components/ContractViewModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { Contract, generateContracts, REGION_OPTIONS } from '@/data/contracts';

const PAGE_SIZE = 15;

export default function Index() {
  const [contracts, setContracts] = useState<Contract[]>(() => generateContracts(25));
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [quarterFilter, setQuarterFilter] = useState('');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Modals
  const [formOpen, setFormOpen] = useState(false);
  const [editContract, setEditContract] = useState<Contract | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewContract, setViewContract] = useState<Contract | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteContract, setDeleteContract] = useState<Contract | null>(null);

  // Filter & sort
  const filtered = useMemo(() => {
    let data = [...contracts];

    if (search) {
      const s = search.toLowerCase();
      data = data.filter(c =>
        (c.nameAs || '').toLowerCase().includes(s) ||
        (c.numDog || '').toLowerCase().includes(s) ||
        (c.inn || '').includes(s) ||
        (c.kam || '').toLowerCase().includes(s) ||
        (c.yurLico || '').toLowerCase().includes(s)
      );
    }
    if (regionFilter) data = data.filter(c => c.region === regionFilter);
    if (statusFilter) data = data.filter(c => c.statusDog === statusFilter);

    // Sort
    data.sort((a, b) => {
      const aVal = (a as any)[sortKey] ?? '';
      const bVal = (b as any)[sortKey] ?? '';
      const cmp = typeof aVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal), 'ru');
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return data;
  }, [contracts, search, regionFilter, statusFilter, sortKey, sortDir]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const handleSave = (data: Partial<Contract>) => {
    if (editContract) {
      setContracts(prev => prev.map(c => c.id === editContract.id ? { ...c, ...data } as Contract : c));
    } else {
      const newId = Math.max(0, ...contracts.map(c => c.id)) + 1;
      setContracts(prev => [...prev, { id: newId, ...data } as Contract]);
    }
    setFormOpen(false);
    setEditContract(null);
    setPage(1);
  };

  const handleDelete = () => {
    if (deleteContract) {
      setContracts(prev => prev.filter(c => c.id !== deleteContract.id));
    }
    setDeleteOpen(false);
    setDeleteContract(null);
    setPage(1);
  };

  const handleExport = () => {
    const headers = ['№', 'Название АС', 'Юр. лицо', 'ИНН', 'Регион', 'КАМ', 'Тип', 'Статус дог.', 'Статус согл.', '№ Договора', 'Годовой план', 'Годовой факт', 'Годовая премия'];
    const rows = filtered.map(c => [c.id, c.nameAs, c.yurLico, c.inn, c.region, c.kam, c.tipDog, c.statusDog, c.statusSog, c.numDog, c.godPlan, c.godFakt, c.godPrem].map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(';'));
    const csv = '﻿' + [headers.join(';'), ...rows].join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = `RenewalCRM_DPP_2026_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <DashboardHeader />

      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 flex flex-col gap-4">
        <ContractKPI contracts={contracts} />

        <ContractToolbar
          search={search}
          onSearchChange={v => { setSearch(v); setPage(1); }}
          regionFilter={regionFilter}
          onRegionChange={v => { setRegionFilter(v); setPage(1); }}
          statusFilter={statusFilter}
          onStatusChange={v => { setStatusFilter(v); setPage(1); }}
          quarterFilter={quarterFilter}
          onQuarterChange={setQuarterFilter}
          onAdd={() => { setEditContract(null); setFormOpen(true); }}
          onExport={handleExport}
          regions={REGION_OPTIONS}
        />

        <ContractsTable
          contracts={paged}
          page={page}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onPageChange={setPage}
          onView={id => { setViewContract(contracts.find(c => c.id === id) || null); setViewOpen(true); }}
          onEdit={id => { setEditContract(contracts.find(c => c.id === id) || null); setFormOpen(true); }}
          onDelete={id => { setDeleteContract(contracts.find(c => c.id === id) || null); setDeleteOpen(true); }}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          quarterFilter={quarterFilter}
        />

        {/* Footer */}
        <footer className="flex items-center justify-between py-2 px-1 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_6px] shadow-success animate-pulse-dot" />
            Renewal CRM v6.0 · Система активна
          </div>
          <div className="text-[11px] text-muted-foreground uppercase tracking-wide">
            © 2026 ПФК Обновление
          </div>
        </footer>
      </main>

      {/* Modals */}
      <ContractFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditContract(null); }}
        onSave={handleSave}
        contract={editContract}
      />
      <ContractViewModal
        open={viewOpen}
        onClose={() => { setViewOpen(false); setViewContract(null); }}
        onEdit={() => { setViewOpen(false); if (viewContract) { setEditContract(viewContract); setFormOpen(true); } }}
        contract={viewContract}
      />
      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => { setDeleteOpen(false); setDeleteContract(null); }}
        onConfirm={handleDelete}
        name={deleteContract ? `«${deleteContract.numDog || 'б/н'} · ${deleteContract.nameAs}»` : ''}
      />
    </div>
  );
}
