<template>
  <div class="upload-file-info">
    <div class="upload-file-info-item">
      <span class="title">封面</span>
      <div class="cover">
        <div class="selected_cover">
          <a-skeleton-shape
            v-if="!cover.src"
            animation="true"
            size="large"
            style="width: 100%; height: 100%; border-radius: 10px"
          />
          <img :src="cover.src" v-else />
          </img>
          <div class="mask" @click="uploadCover">
              <icon-plus style="color: #fff" size="32" />
            </div>
        </div>
        <div class="cover-list">
          <div
            v-for="cos in covers"
            :key="cos"
            class="cover-item"
            :class="{ selected: cos.src === cover.src }"
            @click="changeCover(cos)"
          >
            <div v-if="cos.src === cover.src" class="mask">
              <icon-check style="color: #fff" size="20" />
            </div>
            <img :src="cos.src" />
          </div>
        </div>
      </div>
    </div>
    <input
      ref="coverUploadEl"
      style="width: 0; height: 0"
      type="file"
      accept="image/png, image/jpeg"
      @change="handleCoverUpload"
    />

    <div class="upload-file-info-item">
      <span class="title">标题</span>
      <a-input :model-value="title" max-length="60" @input="changeTitle" />
    </div>

    <div class="upload-file-info-item">
      <span class="title">简介</span>
      <a-textarea
        :auto-size="{
          minRows: 5,
          maxRows: 8,
        }"
      />
    </div>
    <div class="upload-file-info-button">
      <a-button type="primary" style="width: 60px; margin-right: 20px"
        >发布</a-button
      >
      <a-button type="outline" style="width: 60px" @click="cancel"
        >取消</a-button
      >
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import { IconCheck, IconPlus } from '@arco-design/web-vue/es/icon';
import { Message } from '@arco-design/web-vue';

const props = defineProps({
  covers: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: '',
  },
});

const emit = defineEmits('handle-status', 'changeTitle');

watch(
  () => props.covers,
  newVal => {
    cover.value = newVal[0];
  },
);
const cover = ref({});

function changeCover(cos) {
  cover.value = cos;
}
function changeTitle(val) {
  emit('changeTitle', val);
}

function cancel() {
  // cover.value = {};
  emit('handle-status', 0);
}

const coverUploadEl = ref(null);
function uploadCover() {
  coverUploadEl.value?.click();
}
function handleCoverUpload(e) {
  const [file] = e.target.files;
  const supportTypes = ['image/jpeg', 'image/png'];
  if (!supportTypes.includes(file.type)) {
    Message.error('请上传支持jpg和png图片');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    Message.error('图片大小不能超过10M！');
    return;
  }
  cover.value.src = URL.createObjectURL(file);
}
</script>
<style lang="less" scoped>
.upload-file-info {
  display: flex;
  flex-direction: column;
  width: 800px;
}
.upload-file-info-item {
  display: flex;
  margin-bottom: 20px;
  .title {
    width: fit-content;
    white-space: nowrap;
    margin-right: 10px;
    width: 10%;
  }
}
.cover {
  display: flex;
  position: relative;
  // overflow: hidden;
  border-radius: 5px;
  .selected_cover:hover {
    .mask {
      display: flex;
    }
  }
  .selected_cover {
    width: 180px;
    height: 120px;
    img {
      border-radius: 5px;
      width: 180px;
      height: 120px;
      background: #000;
    }
    &:hover {
      cursor: pointer;
    }
    .mask {
      border-radius: 5px;
      position: absolute;
      top: 0;
      left: 0;
      width: 180px;
      height: 120px;
      z-index: 10;
      background: rgba(0, 0, 0, 0.4);
      display: none;
      // display: flex;
      align-items: center;
      justify-content: center;
    }

  }
  .cover-list {
    flex: 1;
    display: flex;
    padding: 38px 0 0 0;
    position: relative;
    height: 120px;
    .cover-item {
      position: relative;
      border-radius: 5px;
      flex: 1;
      margin-left: 12px;
      border: 2px solid #fff;
      img {
        border-radius: 5px;
        width: 120px;
        height: 78.37px;
        background: #000;
      }
      &:hover {
        border: 2px solid #df6b6b;
        cursor: pointer;
      }
    }
    .selected {
      border: 2px solid #df6b6b;
    }
    .mask {
      flex: 1;
      position: absolute;
      width: 120px;
      height: 78.37px;
      border-radius: 5px;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.upload-file-info-button {
  display: flex;
  justify-content: center;
}
</style>
