const API_URL = "http://127.0.0.1:8000/api/v1/track";

export function initTracker() {
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
      navigator.sendBeacon(API_URL, blob);
    } else {
      fetch(API_URL, {
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
