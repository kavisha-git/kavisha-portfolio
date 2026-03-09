import { useState, useEffect, useRef, useCallback } from 'react';
import type { FC, FormEvent, ChangeEvent } from 'react';
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

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface MousePosition {
  x: number | null;
  y: number | null;
}

interface ContactInfo {
  icon: string;
  label: string;
  value: string;
  href: string;
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
  'Computer Engineering Undergraduate',
  'Robotics & Embedded Systems Engineer',
  'Computer Vision Developer',
  'Low-Level Systems Programmer',
  'Open Source Builder',
];

const STATS_DATA: StatData[] = [
  { icon: '🚀', value: 8, label: 'Major Projects', suffix: '+' },
  { icon: '💻', value: 6, label: 'Programming Languages', suffix: '+' },
  { icon: '🎓', value: 1, label: 'Year at UoP', suffix: 'st' },
  { icon: '🏆', value: 1, label: 'Conference Exhibits', suffix: '' },
];

const SKILLS_DATA: SkillCategory = {
  programming: [
    { name: 'C / C++', percentage: 90 },
    { name: 'Python', percentage: 85 },
    { name: 'JavaScript', percentage: 80 },
    { name: 'Assembly (ARM)', percentage: 75 },
    { name: 'MATLAB', percentage: 70 },
    { name: 'Verilog HDL', percentage: 65 },
  ],
  robotics: [
    { name: 'Arduino', percentage: 95 },
    { name: 'Raspberry Pi', percentage: 90 },
    { name: 'ROS2', percentage: 75 },
    { name: 'ESP32', percentage: 85 },
    { name: 'Motor Control', percentage: 80 },
    { name: 'Sensor Integration', percentage: 85 },
  ],
  tools: [
    { name: 'Git & GitHub', percentage: 90 },
    { name: 'Linux', percentage: 85 },
    { name: 'Docker', percentage: 70 },
    { name: 'KiCad', percentage: 80 },
    { name: 'OpenCV', percentage: 85 },
    { name: 'TensorFlow', percentage: 75 },
  ],
};

const EDUCATION_TIMELINE: TimelineEntry[] = [
  {
    date: '2024 - Present',
    title: 'BSc. Engineering (Hons) in Computer Engineering',
    institution: 'University of Peradeniya, Sri Lanka',
    description: 'Pursuing undergraduate studies with focus on embedded systems, computer architecture, and robotics. Active member of the Engineering Society and Robotics Club.',
  },
  {
    date: '2023',
    title: 'Advanced Level (Physical Science)',
    institution: 'Royal College, Colombo',
    description: 'Achieved 3A passes in Physics, Chemistry, and Combined Mathematics. Ranked in top 1% nationally.',
  },
  {
    date: '2020',
    title: 'Ordinary Level Examination',
    institution: 'Royal College, Colombo',
    description: 'Secured 9A passes including Mathematics, Science, and ICT. Received academic excellence award.',
  },
  {
    date: '2019',
    title: 'Introduction to Robotics',
    institution: 'STEM Academy, Colombo',
    description: 'Completed foundational course in robotics engineering covering sensors, actuators, and basic control systems.',
  },
  {
    date: '2018',
    title: 'Programming Fundamentals',
    institution: 'Online Certification',
    description: 'Learned C programming basics through Harvard CS50 online course. Built first console applications.',
  },
  {
    date: '2017',
    title: 'Arduino Workshop Series',
    institution: 'IEEE Student Branch',
    description: 'Hands-on training in microcontroller programming and basic circuit design.',
  },
  {
    date: '2016',
    title: 'Mathematics Olympiad Training',
    institution: 'Sri Lanka Mathematics Olympiad',
    description: 'Participated in national mathematics competition training program.',
  },
  {
    date: '2015',
    title: 'School Science Exhibition Winner',
    institution: 'Royal College, Colombo',
    description: 'First place in junior category for automated plant watering system project.',
  },
];

