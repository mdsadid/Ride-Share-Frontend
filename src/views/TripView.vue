<script setup>
  import { ref } from "vue";
  import { useLocationStore } from "@/stores/LocationStore";

  const gMap = ref(null)
  const location = useLocationStore()
</script>

<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">
      Waiting For A Driver...
    </h1>
    <div>
      <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
        <div class="bg-white px-4 py-5 sm:p-6">
          <div>
            <GMapMap :center="location.destination.geometry" :zoom="14" ref="gMap" style="width: 100%; height: 256px;"/>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 text-left sm:px-6">
          <span>When a driver accepts the trip, his info will appear here.</span>
        </div>
      </div>
    </div>
  </div>
</template>
