import { 
  User, 
  Branch, 
  Skill, 
  CareerRole, 
  AssessmentQuestion, 
  Opportunity, 
  StudentProfile, 
  StudentSkill, 
  Project, 
  Certification, 
  AssessmentAttempt, 
  Application, 
  Notification,
  PlacementDrive,
  CourseItem,
  StudentCourseProgress,
  Hackathon,
  HackathonRegistration,
  PlacementCampaign,
  FacultyRecommendation
} from '../types';

export const INITIAL_BRANCHES: Branch[] = [
  // Computer & Information
  { id: 'b_cse', code: 'CSE', name: 'Computer Science and Engineering', category: 'Engineering' },
  { id: 'b_it', code: 'IT', name: 'Information Technology', category: 'Engineering' },
  { id: 'b_ai', code: 'AI', name: 'Artificial Intelligence', category: 'Engineering' },
  { id: 'b_aiml', code: 'AIML', name: 'Artificial Intelligence and Machine Learning', category: 'Engineering' },
  { id: 'b_aids', code: 'AIDS', name: 'Artificial Intelligence and Data Science', category: 'Engineering' },
  { id: 'b_ds', code: 'DS', name: 'Data Science', category: 'Engineering' },
  { id: 'b_cyber', code: 'CYBER', name: 'Cyber Security', category: 'Engineering' },
  { id: 'b_iot', code: 'IOT', name: 'Internet of Things', category: 'Engineering' },

  // Electrical & Electronics
  { id: 'b_ece', code: 'ECE', name: 'Electronics and Communication Engineering', category: 'Engineering' },
  { id: 'b_ee', code: 'EE', name: 'Electronics Engineering', category: 'Engineering' },
  { id: 'b_eee', code: 'EEE', name: 'Electrical and Electronics Engineering', category: 'Engineering' },
  { id: 'b_el', code: 'EL', name: 'Electrical Engineering', category: 'Engineering' },
  { id: 'b_ice', code: 'ICE', name: 'Instrumentation and Control Engineering', category: 'Engineering' },
  { id: 'b_vlsi', code: 'VLSI', name: 'VLSI Design and Technology', category: 'Engineering' },

  // Mechanical & Allied
  { id: 'b_mech', code: 'MECH', name: 'Mechanical Engineering', category: 'Engineering' },
  { id: 'b_auto', code: 'AUTO', name: 'Automobile Engineering', category: 'Engineering' },
  { id: 'b_mechatronics', code: 'MTR', name: 'Mechatronics Engineering', category: 'Engineering' },
  { id: 'b_robotics', code: 'ROBO', name: 'Robotics and Automation', category: 'Engineering' },
  { id: 'b_prod', code: 'PROD', name: 'Production Engineering', category: 'Engineering' },
  { id: 'b_ind', code: 'IND', name: 'Industrial Engineering', category: 'Engineering' },
  { id: 'b_mfg', code: 'MFG', name: 'Manufacturing Engineering', category: 'Engineering' },

  // Civil & Built Environment
  { id: 'b_civil', code: 'CIVIL', name: 'Civil Engineering', category: 'Engineering' },
  { id: 'b_struct', code: 'STR', name: 'Structural Engineering', category: 'Engineering' },
  { id: 'b_env', code: 'ENV', name: 'Environmental Engineering', category: 'Engineering' },
  { id: 'b_const', code: 'CONST', name: 'Construction Engineering', category: 'Engineering' },
  { id: 'b_trans', code: 'TRANS', name: 'Transportation Engineering', category: 'Engineering' },
  { id: 'b_geotech', code: 'GEO', name: 'Geotechnical Engineering', category: 'Engineering' },

  // Chemical & Energy
  { id: 'b_chem', code: 'CHEM', name: 'Chemical Engineering', category: 'Engineering' },
  { id: 'b_petro', code: 'PETRO', name: 'Petroleum Engineering', category: 'Engineering' },
  { id: 'b_petrochem', code: 'PETROC', name: 'Petrochemical Engineering', category: 'Engineering' },

  // Aerospace & Defense
  { id: 'b_aero', code: 'AERO', name: 'Aerospace Engineering', category: 'Engineering' },
  { id: 'b_aeronautical', code: 'AERO_N', name: 'Aeronautical Engineering', category: 'Engineering' },
  { id: 'b_avionics', code: 'AVION', name: 'Avionics', category: 'Engineering' },

  // Bio & Materials
  { id: 'b_biomed', code: 'BMED', name: 'Biomedical Engineering', category: 'Engineering' },
  { id: 'b_biotech', code: 'BTECH', name: 'Biotechnology', category: 'Engineering' },
  { id: 'b_agri', code: 'AGRI', name: 'Agricultural Engineering', category: 'Engineering' },
  { id: 'b_food', code: 'FOOD', name: 'Food Technology', category: 'Engineering' },
  { id: 'b_textile', code: 'TEX', name: 'Textile Engineering', category: 'Engineering' },
  { id: 'b_mining', code: 'MINE', name: 'Mining Engineering', category: 'Engineering' },
  { id: 'b_metallurgy', code: 'MET', name: 'Metallurgical Engineering', category: 'Engineering' },
  { id: 'b_materials', code: 'MAT', name: 'Materials Engineering', category: 'Engineering' },
  { id: 'b_marine', code: 'MAR', name: 'Marine Engineering', category: 'Engineering' },

  // Degree & Allied Streams
  { id: 'b_bca', code: 'BCA', name: 'Bachelor of Computer Applications (BCA)', category: 'Computer Applications' },
  { id: 'b_mca', code: 'MCA', name: 'Master of Computer Applications (MCA)', category: 'Computer Applications' },
  { id: 'b_bba', code: 'BBA', name: 'Bachelor of Business Administration (BBA)', category: 'Management' },
  { id: 'b_mba', code: 'MBA', name: 'Master of Business Administration (MBA)', category: 'Management' },
  { id: 'b_bsc', code: 'BSC', name: 'Bachelor of Science (BSc)', category: 'Science' },
  { id: 'b_msc', code: 'MSC', name: 'Master of Science (MSc)', category: 'Science' },
  { id: 'b_bcom', code: 'BCOM', name: 'Bachelor of Commerce (BCom)', category: 'Commerce' },
  { id: 'b_mcom', code: 'MCOM', name: 'Master of Commerce (MCom)', category: 'Commerce' },
  { id: 'b_poly', code: 'DIP', name: 'Diploma / Polytechnic', category: 'Other' },
  { id: 'b_other', code: 'OTH', name: 'Other Stream', category: 'Other' }
];

