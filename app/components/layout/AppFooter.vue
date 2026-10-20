<template>
  <footer ref="footerMainRef" class="footer-main bg-black">
    <div class="bg-white mt-0 rounded-b-3xl">
      <FooterFaq class="mb-16 sm:mb-28 lg:mb-16" />
      <AppLogo class="relative z-20 fill-black mx-auto lg:mx-0 w-3/4 xl:w-1/2" />
    </div>
    <div class="relative z-20 bg-black h-[250px] [clip-path:inset(0_0_0_0)]">
      <div ref="footerContentRef" class="footer-content fixed left-0 bottom-0 h-[250px] w-full flex flex-col items-center lg:items-start text-center lg:text-left gap-5 pt-8 pb-6 md:pt-10 md:pb-8 md:px-14 bg-black text-white">
        <div class="footer-clock w-full font-semibold text-[clamp(1rem,2.8vw,2rem)] leading-[1.08] tracking-[-0.035em]" aria-live="off">
          <p>
            <span class="block">Buenos Aires {{ clock.time }}</span>
            <span class="block">{{ clock.date }} ({{ clock.offset }})</span>
          </p>
        </div>
        <div class="copyright flex flex-col lg:flex-row gap-2.5 [&_a]:anim-underline-white">
          <p>&copy; {{ currentYear }} zen space <span class="inline-block ml-2.5">&pi; <NuxtLinkLocale to="/privacy">{{ $t('footer.privacy') }}</NuxtLinkLocale></span></p>
          <p>&infin; {{ $t('footer.siteBy') }} <a href="https://www.aberu.site">aberu.site</a>
            <DanHummingbird />
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
  const currentYear = new Date().getFullYear();
  const timeZone = 'America/Argentina/Buenos_Aires';
  const clock = ref({
    time: '--:--:-- --',
    date: 'Loading local date',
    offset: 'GMT -03',
  });

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const offsetFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'longOffset',
  });

  let clockInterval;

  function updateClock() {
    const now = new Date();
    const offset = offsetFormatter
      .formatToParts(now)
      .find((part) => part.type === 'timeZoneName')?.value;
    const offsetMatch = offset?.match(/^GMT([+-])(\d{2}):(\d{2})$/);

    clock.value = {
      time: timeFormatter.format(now),
      date: dateFormatter.format(now),
      offset: offsetMatch
        ? `GMT ${offsetMatch[1]}${offsetMatch[2]}${offsetMatch[3] === '00' ? '' : `:${offsetMatch[3]}`}`
        : offset?.replace('GMT', 'GMT ') ?? 'GMT -03',
    };
  }

  onMounted(() => {
    updateClock();
    clockInterval = window.setInterval(updateClock, 1000);
  });

  onUnmounted(() => {
    window.clearInterval(clockInterval);
  });
</script>
