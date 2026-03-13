import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";

export default function WhatsappButton() {
  const message = encodeURIComponent("Hola, quiero más información sobre un producto.");
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3">
      <a
        href="https://www.instagram.com/tiendajuanes"
        target="_blank"
        rel="noreferrer"
        className="bg-rose-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-card"
        aria-label="Instagram"
        title="Instagram"
      >
        <FaInstagram className="text-xl" />
      </a>
      <a
        href="https://www.tiktok.com/@tiendajuanes"
        target="_blank"
        rel="noreferrer"
        className="bg-ink text-cream rounded-full w-12 h-12 flex items-center justify-center shadow-card"
        aria-label="TikTok"
        title="TikTok"
      >
        <FaTiktok className="text-xl" />
      </a>
      <a
        href={`https://wa.me/57XXXXXXXXXX?text=${message}`}
        target="_blank"
        rel="noreferrer"
        className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-card"
        aria-label="WhatsApp"
        title="WhatsApp"
      >
        <FaWhatsapp className="text-xl" />
      </a>
    </div>
  );
}
