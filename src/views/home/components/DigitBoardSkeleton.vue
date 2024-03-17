<template>
  <div class="mt-[5px] rounded w-full">
    <el-skeleton :style="{ width: '100%', background: 'white', height: '152px' }" animated>
      <template #template>
        <div style="padding: 14px" class="flex flex-col">
          <el-skeleton-item variant="p" style="width: 50%" />
          <el-skeleton-item variant="p" style="width: 30%" class="mt-1 mb-3" />
          <el-skeleton-item variant="p" style="width: 60%; margin-right: 16px" />
          <el-skeleton-item variant="p" class="mt-2" style="width: 80%; margin-right: 16px" />
        </div>
      </template>
    </el-skeleton>
  </div>
</template>
