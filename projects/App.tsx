
import React, { useState, useEffect, useRef } from 'react';
import ProjectDetail from './ProjectDetail';
import { client, urlFor } from '../sanity';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ProjectItem {
  _id: string;
  number: string;
  title: string;
  description: string;
  longDescription: string;
  aspectRatio: string;
  mainImage: string;
  images: string[];
}

const ProjectCard: React.FC<{ 
  project: ProjectItem; 
  itemWidth: string; 
  index: number; 
  isMobile: boolean;
  onSelect: (id: string) => void;
}> = ({ project, itemWidth, index, isMobile, onSelect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { 
        threshold: 0.1,
        rootMargin: '0px' 
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const motionClass = isMobile 
    ? (isVisible ? 'opacity-100' : 'opacity-0')
    : (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20');

  return (
    <div 
      ref={cardRef}
      onClick={() => onSelect(project._id)}
      className={`group flex flex-col shrink-0 cursor-pointer transition-all duration-[1000ms] cubic-bezier(0.23, 1, 0.32, 1) ${motionClass}`}
      style={{ 
        width: itemWidth,
        marginRight: 'var(--grid-gutter)',
        transitionDelay: isVisible ? `${index % 4 * 100}ms` : '0ms'
      }}
    >
      {/* 이미지 영역: 상단으로 이동 */}
      <div className="w-full aspect-video overflow-hidden bg-[#E2E2E2] transition-all duration-700 ease-out shadow-sm group-hover:brightness-[0.97] group-hover:shadow-md">
        <img 
          src={project.mainImage} 
          alt={project.title}
          className={`w-full h-full object-cover transition-all duration-[1200ms] ease-in-out ${isMobile ? 'scale-100' : 'scale-105'} group-hover:scale-100 block`}
          loading="lazy"
        />
      </div>

      {/* 텍스트 영역: 이미지 하단으로 이동 및 레이아웃 변경 */}
      <div className="flex flex-col text-left mt-4 px-1">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="text-[14px] md:text-[18px] font-medium text-[#111] font-pretendard tracking-tight leading-tight">
            {project.title}
          </h3>
          <span className="text-[14px] md:text-[18px] font-medium text-brand-orange font-pretendard tabular-nums">
            {project.number}
          </span>
        </div>
        <p className="text-[11px] md:text-[13px] text-[#888] font-pretendard leading-[1.6] break-words max-w-full">
          {project.description}
        </p>
      </div>
    </div>
  );
};

interface ProjectAppProps {
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
}

const ProjectApp: React.FC<ProjectAppProps> = ({ selectedProjectId, onSelectProject }) => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState<'scroll' | 'single'>('scroll');
  const [currentIdx, setCurrentIdx] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const query = `*[_type == "project"] | order(number asc)`;
        const data = await client.fetch(query);
        if (data && data.length > 0) {
          const formattedData = data.map((p: any) => ({
            _id: p._id,
            number: p.number || '',
            title: p.title || '',
            description: p.description || '',
            longDescription: p.longDescription || '',
            aspectRatio: p.aspectRatio || '',
            mainImage: p.mainImage ? urlFor(p.mainImage).url() : '',
            images: p.images ? p.images.map((img: any) => urlFor(img).url()) : []
          }));
          setProjects(formattedData);
        } else {
          throw new Error("No data");
        }
      } catch (error) {
        console.error("Failed to fetch projects from Sanity, using mock data:", error);
        const mockProjects: ProjectItem[] = [
          {
            _id: 'mock-1',
            number: '01',
            title: 'Minimalist Branding',
            description: 'A clean branding project for a modern architecture firm.',
            longDescription: 'This project focuses on the intersection of space and identity. We developed a visual language that reflects the firm\'s commitment to precision and sustainability.',
            aspectRatio: '16/9',
            mainImage: 'https://picsum.photos/seed/p1/1200/800',
            images: ['https://picsum.photos/seed/p1-1/1200/800', 'https://picsum.photos/seed/p1-2/1200/800']
          },
          {
            _id: 'mock-2',
            number: '02',
            title: 'Editorial Design',
            description: 'Magazine layout design with a focus on typography and white space.',
            longDescription: 'Exploring the limits of grid systems in editorial contexts. This publication features experimental layouts that challenge traditional reading patterns.',
            aspectRatio: '3/4',
            mainImage: 'https://picsum.photos/seed/p2/800/1200',
            images: ['https://picsum.photos/seed/p2-1/800/1200']
          },
          {
            _id: 'mock-3',
            number: '03',
            title: 'Digital Experience',
            description: 'Interactive web experience for a creative agency.',
            longDescription: 'A highly interactive portfolio site that uses motion and depth to tell the story of the agency\'s creative process.',
            aspectRatio: '1/1',
            mainImage: 'https://picsum.photos/seed/p3/1000/1000',
            images: ['https://picsum.photos/seed/p3-1/1000/1000']
          }
        ];
        setProjects(mockProjects);
      }
    };
    fetchProjects();
  }, []);

  const selectedProject = projects.find(p => p._id === selectedProjectId) || null;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const container = scrollContainerRef.current;
    if (container && !selectedProject && viewMode === 'scroll') {
      const handleWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          container.scrollLeft += e.deltaY;
        }
      };
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        window.removeEventListener('resize', checkMobile);
        container.removeEventListener('wheel', handleWheel);
      };
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [selectedProject, viewMode]);

  const colWidthDesktop = `calc((100vw - (2 * var(--grid-margin)) - (11 * var(--grid-gutter))) / 12)`;
  const colWidthMobile = `calc((100vw - (2 * var(--grid-margin)) - (5 * var(--grid-gutter))) / 6)`;
  
  const itemWidthDesktop = `calc(5 * ${colWidthDesktop} + 4 * var(--grid-gutter))`;
  const itemWidthMobile = `calc(4 * ${colWidthMobile} + 3 * var(--grid-gutter))`;
  const itemWidth11Col = isMobile 
    ? `calc(5 * ${colWidthMobile} + 4 * var(--grid-gutter))` 
    : `calc(11 * ${colWidthDesktop} + 10 * var(--grid-gutter))`;

  // 정확한 텍스트 영역 높이 계산 (여백 포함)
  const textHeightScroll = isMobile ? '70px' : '85px';
  
  const scrollButtonsBottom = `calc(2vh + ${textHeightScroll} + (${isMobile ? itemWidthMobile : itemWidthDesktop}) * 9 / 16 + 5px)`;
  
  const leftOffset = isMobile 
    ? 'var(--grid-margin)' 
    : `calc(var(--grid-margin) + (3 * ${colWidthDesktop}) + (3 * var(--grid-gutter)))`;

  const nextProject = () => {
    setCurrentIdx((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentIdx((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <div className="w-full h-screen bg-brand-bg flex flex-col overflow-hidden relative">
      
      {selectedProject && (
        <ProjectDetail 
          project={selectedProject} 
          isMobile={isMobile}
          onBack={() => onSelectProject(null)}
        />
      )}

      <div className={`flex-grow flex flex-col overflow-hidden relative h-full transition-opacity duration-500 ${selectedProject ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* 인스타 및 메일 정보 영역: 그리드 모드(scroll)일 때만 크게 표시, 세로로 배치 */}
        <AnimatePresence>
          {viewMode === 'scroll' && !isMobile && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.05, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="absolute top-[15vh] left-[var(--grid-margin)] z-10 pointer-events-none"
            >
              <h1 className="text-[30px] md:text-[50px] lg:text-[70px] font-black text-[#111] font-pretendard tracking-tighter leading-[1.1]">
              
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        <div 
          ref={scrollContainerRef}
          className={`flex h-full no-scrollbar scroll-smooth project-scroll-container overscroll-behavior-x-contain ${viewMode === 'scroll' ? 'overflow-x-auto overflow-y-hidden' : 'overflow-x-hidden overflow-y-auto'}`}
        >
          <AnimatePresence mode="wait">
            {viewMode === 'scroll' ? (
              <motion.div 
                key="scroll-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="flex h-full"
              >
                {/* 시작 여백: 인스타 텍스트와 동일한 위치에서 시작하도록 var(--grid-margin) 사용. 모바일에서는 버튼과의 겹침 방지를 위해 한 칸 띄움 */}
                <div 
                  className="shrink-0 h-full pointer-events-none" 
                  style={{ width: isMobile ? `calc(var(--grid-margin) + ${colWidthMobile} + var(--grid-gutter))` : 'var(--grid-margin)' }} 
                />

                <div className="flex items-end pb-[2vh] h-full">
                  {projects.map((project, index) => (
                    <ProjectCard 
                      key={project._id} 
                      project={project} 
                      index={index}
                      isMobile={isMobile}
                      onSelect={(id) => onSelectProject(id)}
                      itemWidth={isMobile ? itemWidthMobile : itemWidthDesktop} 
                    />
                  ))}
                </div>

                <div className="shrink-0 w-[20vw] h-full pointer-events-none" />
              </motion.div>
            ) : (
              <motion.div 
                key="single-view"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="w-full flex flex-col pt-[35vh] relative"
              >
                {/* 뷰 모드 토글 아이콘 버튼: 싱글 모드일 때 스크롤되도록 내부에 배치 */}
                <div 
                  className="absolute left-[var(--grid-margin)] z-[60] flex flex-col items-start gap-1 pointer-events-auto"
                  style={{ top: '30vh' }}
                >
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setViewMode('scroll');
                      }}
                      className="transition-all p-1 text-[#ccc] hover:text-[#111]"
                      title="Grid View"
                    >
                      <div className="flex flex-row gap-[3px]">
                        <div className="w-[1px] h-[18px] bg-current" />
                        <div className="w-[1px] h-[18px] bg-current" />
                        <div className="w-[1px] h-[18px] bg-current" />
                      </div>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setViewMode('single');
                      }}
                      className="transition-all p-1 text-brand-orange"
                      title="Single View"
                    >
                      <div className="relative w-[18px] h-[18px] flex items-center justify-center">
                        <div className="absolute w-full h-[1px] bg-current" />
                        <div className="absolute w-[1px] h-full bg-current" />
                      </div>
                    </button>
                  </div>
                </div>

                {projects.map((p, index) => (
                  <div key={p._id} className={`w-full border-b border-[#ddd] flex group ${index === 0 ? 'border-t' : ''}`}>
                    {/* Left Section: Text */}
                    <div className="w-1/2 flex flex-col pl-[var(--grid-margin)] pr-[var(--grid-gutter)] py-6 border-r border-[#ddd]">
                      <div className="flex justify-between items-start">
                        <h2 className="text-[15px] md:text-[17px] font-medium text-[#111] font-pretendard tracking-tighter leading-none">
                          {p.title}
                        </h2>
                        <span className="text-[15px] md:text-[17px] font-medium text-brand-orange font-pretendard tabular-nums leading-none">
                          {p.number}
                        </span>
                      </div>
                      <p className="text-[11px] md:text-[12px] text-[#888] font-pretendard mt-2 max-w-[300px] leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                    
                    {/* Right Section: Image */}
                    <div className="w-1/2 py-6">
                      <div 
                        className="w-full aspect-video bg-[#E2E2E2] overflow-hidden cursor-pointer shadow-sm relative"
                        onClick={() => onSelectProject(p._id)}
                      >
                        <img 
                          src={p.mainImage} 
                          alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {/* Bottom spacer */}
                <div className="h-[20vh] shrink-0" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 뷰 모드 토글 아이콘 버튼: 그리드 모드(scroll)일 때만 고정 위치에 표시 */}
        {!selectedProject && viewMode === 'scroll' && (
          <div 
            className="absolute left-[var(--grid-margin)] z-[60] flex flex-col items-start gap-1 pointer-events-auto"
            style={{ 
              bottom: scrollButtonsBottom
            }}
          >
            <div className="flex items-center gap-4">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setViewMode('scroll');
                }}
                className="transition-all p-1 text-brand-orange"
                title="Grid View"
              >
                <div className="flex flex-row gap-[3px]">
                  <div className="w-[1px] h-[18px] bg-current" />
                  <div className="w-[1px] h-[18px] bg-current" />
                  <div className="w-[1px] h-[18px] bg-current" />
                </div>
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setViewMode('single');
                }}
                className="transition-all p-1 text-[#ccc] hover:text-[#111]"
                title="Single View"
              >
                <div className="relative w-[18px] h-[18px] flex items-center justify-center">
                  <div className="absolute w-full h-[1px] bg-current" />
                  <div className="absolute w-[1px] h-full bg-current" />
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectApp;
