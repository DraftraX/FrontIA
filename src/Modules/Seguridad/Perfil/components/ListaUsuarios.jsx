import React, { useEffect, useState } from "react";
import tokenItem from "../../../../utils/TokenItem";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Modal from "./Modal";

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await tokenItem.get("/api/auth/usuarios/");
      console.log("📦 Usuarios recibidos:", res.data);
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "—");

  const abrirModal = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setUsuarioSeleccionado(null);
    setMostrarModal(false);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white font-mono px-4 py-8">
        <h2 className="text-3xl text-pink-500 mb-6 text-center font-bold">
          Gestión y Lista de Usuarios
        </h2>
        <div className="overflow-auto rounded-xl border border-gray-700 shadow-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800 text-gray-300 text-center">
                <th className="py-2 px-3">ID</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Activo</th>
                <th>Último login</th>
                <th>Última actividad</th>
                <th>Último logout</th>
                <th>Sesión</th>
                <th>Registrado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-gray-700 text-center hover:bg-gray-900 transition"
                >
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td className="font-semibold text-cyan-400">
                    {u.is_superuser
                      ? "Superadmin"
                      : u.is_staff
                      ? "Admin"
                      : "Usuario"}
                  </td>
                  <td className="text-green-400">
                    {u.is_active ? "Sí" : "No"}
                  </td>
                  <td>{formatDate(u.last_login)}</td>
                  <td>{formatDate(u.last_activity)}</td>
                  <td>{formatDate(u.last_logout)}</td>
                  <td className="text-yellow-400">
                    {u.total_session_time || "—"}
                  </td>
                  <td>{formatDate(u.date_joined)}</td>
                  <td className="space-y-1 space-x-1">
                    {!u.is_superuser && (
                      <>
                        <button
                          onClick={() => abrirModal(u)}
                          className="text-xs bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded"
                        >
                          Modificar
                        </button>
                        <button className="text-xs bg-red-600 hover:bg-red-500 px-2 py-1 rounded">
                          Eliminar
                        </button>
                        <button className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">
                          Bloquear
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />

      {/* Modal editable */}
      {mostrarModal && usuarioSeleccionado && (
        <Modal usuario={usuarioSeleccionado} onClose={cerrarModal} />
      )}
    </>
  );
}
