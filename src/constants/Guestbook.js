// Note colours offered in the composer (in the pen's order).
export const NOTE_COLORS = [
    { id: "yellow", value: "#F6D867" },
    { id: "cyan", value: "#A7ECF8" },
    { id: "pink", value: "#F8B4D9" },
    { id: "mint", value: "#B5F0B9" },
    { id: "lilac", value: "#CFC6FA" },
    { id: "paper", value: "#FFFFFF" },
];

export const MAX_CHARS = 140;

// Placeholder notes from the design. They pad the wall until enough real,
// approved notes exist — delete entries here as real ones come in.
// dx/dy/rot nudge each note off its grid slot to match the pen at 1440px.
const hoursAgo = (h) => new Date(Date.now() - h * 3_600_000).toISOString();

export const SEED_NOTES = [
    { id: "seed-tobi", name: "Tobi · Lagos", color: "yellow", likes: 24, createdAt: hoursAgo(2), message: "who knew a portfolio could have a vinyl in it. HEIS is a classic btw", dx: 0, dy: 16, rot: 4 },
    { id: "seed-ada", name: "Ada", color: "cyan", likes: 41, createdAt: hoursAgo(24), message: "SkillDuel ate my whole evening. Rookie → Scholar in one night 🧠", dx: 9, dy: 40, rot: -3 },
    { id: "seed-kwame", name: "Kwame · Accra", color: "paper", likes: 9, createdAt: hoursAgo(96), doodle: true, dx: 12, dy: 10, rot: 2 },
    { id: "seed-ife", name: "dev_ife", color: "lilac", likes: 17, createdAt: hoursAgo(168), message: "how did you do the inline images in the intro?? teach me pls", dx: -2, dy: 34, rot: -5 },
    { id: "seed-anon-1", name: "", color: "mint", likes: 63, createdAt: hoursAgo(120), message: "hire Cole already 🔥", dx: 20, dy: 20, rot: -3 },
    { id: "seed-mk", name: "m.k", color: "pink", likes: 28, createdAt: hoursAgo(72), message: "that ChatGPT drawer recreation is unreasonably smooth", dx: 27, dy: 42, rot: 5 },
    { id: "seed-sam", name: "Sam", color: "yellow", likes: 12, createdAt: hoursAgo(336), message: "the archive accordion is so satisfying. opened it like 20 times", dx: 32, dy: 10, rot: -2 },
    { id: "seed-anon-2", name: "", color: "cyan", likes: 5, createdAt: hoursAgo(504), message: "first! 👋", dx: 4, dy: 38, rot: 3 },
];
