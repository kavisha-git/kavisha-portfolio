import { useState, useEffect, useRef } from 'react';
import type { FC, FormEvent, ChangeEvent } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import './App.css';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface NavLink {
  id: string;
  label: string;
}

interface StatData {
  icon: string;
  value: number;
  label: string;
  suffix: string;
}

interface Skill {
  name: string;
  percentage: number;
  icon: string;
}

interface SkillCategory {
  programming: Skill[];
  robotics: Skill[];
  tools: Skill[];
}

interface TimelineEntry {
  date: string;
  title: string;
  institution: string;
  description: string;
  images?: string[];
}

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
  featured: boolean;
  github: string | null;
  demo: string | null;
}

interface ProjectFilter {
  id: string;
  label: string;
}



interface ContactInfo {
  icon: string;
  label: string;
  value: string;
  href: string;
}

interface GalleryItem {
  id: number;
  src: string;
  caption: string;
  category: string;
}

// ============================================
// DATA CONSTANTS
// ============================================

const NAV_LINKS: NavLink[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' },
];

const TYPEWRITER_ROLES: string[] = [
  '2nd Year Computer Engineering Undergraduate',
  'Robotics & Embedded Systems Engineer',
  'Computer Vision Developer',
  'Low-Level Systems Programmer',
  'Open Source Builder',
];

const STATS_DATA: StatData[] = [
  { icon: '🚀', value: 10, label: 'Major Projects', suffix: '+' },
  { icon: '💻', value: 6, label: 'Programming Languages', suffix: '+' },
  { icon: '🎓', value: 2, label: 'Year at UoP', suffix: 'nd' },
  { icon: '🏆', value: 2, label: 'Conference Exhibits', suffix: '' },
];

const SKILLS_DATA: SkillCategory = {
  programming: [
    { name: 'C / C++', percentage: 90, icon: '⚡' },
    { name: 'Python', percentage: 85, icon: '🐍' },
    { name: 'JavaScript', percentage: 80, icon: '🌐' },
    { name: 'Assembly (ARM)', percentage: 75, icon: '🔩' },
    { name: 'MATLAB', percentage: 70, icon: '📊' },
    { name: 'Verilog HDL', percentage: 65, icon: '🔲' },
  ],
  robotics: [
    { name: 'Arduino', percentage: 95, icon: '🤖' },
    { name: 'Raspberry Pi', percentage: 90, icon: '🍓' },
    { name: 'ROS2', percentage: 75, icon: '🦾' },
    { name: 'ESP32', percentage: 85, icon: '📡' },
    { name: 'Motor Control', percentage: 80, icon: '⚙️' },
    { name: 'Sensor Integration', percentage: 85, icon: '🔬' },
  ],
  tools: [
    { name: 'Git & GitHub', percentage: 90, icon: '🔀' },
    { name: 'Linux', percentage: 85, icon: '🐧' },
    { name: 'Docker', percentage: 70, icon: '🐳' },
    { name: 'KiCad', percentage: 80, icon: '📐' },
    { name: 'OpenCV', percentage: 85, icon: '👁️' },
    { name: 'TensorFlow', percentage: 75, icon: '🧠' },
  ],
};

