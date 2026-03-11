import { FaWhatsapp } from "react-icons/fa";

export default function WhatsappButton() {
  const message = encodeURIComponent("Hola, quiero más información sobre un producto.");
  return (
    <a
      href={`https://wa.me/57XXXXXXXXXX?text=${message}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-card"
      aria-label="WhatsApp"
      title="WhatsApp"
    >
      <FaWhatsapp className="text-2xl" />
    </a>
  );
}
