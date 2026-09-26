/** Shared layout for Terms / Privacy / Refund / Contact — same look as the existing Terms page. */
export default function LegalPage({
  title,
  updated = "September 2026",
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="heading-lg mb-2 text-graphite-900">
        {title}
      </h1>
      <p className="mb-10 text-sm text-graphite-500">Last updated: {updated}</p>
      <div className="space-y-8 text-sm leading-relaxed text-graphite-700 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-graphite-900 [&_a]:text-saffron-600 [&_a]:underline [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}
