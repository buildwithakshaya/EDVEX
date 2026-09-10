import {
  StudentProfile,
  StudentSkill,
  Project,
  Certification,
  AssessmentAttempt,
  CareerRole,
  Skill,
  CourseItem,
  Branch,
  CareerRoadmap,
  RoadmapStage,
  RoadmapItem,
  RoadmapProject,
  RoadmapMilestone,
  WeeklyPlanWeek,
  WeeklyPlanTask,
  LearningTimeOption,
  LearningModeOption,
  TargetPeriodOption,
  RoadmapItemPriority
} from '../types';
import { calculateJobReadiness, calculateCareerReadiness } from './calculations';

export interface RoadmapGenerationOptions {
  targetCareer?: string;
  currentSkillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  weeklyLearningTime?: LearningTimeOption;
  learningMode?: LearningModeOption;
  targetPeriod?: TargetPeriodOption;
}

interface DomainSkillTemplate {
  name: string;
  category: string;
  priority: RoadmapItemPriority;
  targetProficiency: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  whyNeeded: string;
  practiceTask: string;
  stageNumber: 1 | 2 | 3;
}

interface DomainProjectTemplate {
  title: string;
  description: string;
  skillsReinforced: string[];
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  stageIndex: number;
  outcomes: string[];
}

/**
 * Knowledge-base of branch & career role domain patterns
 * Provides authentic, high-value engineering & professional curriculum tracks
 */
