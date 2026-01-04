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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb z-50 md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isFab) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center -mt-6"
              >
                <div className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-indigo-600 transition-colors">
                  <Icon size={28} />
                </div>
                <span className="text-xs mt-1 text-gray-500 font-medium">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={clsx(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative",
                isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
              )}
            >
              {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute -top-3 w-8 h-1 bg-primary rounded-b-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
              )}
              <Icon size={24} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
