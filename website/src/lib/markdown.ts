// Lightweight markdown-to-HTML converter (no external dependency).
// Supports headings, bold/italic, links, images, inline code, lists,
// blockquotes, horizontal rules and GitHub-flavoured tables.
export function markdownToHtml(md: string): string {
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
