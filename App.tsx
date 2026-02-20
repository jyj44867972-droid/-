
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

  // Sync state with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const fullHash = window.location.hash.replace('#/', '');
      const parts = fullHash.split('/');
      const mainView = parts[0] as any;
      const subId = parts[1] || null;

      const validViews = ['home', 'projects', 'graphic', 'about'];
      
      if (validViews.includes(mainView)) {
        setView(mainView);
        setSelectedProjectId(mainView === 'projects' ? subId : null);
      } else if (!mainView) {
        setView('home');
        setSelectedProjectId(null);
        window.location.hash = '#/home';
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run on initial mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: 'home' | 'projects' | 'graphic' | 'about') => {
    if (page === view && !selectedProjectId && isTransitioning) return;
    // 만약 프로젝트 리스트에서 다시 프로젝트를 눌렀는데 이미 리스트라면 transition 생략 가능하지만, 
    // 세부페이지에서 리스트로 나갈 때는 transition을 보여주는 것이 일관적임.
    
    setIsTransitioning(true);
    setTransitionPhase('in');
    setLoadingPercent(0);

    const duration = 600; 
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

    setTimeout(() => {
      // 해시를 변경하여 useEffect의 handleHashChange가 상태를 업데이트하게 함
      window.location.hash = `#/${page}`;
      window.scrollTo(0, 0);
      setTransitionPhase('out');
      
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionPhase('idle');
      }, 500);
    }, 800);
  };

  const handleSelectProject = (id: string | null) => {
    setIsTransitioning(true);
    setTransitionPhase('in');
    setLoadingPercent(0);

    const duration = 600; 
    const startTime = performance.now();

    const animateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentPercent = Math.floor(progress * 100);
      setLoadingPercent(currentPercent);
      if (progress < 1) requestAnimationFrame(animateCounter);
    };

    requestAnimationFrame(animateCounter);

    setTimeout(() => {
      if (id) {
        window.location.hash = `#/projects/${id}`;
      } else {
        // Use replace to prevent back-button loop
        const url = new URL(window.location.href);
        url.hash = `#/projects`;
        window.location.replace(url.href);
      }
      window.scrollTo(0, 0);
      setTransitionPhase('out');
      
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionPhase('idle');
      }, 500);
    }, 800);
  };

  const handleBackFromDetail = () => {
    handleSelectProject(null);
  };

  return (
    <div className="relative min-h-screen bg-[#fcfcfc] overflow-hidden font-pretendard">
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
              onSelectProject={handleSelectProject} 
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
