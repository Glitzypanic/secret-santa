"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResultadoPage() {
  const sp = useSearchParams();
  const token = sp.get("token");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [receiver, setReceiver] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      setReceiver(null);
      if (!token) {
        setError("Missing token");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `/api/resultado?token=${encodeURIComponent(token)}`
        );
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json.error || "server_error");
        }
        const json = await res.json();
        if (mounted) setReceiver(json.receiver);
      } catch (e) {
        if (mounted) setError(e.message || String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [token]);

  if (loading) return <div className="p-6">Cargando...</div>;
  if (error)
    return <div className="p-6 text-red-600">Error: {String(error)}</div>;
  if (!receiver)
    return <div className="p-6 text-red-600">No se encontró asignación</div>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tu amigo secreto</h1>
      <p className="mb-2">
        Te ha tocado regalar a: <strong>{receiver.name}</strong>
      </p>
      <div className="mt-4">
        <h3 className="font-semibold">Ideas / regalos deseados</h3>
        <ul className="list-disc pl-6">
          <li>{receiver.gift_1 || "—"}</li>
          <li>{receiver.gift_2 || "—"}</li>
          <li>{receiver.gift_3 || "—"}</li>
        </ul>
      </div>
    </main>
  );
}
