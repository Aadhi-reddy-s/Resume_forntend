"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface User {
  username: string;
  email: string;
  password: string;
}

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (localStorage.getItem("loggedIn") === "true") {
      router.push("/home");
    }
  }, [router]);

  const clearFields = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setNewPassword("");
    setError("");
    setMessage("");
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]") as User[];

    if (mode === "login") {
      if (!username || !email || !password) {
        setError("Please fill in all fields.");
        return;
      }

      const existingUser = storedUsers.find(
        (user) =>
          user.username === username &&
          user.email === email &&
          user.password === password
      );

      if (!existingUser) {
        setError("Invalid credentials.");
        return;
      }

      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", existingUser.username);
      localStorage.setItem("email", existingUser.email);
      router.push("/home");

    } else if (mode === "register") {
      if (!username || !email || !password) {
        setError("Please fill in all fields.");
        return;
      }

      const userExists = storedUsers.some(
        (user) => user.email === email || user.username === username
      );

      if (userExists) {
        setError("User already exists.");
        return;
      }

      const newUser: User = { username, email, password };
      localStorage.setItem("users", JSON.stringify([...storedUsers, newUser]));
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("email", email);
      router.push("/home");

    } else if (mode === "forgot") {
      if (!email || !newPassword) {
        setError("Please provide your email and new password.");
        return;
      }

      const userIndex = storedUsers.findIndex((user) => user.email === email);
      if (userIndex === -1) {
        setError("No user found with that email.");
        return;
      }

      storedUsers[userIndex].password = newPassword;
      localStorage.setItem("users", JSON.stringify(storedUsers));
      setMessage("Password updated successfully. You can now log in.");
      clearFields();
      setMode("login");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4"
      style={{ backgroundImage: "url('/assets/login-bg.png')" }}
    >
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="text-4xl sm:text-5xl font-bold mb-8 text-center text-white drop-shadow-lg"
      >
        AI-Powered Resume Analyzer
      </motion.h1>

      <motion.form
        onSubmit={handleAuth}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-md border border-white/30 shadow-2xl rounded-xl w-full max-w-md p-8 text-white"
      >
        <h2 className="text-2xl font-semibold mb-5 text-center">
          {mode === "login"
            ? "Login to your account"
            : mode === "register"
            ? "Register a new account"
            : "Reset your password"}
        </h2>

        {error && <div className="bg-red-600/80 p-2 mb-3 rounded text-sm">{error}</div>}
        {message && <div className="bg-green-600/80 p-2 mb-3 rounded text-sm">{message}</div>}

        {mode !== "forgot" && (
          <>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              className="w-full bg-white/20 text-white px-3 py-2 mb-4 rounded border border-white/30 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </>
        )}

        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          className="w-full bg-white/20 text-white px-3 py-2 mb-4 rounded border border-white/30 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {(mode === "login" || mode === "register") && (
          <>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full bg-white/20 text-white px-3 py-2 mb-4 rounded border border-white/30 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}

        {mode === "forgot" && (
          <>
            <label className="block text-sm mb-1">New Password</label>
            <input
              type="password"
              className="w-full bg-white/20 text-white px-3 py-2 mb-4 rounded border border-white/30 focus:outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </>
        )}

        <button
          type="submit"
          className="w-full bg-white text-[#2c5364] font-bold py-2 rounded mt-2 hover:bg-gray-200 transition"
        >
          {mode === "login"
            ? "Login"
            : mode === "register"
            ? "Register"
            : "Reset Password"}
        </button>

        <div className="text-center text-sm mt-5 space-y-2">
          {mode === "login" && (
            <>
              <p>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="underline"
                  onClick={() => {
                    clearFields();
                    setMode("register");
                  }}
                >
                  Register
                </button>
              </p>
              <p>
                <button
                  type="button"
                  className="underline text-sm"
                  onClick={() => {
                    clearFields();
                    setMode("forgot");
                  }}
                >
                  Forgot Password?
                </button>
              </p>
            </>
          )}
          {mode === "register" && (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="underline"
                onClick={() => {
                  clearFields();
                  setMode("login");
                }}
              >
                Login
              </button>
            </p>
          )}
          {mode === "forgot" && (
            <p>
              Remembered your password?{" "}
              <button
                type="button"
                className="underline"
                onClick={() => {
                  clearFields();
                  setMode("login");
                }}
              >
                Login
              </button>
            </p>
          )}
        </div>
      </motion.form>
    </div>
  );
}
