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
      <div class="header-right">
        <el-icon size="22" class="el-icon--left" @click="setFullscreen(!fullscreen)">
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
import { getCurrentInstance, nextTick, ref, useSlots } from "vue";
import { FullScreen, Minus, ArrowDown, ArrowUp } from "@element-plus/icons-vue";
let slots = useSlots();
interface IProps {
  defaultFullscreen: boolean;
}
let props = withDefaults(defineProps<IProps>(), {
  defaultFullscreen: false
});
let ctx = getCurrentInstance();
let { attrs } = ctx!;
let fullscreen = ref(props.defaultFullscreen);
let setFullscreen = (status: boolean) => {
  fullscreen.value = status;
};
let elDialogRef = ref({});
let dialogWidth = 10000;
let isMini = ref(false);
function onOpen() {
  nextTick(() => {
    let $el = elDialogRef.value.dialogContentRef.$el;
    $el.isFullScreen = fullscreen.value;
    if (fullscreen.value) {
      $el.style.left = "0%";
      $el.style.top = "0%";
      return;
    }
    if (isMini.value) {
      $el.style.left = "10%";
      $el.style.top = "80%";
    } else {
      $el.style.left = "0%";
      $el.style.top = "10%";
    }
  });
}

function minimize() {
  isMini.value = !isMini.value;
  setFullscreen(isMini.value);
  // nextTick(() => {
  onOpen();
  // })
}
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
      // padding: 12px 0;
      justify-content: flex-start;
    }
  }
  .el-dialog__header {
    position: relative;
    display: flex;
    align-items: center;
    height: 48px;
    padding: 12px;
    margin: 0;
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
