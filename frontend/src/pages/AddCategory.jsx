import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { ArrowLeft, Check, Utensils, Car, Film, Receipt, ShoppingBag, Activity, Banknote, TrendingUp, Wallet, Home, Smartphone, Coffee, Gift, Briefcase, GraduationCap, Plane, Music, Gamepad2, Heart, Zap, Anchor } from 'lucide-react';
import { clsx } from 'clsx';

const ICONS = [
    { name: 'Utensils', Component: Utensils },
    { name: 'Car', Component: Car },
    { name: 'Film', Component: Film },
    { name: 'Receipt', Component: Receipt },
    { name: 'ShoppingBag', Component: ShoppingBag },
    { name: 'Activity', Component: Activity },
    { name: 'Banknote', Component: Banknote },
    { name: 'TrendingUp', Component: TrendingUp },
    { name: 'Home', Component: Home },
    { name: 'Smartphone', Component: Smartphone },
    { name: 'Coffee', Component: Coffee },
    { name: 'Gift', Component: Gift },
    { name: 'Briefcase', Component: Briefcase },
    { name: 'GraduationCap', Component: GraduationCap },
    { name: 'Plane', Component: Plane },
    { name: 'Music', Component: Music },
    { name: 'Gamepad2', Component: Gamepad2 },
    { name: 'Heart', Component: Heart },
    { name: 'Zap', Component: Zap },
    { name: 'Anchor', Component: Anchor },
];

const COLORS = [
    '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#10B981', '#06B6D4', 
    '#3B82F6', '#6366F1', '#8B5CF6', '#D946EF', '#F43F5E', '#64748B'
];

const AddCategory = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [type, setType] = useState('expense');
    const [selectedIcon, setSelectedIcon] = useState('Wallet');
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/categories', {
                name,
                type,
                icon: selectedIcon,
                color: selectedColor
            });
            navigate('/add'); // Go back to Add Transaction
        } catch (error) {
            console.error("Failed to create category", error);
            alert("Failed to create category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-24 pt-6 px-4">
             <div className="sticky top-0 bg-gray-50 dark:bg-slate-950 z-10 p-4 mb-2 flex items-center gap-4 -mx-4">
                <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300">
                    <ArrowLeft />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Category</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-lg mx-auto">
                {/* Name & Type */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="e.g. Gym, Stocks, Netflix"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Type</label>
                        <div className="grid grid-cols-2 bg-gray-100 dark:bg-slate-700 p-1 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setType('expense')}
                                className={clsx("py-2 rounded-lg text-sm font-bold transition-all", type === 'expense' ? "bg-white dark:bg-slate-600 shadow-sm text-red-500" : "text-gray-500")}
                            >
                                Expense
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('income')}
                                className={clsx("py-2 rounded-lg text-sm font-bold transition-all", type === 'income' ? "bg-white dark:bg-slate-600 shadow-sm text-green-500" : "text-gray-500")}
                            >
                                Income
                            </button>
                        </div>
                    </div>
                </div>

                {/* Color Picker */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Pick a Color</label>
                    <div className="flex flex-wrap gap-3">
                        {COLORS.map(color => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setSelectedColor(color)}
                                className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                                style={{ backgroundColor: color }}
                            >
                                {selectedColor === color && <Check size={20} className="text-white drop-shadow-md" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Icon Grid */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Select Icon</label>
                    <div className="grid grid-cols-5 gap-3">
                        {ICONS.map(({ name: iconName, Component }) => (
                            <button
                                key={iconName}
                                type="button"
                                onClick={() => setSelectedIcon(iconName)}
                                className={clsx(
                                    "aspect-square rounded-2xl flex items-center justify-center transition-all border",
                                    selectedIcon === iconName 
                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-105" 
                                        : "bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-gray-400 border-transparent hover:bg-gray-100 dark:hover:bg-slate-700"
                                )}
                            >
                                <Component size={24} />
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity shadow-xl"
                >
                    {loading ? 'Creating...' : 'Create Category'}
                </button>
            </form>
        </div>
    );
};

export default AddCategory;
