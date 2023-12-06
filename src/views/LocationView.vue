<script setup>
  import { useLocationStore } from "@/stores/LocationStore";
  import { useRouter } from "vue-router";
  import { useToast } from "vue-toastification";

  let location = useLocationStore()
  let router = useRouter()
  const toast = useToast()

  const handleLocationChanged = (event) => {
    location.$patch({
      destination: {
        name: event.name,
        address: event.formatted_address,
        geometry: {
          lat: event.geometry.location.lat(),
          lng: event.geometry.location.lng()
        }
      }
    })
  }

  const handleSelectedLocation = () => {
    if (location.destination.name === '') {
      toast.warning('Please select a location')
    } else {
      router.push({
        name: 'map'
      })
    }
  }
</script>

<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">
      Where Are You Going?
    </h1>
    <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
      <div class="bg-white px-4 py-5 sm:p-6">
        <div>
          <GMapAutocomplete
            placeholder="Enter Destination"
            @place_changed="handleLocationChanged"
            class="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-black focus:outline-none"
          ></GMapAutocomplete>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
        <button
          type="button"
          class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none"
          @click="handleSelectedLocation"
        >
          Find A Ride
        </button>
      </div>
    </div>
  </div>
</template>
