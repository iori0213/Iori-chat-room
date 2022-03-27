import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import NavBar from "./components/NavBar";
import axios from "axios";
import GlobalContext from "./context/GlobalContext";
import { SpinningCircles } from "react-loading-icons";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { toasti } from "./ultis/_visual";

function App() {
  const [isFetching, setIsFetching] = useState(true);
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
      .then(({ data }) => {
        console.log(data);
        setIsFetching(true);
        if (data.success) {
          // setLogged(true);
        }
      })
      .catch((e) => {
        // setFetch(true);
        toasti(e?.respone?.message?.message, "error");
      });
  }, []);

  return (
    <GlobalContext.Provider value={{ logged }}>
      <ToastContainer />
      {isFetching}
      <div className="loading-modal">
        <SpinningCircles color="red" />
      </div>
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
