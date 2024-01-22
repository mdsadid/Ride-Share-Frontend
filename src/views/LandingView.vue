<script setup>
  import { onMounted, reactive } from "vue";
  import { useRouter } from "vue-router";
  import http from "@/helper/http";
  import { useToast } from "vue-toastification";

  const user = reactive({
    name: null,
    phone: null
  })

  const router = useRouter()
  const toast = useToast()

  onMounted(() => {
    http().get('/api/v1/user')
      .then(response => {
        let userInfo = response.data.data

        user.name = userInfo.name
        user.phone = userInfo.phone
      })
  })

  const handleStartDriving = () => {
    http().get('/api/v1/driver')
      .then(response => {
        if (response.data.data.driver) {
          router.push({
            name: 'standby'
          })
        } else {
          router.push({
            name: 'driver'
          })
        }
      })
      .catch(error => {
        console.error(error.response.data)
      })
  }

  const handleFindRide = () => {
    router.push({
      name: 'location'
    })
  }

  const handleLogout = () => {
    http().post('/api/v1/logout')
      .then(response => {
        localStorage.removeItem('token')
        toast.success(response.data.message)
        router.push({
          name: 'login'
        })
      })
      .catch(error => {
        console.error(error.response.data)
      })
  }
</script>

<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">
      {{ user.name ?? 'User' }}
    </h1>
    <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
      <div class="bg-white px-4 py-5 sm:p-6">
        <div class="flex justify-between">
          <button
            class="rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none"
            @click="handleStartDriving"
          >
            Start Driving
          </button>
          <button
            class="rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none"
            @click="handleFindRide"
          >
            Find A Ride
          </button>
          <button
              class="rounded-md border border-transparent bg-red-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none"
              @click="handleLogout"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
