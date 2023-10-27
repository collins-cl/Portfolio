import React from "react";
import "../Nav/Nav.scss";
import Logo from "../../assets/codm2.svg";

const Nav = () => {
  return (
    <div className="nav" data-scroll-section>
      <div className="wrapper">
        <p className="logo">
          <a href="/">Coledev.</a>
        </p>

        <div className="aside">
          <a href="/">
            <div className="codm-logo">
              <img src={Logo} alt="" />
            </div>
          </a>

          <p className="username">Cleanrabbit</p>
        </div>
      </div>
    </div>
  );
};

export default Nav;
