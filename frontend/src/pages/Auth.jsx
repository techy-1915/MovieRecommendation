import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { login as apiLogin, register as apiRegister } from '../services/api';
import { useAuth } from '../context/AuthContext';
import GlassButton from '../components/GlassButton';

export default function Auth() {
  const [tab, setTab] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shake, setShake] = useState(false);

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
        const res = await apiLogin({ email: formData.email, password: formData.password });
        const { token, userId, name, email } = res.data;
        login(token, { userId, name, email });
        navigate(redirectTo);
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.email ||
        err.response?.data?.password ||
        'An error occurred. Please try again.';
      setError(msg);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0a0a0a' }}
    >
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(239,68,68,0.05) 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { opacity: 1, y: 0, scale: 1 }}
        transition={shake ? { duration: 0.5 } : { duration: 0.5, ease: 'easeOut' }}
        className="glass-panel rounded-2xl p-8 w-full max-w-md relative overflow-hidden"
        style={{
          boxShadow: '0 25px 50px rgba(0,0,0,0.7), 0 0 40px rgba(239,68,68,0.1)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Corner accent */}
        <div
          className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at top right, rgba(239,68,68,0.1), transparent 70%)',
          }}
        />

        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl mb-3 inline-block"
          >
            🎬
          </motion.div>
          <h1
            className="text-2xl font-bold mt-1"
            style={{
              background: 'linear-gradient(135deg, #ef4444, #fbbf24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            CineBook
          </h1>
          <p className="text-gray-500 text-sm mt-1">Your ultimate cinema experience</p>
        </div>

        {/* Tab switcher with sliding indicator */}
        <div className="relative flex rounded-xl p-1 mb-6" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {/* Sliding background */}
          <motion.div
            layoutId="tab-indicator"
            className="absolute inset-y-1 rounded-lg"
            style={{
              width: 'calc(50% - 4px)',
              left: tab === 'login' ? '4px' : 'calc(50%)',
              background: 'linear-gradient(135deg, rgba(239,68,68,0.8), rgba(185,28,28,0.8))',
              boxShadow: '0 0 15px rgba(239,68,68,0.4)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          {['login', 'register'].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null); }}
              className={`relative flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-colors z-10 ${
                tab === t ? 'text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {t === 'login' ? '🔐 Login' : '✨ Register'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={tab}
            initial={{ opacity: 0, x: tab === 'login' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: tab === 'login' ? 20 : -20 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {tab === 'register' && (
              <div className="relative group">
                <label className="block text-gray-500 text-xs mb-1.5 font-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
              </div>
            )}

            <div className="relative">
              <label className="block text-gray-500 text-xs mb-1.5 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
            </div>

            <div className="relative">
              <label className="block text-gray-500 text-xs mb-1.5 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
            </div>

            {tab === 'register' && (
              <div className="relative">
                <label className="block text-gray-500 text-xs mb-1.5 font-medium">Phone (optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
              </div>
            )}

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-xl p-3 text-sm text-red-300"
                  style={{
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                  }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <GlassButton
              type="submit"
              disabled={loading}
              variant="primary"
              size="md"
              className="w-full justify-center mt-2"
            >
              {loading
                ? '⟳ Please wait...'
                : tab === 'login'
                ? '🔐 Login'
                : '🚀 Create Account'}
            </GlassButton>
          </motion.form>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
