<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="label"
    class="button_wrap group relative isolate inline-flex items-center overflow-hidden rounded-[2px] bg-white text-left font-bold tracking-[-0.02em] text-black cursor-pointer transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none"
    :class="sizeStyles.button"
  >
    <span class="button_text_wrap relative z-10 block overflow-hidden py-0.5">
      <span class="button_text block font-bold leading-none [text-shadow:0_1.25em_0_currentColor] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[1.25em] group-focus-visible:-translate-y-[1.25em] motion-reduce:transition-none">
        {{ label }}
      </span>
    </span>

    <span
      class="button_aside relative z-10 flex shrink-0 items-center justify-center overflow-hidden rounded-[2px] text-white"
      :class="sizeStyles.aside"
      aria-hidden="true"
    >
      <span class="button_aside_bg absolute inset-0 rounded-[2px] bg-black transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[0.92] group-focus-visible:scale-[0.92] motion-reduce:transition-none"></span>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 12 12"
        fill="none"
        class="button_arrow relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[160%] group-hover:-translate-y-[160%] group-focus-visible:translate-x-[160%] group-focus-visible:-translate-y-[160%] motion-reduce:transition-none"
        :class="sizeStyles.arrow"
      >
        <path d="M8.90954 9.09046L9 3L2.90954 3.09046L2.90213 4.32367L6.86437 4.25391L2.55914 8.55914L3.44086 9.44086L7.74609 5.13563L7.68708 9.10862L8.90954 9.09046Z" fill="currentColor" />
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 12 12"
        fill="none"
        class="button_arrow is-entering absolute z-10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] -translate-x-[160%] translate-y-[160%] group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 motion-reduce:transition-none"
        :class="sizeStyles.arrow"
      >
        <path d="M8.90954 9.09046L9 3L2.90954 3.09046L2.90213 4.32367L6.86437 4.25391L2.55914 8.55914L3.44086 9.44086L7.74609 5.13563L7.68708 9.10862L8.90954 9.09046Z" fill="currentColor" />
      </svg>
    </span>
  </a>
</template>

<script setup>
  const props = defineProps({
    label: {
      type: String,
      default: "Tell us your story",
    },
    href: {
      type: String,
      default: "https://cal.com/aberu-ar-pei6iq/intro-call-w-aberu",
    },
    size: {
      type: String,
      default: "md",
      validator: (value) => ["sm", "md", "lg"].includes(value),
    },
  })

  const sizeVariants = {
    sm: {
      button: "gap-2.5 sm:gap-3 py-1.5 pl-3 pr-1.5 sm:py-2 sm:pl-3.5 sm:pr-2 text-lg sm:text-xl",
      aside: "h-8 w-8 sm:h-9 sm:w-9",
      arrow: "h-4 w-4 sm:h-[18px] sm:w-[18px]",
    },
    md: {
      button: "gap-3.5 sm:gap-4 py-2 pl-3.5 pr-2 sm:py-2.5 sm:pl-4 sm:pr-2.5 text-2xl sm:text-3xl",
      aside: "h-10 w-10 sm:h-11 sm:w-11",
      arrow: "h-[18px] w-[18px] sm:h-5 sm:w-5",
    },
    lg: {
      button: "gap-4 sm:gap-5 py-2.5 pl-5 pr-2.5 sm:py-3 sm:pl-6 sm:pr-3 text-3xl sm:text-4xl",
      aside: "h-12 w-12 sm:h-14 sm:w-14",
      arrow: "h-6 w-6 sm:h-7 sm:w-7",
    },
  }

  const sizeStyles = computed(() => sizeVariants[props.size] ?? sizeVariants.md)
</script>
