import React, { useEffect, useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./screen/Home";
import Login from "./screen/Login";
import SignIn from "./screen/SignIn";
import NavBar from "./components/NavBar";
import axios from "axios";

function App() {
  const [checker, setChecker] = useState(true);

  useEffect(() => {
    const accessToken = window.localStorage.getItem("accessToken");
    axios({
      method: "POST",
      url: `${import.meta.env.VITE_API_URL}/auth/token/access`,
      headers: {
        authentication: "Bearer " + accessToken,
      },
    }).then((data) => {
      console.log(data);
    });
  }, []);

  return (
    <React.Fragment>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignIn />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
