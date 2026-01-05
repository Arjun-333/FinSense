import { useNavigate, useLocation } from 'react-router-dom';
import { Home, List, Plus, PieChart, User } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: List, label: 'History', path: '/expenses' },
    { icon: Plus, label: 'Add', path: '/add', isFab: true },
    { icon: PieChart, label: 'Analysis', path: '/analysis' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 safe-area-pb z-50 md:hidden">
      <div className="flex justify-around items-center h-20 px-1 relative">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isFab) {
             return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center space-y-1 z-10"
              >
                <div className="bg-primary hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 ring-4 ring-white dark:ring-slate-900">
                  <Icon size={28} />
                </div>
                {/* <span className="text-[10px] text-gray-500 font-medium">Add</span> */}
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={clsx(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative",
                isActive ? "text-primary dark:text-blue-400" : "text-slate-400 dark:text-slate-500 hover:text-slate-600"
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={clsx("text-[10px] font-medium", isActive ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-600")}>
                  {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
