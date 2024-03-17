<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="900px" :show-close="false">
    <template #header>
      <Header :title="`${drawerProps.title}用户`" class="header" style="transform: translateY(7px)"></Header>
      <el-button type="primary" @click="edit" class="edit-btn">
        <div>编辑</div>
      </el-button>
    </template>
    <el-form
      ref="ruleFormRef"
      label-width="160px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="订单编号" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请输入订单编号" clearable />
      </el-form-item>
      <el-form-item label="游戏分类" prop="gender">
        <el-input v-model="drawerProps.row!.name" placeholder="请输入游戏分类" clearable />
      </el-form-item>
      <el-form-item label="标题" prop="idCard">
        <el-input v-model="drawerProps.row!.idCard" placeholder="请输入标题" clearable />
      </el-form-item>
      <el-form-item label="回收人姓名" prop="email">
        <el-input v-model="drawerProps.row!.email" placeholder="请输入回收人姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="回收时间" prop="address">
        <el-date-picker v-model="drawerProps.row!.email" type="date" placeholder="请选择回收时间" />
      </el-form-item>
      <el-form-item label="回收价格" prop="email">
        <el-input v-model="drawerProps.row!.email" placeholder="请输入回收人姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="发布人姓名" prop="email">
        <el-input v-model="drawerProps.row!.email" placeholder="请输入回收人姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="发布时间" prop="email">
        <el-date-picker v-model="drawerProps.row!.email" type="date" placeholder="请选择回收时间" />
      </el-form-item>
      <el-form-item label="出售人姓名" prop="email">
        <el-input v-model="drawerProps.row!.email" placeholder="请输入回收人姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="出售时间" prop="email">
        <el-date-picker v-model="drawerProps.row!.email" type="date" placeholder="请选择回收时间" />
      </el-form-item>
      <el-form-item label="出售价格" prop="email">
        <el-input v-model="drawerProps.row!.email" placeholder="请输入回收人姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="游戏分类" prop="gender">
        <el-input v-model="drawerProps.row!.name" placeholder="请输入游戏分类" clearable />
      </el-form-item>
      <el-form-item label="标题" prop="idCard">
        <el-input v-model="drawerProps.row!.idCard" placeholder="请输入标题" clearable />
      </el-form-item>
      <el-form-item label="编号" prop="email">
        <el-input v-model="drawerProps.row!.email" placeholder="请输入编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="address">
        <el-input v-model="drawerProps.row!.address" placeholder="请输入账号" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="email">
        <el-input v-model="drawerProps.row!.email" placeholder="请输入密码" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号/邮箱密保" prop="address">
        <el-input v-model="drawerProps.row!.address" placeholder="请输入手机号/邮箱密保" clearable></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="email">
        <el-input v-model="drawerProps.row!.email" placeholder="请输入备注" clearable></el-input>
      </el-form-item>
      <el-form-item label="有无二次" prop="address">
        <el-input v-model="drawerProps.row!.address" placeholder="请输入有无二次" clearable></el-input>
      </el-form-item>
      <el-form-item label="资料是否存档" prop="email">
        <el-input v-model="drawerProps.row!.email" placeholder="请输入资料是否存档" clearable></el-input>
      </el-form-item>
      <el-form-item label="账号描述" prop="address">
        <el-input v-model="drawerProps.row!.address" placeholder="请输入账号描述" clearable></el-input>
      </el-form-item>
      <el-form-item label="账号状态" prop="email">
        <el-input v-model="drawerProps.row!.email" placeholder="请输入账号状态" clearable></el-input>
      </el-form-item>
      <el-form-item label="营地号" prop="address">
        <el-input v-model="drawerProps.row!.address" placeholder="请输入营地号" clearable></el-input>
      </el-form-item>
      <el-form-item label="网站上传" prop="email">
        <el-input v-model="drawerProps.row!.email" placeholder="请输入网站上传" clearable></el-input>
      </el-form-item>
      <el-form-item label="交易猫上架" prop="address">
        <el-input v-model="drawerProps.row!.address" placeholder="请输入交易猫上架" clearable></el-input>
      </el-form-item>
      <el-form-item label="交易猫UID" prop="email">
        <el-input v-model="drawerProps.row!.email" placeholder="请输入交易猫UID" clearable></el-input>
      </el-form-item>
      <el-form-item label="冒险等级/贵族等级" prop="address">
        <el-input v-model="drawerProps.row!.address" placeholder="请输入冒险等级/贵族等级" clearable></el-input>
      </el-form-item>
      <el-form-item label="账号等级" prop="email">
        <el-input v-model="drawerProps.row!.email" placeholder="请输入账号等级" clearable></el-input>
      </el-form-item>
      <el-form-item label="人物金/S忍数量" prop="address">
        <el-input v-model="drawerProps.row!.address" placeholder="请输入人物金/S忍数量" clearable></el-input>
      </el-form-item>
      <el-form-item label="武器金/A忍数" prop="email">
        <el-input v-model="drawerProps.row!.email" placeholder="请输入武器金/A忍数" clearable></el-input>
      </el-form-item>
      <el-form-item label="战力值" prop="address">
        <el-input v-model="drawerProps.row!.address" placeholder="请输入战力值：" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { User } from "@/api/interface";
import Header from "@/components/Header/index.vue";

const rules = reactive({
  avatar: [{ required: true, message: "请上传用户头像" }],
  photo: [{ required: true, message: "请上传用户照片" }],
  name: [{ required: true, message: "请输入用户姓名" }],
  gender: [{ required: true, message: "请选择性别" }],
  idCard: [{ required: true, message: "请输入身份证号" }],
  email: [{ required: true, message: "请输入邮箱" }],
  address: [{ required: true, message: "请输入居住地址" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<User.ResUserList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
const edit = () => {
  drawerProps.value.isView = false;
};
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
      ElMessage.success({ message: `${drawerProps.value.title}用户成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

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
