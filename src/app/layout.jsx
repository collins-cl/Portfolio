import "../index.css";
import "../App.css";

export const metadata = {
    title: "Cole's PortFolio",
    description:
        "Cole's developer portfolio — mobile apps, projects and technologies.",
    icons: {
        icon: "/vite.svg",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
