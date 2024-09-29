import React, { useState, useRef } from "react";
import "./index.css";
import { useNavigate, Link } from "react-router-dom";

const label = { inputProps: { "aria-label": "Switch demo" } };

function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const validate = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email) {
      setError("Email is required");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Invalid email format");
      return false;
    }

    if (!password) {
      setError("Password is required");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    setError(""); 
    return true;
  };

  
  const handleForm = (event) => {
    event.preventDefault();

    const isValid = validate();
    if (!isValid) return;

    const user = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    setLoading(true);

    fetch("https://api.escuelajs.co/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((resp) => {
        if (!resp.ok) {
          return resp.json().then((error) => {
            console.error("Error response:", error);
            throw new Error(error.message || "Invalid login credentials");
          });
        }
        return resp.json();
      })
      .then((data) => {
        if (data.access_token) {
         
          localStorage.setItem("token", data.access_token);
          navigate("/"); 
        } else {
          setError("Invalid login credentials");
        }
      })
      .catch((err) => {
        console.error("Error during fetch:", err);
        setError(
          err.message || "Something went wrong. Please try again later."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login">
      <h2>Nice to see you again</h2>
      <form onSubmit={handleForm}>
        <div className="inputp">
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            ref={emailRef}
            className="input"
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            required
          />
        </div>
        <div className="inputp">
          <label className="label" htmlFor="password">
            Password
          </label>
          <div className="password-container">
            <input
              ref={passwordRef}
              className="input"
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              className="show-password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        <div className="cheked">
          <div className="me">
            <h4>Remember me</h4>
          </div>
          <h3>Forgot password?</h3>
        </div>
        <button type="submit" className="button" disabled={loading}>
          {loading ? "LOADING..." : "Sign in"}
        </button>
      </form>

      <div className="dont">
        <h2>Don't have an account?</h2>
        <h3>
          <Link to="/register">REGISTER</Link>
        </h3>
      </div>
    </div>
  );
}

export default Login;
