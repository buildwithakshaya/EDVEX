import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Compass, 
  ArrowLeft, 
  LogIn, 
  AlertCircle, 
  CheckCircle2, 
  UserCheck, 
  Sparkles,
  Lock,
  Mail
} from 'lucide-react';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, allUsers } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowForgotNotice(false);

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Invalid email or password.');
    } else {
      // Look up user's role to redirect to the correct dashboard
      const targetUser = allUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (targetUser) {
        onNavigate(`/${targetUser.role}/dashboard`);
      } else {
        onNavigate('/student/dashboard');
      }
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError(null);
    setShowForgotNotice(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 font-sans">
      {/* Top Bar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div 
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-900">SkillBridge</span>
          </div>

          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      {/* Main Login Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="text-center space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="text-xs text-slate-500">
              Enter your credentials to access your SkillBridge dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Forgot Password Notice */}
          {showForgotNotice && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-start gap-2.5 text-xs text-indigo-700">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>For demonstration, use any demo account below or password: <b>password123</b>. You may also register a new account anytime.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="name@university.edu or name@company.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotNotice(true)}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter your account password"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{loading ? 'Authenticating...' : 'Login'}</span>
            </button>
          </form>

          {/* Quick Demo Selector for Jury / Testing */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Quick Demo Sign-In (1-Click Fill)
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickLogin('rahul.sharma@college.edu')}
                className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-left transition cursor-pointer"
              >
                <span className="font-semibold text-slate-800 block truncate">Rahul Sharma</span>
                <span className="text-[10px] text-indigo-600">Student &bull; Mech</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('hr@tatamotors.com')}
                className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-left transition cursor-pointer"
              >
                <span className="font-semibold text-slate-800 block truncate">Tata Motors HR</span>
                <span className="text-[10px] text-purple-600">Industry Recruiter</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('dean.academic@nit.ac.in')}
                className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-left transition cursor-pointer"
              >
                <span className="font-semibold text-slate-800 block truncate">Dr. Rajesh Iyer</span>
                <span className="text-[10px] text-blue-600">University Dean</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('placement.officer@nit.ac.in')}
                className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-left transition cursor-pointer"
              >
                <span className="font-semibold text-slate-800 block truncate">Placement Cell</span>
                <span className="text-[10px] text-emerald-600">TPO Officer</span>
              </button>
            </div>
          </div>

          {/* Link to Register */}
          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <button
                onClick={() => onNavigate('/register')}
                className="font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
        &copy; SkillBridge &bull; Connecting skills, academia and industry.
      </footer>
    </div>
  );
};
