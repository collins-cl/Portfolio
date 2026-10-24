"use client";

import { useCallback, useRef, useState } from "react";
import { PiCheckCircleFill } from "react-icons/pi";

// Small floating toast anchored to a viewport point (usually the cursor).
export const useToast = () => {
    const [toast, setToast] = useState(null);
    const timer = useRef(0);

    const show = useCallback((label, x, y) => {
        clearTimeout(timer.current);
        setToast({ label, x, y, key: Date.now() });
        timer.current = setTimeout(() => setToast(null), 1100);
    }, []);

    const node = toast ? (
        <span
            key={toast.key}
            className="toast"
            role="status"
            style={{ left: toast.x, top: toast.y - 28 }}
        >
            <PiCheckCircleFill aria-hidden />
            {toast.label}
        </span>
    ) : null;

    return [node, show];
};
