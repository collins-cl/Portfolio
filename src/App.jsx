"use client";

import "locomotive-scroll/dist/locomotive-scroll.css";
import About from "./Components/About/About";
import Footer from "./Components/Footer/Footer";
import Hero from "./Components/Hero/Hero";
import MobileShowcase from "./Components/MobileShowcase/MobileShowcase";
import Nav from "./Components/Nav/Nav";
import Projects from "./Components/Projects/Projects";
import Technologies from "./Components/Technologies/Technologies";

function App() {
    return (
        <div data-scroll-container id="main">
            <Nav />
            <Hero />
            <About />
            <Technologies />
            <Projects />
            <MobileShowcase />
            <Footer />
        </div>
    );
}

export default App;
