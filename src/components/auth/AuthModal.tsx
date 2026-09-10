import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { db } from '../../db/storage';
import { Modal } from '../common/Modal';
import { User, Lock, Mail, Phone, Building, Briefcase } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login'
}) => {
  const { login, register, allUsers, switchUser } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(defaultMode);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [branchId, setBranchId] = useState('b_mech');
  const [university, setUniversity] = useState('National Institute of Technology');
  const [companyName, setCompanyName] = useState('Tech Solutions India');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const branches = db.getBranches();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await login(email);
    if (!res.success) {
      setError(res.error || 'Failed to login');
    } else {
      onClose();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email) {
      setError('Name and Email are required.');
      return;
    }
    const res = await register({
      name,
      email,
      role,
      phone,
      branchId: role === 'student' ? branchId : undefined,
      university: role === 'student' || role === 'university' || role === 'faculty' || role === 'placement' ? university : undefined,
      companyName: role === 'industry' ? companyName : undefined
    });
    if (!res.success) {
      setError(res.error || 'Failed to create account');
    } else {
      onClose();
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(`Password reset instructions sent to ${email}. Check your email.`);
    setTimeout(() => {
      setSuccessMsg(null);
      setMode('login');
    }, 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'login'
          ? 'Sign in to SkillBridge'
          : mode === 'register'
          ? 'Register New SIH Account'
          : 'Reset Password'
      }
      subtitle="Role-based access for students, institutions, faculty, industry, and government"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Switch mode tabs */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`py-2 rounded-md transition ${
                mode === 'login' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`py-2 rounded-md transition ${
                mode === 'register' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register New
            </button>
          </div>
        )}

        {error && (
          <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
            {successMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="name@college.edu or name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-indigo-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  defaultValue="password123"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition cursor-pointer"
            >
              Sign In to Dashboard
            </button>

            {/* Quick Demo Logins for judges & testers */}
            <div className="pt-3 border-t border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500 mb-2">Or Quick Sign In as Seed User:</p>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      switchUser(u.id);
                      onClose();
                    }}
                    className="p-1.5 text-left border border-slate-200 rounded-lg hover:bg-slate-50 transition text-[11px]"
                  >
                    <p className="font-semibold text-slate-800 truncate">{u.name}</p>
                    <p className="text-slate-400 capitalize">{u.role}</p>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="student">Student</option>
                <option value="industry">Industry Partner</option>
                <option value="university">University Administrator</option>
                <option value="faculty">Faculty Member</option>
                <option value="placement">Placement Officer</option>
                <option value="government">Government Representative</option>
                <option value="admin">System Admin</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="E.g. Priya Patel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="priya.patel@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Role-Specific inputs */}
            {role === 'student' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Branch of Study (from Database)</label>
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">Supports Engineering, Sciences, Management & Computer Applications.</p>
              </div>
            )}

            {role === 'industry' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Company / Organization Name</label>
                <div className="relative">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            )}

            {(role === 'university' || role === 'faculty' || role === 'placement') && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Institution / University</label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition cursor-pointer mt-2"
            >
              Create {role.toUpperCase()} Account
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Enter your registered email</label>
              <input
                type="email"
                required
                placeholder="name@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
            >
              Send Password Reset Link
            </button>
            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full py-1 text-xs text-slate-600 hover:underline"
            >
              Back to Sign In
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};
