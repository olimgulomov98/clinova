import navigation from "../navigation";

export const useNavigations = () => {
  const userStore = useUserStore();
  const userRoles = computed(() => userStore.userRoles);
  const withRolesAccess = computed(() =>
    navigation.filter((item: any) =>
      item.roles.some((elem: any) => userRoles.value.includes(elem))
    )
  );
  console.log(withRolesAccess);
  return withRolesAccess.value;
};
