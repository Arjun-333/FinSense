import { MockAPI } from './mockData';

// Replace Axios instance with Mock Wrapper for UI Demo
const API = {
    interceptors: {
        request: { use: () => {} }
    },
    post: async (url, data) => {
        console.log(`[MOCK POST] ${url}`, data);
        if (url === '/auth/login') return MockAPI.login(data.email, data.password);
        if (url === '/auth/register') return MockAPI.register(data.name, data.email, data.password);
        if (url === '/expenses') return MockAPI.addExpense(data);
        return Promise.reject({ response: { data: { message: 'Mock route not found' } } });
    },
    get: async (url) => {
        console.log(`[MOCK GET] ${url}`);
        if (url === '/expenses') return MockAPI.getExpenses();
        if (url === '/categories') return MockAPI.getCategories();
        if (url === '/budgets') return MockAPI.getBudgets();
        if (url === '/trends') return MockAPI.getTrends();
        if (url === '/insights') return MockAPI.getInsights();
        return Promise.reject({ response: { data: { message: 'Mock route not found' } } });
    },
    delete: async (url) => {
        console.log(`[MOCK DELETE] ${url}`);
        if (url.startsWith('/expenses/')) {
            const id = url.split('/').pop();
            return MockAPI.deleteExpense(id);
        }
        return Promise.reject({ response: { data: { message: 'Mock route not found' } } });
    }
};

export default API;


