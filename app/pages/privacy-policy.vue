<template>
  <section ref="privacyPageRef" class="privacy-page container place-content-center min-h-dvh prose-lg prose-h1:text-[clamp(3rem,_10vw,_4.6rem)] prose-h1:mb-0 md:text-balance">
    <h1>{{ t('pages.privacyPolicy.title') }}</h1>
    <p>{{ t('pages.privacyPolicy.p1') }}</p>
    <p>{{ t('pages.privacyPolicy.p2') }}</p>
    <p>{{ t('pages.privacyPolicy.p3') }}</p>
    <p>{{ t('pages.privacyPolicy.p4') }}</p>
    <p>{{ t('pages.privacyPolicy.p5') }}</p>
  </section>
</template>

<script setup>
  import { pageTransitionConfig } from '~/helpers/transitionConfig';
  import gsap from "gsap";
  import { SplitText } from "gsap/SplitText";

  gsap.registerPlugin(SplitText);

  definePageMeta({
    pageTransition: pageTransitionConfig,
  });

  const { t } = useI18n();
  const privacyPageRef = useTemplateRef('privacyPageRef');
  let ctx;

  useSeoMeta({
    title: `${t('pages.privacyPolicy.meta.title')} | ${t('siteName')}`,
    description: t('pages.privacyPolicy.meta.description'),
    ogTitle: `${t('pages.privacyPolicy.meta.title')} | ${t('siteName')}`,
    ogDescription: t('pages.privacyPolicy.meta.description'),
  })

  onMounted(() => {
    const contents = document.querySelectorAll('.privacy-page h1, .privacy-page p');
    ctx = gsap.context(() => {
      contents.forEach(content => {
        const contentSplit = SplitText.create(content, {
          type: 'lines, words',
          mask: 'lines'
        })
        gsap.from(contentSplit.lines, {
          duration: 1.2,
          yPercent: 150,
          ease: 'power4.inOut',
        })
      })
    }, privacyPageRef.value)
  })

  onUnmounted(() => {
    ctx.revert();
  });
</script>
