import {
  StudentProfile,
  StudentSkill,
  Project,
  Certification,
  AssessmentAttempt,
  CareerRole,
  Opportunity,
  Skill,
  SkillProficiency,
  JobReadinessBreakdown,
  SkillGapItem,
  CareerReadinessResult,
  OpportunityMatchResult,
  Branch,
  Application,
  StudentPlacementRisk,
  PlacementRiskLevel
} from '../types';

const PROFICIENCY_VALUES: Record<SkillProficiency, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4
};

const PROFICIENCY_WEIGHTS: Record<SkillProficiency, number> = {
  Beginner: 0.25,
  Intermediate: 0.5,
  Advanced: 0.75,
  Expert: 1.0
};

/**
 * 10. Dynamic Job Readiness Calculation
 * Formula:
 * Academic (CGPA out of 10) = 20%
 * Skills (proficiency weighted) = 40%
 * Assessment score average = 20%
 * Projects count = 10%
 * Certifications count = 10%
 */
export function calculateJobReadiness(
  profile: StudentProfile | undefined,
  skills: StudentSkill[],
  assessmentAttempts: AssessmentAttempt[],
  projects: Project[],
  certifications: Certification[]
): JobReadinessBreakdown {
  const incompleteReasons: string[] = [];

  if (!profile || !profile.branchId) {
    return {
      overall: 0,
      academicScore: 0,
      skillsScore: 0,
      assessmentScore: 0,
      projectsScore: 0,
      certificationsScore: 0,
      isComplete: false,
      incompleteReasons: ['Complete your profile to calculate Job Readiness.']
    };
  }

  // 1. Academic Performance (20%)
  let academicScore = 0;
  if (profile.cgpa && profile.cgpa > 0) {
    // Normalizing CGPA: 10.0 scale -> 0 to 100
    academicScore = Math.min(100, Math.round((profile.cgpa / 10) * 100));
  } else {
    incompleteReasons.push('Add your CGPA in profile');
  }

  // 2. Skills Performance (40%)
  let skillsScore = 0;
  if (skills.length > 0) {
    // Each skill contributes according to its proficiency
    const totalProficiencyPoints = skills.reduce((sum, s) => {
      return sum + (PROFICIENCY_WEIGHTS[s.proficiency] || 0.25);
    }, 0);
    // Benchmark: 4 well-developed skills (average 3.0 points total) gives 100% skills quota
    skillsScore = Math.min(100, Math.round((totalProficiencyPoints / 3.0) * 100));
  } else {
    incompleteReasons.push('Add your skills to calculate skill readiness');
  }

  // 3. Assessment Performance (20%)
  let assessmentScore = 0;
  if (assessmentAttempts.length > 0) {
    const totalScore = assessmentAttempts.reduce((sum, a) => sum + a.scorePercentage, 0);
    assessmentScore = Math.round(totalScore / assessmentAttempts.length);
  } else {
    incompleteReasons.push('Complete an assessment to verify skills');
  }

  // 4. Projects (10%)
  let projectsScore = 0;
  if (projects.length > 0) {
    // 1 project = 50%, 2+ projects = 100%
    projectsScore = Math.min(100, projects.length * 50);
  }

  // 5. Certifications (10%)
  let certificationsScore = 0;
  if (certifications.length > 0) {
    // 1 cert = 50%, 2+ certs = 100%
    certificationsScore = Math.min(100, certifications.length * 50);
  }

  // Check if has enough data to be considered active
  const hasBasicData = profile.cgpa > 0 || skills.length > 0;
  if (!hasBasicData) {
    return {
      overall: 0,
      academicScore: 0,
      skillsScore: 0,
      assessmentScore: 0,
      projectsScore: 0,
      certificationsScore: 0,
      isComplete: false,
      incompleteReasons: ['Complete your profile to calculate Job Readiness.']
    };
  }

  const overall = Math.round(
    academicScore * 0.2 +
    skillsScore * 0.4 +
    assessmentScore * 0.2 +
    projectsScore * 0.1 +
    certificationsScore * 0.1
  );

  return {
    overall,
    academicScore,
    skillsScore,
    assessmentScore,
    projectsScore,
    certificationsScore,
    isComplete: true,
    incompleteReasons
  };
}

