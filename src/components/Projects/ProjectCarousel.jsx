import React, { useState } from 'react';

export default function ProjectCarousel({ media }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);

    if (!media || media.length === 0) return null;

    const activeItem = media[activeIndex];

    return (
        <div className="flex flex-col gap-3">
            {/* Main View */}
            <div className="w-full aspect-video bg-black/10 rounded-lg overflow-hidden border border-black/10 shadow-lg relative bg-black">
                {activeItem.type === 'video' ? (
                    <>
                        <video
                            key={activeItem.src}
                            src={activeItem.src}
                            autoPlay
                            loop
                            muted={isMuted}
                            playsInline
                            className="w-full h-full object-cover transition-opacity duration-500"
                        />
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 transition-colors z-10 backdrop-blur-sm"
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                </svg>
                            )}
                        </button>
                    </>
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
