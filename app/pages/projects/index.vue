<template>
  <div>
    <PreloaderLight v-if="!isPageLoaded" target=".albums-list" :text1="$t('pages.projects.preloader.text1')" :text2="$t('pages.projects.preloader.text2')" @done="isPageLoaded = true" @destroyed="disableScroll" />
    <h1 class="sr-only">{{ $t('pages.projects.title') }}</h1>
    <AlbumsList :play="isPageLoaded" />
  </div>
</template>

<script setup>
  import { pageTransitionConfig } from '~/helpers/transitionConfig';
  import { disableScroll, enableScroll } from '~/utils/scrollLock.js';

  definePageMeta({
    // layout: 'full-screen',
    pageTransition: pageTransitionConfig,
    hideFooter: true,
  });

  const { t } = useI18n();
  const isPageLoaded = ref(false);

  useSeoMeta({
    title: `${t('pages.projects.meta.title')} | ${t('siteName')}`,
    description: t('pages.projects.meta.description'),
    ogTitle: `${t('pages.projects.meta.title')} | ${t('siteName')}`,
    ogDescription: t('pages.projects.meta.description'),
  })

  onMounted(() => {
    disableScroll();
  })

  onUnmounted(() => {
    enableScroll();
  })
</script>
