
import React, { useState, useEffect, useCallback } from 'react';
import { client, urlFor } from '../sanity';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Intro Sub-component (Section 1) ---
const IntroSection: React.FC = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

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
      className="main-grid bg-[#D8D8D8] relative overflow-hidden h-screen bg-cover bg-center bg-no-repeat"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1500px', backgroundImage: 'url(/path/to/your/image.jpg)' }}
    >
      <div 
        className="col-span-9 col-start-3 md:col-start-3 md:col-span-9 flex flex-col justify-center transition-transform duration-500 ease-out will-change-transform font-pretendard"
        style={{ 
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) rotate(14deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        <h1 
          className="text-sm md:text-lg lg:text-xl font-normal tracking-[0.7em] text-[#D8D8D8] select-none break-keep transition-colors duration-500 hover:text-brand-orange"
          style={{ lineHeight: 2.25 }}
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
    <div className="main-grid bg-[#fcfcfc] h-screen pt-[100px] pb-[100px] font-pretendard relative">
      {/* Name: 5th grid from right (Col 8) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="col-start-8 col-span-1 flex items-baseline gap-2 whitespace-nowrap -mt-6"
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
        className="col-start-9 col-span-4 mt-4"
      >
        <p 
          className="text-[13px] text-[#333] break-keep font-light"
          style={{ lineHeight: 1.6 }}
        >
          안녕하세요. 저는 탄탄한 기획을 바탕으로 아이디어를 확장하고, 
          이를 시각적으로 정확하고 감각 있게 담아내기 위해 꾸준히 탐구하는 
          디자이너 정예진입니다.
        </p>
      </motion.div>

      {/* Projects List */}
      <div className="col-span-12 mt-auto">
        <div className="flex flex-col border-t border-[#eee]">
          {projects.map((project, index) => (
            <motion.button 
              key={project._id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.05, ease: [0.23, 1, 0.32, 1] }}
              onClick={() => onSelectProject?.(project._id)}
              className="group main-grid items-center py-1.5 border-b border-[#eee] transition-all duration-300 hover:bg-[#f9f9f9] text-left w-full !px-0"
            >
              <span className="col-span-1 text-[14px] font-light text-brand-orange tabular-nums">
                {project.number || (index + 1).toString().padStart(2, '0')}
              </span>
              <span className="col-start-3 col-span-3 text-[14px] font-light text-[#111] tracking-tight">
                {project.title}
              </span>
              <span className="col-start-6 col-span-6 text-[14px] text-[#888] font-light truncate">
                {project.description}
              </span>
              <div className="col-start-12 flex justify-end">
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
const HomeApp: React.FC<{ onSelectProject?: (id: string | null) => void }> = ({ onSelectProject }) => {
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [projects, setProjects] = useState<ProjectItem[]>([]);

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
          { _id: 'mock-4', number: '04', title: '이커머스 플랫폼 구축', description: '온라인 쇼핑몰 시스템 통합' },
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
      {/* Fixed Home Footer Elements */}
      <div className="fixed bottom-8 left-0 w-full z-50 pointer-events-none font-gowun text-brand-orange text-[16px] md:text-[13px] tracking-tight">
        <div className="main-grid items-end">
          {isMobile ? (
            <>
              <div className="col-span-3 text-left flex flex-col leading-tight">
                <span>@2026</span>
                <span className="mt-1">Jeong Yejin</span>
              </div>
              <div 
                className="col-span-3 text-right transition-opacity duration-300 ease-out"
                style={{ opacity: scrollOpacity }}
              >
                <div className="animate-bounce-slow">
                  <span>scroll ↓</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="md:col-span-3 text-left">
                <span>@2026</span>
              </div>
              <div 
                className="md:col-start-6 md:col-span-2 flex justify-center transition-opacity duration-300 ease-out"
                style={{ opacity: scrollOpacity }}
              >
                <div className="flex flex-col items-center animate-bounce-slow">
                  <span>scroll ↓</span>
                </div>
              </div>
              <div className="md:col-start-10 md:col-span-3 text-right">
                <span>Jeong Yejin</span>
              </div>
            </>
          )}
        </div>
      </div>

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
