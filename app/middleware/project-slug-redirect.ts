import { albums } from "~/data/albums";

export default defineNuxtRouteMiddleware((to) => {
  const requestedSlug = String(to.params.slug ?? "");
  const legacyProject = albums.find(
    (project) => project.contentSlug === requestedSlug && project.slug !== requestedSlug,
  );

  if (!legacyProject) return;

  const lastSlash = to.path.lastIndexOf("/");
  const localizedBasePath = to.path.slice(0, lastSlash + 1);
  const queryAndHash = to.fullPath.slice(to.path.length);

  return navigateTo(`${localizedBasePath}${legacyProject.slug}${queryAndHash}`, {
    redirectCode: 301,
    replace: true,
  });
});