const PROJECTS_DATA: Project[] = [
  {
    id: 1,
    title: 'Blackbot',
    description: 'Autonomous line-following robot with PID control, obstacle detection, and Bluetooth telemetry. Built for national robotics competition.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=600&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1614726365723-49cfae927846?w=600&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=600&h=400&fit=crop',
    tags: ['Exhibition', 'Electronics', 'Arduino', 'Design'],
    category: 'exhibition',
    featured: true,
    github: null,
    demo: null,
  },
];

const PROJECT_FILTERS: ProjectFilter[] = [
  { id: 'all', label: 'All' },
  { id: 'robotics', label: 'Robotics' },
  { id: 'software', label: 'Software' },
  { id: 'exhibition', label: 'Exhibition' },
];

const SKILL_TAGS: string[] = [
  'Embedded Systems', 'Robotics', 'Computer Vision', 'Machine Learning',
  'PCB Design', 'IoT', 'Linux', 'Git', 'OpenCV', 'TensorFlow',
  'ROS2', 'Arduino', 'Raspberry Pi', 'ESP32', 'ARM Cortex',
];

interface GalleryItem {
  id: number;
  src: string;
  caption: string;
  category: string;
}

const GALLERY_DATA: GalleryItem[] = [
  {
    id: 1,
    src: './images/profile.jpg',
    caption: 'TECHNO 2025 Conference',
    category: 'Events',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=800&fit=crop',
    caption: 'Robotics Workshop Session',
    category: 'Workshops',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&h=400&fit=crop',
    caption: 'Circuit Board Design',
    category: 'Projects',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=600&h=600&fit=crop',
    caption: 'University of Peradeniya Campus',
    category: 'Campus Life',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
    caption: 'Blackbot - Line Following Robot',
    category: 'Projects',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=600&h=800&fit=crop',
    caption: 'Apollo Exhibit at TECHNO',
    category: 'Events',
  },
];

// ============================================
// UTILITY HOOKS
// ============================================

const useIntersectionObserver = (options: IntersectionObserverInit = {}): [React.RefObject<HTMLElement | null>, boolean] => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return [ref, isIntersecting];
};

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
            setTimeout(onComplete, 500);
          }, 300);
          return 100;
        }
        return prev + 4;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500`}
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
        <div className="relative">
          {/* Animated gradient ring */}
          <div className="w-32 h-32 rounded-full border-4 border-transparent border-t-[#00d4ff] border-r-[#0066ff] animate-spin" />
          <div
            className="absolute inset-0 w-32 h-32 rounded-full border-4 border-transparent border-b-[#00d4ff] border-l-[#0066ff] animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
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
        <p className="mt-8 text-sm tracking-widest uppercase animate-pulse" style={{ color: 'var(--text-muted)' }}>
          Initialising Portfolio…
        </p>
        <div className="mt-4 w-48 h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
          <div
            className="h-full bg-gradient-to-r from-[#00d4ff] to-[#0066ff] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// ============================================
// COMPONENT: ParticleCanvas
// ============================================

interface ParticleCanvasProps {
  isDark: boolean;
}

const ParticleCanvas: FC<ParticleCanvasProps> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<MousePosition>({ x: null, y: null });
  const animationRef = useRef<number>(0);

  const initParticles = useCallback((width: number, height: number): Particle[] => {
    const particles: Particle[] = [];
    const particleCount = Math.min(80, Math.floor((width * height) / 15000));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }
    return particles;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particleColor = isDark ? 'rgba(0, 212, 255, 0.6)' : 'rgba(0, 102, 255, 0.5)';
    const lineColor = isDark ? 'rgba(0, 212, 255, 0.15)' : 'rgba(0, 102, 255, 0.1)';

    particles.forEach((particle, i) => {
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100 && distance > 0) {
          const force = (100 - distance) / 100;
          particle.vx += (dx / distance) * force * 0.5;
          particle.vy += (dy / distance) * force * 0.5;
        }
      }

      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

      particle.x = Math.max(0, Math.min(canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(canvas.height, particle.y));

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particleColor;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particle.x - particles[j].x;
        const dy = particle.y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 1 - distance / 120;
          ctx.stroke();
        }
      }
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = initParticles(canvas.width, canvas.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
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
  const isScrolled = scrollY > 80;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'backdrop-blur-xl border-b'
        : 'bg-transparent'
        }`}
      style={isScrolled ? { background: 'var(--bg-nav)', borderColor: 'var(--border-color)' } : {}}
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
              className="w-10 h-10 object-contain rounded-lg"
            />
            <span className="hidden sm:block text-lg font-bold bg-gradient-to-r from-[#00d4ff] to-[#0066ff] bg-clip-text text-transparent">
              Kavisha Kalhara
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative ${activeSection === link.id
                  ? 'text-[#00d4ff]'
                  : ''
                  }`}
                style={activeSection !== link.id ? { color: 'var(--text-muted)' } : {}}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-[#00d4ff] to-[#0066ff] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl transition-all duration-300 hover:scale-110"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-5 h-5 text-[#00d4ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-[#0066ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl transition-all duration-300"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
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

        {/* Mobile Navigation Dropdown */}
        {mobileOpen && (
          <div
            className="md:hidden py-4 border-t backdrop-blur-xl rounded-b-2xl"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-nav)' }}
          >
            <div className="flex flex-col space-y-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => { onNavigate(link.id); setMobileOpen(false); }}
                  className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all duration-300 ${activeSection === link.id
                    ? 'text-[#00d4ff] bg-[#00d4ff]/10'
                    : ''
                    }`}
                  style={activeSection !== link.id ? { color: 'var(--text-secondary)' } : {}}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
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
      <span className="animate-pulse text-[#00d4ff]">|</span>
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
  const [ref, isVisible] = useIntersectionObserver();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      hasAnimated.current = true;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(easeOut * value));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isVisible, value, duration]);

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>}>
      {count}{suffix}
    </span>
  );
};

