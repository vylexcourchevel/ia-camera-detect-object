import React, { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/test-ia">Test-ia</Link>
          </li>
          <li>
            <Link to="/test-stockage">Test-stockage</Link>
          </li>
          <li>
            <Link to="/test-video">Test-video</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Header;
