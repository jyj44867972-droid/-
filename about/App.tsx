
import React from 'react';

const AboutApp: React.FC = () => {
  return (
    <div className="w-full h-screen bg-[#fcfcfc] flex flex-col justify-between px-[var(--grid-margin)] pt-[12vh] pb-[12vh] font-pretendard overflow-hidden">
      {/* Top Content: Contact Info */}
      <div className="flex flex-col items-start gap-1">
        <div className="text-[20px] md:text-[28px] lg:text-[34px] font-medium text-[#D0D0D0] tracking-tighter leading-tight">
          insta : @yezin_archive
        </div>
        <div className="text-[20px] md:text-[28px] lg:text-[34px] font-medium text-[#D0D0D0] tracking-tighter leading-tight">
          bbh7972@naver.com
        </div>
      </div>

      {/* Bottom Content: Name & Intro */}
      <div className="flex flex-col items-start">
        <h1 className="text-[70px] md:text-[100px] lg:text-[120px] font-medium text-[#B8B8B8] leading-[1] tracking-tighter mb-2">
          정예진
        </h1>
        <h2 className="text-[14px] md:text-[18px] lg:text-[22px] font-normal text-[#D0D0D0] leading-none tracking-tight mb-8">
          Jeong Ye Jin
        </h2>
        
        <p className="text-[13px] md:text-[14px] text-[#888] font-light leading-[1.7] max-w-[400px] break-keep">
          안녕하세요. 저는 탄탄한 기획을 바탕으로 아이디어를 확장하고, 
          이를 시각적으로 정확하고 감각 있게 담아내기 위해 꾸준히 탐구하는 디자이너 정예진입니다.
        </p>
      </div>
    </div>
  );
};

export default AboutApp;
