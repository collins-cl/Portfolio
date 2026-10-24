"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { PiHeart, PiHeartFill, PiShuffle, PiSmiley, PiSortAscending } from "react-icons/pi";
import { NOTE_COLORS, SEED_NOTES } from "../../constants/Guestbook";
import { useToast } from "../../hooks/useToast";
import { fetchNotes, reactToNote, submitNote } from "../../lib/guestbook";
import { playTick } from "../../lib/tick";
import SectionHead from "../SectionHead/SectionHead";
import Composer from "./Composer";
import "../Guestbook/Guestbook.scss";

const MIN_NOTES = 8;
const LIKED_KEY = "guestbook-liked";
const PENDING_KEY = "guestbook-pending";

const readStore = (key) => {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? [];
    } catch {
        return [];
    }
};

const writeStore = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Storage blocked: likes/pending just won't persist.
    }
};

const ago = (iso) => {
    const minutes = Math.max(1, Math.round((Date.now() - new Date(iso)) / 60_000));

    if (minutes < 60) return `${minutes}m`;
    if (minutes < 1440) return `${Math.round(minutes / 60)}h`;
    if (minutes < 10_080) return `${Math.round(minutes / 1440)}d`;

    return `${Math.round(minutes / 10_080)}w`;
};

// Deterministic 0..1 noise from a string, so layouts are stable per seed.
const noise = (text) => {
    let h = 2166136261;

    for (let i = 0; i < text.length; i++) {
        h = Math.imul(h ^ text.charCodeAt(i), 16777619);
    }

    return ((h >>> 0) % 10_000) / 10_000;
};

