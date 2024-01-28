<script setup>
  import { ref, onMounted } from "vue";
  import { useLocationStore } from "@/stores/LocationStore";
  import { useTripStore } from "@/stores/TripStore";
  import Echo from "laravel-echo";
  import Pusher from "pusher-js";
  import { useRouter } from "vue-router";

  const gMap = ref(null)
  const location = useLocationStore()
  const trip = useTripStore()
  const title = ref('Waiting For A Driver...')
  const message = ref('When a driver accepts the trip, his info will appear here.')
  const router = useRouter()

  const currentLocationMarkerUrl = ref("https://openmoji.org/data/color/svg/1F64B-200D-2642-FE0F.svg")

  const driverLocationMarker = {
    url: "https://openmoji.org/data/color/svg/1F697.svg",
    scaledSize: { width: 30, height: 30 }
  }

  const updateMapBounds = mapObject => {
    let passengerPoint = new google.maps.LatLng(location.current.geometry),
        driverPoint = new google.maps.LatLng(trip.driver_location),
        latLngBounds = new google.maps.LatLngBounds()

    latLngBounds.extend(passengerPoint)
    latLngBounds.extend(driverPoint)

    mapObject.fitBounds(latLngBounds)
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
      .channel('passenger_trip')
      .listen('TripAccepted', e => {
        trip.$patch(e.trip)

        title.value = 'A Driver Is On The Way!'
        message.value = `${e.trip.driver.user.name} is coming in a ${e.trip.driver.year} ${e.trip.driver.color} ${e.trip.driver.make} ${e.trip.driver.model} with a license plate #${e.trip.driver.license_plate}`
      })
      .listen('TripLocationUpdated', e => {
        trip.$patch(e.trip)

        gMap.value.$mapPromise.then(mapObject => {
          updateMapBounds(mapObject)
        })
      })
      .listen('TripStarted', e => {
        trip.$patch(e.trip)

        /*
         * comment: update the current location & the destination location
         * comment: when passenger get picked up, then the passenger location & the driver location will be same (which will be the origin point)
         * comment: but the destination point has to be changed. so we need to swap passenger current location with trip destination
         */
        location.$patch({
          current: {
            geometry: e.trip.destination
          }
        })

        // comment: change the destination map marker
        currentLocationMarkerUrl.value = "https://openmoji.org/data/color/svg/1F68F.svg"

        title.value = "You're On Your Way!"
        message.value = `You are heading to ${e.trip.destination_name}`
      })
      .listen('TripEnded', e => {
        trip.$patch(e.trip)

        title.value = "You've Arrived!"
        message.value = `Hope you enjoyed your trip with ${e.trip.driver.user.name}`

        setTimeout(() => {
          location.reset()
          trip.reset()

          router.push({
            name: 'landing'
          })
        }, 10000)
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
              <GMapMarker :position="location.current.geometry" :icon="{ url: currentLocationMarkerUrl, scaledSize: { width: 30, height: 30 } }"/>
              <GMapMarker v-if="trip.driver_location" :position="trip.driver_location" :icon="driverLocationMarker"/>
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
