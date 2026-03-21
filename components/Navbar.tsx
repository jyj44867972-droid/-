import React, { useState, useEffect, useRef } from 'react';

interface NavbarProps {
  currentView: 'home' | 'projects' | 'graphic' | 'about' | 'contact';
  onNavigate: (view: 'home' | 'projects' | 'graphic' | 'about' | 'contact') => void;
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

  const isExpanded = isMobile || isHovered || (
    (currentView === 'graphic' || currentView === 'about') 
      ? isMouseActive 
      : !isScrolling
  );

  const containerStyle = isExpanded 
    ? {
        transitionProperty: 'background-color, border-color, width, height, padding, margin, border-radius, box-shadow, transform',
        transitionDuration: '400ms, 400ms, 600ms, 600ms, 600ms, 600ms, 600ms, 600ms, 600ms',
        transitionDelay: '0ms, 0ms, 400ms, 400ms, 400ms, 400ms, 400ms, 400ms, 400ms',
        transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
        transform: 'translateY(0)'
      }
    : {
        transitionProperty: 'width, height, padding, margin, border-radius, box-shadow, background-color, border-color, transform',
        transitionDuration: '600ms, 600ms, 600ms, 600ms, 600ms, 600ms, 400ms, 400ms, 600ms',
        transitionDelay: '0ms, 0ms, 0ms, 0ms, 0ms, 0ms, 600ms, 600ms, 0ms',
        transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
        transform: 'translateY(-100%)'
      };

  const getWidth = () => {
    if (!isExpanded) return '48px'; // Match w-12
    if (isProjectDetail) return '64px'; 
    return '100vw'; 
  };

  return (
    <nav 
      className="fixed top-0 left-0 w-full z-[100] flex flex-col items-center pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ height: isMobile ? '60px' : (isExpanded ? '140px' : '40px') }} 
    >
      <div 
        className={`
          flex items-center justify-center overflow-hidden whitespace-nowrap transition-all duration-500
          ${isExpanded 
            ? `bg-white/80 backdrop-blur-md px-0 py-0 h-full rounded-none` 
            : 'bg-brand-orange w-12 h-1 mt-2 rounded-none opacity-50 hover:opacity-100'}
        `}
        style={{
          ...containerStyle,
          marginTop: '0',
          width: getWidth(),
          transform: isExpanded ? 'translateY(0)' : 'translateY(0)'
        }}
      >
        <div className={`
          flex transition-all font-gowun w-full
          ${isExpanded 
            ? 'opacity-100 translate-y-0 duration-500 delay-[400ms]' 
            : 'opacity-0 -translate-y-10 duration-200 delay-0 pointer-events-none'}
        `}>
          {isProjectDetail ? (
            <div className="flex items-center justify-center w-full h-[48px]">
              <button 
                onClick={onBack}
                className="flex items-center justify-center text-brand-orange hover:scale-110 transition-transform duration-300 rounded-none"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="main-grid w-full items-start">
              <div className="col-start-1 col-span-6 md:col-span-4 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start gap-4">
                <button 
                  onClick={() => onNavigate('home')}
                  className={`text-left text-[15px] md:text-[16px] font-medium transition-opacity hover:opacity-100 text-brand-orange ${currentView === 'home' ? 'opacity-100' : 'opacity-100'}`}
                >Home</button>
                <button 
                  onClick={() => onNavigate('projects')}
                  className={`text-left text-[15px] md:text-[16px] font-medium transition-opacity hover:opacity-100 text-brand-orange ${currentView === 'projects' ? 'opacity-100' : 'opacity-100'}`}
                >Projects</button>
                <button 
                  onClick={() => onNavigate('graphic')}
                  className={`text-left text-[15px] md:text-[16px] font-medium transition-opacity hover:opacity-100 text-brand-orange ${currentView === 'graphic' ? 'opacity-100' : 'opacity-100'}`}
                >graphic</button>
                <button 
                  onClick={() => onNavigate('contact' as any)}
                  className={`md:hidden text-left text-[15px] md:text-[16px] font-medium transition-opacity hover:opacity-100 text-brand-orange opacity-100`}
                >Contact</button>
              </div>
              <div className="hidden md:flex md:col-start-7 col-span-1 justify-start">
                <button 
                  onClick={() => onNavigate('contact' as any)}
                  className={`text-left text-[18px] md:text-[16px] font-medium transition-opacity hover:opacity-100 text-brand-orange opacity-100`}
                >Contact</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
