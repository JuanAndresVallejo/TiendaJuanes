"use client";

import { FormEvent, useEffect, useState } from "react";
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { show } = useToast();

  const load = async () => {
    const data = await getBanners();
    setBanners(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!form.title.trim() || !form.subtitle.trim()) {
      show("Título y subtítulo son obligatorios", "error");
      return;
    }
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
        <form className="bg-white/70 border border-sand rounded-2xl p-4 grid gap-3" onSubmit={handleCreate}>
          <p className="text-sm text-ink/70">Completa título y subtítulo. Puedes previsualizar antes de crear.</p>
          <input
            placeholder="Titulo"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-xl border border-sand bg-white/80 px-4 py-2"
            aria-label="Título del banner"
          />
          <input
            placeholder="Subtitulo"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            className="rounded-xl border border-sand bg-white/80 px-4 py-2"
            aria-label="Subtítulo del banner"
          />
          <input
            placeholder="Link (opcional)"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            className="rounded-xl border border-sand bg-white/80 px-4 py-2"
            aria-label="Link del banner (opcional)"
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
            type="submit"
            disabled={loading}
            className="rounded-full bg-terracotta text-cream px-6 py-3 uppercase tracking-[0.2em] text-xs"
          >
            {loading ? "Guardando..." : "Crear banner"}
          </button>
          <div className="mt-2 rounded-2xl bg-ink text-cream p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-cream/70">Previsualización</p>
            <h3 className="font-display text-2xl mt-2">{form.title || "Título del banner"}</h3>
            <p className="mt-2 text-cream/80">{form.subtitle || "Subtítulo del banner"}</p>
            {form.link && (
              <a href={form.link} className="inline-block mt-4 rounded-full bg-cream text-ink px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Ver promo
              </a>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white/70 border border-sand rounded-2xl p-4 grid gap-3">
            {editingId === banner.id ? (
              <>
                <input
                  value={banner.title}
                  onChange={(e) => setBanners((prev) => prev.map((b) => b.id === banner.id ? { ...b, title: e.target.value } : b))}
                  className="rounded-xl border border-sand bg-white/80 px-4 py-2"
                  aria-label={`Título del banner ${banner.id}`}
                />
                <input
                  value={banner.subtitle}
                  onChange={(e) => setBanners((prev) => prev.map((b) => b.id === banner.id ? { ...b, subtitle: e.target.value } : b))}
                  className="rounded-xl border border-sand bg-white/80 px-4 py-2"
                  aria-label={`Subtítulo del banner ${banner.id}`}
                />
                <input
                  value={banner.link || ""}
                  onChange={(e) => setBanners((prev) => prev.map((b) => b.id === banner.id ? { ...b, link: e.target.value } : b))}
                  className="rounded-xl border border-sand bg-white/80 px-4 py-2"
                  aria-label={`Link del banner ${banner.id}`}
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
                    aria-label={`Guardar banner ${banner.id}`}
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="rounded-full border border-sand px-4 py-2 uppercase tracking-[0.2em] text-xs"
                    aria-label="Cancelar edición de banner"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(banner.id)}
                    className="text-terracotta uppercase tracking-[0.2em] text-xs"
                    aria-label={`Eliminar banner ${banner.id}`}
                  >
                    Eliminar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-2xl bg-ink text-cream p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-cream/70">{banner.active ? "Activo" : "Inactivo"}</p>
                  <h3 className="font-display text-2xl mt-2">{banner.title}</h3>
                  <p className="mt-2 text-cream/80">{banner.subtitle}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingId(banner.id)}
                    className="rounded-full border border-ink px-4 py-2 uppercase tracking-[0.2em] text-xs"
                    aria-label={`Editar banner ${banner.id}`}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(banner.id)}
                    className="text-terracotta uppercase tracking-[0.2em] text-xs"
                    aria-label={`Eliminar banner ${banner.id}`}
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {banners.length === 0 && <p>No hay banners creados.</p>}
      </div>
    </div>
  );
}
