import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "http://localhost:8088";
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/productos`, lastModified: new Date() },
    { url: `${base}/carrito`, lastModified: new Date() },
    { url: `${base}/checkout`, lastModified: new Date() },
    { url: `${base}/login`, lastModified: new Date() },
    { url: `${base}/registro`, lastModified: new Date() }
  ];
}
