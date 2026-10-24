"use client";

import { PiSpotifyLogo } from "react-icons/pi";
import { useScramble } from "../../hooks/useScramble";
import { useSpotify } from "../../hooks/useSpotify";
import "./SpotifyNowPlaying.scss";

const LABELS = {
    loading: "Spotify",
    playing: "Now playing",
    recent: "Last played",
    idle: "Last played",
    offline: "Last played",
};

const SpotifyNowPlaying = () => {
    const { status, track } = useSpotify();
    const song = `${track.title} · ${track.artist}`;
    const [songText] = useScramble(status === "loading" ? "Connecting…" : song);
    const playing = status === "playing";

    return (
        <a
            className={`spotify-chip${playing ? " is-playing" : ""}`}
            href={track.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`${LABELS[status]}: ${song} — open in Spotify`}
        >
            <img
                className="spotify-chip__art"
                src={track.albumArt}
                alt=""
                width={30}
                height={30}
            />

            <span className="spotify-chip__track">
                <span className="spotify-chip__label">{LABELS[status]}</span>
                <span className="spotify-chip__song">{songText}</span>
            </span>

            <span className="spotify-chip__eq" aria-hidden>
                <span />
                <span />
                <span />
                <span />
            </span>

            <PiSpotifyLogo className="spotify-chip__logo" aria-hidden />
        </a>
    );
};

export default SpotifyNowPlaying;