function getDomainTemplates(branchCategory: string, branchCode: string, targetCareer: string): {
  skills: DomainSkillTemplate[];
  projects: DomainProjectTemplate[];
} {
  const code = branchCode.toUpperCase();
  const career = targetCareer.toLowerCase();

  // 1. Mechanical, Automobile, Mechatronics, Production
  if (code.includes('MECH') || code.includes('AUTO') || code.includes('PROD') || code.includes('MFG') || code.includes('MTR') || career.includes('mechanical') || career.includes('automobile') || career.includes('cad')) {
    return {
      skills: [
        {
          name: 'AutoCAD',
          category: 'Mechanical',
          priority: 'High',
          targetProficiency: 'Intermediate',
          estimatedHours: 20,
          whyNeeded: 'Core standard for 2D engineering drafting, orthographic projection, and manufacturing sheet layouts.',
          practiceTask: 'Draft orthographic multi-view schematics for a flange coupling with cross-sectional hatching.',
          stageNumber: 1
        },
        {
          name: 'SolidWorks',
          category: 'Mechanical',
          priority: 'High',
          targetProficiency: 'Advanced',
          estimatedHours: 35,
          whyNeeded: 'Industry-standard parametric 3D modeling, assembly mates, and sheet-metal enclosure design.',
          practiceTask: 'Model a 5-part reduction gearbox assembly with animated exploded view and bill of materials.',
          stageNumber: 2
        },
        {
          name: 'GD&T (Geometric Dimensioning)',
          category: 'Mechanical',
          priority: 'High',
          targetProficiency: 'Intermediate',
          estimatedHours: 18,
          whyNeeded: 'Essential for specifying ASME Y14.5 manufacturing tolerances, datums, and runout limits on drawings.',
          practiceTask: 'Apply datum reference frames and positional tolerances to a machined automotive spindle drawing.',
          stageNumber: 2
        },
        {
          name: 'Manufacturing Processes',
          category: 'Mechanical',
          priority: 'Medium',
          targetProficiency: 'Intermediate',
          estimatedHours: 22,
          whyNeeded: 'Understanding casting, CNC machining, injection molding, and Design for Manufacturing (DFM) guidelines.',
          practiceTask: 'Conduct a DFM audit on a cast aluminum housing to minimize undercuts and tooling costs.',
          stageNumber: 2
        },
        {
          name: 'ANSYS FEA',
          category: 'Mechanical',
          priority: 'Medium',
          targetProficiency: 'Intermediate',
          estimatedHours: 30,
          whyNeeded: 'Finite element stress analysis, mesh convergence studies, and thermal load validation.',
          practiceTask: 'Run a static structural FEA on a cantilever suspension wishbone under 2.5G braking load.',
          stageNumber: 3
        }
      ],
      projects: [
        {
          title: 'Automotive Wishbone Suspension Arm Optimization',
          description: 'Design and simulate an optimized double-wishbone suspension control arm in SolidWorks and ANSYS FEA to reduce mass while maintaining safety factor > 1.8.',
          skillsReinforced: ['SolidWorks', 'ANSYS FEA', 'GD&T (Geometric Dimensioning)', 'Manufacturing Processes'],
          complexity: 'Advanced',
          stageIndex: 3,
          outcomes: [
            'Parametric 3D CAD model with verified mass properties and center of gravity',
            'Von Mises stress contour maps and factor of safety report under dynamic loads',
            'Full ASME Y14.5 compliant 2D production drawing ready for CNC milling'
          ]
        },
        {
          title: 'Precision Mechanical Reducer Gearbox Assembly',
          description: 'Model a multi-stage helical reduction gearbox with bearings, shafts, keyways, and dynamic mating.',
          skillsReinforced: ['AutoCAD', 'SolidWorks', 'GD&T (Geometric Dimensioning)'],
          complexity: 'Intermediate',
          stageIndex: 2,
          outcomes: [
            'Complete assembly CAD with collision detection validation',
            'Detailed manufacturing BOM and exploded assembly drawing'
          ]
        }
      ]
    };
  }

  // 2. Data Analyst, Business Intelligence, Data Science
  if (career.includes('data analyst') || career.includes('business analyst') || career.includes('bi analyst') || code.includes('DS') || code.includes('AIDS')) {
    return {
      skills: [
        {
          name: 'SQL',
          category: 'Data',
          priority: 'High',
          targetProficiency: 'Advanced',
          estimatedHours: 25,
          whyNeeded: 'Primary requirement for extracting, joining, grouping, and transforming relational enterprise data.',
          practiceTask: 'Write complex window functions (RANK, LAG, NTILE) to compute month-over-month revenue growth.',
          stageNumber: 1
        },
        {
          name: 'Python',
          category: 'Programming',
          priority: 'High',
          targetProficiency: 'Intermediate',
          estimatedHours: 28,
          whyNeeded: 'Automation of ETL data cleaning, statistical modeling, and data pipelines.',
          practiceTask: 'Clean a messy 100,000-row customer churn dataset handling nulls, outliers, and type conversions.',
          stageNumber: 1
        },
        {
          name: 'Pandas & NumPy',
          category: 'Data',
          priority: 'High',
          targetProficiency: 'Intermediate',
          estimatedHours: 22,
          whyNeeded: 'Core Python libraries for multidimensional arrays, vectorization, and tabular transformations.',
          practiceTask: 'Perform pivot operations and multi-index aggregation on supply chain shipping logs.',
          stageNumber: 2
        },
        {
          name: 'Power BI',
          category: 'Data',
          priority: 'High',
          targetProficiency: 'Intermediate',
          estimatedHours: 25,
          whyNeeded: 'Building executive KPI dashboards, star schemas, and interactive business intelligence reports.',
          practiceTask: 'Build a star schema data model with custom DAX measures for Year-to-Date sales margins.',
          stageNumber: 2
        },
        {
          name: 'Advanced Excel',
          category: 'Data',
          priority: 'Medium',
          targetProficiency: 'Advanced',
          estimatedHours: 15,
          whyNeeded: 'Rapid exploratory ad-hoc financial modeling, VLOOKUP/XLOOKUP, and pivot summarization.',
          practiceTask: 'Create an automated financial variance model with dynamic slicers and scenario manager.',
          stageNumber: 3
        }
      ],
      projects: [
        {
          title: 'Executive Sales Performance & Customer Churn Dashboard',
          description: 'End-to-end business intelligence solution: Extract MySQL sales records, transform with Python Pandas, and build an interactive Power BI dashboard with DAX calculations.',
          skillsReinforced: ['SQL', 'Python', 'Power BI', 'Pandas & NumPy'],
          complexity: 'Advanced',
          stageIndex: 3,
          outcomes: [
            'Clean relational database schema with automated ETL refresh pipeline',
            'Interactive Power BI report highlighting regional revenue, churn risk, and CLV',
            'Documented insights brief delivering 3 tactical recommendations for sales leadership'
          ]
        },
        {
          title: 'E-Commerce Funnel Analytics & A/B Test Evaluator',
          description: 'Statistical analysis of web user conversion paths and hypothesis testing for pricing experiments.',
          skillsReinforced: ['SQL', 'Python', 'Pandas & NumPy'],
          complexity: 'Intermediate',
          stageIndex: 2,
          outcomes: [
            'Statistical significance test (p-value, confidence intervals) on conversion metrics',
            'Visual cohort retention heatmaps generated with Matplotlib and Seaborn'
          ]
        }
      ]
    };
  }

  // 3. AI / Machine Learning Engineer
  if (career.includes('ai') || career.includes('machine learning') || code.includes('AI') || code.includes('AIML')) {
    return {
      skills: [
        {
          name: 'Python',
          category: 'Programming',
          priority: 'High',
          targetProficiency: 'Advanced',
          estimatedHours: 30,
          whyNeeded: 'Foundation for AI pipelines, numerical libraries, object-oriented architecture, and API wrappers.',
          practiceTask: 'Implement custom generators, decorators, and asynchronous data loaders in Python.',
          stageNumber: 1
        },
        {
          name: 'Pandas & NumPy',
          category: 'Data',
          priority: 'High',
          targetProficiency: 'Advanced',
          estimatedHours: 25,
          whyNeeded: 'Essential for matrix transformations, feature engineering, and vectorized training arrays.',
          practiceTask: 'Build a reusable feature engineering pipeline with standard scaling, one-hot encoding, and PCA.',
          stageNumber: 1
        },
        {
          name: 'Machine Learning',
          category: 'AI/ML',
          priority: 'High',
          targetProficiency: 'Intermediate',
          estimatedHours: 35,
          whyNeeded: 'Theoretical and practical mastery of supervised/unsupervised algorithms (trees, ensembles, clustering).',
          practiceTask: 'Train and tune XGBoost and Random Forest models on loan default dataset with cross-validation.',
          stageNumber: 2
        },
        {
          name: 'PyTorch',
          category: 'AI/ML',
          priority: 'High',
          targetProficiency: 'Intermediate',
          estimatedHours: 40,
          whyNeeded: 'Leading framework for custom neural networks, loss functions, backpropagation, and deep learning.',
          practiceTask: 'Build and train a convolutional neural network (ResNet variant) for multi-class image classification.',
          stageNumber: 3
        },
        {
          name: 'Docker',
          category: 'Cloud',
          priority: 'Medium',
          targetProficiency: 'Intermediate',
          estimatedHours: 15,
          whyNeeded: 'Containerization of inference microservices and reproducible ML deployment pipelines.',
          practiceTask: 'Containerize a FastAPI model inference service with Docker and test latency with curl.',
          stageNumber: 3
        }
      ],
      projects: [
        {
          title: 'End-to-End Deep Learning Defect Detection & Inference API',
          description: 'Train a PyTorch computer vision model to detect surface defects on manufactured parts, package as a containerized FastAPI REST microservice with Docker.',
          skillsReinforced: ['Python', 'Machine Learning', 'PyTorch', 'Docker'],
          complexity: 'Advanced',
          stageIndex: 3,
          outcomes: [
            'Trained neural network achieving >92% F1-score with confusion matrix validation',
            'REST API returning low-latency inference predictions with bounding boxes',
            'Docker container ready for cloud deployment'
          ]
        }
      ]
    };
  }

  // 4. Electronics, ECE, Embedded Systems, IoT
  if (code.includes('ECE') || code.includes('EE') || code.includes('IOT') || code.includes('VLSI') || career.includes('embedded') || career.includes('electronics') || career.includes('firmware') || career.includes('iot')) {
    return {
      skills: [
        {
          name: 'C Language',
          category: 'Programming',
          priority: 'High',
          targetProficiency: 'Advanced',
          estimatedHours: 25,
          whyNeeded: 'Universal foundation for hardware architecture, pointer manipulation, and memory-constrained code.',
          practiceTask: 'Implement dynamic circular buffers and bitmask manipulation macros in ANSI C.',
          stageNumber: 1
        },
        {
          name: 'Embedded C',
          category: 'Electronics',
          priority: 'High',
          targetProficiency: 'Intermediate',
          estimatedHours: 35,
          whyNeeded: 'Low-level microcontroller register programming, Interrupt Service Routines (ISRs), and timers.',
          practiceTask: 'Configure timer registers and external interrupts to decode an optical rotary encoder signal.',
          stageNumber: 2
        },
        {
          name: 'Arduino & Microcontrollers',
          category: 'Electronics',
          priority: 'High',
          targetProficiency: 'Intermediate',
          estimatedHours: 25,
          whyNeeded: 'Rapid prototyping with hardware peripherals, serial buses (I2C, SPI, UART), and sensors.',
          practiceTask: 'Interface an I2C OLED display, BMP280 pressure sensor, and UART GPS module on a single bus.',
          stageNumber: 2
        },
        {
          name: 'PCB Design (KiCAD / Eagle)',
          category: 'Electronics',
          priority: 'Medium',
          targetProficiency: 'Intermediate',
          estimatedHours: 20,
          whyNeeded: 'Designing professional 2-layer schematics, component footprints, routing, and Gerber manufacturing files.',
          practiceTask: 'Design a regulated 3.3V/5V power supply breakout board with reverse polarity protection.',
          stageNumber: 3
        },
        {
          name: 'Verilog / VHDL',
          category: 'Electronics',
          priority: 'Medium',
          targetProficiency: 'Beginner',
          estimatedHours: 25,
          whyNeeded: 'Digital logic design for FPGA synthesis, finite state machines, and high-speed hardware pipelines.',
          practiceTask: 'Design and simulate a parameterized 4-bit ALU and SPI slave receiver in Verilog.',
          stageNumber: 3
        }
      ],
      projects: [
        {
          title: 'Industrial IoT Environmental Gateway with FreeRTOS',
          description: 'Develop an ARM Cortex-M embedded firmware telemetry node that reads multiple sensors over I2C/SPI and sends encrypted telemetry packets with low-power sleep cycles.',
          skillsReinforced: ['Embedded C', 'C Language', 'Arduino & Microcontrollers', 'PCB Design (KiCAD / Eagle)'],
          complexity: 'Advanced',
          stageIndex: 3,
          outcomes: [
            'Modular bare-metal C drivers for I2C, SPI, and low-power timer peripherals',
            'KiCAD 2-layer custom hardware schematic and routed PCB layout with Gerber export',
            'Verified logic analyzer traces demonstrating stable 400kHz I2C communication'
          ]
        }
      ]
    };
  }

  // 5. Civil Engineering, Structural, Construction
  if (code.includes('CIVIL') || code.includes('STRUCT') || code.includes('CONST') || career.includes('civil') || career.includes('structural') || career.includes('bim')) {
    return {
      skills: [
        {
          name: 'AutoCAD',
          category: 'Civil',
          priority: 'High',
          targetProficiency: 'Intermediate',
          estimatedHours: 20,
          whyNeeded: 'Standard tool for structural drafting, building plans, elevations, and structural detailing sheets.',
          practiceTask: 'Draft a residential 2BHK architectural layout with door/window schedules and grid dimensions.',
          stageNumber: 1
        },
        {
          name: 'STAAD.Pro',
          category: 'Civil',
          priority: 'High',
          targetProficiency: 'Intermediate',
          estimatedHours: 30,
          whyNeeded: 'Industry structural software for frame loading analysis, bending moment calculations, and shear design.',
          practiceTask: 'Model a 3-storey RCC framed structure subjected to dead load, live load, and wind forces.',
          stageNumber: 2
        },
        {
          name: 'Concrete Technology',
          category: 'Civil',
          priority: 'High',
          targetProficiency: 'Intermediate',
          estimatedHours: 18,
          whyNeeded: 'Mix design (IS 10262), workability, compressive strength, and durability standards for reinforced concrete.',
          practiceTask: 'Design a concrete mix proportion for M30 grade concrete with fly ash replacement according to IS 10262.',
          stageNumber: 2
        },
        {
          name: 'Autodesk Revit (BIM)',
          category: 'Civil',
          priority: 'Medium',
          targetProficiency: 'Intermediate',
          estimatedHours: 28,
          whyNeeded: 'Building Information Modeling (BIM) for 3D clash detection, schedule of quantities, and architectural coordination.',
          practiceTask: 'Build a parametric 3D structural Revit model with concrete columns, beams, and rebar scheduling.',
          stageNumber: 3
        },
        {
          name: 'Total Station & GIS',
          category: 'Civil',
          priority: 'Low',
          targetProficiency: 'Intermediate',
          estimatedHours: 15,
          whyNeeded: 'Topographic contouring, coordinate staking, and GIS spatial layer mapping for site planning.',
          practiceTask: 'Import total station survey coordinates into CAD and interpolate topographic elevation contours.',
          stageNumber: 3
        }
      ],
      projects: [
        {
          title: 'Seismic & Structural Design of G+4 RCC Commercial Building',
          description: 'Complete analysis and design of a multi-storey reinforced concrete structure using STAAD.Pro and AutoCAD adhering to IS 456:2000 and IS 1893:2016 seismic codes.',
          skillsReinforced: ['STAAD.Pro', 'AutoCAD', 'Concrete Technology', 'Autodesk Revit (BIM)'],
          complexity: 'Advanced',
          stageIndex: 3,
          outcomes: [
            'Complete STAAD.Pro analytical model with shear force and bending moment envelopes',
            'Structural detailing drawings of critical columns, footing joints, and beam cross-sections',
            'Bill of quantities (BOQ) estimation report for steel reinforcement and concrete volume'
          ]
        }
      ]
    };
  }

  // 6. Default: Software Developer / Computer Science / General
  return {
    skills: [
      {
        name: 'Python',
        category: 'Programming',
        priority: 'High',
        targetProficiency: 'Intermediate',
        estimatedHours: 25,
        whyNeeded: 'Essential programming language for algorithms, backend logic, and automated workflows.',
        practiceTask: 'Implement common data structures (stacks, queues, linked lists) and algorithms.',
        stageNumber: 1
      },
      {
        name: 'JavaScript',
        category: 'Programming',
        priority: 'High',
        targetProficiency: 'Intermediate',
        estimatedHours: 25,
        whyNeeded: 'Foundation for modern web application logic, asynchronous programming, and REST clients.',
        practiceTask: 'Build an interactive CRUD application consuming a public REST API with error handling.',
        stageNumber: 1
      },
      {
        name: 'SQL',
        category: 'Data',
        priority: 'High',
        targetProficiency: 'Intermediate',
        estimatedHours: 20,
        whyNeeded: 'Persistent data storage, transactional queries, relational schema modeling, and indexing.',
        practiceTask: 'Design a normalized 3NF database schema for an order processing system with foreign keys.',
        stageNumber: 2
      },
      {
        name: 'Git & GitHub',
        category: 'Cloud',
        priority: 'High',
        targetProficiency: 'Intermediate',
        estimatedHours: 12,
        whyNeeded: 'Distributed version control, collaborative branch management, pull requests, and code review.',
        practiceTask: 'Initialize a multi-branch repository, execute interactive rebasing, and resolve merge conflicts.',
        stageNumber: 2
      },
      {
        name: 'Docker',
        category: 'Cloud',
        priority: 'Medium',
        targetProficiency: 'Beginner',
        estimatedHours: 18,
        whyNeeded: 'Container packaging, reproducible development environments, and microservice isolation.',
        practiceTask: 'Write a multi-stage Dockerfile for a web server and run with docker-compose.',
        stageNumber: 3
      }
    ],
    projects: [
      {
        title: 'Full-Stack Service Platform with Automated CI/CD',
        description: 'Architect and deploy a modern web application with relational database persistence, authenticated REST APIs, and automated containerization.',
        skillsReinforced: ['JavaScript', 'Python', 'SQL', 'Git & GitHub', 'Docker'],
        complexity: 'Advanced',
        stageIndex: 3,
        outcomes: [
          'RESTful API architecture with robust validation and JWT authentication',
          'Normalized relational database schema with indexed queries',
          'Production-ready Docker container published on GitHub with documentation'
        ]
      }
    ]
  };
}

