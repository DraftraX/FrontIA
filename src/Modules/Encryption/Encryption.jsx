import React, { useState, useRef } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";
import { message } from "antd";

export default function Encryption() {
  const [mode, setMode] = useState("encrypt");
  const [encryptFile, setEncryptFile] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [verifyFile, setVerifyFile] = useState(null);
  const [verifySig, setVerifySig] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);

  const encryptFileRef = useRef(null);
  const publicKeyRef = useRef(null);
  const verifyFileRef = useRef(null);
  const verifySigRef = useRef(null);

  const handleEncrypt = async () => {
    if (!encryptFile || !publicKey) {
      message.warning("Selecciona el archivo y la clave pública");
      return;
    }

    const formData = new FormData();
    formData.append("file", encryptFile);
    formData.append("public_key", publicKey);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/encrypt-document/",
        formData,
        { responseType: "blob" }
      );

      const contentDisposition = res.headers["content-disposition"];
      const match =
        contentDisposition &&
        contentDisposition.match(/filename\*?=(?:UTF-8'')?["']?([^;"']+)/i);
      const filename = match
        ? decodeURIComponent(match[1])
        : "secure_document.zip";

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      message.success("Documento cifrado correctamente");

      // Limpiar
      setEncryptFile(null);
      setPublicKey(null);
      if (encryptFileRef.current) encryptFileRef.current.value = "";
      if (publicKeyRef.current) publicKeyRef.current.value = "";
    } catch (err) {
      console.error("Error:", err);
      message.error("Error al cifrar el archivo");
    }
  };

  const handleVerify = async () => {
    if (!verifyFile || !verifySig) {
      message.warning("Selecciona ambos archivos");
      return;
    }

    const formData = new FormData();
    formData.append("file", verifyFile);
    formData.append("signature", verifySig);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/verify-document/",
        formData
      );
      const valid = res.data.valid;
      setVerifyResult(
        valid
          ? "✅ Válido: El archivo no fue modificado"
          : "❌ Inválido: El archivo fue alterado"
      );
      message.info(valid ? "Firma válida" : "Firma inválida");

      setVerifyFile(null);
      setVerifySig(null);
      if (verifyFileRef.current) verifyFileRef.current.value = "";
      if (verifySigRef.current) verifySigRef.current.value = "";
    } catch (err) {
      console.error(err);
      message.error("Error al verificar la firma");
      setVerifyResult("⚠️ Error al verificar la firma.");
    }
  };

  const handleDownloadPublicKey = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/public-key/", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "server_public_key.pem");
      document.body.appendChild(link);
      link.click();
      link.remove();

      const file = new File([res.data], "server_public_key.pem", {
        type: "application/x-pem-file",
      });
      setPublicKey(file);
      message.success("Clave pública descargada");
    } catch (err) {
      console.error(err);
      message.error("No se pudo descargar la clave pública");
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-black text-white font-mono overflow-hidden">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-start p-8 gap-8 mt-10">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setMode("encrypt")}
            className={`px-6 py-2 rounded-full ${
              mode === "encrypt"
                ? "bg-pink-500"
                : "bg-gray-700 hover:bg-pink-600"
            }`}
          >
            Encriptar y Firmar
          </button>
          <button
            onClick={() => setMode("verify")}
            className={`px-6 py-2 rounded-full ${
              mode === "verify"
                ? "bg-pink-500"
                : "bg-gray-700 hover:bg-pink-600"
            }`}
          >
            Verificar Firma
          </button>
        </div>

        {mode === "encrypt" && (
          <div className="w-[750px] p-8 border-2 border-pink-500 bg-[#25252b] rounded-2xl shadow-[0_0_25px_#ff2770]">
            <h2 className="text-3xl text-center mb-6 text-pink-500">
              Sign & Encrypt Document
            </h2>

            <div className="mb-4">
              <label className="block mb-1">Documento a encriptar</label>
              <input
                ref={encryptFileRef}
                type="file"
                onChange={(e) => setEncryptFile(e.target.files[0])}
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-pink-600 hover:file:bg-pink-700"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 flex justify-between items-center">
                Clave pública (.pem)
                <button
                  onClick={handleDownloadPublicKey}
                  className="text-sm bg-gray-700 hover:bg-pink-600 px-3 py-1 rounded-full"
                >
                  Descargar
                </button>
              </label>
              <input
                ref={publicKeyRef}
                type="file"
                onChange={(e) => setPublicKey(e.target.files[0])}
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-pink-600 hover:file:bg-pink-700"
              />
            </div>

            <button
              onClick={handleEncrypt}
              className="w-full py-2 bg-pink-500 hover:bg-pink-700 text-white rounded-full"
            >
              Generar ZIP seguro
            </button>
          </div>
        )}

        {mode === "verify" && (
          <div className="w-[750px] p-8 border-2 border-pink-500 bg-[#25252b] rounded-2xl shadow-[0_0_25px_#ff2770]">
            <h2 className="text-3xl text-center mb-6 text-pink-500">
              Verificar Firma Digital
            </h2>
            <div className="mb-4">
              <label className="block mb-1">Archivo original</label>
              <input
                ref={verifyFileRef}
                type="file"
                onChange={(e) => setVerifyFile(e.target.files[0])}
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-pink-600 hover:file:bg-pink-700"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Archivo de firma (.sha256)</label>
              <input
                ref={verifySigRef}
                type="file"
                onChange={(e) => setVerifySig(e.target.files[0])}
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-pink-600 hover:file:bg-pink-700"
              />
            </div>
            <button
              onClick={handleVerify}
              className="w-full py-2 bg-pink-500 hover:bg-pink-700 text-white rounded-full"
            >
              Verificar Firma
            </button>
            {verifyResult && (
              <p className="mt-4 text-center text-lg font-bold text-white">
                {verifyResult}
              </p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
