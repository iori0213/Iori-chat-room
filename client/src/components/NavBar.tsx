import axios from "axios";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import GlobalContext from "../context/GlobalContext";
import "../styles/functions.css";

const NavBar: React.FC = () => {
  const { logged } = useContext(GlobalContext);
  const handleLogOut = () => {
    const refreshToken = window.localStorage.getItem("refreshToken");
    if (refreshToken) {
      axios({
        method: "POST",
        headers: {
          Authorization: "Bearer " + refreshToken,
        },
      }).then(({ data, status }) => {
        if (status === 200) {
          window.localStorage.removeItem("refreshToken");
          window.localStorage.removeItem("accessToken");
        }
      });
    }
  };
  return (
    <div className="nav">
      <div>
        <Link to="/">Home</Link>
      </div>
      {logged ? (
        <div onClick={handleLogOut}>Log out</div>
      ) : (
        <>
          <div>
            <Link to="/register">Sign In</Link>
          </div>
          <div>
            <Link to="/login">Log In</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default NavBar;