const EDUCATION_TIMELINE: TimelineEntry[] = [
  {
    date: 'Semester 3 (Ongoing)',
    title: 'Software Development Project: “Wedak.lk”',
    institution: 'University of Peradeniya',
    description: 'Developing a Sri Lankan Job Marketplace Platform with features like job matching, user profiles, and an employer dashboard.',
  },
  {
    date: 'Semester 3',
    title: 'ICPC Regional Contest',
    institution: 'Organizing Committee Member',
    description: 'Contributed to event coordination and technical/logistical support. Gained exposure to international-level programming contest standards.',
    images: ['./images/events_carousel/icpc/2.jpeg', './images/events_carousel/icpc/1.jpeg', './images/events_carousel/icpc/3.jpeg', './images/events_carousel/icpc/4.jpeg', './images/events_carousel/icpc/5.jpeg', './images/events_carousel/icpc/6.jpeg', './images/events_carousel/icpc/7.jpeg'],
  },
  {
    date: 'Semester 3',
    title: 'MoraXtreme Hackathon',
    institution: 'Competitor',
    description: 'Achieved 4th Place out of ~750 teams. Highlighted skills in competitive programming, problem-solving under pressure, and algorithmic thinking.',
    images: ['./images/events_carousel/moraxtreme/15.jpeg', './images/events_carousel/moraxtreme/6.jpeg', './images/events_carousel/moraxtreme/2.jpeg', './images/events_carousel/moraxtreme/11.jpeg', './images/events_carousel/moraxtreme/4.jpeg', './images/events_carousel/moraxtreme/16.jpeg', './images/events_carousel/moraxtreme/9.jpeg', './images/events_carousel/moraxtreme/13.jpeg', './images/events_carousel/moraxtreme/1.jpeg', './images/events_carousel/moraxtreme/14.jpeg', './images/events_carousel/moraxtreme/5.jpeg', './images/events_carousel/moraxtreme/12.jpeg', './images/events_carousel/moraxtreme/8.jpeg', './images/events_carousel/moraxtreme/3.jpeg', './images/events_carousel/moraxtreme/10.jpeg', './images/events_carousel/moraxtreme/7.jpeg'],
  },
  {
    date: 'Semester 2',
    title: 'Techno ‘25 Engineering Exhibition',
    institution: 'Presenter',
    description: 'Presented engineering projects, gaining valuable public speaking and technical demonstration experience at a major national exhibition.',
    images: ['./images/events_carousel/techno25/1.jpeg', './images/events_carousel/techno25/2.jpeg', './images/events_carousel/techno25/3.jpeg', './images/events_carousel/techno25/4.jpeg', './images/events_carousel/techno25/5.jpeg'],
  },
  {
    date: 'Semester 2',
    title: 'Apollo Guidance Computer (AGC) System',
    institution: 'University of Peradeniya · Engex \'25 Design Project',
    description: 'Built an Apollo Guidance Computer (AGC) Inspired System, focusing on low-level embedded systems and historical computer architecture.',
    images: ['./images/events_carousel/agc/1.jpeg', './images/events_carousel/agc/2.jpeg'],
  },
  {
    date: 'Semester 2',
    title: 'CO2010 – Advanced Projects',
    institution: 'Computer Engineering Department',
    description: 'Developed a 3D Graphics Library and a Mini Compiler using ARM Assembly, deepening knowledge of low-level programming and system architecture.',
  },
  {
    date: 'Semester 2',
    title: 'Department Selection',
    institution: 'Faculty of Engineering',
    description: 'Selected to the highly competitive Computer Engineering Department (100 students in the Peradeniya Intake).',
    images: ['./images/events_carousel/dept_welcome/1.jpeg', './images/events_carousel/dept_welcome/2.jpeg', './images/events_carousel/dept_welcome/3.jpeg'],
  },
  {
    date: 'Semester 1',
    title: 'Foundation Projects',
    institution: 'University of Peradeniya',
    description: 'Developed a PyGame-based simple game and built a Line Following Robot using Arduino and sensors for hardware experience.',
    images: ['./images/events_carousel/line_follower/1.jpeg', './images/events_carousel/line_follower/2.jpeg', './images/events_carousel/line_follower/3.jpeg', './images/events_carousel/mesh_game/1.jpeg', './images/events_carousel/neurobot/1.jpeg'],
  },
  {
    date: 'Oct 2024',
    title: 'Undergraduate Studies Begin',
    institution: 'Faculty of Engineering',
    description: 'Started the BSc. Engineering degree at the University of Peradeniya.',
  },
  {
    date: '2023 / 2024',
    title: 'A/L Phase (Physical Science)',
    institution: 'Richmond College',
    description: 'Achieved 3 A passes and was selected to the University of Peradeniya.',
  },
];

const PROJECTS_DATA: Project[] = [
  {
    id: 1,
    title: 'Blackbot',
    description: 'Autonomous line-following robot with PID control, obstacle detection, and Bluetooth telemetry. Built for national robotics competition.',
    image: './images/events_carousel/line_follower/1.jpeg',
    tags: ['Robotics', 'Arduino', 'C++', 'PID'],
    category: 'robotics',
    featured: true,
    github: 'https://github.com',
    demo: null,
  },
  {
    id: 2,
    title: 'Neurobot',
    description: 'Neural network-powered robotic arm with computer vision for object recognition and grasping. Uses TensorFlow Lite on Raspberry Pi.',
    image: './images/events_carousel/neurobot/1.jpeg',
    tags: ['Computer Vision', 'Python', 'TensorFlow', 'ROS2'],
    category: 'robotics',
    featured: true,
    github: 'https://github.com',
    demo: null,
  },
  {
    id: 3,
    title: '3D Engine in C',
    description: 'Software rasterizer from scratch in pure C. Implements matrix transformations, lighting, and texture mapping without graphics libraries.',
    image: './images/projects/3d_engine_c.png',
    tags: ['C', 'Computer Graphics', 'Math', 'Low-Level'],
    category: 'software',
    featured: false,
    github: 'https://github.com',
    demo: null,
  },
  {
    id: 4,
    title: 'ARM CLI Debugger',
    description: 'Command-line debugging tool for ARM Cortex-M microcontrollers. Supports breakpoints, memory inspection, and register viewing.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
    tags: ['C++', 'ARM', 'Embedded', 'CLI'],
    category: 'software',
    featured: false,
    github: 'https://github.com',
    demo: null,
  },
  {
    id: 5,
    title: 'Pygame Maze Solver',
    description: 'Interactive maze generator and solver with multiple algorithms (BFS, DFS, A*). Visualizes pathfinding in real-time.',
    image: './images/events_carousel/mesh_game/1.jpeg',
    tags: ['Python', 'Pygame', 'Algorithms', 'AI'],
    category: 'software',
    featured: false,
    github: 'https://github.com',
    demo: null,
  },
  {
    id: 6,
    title: 'Apollo Exhibit',
    description: 'Interactive space exploration display for TECHNO 2024 conference. Features scale model rockets with LED telemetry simulation.',
    image: './images/events_carousel/agc/1.jpeg',
    tags: ['Exhibition', 'Electronics', 'Arduino', 'Design'],
    category: 'exhibition',
    featured: true,
    github: null,
    demo: null,
  },
];

