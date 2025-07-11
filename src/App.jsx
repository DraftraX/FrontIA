import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./Modules/Seguridad/Home";
import Stats from "./Modules/Seguridad/Stats";
import Login from "./Modules/Seguridad/Login";
import Register from "./Modules/Seguridad/Register";
import Encryption from "./Modules/Encryption/Encryption";
import Decrypt from "./Modules/Decrypt";
import Profile from "./Modules/Seguridad/Perfil/Profile";
import EditarPerfil from "./Modules/Seguridad/Perfil/components/EditarPerfil";
import ListaUsuarios from "./Modules/Seguridad/Perfil/components/ListaUsuarios";

import LayoutProtegido from "./layouts/LayoutProtegido";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<LayoutProtegido />}>
          <Route path="/stats" element={<Stats />} />
          <Route path="/encryption" element={<Encryption />} />
          <Route path="/decrypt" element={<Decrypt />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/editar-perfil" element={<EditarPerfil />} />
          <Route path="/lista-usuarios" element={<ListaUsuarios />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
