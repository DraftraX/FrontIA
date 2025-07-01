import React, { useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function Register() {
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Simular código enviado (en producción sería desde backend)
  const [verificationCode] = useState(() =>
    Math.floor(100000 + Math.random() * 900000).toString()
  );

  const sendCodeToEmail = () => {
    if (!email.includes("@") || !email.includes(".")) {
      alert("Correo electrónico inválido.");
      return;
    }

    console.log(`(Simulado) Código enviado a ${email}: ${verificationCode}`);
    setCodeSent(true);
    alert(`Código de verificación enviado a ${email} (simulado en consola)`);
  };

  const verifyCode = () => {
    if (codeInput === verificationCode) {
      setCodeVerified(true);
      alert("Correo verificado correctamente.");
    } else {
      alert("Código incorrecto.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registrando usuario:", { email, username, password });
    // Aquí agregar lógica de envío a backend con Axios si deseas
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-mono">
      <Header />
      <main className="flex flex-1 items-center justify-center relative overflow-hidden">
        <div className="w-full max-w-md p-8 bg-[#1e1e1e] rounded-xl shadow-2xl border border-pink-500">
          <h2 className="text-3xl font-bold text-center mb-6 text-pink-500">
            Registro
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Paso 1: Correo */}
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 bg-transparent border-b-2 border-white focus:border-pink-500 outline-none transition-colors"
                required
                disabled={codeSent}
              />
              {!codeSent && (
                <button
                  type="button"
                  onClick={sendCodeToEmail}
                  className="mt-3 py-1 border border-pink-500 rounded-full hover:bg-pink-500 hover:text-black transition"
                >
                  Enviar código
                </button>
              )}
            </div>

            {/* Paso 2: Verificación */}
            {codeSent && !codeVerified && (
              <div className="flex flex-col">
                <label htmlFor="code" className="text-sm mb-1">
                  Código recibido
                </label>
                <input
                  id="code"
                  type="text"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  className="px-4 py-2 bg-transparent border-b-2 border-white focus:border-pink-500 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={verifyCode}
                  className="mt-3 py-1 border border-pink-500 rounded-full hover:bg-pink-500 hover:text-black transition"
                >
                  Verificar código
                </button>
              </div>
            )}

            {/* Paso 3: Username & Password */}
            {codeVerified && (
              <>
                <div className="flex flex-col">
                  <label htmlFor="username" className="text-sm mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="px-4 py-2 bg-transparent border-b-2 border-white focus:border-pink-500 outline-none transition-colors"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="password" className="text-sm mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="px-4 py-2 bg-transparent border-b-2 border-white focus:border-pink-500 outline-none transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 mt-4 font-semibold border-2 border-pink-500 rounded-full hover:bg-pink-500 hover:text-black transition-colors"
                >
                  Registrar
                </button>
              </>
            )}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
