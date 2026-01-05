import axios from 'axios';
import LocalService from '../services/LocalService';

// OFFLINE MODE ADAPTER
// Instead of a real network request, we intercept calls and route them to LocalService.

const API = {
  post: async (url, data) => {
    // Auth
    if (url.includes('/auth/login')) return { data: await LocalService.loginUser(data.email, data.password) };
    if (url.includes('/auth/register')) return { data: await LocalService.registerUser(data) };
    
    // Expenses
    if (url.includes('/expenses')) return { data: await LocalService.addExpense(data) };
    
    // Goals
    if (url.includes('/goals')) return { data: await LocalService.addGoal(data) };
    
    throw new Error(`Mock POST not implemented for: ${url}`);
  },
  
  get: async (url) => {
    // Expenses
    if (url.includes('/expenses')) return { data: await LocalService.getExpenses() };
    
    // Analytics
    if (url.includes('/analytics/dashboard')) return { data: await LocalService.getAnalytics() };
    if (url.includes('/analytics/trends')) return { data: await LocalService.getTrends() };
    if (url.includes('/analytics/insights')) return { data: await LocalService.getInsights() };

    // Budgets
    if (url.includes('/budgets')) return { data: await LocalService.getBudgets() };
    if (url.includes('/categories')) return { data: await LocalService.getCategories() };

    // Goals
    if (url.includes('/goals')) return { data: await LocalService.getGoals() };
    
    throw new Error(`Mock GET not implemented for: ${url}`);
  },

  delete: async (url) => {
      // Expenses: /expenses/:id
      if (url.includes('/expenses/')) {
          const id = url.split('/').pop();
          return { data: await LocalService.deleteExpense(id) };
      }
      
      // Goals: /goals/:id
      if (url.includes('/goals/')) {
          const id = url.split('/').pop();
          return { data: await LocalService.deleteGoal(id) };
      }

      throw new Error(`Mock DELETE not implemented for: ${url}`);
  },

  put: async (url, data) => {
      // Goals: /goals/:id
      if (url.includes('/goals/')) {
          const id = url.split('/').pop();
          return { data: await LocalService.updateGoal(id, data) };
      }
      // User Profile
      if (url.includes('/auth/profile')) {
          return { data: await LocalService.updateProfile(data) };
      }

      throw new Error(`Mock PUT not implemented for: ${url}`);
  },

  interceptors: {
      request: { use: (fn) => fn({}) }, // No-op for existing interceptors
      response: { use: (fn) => fn({}) }
  }
};

export default API;
