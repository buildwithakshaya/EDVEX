import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/storage';
import { SkillCategory, SkillProficiency, StudentSkill } from '../../types';
import { Plus, Trash2, Search, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';

const PROFICIENCIES: SkillProficiency[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const CATEGORIES: SkillCategory[] = [
  'Programming', 'AI/ML', 'Data', 'Cloud', 'Cybersecurity', 
  'Electronics', 'Electrical', 'Mechanical', 'Civil', 'Design', 
  'Management', 'Communication', 'Domain', 'Other'
];

export const StudentSkillsView: React.FC = () => {
  const { studentProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add skill modal state
  const [newSkillId, setNewSkillId] = useState('');
  const [newProficiency, setNewProficiency] = useState<SkillProficiency>('Intermediate');
  const [isCustomSkill, setIsCustomSkill] = useState(false);
  const [customSkillName, setCustomSkillName] = useState('');
  const [customCategory, setCustomCategory] = useState<SkillCategory>('Mechanical');

  if (!studentProfile) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Complete your profile to manage skills."
        description="Profile details must exist before mapping student skill proficiencies."
      />
    );
  }

  const allDbSkills = db.getSkills();
  const studentSkills = db.getStudentSkills(studentProfile.id);

  // Map student skill with base skill details
  const enrichedStudentSkills = studentSkills.map(ss => {
    const base = allDbSkills.find(s => s.id === ss.skillId);
    return {
      ...ss,
      name: base ? base.name : ss.skillId,
      category: base ? base.category : 'Other',
      description: base ? base.description : ''
    };
  });

  // Filter skills
  const filteredSkills = enrichedStudentSkills.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Already added skill IDs
  const addedSkillIds = new Set(studentSkills.map(s => s.skillId));
  const availableToAdd = allDbSkills.filter(s => !addedSkillIds.has(s.id));

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    let finalSkillId = newSkillId;

    if (isCustomSkill) {
      if (!customSkillName.trim()) return;
      const createdSkill = db.addSkill({
        id: `sk_custom_${Date.now()}`,
        name: customSkillName.trim(),
        category: customCategory,
        description: 'User defined skill'
      });
      finalSkillId = createdSkill.id;
    }

    if (!finalSkillId) return;

    const newStudentSkill: StudentSkill = {
      id: `ssk_${Date.now()}`,
      studentId: studentProfile.id,
      skillId: finalSkillId,
      proficiency: newProficiency,
      verified: false
    };

    db.addStudentSkill(newStudentSkill);
    setIsAddModalOpen(false);
    setNewSkillId('');
    setCustomSkillName('');
    setIsCustomSkill(false);
  };

  const handleProficiencyChange = (studentSkillId: string, prof: SkillProficiency) => {
    db.updateStudentSkillProficiency(studentSkillId, prof);
  };

  const handleDelete = (studentSkillId: string) => {
    if (window.confirm('Remove this skill from your profile? Calculations will update immediately.')) {
      db.deleteStudentSkill(studentSkillId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">My Skills Portfolio</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your verified competencies across disciplines. Skills account for 40% of your Job Readiness calculation.
          </p>
        </div>
        <button
          onClick={() => {
            if (availableToAdd.length > 0) {
              setNewSkillId(availableToAdd[0].id);
            }
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Skill to Profile
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search your skills (e.g. AutoCAD, Python, SolidWorks)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
        >
          <option value="All">All Categories ({studentSkills.length})</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* SKILLS LIST TABLE */}
      {filteredSkills.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="Add your first skill to start skill mapping."
          description="Build your multidisciplinary technical and foundational skill portfolio to enable dynamic gap analysis."
          actionLabel="+ Add First Skill"
          onAction={() => {
            if (availableToAdd.length > 0) setNewSkillId(availableToAdd[0].id);
            setIsAddModalOpen(true);
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Skill Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Proficiency Level (Dynamic)</th>
                  <th className="py-3 px-4">Readiness Weight</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredSkills.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{item.name}</span>
                        {item.verified && (
                          <span title="Verified by Course / Assessment">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="slate" size="sm">
                        {item.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={item.proficiency}
                        onChange={(e) => handleProficiencyChange(item.id, e.target.value as SkillProficiency)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md border transition cursor-pointer ${
                          item.proficiency === 'Expert'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : item.proficiency === 'Advanced'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.proficiency === 'Intermediate'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {PROFICIENCIES.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Select to dynamically test recalculation
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {item.proficiency === 'Expert' ? '1.0 pt' :
                       item.proficiency === 'Advanced' ? '0.75 pt' :
                       item.proficiency === 'Intermediate' ? '0.50 pt' : '0.25 pt'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Delete Skill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Skill to Profile"
        subtitle="Select from multidisciplinary database or enter custom domain skill"
      >
        <form onSubmit={handleAddSkill} className="space-y-4">
          <div className="flex items-center gap-4 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setIsCustomSkill(false)}
              className={`flex-1 py-1.5 rounded-md transition ${!isCustomSkill ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'}`}
            >
              From Skill Bank ({allDbSkills.length})
            </button>
            <button
              type="button"
              onClick={() => setIsCustomSkill(true)}
              className={`flex-1 py-1.5 rounded-md transition ${isCustomSkill ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'}`}
            >
              + Create Custom Skill
            </button>
          </div>

          {!isCustomSkill ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Skill</label>
              {availableToAdd.length === 0 ? (
                <p className="text-xs text-slate-500">All available database skills have already been added to your profile.</p>
              ) : (
                <select
                  value={newSkillId}
                  onChange={(e) => setNewSkillId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  required
                >
                  {availableToAdd.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. ANSYS Fluent or Flutter"
                  value={customSkillName}
                  onChange={(e) => setCustomSkillName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as SkillCategory)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Your Proficiency Level</label>
            <select
              value={newProficiency}
              onChange={(e) => setNewProficiency(e.target.value as SkillProficiency)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
            >
              {PROFICIENCIES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition cursor-pointer"
            >
              Save Skill
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
