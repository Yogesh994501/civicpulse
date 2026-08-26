'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, Shield, ArrowRight, Loader2, Sparkles, Activity } from 'lucide-react';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'citizen' | 'operator' | 'crew'>('citizen');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter email and password.');
      return;
    }

    setLoading(true);
    const supabase = getSupabaseBrowserClient();

    // If Supabase is not configured, support graceful local demo session
    if (!supabase) {
      setTimeout(() => {
        setLoading(false);
        const demoUser = {
          id: `demo-${Date.now()}`,
          email,
          user_metadata: { full_name: fullName || 'Citizen Officer', role },
        };
        localStorage.setItem('civicpulse_demo_user', JSON.stringify(demoUser));
        if (onAuthSuccess) onAuthSuccess(demoUser);
        onClose();
      }, 500);
      return;
    }

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, role },
          },
        });

        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg('Account created successfully! Check your email or sign in.');
          if (data.user && onAuthSuccess) {
            onAuthSuccess(data.user);
            setTimeout(onClose, 1000);
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
        } else if (data.user) {
          if (onAuthSuccess) onAuthSuccess(data.user);
          onClose();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (demoRole: 'citizen' | 'operator') => {
    const demoUser = {
      id: `demo-${demoRole}-${Date.now()}`,
      email: `${demoRole}@civicpulse.internal`,
      user_metadata: {
        full_name: demoRole === 'operator' ? 'Dispatch Operator Joshi' : 'Citizen Officer Patil',
        role: demoRole,
      },
    };
    localStorage.setItem('civicpulse_demo_user', JSON.stringify(demoUser));
    if (onAuthSuccess) onAuthSuccess(demoUser);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-md rounded-3xl bg-zinc-950/95 border border-cyan-500/30 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.95)] z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-start justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-black border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white font-mono flex items-center gap-1.5">
                  CIVIC<span className="text-cyan-400">PULSE</span>
                </h2>
                <p className="text-[11px] font-mono text-zinc-400">
                  Citizen Operations & Dispatch Portal
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-black/60 p-1 mt-5 border border-white/10 font-mono text-xs">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all font-medium ${
                !isSignUp
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all font-medium ${
                isSignUp
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5 font-mono text-xs">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px]">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px]">
                {successMsg}
              </div>
            )}

            {isSignUp && (
              <div>
                <label className="text-[10px] uppercase text-zinc-400 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/70 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] uppercase text-zinc-400 block mb-1">
                Official Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="citizen@mumbai.gov.in"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/70 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase text-zinc-400 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/70 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="text-[10px] uppercase text-zinc-400 block mb-1">
                  Assigned Municipal Role
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                  <select
                    value={role}
                    onChange={(e: any) => setRole(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/70 border border-white/15 text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="citizen">Citizen Reporter (Public)</option>
                    <option value="crew">Field Maintenance Crew</option>
                    <option value="operator">Municipal Dispatch Operator</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Operations Account' : 'Sign In to Command Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-5 pt-4 border-t border-white/10">
            <span className="text-[10px] font-mono text-zinc-500 block mb-2 text-center uppercase tracking-wider">
              OR INSTANT DEMO ACCESS:
            </span>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('citizen')}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 transition-colors text-center"
              >
                👤 Demo Citizen
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('operator')}
                className="p-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 transition-colors text-center font-semibold"
              >
                🛡️ Demo Operator
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
