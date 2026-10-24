"use client";

import { useEffect, useRef, useState } from "react";
import {
    PiEraser,
    PiPencilSimpleLine,
    PiPushPinFill,
    PiScribbleLoop,
    PiUser,
} from "react-icons/pi";
import { MAX_CHARS, NOTE_COLORS } from "../../constants/Guestbook";

const PICKABLE = NOTE_COLORS.filter((color) => color.id !== "paper");

const Composer = ({ onPin, busy }) => {
    const [mode, setMode] = useState("write");
    const [message, setMessage] = useState("");
    const [color, setColor] = useState(PICKABLE[0].id);
    const [name, setName] = useState("");
    const [hasInk, setHasInk] = useState(false);
    const canvasRef = useRef(null);
    const drawing = useRef(null);

    const fill = NOTE_COLORS.find((c) => c.id === color).value;

    // Size the canvas backing store to its box for crisp strokes.
    useEffect(() => {
        if (mode !== "draw") return;

        const canvas = canvasRef.current;
        const ratio = window.devicePixelRatio || 1;
        const { width, height } = canvas.getBoundingClientRect();

        canvas.width = width * ratio;
        canvas.height = height * ratio;

        const ctx = canvas.getContext("2d");
        ctx.scale(ratio, ratio);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#2A2412";
        setHasInk(false);
    }, [mode]);

    const point = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();

        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const startStroke = (event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        drawing.current = point(event);
    };

    const moveStroke = (event) => {
        if (!drawing.current) return;

        const ctx = canvasRef.current.getContext("2d");
        const next = point(event);

        ctx.beginPath();
        ctx.moveTo(drawing.current.x, drawing.current.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
        drawing.current = next;
        setHasInk(true);
    };

    const clear = () => {
        const canvas = canvasRef.current;

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        setHasInk(false);
    };

    const ready = mode === "write" ? message.trim().length > 0 : hasInk;

    const submit = async (event) => {
        event.preventDefault();

        if (!ready || busy) return;

        const note = {
            color,
            name: name.trim(),
            ...(mode === "write"
                ? { message: message.trim() }
                : { drawing: canvasRef.current.toDataURL("image/png") }),
        };

        const ok = await onPin(note, event.nativeEvent);

        if (ok) {
            setMessage("");
            if (mode === "draw") clear();
        }
    };

    return (
        <form className="composer" onSubmit={submit}>
            <div className="composer__head">
                <h3>Leave a note</h3>
                {mode === "write" && (
                    <span className="composer__chars">
                        {message.length} / {MAX_CHARS}
                    </span>
                )}
                {mode === "draw" && (
                    <button type="button" className="composer__clear" onClick={clear}>
                        <PiEraser aria-hidden /> clear
                    </button>
                )}
            </div>

            <div className="composer__modes" role="tablist" aria-label="Note type">
                {[
                    { id: "write", label: "Write", icon: <PiPencilSimpleLine aria-hidden /> },
                    { id: "draw", label: "Draw", icon: <PiScribbleLoop aria-hidden /> },
                ].map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={mode === item.id}
                        className={mode === item.id ? "is-active" : ""}
                        onClick={() => setMode(item.id)}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="composer__draft" style={{ background: fill }}>
                {mode === "write" ? (
                    <textarea
                        value={message}
                        maxLength={MAX_CHARS}
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder="the vinyl got me. keep shipping"
                        aria-label="Your note"
                    />
                ) : (
                    <canvas
                        ref={canvasRef}
                        aria-label="Drawing pad"
                        onPointerDown={startStroke}
                        onPointerMove={moveStroke}
                        onPointerUp={() => (drawing.current = null)}
                        onPointerCancel={() => (drawing.current = null)}
                    />
                )}
            </div>

            <div className="composer__colors">
                <span>Colour</span>
                <div role="radiogroup" aria-label="Note colour">
                    {PICKABLE.map((swatch) => (
                        <button
                            key={swatch.id}
                            type="button"
                            role="radio"
                            aria-checked={color === swatch.id}
                            aria-label={swatch.id}
                            className={color === swatch.id ? "is-active" : ""}
                            style={{ background: swatch.value }}
                            onClick={() => setColor(swatch.id)}
                        />
                    ))}
                </div>
            </div>

            <label className="composer__name">
                <PiUser aria-hidden />
                <input
                    value={name}
                    maxLength={32}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name or @handle (optional)"
                />
            </label>

            <button type="submit" className="composer__pin" disabled={!ready || busy}>
                <PiPushPinFill aria-hidden />
                {busy ? "Pinning…" : "Pin it to the wall"}
            </button>
        </form>
    );
};

export default Composer;
