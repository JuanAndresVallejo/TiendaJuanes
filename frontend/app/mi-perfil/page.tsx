"use client";

import { useEffect, useState } from "react";
import { getMyProfile, UserProfile } from "../../services/profile";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProfile()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl">Mi perfil</h1>
      {loading ? (
        <p className="mt-6">Cargando perfil...</p>
      ) : profile ? (
        <div className="mt-8 bg-white/70 border border-sand rounded-3xl p-6 grid gap-4 text-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Nombre</p>
            <p className="mt-1">{profile.fullName}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Correo</p>
            <p className="mt-1">{profile.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Celular</p>
            <p className="mt-1">{profile.phone}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Documento</p>
            <p className="mt-1">{profile.documentId}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Direccion</p>
            <p className="mt-1">{profile.department} - {profile.city}</p>
            <p className="text-ink/70">{profile.addressLine}</p>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-terracotta">No se pudo cargar tu perfil.</p>
      )}
    </section>
  );
}
