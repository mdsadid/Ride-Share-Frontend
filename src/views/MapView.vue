<script setup>
  import { useLocationStore } from "@/stores/LocationStore";
  import { onMounted, ref } from "vue";
  import { useRouter } from "vue-router";
  import http from "@/helper/http";
  import { useToast } from "vue-toastification";

  const location = useLocationStore()
  const router = useRouter()
  const toast = useToast()

  const gMap = ref(null)

  onMounted(async () => {
    // comment: send the user to the location page when no destination has set
    if (location.destination.name === '') {
      router.push({
        name: 'location'
      })
    }

    // comment: get the current location of the user
    await location.updateCurrentLocation()

    // comment: draw a path on the map
    gMap.value.$mapPromise.then(mapObject => {
      let currentPoint = new google.maps.LatLng(location.current.geometry),
          destinationPoint = new google.maps.LatLng(location.destination.geometry),
          directionsService = new google.maps.DirectionsService(),
          directionsDisplay = new google.maps.DirectionsRenderer({
            map: mapObject
          })

      directionsService.route({
        origin: currentPoint,
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
  })

  const handleConfirmTrip = () => {
    let data = {
      origin: location.current.geometry,
      destination: location.destination.geometry,
      destination_name: location.destination.name
    }

    http().post('/api/v1/trip', data)
      .then(response => {
        toast.success(response.data.message)
        router.push({
          name: 'trip'
        })
      })
      .catch(error => {
        toast.error(error.response.data.message)
      })
  }
</script>

<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">
      Here's Your Trip
    </h1>
    <div>
      <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
        <div class="bg-white px-4 py-5 sm:p-6">
          <div class="mb-6">
            <GMapMap :center="location.destination.geometry" :zoom="11" style="width: 100%; height: 256px;" ref="gMap">
              <GMapMarker :position="location.destination.geometry"/>
            </GMapMap>
          </div>
          <div class="mt-4">
            <p class="text-xl">
              Going to <strong>{{ location.destination.name }}</strong>
            </p>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <button
            type="button"
            class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none"
            @click="handleConfirmTrip"
          >
            Let's Go
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
