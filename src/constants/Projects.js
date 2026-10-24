// Projects, archive entries and the skills "periodic table".
// Descriptions and links come from the original ProjectDummy data.

export const WORK = [
    {
        id: "havn",
        name: "Havn",
        category: "web",
        desc: "Where landlords and agents meet people looking for a home.",
        stack: "Next.js · Vercel",
        link: "https://havn-hvn.vercel.app/",
        media: { type: "image", src: "/media/work/havn.jpg" },
    },
    {
        id: "skillduel",
        name: "SkillDuel",
        category: "web",
        desc: "1v1 knowledge duels — Duolingo's warmth meets Chess.com's rigor.",
        stack: "Next.js · WebSocket · Go · MySQL",
        link: "https://www.skillduel.app/",
        media: { type: "image", src: "/media/work/skillduel.jpg" },
    },
    {
        id: "jagaban",
        name: "Jagaban Exchange",
        category: "web3",
        desc: "A crypto exchange for seamless transactions across parties.",
        stack: "Next.js · SCSS · Laravel",
        link: "https://jagabanexchange.com/",
        media: { type: "image", src: "/media/work/jagaban.jpg" },
    },
    {
        id: "supporthub",
        name: "Support Hub",
        category: "web",
        desc: "Knowledgebase & ticketing with role-based workflows.",
        stack: "React · SCSS · WhatsApp API",
        link: "https://supporthub.byteverse.tech/",
        media: { type: "image", src: "/media/work/supporthub.jpg" },
    },
    {
        id: "orbit",
        name: "Orbit",
        category: "mobile",
        desc: "Tasks and focus sessions, with a drawer for capturing new tasks fast.",
        stack: "React Native · Expo",
        media: { type: "image", src: "/media/OrbitFocus.png" },
    },
    {
        id: "crumb",
        name: "Crumb",
        category: "mobile",
        desc: "Polished screens and drawers, down to the address picker.",
        stack: "React Native · Expo",
        media: { type: "image", src: "/media/Crumb.png" },
    },
    {
        id: "nomad",
        name: "Nomad",
        category: "mobile",
        desc: "Travel companion app — tickets and trips in one place.",
        stack: "React Native · Expo",
        media: { type: "image", src: "/media/NomadTicket.png" },
    },
];

export const WORK_FILTERS = [
    { id: "all", label: "All" },
    { id: "web", label: "Web" },
    { id: "mobile", label: "Mobile" },
    { id: "web3", label: "Web3" },
];

export const ARCHIVE_CATEGORIES = [
    { id: "web", label: "Web", color: "var(--cyan)" },
    { id: "mobile", label: "Mobile", color: "var(--pink)" },
    { id: "realtime", label: "Realtime", color: "var(--yellow)" },
    { id: "web3", label: "Web3", color: "var(--lilac)" },
];

export const ARCHIVE = [
    {
        id: "skillduel",
        symbol: "Sd.",
        name: "SkillDuel",
        category: "realtime",
        stack: "Next.js · Go · MySQL",
        desc: "1v1 knowledge duels — pick a topic, get matched, answer 5 timed questions and climb from Rookie to Master. Realtime rounds over WebSockets, Go + MySQL behind it.",
        links: [
            { label: "skillduel.app", href: "https://www.skillduel.app/" },
            {
                label: "Source",
                href: "https://github.com/collins-cl/sd-landing-page",
                source: true,
            },
        ],
        art: { type: "image", src: "/media/work/skillduel.jpg" },
    },
    {
        id: "havn",
        symbol: "Hv.",
        name: "Havn",
        category: "web",
        stack: "Next.js · Vercel",
        desc: "Where landlords and agents meet tenants and people looking for a home. Connect with agents and find the right place for you.",
        links: [
            { label: "havn-hvn.vercel.app", href: "https://havn-hvn.vercel.app/" },
        ],
        art: { type: "image", src: "/media/work/havn.jpg" },
    },
    {
        id: "jagaban",
        symbol: "Jx.",
        name: "Jagaban Exchange",
        category: "web3",
        stack: "Next.js · Laravel",
        desc: "A modern cryptocurrency exchange and digital platform that enables seamless transactions across parties.",
        links: [
            { label: "jagabanexchange.com", href: "https://jagabanexchange.com/" },
        ],
        art: { type: "image", src: "/media/work/jagaban.jpg" },
    },
    {
        id: "supporthub",
        symbol: "Sh.",
        name: "Support Hub",
        category: "web",
        stack: "React · WhatsApp API",
        desc: "A scalable knowledgebase & ticket support system — self-service articles, role-based ticketing workflows and real-time team collaboration.",
        links: [
            {
                label: "supporthub.byteverse.tech",
                href: "https://supporthub.byteverse.tech/",
            },
        ],
        art: { type: "image", src: "/media/work/supporthub.jpg" },
    },
    {
        id: "imagegen",
        symbol: "Ig.",
        name: "ChatGPT ImageGen",
        category: "mobile",
        stack: "React Native",
        desc: "A recreation of ChatGPT's image generation screen and style drawer in React Native + Expo, animated end to end.",
        links: [],
        art: { type: "video", src: "/media/chatgptvid.mp4" },
    },
    {
        id: "skillduel-mobile",
        symbol: "Sm.",
        name: "SkillDuel Mobile",
        category: "mobile",
        stack: "React Native · Expo",
        desc: "SkillDuel on your phone — the same 1v1 knowledge duels, timed rounds and climb from Rookie to Master, built with React Native and Expo.",
        links: [
            { label: "skillduel.app", href: "https://www.skillduel.app/" },
        ],
        art: { type: "image", src: "/media/work/skillduel.jpg" },
    },
    {
        id: "portfolio",
        symbol: "Pf.",
        name: "Portfolio v1",
        category: "web",
        stack: "Next.js",
        desc: "The first version of this site — a dark, gradient-text single page that moved from Vite to Next.js before becoming what you're looking at.",
        links: [
            {
                label: "Source",
                href: "https://github.com/collins-cl",
                source: true,
            },
        ],
        art: null,
    },
];

