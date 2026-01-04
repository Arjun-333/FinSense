import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-4 bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-primary/30 transform rotate-3">
                <span className="text-2xl text-white font-bold">F</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 mt-2 font-medium">Sign in to your FinSense account</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-6 text-sm text-center border border-red-100">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-gray-50/50 focus:bg-white"
              placeholder="hello@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-gray-50/50 focus:bg-white"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-4 rounded-2xl hover:bg-indigo-600 active:scale-[0.98] transition-all shadow-xl shadow-indigo-500/30 text-lg mt-2"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-primary hover:text-indigo-600 hover:underline transition-colors">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
