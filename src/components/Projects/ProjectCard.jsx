import React from 'react';
import ProjectCarousel from './ProjectCarousel';

function renderDescription(description) {
    if (Array.isArray(description)) {
        return description.map((line, index) => (
            <p key={index} className="text-lg opacity-80 leading-relaxed font-medium">
                {line}
            </p>
        ));
    }

    if (typeof description === 'string') {
        return description.split('\n').map((line, index) => (
            <p key={index} className="text-lg opacity-80 leading-relaxed font-medium">
                {line}
            </p>
        ));
    }

    return null;
}

function renderLinks(links, accentColor) {
    if (!links) return null;
    const entries = [
        links.website ? { label: 'Website', href: links.website } : null,
        links.googlePlay ? { label: 'Google Play', href: links.googlePlay, iconOnly: true } : null,
        links.ios ? { label: 'iOS', href: links.ios, iconOnly: true } : null,
    ].filter(Boolean);

    if (entries.length === 0) return null;

    return (
        <div className="mt-4 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.35em] font-semibold">
            {entries.map((entry) => (
                <a
                    key={entry.label}
                    href={entry.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-2 rounded-full border transition hover:opacity-90 ${entry.iconOnly ? 'p-3' : 'px-4 py-2'}`}
                    style={{
                        borderColor: accentColor,
                        color: accentColor,
                    }}
                >
                    {entry.label === 'Google Play' && (
                        <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinejoin="round"
                        >
                            <path d="M4.2 3.5l12.8 8.5L4.2 20.5V3.5z" />
                            <path d="M17 12l2.5-1.7c.7-.5.7-1.6 0-2.1L17 6.5" />
                            <path d="M17 12l2.5 1.7c.7.5.7 1.6 0 2.1L17 17.5" />
                        </svg>
                    )}
                    {entry.label === 'iOS' && (
                        <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M15.2 3.5c-.9 1.1-1.5 2.6-1.3 4 .2 0 1.5-.1 2.6-1.4.9-1.1 1.4-2.6 1.3-4-.9 0-2 .5-2.6 1.4z" />
                            <path d="M18.6 12.7c-.1-2.2 1.8-3.3 1.9-3.4-1-1.5-2.7-1.7-3.3-1.7-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8-1.6 0-3 .9-3.8 2.4-1.6 2.8-.4 6.9 1.1 9.2.8 1.1 1.7 2.3 2.9 2.2 1.2 0 1.6-.7 3-.7 1.4 0 1.8.7 3 .7 1.2 0 2-.9 2.7-2 1-1.5 1.4-3 1.4-3.1-.1 0-2.5-1-2.5-3.6z" />
                        </svg>
                    )}
                    {entry.iconOnly ? <span className="sr-only">{entry.label}</span> : entry.label}
                </a>
            ))}
        </div>
    );
}

export default function ProjectCard({ name, description, details, theme, media, links }) {
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
                    <div className="space-y-4">
                        {renderDescription(description)}
                    </div>
                    {(details || links) && (
                        <div className="mt-4 text-sm opacity-60 border-t border-black/10 pt-4">
                            {details}
                            {renderLinks(links, theme.secondary)}
                        </div>
                    )}
                </div>

                {/* Carousel Area */}
                <div className="w-full lg:w-[50%] lg:max-w-2xl shrink-0 mt-8 lg:mt-0 xl:w-[55%]">
                    <ProjectCarousel media={media} />
                </div>
            </div>
        </article>
    );
}
