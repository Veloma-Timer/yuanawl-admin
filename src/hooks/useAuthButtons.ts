import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/modules/auth";
// @ts-ignore
const callbackMap = (enumData: any, key: string) => {
  if (!enumData) return;
  const children = [];
  for (let node of enumData) {
    if (node.name === key) {
      children.push(...node.operation);
    } else if (node.children && node.children.length > 0) {
      children.push(...callbackMap(node.children, key));
    }
  }
  return children;
};
/**
 * @description 页面按钮权限
 * */
export const useAuthButtons = () => {
  const route = useRoute();
  const authStore = useAuthStore();
  const authButtonListGet = authStore.authButtonList || [];
  const authButtons = callbackMap(authButtonListGet, route.name as string);
  const BUTTONS = computed(() => {
    let currentPageAuthButton: { [key: string]: boolean } = {};
    // @ts-ignore
    authButtons.forEach(item => (currentPageAuthButton[item.key] = item.value));
    return currentPageAuthButton;
  });

  return {
    BUTTONS,
    callbackMap
  };
};
