<template>
  <div class="tool-bar-lf">
    <ul class="flex flex-row items-center gap-5 h-full">
      <li
        v-for="menu in menus"
        :key="menu.id"
        :class="[
          'cursor-pointer h-full menu-item menu-text',
          { active: routeName === menu.name, 'font-medium': routeName === menu.name }
        ]"
        @click="toModule(menu)"
      >
        <span class="text-sm font-normal hover:text-white">{{ menu.title }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {useAuthStore} from "@/stores/modules/auth";
import {getParentRoute} from "@/utils/data";
import {useRouter} from "vue-router";
import {Menu} from "@/typings/menu";

const router = useRouter();

const authStore = useAuthStore();

const menus = computed<(Menu.MenuRoute & Menu.Item)[]>(() => {
  return authStore.flatMenuListGet.filter(item => !item?.parentId && item.name !== "personal-analysis" && !item.meta.isHide) as any as (Menu.MenuRoute &
    Menu.Item)[];
});

const routeName = computed(() => {
  const currentRoute = authStore.flatMenuListGet.find(item => item.name === authStore.routeName)!;

  // 如果没有父级则直接返回
  if (!currentRoute?.parentId) return currentRoute.name;

  // 如果有父级则递归寻找父节点
  return getParentRoute(currentRoute).name;
});

// 如果点击的是顶部按钮则直接设置
const toModule = (menu: Menu.MenuRoute & Menu.Item) => {
  // 这里不应该设置menu.name, 应该找到第一个子级， 然后设置子级路由, 并且做路由跳转
  const children = authStore.flatMenuListGet.filter(item => item?.parentId === menu.id);
  let name: string;

  if (children.length < 1) {
    name = menu.name;
  } else {
    name = children[0].name;
  }
  authStore.setRouteName(name);
  router.push({name: name});
};
</script>

<style scoped lang="scss">
.tool-bar-lf {
  display: flex;
  height: 55px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;
}

.menu-text {
  color: rgba(255, 255, 255, 0.7);
}

.menu-item {
  line-height: 55px;
  border-bottom-style: solid;
  border-bottom-color: transparent;
  border-bottom-width: 3px;
}

.active {
  color: white;
  border-bottom-color: white;
}
</style>
