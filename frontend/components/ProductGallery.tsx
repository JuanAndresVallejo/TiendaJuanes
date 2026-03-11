import Image from "next/image";

export default function ProductGallery({ images }: { images: string[] }) {
  if (images.length === 0) {
    return (
      <div className="w-full aspect-[4/5] bg-sand/70 rounded-3xl flex items-center justify-center">
        Sin imagen
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="aspect-[4/5] bg-sand/60 rounded-3xl overflow-hidden relative">
        <Image src={images[0]} alt="Producto" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {images.slice(1, 4).map((url, index) => (
            <div key={index} className="aspect-square bg-sand/60 rounded-2xl overflow-hidden relative">
              <Image src={url} alt={`Producto ${index + 2}`} fill className="object-cover" sizes="100px" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
