<template>
  <div class="create-wrap">
    <div class="upload-create-area">
      <UploadDragger />
      <div class="file-management-rect">
        <icon-drive-file size="88" color="#696161" style="margin-top: 100px" />
        <h1>稿件管理</h1>
      </div>
    </div>
  </div>
</template>
<script setup>
import { IconDriveFile } from '@arco-design/web-vue/es/icon'
import UploadDragger from '@/components/UploadDragger/index.vue'
</script>
<style lang="less" scoped>
.create-wrap,
.upload-create-area {
  width: 100%;
  height: 100vh;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.file-management-rect {
  width: 600px;
  height: 400px;
  border: 1px dashed #696161;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  color: #696161;
  margin-left: 40px;
  &:hover {
    cursor: pointer;
    background: #bcbbbb;
    color: #fff;
  }
}
</style>