/**
 * 12. Dynamic Skill Gap Analysis & 13. Career Readiness
 */
export function calculateCareerReadiness(
  profile: StudentProfile | undefined,
  studentSkills: StudentSkill[],
  careerRole: CareerRole,
  allSkills: Skill[],
  assessmentAttempts: AssessmentAttempt[] = [],
  projects: Project[] = []
): CareerReadinessResult {
  const skillMap = new Map<string, Skill>(allSkills.map(s => [s.id, s]));
  const studentSkillMap = new Map<string, StudentSkill>(
    studentSkills.map(ss => [ss.skillId, ss])
  );

  let strongCount = 0;
  let needsImprovementCount = 0;
  let missingCount = 0;

  let totalPointsPossible = 0;
  let totalPointsEarned = 0;

  const skillGapList: SkillGapItem[] = careerRole.requiredSkills.map(req => {
    const skillObj = skillMap.get(req.skillId);
    const skillName = skillObj ? skillObj.name : req.skillId;
    const category = skillObj ? skillObj.category : 'Other';

    const reqLevel = PROFICIENCY_VALUES[req.minProficiency] || 2;
    const weight = req.importance === 'Required' ? 1.5 : 1.0;
    totalPointsPossible += reqLevel * weight;

    const matchedSkill = studentSkillMap.get(req.skillId);

    if (!matchedSkill) {
      missingCount++;
      return {
        skillId: req.skillId,
        skillName,
        category,
        requiredProficiency: req.minProficiency,
        studentProficiency: 'Missing',
        status: 'Missing',
        gapScore: 100
      };
    }

    const studentLevel = PROFICIENCY_VALUES[matchedSkill.proficiency];
    totalPointsEarned += Math.min(reqLevel, studentLevel) * weight;

    if (studentLevel >= reqLevel) {
      strongCount++;
      return {
        skillId: req.skillId,
        skillName,
        category,
        requiredProficiency: req.minProficiency,
        studentProficiency: matchedSkill.proficiency,
        status: 'Strong',
        gapScore: 0
      };
    } else {
      needsImprovementCount++;
      const gapScore = Math.round(((reqLevel - studentLevel) / reqLevel) * 100);
      return {
        skillId: req.skillId,
        skillName,
        category,
        requiredProficiency: req.minProficiency,
        studentProficiency: matchedSkill.proficiency,
        status: 'Needs Improvement',
        gapScore
      };
    }
  });

  const skillComponent = totalPointsPossible > 0 
    ? (totalPointsEarned / totalPointsPossible) * 70 
    : 0;

  // Bonus for relevant assessments
  let assessmentBonus = 0;
  if (assessmentAttempts.length > 0) {
    const avgScore = assessmentAttempts.reduce((a, b) => a + b.scorePercentage, 0) / assessmentAttempts.length;
    assessmentBonus = (avgScore / 100) * 15;
  }

  // Bonus for practical projects
  const projectBonus = Math.min(15, projects.length * 7.5);

  const careerReadiness = Math.min(100, Math.round(skillComponent + assessmentBonus + projectBonus));

  return {
    careerRole,
    careerReadiness,
    skillGapList,
    strongCount,
    needsImprovementCount,
    missingCount
  };
}

/**
 * 16. Dynamic Job / Internship Matching
 */
