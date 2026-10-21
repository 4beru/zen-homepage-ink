<template>
  <footer ref="footerMainRef" class="footer-main bg-black">
    <div class="bg-white mt-0 rounded-b-3xl">
      <FooterFaq class="mb-16 sm:mb-28 lg:mb-16" />
      <AppLogo class="relative z-20 fill-black mx-auto lg:mx-0 w-3/4 xl:w-1/2" />
    </div>

    <!-- Altura adaptada en mobile (235px) y 250px en desktop -->
    <div class="relative z-20 bg-black h-[235px] md:h-[250px] [clip-path:inset(0_0_0_0)]">
      <div
        ref="footerContentRef"
        class="footer-content fixed left-0 bottom-0 h-[235px] md:h-[250px] w-full flex flex-col justify-center items-center lg:items-start text-center lg:text-left gap-4 md:gap-7 px-6 md:px-14 bg-black text-white"
      >
        <!-- Bloque 1: Reloj -->
        <div
          class="footer-clock w-full font-semibold text-[clamp(1.2rem,2.8vw,2rem)] leading-[1.12] tracking-[-0.035em]"
          aria-live="off"
        >
          <p class="flex flex-col gap-0.5">
            <span class="block">{{ $t('footer.location') }} {{ clock.time }}</span>
            <span class="block text-white/75">{{ clock.date }} ({{ clock.offset }})</span>
          </p>
        </div>

        <!-- Bloque 2: Barra inferior -->
        <div
          class="w-full flex flex-col lg:flex-row items-center lg:justify-between gap-3.5 lg:gap-6"
        >
          <!-- Izquierda: Copyright y créditos -->
          <div
            class="copyright flex flex-col lg:flex-row items-center gap-1.5 lg:gap-6 text-sm md:text-base [&_a]:anim-underline-white"
          >
            <p class="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-1">
              <span>&copy; {{ currentYear }} ZEN SPACE Studio</span>
              <span class="inline-flex items-center gap-1">
                &pi; <NuxtLinkLocale to="/privacy">{{ $t('footer.privacy') }}</NuxtLinkLocale>
              </span>
            </p>

            <p class="inline-flex items-center justify-center lg:justify-start gap-1.5">
              <span>&infin; {{ $t('footer.siteBy') }} <a href="https://www.aberu.site">aberu.site</a></span>
              <DanHummingbird />
            </p>
          </div>

          <!-- Derecha (Desktop) / Abajo de todo (Mobile): Email estilo Monolog -->
          <!-- pl-0 pr-4 (16px a la derecha) + translate-x-2 en hover (8px) = centrado exacto (8px izq / 8px der) -->
          <a
            data-hover-highlight="link"
            data-track="email"
            :href="'mailto:hello@zenspace.lat?subject=' + encodeURIComponent($t('footer.emailSubject'))"
            class="footer_middle_email group relative isolate inline-flex items-center pl-0 pr-4 py-1 text-base md:text-lg font-medium leading-snug tracking-[-0.02em] transition-colors ease-out focus-visible:outline-none text-white duration-300 hover:text-black hover:duration-150 focus-visible:text-black focus-visible:duration-150 motion-reduce:transition-none"
          >
            <!-- Fondo blanco con entrada rápida (150ms) y salida desvanecida (500ms) -->
            <span
              aria-hidden="true"
              class="pointer-events-none absolute inset-0 -z-10 bg-white opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-hover:duration-150 group-focus-visible:opacity-100 group-focus-visible:duration-150 motion-reduce:transition-none"
            ></span>

            <!-- Texto pegado a la izquierda en reposo (translate-x-0) que viaja al centro en hover (translate-x-2) -->
            <span
              data-hover-heading=""
              class="relative z-10 block translate-x-0 will-change-transform underline decoration-current decoration-1 underline-offset-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none"
            >
              ⮡ hello@zenspace.lat
            </span>
          </a>
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
    date: '',
    offset: 'GMT -03',
  });

  const { locale } = useI18n();
  const clockLocale = computed(() => {
    if (locale.value === 'es') return 'es-ES';
    if (locale.value === 'zh-CN') return 'zh-CN';
    return 'en-GB';
  });

  const timeFormatter = computed(() => new Intl.DateTimeFormat(clockLocale.value, {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: locale.value !== 'zh-CN',
  }));

  const dateFormatter = computed(() => new Intl.DateTimeFormat(clockLocale.value, {
    timeZone,
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }));

  const offsetFormatter = new Intl.DateTimeFormat('en-GB', {
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
      time: timeFormatter.value.format(now),
      date: dateFormatter.value.format(now),
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
