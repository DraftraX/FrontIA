// ✅ 3. GestionPermisos.jsx (solo accesible por superadmin)
import React, { useEffect, useState } from "react";
import tokenItem from "../../../../utils/TokenItem";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";

export default function GestionPermisos() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    tokenItem.get("/api/auth/usuarios/").then((res) => setUsuarios(res.data));
  }, []);

  const actualizarPermiso = async (id, rol) => {
    await tokenItem.put(`/api/auth/usuarios/${id}/`, { rol });
    const res = await tokenItem.get("/api/auth/usuarios/");
    setUsuarios(res.data);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white font-mono px-4 py-8">
        <h2 className="text-2xl text-yellow-400 mb-6">Gestión de Permisos</h2>
        <div className="overflow-auto">
          <table className="w-full text-sm border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th>ID</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol Actual</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="text-center border-t border-gray-700">
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    {u.is_superuser
                      ? "Superadmin"
                      : u.is_staff
                      ? "Admin"
                      : "Usuario"}
                  </td>
                  <td>
                    <button
                      className="text-xs px-2 py-1 bg-cyan-600 rounded mr-2"
                      onClick={() => actualizarPermiso(u.id, "admin")}
                    >
                      Hacer Admin
                    </button>
                    <button
                      className="text-xs px-2 py-1 bg-yellow-600 rounded"
                      onClick={() => actualizarPermiso(u.id, "superadmin")}
                    >
                      Hacer Superadmin
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
}
