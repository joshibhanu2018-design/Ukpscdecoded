import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeft, CalendarCheck, Video } from "lucide-react";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { CANCEL_NOTICE_MS, formatSlotIST, getSetting, getSlots, getUserBookings, isMentee, istWeekStart } from "@/lib/mentorship";
import SlotPicker from "@/components/SlotPicker";
import CancelBookingButton from "@/components/CancelBookingButton";

export const metadata: Metadata = { title: "Mentorship", robots: { index: false } };

export default async function MentorshipPage() {
  const user = await getUserFromSession((await cookies()).get(SESSION_COOKIE_NAME)?.value);
  if (!user) redirect("/student/login?next=/test-platform/mentorship");
  if (!(await isMentee(user.id))) redirect("/courses");

  const now = Date.now();
  const [slots, bookings, meetLink] = await Promise.all([getSlots(now), getUserBookings(user.id), getSetting("mentor_meet_link")]);
  const upcoming = bookings.filter((b) => b.status === "booked" && new Date(b.slot_end).getTime() > now).reverse();
  const past = bookings.filter((b) => b.status !== "booked" || new Date(b.slot_end).getTime() <= now);

  // One booking per week: hide slots in weeks the student already has a session.
  const bookedWeeks = new Set(upcoming.map((b) => istWeekStart(new Date(b.slot_start).getTime())));
  const open = slots.filter((s) => !bookedWeeks.has(istWeekStart(new Date(s.start).getTime())));

  return (
    <div className="min-h-screen bg-graphite-950 px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/test-platform" className="mb-4 inline-flex items-center gap-1.5 text-sm text-graphite-300 hover:text-saffron-400">
          <ArrowLeft className="h-4 w-4" /> My Courses
        </Link>
        <h1 className="text-2xl font-bold text-white">
          Mentorship
        </h1>
        <p className="mt-1 text-sm text-graphite-300">
          One 20-minute 1-on-1 session per week — first come, first served.
        </p>

        {upcoming.length > 0 && (
          <section className="mt-6 space-y-3">
            {upcoming.map((b) => (
              <div key={b.id} className="rounded-2xl border border-success-500/30 bg-success-500/10 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-success-300">
                  <CalendarCheck className="h-4 w-4" /> Booked: {formatSlotIST(b.slot_start)}
                </p>
                {b.student_note && <p className="mt-1 text-xs text-graphite-300">Topic: {b.student_note}</p>}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  {meetLink ? (
                    <a
                      href={meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-saffron-400 px-4 py-2 text-sm font-bold text-graphite-900"
                    >
                      <Video className="h-4 w-4" /> Join session
                    </a>
                  ) : (
                    <span className="text-xs text-graphite-300">Joining link will appear here before the session.</span>
                  )}
                  {new Date(b.slot_start).getTime() - now > CANCEL_NOTICE_MS && <CancelBookingButton id={b.id} />}
                </div>
              </div>
            ))}
          </section>
        )}

        <section className="mt-8 rounded-2xl border border-graphite-800 bg-graphite-900/60 p-5">
          <h2 className="mb-4 font-semibold text-white">
            Pick a slot (next 2 weeks)
          </h2>
          <SlotPicker slots={open} />
          <p className="mt-4 text-[11px] text-graphite-300">
            <span className="block">
              Cancel up to 12 hours before. Before your session, review your{" "}
              <Link href="/test-platform/performance" className="underline">
                performance page
              </Link>{" "}
              — that&apos;s what we&apos;ll discuss.
            </span>
          </p>
        </section>

        {past.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 font-semibold text-white">
              Past sessions & plans
            </h2>
            <ul className="space-y-3">
              {past.map((b) => (
                <li key={b.id} className="rounded-2xl border border-graphite-800 bg-graphite-900/60 p-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-graphite-300">{formatSlotIST(b.slot_start)}</span>
                    <span className="text-xs capitalize text-graphite-300">{b.status.replace("_", "-")}</span>
                  </div>
                  {b.mentor_notes && (
                    <div className="mt-2 whitespace-pre-line rounded-lg bg-graphite-800/60 p-3 text-graphite-200">
                      <span className="mb-1 block text-xs font-semibold text-saffron-400">Your plan</span>
                      {b.mentor_notes}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
