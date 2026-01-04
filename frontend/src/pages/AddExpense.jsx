import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Plus } from 'lucide-react';
import { clsx } from 'clsx';

const AddExpense = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [transactionId, setTransactionId] = useState('');
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
        if (catRes.data.length > 0) setCategoryId(catRes.data[0]._id);
      } catch (error) {
        console.error("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Duplicate Check
    const isDuplicate = recentExpenses.some(exp => 
        Number(exp.amount) === Number(amount) && 
        new Date(exp.date).toDateString() === new Date(date).toDateString() &&
        (exp.category?._id === categoryId || exp.category === categoryId)
    );

    if (isDuplicate) {
        const confirmAdd = window.confirm(
            `⚠️ Possible Duplicate Detected!\n\nYou already have an expense of ₹${amount} in this category for this date.\n\nDo you still want to add it?`
        );
        if (!confirmAdd) return; 
    }

    setLoading(true);
    try {
      await API.post('/expenses', {
        amount,
        notes: description,
        category: categoryId,
        date,
        paymentMethod,
        transactionId: paymentMethod === 'UPI' ? transactionId : undefined,
      });
      navigate('/');
    } catch (error) {
      console.error("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24">
      <div className="sticky top-0 bg-gray-50 z-10 p-4 mb-2 flex items-center justify-between">
         <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="mr-4 text-gray-600">
               <ArrowLeft />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Add Expense</h1>
         </div>
         <button 
           type="button"
           onClick={async () => {
             try {
               const text = await navigator.clipboard.readText();
               // Regex for standard Indian Bank SMS (e.g., "Rs 500 debited... to Starbucks")
               const amountMatch = text.match(/(?:Rs\.?|INR)\s*([\d,]+(?:\.\d{2})?)/i);
               const merchMatch = text.match(/(?:at|to|via)\s+([a-zA-Z0-9\s]+?)(?:\s+on|via|ref|bal)/i);
               
               if (amountMatch) {
                  setAmount(amountMatch[1].replace(/,/g, ''));
                  // Auto-select category or merchant
                  if (merchMatch) {
                      setDescription(merchMatch[1].trim());
                      // Simple keyword matching for category
                      const merch = merchMatch[1].toLowerCase();
                      if (merch.includes('zomato') || merch.includes('swiggy') || merch.includes('food')) setCategoryId(categories.find(c=>c.name==='Food')?._id);
                      else if (merch.includes('uber') || merch.includes('ola') || merch.includes('fuel')) setCategoryId(categories.find(c=>c.name==='Travel')?._id);
                  }
                  setPaymentMethod('UPI');
                  alert('Parsed SMS and filled data! 🪄');
               } else {
                  alert('No amount found in clipboard text.');
               }
             } catch (err) {
               alert('Failed to read clipboard. Please paste manually.');
             }
           }}
           className="text-xs font-bold text-primary bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 flex items-center gap-1"
         >
           📋 Paste SMS
         </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Amount - Large Input */}
            <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Amount</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-bold">₹</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-10 pr-4 py-4 text-3xl font-bold rounded-xl border-2 border-dashed border-gray-200 focus:outline-none focus:border-primary transition-colors bg-gray-50 focus:bg-white"
                        placeholder="0"
                        required
                        inputMode="decimal"
                        autoFocus
                    />
                </div>
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat._id}
                            type="button"
                            onClick={() => setCategoryId(cat._id)}
                            className={clsx(
                                "p-3 rounded-xl border text-sm font-medium transition-all flex flex-col items-center justify-center gap-1 h-20",
                                categoryId === cat._id 
                                ? "bg-primary/10 border-primary text-primary" 
                                : "bg-white border-gray-100 text-gray-600 hover:bg-gray-50"
                            )}
                        >
                            {/* Icons would be dynamic here, simplified for now */}
                            <span>{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Payment Method */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {['UPI', 'Cash', 'Card', 'NetBanking'].map((method) => (
                        <button
                            key={method}
                            type="button"
                            onClick={() => setPaymentMethod(method)}
                            className={clsx(
                                "px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors",
                                paymentMethod === method 
                                ? "bg-gray-900 text-white" 
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        UPI Transaction ID <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                    </label>
                    <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50"
                        placeholder="e.g. 123456789012"
                    />
                </div>
            )}

            {/* Date & Note */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                   <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary bg-gray-50"
                        required
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                   <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary bg-gray-50"
                        placeholder="Dinner, Taxi..."
                   />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
            >
                {loading ? 'Saving...' : <><Plus size={20} /> Add Expense</>}
            </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
