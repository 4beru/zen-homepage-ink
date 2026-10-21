<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isReady = ref(false)

onMounted(() => {
  // Primer frame: el navegador procesa el DOM hidratado y rasteriza el SVG en GPU (con opacity: 0)
  requestAnimationFrame(() => {
    // Segundo frame: la pantalla blanca ya está pintada; inicia la transición suave a opacity: 0.224
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
