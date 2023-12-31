import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export let useTripStore = defineStore('trip', () => {
  const id = ref(null)
  const user_id = ref(null)

  const origin = reactive({
    lat: null,
    lng: null
  })

  const destination = reactive({
    lat: null,
    lng: null
  })

  const destination_name = ref('')

  const is_started = ref(false)
  const is_completed = ref(false)

  const driver = reactive({
    id: null,
    year: null,
    make: null,
    model: null,
    color: null,
    license_plate: null,
    user: {
      name: null,
    }
  })

  const reset = () => {
    id.value = null
    user_id.value = null

    origin.lat = null
    origin.lng = null

    destination.lat = null
    destination.lng = null

    destination_name.value = null

    is_started.value = false
    is_completed.value = false

    driver.id = null
    driver.year = null
    driver.make = null
    driver.model = null
    driver.color = null
    driver.license_plate = null
    driver.user.name = null
  }

  return {
    id,
    user_id,
    origin,
    destination,
    destination_name,
    reset,
    is_started,
    is_completed,
    driver,
  }
})