const PROJECT_FILTERS: ProjectFilter[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'robotics', label: 'Robotics' },
  { id: 'software', label: 'Software' },
  { id: 'exhibition', label: 'Exhibition' },
];

const SKILL_TAGS: string[] = [
  'Embedded Systems', 'Robotics', 'Computer Vision', 'Machine Learning',
  'PCB Design', 'IoT', 'Linux', 'Git', 'OpenCV', 'TensorFlow',
  'ROS2', 'Arduino', 'Raspberry Pi', 'ESP32', 'ARM Cortex',
];

const FULL_GALLERY_IMAGES: GalleryItem[] = [
  ...Array.from({length: 5}, (_, i) => ({ id: 100+i, src: `./images/events_carousel/techno25/${i+1}.jpeg`, caption: 'TECHNO 2025 Conference', category: 'Events' })),
  ...Array.from({length: 7}, (_, i) => ({ id: 200+i, src: `./images/events_carousel/icpc/${i+1}.jpeg`, caption: 'ICPC Regional Contest', category: 'Events' })),
  ...Array.from({length: 16}, (_, i) => ({ id: 300+i, src: `./images/events_carousel/moraxtreme/${i+1}.jpeg`, caption: 'MoraXtreme Hackathon', category: 'Events' })),
  { id: 400, src: `./images/events_carousel/neurobot/1.jpeg`, caption: 'Neuro Bot Exhibition', category: 'Robotics' },
  { id: 401, src: `./images/events_carousel/neurobot/video.mp4`, caption: 'Neuro Bot Exhibition', category: 'Robotics' },
  ...Array.from({length: 3}, (_, i) => ({ id: 500+i, src: `./images/events_carousel/line_follower/${i+1}.jpeg`, caption: 'Line Following Robot', category: 'Robotics' })),
  { id: 504, src: `./images/events_carousel/line_follower/video.mp4`, caption: 'Line Following Robot', category: 'Robotics' },
  ...Array.from({length: 3}, (_, i) => ({ id: 600+i, src: `./images/events_carousel/mesh_game/${i+1}.jpeg`, caption: 'Mesh Game', category: 'Robotics' })),
  ...Array.from({length: 2}, (_, i) => ({ id: 700+i, src: `./images/events_carousel/agc/${i+1}.jpeg`, caption: 'Apollo Guidance Computer Exhibit', category: 'Projects' })),
  { id: 703, src: `./images/events_carousel/agc/video.mp4`, caption: 'Apollo Guidance Computer Exhibit', category: 'Projects' },
  ...Array.from({length: 3}, (_, i) => ({ id: 800+i, src: `./images/events_carousel/dept_welcome/${i+1}.jpeg`, caption: 'Department Welcome', category: 'Campus Life' })),
  { id: 900, src: './images/profile.jpg', caption: 'Kavisha Kalhara', category: 'Profile' }
];

const GALLERY_DATA: GalleryItem[] = [
  { id: 1, src: './images/events/techno25.jpeg', caption: 'TECHNO 2025 Conference', category: 'Events' },
  { id: 2, src: './images/events/neurobot.jpeg', caption: 'Neuro Bot Exhibition', category: 'Robotics' },
  { id: 3, src: './images/events/icpc.jpeg', caption: 'ICPC Regional Contest', category: 'Events' },
  { id: 4, src: './images/events/dept_welcome.jpeg', caption: 'Department Welcome', category: 'Campus Life' },
  { id: 5, src: './images/events/line_follower.jpeg', caption: 'Line Following Robot', category: 'Robotics' },
  { id: 6, src: './images/events/agc.jpeg', caption: 'Apollo Guidance Computer Exhibit', category: 'Projects' },
  { id: 7, src: './images/profile.jpg', caption: 'Kavisha Kalhara', category: 'Profile' },
  { id: 8, src: './images/events/moraxtreme.jpeg', caption: 'MoraXtreme Hackathon', category: 'Events' },
];

const SOCIAL_LINKS = [
  { icon: 'github', href: 'https://github.com/kavisha-git', label: 'GitHub' },
  { icon: 'linkedin', href: 'https://www.linkedin.com/in/kavisha-kalhara-b4102b326', label: 'LinkedIn' },
  { icon: 'twitter', href: 'https://twitter.com', label: 'X / Twitter' },
];

// ============================================
// UTILITY HOOKS
// ============================================

const useScrollPosition = (): number => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollY;
};

// ============================================
// COMPONENT: LoadingScreen
// ============================================

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFading(true);
            setTimeout(onComplete, 600);
          }, 300);
          return 100;
        }
        return prev + 3;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100]" style={{ background: 'var(--bg-primary)' }}>
      <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-600 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Animated rings */}
        <div className="relative w-36 h-36">
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
            style={{
              borderTopColor: '#a855f7',
              borderRightColor: '#6366f1',
              animationDuration: '1.2s',
            }}
          />
          <div
            className="absolute inset-2 rounded-full border-2 border-transparent animate-spin"
            style={{
              borderBottomColor: '#06b6d4',
              borderLeftColor: '#a855f7',
              animationDirection: 'reverse',
              animationDuration: '1.8s',
            }}
          />
          <div
            className="absolute inset-4 rounded-full border border-transparent animate-spin"
            style={{
              borderTopColor: '#818cf8',
              animationDuration: '2.4s',
            }}
          />
          {/* Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="./images/logo.png"
              alt="KRK"
              className="w-16 h-16 object-contain rounded-full"
            />
          </div>
        </div>

        <p className="mt-8 text-sm tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--text-muted)' }}>
          Loading Portfolio
        </p>

        {/* Progress bar */}
        <div className="mt-4 w-56 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #a855f7, #6366f1, #06b6d4)',
            }}
          />
        </div>
        <p className="mt-2 text-xs font-mono" style={{ color: 'var(--text-faint)' }}>{progress}%</p>
      </div>
    </div>
  );
};

