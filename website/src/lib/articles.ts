import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Article {
  title: string;
  slug: string;
  meta_description: string;
  category: string;
  date: string;
  featured_image?: string;
  content: string;
}

const articlesDirectory = path.join(
  process.cwd(),
  "content",
  "articles"
);

export function getAllArticles(): Article[] {
  if (!fs.existsSync(articlesDirectory)) return [];
  const files = fs.readdirSync(articlesDirectory);
  const articles = files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(articlesDirectory, file);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);
      return {
        title: data.title || "",
        slug: data.slug || file.replace(".md", ""),
        meta_description: data.meta_description || "",
        category: data.category || "",
        date: data.date ? new Date(data.date).toISOString() : "",
        featured_image: data.featured_image || undefined,
        content,
      } as Article;
    })
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  return articles;
}

export function getArticleBySlug(
  slug: string
): Article | undefined {
  const articles = getAllArticles();
  return articles.find((a) => a.slug === slug);
}

export function getCategories(): string[] {
  return [
    "Strategy",
    "Answer Writing",
    "Book List",
    "PYQ Analysis",
    "Current Affairs",
  ];
}
