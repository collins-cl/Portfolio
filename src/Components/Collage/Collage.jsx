"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { PiCheckCircleFill } from "react-icons/pi";
import { prefersReducedMotion } from "../../hooks/useReducedMotion";
import { useSpotify } from "../../hooks/useSpotify";
import { playTick } from "../../lib/tick";
import "../Collage/Collage.scss";

// Two hand-placed compositions from the pen (desktop 1440 × 580, tablet
// 768 × 720). Positions are each object's top-left before rotation; `rot`
// is the pen's counter-clockwise angle. Objects missing from a layout hide.
const LAYOUTS = {
    desktop: {
        width: 1440,
        height: 580,
        hint: [1060, 540],
        items: {
            polaroid: [150, 78, 5],
            vinyl: [590, 150, 0],
            sleeve: [470, 150, -4],
            phone: [930, 76, -7],
            sticky: [1170, 250, 4],
            terminal: [300, 420, -3],
            stamp: [790, 430, -12],
        },
    },
    tablet: {
        width: 768,
        height: 720,
        hint: [28, 690],
        items: {
            polaroid: [28, 56, 5],
            vinyl: [430, 40, 0],
            phone: [520, 300, -7],
            sticky: [40, 440, 4],
            terminal: [250, 500, -3],
            stamp: [330, 320, -12],
        },
    },
};

// Approximate rendered sizes, used to convert the pen's top-left rotation
// into a centre rotation (which feels right while dragging).
const SIZES = {
    polaroid: [268, 310],
    vinyl: [240, 240],
    sleeve: [240, 240],
    phone: [186, 380],
    sticky: [196, 196],
    terminal: [300, 109],
    stamp: [116, 116],
};

const placeFor = (id, [x, y, rot]) => {
    const [w, h] = SIZES[id];
    const angle = (-rot * Math.PI) / 180;
    const cx = x + (w / 2) * Math.cos(angle) - (h / 2) * Math.sin(angle);
    const cy = y + (w / 2) * Math.sin(angle) + (h / 2) * Math.cos(angle);

    return { left: cx - w / 2, top: cy - h / 2, rot: -rot };
};

const SPRING = 0.16;
const DAMPING = 0.74;

