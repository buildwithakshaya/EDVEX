import React, { useState } from 'react';
import { db } from '../../db/storage';
import { Branch, Skill, CareerRole } from '../../types';
import {
  ShieldCheck,
  Layers,
  Zap,
  Target,
  Users,
  Plus,
  Trash2
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

interface AdminPortalProps {
  currentTab: string;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ currentTab: initialTab }) => {
  const [activeSubTab, setActiveSubTab] = useState<string>(
    initialTab === 'dashboard' ? 'skills' : initialTab
  );

  const branches = db.getBranches();
  const skills = db.getSkills();
  const careerRoles = db.getCareerRoles();
  const users = db.getUsers();

  // Add Skill Modal
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState<any>('Programming');
  const [skillDesc, setSkillDesc] = useState('');

  // Add Branch Modal
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [branchName, setBranchName] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [branchCategory, setBranchCategory] = useState('Engineering');

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    db.addSkill({
      id: `sk_${Date.now()}`,
      name: skillName.trim(),
      category: skillCategory,
      description: skillDesc.trim()
    });

    setIsAddSkillOpen(false);
    setSkillName('');
    setSkillDesc('');
  };

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchName.trim() || !branchCode.trim()) return;

    db.addBranch({
      id: `b_${Date.now()}`,
      name: branchName.trim(),
      code: branchCode.trim().toUpperCase(),
      category: branchCategory
    });

    setIsAddBranchOpen(false);
    setBranchName('');
    setBranchCode('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">System Administration & Master Data</h1>
            <Badge variant="indigo" size="sm">Super Admin</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure multidisciplinary branch taxonomy, global skill repository, and career competency thresholds.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('skills')}
          className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'skills'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          Skill Taxonomy ({skills.length})
        </button>

        <button
          onClick={() => setActiveSubTab('branches')}
          className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'branches'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          Academic Branches ({branches.length})
        </button>

        <button
          onClick={() => setActiveSubTab('career_roles')}
          className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'career_roles'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Target className="w-4 h-4" />
          Career Roles ({careerRoles.length})
        </button>

        <button
          onClick={() => setActiveSubTab('users')}
          className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'users'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          System Users ({users.length})
        </button>
      </div>

      {/* SKILLS TAB */}
      {activeSubTab === 'skills' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Master Skill Bank</h3>
            <button
              onClick={() => setIsAddSkillOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add New Skill
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="py-3 px-4">Skill ID</th>
                  <th className="py-3 px-4">Skill Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {skills.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono text-slate-400">{s.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                    <td className="py-3 px-4"><Badge variant="slate" size="sm">{s.category}</Badge></td>
                    <td className="py-3 px-4 text-slate-500">{s.description || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BRANCHES TAB */}
      {activeSubTab === 'branches' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Academic Branches (Multi-Branch SIH Standard)
            </h3>
            <button
              onClick={() => setIsAddBranchOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Branch
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map((b) => (
              <div key={b.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                    {b.code}
                  </span>
                  <Badge variant="slate" size="sm">{b.category}</Badge>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{b.name}</h4>
                <p className="text-[11px] text-slate-400 font-mono">ID: {b.id}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CAREER ROLES TAB */}
      {activeSubTab === 'career_roles' && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Target Career Competency Matrices ({careerRoles.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {careerRoles.map((role) => (
              <div key={role.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{role.title}</h4>
                    <p className="text-[11px] text-slate-500">{role.category} &bull; Avg: {role.averageStartingSalary}</p>
                  </div>
                  <Badge variant="indigo" size="sm">{role.requiredSkills.length} Required Skills</Badge>
                </div>

                <p className="text-xs text-slate-600">{role.description}</p>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Required Competencies:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {role.requiredSkills.map(req => {
                      const baseSkill = skills.find(s => s.id === req.skillId);
                      return (
                        <span key={req.skillId} className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-800 rounded">
                          {baseSkill ? baseSkill.name : req.skillId} ({req.minProficiency})
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            All Registered Stakeholders ({users.length})
          </h3>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Organization / University</th>
                  <th className="py-3 px-4">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3 px-4 text-slate-500">{u.email}</td>
                    <td className="py-3 px-4"><Badge variant="indigo" size="sm">{u.role}</Badge></td>
                    <td className="py-3 px-4 text-slate-600">{u.companyName || u.university || '—'}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD SKILL MODAL */}
      <Modal
        isOpen={isAddSkillOpen}
        onClose={() => setIsAddSkillOpen(false)}
        title="Add Master Skill"
        subtitle="Expands the multidisciplinary skill bank"
      >
        <form onSubmit={handleCreateSkill} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Skill Name</label>
            <input
              type="text"
              required
              placeholder="E.g. Computer Vision"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={skillCategory}
              onChange={(e) => setSkillCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="Programming">Programming</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Data">Data</option>
              <option value="Cloud">Cloud</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Electronics">Electronics</option>
              <option value="Electrical">Electrical</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Design">Design</option>
              <option value="Management">Management</option>
              <option value="Communication">Communication</option>
              <option value="Domain">Domain</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={skillDesc}
              onChange={(e) => setSkillDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddSkillOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
            >
              Save Skill to Bank
            </button>
          </div>
        </form>
      </Modal>

      {/* ADD BRANCH MODAL */}
      <Modal
        isOpen={isAddBranchOpen}
        onClose={() => setIsAddBranchOpen(false)}
        title="Add Academic Branch"
        subtitle="Configures curriculum department mapping"
      >
        <form onSubmit={handleCreateBranch} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Branch Name</label>
            <input
              type="text"
              required
              placeholder="E.g. Aerospace Engineering"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Branch Code</label>
            <input
              type="text"
              required
              placeholder="E.g. AERO"
              value={branchCode}
              onChange={(e) => setBranchCode(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <input
              type="text"
              value={branchCategory}
              onChange={(e) => setBranchCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddBranchOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
            >
              Register Branch
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
