"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "../services/api";

type ServiceStatus = "UP" | "DOWN" | "UNKNOWN";

type HealthResponse = {
  backend: ServiceStatus;
  api: ServiceStatus;
  postgres: ServiceStatus;
  redis: ServiceStatus;
  nginx: ServiceStatus;
  mercadopago: ServiceStatus;
  smtp: ServiceStatus;
  timestamp: string;
};

const defaultStatus: HealthResponse = {
  backend: "UNKNOWN",
  api: "UNKNOWN",
  postgres: "UNKNOWN",
  redis: "UNKNOWN",
  nginx: "UNKNOWN",
  mercadopago: "UNKNOWN",
  smtp: "UNKNOWN",
  timestamp: ""
};

function StatusPill({ label, status }: { label: string; status: ServiceStatus }) {
  const color =
    status === "UP" ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/40"
      : status === "DOWN" ? "bg-red-500/20 text-red-200 border-red-400/40"
        : "bg-slate-500/20 text-slate-200 border-slate-400/40";
  return (
    <div className={`px-3 py-2 rounded-full border text-xs uppercase tracking-[0.2em] ${color}`}>
      {label}: {status}
    </div>
  );
}

export default function DevStatusBar() {
  const [status, setStatus] = useState<HealthResponse>(defaultStatus);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch(apiUrl("/health"), { cache: "no-store" });
        if (!res.ok) throw new Error("Health failed");
        const data = (await res.json()) as HealthResponse;
        if (active) setStatus(data);
      } catch {
        if (active) {
          setStatus({
            backend: "DOWN",
            api: "DOWN",
            postgres: "UNKNOWN",
            redis: "UNKNOWN",
            nginx: "UNKNOWN",
            mercadopago: "UNKNOWN",
            smtp: "UNKNOWN",
            timestamp: new Date().toISOString()
          });
        }
      }
    };

    load();
    const id = setInterval(load, 10000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="bg-ink/95 border-t border-cream/10">
      <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center gap-2 text-cream">
        <span className="text-xs uppercase tracking-[0.3em] text-cream/70">Estado desarrollo</span>
        <StatusPill label="Frontend" status="UP" />
        <StatusPill label="API" status={status.api} />
        <StatusPill label="Backend" status={status.backend} />
        <StatusPill label="Postgres" status={status.postgres} />
        <StatusPill label="Redis" status={status.redis} />
        <StatusPill label="Nginx" status={status.nginx} />
        <StatusPill label="MercadoPago" status={status.mercadopago} />
        <StatusPill label="SMTP" status={status.smtp} />
      </div>
    </div>
  );
}
