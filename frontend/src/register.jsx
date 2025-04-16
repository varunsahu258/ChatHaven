// src/Register.jsx
import React, { useState } from "react";
import axios from "axios";

const Register = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      const res = await axios.post("https://chathaven-zvsp.onrender.com", {
        username,
        password,
      });

      // Store token if needed
      localStorage.setItem("token", res.data.token);
      onSuccess && onSuccess(username); // optional callback

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center">Create Account</h2>

      <input
        className="border p-2 rounded"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="border p-2 rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleRegister}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
      >
        Create Account
      </button>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </div>
  );
};

export default Register;