// ============================================
// COMPONENT: HeroSection
// ============================================

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

const HeroSection: FC<HeroSectionProps> = ({ onNavigate }) => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <section
      id="home"
      ref={ref as React.RefObject<HTMLElement>}
      className="min-h-screen flex flex-col items-center justify-center relative px-4 pt-16"
    >
      <div
        className={`text-center max-w-4xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
      >
        {/* University Badge with Logo */}
        <div
          className="inline-flex items-center gap-3 px-5 py-3 rounded-full backdrop-blur-sm mb-8"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/University_of_Peradeniya_Crest.svg/120px-University_of_Peradeniya_Crest.svg.png"
            alt="University of Peradeniya"
            className="w-8 h-8 object-contain"
          />
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>University of Peradeniya · Sri Lanka</span>
        </div>

        {/* Main Logo */}
        <div className="mb-8 flex justify-center">
          <img
            src="./images/logo.png"
            alt="Kavisha Rashmika Kalhara"
            className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-[0_0_30px_rgba(0,212,255,0.3)]"
          />
        </div>

        {/* Name */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-[#00d4ff] via-[#00b4d8] to-[#0077b6] bg-clip-text text-transparent">
            Kavisha Rashmika Kalhara
          </span>
        </h1>

        {/* Typewriter */}
        <p className="text-lg sm:text-xl mb-10 h-8" style={{ color: 'var(--text-muted)' }}>
          <Typewriter texts={TYPEWRITER_ROLES} speed={80} deleteSpeed={40} pause={1500} />
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => onNavigate('projects')}
            className="group px-8 py-3 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#0066ff] text-white font-medium hover:shadow-lg hover:shadow-[#00d4ff]/25 transition-all duration-300 flex items-center gap-2"
          >
            <span>View Projects</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>

          <button
            className="group px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            <span>📄</span>
            <span>Resume</span>
          </button>

          <button
            onClick={() => onNavigate('contact')}
            className="group px-8 py-3 rounded-full border border-[#00d4ff]/50 text-[#00d4ff] font-medium hover:bg-[#00d4ff]/10 transition-all duration-300"
          >
            Contact Me
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-[#00d4ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

// ============================================
// COMPONENT: StatsBar
// ============================================

const StatsBar: FC = () => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {STATS_DATA.map((stat, index) => (
            <div
              key={stat.label}
              className={`group relative p-6 rounded-2xl backdrop-blur-sm transition-all duration-500 hover:scale-[1.03] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
              style={{
                transitionDelay: `${index * 100}ms`,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 4px 24px var(--shadow-color)',
              }}
            >
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#00d4ff] to-[#0066ff] opacity-50" />

              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#00d4ff] to-[#0066ff] bg-clip-text text-transparent mb-1">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// COMPONENT: AboutSection
// ============================================

const AboutSection: FC = () => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <section id="about" ref={ref as React.RefObject<HTMLElement>} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            About <span className="bg-gradient-to-r from-[#00d4ff] to-[#0066ff] bg-clip-text text-transparent">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#00d4ff] to-[#0066ff] rounded-full mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Column */}
          <div
            className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
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
              <h3 className="text-sm font-medium mb-4 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {SKILL_TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-sm hover:border-[#00d4ff]/50 hover:text-[#00d4ff] transition-all duration-300 cursor-default"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Profile Card */}
          <div
            className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
          >
            <div
              className="relative p-8 rounded-2xl backdrop-blur-sm"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: '0 8px 32px var(--shadow-color)' }}
            >
              {/* Profile Photo */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#0066ff] animate-pulse blur-md" />
                  <div className="relative w-32 h-32 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#0066ff] p-1">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img
                        src="./images/profile.jpg"
                        alt="Kavisha Kalhara"
                        className="w-full h-full object-cover"
                      />
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
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/University_of_Peradeniya_Crest.svg/40px-University_of_Peradeniya_Crest.svg.png"
                    alt="UoP"
                    className="w-6 h-6 object-contain"
                  />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>University of Peradeniya</span>
                </div>
              </div>

              {/* Quick Info Pills */}
              <div className="flex flex-wrap justify-center gap-3">
                {[{ icon: '📍', text: 'Sri Lanka' }, { icon: '🎓', text: 'Year 1' }, { icon: '💼', text: 'Open to Internships' }].map((pill) => (
                  <div
                    key={pill.text}
                    className="flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                  >
                    <span>{pill.icon}</span>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{pill.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// COMPONENT: EducationTimeline
// ============================================

const EducationTimeline: FC = () => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <section id="education" ref={ref as React.RefObject<HTMLElement>} className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Education & <span className="bg-gradient-to-r from-[#00d4ff] to-[#0066ff] bg-clip-text text-transparent">Journey</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#00d4ff] to-[#0066ff] rounded-full mx-auto" />
        </div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00d4ff] via-[#0066ff] to-transparent" />

          {EDUCATION_TIMELINE.map((item, index) => (
            <div
              key={index}
              className={`relative flex items-start mb-8 md:mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
            >
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#0066ff] z-10" style={{ border: '4px solid var(--bg-primary)' }} />

              <div
                className={`ml-12 md:ml-0 md:w-[45%] ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                  } transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${index % 2 === 0 ? '-translate-x-5' : 'translate-x-5'}`
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className="p-6 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: '0 4px 24px var(--shadow-color)' }}
                >
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#00d4ff]/20 to-[#0066ff]/20 text-[#00d4ff] mb-3">
                    {item.date}
                  </span>
                  <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                  <p className="text-sm text-[#00b4d8] mb-2">{item.institution}</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// COMPONENT: SkillBar
// ============================================

interface SkillBarProps {
  name: string;
  percentage: number;
  delay: number;
  isVisible: boolean;
}

const SkillBar: FC<SkillBarProps> = ({ name, percentage, delay, isVisible }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setWidth(percentage);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, percentage, delay]);

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{name}</span>
        <span className="text-sm text-[#00d4ff]">{percentage}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-card)' }}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#00d4ff] to-[#0066ff] transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
};

// ============================================
// COMPONENT: SkillsSection
// ============================================

const SkillsSection: FC = () => {
  const [ref, isVisible] = useIntersectionObserver();

  const skillCategories: { id: keyof SkillCategory; title: string }[] = [
    { id: 'programming', title: '💻 Programming Languages' },
    { id: 'robotics', title: '🤖 Robotics & Embedded' },
    { id: 'tools', title: '🔧 Tools & Platforms' },
  ];

  return (
    <section id="skills" ref={ref as React.RefObject<HTMLElement>} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Technical <span className="bg-gradient-to-r from-[#00d4ff] to-[#0066ff] bg-clip-text text-transparent">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#00d4ff] to-[#0066ff] rounded-full mx-auto" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {skillCategories.map((category, catIndex) => (
            <div
              key={category.id}
              className={`p-6 rounded-2xl backdrop-blur-sm transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
              style={{ transitionDelay: `${catIndex * 150}ms`, background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>{category.title}</h3>
              {SKILLS_DATA[category.id].map((skill, skillIndex) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  percentage={skill.percentage}
                  delay={catIndex * 150 + skillIndex * 100}
                  isVisible={isVisible}
                />
              ))}
            </div>
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
  isVisible: boolean;
}

const ProjectCard: FC<ProjectCardProps> = ({ project, index, isVisible }) => {
  return (
    <div
      className={`group relative rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lg ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      style={{ transitionDelay: `${index * 100}ms`, background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t to-transparent" style={{ background: 'linear-gradient(to top, var(--bg-primary), transparent)' }} />

        {project.featured && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#00d4ff] to-[#0066ff] text-white">
            🔌 Featured
          </div>
        )}

        <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm capitalize" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
          {project.category === 'exhibition' ? '🚀 Exhibit' : project.category}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold mb-2 transition-colors" style={{ color: 'var(--text-primary)' }}>
          {project.title}
        </h3>
        <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded-md text-xs"
              style={{ background: 'var(--badge-bg)', color: 'var(--text-muted)' }}
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
              className="flex items-center justify-center w-10 h-10 rounded-lg transition-all"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
              aria-label="View on GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          )}
          <button
            className="flex items-center justify-center w-10 h-10 rounded-lg transition-all"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
            aria-label="View details"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// COMPONENT: ProjectsSection
// ============================================

const ProjectsSection: FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [ref, isVisible] = useIntersectionObserver();

  const filteredProjects = activeFilter === 'all'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter(p => p.category === activeFilter);

  return (
    <section id="projects" ref={ref as React.RefObject<HTMLElement>} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Featured <span className="bg-gradient-to-r from-[#00d4ff] to-[#0066ff] bg-clip-text text-transparent">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#00d4ff] to-[#0066ff] rounded-full mx-auto mb-8" />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {PROJECT_FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeFilter === filter.id
                ? 'bg-gradient-to-r from-[#00d4ff] to-[#0066ff] text-white'
                : ''
                }`}
              style={activeFilter !== filter.id ? { background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' } : {}}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// COMPONENT: ContactSection
// ============================================

const ContactSection: FC = () => {
  const [ref, isVisible] = useIntersectionObserver();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });

    setTimeout(() => setSubmitStatus(null), 3000);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactInfo: ContactInfo[] = [
    { icon: '📧', label: 'Email', value: 'kavisha.kalhara@eng.pdn.ac.lk', href: 'mailto:kavisha.kalhara@eng.pdn.ac.lk' },
    { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/kavishakalhara', href: 'https://linkedin.com' },
    { icon: '🐙', label: 'GitHub', value: 'github.com/kavishakalhara', href: 'https://github.com' },
  ];

  return (
    <section id="contact" ref={ref as React.RefObject<HTMLElement>} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Get In <span className="bg-gradient-to-r from-[#00d4ff] to-[#0066ff] bg-clip-text text-transparent">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#00d4ff] to-[#0066ff] rounded-full mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div
            className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
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
                  className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
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
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          <div
            className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="peer w-full px-4 py-3 rounded-xl placeholder-transparent focus:outline-none transition-colors"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }}
                  placeholder="Name"
                />
                <label className="absolute left-4 top-3 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:px-1 pointer-events-none floating-label" style={{ color: 'var(--text-muted)' }}>
                  Name
                </label>
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="peer w-full px-4 py-3 rounded-xl placeholder-transparent focus:outline-none transition-colors"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }}
                  placeholder="Email"
                />
                <label className="absolute left-4 top-3 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:px-1 pointer-events-none floating-label" style={{ color: 'var(--text-muted)' }}>
                  Email
                </label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="peer w-full px-4 py-3 rounded-xl placeholder-transparent focus:outline-none transition-colors"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }}
                  placeholder="Subject"
                />
                <label className="absolute left-4 top-3 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:px-1 pointer-events-none floating-label" style={{ color: 'var(--text-muted)' }}>
                  Subject
                </label>
              </div>

              <div className="relative">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="peer w-full px-4 py-3 rounded-xl placeholder-transparent focus:outline-none transition-colors resize-none"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }}
                  placeholder="Message"
                />
                <label className="absolute left-4 top-3 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:px-1 pointer-events-none floating-label" style={{ color: 'var(--text-muted)' }}>
                  Message
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#0066ff] text-white font-medium hover:shadow-lg hover:shadow-[#00d4ff]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-center">
                  Message sent successfully! I'll get back to you soon.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// COMPONENT: GallerySection
// ============================================

const GallerySection: FC = () => {
  const [ref, isVisible] = useIntersectionObserver();
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(GALLERY_DATA.map(item => item.category)))];

  const filteredImages = activeFilter === 'All'
    ? GALLERY_DATA
    : GALLERY_DATA.filter(item => item.category === activeFilter);

  return (
    <section id="gallery" ref={ref as React.RefObject<HTMLElement>} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Photo <span className="bg-gradient-to-r from-[#00d4ff] to-[#0066ff] bg-clip-text text-transparent">Gallery</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#00d4ff] to-[#0066ff] rounded-full mx-auto mb-4" />
          <p className="max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>Featured moments from events, projects, and campus life</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeFilter === cat
                ? 'bg-gradient-to-r from-[#00d4ff] to-[#0066ff] text-white shadow-lg shadow-[#00d4ff]/25'
                : ''
                }`}
              style={activeFilter !== cat ? { background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filteredImages.map((item, index) => (
            <div
              key={item.id}
              className={`break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => setSelectedImage(item)}
            >
              {/* Image */}
              <img
                src={item.src}
                alt={item.caption}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5" style={{ background: 'linear-gradient(to top, var(--bg-primary), rgba(0,0,0,0.2), transparent)' }}>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30 w-fit mb-2">
                  {item.category}
                </span>
                <p className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{item.caption}</p>
              </div>

              {/* Glow Border on Hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#00d4ff]/40 transition-all duration-300 pointer-events-none" />

              {/* Zoom Icon */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-50" style={{ background: 'var(--overlay-bg)', border: '1px solid var(--border-color)' }}>
                <svg className="w-5 h-5 text-[#00d4ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 backdrop-blur-xl" style={{ background: 'var(--overlay-bg)', animation: 'fadeIn 0.3s ease-out' }} />

          {/* Content */}
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'scaleIn 0.3s ease-out' }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all z-10"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-[#00d4ff]/10">
              <img
                src={selectedImage.src}
                alt={selectedImage.caption}
                className="max-w-full max-h-[75vh] object-contain"
              />
            </div>

            {/* Caption */}
            <div className="mt-4 text-center">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30 mb-2">
                {selectedImage.category}
              </span>
              <p className="text-white text-lg font-semibold">{selectedImage.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// ============================================
// COMPONENT: Footer
// ============================================

const Footer: FC = () => {
  return (
    <footer className="py-12 px-4" style={{ borderTop: '1px solid var(--border-color)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src="./images/logo.png"
              alt="KRK"
              className="w-12 h-12 object-contain rounded-lg"
            />
          </div>

          <p className="mb-6" style={{ color: 'var(--text-muted)' }}>Building the future, one line of code at a time.</p>

          <div className="flex justify-center gap-4 mb-8">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:text-[#00d4ff]"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:text-[#00d4ff]"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:text-[#00d4ff]"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>

          <p className="text-sm" style={{ color: 'var(--text-faint)' }}>
            © {new Date().getFullYear()} Kavisha Rashmika Kalhara. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

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
      className={`fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#0066ff] text-white shadow-lg shadow-[#00d4ff]/25 transition-all duration-300 flex items-center justify-center z-40 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      aria-label="Scroll to top"
    >
      <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    NAV_LINKS.forEach((link) => {
      const element = document.getElementById(link.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div data-theme={isDark ? 'dark' : 'light'}>
      <div className="min-h-screen transition-colors duration-500" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <ParticleCanvas isDark={isDark} />

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
