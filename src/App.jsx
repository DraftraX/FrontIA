import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./Modules/Seguridad/Home";
import Stats from "./Modules/Seguridad/Stats";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="home" element={<Home />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </BrowserRouter>
  );
}
