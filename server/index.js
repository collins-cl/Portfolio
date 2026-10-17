import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8888;

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    throw new Error("Missing Spotify environment variables in .env");
}

app.disable("x-powered-by");

const allowedOrigins = ["https://coledev.vercel.app", "http://localhost:3000"];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            console.error("CORS blocked origin:", origin);

            return callback(new Error("Not allowed by CORS"));
        },
    }),
);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKEN_FILE = path.resolve(__dirname, "../.spotify-tokens.json");

const pendingStates = new Map();

let cachedAccessToken = null;
let accessTokenExpiresAt = 0;

async function readTokens() {
    // Production: use Render's environment variable.
    if (process.env.SPOTIFY_REFRESH_TOKEN) {
        return {
            refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
        };
    }

    // Development: use the local token file.
    try {
        return JSON.parse(await fs.readFile(TOKEN_FILE, "utf8"));
    } catch (error) {
        if (error.code === "ENOENT") return {};
        throw error;
    }
}

async function saveTokens(tokens) {
    // Never rely on Render's ephemeral filesystem for credentials.
    if (process.env.NODE_ENV === "production") {
        console.warn(
            "A Spotify refresh token was returned. Update SPOTIFY_REFRESH_TOKEN in Render if the token changed.",
        );
        return;
    }

    await fs.writeFile(TOKEN_FILE, JSON.stringify(tokens, null, 2), {
        mode: 0o600,
    });

    await fs.chmod(TOKEN_FILE, 0o600);
}
async function requestSpotifyToken(params) {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            Authorization:
                "Basic " +
                Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(params),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error(
            "Spotify token request failed with status:",
            response.status,
        );
        throw new Error("Spotify token request failed.");
    }

    return data;
}

// Begin Spotify OAuth authorization.
app.get("/auth/login", (req, res) => {
    const state = crypto.randomBytes(32).toString("hex");

    for (const [key, createdAt] of pendingStates) {
        if (Date.now() - createdAt > 10 * 60 * 1000) {
            pendingStates.delete(key);
        }
    }

    pendingStates.set(state, Date.now());

    const authorizationUrl = new URL("https://accounts.spotify.com/authorize");

    authorizationUrl.search = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: "code",
        redirect_uri: REDIRECT_URI,
        scope: "user-read-currently-playing user-read-recently-played",
        state,
    }).toString();

    res.redirect(authorizationUrl.toString());
});

// Handle Spotify's OAuth callback.
app.get("/auth/callback", async (req, res) => {
    const { code, state, error } = req.query;

    if (error) {
        return res.status(400).send("Spotify authorization was denied.");
    }

    const createdAt = pendingStates.get(state);

    if (
        typeof state !== "string" ||
        !createdAt ||
        Date.now() - createdAt > 10 * 60 * 1000
    ) {
        return res.status(400).send("Invalid or expired OAuth state.");
    }

    pendingStates.delete(state);

    if (typeof code !== "string") {
        return res.status(400).send("Missing authorization code.");
    }

    try {
        const tokens = await requestSpotifyToken({
            grant_type: "authorization_code",
            code,
            redirect_uri: REDIRECT_URI,
        });
        const refreshToken = tokens.refresh_token;

        if (!refreshToken && !process.env.SPOTIFY_REFRESH_TOKEN) {
            return res
                .status(500)
                .send(
                    "Spotify did not provide a refresh token. Please authorize again.",
                );
        }

        if (refreshToken) {
            await saveTokens({
                refresh_token: refreshToken,
            });
        }

        cachedAccessToken = tokens.access_token;

        accessTokenExpiresAt = Date.now() + tokens.expires_in * 1000;

        if (process.env.NODE_ENV === "production" && refreshToken) {
            console.log(
                "Spotify connected. Update SPOTIFY_REFRESH_TOKEN in Render if needed.",
            );

            return res.send(
                "Spotify authorization succeeded. If this is your first production authorization, copy the refresh token from the secure server-side setup process into Render's SPOTIFY_REFRESH_TOKEN environment variable.",
            );
        }

        res.redirect(FRONTEND_URL);
    } catch (error) {
        console.error("Spotify callback failed:", error.message);
        res.status(500).send("Unable to connect Spotify.");
    }
});

// Obtain or refresh the access token.
async function getAccessToken() {
    if (cachedAccessToken && Date.now() < accessTokenExpiresAt - 60_000) {
        return cachedAccessToken;
    }

    const tokens = await readTokens();

    if (!tokens.refresh_token) {
        const error = new Error("Spotify has not been connected.");
        error.status = 401;
        throw error;
    }

    const refreshed = await requestSpotifyToken({
        grant_type: "refresh_token",
        refresh_token: tokens.refresh_token,
    });

    if (refreshed.refresh_token) {
        await saveTokens({
            refresh_token: refreshed.refresh_token,
        });
    }

    cachedAccessToken = refreshed.access_token;
    accessTokenExpiresAt = Date.now() + refreshed.expires_in * 1000;

    return cachedAccessToken;
}

// Return the most recently played track, or null if unavailable.
// Note: Spotify can lag a few minutes before a track shows up here.
async function getRecentlyPlayed(accessToken) {
    const response = await fetch(
        "https://api.spotify.com/v1/me/player/recently-played?limit=1",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );

    if (response.status === 403) {
        console.warn(
            "Recently-played request was denied. Re-authorize Spotify with the user-read-recently-played scope.",
        );

        return null;
    }

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    const item = data.items?.[0];

    if (!item?.track) {
        return null;
    }

    return {
        title: item.track.name,
        artist: item.track.artists?.map((artist) => artist.name).join(", "),
        album: item.track.album?.name,
        albumArt: item.track.album?.images?.[0]?.url,
        spotifyUrl: item.track.external_urls?.spotify,
        playedAt: item.played_at,
    };
}

// Return the currently playing track, falling back to the last played track.
app.get("/api/now-playing", async (req, res) => {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch(
            "https://api.spotify.com/v1/me/player/currently-playing",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        res.set("Cache-Control", "no-store");

        if (response.status === 401) {
            cachedAccessToken = null;
            accessTokenExpiresAt = 0;

            return res.status(502).json({
                error: "Spotify authorization expired. Please retry.",
            });
        }

        if (!response.ok && response.status !== 204) {
            return res.status(502).json({
                error: "Spotify could not retrieve playback information.",
            });
        }

        if (response.status !== 204) {
            const data = await response.json();
            const item = data.item;

            if (data.is_playing && item) {
                return res.json({
                    isPlaying: true,
                    title: item.name,
                    artist: item.artists
                        ?.map((artist) => artist.name)
                        .join(", "),
                    album: item.album?.name,
                    albumArt: item.album?.images?.[0]?.url,
                    spotifyUrl: item.external_urls?.spotify,
                });
            }
        }

        // Nothing is playing right now — fall back to the last played track.
        const recent = await getRecentlyPlayed(accessToken);

        if (recent) {
            return res.json({
                isPlaying: false,
                isRecent: true,
                ...recent,
            });
        }

        return res.json({ isPlaying: false });
    } catch (error) {
        if (error.status === 401) {
            return res.status(401).json({ error: error.message });
        }

        console.error("Now-playing error:", error.message);

        res.status(500).json({
            error: "Unable to retrieve Spotify playback.",
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Spotify backend running at http://0.0.0.0:${PORT}`);
});