const Collage = () => {
    const { status, track } = useSpotify();
    const wrapRef = useRef(null);
    const stageRef = useRef(null);
    const itemRefs = useRef({});
    const bodies = useRef({});
    const frame = useRef(0);
    const zTop = useRef(10);
    const drag = useRef(null);

    const [layoutKey, setLayoutKey] = useState("desktop");
    const [fit, setFit] = useState({ scale: 1, left: 0 });
    const [tip, setTip] = useState(null);

    const layout = LAYOUTS[layoutKey];

    const tips = {
        polaroid: { text: "my desk, 2am — where the bugs live", color: "var(--pink)" },
        vinyl: {
            text: `${status === "playing" ? "now playing" : "on repeat"} — ${track.title}, ${track.artist}`,
            color: "var(--cyan)",
        },
        sleeve: { text: `${track.album || track.title} — ${track.artist}`, color: "var(--yellow)" },
        phone: { text: "SkillDuel — 1v1 duels, built over a lot of weekends", color: "var(--lilac)" },
        sticky: { text: "the only process doc I actually follow", color: "var(--mint)" },
        terminal: { text: "first thing I open, last thing I close", color: "var(--mint)" },
        stamp: { text: "3+ years shipping for clients across continents", color: "var(--pink)" },
    };

    // Pick a composition and scale it to fit the available width.
    useLayoutEffect(() => {
        const wrap = wrapRef.current;

        if (!wrap) return undefined;

        const measure = () => {
            const width = wrap.clientWidth;
            const key = width >= 1100 ? "desktop" : "tablet";
            const scale = Math.min(1, width / LAYOUTS[key].width);

            setLayoutKey(key);
            setFit({ scale, left: (width - LAYOUTS[key].width * scale) / 2 });
        };

        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(wrap);

        return () => observer.disconnect();
    }, []);

    // A new composition starts every object back at rest.
    useEffect(() => {
        bodies.current = {};
        Object.values(itemRefs.current).forEach((node) => {
            if (node) node.style.transform = "";
        });
    }, [layoutKey]);

    const render = useCallback((id) => {
        const node = itemRefs.current[id];
        const b = bodies.current[id];

        if (!node || !b) return;

        node.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${b.rot + b.tilt}deg) scale(${b.scale})`;
    }, []);

    const step = useCallback(() => {
        let moving = false;

        Object.entries(bodies.current).forEach(([id, b]) => {
            b.vx = (b.vx + (b.tx - b.x) * SPRING) * DAMPING;
            b.vy = (b.vy + (b.ty - b.y) * SPRING) * DAMPING;
            b.x += b.vx;
            b.y += b.vy;

            const tiltTarget = Math.max(-12, Math.min(12, b.vx * 0.9));
            b.tilt += (tiltTarget - b.tilt) * 0.2;
            b.scale += ((b.held ? 1.05 : 1) - b.scale) * 0.25;

            const settled =
                !b.held &&
                Math.abs(b.vx) + Math.abs(b.vy) < 0.02 &&
                Math.abs(b.tx - b.x) + Math.abs(b.ty - b.y) < 0.1 &&
                Math.abs(b.tilt) < 0.05 &&
                Math.abs(b.scale - 1) < 0.002;

            if (settled) {
                b.x = b.tx;
                b.y = b.ty;
                b.tilt = 0;
                b.scale = 1;
            } else {
                moving = true;
            }

            render(id);
        });

        frame.current = moving ? requestAnimationFrame(step) : 0;
    }, [render]);

    const kick = useCallback(() => {
        if (!frame.current) frame.current = requestAnimationFrame(step);
    }, [step]);

    useEffect(() => () => cancelAnimationFrame(frame.current), []);

    const toStage = (event) => {
        const rect = stageRef.current.getBoundingClientRect();

        return {
            x: (event.clientX - rect.left) / fit.scale,
            y: (event.clientY - rect.top) / fit.scale,
        };
    };

    const showTip = (id, event) => {
        const rect = wrapRef.current.getBoundingClientRect();

        setTip({
            id,
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        });
    };

    const onPointerDown = (id) => (event) => {
        if (event.button !== 0) return;

        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);

        const b = (bodies.current[id] ??= {
            rot: placeFor(id, layout.items[id]).rot,
            x: 0,
            y: 0,
            tx: 0,
            ty: 0,
            vx: 0,
            vy: 0,
            tilt: 0,
            scale: 1,
        });
        const point = toStage(event);

        b.held = true;
        drag.current = { id, startX: point.x - b.tx, startY: point.y - b.ty };
        itemRefs.current[id].style.zIndex = ++zTop.current;
        itemRefs.current[id].classList.add("is-held");
        setTip(null);
        playTick();
        kick();
    };

    const onPointerMove = (id) => (event) => {
        const active = drag.current;

        if (!active || active.id !== id) {
            if (event.pointerType === "mouse") showTip(id, event);
            return;
        }

        const b = bodies.current[id];
        const point = toStage(event);

        b.tx = point.x - active.startX;
        b.ty = point.y - active.startY;

        if (prefersReducedMotion()) {
            b.x = b.tx;
            b.y = b.ty;
            b.vx = 0;
            b.vy = 0;
        }

        kick();
    };

    const onPointerUp = (id) => (event) => {
        const active = drag.current;

        if (!active || active.id !== id) return;

        const b = bodies.current[id];
        const place = placeFor(id, layout.items[id]);
        const [w, h] = SIZES[id];

        // Fling a little with the release velocity, but keep it on stage.
        const reduced = prefersReducedMotion();
        const flingX = reduced ? 0 : b.vx * 6;
        const flingY = reduced ? 0 : b.vy * 6;

        b.tx = Math.max(-place.left - w + 60, Math.min(layout.width - place.left - 60, b.tx + flingX));
        b.ty = Math.max(-place.top - h + 60, Math.min(layout.height - place.top - 60, b.ty + flingY));
        b.held = false;
        drag.current = null;
        itemRefs.current[id].classList.remove("is-held");

        if (event.pointerType === "mouse") showTip(id, event);
        kick();
    };

    const objectProps = (id) => {
        const position = layout.items[id];

        if (!position) return null;

        const place = placeFor(id, position);

        return {
            ref: (node) => {
                itemRefs.current[id] = node;
            },
            className: `collage__item collage__item--${id}`,
            style: {
                left: place.left,
                top: place.top,
                "--rot": `${place.rot}deg`,
            },
            role: "img",
            "aria-label": tips[id].text,
            onPointerDown: onPointerDown(id),
            onPointerMove: onPointerMove(id),
            onPointerUp: onPointerUp(id),
            onPointerCancel: onPointerUp(id),
            onPointerLeave: () => setTip((current) => (current?.id === id ? null : current)),
        };
    };

    const playing = status === "playing";

    const piece = (id, children) => {
        const props = objectProps(id);

        if (!props) return null;

        return (
            <div {...props}>
                <div className="collage__body">{children}</div>
            </div>
        );
    };

    return (
        <section
            className="collage load-item"
           
            aria-label="A collage of things on my desk"
            ref={wrapRef}
            style={{
                "--i": 8,
                height: layout.height * fit.scale,
                backgroundPositionX: fit.left,
            }}
        >
            <div
                className="collage__stage"
                ref={stageRef}
                style={{
                    width: layout.width,
                    height: layout.height,
                    left: fit.left,
                    transform: `scale(${fit.scale})`,
                }}
            >
                {piece(
                    "polaroid",
                    <>
                        <img src="/media/collage/polaroid.jpg" alt="" draggable={false} />
                        <span>where the bugs live</span>
                    </>,
                )}

                {piece(
                    "vinyl",
                    <div className={`vinyl${playing ? " is-playing" : ""}`}>
                        <img src={track.albumArt} alt="" draggable={false} />
                    </div>,
                )}

                {piece("sleeve", <img src={track.albumArt} alt="" draggable={false} />)}

                {piece(
                    "phone",
                    <div className="duel">
                        <div className="duel__top">
                            <span>ROUND 3/5</span>
                            <span className="duel__timer">0:07</span>
                        </div>
                        <div className="duel__bar">
                            <span />
                        </div>
                        <p className="duel__q">Which hook runs after every render?</p>
                        {["useMemo", "useEffect", "useRef", "useId"].map((answer) => (
                            <div
                                key={answer}
                                className={`duel__a${answer === "useEffect" ? " is-right" : ""}`}
                            >
                                {answer}
                                {answer === "useEffect" && <PiCheckCircleFill aria-hidden />}
                            </div>
                        ))}
                        <span className="duel__xp">+20 XP</span>
                    </div>,
                )}

                {piece(
                    "sticky",
                    <p>
                        ship it.
                        <br />
                        fix it.
                        <br />
                        ship it again.
                    </p>,
                )}

                {piece(
                    "terminal",
                    <>
                        <span className="terminal__dots">
                            <i />
                            <i />
                            <i />
                        </span>
                        <span>$ npm run dev</span>
                        <span className="terminal__dim">▲ Next.js · ready in 1.2s</span>
                        <span className="terminal__ok">✓ compiled /duel/live</span>
                    </>,
                )}

                {piece(
                    "stamp",
                    <>
                        <strong>3+ YRS</strong>
                        <span>SHIPPING</span>
                    </>,
                )}

                <p className="collage__hint" style={{ left: layout.hint[0], top: layout.hint[1] }}>
                    ↖ drag things around · hover for the backstory
                </p>
            </div>

            {tip && tips[tip.id] && (
                <span
                    className="collage__tip"
                    style={{
                        left: tip.x + 18,
                        top: tip.y - 30,
                        background: tips[tip.id].color,
                    }}
                    aria-hidden
                >
                    {tips[tip.id].text}
                </span>
            )}
        </section>
    );
};

export default Collage;
