<template>
  <section class="services-page">
    <header class="container pt-28 pb-14 sm:pt-36 sm:pb-20 lg:pb-24">
      <AnimationReveal class="w-full">
        <p class="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-gray-600 sm:text-sm">
          {{ $t('pages.merch.eyebrow') }}
        </p>
      </AnimationReveal>

      <AnimationReveal class="w-full">
        <h1 class="max-w-5xl text-[clamp(3.2rem,10vw,7.5rem)] leading-[0.9]">
          {{ $t('pages.merch.title') }}
        </h1>
      </AnimationReveal>

      <AnimationReveal class="w-full">
        <p class="mt-6 max-w-3xl text-base font-normal leading-relaxed text-gray-600 sm:mt-8 sm:text-lg lg:text-xl">
          {{ $t('pages.merch.intro') }}
        </p>
      </AnimationReveal>
    </header>

    <div class="container flex flex-col gap-20 pb-24 sm:gap-24 md:gap-32 md:pb-40">
      <MerchItem
        v-for="(service, index) in services"
        :key="service.id"
        :service="service"
        :index="index"
      />
    </div>
  </section>
</template>

<script setup>
  import { services } from "~/data/merch";
  import { pageTransitionConfig } from "~/helpers/transitionConfig";

  definePageMeta({
    pageTransition: pageTransitionConfig,
  });

  const { t } = useI18n();

  useSeoMeta({
    title: `${t("pages.merch.meta.title")} | ${t("siteName")}`,
    description: t("pages.merch.meta.description"),
    ogTitle: `${t("pages.merch.meta.title")} | ${t("siteName")}`,
    ogDescription: t("pages.merch.meta.description"),
  });
</script>
