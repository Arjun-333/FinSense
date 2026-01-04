import { useState } from 'react';
import { ArrowLeft, Split, RefreshCw, Calculator, Calculator as ConverterIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const Tools = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('splitter'); // 'splitter', 'converter'

    // Splitter State
    const [billAmount, setBillAmount] = useState('');
    const [people, setPeople] = useState('2');
    const [tip, setTip] = useState('0');

    // Converter State
    const [amount, setAmount] = useState('');
    const [fromCurr, setFromCurr] = useState('USD');
    const [toCurr, setToCurr] = useState('INR');
    
    // Hardcoded simple rates for demo
    const RATES = {
        USD: { INR: 83.5, EUR: 0.92, GBP: 0.79 },
        EUR: { INR: 90.5, USD: 1.09, GBP: 0.86 },
        GBP: { INR: 105.2, USD: 1.27, EUR: 1.16 },
        INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095 }
    };

    const getSplitResult = () => {
        const bill = Number(billAmount) || 0;
        const tipAmount = (bill * (Number(tip) / 100));
        const total = bill + tipAmount;
        const perPerson = total / (Number(people) || 1);
        return { total, perPerson, tipAmount };
    };

    const getConvertedResult = () => {
        const val = Number(amount) || 0;
        if (fromCurr === toCurr) return val;
        const rate = RATES[fromCurr]?.[toCurr] || 1;
        return (val * rate).toFixed(2);
    };

    return (
         <div className="pb-24 pt-6 px-4">
             {/* Header */}
             <div className="sticky top-0 bg-gray-50 dark:bg-slate-950 z-10 p-4 mb-2 flex items-center gap-4 -mx-4">
                <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300">
                    <ArrowLeft />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tools</h1>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 bg-white dark:bg-slate-800 rounded-xl mb-6 border border-gray-100 dark:border-slate-700">
                <button
                    onClick={() => setActiveTab('splitter')}
                    className={clsx(
                        "flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                        activeTab === 'splitter'
                            ? "bg-indigo-50 dark:bg-slate-700 text-primary shadow-sm ring-1 ring-primary/20"
                            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    )}
                >
                    <Split size={18} /> Bill Splitter
                </button>
                <button
                    onClick={() => setActiveTab('converter')}
                    className={clsx(
                        "flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                        activeTab === 'converter'
                            ? "bg-indigo-50 dark:bg-slate-700 text-primary shadow-sm ring-1 ring-primary/20"
                            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    )}
                >
                    <RefreshCw size={18} /> Converter
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 min-h-[400px]">
                {activeTab === 'splitter' ? (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                         <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Total Bill</label>
                            <input type="number" value={billAmount} onChange={e=>setBillAmount(e.target.value)} className="w-full text-3xl font-bold bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-300" placeholder="0" />
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Tip %</label>
                                <div className="flex gap-2">
                                     {[0, 10, 15, 20].map(t => (
                                         <button key={t} onClick={()=>setTip(t)} className={clsx("flex-1 py-2 rounded-lg border text-sm font-bold", tip == t ? "bg-primary text-white border-primary" : "border-gray-200 dark:border-slate-600 text-gray-500")}>{t}%</button>
                                     ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">People</label>
                                <div className="flex items-center gap-4">
                                     <button onClick={()=>setPeople(Math.max(1, Number(people)-1))} className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-700 font-bold text-xl">-</button>
                                     <span className="text-xl font-bold w-4 text-center dark:text-white">{people}</span>
                                     <button onClick={()=>setPeople(Number(people)+1)} className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-700 font-bold text-xl">+</button>
                                </div>
                            </div>
                         </div>

                         <div className="bg-indigo-50 dark:bg-slate-900/50 p-6 rounded-2xl space-y-4">
                             <div className="flex justify-between items-center pb-4 border-b border-indigo-100 dark:border-slate-700">
                                 <span className="text-gray-500 dark:text-gray-400 font-medium">Tip Amount</span>
                                 <span className="font-bold text-gray-900 dark:text-white">₹{getSplitResult().tipAmount.toFixed(1)}</span>
                             </div>
                             <div className="flex justify-between items-center pb-4 border-b border-indigo-100 dark:border-slate-700">
                                 <span className="text-gray-500 dark:text-gray-400 font-medium">Total Bill</span>
                                 <span className="font-bold text-gray-900 dark:text-white text-lg">₹{getSplitResult().total.toFixed(0)}</span>
                             </div>
                             <div className="flex justify-between items-center pt-2">
                                 <div className="flex flex-col">
                                     <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">Per Person</span>
                                     <span className="text-[10px] text-primary font-bold">SPLIT BY {people}</span>
                                 </div>
                                 <span className="font-bold text-primary text-4xl">₹{getSplitResult().perPerson.toFixed(0)}</span>
                             </div>
                         </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                         <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center justify-between">
                             <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} className="bg-transparent text-2xl font-bold outline-none w-full text-gray-900 dark:text-white" placeholder="1" />
                             <select className="bg-transparent font-bold text-gray-500 outline-none" value={fromCurr} onChange={e=>setFromCurr(e.target.value)}>
                                 {Object.keys(RATES).map(c => <option key={c} value={c}>{c}</option>)}
                             </select>
                         </div>

                         <div className="flex justify-center">
                             <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-400">
                                 <RefreshCw size={20} />
                             </div>
                         </div>

                         <div className="p-4 bg-indigo-50 dark:bg-slate-900/50 rounded-2xl border border-indigo-100 dark:border-slate-700 flex items-center justify-between">
                             <span className="text-3xl font-bold text-primary">{getConvertedResult()}</span>
                             <select className="bg-transparent font-bold text-gray-500 outline-none" value={toCurr} onChange={e=>setToCurr(e.target.value)}>
                                 {Object.keys(RATES).map(c => <option key={c} value={c}>{c}</option>)}
                             </select>
                         </div>

                         <p className="text-center text-xs text-gray-400 mt-4">
                             *Rates are approximate estimates.
                         </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tools;
