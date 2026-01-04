// Simulated delay for realism
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_USER = {
    _id: "user_1",
    name: "Arjun R",
    email: "arjun@example.com",
    token: "mock_jwt_token"
};

const MOCK_CATEGORIES = [
    { _id: "c1", name: 'Food', type: 'expense', color: '#EF4444', icon: 'Utensils' },
    { _id: "c2", name: 'Travel', type: 'expense', color: '#F59E0B', icon: 'Car' },
    { _id: "c3", name: 'Entertainment', type: 'expense', color: '#8B5CF6', icon: 'Film' },
    { _id: "c4", name: 'Bills', type: 'expense', color: '#3B82F6', icon: 'Receipt' },
    { _id: "c5", name: 'Shopping', type: 'expense', color: '#EC4899', icon: 'ShoppingBag' },
    { _id: "c6", name: 'Health', type: 'expense', color: '#10B981', icon: 'Activity' },
    { _id: "c7", name: 'Salary', type: 'income', color: '#22C55E', icon: 'Banknote' },
    { _id: "c8", name: 'Investment', type: 'income', color: '#6366F1', icon: 'TrendingUp' },
];

let MOCK_EXPENSES = [
    {
        _id: "e1",
        user: "user_1",
        category: MOCK_CATEGORIES[0], // Food
        amount: 450,
        date: new Date().toISOString(),
        paymentMethod: "UPI",
        transactionId: "UPI/3452/324",
        notes: "Lunch at Saravana Bhavan",
        type: "expense"
    },
    {
        _id: "e2",
        user: "user_1",
        category: MOCK_CATEGORIES[1], // Travel
        amount: 120,
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        paymentMethod: "UPI",
        notes: "Uber to Office",
        type: "expense"
    },
    {
        _id: "e3",
        user: "user_1",
        category: MOCK_CATEGORIES[4], // Shopping
        amount: 2500,
        date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        paymentMethod: "Card",
        notes: "Groceries for week",
        type: "expense"
    },
    {
        _id: "e4",
        user: "user_1",
        category: MOCK_CATEGORIES[2], // Entertainment
        amount: 600,
        date: new Date(Date.now() - 172800000).toISOString(),
        paymentMethod: "UPI",
        transactionId: "UPI/9999/888",
        notes: "Movie Tickets",
        type: "expense"
    }
];

let MOCK_BUDGETS = [
    { _id: "b1", user: "user_1", category: MOCK_CATEGORIES[0], amount: 5000, period: 'month' },
    { _id: "b2", user: "user_1", category: MOCK_CATEGORIES[1], amount: 3000, period: 'month' },
];

export const MockAPI = {
    login: async (email, password) => {
        await delay(800);
        return { data: MOCK_USER };
    },
    register: async (name, email, password) => {
        await delay(800);
        return { data: { ...MOCK_USER, name, email } };
    },
    getExpenses: async () => {
        await delay(600);
        return { data: [...MOCK_EXPENSES] };
    },
    addExpense: async (expenseData) => {
        await delay(600);
        const newExpense = {
             _id: Math.random().toString(36).substr(2, 9),
             ...expenseData,
             category: MOCK_CATEGORIES.find(c => c._id === expenseData.category), // Hydrate category
             user: "user_1",
             date: expenseData.date || new Date().toISOString()
        };
        MOCK_EXPENSES.unshift(newExpense);
        return { data: newExpense };
    },
    getCategories: async () => {
        await delay(400);
        return { data: MOCK_CATEGORIES };
    },
    getBudgets: async () => {
        await delay(400);
        return { data: MOCK_BUDGETS };
    },
    getTrends: async () => {
        await delay(500);
        // Generate last 7 days data
        const today = new Date();
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            data.push({
                date: d.toLocaleDateString('en-US', { weekday: 'short' }),
                amount: Math.floor(Math.random() * 2000) + 500
            });
        }
        return { data };
    },
    getInsights: async () => {
        await delay(600);
        return {
            data: [
                { type: 'positive', message: "You spent 15% less on Food this week! 🍔", id: 1 },
                { type: 'warning', message: "85% utilized of Shopping budget. 🛍️", id: 2 },
                { type: 'info', message: "Try using UPI for small payments under ₹100. 📱", id: 3 },
            ]
        };
    }
};
