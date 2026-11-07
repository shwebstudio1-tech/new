import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowRight, 
  Store, 
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  Building2
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (userProfile: { name: string; email: string; role: string; username: string }) => void;
  expectedCredentials: { username: string; password: string };
  autoLocked?: boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, expectedCredentials, autoLocked }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const enteredUser = username.trim().toLowerCase();
    const enteredPass = password.trim();

    const validUsers = [
      expectedCredentials.username.toLowerCase(),
      'admin',
      'talha'
    ];

    if (validUsers.includes(enteredUser) && enteredPass === expectedCredentials.password) {
      onLoginSuccess({
        name: 'Dr. Talha (Store Owner)',
        email: 'owner@talhasurgical.pk',
        role: 'Administrator & Store Owner',
        username: enteredUser
      });
    } else {
      setErrorMessage('Invalid username or password. Please verify your store credentials.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4 relative overflow-hidden select-none font-sans">
      {/* Background Subtle Gradient Blobs matching App theme */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-800 text-white shadow-lg shadow-teal-900/20 mb-1 border border-teal-700/30">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">TALHA SURGICAL</h1>
          <p className="text-xs font-bold text-teal-800 tracking-wider uppercase">Medicine Shop & Dispensary POS</p>
          
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-xs text-[11px] font-mono text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Terminal-01 &nbsp;•&nbsp; Main Branch
            </span>
          </div>
        </div>

        {/* Auth Card matching Main App white card theme */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl shadow-slate-200/60 space-y-5">
          {/* Card Header */}
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Dispensary Terminal Sign-In</h2>
              <p className="text-xs text-slate-500 mt-0.5">Enter authorized credentials to unlock terminal</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
          </div>

          {/* Auto-lock Banner */}
          {autoLocked && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="leading-snug font-medium">
                Terminal automatically locked after 10 minutes of inactivity for security.
              </span>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span className="leading-snug font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Username / Store ID</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-700 focus:bg-white focus:ring-2 focus:ring-teal-700/10 font-medium transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Store Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-700 focus:bg-white focus:ring-2 focus:ring-teal-700/10 font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-teal-900/20 active:scale-[0.99] disabled:opacity-70 mt-2"
            >
              <span>Unlock Terminal & Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Compliance & Security Footnote */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              DRAP Standard Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              256-Bit SSL Encrypted
            </span>
          </div>
        </div>

        {/* Auto Lock Security Info */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <Clock className="w-3.5 h-3.5 text-teal-600" />
          <span>Auto-lock enabled (10 minutes inactive)</span>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-400">
          Talha Surgical & Medicine Shop • Version 2.5 Enterprise
        </p>
      </div>
    </div>
  );
};
