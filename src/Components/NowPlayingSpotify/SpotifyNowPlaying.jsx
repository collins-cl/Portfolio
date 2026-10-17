import { useEffect, useState } from "react";
import "./SpotifyNowPlaying.scss";

const API_URL = "https://portfolio-acgq.onrender.com/api/now-playing";

const SpotifyNowPlaying = () => {
    const [track, setTrack] = useState(null);
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchTrack = async () => {
            try {
                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error("Failed to fetch Spotify track");
                }

                const data = await response.json();

                if (isMounted) {
                    setTrack(data.isPlaying ? data : null);
                    setConnected(true);
                }
            } catch (error) {
                if (isMounted) {
                    setConnected(false);
                }

                console.error("Spotify connection error:", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchTrack();

        const interval = setInterval(fetchTrack, 15000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    if (loading) {
        return (
            <div className="spotify-now-playing">
                <span className="spotify-now-playing__dot" />
                <span>Connecting to Spotify...</span>
            </div>
        );
    }

    if (!connected) {
        return (
            <div className="spotify-now-playing spotify-now-playing--offline">
                <span className="spotify-now-playing__dot" />
                <span>Spotify unavailable</span>
            </div>
        );
    }

    if (!track) {
        return (
            <div className="spotify-now-playing spotify-now-playing--idle">
                <span className="spotify-now-playing__dot" />
                <span>Not playing anything</span>
            </div>
        );
    }

    return (
        <a
            className="spotify-now-playing"
            href={track.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Listen on Spotify"
        >
            {track.albumArt && (
                <img
                    className="spotify-now-playing__art"
                    src={track.albumArt}
                    alt={`${track.album} cover`}
                />
            )}

            <div className="spotify-now-playing__info">
                <span className="spotify-now-playing__label">
                    <span className="spotify-now-playing__dot" />
                    Listening to Spotify
                </span>

                <span className="spotify-now-playing__title">
                    {track.title}
                </span>

                <span className="spotify-now-playing__artist">
                    {track.artist}
                </span>
            </div>
        </a>
    );
};

export default SpotifyNowPlaying;
