import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react';

const Welcome = () => {
  const [name, setName] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    await login(name);
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Left Side - Visuals (Hidden on small mobile) */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-emerald-900/40 z-0"></div>
        <img 
            src="/hero.png" 
            alt="Financial Growth" 
            className="relative z-10 max-w-lg object-contain drop-shadow-2xl animate-float"
        />
        <div className="absolute bottom-10 left-10 z-20">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                Master Your Money
            </h2>
            <p className="text-slate-400 mt-2 max-w-md">
                Track expenses, set budgets, and achieve financial freedom with FinSense.
            </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16 relative">
         <div className="w-full max-w-md space-y-8">
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center lg:text-left"
             >
                 <div className="inline-flex items-center gap-2 mb-6 bg-slate-800/50 px-4 py-1.5 rounded-full border border-slate-700/50 backdrop-blur-sm">
                     <ShieldCheck size={16} className="text-emerald-400" />
                     <span className="text-xs font-medium text-emerald-400 tracking-wide uppercase">Secure & Private</span>
                 </div>
                 <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
                     Welcome to <span className="text-blue-500">FinSense</span>
                 </h1>
                 <p className="text-lg text-slate-400">
                     Your intelligent financial companion. Let's get to know you.
                 </p>
             </motion.div>

             <motion.form 
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
             >
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-slate-300 ml-1">
                        What should we call you?
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 text-white text-lg"
                        placeholder="John Doe"
                        autoFocus
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-[0.99]"
                >
                    <span>Get Started</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </motion.form>

             <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center text-xs text-slate-500 mt-8"
             >
                 By continuing, you agree to start your journey to better financial health.
             </motion.p>
         </div>
      </div>
    </div>
  );
};

export default Welcome;
