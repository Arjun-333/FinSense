import { useState, useEffect } from 'react';
import API from '../api/axios';
import { clsx } from 'clsx';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    // Group by Date
    const groupedExpenses = expenses.reduce((groups, expense) => {
        const date = new Date(expense.date).toDateString();
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(expense);
        return groups;
    }, {});

    if (loading) return <div className="p-8 text-center text-gray-500">Loading expenses...</div>;

    return (
        <div className="pb-24">
            <div className="sticky top-0 bg-gray-50 z-10 p-4 mb-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="md:hidden text-gray-600">
                        <ArrowLeft />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
                </div>
            </div>

            <div className="space-y-6">
                {Object.keys(groupedExpenses).length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400">No expenses found.</p>
                    </div>
                ) : (
                    Object.keys(groupedExpenses).map((date) => (
                        <div key={date}>
                            <h3 className="text-sm font-medium text-gray-500 mb-3 px-2 sticky top-16 bg-gray-50 uppercase tracking-wider">{date}</h3>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                {groupedExpenses[date].map((expense, index) => (
                                    <div key={expense._id} className={clsx(
                                        "p-4 flex items-center justify-between",
                                        index !== groupedExpenses[date].length - 1 && "border-b border-gray-50"
                                    )}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl">
                                                📝
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 text-sm">{expense.category?.name}</h4>
                                                <p className="text-xs text-gray-500">
                                                    {expense.notes ? expense.notes : expense.paymentMethod}
                                                </p>
                                                {expense.transactionId && (
                                                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">Ref: {expense.transactionId}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block font-bold text-gray-900">-₹{expense.amount}</span>
                                            <span className="text-xs text-gray-400">{new Date(expense.date).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Expenses;
