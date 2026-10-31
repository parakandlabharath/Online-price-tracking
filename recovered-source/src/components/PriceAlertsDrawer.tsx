import React from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Trash2, 
  Zap
} from 'lucide-react';
import { NotificationItem } from '../types';
import { formatPrice } from '../lib/formatters';

interface PriceAlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onSelectProduct: (productId: string) => void;
  onSimulatePriceDrop: () => void;
}

export const PriceAlertsDrawer: React.FC<PriceAlertsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll,
  onSelectProduct,
  onSimulatePriceDrop
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base text-white">Price Alert Center</h3>
                <p className="text-xs text-slate-400">
                  {unreadCount > 0 ? `${unreadCount} new notifications` : 'All caught up'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Bar */}
          <div className="px-5 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
            <button
              onClick={onSimulatePriceDrop}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-medium border border-emerald-500/20 transition-colors flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5" />
              Test Price Drop Trigger
            </button>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark Read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 space-y-3 text-slate-500">
                <Bell className="w-10 h-10 mx-auto opacity-30" />
                <p className="text-xs">No price drop alerts recorded yet.</p>
                <button
                  onClick={onSimulatePriceDrop}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700"
                >
                  Generate Test Alert
                </button>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectProduct(item.productId)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer hover:border-slate-700 ${
                    !item.read
                      ? 'bg-slate-800/90 border-emerald-500/30'
                      : 'bg-slate-950/40 border-slate-800 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={item.productImage}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover bg-slate-950 shrink-0 border border-slate-800"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-semibold text-emerald-400">{item.store}</span>
                        <span>{item.timestamp}</span>
                      </div>

                      <h4 className="font-semibold text-xs text-white line-clamp-1">{item.productTitle}</h4>

                      <p className="text-xs text-slate-300 leading-relaxed">{item.message}</p>

                      <div className="pt-1 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">
                          Old: <span className="line-through">{formatPrice(item.oldPrice)}</span>
                        </span>
                        <span className="font-bold text-emerald-400 text-xs">
                          Now: {formatPrice(item.newPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 text-xs text-slate-500 text-center">
            PricePulse re-checks live price updates automatically.
          </div>

        </div>
      </div>
    </div>
  );
};
