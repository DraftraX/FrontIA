import React, { useState } from "react";

export default function Modal({ usuario, onClose }) {
  const isSuperadmin = usuario.is_superuser;

  const [form, setForm] = useState({
    username: usuario.username,
    email: usuario.email,
    rol: isSuperadmin ? "superadmin" : usuario.is_staff ? "admin" : "usuario",
  });

  const handleChange = (e) => {
    if (isSuperadmin) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    if (isSuperadmin) return;
    console.log("📝 Datos modificados:", form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-pink-600">
        <h2 className="text-2xl font-bold text-center mb-6 text-pink-400">
          {isSuperadmin ? "Vista de Superadmin" : "Editar Usuario"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Usuario</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              disabled={isSuperadmin}
              className={`w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 ${
                isSuperadmin ? "opacity-60 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={isSuperadmin}
              className={`w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 ${
                isSuperadmin ? "opacity-60 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Rol</label>
            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              disabled={isSuperadmin}
              className={`w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 ${
                isSuperadmin ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <option value="usuario">Usuario</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cerrar
          </button>
          {!isSuperadmin && (
            <button
              onClick={handleGuardar}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
            >
              Guardar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
