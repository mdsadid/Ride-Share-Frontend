<script setup>
  import { useLocationStore } from "@/stores/LocationStore";
  import { ref, onMounted } from "vue";

  const location = useLocationStore()
  const gMap = ref(null)

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

  onMounted(() => {
    // comment: make a center position between driver and passenger
    gMap.value.$mapPromise.then(mapObject => {
      updateMapBounds(mapObject)

      setInterval(() => {
        // comment: update the driver's current position and update map bounds
        updateMapBounds(mapObject)
      }, 5000)
    })
  })
</script>

<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">
      Driving To Passenger...
    </h1>
    <div>
      <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
        <div class="bg-white px-4 py-5 sm:p-6">
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
        <div class="flex justify-between bg-gray-50 px-4 py-3 text-right sm:px-6">
          <button class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none">
            Complete Trip
          </button>
          <button class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none">
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
