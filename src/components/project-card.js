import { getIconString } from "./icons.js";

const html = (strings, ...values) => {
  const result = strings.reduce(
    (acc, str, i) => acc + str + (values[i] ?? ""),
    "",
  );
  const template = document.createElement("template");
  template.innerHTML = result.trim();
  return template.content.firstElementChild;
};

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function renderLinkSvg(link) {
  if (!link || !link.track) return "";
  if (link.track === "source") {
    return getIconString("github", { width: "16", height: "16" });
  }
  if (link.track === "demo") {
    return getIconString("demo", { width: "16", height: "16" });
  }
  // No icon for private repository or unknown track types
  return "";
}

function renderLinks(links) {
  if (!links || links.length === 0) return "";
  return links
    .map(
      (link) => `
      <a
        class="card__btn card__btn--secondary"
        href="${escapeHtml(link.url)}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="${escapeHtml(link.label)}"
        data-track="${escapeHtml(link.track)}"
      >
        ${renderLinkSvg(link)}
        ${escapeHtml(link.label)}
      </a>`,
    )
    .join("");
}

export function createProjectCard({
  id,
  title,
  description,
  tags,
  details,
  images,
  links,
}) {
  const card = html`
    <article class="card" data-project="${escapeHtml(id)}">
      <div class="card__image-container">
        <span class="gallery-zoom-badge" aria-label="Tap to view larger image">
          ${getIconString("zoom")}
        </span>
        <span class="gallery-badge">Swipe to view</span>
        <div class="card__gallery">
          ${images
            .map(
              (img) => `
            <img
              src="${escapeHtml(img.src)}"
              alt="${escapeHtml(img.alt)}"
              loading="lazy"
              draggable="false"
              ${img.width ? `width="${img.width}"` : ""}
              ${img.height ? `height="${img.height}"` : ""}
            />`,
            )
            .join("")}
        </div>
      </div>
      <div class="card__content">
        <h3 class="card__title">${escapeHtml(title)}</h3>
        <div class="card__tools">
          ${tags
            .map((tag) => `<span class="tool-tag">${escapeHtml(tag)}</span>`)
            .join("")}
        </div>
        <p class="card__description">${escapeHtml(description)}</p>
        ${details
          ? html`<details class="card__details">
              <summary>Key Features & Specs</summary>
              <div class="card__details-content">${escapeHtml(details)}</div>
            </details>`
          : ""}
        <div class="card__actions">${renderLinks(links)}</div>
      </div>
    </article>
  `;

  return card;
}
