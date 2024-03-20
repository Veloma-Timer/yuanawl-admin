<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <el-tooltip class="box-item" content="选号网后台" placement="top">
        <img
          src="/images/white-logo-small.png"
          alt="元阿选号网后台"
          class="cursor-pointer"
          width="20"
          height="20"
          @click="onToXuanhao"
        />
      </el-tooltip>
      <el-divider direction="vertical" />
      <AssemblySize id="assemblySize" />
      <el-divider direction="vertical" />
      <ThemeSetting id="themeSetting" />
      <el-divider direction="vertical" />
      <Message id="message" />
      <!--<Fullscreen id="fullscreen" />-->
    </div>
    <div class="mr-2 ml-7">
      <Avatar />
    </div>
    <span class="name">{{ userStore.userInfo.name }}</span>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/modules/user";
import AssemblySize from "./components/AssemblySize.vue";
import ThemeSetting from "./components/ThemeSetting.vue";
import Message from "./components/Message.vue";
import Avatar from "./components/Avatar.vue";

const userStore = useUserStore();

const onToXuanhao = async () => {
  const url = `https://yuanawl.com/admin/alogin?phone=${userStore.userInfo.tel}`;
  window.osApi?.openUrl(url);
};
</script>

<style scoped lang="scss">
.tool-bar-ri {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 25px;
  .header-icon {
    display: flex;
    align-items: center;
    & > * {
      margin-left: 21px;
    }
  }

  .name {
    font-size: 15px;
  }
}
</style>
