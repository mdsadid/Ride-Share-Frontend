<script setup>
  import { useLocationStore } from "@/stores/LocationStore";
  import { ref, onMounted, onUnmounted } from "vue";
  import http from "@/helper/http";
  import { useTripStore } from "@/stores/TripStore";
  import { useToast } from "vue-toastification";

  const location = useLocationStore()
  const gMap = ref(null)
  const trip = useTripStore()
  const toast = useToast()
  const intervalRef = ref(null)

  const currentLocationMarker = {
    url: "https://openmoji.org/data/color/svg/1F697.svg",
    scaledSize: { width: 30, height: 30 }
  }

  const destinationLocationMarker = {
    url: "https://openmoji.org/data/color/svg/1F64B-200D-2642-FE0F.svg",
    scaledSize: { width: 30, height: 30 }
  }

  const updateMapBounds = mapObject => {
    let originPoint = new google.maps.LatLng(location.current.geometry),
        destinationPoint = new google.maps.LatLng(location.destination.geometry),
        latLngBounds = new google.maps.LatLngBounds()

    latLngBounds.extend(originPoint)
    latLngBounds.extend(destinationPoint)

    mapObject.fitBounds(latLngBounds)
  }

  const broadcastDriverPosition = () => {
    http().patch(`/api/v1/trip/${trip.id}/location`, {
      driver_location: location.current.geometry
    })
      .then(response => {
        console.log(response.data)
      })
      .catch(error => {
        if (error.response.status === 422) {
          toast.error(error.response.data.errors['driver_location'][0])
        } else {
          toast.error(error.response.data.message)
        }
      })
  }

  onMounted(() => {
    // comment: make a center position between driver and passenger
    gMap.value.$mapPromise.then(mapObject => {
      updateMapBounds(mapObject)

      intervalRef.value = setInterval(async () => {
        // comment: update the driver's current position
        await location.updateCurrentLocation()

        // comment: update the driver's current position in the database
        broadcastDriverPosition()

        // comment: update the map bounds
        updateMapBounds(mapObject)
      }, 5000)
    })
  })

  onUnmounted(() => {
    clearInterval(intervalRef.value)

    intervalRef.value = null
  })
</script>

<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">
      Driving To Passenger...
    </h1>
    <div>
      <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto">
        <div class="bg-white px-4 py-5 sm:p-6 text-left">
          <div>
            <GMapMap :zoom="14" :center="location.current.geometry" style="width: 100%; height: 256px;" ref="gMap">
              <GMapMarker :position="location.current.geometry" :icon="currentLocationMarker"/>
              <GMapMarker :position="location.destination.geometry" :icon="destinationLocationMarker"/>
            </GMapMap>
          </div>
          <div class="mt-4">
            <p class="text-xl">
              Going To <strong>Pick Up A Passenger</strong>
            </p>
          </div>
        </div>
        <div class="flex justify-center bg-gray-50 px-4 py-3 sm:px-6">
          <button
            class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none"
            v-if="trip.is_started"
          >
            Complete Trip
          </button>
          <button
            class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none"
            v-else
          >
            Passenger Picked Up
          </button>
        </div>
      </div>
      <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
        <div class="bg-white px-4 py-5 sm:p-6">
          Tada
        </div>
      </div>
    </div>
  </div>
</template>
