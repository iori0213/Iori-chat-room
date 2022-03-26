import React, { useEffect, useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./screen/Home";
import Login from "./screen/Login";
import SignIn from "./screen/SignIn";
import NavBar from "./components/NavBar";
import axios from "axios";
import GlobalContext from "./context/GlobalContext";

function App() {
  const [fetch, setFetch] = useState(true);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const accessToken = window.localStorage.getItem("accessToken");
    axios({
      method: "POST",
      url: `${import.meta.env.VITE_API_URL}/auth/token/access`,
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then(({ status, data }) => {
        console.log(data);
        setFetch(true);
        if (status === 200) {
          setLogged(true);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <GlobalContext.Provider value={{ logged }}>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignIn />} />
      </Routes>
    </GlobalContext.Provider>
  );
}

export default App;