export const INITIAL_SKILLS: Skill[] = [
  // Programming
  { id: 'sk_python', name: 'Python', category: 'Programming', description: 'Data structures, scripting, OOP' },
  { id: 'sk_java', name: 'Java', category: 'Programming', description: 'Core Java, OOP, collections' },
  { id: 'sk_cpp', name: 'C++', category: 'Programming', description: 'Systems programming, STL, memory management' },
  { id: 'sk_js', name: 'JavaScript', category: 'Programming', description: 'Modern ES6+, DOM manipulation' },
  { id: 'sk_ts', name: 'TypeScript', category: 'Programming', description: 'Static typing, interfaces, generics' },
  { id: 'sk_c', name: 'C Language', category: 'Programming', description: 'Pointers, low-level programming' },

  // AI/ML
  { id: 'sk_ml', name: 'Machine Learning', category: 'AI/ML', description: 'Supervised/unsupervised algorithms, scikit-learn' },
  { id: 'sk_pytorch', name: 'PyTorch', category: 'AI/ML', description: 'Deep learning, neural networks' },
  { id: 'sk_tensorflow', name: 'TensorFlow', category: 'AI/ML', description: 'Tensors, Keras, model training' },
  { id: 'sk_nlp', name: 'Natural Language Processing', category: 'AI/ML', description: 'LLMs, tokenization, embeddings' },
  { id: 'sk_cv', name: 'Computer Vision', category: 'AI/ML', description: 'OpenCV, image classification, segmentation' },

  // Data
  { id: 'sk_sql', name: 'SQL', category: 'Data', description: 'Relational querying, joins, aggregations' },
  { id: 'sk_powerbi', name: 'Power BI', category: 'Data', description: 'DAX, interactive dashboard creation' },
  { id: 'sk_tableau', name: 'Tableau', category: 'Data', description: 'Business intelligence & visualization' },
  { id: 'sk_pandas', name: 'Pandas & NumPy', category: 'Data', description: 'Data wrangling & numerical computing' },
  { id: 'sk_excel', name: 'Advanced Excel', category: 'Data', description: 'Pivot tables, VLOOKUP, macros' },

  // Cloud & DevOps
  { id: 'sk_aws', name: 'AWS', category: 'Cloud', description: 'EC2, S3, Lambda, IAM' },
  { id: 'sk_docker', name: 'Docker', category: 'Cloud', description: 'Containerization, Dockerfile, compose' },
  { id: 'sk_k8s', name: 'Kubernetes', category: 'Cloud', description: 'Orchestration, deployments, pods' },
  { id: 'sk_git', name: 'Git & GitHub', category: 'Cloud', description: 'Version control, branching, PRs' },

  // Cybersecurity
  { id: 'sk_netsec', name: 'Network Security', category: 'Cybersecurity', description: 'Firewalls, TCP/IP, OSI, cryptography' },
  { id: 'sk_ethack', name: 'Ethical Hacking', category: 'Cybersecurity', description: 'Penetration testing, vulnerability scanning' },

  // Mechanical
  { id: 'sk_autocad', name: 'AutoCAD', category: 'Mechanical', description: '2D drafting, 3D modeling, engineering drawings' },
  { id: 'sk_solidworks', name: 'SolidWorks', category: 'Mechanical', description: 'Parametric CAD, assembly design, sheet metal' },
  { id: 'sk_catia', name: 'CATIA', category: 'Mechanical', description: 'Surface modeling, aerospace & automotive CAD' },
  { id: 'sk_ansys', name: 'ANSYS FEA', category: 'Mechanical', description: 'Structural, thermal, and CFD simulation' },
  { id: 'sk_mfg', name: 'Manufacturing Processes', category: 'Mechanical', description: 'Casting, machining, welding, additive manufacturing' },
  { id: 'sk_thermo', name: 'Thermodynamics & Heat Transfer', category: 'Mechanical', description: 'Energy systems, thermal analysis' },
  { id: 'sk_gdt', name: 'GD&T (Geometric Dimensioning)', category: 'Mechanical', description: 'ASME Y14.5 standards, tolerances' },
  { id: 'sk_cnc', name: 'CNC Programming', category: 'Mechanical', description: 'G-code, M-code, CAM milling & turning' },

  // Electronics & Electrical
  { id: 'sk_embedded_c', name: 'Embedded C', category: 'Electronics', description: 'Microcontroller programming, registers, ISRs' },
  { id: 'sk_arduino', name: 'Arduino & Microcontrollers', category: 'Electronics', description: 'Interfacing sensors, actuators, serial communication' },
  { id: 'sk_verilog', name: 'Verilog / VHDL', category: 'Electronics', description: 'FPGA design, digital logic synthesis' },
  { id: 'sk_pcb', name: 'PCB Design (KiCAD / Eagle)', category: 'Electronics', description: 'Schematic capture, routing, Gerber generation' },
  { id: 'sk_matlab', name: 'MATLAB & Simulink', category: 'Electrical', description: 'Dynamic system simulation, control theory' },
  { id: 'sk_plc', name: 'PLC & SCADA', category: 'Electrical', description: 'Ladder logic, industrial automation' },
  { id: 'sk_power_sys', name: 'Power Systems Analysis', category: 'Electrical', description: 'Load flow, transmission, protection' },

  // Civil
  { id: 'sk_revit', name: 'Autodesk Revit (BIM)', category: 'Civil', description: 'Building information modeling, architectural BIM' },
  { id: 'sk_staad', name: 'STAAD.Pro', category: 'Civil', description: 'Structural analysis & RCC design' },
  { id: 'sk_surveying', name: 'Total Station & GIS', category: 'Civil', description: 'Land surveying, spatial coordinate mapping' },
  { id: 'sk_concretestruct', name: 'Concrete Technology', category: 'Civil', description: 'Mix design, quality control, IS codes' },

  // Design & Management & Soft Skills
  { id: 'sk_figma', name: 'Figma & UI/UX', category: 'Design', description: 'Wireframing, prototyping, user-centered design' },
  { id: 'sk_agile', name: 'Agile & Scrum', category: 'Management', description: 'Sprint planning, user stories, Jira' },
  { id: 'sk_comm', name: 'Professional Communication', category: 'Communication', description: 'Executive presentation, technical documentation' }
];

export const INITIAL_CAREER_ROLES: CareerRole[] = [
  {
    id: 'cr_mech_design',
    title: 'Mechanical Design Engineer',
    category: 'Mechanical & Automation',
    description: 'Design, analyze, and test mechanical components, enclosures, and machinery using parametric CAD and FEA tools.',
    branchIds: ['b_mech', 'b_auto', 'b_mechatronics', 'b_prod', 'b_mfg'],
    averageStartingSalary: '₹4.5 - ₹7.5 LPA',
    requiredSkills: [
      { skillId: 'sk_solidworks', minProficiency: 'Intermediate', importance: 'Required' },
      { skillId: 'sk_autocad', minProficiency: 'Intermediate', importance: 'Required' },
      { skillId: 'sk_gdt', minProficiency: 'Beginner', importance: 'Required' },
      { skillId: 'sk_mfg', minProficiency: 'Intermediate', importance: 'Required' },
      { skillId: 'sk_ansys', minProficiency: 'Beginner', importance: 'Preferred' }
    ]
  },
  {
    id: 'cr_data_analyst',
    title: 'Data Analyst',
    category: 'Data & Analytics',
    description: 'Transform raw data into meaningful business insights through SQL queries, statistical models, and executive dashboards.',
    branchIds: ['b_cse', 'b_it', 'b_ds', 'b_aids', 'b_ece', 'b_mech', 'b_bca', 'b_bsc', 'b_bba'],
    averageStartingSalary: '₹5.0 - ₹8.0 LPA',
    requiredSkills: [
      { skillId: 'sk_sql', minProficiency: 'Intermediate', importance: 'Required' },
      { skillId: 'sk_python', minProficiency: 'Intermediate', importance: 'Required' },
      { skillId: 'sk_powerbi', minProficiency: 'Intermediate', importance: 'Required' },
      { skillId: 'sk_pandas', minProficiency: 'Intermediate', importance: 'Required' },
      { skillId: 'sk_excel', minProficiency: 'Advanced', importance: 'Preferred' }
    ]
  },
  {
    id: 'cr_software_dev',
    title: 'Software Developer',
    category: 'Software Engineering',
    description: 'Architect, build, and maintain scalable applications, robust APIs, and web services.',
    branchIds: ['b_cse', 'b_it', 'b_aiml', 'b_ece', 'b_bca', 'b_mca'],
    averageStartingSalary: '₹6.0 - ₹12.0 LPA',
    requiredSkills: [
      { skillId: 'sk_python', minProficiency: 'Intermediate', importance: 'Required' },
      { skillId: 'sk_js', minProficiency: 'Intermediate', importance: 'Required' },
      { skillId: 'sk_sql', minProficiency: 'Beginner', importance: 'Required' },
      { skillId: 'sk_git', minProficiency: 'Intermediate', importance: 'Required' },
      { skillId: 'sk_docker', minProficiency: 'Beginner', importance: 'Preferred' }
    ]
  },
  {
    id: 'cr_aiml_engineer',
    title: 'AI/ML Engineer',
    category: 'Artificial Intelligence',
    description: 'Develop, optimize, and deploy machine learning models, neural networks, and inference pipelines.',
    branchIds: ['b_ai', 'b_aiml', 'b_aids', 'b_ds', 'b_cse'],
    averageStartingSalary: '₹7.0 - ₹14.0 LPA',
    requiredSkills: [
      { skillId: 'sk_python', minProficiency: 'Advanced', importance: 'Required' },
      { skillId: 'sk_ml', minProficiency: 'Intermediate', importance: 'Required' },
      { skillId: 'sk_pytorch', minProficiency: 'Intermediate', importance: 'Required' },
      { skillId: 'sk_pandas', minProficiency: 'Intermediate', importance: 'Required' },
      { skillId: 'sk_docker', minProficiency: 'Beginner', importance: 'Preferred' }
    ]
  },
  {
    id: 'cr_embedded_eng',
    title: 'Embedded Systems Engineer',
    category: 'Electronics & Firmware',
    description: 'Develop low-level firmware, driver integrations, and real-time systems for microcontrollers and IoT hardware.',
    branchIds: ['b_ece', 'b_ee', 'b_eee', 'b_mechatronics', 'b_iot', 'b_robotics'],
    averageStartingSalary: '₹5.0 - ₹9.0 LPA',
    requiredSkills: [
      { skillId: 'sk_embedded_c', minProficiency: 'Intermediate', importance: 'Required' },
      { skillId: 'sk_c', minProficiency: 'Advanced', importance: 'Required' },
      { skillId: 'sk_arduino', minProficiency: 'Intermediate', importance: 'Required' },
      { skillId: 'sk_pcb', minProficiency: 'Beginner', importance: 'Preferred' }
    ]
  },
  {
    id: 'cr_structural_eng',
    title: 'Structural Engineer',
    category: 'Civil & Infrastructure',
    description: 'Analyze and design load-bearing frameworks, bridges, high-rise buildings, and seismic-resistant foundations.',
    branchIds: ['b_civil', 'b_struct', 'b_const'],
    averageStartingSalary: '₹4.2 - ₹7.0 LPA',
    requiredSkills: [
      { skillId: 'sk_autocad', minProficiency: 'Intermediate', importance: 'Required' },
      { skillId: 'sk_staad', minProficiency: 'Intermediate', importance: 'Required' },
      { skillId: 'sk_revit', minProficiency: 'Beginner', importance: 'Required' },
      { skillId: 'sk_concretestruct', minProficiency: 'Intermediate', importance: 'Required' }
    ]
  }
];

