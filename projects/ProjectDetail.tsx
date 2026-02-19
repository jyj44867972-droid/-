
import React, { useEffect } from 'react';
import { ProjectItem } from './App';

interface ProjectDetailProps {
  project: ProjectItem;
  isMobile: boolean;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, isMobile }) => {
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
              alt={project.title} 
              className="w-full h-auto object-cover block"
            />
          </div>
          <div className="flex flex-col">
            {project.gallery.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt={`${project.title} gallery ${idx + 1}`} 
                className="w-full h-auto object-cover block"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
