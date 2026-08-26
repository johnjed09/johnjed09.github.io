const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const API_URL = isLocal
  ? "http://127.0.0.1:8000"
  : "https://pulse-trace.onrender.com";

export function initTracker() {
  const endpoint = `${API_URL}/api/v1/track`;

  function sendTrackingData() {
    const payload = {
      path: window.location.pathname + window.location.search,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
    };

    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });
      navigator.sendBeacon(endpoint, blob);
    } else {
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((error) => console.error("Tracking failed: ", error));
    }
  }

  if (document.readyState === "complete") {
    sendTrackingData();
  } else {
    window.addEventListener("load", sendTrackingData);
  }
}
