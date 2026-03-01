import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { login as apiLogin, register as apiRegister } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [tab, setTab] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (tab === 'login') {
        const res = await apiLogin({ email: formData.email, password: formData.password });
        const { token, userId, name, email } = res.data;
        login(token, { userId, name, email });
        navigate(redirectTo);
      } else {
        await apiRegister(formData);
        // Auto-login after register
        const res = await apiLogin({ email: formData.email, password: formData.password });
        const { token, userId, name, email } = res.data;
        login(token, { userId, name, email });
        navigate(redirectTo);
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.email ||
        err.response?.data?.password ||
        'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="bg-card rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <span className="text-4xl">🎬</span>
          <h1 className="text-2xl font-bold text-white mt-2">MovieBook</h1>
          <p className="text-gray-400 text-sm">Your ultimate movie booking experience</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-800 rounded-xl p-1 mb-6">
          {['login', 'register'].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
                tab === t ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-gray-400 text-xs mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 text-sm border border-gray-700 focus:outline-none focus:border-primary"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-400 text-xs mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 text-sm border border-gray-700 focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              minLength={6}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 text-sm border border-gray-700 focus:outline-none focus:border-primary"
            />
          </div>

          {tab === 'register' && (
            <div>
              <label className="block text-gray-400 text-xs mb-1">Phone (optional)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 text-sm border border-gray-700 focus:outline-none focus:border-primary"
              />
            </div>
          )}

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-red-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-base transition-colors"
          >
            {loading ? 'Please wait...' : tab === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
