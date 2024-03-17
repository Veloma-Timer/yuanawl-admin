<template>
  <el-dialog
    v-model="visible"
    width="40%"
    :destroy-on-close="true"
    :title="`${title}${typeName}`"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      ref="formRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :model="form"
      :hide-required-asterisk="isView"
      :validate-on-rule-change="false"
    >
      <el-row>
        <el-col v-if="!isEmpty(form.parentId)">
          <el-form-item label="上级菜单" prop="parentId">
            <el-tree-select
              v-model="form.parentId"
              :data="menuList"
              :props="{ value: 'id', label: 'title', children: 'children' }"
              value-key="id"
              placeholder="选择上级菜单"
              check-strictly
            />
          </el-form-item>
        </el-col>
        <el-col v-if="!isEmpty(form.parentId)">
          <el-form-item label="类型" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio v-for="{ label, value } of typeOptions" :label="value" :key="value">{{ label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="typeName + '图标'" prop="icon">
            <SelectIcon v-model:icon-value="form.icon" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="typeName + '名称'" prop="title">
            <el-input v-model="form.title" :placeholder="`请填写${typeName}名称`" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="sort">
            <el-input v-model="form.sort" type="number" placeholder="请填写显示顺序" clearable />
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="form.type === 'M'">
          <el-form-item prop="name">
            <template #label>
              <span>
                <el-tooltip content="访问的路由名称，如：`user`" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                路由名称
              </span>
            </template>
            <el-input v-model="form.name" placeholder="请输入路由名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.type === 'M'">
          <el-form-item prop="path">
            <template #label>
              <span>
                <el-tooltip content="访问的路由地址，如：`/user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                路由地址
              </span>
            </template>
            <el-input v-model="form.path" placeholder="请输入路由地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.type === 'M'">
          <el-form-item prop="component">
            <template #label>
              <span>
                <el-tooltip content="访问的组件路径，如：`/user/index`，默认在`views`目录下" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                组件路径
              </span>
            </template>
            <el-input v-model="form.component" placeholder="请输入组件路径" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="perms">
            <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
            <template #label>
              <span>
                <el-tooltip content="鉴权时用到的菜单或者按钮标识，如：`user:list`，`user:add`" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                权限字符
              </span>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.type === 'M'">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                是否外链
              </span>
            </template>
            <el-radio-group v-model="form.isLink">
              <el-radio v-for="({ label, value }, index) of common_yes_no" :key="index" :label="value">{{ label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.type === 'M'">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                是否缓存
              </span>
            </template>
            <el-radio-group v-model="form.isKeepAlive">
              <el-radio v-for="({ label, value }, index) of common_yes_no" :key="index" :label="value">{{ label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.type === 'M'">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                是否隐藏
              </span>
            </template>
            <el-radio-group v-model="form.isHide">
              <el-radio v-for="({ label, value }, index) of common_yes_no" :key="index" :label="value">{{ label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio v-for="({ label, value }, index) of common_status" :key="index" :label="value">{{ label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="setVisible(false)">取消</el-button>
      <el-button v-show="!isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="MenuModal">
import SelectIcon from "@/components/SelectIcon/index.vue";
import { ElMessage, FormInstance } from "element-plus";
import { computed, reactive, ref, toRefs } from "vue";
import { getMenuList } from "@/api/modules/menu";
import { useDict } from "@/hooks/useDict";
import { Menu } from "@/typings/menu";
import { Dict } from "@/typings/dict";
import { isEmpty } from "@/utils/is";

interface IState {
  title: string;
  isView: boolean;
  form: Partial<Menu.Item>;
  common_status: Dict.IDataItem[];
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const typeOptions = [
  { label: "菜单", value: "M" },
  { label: "按钮", value: "B" }
];

const { common_yes_no } = useDict("common_yes_no");

const visible = ref(false);

const formRef = ref<FormInstance>();

const state = reactive<IState>({
  isView: false,
  title: "",
  common_status: [],
  form: {}
});
const menuList = ref<Menu.Item[]>([]);

const { form, title, isView, common_status } = toRefs(state);

const typeName = computed(() => typeOptions.find(item => item.value === form.value.type)?.label);

const rules = computed(() => ({
  title: [{ required: true, message: `请填写${typeName.value}名称`, trigger: "blur" }],
  appCode: [{ required: true, message: `请选择应用名称`, trigger: "change" }],
  path: [{ required: true, message: "请填写路由地址", trigger: "blur" }],
  name: [{ required: true, message: "请填写路由名称", trigger: "blur" }],
  perms: [{ required: true, message: "请填写权限标识", trigger: "blur" }]
}));

const setVisible = (val: boolean) => {
  visible.value = val;
};

const getMenuAllList = async () => {
  const { data } = await getMenuList();
  menuList.value = data;
};

// 接收父组件传过来的参数
const acceptParams = async (params: IState) => {
  getMenuAllList();
  Object.assign(state, params);
  setVisible(true);
};

// 提交数据（新增/编辑）
const handleSubmit = () => {
  formRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await state.api!(form.value);
      ElMessage.success({ message: `${title.value}菜单成功！` });
      state.getTableList!();
      setVisible(false);
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>
