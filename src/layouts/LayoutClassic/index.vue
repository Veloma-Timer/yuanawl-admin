<!-- 经典布局 -->
<template>
  <el-container class="layout">
    <el-header>
      <div class="header-lf">
        <div class="logo flx-center">
          <img class="images/logo-img" src="@/assets/images/white-logo.png" alt="logo" />
        </div>
        <ToolBarLeft />
      </div>
      <div class="header-ri">
        <ToolBarRight />
      </div>
    </el-header>
    <el-container class="classic-content">
      <el-aside v-show="!isHide">
        <!--<div class="aside-box" :style="{ width: isCollapse ? '65px' : '210px' }">-->
        <div class="aside-box" :style="{ width: '140px' }">
          <el-scrollbar class="px-2">
            <el-menu
              :default-active="activeMenu"
              :router="false"
              :collapse="isCollapse"
              :collapse-transition="false"
              :unique-opened="true"
            >
              <SubMenu :menuList="menuList" />
            </el-menu>
          </el-scrollbar>
        </div>
      </el-aside>
      <el-container class="classic-main">
        <div
          v-if="globalStore.breadcrumb && $route.name !== 'home'"
          class="h-[37px] bg-white flex flex-row items-center px-3 flex-shrink-0"
        >
          <Breadcrumb id="breadcrumb" />
        </div>
        <Main />
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup lang="ts" name="layoutClassic">
import Breadcrumb from "@/layouts/components/Header/components/Breadcrumb.vue";
import ToolBarRight from "@/layouts/components/Header/ToolBarRight.vue";
import ToolBarLeft from "@/layouts/components/Header/ToolBarLeft.vue";
import SubMenu from "@/layouts/components/Menu/SubMenu.vue";
import {useGlobalStore} from "@/stores/modules/global";
import Main from "@/layouts/components/Main/index.vue";
import {useAuthStore} from "@/stores/modules/auth";
import {getParentRoute} from "@/utils/data";
import {useRoute} from "vue-router";
import {Menu} from "@/typings/menu";

const route = useRoute();
const authStore = useAuthStore();
const globalStore = useGlobalStore();
const isCollapse = computed(() => globalStore.isCollapse);

const isHide = computed(() => menuList.value.length < 1);

// 如果当前激活的是一个没有子集的
const menuList = computed<(Menu.Item & Menu.MenuRoute)[]>(() => {
  const currentRoute = authStore.flatMenuListGet.find(item => item.name === authStore.routeName)!;

  // 如果当前是一个父级, 则直接找子级即可
  if (!currentRoute.parentId) {
    return authStore.flatMenuListGet.filter(item => item.parentId === currentRoute.id) as (Menu.Item & Menu.MenuRoute)[];
  } else {
    // 如果当前是一个子集, 则找到父级, 然后拿到父级的子集
    const parentRoute = getParentRoute(currentRoute);
    return authStore.flatMenuListGet.filter(item => item.parentId === parentRoute.id) as (Menu.Item & Menu.MenuRoute)[];
  }
});

const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