/**
 * Helper to match a skill name to an actual course record in db.getCourses()
 */
function findMatchingCourse(skillName: string, allCourses: CourseItem[]): CourseItem | undefined {
  const normSkill = skillName.toLowerCase();
  return allCourses.find(c =>
    c.skillsTaught.some(s => s.toLowerCase().includes(normSkill) || normSkill.includes(s.toLowerCase()))
  );
}

/**
 * Main AI Roadmap Generator
 * Uses authentic student data, recognized proficiencies, real skill gaps, and DB courses.
 */
export function generateAICareerRoadmap(
  profile: StudentProfile,
  studentSkills: StudentSkill[],
  assessmentAttempts: AssessmentAttempt[],
  projects: Project[],
  certifications: Certification[],
  allSkills: Skill[],
  careerRoles: CareerRole[],
  allCourses: CourseItem[],
  branches: Branch[],
  options: RoadmapGenerationOptions = {}
): CareerRoadmap {
  const branch = branches.find(b => b.id === profile.branchId);
  const branchName = branch ? branch.name : (profile.department || 'Engineering');
  const branchCode = branch ? branch.code : 'ENG';

  // Target Career: Use custom selected target career or profile default
  const targetCareerTitle = options.targetCareer || profile.careerGoal || 'Software Developer';
  const targetRole = careerRoles.find(r => r.title.toLowerCase() === targetCareerTitle.toLowerCase()) ||
    careerRoles.find(r => r.branchIds.includes(profile.branchId)) ||
    careerRoles[0];

  // Baseline calculations
  const readiness = calculateJobReadiness(profile, studentSkills, assessmentAttempts, projects, certifications);
  const careerAnalysis = targetRole
    ? calculateCareerReadiness(profile, studentSkills, targetRole, allSkills, assessmentAttempts, projects)
    : null;

  // Identify Student Knowledge & Gaps
  const studentSkillMap = new Map<string, string>(); // skillId -> proficiency
  studentSkills.forEach(s => {
    const skObj = allSkills.find(k => k.id === s.skillId);
    if (skObj) {
      studentSkillMap.set(skObj.name.toLowerCase(), s.proficiency);
    }
  });

  const verifiedStrengths: string[] = [];
  studentSkills.forEach(s => {
    const sk = allSkills.find(k => k.id === s.skillId);
    if (sk && (s.proficiency === 'Advanced' || s.proficiency === 'Expert' || s.proficiency === 'Intermediate')) {
      verifiedStrengths.push(`${sk.name} (${s.proficiency})`);
    }
  });

  const missingSkillsList: string[] = [];
  if (careerAnalysis && careerAnalysis.skillGapList) {
    careerAnalysis.skillGapList.forEach(gap => {
      if (gap.status === 'Missing' || gap.status === 'Needs Improvement') {
        missingSkillsList.push(gap.skillName);
      }
    });
  }

  // Preferences & defaults
  const weeklyHours: LearningTimeOption = options.weeklyLearningTime || '5–7 hours/week';
  const learningMode: LearningModeOption = options.learningMode ||
    (profile.preferredWorkMode === 'On-site' ? 'Offline' : profile.preferredWorkMode === 'Remote' ? 'Online' : 'Hybrid');
  const targetPeriod: TargetPeriodOption = options.targetPeriod || '6 months';
  const currentSkillLevel = options.currentSkillLevel || (verifiedStrengths.length >= 3 ? 'Intermediate' : 'Beginner');

  // Domain knowledge templates for branch & career
  const domain = getDomainTemplates(branch?.category || 'Engineering', branchCode, targetCareerTitle);

  // Time scale multipliers based on target period
  let stage1Weeks = 'Weeks 1–3';
  let stage2Weeks = 'Weeks 4–7';
  let stage3Weeks = 'Weeks 8–11';
  let stage4Weeks = 'Weeks 12–13';
  let stage5Weeks = 'Weeks 14+';

  if (targetPeriod === '3 months') {
    stage1Weeks = 'Weeks 1–2';
    stage2Weeks = 'Weeks 3–5';
    stage3Weeks = 'Weeks 6–8';
    stage4Weeks = 'Weeks 9–10';
    stage5Weeks = 'Weeks 11–12';
  } else if (targetPeriod === '12 months') {
    stage1Weeks = 'Weeks 1–6';
    stage2Weeks = 'Weeks 7–16';
    stage3Weeks = 'Weeks 17–28';
    stage4Weeks = 'Weeks 29–36';
    stage5Weeks = 'Weeks 37+';
  }

  // Build STAGE 1, 2, 3 Items based on Real Skill Gaps
  // Priority: If the student ALREADY has Advanced/Expert proficiency, DO NOT re-teach basics!
  const stage1Items: RoadmapItem[] = [];
  const stage2Items: RoadmapItem[] = [];
  const stage3Items: RoadmapItem[] = [];

  domain.skills.forEach((tmpl, index) => {
    const existingProf = studentSkillMap.get(tmpl.name.toLowerCase());
    const isAlreadyAdvanced = existingProf === 'Advanced' || existingProf === 'Expert';

    // If user already mastered this skill, downgrade its priority or mark completed
    let priority: RoadmapItemPriority = tmpl.priority;
    let itemStatus: 'Not Started' | 'In Progress' | 'Completed' = 'Not Started';

    if (isAlreadyAdvanced) {
      itemStatus = 'Completed';
      priority = 'Low';
    } else if (!existingProf) {
      priority = 'High'; // Missing required skill gets Highest priority
    } else if (existingProf === 'Beginner') {
      priority = 'High';
    }

    // Connect to actual database course if available
    const matchedCourse = findMatchingCourse(tmpl.name, allCourses);

    const item: RoadmapItem = {
      id: `ritem_${Date.now()}_${index}`,
      title: isAlreadyAdvanced ? `Mastery: ${tmpl.name}` : `Acquire & Master: ${tmpl.name}`,
      skillName: tmpl.name,
      category: tmpl.category,
      priority,
      status: itemStatus,
      currentProficiency: existingProf || 'Missing',
      targetProficiency: tmpl.targetProficiency,
      estimatedHours: tmpl.estimatedHours,
      whyNeeded: isAlreadyAdvanced
        ? `You have already achieved ${existingProf} proficiency. Maintain sharp application via portfolio project.`
        : tmpl.whyNeeded,
      practiceTask: tmpl.practiceTask,
      resource: matchedCourse
        ? {
            courseId: matchedCourse.id,
            title: matchedCourse.title,
            provider: matchedCourse.provider,
            type: matchedCourse.type,
            duration: matchedCourse.duration,
            level: matchedCourse.level,
            link: matchedCourse.link,
            isAvailableInDB: true
          }
        : {
            title: `${tmpl.name} Applied Workshop`,
            provider: 'SkillBridge Curriculum Registry',
            type: 'Course',
            duration: `${tmpl.estimatedHours} Hours estimated`,
            level: tmpl.targetProficiency,
            isAvailableInDB: false
          }
    };

    if (tmpl.stageNumber === 1) {
      stage1Items.push(item);
    } else if (tmpl.stageNumber === 2) {
      stage2Items.push(item);
    } else {
      stage3Items.push(item);
    }
  });

  // Primary Capstone Project
  const recommendedProjects: RoadmapProject[] = domain.projects.map((proj, pIdx) => ({
    id: `rproj_${Date.now()}_${pIdx}`,
    title: proj.title,
    description: proj.description,
    skillsReinforced: proj.skillsReinforced,
    status: 'Not Started',
    complexity: proj.complexity,
    stageIndex: proj.stageIndex,
    outcomes: proj.outcomes
  }));

  // Build STAGES
  const stages: RoadmapStage[] = [
    {
      id: `stage_1_${Date.now()}`,
      stageNumber: 1,
      name: 'STAGE 1',
      title: 'Foundation & Tooling Setup',
      durationWeeks: stage1Weeks,
      goals: [
        'Solidify discipline-specific fundamental modeling or programming standards',
        'Address immediate high-priority baseline skill gaps identified in your profile',
        'Establish an active GitHub/CAD design portfolio repository'
      ],
      items: stage1Items,
      checkpointAssessment: {
        category: 'Technical',
        title: `${stage1Items[0]?.skillName || 'Domain'} Diagnostic Assessment`,
        description: 'Verify baseline knowledge and earn initial SkillBridge verification badge.',
        completed: assessmentAttempts.some(a => a.category === 'Technical' && a.scorePercentage >= 60)
      }
    },
    {
      id: `stage_2_${Date.now()}`,
      stageNumber: 2,
      name: 'STAGE 2',
      title: 'Core Professional Competencies',
      durationWeeks: stage2Weeks,
      goals: [
        'Advance from beginner understanding to autonomous intermediate execution',
        'Learn industry design rules, tolerancing, API best practices, and standard protocols',
        'Complete structured hands-on intermediate milestone assignments'
      ],
      items: stage2Items,
      practiceProject: recommendedProjects[1] || recommendedProjects[0],
      checkpointAssessment: {
        category: 'Technical',
        title: 'Industry Problem-Solving Benchmark',
        description: 'Multi-topic timed technical assessment testing domain problem-solving.',
        completed: assessmentAttempts.length >= 2
      }
    },
    {
      id: `stage_3_${Date.now()}`,
      stageNumber: 3,
      name: 'STAGE 3',
      title: 'Advanced Specialization & Industry Capstone',
      durationWeeks: stage3Weeks,
      goals: [
        'Master high-impact differentiator tools (e.g. FEA simulation, distributed pipelines, RTOS, BIM)',
        'Build and deploy a comprehensive, employer-ready capstone project',
        'Publish detailed technical documentation, design calculations, and live demonstrations'
      ],
      items: stage3Items,
      practiceProject: recommendedProjects[0]
    },
    {
      id: `stage_4_${Date.now()}`,
      stageNumber: 4,
      name: 'STAGE 4',
      title: 'Placement Preparation & Interview Sprint',
      durationWeeks: stage4Weeks,
      goals: [
        'Transform technical portfolio into an ATS-optimized professional resume',
        'Practice domain technical interviews and behavioral STAR responses',
        'Boost quantitative aptitude, analytical reasoning, and speed solving'
      ],
      items: [],
      activities: [
        {
          id: `act_resume_${Date.now()}`,
          title: `ATS Resume Optimization for ${targetCareerTitle}`,
          description: 'Format technical projects and verified skills with quantifiable impact metrics.',
          status: 'Not Started'
        },
        {
          id: `act_tech_${Date.now()}`,
          title: 'Domain Technical Interview Simulation',
          description: 'Practice high-frequency interview questions and whiteboard architecture discussions.',
          status: 'Not Started'
        },
        {
          id: `act_apt_${Date.now()}`,
          title: 'Quantitative & Logical Aptitude Sprint',
          description: 'Solve standardized placement aptitude tests covering numerical and logical reasoning.',
          status: 'Not Started'
        },
        {
          id: `act_mock_${Date.now()}`,
          title: 'Comprehensive Mock Interview',
          description: 'Engage in a simulated interview session with constructive feedback.',
          status: 'Not Started'
        }
      ]
    },
    {
      id: `stage_5_${Date.now()}`,
      stageNumber: 5,
      name: 'STAGE 5',
      title: 'Industry Applications & Opportunity Matching',
      durationWeeks: stage5Weeks,
      goals: [
        'Identify companies with high match scores for your verified skill profile',
        'Submit tailored applications for internships, on-campus drives, and graduate roles',
        'Track recruiter shortlists, interview rounds, and offer acceptance'
      ],
      items: [],
      activities: [
        {
          id: `act_match_${Date.now()}`,
          title: 'Review Top Matched Companies in SkillBridge',
          description: 'Explore opportunities where your dynamic match score exceeds 70%.',
          status: 'Not Started'
        },
        {
          id: `act_apply_${Date.now()}`,
          title: 'Submit 3+ Targeted Campus / Industry Applications',
          description: 'Apply directly through SkillBridge and monitor status progression in Applications view.',
          status: 'Not Started'
        }
      ]
    }
  ];

  // Build realistic Weekly Plan based on selected weekly time
  const weeklyPlan: WeeklyPlanWeek[] = [
    {
      weekNumber: 1,
      title: 'Foundational Diagnostics & Tool Setup',
      focusSkillOrTheme: stage1Items[0]?.skillName || 'Fundamentals',
      tasks: [
        {
          id: 'w1_t1',
          type: 'Learn',
          description: `Master core principles and interface navigation in ${stage1Items[0]?.skillName || 'Engineering Tools'}`,
          hours: weeklyHours === '2–4 hours/week' ? 2 : 3,
          status: 'Not Started'
        },
        {
          id: 'w1_t2',
          type: 'Practice',
          description: stage1Items[0]?.practiceTask || 'Complete baseline exercises',
          hours: weeklyHours === '2–4 hours/week' ? 2 : 3,
          status: 'Not Started'
        }
      ]
    },
    {
      weekNumber: 2,
      title: 'Drafting, Design Patterns & Applied Workflow',
      focusSkillOrTheme: stage1Items[1]?.skillName || stage1Items[0]?.skillName || 'Core Tool',
      tasks: [
        {
          id: 'w2_t1',
          type: 'Learn',
          description: `Study standard practices and constraints in ${stage1Items[1]?.skillName || 'Core Standards'}`,
          hours: 3,
          status: 'Not Started'
        },
        {
          id: 'w2_t2',
          type: 'Assessment',
          description: 'Complete SkillBridge technical assessment to earn verification badge',
          hours: 1,
          status: 'Not Started'
        }
      ]
    },
    {
      weekNumber: 3,
      title: 'Intermediate Modeling & System Constraints',
      focusSkillOrTheme: stage2Items[0]?.skillName || 'System Design',
      tasks: [
        {
          id: 'w3_t1',
          type: 'Learn',
          description: `Advanced workflows and industry standards in ${stage2Items[0]?.skillName || 'Intermediate Skills'}`,
          hours: 3,
          status: 'Not Started'
        },
        {
          id: 'w3_t2',
          type: 'Practice',
          description: stage2Items[0]?.practiceTask || 'Build intermediate component model',
          hours: 3,
          status: 'Not Started'
        }
      ]
    },
    {
      weekNumber: 4,
      title: 'Industry Rules, Tolerances & Assembly Mates',
      focusSkillOrTheme: stage2Items[1]?.skillName || 'Assembly & Standards',
      tasks: [
        {
          id: 'w4_t1',
          type: 'Learn',
          description: `Master ${stage2Items[1]?.skillName || 'Tolerancing & Best Practices'} guidelines`,
          hours: 3,
          status: 'Not Started'
        },
        {
          id: 'w4_t2',
          type: 'Project',
          description: 'Begin phase 1 of intermediate project assembly',
          hours: 3,
          status: 'Not Started'
        }
      ]
    },
    {
      weekNumber: 5,
      title: 'Specialized Advanced Simulation / Architecture',
      focusSkillOrTheme: stage3Items[0]?.skillName || 'Advanced Specialization',
      tasks: [
        {
          id: 'w5_t1',
          type: 'Learn',
          description: `Study formulation and execution in ${stage3Items[0]?.skillName || 'Advanced Modeling'}`,
          hours: 3,
          status: 'Not Started'
        },
        {
          id: 'w5_t2',
          type: 'Practice',
          description: stage3Items[0]?.practiceTask || 'Run validation test',
          hours: 3,
          status: 'Not Started'
        }
      ]
    },
    {
      weekNumber: 6,
      title: 'Capstone Project Implementation & Portfolio Delivery',
      focusSkillOrTheme: 'Portfolio Capstone',
      tasks: [
        {
          id: 'w6_t1',
          type: 'Project',
          description: `Assemble final report and documentation for "${recommendedProjects[0]?.title || 'Capstone'}"`,
          hours: 4,
          status: 'Not Started'
        },
        {
          id: 'w6_t2',
          type: 'Assessment',
          description: 'Take comprehensive domain readiness assessment to benchmark placement profile',
          hours: 2,
          status: 'Not Started'
        }
      ]
    }
  ];

  // Milestones timeline connected to actual completion data
  const hasProfile = Boolean(profile.cgpa > 0 && profile.branchId);
  const hasAssessment = assessmentAttempts.length > 0;
  const hasProject = projects.length > 0;
  const isPlacementReady = readiness.overall >= 70;

  const milestones: RoadmapMilestone[] = [
    {
      id: 'm_profile',
      title: 'Profile Ready',
      description: 'Academic records, branch specialization, and career target initialized.',
      status: hasProfile ? 'Completed' : 'Current',
      criteria: 'CGPA recorded and career goal selected'
    },
    {
      id: 'm_foundation',
      title: 'Foundation Complete',
      description: 'Initial tool competence and baseline gaps successfully bridged.',
      status: stage1Items.every(i => i.status === 'Completed') ? 'Completed' : (hasProfile ? 'Current' : 'Pending'),
      criteria: 'Stage 1 tasks & baseline diagnostic completed'
    },
    {
      id: 'm_core',
      title: 'Core Skills Complete',
      description: 'Intermediate industrial workflows and standards mastered.',
      status: stage2Items.every(i => i.status === 'Completed') ? 'Completed' : 'Pending',
      criteria: 'Stage 2 competencies and practice assignments done'
    },
    {
      id: 'm_project',
      title: 'Project Complete',
      description: 'Verified domain capstone project built and documented.',
      status: (hasProject || recommendedProjects.some(p => p.status === 'Completed')) ? 'Completed' : 'Pending',
      criteria: 'At least 1 industry-grade project in portfolio'
    },
    {
      id: 'm_assessment',
      title: 'Assessment Complete',
      description: 'Standardized technical aptitude verified by SkillBridge benchmark.',
      status: hasAssessment ? 'Completed' : 'Pending',
      criteria: 'Passed technical assessment with score >= 60%'
    },
    {
      id: 'm_placement',
      title: 'Placement Ready',
      description: 'Job Readiness Score exceeds 70% threshold for campus drives.',
      status: isPlacementReady ? 'Completed' : 'Pending',
      criteria: 'Job Readiness score >= 70%'
    },
    {
      id: 'm_application',
      title: 'Application Ready',
      description: 'Matched with campus opportunities and applications dispatched.',
      status: 'Pending',
      criteria: 'Applications submitted to matching industry openings'
    }
  ];

  // Calculate activities tally
  let totalActivities = 0;
  let completedActivities = 0;

  stages.forEach(st => {
    st.items.forEach(i => {
      totalActivities++;
      if (i.status === 'Completed') completedActivities++;
    });
    if (st.practiceProject) {
      totalActivities++;
      if (st.practiceProject.status === 'Completed') completedActivities++;
    }
    if (st.activities) {
      st.activities.forEach(a => {
        totalActivities++;
        if (a.status === 'Completed') completedActivities++;
      });
    }
  });

  const overallProgressPercentage = totalActivities > 0
    ? Math.round((completedActivities / totalActivities) * 100)
    : 0;

  // Personalized Natural Language Explanation: "Why this roadmap?"
  const missingText = missingSkillsList.length > 0
    ? missingSkillsList.slice(0, 4).join(', ')
    : 'advanced specialization concepts';

  const strengthsText = verifiedStrengths.length > 0
    ? `Your existing verified strength in ${verifiedStrengths.slice(0, 3).join(', ')} gives you an advantageous starting foundation. `
    : '';

  const whyThisRoadmap = `Your roadmap is dynamically customized for your selected "${targetCareerTitle}" career goal and your academic background in ${branchName} (${profile.degree} - Semester ${profile.semester || 7}). ${strengthsText}SkillBridge has prioritized ${missingText} because these competencies are heavily weighted by recruiters for this exact role and currently represent your primary skill gaps. By dedicating ${weeklyHours} across ${targetPeriod}, this roadmap systematically guides you through core tooling, an industry capstone project, and placement drives.`;

  return {
    id: `roadmap_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    studentId: profile.id,
    targetCareer: targetCareerTitle,
    careerRoleId: targetRole?.id,
    branchName,
    branchId: profile.branchId,
    degree: profile.degree || 'B.Tech',
    currentYear: profile.academicYear || 'Final Year (4th)',
    currentCGPA: profile.cgpa || 0,
    initialReadinessScore: readiness.overall,
    initialSkillGaps: missingSkillsList,
    initialStrengths: verifiedStrengths,
    weeklyLearningTime: weeklyHours,
    learningMode,
    targetPeriod,
    currentSkillLevel,
    whyThisRoadmap,
    whatIKnow: verifiedStrengths.length > 0
      ? verifiedStrengths
      : ['Profile initialized; beginner aptitude in discipline coursework'],
    whatIAmMissing: missingSkillsList.length > 0
      ? missingSkillsList
      : ['Advanced industry tooling and verified portfolio projects'],
    whatToLearnFirst: `Start with Stage 1: ${stage1Items[0]?.skillName || 'Engineering Fundamentals'} and establish your hands-on project workspace.`,
    whatToLearnNext: `Progress to Stage 2 & 3: ${stage2Items.map(i => i.skillName).join(', ') || 'Core industrial modeling'} followed by ${stage3Items[0]?.skillName || 'Advanced FEA/Simulation'}.`,
    capstoneProjectSummary: recommendedProjects[0]?.title || 'Multi-disciplinary Industry Capstone',
    whenToApplyAdvice: `Begin exploring matched campus drives in Stage 4 once your capstone project is published and your Job Readiness score reaches 70%. Full-scale placement submissions should be initiated in Stage 5.`,
    placementReadinessStrategy: `Focus on reaching >= 75% Job Readiness score by adding verified skills, completing at least 1 technical assessment, and hosting 2 portfolio projects.`,
    stages,
    projects: recommendedProjects,
    weeklyPlan,
    milestones,
    totalActivitiesCount: totalActivities,
    completedActivitiesCount: completedActivities,
    overallProgressPercentage,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
