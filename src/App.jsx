import { useEffect } from "react";
import "./App.css";
import Nav from "./Components/Nav/Nav";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/src/locomotive-scroll.scss";
import Hero from "./Components/Hero/Hero";
import About from "./Components/About/About";

function App() {
  //for smooth scrolling transition
  useEffect(() => {
    const scrollEL = document.querySelector("#main");
    const scroll = new LocomotiveScroll({
      el: scrollEL,
      smooth: true,
      multiplier: 1,
    });
  }, []);

  return (
    <div data-scroll-container id="main">
      <Nav />
      <Hero />
      <About />
      
    </div>
  );
}

export default App;
