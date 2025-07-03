import React from "react";

export default function TablaLogs({ logs }) {
  return (
    <div className="overflow-x-auto text-sm">
      {logs.length === 0 ? (
        <p className="text-neutral-400">No se han detectado eventos aún.</p>
      ) : (
        <>
          <table className="table-auto w-full border border-neutral-800 text-left">
            <thead className="bg-neutral-800 text-neutral-300">
              <tr>
                <th className="px-4 py-2">Hora</th>
                <th className="px-4 py-2">Clasificación</th>
                <th className="px-4 py-2">Prioridad</th>
                <th className="px-4 py-2">Protocolo</th>
                <th className="px-4 py-2">Origen</th>
                <th className="px-4 py-2">Destino</th>
                <th className="px-4 py-2">Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                <tr
                  key={idx}
                  className="border-t border-neutral-800 hover:bg-neutral-900"
                >
                  <td className="px-4 py-2 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {log.classification}
                  </td>
                  <td className="px-4 py-2">{log.priority}</td>
                  <td className="px-4 py-2">{log.protocol}</td>
                  <td className="px-4 py-2">
                    {log.src_ip}
                    {log.src_port && `:${log.src_port}`}
                  </td>
                  <td className="px-4 py-2">
                    {log.dst_ip}
                    {log.dst_port && `:${log.dst_port}`}
                  </td>
                  <td className="px-4 py-2">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* DEBUG opcional */}
          <pre className="text-xs text-neutral-400 mt-4 bg-neutral-900 p-2 rounded max-h-64 overflow-y-auto">
            {JSON.stringify(logs, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}
