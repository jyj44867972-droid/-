
import React, { useState, useEffect, useRef } from 'react';

interface ProjectItem {
  id: string;
  number: string;
  title: string;
  description: string;
  longDescription: string;
  aspectRatio: string;
  imgUrl: string;
  gallery: string[];
}

const projects: ProjectItem[] = [
  {
    id: 'p1',
    number: '(01)',
    title: 'Brand Identity Design',
    description: '브랜드의 핵심 가치를 시각적으로 전달하는 아이덴티티 시스템.',
    longDescription: '이 프로젝트는 현대적인 미니멀리즘을 바탕으로 브랜드의 핵심 가치를 재정의하는 아이덴티티 시스템 구축 작업입니다.',
    aspectRatio: 'aspect-[3/4.5]',
    imgUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517392255169-4f762f928a6e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554034483-04fda0d3507b?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'p2',
    number: '(02)',
    title: 'Website Renewal',
    description: '사용자 경험 중심의 인터랙티브 웹사이트 리뉴얼 프로젝트.',
    longDescription: '기존의 복잡한 정보 구조를 탈피하여, 사용자가 직관적으로 탐색할 수 있는 인터랙티브 웹 디자인을 구현했습니다.',
    aspectRatio: 'aspect-[4/3]',
    imgUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522542550221-31fd19054a37?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'p3',
    number: '(03)',
    title: 'Editorial Design',
    description: '정보의 위계와 가독성을 고려한 감각적인 편집 디자인.',
    longDescription: '텍스트와 이미지의 조화로운 레이아웃을 통해 가독성을 극대화한 편집 디자인 프로젝트입니다.',
    aspectRatio: 'aspect-[3/2]',
    imgUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586111058097-9e797f1f9640?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521791136064-7986c2923216?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'p4',
    number: '(04)',
    title: 'Mobile App UX/UI',
    description: '직관적인 인터페이스와 매끄러운 사용자 여정을 설계한 앱.',
    longDescription: '사용자의 행동 패턴을 분석하여 최적화된 UX/UI 솔루션을 제공합니다.',
    aspectRatio: 'aspect-[3/4]',
    imgUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'p5',
    number: '(05)',
    title: 'Graphic Poster Series',
    description: '타이포그래피와 이미지를 활용한 실험적인 그래픽 시리즈.',
    longDescription: '시각적 언어의 경계를 허무는 실험적인 그래픽 포스터 시리즈입니다.',
    aspectRatio: 'aspect-square',
    imgUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'p6',
    number: '(06)',
    title: 'Exhibition Branding',
    description: '전시의 테마를 통합적으로 녹여낸 브랜딩 및 공간 그래픽.',
    longDescription: '전시의 핵심 테마를 하나의 시각적 흐름으로 엮어낸 통합 브랜딩 프로젝트입니다.',
    aspectRatio: 'aspect-[4/5]',
    imgUrl: 'https://images.unsplash.com/photo-1541462608141-ad60397d5873?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1518998053574-53ee753fe1d1?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1531256456760-c351f776a56c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522865080221-45b9d63c23a7?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'p7',
    number: '(07)',
    title: 'Sustainable Packaging',
    description: '친환경 가치를 담은 미니멀한 패키지 디자인 솔루션.',
    longDescription: '지속 가능한 내일을 위한 친환경 패키지 디자인입니다.',
    aspectRatio: 'aspect-[3/2]',
    imgUrl: 'https://images.unsplash.com/photo-1605648916319-cf082f7524a1?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1536412597336-ade7b523ecac?q=80&w=1000&auto=format&fit=crop'
    ]
  },
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
      onClick={() => onSelect(project.id)}
      className={`group flex flex-col h-full shrink-0 cursor-pointer transition-all duration-[1000ms] cubic-bezier(0.23, 1, 0.32, 1) ${motionClass}`}
      style={{ 
        width: itemWidth,
        marginRight: 'var(--grid-gutter)',
        transitionDelay: isVisible ? `${index % 4 * 100}ms` : '0ms'
      }}
    >
      <div className="flex flex-col text-left mt-[140px] md:mt-[120px] lg:mt-[140px] transition-transform duration-500 group-hover:translate-x-1 px-1">
        <h2 
          className="text-[36px] md:text-[60px] lg:text-[84px] font-black text-[#E2E2E2] leading-none mb-3 select-none font-pretendard tracking-tighter ml-[-0.05em] pointer-events-none transition-colors duration-500 group-hover:text-brand-orange"
        >
          {project.number}
        </h2>
        <h3 className="text-[16px] md:text-[16px] font-bold text-[#111] mb-2 font-pretendard tracking-tight leading-tight">
          {project.title}
        </h3>
        <p className="text-[16px] md:text-[13px] text-[#888] leading-[1.6] break-keep pr-4 font-pretendard max-w-full">
          {project.description}
        </p>
      </div>
      <div className="mt-auto pb-[var(--safe-bottom)]">
        <div 
          className={`w-full overflow-hidden bg-[#E2E2E2] transition-all duration-700 ease-out shadow-sm ${project.aspectRatio} group-hover:brightness-[0.97] group-hover:shadow-md rounded-sm`}
        >
          <img 
            src={project.imgUrl} 
            alt={project.title}
            className={`w-full h-full object-cover grayscale transition-all duration-[1200ms] ease-in-out ${isMobile ? 'scale-100' : 'scale-105'} group-hover:scale-100 group-hover:grayscale-0`}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

const ProjectDetail: React.FC<{ project: ProjectItem; isMobile: boolean }> = ({ project, isMobile }) => {
  useEffect(() => {
    const container = document.querySelector('.project-detail-container');
    if (container) container.scrollTo(0, 0);
  }, [project]);

  return (
    <div className={`absolute inset-0 z-[10] bg-white overflow-y-auto no-scrollbar flex flex-col font-pretendard project-detail-container ${isMobile ? 'pt-[120px]' : 'pt-[100px]'}`}>
      <div className={`main-grid pb-20 ${isMobile ? 'px-0' : ''}`}>
        <div className={`flex flex-col ${isMobile ? 'col-span-6' : 'col-start-3 col-span-8'}`}>
          <div className="w-full">
            <img 
              src={project.imgUrl} 
              alt="" 
              className="w-full h-auto object-cover block"
            />
          </div>
          <div className="flex flex-col">
            {project.gallery.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt="" 
                className="w-full h-auto object-cover block"
              />
            ))}
          </div>
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
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;

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
        />
      )}

      <div className={`flex-grow flex flex-col overflow-hidden relative h-full transition-opacity duration-500 ${selectedProject ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div 
          ref={scrollContainerRef}
          className="flex h-full overflow-x-auto overflow-y-hidden no-scrollbar scroll-smooth project-scroll-container overscroll-behavior-x-contain"
        >
          {!isMobile && (
            <div className="shrink-0 h-full flex flex-col pointer-events-none" style={{ width: leftOffset }}>
               <div className="pl-[var(--grid-margin)] mt-[100px] md:mt-[120px] lg:mt-[140px]" style={{ width: `calc(3 * ${colWidthDesktop} + 2 * var(--grid-gutter))` }}>
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
              key={project.id} 
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
