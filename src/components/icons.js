export const icons = {
  zoom: `<svg viewBox="0 0 24 24" width="14" height="14">
    <path
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2l-4.35-4.35"
    />
  </svg>`,
  
  link: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,

  github: `<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"></path>
  </svg>`,

  demo: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>`,

  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
    <path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"></path>
  </svg>`,

  close: `<svg viewBox="0 0 24 24">
    <path fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M8 8l8 8M16 8l-8 8"/>
  </svg>`,

  chevronPrev: `<svg viewBox="0 0 24 24">
    <polyline fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points="15 18 9 12 15 6"></polyline>
  </svg>`,

  chevronNext: `<svg viewBox="0 0 24 24">
    <polyline fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points="9 18 15 12 9 6"></polyline>
  </svg>`
};

/**
 * Helper to parse an icon string into a DOM element and attach dynamic event handlers / attributes.
 * @param {string} name - Key of the icon in `icons`
 * @param {Object} [options] - Optional attributes or event listeners to attach
 * @param {Object} [options.attrs] - Key-value pairs of attributes to set on the <svg> element
 * @param {Object} [options.on] - Key-value pairs of event listeners (e.g. { click: (e) => {}, mouseenter: (e) => {} })
 * @returns {SVGElement|string} The resulting SVG element with listeners/attributes, or empty string if not found
 */
export function getIcon(name, options = {}) {
  const rawSvg = icons[name];
  if (!rawSvg) return "";

  const template = document.createElement("template");
  template.innerHTML = rawSvg.trim();
  const svgElement = template.content.firstElementChild;

  if (!svgElement) return "";

  // Apply custom attributes if provided
  if (options.attrs) {
    for (const [key, value] of Object.entries(options.attrs)) {
      svgElement.setAttribute(key, value);
    }
  }

  // Apply event listeners if provided (e.g. click, mouseenter, mouseleave)
  if (options.on) {
    for (const [event, handler] of Object.entries(options.on)) {
      if (typeof handler === "function") {
        svgElement.addEventListener(event, handler);
      }
    }
  }

  return svgElement;
}

/**
 * Returns the raw SVG string for template literal injection where DOM element objects aren't suitable.
 * Supports passing dynamic attribute overrides or class names.
 * @param {string} name 
 * @param {Object} [attrs={}] 
 * @returns {string}
 */
export function getIconString(name, attrs = {}) {
  const svgEl = getIcon(name, { attrs });
  if (typeof svgEl === "string") return svgEl;
  return svgEl.outerHTML;
}

