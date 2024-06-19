import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCameraRetro } from "react-icons/fa";
import { TbTriangleInverted } from "react-icons/tb";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.header_container')) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const getPageName = (path) => {
    switch (path) {
      case "/":
        return "Home";
      case "/test-ia":
        return "Test-ia";
      case "/test-stockage":
        return "Test-stockage";
      case "/test-video":
        return "Test-video";
      case "/test-ia-video":
        return "Test-ia-video";
      default:
        return "";
    }
  };

  const currentPageName = getPageName(location.pathname);

  return (
    <header className="header">
      <Link to="/">
        <FaCameraRetro size={30} style={{ color: "var(--main-background-color)" }} />
      </Link>
      <div className="header_container">
        <span className="menu_icon" onClick={toggleMenu}>
          <TbTriangleInverted size={30} />
          <span className="current_page">{currentPageName}</span>
        </span>
        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <li className="nav_item">
            <Link className="nav_link" to="/" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li className="nav_item">
            <Link className="nav_link" to="/test-ia" onClick={closeMenu}>
              Test-ia
            </Link>
          </li>
          <li className="nav_item">
            <Link className="nav_link" to="/test-stockage" onClick={closeMenu}>
              Test-stockage
            </Link>
          </li>
          <li className="nav_item">
            <Link className="nav_link" to="/test-video" onClick={closeMenu}>
              Test-video
            </Link>
          </li>
          <li className="nav_item">
            <Link className="nav_link" to="/test-ia-video" onClick={closeMenu}>
              Test-ia-video
            </Link>
          </li>
        </nav>
      </div>
    </header>
  );
};

export default Header;
