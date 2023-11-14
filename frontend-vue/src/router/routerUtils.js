import router from '@/router/index';

export function getPublicRoutes() {
  return router.getRoutes().filter((route) => route.meta.public);
}

export function getAllRoutes() {
  return router.getRoutes().filter((route) => !route.meta.public);
}

export async function serverError() {
  await router.push({ name: 'Login', query: { serverError: 'true' } });
}
