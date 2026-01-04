import { useState, useEffect } from 'react';
import API from '../api/axios';
import { clsx } from 'clsx';
import { ArrowLeft, Trash2, Utensils, Car, Film, Receipt, ShoppingBag, Activity, Banknote, Wallet, Download, Search, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
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

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            try {
                await API.delete(`/expenses/${id}`);
                setExpenses(expenses.filter(e => e._id !== id));
            } catch (error) {
                console.error("Failed to delete expense");
            }
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("FinSense Expenditure Report", 14, 22);
        doc.setFontSize(11);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
        
        const tableColumn = ["Date", "Category", "Type", "Note", "Amount"];
        const tableRows = [];
    
        expenses.forEach(expense => {
            const expenseData = [
                new Date(expense.date).toLocaleDateString(),
                expense.category?.name || "Uncategorized",
                expense.type === 'income' ? 'Income' : 'Expense',
                expense.notes || "-",
                `${expense.type === 'income' ? '+' : '-'} ₹${expense.amount}`
            ];
            tableRows.push(expenseData);
        });
    
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [99, 102, 241] },
        });
    
        doc.save(`FinSense_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const handleExportCSV = () => {
        const headers = ["Date,Category,Type,Note,Amount"];
        const rows = expenses.map(e => [
            new Date(e.date).toLocaleDateString(),
            e.category?.name || "Uncategorized",
            e.type,
            `"${e.notes || ''}"`,
            e.amount
        ].join(","));
        
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `FinSense_Export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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

    // Filter Logic
    const filteredExpenses = expenses.filter(expense => {
        const lowerSearch = searchTerm.toLowerCase();
        return (
            (expense.notes && expense.notes.toLowerCase().includes(lowerSearch)) ||
            (expense.category?.name && expense.category.name.toLowerCase().includes(lowerSearch)) ||
            (expense.amount.toString().includes(lowerSearch))
        );
    });

    // Group by Date
    const groupedExpenses = filteredExpenses.reduce((groups, expense) => {
        const date = new Date(expense.date).toDateString();
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(expense);
        return groups;
    }, {});

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="pb-24 pt-6 px-4">
            <div className="sticky top-0 bg-gray-50 dark:bg-slate-950 z-10 p-4 mb-2 -mx-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="md:hidden text-gray-600 dark:text-gray-300">
                            <ArrowLeft />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expenses</h1>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={handleExportCSV}
                            className="p-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                            title="Export CSV"
                        >
                            <FileText size={20} />
                        </button>
                        <button 
                            onClick={handleDownloadPDF}
                            className="p-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                        >
                            <Download size={20} />
                            <span className="text-sm font-semibold hidden sm:inline">PDF</span>
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search transactions..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
            </div>

            <div className="space-y-6">
                {Object.keys(groupedExpenses).length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400">No transactions found.</p>
                    </div>
                ) : (
                    Object.keys(groupedExpenses).map((date) => (
                        <div key={date}>
                            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 px-2 sticky top-36 bg-gray-50 dark:bg-slate-950 uppercase tracking-wider">{date}</h3>
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                                {groupedExpenses[date].map((expense, index) => (
                                    <div key={expense._id} className={clsx(
                                        "p-4 flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors",
                                        index !== groupedExpenses[date].length - 1 && "border-b border-gray-50 dark:border-slate-700"
                                    )}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-slate-700 flex items-center justify-center text-primary dark:text-indigo-400">
                                                {getCategoryIcon(expense.category?.icon)}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{expense.category?.name}</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {expense.notes ? expense.notes : expense.paymentMethod}
                                                </p>
                                                {expense.transactionId && (
                                                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">Ref: {expense.transactionId}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <span className={clsx(
                                                    "block font-bold",
                                                    expense.type === 'income' ? "text-green-500" : "text-gray-900 dark:text-white"
                                                )}>
                                                    {expense.type === 'income' ? '+' : '-'}₹{expense.amount}
                                                </span>
                                                <span className="text-xs text-gray-400">{new Date(expense.date).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}</span>
                                            </div>
                                            <button 
                                                onClick={() => handleDelete(expense._id)}
                                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                                aria-label="Delete expense"
                                            >
                                                <Trash2 size={18} />
                                            </button>
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
