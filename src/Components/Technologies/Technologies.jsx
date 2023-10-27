import React from "react";
import "../Technologies/Technologies.scss";
import { Langs } from "../LanguagesDummy";

const Technologies = () => {
  const data = Langs;
  return (
    <div className="technologies" data-scroll-section>
      <div className="wrapper">
        <p className="head">What I Work With.</p>

        <p className="desc">
          Over the years, I've built products for companies and individuals
          around africa ranging from marketing websites to complex solutions and
          enterprise apps with focus on fast, elegant and accessible user
          experiences.
        </p>

        <div className="speciality">
          <p className="title">What i build.</p>

          <div className="content">
            <div className="container">
              <div className="box">
                <span>Fe.</span>
                <p>Frontend Applications</p>
              </div>
              <div className="box">
                <span>Fs.</span>
                <p>FullStack Applications</p>
              </div>
              <div className="box">
                <span>Web3.</span>

                <p>Web3 Applications</p>
              </div>
            </div>
          </div>
        </div>

        <div className="skill">
          <p className="title">Technologies i work with.</p>

          <div className="list">
            {data.map((data) => (
              <div key={data.id} className="box">
                <img src={data.image} alt="" />

                <p>{data.Type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Technologies;
