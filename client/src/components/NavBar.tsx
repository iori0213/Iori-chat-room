import React from "react";
import { Link } from "react-router-dom";
import "../styles/functions.css";

const NavBar: React.FC = () => {
  return (
    <div className="nav">
      <div>
        <Link to="/">Home</Link>
      </div>
      <div>
        <Link to="/register">Sign In</Link>
      </div>
      <div>
        <Link to="/login">Log In</Link>
      </div>
    </div>
  );
};

export default NavBar;
