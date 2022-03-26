import axios from "axios";
import React, { useState } from "react";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: `${import.meta.env.VITE_API_URL}/auth/login`,
      data: {
        email,
        password,
      },
    }).then(({ data, status }) => {
      if (status === 200) {
        window.localStorage.setItem("accessToken", data.accessToken);
        window.localStorage.setItem("refreshToken", data.refreshToken);
      }
    });
  };
  return (
    <>
      <form onSubmit={loginHandler}>
        <div>
          <input
            type="text"
            value={email}
            placeholder="email"
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default LoginForm;
