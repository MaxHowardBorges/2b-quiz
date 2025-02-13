import router from '@/router/index';

export function getRoutes() {
  return router
    .getRoutes()
    .filter((route) => !route.meta.disabled && route.meta.inMenu);
}

export function getPublicRoutes() {
  return getRoutes().filter((route) => route.meta.public);
}

export function getAllRoutes(userRole) {
  return getRoutes().filter((route) => {
    if (route.path.includes(':idSession')) {
      route.path = route.path.replace(':idSession', '');
    }
    if (route.meta.roles) {
      return route.meta.roles.includes(userRole);
    }
    return true;
  });
}

export async function serverError() {
  await router.push({ name: 'menu.home', query: { serverError: 'true' } });
}
