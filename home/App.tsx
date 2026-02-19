
import React, { useState, useEffect, useCallback } from 'react';

// --- Hero Sub-component ---
const Hero: React.FC = () => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-brand-bg">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-[2000ms] ease-out scale-105"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2500&auto=format&fit=crop')`,
        }}
      />
      {/* Texture Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-multiply">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
      </div>
    </div>
  );
};

// --- Intro Sub-component ---
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
      className="main-grid bg-[#fcfcfc] relative overflow-hidden h-screen"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1500px' }}
    >
      <div 
        className="col-span-6 md:col-start-3 md:col-span-8 flex flex-col justify-center transition-transform duration-500 ease-out will-change-transform font-pretendard"
        style={{ 
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) rotate(14deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        <h1 className="text-xl md:text-3xl lg:text-4xl font-bold leading-[1.6] tracking-[-0.02em] text-[#E2E2E2] select-none break-keep transition-colors duration-500 hover:text-[#FF5C28]">
          안녕하세요. 저는 탄탄한 기획을 바탕으로 아이디어를 확장하고, 
          이를 시각적으로 정확하고 감각 있게 담아내기 위해 꾸준히 탐구하는 
          디자이너 정예진입니다.
        </h1>
      </div>
    </div>
  );
};

// --- Main Home Component ---
const HomeApp: React.FC = () => {
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
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
      {/* 
          Fixed Home Footer Elements 
          모바일 버전에서는 이미지와 동일하게 @2026/이름은 좌측, scroll은 우측 배치
      */}
      <div className="fixed bottom-8 left-0 w-full z-50 pointer-events-none font-gowun text-brand-orange text-[16px] md:text-[13px] tracking-tight">
        <div className="main-grid items-end">
          {isMobile ? (
            // Mobile Specific Layout (based on user image)
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
            // Desktop Layout
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
        <section id="home-hero" className="snap-start w-full h-screen">
          <Hero />
        </section>
        <section id="home-intro" className="snap-start w-full h-screen">
          <IntroSection />
        </section>
      </main>
    </div>
  );
};

export default HomeApp;