// Grid slots right of the composer (and below it once it ends), each note
// nudged off its slot. Reproduces the pen's wall at 1440px.
const layoutWall = (width, notes, mode, seed) => {
    const mobile = width < 640;
    const tablet = width < 1100;
    const gutter = mobile ? 20 : Math.max(32, (width - 1200) / 2);
    const noteW = mobile ? 160 : 206;
    const composer = mobile ? null : { x: gutter, y: tablet ? 24 : 36, w: 320, h: 560 };
    const rowH = mobile ? 210 : tablet ? 175 : 250;
    const top = mobile ? 24 : 30;
    const minStep = tablet && !mobile ? noteW * 0.62 : noteW + 4;

    let ordered = notes;

    if (mode === "newest") {
        ordered = [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (seed > 0) {
        ordered = [...notes].sort((a, b) => noise(a.id + seed) - noise(b.id + seed));
    }

    const positions = {};
    let index = 0;
    let row = 0;

    while (index < ordered.length) {
        const y = top + row * rowH;
        const beside = composer && y < composer.y + composer.h - 60;
        const x0 = beside ? composer.x + composer.w + 40 : gutter;
        const avail = width - gutter - x0;
        const cols = Math.max(1, Math.floor((avail - noteW) / minStep) + 1);
        const step = cols > 1 ? (avail - noteW) / (cols - 1) : 0;

        for (let col = 0; col < cols && index < ordered.length; col++, index++) {
            const note = ordered[index];
            const useSeed = mode === "scatter" && seed === 0 && note.dx !== undefined && !tablet;
            const r = (k) => noise(`${note.id}${seed}${k}`);
            const spread = mode === "newest" ? 0.3 : mobile ? 0.4 : 1;

            positions[note.id] = {
                x: x0 + col * step + (useSeed ? note.dx : r("x") * 30 * spread),
                y: y + (useSeed ? note.dy : r("y") * 40 * spread),
                rot: useSeed ? note.rot : (r("r") * 10 - 5) * spread,
            };
        }

        row++;
    }

    const minHeight = mobile ? 0 : tablet ? 840 : 580;

    return {
        positions,
        gutter,
        composer,
        height: Math.max(minHeight, top + row * rowH + (mobile ? 70 : 90)),
    };
};

const Note = ({ note, place, liked, onLike, onDragStart, held }) => (
    <article
        className={`note${held ? " is-held" : ""}${note.pending ? " is-pending" : ""}`}
        style={{
            background: NOTE_COLORS.find((c) => c.id === note.color)?.value ?? NOTE_COLORS[0].value,
            transform: `translate(${place.x}px, ${place.y}px) rotate(${place.rot}deg)`,
            zIndex: place.z,
        }}
        onPointerDown={onDragStart}
    >
        <span className="note__tape" aria-hidden />

        {note.message && <p className="note__message">{note.message}</p>}
        {note.drawing && <img className="note__drawing" src={note.drawing} alt="A visitor's doodle" draggable={false} />}
        {note.doodle && (
            <div className="note__doodle" aria-label="A doodle of a smiley and a heart">
                <PiSmiley />
                <PiHeart className="note__doodle-heart" />
            </div>
        )}

        <footer className="note__footer">
            <span>
                — {note.name || "anon"} · {note.pending ? "awaiting approval" : ago(note.createdAt)}
            </span>
            {!note.pending && (
                <button
                    type="button"
                    className={`note__like${liked ? " is-liked" : ""}`}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => onLike(note, event)}
                    aria-pressed={liked}
                    aria-label={liked ? "Remove your heart" : "Heart this note"}
                >
                    {liked ? <PiHeartFill aria-hidden /> : <PiHeart aria-hidden />}
                    {note.likes + (note.seed && liked ? 1 : 0)}
                </button>
            )}
        </footer>
    </article>
);

const Guestbook = () => {
    const wallRef = useRef(null);
    const zTop = useRef(10);
    const drag = useRef(null);
    const [toast, showToast] = useToast();

    const [width, setWidth] = useState(1440);
    const [remote, setRemote] = useState({ status: "loading", notes: [] });
    const [pending, setPending] = useState([]);
    const [liked, setLiked] = useState([]);
    const [mode, setMode] = useState("scatter");
    const [seed, setSeed] = useState(0);
    const [moved, setMoved] = useState({});
    const [heldId, setHeldId] = useState(null);
    const [busy, setBusy] = useState(false);

    useLayoutEffect(() => {
        const wall = wallRef.current;
        const measure = () => setWidth(wall.clientWidth);

        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(wall);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        setLiked(readStore(LIKED_KEY));
        setPending(readStore(PENDING_KEY));

        fetchNotes()
            .then((data) => {
                const approved = data.notes ?? [];
                const approvedIds = new Set(approved.map((note) => note.id));

                // Drop local pending notes once they've been approved.
                setPending((current) => {
                    const next = current.filter((note) => !approvedIds.has(note.id));
                    writeStore(PENDING_KEY, next);
                    return next;
                });
                setRemote({ status: "live", notes: approved });
            })
            .catch(() => setRemote({ status: "offline", notes: [] }));
    }, []);

    const notes = useMemo(() => {
        const real = remote.notes;
        const seeds = SEED_NOTES.slice(0, Math.max(0, MIN_NOTES - real.length)).map((note) => ({
            ...note,
            seed: true,
        }));

        return [...pending, ...real, ...seeds];
    }, [remote.notes, pending]);

    const layout = useMemo(() => layoutWall(width, notes, mode, seed), [width, notes, mode, seed]);

    // Any re-layout (resize, shuffle, sort) clears hand-dragged positions.
    useEffect(() => setMoved({}), [width, mode, seed]);

    const placeOf = (note) => ({ ...layout.positions[note.id], ...moved[note.id] });

    const startDrag = (note) => (event) => {
        if (event.button !== 0) return;

        const place = placeOf(note);

        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = {
            id: note.id,
            dx: event.clientX - place.x,
            dy: event.clientY - place.y,
            startX: event.clientX,
            startY: event.clientY,
            active: false,
        };
    };

    const onPointerMove = useCallback((event) => {
        const active = drag.current;

        if (!active) return;

        if (!active.active) {
            if (Math.hypot(event.clientX - active.startX, event.clientY - active.startY) < 4) return;

            active.active = true;
            active.z = ++zTop.current;
            setHeldId(active.id);
            playTick();
        }

        setMoved((current) => ({
            ...current,
            [active.id]: {
                ...current[active.id],
                x: event.clientX - active.dx,
                y: event.clientY - active.dy,
                z: active.z,
            },
        }));
    }, []);

    const endDrag = useCallback(() => {
        drag.current = null;
        setHeldId(null);
    }, []);

    const like = (note, event) => {
        const { clientX, clientY } = event;
        const has = liked.includes(note.id);
        const delta = has ? -1 : 1;
        const nextLiked = has ? liked.filter((id) => id !== note.id) : [...liked, note.id];

        setLiked(nextLiked);
        writeStore(LIKED_KEY, nextLiked);

        // Placeholder notes count the visitor's heart locally; real notes
        // update optimistically and sync with the server.
        if (!note.seed) {
            setRemote((current) => ({
                ...current,
                notes: current.notes.map((item) =>
                    item.id === note.id ? { ...item, likes: Math.max(0, item.likes + delta) } : item,
                ),
            }));
            reactToNote(note.id, delta).catch(() => {});
        }

        if (!has) showToast("+1 from you", clientX, clientY);
    };

    const pin = async (note, event) => {
        const rect = event?.submitter?.getBoundingClientRect();
        const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
        const y = rect ? rect.top : window.innerHeight / 2;

        setBusy(true);

        try {
            const saved = await submitNote(note);
            const local = {
                ...note,
                id: saved.id,
                createdAt: saved.createdAt ?? new Date().toISOString(),
                likes: 0,
                pending: true,
            };
            const next = [local, ...pending];

            setPending(next);
            writeStore(PENDING_KEY, next);
            showToast("pinned — live after a quick look", x, y);

            return true;
        } catch {
            showToast("couldn't pin that — try again", x, y);

            return false;
        } finally {
            setBusy(false);
        }
    };

    const total = remote.notes.length;

    return (
        <section className="guestbook" id="guestbook">
            <div className="guestbook__head" data-reveal>
                <div className="guestbook__head-left">
                    <SectionHead
                        number="06"
                        symbol="Gb."
                        title="Guestbook."
                        live={remote.status === "live"}
                        meta={
                            remote.status === "live"
                                ? `Live · ${total} note${total === 1 ? "" : "s"}`
                                : remote.status === "loading"
                                  ? "Connecting…"
                                  : "Pinned notes"
                        }
                        desc="Leave a note, a doodle, or just say hi. Everyone who visits sees it — drag notes around and tap ♥ on the ones you like."
                    />
                </div>

                <div className="guestbook__actions">
                    <button
                        type="button"
                        className="pill-btn"
                        onClick={() => {
                            setMode("scatter");
                            setSeed((value) => value + 1);
                        }}
                    >
                        <PiShuffle aria-hidden />
                        Shuffle
                    </button>
                    <button
                        type="button"
                        className={`pill-btn${mode === "newest" ? " is-active" : ""}`}
                        aria-pressed={mode === "newest"}
                        onClick={() => setMode((value) => (value === "newest" ? "scatter" : "newest"))}
                    >
                        <PiSortAscending aria-hidden />
                        Newest
                    </button>
                </div>
            </div>

            {width < 640 && (
                <div className="guestbook__composer-flow">
                    <Composer onPin={pin} busy={busy} />
                </div>
            )}

            <div
                className="wall"
                ref={wallRef}
                style={{ height: layout.height }}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
            >
                {layout.composer && (
                    <div className="wall__composer" style={{ left: layout.composer.x, top: layout.composer.y }}>
                        <Composer onPin={pin} busy={busy} />
                    </div>
                )}

                {notes.map((note) =>
                    layout.positions[note.id] ? (
                        <Note
                            key={note.id}
                            note={note}
                            place={placeOf(note)}
                            liked={liked.includes(note.id)}
                            held={heldId === note.id}
                            onLike={like}
                            onDragStart={startDrag(note)}
                        />
                    ) : null,
                )}

                <p className="wall__hint" style={{ left: layout.gutter }}>
                    drag notes around · tap ♥ to react · new notes are moderated before they go live
                </p>
            </div>

            {toast}
        </section>
    );
};

export default Guestbook;
