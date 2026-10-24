// Cookie consent + Google Tag Manager.
//
// Nothing is loaded while Header.gtmId is empty: no banner, no scripts, no cookies.
// With a GTM id, Tag Manager is loaded ONLY after the visitor accepts (it is the
// container that sets the Google Analytics cookies). Rejecting keeps the site
// cookie-free. The choice is kept in localStorage for 12 months.

type Choice = "granted" | "denied";

const STORAGE_KEY = "rw-consent";
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;
const GTM_ID = /^GTM-[A-Z0-9]+$/;

export const isValidGtmId = (id?: string | null): id is string =>
  !!id && GTM_ID.test(id.trim());

function readChoice(): Choice | null {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved || Date.now() - saved.at > MAX_AGE_MS) return null;
    return saved.value === "granted" || saved.value === "denied" ? saved.value : null;
  } catch {
    return null;
  }
}

function saveChoice(value: Choice) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ value, at: Date.now() }));
  } catch {
    // Private mode / storage blocked: the banner will simply show again next visit.
  }
}

function loadGtm(id: string) {
  const w = window as any;
  if (w.__rwGtmLoaded) return;
  w.__rwGtmLoaded = true;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  };
  // Analytics only: advertising stays denied.
  w.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

// Removes the Google Analytics cookies (_ga, _ga_XXXX, _gid...) on this domain.
function deleteAnalyticsCookies() {
  const host = location.hostname;
  const domains = ["", host, "." + host, "." + host.split(".").slice(-2).join(".")];
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0].trim();
    if (!/^(_ga|_gid|_gat)/.test(name)) return;
    domains.forEach((d) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? "; domain=" + d : ""}`;
    });
  });
}

export function useConsent() {
  const choice = useState<Choice | null>("rw-consent-choice", () => null);
  const open = useState<boolean>("rw-consent-open", () => false);

  // Call once on the client, when the GTM id is known.
  const init = (gtmId: string) => {
    choice.value = readChoice();
    if (choice.value === "granted") loadGtm(gtmId);
    open.value = choice.value === null;
  };

  const accept = (gtmId: string) => {
    choice.value = "granted";
    saveChoice("granted");
    open.value = false;
    loadGtm(gtmId);
  };

  const reject = () => {
    const wasLoaded = !!(window as any).__rwGtmLoaded;
    choice.value = "denied";
    saveChoice("denied");
    open.value = false;
    if (wasLoaded) {
      (window as any).gtag?.("consent", "update", { analytics_storage: "denied" });
      deleteAnalyticsCookies();
      // Tag Manager cannot be unloaded: reload so it is no longer running.
      location.reload();
    }
  };

  const reopen = () => {
    open.value = true;
  };

  return { choice, open, init, accept, reject, reopen };
}