export const INITIAL_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // Technical - Mechanical & CAD
  {
    id: 'q_tech_1',
    category: 'Technical',
    question: 'In CAD modeling, what is the primary purpose of adding Geometric Dimensioning and Tolerancing (GD&T)?',
    options: [
      'To make the drawing look aesthetically pleasing to clients',
      'To specify the allowable variation of geometric features precisely for manufacturing',
      'To automatically convert 2D drawings into 3D animations',
      'To reduce the total number of dimensions to save paper'
    ],
    correctAnswerIndex: 1,
    skillId: 'sk_gdt',
    skillName: 'GD&T',
    difficulty: 'Medium'
  },
  {
    id: 'q_tech_2',
    category: 'Technical',
    question: 'Which of the following manufacturing processes is classified as an additive manufacturing technique?',
    options: [
      'CNC Milling',
      'Die Casting',
      'Selective Laser Sintering (SLS)',
      'Submerged Arc Welding'
    ],
    correctAnswerIndex: 2,
    skillId: 'sk_mfg',
    skillName: 'Manufacturing Processes',
    difficulty: 'Easy'
  },
  {
    id: 'q_tech_3',
    category: 'Technical',
    question: 'In Python, what is the time complexity of looking up a key in a standard dictionary on average?',
    options: [
      'O(N)',
      'O(log N)',
      'O(1)',
      'O(N log N)'
    ],
    correctAnswerIndex: 2,
    skillId: 'sk_python',
    skillName: 'Python',
    difficulty: 'Easy'
  },
  {
    id: 'q_tech_4',
    category: 'Technical',
    question: 'In SQL, which clause is used to filter the grouped results produced by a GROUP BY statement?',
    options: [
      'WHERE',
      'HAVING',
      'FILTER BY',
      'ORDER BY'
    ],
    correctAnswerIndex: 1,
    skillId: 'sk_sql',
    skillName: 'SQL',
    difficulty: 'Easy'
  },

  // Aptitude
  {
    id: 'q_apt_1',
    category: 'Aptitude',
    question: 'A gear with 20 teeth drives a gear with 60 teeth. If the driver rotates at 300 RPM, what is the rotational speed of the driven gear?',
    options: [
      '900 RPM',
      '100 RPM',
      '150 RPM',
      '600 RPM'
    ],
    correctAnswerIndex: 1,
    skillName: 'Mechanical Aptitude',
    difficulty: 'Medium'
  },
  {
    id: 'q_apt_2',
    category: 'Aptitude',
    question: 'If 8 workers can complete a prototype assembly in 15 days working 6 hours a day, how many days will 12 workers take working 8 hours a day?',
    options: [
      '7.5 days',
      '8 days',
      '10 days',
      '6 days'
    ],
    correctAnswerIndex: 0,
    skillName: 'Quantitative Reasoning',
    difficulty: 'Medium'
  },
  {
    id: 'q_apt_3',
    category: 'Aptitude',
    question: 'A pipe can fill a tank in 4 hours, while a drainage valve empties it in 6 hours. If both are open, how long will it take to fill the empty tank?',
    options: [
      '10 hours',
      '12 hours',
      '8 hours',
      '15 hours'
    ],
    correctAnswerIndex: 1,
    skillName: 'Logical Reasoning',
    difficulty: 'Easy'
  },

  // Communication
  {
    id: 'q_comm_1',
    category: 'Communication',
    question: 'When presenting a technical engineering failure analysis to non-technical executives, what is the most effective approach?',
    options: [
      'Present raw code and stress equation derivations without summary',
      'Highlight the operational impact, root cause, timeline, and mitigation actions clearly in plain language',
      'Avoid disclosing the failure until next quarter',
      'Use dense engineering acronyms to demonstrate expertise'
    ],
    correctAnswerIndex: 1,
    skillName: 'Professional Communication',
    difficulty: 'Easy'
  },
  {
    id: 'q_comm_2',
    category: 'Communication',
    question: 'Which of the following best demonstrates an active listening response in an agile team retrospective?',
    options: [
      '"Let me interrupt you right there because you are wrong."',
      '"So what you are saying is the manufacturing tolerance was too tight for current tooling, which caused the delay?"',
      '"I was not paying attention, please send an email."',
      '"That problem is not in my job description."'
    ],
    correctAnswerIndex: 1,
    skillName: 'Team Communication',
    difficulty: 'Easy'
  }
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp_tata_mech',
    companyId: 'u_industry',
    companyName: 'Tata Motors Design Center',
    companyLogo: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=100&h=100&fit=crop&crop=faces',
    title: 'Mechanical Design Engineer - Powertrain & Chassis',
    description: 'Work with cross-functional R&D teams to model chassis sub-assemblies, run FEA simulations, and generate production drawings for next-gen electric vehicles.',
    type: 'Job',
    location: 'Pune, Maharashtra',
    workMode: 'On-site',
    eligibleDegree: ['B.Tech', 'B.E.', 'M.Tech'],
    eligibleBranchIds: ['b_mech', 'b_auto', 'b_prod', 'b_mechatronics'],
    minCGPA: 7.0,
    requiredSkills: [
      { skillId: 'sk_solidworks', minProficiency: 'Intermediate' },
      { skillId: 'sk_autocad', minProficiency: 'Intermediate' },
      { skillId: 'sk_mfg', minProficiency: 'Intermediate' }
    ],
    deadline: '2026-11-30',
    salaryOrStipend: '₹6.5 - ₹8.2 LPA',
    status: 'Open',
    openings: 8,
    createdAt: '2026-08-15T10:00:00Z'
  },
  {
    id: 'opp_lnt_intern',
    companyId: 'u_industry',
    companyName: 'L&T Technology Services',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop',
    title: 'CAD Modeling & Simulation Intern',
    description: '3-month intensive internship involving 3D solid modeling, sheet metal design, tolerance stack-up analysis, and prototype fabrication assistance.',
    type: 'Internship',
    location: 'Bengaluru, Karnataka',
    workMode: 'Hybrid',
    eligibleDegree: ['B.Tech', 'B.E.', 'Diploma'],
    eligibleBranchIds: ['b_mech', 'b_auto', 'b_mechatronics', 'b_mfg'],
    minCGPA: 6.8,
    requiredSkills: [
      { skillId: 'sk_autocad', minProficiency: 'Beginner' },
      { skillId: 'sk_solidworks', minProficiency: 'Beginner' }
    ],
    deadline: '2026-10-25',
    salaryOrStipend: '₹25,000 / month',
    status: 'Open',
    openings: 12,
    createdAt: '2026-08-20T10:00:00Z'
  },
  {
    id: 'opp_infosys_data',
    companyId: 'u_industry',
    companyName: 'Infosys Applied AI Lab',
    companyLogo: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100&h=100&fit=crop',
    title: 'Junior Data Analyst',
    description: 'Clean data pipelines, build automated Power BI dashboards, write complex analytical SQL queries, and deliver weekly metrics to clients.',
    type: 'Job',
    location: 'Hyderabad, Telangana',
    workMode: 'Hybrid',
    eligibleDegree: ['B.Tech', 'B.E.', 'BCA', 'BSc', 'MCA'],
    eligibleBranchIds: ['b_cse', 'b_it', 'b_ds', 'b_aids', 'b_ece', 'b_mech', 'b_bca'],
    minCGPA: 7.2,
    requiredSkills: [
      { skillId: 'sk_sql', minProficiency: 'Intermediate' },
      { skillId: 'sk_python', minProficiency: 'Intermediate' },
      { skillId: 'sk_powerbi', minProficiency: 'Intermediate' }
    ],
    deadline: '2026-12-15',
    salaryOrStipend: '₹5.5 - ₹7.0 LPA',
    status: 'Open',
    openings: 15,
    createdAt: '2026-08-22T10:00:00Z'
  },
  {
    id: 'opp_bosch_embedded',
    companyId: 'u_industry',
    companyName: 'Bosch Global Software',
    companyLogo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop',
    title: 'Embedded Firmware Engineering Intern',
    description: 'Hands-on development of sensor interface drivers, CAN bus communication, and real-time microcontroller firmware for automotive mobility.',
    type: 'Internship',
    location: 'Coimbatore, Tamil Nadu',
    workMode: 'On-site',
    eligibleDegree: ['B.Tech', 'B.E.'],
    eligibleBranchIds: ['b_ece', 'b_eee', 'b_mechatronics', 'b_iot'],
    minCGPA: 7.5,
    requiredSkills: [
      { skillId: 'sk_embedded_c', minProficiency: 'Intermediate' },
      { skillId: 'sk_arduino', minProficiency: 'Intermediate' }
    ],
    deadline: '2026-11-10',
    salaryOrStipend: '₹30,000 / month',
    status: 'Open',
    openings: 5,
    createdAt: '2026-08-25T10:00:00Z'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u_student_1',
    email: 'rahul.sharma@college.edu',
    name: 'Rahul Sharma',
    role: 'student',
    phone: '+91 98765 43210',
    createdAt: '2026-08-01T08:00:00Z'
  },
  {
    id: 'u_student_new',
    email: 'priya.patel@college.edu',
    name: 'Priya Patel',
    role: 'student',
    phone: '+91 98765 11223',
    createdAt: '2026-09-01T09:00:00Z'
  },
  {
    id: 'u_university',
    email: 'dean.academic@nit.ac.in',
    name: 'Dr. Rajesh Iyer',
    role: 'university',
    phone: '+91 98111 22334',
    createdAt: '2026-07-15T08:00:00Z'
  },
  {
    id: 'u_faculty',
    email: 'prof.verma@nit.ac.in',
    name: 'Prof. Arvind Verma',
    role: 'faculty',
    phone: '+91 98222 33445',
    createdAt: '2026-07-20T08:00:00Z'
  },
  {
    id: 'u_industry',
    email: 'hr@tatamotors.com',
    name: 'Kavita Menon (Tata Motors)',
    role: 'industry',
    phone: '+91 98333 44556',
    createdAt: '2026-07-22T08:00:00Z'
  },
  {
    id: 'u_placement',
    email: 'tpo@nit.ac.in',
    name: 'Anita Roy (Placement Head)',
    role: 'placement',
    phone: '+91 98444 55667',
    createdAt: '2026-07-10T08:00:00Z'
  },
  {
    id: 'u_government',
    email: 'director.skill@moe.gov.in',
    name: 'Director S. K. Nair',
    role: 'government',
    phone: '+91 98555 66778',
    createdAt: '2026-06-01T08:00:00Z'
  },
  {
    id: 'u_admin',
    email: 'admin@skillbridge.gov.in',
    name: 'SkillBridge Admin',
    role: 'admin',
    phone: '+91 98666 77889',
    createdAt: '2026-06-01T08:00:00Z'
  }
];

