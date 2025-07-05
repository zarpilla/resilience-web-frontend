<script setup lang="ts">
const { locale } = useI18n();

const props = defineProps<{
  section: any;
}>();

const textStore = useTextStore();
const texts = computed(() =>
  textStore.texts.find((h) => h.locale === locale.value)
);

// Form validation errors
const errors = ref({
  name: false,
  email: false,
  sector: false,
  subject: false,
  message: false,
  accept: false,
});

const submitted = ref(false);
const submittedOk = ref<boolean | null>(null);
const isLoading = ref(false);

// Form model
const formModel = reactive({
  name: "",
  email: "",
  sector: "",
  subject: "",
  message: "",
  accept: false,
});

// Email validation
const validateEmail = (email: string) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const isEmailValidComputed = computed(() => {
  return validateEmail(formModel.email);
});

// Form validation
const validateForm = () => {
  // Reset errors
  Object.keys(errors.value).forEach((key) => {
    errors.value[key as keyof typeof errors.value] = false;
  });

  let hasErrors = false;

  // Validate required fields
  if (!formModel.name.trim()) {
    errors.value.name = true;
    hasErrors = true;
  }

  if (!formModel.email || !validateEmail(formModel.email)) {
    errors.value.email = true;
    hasErrors = true;
  }

  if (!formModel.sector.trim()) {
    errors.value.sector = true;
    hasErrors = true;
  }

  if (!formModel.subject.trim()) {
    errors.value.subject = true;
    hasErrors = true;
  }

  if (!formModel.message.trim()) {
    errors.value.message = true;
    hasErrors = true;
  }

  if (!formModel.accept) {
    errors.value.accept = true;
    hasErrors = true;
  }

  return !hasErrors;
};

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  try {
    const { data }: any = await useAPI("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        data: {
          name: formModel.name,
          email: formModel.email,
          sector: formModel.sector,
          subject: formModel.subject,
          message: formModel.message,
          accept: formModel.accept,
          locale: locale.value,
        },
      },
    });

    if (data.value && data.value.data && data.value.data.id) {
      submittedOk.value = true;
    } else {
      submittedOk.value = false;
    }
  } catch (error) {
    console.error("Error submitting lead:", error);
    submittedOk.value = false;
  } finally {
    submitted.value = true;
    isLoading.value = false;
  }
};

// Reset form
const resetForm = () => {
  submitted.value = false;
  submittedOk.value = null;

  // Reset form model
  formModel.name = "";
  formModel.email = "";
  formModel.sector = "";
  formModel.subject = "";
  formModel.message = "";
  formModel.accept = false;

  // Reset errors
  Object.keys(errors.value).forEach((key) => {
    errors.value[key as keyof typeof errors.value] = false;
  });
};
</script>

