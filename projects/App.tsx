
import React, { useState, useEffect, useRef } from 'react';
import ProjectDetail from './ProjectDetail';
import { client, urlFor } from '../sanity';

export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  description: string;
  longDescription: string;
  aspectRatio: string;
  imgUrl: string;
  gallery: string[];
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
        <p className="text-[16px] md:text-[13px] text-[#888] font-pretendard leading-[1.6] break-keep pr-4 max-w-full">
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

interface ProjectAppProps {
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
}

const ProjectApp: React.FC<ProjectAppProps> = ({ selectedProjectId, onSelectProject }) => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const query = `*[_type == "project"] | order(number asc)`;
        const data = await client.fetch(query);
        const formattedData = data.map((p: any) => ({
          id: p._id,
          number: p.number || '',
          title: p.title || '',
          description: p.description || '',
          longDescription: p.longDescription || '',
          aspectRatio: p.aspectRatio || 'aspect-[3/4]',
          imgUrl: p.mainImage ? urlFor(p.mainImage).url() : '',
          gallery: p.images ? p.images.map((img: any) => urlFor(img).url()) : []
        }));
        setProjects(formattedData);
      } catch (error) {
        console.error("Failed to fetch projects from Sanity:", error);
      }
    };

    fetchProjects();
  }, []);

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
