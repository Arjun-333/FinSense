import { useState, useEffect } from 'react';
import API from '../api/axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const Analysis = () => {
    const [trends, setTrends] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [trendRes, expRes] = await Promise.all([
                    API.get('/trends'),
                    API.get('/expenses')
                ]);
                setTrends(trendRes.data);
                setExpenses(expRes.data);
            } catch (error) {
                console.error("Failed to load analysis data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Prepare Pie Data
    const categoryData = expenses.reduce((acc, curr) => {
        const catName = curr.category?.name || 'Other';
        const existing = acc.find(c => c.name === catName);
        if (existing) {
            existing.value += Number(curr.amount);
        } else {
            acc.push({ name: catName, value: Number(curr.amount), color: curr.category?.color || '#ccc' });
        }
        return acc;
    }, []);

    const COLORS = ['#6366F1', '#EC4899', '#8B5CF6', '#10B981', '#F59E0B'];

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="pb-24 px-4 space-y-8 pt-4">
            <header>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Analysis</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Deep dive into your spending habits</p>
            </header>

            {/* Spending Trend Chart */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
                <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-6">Spending Trend (7 Days)</h2>
                <div className="h-48 -ml-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trends}>
                            <defs>
                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} dy={10} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{ stroke: '#6366F1', strokeWidth: 1 }}
                            />
                            <Area type="monotone" dataKey="amount" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Category Breakdown Pie */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
                <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Category Limits & Usage</h2>
                <div className="flex items-center justify-center h-48 relative">
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
                                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                         <span className="text-gray-400 text-xs font-medium">TOTAL</span>
                         <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{expenses.reduce((a,c)=>a+c.amount,0)}</span>
                    </div>
                </div>
                
                {/* Legend List */}
                 <div className="mt-4 space-y-3">
                    {categoryData.map((entry, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color || COLORS[index % COLORS.length] }}></div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{entry.name}</span>
                            </div>
                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">₹{entry.value}</span>
                        </div>
                    ))}
                 </div>
            </div>
            
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800/50"
             >
                <div className="flex items-start gap-4">
                    <div className="bg-indigo-100 dark:bg-indigo-800 p-3 rounded-xl text-2xl">🤖</div>
                    <div>
                        <h3 className="font-bold text-indigo-900 dark:text-indigo-100">AI Spending Tip</h3>
                        <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                            Your **Travel** spending is 20% higher than last week. Consider using public transport for short trips to save ~₹400.
                        </p>
                    </div>
                </div>
             </motion.div>
        </div>
    );
};

export default Analysis;