<template>
  <div class="section-lead-form">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <!-- Section title and subtitle -->
          <div class="ztext-center mb-5" v-if="section.name">
            <h4 class="mb-4" v-if="section.name" v-html="section.name"></h4>
          </div>

          <!-- Form -->
          <div class="lead-form-wrapper">
            <form
              @submit.prevent="handleSubmit"
              v-if="!submitted"
              class="lead-form"
            >
              <div class="row">
                <!-- Name field -->
                <div class="col-12 zcol-md-6 mb-4">
                  <div class="field-wrapper">
                    <input
                      class="form-input"
                      type="text"
                      id="name"
                      v-model="formModel.name"
                      :placeholder="texts?.value?.data?.name || 'Name'"
                      :class="{ error: errors.name }"
                    />
                    <span class="error-indicator" v-if="errors.name">*</span>
                  </div>
                </div>

                <!-- Email field -->
                <div class="col-12 zcol-md-6 mb-4">
                  <div class="field-wrapper">
                    <input
                      class="form-input"
                      type="email"
                      id="email"
                      v-model="formModel.email"
                      :placeholder="texts?.value?.data?.email || 'Email'"
                      :class="{ error: errors.email }"
                    />
                    <span class="error-indicator" v-if="errors.email">*</span>
                  </div>
                </div>

                <!-- Sector field -->
                <div class="col-12 zcol-md-6 mb-4">
                  <div class="field-wrapper">
                    <input
                      class="form-input"
                      type="text"
                      id="sector"
                      v-model="formModel.sector"
                      :placeholder="texts?.value?.data?.sector || 'Sector'"
                      :class="{ error: errors.sector }"
                    />
                    <span class="error-indicator" v-if="errors.sector">*</span>
                  </div>
                </div>

                <!-- Subject field -->
                <div class="col-12 zcol-md-6 mb-4">
                  <div class="field-wrapper">
                    <input
                      class="form-input"
                      type="text"
                      id="subject"
                      v-model="formModel.subject"
                      :placeholder="texts?.value?.data?.subject || 'Subject'"
                      :class="{ error: errors.subject }"
                    />
                    <span class="error-indicator" v-if="errors.subject">*</span>
                  </div>
                </div>

                <!-- Message field -->
                <div class="col-12 mb-4">
                  <div class="field-wrapper">
                    <textarea
                      class="form-input form-textarea"
                      id="message"
                      v-model="formModel.message"
                      :placeholder="texts?.value?.data?.message || 'Message'"
                      :class="{ error: errors.message }"
                      rows="5"
                    ></textarea>
                    <span class="error-indicator" v-if="errors.message">*</span>
                  </div>
                </div>

                <!-- Accept checkbox -->
                <div class="col-12 mb-4">
                  <div class="checkbox-wrapper">
                    <svg
                      width="20"
                      height="21"
                      viewBox="0 0 20 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      v-if="!formModel.accept"
                      @click="formModel.accept = true"
                      class="checkbox-icon"
                    >
                      <circle cx="10" cy="10.5" r="9.5" stroke="#000" />
                    </svg>
                    <svg
                      width="20"
                      height="21"
                      viewBox="0 0 20 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      v-else
                      @click="formModel.accept = false"
                      class="checkbox-icon"
                    >
                      <circle cx="10" cy="10.5" r="9.5" stroke="#000" />
                      <circle cx="10" cy="10.5" r="5" fill="#000" />
                    </svg>
                    <input
                      type="checkbox"
                      id="accept"
                      v-model="formModel.accept"
                      class="d-none"
                    />
                    <label for="accept" class="checkbox-label">
                      {{
                        texts?.value?.data?.acceptTerms ||
                        "I accept the terms and conditions"
                      }}
                      <span class="error-text" v-if="errors.accept">*</span>
                    </label>
                  </div>
                </div>

                <!-- Submit button -->
                <div class="col-12">
                  <button
                    type="submit"
                    class="btn mt-5 zbtn-with-arrow-right zw-100 btn-dark btn-with-arrow-right btn-dark-hover d-flex px-4"
                    :disabled="isLoading"
                  >
                    <span v-if="!isLoading">
                      {{ texts?.value?.data?.sendMessage || "Send" }}
                    </span>
                    <span v-else>
                      {{ texts?.value?.data?.sending || "Sending..." }}
                    </span>
                    <span class="button__label"></span>
                  </button>
                </div>
              </div>
            </form>

            <!-- Success/Error message -->
            <div v-else class="form-result">
              <div v-if="submittedOk === true" class="success-message">
                <h3>{{ texts?.value?.data?.thankYou || "Thank you!" }}</h3>
                <p>
                  {{
                    texts?.value?.data?.messageReceived ||
                    "Your message has been received. We will get back to you soon."
                  }}
                </p>
                <button @click="resetForm" class="btn btn-secondary mt-3">
                  {{
                    texts?.value?.data?.sendAnother || "Send Another Message"
                  }}
                </button>
              </div>
              <div v-else class="error-message">
                <h3>{{ texts?.value?.data?.errorTitle || "Error" }}</h3>
                <p>
                  {{
                    texts?.value?.data?.errorMessage ||
                    "There was an error sending your message. Please try again."
                  }}
                </p>
                <button @click="resetForm" class="btn btn-secondary mt-3">
                  {{ texts?.value?.data?.tryAgain || "Try Again" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section-lead-form {
  h4 {
    color: var(--Negre, #000);
    font-family: "PP Neue Montreal";
    font-size: 30px;
    font-style: normal;
    font-weight: 700;
    line-height: 38px; /* 126.667% */
    letter-spacing: 0.3px;
  }
  .subtitle {
    color: var(--Taronja, #f5825e);
    text-align: center;
    font-family: "PP Neue Montreal";
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 4.375rem;
    letter-spacing: 0.05rem;
    text-transform: uppercase;
  }

  .lead-form-wrapper {
    margin: 0 auto;
  }

  .lead-form {
    .field-wrapper {
      position: relative;
    }

    .form-input {
      border: 0;
      border-bottom: 1px solid #000;
      background: transparent;
      box-shadow: none !important;
      width: 100%;
      padding: 12px 0;
      width: 100%;

      color: var(--Negre, #000);
      font-family: "PP Neue Montreal";
      font-size: 22px;
      font-style: normal;
      font-weight: 500;
      line-height: 23px; /* 104.545% */
      letter-spacing: 0.22px;

      &:focus-visible {
        outline: none;
        border-bottom-color: var(--Taronja, #f5825e);
      }

      &.error {
        border-bottom-color: #ff4444;
      }

      &::placeholder {
        color: #000;
        opacity: 1;
      }

      &::-ms-input-placeholder {
        color: #999;
      }
    }

    .form-textarea {
      resize: vertical;
      min-height: 120px;
    }

    .error-indicator {
      position: absolute;
      right: 0;
      top: 12px;
      color: #ff4444;
      font-size: 18px;
      font-weight: bold;
    }

    .checkbox-wrapper {
      display: flex;
      align-items: flex-start;
      gap: 12px;

      .checkbox-icon {
        cursor: pointer;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .checkbox-label {
        color: var(--Blanc, #000);
        font-family: "PP Neue Montreal";
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 1.4;
        letter-spacing: 0.16px;
        cursor: pointer;
        margin: 0;

        color: var(--Negre, #000);
font-family: "PP Neue Montreal";
font-size: 18px;
font-style: normal;
font-weight: 500;
line-height: 23px; /* 127.778% */
letter-spacing: 0.18px;

        .error-text {
          color: #ff4444;
          font-size: 18px;
          font-weight: bold;
        }
      }
    }

    .btn-submit {
      background: var(--Taronja, #f5825e);
      border: 2px solid var(--Taronja, #f5825e);
      color: white;
      font-family: "PP Neue Montreal";
      font-size: 18px;
      font-weight: 600;
      padding: 16px 32px;
      border-radius: 25px;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.05rem;

      &:hover:not(:disabled) {
        background: transparent;
        color: var(--Taronja, #f5825e);
        transform: translateY(-2px);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }
    }
  }

  .form-result {
    text-align: center;
    padding: 40px 20px;

    .success-message {
      h3 {
        color: var(--Taronja, #f5825e);
        font-family: "PP Neue Montreal";
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 16px;
      }

      p {
        color: var(--Blanc, #000);
        font-family: "PP Neue Montreal";
        font-size: 18px;
        font-weight: 500;
        line-height: 1.4;
      }
    }

    .error-message {
      h3 {
        color: #ff4444;
        font-family: "PP Neue Montreal";
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 16px;
      }

      p {
        color: var(--Blanc, #000);
        font-family: "PP Neue Montreal";
        font-size: 18px;
        font-weight: 500;
        line-height: 1.4;
      }
    }

    .btn-secondary {
      background: transparent;
      border: 2px solid var(--Blanc, #fff);
      color: var(--Blanc, #fff);
      font-family: "PP Neue Montreal";
      font-size: 16px;
      font-weight: 500;
      padding: 12px 24px;
      border-radius: 25px;
      transition: all 0.3s ease;

      &:hover {
        background: var(--Blanc, #fff);
        color: #000;
        transform: translateY(-2px);
      }
    }
  }

  .btn-with-arrow-right {
    padding-right: 68px!important;
    padding-left: 68px!important;
  }

  @media (max-width: 768px) {
    .lead-form {
      .form-input {
        font-size: 16px;
      }

      .checkbox-wrapper {
        .checkbox-label {
          font-size: 14px;
        }
      }

      .btn-submit {
        font-size: 16px;
        padding: 14px 28px;
      }
    }
  }
}
</style>
