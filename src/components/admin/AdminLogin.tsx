import React, { useEffect, useRef, useState } from 'react';
import { Lock, User, ShieldCheck, AlertCircle, ArrowRight, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<Props> = ({ onLoginSuccess, onNavigateHome }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  // Only real user gestures count as "touched": clicks, pointer presses and
  // keystrokes. Browser autofill fires none of these, so it can never mark the
  // form as interacted-with.
  const userTouchedRef = useRef(false);
  const markTouched = () => {
    userTouchedRef.current = true;
  };

  // Saved credentials are injected by the browser as soon as this form is
  // rendered — sometimes in a second pass after first paint. Sweep repeatedly
  // for a few seconds, but never after the user has taken over the form, so a
  // password is never left sitting in plain sight and real input is never
  // wiped.
  useEffect(() => {
    const clearFields = () => {
      setUsername('');
      setPassword('');
      if (usernameRef.current) usernameRef.current.value = '';
      if (passwordRef.current) passwordRef.current.value = '';
    };

    const timers = [400, 1200, 3000].map((delay) =>
      window.setTimeout(() => {
        if (!userTouchedRef.current) clearFields();
      }, delay)
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prefer React state, but fall back to what is actually in the fields:
    // browsers can write an autofilled value straight into the DOM without
    // emitting the events React tracks, which would leave state empty.
    const submittedUsername = username || usernameRef.current?.value || '';
    const submittedPassword = password || passwordRef.current?.value || '';

    if (!submittedUsername || !submittedPassword) {
      setError('Email/username and password are required.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: submittedUsername, password: submittedPassword })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onLoginSuccess();
      } else {
        setError(data.error || 'Invalid credentials.');
      }
    } catch (err: any) {
      setError('Connection to backend server failed. Please ensure backend service is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-16 px-4 flex items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden">
      
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative z-10"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Admin Authentication
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Raja Gulfam & Co. Management Portal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          onPointerDown={markTouched}
          onKeyDown={markTouched}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Admin Email / Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-600 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={usernameRef}
                type="email"
                required
                name="rgc-admin-username"
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={markTouched}
                placeholder="admin@rajagulfam.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-600 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={passwordRef}
                type="password"
                required
                name="rgc-admin-password"
                // `new-password` tells the browser NOT to replay a saved
                // credential into this field; we clear it on mount regardless.
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={markTouched}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer: theme toggle + back nav */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-3">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle colour theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-500" />
            )}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button
            onClick={onNavigateHome}
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            ← Return to Main Website
          </button>
        </div>
      </motion.div>
    </div>
  );
};
