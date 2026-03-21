
import React from 'react';

interface FooterProps {
  currentView: string;
  isScrolled?: boolean;
}

const Footer: React.FC<FooterProps> = ({ currentView, isScrolled }) => {
  if (currentView !== 'home') return null;

  return (
    <footer className="fixed bottom-0 left-0 w-full z-[100] pointer-events-none px-[var(--grid-margin)] pb-[var(--grid-margin)]">
      <div className="flex justify-between items-end w-full">
        <div className="text-brand-orange text-[14px] md:text-[16px] font-medium pointer-events-auto font-gowun">
          Jeong Yejin
        </div>
        <div className={`text-brand-orange text-[14px] md:text-[16px] font-medium pointer-events-auto font-gowun ${!isScrolled ? 'animate-bounce-slow' : ''}`}>
          {isScrolled ? '@2026' : 'scroll ↓'}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
