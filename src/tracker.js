const PAGEVIEW_ENDPOINT = "/api/v1/track";
const EVENT_ENDPOINT = "/api/v1/track/event";

function post(endpoint, payload) {
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon(endpoint, blob)) return;
  }

  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch((error) => console.error("Tracking failed:", error));
}

function getVisitorId() {
  let visitorId = localStorage.getItem("pv_visitor_id");
  if (!visitorId) {
    visitorId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `v1-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("pv_visitor_id", visitorId);
  }

  return visitorId;
}

export function sendPageView() {
  post(PAGEVIEW_ENDPOINT, {
    visitor_id: getVisitorId(),
    path: window.location.pathname + window.location.search,
    referrer: document.referrer || null,
    user_agent: navigator.userAgent,
  });
}

function initPageViewTracking() {
  const isRefreshed = sessionStorage.getItem("pv_page_logged");
  if (isRefreshed) {
    console.log(
      "Page refresh detected — skipped logging to prevent database bloat.",
    );
    return;
  }
  sessionStorage.setItem("pv_page_logged", "true");

  if (document.readyState === "complete") {
    sendPageView();
  } else {
    window.addEventListener("load", sendPageView, { once: true });
  }
}

export function trackEvent(eventType, project = null, detail = null) {
  post(EVENT_ENDPOINT, {
    visitor_id: getVisitorId(),
    event_type: eventType,
    project,
    detail,
    path: window.location.pathname,
  });
}

function initEngagementTracking() {
  // Track source-code & demo button clicks (includes middle-click)
  ["click", "auxclick"].forEach((type) => {
    document.addEventListener(type, (e) => {
      const link = e.target.closest("[data-track]");
      if (!link) return;
      const project = link.closest("[data-project]")?.dataset.project ?? null;
      trackEvent("project_link_click", project, link.dataset.track);
    });
  });
}

export function initTracker() {
  initPageViewTracking();
  initEngagementTracking();
}
