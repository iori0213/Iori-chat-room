import axios from "axios";
import React, { useState } from "react";

const SignInForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: `${import.meta.env.VITE_API_URL}/auth/register`,
      data: {
        name,
        email,
        password,
      },
    }).then((data) => {
      console.log(data);
    });
  };
  return (
    <>
      <form onSubmit={registerHandler}>
        <div>
          <input
            type="text"
            value={name}
            placeholder="name"
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </div>
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

export default SignInForm;
