"use client";

import { useEffect, useRef, useState } from "react";
import { PiArrowUpRight } from "react-icons/pi";
import { WORK, WORK_FILTERS } from "../../constants/Projects";
import { prefersReducedMotion } from "../../hooks/useReducedMotion";
import SectionHead from "../SectionHead/SectionHead";
import "../SelectedWork/SelectedWork.scss";

const FADE_MS = 180;
const ALL_LIMIT = 4;

// Column A starts tall, column B starts short — the pen's staggered bento.
const HEIGHTS = [
    [460, 340],
    [340, 460],
];

const Project = ({ project, height }) => {
    const pillRef = useRef(null);

    const movePill = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const pill = pillRef.current;

        pill.style.setProperty("--x", `${event.clientX - rect.left}px`);
        pill.style.setProperty("--y", `${event.clientY - rect.top}px`);
    };

    // Mobile apps have no live URL, so they render as a plain card.
    const Wrapper = project.link ? "a" : "div";
    const linkProps = project.link
        ? { href: project.link, target: "_blank", rel: "noopener noreferrer" }
        : {};

    return (
        <Wrapper
            className={`project project--${project.category}`}
            {...linkProps}
        >
            <div
                className="project__media"
                style={{ height }}
                onPointerMove={project.link ? movePill : undefined}
                onPointerEnter={project.link ? movePill : undefined}
            >
                {project.media.type === "video" ? (
                    <video
                        src={project.media.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        aria-label={`${project.name} demo`}
                    />
                ) : (
                    <img src={project.media.src} alt={`${project.name} cover`} loading="lazy" />
                )}

                {project.link && (
                    <span className="project__pill" ref={pillRef} aria-hidden>
                        View live <PiArrowUpRight />
                    </span>
                )}
            </div>

            <div className="project__meta">
                <div className="project__title">
                    <h3>{project.name}</h3>
                    {project.link && <PiArrowUpRight aria-hidden />}
                </div>
                <p className="project__desc">{project.desc}</p>
                <p className="project__stack">{project.stack}</p>
            </div>
        </Wrapper>
    );
};

const SelectedWork = ({ filter, onFilter }) => {
    const [shown, setShown] = useState(filter);
    const [fading, setFading] = useState(false);

    // Cross-fade: fade the grid out, swap the list, fade back in.
    useEffect(() => {
        if (filter === shown) return undefined;

        if (prefersReducedMotion()) {
            setShown(filter);
            return undefined;
        }

        setFading(true);

        const timer = setTimeout(() => {
            setShown(filter);
            setFading(false);
        }, FADE_MS);

        return () => clearTimeout(timer);
    }, [filter, shown]);

    const projects =
        shown === "all"
            ? WORK.slice(0, ALL_LIMIT)
            : WORK.filter((project) => project.category === shown);
    const columns = [[], []];

    projects.forEach((project, index) => columns[index % 2].push(project));

    return (
        <section className="work split" id="work">
            <div className="work__intro split__intro" data-reveal>
                <SectionHead
                    number="02"
                    symbol="Sw."
                    title="Selected Work."
                    meta="Client & personal"
                    desc="Things I've built for clients and for myself — marketplaces, realtime games, a crypto exchange and a helpdesk. The ones I'd show my mum first."
                />

                <div className="tabs" role="tablist" aria-label="Filter projects">
                    {WORK_FILTERS.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={filter === tab.id}
                            className={`tabs__tab${filter === tab.id ? " is-active" : ""}`}
                            onClick={() => onFilter(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`bento${fading ? " is-fading" : ""}`}>
                {columns.map((column, columnIndex) => (
                    <div
                        className="bento__column"
                        key={columnIndex}
                        data-reveal
                        style={{ "--i": columnIndex + 1 }}
                    >
                        {column.map((project, index) => (
                            <Project
                                key={project.id}
                                project={project}
                                height={HEIGHTS[columnIndex][index % 2]}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SelectedWork;
