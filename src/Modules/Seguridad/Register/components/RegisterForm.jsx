// src/Modules/Seguridad/components/RegisterForm.jsx
import React, { useState } from "react";
import { message } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import tokenItem from "../../../../utils/TokenItem";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterForm({ email }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue =
      name === "password" || name === "password2" ? value : value.toUpperCase();

    setForm({ ...form, [name]: newValue });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.password2) {
      return message.error("Las contraseñas no coinciden.");
    }

    if (!validatePassword(form.password)) {
      return message.error(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
      );
    }

    try {
      const response = await tokenItem.post("/api/auth/register/", {
        email,
        ...form,
      });

      message.success("Registro exitoso. Ya puedes iniciar sesión.");
      console.log("Usuario registrado:", response.data);

      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.error(err);
      const errors = err.response?.data || {};
      Object.values(errors).forEach((e) => message.error(e));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleRegister} className="space-y-5 mt-6">
      {[
        { label: "Nombres", name: "first_name" },
        { label: "Apellidos", name: "last_name" },
        { label: "Usuario", name: "username" },
      ].map(({ label, name }) => (
        <div className="flex flex-col" key={name}>
          <label className="text-sm mb-1">{label}</label>
          <input
            type="text"
            name={name}
            value={form[name]}
            onChange={handleChange}
            required
            className="px-4 py-2 bg-transparent border-b-2 border-white focus:border-pink-500 outline-none"
          />
        </div>
      ))}

      {["password", "password2"].map((name, i) => (
        <div className="flex flex-col relative" key={name}>
          <label className="text-sm mb-1">
            {i === 0 ? "Contraseña" : "Repetir Contraseña"}
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name={name}
            value={form[name]}
            onChange={handleChange}
            required
            className="px-4 py-2 bg-transparent border-b-2 border-white focus:border-pink-500 outline-none pr-10"
          />
          <span
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-8 cursor-pointer text-xl text-gray-300 hover:text-white"
          >
            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </span>
        </div>
      ))}

      <button
        type="submit"
        className="w-full py-2 mt-4 font-semibold border-2 border-pink-500 rounded-full hover:bg-pink-500 hover:text-black transition-colors"
      >
        Registrar
      </button>

      <div className="text-center text-sm text-gray-400 mt-4">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-pink-500 hover:underline">
          Inicia sesión
        </Link>
      </div>
    </form>
  );
}
