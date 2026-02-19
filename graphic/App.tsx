
import React, { useState, useRef, useEffect } from 'react';
import { client, urlFor } from '../sanity';

interface GraphicItem {
  id: string;
  number: string;
  title: string;
  description: string;
  width: number;
  height: number;
  x: number;
  y: number;
  imgUrl: string;
}

const GraphicApp: React.FC = () => {
  const [items, setItems] = useState<GraphicItem[]>([]);
  const [hoveredItem, setHoveredItem] = useState<GraphicItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<GraphicItem | null>(null);
  const [isOverlayClosing, setIsOverlayClosing] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, px: 0, py: 0 });
  const [isMobile, setIsMobile] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `*[_type == "graphic"] | order(number asc)`;
        const data = await client.fetch(query);
        if (data && data.length > 0) {
          const formatted = data.map((item: any) => ({
            id: item._id,
            number: item.number || '',
            title: item.title || '',
            description: item.description || '',
            width: item.width || 140,
            height: item.height || 200,
            x: item.x || Math.random() * 60 + 10,
            y: item.y || Math.random() * 60 + 10,
            imgUrl: item.mainImage ? urlFor(item.mainImage).url() : ''
          }));
          setItems(formatted);
        }
      } catch (e) {
        console.error("Failed to fetch graphics:", e);
      }
    };
    fetchData();

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseDown = (e: React.MouseEvent, item: GraphicItem) => {
    if (isMobile) return; 
    setDraggingId(item.id);
    hasMoved.current = false;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleGlobalMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y, px: e.clientX, py: e.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingId === null || !containerRef.current) return;
      hasMoved.current = true;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newX = ((e.clientX - containerRect.left - dragOffset.current.x) / containerRect.width) * 100;
      const newY = ((e.clientY - containerRect.top - dragOffset.current.y) / containerRect.height) * 100;

      setItems((prev) =>
        prev.map((item) =>
          item.id === draggingId ? { ...item, x: newX, y: newY } : item
        )
      );
      
      if (hoveredItem?.id === draggingId) {
        setHoveredItem((prev) => prev ? { ...prev, x: newX, y: newY } : null);
      }
    };

    const handleMouseUp = () => {
      setDraggingId(null);
    };

    if (draggingId !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingId, hoveredItem]);

  const sizeMultiplier = isMobile ? 0.7 : 1;

  const handleItemClick = (item: GraphicItem) => {
    if (isMobile && !hasMoved.current) {
      setSelectedItem(item);
      setIsOverlayClosing(false);
    }
  };

  const closeOverlay = () => {
    if (isOverlayClosing) return;
    setIsOverlayClosing(true);
    setTimeout(() => {
      setSelectedItem(null);
      setIsOverlayClosing(false);
    }, 400); 
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleGlobalMouseMove}
      className="w-full h-screen bg-brand-bg relative overflow-hidden select-none"
    >
      {items.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[#E2E2E2] text-[13px] font-pretendard animate-pulse tracking-widest">
            LOADING ARCHIVE...
          </p>
        </div>
      )}

      {!isMobile && (
        <div 
          className="pointer-events-none fixed z-[999] text-[10px] text-brand-orange font-pretendard tracking-widest whitespace-nowrap font-bold"
          style={{ 
            left: mousePos.px + 15, 
            top: mousePos.py + 15 
          }}
        >
          X:{Math.round(mousePos.x)}% Y:{Math.round(mousePos.y)}%
        </div>
      )}

      <div className="hidden md:block absolute bottom-12 left-1/2 -translate-x-1/2 z-10 pointer-events-none whitespace-nowrap">
        <p className="text-[12px] md:text-[13px] text-[#888] font-normal leading-none font-pretendard">
          개인 그래픽 작업물을 모아둔 공간입니다. 자유롭게 드래그해보세요.
        </p>
      </div>

      {!isMobile && (
        <div 
          className={`absolute z-10 transition-all duration-500 w-[240px] pointer-events-none ${
            hoveredItem ? 'opacity-100' : 'opacity-0'
          } top-[32px] right-[var(--grid-margin)]`}
        >
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-[64px] font-black text-[#E2E2E2] font-pretendard tracking-tighter">
              {hoveredItem?.number}
            </span>
          </div>
          <div className="text-left">
            <h4 className="text-[13px] font-bold text-[#111] mb-1 font-pretendard">
              {hoveredItem?.title}
            </h4>
            <p className="text-[12px] text-[#888] leading-[1.6] break-keep font-pretendard opacity-80">
              {hoveredItem?.description}
            </p>
          </div>
        </div>
      )}

      {items.map((item) => (
        <div
          key={item.id}
          className={`absolute cursor-grab active:cursor-grabbing transition-shadow duration-300 ${
            draggingId === item.id ? 'z-50 scale-105' : 'z-20'
          }`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: `${item.width * sizeMultiplier}px`,
            height: `${item.height * sizeMultiplier}px`,
            transition: draggingId === item.id ? 'none' : 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)'
          }}
          onMouseDown={(e) => handleMouseDown(e, item)}
          onTouchStart={(e) => {
            if (!isMobile) return;
            hasMoved.current = false;
            const touch = e.touches[0];
            setDraggingId(item.id);
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            dragOffset.current = {
              x: touch.clientX - rect.left,
              y: touch.clientY - rect.top,
            };
          }}
          onMouseEnter={() => !isMobile && setHoveredItem(item)}
          onMouseLeave={() => !isMobile && !draggingId && setHoveredItem(null)}
          onClick={() => handleItemClick(item)}
        >
          <div className="w-full h-full bg-[#E2E2E2] hover:bg-[#D8D8D8] transition-colors duration-500 overflow-hidden shadow-sm hover:shadow-lg">
            {item.imgUrl ? (
              <img 
                src={item.imgUrl} 
                className="w-full h-full object-cover grayscale transition-all duration-700 hover:grayscale-0" 
                alt={item.title}
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                 <span className="text-white text-[9px] tracking-[0.2em] font-pretendard">IMAGE</span>
              </div>
            )}
          </div>
        </div>
      ))}

      {isMobile && selectedItem && (
        <div 
          className={`fixed inset-0 z-[200] bg-black/30 flex items-center justify-center backdrop-blur-sm ${
            isOverlayClosing ? 'animate-detail-bg-out' : 'animate-detail-bg-in'
          }`}
          onClick={closeOverlay}
        >
          <div 
            className={`main-grid w-full flex flex-col items-center cursor-pointer ${
              isOverlayClosing ? 'animate-detail-content-down' : 'animate-detail-content-up'
            }`}
          >
            <div className="col-span-4 col-start-2 flex flex-col">
              <div className="text-left mb-4">
                <div className="flex items-baseline gap-2 leading-none">
                   <span className="text-[42px] font-black text-white font-pretendard tracking-tighter">
                     {selectedItem.number}
                   </span>
                   <span className="text-[12px] text-white/50 font-pretendard ml-1 uppercase tracking-widest font-medium">
                     X:{Math.round(selectedItem.x)} Y:{Math.round(selectedItem.y)}
                   </span>
                </div>
                <div className="mt-1">
                  <h4 className="text-[17px] font-bold text-white font-pretendard leading-tight">
                    {selectedItem.title}
                  </h4>
                  <p className="text-[14px] text-white/70 leading-[1.6] break-keep font-pretendard mt-1.5">
                    {selectedItem.description}
                  </p>
                </div>
              </div>

              <div className="w-full h-auto bg-black overflow-hidden shadow-2xl border border-white/10 rounded-sm">
                {selectedItem.imgUrl ? (
                  <img 
                    src={selectedItem.imgUrl} 
                    className="w-full h-auto object-contain block opacity-100" 
                    alt={selectedItem.title}
                  />
                ) : (
                  <div className="w-full aspect-[3/4] flex items-center justify-center bg-[#111]">
                     <span className="text-white/20 text-[12px] tracking-[0.3em] font-pretendard uppercase">Graphic</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphicApp;
