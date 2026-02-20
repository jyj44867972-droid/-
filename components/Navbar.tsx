
import React, { useState, useEffect, useRef } from 'react';

interface NavbarProps {
  currentView: 'home' | 'projects' | 'graphic' | 'about';
  onNavigate: (view: 'home' | 'projects' | 'graphic' | 'about') => void;
  isProjectDetail?: boolean;
  onBack?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, isProjectDetail, onBack }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMouseActive, setIsMouseActive] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  const scrollTimeoutRef = useRef<number | null>(null);
  const mouseIdleTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 1500); 
    };

    const handleActivity = () => {
      setIsMouseActive(true);
      if (mouseIdleTimeoutRef.current !== null) {
        window.clearTimeout(mouseIdleTimeoutRef.current);
      }
      
      if (currentView === 'graphic' || currentView === 'about') {
        mouseIdleTimeoutRef.current = window.setTimeout(() => {
          setIsMouseActive(false);
        }, 2000); 
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    handleActivity();

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('resize', checkMobile);
      
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      if (mouseIdleTimeoutRef.current !== null) {
        window.clearTimeout(mouseIdleTimeoutRef.current);
      }
    };
  }, [currentView]);

  const isExpanded = isHovered || (
    isMobile 
      ? !isScrolling 
      : (
          (currentView === 'graphic' || currentView === 'about') 
            ? isMouseActive 
            : !isScrolling
        )
  );

  const containerStyle = isExpanded 
    ? {
        transitionProperty: 'background-color, border-color, width, height, padding, margin, border-radius, box-shadow',
        transitionDuration: '400ms, 400ms, 600ms, 600ms, 600ms, 600ms, 600ms, 600ms',
        transitionDelay: '0ms, 0ms, 400ms, 400ms, 400ms, 400ms, 400ms, 400ms',
        transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)'
      }
    : {
        transitionProperty: 'width, height, padding, margin, border-radius, box-shadow, background-color, border-color',
        transitionDuration: '600ms, 600ms, 600ms, 600ms, 600ms, 600ms, 400ms, 400ms',
        transitionDelay: '0ms, 0ms, 0ms, 0ms, 0ms, 0ms, 600ms, 600ms',
        transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)'
      };

  const getWidth = () => {
    if (!isExpanded) return '3px';
    if (isProjectDetail) return '48px'; 
    if (isMobile) return 'calc(100vw - 30px)';
    return '420px'; 
  };

  return (
    <nav 
      className="fixed top-0 left-0 w-full z-[100] flex flex-col items-center pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ height: isMobile ? '70px' : '80px' }} 
    >
      <div 
        className={`
          flex items-center justify-center overflow-hidden whitespace-nowrap
          ${isExpanded 
            ? `bg-white/40 backdrop-blur-xl px-2 md:px-10 py-3 h-[48px] border border-black/[0.03] shadow-[0_2px_15px_rgba(0,0,0,0.02)] rounded-none` 
            : 'bg-brand-orange w-[3px] h-[40px] mt-0 border-transparent shadow-none'}
        `}
        style={{
          ...containerStyle,
          marginTop: isExpanded ? (isMobile ? '11px' : '32px') : '0',
          width: getWidth()
        }}
      >
        <div className={`
          flex transition-all font-gowun w-full justify-center
          ${isExpanded 
            ? 'opacity-100 translate-y-0 duration-500 delay-[1000ms]' 
            : 'opacity-0 translate-y-2 duration-200 delay-0 pointer-events-none'}
        `}>
          {isProjectDetail ? (
            <div className="flex items-center justify-center w-full">
              <button 
                onClick={onBack}
                className="flex items-center justify-center text-brand-orange hover:scale-110 transition-transform duration-300"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex gap-6 md:gap-10">
              <button 
                onClick={() => onNavigate('home')}
                className={`text-[16px] md:text-[13px] transition-opacity hover:opacity-100 ${currentView === 'home' ? 'text-brand-orange opacity-100' : 'text-brand-orange opacity-60'}`}
              >Home</button>
              <button 
                onClick={() => onNavigate('projects')}
                className={`text-[16px] md:text-[13px] transition-opacity hover:opacity-100 ${currentView === 'projects' ? 'text-brand-orange opacity-100' : 'text-brand-orange opacity-60'}`}
              >Projects</button>
              <button 
                onClick={() => onNavigate('graphic')}
                className={`text-[16px] md:text-[13px] transition-opacity hover:opacity-100 ${currentView === 'graphic' ? 'text-brand-orange opacity-100' : 'text-brand-orange opacity-60'}`}
              >Graphic</button>
              <button 
                onClick={() => onNavigate('about')}
                className={`text-[16px] md:text-[13px] transition-opacity hover:opacity-100 ${currentView === 'about' ? 'text-brand-orange opacity-100' : 'text-brand-orange opacity-60'}`}
              >About me</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
