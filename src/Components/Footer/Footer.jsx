import React from "react";
import "../Footer/Footer.scss";
import { FaGithub, FaX, FaLinkedinIn, FaInstagram } from "react-icons/fa6";
import { BsArrowUpRight } from "react-icons/bs";

const Footer = () => {
  return (
    <div className="footer" data-scroll-section>
      <div className="wrapper">
        <div className="top">
          <div className="head">
            <p>Come Share Your Ideas With Me!</p>
          </div>

          <div className="desc">
            <span>
              My inbox is always open. Whether you have a question or just want
              to say hello, I'll try my best to get back to you! Feel free to
              mail me about any relevant job updates
            </span>
          </div>

          <div className="brief-info">
            <a href="mailto:collinsolads@gmail.com">
              Email me. <BsArrowUpRight fill="rgb(94, 218, 255)" />
            </a>
            <a href="../../assets/collins_resume.pdf" download>
              Resume. <BsArrowUpRight fill="rgb(94, 218, 255)" />
            </a>
          </div>
        </div>

        <hr />

        <div className="bottom">
          <div className="right">©️ COLLINS ABUANEKWU</div>

          <div className="socials">
            <a
              href="https://github.com/collins-cl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="icon" fill="rgb(94, 218, 255)" />
            </a>
            <a
              href="https://x.com/meet_cole_"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaX className="icon" fill="rgb(94, 218, 255)" />
            </a>
            <a
              href="https://linkedln.com/collins-abuanekwu"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn className="icon" fill="rgb(94, 218, 255)" />
            </a>
            <a
              href="https://instagram.com/meet_cole_"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="icon" fill="rgb(94, 218, 255)" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
