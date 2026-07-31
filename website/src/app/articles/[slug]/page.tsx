import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { markdownToHtml, stripLeadingH1 } from "@/lib/markdown";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.meta_description,
    openGraph: {
      title: article.title,
      description: article.meta_description,
      type: "article",
      publishedTime: article.date,
      authors: ["UKPSC Decoded"],
      ...(article.featured_image ? { images: [{ url: article.featured_image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.meta_description,
      ...(article.featured_image ? { images: [article.featured_image] } : {}),
    },
  };
}


export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  // Markdown to HTML. The body's own leading "# Title" is dropped because the
  // hero below already renders the title as this page's only <h1>.
  const htmlContent = markdownToHtml(stripLeadingH1(article.content));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.meta_description,
    datePublished: article.date,
    author: { "@type": "Organization", name: "UKPSC Decoded" },
    publisher: {
      "@type": "Organization",
      name: "UKPSC Decoded",
      url: "https://ukpscdecoded.vercel.app",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="min-h-screen">
        {/* Header */}
        <section className="section-padding bg-gradient-to-br from-graphite-950 via-graphite-900 to-graphite-800 text-white">
          <div className="container-custom max-w-4xl">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-graphite-400 hover:text-saffron-400 mb-6 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Articles
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 bg-white/10 text-saffron-300 text-xs font-semibold px-3 py-1 rounded-full">
                <Tag className="w-3 h-3" /> {article.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-graphite-400 text-xs">
                <Calendar className="w-3 h-3" />
                {new Date(article.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <h1 className="heading-lg text-white">{article.title}</h1>
          </div>
        </section>


        {/* Featured image (optional — set in the CMS) */}
        {article.featured_image && (
          <section className="bg-white pt-10 md:pt-14">
            <div className="container-custom max-w-4xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.featured_image}
                alt={article.title}
                className="w-full rounded-xl border border-graphite-100 shadow-sm"
              />
            </div>
          </section>
        )}

        {/* Content */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container-custom max-w-4xl">
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-display prose-headings:text-graphite-900 prose-headings:scroll-mt-24
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-graphite-100
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-graphite-700 prose-p:leading-relaxed
                prose-a:text-saffron-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                prose-strong:text-graphite-900 prose-strong:font-semibold
                prose-ul:my-5 prose-ol:my-5 prose-li:my-1.5 prose-li:text-graphite-700
                prose-li:marker:text-saffron-500
                prose-blockquote:border-l-4 prose-blockquote:border-saffron-400 prose-blockquote:bg-ivory-100
                prose-blockquote:not-italic prose-blockquote:py-1 prose-blockquote:px-5 prose-blockquote:text-graphite-700
                prose-img:rounded-xl prose-img:shadow-sm
                prose-code:text-saffron-700 prose-code:bg-ivory-200 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-code:before:content-none prose-code:after:content-none
                prose-hr:border-graphite-200 prose-hr:my-10"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-graphite-50 border-t border-graphite-100">
          <div className="container-custom max-w-4xl text-center">
            <p className="text-graphite-600 mb-4">
              Found this helpful? Join 2000+ aspirants on our Telegram channel for daily updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://t.me/ukpscdecoded"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                Join Telegram
              </a>
              <Link
                href="/articles"
                className="btn-outline inline-flex items-center justify-center gap-2"
              >
                More Articles
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
