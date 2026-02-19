
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeApp from './home/App';
import ProjectApp from './projects/App';
import GraphicApp from './graphic/App';
import AboutApp from './about/App';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'projects' | 'graphic' | 'about'>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  // Transition states
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'in' | 'out'>('idle');
  const [loadingPercent, setLoadingPercent] = useState(0);

  const handleNavigate = (page: 'home' | 'projects' | 'graphic' | 'about') => {
    if (page === view || isTransitioning) return;

    setIsTransitioning(true);
    setTransitionPhase('in');
    setLoadingPercent(0);

    // Percentage counter logic
    const duration = 600; // 0.6s for counting
    const startTime = performance.now();

    const animateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentPercent = Math.floor(progress * 100);
      
      setLoadingPercent(currentPercent);

      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      }
    };

    requestAnimationFrame(animateCounter);

    // Phase In: 베일이 덮이고 숫자가 올라감
    setTimeout(() => {
      setView(page);
      window.location.hash = page;
      window.scrollTo(0, 0);
      setSelectedProjectId(null);
      setTransitionPhase('out');
      
      // Phase Out: 새로운 페이지 노출
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionPhase('idle');
      }, 500);
    }, 800);
  };

  const handleBackFromDetail = () => {
    setSelectedProjectId(null);
  };

  return (
    <div className="relative min-h-screen bg-[#fcfcfc] overflow-hidden font-pretendard">
      {/* Refined Minimalist Loading Overlay with Counter */}
      {isTransitioning && (
        <div 
          className={`fixed inset-0 z-[2000] flex items-center justify-center bg-white/95 backdrop-blur-sm pointer-events-auto
            ${transitionPhase === 'in' ? 'animate-veil-in' : 'animate-veil-out'}
          `}
        >
          <div className="flex flex-col items-center">
            <span className="text-brand-orange font-pretendard text-[14px] md:text-[16px] font-light tracking-[0.2em] tabular-nums">
              ({loadingPercent}%)
            </span>
          </div>
        </div>
      )}

      <Navbar 
        currentView={view} 
        onNavigate={handleNavigate} 
        isProjectDetail={view === 'projects' && selectedProjectId !== null}
        onBack={handleBackFromDetail}
      />
      
      <div className="w-full h-screen overflow-hidden">
        {view === 'home' ? (
          <HomeApp />
        ) : view === 'projects' ? (
          <main className="w-full h-full overflow-hidden">
            <ProjectApp 
              selectedProjectId={selectedProjectId} 
              onSelectProject={setSelectedProjectId} 
            />
          </main>
        ) : view === 'graphic' ? (
          <main className="w-full h-full overflow-hidden">
            <GraphicApp />
          </main>
        ) : (
          <main className="w-full h-full overflow-hidden">
            <AboutApp />
          </main>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default App;
