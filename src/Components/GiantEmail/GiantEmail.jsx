"use client";

import { EMAIL } from "../../constants/Site";
import { useToast } from "../../hooks/useToast";
import "../GiantEmail/GiantEmail.scss";

const GiantEmail = () => {
    const [toast, showToast] = useToast();

    const copy = async (event) => {
        const { clientX, clientY } = event;

        try {
            await navigator.clipboard.writeText(EMAIL);
            showToast("copied!", clientX, clientY);
        } catch {
            window.location.href = `mailto:${EMAIL}`;
        }
    };

    return (
        <div className="giant-email">
            <button
                type="button"
                className="giant-email__text"
                onClick={copy}
                aria-label={`Copy ${EMAIL} to clipboard`}
            >
                {EMAIL}
            </button>
            {toast}
        </div>
    );
};

export default GiantEmail;
