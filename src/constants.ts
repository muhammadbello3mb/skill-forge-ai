import type { Trade, InterviewMessage, UserProfile, Evidence, Opportunity } from './types';

export const BRAND_NAME = 'SkillProof AI';
export const BRAND_TAGLINE = "Making Nigeria's Invisible Skills Visible";
export const CONTACT_EMAIL = 'hello@skillproof.ai';

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'pcm', label: 'Pidgin' },
  { code: 'yo', label: 'Yoruba' },
  { code: 'ig', label: 'Igbo' },
  { code: 'ha', label: 'Hausa' },
];

export const TRADES: Trade[] = [
  {
    id: 'fashion',
    name: 'Fashion Design & Tailoring',
    icon: 'Scissors',
    description: 'Traditional and modern garment making, pattern drafting, and textile design.',
    skills: [
      { id: 'f1', name: 'Pattern Drafting', level: 'advanced', verified: true, category: 'Technical' },
      { id: 'f2', name: 'Garment Construction', level: 'advanced', verified: true, category: 'Technical' },
      { id: 'f3', name: 'Textile Knowledge', level: 'intermediate', verified: false, category: 'Technical' },
      { id: 'f4', name: 'Customer Relations', level: 'advanced', verified: true, category: 'Soft Skills' },
      { id: 'f5', name: 'Inventory Management', level: 'intermediate', verified: false, category: 'Business' },
    ],
  },
  {
    id: 'auto',
    name: 'Automotive Diagnostics & Repair',
    icon: 'Wrench',
    description: 'Vehicle diagnostics, engine repair, electrical systems, and maintenance.',
    skills: [
      { id: 'a1', name: 'Engine Diagnostics', level: 'advanced', verified: true, category: 'Technical' },
      { id: 'a2', name: 'Brake Systems', level: 'advanced', verified: true, category: 'Technical' },
      { id: 'a3', name: 'Electrical Systems', level: 'intermediate', verified: false, category: 'Technical' },
      { id: 'a4', name: 'Customer Service', level: 'intermediate', verified: true, category: 'Soft Skills' },
      { id: 'a5', name: 'Parts Sourcing', level: 'advanced', verified: true, category: 'Business' },
    ],
  },
  {
    id: 'catering',
    name: 'Catering & Pastry Arts',
    icon: 'ChefHat',
    description: 'Professional cooking, baking, event catering, and kitchen management.',
    skills: [
      { id: 'c1', name: 'Culinary Techniques', level: 'advanced', verified: true, category: 'Technical' },
      { id: 'c2', name: 'Pastry & Baking', level: 'intermediate', verified: true, category: 'Technical' },
      { id: 'c3', name: 'Menu Planning', level: 'intermediate', verified: false, category: 'Business' },
      { id: 'c4', name: 'Food Safety', level: 'advanced', verified: true, category: 'Technical' },
      { id: 'c5', name: 'Event Coordination', level: 'intermediate', verified: false, category: 'Soft Skills' },
    ],
  },
  {
    id: 'repair',
    name: 'Phone & Laptop Repair',
    icon: 'Smartphone',
    description: 'Mobile device and computer hardware repair, software troubleshooting, and data recovery.',
    skills: [
      { id: 'r1', name: 'Hardware Repair', level: 'advanced', verified: true, category: 'Technical' },
      { id: 'r2', name: 'Software Troubleshooting', level: 'advanced', verified: true, category: 'Technical' },
      { id: 'r3', name: 'Data Recovery', level: 'intermediate', verified: false, category: 'Technical' },
      { id: 'r4', name: 'Customer Communication', level: 'intermediate', verified: true, category: 'Soft Skills' },
      { id: 'r5', name: 'Spare Parts Management', level: 'intermediate', verified: false, category: 'Business' },
    ],
  },
  {
    id: 'building',
    name: 'Building & Construction',
    icon: 'HardHat',
    description: 'Masonry, carpentry, tiling, plumbing, and general construction.',
    skills: [
      { id: 'b1', name: 'Masonry', level: 'advanced', verified: true, category: 'Technical' },
      { id: 'b2', name: 'Carpentry', level: 'intermediate', verified: true, category: 'Technical' },
      { id: 'b3', name: 'Tiling & Finishing', level: 'advanced', verified: true, category: 'Technical' },
      { id: 'b4', name: 'Project Estimation', level: 'intermediate', verified: false, category: 'Business' },
      { id: 'b5', name: 'Team Leadership', level: 'intermediate', verified: false, category: 'Soft Skills' },
    ],
  },
  {
    id: 'beauty',
    name: 'Hair & Beauty',
    icon: 'Sparkles',
    description: 'Hair styling, braiding, makeup artistry, and skincare services.',
    skills: [
      { id: 'h1', name: 'Hair Styling & Braiding', level: 'advanced', verified: true, category: 'Technical' },
      { id: 'h2', name: 'Makeup Artistry', level: 'intermediate', verified: true, category: 'Technical' },
      { id: 'h3', name: 'Skincare Knowledge', level: 'intermediate', verified: false, category: 'Technical' },
      { id: 'h4', name: 'Client Relations', level: 'advanced', verified: true, category: 'Soft Skills' },
      { id: 'h5', name: 'Product Management', level: 'beginner', verified: false, category: 'Business' },
    ],
  },
];

