/* eslint-disable react/jsx-no-target-blank */
"use client";

import { useState } from "react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";

export default function WhatsappButton() {
  const message = encodeURIComponent("Hola, quiero más información sobre un producto.");
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-40">
      {open && (
        <div className="bg-white border border-sand rounded-2xl p-2 shadow-card flex flex-col gap-2">
          <a
            href="https://www.instagram.com/tiendajuanes"
            target="_blank"
            rel="noreferrer"
            className="bg-rose-500 text-white rounded-full w-11 h-11 flex items-center justify-center"
            aria-label="Instagram"
            title="Instagram"
          >
            <FaInstagram className="text-lg" />
          </a>
          <a
            href="https://www.tiktok.com/@tiendajuanes"
            target="_blank"
            rel="noreferrer"
            className="bg-ink text-cream rounded-full w-11 h-11 flex items-center justify-center"
            aria-label="TikTok"
            title="TikTok"
          >
            <FaTiktok className="text-lg" />
          </a>
          <a
            href={`https://wa.me/57XXXXXXXXXX?text=${message}`}
            target="_blank"
            rel="noreferrer"
            className="bg-green-500 text-white rounded-full w-11 h-11 flex items-center justify-center"
            aria-label="WhatsApp"
            title="WhatsApp"
          >
            <FaWhatsapp className="text-lg" />
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full bg-ink text-cream px-4 py-2 text-xs uppercase tracking-[0.2em] shadow-card"
      >
        Redes
      </button>

      <a
        href={`https://wa.me/57XXXXXXXXXX?text=${message}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-full bg-terracotta text-cream px-4 py-2 text-xs uppercase tracking-[0.2em] shadow-card"
      >
        Soporte
      </a>
    </div>
  );
}
