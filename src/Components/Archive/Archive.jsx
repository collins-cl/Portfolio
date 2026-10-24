"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PiArrowUpRight, PiGithubLogo } from "react-icons/pi";
import { ARCHIVE, ARCHIVE_CATEGORIES } from "../../constants/Projects";
import { prefersReducedMotion } from "../../hooks/useReducedMotion";
import SectionHead from "../SectionHead/SectionHead";
import "../Archive/Archive.scss";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const pad = (n) => String(n).padStart(2, "0");
const categoryOf = (id) => ARCHIVE_CATEGORIES.find((category) => category.id === id);

const Art = ({ art }) => {
    const videoRef = useRef(null);

    // Videos pause when their tile closes (and the node unmounts).
    useEffect(() => {
        const video = videoRef.current;

        return () => video?.pause();
    }, []);

    if (!art) {
        return <div className="archive-tile__art archive-tile__art--empty" aria-hidden />;
    }

    return art.type === "video" ? (
        <video
            ref={videoRef}
            className="archive-tile__art"
            src={art.src}
            autoPlay
            muted
            loop
            playsInline
        />
    ) : (
        <img
            className={`archive-tile__art${art.fit === "top" ? " is-top" : ""}`}
            src={art.src}
            alt=""
            loading="lazy"
        />
    );
};

const Archive = () => {
    const [openId, setOpenId] = useState(ARCHIVE[0].id);
    const tableRef = useRef(null);
    const before = useRef(null);

    const measure = () => {
        const rects = {};

        tableRef.current.querySelectorAll("[data-tile]").forEach((node) => {
            rects[node.dataset.tile] = node.getBoundingClientRect();
        });

        return rects;
    };

    const toggle = (id) => {
        before.current = prefersReducedMotion() ? null : measure();
        setOpenId((current) => (current === id ? null : id));
    };

    // FLIP: animate every tile from its old box to its new one.
    useLayoutEffect(() => {
        const old = before.current;

        if (!old) return;

        before.current = null;

        tableRef.current.querySelectorAll("[data-tile]").forEach((node) => {
            const from = old[node.dataset.tile];
            const to = node.getBoundingClientRect();

            if (!from) return;

            const dx = from.left - to.left;
            const dy = from.top - to.top;

            if (!dx && !dy && from.width === to.width && from.height === to.height) return;

            node.animate(
                [
                    {
                        transform: `translate(${dx}px, ${dy}px)`,
                        width: `${from.width}px`,
                        height: `${from.height}px`,
                    },
                    {
                        transform: "translate(0, 0)",
                        width: `${to.width}px`,
                        height: `${to.height}px`,
                    },
                ],
                { duration: 240, easing: EASE },
            );
        });
    }, [openId]);

    const counts = ARCHIVE_CATEGORIES.map((category) => ({
        ...category,
        count: ARCHIVE.filter((item) => item.category === category.id).length,
    }));

    return (
        <section className="archive split" id="archive">
            <div className="archive__intro split__intro" data-reveal>
                <SectionHead
                    number="04"
                    symbol="Ar."
                    title="Archive."
                    meta={`${ARCHIVE.length + 1} elements · 1 open slot`}
                    desc="A running list of everything I've shipped — big, small, serious, and some that made more sense at the time."
                />

                <div className="legend">
                    <p className="legend__label">Categories</p>
                    <ul className="legend__rows">
                        {counts.map((category) => (
                            <li key={category.id}>
                                <span className="legend__swatch" style={{ background: category.color }} />
                                <span>{category.label}</span>
                                <span className="legend__count">{pad(category.count)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="archive__table" ref={tableRef} data-reveal style={{ "--i": 1 }}>
                {ARCHIVE.map((item, index) => {
                    const open = item.id === openId;
                    const category = categoryOf(item.category);

                    return (
                        <div
                            key={item.id}
                            data-tile={item.id}
                            className={`archive-tile${open ? " is-open" : ""}`}
                            role="button"
                            tabIndex={0}
                            aria-expanded={open}
                            onClick={() => toggle(item.id)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    toggle(item.id);
                                }
                            }}
                        >
                            <div className="archive-tile__info">
                                <div className="archive-tile__top">
                                    <span>{pad(index + 1)}</span>
                                    <span className="archive-tile__category">
                                        <i style={{ background: category.color }} />
                                        {category.label}
                                    </span>
                                </div>

                                {open ? (
                                    <>
                                        <div className="archive-tile__title">
                                            <span className="archive-tile__symbol">{item.symbol}</span>
                                            <h3>{item.name}</h3>
                                        </div>
                                        <p className="archive-tile__desc">{item.desc}</p>
                                        {item.links.length > 0 && (
                                            <div className="archive-tile__links">
                                                {item.links.map((link) => (
                                                    <a
                                                        key={link.href}
                                                        href={link.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(event) => event.stopPropagation()}
                                                        onKeyDown={(event) => event.stopPropagation()}
                                                    >
                                                        {link.source ? <PiGithubLogo aria-hidden /> : <PiArrowUpRight aria-hidden />}
                                                        {link.label}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <span className="archive-tile__symbol">{item.symbol}</span>
                                        <div className="archive-tile__bottom">
                                            <span className="archive-tile__text">
                                                <h3>{item.name}</h3>
                                                <span>{item.stack}</span>
                                            </span>
                                            <PiArrowUpRight className="archive-tile__arrow" aria-hidden />
                                        </div>
                                    </>
                                )}
                            </div>

                            {open && <Art art={item.art} />}
                        </div>
                    );
                })}

                <a
                    href="#contact"
                    data-tile="open-slot"
                    className="archive-tile archive-tile--slot"
                >
                    <div className="archive-tile__info">
                        <div className="archive-tile__top">
                            <span>{pad(ARCHIVE.length + 1)}</span>
                        </div>
                        <span className="archive-tile__symbol">??</span>
                        <div className="archive-tile__bottom">
                            <span className="archive-tile__text">
                                <h3>Your project</h3>
                                <span>Let's build it</span>
                            </span>
                            <PiArrowUpRight className="archive-tile__arrow" aria-hidden />
                        </div>
                    </div>
                </a>
            </div>
        </section>
    );
};

export default Archive;
