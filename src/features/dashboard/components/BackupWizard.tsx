import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../../store/useStore';
import { useApp } from '../../../contexts/AppContext';
import { 
  Download, Upload, Database, RefreshCw, AlertTriangle, 
  Trash2, CheckCircle, FileText, Sliders, History, 
  Info, X, ShieldAlert 
} from 'lucide-react';
import { 
  exportBackup, 
  parseUpload, 
  generateImportPreview, 
  executeImport, 
  estimateBackupSize, 
  type ImportPreviewReport 
} from '../../../services/backup/backupService';
import { 
  createSnapshot, 
  restoreSnapshot, 
  getSnapshotsList, 
  deleteSnapshot 
} from '../../../services/backup/snapshot';
import { type BackupPayload } from '../../../services/backup/validation';
import { type MergeStrategy } from '../../../services/backup/merge';

interface BackupWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupWizard: React.FC<BackupWizardProps> = ({ isOpen, onClose }) => {
  const { language, theme } = useApp();
  const { decks, cards, syncFromDB } = useStore();

  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'snapshots'>('export');

  // --- Export States ---
  const [exportFormat, setExportFormat] = useState<'fibf' | 'json' | 'csv' | 'markdown'>('fibf');
  const [selectedDecksForExport, setSelectedDecksForExport] = useState<string[]>(decks.map(d => d.Id));
  const [includeStatsExport, setIncludeStatsExport] = useState(true);
  const [includeSessionsExport, setIncludeSessionsExport] = useState(true);
  const [estimatedSize, setEstimatedSize] = useState<string>('0 B');
  const [isExporting, setIsExporting] = useState(false);

