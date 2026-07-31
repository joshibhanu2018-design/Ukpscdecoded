import Link from "next/link";
import { BookOpen, ArrowRight, Star, BookMarked, Video, Send } from "lucide-react";
import { getIcon } from "@/lib/icons";
import home from "@content/home.json";

export default function Home() {
  const { hero, stats, features, bookPreview, testimonials, finalCta } = home;

  return (
    <div>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-graphite-950 via-graphite-900 to-graphite-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(245,147,7,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(23,180,122,0.08),transparent_50%)]" />
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-xl text-white mb-6">
              {hero.headingLine1}{" "}
              <span className="text-saffron-400">{hero.headingLine2}</span>
            </h1>
            <p className="text-lg md:text-xl text-graphite-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              {hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href={hero.primaryButtonLink}
                className="btn-primary inline-flex items-center justify-center gap-2 text-lg"
              >
                {hero.primaryButtonText}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href={hero.secondaryButtonLink}
                className="btn-secondary inline-flex items-center justify-center gap-2 text-lg"
              >
                {hero.secondaryButtonText}
                <BookMarked className="w-5 h-5" />
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              {stats.map((stat) => {
                const Icon = getIcon(stat.icon);
                return (
                  <div key={stat.label} className="text-center">
                    <Icon className="w-6 h-6 text-saffron-400 mx-auto mb-2" />
                    <div className="text-2xl md:text-3xl font-display font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-graphite-400">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-ivory-50">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="heading-lg text-graphite-900 mb-4">
              {features.headingLine1}{" "}
              <span className="text-jade-600">{features.headingLine2}</span>
            </h2>
            <p className="text-graphite-600 text-lg max-w-2xl mx-auto">
              {features.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.items.map((feature) => {
              const Icon = getIcon(feature.icon);
              return (
                <div
                  key={feature.title}
                  className="card p-8 bg-white border border-graphite-100 hover:border-saffron-200 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-saffron-50 flex items-center justify-center mb-5 group-hover:bg-saffron-100 transition-colors">
                    <Icon className="w-7 h-7 text-saffron-600" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-graphite-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-graphite-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Book Preview Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Book Details */}
            <div>
              <span className="inline-block bg-jade-50 text-jade-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                {bookPreview.badge}
              </span>
              <h2 className="heading-lg text-graphite-900 mb-6">
                {bookPreview.headingLine1}{" "}
                <span className="text-saffron-500">{bookPreview.headingLine2}</span>
              </h2>
              <p className="text-graphite-600 text-lg mb-8 leading-relaxed">
                {bookPreview.description}
              </p>
              <div className="mb-8">
                <h4 className="font-display font-semibold text-graphite-800 mb-4">
                  {bookPreview.tocHeading}
                </h4>
                <ul className="space-y-2">
                  {bookPreview.chapters.map((chapter, i) => (
                    <li
                      key={chapter}
                      className="flex items-center gap-3 text-graphite-700"
                    >
                      <span className="w-6 h-6 rounded-full bg-saffron-100 text-saffron-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      {chapter}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-graphite-500 mt-3 ml-9">
                  {bookPreview.moreChaptersNote}
                </p>
              </div>
              <Link href="/buy-book" className="btn-primary inline-flex items-center gap-2">
                {bookPreview.buttonText}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Right - Book Cover */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-72 h-96 md:w-80 md:h-[28rem] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-saffron-500 via-saffron-600 to-graphite-900" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">
                    {bookPreview.coverTitle}
                  </h3>
                  <p className="text-white/80 text-sm mb-4">
                    {bookPreview.coverSubtitle}
                  </p>
                  <div className="w-16 h-0.5 bg-white/30 mb-4" />
                  <p className="text-white/60 text-xs">{bookPreview.coverFooter}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-graphite-50">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="heading-lg text-graphite-900 mb-4">
              {testimonials.headingLine1}{" "}
              <span className="text-jade-600">{testimonials.headingLine2}</span>
            </h2>
            <p className="text-graphite-600 text-lg max-w-2xl mx-auto">
              {testimonials.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.items.map((testimonial) => (
              <div
                key={testimonial.name}
                className="card p-8 bg-white border border-graphite-100"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-saffron-400 fill-saffron-400"
                    />
                  ))}
                </div>
                <p className="text-graphite-700 leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="border-t border-graphite-100 pt-4">
                  <p className="font-display font-semibold text-graphite-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-graphite-500">{testimonial.exam}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-padding bg-gradient-to-br from-jade-700 via-jade-600 to-jade-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]" />
        <div className="container-custom relative z-10 text-center">
          <h2 className="heading-lg text-white mb-6">{finalCta.heading}</h2>
          <p className="text-jade-100 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            {finalCta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={finalCta.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2 text-lg"
            >
              <Send className="w-5 h-5" />
              {finalCta.telegramText}
            </a>
            <a
              href={finalCta.youtubeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-lg bg-white text-graphite-900 font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:bg-graphite-50"
            >
              <Video className="w-5 h-5 text-red-600" />
              {finalCta.youtubeText}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
