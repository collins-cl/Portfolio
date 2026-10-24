import { API_BASE } from "../constants/Site";

const URL_BASE = `${API_BASE}/api/guestbook`;

const request = async (path, options) => {
    const response = await fetch(`${URL_BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`Guestbook API returned ${response.status}`);
    }

    return response.json();
};

// Approved notes only; new ones wait for moderation server-side.
export const fetchNotes = () => request("");

export const submitNote = (note) =>
    request("", { method: "POST", body: JSON.stringify(note) });

export const reactToNote = (id, delta) =>
    request(`/${encodeURIComponent(id)}/like`, {
        method: "POST",
        body: JSON.stringify({ delta }),
    });
