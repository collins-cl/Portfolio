import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { useEffect, useRef } from "react";
import "./App.css";
import About from "./Components/About/About";
import Footer from "./Components/Footer/Footer";
import Hero from "./Components/Hero/Hero";
import Nav from "./Components/Nav/Nav";
import Projects from "./Components/Projects/Projects";
import Technologies from "./Components/Technologies/Technologies";

function App() {
    const scrollRef = useRef(null);

    //for smooth scrolling transition
    useEffect(() => {
        const scrollEl = document.querySelector("#main");
        const scroll = new LocomotiveScroll({
            el: scrollEl,
            smooth: true,
            smartphone: { smooth: true },
            multiplier: 1,
        });
        scrollRef.current = scroll;

        // Keep the scroll limit in sync when the container changes size
        // (fonts/images loading, "Show More" expanding the projects list, etc.).
        const resizeObserver = new ResizeObserver(() => scroll.update());
        resizeObserver.observe(scrollEl);

        return () => {
            resizeObserver.disconnect();
            scroll.destroy();
            scrollRef.current = null;
        };
    }, []);

    return (
        <div data-scroll-container id="main">
            <Nav />
            <Hero />
            <About />
            <Technologies />
            <Projects />
            <Footer />
        </div>
    );
}

export default App;
