import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [users, setUsers] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repasswordVisible, setRepasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://api.escuelajs.co/api/v1/users/");
        const data = await response.json();
        setUsers(data);
        localStorage.setItem("users", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const localUsers = localStorage.getItem("users");
    if (localUsers) {
      setUsers(JSON.parse(localUsers));
    } else {
      fetchUsers();
    }
  }, []);

  const validateAvatarURL = async (url) => {
    try {
      const response = await fetch(url);
      if (response.ok && response.headers.get('Content-Type').includes('image')) {
        return true;  
      } else {
        return false;  
      }
    } catch (error) {
      return false; 
    }
  };

  const validate = async () => {
    const user = {
      email: email.trim(),
      password: password,
      repassword: repassword,
      name: name.trim(),
      avatar: avatar.trim(),
    };

    let isValid = true;

    if (!/\S+@\S+\.\S+/.test(user.email)) {
      alert("Email address is invalid");
      isValid = false;
    }

    if (user.password.length < 6) {
      alert("Password must be at least 6 characters long");
      isValid = false;
    }

    if (user.password !== user.repassword) {
      alert("Passwords do not match");
      isValid = false;
    }

    if (user.name.length < 1) {
      alert("Name cannot be empty");
      isValid = false;
    }

    if (user.avatar) {
      const isAvatarValid = await validateAvatarURL(user.avatar);
      if (!isAvatarValid) {
        alert("Avatar URL is invalid or not accessible");
        isValid = false;
      }
    }

    return isValid;
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const isValid = await validate();
    if (!isValid) return;

    setLoading(true);

    const user = {
      email: email,
      password: password,
      name: name,
      avatar: avatar,
      role: "customer",
    };

    fetch("https://api.escuelajs.co/api/v1/users/", {
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
            throw new Error(error.message || "Something went wrong");
          });
        }
        return resp.json();
      })
      .then((data) => {
        console.log("Registration successful:", data);
        alert("User registered successfully!");

        setEmail("");
        setPassword("");
        setRepassword("");
        setName("");
        setAvatar("");

        const updatedUsers = [...users, data];
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        navigate("/login");
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        alert(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleRegister}>
        <h1 className={styles.h1}>Register Page</h1>

        <div className={styles.fieldContainer}>
          <input
            type="email"
            className={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.fieldContainer}>
          <div className={styles.passwordContainer}>
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
             
            </button>
            <input
              type={passwordVisible ? "text" : "password"}
              className={styles.input}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles.fieldContainer}>
          <div className={styles.passwordContainer}>
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setRepasswordVisible(!repasswordVisible)}
            >
              
            </button>
            <input
              type={repasswordVisible ? "text" : "password"}
              className={styles.input}
              placeholder="RePassword"
              value={repassword}
              onChange={(e) => setRepassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles.fieldContainer}>
          <input
            type="text"
            className={styles.input}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.fieldContainer}>
          <input
            type="text"
            className={styles.input}
            placeholder="Avatar URL"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <Link to="/login" className={styles.link}>
          LOGIN
        </Link>
      </form>
    </div>
  );
}

export default Register;
