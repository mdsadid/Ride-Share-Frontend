<script setup>
  import { useRouter } from "vue-router";
  import http from "@/helper/http";

  const router = useRouter()

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
</script>

<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">
      Sadid Hasan Rakib
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
        </div>
      </div>
    </div>
  </div>
</template>
