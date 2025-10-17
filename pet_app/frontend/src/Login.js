import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    const url = isLogin
      ? "http://localhost:5000/api/login"
      : "http://localhost:5000/api/register";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("jwtToken", data.token);
        localStorage.setItem("username", form.username);
        navigate("/home");  
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch (err) {
      setError("Server error, please try again later.");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button className="login-btn" type="submit">
        {isLogin ? "Login" : "Sign Up"}
      </button>
      {error && (
        <div style={{ color: "#b60046", textAlign: "center" }}>{error}</div>
      )}
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        {isLogin ? (
          <>
            New user?{" "}
            <button
              type="button"
              className="login-btn"
              style={{ background: "#f4e9f9", color: "#7b107b" }}
              onClick={() => {
                setError("");
                setIsLogin(false);
              }}
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              className="login-btn"
              style={{ background: "#f4e9f9", color: "#7b107b" }}
              onClick={() => {
                setError("");
                setIsLogin(true);
              }}
            >
              Log In
            </button>
          </>
        )}
      </div>
    </form>
  );
}
