// ✅ 1. EditarPerfil.jsx (componente para que el usuario edite sus datos personales)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import tokenItem from "../../../../utils/TokenItem";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";

export default function EditarPerfil() {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    tokenItem.get("/api/auth/profile/").then((res) => {
      setUser({
        first_name: res.data.first_name,
        last_name: res.data.last_name,
        email: res.data.email,
      });
    });
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await tokenItem.put("/api/auth/editar-perfil/", user);
    navigate("/perfil");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center">
        <form
          className="bg-[#1e1e1e] p-6 border border-pink-500 rounded-lg w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl text-pink-500 mb-4">Editar Perfil</h2>
          <input
            name="first_name"
            value={user.first_name}
            onChange={handleChange}
            placeholder="Nombres"
            className="mb-3 w-full px-3 py-2 bg-black border border-gray-500 rounded"
          />
          <input
            name="last_name"
            value={user.last_name}
            onChange={handleChange}
            placeholder="Apellidos"
            className="mb-3 w-full px-3 py-2 bg-black border border-gray-500 rounded"
          />
          <input
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Correo"
            className="mb-3 w-full px-3 py-2 bg-black border border-gray-500 rounded"
          />
          <button
            type="submit"
            className="w-full bg-pink-500 text-black py-2 rounded hover:bg-pink-400"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
