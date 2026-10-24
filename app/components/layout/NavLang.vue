<template>
  <nav class="lang-navigation" :aria-label="$t('components.navigation.language')">
    <ul class="relative flex gap-4 p-4 text-xl lg:text-2xl uppercase">
      <li v-for="(locale) in $i18n.availableLocales" :key="`locale-${locale}`">
        <AnimationTextShadow>
          <NuxtLink :to="switchLocalePath(locale)" :lang="locale">
            {{ $t(`languages.${locale}`) }}
          </NuxtLink>
        </AnimationTextShadow>
      </li>
    </ul>
  </nav>
</template>

<script setup>
  const switchLocalePath = useSwitchLocalePath()
</script>
