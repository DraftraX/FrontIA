// src/layouts/LayoutProtegido.jsx
import { Outlet } from "react-router-dom";
import useInactividad from "../hook/useInactividad";
import RutasProtegidas from "../utils/RutasProtegida";
import useValidateSession from "../hook/useValidateSession";

export default function LayoutProtegido() {
  useInactividad();
  useValidateSession();

  return (
    <RutasProtegidas>
      <Outlet />
    </RutasProtegidas>
  );
}
