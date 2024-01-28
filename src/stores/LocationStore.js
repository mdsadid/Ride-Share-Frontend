import { defineStore } from "pinia";
import { reactive } from "vue";

const getUserLocation = async () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

export let useLocationStore = defineStore('location', () => {
  const current = reactive({
    geometry: {
      lat: null,
      lng: null
    }
  })

  const updateCurrentLocation = async () => {
    const userLocation = await getUserLocation()
    current.geometry = {
      lat: userLocation.coords.latitude,
      lng: userLocation.coords.longitude
    }
  }

  const destination = reactive({
    name: '',
    address: '',
    geometry: {
      lat: null,
      lng: null
    }
  })

  const reset = () => {
    current.geometry.lat = null
    current.geometry.lng = null

    destination.name = ''
    destination.address = ''
    destination.geometry.lat = null
    destination.geometry.lng = null
  }

  return { current, destination, updateCurrentLocation, reset }
})
