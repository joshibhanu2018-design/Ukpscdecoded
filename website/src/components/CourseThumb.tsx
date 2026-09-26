/** Course image, or the brand gradient when a package has no image_url yet. */
export default function CourseThumb({ src, alt, className = "" }: { src: string | null; alt: string; className?: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- admin-supplied URL from any host; next/image would need every host allow-listed
    return <img src={src} alt={alt} loading="lazy" decoding="async" className={`object-cover ${className}`} />;
  }
  return (
    <div
      aria-hidden
      className={className}
      style={{ background: "linear-gradient(135deg, #f59307, #78300d)" }}
    />
  );
}
