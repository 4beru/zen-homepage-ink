// Initialize from route metadata so SSR hides the interface on preloader routes.
export const usePreloader = () => {
  const route = useRoute();
  const released = useState('preloaderReleased', () => !route.meta.hasPreloader);

  const hold = () => { released.value = false; };
  const release = () => { released.value = true; };

  return { released, hold, release };
};
