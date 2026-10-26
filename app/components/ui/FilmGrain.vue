<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isReady = ref(false)

onMounted(() => {
  // Deja pasar dos ciclos de renderizado antes de iniciar el fundido.
  // Esto separa el montaje del cambio de opacidad, sin bloquear la carga de medios.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      isReady.value = true
    })
  })
})
</script>

<template>
  <div
    class="film-grain-overlay"
    :class="{ 'is-ready': isReady }"
    aria-hidden="true"
  />
</template>
