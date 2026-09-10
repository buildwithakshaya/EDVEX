import React, { useState } from 'react';
import { db } from '../../../db/storage';
import { Hackathon, StudentProfile, StudentSkill } from '../../../types';
import { Trophy, Calendar, Users, Award, ExternalLink, Search, CheckCircle2, Shield } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';

interface HackathonsSectionProps {
  studentProfile: StudentProfile;
  studentSkills: StudentSkill[];
  limit?: number;
  onViewAll?: () => void;
}

export const HackathonsSection: React.FC<HackathonsSectionProps> = ({
  studentProfile,
  studentSkills,
  limit,
  onViewAll
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
  const [teamName, setTeamName] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const allHackathons = db.getHackathons();
  const studentRegistrations = db.getHackathonRegistrations(studentProfile.id);

  const studentSkillNames = new Set(
    studentSkills.map(s => {
      const obj = db.getSkills().find(sk => sk.id === s.skillId);
      return (obj ? obj.name : s.skillId).toLowerCase();
    })
  );

  const filtered = allHackathons.filter(h => {
    const term = searchTerm.toLowerCase();
    return (
      h.name.toLowerCase().includes(term) ||
      h.organizer.toLowerCase().includes(term) ||
      h.theme.toLowerCase().includes(term) ||
      h.requiredSkills.some(s => s.toLowerCase().includes(term))
    );
  });

  const displayed = limit ? filtered.slice(0, limit) : filtered;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHackathon) return;

    db.registerHackathon(studentProfile.id, selectedHackathon.id, teamName || undefined);
    setToastMessage(`Successfully registered for ${selectedHackathon.name}!`);
    setSelectedHackathon(null);
    setTeamName('');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">National & Industry Hackathons</h2>
            <Badge variant="amber" size="sm">SIH & Corporate Sprints</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Showcase applied engineering and multi-disciplinary prototyping. Earn awards, pre-placement interviews, and cash prizes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search hackathons, themes, skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-48 sm:w-60"
            />
          </div>

          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition whitespace-nowrap cursor-pointer"
            >
              View All ({allHackathons.length}) &rarr;
            </button>
          )}
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Grid of Hackathons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {displayed.map((hackathon) => {
          const registration = studentRegistrations.find(r => r.hackathonId === hackathon.id);
          const isRegistered = !!registration;

          // Check skill overlap
          const matchedSkills = hackathon.requiredSkills.filter(s => 
            studentSkillNames.has(s.toLowerCase())
          );

          return (
            <div
              key={hackathon.id}
              className="flex flex-col justify-between p-4 rounded-xl border border-slate-200/90 hover:border-amber-300 hover:shadow-xs transition bg-white"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {hackathon.organizer}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      {hackathon.name}
                    </h3>
                  </div>
                  {isRegistered ? (
                    <Badge variant="emerald" size="sm">
                      Applied: {registration?.teamName || 'Registered'}
                    </Badge>
                  ) : (
                    <Badge variant="indigo" size="sm">
                      {hackathon.mode}
                    </Badge>
                  )}
                </div>

                <div className="p-2 bg-amber-50/70 border border-amber-100 rounded-lg text-[11px] text-amber-900">
                  <span className="font-semibold text-amber-800">Theme: </span>
                  {hackathon.theme}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {hackathon.description}
                </p>

                {/* Prize & Dates */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Prize Pool</span>
                    <span className="font-bold text-slate-800">{hackathon.prizePool}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Registration Deadline</span>
                    <span className="font-semibold text-slate-700">{hackathon.registrationDeadline}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> Event: {hackathon.eventDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" /> {hackathon.teamRequirement}
                    </span>
                  </div>
                </div>

                {/* Relevant Skills */}
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Skills Relevant to Problem Statements:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {hackathon.requiredSkills.map((sk, idx) => {
                      const matched = studentSkillNames.has(sk.toLowerCase());
                      return (
                        <span
                          key={idx}
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            matched
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {sk} {matched && '✓ You have this'}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                {hackathon.registrationLink && (
                  <a
                    href={hackathon.registrationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                  >
                    Official Portal <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                {isRegistered ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Registered
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedHackathon(hackathon)}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition shadow-xs cursor-pointer"
                  >
                    Apply / Register
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {displayed.length === 0 && (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs">
          No hackathons match your search.
        </div>
      )}

      {/* Registration Modal */}
      {selectedHackathon && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-lg space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Register for {selectedHackathon.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Organized by {selectedHackathon.organizer} &bull; {selectedHackathon.mode}
                </p>
              </div>
              <button
                onClick={() => setSelectedHackathon(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Applicant Student
                </label>
                <input
                  type="text"
                  disabled
                  value={`${studentProfile.fullName} (${studentProfile.department})`}
                  className="w-full text-xs p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Team Name (or Solo Participant Name)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AeroTorque Innovators or Independent"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Team format: {selectedHackathon.teamRequirement}
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900">
                <p className="font-semibold text-amber-800">Participation Notice:</p>
                <p className="mt-0.5">
                  Your university verification and student portfolio will be submitted to the hackathon screening panel.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedHackathon(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
