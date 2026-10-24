"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE } from "../constants/Site";

const FALLBACK_TRACK = {
    title: "HEIS",
    artist: "Rema",
    album: "HEIS",
    albumArt: "/media/collage/heis-cover.jpg",
    spotifyUrl: "https://open.spotify.com/search/HEIS%20Rema",
    isPlaying: false,
};

const SpotifyContext = createContext({
    status: "loading",
    track: FALLBACK_TRACK,
});

// One live feed shared by the nav widget and the collage vinyl.
export const SpotifyProvider = ({ children }) => {
    const [state, setState] = useState({
        status: "loading",
        track: FALLBACK_TRACK,
    });

    useEffect(() => {
        let isMounted = true;

        async function fetchNowPlaying() {
            try {
                const response = await fetch(`${API_BASE}/api/now-playing`);

                if (!response.ok) {
                    throw new Error(`API returned ${response.status}`);
                }

                const data = await response.json();

                if (!isMounted) return;

                if (data.isPlaying || data.isRecent) {
                    setState({
                        status: data.isPlaying ? "playing" : "recent",
                        track: {
                            ...data,
                            albumArt: data.albumArt || FALLBACK_TRACK.albumArt,
                        },
                    });
                } else {
                    setState((prev) => ({ ...prev, status: "idle" }));
                }
            } catch (err) {
                console.error("Spotify fetch failed:", err);

                if (isMounted) {
                    setState((prev) => ({ ...prev, status: "offline" }));
                }
            }
        }

        fetchNowPlaying();

        const interval = setInterval(fetchNowPlaying, 30_000);

        return () => {
            isMounted = false;

            clearInterval(interval);
        };
    }, []);

    return (
        <SpotifyContext.Provider value={state}>
            {children}
        </SpotifyContext.Provider>
    );
};

export const useSpotify = () => useContext(SpotifyContext);
