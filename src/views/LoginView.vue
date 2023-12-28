<script setup>
  import { vMaska } from "maska";
  import { reactive, ref, onMounted, computed } from "vue";
  import { useToast } from "vue-toastification";
  import { useRouter } from "vue-router";
  import http from "@/helper/http";

  const credential = reactive({
    phone: null,
    login_code: null
  })

  let isLoading = ref(false)
  let waitingOnVerification = ref(false)

  const toast = useToast()
  const router = useRouter()

  onMounted(() => {
    if (localStorage.getItem('token')) {
      router.push({
        name: 'landing'
      })
    }
  })

  const formattedCredentials = computed(() => {
    return {
      phone: credential.phone && credential.phone.replaceAll(' ', '').replace('+', '').replace('-', ''),
      login_code: credential.login_code
    }
  })

  const handleLogin = () => {
    isLoading.value = true

    http().post('/api/v1/login', formattedCredentials.value)
      .then(response => {
        waitingOnVerification.value = true
        toast.success(response.data.message)
      })
      .catch(error => {
        if (error.response.status === 422) {
          toast.error(error.response.data.errors['phone'][0])
        } else {
          toast.error(error.response.data.message)
        }
      })
      .finally(() => {
        isLoading.value = false
      })
  }

  const handleVerification = () => {
    isLoading.value = true

    http().post('/api/v1/login/verify', formattedCredentials.value)
      .then(response => {
        waitingOnVerification.value = false
        localStorage.setItem('token', response.data.token)
        toast.success(response.data.message)
        router.push({
          name: 'landing'
        })
      })
      .catch(error => {
        if (error.response.status === 422) {
          toast.error(error.response.data.errors['login_code'][0])
        } else {
          toast.error(error.response.data.message)
        }
      })
      .finally(() => {
        isLoading.value = false
      })
  }
</script>

<template>
  <div class="pt-16 relative">
    <div v-if="isLoading" class="loader-overlay">
      <div class="loader"></div>
    </div>

    <div v-if="!waitingOnVerification">
      <h1 class="text-3xl font-semibold mb-4">
        Enter Your Phone Number
      </h1>
      <form @submit.prevent="handleLogin">
        <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
          <div class="bg-white px-4 py-5 sm:p-6">
            <div>
              <input
                type="text"
                name="phone"
                id="phone"
                placeholder="+880 1234-567890"
                class="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-black focus:outline-none"
                v-maska
                data-maska="+880 ####-######"
                v-model="credential.phone"
              />
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <button
              type="submit"
              class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none"
            >
              Continue
            </button>
          </div>
        </div>
      </form>
    </div>
    <div v-else>
      <h1 class="text-3xl font-semibold mb-4">
        Enter Your Login Code
      </h1>
      <form @submit.prevent="handleVerification">
        <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
          <div class="bg-white px-4 py-5 sm:p-6">
            <div>
              <input
                type="text"
                name="login_code"
                id="login_code"
                placeholder="123456"
                class="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-black focus:outline-none"
                v-maska
                data-maska="######"
                v-model="credential.login_code"
              />
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <button
              type="submit"
              class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none"
            >
              Verify
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
  .loader-overlay {
    @apply fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 flex items-center justify-center z-50;
  }

  .loader {
    @apply inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite];
  }
</style>