// Seed student profiles demonstrating multi-department representation:
// Mechanical: Rahul Sharma (7.8), Aditya Kulkarni (6.4 - needs prep), Sneha Deshmukh (8.7 - ready/placed)
// Computer Science: Priya Patel (8.5), Rohan Gupta (6.2 - high risk)
// Electronics: Ananya Sen (7.9)
// Civil: Vikram Rao (7.7)
export const INITIAL_STUDENT_PROFILES: StudentProfile[] = [
  {
    id: 'sp_rahul',
    userId: 'u_student_1',
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@college.edu',
    phone: '+91 98765 43210',
    location: 'Pune, Maharashtra',
    university: 'National Institute of Technology',
    degree: 'B.Tech',
    department: 'Department of Mechanical Engineering',
    branchId: 'b_mech',
    specialization: 'Automotive & Product Design',
    academicYear: 'Final Year (4th)',
    semester: 7,
    cgpa: 7.8,
    graduationYear: 2027,
    careerGoal: 'Mechanical Design Engineer',
    preferredLocation: 'Pune / Bengaluru',
    preferredWorkMode: 'On-site',
    bio: 'Passionate mechanical engineering student focusing on CAD parametric modeling, assembly design, and modern manufacturing.'
  },
  {
    id: 'sp_aditya',
    userId: 'u_student_aditya',
    fullName: 'Aditya Kulkarni',
    email: 'aditya.kulkarni@college.edu',
    phone: '+91 98765 55443',
    location: 'Pune, Maharashtra',
    university: 'National Institute of Technology',
    degree: 'B.Tech',
    department: 'Department of Mechanical Engineering',
    branchId: 'b_mech',
    specialization: 'Thermal & Manufacturing',
    academicYear: 'Final Year (4th)',
    semester: 7,
    cgpa: 6.4,
    graduationYear: 2027,
    careerGoal: 'Mechanical Design Engineer',
    preferredLocation: 'Pune',
    preferredWorkMode: 'On-site',
    bio: 'Undergraduate mechanical student seeking to upgrade 3D modeling and FEA design skills.'
  },
  {
    id: 'sp_sneha',
    userId: 'u_student_sneha',
    fullName: 'Sneha Deshmukh',
    email: 'sneha.deshmukh@college.edu',
    phone: '+91 98765 99887',
    location: 'Mumbai, Maharashtra',
    university: 'National Institute of Technology',
    degree: 'B.Tech',
    department: 'Department of Mechanical Engineering',
    branchId: 'b_mech',
    specialization: 'Mechatronics & Robotics',
    academicYear: 'Final Year (4th)',
    semester: 7,
    cgpa: 8.7,
    graduationYear: 2027,
    careerGoal: 'Mechanical Design Engineer',
    preferredLocation: 'Pune / Bengaluru',
    preferredWorkMode: 'Hybrid',
    bio: 'High-performing mechanical senior with multiple verified CAD certifications and EV chassis projects.'
  },
  {
    id: 'sp_priya',
    userId: 'u_student_new',
    fullName: 'Priya Patel',
    email: 'priya.patel@college.edu',
    phone: '+91 98765 11223',
    location: 'Bengaluru, Karnataka',
    university: 'National Institute of Technology',
    degree: 'B.Tech',
    department: 'Computer Science and Engineering',
    branchId: 'b_cse',
    specialization: 'Data Engineering & Cloud',
    academicYear: 'Final Year (4th)',
    semester: 7,
    cgpa: 8.5,
    graduationYear: 2027,
    careerGoal: 'Data Analyst',
    preferredLocation: 'Bengaluru / Hyderabad',
    preferredWorkMode: 'Hybrid',
    bio: 'Computer science major specializing in analytical SQL, Python data pipelines, and dashboard development.'
  },
  {
    id: 'sp_rohan',
    userId: 'u_student_rohan',
    fullName: 'Rohan Gupta',
    email: 'rohan.gupta@college.edu',
    phone: '+91 98765 33445',
    location: 'Delhi NCR',
    university: 'National Institute of Technology',
    degree: 'B.Tech',
    department: 'Computer Science and Engineering',
    branchId: 'b_cse',
    specialization: 'Software Development',
    academicYear: 'Final Year (4th)',
    semester: 7,
    cgpa: 6.2,
    graduationYear: 2027,
    careerGoal: 'Software Developer',
    preferredLocation: 'Delhi / Bengaluru',
    preferredWorkMode: 'Remote',
    bio: 'CSE student working through programming fundamentals and data structures.'
  },
  {
    id: 'sp_ananya',
    userId: 'u_student_ananya',
    fullName: 'Ananya Sen',
    email: 'ananya.sen@college.edu',
    phone: '+91 98765 77665',
    location: 'Chennai, Tamil Nadu',
    university: 'National Institute of Technology',
    degree: 'B.Tech',
    department: 'Electronics and Communication Engineering',
    branchId: 'b_ece',
    specialization: 'Embedded Systems & IoT',
    academicYear: 'Final Year (4th)',
    semester: 7,
    cgpa: 7.9,
    graduationYear: 2027,
    careerGoal: 'Embedded Systems Engineer',
    preferredLocation: 'Bengaluru / Chennai',
    preferredWorkMode: 'On-site',
    bio: 'Electronics enthusiast experienced in ARM microcontrollers, embedded C, and hardware sensor integration.'
  },
  {
    id: 'sp_vikram',
    userId: 'u_student_vikram',
    fullName: 'Vikram Rao',
    email: 'vikram.rao@college.edu',
    phone: '+91 98765 22334',
    location: 'Hyderabad, Telangana',
    university: 'National Institute of Technology',
    degree: 'B.Tech',
    department: 'Civil Engineering',
    branchId: 'b_civil',
    specialization: 'Structural Engineering',
    academicYear: 'Final Year (4th)',
    semester: 7,
    cgpa: 7.7,
    graduationYear: 2027,
    careerGoal: 'Structural Engineer',
    preferredLocation: 'Hyderabad / Bengaluru',
    preferredWorkMode: 'On-site',
    bio: 'Civil engineering undergraduate focusing on structural analysis, RCC detailing, and AutoCAD architectural plans.'
  }
];