// ============================================
// COMPONENT: AnimatedBackground
// ============================================

const AnimatedBackground: FC = () => {
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const newScroll = window.pageYOffset;

      blobRefs.current.forEach((blob, index) => {
        if (!blob) return;
        const xOffset = Math.sin(newScroll / 120 + index * 0.7) * 280;
        const yOffset = Math.cos(newScroll / 120 + index * 0.7) * 50;
        blob.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        blob.style.transition = 'transform 1.4s ease-out';
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Blobs */}
      <div
        ref={el => { blobRefs.current[0] = el; }}
        className="blob blob-purple"
        style={{ width: '28rem', height: '28rem', top: '-6rem', left: '-6rem' }}
      />
      <div
        ref={el => { blobRefs.current[1] = el; }}
        className="blob blob-cyan hidden sm:block"
        style={{ width: '24rem', height: '24rem', top: '-4rem', right: '-4rem' }}
      />
      <div
        ref={el => { blobRefs.current[2] = el; }}
        className="blob blob-blue"
        style={{ width: '24rem', height: '24rem', bottom: '-8rem', left: '10%' }}
      />
      <div
        ref={el => { blobRefs.current[3] = el; }}
        className="blob blob-indigo hidden sm:block"
        style={{ width: '20rem', height: '20rem', bottom: '-6rem', right: '15%', opacity: 0.2 }}
      />
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid" />
    </div>
  );
};

