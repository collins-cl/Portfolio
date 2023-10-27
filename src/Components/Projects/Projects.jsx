import React, { useState } from "react";
import "../Projects/Project.scss";
import { BsFolder, BsArrowUpRight } from "react-icons/bs";
import { PiGithubLogoLight } from "react-icons/pi";
import { ProjectDummy } from "../LanguagesDummy";

const Projects = () => {
  const [itemstoshow, setItemsToShow] = useState(4);
  const data = ProjectDummy;

  return (
    <div data-scroll-section className="projects">
      <div className="wrapper">
        <p className="head">What i've built so far.</p>

        <div className="project">
          {data &&
            data.slice(0, itemstoshow).map((item) => (
              <div className="box" key={item.id}>
                <div className="top">
                  <BsFolder className="icons" />

                  <a
                    href={`http://${item.Git}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <PiGithubLogoLight className="icons git" />
                  </a>
                </div>

                <p className="title">{item.Name}</p>

                <div className="desc">{item.Description}</div>

                <div className="bottom">
                  <div className="stack">{item.stack}</div>

                  <p className="view">
                    <a
                      href={`http://${item.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View <BsArrowUpRight className="icons" />
                    </a>
                  </p>
                </div>
              </div>
            ))}
        </div>

        <div className="show-more" onClick={()=>setItemsToShow(itemstoshow + 3)}>
            <p>Show More</p>
        </div>
      </div>
    </div>
  );
};

export default Projects;
