import { useState, useEffect } from 'react';
import API from '../api/axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Sparkles } from 'lucide-react';

const Analysis = () => {
    const [trends, setTrends] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeGraph, setActiveGraph] = useState('spending'); // 'spending', 'income', 'balance'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [trendRes, expRes] = await Promise.all([
                    API.get('/analytics/trends'),
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
        if (curr.type === 'income') return acc; // Exclude income from spending pie
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

            {/* Graph Selector */}
            <div className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
                {['spending', 'income', 'balance'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveGraph(tab)}
                        className={clsx(
                            "flex-1 py-2 text-sm font-semibold rounded-lg capitalize transition-all",
                            activeGraph === tab
                                ? "bg-white dark:bg-slate-700 text-primary shadow-sm"
                                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Main Chart Card */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
                <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-6 capitalize">{activeGraph} Trend</h2>
                <div className="h-48 -ml-6">
                    <ResponsiveContainer width="100%" height="100%">
                        {activeGraph === 'spending' && (
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
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                                    cursor={{ stroke: '#6366F1', strokeWidth: 1 }}
                                />
                                <Area type="monotone" dataKey="expense" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                            </AreaChart>
                        )}
                        {activeGraph === 'income' && (
                             <BarChart data={trends}> 
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} dy={10} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        )}
                        {activeGraph === 'balance' && (
                            <AreaChart data={trends}>
                                <defs>
                                    <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} dy={10} />
                                <Tooltip />
                                <Area type="monotone" dataKey="balance" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorBal)" />
                            </AreaChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Category Breakdown Pie */}
            {activeGraph === 'spending' && (
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
                             <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{categoryData.reduce((a,c)=>a+c.value,0)}</span>
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
            )}
            
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800/50"
             >
                <div className="flex items-start gap-4">
                    <div className="bg-indigo-100 dark:bg-indigo-800 p-3 rounded-xl text-primary dark:text-indigo-200">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-indigo-900 dark:text-indigo-100">AI Spending Tip</h3>
                        <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                            {categoryData.length > 0 ? (() => {
                                const maxCat = categoryData.reduce((prev, current) => (prev.value > current.value) ? prev : current);
                                return `Your highest spending is on **${maxCat.name}** (₹${maxCat.value}). ${
                                    maxCat.name === 'Food' ? 'Cooking at home could save you ~30%!' :
                                    maxCat.name === 'Travel' ? 'Looking for carpool options might help.' :
                                    maxCat.name === 'Shopping' ? 'Wait 24h before buying non-essentials.' :
                                    'Review these expenses to find savings.'
                                }`;
                            })() : "Start adding expenses to get personalized AI tips!"}
                        </p>
                    </div>
                </div>
             </motion.div>
        </div>
    );
};

export default Analysis;
