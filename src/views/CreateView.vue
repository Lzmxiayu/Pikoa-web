<template>
  <div class="create-wrap">
    <div class="upload-create-area">
      <UploadDragger
        ref="uploadDragger"
        @handle-status="handleStatus"
        @update-file-edit-info="updateFileEditInfo"
      />
      <div style="margin-left: 40px">
        <InfoEdit
          v-if="status === 1"
          :covers="coverlist"
          :title="editTitle"
          @handle-status="handleStatus"
          @change-title="changeTitle"
        />
      </div>
      <div v-if="status === 0" class="file-management-rect">
        <icon-drive-file size="88" color="#696161" style="margin-top: 100px" />
        <h1>稿件管理</h1>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import { IconDriveFile } from '@arco-design/web-vue/es/icon';
import UploadDragger from '@/components/UploadDragger/index.vue';
import InfoEdit from '@/components/UploadDragger/InfoEdit.vue';
import { ref } from 'vue';

const status = ref(0);
const uploadDragger = ref(null);

const editTitle = ref('');
const coverlist = ref([]);
function updateFileEditInfo({ covers = [], title = '' }) {
  coverlist.value = covers || [];
  editTitle.value = title;
}
function changeTitle(val) {
  editTitle.value = val;
}

function handleStatus(flag) {
  if (flag === 1) status.value = flag;
  if (flag === 0) {
    location.reload();
    return;
    coverlist.value = [];
    editTitle.value = '';
    uploadDragger.value.reset();
  }
}
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
