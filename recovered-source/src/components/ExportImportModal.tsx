import React, { useState } from 'react';
import { X, Download, Upload, Check, Copy, FileText, RefreshCw } from 'lucide-react';
import { Product } from '../types';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onImportProducts: (imported: Product[]) => void;
  onResetToDefault: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  products,
  onImportProducts,
  onResetToDefault
}) => {
  if (!isOpen) return null;

  const [jsonText, setJsonText] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleExportDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `PricePulse_Tracked_Products_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(products, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportSubmit = () => {
    setError(null);
    setSuccessMsg(null);
    try {
      if (!jsonText.trim()) {
        setError('Please paste valid JSON data');
        return;
      }
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        setError('Imported JSON must be an array of products');
        return;
      }
      onImportProducts(parsed);
      setSuccessMsg(`Successfully imported ${parsed.length} products!`);
      setJsonText('');
    } catch (err: any) {
      setError('Invalid JSON syntax. Please check formatting.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">Export / Import Tracker</h3>
              <p className="text-xs text-slate-400">Backup your watchlist or restore from JSON</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Export Section */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h4 className="font-semibold text-xs text-slate-300 uppercase tracking-wider">Export Current Watchlist</h4>
            <p className="text-xs text-slate-400">Save {products.length} tracked items with price histories to a local file.</p>
            
            <div className="flex gap-2">
              <button
                onClick={handleExportDownload}
                className="flex-1 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Download JSON File
              </button>

              <button
                onClick={handleCopyJSON}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy JSON'}
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h4 className="font-semibold text-xs text-slate-300 uppercase tracking-wider">Import Products JSON</h4>
            <p className="text-xs text-slate-400">Paste product JSON data below to restore tracked list.</p>

            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder='Paste JSON array of products here...'
              rows={4}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
            />

            {error && <p className="text-xs text-red-400">{error}</p>}
            {successMsg && <p className="text-xs text-emerald-400 font-medium">{successMsg}</p>}

            <button
              onClick={handleImportSubmit}
              disabled={!jsonText.trim()}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              Import Watchlist
            </button>
          </div>

          {/* Reset Section */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">Restore initial demo dataset?</span>
            <button
              onClick={() => {
                onResetToDefault();
                onClose();
              }}
              className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Demo Products
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
