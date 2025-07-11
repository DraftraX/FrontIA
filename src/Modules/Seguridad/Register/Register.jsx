// src/Modules/Seguridad/Register.jsx
import React, { useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { message } from "antd";
import tokenItem from "../../../utils/TokenItem";
import RegisterForm from "./components/RegisterForm";

export default function Register() {
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  const sendCode = async () => {
    if (!email.includes("@") || !email.includes(".")) {
      message.error("Correo inválido");
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    try {
      await tokenItem.post("/api/auth/enviar-codigo/", { email, code });
      setCodeSent(true);
      message.success(`Código enviado a ${email}`);
    } catch (err) {
      console.error(err);
      message.error("Error al enviar el código");
    }
  };

  const verifyCode = async () => {
    if (codeInput === generatedCode) {
      setEmailVerified(true);
      message.success("Correo verificado correctamente");
    } else {
      message.error("Código incorrecto");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-mono">
      <Header />
      <main className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md p-8 bg-[#1e1e1e] rounded-xl border border-pink-500 shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-6 text-pink-500">
            Registro
          </h2>

          {!codeSent && (
            <div className="flex flex-col space-y-3">
              <label className="text-sm">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 bg-transparent border-b-2 border-white focus:border-pink-500 outline-none"
              />
              <button
                onClick={sendCode}
                className="py-1 border border-pink-500 rounded-full hover:bg-pink-500 hover:text-black transition"
              >
                Enviar código
              </button>
            </div>
          )}

          {codeSent && !emailVerified && (
            <div className="flex flex-col space-y-3">
              <label className="text-sm mt-4">Código de verificación</label>
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                className="px-4 py-2 bg-transparent border-b-2 border-white focus:border-pink-500 outline-none"
              />
              <button
                onClick={verifyCode}
                className="py-1 border border-pink-500 rounded-full hover:bg-pink-500 hover:text-black transition"
              >
                Verificar código
              </button>
            </div>
          )}

          {emailVerified && <RegisterForm email={email} />}
        </div>
      </main>
      <Footer />
    </div>
  );
}