  // --- Import States ---
  const [importPayload, setImportPayload] = useState<BackupPayload | null>(null);
  const [importPreview, setImportPreview] = useState<ImportPreviewReport | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importProgress, setImportProgress] = useState<number | null>(null);
  const [mergeStrategy, setMergeStrategy] = useState<MergeStrategy>('merge');
  const [selectiveImport, setSelectiveImport] = useState<{
    decks: boolean;
    stats: boolean;
    sessions: boolean;
  }>({
    decks: true,
    stats: true,
    sessions: true
  });
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);

  // --- Snapshot States ---
  const [snapshots, setSnapshots] = useState<{ Id: string; Timestamp: number; Label: string }[]>([]);
  const [manualSnapshotLabel, setManualSnapshotLabel] = useState('');
  const [isCreatingSnapshot, setIsCreatingSnapshot] = useState(false);
  const [snapshotSuccessMsg, setSnapshotSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update estimated backup size whenever selection changes
  useEffect(() => {
    const updateEstimate = async () => {
      const sizeStr = await estimateBackupSize({
        deckIds: selectedDecksForExport,
        includeStats: includeStatsExport,
        includeSessions: includeSessionsExport,
        theme,
        language
      });
      setEstimatedSize(sizeStr);
    };
    if (isOpen && activeTab === 'export') {
      updateEstimate();
    }
  }, [selectedDecksForExport, includeStatsExport, includeSessionsExport, isOpen, activeTab]);

  // Load snapshot list when snapshots tab opens
  const loadSnapshots = async () => {
    const list = await getSnapshotsList();
    setSnapshots(list);
  };

  useEffect(() => {
    if (isOpen && activeTab === 'snapshots') {
      loadSnapshots();
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  // Handle Export Download
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { fileName, mimeType, data } = await exportBackup({
        deckIds: selectedDecksForExport,
        includeStats: includeStatsExport,
        includeSessions: includeSessionsExport,
        format: exportFormat,
        theme,
        language
      });

      // Download file in browser
      const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      console.error(e);
      alert(language === 'pt' ? `Erro ao exportar: ${e.message}` : `Export error: ${e.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle file drop/select for upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsParsing(true);
    setImportError(null);
    setImportPayload(null);
    setImportPreview(null);
    setImportSuccessMessage(null);

    try {
      let fileData: string | ArrayBuffer;
      const isFibf = file.name.endsWith('.fibf');

      if (isFibf) {
        fileData = await file.arrayBuffer();
      } else {
        fileData = await file.text();
      }

      const parsed = await parseUpload(fileData, file.name);
      setImportPayload(parsed);

      const preview = await generateImportPreview(parsed);
      setImportPreview(preview);
    } catch (err: any) {
      console.error(err);
      setImportError(
        language === 'pt'
          ? `O arquivo selecionado é inválido ou está corrompido: ${err.message}`
          : `The selected file is invalid or corrupted: ${err.message}`
      );
    } finally {
      setIsParsing(false);
    }
  };

  // Run the actual data import with custom strategies
  const handleImport = async () => {
    if (!importPayload) return;

    setImportProgress(10);
    try {
      // Modify payload according to selective filters
      const finalPayload: BackupPayload = JSON.parse(JSON.stringify(importPayload));
      
      if (!selectiveImport.decks) {
        finalPayload.data.decks = [];
        finalPayload.data.cards = [];
      }
      if (!selectiveImport.sessions) {
        finalPayload.data.studySessions = [];
      }
      if (!selectiveImport.stats) {
        delete finalPayload.data.userStats;
      }

      const result = await executeImport({
        payload: finalPayload,
        strategy: mergeStrategy,
        onProgress: (p: number) => setImportProgress(p)
      });

      // Sync Zustand store
      await syncFromDB();

      setImportSuccessMessage(
        language === 'pt'
          ? `Restauração concluída com sucesso! ${result.decksImported} categorias e ${result.cardsImported} flashcards integrados. Um snapshot de segurança (${result.snapshotId.substring(0, 8)}) foi criado.`
          : `Restore completed successfully! ${result.decksImported} decks and ${result.cardsImported} cards imported. A safety snapshot (${result.snapshotId.substring(0, 8)}) was created.`
      );

      // Clean import wizard state
      setImportPayload(null);
      setImportPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (e: any) {
      console.error(e);
      setImportError(language === 'pt' ? `Erro na importação: ${e.message}` : `Import error: ${e.message}`);
    } finally {
      setImportProgress(null);
    }
  };

  // Restore snapshot
  const handleRestoreSnapshot = async (id: string) => {
    const confirmMsg = language === 'pt'
      ? 'Tem certeza de que deseja restaurar este snapshot? Isso substituirá completamente seus dados locais atuais.'
      : 'Are you sure you want to restore this snapshot? This will completely replace your current local data.';
    if (!confirm(confirmMsg)) return;

    const res = await restoreSnapshot(id);
    if (res.success) {
      await syncFromDB();
      setSnapshotSuccessMsg(
        language === 'pt'
          ? 'Snapshot restaurado com sucesso!'
          : 'Snapshot restored successfully!'
      );
      setTimeout(() => setSnapshotSuccessMsg(null), 3000);
    } else {
      alert(language === 'pt' ? `Erro ao restaurar: ${res.error}` : `Restore error: ${res.error}`);
    }
  };

  // Delete snapshot
  const handleDeleteSnapshot = async (id: string) => {
    await deleteSnapshot(id);
    await loadSnapshots();
  };

  // Create manual snapshot
  const handleCreateManualSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualSnapshotLabel.trim()) return;

    setIsCreatingSnapshot(true);
    try {
      await createSnapshot(manualSnapshotLabel.trim());
      setManualSnapshotLabel('');
      await loadSnapshots();
      setSnapshotSuccessMsg(
        language === 'pt'
          ? 'Snapshot manual criado com sucesso!'
          : 'Manual snapshot created successfully!'
      );
      setTimeout(() => setSnapshotSuccessMsg(null), 3000);
    } catch (e: any) {
      alert(language === 'pt' ? `Erro ao criar snapshot: ${e.message}` : `Error creating snapshot: ${e.message}`);
    } finally {
      setIsCreatingSnapshot(false);
    }
  };

  const toggleDeckExport = (id: string) => {
    setSelectedDecksForExport(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAllDecks = () => setSelectedDecksForExport(decks.map(d => d.Id));
  const deselectAllDecks = () => setSelectedDecksForExport([]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col my-8 max-h-[85vh] overflow-hidden">
        {/* Wizard Header */}
        <div className="flex items-center justify-between border-b border-border p-5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Database className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {language === 'pt' ? 'Portabilidade & Backups Avançados' : 'Advanced Portability & Backups'}
              </h2>
              <p className="text-xs text-muted-foreground">
                {language === 'pt' ? 'Gerencie a integridade, importação, exportação e snapshots de segurança.' : 'Manage data integrity, imports, exports, and safety snapshots.'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Navigation Tabs */}
        <div className="flex border-b border-border bg-secondary/30 shrink-0 text-sm font-medium">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
              activeTab === 'export' 
                ? 'border-primary text-foreground bg-card' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {language === 'pt' ? 'Exportar Dados' : 'Export Data'}
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
              activeTab === 'import' 
                ? 'border-primary text-foreground bg-card' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {language === 'pt' ? 'Importar / Restaurar' : 'Import / Restore'}
          </button>
          <button
            onClick={() => setActiveTab('snapshots')}
            className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
              activeTab === 'snapshots' 
                ? 'border-primary text-foreground bg-card' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {language === 'pt' ? 'Snapshots Locais' : 'Local Snapshots'}
          </button>
        </div>

        {/* Wizard Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: EXPORT DATA */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Formato de Exportação */}
                <div className="md:col-span-1 space-y-3">
                  <h3 className="text-sm font-bold flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-indigo-500" />
                    {language === 'pt' ? '1. Formato do Arquivo' : '1. File Format'}
                  </h3>
                  <div className="space-y-2">
                    {[
                      { id: 'fibf', title: 'Flashcards Backup (.fibf)', desc: language === 'pt' ? 'Formato premium compactado. Recuperação total com integridade por checksum.' : 'Premium compressed format. Fully validated database backup.' },
                      { id: 'json', title: 'JSON Universal (.json)', desc: language === 'pt' ? 'Estrutura de dados legível por máquinas contendo todas as tabelas locais.' : 'Standard text structure containing all local tables.' },
                      { id: 'csv', title: 'Planilha CSV (.csv)', desc: language === 'pt' ? 'Tabela plana de flashcards para visualização no Excel ou Google Sheets.' : 'Tabular representation of cards for Excel or Sheets.' },
                      { id: 'markdown', title: 'Obsidian Markdown (.md)', desc: language === 'pt' ? 'Cartões formatados em markdown para sincronização com Notion ou Obsidian.' : 'Markdown cards for Notion, Obsidian or GitHub readmes.' }
                    ].map((fmt) => (
                      <label 
                        key={fmt.id}
                        className={`block p-3 rounded-xl border transition-all cursor-pointer hover:border-primary/50 ${
                          exportFormat === fmt.id 
                            ? 'bg-primary/5 border-primary text-foreground' 
                            : 'bg-card border-border text-muted-foreground'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="export_format" 
                          checked={exportFormat === fmt.id}
                          onChange={() => setExportFormat(fmt.id as any)}
                          className="sr-only" 
                        />
                        <div className="font-semibold text-xs text-foreground flex items-center justify-between">
                          <span>{fmt.title}</span>
                          {exportFormat === fmt.id && <CheckCircle className="w-4 h-4 text-primary shrink-0" />}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 leading-normal">{fmt.desc}</p>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Seleção de Dados */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-sm font-bold flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    {language === 'pt' ? '2. Filtros e Dados' : '2. Filters & Data'}
                  </h3>

                  <div className="space-y-4 bg-secondary/20 border border-border p-4 rounded-xl">
                    <div className="flex flex-wrap gap-4 text-xs font-semibold">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={includeStatsExport} 
                          onChange={(e) => setIncludeStatsExport(e.target.checked)} 
                          className="rounded text-primary border-border focus:ring-primary h-4 w-4 bg-card"
                        />
                        <span>{language === 'pt' ? 'Estatísticas & Nível (XP)' : 'User Stats & XP'}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={includeSessionsExport} 
                          onChange={(e) => setIncludeSessionsExport(e.target.checked)} 
                          className="rounded text-primary border-border focus:ring-primary h-4 w-4 bg-card"
                        />
                        <span>{language === 'pt' ? 'Histórico de Estudo (Sessões)' : 'Study Sessions'}</span>
                      </label>
                    </div>

                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold">{language === 'pt' ? 'Selecione os Decks:' : 'Select Decks:'}</span>
                        <div className="flex gap-2">
                          <button onClick={selectAllDecks} className="text-[10px] text-primary hover:underline font-semibold cursor-pointer">
                            {language === 'pt' ? 'Todos' : 'Select All'}
                          </button>
                          <button onClick={deselectAllDecks} className="text-[10px] text-primary hover:underline font-semibold cursor-pointer">
                            {language === 'pt' ? 'Nenhum' : 'Deselect All'}
                          </button>
                        </div>
                      </div>

                      {decks.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          {language === 'pt' ? 'Nenhum deck criado para exportação.' : 'No decks available to export.'}
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                          {decks.map((deck) => {
                            const count = cards.filter(c => c.DeckId === deck.Id).length;
                            const isSelected = selectedDecksForExport.includes(deck.Id);
                            return (
                              <button
                                key={deck.Id}
                                onClick={() => toggleDeckExport(deck.Id)}
                                className={`flex justify-between items-center text-left text-xs p-2.5 rounded-lg border transition-all cursor-pointer ${
                                  isSelected 
                                    ? 'bg-card border-primary text-foreground font-medium' 
                                    : 'bg-card/40 border-border text-muted-foreground'
                                }`}
                              >
                                <span className="truncate mr-2">{deck.Name}</span>
                                <span className="text-[10px] opacity-75 shrink-0 font-semibold">{count} cards</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Informações Extras de Exportação */}
                  <div className="flex items-center gap-3 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                    <Info className="w-5 h-5 text-indigo-500 shrink-0" />
                    <div className="text-xs leading-normal">
                      <span className="font-semibold block">{language === 'pt' ? 'Previsão de Peso do Arquivo' : 'Estimated File Size'}</span>
                      <p className="text-muted-foreground">
                        {language === 'pt' ? 'O tamanho estimado para a seleção atual é de' : 'The estimated size for the current selection is'}{' '}
                        <span className="font-bold text-foreground">{estimatedSize}</span>.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex justify-end pt-4 border-t border-border shrink-0">
                <button
                  onClick={handleExport}
                  disabled={isExporting || (selectedDecksForExport.length === 0 && !includeStatsExport)}
                  className="cursor-pointer inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-lg px-5 py-2.5 text-sm shadow transition-colors duration-200 disabled:opacity-50"
                >
                  {isExporting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      {language === 'pt' ? 'Compactando e Gerando...' : 'Exporting...'}
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      {language === 'pt' ? 'Exportar e Baixar Arquivo' : 'Export and Download'}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: IMPORT / RESTORE DATA */}
          {activeTab === 'import' && (
            <div className="space-y-6">
              {importSuccessMessage && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-500 flex gap-3">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <p className="font-medium leading-relaxed">{importSuccessMessage}</p>
                </div>
              )}

              {importError && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-500 flex gap-3">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <p className="font-medium leading-relaxed">{importError}</p>
                </div>
              )}

              {/* Upload Drop Zone */}
              {!importPreview && (
                <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center flex flex-col items-center justify-center bg-secondary/10 hover:bg-secondary/20 transition-all">
                  <Upload className="w-10 h-10 text-muted-foreground mb-4" />
                  <h4 className="text-sm font-bold mb-1">
                    {language === 'pt' ? 'Selecione ou arraste seu arquivo' : 'Select or drag your backup file'}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-4 max-w-sm">
                    {language === 'pt' ? 'Suporta formatos oficiais .fibf, backups universais .json ou backups compactados.' : 'Supports official .fibf format and universal JSON backups.'}
                  </p>
                  
                  <input 
                    type="file" 
                    id="import-file-uploader" 
                    className="hidden" 
                    accept=".json,.fibf" 
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  <label 
                    htmlFor="import-file-uploader" 
                    className="cursor-pointer inline-flex items-center gap-2 bg-secondary hover:bg-accent border border-border text-foreground font-semibold rounded-lg px-4 py-2 text-xs shadow transition-colors"
                  >
                    {isParsing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        {language === 'pt' ? 'Verificando Integridade...' : 'Parsing file...'}
                      </>
                    ) : (
                      <>
                        <FileText className="w-3.5 h-3.5" />
                        {language === 'pt' ? 'Escolher Arquivo' : 'Choose File'}
                      </>
                    )}
                  </label>
                </div>
              )}

              {/* Import Preview & Strategy Configurations */}
              {importPreview && importPayload && (
                <div className="space-y-6">
                  {/* File Metadata Overview */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-secondary/30 rounded-xl border border-border text-xs">
                    <div>
                      <span className="text-muted-foreground block">{language === 'pt' ? 'Formato / Versão' : 'Format / Version'}</span>
                      <span className="font-bold uppercase">{importPreview.metadata?.format} v{importPreview.metadata?.version}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">{language === 'pt' ? 'Gerado Em' : 'Generated On'}</span>
                      <span className="font-bold">
                        {importPreview.metadata?.createdAt ? new Date(importPreview.metadata.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">{language === 'pt' ? 'Versão do App' : 'App Version'}</span>
                      <span className="font-bold">{importPreview.metadata?.appVersion}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">{language === 'pt' ? 'Idioma / Tema' : 'Language / Theme'}</span>
                      <span className="font-bold uppercase">{importPreview.metadata?.language} / {importPreview.metadata?.theme}</span>
                    </div>
                  </div>

                  {/* Selective Restore & Smart Merge Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Restauração Seletiva */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold flex items-center gap-1.5 uppercase text-muted-foreground">
                        <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                        {language === 'pt' ? '1. Restauração Seletiva' : '1. Selective Restore'}
                      </h4>
                      <div className="space-y-2.5 bg-card border border-border p-4 rounded-xl text-xs">
                        <label className="flex items-center justify-between cursor-pointer py-1 border-b border-border/50">
                          <span className="flex items-center gap-2">
                            <span className="font-bold">{importPreview.counts.decks}</span>
                            <span className="text-muted-foreground">{language === 'pt' ? 'Categorias e Cards' : 'Decks and Cards'}</span>
                          </span>
                          <input 
                            type="checkbox" 
                            checked={selectiveImport.decks} 
                            disabled={importPreview.counts.decks === 0}
                            onChange={(e) => setSelectiveImport(prev => ({ ...prev, decks: e.target.checked }))} 
                            className="rounded text-primary border-border focus:ring-primary h-4 w-4 bg-card"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer py-1 border-b border-border/50">
                          <span className="flex items-center gap-2">
                            <span className="font-bold">{importPreview.counts.studySessions}</span>
                            <span className="text-muted-foreground">{language === 'pt' ? 'Sessões de Estudos' : 'Study Sessions'}</span>
                          </span>
                          <input 
                            type="checkbox" 
                            checked={selectiveImport.sessions} 
                            disabled={importPreview.counts.studySessions === 0}
                            onChange={(e) => setSelectiveImport(prev => ({ ...prev, sessions: e.target.checked }))} 
                            className="rounded text-primary border-border focus:ring-primary h-4 w-4 bg-card"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer py-1">
                          <span className="flex items-center gap-2">
                            <span className="font-bold">{importPreview.counts.hasStats ? '1' : '0'}</span>
                            <span className="text-muted-foreground">{language === 'pt' ? 'Estatísticas & XP' : 'Stats & XP records'}</span>
                          </span>
                          <input 
                            type="checkbox" 
                            checked={selectiveImport.stats} 
                            disabled={!importPreview.counts.hasStats}
                            onChange={(e) => setSelectiveImport(prev => ({ ...prev, stats: e.target.checked }))} 
                            className="rounded text-primary border-border focus:ring-primary h-4 w-4 bg-card"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Resolução de Conflitos */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold flex items-center gap-1.5 uppercase text-muted-foreground">
                        <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                        {language === 'pt' ? '2. Tratamento de Conflitos' : '2. Conflict Resolution'}
                      </h4>
                      <div className="space-y-2 bg-card border border-border p-4 rounded-xl text-[11px]">
                        {[
                          { id: 'merge', title: language === 'pt' ? 'Mesclar (Recomendado)' : 'Smart Merge (Recommended)', desc: language === 'pt' ? 'Combina estatísticas SM-2 escolhendo a mais avançada e soma XP.' : 'Combines study states and accumulates XP progress.' },
                          { id: 'overwrite', title: language === 'pt' ? 'Substituir Tudo' : 'Overwrite All', desc: language === 'pt' ? 'Substitui deques e cards locais se houver colisão de IDs.' : 'Overwrites local decks/cards upon key collisions.' },
                          { id: 'duplicate', title: language === 'pt' ? 'Duplicar Registros' : 'Keep Both (Duplicate)', desc: language === 'pt' ? 'Gera novos IDs para os itens importados, gerando cópias.' : 'Generates new IDs to import elements as separate copies.' },
                          { id: 'ignore', title: language === 'pt' ? 'Ignorar Conflitos' : 'Ignore Conflicts', desc: language === 'pt' ? 'Importa apenas novos registros, ignorando conflitos de ID.' : 'Skips imported items that already exist locally.' }
                        ].map((strat) => (
                          <label 
                            key={strat.id} 
                            className={`block p-2 rounded-lg border cursor-pointer transition-all ${
                              mergeStrategy === strat.id 
                                ? 'bg-primary/5 border-primary text-foreground font-semibold' 
                                : 'border-transparent text-muted-foreground'
                            }`}
                          >
                            <input 
                              type="radio" 
                              name="merge_strategy" 
                              checked={mergeStrategy === strat.id}
                              onChange={() => setMergeStrategy(strat.id as any)}
                              className="sr-only" 
                            />
                            <span>{strat.title}</span>
                            <span className="block text-[9px] text-muted-foreground font-normal leading-normal mt-0.5">{strat.desc}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Conflict Analyzer Warning */}
                  {importPreview.conflicts.summary.deckConflictsCount > 0 && (
                    <div className="p-4 bg-orange-500/5 border border-orange-500/20 text-orange-500 rounded-xl text-xs flex gap-3">
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">
                          {language === 'pt' ? 'Conflitos Identificados' : 'Conflicts Detected'}
                        </span>
                        <p className="mt-0.5 leading-relaxed text-muted-foreground">
                          {language === 'pt' 
                            ? `Foram encontrados ${importPreview.conflicts.summary.deckConflictsCount} deques e ${importPreview.conflicts.summary.cardConflictsCount} cards com IDs coincidentes na base local. A estratégia "${mergeStrategy}" será aplicada para resolvê-los.`
                            : `${importPreview.conflicts.summary.deckConflictsCount} decks and ${importPreview.conflicts.summary.cardConflictsCount} cards with matching IDs were detected. Strategy "${mergeStrategy}" will solve them.`
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Protection Alert */}
                  <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl text-xs flex gap-3 text-indigo-500">
                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">
                        {language === 'pt' ? 'Mecanismo de Proteção Ativado' : 'Safety Engine Active'}
                      </span>
                      <p className="mt-0.5 leading-relaxed text-muted-foreground">
                        {language === 'pt' 
                          ? 'Um snapshot compactado contendo todos os seus dados locais atuais será gerado automaticamente no IndexedDB antes de iniciarmos a importação. Em caso de problemas, você poderá restaurá-lo na aba "Snapshots Locais".'
                          : 'A compressed database snapshot containing all current data will be created in IndexedDB before importing. You can perform a full rollback at any time under the "Local Snapshots" tab.'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <button
                      onClick={() => {
                        setImportPayload(null);
                        setImportPreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="cursor-pointer bg-secondary hover:bg-accent border border-border text-foreground font-semibold rounded-lg px-4 py-2 text-xs shadow transition-colors"
                    >
                      {language === 'pt' ? 'Cancelar / Limpar' : 'Cancel / Clear'}
                    </button>

                    <button
                      onClick={handleImport}
                      disabled={importProgress !== null || (!selectiveImport.decks && !selectiveImport.stats && !selectiveImport.sessions)}
                      className="cursor-pointer inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-lg px-5 py-2.5 text-xs shadow transition-colors disabled:opacity-50"
                    >
                      {importProgress !== null ? (
                        <>
                          <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                          {language === 'pt' ? `Gravando (${importProgress}%)` : `Writing (${importProgress}%)`}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          {language === 'pt' ? 'Confirmar Importação' : 'Confirm Import'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SNAPSHOTS & ROLLS */}
          {activeTab === 'snapshots' && (
            <div className="space-y-6">
              {snapshotSuccessMsg && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-500 flex gap-3">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <p className="font-medium">{snapshotSuccessMsg}</p>
                </div>
              )}

              {/* Create Manual Snapshot Form */}
              <form onSubmit={handleCreateManualSnapshot} className="bg-secondary/20 border border-border p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-primary" />
                  {language === 'pt' ? 'Criar Ponto de Restauração (Snapshot)' : 'Create Manual Backup Snapshot'}
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder={language === 'pt' ? 'Ex: Antes de limpar cards do OpenTDB' : 'Ex: Before bulk deck deletions'}
                    value={manualSnapshotLabel}
                    onChange={(e) => setManualSnapshotLabel(e.target.value)}
                    className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    disabled={isCreatingSnapshot || !manualSnapshotLabel.trim()}
                    className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-lg px-4 py-2 shadow transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {isCreatingSnapshot ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      language === 'pt' ? 'Criar Snapshot' : 'Create Snapshot'
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  {language === 'pt' 
                    ? 'Snapshots são guardados localmente no IndexedDB e permitem desfazer modificações acidentais instantaneamente.'
                    : 'Snapshots are saved locally inside IndexedDB, enabling you to undo any accidents instantly.'
                  }
                </p>
              </form>

              {/* Snapshot List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-muted-foreground">
                  {language === 'pt' ? 'Pontos de Restauração Salvos' : 'Saved Restore Points'}
                </h4>

                {snapshots.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8 bg-card border border-border rounded-xl">
                    {language === 'pt' ? 'Nenhum ponto de restauração registrado.' : 'No snapshots registered yet.'}
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {snapshots.map((snap) => (
                      <div 
                        key={snap.Id} 
                        className="flex justify-between items-center p-3 rounded-xl bg-card border border-border hover:bg-secondary/30 transition-colors text-xs"
                      >
                        <div className="truncate pr-4">
                          <span className="font-bold block text-foreground truncate">{snap.Label}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(snap.Timestamp).toLocaleString(language)} • ID: {snap.Id.substring(0, 8)}
                          </span>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleRestoreSnapshot(snap.Id)}
                            className="cursor-pointer bg-secondary hover:bg-primary/10 hover:text-primary border border-border text-foreground font-semibold rounded-lg px-3 py-1.5 text-[10px] transition-colors"
                          >
                            {language === 'pt' ? 'Restaurar' : 'Restore'}
                          </button>
                          <button
                            onClick={() => handleDeleteSnapshot(snap.Id)}
                            className="cursor-pointer bg-secondary hover:bg-rose-500/10 hover:text-rose-500 border border-border text-muted-foreground rounded-lg p-1.5 transition-colors"
                            title={language === 'pt' ? 'Excluir snapshot' : 'Delete snapshot'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
