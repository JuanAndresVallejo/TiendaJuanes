/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProductGallery({ images }: { images: string[] }) {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
      }
      if (event.key === "ArrowRight") {
        setSelected((prev) => (prev + 1) % images.length);
      }
      if (event.key === "ArrowLeft") {
        setSelected((prev) => (prev - 1 + images.length) % images.length);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expanded, images.length]);

  if (images.length === 0) {
    return (
      <div className="w-full aspect-[4/5] bg-sand/70 rounded-3xl flex items-center justify-center">
        Sin imagen
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="aspect-[4/5] bg-sand/60 rounded-3xl overflow-hidden relative text-left"
        aria-label="Ampliar imagen de producto"
      >
        <Image
          src={images[selected]}
          alt="Producto"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </button>
      <div className="grid grid-cols-3 gap-3">
        {images.slice(0, 6).map((url, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelected(index)}
            className={`aspect-square bg-sand/60 rounded-2xl overflow-hidden relative border ${selected === index ? "border-ink" : "border-transparent"}`}
            aria-label={`Ver imagen ${index + 1}`}
          >
            <Image src={url} alt={`Producto ${index + 1}`} fill className="object-cover" sizes="100px" />
          </button>
        ))}
      </div>
      {expanded && (
        <div
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Visor ampliado de imágenes"
          onClick={() => setExpanded(false)}
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={images[selected]} alt={`Producto ${selected + 1}`} className="w-full max-h-[85vh] object-contain rounded-2xl" />
            <button
              type="button"
              onClick={() => setSelected((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-ink/80 text-cream w-10 h-10"
              aria-label="Imagen anterior"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setSelected((prev) => (prev + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-ink/80 text-cream w-10 h-10"
              aria-label="Imagen siguiente"
            >
              ›
            </button>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="absolute top-3 right-3 rounded-full bg-ink/80 text-cream px-3 py-1 text-xs uppercase tracking-[0.2em]"
            >
              Cerrar
            </button>
            <div className="mt-3 grid grid-cols-4 md:grid-cols-6 gap-2">
              {images.slice(0, 6).map((url, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelected(index)}
                  className={`aspect-square rounded-lg overflow-hidden border ${selected === index ? "border-cream" : "border-transparent"}`}
                  aria-label={`Seleccionar imagen ${index + 1}`}
                >
                  <img src={url} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-cream/80">Usa flechas izquierda/derecha para navegar y `Esc` para cerrar.</p>
          </div>
        </div>
      )}
    </div>
  );
}