export const INITIAL_STUDENT_SKILLS: StudentSkill[] = [
  // Rahul Sharma (Mechanical)
  { id: 'ssk_1', studentId: 'sp_rahul', skillId: 'sk_autocad', proficiency: 'Advanced', verified: true },
  { id: 'ssk_2', studentId: 'sp_rahul', skillId: 'sk_solidworks', proficiency: 'Intermediate', verified: true },
  { id: 'ssk_3', studentId: 'sp_rahul', skillId: 'sk_mfg', proficiency: 'Intermediate', verified: false },

  // Aditya Kulkarni (Mechanical - Needs Prep)
  { id: 'ssk_4', studentId: 'sp_aditya', skillId: 'sk_autocad', proficiency: 'Beginner', verified: true },

  // Sneha Deshmukh (Mechanical - Strong)
  { id: 'ssk_5', studentId: 'sp_sneha', skillId: 'sk_solidworks', proficiency: 'Advanced', verified: true },
  { id: 'ssk_6', studentId: 'sp_sneha', skillId: 'sk_autocad', proficiency: 'Advanced', verified: true },
  { id: 'ssk_7', studentId: 'sp_sneha', skillId: 'sk_ansys', proficiency: 'Intermediate', verified: true },
  { id: 'ssk_8', studentId: 'sp_sneha', skillId: 'sk_gdt', proficiency: 'Intermediate', verified: true },
  { id: 'ssk_9', studentId: 'sp_sneha', skillId: 'sk_mfg', proficiency: 'Advanced', verified: true },

  // Priya Patel (CSE)
  { id: 'ssk_10', studentId: 'sp_priya', skillId: 'sk_sql', proficiency: 'Advanced', verified: true },
  { id: 'ssk_11', studentId: 'sp_priya', skillId: 'sk_python', proficiency: 'Advanced', verified: true },
  { id: 'ssk_12', studentId: 'sp_priya', skillId: 'sk_powerbi', proficiency: 'Intermediate', verified: true },
  { id: 'ssk_13', studentId: 'sp_priya', skillId: 'sk_pandas', proficiency: 'Advanced', verified: true },

  // Rohan Gupta (CSE - High Risk)
  { id: 'ssk_14', studentId: 'sp_rohan', skillId: 'sk_c', proficiency: 'Intermediate', verified: true },

  // Ananya Sen (ECE)
  { id: 'ssk_15', studentId: 'sp_ananya', skillId: 'sk_embedded_c', proficiency: 'Advanced', verified: true },
  { id: 'ssk_16', studentId: 'sp_ananya', skillId: 'sk_c', proficiency: 'Advanced', verified: true },
  { id: 'ssk_17', studentId: 'sp_ananya', skillId: 'sk_arduino', proficiency: 'Intermediate', verified: true },

  // Vikram Rao (Civil)
  { id: 'ssk_18', studentId: 'sp_vikram', skillId: 'sk_autocad', proficiency: 'Advanced', verified: true },
  { id: 'ssk_19', studentId: 'sp_vikram', skillId: 'sk_concretestruct', proficiency: 'Intermediate', verified: true }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_1',
    studentId: 'sp_rahul',
    title: 'Design & Analysis of Quadcopter Chassis',
    description: 'Engineered a lightweight carbon-fiber and 3D printed drone frame with optimized motor mounts and stress distribution.',
    technologies: ['SolidWorks', 'ANSYS FEA', '3D Printing'],
    skillsUsed: ['sk_solidworks', 'sk_mfg'],
    role: 'Lead CAD Designer',
    projectLink: 'https://github.com/rahul/drone-cad-model'
  },
  {
    id: 'proj_2',
    studentId: 'sp_rahul',
    title: 'Automated Pneumatic Stamping Mechanism',
    description: 'Designed pneumatic actuator sequencing circuit and fabricated prototype sheet metal die for small-part stamping.',
    technologies: ['AutoCAD', 'Pneumatics', 'Manufacturing'],
    skillsUsed: ['sk_autocad', 'sk_mfg'],
    role: 'Mechanical Fabricator',
    projectLink: 'https://github.com/rahul/pneumatic-stamping'
  },
  {
    id: 'proj_3',
    studentId: 'sp_sneha',
    title: 'Formula Student Electric Vehicle Monocoque Chassis',
    description: 'CAD topology optimization and impact FEA crashworthiness simulation for national student racing competition.',
    technologies: ['SolidWorks', 'ANSYS Workbench', 'Carbon Fiber Composite'],
    skillsUsed: ['sk_solidworks', 'sk_ansys', 'sk_gdt'],
    role: 'Chassis Lead',
    projectLink: 'https://github.com/sneha/ev-monocoque'
  },
  {
    id: 'proj_4',
    studentId: 'sp_priya',
    title: 'Healthcare Patient Analytics & Readmission Dashboard',
    description: 'Processed 50,000+ hospital records via Python/Pandas, built predictive SQL models, and rendered Power BI executive views.',
    technologies: ['SQL', 'Python', 'Power BI'],
    skillsUsed: ['sk_sql', 'sk_python', 'sk_powerbi'],
    role: 'Data Analyst',
    projectLink: 'https://github.com/priya/health-data-pipeline'
  },
  {
    id: 'proj_5',
    studentId: 'sp_ananya',
    title: 'Smart Agri-Telemetry with LoRaWAN & ESP32',
    description: 'Low-power wireless soil moisture and weather monitoring mesh node transmitting to cloud gateway.',
    technologies: ['Embedded C', 'FreeRTOS', 'KiCAD'],
    skillsUsed: ['sk_embedded_c', 'sk_arduino'],
    role: 'Firmware Engineer',
    projectLink: 'https://github.com/ananya/agri-telemetry'
  }
];

