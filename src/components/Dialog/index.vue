<template>
  <el-dialog
    v-bind="attrs"
    :fullscreen="fullscreen"
    :show-close="false"
    align-center
    :class="['ds-dialog', fullscreen ? 'fullscreen' : 'not-fullscreen', isMini && 'minisize']"
    ref="elDialogRef"
    :modal="!isMini"
    :close-on-click-modal="!isMini"
  >
    <template #header="headerProps">
      <span>
        {{ attrs.title }}
      </span>
      <div class="header-right gap-2 items-center">
        <el-icon size="18" class="el-icon--left" @click="setFullscreen(!fullscreen)">
          <FullScreen v-if="!fullscreen" />
          <Minus v-else />
        </el-icon>

        <el-icon size="22" class="el-icon--left" @click="headerProps.close">
          <Close />
        </el-icon>
      </div>
      <slot name="header" v-bind="headerProps"></slot>
    </template>
    <slot name="default"></slot>
    <template #footer="footerProps">
      <slot name="footer" v-bind="footerProps"></slot>
    </template>
  </el-dialog>
</template>
<script name="DsDialog" lang="ts" setup>
import { getCurrentInstance, ref } from "vue";
import { FullScreen, Minus } from "@element-plus/icons-vue";
interface IProps {
  defaultFullscreen: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  defaultFullscreen: false
});
const ctx = getCurrentInstance();
const { attrs } = ctx!;
const fullscreen = ref(props.defaultFullscreen);
const setFullscreen = (status: boolean) => {
  fullscreen.value = status;
};
let elDialogRef = ref({});
let isMini = ref(false);
</script>
<style lang="scss">
.ds-dialog {
  display: flex;
  flex-direction: column;
  margin: 0;
  &.minisize {
    position: absolute;
    bottom: 0;
    left: 2%;
    width: 160px;
    height: 48px;
    overflow: hidden;
    .el-dialog__header {
      justify-content: flex-start;
    }
  }
  .el-dialog__header {
    position: relative;
    display: flex;
    align-items: center;
    height: 48px;
    padding: 12px;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: normal;
    .header-right {
      position: absolute;
      right: 0;
      display: flex;
      justify-content: center;
      cursor: pointer;
    }
  }
  .el-dialog__body {
    flex: 1;
  }
  .red {
    color: v-bind(color);
  }

  --s: 1000;
  .dialog-footer {
    $scale: calc(var(--s) / 1262);

    text-align: center;
    .el-button {
      // width: percentage(calc(161/1262));
      width: calc(160px * $scale);
      height: calc(48px * $scale);
    }
    .el-button + .el-button {
      margin-left: 24px;
    }
  }
  &.not-fullscreen {
  }
}
</style>
