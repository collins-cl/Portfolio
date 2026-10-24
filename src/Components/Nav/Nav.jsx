"use client";

import { PiMoon, PiSun } from "react-icons/pi";
import { useScramble } from "../../hooks/useScramble";
import "../Nav/Nav.scss";
import SpotifyNowPlaying from "../NowPlayingSpotify/SpotifyNowPlaying";

const toggleTheme = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";

    root.classList.add("theme-transition");
    root.dataset.theme = next;

    try {
        localStorage.setItem("theme", next);
    } catch {
        // Private mode: the choice just won't persist.
    }

    setTimeout(() => root.classList.remove("theme-transition"), 250);
};

const Nav = () => {
    const [wordmark, scrambleWordmark] = useScramble("KoleĦ");

    return (
        <header className="nav load-item">
            <div className="nav__inner">
                <a
                    className="nav__wordmark"
                    href="/"
                    aria-label="KoleĦ — home"
                    onMouseEnter={() => scrambleWordmark()}
                    onFocus={() => scrambleWordmark()}
                >
                    {wordmark}
                </a>

                <div className="nav__right">
                    <SpotifyNowPlaying />

                    <button
                        type="button"
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle light / dark theme"
                    >
                        <PiMoon className="theme-toggle__moon" aria-hidden />
                        <PiSun className="theme-toggle__sun" aria-hidden />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Nav;