export const SKILL_GROUPS = [
    {
        symbol: "Fe.",
        label: "Frontend",
        name: "Frontend Applications",
        color: "var(--cyan)",
        elements: [
            {
                symbol: "Re",
                name: "React",
                uses: ["Support Hub", "Dashlite", "Cole's Estate"],
            },
            {
                symbol: "Nx",
                name: "Next.js",
                dark: true,
                uses: ["Havn", "SkillDuel", "Jagaban Exchange"],
            },
            {
                symbol: "Ht",
                name: "HTML",
                note: "Underneath every project on this page.",
            },
            {
                symbol: "Cs",
                name: "CSS",
                note: "Underneath every project on this page.",
            },
            {
                symbol: "Sc",
                name: "SCSS",
                uses: ["Jagaban Exchange", "Support Hub", "this site"],
            },
        ],
    },
    {
        symbol: "Mb.",
        label: "Mobile",
        name: "Mobile Applications",
        color: "var(--pink)",
        elements: [
            {
                symbol: "Rn",
                name: "React Native",
                uses: ["useWaka", "Orbit", "Crumb", "Nomad"],
            },
            {
                symbol: "Ex",
                name: "Expo",
                uses: ["useWaka", "Orbit", "Crumb", "Nomad"],
            },
            {
                symbol: "Sw",
                name: "Swift",
                note: "For the native iOS bits React Native can't reach.",
            },
        ],
    },
    {
        symbol: "Be.",
        label: "Backend",
        name: "APIs, Realtime & Data",
        color: "var(--yellow)",
        elements: [
            {
                symbol: "No",
                name: "Node.js",
                note: "Powers the live Spotify widget up in the nav.",
            },
            {
                symbol: "Ep",
                name: "Express",
                note: "Powers the live Spotify widget and this guestbook.",
            },
            { symbol: "Go", name: "Go", uses: ["SkillDuel", "useWaka"] },
            { symbol: "My", name: "MySQL", uses: ["SkillDuel"] },
            { symbol: "Lv", name: "Laravel", uses: ["Jagaban Exchange"] },
            {
                symbol: "Ws",
                name: "WebSockets",
                uses: ["SkillDuel"],
                note: "Realtime duel rounds in SkillDuel.",
            },
        ],
    },
    {
        symbol: "W3.",
        label: "Web3",
        name: "Web3 Applications",
        color: "var(--lilac)",
        elements: [
            {
                symbol: "Bc",
                name: "Blockchain",
                uses: ["Jagaban Exchange", "Hawksite"],
            },
            {
                symbol: "??",
                name: "Learning next",
                placeholder: true,
                note: "Whatever the next project needs.",
            },
        ],
    },
];

export const SKILL_COUNT = SKILL_GROUPS.reduce(
    (total, group) =>
        total + group.elements.filter((element) => !element.placeholder).length,
    0,
);