export const SAMPLE_USER: UserProfile = {
  name: 'Aliko Yusuf',
  trade: 'Automotive Diagnostics & Repair',
  location: 'Ikeja, Lagos',
  yearsOfExperience: 8,
  bio: 'Master automotive technician specializing in modern engine diagnostics and electrical systems. Passionate about mentoring young mechanics.',
  avatar: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c31cd1f2-9b75-4911-82c2-34612150645f/avatar-male-25d15492-1784613848301.webp',
  skills: [
    { id: 'a1', name: 'Engine Diagnostics', level: 'advanced', verified: true, category: 'Technical' },
    { id: 'a2', name: 'Brake Systems', level: 'advanced', verified: true, category: 'Technical' },
    { id: 'a3', name: 'Electrical Systems', level: 'intermediate', verified: false, category: 'Technical' },
    { id: 'a4', name: 'Customer Service', level: 'intermediate', verified: true, category: 'Soft Skills' },
    { id: 'a5', name: 'Parts Sourcing', level: 'advanced', verified: true, category: 'Business' },
  ],
  passportCreated: true,
  passportId: 'SP-NG-2024-ALI-001',
  evidence: [
    { id: 'e1', type: 'project', title: 'Complete Engine Overhaul - Toyota Camry', description: 'Full engine rebuild and diagnostic optimization for a 2018 Toyota Camry.', date: '2024-09-15', verified: true },
    { id: 'e2', type: 'reference', title: 'Letter of Recommendation - AutoPro Lagos', description: 'Formal recommendation from workshop manager praising diagnostic expertise.', date: '2024-08-20', verified: true },
    { id: 'e3', type: 'photo', title: 'Workshop Setup', description: 'Professional diagnostic workstation with modern OBD2 scanners.', date: '2024-07-10', verified: false },
  ],
  language: 'en',
};

export const OPPORTUNITIES: Opportunity[] = [
  { id: 'o1', title: 'Advanced Vehicle Diagnostics', provider: 'Toyota Nigeria Training', type: 'course', description: 'Master modern ECU diagnostics and CAN bus systems.', matchScore: 94, location: 'Lagos', link: '#' },
  { id: 'o2', title: 'Lead Mechanic - Lekki Autos', provider: 'Lekki Autos Ltd', type: 'job', description: 'Seeking experienced diagnostic technician for busy workshop.', matchScore: 88, location: 'Lekki, Lagos', link: '#' },
  { id: 'o3', title: 'Business Management for Technicians', provider: 'Enterprise Development Centre', type: 'course', description: 'Learn to run a profitable auto repair business.', matchScore: 82, location: 'Online', link: '#' },
  { id: 'o4', title: 'Mentorship Program', provider: 'NAJA (Nigeria Auto Mechanics Association)', type: 'mentorship', description: 'Get paired with a master technician for 6 months.', matchScore: 76, location: 'Lagos', link: '#' },
  { id: 'o5', title: 'Certified EV Technician', provider: 'Global Auto Institute', type: 'certification', description: 'Specialize in electric vehicle maintenance and repair.', matchScore: 71, location: 'Abuja', link: '#' },
];

export const INTERVIEW_FLOWS: Record<string, InterviewMessage[]> = {
  default: [
    { id: 'g1', role: 'ai', text: "Hello! I’m your SkillProof AI interviewer. Let me help you build your digital passport. What trade would you like to be assessed for?", options: TRADES.map(t => t.name), timestamp: 0 },
    { id: 'g2', role: 'ai', text: 'Great choice! How many years have you been working in this field?', options: ['Less than 1 year', '1-3 years', '4-7 years', '8+ years'], timestamp: 0 },
    { id: 'g3', role: 'ai', text: 'What types of projects or jobs have you handled most recently?', options: ['Simple/Everyday jobs', 'Complex projects', 'Both simple and complex', 'I mostly supervised'], timestamp: 0 },
    { id: 'g4', role: 'ai', text: 'Have you ever trained or mentored anyone in your trade?', options: ['Yes, I have trained others', "No, but I’m interested", "I’m still learning myself", "I’d like to start"], timestamp: 0 },
    { id: 'g5', role: 'ai', text: 'Do you have any formal certifications or training?', options: ['Yes, formal training', 'Apprenticeship only', 'Self-taught', 'Multiple certifications'], timestamp: 0 },
    { id: 'g6', role: 'ai', text: "Excellent! Based on your responses, I’ve identified several skills for your passport. Let’s review them together.", options: ["Let’s see my skills!", 'I want to add more'], timestamp: 0 },
  ],
};

export const NIGERIAN_CITIES = [
  'Ikeja, Lagos', 'Lekki, Lagos', 'Surulere, Lagos', 'Abuja FCT', 'Port Harcourt, Rivers',
  'Ibadan, Oyo', 'Kano, Kano', 'Enugu, Enugu', 'Benin City, Edo', 'Abeokuta, Ogun',
  'Onitsha, Anambra', 'Warri, Delta', 'Jos, Plateau', 'Kaduna, Kaduna', 'Maiduguri, Borno',
];

export const STORAGE_KEYS = {
  USER_PROFILE: 'skillproof_user_profile',
  INTERVIEW_STATE: 'skillproof_interview_state',
  EVIDENCE: 'skillproof_evidence',
};