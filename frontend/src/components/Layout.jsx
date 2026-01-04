import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import BottomNav from './BottomNav';
import { useTheme } from '../context/ThemeContext';

const Layout = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 pb-20 md:pb-0">
      <div className="hidden md:block bg-white dark:bg-slate-800 shadow-sm p-4 mb-4">
        <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-primary">FinSense</h1>
            <nav className="flex gap-4 items-center">
                {/* Theme toggle moved to Profile for cleaner UX */}
            </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-4 max-w-md md:max-w-4xl">
        <AnimatePresence mode="wait">
             <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
             >
                <Outlet />
             </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

export default Layout;
