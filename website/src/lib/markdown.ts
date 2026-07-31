// Lightweight markdown-to-HTML converter (no external dependency).
//
// Supports: headings, bold/italic, inline code, links, images, ordered and
// unordered lists (including one level of nesting), blockquotes, horizontal
// rules, GitHub-flavoured tables and multi-line paragraphs.
//
// Styling comes from the `prose` wrapper on the article page, so elements are
// emitted without classes except where structure demands it (tables, images).

/** Inline formatting applied to the text inside a block. */
function inline(text: string): string {
  return (
    text
      // Images must run before links, otherwise ![alt](src) loses its "!".
      .replace(
        /!\[([^\]]*)\]\(([^)\s]+)\)/g,
        '<img src="$2" alt="$1" class="rounded-lg" loading="lazy" />'
      )
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_match, label: string, href: string) => {
        const external = /^https?:\/\//i.test(href);
        const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<a href="${href}"${attrs}>${label}</a>`;
      })
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // Single-asterisk italics, without eating the markers of bold text.
      .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>")
  );
}

interface ListItem {
  ordered: boolean;
  content: string;
  indent: number;
}

function listMarker(line: string): ListItem | null {
  const match = line.match(/^(\s*)([-*+]|\d{1,3}[.)])\s+(.*)$/);
  if (!match) return null;
  return {
    ordered: /\d/.test(match[2]),
    content: match[3],
    indent: match[1].replace(/\t/g, "  ").length,
  };
}

function isHeading(text: string): boolean {
  return /^#{1,6}\s+/.test(text);
}

function isHorizontalRule(text: string): boolean {
  return /^(-{3,}|\*{3,}|_{3,})$/.test(text);
}

function isTableRow(text: string): boolean {
  return text.startsWith("|") && text.endsWith("|") && text.length > 2;
}

function isTableSeparator(text: string): boolean {
  return /^\|[\s:\-|]+\|$/.test(text) && text.includes("-");
}

/** Split "| a | b |" into ["a", "b"], preserving empty cells. */
function tableCells(row: string): string[] {
  return row
    .trim()
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());
}

function parseTable(lines: string[], start: number): [string, number] {
  const header = tableCells(lines[start]);
  let index = start + 2; // skip header and separator

  let html =
    '<div class="overflow-x-auto my-6"><table class="min-w-full border border-graphite-200 text-sm">';
  html += '<thead><tr class="bg-graphite-100">';
  html += header
    .map(
      (cell) =>
        `<th class="px-3 py-2 border border-graphite-200 text-left font-semibold">${inline(cell)}</th>`
    )
    .join("");
  html += "</tr></thead><tbody>";

  while (index < lines.length && isTableRow(lines[index].trim())) {
    const row = tableCells(lines[index]);
    html += "<tr>";
    html += row
      .map((cell) => `<td class="px-3 py-2 border border-graphite-200">${inline(cell)}</td>`)
      .join("");
    html += "</tr>";
    index++;
  }

  html += "</tbody></table></div>";
  return [html, index];
}

function parseList(lines: string[], start: number, indent: number): [string, number] {
  const first = listMarker(lines[start]);
  if (!first) return ["", start + 1];

  const tag = first.ordered ? "ol" : "ul";
  let html = `<${tag}>`;
  let index = start;

  while (index < lines.length) {
    const line = lines[index];

    // A blank line only continues the list if another item follows.
    if (!line.trim()) {
      const next = index + 1 < lines.length ? listMarker(lines[index + 1]) : null;
      if (next && next.indent >= indent) {
        index++;
        continue;
      }
      break;
    }

    const marker = listMarker(line);
    if (!marker || marker.indent < indent) break;

    // Deeper indent: a nested list belonging to the previous item.
    if (marker.indent > indent) {
      const [nested, next] = parseList(lines, index, marker.indent);
      html = html.replace(/<\/li>$/, `${nested}</li>`);
      index = next;
      continue;
    }

    // Switching between bulleted and numbered ends this list.
    if (marker.ordered !== first.ordered) break;

    html += `<li>${inline(marker.content.trim())}</li>`;
    index++;
  }

  html += `</${tag}>`;
  return [html, index];
}

function startsNewBlock(rawLine: string): boolean {
  const text = rawLine.trim();
  if (!text) return true;
  return (
    isHeading(text) ||
    isHorizontalRule(text) ||
    isTableRow(text) ||
    /^>\s?/.test(text) ||
    text.startsWith("<") ||
    listMarker(rawLine) !== null
  );
}

export function markdownToHtml(md: string): string {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  const out: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const raw = lines[index];
    const text = raw.trim();

    if (!text) {
      index++;
      continue;
    }

    if (isHorizontalRule(text)) {
      out.push("<hr />");
      index++;
      continue;
    }

    const heading = text.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      out.push(`<h${level}>${inline(heading[2].trim())}</h${level}>`);
      index++;
      continue;
    }

    if (
      isTableRow(text) &&
      index + 1 < lines.length &&
      isTableSeparator(lines[index + 1].trim())
    ) {
      const [html, next] = parseTable(lines, index);
      out.push(html);
      index = next;
      continue;
    }

    if (/^>\s?/.test(text)) {
      const quoted: string[] = [];
      while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
        quoted.push(lines[index].replace(/^\s*>\s?/, ""));
        index++;
      }
      out.push(`<blockquote>${markdownToHtml(quoted.join("\n"))}</blockquote>`);
      continue;
    }

    if (listMarker(raw)) {
      const [html, next] = parseList(lines, index, listMarker(raw)!.indent);
      out.push(html);
      index = next;
      continue;
    }

    // Raw HTML passes through untouched.
    if (text.startsWith("<")) {
      out.push(text);
      index++;
      continue;
    }

    // Paragraph: absorb following lines until a blank line or a new block.
    const paragraph: string[] = [text];
    index++;
    while (index < lines.length && !startsNewBlock(lines[index])) {
      paragraph.push(lines[index].trim());
      index++;
    }
    out.push(`<p>${inline(paragraph.join(" "))}</p>`);
  }

  return out.join("\n");
}

/**
 * Remove a leading `# Heading` from article markdown.
 *
 * The article page already renders the frontmatter title as the page's only
 * <h1>, so a body that opens with its own H1 produces two H1s — bad for both
 * SEO and heading hierarchy.
 */
export function stripLeadingH1(md: string): string {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  let index = 0;
  while (index < lines.length && !lines[index].trim()) index++;
  if (index >= lines.length) return md;
  if (!/^#\s+/.test(lines[index].trim())) return md;
  return lines.slice(index + 1).join("\n").replace(/^\n+/, "");
}
