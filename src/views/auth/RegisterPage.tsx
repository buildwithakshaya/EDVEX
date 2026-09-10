import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/storage';
import { UserRole, Branch } from '../../types';
import { 
  Compass, 
  ArrowLeft, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  GraduationCap, 
  Building, 
  Users, 
  Briefcase, 
  FileCheck, 
  ShieldCheck,
  Lock,
  Mail,
  User as UserIcon
} from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);

  // Common Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Student specific
  const [university, setUniversity] = useState('State Technical University');
  const [degree, setDegree] = useState('B.Tech');
  const [branchId, setBranchId] = useState('b_mech');

  // Industry specific
  const [companyName, setCompanyName] = useState('');
  const [industrySector, setIndustrySector] = useState('Automotive / Manufacturing');

  // University specific
  const [universityName, setUniversityName] = useState('');
  const [location, setLocation] = useState('Bengaluru, Karnataka');

  // Faculty specific
  const [facultyUniversity, setFacultyUniversity] = useState('National Institute of Technology');
  const [department, setDepartment] = useState('Mechanical Engineering');

  // Placement Officer specific
  const [placementUniversity, setPlacementUniversity] = useState('National Institute of Technology');

  // Government specific
  const [organization, setOrganization] = useState('');
  const [region, setRegion] = useState('National / All India');

  useEffect(() => {
    const list = db.getBranches();
    setBranches(list);
    if (list.length > 0) {
      setBranchId(list[0].id);
    }
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedRole) {
      setError('Please choose an account type.');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    // Role-specific field validation
    if (selectedRole === 'student' && (!university.trim() || !branchId)) {
      setError('Please provide university and branch details.');
      return;
    }
    if (selectedRole === 'industry' && !companyName.trim()) {
      setError('Please provide company name.');
      return;
    }
    if (selectedRole === 'university' && !universityName.trim()) {
      setError('Please provide university name.');
      return;
    }
    if (selectedRole === 'faculty' && (!facultyUniversity.trim() || !department.trim())) {
      setError('Please provide university and department details.');
      return;
    }
    if (selectedRole === 'placement' && !placementUniversity.trim()) {
      setError('Please provide university name.');
      return;
    }
    if (selectedRole === 'government' && !organization.trim()) {
      setError('Please provide government organization name.');
      return;
    }

    setLoading(true);

    const payload = {
      name: name.trim(),
      email: email.trim(),
      password,
      role: selectedRole,
      university: selectedRole === 'student' ? university :
                  selectedRole === 'university' ? universityName :
                  selectedRole === 'faculty' ? facultyUniversity :
                  selectedRole === 'placement' ? placementUniversity : undefined,
      degree: selectedRole === 'student' ? degree : undefined,
      branchId: selectedRole === 'student' ? branchId : undefined,
      companyName: selectedRole === 'industry' ? companyName : undefined,
      industrySector: selectedRole === 'industry' ? industrySector : undefined,
      department: selectedRole === 'faculty' ? department : undefined,
      organization: selectedRole === 'government' ? organization : undefined,
      location: selectedRole === 'university' ? location : undefined,
      region: selectedRole === 'government' ? region : undefined,
    };

    const res = await register(payload);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Failed to create account.');
    } else {
      // Redirect to the newly created user's role dashboard
      onNavigate(`/${selectedRole}/dashboard`);
    }
  };

  const roleOptions: { role: UserRole; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      role: 'student',
      title: 'Student',
      desc: 'Build skill profile, check readiness & apply',
      icon: <Users className="w-5 h-5 text-indigo-600" />
    },
    {
      role: 'university',
      title: 'University',
      desc: 'Institutional readiness & department insights',
      icon: <Building className="w-5 h-5 text-blue-600" />
    },
    {
      role: 'faculty',
      title: 'Faculty',
      desc: 'Mentor students & analyze curriculum gaps',
      icon: <GraduationCap className="w-5 h-5 text-amber-600" />
    },
    {
      role: 'industry',
      title: 'Industry',
      desc: 'Recruit candidates matching verified skills',
      icon: <Briefcase className="w-5 h-5 text-purple-600" />
    },
    {
      role: 'placement',
      title: 'Placement Officer',
      desc: 'Organize placement drives & student pools',
      icon: <FileCheck className="w-5 h-5 text-emerald-600" />
    },
    {
      role: 'government',
      title: 'Government',
      desc: 'Macro workforce demand-supply trends',
      icon: <ShieldCheck className="w-5 h-5 text-teal-600" />
    }
  ];

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

      {/* Main Registration Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 my-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="text-center space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Create your SkillBridge Account
            </h1>
            <p className="text-xs text-slate-500">
              Connect to India's dynamic skill-mapping and career placement ecosystem
            </p>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Role Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              1. What type of account are you creating?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {roleOptions.map((opt) => {
                const isSelected = selectedRole === opt.role;
                return (
                  <button
                    key={opt.role}
                    type="button"
                    onClick={() => handleRoleSelect(opt.role)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 rounded-lg bg-slate-100">{opt.icon}</div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{opt.title}</span>
                      <span className="text-[10px] text-slate-500 leading-snug">{opt.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Role Specific Form */}
          {selectedRole && (
            <form onSubmit={handleSubmit} className="space-y-5 pt-4 border-t border-slate-100 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <span>2. Account & Profile Details</span>
                <span className="capitalize text-indigo-600">({selectedRole})</span>
              </div>

              {/* Common Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Full Name / Contact Person
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={selectedRole === 'student' ? 'e.g. Vikram Sharma' : 'e.g. Dr. A. K. Sharma'}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Official / Academic Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@organization.edu"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* STUDENT ROLE FIELDS */}
              {selectedRole === 'student' && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-[11px] font-bold uppercase text-indigo-700 tracking-wider">
                    Academic Information
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700 block">
                        University / College Name
                      </label>
                      <input
                        type="text"
                        required
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        placeholder="e.g. National Institute of Technology"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Degree Program
                      </label>
                      <select
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        <option value="B.Tech">B.Tech / B.E.</option>
                        <option value="M.Tech">M.Tech / M.E.</option>
                        <option value="Diploma">Polytechnic Diploma</option>
                        <option value="BCA">BCA / MCA</option>
                        <option value="B.Sc">B.Sc / M.Sc</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Branch / Discipline
                      </label>
                      <select
                        value={branchId}
                        onChange={(e) => setBranchId(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        {branches.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name} ({b.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* INDUSTRY ROLE FIELDS */}
              {selectedRole === 'industry' && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-[11px] font-bold uppercase text-purple-700 tracking-wider">
                    Company Information
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Company Name
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Tata Technologies or Larsen & Toubro"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Industry Sector
                      </label>
                      <input
                        type="text"
                        required
                        value={industrySector}
                        onChange={(e) => setIndustrySector(e.target.value)}
                        placeholder="e.g. Automotive, Aerospace, Software, EPC"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UNIVERSITY ROLE FIELDS */}
              {selectedRole === 'university' && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-[11px] font-bold uppercase text-blue-700 tracking-wider">
                    Institutional Details
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        University Name
                      </label>
                      <input
                        type="text"
                        required
                        value={universityName}
                        onChange={(e) => setUniversityName(e.target.value)}
                        placeholder="e.g. Visvesvaraya Technological University"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Location / Campus
                      </label>
                      <input
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Belagavi, Karnataka"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* FACULTY ROLE FIELDS */}
              {selectedRole === 'faculty' && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-[11px] font-bold uppercase text-amber-700 tracking-wider">
                    Academic Department
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        University / College
                      </label>
                      <input
                        type="text"
                        required
                        value={facultyUniversity}
                        onChange={(e) => setFacultyUniversity(e.target.value)}
                        placeholder="e.g. National Institute of Technology"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Department
                      </label>
                      <input
                        type="text"
                        required
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. Mechanical Engineering"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PLACEMENT OFFICER FIELDS */}
              {selectedRole === 'placement' && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-[11px] font-bold uppercase text-emerald-700 tracking-wider">
                    Placement Cell Information
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 block">
                      University / Institution
                    </label>
                    <input
                      type="text"
                      required
                      value={placementUniversity}
                      onChange={(e) => setPlacementUniversity(e.target.value)}
                      placeholder="e.g. National Institute of Technology"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* GOVERNMENT ROLE FIELDS */}
              {selectedRole === 'government' && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-[11px] font-bold uppercase text-teal-700 tracking-wider">
                    Policy / Agency Details
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Department / Organization
                      </label>
                      <input
                        type="text"
                        required
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="e.g. Ministry of Skill Development & Entrepreneurship"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Jurisdiction Region
                      </label>
                      <input
                        type="text"
                        required
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        placeholder="e.g. Karnataka / South Zone"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-xs transition cursor-pointer"
              >
                {loading ? 'Creating Account...' : `Register as ${selectedRole.toUpperCase()}`}
              </button>
            </form>
          )}

          {/* Link to Login */}
          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('/login')}
                className="font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                Sign In
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
