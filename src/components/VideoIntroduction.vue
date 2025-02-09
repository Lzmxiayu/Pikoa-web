<template>
  <div class="video-desc">
    <!-- <h1>{{ baseInfo?.title || '' }}</h1> -->
    <!-- <div class="header-info-desc">
      <span>{{
        baseInfo?.stat?.view ? '观看: ' + baseInfo?.stat?.view : ' '
      }}</span>
      <span>{{
        baseInfo?.stat?.danmaku ? '弹幕: ' + baseInfo?.stat?.danmaku : ' '
      }}</span>
      <span>{{
        baseInfo?.ctime
          ? '上传时间: ' + timestampToDate(baseInfo?.ctime * 1000)
          : ' '
      }}</span>
    </div> -->
    <div class="description">
      <!-- <br /> -->
      <span>{{ baseInfo?.desc || '' }}</span>
    </div>
  </div>
</template>
<script setup>
import { timestampToDate } from '@/utils/index';
const props = defineProps(['baseInfo']);
</script>

<style lang="less" scoped>
.video-desc {
  width: 100%;
  height: 100%;
  padding: 0 16px;
  margin-bottom: 20px;
  h1 {
    margin: 0;
    margin-bottom: 10px;
    line-height: 1.2;
  }
}
.header-info-desc {
  span {
    color: #d8d8d8;
    margin-right: 8px;
  }
}
.description {
  color: #4f4f4f;
  font-size: 15px;
  white-space: pre-line;
  letter-spacing: 0;
  overflow: auto;
  height: 100%;
}
</style>