export const INITIAL_CERTIFICATIONS: Certification[] = [
  {
    id: 'cert_1',
    studentId: 'sp_rahul',
    name: 'CSWA - Certified SOLIDWORKS Associate in Mechanical Design',
    provider: 'Dassault Systèmes',
    issueDate: '2025-11-10',
    credentialLink: 'https://virtualtester.com/cswa-verify'
  },
  {
    id: 'cert_2',
    studentId: 'sp_sneha',
    name: 'CSWP - Certified SOLIDWORKS Professional in Mechanical Design',
    provider: 'Dassault Systèmes',
    issueDate: '2026-03-15',
    credentialLink: 'https://virtualtester.com/cswp-verify'
  },
  {
    id: 'cert_3',
    studentId: 'sp_priya',
    name: 'Microsoft Certified: Power BI Data Analyst Associate',
    provider: 'Microsoft',
    issueDate: '2026-02-20',
    credentialLink: 'https://learn.microsoft.com/cert/pbi'
  }
];

export const INITIAL_ASSESSMENT_ATTEMPTS: AssessmentAttempt[] = [
  {
    id: 'att_1',
    studentId: 'sp_rahul',
    category: 'Technical',
    scorePercentage: 75,
    totalQuestions: 4,
    correctCount: 3,
    completedAt: '2026-08-28T14:30:00Z'
  },
  {
    id: 'att_2',
    studentId: 'sp_rahul',
    category: 'Aptitude',
    scorePercentage: 75,
    totalQuestions: 4,
    correctCount: 3,
    completedAt: '2026-08-29T16:00:00Z'
  },
  {
    id: 'att_3',
    studentId: 'sp_sneha',
    category: 'Technical',
    scorePercentage: 90,
    totalQuestions: 4,
    correctCount: 4,
    completedAt: '2026-08-30T10:00:00Z'
  },
  {
    id: 'att_4',
    studentId: 'sp_aditya',
    category: 'Technical',
    scorePercentage: 45,
    totalQuestions: 4,
    correctCount: 2,
    completedAt: '2026-09-02T11:00:00Z'
  },
  {
    id: 'att_5',
    studentId: 'sp_priya',
    category: 'Technical',
    scorePercentage: 88,
    totalQuestions: 4,
    correctCount: 4,
    completedAt: '2026-09-01T15:00:00Z'
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app_1',
    opportunityId: 'opp_lnt_intern',
    studentId: 'sp_rahul',
    status: 'Under Review',
    appliedAt: '2026-08-25T11:00:00Z',
    updatedAt: '2026-08-26T09:30:00Z',
    notes: 'Strong foundation in SolidWorks and AutoCAD. Portfolio links verified.',
    matchScoreAtApply: 88
  },
  {
    id: 'app_2',
    opportunityId: 'opp_tata_mech',
    studentId: 'sp_sneha',
    status: 'Selected',
    appliedAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-09-02T16:00:00Z',
    notes: 'Exceptional candidate. Completed CSWP and Formula Student chassis lead experience. Selected for ₹7.5 LPA GET offer.',
    matchScoreAtApply: 96
  },
  {
    id: 'app_3',
    opportunityId: 'opp_infosys_data',
    studentId: 'sp_priya',
    status: 'Shortlisted',
    appliedAt: '2026-08-28T14:00:00Z',
    updatedAt: '2026-09-03T11:00:00Z',
    notes: 'Interview scheduled for Data Analytics role.',
    matchScoreAtApply: 92
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    userId: 'u_student_1',
    title: 'Application Received',
    message: 'L&T Technology Services received your application for CAD Modeling & Simulation Intern.',
    date: '2026-08-25T11:00:00Z',
    read: true,
    type: 'application'
  },
  {
    id: 'notif_2',
    userId: 'u_student_1',
    title: 'Faculty Recommendation',
    message: 'Prof. Arvind Verma recommended the course "ANSYS FEA Structural & Thermal Simulation" for you.',
    date: '2026-09-04T10:30:00Z',
    read: false,
    type: 'recommendation'
  }
];

export const INITIAL_PLACEMENT_DRIVES: PlacementDrive[] = [
  {
    id: 'pd_1',
    placementOfficerId: 'u_placement',
    company: 'Tata Motors Limited',
    role: 'Graduate Engineer Trainee (GET) - Design & R&D',
    eligibleBranchIds: ['b_mech', 'b_auto', 'b_mechatronics', 'b_prod'],
    minCGPA: 7.0,
    deadline: '2026-10-30',
    driveDate: '2026-11-05',
    packageDetails: '₹7.5 LPA CTC',
    status: 'Upcoming',
    createdAt: '2026-08-20T09:00:00Z'
  },
  {
    id: 'pd_2',
    placementOfficerId: 'u_placement',
    company: 'Schneider Electric',
    role: 'Junior Embedded & Firmware Engineer',
    eligibleBranchIds: ['b_ece', 'b_eee', 'b_ice', 'b_mechatronics'],
    minCGPA: 7.2,
    deadline: '2026-11-15',
    driveDate: '2026-11-20',
    packageDetails: '₹8.0 LPA CTC',
    status: 'Upcoming',
    createdAt: '2026-08-22T09:00:00Z'
  },
  {
    id: 'pd_3',
    placementOfficerId: 'u_placement',
    company: 'L&T Technology Services',
    role: 'Mechanical CAE / FEA Simulation Engineer',
    eligibleBranchIds: ['b_mech', 'b_auto'],
    minCGPA: 6.8,
    deadline: '2026-11-25',
    driveDate: '2026-12-02',
    packageDetails: '₹6.8 LPA CTC',
    status: 'Upcoming',
    createdAt: '2026-08-25T10:00:00Z'
  }
];

