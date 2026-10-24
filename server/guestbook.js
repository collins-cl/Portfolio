import express from "express";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Guestbook API. New notes are stored as "pending" and only appear on the
// wall once approved through the token-protected moderation endpoints.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE =
    process.env.GUESTBOOK_FILE || path.resolve(__dirname, "data/guestbook.json");
const ADMIN_TOKEN = process.env.GUESTBOOK_ADMIN_TOKEN;

const COLORS = new Set(["yellow", "cyan", "pink", "mint", "lilac"]);
const MAX_CHARS = 140;
const MAX_DRAWING_BYTES = 200_000;
const HOUR = 60 * 60 * 1000;

const router = express.Router();

router.use(express.json({ limit: "300kb" }));

// ---------- Storage (JSON file, writes serialised) ----------

let cache = null;
let writeChain = Promise.resolve();

async function load() {
    if (cache) return cache;

    try {
        cache = JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
        cache = { notes: [] };
    }

    return cache;
}

function persist() {
    writeChain = writeChain.then(async () => {
        await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });

        const tmp = `${DATA_FILE}.${process.pid}.tmp`;

        await fs.writeFile(tmp, JSON.stringify(cache, null, 2));
        await fs.rename(tmp, DATA_FILE);
    });

    return writeChain;
}

// ---------- Helpers ----------

const hits = new Map();

function rateLimited(key, limit, windowMs) {
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

    recent.push(now);
    hits.set(key, recent);

    return recent.length > limit;
}

const clean = (value, max) =>
    typeof value === "string"
        ? value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max)
        : "";

const publicNote = ({ id, name, color, message, drawing, likes, createdAt }) => ({
    id,
    name,
    color,
    message,
    drawing,
    likes,
    createdAt,
});

function requireAdmin(req, res, next) {
    const given = (req.get("authorization") ?? "").replace(/^Bearer\s+/i, "");

    if (
        !ADMIN_TOKEN ||
        given.length !== ADMIN_TOKEN.length ||
        !crypto.timingSafeEqual(Buffer.from(given), Buffer.from(ADMIN_TOKEN))
    ) {
        return res.status(401).json({ error: "Unauthorized." });
    }

    next();
}

// ---------- Public ----------

router.get("/", async (req, res) => {
    const { notes } = await load();

    res.set("Cache-Control", "no-store");
    res.json({
        notes: notes
            .filter((note) => note.status === "approved")
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map(publicNote),
    });
});

router.post("/", async (req, res) => {
    if (rateLimited(`post:${req.ip}`, 5, HOUR)) {
        return res.status(429).json({ error: "Slow down — try again later." });
    }

    const message = clean(req.body?.message, MAX_CHARS);
    const drawing = typeof req.body?.drawing === "string" ? req.body.drawing : "";
    const color = COLORS.has(req.body?.color) ? req.body.color : "yellow";
    const name = clean(req.body?.name, 32);

    const validDrawing =
        drawing.startsWith("data:image/png;base64,") &&
        drawing.length <= MAX_DRAWING_BYTES;

    if (Boolean(message) === Boolean(validDrawing)) {
        return res
            .status(400)
            .json({ error: "Send either a message or a drawing." });
    }

    const data = await load();
    const note = {
        id: crypto.randomUUID(),
        name,
        color,
        ...(message ? { message } : { drawing }),
        likes: 0,
        status: "pending",
        createdAt: new Date().toISOString(),
    };

    data.notes.push(note);
    await persist();

    res.status(201).json({ id: note.id, status: note.status, createdAt: note.createdAt });
});

router.post("/:id/like", async (req, res) => {
    if (rateLimited(`like:${req.ip}`, 120, HOUR)) {
        return res.status(429).json({ error: "Too many reactions." });
    }

    const delta = req.body?.delta === -1 ? -1 : 1;
    const data = await load();
    const note = data.notes.find(
        (item) => item.id === req.params.id && item.status === "approved",
    );

    if (!note) {
        return res.status(404).json({ error: "Note not found." });
    }

    note.likes = Math.max(0, note.likes + delta);
    await persist();

    res.json({ id: note.id, likes: note.likes });
});

// ---------- Moderation (Authorization: Bearer GUESTBOOK_ADMIN_TOKEN) ----------

router.get("/pending", requireAdmin, async (req, res) => {
    const { notes } = await load();

    res.json({ notes: notes.filter((note) => note.status === "pending") });
});

router.post("/:id/approve", requireAdmin, async (req, res) => {
    const data = await load();
    const note = data.notes.find((item) => item.id === req.params.id);

    if (!note) {
        return res.status(404).json({ error: "Note not found." });
    }

    note.status = "approved";
    await persist();

    res.json(publicNote(note));
});

router.delete("/:id", requireAdmin, async (req, res) => {
    const data = await load();
    const before = data.notes.length;

    data.notes = data.notes.filter((item) => item.id !== req.params.id);

    if (data.notes.length === before) {
        return res.status(404).json({ error: "Note not found." });
    }

    await persist();
    res.status(204).end();
});

export default router;
