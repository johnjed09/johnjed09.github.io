export function initTracker() {
  const endpoint = "/api/v1/track";

  const isRefreshed = sessionStorage.getItem("pv_page_logged");
  if (isRefreshed) {
    console.log(
      "Page refresh detected — skipped logging to prevent database bloat.",
    );
    return;
  }
  sessionStorage.setItem("pv_page_logged", "true");

  let visitorId = localStorage.getItem("pv_visitor_id");
  if (!visitorId) {
    visitorId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `v1-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("pv_visitor_id", visitorId);
  }

  function sendTrackingData() {
    const payload = {
      visitor_id: visitorId,
      path: window.location.pathname + window.location.search,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
    };

    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });
      navigator.sendBeacon(endpoint, blob);
      return;
    }

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch((error) => console.error("Tracking failed:", error));
  }

  if (document.readyState === "complete") {
    sendTrackingData();
  } else {
    window.addEventListener("load", sendTrackingData, { once: true });
  }
}
