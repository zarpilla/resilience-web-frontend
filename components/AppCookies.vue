<script setup lang="ts">
// Cookie banner. Only exists when Header.gtmId has a valid GTM id (see useConsent).
const { locale } = useI18n();
const localePath = useLocalePath();
const headerStore = useHeaderStore();
const { open, init, accept, reject } = useConsent();

const header = computed(
  () => headerStore.headers.find((h) => h.locale === locale.value)?.value
);
// gtmId is the same in every language: take it from any loaded header.
const gtmId = computed(() => {
  const id = headerStore.headers.map((h) => h.value?.gtmId).find(isValidGtmId);
  return id ? id.trim() : null;
});

const DEFAULTS: Record<string, { label: string; text: string; accept: string; reject: string }> = {
  ca: {
    label: "Galetes",
    text: "Fem servir galetes d'analítica (Google Analytics) per saber com es fa servir la web i millorar-la. Només s'activen si les acceptes. Més informació a la <a href=\"{policy}\">política de privacitat</a>.",
    accept: "Acceptar",
    reject: "Rebutjar",
  },
  es: {
    label: "Cookies",
    text: "Usamos cookies de analítica (Google Analytics) para saber cómo se usa la web y mejorarla. Solo se activan si las aceptas. Más información en la <a href=\"{policy}\">política de privacidad</a>.",
    accept: "Aceptar",
    reject: "Rechazar",
  },
  en: {
    label: "Cookies",
    text: "We use analytics cookies (Google Analytics) to understand how the website is used and improve it. They are only enabled if you accept them. More information in our <a href=\"{policy}\">privacy policy</a>.",
    accept: "Accept",
    reject: "Reject",
  },
};

const t = computed(() => {
  const d = DEFAULTS[locale.value] || DEFAULTS.ca;
  return {
    label: d.label,
    text: (header.value?.cookieText || d.text).replace(
      "{policy}",
      localePath("/politica-de-privacitat")
    ),
    accept: header.value?.cookieAccept || d.accept,
    reject: header.value?.cookieReject || d.reject,
  };
});

let initialised = false;
watch(
  gtmId,
  (id) => {
    if (id && !initialised) {
      initialised = true;
      init(id);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div
    v-if="gtmId && open"
    class="cookie-banner"
    role="dialog"
    aria-live="polite"
    :aria-label="t.label"
  >
    <div class="cookie-banner__inner">
      <div class="cookie-banner__text" v-html="t.text"></div>
      <div class="cookie-banner__actions">
        <button type="button" class="cookie-banner__btn" @click="reject()">
          {{ t.reject }}
        </button>
        <button type="button" class="cookie-banner__btn" @click="accept(gtmId!)">
          {{ t.accept }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cookie-banner {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  background: #000;
  color: #fff;
  border-top: 1px solid #fff;
  font-family: "PP Neue Montreal";
}

.cookie-banner__inner {
  max-width: 1320px;
  margin: 0 auto;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 48px;
    padding: 28px 40px;
  }
}

.cookie-banner__text {
  margin: 0;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.16px;
  max-width: 760px;

  :deep(a) {
    color: #fff;
    text-decoration: underline;
  }
}

.cookie-banner__actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

// Accept and reject look the same on purpose: rejecting must be as easy as accepting.
.cookie-banner__btn {
  flex: 1 1 0;
  min-width: 130px;
  padding: 12px 28px;
  border: 1px solid #fff;
  border-radius: 50px;
  background: transparent;
  color: #fff;
  font-family: inherit;
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;

  &:hover,
  &:focus-visible {
    background: #fff;
    color: #000;
  }
}
</style>
