<template>
  <article class="container grid grid-cols-1 xl:grid-cols-2 gap-16 min-h-[calc(100dvh-100px)] mt-[100px]">
      <aside>
        <AlbumArtwork :content="content" />
      </aside>
      <section>
        <header>
          <AnimationReveal>
            <NuxtLinkLocale to="music" class="inline-block lowercase">{{ $t('pages.music.labels.back') }}</NuxtLinkLocale>
          </AnimationReveal>
          <AnimationReveal>
            <h1>{{ content.title }}</h1>
          </AnimationReveal>
          <AnimationReveal>
            <time class="text-2xl" :datetime="String(content.year)">{{ content.year }}</time>
          </AnimationReveal>
        </header>

        <div class="content prose-lg lg:prose-xl prose-h1:m-0 prose-h1:text-7xl prose-h2:text-xl lg:prose-h2:text-2xl prose-h2:normal-case prose-h2:mb-0 prose-ul:ps-4 prose-ul:prose-li:m-1 prose-ul:prose-li:p-0 prose-ol:list-decimal prose-img:m-0 text-pretty">
          <section class="flex flex-col gap-5">
            <AnimationReveal v-if="content.recordLabel">
              <div class="flex items-baseline gap-2 text-base">
                <span class="opacity-60">{{ $t('pages.music.labels.recordLabel') }}</span>
                <span>{{ content.recordLabel }}</span>
              </div>
            </AnimationReveal>

            <AnimationReveal v-if="post" class="w-full">
              <ContentRenderer :value="post" />
            </AnimationReveal>

            <AnimationReveal v-if="content.social.length" class="w-full">
              <div class="flex flex-col sm:flex-row gap-4">
                <span v-for="social in content.social" :key="social.label" class="flex items-center gap-2">
                  <Icon :name="social.icon" />
                  <a :href="social.link" target="_blank" rel="noopener noreferrer">{{ $t('pages.music.labels.socialLinks') }} {{ social.label }}</a>
                </span>
              </div>
            </AnimationReveal>

            <AnimationReveal v-if="content.videos.youtube.length" class="w-full">
              <div class="videos flex flex-col gap-6">
                <div v-for="video in content.videos.youtube" :key="video.id" class="flex flex-col gap-1">
                  <h2>{{ video.title }}</h2>
                  <YoutubeEmbed :video-id="video.id" :alt="video.title" />
                </div>
              </div>
            </AnimationReveal>
          </section>
        </div>
      </section>
  </article>
</template>

<script setup>
  import { pageTransitionFadeConfig } from '~/helpers/transitionConfig';
  import { albums } from "~/data/albums";

  definePageMeta({
    pageTransition: pageTransitionFadeConfig,
  });

  const config = useRuntimeConfig()
  const { locale } = useI18n()
  const slug = useRoute().params.slug
  const { data: post } = await useAsyncData(slug, () => {
    return queryCollection('music').path(`/${locale.value}/music/${slug}`).first()
  })

  const content = albums.find(album => album.slug === slug)
  if (!content) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  }

  useSeoMeta({
    title: `${content.title} | Zen Space`,
    description: content.meta.description,
    ogTitle: `${content.title} | Zen Space`,
    ogDescription: content.meta.description,
    ogType: 'website',
    ogImage: `${config.public.appUrl}/albums/${slug}/${content.images.cover}`,
    ogImageAlt: `${content.title} - project cover`,
    ogImageWidth: 1000,
    ogImageHeight: 900,
  })
</script>
