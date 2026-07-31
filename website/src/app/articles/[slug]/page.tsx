import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
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
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.meta_description,
    },
  };
}


export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  // Simple markdown to HTML (headings, bold, italic, lists, links, hr, tables)
  const htmlContent = markdownToHtml(article.content);

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


        {/* Content */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container-custom max-w-4xl">
            <div
              className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-graphite-900 prose-p:text-graphite-700 prose-p:leading-relaxed prose-a:text-saffron-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-graphite-800 prose-li:text-graphite-700 prose-blockquote:border-saffron-400 prose-blockquote:text-graphite-600 prose-hr:border-graphite-200"
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

// Simple markdown-to-HTML converter (no external dependency needed)
function markdownToHtml(md: string): string {
  let html = md
    // Horizontal rules
    .replace(/^---$/gm, "<hr />")
    // Headers
    .replace(/^######\s+(.+)$/gm, "<h6>$1</h6>")
    .replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>")
    .replace(/^####\s+(.+)$/gm, "<h4>$1</h4>")
    .replace(/^###\s+(.+)$/gm, "<h3>$1</h3>")
    .replace(/^##\s+(.+)$/gm, "<h2>$1</h2>")
    .replace(/^#\s+(.+)$/gm, "<h1>$1</h1>")
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg" />')
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>");

  // Process blocks (lists, paragraphs, tables)
  const lines = html.split("\n");
  let result = "";
  let inList = false;
  let inOrderedList = false;
  let inTable = false;
  let tableStarted = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Table rows
    if (line.startsWith("|") && line.endsWith("|")) {
      if (!inTable) {
        inTable = true;
        tableStarted = false;
        result += '<div class="overflow-x-auto my-6"><table class="min-w-full border border-graphite-200 text-sm">';
      }
      // Skip separator row
      if (line.match(/^\|[\s\-:|]+\|$/)) {
        tableStarted = true;
        continue;
      }
      const cells = line.split("|").filter((c) => c.trim() !== "");
      const tag = !tableStarted ? "th" : "td";
      const rowClass = !tableStarted
        ? ' class="bg-graphite-100 font-semibold"'
        : "";
      result += `<tr${rowClass}>`;
      cells.forEach((cell) => {
        result += `<${tag} class="px-3 py-2 border border-graphite-200">${cell.trim()}</${tag}>`;
      });
      result += "</tr>";
      if (!tableStarted) tableStarted = true;
      continue;
    } else if (inTable) {
      inTable = false;
      result += "</table></div>";
    }

    // Unordered list
    if (line.match(/^[-*]\s+/)) {
      if (!inList) { result += "<ul>"; inList = true; }
      result += `<li>${line.replace(/^[-*]\s+/, "")}</li>`;
      continue;
    } else if (inList) {
      inList = false;
      result += "</ul>";
    }

    // Ordered list
    if (line.match(/^\d+\.\s+/)) {
      if (!inOrderedList) { result += "<ol>"; inOrderedList = true; }
      result += `<li>${line.replace(/^\d+\.\s+/, "")}</li>`;
      continue;
    } else if (inOrderedList) {
      inOrderedList = false;
      result += "</ol>";
    }

    // Blockquote
    if (line.startsWith("> ")) {
      result += `<blockquote><p>${line.replace(/^>\s*/, "")}</p></blockquote>`;
      continue;
    }

    // HTML tags pass through
    if (line.startsWith("<")) {
      result += line;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      result += "";
      continue;
    }

    // Regular paragraph
    result += `<p>${line}</p>`;
  }

  // Close any open lists/tables
  if (inList) result += "</ul>";
  if (inOrderedList) result += "</ol>";
  if (inTable) result += "</table></div>";

  return result;
}
