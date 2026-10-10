<template>
  <div class="awwwards-embed relative w-full aspect-video cursor-pointer group bg-gray-900" @click="loadVideo">
    
    <!-- Imagen de portada (opcional). Awwwards no tiene una URL predecible para miniaturas como YT -->
    <img v-if="!videoLoaded && posterUrl" :src="posterUrl" class="w-full h-full object-cover" :alt="alt" loading="lazy">
    
    <!-- Botón de Play Overlay -->
    <div v-if="!videoLoaded" class="absolute inset-0 flex items-center justify-center bg-black/40">
      <svg class="w-30 h-30 group-hover:scale-110 transition-all duration-400 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>

    <!-- Reproductor de video nativo de HTML5 -->
    <video 
      v-if="videoLoaded" 
      class="w-full h-full" 
      controls 
      autoplay 
      playsinline
      :src="videoUrl"
    >
      Tu navegador no soporta el elemento de video.
    </video>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  videoUrl: {
    type: String,
    required: true
    // Ejemplo: 'https://assets.awwwards.com/awards/element/2026/09/6aa27a0f57ee7498913273.mp4'
  },
  posterUrl: {
    type: String,
    default: ''
    // Puedes pasar la URL de una imagen si quieres una miniatura antes de darle play
  },
  alt: {
    type: String,
    default: 'Awwwards video preview'
  }
});

const videoLoaded = ref(false);

const loadVideo = () => {
  videoLoaded.value = true;
};
</script>
