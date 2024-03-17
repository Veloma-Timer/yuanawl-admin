<template>
  <div class="tree-box">
    <el-tree :data="dataList" :props="defaultProps" class="h-full overflow-y-auto" default-expand-all>
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span v-if="!data.leaf">
            {{ node.label }}
          </span>
          <el-link v-else @click="setRouter(data)">{{ node.label }}</el-link>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { getUserTree } from "@/api/modules/user";
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const defaultProps = {
  children: "children",
  label: "name"
};
const setRouter = data => {
  router.push({
    path: "/homeStandby/index",
    query: {
      id: data.id
    }
  });
};
let dataList = ref([]);
const getTableList = () => {
  getUserTree().then(res => {
    const { data } = res as object;
    dataList.value = data.list;
  });
};
getTableList();
</script>
<style scoped lang="scss">
.tree-box {
  padding: 20px;
  height: calc(100% - 130px);
  .custom-tree-node {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
    font-size: 14px;
  }
}
</style>
