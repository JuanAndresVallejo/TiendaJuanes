"use client";

import { useEffect, useState } from "react";
import { createBanner, deleteBanner, getBanners, updateBanner } from "../../../services/admin";
import { useToast } from "../../../components/ToastProvider";

type Banner = {
  id: number;
  title: string;
  subtitle: string;
  link?: string | null;
  active: boolean;
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [form, setForm] = useState({ title: "", subtitle: "", link: "", active: true });
  const [loading, setLoading] = useState(false);
  const { show } = useToast();

  const load = async () => {
    const data = await getBanners();
    setBanners(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    try {
      setLoading(true);
      await createBanner({
        title: form.title,
        subtitle: form.subtitle,
        link: form.link || undefined,
        active: form.active
      });
      setForm({ title: "", subtitle: "", link: "", active: true });
      await load();
      show("Banner creado");
    } catch {
      show("No se pudo crear el banner", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (banner: Banner) => {
    try {
      await updateBanner(banner.id, {
        title: banner.title,
        subtitle: banner.subtitle,
        link: banner.link || undefined,
        active: banner.active
      });
      show("Banner actualizado");
    } catch {
      show("No se pudo actualizar el banner", "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBanner(id);
      await load();
      show("Banner eliminado");
    } catch {
      show("No se pudo eliminar el banner", "error");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl mb-4">Banners promocionales</h2>
        <div className="bg-white/70 border border-sand rounded-2xl p-4 grid gap-3">
          <input
            placeholder="Titulo"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-xl border border-sand bg-white/80 px-4 py-2"
          />
          <input
            placeholder="Subtitulo"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            className="rounded-xl border border-sand bg-white/80 px-4 py-2"
          />
          <input
            placeholder="Link (opcional)"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            className="rounded-xl border border-sand bg-white/80 px-4 py-2"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Activo
          </label>
          <button
            type="button"
            onClick={handleCreate}
            disabled={loading}
            className="rounded-full bg-terracotta text-cream px-6 py-3 uppercase tracking-[0.2em] text-xs"
          >
            {loading ? "Guardando..." : "Crear banner"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white/70 border border-sand rounded-2xl p-4 grid gap-3">
            <input
              value={banner.title}
              onChange={(e) => setBanners((prev) => prev.map((b) => b.id === banner.id ? { ...b, title: e.target.value } : b))}
              className="rounded-xl border border-sand bg-white/80 px-4 py-2"
            />
            <input
              value={banner.subtitle}
              onChange={(e) => setBanners((prev) => prev.map((b) => b.id === banner.id ? { ...b, subtitle: e.target.value } : b))}
              className="rounded-xl border border-sand bg-white/80 px-4 py-2"
            />
            <input
              value={banner.link || ""}
              onChange={(e) => setBanners((prev) => prev.map((b) => b.id === banner.id ? { ...b, link: e.target.value } : b))}
              className="rounded-xl border border-sand bg-white/80 px-4 py-2"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={banner.active}
                onChange={(e) => setBanners((prev) => prev.map((b) => b.id === banner.id ? { ...b, active: e.target.checked } : b))}
              />
              Activo
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleUpdate(banner)}
                className="rounded-full border border-ink px-4 py-2 uppercase tracking-[0.2em] text-xs"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => handleDelete(banner.id)}
                className="text-terracotta uppercase tracking-[0.2em] text-xs"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {banners.length === 0 && <p>No hay banners creados.</p>}
      </div>
    </div>
  );
}
