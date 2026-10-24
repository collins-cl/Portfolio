import { Caveat, Geist, Geist_Mono } from "next/font/google";
import "../index.scss";

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-geist",
    display: "swap",
});

const geistMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-geist-mono",
    display: "swap",
});

const caveat = Caveat({
    subsets: ["latin"],
    variable: "--font-caveat",
    display: "swap",
});

export const metadata = {
    title: "Collins Abuanekwu — Software Developer",
    description:
        "Collins (Cole) — a software developer who turns ideas into real-life products: web apps, mobile apps and the odd web3 experiment.",
};

export const viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#F1EDE6" },
        { media: "(prefers-color-scheme: dark)", color: "#0D0D0C" },
    ],
};

// Runs before first paint so the saved theme never flashes and
// scroll-reveal styles only apply when JS is available.
const bootScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}document.documentElement.dataset.js=""})();`;

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={`${geist.variable} ${geistMono.variable} ${caveat.variable}`}
            suppressHydrationWarning
        >
            <head>
                <script dangerouslySetInnerHTML={{ __html: bootScript }} />
            </head>
            <body>{children}</body>
        </html>
    );
}
