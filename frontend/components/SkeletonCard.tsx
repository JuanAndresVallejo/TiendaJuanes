export default function SkeletonCard() {
  return (
    <div className="bg-white/60 rounded-3xl overflow-hidden border border-sand animate-pulse">
      <div className="aspect-[4/5] bg-sand/60" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-sand/60 rounded" />
        <div className="h-3 bg-sand/40 rounded w-3/4" />
        <div className="h-3 bg-sand/40 rounded w-1/2" />
        <div className="h-8 bg-sand/50 rounded-full" />
      </div>
    </div>
  );
}
