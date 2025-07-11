import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import tokenItem from "../../../utils/TokenItem";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await tokenItem.get("/api/auth/profile/");
        setUser(response.data);
      } catch (error) {
        console.error("🔴 Error al obtener perfil:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, []);

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen w-full bg-black text-white font-mono">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-start px-4 pt-20">
        <div className="bg-[#1e1e1e] border border-pink-500 rounded-2xl shadow-2xl max-w-xl w-full p-8 text-sm">
          <div className="flex flex-col items-center mb-6">
            <img
              src="/gato.jpg"
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-pink-500 shadow-lg object-cover"
            />
            <h2 className="text-2xl font-bold text-pink-500 mt-4">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-gray-400 text-sm">@{user.username}</p>
          </div>

          <div className="space-y-4">
            <Field label="Correo electrónico" value={user.email} />
            <Field
              label="Rol"
              value={
                user.is_superuser
                  ? "Superadministrador"
                  : user.is_staff
                  ? "Administrador"
                  : "Usuario"
              }
            />
          </div>

          <div className="mt-8 space-y-3">
            <Link to="/editar-perfil">
              <button className="w-full py-2 border border-white rounded hover:bg-white hover:text-black transition">
                Editar perfil
              </button>
            </Link>

            <Link to="/cambiar-password">
              <button className="w-full py-2 border border-pink-500 rounded hover:bg-pink-500 hover:text-black transition">
                Cambiar contraseña
              </button>
            </Link>

            {(user.is_staff || user.is_superuser) && (
              <>
                <Link to="/lista-usuarios">
                  <button className="w-full py-2 border border-cyan-500 rounded hover:bg-cyan-500 hover:text-black transition">
                    Ver lista de usuarios
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-700 pb-2">
      <span className="font-semibold text-gray-400">{label}:</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
