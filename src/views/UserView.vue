<script setup>
  import { reactive } from "vue";
  import http from "@/helper/http";
  import { useToast } from "vue-toastification";
  import { useRouter } from "vue-router";

  const userInfo = reactive({
    name: '',
  })

  const validationErrors = reactive({
    name: '',
  })

  const toast = useToast()
  const router = useRouter()

  const handleUpdateUser = () => {
    // comment: clear previous validation errors
    for (const key in validationErrors) {
      validationErrors[key] = ''
    }

    http().patch('/api/v1/user', userInfo)
      .then(response => {
        toast.success(response.data.message)
        router.push({
          name: 'location'
        })
      })
      .catch(error => {
        if (error.response.status === 422) {
          const errors = error.response.data.errors

          for (const key in errors) {
            validationErrors[key] = errors[key][0]
          }
        } else {
          console.error(error.response)
        }
      })
  }
</script>

<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">
      User Information
    </h1>
    <form @submit.prevent="handleUpdateUser">
      <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
        <div class="bg-white px-4 py-5 sm:p-6">
          <div>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Full Name"
              class="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-black focus:outline-none"
              v-model="userInfo.name"
            />
            <div class="mt-2 text-red-500 text-sm" v-if="validationErrors.name">
              {{ validationErrors.name }}
            </div>
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
</template>
