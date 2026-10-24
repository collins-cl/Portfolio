"use client";

import { useEffect, useState } from "react";
import Archive from "./Components/Archive/Archive";
import Collage from "./Components/Collage/Collage";
import Contact from "./Components/Contact/Contact";
import GiantEmail from "./Components/GiantEmail/GiantEmail";
import Guestbook from "./Components/Guestbook/Guestbook";
import Intro from "./Components/Intro/Intro";
import Nav from "./Components/Nav/Nav";
import Playground from "./Components/Playground/Playground";
import SelectedWork from "./Components/SelectedWork/SelectedWork";
import Skills from "./Components/Skills/Skills";
import { SpotifyProvider } from "./hooks/useSpotify";

function App() {
    const [workFilter, setWorkFilter] = useState("all");

    // Fade-up anything marked data-reveal as it scrolls into view.
    useEffect(() => {
        const nodes = document.querySelectorAll("[data-reveal]");

        if (!("IntersectionObserver" in window)) {
            nodes.forEach((node) => node.classList.add("is-in"));
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-in");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: "0px 0px -8% 0px" },
        );

        nodes.forEach((node) => observer.observe(node));

        return () => observer.disconnect();
    }, []);

    return (
        <SpotifyProvider>
            <Nav />
            <main>
                <Intro onFilter={setWorkFilter} />
                <Collage />
                <Skills />
                <SelectedWork filter={workFilter} onFilter={setWorkFilter} />
                <Playground />
                <Archive />
                <Contact />
            </main>
            <footer>
                <Guestbook />
                <GiantEmail />
            </footer>
        </SpotifyProvider>
    );
}

export default App;
