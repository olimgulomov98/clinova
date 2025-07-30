import { permissions } from "@/utils/permissions";
import { useUserStore } from "@/store/auth.store";

export const usePermission = () => {
  const userStore = useUserStore();
  const userRoles = userStore.userRoles;

  const hasPermission = (resource: string, action: string) => {
    for (const role of userRoles) {
      const rolePermissions = permissions[role];

      if (!rolePermissions) continue;

      const resourcePermissions = rolePermissions[resource];

      if (resourcePermissions?.includes("*")) {
        return true;
      }

      if (resourcePermissions?.includes(action)) {
        return true;
      }
    }

    return false;
  };

  return { hasPermission };
};
