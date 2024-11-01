<script setup lang="ts">
const { locale } = useI18n();
const props = defineProps<{
  emailText: string;
  buttonText: string;
  acceptText: string;
  messageOk: string;
  messageKo: string;
}>();

const errorGprd = ref(false);
const errorEmail = ref(false);
const submitted = ref(false);
const submittedOk = ref<boolean | null>(null);

const handleSubmit = async () => {
  errorGprd.value = false;
  errorEmail.value = false;
  submitted.value = true;

  if (formModel.gprd === false) {
    errorGprd.value = true;
  }
  if (!formModel.email || !validateEmail(formModel.email)) {
    errorEmail.value = true;
  }
  if (errorGprd.value || errorEmail.value) {
    return;
  }
  
  const { data }: any = await useAPI("/api/subscriptions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      data: {
        email: formModel.email,
        accept: formModel.gprd,
      },
    },
  });

  console.log('data', data.value.data.id);

  if (data.value && data.value.data && data.value.data.id) {
    submittedOk.value = true;
  } else {
    submittedOk.value = false;
  }
};

const validateEmail = (email: string) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const isEmailValidComputed = computed(() => {
  return validateEmail(formModel.email);
});

const formModel = reactive({
  email: "",
  gprd: false,
});
</script>
<template>
  <form @submit.prevent="handleSubmit" v-if="!submitted">
    <div class="email-wrapper">
      <input
        class="email"
        type="text"
        id="email"
        v-model="formModel.email"
        :placeholder="emailText"
      />
      <span class="error-email error" v-if="errorEmail && !isEmailValidComputed"
        >*</span
      >
    </div>
    <div class="mt-4">
      <svg
        width="20"
        height="21"
        viewBox="0 0 20 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        v-if="!formModel.gprd"
        @click="formModel.gprd = true"
      >
        <circle cx="10" cy="10.5" r="9.5" stroke="white" />
      </svg>
      <svg
        width="20"
        height="21"
        viewBox="0 0 20 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        v-else
        @click="formModel.gprd = false"
      >
        <circle cx="10" cy="10.5" r="9.5" stroke="white" />
        <circle cx="10" cy="10.5" r="5" fill="white" />
      </svg>
      <input
        type="checkbox"
        id="gprd"
        v-model="formModel.gprd"
        class="d-none"
      />
      <label for="gprd" class="ms-2"
        >{{ acceptText }}
        <span class="error" v-if="errorGprd">*</span>
      </label>
    </div>
    <button
      type="submit"
      class="btn mt-5 zbtn-with-arrow-right w-100 btn-dark d-flex px-4"
    >
      <span class="me-auto">
        {{ buttonText }}
      </span>
      <svg
        class="valign"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-3.0598e-07 9L12.175 9L6.575 14.6L8 16L16 8L8 -3.49691e-07L6.575 1.4L12.175 7L-3.93402e-07 7L-3.0598e-07 9Z"
          fill="white"
        />
      </svg>
    </button>
  </form>
  <div v-else>
    <p v-if="submittedOk === true">
      {{ messageOk }}
    </p>
    <p v-else class="error">
      {{ messageKo }}
    </p>
  </div>
</template>
<style lang="scss" scoped>
form {
  .email {
    border: 0;
    border-bottom: 1px solid #fff;
    background: #000;
    box-shadow: none !important;
    width: 100%;

    color: var(--Blanc, #fff);
    font-family: "PP Neue Montreal";
    font-size: 22px;
    font-style: normal;
    font-weight: 500;
    line-height: 23px; /* 104.545% */
    letter-spacing: 0.22px;

    &:focus-visible {
      outline: none;
    }
  }
  ::placeholder {
    color: #fff;
    opacity: 1; /* Firefox */
  }

  ::-ms-input-placeholder {
    /* Edge 12 -18 */
    color: #fff;
  }

  label {
    color: var(--Blanc, #fff);
    font-family: "PP Neue Montreal";
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 23px; /* 127.778% */
    letter-spacing: 0.18px;
  }
  .valign {
    margin-top: 4px;
    display: inline;
  }
  .error {
    color: red;
    font-size: 18px;
    font-weight: bold;
  }
  .email-wrapper {
    position: relative;

    .error-email {
      position: absolute;
      right: 0;
      top: 0;
      color: red;
    }
  }
}
p.error {
  color: red !important;
  font-size: 18px;
  font-weight: normal;
}
</style>
