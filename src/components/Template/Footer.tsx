import React from "react";
import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer_text"> Application réalisée par :</p>
        <ul className="footer_list">
          <li>
            <Link className="footer_link" target="_blank" to="https://github.com/Axel-EIN">
              <p className="footer_name">Axel Turan</p>
              <FaGithub size={24} className="footer_icon" />
            </Link>
          </li>
          <li>
            <Link className="footer_link" target="_blank" to="https://github.com/Manja2012">
              <p className="footer_name">Marianna Demchenko</p>
              <FaGithub size={24} className="footer_icon" />
            </Link>
          </li>
          <li>
            <Link className="footer_link" target="_blank" to="https://github.com/vylexcourchevel">
              <p className="footer_name">Vighen Agopoff</p>
              <FaGithub size={24} className="footer_icon" />
            </Link>
          </li>
        </ul>
    </footer>
  );
};

export default Footer;
