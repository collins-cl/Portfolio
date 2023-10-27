import { useEffect } from "react";
import "./App.css";
import Nav from "./Components/Nav/Nav";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/src/locomotive-scroll.scss";
import Hero from "./Components/Hero/Hero";
import About from "./Components/About/About";
import Technologies from "./Components/Technologies/Technologies";
import Projects from "./Components/Projects/Projects";

function App() {
  //for smooth scrolling transition
  useEffect(() => {
    const scrollEL = document.querySelector("#main");
    const scroll = new LocomotiveScroll({
      el: scrollEL,
      smooth: true,
      smartphone: true,
      multiplier: 1,
    });
  }, []);

  return (
    <div data-scroll-container id="main">
      <Nav />
      <Hero />
      <About />
      <Technologies />
      <Projects />
    </div>
  );
}

export default App;
