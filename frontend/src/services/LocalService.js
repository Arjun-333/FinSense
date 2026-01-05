/**
 * LocalService.js
 * Handles all data persistence using the browser's localStorage.
 * Simulates a backend API for offline-first functionality.
 */

const STORAGE_KEYS = {
  USER: 'finsense_user',
  EXPENSES: 'finsense_expenses',
  GOALS: 'finsense_goals',
  CATEGORIES: 'finsense_categories', // If we want custom categories later
};

// Helper to simulate network delay (optional, for realism or debugging)
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

  // --- Categories ---
  const DEFAULT_CATEGORIES = [
      { _id: '1', name: 'Food', type: 'expense', color: '#EF4444', icon: 'Utensils' },
      { _id: '2', name: 'Travel', type: 'expense', color: '#F59E0B', icon: 'Car' },
      { _id: '3', name: 'Entertainment', type: 'expense', color: '#8B5CF6', icon: 'Film' },
      { _id: '4', name: 'Bills', type: 'expense', color: '#3B82F6', icon: 'Receipt' },
      { _id: '5', name: 'Shopping', type: 'expense', color: '#EC4899', icon: 'ShoppingBag' },
      { _id: '6', name: 'Health', type: 'expense', color: '#10B981', icon: 'Activity' },
      { _id: '7', name: 'Salary', type: 'income', color: '#22C55E', icon: 'Banknote' },
      { _id: '8', name: 'Investment', type: 'income', color: '#6366F1', icon: 'TrendingUp' },
  ];

  const LocalService = {
  // --- Auth & User ---
  
  getUser: () => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  },

  loginUser: async (email, password) => {
    await delay();
    const user = LocalService.getUser();
    if (!user) {
       throw new Error("No profile found. Please register.");
    }
    if (user.password !== password) {
       throw new Error("Invalid credentials");
    }
    return { 
        ...user, 
        token: "offline-token-123" 
    };
  },

  registerUser: async (userData) => {
    await delay();
    const existing = LocalService.getUser();
    if (existing) {
      throw new Error("Profile already exists. Clear data to reset.");
    }
    const newUser = {
      id: "local-user-" + Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password, 
      currency: '₹', 
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    return { ...newUser, token: "offline-token-123" };
  },

  updateProfile: async (updates) => {
    await delay();
    const user = LocalService.getUser();
    if (!user) throw new Error("User not found");
    const updatedUser = { ...user, ...updates };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    return updatedUser;
  },

  // --- Categories ---
  getCategories: async () => {
      await delay();
      // In future we can merging custom categories here
      return DEFAULT_CATEGORIES;
  },

  // --- Expenses ---

  getExpenses: async () => {
    await delay();
    const expenses = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES) || '[]');
    
    // Populate categories
    const populated = expenses.map(exp => {
        const cat = DEFAULT_CATEGORIES.find(c => c._id === exp.category);
        return {
            ...exp,
            category: cat || { name: 'Uncategorized', color: '#94a3b8', icon: 'Wallet' } // Fallback
        };
    });

    return populated.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  addExpense: async (expenseData) => {
    await delay();
    const expenses = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES) || '[]');
    const newExpense = {
      _id: "exp-" + Date.now() + Math.random().toString(36).substr(2, 9),
      title: expenseData.title,
      amount: Number(expenseData.amount),
      category: expenseData.category, // Stores ID
      notes: expenseData.notes,
      date: expenseData.date || new Date().toISOString(),
      type: expenseData.type || 'expense', 
      description: expenseData.description || '',
      paymentMethod: expenseData.paymentMethod,
      transactionId: expenseData.transactionId,
      createdAt: new Date().toISOString()
    };
    expenses.unshift(newExpense);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    
    // Return populated for frontend
    const cat = DEFAULT_CATEGORIES.find(c => c._id === newExpense.category);
    return { ...newExpense, category: cat };
  },

  deleteExpense: async (id) => {
    await delay();
    let expenses = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES) || '[]');
    expenses = expenses.filter(e => e._id !== id);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    return { message: "Deleted successfully" };
  },

  // --- Goals ---

  getGoals: async () => {
    await delay();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.GOALS) || '[]');
  },

  addGoal: async (goalData) => {
    await delay();
    const goals = JSON.parse(localStorage.getItem(STORAGE_KEYS.GOALS) || '[]');
    const newGoal = {
      _id: "goal-" + Date.now(),
      title: goalData.title,
      targetAmount: Number(goalData.targetAmount),
      currentAmount: Number(goalData.currentAmount || 0),
      deadline: goalData.deadline,
      createdAt: new Date().toISOString()
    };
    goals.push(newGoal);
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    return newGoal;
  },

  updateGoal: async (id, updates) => {
      await delay();
      let goals = JSON.parse(localStorage.getItem(STORAGE_KEYS.GOALS) || '[]');
      const index = goals.findIndex(g => g._id === id);
      if (index === -1) throw new Error("Goal not found");
      
      goals[index] = { ...goals[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
      return goals[index];
  },

  deleteGoal: async (id) => {
      await delay();
      let goals = JSON.parse(localStorage.getItem(STORAGE_KEYS.GOALS) || '[]');
      goals = goals.filter(g => g._id !== id);
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
      return { message: "Goal deleted" };
  },

  // --- Budgets ---
  getBudgets: async () => {
      await delay();
      // Simple mock for budgets
      return []; 
  },

  // --- Analytics (Calculated on the fly) ---
  
  getAnalytics: async () => {
      await delay();
      const expenses = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES) || '[]');
      
      // Calculate totals
      const totalExpenses = expenses
          .filter(e => e.type === 'expense')
          .reduce((sum, e) => sum + Number(e.amount), 0);
          
      const totalIncome = expenses
          .filter(e => e.type === 'income')
          .reduce((sum, e) => sum + Number(e.amount), 0);

      // Category breakdown
      const categoryMap = {};
      expenses.filter(e => e.type === 'expense').forEach(e => {
          // Look up category name from ID
          const cat = DEFAULT_CATEGORIES.find(c => c._id === e.category) || { name: 'Uncategorized' };
          categoryMap[cat.name] = (categoryMap[cat.name] || 0) + Number(e.amount);
      });
      
      const categories = Object.keys(categoryMap).map(catName => ({
          name: catName,
          amount: categoryMap[catName],
          percentage: totalExpenses ? Math.round((categoryMap[catName] / totalExpenses) * 100) : 0
      }));

      return {
          totalExpenses,
          totalIncome,
          balance: totalIncome - totalExpenses,
          categories
      };
  },

  getInsights: async () => {
      await delay();
      // Simple mock insights
      return [
          { type: 'info', message: 'Welcome to offline mode! Your data is safe locally.' }
      ];
  },

  getTrends: async () => {
      await delay();
      const expenses = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES) || '[]');
      
      // Group by date (YYYY-MM-DD)
      const dailyStats = {};
      
      expenses.forEach(e => {
         const date = e.date.split('T')[0];
         if (!dailyStats[date]) {
             dailyStats[date] = { date, expense: 0, income: 0 };
         }
         
         if (e.type === 'expense') dailyStats[date].expense += Number(e.amount);
         else dailyStats[date].income += Number(e.amount);
      });

      // Convert to array and sort by date
      let trends = Object.values(dailyStats).sort((a,b) => new Date(a.date) - new Date(b.date));
      
      // Aesthetics: If only 1 data point or no data, pad with a "start" point so graph looks good
      if (trends.length > 0) {
          const firstDate = new Date(trends[0].date);
          firstDate.setDate(firstDate.getDate() - 1);
          const zeroPoint = { 
              date: firstDate.toISOString().split('T')[0], 
              expense: 0, 
              income: 0,
              balance: 0 
          };
          trends.unshift(zeroPoint);
      } else {
          // If totally empty, adding a dummy point helps show an empty graph instead of broken one
           trends.push({ date: new Date().toISOString().split('T')[0], expense: 0, income: 0, balance: 0 });
      }
      
      // Calculate running balance
      let currentBal = 0;
      trends = trends.map(t => {
          currentBal += (t.income - t.expense);
          return { ...t, balance: currentBal };
      });

      return trends;
  },

  // --- Backup & Restore ---

  exportAllData: () => {
      let user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
      
      // Fallback: If 'finsense_user' is missing (migration issue), try 'user' (AuthContext key)
      if (!user) {
          user = JSON.parse(localStorage.getItem('user'));
          // Auto-fix DB state if we found it
          if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }

      const data = {
          version: 1,
          date: new Date().toISOString(),
          user: user,
          expenses: JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES) || '[]'),
          goals: JSON.parse(localStorage.getItem(STORAGE_KEYS.GOALS) || '[]'),
      };
      return JSON.stringify(data, null, 2);
  },

  importAllData: (jsonString) => {
      try {
          const data = JSON.parse(jsonString);
          
          if (!data.version) {
             throw new Error("Missing backup version info");
          }
          
          // We allow restoring even if user is missing in backup (partial restore), 
          // but preferably we want it. Warn if critical data missing.
          if (!data.expenses && !data.user) {
              throw new Error("Backup appears empty (no user or expenses)");
          }
          
          if (data.user) {
             localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
             // Also update AuthContext key to keep them in sync
             localStorage.setItem('user', JSON.stringify(data.user));
          }
          
          if (data.expenses) {
              localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(data.expenses));
          }
          
          if (data.goals) {
              localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(data.goals));
          }
          
          return { success: true };
      } catch (e) {
          console.error("Restore failed:", e);
          throw new Error(e.message.startsWith("Missing") || e.message.startsWith("Backup") 
              ? e.message 
              : "Invalid backup file.");
      }
  }
};

export default LocalService;
