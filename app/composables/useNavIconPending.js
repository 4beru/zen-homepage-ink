// Keep the nav icon hidden in SSR HTML until the route preloader takes control.
export const useNavIconPending = () => {
  const route = useRoute();
  return useState('navIconPending', () => Boolean(route.meta.hasPreloader));
};
