export default function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-xl font-bold text-white sm:text-2xl">{title}</h2>
      {sub && <p className="mt-1 text-sm text-graphite-300">{sub}</p>}
    </div>
  );
}
