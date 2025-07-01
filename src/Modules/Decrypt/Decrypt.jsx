import React, { useState, useRef } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";
import { message } from "antd";

export default function Decrypt() {
  const [zipFile, setZipFile] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const zipRef = useRef(null);
  const keyRef = useRef(null);

  const handleDecrypt = async () => {
    if (!zipFile || !privateKey) {
      message.warning("Selecciona ambos archivos");
      return;
    }

    const formData = new FormData();
    formData.append("zip_file", zipFile);
    formData.append("private_key", privateKey);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/decrypt-document/",
        formData,
        { responseType: "blob" }
      );

      const contentDisposition = res.headers["content-disposition"];
      const match =
        contentDisposition &&
        contentDisposition.match(/filename\*?=(?:UTF-8'')?["']?([^;"']+)/i);
      const filename = match
        ? decodeURIComponent(match[1])
        : "decrypted_document.docx";

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      message.success("Documento desencriptado con éxito");

      setZipFile(null);
      setPrivateKey(null);
      if (zipRef.current) zipRef.current.value = "";
      if (keyRef.current) keyRef.current.value = "";
    } catch (error) {
      console.error("Error al desencriptar:", error);
      message.error("Fallo al desencriptar el documento");
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-black text-white font-mono overflow-hidden">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-start p-8 gap-8 mt-10">
        <div className="w-[750px] p-8 border-2 border-pink-500 shadow-[0_0_25px_#ff2770] bg-[#25252b] rounded-2xl">
          <h2 className="text-3xl text-center mb-6 text-pink-500">
            Desencriptar Documento
          </h2>

          <div className="mb-4">
            <label className="block mb-1">Archivo ZIP seguro</label>
            <input
              ref={zipRef}
              type="file"
              onChange={(e) => setZipFile(e.target.files[0])}
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-pink-600 hover:file:bg-pink-700"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Clave privada (.pem)</label>
            <input
              ref={keyRef}
              type="file"
              onChange={(e) => setPrivateKey(e.target.files[0])}
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-pink-600 hover:file:bg-pink-700"
            />
          </div>

          <button
            onClick={handleDecrypt}
            className="w-full py-2 bg-pink-500 hover:bg-pink-700 text-white rounded-full"
          >
            Desencriptar Documento
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
