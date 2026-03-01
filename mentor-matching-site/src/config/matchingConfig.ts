/**
 * MATCHING CONFIGURATION
 * 
 * This file defines all fields used in the mentor-mentee matching algorithm.
 * To add/remove/modify fields, simply update this configuration.
 */

// ============================================
// Career Fields (Question 1)
// ============================================
export const CAREER_FIELDS = [
  'Artificial Intelligence',
  'Computer Science',
  'Cybersecurity',
  'Electrical and Computer Engineering',
  'Materials Science',
  'Robotics'
];

// ============================================
// Technical Interests by Career Field (Question 2)
// Dynamically populated based on Q1 selection
// ============================================
export const TECHNICAL_INTERESTS_MAP: Record<string, string[]> = {
  'Computer Science': [
    '.NET',
    'Java',
    'Python',
    'C#',
    'C++',
    'Operating Systems',
    'Web Development',
    'Mobile Development',
    'Database Systems',
    'Software Engineering',
    'Algorithms & Data Structures',
    'Distributed Systems'
  ],
  'Artificial Intelligence': [
    'Machine Learning',
    'Deep Learning',
    'Natural Language Processing',
    'Computer Vision',
    'Reinforcement Learning',
    'Neural Networks',
    'Data Science',
    'AI Ethics',
    'Robotics AI',
    'Generative AI'
  ],
  'Cybersecurity': [
    'Network Security',
    'Cryptography',
    'Penetration Testing',
    'Security Architecture',
    'Incident Response',
    'Threat Intelligence',
    'Secure Coding',
    'Compliance & Risk',
    'Digital Forensics',
    'Ethical Hacking'
  ],
  'Electrical and Computer Engineering': [
    'Circuit Design',
    'Embedded Systems',
    'Signal Processing',
    'VLSI Design',
    'Control Systems',
    'Power Electronics',
    'Digital Systems',
    'Microcontrollers',
    'RF Engineering',
    'FPGA Design'
  ],
  'Materials Science': [
    'Nanomaterials',
    'Semiconductors',
    'Biomaterials',
    'Composites',
    'Thin Films',
    'Material Characterization',
    'Polymer Science',
    'Metallurgy',
    'Ceramic Materials',
    'Computational Materials'
  ],
  'Robotics': [
    'Robot Design',
    'Computer Vision',
    'Motion Planning',
    'Sensor Integration',
    'ROS (Robot Operating System)',
    'Autonomous Systems',
    'Human-Robot Interaction',
    'Mechanical Design',
    'Control Theory',
    'Path Planning'
  ]
};

// ============================================
// Life Experiences (Question 3)
// ============================================
export const LIFE_EXPERIENCES = [
  'Parent',
  'Caretaker',
  'International Background',
  'English as a second language',
  'LGBTQ+',
  'Racial Minority',
  'Military Service',
  'Career Transition',
  'Entrepreneur',
  'Second Career',
  'Prefer not to share (skip for matching)'
];

// ============================================
// Languages (Question 4)
// ============================================
export const LANGUAGES = [
  'English',
  'Spanish',
  'Mandarin',
  'Portuguese',
  'French',
  'German',
  'Japanese',
  'Korean',
  'Arabic',
  'Hindi',
  'Russian',
  'Italian',
  'Vietnamese',
  'Tagalog',
  'Other'
];

// ============================================
// Mentorship Goals (Public Question)
// ============================================
export const MENTORSHIP_GOALS = [
  'Improve my Resume',
  'Score an Internship',
  'Practice Interview Skills',
  'Find Networking Events',
  'Career Guidance',
  'Technical Skill Development',
  'Research Opportunities',
  'Work-Life Balance',
  'Other'
];

// ============================================
// Weight Priority Options (Question 5)
// Sets default weights based on user's priority
// ============================================
export interface WeightPriorityOption {
  value: string;
  label: string;
  defaultWeights: {
    technicalInterests: number;
    lifeExperiences: number;
    languages: number;
  };
}

export const WEIGHT_PRIORITY_OPTIONS: WeightPriorityOption[] = [
  {
    value: 'technicalInterests',
    label: 'Career & technical interests are most important',
    defaultWeights: { technicalInterests: 5, lifeExperiences: 2, languages: 2 }
  },
  {
    value: 'lifeExperiences',
    label: 'Life experiences are most important',
    defaultWeights: { technicalInterests: 2, lifeExperiences: 5, languages: 2 }
  },
  {
    value: 'languages',
    label: 'Language compatibility is most important',
    defaultWeights: { technicalInterests: 2, lifeExperiences: 2, languages: 5 }
  },
  {
    value: 'equal',
    label: 'All of these are equally important',
    defaultWeights: { technicalInterests: 3, lifeExperiences: 3, languages: 3 }
  }
];

// ============================================
// Helper Functions
// ============================================

/**
 * Get technical interest options based on selected career fields
 */
export function getTechnicalInterestOptions(careerFields: string[]): string[] {
  const allInterests = new Set<string>();
  
  careerFields.forEach(field => {
    const interests = TECHNICAL_INTERESTS_MAP[field] || [];
    interests.forEach(interest => allInterests.add(interest));
  });
  
  return Array.from(allInterests).sort();
}

/**
 * Get all weightable field names
 */
export function getWeightableFields(): string[] {
  return ['technicalInterests', 'lifeExperiences', 'languages'];
}

/**
 * Get default weights based on user's priority selection
 */
export function getDefaultWeights(priority: string) {
  const option = WEIGHT_PRIORITY_OPTIONS.find(opt => opt.value === priority);
  return option ? option.defaultWeights : {
    technicalInterests: 3,
    lifeExperiences: 3,
    languages: 3
  };
}

// ============================================
// Additional Profile Information (Non-matching)
// ============================================

/**
 * College year options for students
 */
export const COLLEGE_YEAR_OPTIONS = [
  'Freshman',
  'Sophomore',
  'Junior',
  'Senior',
  'Masters Candidate',
  'PhD Candidate'
];

/**
 * Racial identity options (optional, if user selected "Racial Minority")
 */
export const RACIAL_IDENTITY_OPTIONS = [
  'African American / Black',
  'Asian / Asian American',
  'Hispanic / Latinx',
  'Native American / Indigenous',
  'Pacific Islander',
  'Middle Eastern / North African',
  'Multiracial',
  'Prefer not to specify'
];
