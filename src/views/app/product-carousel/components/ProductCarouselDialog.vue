<template>
  <el-dialog
    v-model="drawerVisible"
    :title="`${drawerProps.title}`"
    width="35%"
    top="12vh"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      ref="ruleFormRef"
      label-width="90px"
      label-suffix=" :"
      :rules="rules"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="名称" clearable />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="drawerProps.row!.sort" placeholder="排序" clearable />
      </el-form-item>
      <el-form-item label="备注" prop="desc">
        <el-input
          :autosize="{ minRows: 3, maxRows: 5 }"
          type="textarea"
          resize="none"
          v-model="drawerProps.row!.desc"
          placeholder="备注"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="关联商品" prop="productId">
        <el-tree-select
          v-model="drawerProps.row!.productId"
          ref="treeSelectRef"
          remote
          lazy
          filterable
          :load="load"
          :data="treeData"
          :props="treeProps"
          :render-after-expand="true"
        >
          <!--:remote-method="remoteSearch"-->
          <template #default="{ data: { name, isLeaf, icon, number } }">
            <div v-if="!isLeaf" class="flex items-center gap-1">
              <img :src="icon" width="20" height="20" />
              <span>{{ name }}</span>
            </div>
            <div v-else class="flex items-center gap-1">
              <el-image
                style="width: 20px; height: 20px"
                fit="cover"
                :src="icon"
                :preview-src-list="[icon]"
                @click.prevent.stop
              />
              <el-tooltip :content="name" :show-after="1000" placement="top">
                <p class="text-ellipsis overflow-hidden" style="width: 280px">【{{ number }}】{{ name }}</p>
              </el-tooltip>
            </div>
          </template>
        </el-tree-select>
      </el-form-item>
      <el-form-item label="图片" prop="picture">
        <div v-if="drawerProps.row.picture" class="relative">
          <el-image
            style="width: 100px; height: 100px"
            :src="drawerProps.row.picture"
            :preview-src-list="[drawerProps.row.picture]"
          >
          </el-image>
          <el-popconfirm title="确认删除吗?" @confirm="onDelPicture">
            <template #reference>
              <div
                class="backdrop-blur-xl absolute top-0 right-0 bg-white/30 hover:bg-black/10 shadow-lg rounded-full w-[20px] h-[20px] flex justify-center items-center cursor-pointer"
              >
                <el-icon><Close /></el-icon>
              </div>
            </template>
          </el-popconfirm>
        </div>

        <el-button v-else @click="onUpload">点击上传</el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, ElTreeSelect, FormInstance } from "element-plus";
import { getProductsByType } from "@/api/modules/app/yuanawlAdmin";
import { YuanawlAdmin } from "@/typings/yuanawlAdmin";
import { Close } from "@element-plus/icons-vue";
import useUploader from "@/hooks/useUploader";
import { debounce, formatUrl } from "@/utils";
import { OSS_PREFIX } from "@/config";
import { App } from "@/typings/app";

const props = defineProps<{
  gameTypes: YuanawlAdmin.IType[];
}>();

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<App.IProductCarouselInstance>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const rules = {
  name: [{ required: true, message: "请输入名称" }],
  picture: [{ required: true, message: "请上传图片" }],
  productId: [{ required: true, message: "请选择商品" }]
};

const treeProps = {
  label: "name",
  value: "id",
  children: "children",
  isLeaf: "isLeaf"
};

const treeSelectRef = ref<InstanceType<typeof ElTreeSelect>>();

const treeData = ref<
  Record<
    keyof typeof treeProps & {
      id: string | number;
    },
    any
  >[]
>([]);

const uploader = useUploader();
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

const onUpload = async () => {
  const { data } = await uploader.uploadStream('img');
  drawerProps.value.row.picture = OSS_PREFIX + data.fileName;
};

const onDelPicture = () => {
  drawerProps.value.row.picture = "";
};

// 懒加载
const load = async (node: any, resolve: any) => {
  if (node.isLeaf) return resolve([]);

  if (node.level < 1) {
    resolve(props.gameTypes);
  } else {
    const { data } = await getProductsByType(node.data.id, 1, 10);
    const nodes = data.map(item => ({
      ...item,
      icon: formatUrl(item.icon)
    }));
    resolve(nodes);
  }
};

// const remoteSearch = debounce((query: string) => {
//   // 调用接口查询
//
//   treeData.value = [
//     {
//       id: 1,
//       name: "测试",
//       isLeaf: false,
//       icon: "",
//       children: [
//         { id: 2, name: "测试-1", isLeaf: true, icon: "" },
//         { id: 3, name: "测试-2", isLeaf: true, icon: "" },
//         { id: 4, name: "测试-3", isLeaf: true, icon: "" }
//       ]
//     },
//     {
//       id: 5,
//       name: "测试2",
//       isLeaf: false,
//       icon: "",
//       children: [
//         { id: 2, name: "测试2-1", isLeaf: true, icon: "" },
//         { id: 3, name: "测试2-2", isLeaf: true, icon: "" },
//         { id: 4, name: "测试2-3", isLeaf: true, icon: "" }
//       ]
//     }
//   ];
// }, 500);

defineExpose({
  acceptParams
});
</script>
<style scoped lang="scss">
.edit-btn {
  div {
    color: var(--el-color-white) !important;
  }
}
</style>
