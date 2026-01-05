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
      <div className="flex justify-around items-center h-16 px-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isFab) {
             return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center w-full h-full space-y-1"
              >
                <div className="bg-primary hover:bg-blue-700 text-white p-2.5 rounded-xl shadow-sm transition-colors">
                  <Icon size={22} />
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
