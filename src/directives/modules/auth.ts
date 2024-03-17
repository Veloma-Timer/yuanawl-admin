/**
 * v-auth
 * 按钮权限指令
 */
import { useAuthStore } from "@/stores/modules/auth";
import type { Directive, DirectiveBinding } from "vue";
import { computed } from "vue";

const auth: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    const authStore = useAuthStore();
    const authButtonList = computed(() => authStore.authButtonList ?? []);
    if (value instanceof Array && value.length) {
      const hasPermission = value.every(item => authButtonList.value.includes(item));
      if (!hasPermission) el.remove();
    } else {
      if (!authButtonList.value.includes(value)) el.remove();
    }
  }
};

export default auth;
