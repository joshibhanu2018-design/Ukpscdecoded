import { Metadata } from "next";
import Link from "next/link";
import { getAllArticles, getCategories } from "@/lib/articles";
import { FileText, Calendar, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Articles — UKPSC Preparation Strategy & Guides",
  description:
    "In-depth UKPSC preparation articles — strategy, answer writing, book lists, PYQ analysis, and current affairs guides for Prelims & Mains.",
  keywords: [
    "UKPSC preparation",
    "UKPSC strategy",
    "UKPSC answer writing",
    "UKPSC book list",
    "UKPSC syllabus",
    "UKPSC PYQ analysis",
    "UKPSC current affairs",
    "Uttarakhand GK",
    "UKPSC mains preparation",
    "how to prepare for UKPSC GS5 GS6",
    "Uttarakhand special paper",
    "Uttarakhand essay",
    "how to make notes for UKPSC",
  ],
};


const categoryColors: Record<string, string> = {
  Strategy: "bg-saffron-100 text-saffron-700",
  "Answer Writing": "bg-jade-100 text-jade-700",
  "Book List": "bg-purple-100 text-purple-700",
  "PYQ Analysis": "bg-blue-100 text-blue-700",
  "Current Affairs": "bg-rose-100 text-rose-700",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category || "All";
  const allArticles = getAllArticles();
  const categories = getCategories();

  const filteredArticles =
    activeCategory === "All"
      ? allArticles
      : allArticles.filter((a) => a.category === activeCategory);

  return (
    <div>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-graphite-950 via-graphite-900 to-graphite-800 text-white">
        <div className="container-custom text-center">
          <h1 className="heading-xl text-white mb-4">
            UKPSC Preparation{" "}
            <span className="text-saffron-400">Articles</span>
          </h1>
          <p className="text-lg text-graphite-300 max-w-2xl mx-auto">
            In-depth strategy guides, answer-writing frameworks, book
            recommendations, and syllabus analysis — everything you need
            to crack UKPSC from one place.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-graphite-100 sticky top-16 z-40">
        <div className="container-custom py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/articles"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === "All"
                  ? "bg-graphite-900 text-white"
                  : "bg-graphite-100 text-graphite-600 hover:bg-graphite-200"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/articles?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-graphite-900 text-white"
                    : "bg-graphite-100 text-graphite-600 hover:bg-graphite-200"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* Articles Grid */}
      <section className="section-padding bg-ivory-50">
        <div className="container-custom">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-graphite-300 mx-auto mb-4" />
              <p className="text-graphite-500 text-lg">
                No articles in this category yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="card bg-white p-6 border border-graphite-100 hover:border-saffron-200 hover:shadow-lg transition-all group"
                >
                  <span
                    className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${
                      categoryColors[article.category] ||
                      "bg-graphite-100 text-graphite-600"
                    }`}
                  >
                    {article.category}
                  </span>
                  <h2 className="text-lg font-display font-semibold text-graphite-900 mb-3 group-hover:text-saffron-600 transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-graphite-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {article.meta_description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-graphite-50">
                    <span className="flex items-center gap-1.5 text-xs text-graphite-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(article.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-saffron-500 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
