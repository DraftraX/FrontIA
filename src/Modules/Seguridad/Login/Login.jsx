import React, { useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", { username, password });
    // Aquí puedes agregar lógica con Axios
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-mono">
      <Header />
      <main className="flex flex-1 items-center justify-center relative overflow-hidden">
        <div className="w-full max-w-md p-8 bg-[#1e1e1e] rounded-xl shadow-2xl border border-pink-500">
          <h2 className="text-3xl font-bold text-center mb-6 text-pink-500">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col">
              <label htmlFor="username" className="text-sm mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="px-4 py-2 bg-transparent border-b-2 border-white focus:border-pink-500 outline-none transition-colors"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-2 bg-transparent border-b-2 border-white focus:border-pink-500 outline-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 mt-4 font-semibold border-2 border-pink-500 rounded-full hover:bg-pink-500 hover:text-black transition-colors"
            >
              Iniciar sesión
            </button>

            <div className="text-center text-sm text-gray-400 mt-4">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-pink-500 hover:underline">
                Regístrate
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
