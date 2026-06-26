/**
 * DroneStream.tsx — exibe o stream de vídeo de um gateway/drone.
 * Conecta no WebSocket de "watch" do backend e desenha cada frame JPEG recebido.
 *
 * O gateway empurra os frames ao backend, o backend repassa. O frontend só
 * recebe, nunca fala com o gateway direto.
 *
 * Uso:
 *   <DroneStream gatewayId="7" apiBaseUrl={import.meta.env.VITE_API_BASE_URL} />
 */
import { useEffect, useRef, useState } from "react";

interface DroneStreamProps {
  gatewayId: string;
  apiBaseUrl?: string; // ex: https://backend-render-l4u0.onrender.com
}

type Status = "conectando" | "ativo" | "sem_sinal" | "erro";

export default function DroneStream({ gatewayId, apiBaseUrl }: DroneStreamProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [status, setStatus] = useState<Status>(apiBaseUrl ? "conectando" : "sem_sinal");

  useEffect(() => {
    // Sem URL do backend (ex.: VITE_API_BASE_URL ausente) não há stream a abrir.
    // Mantém o container vazio (com "Sem sinal"), em vez de quebrar a página.
    if (!apiBaseUrl) return;
    // http(s) → ws(s)
    const wsBase = apiBaseUrl.replace("https://", "wss://").replace("http://", "ws://").replace(/\/$/, "");
    const url = `${wsBase}/stream/gateway/${gatewayId}/watch`;

    let ws: WebSocket | null = null;
    let urlObjetoAtual: string | null = null;
    let fechado = false;

    function conectar() {
      ws = new WebSocket(url);
      ws.binaryType = "blob";

      ws.onopen = () => setStatus("ativo");

      ws.onmessage = (ev) => {
        const blob = ev.data as Blob;
        const novaUrl = URL.createObjectURL(blob);
        if (imgRef.current) imgRef.current.src = novaUrl;
        // libera o frame anterior da memória
        if (urlObjetoAtual) URL.revokeObjectURL(urlObjetoAtual);
        urlObjetoAtual = novaUrl;
        setStatus("ativo");
      };

      ws.onerror = () => setStatus("erro");

      ws.onclose = () => {
        if (fechado) return;
        setStatus("sem_sinal");
        // tenta reconectar em 2s
        setTimeout(() => { if (!fechado) conectar(); }, 2000);
      };
    }

    conectar();

    return () => {
      fechado = true;
      if (ws) ws.close();
      if (urlObjetoAtual) URL.revokeObjectURL(urlObjetoAtual);
    };
  }, [gatewayId, apiBaseUrl]);

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3", background: "#0a0a0a", borderRadius: 12, overflow: "hidden" }}>
      <img
        ref={imgRef}
        alt={`Stream do drone ${gatewayId}`}
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
      />
      {status !== "ativo" && (
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
          color: "#fff", background: "rgba(0,0,0,0.5)", fontSize: 14,
        }}>
          {status === "conectando" && "Conectando ao drone..."}
          {status === "sem_sinal" && "Sem sinal de vídeo"}
          {status === "erro" && "Erro na conexão"}
        </div>
      )}
      <div style={{
        position: "absolute", top: 8, left: 8, display: "flex", alignItems: "center", gap: 6,
        background: "rgba(0,0,0,0.6)", padding: "4px 8px", borderRadius: 6,
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: "50%",
          background: status === "ativo" ? "#22c55e" : "#ef4444",
        }} />
        <span style={{ color: "#fff", fontSize: 12 }}>
          {status === "ativo" ? "AO VIVO" : "OFFLINE"}
        </span>
      </div>
    </div>
  );
}