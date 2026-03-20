import React from 'react';
import ProjectCarousel from './ProjectCarousel';

export default function ProjectCard({ name, description, details, theme, media }) {
    return (
        <article
            className="rounded-xl p-10 overflow-hidden relative shadow-2xl"
            style={{
                backgroundColor: theme.primary,
                color: theme.text,
            }}
        >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between relative z-10">
                <div className="max-w-xl space-y-6">
                    <p className="text-xs uppercase tracking-[0.4em] opacity-60 font-semibold">
                        Featured Project
                    </p>
                    <h3 className="text-3xl font-bold sm:text-5xl tracking-tight">{name}</h3>
                    <p className="text-lg opacity-80 leading-relaxed font-medium">
                        {description}
                    </p>
                    {details && (
                        <div className="mt-4 text-sm opacity-60 border-t border-black/10 pt-4">
                            {details}
                        </div>
                    )}
                </div>

                {/* Carousel Area */}
                <div className="w-full lg:w-[50%] lg:max-w-2xl shrink-0 mt-8 lg:mt-0 xl:w-[55%]">
                    <ProjectCarousel media={media} />
                </div>
            </div>

            {/* Decorative Glow Elements */}
            <div
                className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none opacity-50"
                style={{ backgroundColor: theme.secondary }}
            />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        </article>
    );
}
