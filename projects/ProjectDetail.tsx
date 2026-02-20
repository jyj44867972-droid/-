
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
    <div className={`absolute inset-0 z-[10] bg-white overflow-y-auto no-scrollbar flex flex-col font-pretendard project-detail-container ${isMobile ? 'pt-[80px]' : 'pt-[100px]'}`}>
      
      {/* 닫기 버튼은 이제 Navbar의 뒤로가기 버튼으로 대체되었습니다. */}

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
