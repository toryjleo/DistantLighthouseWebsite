import React, { useState } from 'react';

export default function ProjectCarousel({ media }) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!media || media.length === 0) return null;

    const activeItem = media[activeIndex];

    return (
        <div className="flex flex-col gap-3">
            {/* Main View */}
            <div className="w-full aspect-video bg-black/10 rounded-lg overflow-hidden border border-black/10 shadow-lg relative bg-black">
                {activeItem.type === 'video' ? (
                    <video
                        key={activeItem.src}
                        src={activeItem.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover transition-opacity duration-500"
                    />
                ) : (
                    <img
                        key={activeItem.src}
                        src={activeItem.src}
                        alt={activeItem.label}
                        className="w-full h-full object-cover transition-opacity duration-500"
                    />
                )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {media.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`flex-shrink-0 w-32 aspect-video rounded border overflow-hidden transition-all duration-200 ${idx === activeIndex
                                ? 'border-white/80 ring-2 ring-white/50 opacity-100 scale-[1.02]'
                                : 'border-transparent opacity-60 hover:opacity-100 hover:border-white/40'
                            }`}
                        title={item.label}
                    >
                        {item.thumb ? (
                            <img src={item.thumb} alt={item.label} className="w-full h-full object-cover" />
                        ) : item.type === 'video' ? (
                            // Using video as thumbnail (might be heavy if many, but ok for a few)
                            <video src={item.src} className="w-full h-full object-cover pointer-events-none" />
                        ) : item.type === 'image' ? (
                            <img src={item.src} alt={item.label} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-black/20 flex items-center justify-center text-[10px] text-white/50 p-2 text-center">
                                {item.label}
                            </div>
                        )}

                        {/* Dark overlay for inactive */}
                        {idx !== activeIndex && (
                            <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
