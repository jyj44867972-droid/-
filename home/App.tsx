
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { client, urlFor } from '../sanity';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Intro Sub-component (Section 1) ---
const IntroSection: React.FC = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBackground = async () => {
      try {
        // Fetch the home document specifically for the hero image
        const query = `*[_type == "home"][0]{heroImage}`;
        const data = await client.fetch(query);
        
        if (data && data.heroImage) {
          const imageUrl = urlFor(data.heroImage).url();
          setHeroImage(imageUrl);
        }
      } catch (error) {
        console.error("Failed to fetch hero image:", error);
      }
    };
    fetchBackground();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    
    setTilt({
      x: y * -8, 
      y: x * 8   
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <div 
      className="main-grid bg-[#fcfcfc] relative overflow-hidden h-screen bg-cover bg-center bg-no-repeat"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        perspective: '1500px', 
        backgroundImage: heroImage ? `url(${heroImage})` : 'none' 
      }}
    >
      {/* Background Overlay removed for full brightness */}
      
      <div 
        className="col-span-12 md:col-span-10 md:col-start-2 flex flex-col justify-center items-center text-center md:items-start md:text-left transition-transform duration-500 ease-out will-change-transform font-pretendard relative z-10"
        style={{ 
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) rotate(-10deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        <h1 
          className="text-[12px] md:text-[24px] lg:text-[16px] font-light tracking-[1em] text-[#C8C8C8] select-none break-keep leading-[1.8] opacity-80 max-w-lg mx-auto text-center"
        >
          안녕하세요. 저는 탄탄한 기획을 바탕으로 아이디어를 확장하고,
          이를 시각적으로 정확하고 감각 있게 담아내기 위해 꾸준히 탐구하는 
          디자이너 정예진입니다.
        </h1>
      </div>
    </div>
  );
};

// --- Project List Sub-component (Section 2) ---
interface ProjectItem {
  _id: string;
  number: string;
  title: string;
  description: string;
}

