<template>
  <NuxtLayout>
    <section class="error-page xl:w-1/2 container flex flex-col justify-center gap-8 min-h-dvh md:text-balance">
      <p class="text-sm uppercase">{{ $t('errors.status', { statusCode: error?.statusCode ?? 500 }) }}</p>
      <div v-if="error?.statusCode === 404" class=" prose-lg prose-h1:m-0 prose-h1:text-5xl md:prose-h1:text-6xl prose-p:leading-normal">
        <h1>{{ $t('errors.notFoundTitle') }}</h1>
        <p class="text-2xl mt-2">{{ $t('errors.notFoundLead') }}</p>
        <p>{{ $t('errors.notFoundBody') }}</p>
        <p>{{ $t('errors.notFoundInvite') }}</p>
        <p>{{ $t('errors.tagline') }}</p>
      </div>
      <div v-else>
        <p class="text-2xl">{{ $t('errors.genericMessage') }}</p>
      </div>
      <NuxtLinkLocale to="/" class="w-fit">{{ $t('errors.backHome') }}</NuxtLinkLocale>
    </section>
  </NuxtLayout>
  <FilmGrain />
</template>

<script setup>
  import gsap from "gsap";
  import { SplitText } from "gsap/SplitText";

  gsap.registerPlugin(SplitText);

  const error = useError();

  onMounted(() => {
    const contents = document.querySelectorAll('.error-page');
    contents.forEach(content => {
      const contentSplit = SplitText.create(content, {
        type: 'words',
        mask: 'words'
      })
      gsap.from(contentSplit.words, {
        duration: 1,
        stagger: 0.02,
        y: 60,
        ease: 'power4.inOut',
      })
    })
  })
</script>
