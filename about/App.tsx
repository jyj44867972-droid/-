
import React, { useState, useEffect } from 'react';

const AboutApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // 데스크탑 환경에서는 항상 첫 번째 탭(0)이 기본으로 선택되어 있도록 함
      if (!mobile && activeTab === null) {
        setActiveTab(0);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [activeTab]);

  const tabs = [
    { id: 1, number: '(01)', label: '나' },
    { id: 2, number: '(02)', label: '툴 숙련도' },
    { id: 3, number: '(03)', label: '연락처' },
  ];

  const skills = [
    { name: 'Photoshop', level: 90 },
    { name: 'Illustrator', level: 85 },
    { name: 'Figma', level: 95 },
    { name: 'Blender', level: 20 },
    { name: 'Visual Studio', level: 40 },
  ];

  /**
   * 데스크탑 전용 섹션 오프셋 조정:
   * 좌측 인덱스 영역의 숫자 상단과 우측 타이틀 상단이 시각적으로 일직선상에 놓이도록
   * 기본 계산값(0, 169, 338)에서 약 18px씩 위로(마이너스 방향) 보정했습니다.
   */
  const sectionOffsets = [
    'mt-[-18px]',
    'mt-[151px]',
    'mt-[320px]',
  ];

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const handleBack = () => {
    setActiveTab(null);
  };

  return (
    <div className="w-full h-screen bg-brand-bg relative overflow-hidden flex font-pretendard about-scroll-container">
      
      {/* [Mobile Only] List Screen */}
      <div className={`absolute inset-0 z-50 bg-brand-bg transition-all duration-700 ease-in-out md:hidden ${
        activeTab === null ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'
      }`}>
        <div className="main-grid w-full h-full pt-[80px] pb-[40px]">
          <div className="col-span-6 flex flex-col justify-center h-full gap-[4vh]">
            {tabs.map((tab, index) => (
              <div 
                key={tab.id} 
                onClick={() => handleTabClick(index)}
                className="cursor-pointer group flex flex-col gap-1"
              >
                <span className="text-[84px] font-black text-[#E2E2E2] leading-none tracking-tighter ml-[-5px]">
                  {tab.number}
                </span>
                <span className="text-[20px] font-bold text-[#E2E2E2] tracking-tight ml-1">
                  {tab.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* [Common/Detail] Main Content Screen */}
      <div className={`w-full h-full transition-all duration-700 ease-in-out ${
        isMobile && activeTab === null ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'
      }`}>
        {/* 모바일 상세 페이지 전용 뒤로가기 버튼 */}
        {isMobile && (
          <button 
            onClick={handleBack}
            className="absolute top-[80px] left-[var(--grid-margin)] z-[110] flex items-center gap-1.5 text-[#888] active:text-brand-orange transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span className="text-[14px] font-bold pt-0.5">Back</span>
          </button>
        )}

        <div className="main-grid w-full h-full pt-[160px] pb-[80px] md:pt-[160px]">
          {/* 모바일의 경우 content 영역의 pt를 조정 */}
          <div className={`col-span-12 md:col-span-3 flex flex-col ${isMobile ? 'mt-[80px]' : 'gap-16'}`}>
            {tabs.map((tab, index) => {
              if (isMobile && activeTab !== index) return null;

              return (
                <div 
                  key={tab.id}
                  onClick={() => handleTabClick(index)}
                  className={`flex flex-col gap-2 transition-all duration-500 ${!isMobile ? 'cursor-pointer group h-[105px]' : ''}`}
                >
                  <span className={`text-[84px] font-black leading-none tracking-tighter select-none transition-colors duration-500 ml-[-5px] ${
                    activeTab === index ? 'text-brand-orange' : 'text-[#E2E2E2] group-hover:text-[#D8D8D8]'
                  }`}>
                    {tab.number}
                  </span>
                  {!isMobile && (
                    <span className={`text-[13px] font-bold tracking-tight transition-colors duration-500 ${
                      activeTab === index ? 'text-brand-orange' : 'text-[#E2E2E2]'
                    }`}>
                      {tab.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* 동적 콘텐츠 영역: 오른쪽 기준 4번째 칼럼(md:col-start-9) 시작 */}
          <div className={`col-span-12 md:col-start-9 md:col-span-4 ${isMobile ? 'absolute bottom-20 left-0 w-full px-[var(--grid-margin)]' : 'relative'}`}>
            
            {/* Section 01: Me (나) */}
            <div className={`${isMobile ? 'transition-all duration-700' : `absolute inset-x-0 transition-all duration-700 ${sectionOffsets[0]}`} ${
              activeTab === 0 ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none absolute'
            }`}>
              <div className="flex flex-col items-start text-left">
                <h2 className="text-[72px] md:text-[100px] lg:text-[130px] font-black text-[#E2E2E2] leading-[1.1] tracking-tighter select-none ml-[-0.05em] whitespace-nowrap">
                  정예진
                </h2>
                <h3 className="text-[30px] md:text-[40px] lg:text-[50px] font-medium text-[#E2E2E2] leading-[1.4] tracking-tight mb-8 md:mb-10 select-none whitespace-nowrap">
                  Jeong Ye Jin
                </h3>
                <p className="text-[15px] md:text-[14px] text-[#888] font-light leading-[1.8] break-keep w-full">
                  안녕하세요. 저는 탄탄한 기획을 바탕으로 아이디어를 확장하고, 
                  이를 시각적으로 정확하고 감각 있게 담아내기 위해 꾸준히 탐구하는 디자이너 정예진입니다.
                </p>
              </div>
            </div>

            {/* Section 02: Skills (툴 숙련도) */}
            <div className={`${isMobile ? 'transition-all duration-700' : `absolute inset-x-0 flex flex-col gap-8 transition-all duration-700 ${sectionOffsets[1]}`} ${
              activeTab === 1 ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none absolute'
            }`}>
              <div className="flex flex-col gap-6 md:gap-8 w-full">
                {skills.map((skill) => (
                  <div key={skill.name} className="flex flex-col gap-2">
                    <span className="text-brand-orange text-[14px] font-bold tracking-tight">{skill.name}</span>
                    <div className="w-full h-[3px] bg-transparent relative flex items-center">
                      <div className="absolute inset-0 w-full h-[3px] bg-[#E2E2E2]"></div>
                      <div 
                        className="absolute inset-0 h-[3px] bg-brand-orange transition-all duration-1000 ease-out" 
                        style={{ width: `${activeTab === 1 ? skill.level : 0}%` }}
                      ></div>
                      {[0, 25, 50, 75, 100].map(tick => (
                        <div 
                          key={tick} 
                          className="absolute h-3 w-[1px] bg-brand-orange/40" 
                          style={{ left: `${tick}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 03: Contact (연락처) */}
            <div className={`${isMobile ? 'transition-all duration-700' : `absolute inset-x-0 flex flex-col gap-4 transition-all duration-700 ${sectionOffsets[2]}`} ${
              activeTab === 2 ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none absolute'
            }`}>
              <div className="flex flex-col gap-4 items-start text-left">
                <a 
                  href="https://www.instagram.com/yezin_archive/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[20px] md:text-[28px] lg:text-[36px] font-bold text-[#E2E2E2] tracking-tighter leading-none break-all hover:text-brand-orange transition-colors duration-300"
                >
                  insta : @yezin_archive
                </a>
                <a 
                  href="mailto:bbh7972@naver.com"
                  className="text-[20px] md:text-[28px] lg:text-[36px] font-bold text-[#E2E2E2] tracking-tighter leading-none break-all hover:text-brand-orange transition-colors duration-300"
                >
                  bbh7972@naver.com
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutApp;