export function calculateOpportunityMatch(
  profile: StudentProfile | undefined,
  studentSkills: StudentSkill[],
  opportunity: Opportunity,
  allSkills: Skill[]
): OpportunityMatchResult {
  const skillMap = new Map<string, Skill>(allSkills.map(s => [s.id, s]));
  const studentSkillMap = new Map<string, StudentSkill>(
    studentSkills.map(ss => [ss.skillId, ss])
  );

  if (!profile) {
    return {
      opportunity,
      matchPercentage: 0,
      isEligible: false,
      eligibilityReasons: { cgpaMet: false, branchMet: false, degreeMet: false },
      explanation: 'Complete your profile to calculate match score.',
      matchingSkills: [],
      missingSkills: []
    };
  }

  // Eligibility Checks
  const cgpaMet = profile.cgpa >= opportunity.minCGPA;
  const branchMet = opportunity.eligibleBranchIds.includes(profile.branchId);
  const degreeMet = opportunity.eligibleDegree.some(d => 
    profile.degree.toLowerCase().includes(d.toLowerCase()) || 
    d.toLowerCase().includes(profile.degree.toLowerCase())
  );
  const isEligible = cgpaMet && branchMet;

  // Skill Matching
  let totalSkillReq = opportunity.requiredSkills.length;
  let skillPointsEarned = 0;
  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];

  opportunity.requiredSkills.forEach(req => {
    const skillObj = skillMap.get(req.skillId);
    const skillName = skillObj ? skillObj.name : req.skillId;
    const studentSkill = studentSkillMap.get(req.skillId);

    if (studentSkill) {
      const studentLevel = PROFICIENCY_VALUES[studentSkill.proficiency];
      const reqLevel = PROFICIENCY_VALUES[req.minProficiency];
      if (studentLevel >= reqLevel) {
        skillPointsEarned += 1.0;
        matchingSkills.push(`${skillName} (${studentSkill.proficiency})`);
      } else {
        skillPointsEarned += 0.5;
        matchingSkills.push(`${skillName} (Needs Improvement)`);
      }
    } else {
      missingSkills.push(skillName);
    }
  });

  const skillScoreFraction = totalSkillReq > 0 ? (skillPointsEarned / totalSkillReq) : 1;

  // Weighted formula:
  // Skills match = 60%
  // Academic match (CGPA + Branch) = 40%
  let academicMatchScore = 0;
  if (cgpaMet) academicMatchScore += 20;
  else academicMatchScore += Math.max(0, (profile.cgpa / opportunity.minCGPA) * 15);

  if (branchMet) academicMatchScore += 20;
  else academicMatchScore += 5; // Related field

  // Career goal alignment bonus (+5)
  if (profile.careerGoal && opportunity.title.toLowerCase().includes(profile.careerGoal.toLowerCase())) {
    academicMatchScore = Math.min(40, academicMatchScore + 5);
  }

  const matchPercentage = Math.min(100, Math.round((skillScoreFraction * 60) + academicMatchScore));

  // Dynamic natural language explanation string
  let explanation = '';
  const cleanMatchedNames = matchingSkills.map(s => s.split(' (')[0]);
  if (cleanMatchedNames.length > 0 && missingSkills.length > 0) {
    explanation = `Strong match because your ${cleanMatchedNames.slice(0, 2).join(' and ')} skills match the role. Improve ${missingSkills.slice(0, 2).join(' & ')} to increase your readiness.`;
  } else if (cleanMatchedNames.length > 0 && missingSkills.length === 0) {
    explanation = `Excellent alignment! Your profile and skills in ${cleanMatchedNames.slice(0, 3).join(', ')} fully satisfy all recruiter criteria.`;
  } else if (missingSkills.length > 0) {
    explanation = `Eligible by branch. Acquire ${missingSkills.slice(0, 2).join(' and ')} to significantly increase your competitive match score.`;
  } else {
    explanation = `Aligned with your academic degree and department qualifications.`;
  }

  return {
    opportunity,
    matchPercentage,
    isEligible,
    eligibilityReasons: { cgpaMet, branchMet, degreeMet },
    explanation,
    matchingSkills,
    missingSkills
  };
}

/**
 * 18. University Dashboard Analytics Calculation
 */
export interface BranchReadinessItem {
  branchId: string;
  branchName: string;
  code: string;
  studentCount: number;
  avgReadiness: number;
  placedCount: number;
}

export interface UniversityAnalytics {
  totalStudents: number;
  studentsByBranch: { branchName: string; count: number; code: string }[];
  averageJobReadiness: number;
  averageReadiness: number;
  placedCount: number;
  placedStudents: number;
  internshipCount: number;
  placementRate: number;
  totalApplications: number;
  branchWiseBreakdown: BranchReadinessItem[];
  topSkills: { name: string; count: number }[];
  topSkillGaps: { name: string; count: number; skillName: string; missingCount: number }[];
}

