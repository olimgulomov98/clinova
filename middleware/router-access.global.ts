interface INavItem {
  title: string;
  icon: string;
  to: string;
  show?: boolean;
  roles: string[];
}
export default defineNuxtRouteMiddleware((to) => {
  const navigations = useNavigations();
  const menuCodes = computed(
    () => navigations.value?.map((elem: INavItem) => elem.to) || []
  );
  const [firstSegment] = to.path.split("/").filter(Boolean);
  const isRouteValid =
    !firstSegment ||
    menuCodes.value.find((item) => item.includes(firstSegment));
  if (!isRouteValid && !["/login"].includes(to.path))
    abortNavigation({
      statusCode: 404,
      statusMessage: `Page not found: ${to.path}`,
    });
});
