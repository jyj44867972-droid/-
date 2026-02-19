
import React, { useState, useEffect, useRef } from 'react';
import ProjectDetail from './ProjectDetail';

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

const initialProjects: ProjectItem[] = [
  {
    _id: 'p1',
    number: '01',
    title: 'Minimalist Branding System',
    description: '본질에 집중한 미니멀리즘 브랜드 아이덴티티 시스템입니다.',
    longDescription: '기존의 복잡함을 덜어내고 브랜드가 가진 가장 핵심적인 가치를 시각화하는 과정입니다. 서체의 간결함과 공간의 균형을 통해 브랜드의 신뢰도를 높였습니다.',
    aspectRatio: '16/9',
    mainImage: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  {
    _id: 'p2',
    number: '02',
    title: 'UI/UX Mobile Archive',
    description: '사용자 경험을 최우선으로 고려한 모바일 아카이브 서비스입니다.',
    longDescription: '편리한 정보 탐색과 감각적인 인터페이스를 결합한 새로운 형태의 디지털 경험입니다. 사용자의 행동 패턴을 분석하여 최적화된 동선을 설계했습니다.',
    aspectRatio: '16/9',
    mainImage: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  {
    _id: 'p3',
    number: '03',
    title: 'Art Direction: Objects',
    description: '공간과 사물이 조화를 이루는 감각적인 아트 디렉션 프로젝트입니다.',
    longDescription: '사물의 질감과 빛의 흐름을 조절하여 고유의 분위기를 만들어내는 실험적인 작업입니다. 정적인 사물에 생동감을 불어넣는 앵글을 고민했습니다.',
    aspectRatio: '16/9',
    mainImage: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502481851512-e9e2529bbbf9?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  {
    _id: 'p4',
    number: '04',
    title: 'Typographic Poster Series',
    description: '서체의 조형적 아름다움을 강조한 포스터 시리즈입니다.',
    longDescription: '텍스트가 가진 의미를 넘어 시각적인 조형물로서의 가치를 탐구했습니다. 레이아웃의 파격을 통해 메시지를 더욱 강렬하게 전달합니다.',
    aspectRatio: '16/9',
    mainImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518173946687-a4c8a07a7e8e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop'
    ]
  }
];

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
      className={`group flex flex-col h-full shrink-0 cursor-pointer transition-all duration-[1000ms] cubic-bezier(0.23, 1, 0.32, 1) ${motionClass}`}
      style={{ 
        width: itemWidth,
        marginRight: 'var(--grid-gutter)',
        transitionDelay: isVisible ? `${index % 4 * 100}ms` : '0ms'
      }}
    >
      {/* 텍스트 영역: mt 값을 늘려 아래로 조정 */}
      <div className="flex flex-col text-left mt-[170px] md:mt-[150px] lg:mt-[170px] transition-transform duration-500 group-hover:translate-x-1 px-1">
        <h2 
          className="text-[36px] md:text-[60px] lg:text-[84px] font-black text-[#E2E2E2] leading-none mb-3 select-none font-pretendard tracking-tighter ml-[-0.05em] pointer-events-none transition-colors duration-500 group-hover:text-brand-orange"
        >
          {project.number}
        </h2>
        <h3 className="text-[16px] md:text-[16px] font-bold text-[#111] mb-2 font-pretendard tracking-tight leading-tight">
          {project.title}
        </h3>
        <p className="text-[16px] md:text-[13px] text-[#888] font-pretendard leading-[1.6] break-keep pr-4 max-w-full">
          {project.description}
        </p>
      </div>
      <div className="mt-auto pb-[var(--safe-bottom)]">
        <div 
          className={`w-full overflow-hidden bg-[#E2E2E2] transition-all duration-700 ease-out shadow-sm group-hover:brightness-[0.97] group-hover:shadow-md rounded-sm`}
        >
          <img 
            src={project.mainImage} 
            alt={project.title}
            className={`w-full h-auto grayscale transition-all duration-[1200ms] ease-in-out ${isMobile ? 'scale-100' : 'scale-105'} group-hover:scale-100 group-hover:grayscale-0 block`}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

interface ProjectAppProps {
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
}

const ProjectApp: React.FC<ProjectAppProps> = ({ selectedProjectId, onSelectProject }) => {
  const [projects] = useState<ProjectItem[]>(initialProjects);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedProject = projects.find(p => p._id === selectedProjectId) || null;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const container = scrollContainerRef.current;
    if (container && !selectedProject) {
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
  }, [selectedProject]);

  const colWidthDesktop = `calc((100vw - (2 * var(--grid-margin)) - (11 * var(--grid-gutter))) / 12)`;
  const colWidthMobile = `calc((100vw - (2 * var(--grid-margin)) - (5 * var(--grid-gutter))) / 6)`;
  
  const itemWidthDesktop = `calc(2 * ${colWidthDesktop} + var(--grid-gutter))`;
  const itemWidthMobile = `calc(4 * ${colWidthMobile} + 3 * var(--grid-gutter))`;
  
  const leftOffset = isMobile 
    ? 'var(--grid-margin)' 
    : `calc(var(--grid-margin) + (3 * ${colWidthDesktop}) + (3 * var(--grid-gutter)))`;

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
        <div 
          ref={scrollContainerRef}
          className="flex h-full overflow-x-auto overflow-y-hidden no-scrollbar scroll-smooth project-scroll-container overscroll-behavior-x-contain"
        >
          {!isMobile && (
            <div className="shrink-0 h-full flex flex-col pointer-events-none" style={{ width: leftOffset }}>
               {/* 소개 문구 영역: mt 값을 늘려 아래로 조정 */}
               <div className="pl-[var(--grid-margin)] mt-[130px] md:mt-[150px] lg:mt-[170px]" style={{ width: `calc(3 * ${colWidthDesktop} + 2 * var(--grid-gutter))` }}>
                  <p className="text-[12px] md:text-[13px] text-[#888] font-normal leading-[1.6] break-keep text-left font-pretendard">
                    정교한 기획과 감각적인 시각화로<br />
                    완성된 프로젝트 아카이브입니다.
                  </p>
               </div>
            </div>
          )}

          {isMobile && <div className="shrink-0 w-[var(--grid-margin)] h-full pointer-events-none" />}

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

          <div className="shrink-0 w-[20vw] h-full pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default ProjectApp;
