import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

const COLORS = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

const Dashboard = () => {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalSpent, setTotalSpent] = useState(0); // Changed totalSpent to state
    const [insights, setInsights] = useState([]); // New state

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
                // Calculate total spent
                const total = expRes.data.reduce((acc, curr) => acc + Number(curr.amount), 0);
                setTotalSpent(total);
                
                setInsights(insightRes.data);

            } catch (error) {
                console.error("Failed to load dashboard data", error); // Updated error message
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Derived Data
    const recentExpenses = expenses.slice(0, 5);

    // Group by category for chart
    const categoryData = expenses.reduce((acc, curr) => {
        const catName = curr.category?.name || 'Uncategorized';
        const existing = acc.find(item => item.name === catName);
        if (existing) {
            existing.value += curr.amount;
        } else {
            acc.push({ name: catName, value: curr.amount, color: curr.category?.color || '#000' });
        }
        return acc;
    }, []);

    if (loading) return (
      <div className="flex justify-center items-center h-screen text-primary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );

    return (
        <div className="pb-24 space-y-6">
            <header className="flex justify-between items-center px-4 pt-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hello, {user?.name} 👋</h1>
                    <p className="text-gray-500 text-sm">Here's your financial overview</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user?.name?.[0]}
                    </div>
                </div>
            </header>

            {/* Main Card */}
            <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl shadow-gray-900/20 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mt-10 -mr-10 blur-2xl"></div>
                <div className="relative z-10">
                    <p className="text-gray-400 text-sm font-medium mb-1">Total Spent this Month</p>
                    <h2 className="text-4xl font-bold mb-4">₹{totalSpent.toLocaleString()}</h2>
                    
                    <div className="flex gap-3">
                        <div className="bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs backdrop-blur-sm">
                            <div className="w-4 h-4 rounded-full bg-green-400/20 flex items-center justify-center text-green-400">
                                <ArrowDownRight size={10} />
                            </div>
                            <span>-2.5% vs last month</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800">Spending by Category</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-64 flex items-center justify-center">
                    {categoryData.length === 0 ? (
                        <p className="text-gray-400 text-sm">No expenses yet</p>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
                {/* Legend */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {categoryData.slice(0,4).map((entry, index) => (
                         <div key={index} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-700 px-2 py-1 rounded border border-gray-100 dark:border-slate-600">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            {entry.name} ({Math.round((entry.value / totalSpent) * 100)}%)
                         </div>
                    ))}
                </div>
            </div>

            {/* Summary Card */}
            <div className="px-4">
                <div className="bg-primary text-white p-6 rounded-3xl shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <div className="relative z-10">
                        <p className="text-indigo-100 text-sm font-medium mb-1">Total Spent This Month</p>
                        <h2 className="text-4xl font-bold tracking-tight">₹{totalSpent}</h2>
                        <div className="mt-4 flex items-center gap-2 text-sm bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                             <span>📊</span>
                             <span>Within Budget</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="px-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-800 dark:text-gray-100 text-lg">Recent Activity</h2>
                    <button className="text-primary text-sm font-semibold hover:underline">See All</button>
                </div>
                
                <div className="space-y-3">
                     {expenses.slice(0, 3).map(expense => (
                         <div key={expense._id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-slate-700 shadow-sm">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-slate-700 flex items-center justify-center text-2xl">
                                    {expense.category?.icon === 'Utensils' ? '🍔' : '💸'}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{expense.category?.name}</p>
                                    <p className="text-xs text-gray-400">{new Date(expense.date).toLocaleDateString()}</p>
                                </div>
                             </div>
                             <span className="font-bold text-gray-900 dark:text-gray-100">-₹{expense.amount}</span>
                         </div>
                     ))}
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="px-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 dark:text-white">Recent Transactions</h3>
                    <Link to="/expenses" className="text-sm text-primary font-medium hover:underline">View All</Link>
                </div>
                
                <div className="space-y-3">
                    {recentExpenses.length === 0 ? (
                         <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                             <p className="text-gray-400 text-sm">No transactions found</p>
                             <Link to="/add" className="text-primary text-sm font-medium mt-2 block">Add your first expense</Link>
                         </div>
                    ) : (
                        recentExpenses.map((expense) => (
                            <div key={expense._id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-700 flex items-center justify-center text-xl">
                                        {/* Simple Emoji or Icon based on category could go here */}
                                        📝
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{expense.category?.name}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {expense.paymentMethod}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-gray-900 dark:text-white">-₹{expense.amount}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
