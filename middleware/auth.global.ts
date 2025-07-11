export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useUserStore();
  const isAuthenticated = authStore.isAuthenticated;
  
   if (isAuthenticated && ["login"].includes(to.name as string)) {
    return navigateTo("/");
  }
  
  if (!isAuthenticated && !["login"].includes(to.name as string)) {
    return navigateTo("/login");
  }
});
