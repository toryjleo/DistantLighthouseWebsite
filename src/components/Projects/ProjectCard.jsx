import React from 'react';
import { Link } from 'react-router-dom';
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
    const hasBadges = links.googlePlay || links.ios;
    const hasActionLinks = links.demo || links.download;

    return (
        <div className="mt-4 flex flex-col items-start gap-3">
            {hasBadges && (
                <div className="flex flex-col gap-2">
                    {links.ios && (
                        <a href={links.ios} target="_blank" rel="noreferrer">
                            <img
                                src="/Badges/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg"
                                alt="Download on the App Store"
                                className="h-10 w-auto"
                            />
                        </a>
                    )}
                    {links.googlePlay && (
                        <a href={links.googlePlay} target="_blank" rel="noreferrer">
                            <img
                                src="/Badges/GetItOnGooglePlay_Badge_Web_color_English.png"
                                alt="Get it on Google Play"
                                className="h-10 w-auto"
                            />
                        </a>
                    )}
                </div>
            )}

            {links.website && (
                <a href={links.website} target="_blank" rel="noreferrer">
                    <img
                        src="/Badges/mohawk_valley_wellness_header.png"
                        alt="Mohawk Valley Wellness"
                        className="h-10 w-auto"
                    />
                </a>
            )}

            {hasActionLinks && (
                <div className="flex flex-wrap gap-3">
                    {links.demo && (
                        links.demo.startsWith('/') ? (
                            <Link
                                to={links.demo}
                                className="rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition"
                                style={{
                                    borderColor: `${accentColor}66`,
                                    color: accentColor,
                                }}
                            >
                                Live Demo
                            </Link>
                        ) : (
                            <a
                                href={links.demo}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition"
                                style={{
                                    borderColor: `${accentColor}66`,
                                    color: accentColor,
                                }}
                            >
                                Live Demo
                            </a>
                        )
                    )}
                    {links.download && (
                        <a
                            href={links.download}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-black/15 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] opacity-70 transition hover:opacity-100"
                        >
                            Download
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}

export default function ProjectCard({ name, description, details, theme, media, links, featured = false }) {
    const hasMedia = Array.isArray(media) && media.length > 0;

    return (
        <article
            className="rounded-xl p-10 overflow-hidden relative shadow-2xl"
            style={{
                backgroundColor: theme.primary,
                color: theme.text,
            }}
        >
            <div className={`grid grid-cols-1 gap-8 relative z-10 ${hasMedia ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:items-stretch' : ''}`}>
                <div className="max-w-xl">
                    {featured && (
                        <p className="text-xs uppercase tracking-[0.4em] opacity-60 font-semibold">
                            Featured Project
                        </p>
                    )}
                    <h3 className="mt-4 text-3xl font-bold sm:text-5xl tracking-tight">{name}</h3>
                </div>

                {/* Carousel Area */}
                {hasMedia && (
                    <div className="w-full lg:col-start-2 lg:row-span-2 lg:max-w-2xl">
                        <ProjectCarousel media={media} />
                    </div>
                )}

                <div className={`max-w-xl flex h-full flex-col gap-8 ${hasMedia ? 'lg:row-start-2' : ''}`}>
                    <div className="space-y-4 text-balance">
                        {renderDescription(description)}
                    </div>
                    {details && (
                        <div className="text-sm opacity-60 border-t border-black/10 pt-4">
                            {details}
                        </div>
                    )}
                    <div className="mt-auto">
                        {renderLinks(links, theme.secondary)}
                    </div>
                </div>
            </div>
        </article>
    );
}
