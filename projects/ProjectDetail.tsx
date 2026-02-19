
import React, { useEffect } from 'react';
import { ProjectItem } from './App';

interface ProjectDetailProps {
  project: ProjectItem;
  isMobile: boolean;
  onBack: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, isMobile, onBack }) => {
  useEffect(() => {
    const container = document.querySelector('.project-detail-container');
    if (container) container.scrollTo(0, 0);
  }, [project]);

  return (
    <div className={`absolute inset-0 z-[10] bg-white overflow-y-auto no-scrollbar flex flex-col font-pretendard project-detail-container ${isMobile ? 'pt-[120px]' : 'pt-[100px]'}`}>
      
      {/* 닫기 버튼: 데스크탑 환경에서도 접근 가능하도록 추가 (네비게이션 바 버튼과 병행 사용 가능) */}
      {!isMobile && (
        <button 
          onClick={onBack}
          className="fixed top-8 right-8 z-[100] text-black/20 hover:text-brand-orange transition-colors duration-300 p-2"
          aria-label="Close Project"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}

      <div className={`main-grid pb-20 ${isMobile ? 'px-0' : ''}`}>
        <div className={`flex flex-col ${isMobile ? 'col-span-6' : 'col-start-3 col-span-8'}`}>
          <div className="w-full">
            <img 
              src={project.mainImage} 
              alt={project.title} 
              className="w-full h-auto block"
            />
          </div>
          <div className="flex flex-col">
            {project.images.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt={`${project.title} gallery ${idx + 1}`} 
                className="w-full h-auto block"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