// --- COURSES & CERTIFICATIONS CATALOG ---
export const INITIAL_COURSES: CourseItem[] = [
  {
    id: 'crs_ansys_fea',
    title: 'ANSYS FEA Structural & Thermal Simulation Mastery',
    provider: 'NPTEL / IIT Madras',
    type: 'Certification',
    branchIds: ['b_mech', 'b_auto', 'b_prod', 'b_civil'],
    skillsTaught: ['ANSYS FEA', 'SolidWorks', 'Thermodynamics & Heat Transfer'],
    duration: '8 Weeks (Self-paced)',
    level: 'Intermediate',
    rating: 4.8,
    description: 'Master finite element formulation, mesh convergence, linear static stress analysis, modal frequency extraction, and thermal conduction in mechanical assemblies.',
    link: 'https://nptel.ac.in/courses/ansys'
  },
  {
    id: 'crs_cswp_solidworks',
    title: 'Certified SOLIDWORKS Professional (CSWP) Preparation',
    provider: 'Dassault Systèmes',
    type: 'Certification',
    branchIds: ['b_mech', 'b_auto', 'b_mechatronics', 'b_prod', 'b_mfg'],
    skillsTaught: ['SolidWorks', 'GD&T (Geometric Dimensioning)', 'Manufacturing Processes'],
    duration: '6 Weeks',
    level: 'Advanced',
    rating: 4.9,
    description: 'Comprehensive preparation for CSWP. Learn complex parametric part editing, multi-body modeling, configuration management, and advanced assembly mates.',
    link: 'https://virtualtester.com/cswp'
  },
  {
    id: 'crs_python_data',
    title: 'Python for Data Science, AI & Development',
    provider: 'Coursera / IBM',
    type: 'Course',
    branchIds: ['b_cse', 'b_it', 'b_ds', 'b_aids', 'b_mech', 'b_ece', 'b_bca'],
    skillsTaught: ['Python', 'Pandas & NumPy', 'SQL'],
    duration: '5 Weeks (10 hrs/wk)',
    level: 'Beginner',
    rating: 4.7,
    description: 'Learn foundational Python programming, data structures, REST APIs, web scraping, and NumPy/Pandas analysis for engineering & analytics domains.',
    link: 'https://coursera.org/learn/python-for-data-science'
  },
  {
    id: 'crs_powerbi_analytics',
    title: 'Microsoft Power BI Data Analyst Professional Certificate',
    provider: 'Microsoft Learn',
    type: 'Certification',
    branchIds: ['b_cse', 'b_it', 'b_ds', 'b_mech', 'b_bba', 'b_bca'],
    skillsTaught: ['Power BI', 'SQL', 'Advanced Excel'],
    duration: '4 Weeks',
    level: 'Intermediate',
    rating: 4.8,
    description: 'Transform, model, and visualize data using Power BI desktop, DAX measures, relational data schemas, and interactive business intelligence reporting.',
    link: 'https://learn.microsoft.com/certifications/power-bi-data-analyst/'
  },
  {
    id: 'crs_gdt_asme',
    title: 'Geometric Dimensioning & Tolerancing (GD&T) to ASME Y14.5',
    provider: 'Udemy / SAE International',
    type: 'Course',
    branchIds: ['b_mech', 'b_auto', 'b_prod', 'b_mfg'],
    skillsTaught: ['GD&T (Geometric Dimensioning)', 'AutoCAD', 'Manufacturing Processes'],
    duration: '3 Weeks',
    level: 'Intermediate',
    rating: 4.6,
    description: 'Practical guide to datum reference frames, position tolerancing, runout, profile tolerances, and bonus tolerance calculation for production drawings.',
    link: 'https://udemy.com/course/geometric-dimensioning-and-tolerancing'
  },
  {
    id: 'crs_plc_scada',
    title: 'Industrial Automation: PLC & SCADA Programming',
    provider: 'NPTEL / IIT Kharagpur',
    type: 'Learning Program',
    branchIds: ['b_eee', 'b_ee', 'b_mechatronics', 'b_mech', 'b_ice'],
    skillsTaught: ['PLC & SCADA', 'Arduino & Microcontrollers'],
    duration: '12 Weeks',
    level: 'Intermediate',
    rating: 4.7,
    description: 'Hardware architecture of PLCs, Ladder logic, timer/counter instructions, HMI design, and supervisory control for factory automation lines.',
    link: 'https://nptel.ac.in/courses/automation'
  },
  {
    id: 'crs_arm_embedded',
    title: 'Embedded Firmware Engineering on ARM Cortex-M',
    provider: 'edX / Arm Education',
    type: 'Certification',
    branchIds: ['b_ece', 'b_eee', 'b_iot', 'b_mechatronics'],
    skillsTaught: ['Embedded C', 'C Language', 'Arduino & Microcontrollers'],
    duration: '10 Weeks',
    level: 'Advanced',
    rating: 4.9,
    description: 'Bare-metal programming of ARM Cortex-M processors, peripheral drivers (UART, I2C, SPI), memory mapping, interrupts, and FreeRTOS tasks.',
    link: 'https://edx.org/course/arm-embedded-systems'
  },
  {
    id: 'crs_revit_bim',
    title: 'Autodesk Revit BIM Architecture & Structural Detailing',
    provider: 'Autodesk Authorized Academy',
    type: 'Course',
    branchIds: ['b_civil', 'b_struct', 'b_const'],
    skillsTaught: ['Autodesk Revit (BIM)', 'AutoCAD'],
    duration: '6 Weeks',
    level: 'Beginner',
    rating: 4.6,
    description: 'Design comprehensive building information models (BIM), 3D structural frames, parametric reinforcement schedules, and architectural construction sheets.',
    link: 'https://autodesk.com/certification/revit'
  },
  {
    id: 'crs_fullstack_cloud',
    title: 'Modern Full-Stack Development with TypeScript & Docker',
    provider: 'AWS Academy / freeCodeCamp',
    type: 'Certification',
    branchIds: ['b_cse', 'b_it', 'b_bca', 'b_mca', 'b_aiml'],
    skillsTaught: ['TypeScript', 'JavaScript', 'Git & GitHub', 'Docker', 'SQL'],
    duration: '8 Weeks',
    level: 'Intermediate',
    rating: 4.8,
    description: 'Full-stack software engineering including responsive frontends, RESTful backend APIs, containerization with Docker, and Git branching workflows.',
    link: 'https://aws.amazon.com/training/'
  },
  {
    id: 'crs_deeplearning_pytorch',
    title: 'Deep Learning Specialization with PyTorch',
    provider: 'DeepLearning.AI',
    type: 'Certification',
    branchIds: ['b_ai', 'b_aiml', 'b_ds', 'b_cse', 'b_aids'],
    skillsTaught: ['Machine Learning', 'PyTorch', 'Python', 'Pandas & NumPy'],
    duration: '10 Weeks',
    level: 'Advanced',
    rating: 4.9,
    description: 'Build neural network architectures, convolutional networks for computer vision, sequence models with transformers, and PyTorch deployment workflows.',
    link: 'https://deeplearning.ai/courses/'
  },
  {
    id: 'crs_staad_pro',
    title: 'STAAD.Pro Structural Analysis & Concrete Design',
    provider: 'Bentley Institute',
    type: 'Learning Program',
    branchIds: ['b_civil', 'b_struct', 'b_const'],
    skillsTaught: ['STAAD.Pro', 'Concrete Technology', 'AutoCAD'],
    duration: '6 Weeks',
    level: 'Intermediate',
    rating: 4.7,
    description: 'Model and analyze multi-storey RCC frames, shear walls, wind and seismic loading according to Indian and international building standard codes.',
    link: 'https://bentley.com/learn/staad'
  },
  {
    id: 'crs_vlsi_verilog',
    title: 'Digital Systems & Verilog HDL FPGA Design',
    provider: 'IEEE Blended Learning',
    type: 'Certification',
    branchIds: ['b_ece', 'b_vlsi', 'b_ee'],
    skillsTaught: ['Verilog / VHDL', 'C Language'],
    duration: '8 Weeks',
    level: 'Intermediate',
    rating: 4.7,
    description: 'Combinational and sequential logic design, finite state machines (FSM), testbenches, and synthesis targeted to modern Xilinx FPGA architectures.',
    link: 'https://ieee.org/education/verilog'
  }
];

// Student course enrollments (track progress)
export const INITIAL_STUDENT_COURSE_PROGRESS: StudentCourseProgress[] = [
  {
    id: 'enr_1',
    studentId: 'sp_rahul',
    courseId: 'crs_cswp_solidworks',
    status: 'In Progress',
    updatedAt: '2026-08-30T10:00:00Z'
  },
  {
    id: 'enr_2',
    studentId: 'sp_rahul',
    courseId: 'crs_ansys_fea',
    status: 'Interested',
    recommendedByFaculty: true,
    facultyName: 'Prof. Arvind Verma',
    facultyReason: 'Mastering ANSYS Structural FEA is key for upcoming Tata Motors and L&T R&D design placement drives.',
    updatedAt: '2026-09-04T10:30:00Z'
  }
];

