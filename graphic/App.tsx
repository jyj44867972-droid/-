
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, percentX: 0, percentY: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
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
          const formatted = data.map((item: any, index: number) => {
            const col = index % 5;
            const row = Math.floor(index / 5);
            const totalRows = Math.ceil(data.length / 5);
            return {
              id: item._id,
              number: item.number || '',
              title: item.title || '',
              description: item.description || '',
              imgUrl: item.mainImage ? urlFor(item.mainImage).url() : '',
              x: (col / 4) * 100,
              y: (row / (totalRows > 1 ? totalRows - 1 : 1)) * 100
            };
          });
          setItems(formatted);
        } else {
          throw new Error("No data");
        }
      } catch (e) {
        console.error("Failed to fetch graphics, using mock data:", e);
        const mockGraphics: GraphicItem[] = Array.from({ length: 16 }).map((_, i) => {
          const col = i % 5;
          const row = Math.floor(i / 5);
          const totalRows = Math.ceil(16 / 5);
          return {
            id: `g-${i}`,
            number: (16 - i).toString().padStart(2, '0'),
            title: `Graphic Study ${16 - i}`,
            description: 'Experimental graphic design exploration focusing on form and composition.',
            imgUrl: `https://picsum.photos/seed/graphic-${i}/800/800`,
            x: (col / 4) * 100,
            y: (row / (totalRows - 1)) * 100
          };
        });
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
    if (!containerRef.current || !gridRef.current) return;
    
    // Update mouse position for coordinates display relative to the grid
    const gridRect = gridRef.current.getBoundingClientRect();
    const xInGrid = e.clientX - gridRect.left;
    const yInGrid = e.clientY - gridRect.top;
    
    const percentX = (xInGrid / gridRect.width) * 100;
    const percentY = (yInGrid / gridRect.height) * 100;

    setMousePos({ 
      x: e.clientX, 
      y: e.clientY,
      percentX: Math.max(0, Math.min(100, Math.round(percentX))),
      percentY: Math.max(0, Math.min(100, Math.round(percentY)))
    });

    if (!isDragging.current) return;
    
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
          <div ref={gridRef} className="grid grid-cols-5 gap-[160px] md:gap-[280px] lg:gap-[360px] w-max">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative w-[80px] md:w-[150px] lg:w-[190px]"
                onMouseEnter={() => !isMobile && setHoveredItem(item)}
                onMouseLeave={() => !isMobile && setHoveredItem(null)}
                onClick={() => {
                  if (dragDistance.current < 5) {
                    setSelectedItem(item);
                    setIsOverlayClosing(false);
                  }
                }}
              >
                <div className="w-full h-auto bg-[#E2E2E2] overflow-hidden transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl cursor-pointer">
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
                    className={`absolute left-full top-0 ml-4 md:ml-6 lg:ml-8 z-[100] transition-all duration-500 w-[140px] lg:w-[180px] pointer-events-none ${
                      hoveredItem?.id === item.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                  >
                    <div className="text-left pt-0 pb-2">
                      <div className="flex items-baseline gap-2 lg:gap-3 mb-1">
                        <span className="text-[36px] lg:text-[42px] font-black text-[#E2E2E2] font-pretendard tracking-tighter leading-none">
                          {item.number}
                        </span>
                        <span className="text-[9px] lg:text-[10px] text-[#888] font-pretendard uppercase tracking-widest font-bold">
                          X:{Math.round(item.x)} Y:{Math.round(item.y)}
                        </span>
                      </div>
                      <h4 className="text-[13px] lg:text-[14px] font-bold text-[#111] mb-1 font-pretendard">
                        {item.title}
                      </h4>
                      <p className="text-[11px] lg:text-[12px] text-[#555] leading-[1.5] break-keep font-pretendard">
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

      {/* Mouse Coordinates */}
      {!isMobile && !selectedItem && (
        <div 
          className="fixed z-[150] pointer-events-none text-[10px] font-bold text-[#FF5C28] font-pretendard"
          style={{ 
            left: mousePos.x + 15, 
            top: mousePos.y + 15 
          }}
        >
          X:{mousePos.percentX} Y:{mousePos.percentY}
        </div>
      )}

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
