import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./Modules/Seguridad/Home";
import Stats from "./Modules/Seguridad/Stats";
import Login from "./Modules/Seguridad/Login";
import Register from "./Modules/Seguridad/Register";
import Encryption from "./Modules/Encryption/Encryption";
import Decrypt from "./Modules/Decrypt";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="home" element={<Home />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/encryption" element={<Encryption />} />
        <Route path="/decrypt" element={<Decrypt />} />
      </Routes>
    </BrowserRouter>
  );
}
