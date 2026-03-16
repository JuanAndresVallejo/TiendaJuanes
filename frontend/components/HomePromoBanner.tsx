"use client";

import { useEffect, useState } from "react";
import { getActiveBanners, Banner } from "../services/banners";

export default function HomePromoBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    getActiveBanners()
      .then((data) => setBanner(data[0] || null))
      .catch(() => setBanner(null));
  }, []);

  if (!banner) return null;

  return (
    <section className="mt-14 bg-ink text-cream rounded-[32px] p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-cream/70">Promoción</p>
        <h2 className="font-display text-2xl mt-2">{banner.title}</h2>
        <p className="text-cream/70 mt-2">{banner.subtitle}</p>
      </div>
      {banner.link && (
        <a
          href={banner.link}
          className="rounded-full bg-cream text-ink px-6 py-3 uppercase tracking-[0.2em] text-xs"
        >
          Ver promo
        </a>
      )}
    </section>
  );
}
