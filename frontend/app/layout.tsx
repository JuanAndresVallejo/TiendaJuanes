import "../styles/globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsappButton from "../components/WhatsappButton";
import { ToastProvider } from "../components/ToastProvider";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Tienda Juanes",
  description: "Importadores de ropa americana para hombre y mujer"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${playfair.variable} ${manrope.variable} font-body`}>
        <ToastProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsappButton />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