export function calculateUniversityAnalytics(
  students: StudentProfile[],
  branches: Branch[],
  allStudentSkills: StudentSkill[],
  allSkills: Skill[],
  careerRoles: CareerRole[],
  allApplications: Application[]
): UniversityAnalytics {
  const totalStudents = students.length;

  if (totalStudents === 0) {
    return {
      totalStudents: 0,
      studentsByBranch: [],
      averageJobReadiness: 0,
      averageReadiness: 0,
      placedCount: 0,
      placedStudents: 0,
      internshipCount: 0,
      placementRate: 0,
      totalApplications: 0,
      branchWiseBreakdown: [],
      topSkills: [],
      topSkillGaps: []
    };
  }

  // Placements count
  const placedStudentIds = new Set(
    allApplications
      .filter(a => a.status === 'Selected')
      .map(a => a.studentId)
  );
  const placedCount = placedStudentIds.size;
  const placementRate = totalStudents > 0 ? Math.round((placedCount / totalStudents) * 100) : 0;
  const internshipCount = allApplications.filter(a => a.status === 'Selected' || a.status === 'Shortlisted').length;
  const totalApplications = allApplications.length;

  // Average readiness per student
  const studentReadinessMap = new Map<string, number>();
  let totalReadiness = 0;
  students.forEach(student => {
    const skills = allStudentSkills.filter(ss => ss.studentId === student.id);
    const readiness = calculateJobReadiness(student, skills, [], [], []);
    studentReadinessMap.set(student.id, readiness.overall);
    totalReadiness += readiness.overall;
  });
  const averageJobReadiness = totalStudents > 0 ? Math.round(totalReadiness / totalStudents) : 0;

  // Branch breakdown
  const branchMap = new Map<string, StudentProfile[]>();
  branches.forEach(b => branchMap.set(b.id, []));
  students.forEach(s => {
    const list = branchMap.get(s.branchId) || [];
    list.push(s);
    branchMap.set(s.branchId, list);
  });

  const branchWiseBreakdown: BranchReadinessItem[] = branches.map(branch => {
    const cohort = branchMap.get(branch.id) || [];
    const cohortSize = cohort.length;
    let cohortReadinessSum = 0;
    let cohortPlaced = 0;

    cohort.forEach(st => {
      cohortReadinessSum += studentReadinessMap.get(st.id) || 0;
      if (placedStudentIds.has(st.id)) cohortPlaced++;
    });

    const avgReadiness = cohortSize > 0 ? Math.round(cohortReadinessSum / cohortSize) : 0;

    return {
      branchId: branch.id,
      branchName: branch.name,
      code: branch.code,
      studentCount: cohortSize,
      avgReadiness,
      placedCount: cohortPlaced
    };
  });

  const studentsByBranch = branchWiseBreakdown
    .filter(b => b.studentCount > 0)
    .map(b => ({
      branchName: b.branchName,
      code: b.code,
      count: b.studentCount
    }))
    .sort((a, b) => b.count - a.count);

  // Top verified skills among students
  const skillCountMap = new Map<string, number>();
  allStudentSkills.forEach(ss => {
    const cur = skillCountMap.get(ss.skillId) || 0;
    skillCountMap.set(ss.skillId, cur + 1);
  });

  const topSkills = Array.from(skillCountMap.entries())
    .map(([skillId, count]) => {
      const skill = allSkills.find(s => s.id === skillId);
      return {
        name: skill ? skill.name : skillId,
        count
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Top skill gaps across university
  const skillSupplySet = new Set(allStudentSkills.map(ss => ss.skillId));
  const skillGapFrequency: Record<string, number> = {};

  careerRoles.forEach(cr => {
    cr.requiredSkills.forEach(req => {
      if (!skillSupplySet.has(req.skillId)) {
        skillGapFrequency[req.skillId] = (skillGapFrequency[req.skillId] || 0) + 1;
      }
    });
  });

  const topSkillGaps = Object.entries(skillGapFrequency)
    .map(([skillId, count]) => {
      const skill = allSkills.find(s => s.id === skillId);
      const name = skill ? skill.name : skillId;
      return {
        name,
        count,
        skillName: name,
        missingCount: count
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalStudents,
    studentsByBranch,
    averageJobReadiness,
    averageReadiness: averageJobReadiness,
    placedCount,
    placedStudents: placedCount,
    internshipCount,
    placementRate,
    totalApplications,
    branchWiseBreakdown,
    topSkills,
    topSkillGaps
  };
}

/**
 * 21. Government Dashboard Analytics (Aggregated Industry vs Student Supply)
 */
export interface GovernmentAnalytics {
  totalStudents: number;
  totalInstitutions: number;
  totalOpportunities: number;
  totalInternships: number;
  totalPlacements: number;
  demandVsSupply: { skillName: string; demand: number; supply: number; gap: number }[];
}

export function calculateGovernmentAnalytics(
  students: StudentProfile[],
  opportunities: Opportunity[],
  studentSkills: StudentSkill[],
  allSkills: Skill[],
  applications: Application[]
): GovernmentAnalytics {
  const totalStudents = students.length;
  const uniqueUniversities = new Set(students.map(s => s.university)).size;
  const totalOpportunities = opportunities.length;
  const totalInternships = opportunities.filter(o => o.type === 'Internship').length;
  const totalPlacements = applications.filter(a => a.status === 'Selected').length;

  // Calculate industry demand frequency
  const demandMap = new Map<string, number>();
  opportunities.forEach(opp => {
    opp.requiredSkills.forEach(req => {
      const cur = demandMap.get(req.skillId) || 0;
      demandMap.set(req.skillId, cur + opp.openings);
    });
  });

  // Calculate student supply frequency
  const supplyMap = new Map<string, number>();
  studentSkills.forEach(ss => {
    const cur = supplyMap.get(ss.skillId) || 0;
    supplyMap.set(ss.skillId, cur + 1);
  });

  // Demand vs Supply
  const demandVsSupply = allSkills
    .filter(s => demandMap.has(s.id) || supplyMap.has(s.id))
    .map(skill => {
      const demand = demandMap.get(skill.id) || 0;
      const supply = supplyMap.get(skill.id) || 0;
      return {
        skillName: skill.name,
        demand,
        supply,
        gap: Math.max(0, demand - supply)
      };
    })
    .sort((a, b) => b.demand - a.demand)
    .slice(0, 8);

  return {
    totalStudents,
    totalInstitutions: uniqueUniversities || 1,
    totalOpportunities,
    totalInternships,
    totalPlacements,
    demandVsSupply
  };
}

/**
 * 22. AI Placement Risk Detector
 * Early-warning, non-discriminatory decision support tool.
 * Evaluates skill gaps, assessment attempts, projects, CGPA, and readiness.
 */
export function calculateStudentPlacementRisk(
  student: StudentProfile,
  studentSkills: StudentSkill[],
  attempts: AssessmentAttempt[],
  projects: Project[],
  certs: Certification[],
  careerRoles: CareerRole[],
  branches: Branch[]
): StudentPlacementRisk {
  const branch = branches.find(b => b.id === student.branchId);
  const branchName = branch ? branch.name : student.department;

  const readiness = calculateJobReadiness(student, studentSkills, attempts, projects, certs);
  const targetRole = careerRoles.find(r => r.title === student.careerGoal) || careerRoles[0];

  const reasons: string[] = [];
  const recommendedActions: string[] = [];

  let riskScore = 0; // Higher = higher risk

  // 1. Readiness Score
  if (readiness.overall < 45) {
    riskScore += 35;
    reasons.push(`Low composite Job Readiness score (${readiness.overall}%) below industry threshold.`);
  } else if (readiness.overall < 65) {
    riskScore += 15;
    reasons.push(`Intermediate Job Readiness (${readiness.overall}%); requires targeted domain polish.`);
  }

  // 2. CGPA Check
  if (student.cgpa < 6.5) {
    riskScore += 25;
    reasons.push(`CGPA of ${student.cgpa.toFixed(1)} limits eligibility for top-tier recruiters requiring 6.5+.`);
    recommendedActions.push('Focus on semester grade improvement and target tier-2 core drives.');
  }

  // 3. Technical Assessment Check
  const techAttempt = attempts.find(a => a.category === 'Technical');
  if (!techAttempt) {
    riskScore += 20;
    reasons.push('No technical assessment attempt recorded on the platform.');
    recommendedActions.push('Complete the standardized technical assessment to benchmark problem-solving.');
  } else if (techAttempt.scorePercentage < 60) {
    riskScore += 20;
    reasons.push(`Technical assessment score (${techAttempt.scorePercentage}%) indicates gaps in fundamentals.`);
    recommendedActions.push('Review technical question topics and retake technical assessment.');
  }

  // 4. Practical Projects Check
  if (projects.length === 0) {
    riskScore += 20;
    reasons.push('Zero practical engineering projects in student portfolio.');
    recommendedActions.push('Undertake a verified capstone project to demonstrate applied domain competence.');
  }

  // 5. Target Career Skill Gaps
  if (targetRole) {
    const studentSkillIds = new Set(studentSkills.map(s => s.skillId));
    const missingCore = targetRole.requiredSkills.filter(
      req => req.importance === 'Required' && !studentSkillIds.has(req.skillId)
    );
    if (missingCore.length > 0) {
      riskScore += 15;
      reasons.push(`Missing ${missingCore.length} required skills for target role "${targetRole.title}".`);
      recommendedActions.push(`Enroll in recommended certification/course for missing competencies.`);
    }
  }

  // Determine Risk Level
  let riskLevel: PlacementRiskLevel = 'Low';
  if (riskScore >= 50) {
    riskLevel = 'High';
  } else if (riskScore >= 25) {
    riskLevel = 'Medium';
  } else {
    riskLevel = 'Low';
    if (reasons.length === 0) {
      reasons.push('Strong academic standing and comprehensive profile; low placement risk.');
    }
    recommendedActions.push('Participate in advance campus placement mock interviews and aptitude drills.');
  }

  return {
    studentId: student.id,
    studentName: student.fullName,
    branchName,
    cgpa: student.cgpa,
    readinessScore: readiness.overall,
    riskLevel,
    reasons,
    recommendedActions
  };
}

/**
 * 23. Placement Readiness Cohorts Breakdown
 */
export interface PlacementReadinessCohorts {
  ready: { student: StudentProfile; readiness: number }[];
  almostReady: { student: StudentProfile; readiness: number }[];
  needsPreparation: { student: StudentProfile; readiness: number }[];
  highRisk: { student: StudentProfile; readiness: number }[];
}

export function calculatePlacementReadinessCohorts(
  students: StudentProfile[],
  studentSkills: StudentSkill[],
  attempts: AssessmentAttempt[],
  projects: Project[],
  certs: Certification[]
): PlacementReadinessCohorts {
  const ready: { student: StudentProfile; readiness: number }[] = [];
  const almostReady: { student: StudentProfile; readiness: number }[] = [];
  const needsPreparation: { student: StudentProfile; readiness: number }[] = [];
  const highRisk: { student: StudentProfile; readiness: number }[] = [];

  students.forEach(student => {
    const sSkills = studentSkills.filter(s => s.studentId === student.id);
    const sAttempts = attempts.filter(a => a.studentId === student.id);
    const sProjects = projects.filter(p => p.studentId === student.id);
    const sCerts = certs.filter(c => c.studentId === student.id);

    const readiness = calculateJobReadiness(student, sSkills, sAttempts, sProjects, sCerts);
    const score = readiness.overall;

    if (score >= 75) {
      ready.push({ student, readiness: score });
    } else if (score >= 60) {
      almostReady.push({ student, readiness: score });
    } else if (score >= 45) {
      needsPreparation.push({ student, readiness: score });
    } else {
      highRisk.push({ student, readiness: score });
    }
  });

  return { ready, almostReady, needsPreparation, highRisk };
}

/**
 * 24. Faculty Class/Section Analytics (Scoped to authorized department)
 */
export interface FacultyClassAnalytics {
  departmentName: string;
  totalStudents: number;
  averageReadiness: number;
  topStrengths: { skillName: string; verifiedCount: number; proficiencyPct: number }[];
  commonGaps: { skillName: string; missingCount: number; recommendation: string }[];
  studentsNeedingAttention: { student: StudentProfile; readiness: number; reason: string }[];
}

export function calculateFacultyClassAnalytics(
  facultyDepartment: string,
  students: StudentProfile[],
  studentSkills: StudentSkill[],
  allSkills: Skill[],
  careerRoles: CareerRole[],
  attempts: AssessmentAttempt[],
  projects: Project[],
  certs: Certification[]
): FacultyClassAnalytics {
  // Filter students to faculty's department or branch
  const deptStudents = students.filter(s => 
    s.department.toLowerCase().includes(facultyDepartment.toLowerCase()) ||
    facultyDepartment.toLowerCase().includes(s.department.toLowerCase()) ||
    s.branchId.toLowerCase().includes(facultyDepartment.toLowerCase())
  );

  const totalStudents = deptStudents.length;
  if (totalStudents === 0) {
    return {
      departmentName: facultyDepartment,
      totalStudents: 0,
      averageReadiness: 0,
      topStrengths: [],
      commonGaps: [],
      studentsNeedingAttention: []
    };
  }

  const deptStudentIds = new Set(deptStudents.map(s => s.id));
  const deptSkills = studentSkills.filter(ss => deptStudentIds.has(ss.studentId));

  // Average readiness
  let sumReadiness = 0;
  const studentsNeedingAttention: { student: StudentProfile; readiness: number; reason: string }[] = [];

  deptStudents.forEach(st => {
    const sSkills = deptSkills.filter(s => s.studentId === st.id);
    const sAttempts = attempts.filter(a => a.studentId === st.id);
    const sProjects = projects.filter(p => p.studentId === st.id);
    const sCerts = certs.filter(c => c.studentId === st.id);
    const readiness = calculateJobReadiness(st, sSkills, sAttempts, sProjects, sCerts);
    sumReadiness += readiness.overall;

    if (readiness.overall < 55) {
      let reason = 'Job readiness below 55%';
      if (sProjects.length === 0) reason += ' & no projects uploaded';
      if (st.cgpa < 6.5) reason += ' & CGPA under 6.5';
      studentsNeedingAttention.push({ student: st, readiness: readiness.overall, reason });
    }
  });

  const averageReadiness = Math.round(sumReadiness / totalStudents);

  // Top Strengths in Department
  const skillCountMap = new Map<string, number>();
  deptSkills.forEach(ss => {
    skillCountMap.set(ss.skillId, (skillCountMap.get(ss.skillId) || 0) + 1);
  });

  const topStrengths = Array.from(skillCountMap.entries())
    .map(([skillId, count]) => {
      const skill = allSkills.find(s => s.id === skillId);
      return {
        skillName: skill ? skill.name : skillId,
        verifiedCount: count,
        proficiencyPct: Math.round((count / totalStudents) * 100)
      };
    })
    .sort((a, b) => b.verifiedCount - a.verifiedCount)
    .slice(0, 4);

  // Common Gaps (Comparing student skills with department career roles)
  const relevantRoles = careerRoles.filter(cr => 
    cr.branchIds.some(bId => deptStudents.some(s => s.branchId === bId))
  );

  const missingMap = new Map<string, number>();
  relevantRoles.forEach(role => {
    role.requiredSkills.forEach(req => {
      deptStudents.forEach(st => {
        const hasSkill = deptSkills.some(s => s.studentId === st.id && s.skillId === req.skillId);
        if (!hasSkill) {
          missingMap.set(req.skillId, (missingMap.get(req.skillId) || 0) + 1);
        }
      });
    });
  });

  const commonGaps = Array.from(missingMap.entries())
    .map(([skillId, missingCount]) => {
      const skill = allSkills.find(s => s.id === skillId);
      const skillName = skill ? skill.name : skillId;
      return {
        skillName,
        missingCount,
        recommendation: `${missingCount} students need development in ${skillName}. Suggest department lab workshop or certified learning program.`
      };
    })
    .sort((a, b) => b.missingCount - a.missingCount)
    .slice(0, 5);

  return {
    departmentName: facultyDepartment,
    totalStudents,
    averageReadiness,
    topStrengths,
    commonGaps,
    studentsNeedingAttention
  };
}

