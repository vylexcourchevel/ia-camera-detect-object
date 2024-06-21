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
        return "Test AI Image";
      case "/test-stockage":
        return "Test IndexesDB";
      case "/test-video":
        return "Test Camera";
      case "/test-ia-video":
        return "Test AI Video";
      default:
        return "";
    }
  };

  const currentPageName = getPageName(location.pathname);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
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
                <Link className="nav_link" to="/test-video" onClick={closeMenu}>
                  Test Camera
                </Link>
              </li>
              <li className="nav_item">
                <Link className="nav_link" to="/test-ia" onClick={closeMenu}>
                  Test AI Image
                </Link>
              </li>
              <li className="nav_item">
                <Link className="nav_link" to="/test-ia-video" onClick={closeMenu}>
                  Test AI Video
                </Link>
              </li>
              <li className="nav_item">
                <Link className="nav_link" to="/test-stockage" onClick={closeMenu}>
                  Test IndexesDB
                </Link>
              </li>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
