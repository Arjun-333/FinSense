import { createContext, useContext, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const getIcon = (type) => {
      switch(type) {
          case 'success': return <CheckCircle size={18} />;
          case 'error': return <AlertCircle size={18} />;
          default: return <Info size={18} />;
      }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-3 w-full max-w-sm px-4 pointer-events-none">
        <AnimatePresence>
            {toasts.map((toast) => (
            <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                layout
                className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-4 flex items-center gap-4 w-full pointer-events-auto ring-1 ring-black/5 dark:ring-white/10"
            >
                <div className={clsx(
                  "p-2 rounded-full",
                  toast.type === 'success' && "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
                  toast.type === 'error' && "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
                  toast.type === 'info' && "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                )}>
                  {getIcon(toast.type)}
                </div>
                <div className="flex-1">
                   <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Info'}</p>
                   <p className="text-sm text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{toast.message}</p>
                </div>
                <button 
                    onClick={() => removeToast(toast.id)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <X size={16} />
                </button>
            </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
