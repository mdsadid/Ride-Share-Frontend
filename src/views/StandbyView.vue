<script setup>
  import { onMounted, ref } from "vue";
  import AppLoader from "@/components/AppLoader.vue";
  import Echo from "laravel-echo";
  import Pusher from "pusher-js";
  import { useTripStore } from "@/stores/TripStore";

  const title = ref('Waiting For Ride Request...')
  const trip = useTripStore()
  const gMap = ref(null)

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
      .channel('trips')
      .listen('TripCreated', (e) => {
        title.value = 'Ride Has Requested'
        trip.$patch(e.trip)

        setTimeout(() => {
          initMapDirection()
        }, 2000)
      })
  })

  const initMapDirection = () => {
    gMap.value.$mapPromise.then(mapObject => {
      let originPoint = new google.maps.LatLng(trip.origin),
          destinationPoint = new google.maps.LatLng(trip.destination),
          directionsService = new google.maps.DirectionsService(),
          directionsDisplay = new google.maps.DirectionsRenderer({
            map: mapObject
          })

      directionsService.route({
        origin: originPoint,
        destination: destinationPoint,
        avoidTolls: false,
        avoidHighways: false,
        travelMode: google.maps.TravelMode.DRIVING
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(result)
        } else {
          console.error(status)
        }
      })
    })
  }
</script>

<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">
      {{ title }}
    </h1>
    <div v-if="!trip.id" class="mt-8 flex justify-center">
      <AppLoader/>
    </div>
    <div v-else>
      <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
        <div class="bg-white px-4 py-5 sm:p-6">
          <div>
            <GMapMap :zoom="14" :center="trip.destination" ref="gMap" style="width: 100%; height: 256px;"/>
          </div>
          <div class="mt-4">
            <p class="text-xl">
              Going to <strong>{{ trip.destination_name }}</strong>
            </p>
          </div>
        </div>
        <div class="flex justify-between bg-gray-50 px-4 py-3 text-right sm:px-6">
          <button class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none">
            Accept
          </button>
          <button class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none">
            Decline
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
