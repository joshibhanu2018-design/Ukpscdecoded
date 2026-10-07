/**
 * Shown only inside the Android app (see `.app-only` in globals.css), in
 * place of Buy buttons: Google Play doesn't allow buying or pointing to
 * outside payment there, so the app only opens what a student already owns.
 */
export default function AppPurchaseNote({ className = "" }: { className?: string }) {
  return (
    <p
      className={`app-only rounded-lg border border-graphite-700 bg-graphite-800 px-4 py-2.5 text-center text-xs leading-relaxed text-graphite-200 ${className}`}
    >
      Purchases aren&apos;t available in the app. Courses you already have are in My Courses.
    </p>
  );
}
