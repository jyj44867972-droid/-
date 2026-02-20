
import React, { useState, useRef, useEffect } from 'react';
import { client, urlFor } from '../sanity';

interface GraphicItem {
  id: string;
  number: string;
  title: string;
  description: string;
  imgUrl: string;
  x: number;
  y: number;
}

const GraphicApp: React.FC = () => {
  const [items, setItems] = useState<GraphicItem[]>([]);
  const [hoveredItem, setHoveredItem] = useState<GraphicItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<GraphicItem | null>(null);
  const [isOverlayClosing, setIsOverlayClosing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);
  const scrollTop = useRef(0);
  const dragDistance = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `*[_type == "graphic"] | order(number desc)`;
        const data = await client.fetch(query);
        if (data && data.length > 0) {
          const formatted = data.map((item: any) => ({
            id: item._id,
            number: item.number || '',
            title: item.title || '',
            description: item.description || '',
            imgUrl: item.mainImage ? urlFor(item.mainImage).url() : '',
            x: item.x || Math.floor(Math.random() * 100),
            y: item.y || Math.floor(Math.random() * 100)
          }));
          setItems(formatted);
        } else {
          throw new Error("No data");
        }
      } catch (e) {
        console.error("Failed to fetch graphics, using mock data:", e);
        const mockGraphics: GraphicItem[] = Array.from({ length: 16 }).map((_, i) => ({
          id: `g-${i}`,
          number: (16 - i).toString().padStart(2, '0'),
          title: `Graphic Study ${16 - i}`,
          description: 'Experimental graphic design exploration focusing on form and composition.',
          imgUrl: `https://picsum.photos/seed/graphic-${i}/800/800`,
          x: Math.floor(Math.random() * 100),
          y: Math.floor(Math.random() * 100)
        }));
        setItems(mockGraphics);
      }
    };
    fetchData();

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Center scroll on mount after data is likely rendered
    const timer = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollLeft = (containerRef.current.scrollWidth - containerRef.current.clientWidth) / 2;
        containerRef.current.scrollTop = (containerRef.current.scrollHeight - containerRef.current.clientHeight) / 2;
      }
    }, 100);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDragging.current = true;
    dragDistance.current = 0;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    startY.current = e.pageY - containerRef.current.offsetTop;
    scrollLeft.current = containerRef.current.scrollLeft;
    scrollTop.current = containerRef.current.scrollTop;
    containerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !isDragging.current) return;
    
    e.preventDefault();
    const curX = e.pageX - containerRef.current.offsetLeft;
    const curY = e.pageY - containerRef.current.offsetTop;
    const walkX = (curX - startX.current) * 1.5;
    const walkY = (curY - startY.current) * 1.5;
    containerRef.current.scrollLeft = scrollLeft.current - walkX;
    containerRef.current.scrollTop = scrollTop.current - walkY;
    dragDistance.current = Math.sqrt(walkX * walkX + walkY * walkY);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
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
    <div className="w-full h-screen bg-brand-bg relative overflow-hidden flex flex-col">
      
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-full overflow-auto no-scrollbar cursor-grab select-none"
      >
        {/* Large canvas area to allow for 2D panning */}
        <div className="min-w-[300vw] min-h-[300vh] flex items-center justify-center p-[400px] md:p-[800px]">
          <div className="grid grid-cols-5 gap-[160px] md:gap-[220px] lg:gap-[280px] w-max">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col group items-center relative"
                onMouseEnter={() => !isMobile && setHoveredItem(item)}
                onMouseLeave={() => !isMobile && setHoveredItem(null)}
                onClick={() => {
                  if (dragDistance.current < 5) {
                    setSelectedItem(item);
                    setIsOverlayClosing(false);
                  }
                }}
              >
                <div className="w-[80px] md:w-[150px] lg:w-[190px] h-auto bg-[#E2E2E2] overflow-hidden transition-all duration-500 group-hover:scale-[1.05] group-hover:shadow-2xl">
                  {item.imgUrl ? (
                    <img 
                      src={item.imgUrl} 
                      className="w-full h-auto block transition-all duration-700" 
                      alt={item.title}
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full aspect-square flex items-center justify-center">
                       <span className="text-white text-[9px] tracking-[0.2em] font-pretendard">IMAGE</span>
                    </div>
                  )}
                </div>

                {/* Info Box - Appears to the right of the image on hover */}
                {!isMobile && (
                  <div 
                    className={`absolute left-full top-0 ml-20 z-[100] transition-all duration-500 w-[280px] pointer-events-none ${
                      hoveredItem?.id === item.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                  >
                    <div className="text-left pt-0 pb-2">
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="text-[42px] font-black text-[#E2E2E2] font-pretendard tracking-tighter leading-none">
                          {item.number}
                        </span>
                        <span className="text-[10px] text-[#888] font-pretendard uppercase tracking-widest font-bold">
                          X:{Math.round(item.x)} Y:{Math.round(item.y)}
                        </span>
                      </div>
                      <h4 className="text-[14px] font-bold text-[#111] mb-1 font-pretendard">
                        {item.title}
                      </h4>
                      <p className="text-[12px] text-[#555] leading-[1.6] break-keep font-pretendard max-w-[140px]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mouse Coordinates removed as per user request */}

      {/* Overlay Detail */}
      {selectedItem && (
        <div 
          className={`fixed inset-0 z-[200] bg-black/60 flex items-center justify-center backdrop-blur-md ${
            isOverlayClosing ? 'animate-detail-bg-out' : 'animate-detail-bg-in'
          }`}
          onClick={closeOverlay}
        >
          <div 
            className={`max-w-[260px] md:max-w-[350px] w-full flex flex-col items-center cursor-pointer ${
              isOverlayClosing ? 'animate-detail-content-down' : 'animate-detail-content-up'
            }`}
          >
            <div className="w-full flex flex-col items-center">
              <div className="w-full text-left mb-4">
                <div className="flex items-baseline gap-3 leading-none">
                   <span className="text-[42px] font-black text-white font-pretendard tracking-tighter">
                     {selectedItem.number}
                   </span>
                   <span className="text-[10px] text-white/40 font-pretendard uppercase tracking-widest font-bold">
                     X:{Math.round(selectedItem.x)} Y:{Math.round(selectedItem.y)}
                   </span>
                </div>
                <div className="mt-1">
                  <h4 className="text-[17px] font-bold text-white font-pretendard leading-tight">
                    {selectedItem.title}
                  </h4>
                  <p className="text-[14px] text-white/60 leading-[1.6] break-keep font-pretendard mt-1.5">
                    {selectedItem.description}
                  </p>
                </div>
              </div>

              <div className="w-full h-auto overflow-hidden shadow-2xl">
                {selectedItem.imgUrl ? (
                  <img 
                    src={selectedItem.imgUrl} 
                    className="w-full h-auto object-contain block" 
                    alt={selectedItem.title}
                  />
                ) : (
                  <div className="w-full aspect-[3/4] flex items-center justify-center bg-white/5">
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
