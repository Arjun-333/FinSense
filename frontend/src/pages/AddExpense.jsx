import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Plus, Wallet, Utensils, Car, Film, Receipt, ShoppingBag, Activity, Banknote, ClipboardList, Repeat, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

const AddExpense = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [transactionId, setTransactionId] = useState('');
  const [type, setType] = useState('expense'); // 'expense' or 'income'
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('monthly');
  
  const [categories, setCategories] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, expRes] = await Promise.all([
             API.get('/categories'),
             API.get('/expenses')
        ]);
        setCategories(catRes.data);
        setRecentExpenses(expRes.data);
      } catch (error) {
        console.error("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  // Filter categories based on type
  const activeCategories = categories.filter(c => c.type === type || (!c.type && type === 'expense'));
  
  useEffect(() => {
      // Auto-select first category when type changes
      if (activeCategories.length > 0) {
          setCategoryId(activeCategories[0]._id);
      }
  }, [type, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      await API.post('/expenses', {
        amount,
        notes: description,
        category: categoryId,
        date,
        paymentMethod,
        transactionId: paymentMethod === 'UPI' ? transactionId : undefined,
        type,
        isRecurring,
        recurringFrequency: isRecurring ? frequency : undefined
      });
      navigate('/');
    } catch (error) {
      console.error("Failed to add transaction");
      alert("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Delete this category? Transactions using it will be preserved but show as 'Uncategorized'.")) {
        try {
            await API.delete(`/categories/${id}`);
            setCategories(categories.filter(c => c._id !== id));
            if (categoryId === id) setCategoryId('');
        } catch (error) {
            console.error("Failed to delete category");
            alert("Could not delete category");
        }
    }
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
          case 'TrendingUp': return <Activity size={20} />;
          default: return <Wallet size={20} />;
      }
  };

  return (
    <div className="pb-24 pt-6 px-4">
      <div className="sticky top-0 bg-gray-50 dark:bg-slate-950 z-10 p-4 mb-2 flex items-center justify-between -mx-4">
         <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="mr-4 text-gray-600 dark:text-gray-300">
               <ArrowLeft />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Transaction</h1>
         </div>
         <button 
           type="button"
           onClick={async () => {
             try {
               const text = await navigator.clipboard.readText();
               // Regex for standard Indian Bank SMS
               const amountMatch = text.match(/(?:Rs\.?|INR)\s*([\d,]+(?:\.\d{2})?)/i);
               const merchMatch = text.match(/(?:at|to|via)\s+([a-zA-Z0-9\s]+?)(?:\s+on|via|ref|bal)/i);
               
               if (amountMatch) {
                  setAmount(amountMatch[1].replace(/,/g, ''));
                  if (merchMatch) {
                      setDescription(merchMatch[1].trim());
                  }
                  setPaymentMethod('UPI');
                  alert('Parsed SMS data! 🪄');
               } else {
                  alert('No amount found in clipboard.');
               }
             } catch (err) {
               alert('Failed to read clipboard.');
             }
           }}
           className="text-xs font-bold text-primary bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-800 flex items-center gap-1 hover:bg-indigo-100 transition-colors"
         >
           <ClipboardList size={14} /> Paste SMS
         </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm p-6 mx-auto border border-gray-100 dark:border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Type Toggle */}
            <div className="grid grid-cols-2 bg-gray-100 dark:bg-slate-700 p-1 rounded-2xl">
                <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={clsx(
                        "py-2.5 rounded-xl text-sm font-bold transition-all",
                        type === 'expense' 
                            ? "bg-white dark:bg-slate-600 text-red-500 shadow-sm" 
                            : "text-gray-500 dark:text-gray-400"
                    )}
                >
                    Expense
                </button>
                <button
                    type="button"
                    onClick={() => setType('income')}
                    className={clsx(
                        "py-2.5 rounded-xl text-sm font-bold transition-all",
                        type === 'income' 
                            ? "bg-white dark:bg-slate-600 text-green-500 shadow-sm" 
                            : "text-gray-500 dark:text-gray-400"
                    )}
                >
                    Income
                </button>
            </div>

            {/* Amount - Large Input */}
            <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Amount</label>
                <div className="relative">
                    <span className={clsx(
                        "absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold",
                        type === 'income' ? "text-green-500" : "text-red-500"
                    )}>₹</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-10 pr-4 py-4 text-3xl font-bold rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-600 focus:outline-none focus:border-primary transition-colors bg-gray-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 text-gray-900 dark:text-white"
                        placeholder="0"
                        required
                        inputMode="decimal"
                        autoFocus
                    />
                </div>
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <div className="grid grid-cols-3 gap-2">
                    {activeCategories.map((cat) => (
                        <div key={cat._id} className="relative group">
                            <button
                                type="button"
                                onClick={() => setCategoryId(cat._id)}
                                className={clsx(
                                    "w-full p-3 rounded-xl border text-sm font-medium transition-all flex flex-col items-center justify-center gap-1 h-20",
                                    categoryId === cat._id 
                                    ? "bg-primary/10 border-primary text-primary dark:bg-primary/20" 
                                    : "bg-white dark:bg-slate-700/50 border-gray-100 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                                )}
                            >
                                <div className="mb-1">{getCategoryIcon(cat.icon)}</div>
                                <span>{cat.name}</span>
                            </button>
                            {/* Delete Button for Custom Categories */}
                            {cat.user && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteCategory(cat._id);
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 hover:bg-red-600 z-10"
                                >
                                    <Trash2 size={12} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button 
                        type="button" 
                        onClick={() => navigate('/add-category')}
                        className="p-3 rounded-xl border border-dashed border-gray-300 dark:border-slate-600 text-gray-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700 flex flex-col items-center justify-center h-20 transition-colors"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {/* Recurring Toggle */}
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <Repeat size={16} />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Repeat Transaction</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
                
                {isRecurring && (
                    <div className="mt-3 animate-in slide-in-from-top-2 fade-in">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Frequency</label>
                        <div className="flex gap-2">
                            {['weekly', 'monthly', 'yearly'].map((freq) => (
                                <button
                                    key={freq}
                                    type="button"
                                    onClick={() => setFrequency(freq)}
                                    className={clsx(
                                        "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors border",
                                        frequency === freq
                                            ? "bg-white shadow-sm border-indigo-200 text-indigo-600"
                                            : "bg-transparent border-transparent text-gray-500 hover:bg-white/50"
                                    )}
                                >
                                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Payment Method */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Method</label>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {['UPI', 'Cash', 'Card', 'NetBanking'].map((method) => (
                        <button
                            key={method}
                            type="button"
                            onClick={() => setPaymentMethod(method)}
                            className={clsx(
                                "px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors",
                                paymentMethod === method 
                                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900" 
                                : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                            )}
                        >
                            {method}
                        </button>
                    ))}
                </div>
            </div>

            {/* UPI Transaction ID - Conditional */}
            {paymentMethod === 'UPI' && (
                <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        UPI Transaction ID <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                    </label>
                    <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
                        placeholder="e.g. 123456789012"
                    />
                </div>
            )}

            {/* Date & Note */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                   <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 focus:outline-none focus:border-primary bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
                        required
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Note</label>
                   <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 focus:outline-none focus:border-primary bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
                        placeholder="Dinner, Taxi..."
                   />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
            >
                {loading ? 'Saving...' : <><Plus size={20} /> Save Transaction</>}
            </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
