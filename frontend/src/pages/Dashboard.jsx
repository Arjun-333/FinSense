import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, Utensils, Car, Film, Receipt, ShoppingBag, Activity, Banknote, Trophy, Calculator, Calendar as CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
const COLORS = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

const Dashboard = () => {
    const { user } = useAuth();
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

    if (loading) return (
      <div className="flex justify-center items-center h-screen text-primary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );

    return (
        <div className="pb-24 space-y-6">
            <header className="flex justify-between items-center px-4 pt-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hello, {user?.name}</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Here's your financial overview</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 overflow-hidden border border-indigo-200 dark:border-indigo-800">
                    <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                        {user?.name?.[0]}
                    </div>
                </div>
            </header>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Total Spent */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 mb-3">
                            <ArrowDownRight size={16} />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-1">Total Spent</p>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-primary">₹{totalSpent.toLocaleString()}</h2>
                    </div>
                </div>

                {/* Total Income */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-3">
                            <ArrowUpRight size={16} />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-1">Total Income</p>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-primary">₹{totalIncome.toLocaleString()}</h2>
                    </div>
                </div>
            </div>

            {/* Quick Access */}
            <div className="grid grid-cols-2 gap-4 px-4 mb-8">
                <Link to="/budgets" className="bg-indigo-600 text-white p-4 rounded-2xl shadow-lg shadow-indigo-500/30 flex flex-col justify-between h-24 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <TrendingUp size={48} />
                    </div>
                    <TrendingUp size={24} />
                    <span className="font-bold">Monthly Budgets</span>
                </Link>
                <Link to="/analysis" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-between h-24">
                   <Activity size={24} className="text-primary" />
                   <span className="font-bold">Analytics</span>
                </Link>
                <Link to="/goals" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-between h-24">
                   <Trophy size={24} className="text-emerald-500" />
                   <span className="font-bold">Goals</span>
                </Link>
                <Link to="/tools" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-between h-24">
                   <Calculator size={24} className="text-purple-500" />
                   <span className="font-bold">Tools</span>
                </Link>
                <Link to="/calendar" className="col-span-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between h-20">
                   <div className="flex items-center gap-3">
                       <div className="p-2 bg-blue-50 dark:bg-slate-700/50 rounded-xl text-blue-500">
                           <CalendarIcon size={24} />
                       </div>
                       <span className="font-bold">Calendar View</span>
                   </div>
                   <ArrowUpRight size={16} className="text-gray-400" />
                </Link>
            </div>

            {/* Chart Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4 px-4">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200">Spending by Category</h3>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 mx-4 h-72 flex flex-col items-center justify-center">
                    {categoryData.length === 0 ? (
                        <div className="text-center">
                             <div className="w-16 h-16 bg-gray-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300 dark:text-slate-500">
                                <PieChart size={32} />
                             </div>
                             <p className="text-gray-400 dark:text-slate-500 text-sm">No expenses yet</p>
                        </div>
                    ) : (
                        <>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={85}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex flex-wrap justify-center gap-2 mt-2">
                                {categoryData.slice(0,4).map((entry, index) => (
                                     <div key={index} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-700/50 px-2 py-1 rounded-lg border border-gray-100 dark:border-slate-600">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        {entry.name}
                                     </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="px-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-800 dark:text-gray-100 text-lg">Recent Activity</h2>
                    <Link to="/expenses" className="text-primary text-sm font-semibold hover:underline">See All</Link>
                </div>
                
                <div className="space-y-3">
                     {expenses.slice(0, 3).map(expense => (
                         <div key={expense._id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-slate-700 flex items-center justify-center text-primary dark:text-indigo-400">
                                    {getCategoryIcon(expense.category?.icon)}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white capitalize">{expense.category?.name}</p>
                                    <p className="text-xs text-gray-400">{new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                                </div>
                             </div>
                             <span className={clsx(
                                 "font-bold",
                                 expense.type === 'income' ? "text-green-500" : "text-gray-900 dark:text-gray-100"
                             )}>
                                {expense.type === 'income' ? '+' : '-'}₹{expense.amount}
                             </span>
                         </div>
                     ))}
                     {expenses.length === 0 && (
                         <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                              <p className="text-gray-400 text-sm">No recent activity</p>
                         </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
