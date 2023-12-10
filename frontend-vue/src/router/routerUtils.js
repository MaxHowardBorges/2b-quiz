import router from '@/router/index';

export function getRoutes() {
  return router.getRoutes().filter((route) => !route.meta.disabled);
}

export function getPublicRoutes() {
  return getRoutes().filter((route) => route.meta.public);
}

export function getAllRoutes() {
  return getRoutes();
}

export async function serverError() {
  await router.push({ name: 'Home', query: { serverError: 'true' } });
}
