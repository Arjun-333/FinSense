import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import API from '../api/axios';
import { ArrowLeft, Plus, Target, Trophy, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'];

const Goals = () => {
    const navigate = useNavigate();
    const [goals, setGoals] = useState([]);
    const { addToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form State
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [savedAmount, setSavedAmount] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const { data } = await API.get('/goals');
            setGoals(data);
        } catch (error) {
            console.error("Failed to load goals");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGoal = async (e) => {
        e.preventDefault();
        try {
            await API.post('/goals', {
                name,
                targetAmount: Number(targetAmount),
                savedAmount: Number(savedAmount),
                color: selectedColor
            });
            setIsModalOpen(false);
            resetForm();
            fetchGoals();
            fetchGoals();
            addToast("Goal created successfully", "success");
        } catch (error) {
            addToast("Failed to create goal", "error");
        }
    };

    const handleDeleteGoal = async (id) => {
        if(window.confirm("Delete this goal?")) {
            try {
                await API.delete(`/goals/${id}`);
                setGoals(goals.filter(g => g._id !== id));
                addToast("Goal deleted", "success");
            } catch (e) { addToast("Failed to delete goal", "error"); }
        }
    }

    const handleAddMoney = async (goal) => {
        const amount = prompt("Amount to add to savings:");
        if (amount) {
            try {
                const newAmount = goal.savedAmount + Number(amount);
                await API.put(`/goals/${goal._id}`, { savedAmount: newAmount });
                fetchGoals();
                addToast("Money added to goal!", "success");
            } catch (e) { addToast("Failed to update goal", "error"); }
        }
    }

    const resetForm = () => {
        setName('');
        setTargetAmount('');
        setSavedAmount('');
        setSelectedColor(COLORS[0]);
    }

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="pb-24 pt-6 px-4">
             <div className="sticky top-0 bg-gray-50 dark:bg-slate-950 z-10 p-4 mb-2 flex items-center justify-between -mx-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300">
                        <ArrowLeft />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Savings Goals</h1>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="p-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-colors flex items-center gap-2 px-4"
                >
                    <Plus size={20} />
                    <span className="text-sm font-bold">New Goal</span>
                </button>
            </div>

            <div className="grid gap-4">
                {goals.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700">
                         <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Trophy size={32} />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">No Goals Yet</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Start saving for your dreams!</p>
                    </div>
                ) : (
                    goals.map(goal => {
                        const percent = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
                        return (
                            <div key={goal._id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleDeleteGoal(goal._id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                                </div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-700 text-emerald-500">
                                            <Target size={20} style={{ color: goal.color }} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{goal.name}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Target: ₹{goal.targetAmount.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleAddMoney(goal)}
                                        className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-90"
                                    >
                                        + Add Money
                                    </button>
                                </div>

                                <div className="mb-2 flex justify-between text-sm font-medium">
                                    <span style={{ color: goal.color }}>₹{goal.savedAmount.toLocaleString()}</span>
                                    <span className="text-gray-400">{Math.round(percent)}%</span>
                                </div>
                                <div className="h-4 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percent}%` }}
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{ backgroundColor: goal.color }}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                 <div className="fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center p-4 backdrop-blur-sm">
                    <motion.div 
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl"
                    >
                         <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Create Checkpoint</h2>
                         <form onSubmit={handleCreateGoal} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Name</label>
                                <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-slate-800 dark:text-white" placeholder="e.g. Goa Trip" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Amount (₹)</label>
                                <input type="number" value={targetAmount} onChange={e=>setTargetAmount(e.target.value)} className="w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-slate-800 dark:text-white" placeholder="20000" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
                                <div className="flex gap-2">
                                    {COLORS.map(c => (
                                        <button key={c} type="button" onClick={()=>setSelectedColor(c)} className="w-8 h-8 rounded-full flex items-center justify-center transform transition-transform hover:scale-110" style={{backgroundColor: c}}>
                                            {selectedColor === c && <Check size={16} className="text-white"/>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={()=>setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl font-bold">Create</button>
                            </div>
                         </form>
                    </motion.div>
                 </div>
            )}
        </div>
    );
}

export default Goals;
