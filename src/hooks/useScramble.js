"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./useReducedMotion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&*+=?";

// Letter-scramble that resolves left → right in `duration` ms.
export const useScramble = (text, duration = 240) => {
    const [output, setOutput] = useState(text);
    const frame = useRef(0);
    const target = useRef(text);

    const scramble = useCallback(
        (next = target.current) => {
            target.current = next;
            cancelAnimationFrame(frame.current);

            if (prefersReducedMotion()) {
                setOutput(next);
                return;
            }

            const start = performance.now();

            const tick = (now) => {
                const progress = Math.min(1, (now - start) / duration);
                const settled = Math.floor(progress * next.length);

                setOutput(
                    next
                        .split("")
                        .map((char, index) =>
                            index < settled || char === " "
                                ? char
                                : GLYPHS[
                                      Math.floor(Math.random() * GLYPHS.length)
                                  ],
                        )
                        .join(""),
                );

                if (progress < 1) {
                    frame.current = requestAnimationFrame(tick);
                } else {
                    setOutput(next);
                }
            };

            frame.current = requestAnimationFrame(tick);
        },
        [duration],
    );

    // Re-scramble whenever the source text changes (e.g. a new track).
    useEffect(() => {
        if (text !== target.current) {
            scramble(text);
        }
    }, [text, scramble]);

    useEffect(() => () => cancelAnimationFrame(frame.current), []);

    return [output, scramble];
};
