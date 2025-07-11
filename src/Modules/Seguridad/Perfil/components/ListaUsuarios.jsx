// ✅ 2. ListaUsuarios.jsx (solo accesible por staff o superadmin)
import React, { useEffect, useState } from "react";
import tokenItem from "../../../../utils/TokenItem";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    tokenItem.get("/api/auth/usuarios/").then((res) => setUsuarios(res.data));
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white font-mono px-4 py-8">
        <h2 className="text-2xl text-pink-500 mb-6">Lista de Usuarios</h2>
        <div className="overflow-auto">
          <table className="w-full text-sm border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-4 py-2">ID</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Activo</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user) => (
                <tr
                  key={user.id}
                  className="text-center border-t border-gray-700"
                >
                  <td className="py-1">{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.is_superuser
                      ? "Superadmin"
                      : user.is_staff
                      ? "Admin"
                      : "Usuario"}
                  </td>
                  <td>{user.is_active ? "Sí" : "No"}</td>
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
