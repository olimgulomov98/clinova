import { useRoute, useRouter } from "vue-router";
import { toRaw } from "vue";

interface IFilterObject {
  value: {
    [status: string]: string | number | boolean;
  };
}
export function useQuerySync(objectToSync: IFilterObject, refreshCallback?: () => void) {
  const route = useRoute();
  const router = useRouter();
  const firstFilter = { ...objectToSync.value };
  const previousFilter = ref({ ...objectToSync.value });

  function updateQuery(pagination?: boolean | undefined) {
    const newState = toRaw(objectToSync.value);
    const diffKeys = getDiffKeys(previousFilter.value, { ...newState });

    if (diffKeys.length === 0) return;

    if (!(diffKeys.length === 1 && diffKeys.includes("page"))) objectToSync.value.page = 1;

    previousFilter.value = { ...newState };

    router
      .replace({
        query: pagination
          ? sanitizeQuery({ ...route.query, page: newState.page, size: newState.size })
          : { ...clean({...route.query, ...newState}) },
      })
      .then(() => {
        refreshData();
      });
  }

  function clearQuery() {
    objectToSync.value = { ...firstFilter };
    previousFilter.value = { ...firstFilter };

    const query = removeKeys(route.query, firstFilter);
    router
      .replace({
        query: { ...query },
      })
      .then(() => {
        refreshData();
      });
  }

  function refreshData() {
    if (refreshCallback) refreshCallback();
  }

  return { updateQuery, clearQuery, previousFilter };
}
type LocationQueryValueRaw = string | number | null | undefined;
type LocationQueryRaw = Record<string, LocationQueryValueRaw | LocationQueryValueRaw[]>;
function sanitizeQuery(obj: Record<string, string | number | boolean>): LocationQueryRaw {
  const result: LocationQueryRaw = {};
  for (const key in obj) {
    const val = obj[key];
    if (val === undefined || val === null) continue;
    if (typeof val === "boolean") {
      result[key] = val ? "true" : "false";
    } else {
      result[key] = val;
    }
  }
  return result;
}
