// src/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { axiosInstance } from "./lib/axios.js";
const Register = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleRegister = async () => {
    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    try {
      const res = await axiosInstance.post("/api/auth/signup", {
        username,
        password,
      });

      // Store token if needed
      localStorage.setItem("token", res.data.token);
      onSuccess && onSuccess(username); // optional callback
      console.log("User registered:", res.data);
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      setError("Failed to register. Please try again.");
    }
  };

  return null;
};

export default Register;
