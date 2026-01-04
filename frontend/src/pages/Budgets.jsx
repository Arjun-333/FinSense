
import { useState, useEffect } from 'react';
import API from '../api/axios';
import { ArrowLeft, Plus, Edit2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const Budgets = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [expenses, setExpenses] = useState([]);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [bRes, cRes, eRes] = await Promise.all([
                API.get('/budgets'),
                API.get('/categories'),
                API.get('/expenses')
            ]);
            setBudgets(bRes.data);
            setCategories(cRes.data);
            setExpenses(eRes.data);
        } catch (error) {
            console.error("Failed to load budget data");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBudget = async (e) => {
        e.preventDefault();
        try {
            await API.post('/budgets', {
                category: selectedCategory,
                amount: Number(budgetAmount)
            });
            setIsModalOpen(false);
            setBudgetAmount('');
            setSelectedCategory('');
            fetchData(); // Refresh
        } catch (error) {
            console.error("Failed to save budget");
            alert("Failed to save budget");
        }
    };

    // Calculate progress for a category
    const getProgress = (catId, limit) => {
        // Filter expenses for this category in current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const spent = expenses
            .filter(e => 
                e.category && 
                e.category._id === catId && 
                new Date(e.date) >= startOfMonth &&
                e.type === 'expense'
            )
            .reduce((acc, curr) => acc + curr.amount, 0);

        const percentage = Math.min((spent / limit) * 100, 100);
        let color = 'bg-green-500';
        if (percentage > 80) color = 'bg-yellow-500';
        if (percentage >= 100) color = 'bg-red-500';

        return { spent, percentage, color };
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="pb-24 pt-6 px-4">
             {/* Header */}
             <div className="sticky top-0 bg-gray-50 dark:bg-slate-950 z-10 p-4 mb-2 flex items-center justify-between -mx-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300">
                        <ArrowLeft />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Monthly Budgets</h1>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-colors flex items-center gap-2 px-4"
                >
                    <Plus size={20} />
                    <span className="text-sm font-bold">Set Limit</span>
                </button>
            </div>

            <div className="space-y-6">
                {budgets.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">No Budgets Set</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Set a spending limit for a category to track your goals.</p>
                    </div>
                ) : (
                    budgets.map(budget => {
                        if (!budget.category) return null;
                        const { spent, percentage, color } = getProgress(budget.category._id, budget.amount);
                        const isOver = spent > budget.amount;

                        return (
                            <div key={budget._id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-700 text-2xl">
                                            {/* We can use a helper here or simple mapping, sticking to name usually work */}
                                            {/* Using a generic icon for now or we need the helper */}
                                            🔥
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{budget.category.name}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Monthly Limit: ₹{budget.amount}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setSelectedCategory(budget.category._id);
                                            setBudgetAmount(budget.amount);
                                            setIsModalOpen(true);
                                        }}
                                        className="text-gray-400 hover:text-primary transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                </div>
                                
                                <div className="mb-2 flex justify-between text-sm font-medium">
                                    <span className={clsx(isOver ? "text-red-500" : "text-gray-700 dark:text-gray-300")}>
                                        ₹{spent} <span className="text-gray-400 font-normal">spent</span>
                                    </span>
                                    <span className="text-gray-400">
                                        {Math.round(percentage)}%
                                    </span>
                                </div>
                                
                                <div className="h-3 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        className={clsx("h-full rounded-full transition-all duration-500", color)}
                                    />
                                </div>
                                {isOver && (
                                    <p className="text-xs text-red-500 mt-2 font-medium flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        You've exceeded your budget by ₹{spent - budget.amount}
                                    </p>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Set Budget Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm">
                    <motion.div 
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl"
                    >
                         <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Set Monthly Budget</h2>
                         <form onSubmit={handleSaveBudget} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                                    {categories.filter(c => c.type === 'expense').map(cat => (
                                        <button
                                            key={cat._id}
                                            type="button"
                                            onClick={() => setSelectedCategory(cat._id)}
                                            className={clsx(
                                                "p-2 text-xs font-bold rounded-lg border transition-all",
                                                selectedCategory === cat._id
                                                    ? "bg-primary text-white border-primary"
                                                    : "bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700"
                                            )}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Limit Amount (₹)</label>
                                <input 
                                    type="number" 
                                    value={budgetAmount}
                                    onChange={(e) => setBudgetAmount(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white outline-none focus:border-primary"
                                    placeholder="e.g. 5000"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 shadow-lg shadow-indigo-500/20"
                                >
                                    Save Budget
                                </button>
                            </div>
                         </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Budgets;