// ============================================
// COMPONENT: Navbar
// ============================================

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const Navbar: FC<NavbarProps> = ({ isDark, toggleTheme, activeSection, onNavigate }) => {
  const scrollY = useScrollPosition();
  const isScrolled = scrollY > 60;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'backdrop-blur-2xl border-b shadow-lg'
        : 'bg-transparent'
        }`}
      style={isScrolled ? {
        background: 'var(--bg-nav)',
        borderColor: 'var(--border-color)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
      } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img
              src="./images/logo.png"
              alt="KRK Logo"
              className="w-9 h-9 object-contain rounded-lg"
            />
            <span className="hidden sm:block text-lg font-bold gradient-text">
              Kavisha Kalhara
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:text-white ${activeSection === link.id ? '' : ''
                  }`}
                style={{
                  color: activeSection === link.id ? '#c084fc' : 'var(--text-muted)',
                }}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                    style={{ background: 'linear-gradient(90deg, #a855f7, #6366f1)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl transition-all duration-300 hover:scale-110 glass"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-5 h-5" style={{ color: '#c084fc' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" style={{ color: '#6366f1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl glass transition-all duration-300"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div className="py-4 flex flex-col space-y-1" style={{ background: 'var(--bg-nav)' }}>
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => { onNavigate(link.id); setMobileOpen(false); }}
                    className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all duration-300 ${activeSection === link.id ? 'bg-purple-500/10' : ''
                      }`}
                    style={{ color: activeSection === link.id ? '#c084fc' : 'var(--text-secondary)' }}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

// ============================================
// COMPONENT: Typewriter
// ============================================

interface TypewriterProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pause?: number;
}

const Typewriter: FC<TypewriterProps> = ({ texts, speed = 100, deleteSpeed = 50, pause = 2000 }) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const currentText = texts[textIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (index < currentText.length) {
          setDisplayText(currentText.slice(0, index + 1));
          setIndex(index + 1);
        } else {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        if (index > 0) {
          setDisplayText(currentText.slice(0, index - 1));
          setIndex(index - 1);
        } else {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [index, isDeleting, textIndex, texts, speed, deleteSpeed, pause]);

  return (
    <span className="inline">
      {displayText}
      <span className="animate-pulse" style={{ color: '#a855f7' }}>|</span>
    </span>
  );
};

// ============================================
// COMPONENT: AnimatedCounter
// ============================================

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

const AnimatedCounter: FC<AnimatedCounterProps> = ({ value, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      hasAnimated.current = true;
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(easeOut * value));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [isVisible, value, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// ============================================
// SVG Icons
// ============================================

const GitHubIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedInIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const XIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SocialIcon: FC<{ icon: string; className?: string }> = ({ icon, className }) => {
  switch (icon) {
    case 'github': return <GitHubIcon className={className} />;
    case 'linkedin': return <LinkedInIcon className={className} />;
    case 'twitter': return <XIcon className={className} />;
    default: return null;
  }
};

// ============================================
// COMPONENT: HeroSection
// ============================================

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

const HeroSection: FC<HeroSectionProps> = ({ onNavigate }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 350], [1, 0]);

  const techChips = ['C/C++', 'Python', 'Arduino', 'ROS2', 'OpenCV', 'Raspberry Pi'];

  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative px-4 pt-20 pb-16 overflow-hidden"
    >
      <motion.div
        style={{ y: y1, opacity }}
        className="max-w-7xl mx-auto w-full z-10"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* University Badge */}
            <div
              className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full mb-8 glass"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/University_of_Peradeniya_Crest.svg/120px-University_of_Peradeniya_Crest.svg.png"
                alt="University of Peradeniya"
                className="w-7 h-7 object-contain"
              />
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                University of Peradeniya · Sri Lanka
              </span>
            </div>

            {/* Name */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 leading-[1.1]">
              <span style={{ color: 'var(--text-primary)' }}>Hi, I'm </span>
              <br />
              <span className="gradient-text-animated">
                Kavisha Kalhara
              </span>
            </h1>

            {/* Typewriter */}
            <div className="text-lg sm:text-xl mb-6 h-8 font-medium" style={{ color: 'var(--text-muted)' }}>
              <Typewriter texts={TYPEWRITER_ROLES} speed={80} deleteSpeed={40} pause={1500} />
            </div>

            {/* Description */}
            <p className="text-base mb-8 max-w-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              I focus on creating innovative solutions in robotics, embedded systems,
              and computer vision — bringing ideas to life through both code and circuits.
            </p>

            {/* Tech Chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {techChips.map((chip) => (
                <span
                  key={chip}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold glass transition-all duration-300 hover:border-purple-500/40"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {chip}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
              <button
                onClick={() => onNavigate('projects')}
                className="group px-7 py-3 rounded-full text-white font-semibold transition-all duration-300 flex items-center gap-2 hover:shadow-xl hover:shadow-purple-500/20 hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)' }}
              >
                <span>View Projects</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>

              <button
                className="group px-7 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 glass hover:border-purple-500/30"
                style={{ color: 'var(--text-primary)' }}
              >
                <span>📄</span>
                <span>Download CV</span>
              </button>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl flex items-center justify-center glass transition-all duration-300 hover:border-purple-500/40 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/10"
                  style={{ color: 'var(--text-muted)' }}
                  aria-label={social.label}
                >
                  <SocialIcon icon={social.icon} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="hidden lg:flex justify-center items-center relative"
          >
            <div className="relative w-full max-w-md">
              {/* Glow ring */}
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-20"
                style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1, #06b6d4)' }}
              />
              {/* Profile image with gradient border */}
              <div className="relative">
                <div
                  className="w-80 h-80 mx-auto rounded-full p-1"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1, #06b6d4)' }}
                >
                  <div className="w-full h-full rounded-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
                    <img
                      src="./images/profile.jpg"
                      alt="Kavisha Kalhara"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Floating tech badges */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="absolute top-8 -right-4 px-3 py-2 rounded-xl glass text-sm font-semibold"
                  style={{ color: '#c084fc' }}
                >
                  🤖 Robotics
                </motion.div>
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute bottom-12 -left-6 px-3 py-2 rounded-xl glass text-sm font-semibold"
                  style={{ color: '#818cf8' }}
                >
                  ⚡ C/C++
                </motion.div>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
                  className="absolute bottom-4 -right-2 px-3 py-2 rounded-xl glass text-sm font-semibold"
                  style={{ color: '#22d3ee' }}
                >
                  👁️ OpenCV
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <svg className="w-7 h-7 opacity-50" style={{ color: '#a855f7' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

// ============================================
// COMPONENT: StatsBar
// ============================================

const StatsBar: FC = () => (
  <section className="py-16 px-4 relative z-10">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {STATS_DATA.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="group relative p-6 rounded-2xl glass card-glow overflow-hidden"
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-4 right-4 h-px opacity-40"
              style={{ background: 'linear-gradient(90deg, transparent, #a855f7, #6366f1, transparent)' }}
            />
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// COMPONENT: AboutSection
// ============================================

const AboutSection: FC = () => (
  <section id="about" className="py-24 px-4 relative">
    <div className="max-w-6xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          About <span className="gradient-text">Me</span>
        </h2>
        <div className="w-24 h-1 rounded-full mx-auto" style={{ background: 'linear-gradient(90deg, #a855f7, #6366f1)' }} />
        <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Transforming ideas into intelligent systems
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-16 items-center">
        {/* Left Column - Text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p>
              I'm a passionate Computer Engineering undergraduate at the University of Peradeniya,
              driven by a fascination for how hardware and software converge to create intelligent systems.
            </p>
            <p>
              My journey into technology began at a young age, tinkering with Arduino boards and
              writing my first lines of C code. Today, I'm deeply invested in robotics, embedded systems,
              and computer vision — fields where I can bring ideas to life through both code and circuits.
            </p>
            <p>
              I believe in learning by building. Every project is an opportunity to push boundaries,
              whether it's optimizing a PID controller for a line-following robot or implementing a
              3D graphics engine from scratch.
            </p>
            <p>
              When I'm not debugging code or soldering PCBs, you'll find me contributing to open-source
              projects, mentoring junior students, or exploring the latest advancements in AI and robotics.
            </p>
          </div>

          {/* Skill Tags */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {SKILL_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-sm glass transition-all duration-300 cursor-default hover:border-purple-500/40"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative p-8 rounded-3xl glass card-glow">
            {/* Profile Photo */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-30"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)' }}
                />
                <div
                  className="relative w-32 h-32 rounded-full p-1"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1, #06b6d4)' }}
                >
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img src="./images/profile.jpg" alt="Kavisha Kalhara" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Kavisha Kalhara</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Computer Engineering Undergraduate</p>
            </div>

            {/* University Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/University_of_Peradeniya_Crest.svg/40px-University_of_Peradeniya_Crest.svg.png"
                  alt="UoP" className="w-6 h-6 object-contain"
                />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>University of Peradeniya</span>
              </div>
            </div>

            {/* Quick Info Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {[{ icon: '📍', text: 'Sri Lanka' }, { icon: '🎓', text: '2nd Year' }, { icon: '💼', text: 'Open to Internships' }].map((pill) => (
                <div key={pill.text} className="flex items-center gap-2 px-4 py-2 rounded-full glass">
                  <span>{pill.icon}</span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{pill.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

// ============================================
// COMPONENT: EducationTimeline
// ============================================

const EducationTimeline: FC = () => (
  <section id="education" className="py-24 px-4 relative">
    <div className="max-w-4xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Education & <span className="gradient-text">Journey</span>
        </h2>
        <div className="w-24 h-1 rounded-full mx-auto" style={{ background: 'linear-gradient(90deg, #a855f7, #6366f1)' }} />
      </motion.div>

      <div className="relative">
        <div
          className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px"
          style={{ background: 'linear-gradient(to bottom, #a855f7, #6366f1, transparent)' }}
        />

        {EDUCATION_TIMELINE.map((item, index) => (
          <div
            key={index}
            className={`relative flex items-start mb-8 md:mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
          >
            <div
              className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-10"
              style={{
                background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                border: '4px solid var(--bg-primary)',
              }}
            />

            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`ml-12 md:ml-0 md:w-[45%] ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}
            >
              <div className="p-6 rounded-2xl glass card-glow transition-all duration-300 hover:scale-[1.02]">
                <span
                  className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
                  style={{
                    background: 'rgba(168, 85, 247, 0.12)',
                    color: '#c084fc',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                  }}
                >
                  {item.date}
                </span>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="text-sm font-medium mb-3" style={{ color: '#818cf8' }}>{item.institution}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                {item.images && item.images.length > 0 && (
                  <div className="mt-5 relative w-full">
                    <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'thin', scrollbarColor: '#a855f7 transparent' }}>
                      {item.images.map((imgSrc, imgIdx) => (
                        <div key={imgIdx} className="flex-none w-64 h-48 rounded-2xl overflow-hidden border border-white/10 shadow-lg relative snap-center group/img">
                          <img src={imgSrc} alt={`${item.title} - ${imgIdx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// COMPONENT: SkillBar
// ============================================

interface SkillBarProps {
  name: string;
  percentage: number;
  icon: string;
  delay: number;
  isVisible: boolean;
}

const SkillBar: FC<SkillBarProps> = ({ name, percentage, icon, delay, isVisible }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setWidth(percentage), delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, percentage, delay]);

  return (
    <div className="mb-5">
      <div className="flex justify-between mb-2">
        <span className="text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
          <span className="text-base">{icon}</span>
          {name}
        </span>
        <span className="text-sm font-mono font-semibold" style={{ color: '#c084fc' }}>{percentage}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            background: 'linear-gradient(90deg, #a855f7, #6366f1, #06b6d4)',
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
};

// ============================================
// COMPONENT: SkillsSection
// ============================================

const SkillsSection: FC = () => {
  const skillCategories: { id: keyof SkillCategory; title: string; icon: string }[] = [
    { id: 'programming', title: 'Programming Languages', icon: '💻' },
    { id: 'robotics', title: 'Robotics & Embedded', icon: '🤖' },
    { id: 'tools', title: 'Tools & Platforms', icon: '🔧' },
  ];

  return (
    <section id="skills" className="py-24 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <div className="w-24 h-1 rounded-full mx-auto" style={{ background: 'linear-gradient(90deg, #a855f7, #6366f1)' }} />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.15, duration: 0.6 }}
              className="p-8 rounded-3xl glass card-glow"
            >
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                <span className="text-2xl">{category.icon}</span>
                {category.title}
              </h3>
              {SKILLS_DATA[category.id].map((skill, skillIndex) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  percentage={skill.percentage}
                  icon={skill.icon}
                  delay={catIndex * 150 + skillIndex * 100}
                  isVisible={true}
                />
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// COMPONENT: ProjectCard
// ============================================

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: FC<ProjectCardProps> = ({ project, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group relative rounded-3xl overflow-hidden glass card-glow"
  >
    <div className="relative h-56 overflow-hidden">
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, var(--bg-primary) 5%, transparent 90%)' }}
      />

      {project.featured && (
        <div
          className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg"
          style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)' }}
        >
          ⭐ Featured
        </div>
      )}

      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold glass capitalize" style={{ color: 'var(--text-secondary)' }}>
        {project.category}
      </div>
    </div>

    <div className="p-7">
      <h3 className="text-2xl font-bold mb-3 transition-colors group-hover:text-purple-400" style={{ color: 'var(--text-primary)' }}>
        {project.title}
      </h3>
      <p className="text-sm mb-6 line-clamp-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: 'var(--badge-bg)', color: '#c084fc' }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-3">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-11 h-11 rounded-xl glass transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30"
            aria-label="View on GitHub"
          >
            <GitHubIcon className="w-5 h-5" />
          </a>
        )}
        <button
          className="flex items-center justify-center w-11 h-11 rounded-xl glass transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30"
          aria-label="View details"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>
    </div>
  </motion.div>
);

// ============================================
// COMPONENT: ProjectsSection
// ============================================

const ProjectsSection: FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProjects = activeFilter === 'all'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter(p => p.category === activeFilter);

  return (
    <section id="projects" className="py-24 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="w-24 h-1 rounded-full mx-auto mb-8" style={{ background: 'linear-gradient(90deg, #a855f7, #6366f1)' }} />
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {PROJECT_FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeFilter === filter.id
                ? 'text-white shadow-lg shadow-purple-500/20'
                : 'glass'
                }`}
              style={activeFilter === filter.id
                ? { background: 'linear-gradient(135deg, #a855f7, #6366f1)' }
                : { color: 'var(--text-muted)' }
              }
            >
              {filter.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

// ============================================
// COMPONENT: GallerySection
// ============================================

const GallerySection: FC = () => {
  const [selectedEventTitle, setSelectedEventTitle] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(GALLERY_DATA.map(item => item.category)))];
  const filteredImages = activeFilter === 'All' ? GALLERY_DATA : GALLERY_DATA.filter(item => item.category === activeFilter);

  const lightboxImages = FULL_GALLERY_IMAGES.filter(img => img.caption === selectedEventTitle);

  const handleOpen = (item: GalleryItem) => {
    setSelectedEventTitle(item.caption);
    setLightboxIndex(0);
  };

  const handleNext = (e: any) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const handlePrev = (e: any) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  return (
    <section id="gallery" className="py-24 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Photo <span className="gradient-text">Gallery</span>
          </h2>
          <div className="w-24 h-1 rounded-full mx-auto mb-4" style={{ background: 'linear-gradient(90deg, #a855f7, #6366f1)' }} />
          <p className="max-w-lg mx-auto text-lg" style={{ color: 'var(--text-muted)' }}>
            Featured moments from events, projects, and campus life
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeFilter === cat
                ? 'text-white shadow-lg shadow-purple-500/20'
                : 'glass'
                }`}
              style={activeFilter === cat
                ? { background: 'linear-gradient(135deg, #a855f7, #6366f1)' }
                : { color: 'var(--text-secondary)' }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {filteredImages.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                className="break-inside-avoid group relative rounded-3xl overflow-hidden cursor-pointer hover-lift"
                onClick={() => handleOpen(item)}
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6"
                  style={{ background: 'linear-gradient(to top, var(--bg-primary) 10%, rgba(0,0,0,0.2) 50%, transparent)' }}
                >
                  <span
                    className="inline-block px-3 py-1.5 rounded-full text-xs font-bold w-fit mb-3"
                    style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }}
                  >
                    {item.category}
                  </span>
                  <p className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{item.caption}</p>
                </div>
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-purple-500/30 transition-all duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedEventTitle && lightboxImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            onClick={() => setSelectedEventTitle(null)}
          >
            <div className="absolute inset-0 backdrop-blur-xl" style={{ background: 'var(--overlay-bg)' }} />
            <div
              className="relative max-w-5xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
              style={{ animation: 'scaleIn 0.3s ease-out', maxHeight: '90vh' }}
            >
              <button
                onClick={() => setSelectedEventTitle(null)}
                className="absolute -top-12 right-0 md:-right-12 w-10 h-10 rounded-full glass flex items-center justify-center transition-all z-10 hover:scale-110"
                style={{ color: 'var(--text-secondary)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {lightboxImages.length > 1 && (
                <>
                  <button onClick={handlePrev} className="absolute left-[-1rem] md:-left-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass flex items-center justify-center transition-all z-10 hover:scale-110" style={{ color: 'var(--text-primary)' }}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button onClick={handleNext} className="absolute right-[-1rem] md:-right-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass flex items-center justify-center transition-all z-10 hover:scale-110" style={{ color: 'var(--text-primary)' }}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}

              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10 flex items-center justify-center bg-black/40 border border-white/5" style={{ height: '75vh', width: '100%' }}>
                {lightboxImages[lightboxIndex].src.endsWith('.mp4') ? (
                  <video src={lightboxImages[lightboxIndex].src} controls autoPlay className="max-w-full max-h-full object-contain" />
                ) : (
                  <img src={lightboxImages[lightboxIndex].src} alt={lightboxImages[lightboxIndex].caption} className="max-w-full max-h-full object-contain" />
                )}
              </div>
              
              <div className="mt-6 text-center">
                <span
                  className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-3 tracking-widest uppercase"
                  style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }}
                >
                  {lightboxImages[lightboxIndex].category}
                </span>
                <p className="text-white text-2xl font-bold flex items-center justify-center gap-3">
                  <span>{lightboxImages[lightboxIndex].caption}</span>
                  {lightboxImages.length > 1 && (
                    <span className="text-sm font-semibold opacity-60" style={{ color: 'var(--text-muted)' }}>
                      ({lightboxIndex + 1} / {lightboxImages.length})
                    </span>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// ============================================
// COMPONENT: ContactSection
// ============================================

// ⚠️ REPLACE THIS with your real Web3Forms access key!
// Get one free at: https://web3forms.com (enter your email → get key in inbox)
const WEB3FORMS_ACCESS_KEY = '57c2c50a-1cd6-48f4-bea9-f7b0cafa900c';

const ContactSection: FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          subject: `Portfolio Contact: ${formData.subject}`,
          message: formData.message,
          from_name: 'Portfolio Contact Form',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactInfo: ContactInfo[] = [
    { icon: '📧', label: 'Email', value: 'kavishar.kalhara@gmail.com', href: 'mailto:kavishar.kalhara@gmail.com' },
    { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/kavisha-kalhara', href: 'https://www.linkedin.com/in/kavisha-kalhara-b4102b326' },
    { icon: '🐙', label: 'GitHub', value: 'github.com/kavisha-git', href: 'https://github.com/kavisha-git' },
  ];

  return (
    <section id="contact" className="py-24 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <div className="w-24 h-1 rounded-full mx-auto" style={{ background: 'linear-gradient(90deg, #a855f7, #6366f1)' }} />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              I'm always excited to collaborate on interesting projects, discuss new ideas,
              or explore opportunities in robotics, embedded systems, and software development.
              Feel free to reach out!
            </p>

            <div className="space-y-4 mb-8">
              {contactInfo.map((info) => (
                <a
                  key={info.label}
                  href={info.href}
                  target={info.href.startsWith('http') ? '_blank' : undefined}
                  rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-4 p-4 rounded-xl glass card-glow transition-all duration-300"
                >
                  <span className="text-2xl">{info.icon}</span>
                  <div>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{info.label}</p>
                    <p style={{ color: 'var(--text-primary)' }}>{info.value}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="flex gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full flex items-center justify-center glass transition-all hover:border-purple-500/40 hover:scale-110"
                  style={{ color: 'var(--text-muted)' }}
                  aria-label={social.label}
                >
                  <SocialIcon icon={social.icon} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5 glass p-8 rounded-3xl card-glow">
              {['name', 'email', 'subject'].map((field) => (
                <div key={field}>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#c084fc' }}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={formData[field as keyof typeof formData]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all duration-200"
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder={`Enter your ${field}`}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#c084fc' }}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all duration-200 resize-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: 'var(--text-primary)',
                  }}
                  placeholder="Write your message here..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-purple-500/20"
                style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)' }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl text-center"
                  style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ade80' }}
                >
                  ✅ Message sent successfully! I'll get back to you soon.
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl text-center"
                  style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171' }}
                >
                  ❌ Failed to send message. Please try emailing me directly.
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// COMPONENT: Footer
// ============================================

const Footer: FC = () => (
  <footer className="py-12 px-4 relative z-10" style={{ borderTop: '1px solid var(--border-color)' }}>
    <div className="max-w-6xl mx-auto">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <img src="./images/logo.png" alt="KRK" className="w-12 h-12 object-contain rounded-lg" />
        </div>
        <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
          Building the future, one line of code at a time.
        </p>
        <div className="flex justify-center gap-4 mb-8">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.icon}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center glass transition-all hover:border-purple-500/40 hover:scale-110"
              style={{ color: 'var(--text-muted)' }}
              aria-label={social.label}
            >
              <SocialIcon icon={social.icon} className="w-5 h-5" />
            </a>
          ))}
        </div>
        <p className="text-sm" style={{ color: 'var(--text-faint)' }}>
          © {new Date().getFullYear()} Kavisha Rashmika Kalhara. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

// ============================================
// COMPONENT: ScrollToTop
// ============================================

interface ScrollToTopProps {
  onNavigate: (sectionId: string) => void;
}

const ScrollToTop: FC<ScrollToTopProps> = ({ onNavigate }) => {
  const scrollY = useScrollPosition();
  const isVisible = scrollY > 400;

  return (
    <button
      onClick={() => onNavigate('home')}
      className={`fixed bottom-8 right-8 w-12 h-12 rounded-full text-white shadow-lg shadow-purple-500/25 transition-all duration-300 flex items-center justify-center z-40 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)' }}
      aria-label="Scroll to top"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
};

// ============================================
// MAIN APP COMPONENT
// ============================================

const App: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  const toggleTheme = () => setIsDark(!isDark);

  const handleNavigate = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      let currentSection = 'home';

      NAV_LINKS.forEach((link) => {
        const element = document.getElementById(link.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentSection = link.id;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div data-theme={isDark ? 'dark' : 'light'}>
      <div
        className="min-h-screen transition-colors duration-500"
        style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      >
        <AnimatedBackground />

        <Navbar
          isDark={isDark}
          toggleTheme={toggleTheme}
          activeSection={activeSection}
          onNavigate={handleNavigate}
        />

        <main className="relative z-10">
          <HeroSection onNavigate={handleNavigate} />
          <StatsBar />
          <AboutSection />
          <EducationTimeline />
          <SkillsSection />
          <ProjectsSection />
          <GallerySection />
          <ContactSection />
        </main>

        <Footer />
        <ScrollToTop onNavigate={handleNavigate} />
      </div>
    </div>
  );
};

export default App;




