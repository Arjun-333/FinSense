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
      {/* Top Bar for Theme Toggle */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 dark:border-slate-700 px-4 py-3 flex justify-between items-center md:hidden">
         <h1 className="font-bold text-xl text-primary">FinSense</h1>
         <button 
           onClick={toggleTheme}
           className="p-2 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
         >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
         </button>
      </div>

      <div className="hidden md:block bg-white dark:bg-slate-800 shadow-sm p-4 mb-4">
        <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-primary">FinSense</h1>
            <nav className="flex gap-4 items-center">
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
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
