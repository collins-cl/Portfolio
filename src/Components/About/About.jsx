import React from "react";
import "../About/About.scss";

const About = () => {
  return (
    <div className="about" data-scroll-section>
      <div className="introduction">
        <p>
          Hi Friend ╰(*°▽°*)╯. I'm Collins!. I started my software developer
          career as a web developer and over the past two years, i've learnt a
          great deal of Frontend n Backend technologies.{" "}
        </p>
      </div>
      <div className="wrapper">
        <div className="section-1">
          <p className="head">iDESIGN</p>
          <div>
            I enjoy the constant changes in the technologies used in the area
            and love diving into new frameworks and technologies. I challenge
            myself by diving head-first into the unknown, learning the skills
            along the way, needed to complete the task, thereby desgining
            incredible progressive webpages.
          </div>
        </div>

        <div className="section-1">
          <p className="head">iDEVELOP</p>
          <div>
            I offer a wide range of quality and unmatched services and ideas
            that when tested proves to acknowledgable and useful in various
            usecases. I test myself to implement complex web ideas, work with
            databases, blockchains and many others with the purpose of solving
            real world problems
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