const ProjectListSection: React.FC<{ 
  projects: ProjectItem[], 
  onSelectProject?: (id: string | null) => void 
}> = ({ projects, onSelectProject }) => {
  return (
    <div className="bg-[#fcfcfc] h-screen pt-[240px] pb-[40px] md:pb-[100px] font-pretendard relative flex flex-col px-[var(--grid-margin)]">
      <div className="grid grid-cols-6 md:grid-cols-12 gap-[var(--grid-gutter)] w-full">
        {/* Name: 5th grid from right (Col 8) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="col-start-4 md:col-start-8 col-span-3 md:col-span-1 flex items-baseline gap-2 whitespace-nowrap -mt-6"
        >
          <span className="text-[13px] font-light text-[#111]">정예진</span>
          <span className="text-[13px] font-light text-[#888]">Jeong Ye Jin</span>
        </motion.div>

        {/* Description: 4th grid from right (Col 9) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="col-start-1 md:col-start-9 col-span-6 md:col-span-4 mt-4 md:mt-4"
        >
          <p 
            className="text-[13px] text-[#333] break-keep font-light"
            style={{ lineHeight: 1.6 }}
          >
            안녕하세요. 저는 탄탄한 기획을 바탕으로 아이디어를 확장하고, <br className="hidden md:block" />
            이를 시각적으로 정확하고 감각 있게 담아내기 위해 꾸준히 탐구하는 <br className="hidden md:block" />
            디자이너 정예진입니다.
          </p>
        </motion.div>
      </div>

      {/* Projects List */}
      <div className="mt-auto">
        <div className="flex flex-col border-t border-[#eee]">
          {projects.map((project, index) => (
            <motion.button 
              key={project._id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.05, ease: [0.23, 1, 0.32, 1] }}
              onClick={() => onSelectProject?.(project._id)}
              className="group grid grid-cols-6 md:grid-cols-12 gap-[var(--grid-gutter)] items-center py-1.5 border-b border-[#eee] transition-all duration-300 hover:bg-[#f9f9f9] text-left w-full"
            >
              <span className="col-span-1 text-[14px] font-light text-brand-orange tabular-nums">
                {project.number || (index + 1).toString().padStart(2, '0')}
              </span>
              <span className="col-start-2 md:col-start-3 col-span-2 md:col-span-3 text-[14px] font-light text-[#111] tracking-tight">
                {project.title}
              </span>
              <span className="col-start-4 md:col-start-6 col-span-2 md:col-span-6 text-[14px] text-[#888] font-light truncate">
                {project.description}
              </span>
              <div className="col-start-6 md:col-start-12 flex justify-end">
                <ArrowRight className="w-4 h-4 text-[#ccc] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-orange" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main Home Component ---
interface TrailLetter {
  id: number;
  char: string;
  x: number;
  y: number;
}

const HomeApp: React.FC<{ 
  onSelectProject?: (id: string | null) => void,
  onScroll?: (isScrolled: boolean) => void
}> = ({ onSelectProject, onScroll }) => {
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [trail, setTrail] = useState<TrailLetter[]>([]);
  const letters = "jeongyejin".split("");
  const letterIndexRef = useRef(0);
  const lastPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const dist = Math.hypot(e.clientX - lastPosRef.current.x, e.clientY - lastPosRef.current.y);
      
      // Increased distance threshold for "disjointed" feel
      if (dist > 80) {
        const newLetter: TrailLetter = {
          id: Date.now(),
          char: letters[letterIndexRef.current],
          x: e.clientX,
          y: e.clientY
        };
        
        setTrail(prev => [...prev.slice(-12), newLetter]);
        letterIndexRef.current = (letterIndexRef.current + 1) % letters.length;
        lastPosRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTrail(prev => prev.filter(item => Date.now() - item.id < 1200));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // 최신 5개 프로젝트 가져오기
        const query = `*[_type == "project"] | order(number asc)[0...5]`;
        const data = await client.fetch(query);
        if (data && data.length > 0) {
          setProjects(data);
        } else {
          // Mock data fallback
          const mockProjects: ProjectItem[] = [
            { _id: 'mock-1', number: '01', title: '프로젝트 명', description: '프로젝트 설명' },
            { _id: 'mock-2', number: '02', title: '웹사이트 리뉴얼', description: '기존 웹사이트 UI/UX 개선' },
            { _id: 'mock-3', number: '03', title: '모바일 앱 개발', description: '사용자 친화적인 앱 인터페이스 설계' },
            { _id: 'mock-4', number: '04', title: '이커머스 플랫폼 구축', description: '온라인 쇼핑몰 시스템 통합' },
            { _id: 'mock-5', number: '05', title: '소셜 미디어 캠페인', description: '브랜드 인지도 상승을 위한 전략' },
          ];
          setProjects(mockProjects);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        // Mock data fallback on error
        const mockProjects: ProjectItem[] = [
          { _id: 'mock-1', number: '01', title: '프로젝트 명', description: '프로젝트 설명' },
          { _id: 'mock-2', number: '02', title: '웹사이트 리뉴얼', description: '기존 웹사이트 UI/UX 개선' },
          { _id: 'mock-3', number: '03', title: '모바일 앱 개발', description: '사용자 친화적인 앱 인터페이스 설계' },
          { _id: 'mock-4', number: '04', title: '이커머스 플랫폼 구축', description: '온라인 쇼핑몰 통합' },
          { _id: 'mock-5', number: '05', title: '소셜 미디어 캠페인', description: '브랜드 인지도 상승을 위한 전략' },
        ];
        setProjects(mockProjects);
      }
    };
    fetchProjects();

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const scrollContainer = document.querySelector('.home-scroll-container');
    
    const handleScroll = () => {
      if (!scrollContainer) return;
      const scrollY = scrollContainer.scrollTop;
      const windowHeight = window.innerHeight;
      
      const newOpacity = Math.max(0, 1 - (scrollY / (windowHeight * 0.4)));
      setScrollOpacity(newOpacity);
      
      if (onScroll) {
        onScroll(scrollY > 50);
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Mouse Trail Letters - Global to HomeApp */}
      <AnimatePresence>
        {trail.map((letter) => (
          <motion.div
            key={letter.id}
            initial={{ opacity: 0, scale: 0.5, x: letter.x, y: letter.y }}
            animate={{ opacity: 1, scale: 1, x: letter.x, y: letter.y }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: "backOut" }}
            className="fixed pointer-events-none z-[2000] text-brand-orange font-gowun text-[28px] font-bold"
            style={{ left: -14, top: -14 }} // Center the larger text roughly
          >
            {letter.char}
          </motion.div>
        ))}
      </AnimatePresence>

      <main className="home-scroll-container snap-y snap-mandatory h-screen overflow-y-scroll no-scrollbar scroll-smooth">
        <section id="home-intro" className="snap-start w-full h-screen">
          <IntroSection />
        </section>
        <section id="home-projects" className="snap-start w-full h-screen">
          <ProjectListSection projects={projects} onSelectProject={onSelectProject} />
        </section>
      </main>
    </div>
  );
};

export default HomeApp;
