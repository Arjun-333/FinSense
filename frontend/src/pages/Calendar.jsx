import { useState, useEffect } from 'react';
import API from '../api/axios';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const Calendar = () => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const { data } = await API.get('/expenses');
                setExpenses(data);
            } catch (error) {
                console.error("Failed to load expenses");
            } finally {
                setLoading(false);
            }
        };
        fetchExpenses();
    }, []);

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        
        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50"></div>);
        }

        // Days
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = new Date(year, month, d).toDateString();
            const dayExpenses = expenses.filter(e => new Date(e.date).toDateString() === dateStr);
            const total = dayExpenses.reduce((acc, curr) => acc + (curr.type === 'expense' ? curr.amount : 0), 0);
            const hasIncome = dayExpenses.some(e => e.type === 'income');

            const isToday = new Date().toDateString() === dateStr;
            const isSelected = selectedDate === dateStr;

            days.push(
                <motion.div 
                    key={d} 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(dateStr)}
                    className={clsx(
                        "h-24 p-1 border border-gray-100 dark:border-slate-700 relative cursor-pointer transition-colors flex flex-col justify-between",
                        isToday ? "bg-indigo-50 dark:bg-slate-800 ring-2 ring-primary inset-0 z-10" : "bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700",
                        isSelected && !isToday && "bg-gray-100 dark:bg-slate-700"
                    )}
                >
                    <span className={clsx("text-xs font-semibold p-1 rounded-full w-6 h-6 flex items-center justify-center", isToday ? "bg-primary text-white" : "text-gray-500 dark:text-gray-400")}>{d}</span>
                    
                    <div className="flex flex-col gap-1 items-end px-1 pb-1">
                        {total > 0 && (
                            <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/30 px-1.5 py-0.5 rounded-md">
                                -₹{total}
                            </span>
                        )}
                        {hasIncome && (
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        )}
                    </div>
                </motion.div>
            );
        }
        return days;
    };

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    const getSelectedExpenses = () => {
        if (!selectedDate) return [];
        return expenses.filter(e => new Date(e.date).toDateString() === selectedDate);
    };

    return (
        <div className="pb-24 pt-6 px-4">
             <div className="sticky top-0 bg-gray-50 dark:bg-slate-950 z-10 p-4 mb-2 flex items-center justify-between -mx-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300">
                        <ArrowLeft />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
                </div>
            </div>

            {/* Month Control */}
            <div className="flex items-center justify-between mb-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-600 dark:text-gray-300"><ChevronLeft /></button>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-600 dark:text-gray-300"><ChevronRight /></button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-slate-700 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 mb-6">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className="bg-gray-50 dark:bg-slate-800 text-center py-2 text-xs font-bold text-gray-400">
                        {day}
                    </div>
                ))}
                {renderCalendar()}
            </div>

            {/* Selected Date Details */}
            <div className="space-y-4">
                {selectedDate && (
                    <div className="animate-in slide-in-from-bottom-5 fade-in duration-300">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Transactions on {selectedDate}</h3>
                        <div className="space-y-3">
                            {getSelectedExpenses().length > 0 ? (
                                getSelectedExpenses().map(e => (
                                    <div key={e._id} className="bg-white dark:bg-slate-800 p-4 rounded-xl flex justify-between items-center shadow-sm">
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">{e.category?.name || "Uncategorized"}</p>
                                            <p className="text-xs text-gray-500">{e.notes || "No notes"}</p>
                                        </div>
                                        <span className={clsx("font-bold", e.type === 'income' ? 'text-green-500' : 'text-red-500')}>
                                            {e.type === 'income' ? '+' : '-'}₹{e.amount}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-400 py-4">No transactions.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Calendar;
