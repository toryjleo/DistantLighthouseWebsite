import React, { useState, useRef } from 'react';

export default function ProjectCarousel({ media }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef(null);

    const handleFullscreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            } else if (videoRef.current.webkitRequestFullscreen) {
                videoRef.current.webkitRequestFullscreen();
            } else if (videoRef.current.msRequestFullscreen) {
                videoRef.current.msRequestFullscreen();
            }
        }
    };

    if (!media || media.length === 0) return null;

    const activeItem = media[activeIndex];

    return (
        <div className="flex flex-col gap-3">
            {/* Main View */}
            <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-black/10 rounded-lg overflow-hidden border border-black/10 shadow-lg relative bg-black">
                {activeItem.type === 'video' ? (
                    <>
                        <video
                            ref={videoRef} // Assign the ref to the video element
                            key={activeItem.src}
                            src={activeItem.src}
                            autoPlay
                            loop
                            muted={isMuted}
                            playsInline
                            className="w-full h-full object-contain transition-opacity duration-500" // Changed object-cover to object-contain
                        />
                        <div className="absolute bottom-4 right-4 flex gap-2 z-10"> {/* Wrapper div for buttons */}
                            <button
                                onClick={handleFullscreen}
                                className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 transition-colors backdrop-blur-sm"
                                title="Fullscreen"
                                aria-label="Fullscreen video"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 transition-colors backdrop-blur-sm"
                                title={isMuted ? "Unmute" : "Mute"}
                                aria-label={isMuted ? "Unmute video" : "Mute video"}
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
                        </div>
                    </>
                ) : (
                    <img
                        key={activeItem.src}
                        src={activeItem.src}
                        alt={activeItem.label}
                        className="w-full h-full object-contain transition-opacity duration-500"
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
