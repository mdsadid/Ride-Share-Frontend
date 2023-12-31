<script setup>
  import { ref, onMounted } from "vue";
  import { useLocationStore } from "@/stores/LocationStore";
  import { useTripStore } from "@/stores/TripStore";
  import Echo from "laravel-echo";
  import Pusher from "pusher-js";

  const gMap = ref(null)
  const location = useLocationStore()
  const trip = useTripStore()
  const title = ref('Waiting For A Driver...')
  const message = ref('When a driver accepts the trip, his info will appear here.')

  const currentLocationMarker = {
    url: "https://openmoji.org/data/color/svg/1F64B-200D-2642-FE0F.svg",
    scaledSize: { width: 30, height: 30 }
  }

  onMounted(() => {
    window.Pusher = Pusher

    window.Echo = new Echo({
      broadcaster: 'pusher',
      key: import.meta.env.VITE_PUSHER_APP_KEY,
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
      wsHost: import.meta.env.VITE_PUSHER_HOST,
      wsPort: import.meta.env.VITE_PUSHER_PORT,
      forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
      disableStats: true,
      enabledTransports: ['ws', 'wss'],
    })
      .channel('trip')
      .listen('TripAccepted', (e) => {
        console.log(e.trip)
        trip.$patch(e.trip)

        title.value = 'A driver is on the way!'
        message.value = `${e.trip.driver.user.name} is coming in a ${e.trip.driver.year} ${e.trip.driver.color} ${e.trip.driver.make} ${e.trip.driver.model} with a license plate #${e.trip.driver.license_plate}`
      })
  })
</script>

<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">
      {{ title }}
    </h1>
    <div>
      <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
        <div class="bg-white px-4 py-5 sm:p-6">
          <div>
            <GMapMap :center="location.current.geometry" :zoom="14" ref="gMap" style="width: 100%; height: 256px;">
              <GMapMarker :position="location.current.geometry" :icon="currentLocationMarker"/>
            </GMapMap>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 text-left sm:px-6">
          <span>{{ message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
