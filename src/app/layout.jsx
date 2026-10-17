import "../App.css";
import "../index.css";

export const metadata = {
    title: "Cole's PortFolio",
    description:
        "Cole's developer portfolio — mobile apps, projects and technologies.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
