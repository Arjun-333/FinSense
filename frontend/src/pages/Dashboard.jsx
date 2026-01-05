import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, Utensils, Car, Film, Receipt, ShoppingBag, Activity, Banknote, Trophy, Calculator, Calendar as CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
const COLORS = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

const Dashboard = () => {
    const { user } = useAuth();
    const { theme } = useTheme(); // To handle stroke color in chart
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalSpent, setTotalSpent] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [insights, setInsights] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [expRes, catRes, budgetRes, insightRes] = await Promise.all([
                    API.get('/expenses'),
                    API.get('/categories'),
                    API.get('/budgets'),
                    API.get('/analytics/insights')
                ]);
                
                setExpenses(expRes.data);
                setCategories(catRes.data);
                
                // Calculate Total Spent (Only Type = 'expense')
                const total = expRes.data
                    .filter(item => item.type === 'expense')
                    .reduce((acc, curr) => acc + Number(curr.amount), 0);
                setTotalSpent(total);
                
                // Calculate Total Income
                const income = expRes.data
                    .filter(item => item.type === 'income')
                    .reduce((acc, curr) => acc + Number(curr.amount), 0);
                setTotalIncome(income);

                setInsights(insightRes.data);

            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const recentExpenses = expenses.slice(0, 5);

    // Chart Data (Only Expenses)
    const categoryData = expenses
        .filter(item => item.type === 'expense')
        .reduce((acc, curr) => {
            const catName = curr.category?.name || 'Uncategorized';
            const existing = acc.find(item => item.name === catName);
            if (existing) {
                existing.value += curr.amount;
            } else {
                acc.push({ name: catName, value: curr.amount, color: curr.category?.color || '#000' });
            }
            return acc;
        }, []);
    
    // Helper to get icon
    const getCategoryIcon = (iconName) => {
        switch (iconName) {
            case 'Utensils': return <Utensils size={20} />;
            case 'Car': return <Car size={20} />;
            case 'Film': return <Film size={20} />;
            case 'Receipt': return <Receipt size={20} />;
            case 'ShoppingBag': return <ShoppingBag size={20} />;
            case 'Activity': return <Activity size={20} />;
            case 'Banknote': return <Banknote size={20} />;
            default: return <Wallet size={20} />;
        }
    };



    return (
        <div className="pb-24 space-y-6">
            <header className="px-4 pt-4 pb-2">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Balance</p>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                          {loading ? <span className="animate-pulse bg-slate-200 dark:bg-slate-700 h-8 w-32 block rounded"></span> : `₹${(totalIncome - totalSpent).toLocaleString()}`}
                        </h1>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold border border-slate-300 dark:border-slate-600">
                        {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                </div>
            </header>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 gap-3 px-4 mb-6">
                {/* Total Income */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
                            <ArrowUpRight size={16} />
                        </div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Income</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {loading ? <span className="animate-pulse bg-slate-200 dark:bg-slate-700 h-6 w-24 block rounded"></span> : `₹${totalIncome.toLocaleString()}`}
                    </p>
                </div>

                {/* Total Spent */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600">
                            <ArrowDownRight size={16} />
                        </div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Expenses</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {loading ? <span className="animate-pulse bg-slate-200 dark:bg-slate-700 h-6 w-24 block rounded"></span> : `₹${totalSpent.toLocaleString()}`}
                    </p>
                </div>
            </div>

            {/* Quick Access */}
            <div className="grid grid-cols-4 gap-2 px-4 mb-6">
                <Link to="/budgets" className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95 transition-transform">
                    <TrendingUp size={20} className="text-blue-500" />
                    <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">Budgets</span>
                </Link>
                <Link to="/analysis" className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95 transition-transform">
                    <Activity size={20} className="text-emerald-500" />
                    <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">Analysis</span>
                </Link>
                <Link to="/goals" className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95 transition-transform">
                    <Trophy size={20} className="text-amber-500" />
                    <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">Goals</span>
                </Link>
                <Link to="/calendar" className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95 transition-transform">
                    <CalendarIcon size={20} className="text-purple-500" />
                    <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">Calendar</span>
                </Link>
            </div>

            {/* Chart Section */}
            <div className="mb-6">
                <div className="px-4 mb-3">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm">Spending Breakdown</h3>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 mx-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-64 flex items-center justify-center">
                    {loading ? (
                         <div className="animate-pulse flex flex-col items-center gap-4 w-full">
                            <div className="h-40 w-40 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                         </div>
                    ) : categoryData.length === 0 ? (
                         <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <PieChart size={32} className="mb-2 opacity-50"/>
                            <span className="text-xs">No data to display</span>
                         </div>
                    ) : (
                        <>
                            <div className="flex-1 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={45}
                                            outerRadius={70}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} strokeWidth={1} stroke={theme === 'dark' ? '#1e293b' : '#fff'} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-1/3 flex flex-col justify-center gap-2 overflow-y-auto max-h-full pl-2">
                                {categoryData.sort((a,b) => b.value - a.value).slice(0,5).map((entry, index) => (
                                     <div key={index} className="space-y-0.5">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color || COLORS[index % COLORS.length] }}></div>
                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 truncate">{entry.name}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 pl-3.5">₹{entry.value.toLocaleString()}</p>
                                     </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="px-4">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-gray-800 dark:text-gray-100 text-sm">Recent Activity</h2>
                    <Link to="/expenses" className="text-primary text-xs font-medium hover:underline">View All</Link>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                     {expenses && expenses.length > 0 ? (
                        expenses.slice(0, 5).map((expense, i) => (
                         <div key={expense._id} className={clsx(
                             "p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors",
                             i !== expenses.slice(0, 5).length - 1 && "border-b border-slate-100 dark:border-slate-700"
                         )}>
                             <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                                    {getCategoryIcon(expense.category?.icon)}
                                </div>
                                <div>
                                    <p className="font-medium text-sm text-gray-900 dark:text-white capitalize">{expense.category?.name}</p>
                                    <p className="text-[10px] text-gray-500">{new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {expense.description || 'No desc'}</p>
                                </div>
                             </div>
                             <span className={clsx(
                                 "font-medium text-sm",
                                 expense.type === 'income' ? "text-emerald-600" : "text-gray-900 dark:text-gray-200"
                             )}>
                                {expense.type === 'income' ? '+' : '-'} ₹{expense.amount}
                             </span>
                         </div>
                     ))
                    ) : (
                         <div className="text-center py-6">
                              <p className="text-gray-400 text-xs">No recent activity</p>
                         </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
