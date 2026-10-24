"use client";

import { useEffect, useRef, useState } from "react";
import { PiPauseFill, PiPlayFill } from "react-icons/pi";
import { Screens } from "../../constants/Screens";
import SectionHead from "../SectionHead/SectionHead";
import "../Motion/Motion.scss";

const TINTS = ["#CFE3D6", "#F1CBB9", "#C9D2F2", "#F1E2A6"];
const RING = 2 * Math.PI * 12;
const pad = (n) => String(n).padStart(2, "0");

// The design shows a single row of four pieces.
const PIECES = Screens.slice(0, 4);

// Lazy-loads near the viewport, autoplays while in view, ring = progress.
const ScreenVideo = ({ src, title }) => {
    const videoRef = useRef(null);
    const ringRef = useRef(null);
    const userPaused = useRef(false);
    const [loaded, setLoaded] = useState(false);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        const video = videoRef.current;

        const near = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setLoaded(true);
                    near.disconnect();
                }
            },
            { rootMargin: "400px" },
        );

        const visible = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !userPaused.current) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            },
            { threshold: 0.5 },
        );

        near.observe(video);
        visible.observe(video);

        return () => {
            near.disconnect();
            visible.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!playing) return undefined;

        let frame = 0;

        const draw = () => {
            const video = videoRef.current;
            const progress = video.duration ? video.currentTime / video.duration : 0;

            ringRef.current?.setAttribute("stroke-dashoffset", RING * (1 - progress));
            frame = requestAnimationFrame(draw);
        };

        frame = requestAnimationFrame(draw);

        return () => cancelAnimationFrame(frame);
    }, [playing]);

    const toggle = () => {
        const video = videoRef.current;

        if (video.paused) {
            userPaused.current = false;
            video.play().catch(() => {});
        } else {
            userPaused.current = true;
            video.pause();
        }
    };

    return (
        <>
            <video
                ref={videoRef}
                src={loaded ? src : undefined}
                muted
                loop
                playsInline
                preload="none"
                aria-label={title}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onClick={toggle}
            />

            <button
                type="button"
                className="ring"
                onClick={toggle}
                aria-label={playing ? `Pause ${title}` : `Play ${title}`}
            >
                <svg viewBox="0 0 30 30" aria-hidden>
                    <circle cx="15" cy="15" r="12" className="ring__track" />
                    <circle
                        ref={ringRef}
                        cx="15"
                        cy="15"
                        r="12"
                        className="ring__progress"
                        strokeDasharray={RING}
                        strokeDashoffset={RING}
                    />
                </svg>
                {playing ? <PiPauseFill aria-hidden /> : <PiPlayFill aria-hidden />}
            </button>
        </>
    );
};

const Motion = () => {
    const count = pad(PIECES.length);

    return (
        <section className="motion" id="motion">
            <div className="motion__head" data-reveal>
                <div className="motion__head-left">
                    <SectionHead
                        number="03"
                        symbol="Mo."
                        title="In Motion."
                        meta={`Mobile · ${count} pieces`}
                        desc="Real screens and interactions from mobile apps I've shipped or recreated — polished UI, buttery transitions and the details that make users stay."
                    />
                </div>
                <p className="motion__count">{count} pieces · React Native / Expo</p>
            </div>

            <div className="motion__tiles">
                {PIECES.map((screen, index) => (
                    <figure
                        className="piece"
                        key={screen.id}
                        data-reveal
                        style={{ "--i": index % 4 }}
                    >
                        <div className="piece__media" style={{ background: TINTS[index % TINTS.length] }}>
                            <div className="piece__phone">
                                <div className="piece__screen">
                                    {screen.video ? (
                                        <ScreenVideo src={screen.video} title={screen.title} />
                                    ) : (
                                        <img
                                            src={screen.cover}
                                            alt={`${screen.app} — ${screen.title}`}
                                            loading="lazy"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <figcaption className="piece__meta">
                            <span className="piece__index">{pad(index + 1)}</span>
                            <span className="piece__text">
                                <span className="piece__title">{screen.title}</span>
                                <span className="piece__sub">
                                    {screen.app} · {screen.tagline}
                                </span>
                            </span>
                            <span className="piece__tag">{screen.video ? "video" : "screen"}</span>
                        </figcaption>
                    </figure>
                ))}
            </div>
        </section>
    );
};

export default Motion;