// --- HACKATHONS CATALOG ---
export const INITIAL_HACKATHONS: Hackathon[] = [
  {
    id: 'hk_sih_2026',
    name: 'Smart India Hackathon (SIH) 2026',
    organizer: 'Ministry of Education & AICTE',
    theme: 'Smart Automation & National Problem Statements',
    description: 'India largest open innovation hackathon solving real-world challenges posed by ministries, departments, and leading industries.',
    eligibleBranches: ['All'],
    requiredSkills: ['Python', 'SQL', 'AutoCAD', 'SolidWorks', 'Embedded C', 'IoT'],
    registrationDeadline: '2026-10-15',
    eventDate: '2026-11-20 to 2026-11-22',
    mode: 'Hybrid',
    teamRequirement: '6 Members (Min 1 female member required)',
    prizePool: '₹1,00,000 per problem statement',
    registrationLink: 'https://sih.gov.in'
  },
  {
    id: 'hk_ev_mobility',
    name: 'National EV Mobility & Design Innovation Sprint',
    organizer: 'Society of Automotive Engineers (SAE)',
    theme: 'Electric Vehicles & Powertrain Optimization',
    description: 'Design innovative battery thermal management systems, regenerative braking mechanisms, or aerodynamic chassis components for light commercial EVs.',
    eligibleBranches: ['b_mech', 'b_auto', 'b_mechatronics', 'b_eee', 'b_ece'],
    requiredSkills: ['SolidWorks', 'AutoCAD', 'Manufacturing Processes', 'ANSYS FEA'],
    registrationDeadline: '2026-10-28',
    eventDate: '2026-11-12 to 2026-11-14',
    mode: 'Online',
    teamRequirement: '2-4 Members',
    prizePool: '₹2,50,000 + Paid Internships',
    registrationLink: 'https://saeindia.org/ev-sprint'
  },
  {
    id: 'hk_ai_analytics',
    name: 'National AI & Cloud Intelligence Hackathon',
    organizer: 'Google Cloud & AWS Educate',
    theme: 'Predictive Analytics & Generative AI Solutions',
    description: 'Build end-to-end data pipelines, multimodal GenAI prototypes, or automated enterprise dashboards solving urban governance bottlenecks.',
    eligibleBranches: ['b_cse', 'b_it', 'b_ds', 'b_ai', 'b_aiml', 'b_aids', 'b_ece'],
    requiredSkills: ['Python', 'SQL', 'Power BI', 'AWS', 'Docker'],
    registrationDeadline: '2026-11-05',
    eventDate: '2026-11-18 to 2026-11-19',
    mode: 'Online',
    teamRequirement: 'Solo or Team of up to 4',
    prizePool: '₹3,00,000 + Cloud Credits',
    registrationLink: 'https://cloudhackathon.org'
  },
  {
    id: 'hk_sustainable_infra',
    name: 'Eco-Structure Sustainable Infrastructure Hackathon',
    organizer: 'Indian Green Building Council (IGBC)',
    theme: 'Green Buildings & Seismic Structural Resiliency',
    description: 'Model zero-energy structures, sustainable composite concrete mixes, and BIM structural frameworks using circular building economy principles.',
    eligibleBranches: ['b_civil', 'b_struct', 'b_env', 'b_const'],
    requiredSkills: ['AutoCAD', 'Autodesk Revit (BIM)', 'STAAD.Pro'],
    registrationDeadline: '2026-11-10',
    eventDate: '2026-11-28 to 2026-11-29',
    mode: 'Hybrid',
    teamRequirement: '3-5 Members',
    prizePool: '₹1,50,000',
    registrationLink: 'https://igbc.in/hackathon'
  }
];

export const INITIAL_HACKATHON_REGISTRATIONS: HackathonRegistration[] = [
  {
    id: 'reg_1',
    hackathonId: 'hk_ev_mobility',
    studentId: 'sp_rahul',
    status: 'Applied',
    appliedAt: '2026-09-01T14:00:00Z',
    teamName: 'AeroTorque Racing'
  }
];

// --- PLACEMENT CAMPAIGNS ---
export const INITIAL_PLACEMENT_CAMPAIGNS: PlacementCampaign[] = [
  {
    id: 'camp_core_mech_2027',
    name: 'Core Engineering & Automotive Recruitment Drive Prep 2027',
    targetBranchIds: ['b_mech', 'b_auto', 'b_mechatronics', 'b_prod'],
    targetBatch: '2027',
    targetRoles: ['Mechanical Design Engineer', 'CAE Simulation Trainee'],
    startDate: '2026-09-01',
    endDate: '2026-10-25',
    assignedStudentIds: ['sp_rahul', 'sp_aditya', 'sp_sneha'],
    createdAt: '2026-08-28T09:00:00Z',
    activities: [
      {
        id: 'act_1',
        title: 'Core Mechanical CAD & GD&T Technical Benchmark',
        type: 'Technical Assessment',
        description: '45-minute timed test on SolidWorks parametric features, assembly fits, and tolerance stack-up.',
        deadline: '2026-09-15'
      },
      {
        id: 'act_2',
        title: 'Quantitative & Mechanical Aptitude Fast-Track',
        type: 'Aptitude Training',
        description: 'Gear ratios, hydraulic principles, work-rate problems, and spatial reasoning workshop.',
        deadline: '2026-09-22'
      },
      {
        id: 'act_3',
        title: 'Technical Portfolio & CAD Drawing Review',
        type: 'Resume Review',
        description: '1-on-1 placement officer review of student engineering project links and CAD portfolio rendering.',
        deadline: '2026-10-05'
      },
      {
        id: 'act_4',
        title: 'Simulated Industry Technical & HR Interview',
        type: 'Mock Interview',
        description: '30-minute mock interview panel evaluating stress tolerance explanations and behavioral questions.',
        deadline: '2026-10-18'
      }
    ]
  },
  {
    id: 'camp_it_data_2027',
    name: 'Campus IT, Analytics & Software Developer Bootcamp 2027',
    targetBranchIds: ['b_cse', 'b_it', 'b_ds', 'b_ai'],
    targetBatch: '2027',
    targetRoles: ['Software Developer', 'Data Analyst'],
    startDate: '2026-09-05',
    endDate: '2026-11-10',
    assignedStudentIds: ['sp_priya', 'sp_rohan'],
    createdAt: '2026-09-01T10:00:00Z',
    activities: [
      {
        id: 'act_it_1',
        title: 'SQL Complex Joins & Python Data Wrangling Assessment',
        type: 'Technical Assessment',
        description: 'Live coding assessment evaluating relational database querying and Pandas data transformations.',
        deadline: '2026-09-20'
      },
      {
        id: 'act_it_2',
        title: 'Data Structures & Algorithmic Problem Solving',
        type: 'Coding Practice',
        description: 'Daily practice problem sets covering arrays, hash maps, binary trees, and dynamic programming.',
        deadline: '2026-10-01'
      }
    ]
  }
];

export const INITIAL_FACULTY_RECOMMENDATIONS: FacultyRecommendation[] = [
  {
    id: 'rec_1',
    facultyId: 'u_faculty',
    facultyName: 'Prof. Arvind Verma',
    studentId: 'sp_rahul',
    recommendedSkill: 'ANSYS FEA',
    recommendedLearningArea: 'Structural FEA Simulation',
    courseOrCertName: 'ANSYS FEA Structural & Thermal Simulation Mastery',
    type: 'Certification',
    reason: 'Mastering ANSYS Structural FEA is key for upcoming Tata Motors and L&T R&D design placement drives.',
    createdAt: '2026-09-04T10:30:00Z'
  },
  {
    id: 'rec_2',
    facultyId: 'u_faculty',
    facultyName: 'Prof. Arvind Verma',
    studentId: 'sp_aditya',
    recommendedSkill: 'SolidWorks',
    recommendedLearningArea: 'Parametric 3D Modeling',
    courseOrCertName: 'Certified SOLIDWORKS Professional (CSWP) Preparation',
    type: 'Course',
    reason: 'Aditya needs structured hands-on modeling practice to prepare for upcoming campus design placements.',
    createdAt: '2026-09-05T11:00:00Z'
  }
];

