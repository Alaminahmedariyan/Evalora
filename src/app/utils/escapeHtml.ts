const ENTITIES: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
};

/** Escapes text before it is placed inside an HTML email body. */
export const escapeHtml = (value: string): string =>
	value.replace(/[&<>"']/g, (char) => ENTITIES[char] ?? char);