"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "../../../services/admin";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then((data) => {
        setStats(data);
        setError(null);
      })
      .catch(() => {
        setStats(null);
        setError("No se pudieron cargar las metricas");
      });
  }, []);

  if (!stats) {
    return <p className="text-terracotta">{error || "Cargando metricas..."}</p>;
  }

  const salesByDay = {
    labels: stats.salesByDay.map((p: any) => p.label),
    datasets: [
      {
        label: "Ventas por dia",
        data: stats.salesByDay.map((p: any) => p.value),
        borderColor: "#C65D3A",
        backgroundColor: "rgba(198, 93, 58, 0.2)"
      }
    ]
  };

  const salesByMonth = {
    labels: stats.salesByMonth.map((p: any) => p.label),
    datasets: [
      {
        label: "Ventas por mes",
        data: stats.salesByMonth.map((p: any) => p.value),
        backgroundColor: "#7A7F4F"
      }
    ]
  };

  const topProducts = {
    labels: stats.topProducts.map((p: any) => p.label),
    datasets: [
      {
        label: "Productos mas vendidos",
        data: stats.topProducts.map((p: any) => p.value),
        backgroundColor: "#1F1C17"
      }
    ]
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-5">
        <div className="bg-white/70 border border-sand rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.2em]">Ventas hoy</p>
          <p className="text-xl font-semibold">${stats.salesToday.toLocaleString("es-CO")}</p>
        </div>
        <div className="bg-white/70 border border-sand rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.2em]">Ventas del mes</p>
          <p className="text-xl font-semibold">${stats.salesMonth.toLocaleString("es-CO")}</p>
        </div>
        <div className="bg-white/70 border border-sand rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.2em]">Pedidos</p>
          <p className="text-xl font-semibold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white/70 border border-sand rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.2em]">Productos vendidos</p>
          <p className="text-xl font-semibold">{stats.productsSold}</p>
        </div>
        <div className="bg-white/70 border border-sand rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.2em]">Clientes</p>
          <p className="text-xl font-semibold">{stats.totalCustomers}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white/70 border border-sand rounded-2xl p-4" role="region" aria-label="Gráfica de ventas por día">
          <h3 className="text-sm uppercase tracking-[0.2em] text-ink/60 mb-3">Ventas por día</h3>
          <Line data={salesByDay} />
        </div>
        <div className="bg-white/70 border border-sand rounded-2xl p-4" role="region" aria-label="Gráfica de ventas por mes">
          <h3 className="text-sm uppercase tracking-[0.2em] text-ink/60 mb-3">Ventas por mes</h3>
          <Bar data={salesByMonth} />
        </div>
      </div>

      <div className="bg-white/70 border border-sand rounded-2xl p-4" role="region" aria-label="Gráfica de productos más vendidos">
        <h3 className="text-sm uppercase tracking-[0.2em] text-ink/60 mb-3">Productos más vendidos</h3>
        <Bar data={topProducts} />
      </div>
    </div>
  );
}
