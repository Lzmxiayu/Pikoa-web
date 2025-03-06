<template>
  <div v-if="baseInfo?.desc" class="video-desc">
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
    <!-- <div class="description"> -->
    <!-- <br /> -->
    <span>{{ baseInfo?.desc || '' }}</span>
    <!-- </div> -->
  </div>
</template>
<script setup>
defineProps(['baseInfo']);
</script>

<style lang="less" scoped>
.video-desc {
  width: 100%;
  height: 100%;
  padding: 0 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  border: 1px #000 dashed;
  h1 {
    margin: 0;
    margin-bottom: 10px;
    line-height: 1.2;
  }
  span {
    overflow: hidden;
  }
}
.header-info-desc {
  span {
    color: var(--font-color2);
    margin-right: 8px;
  }
}
.description {
  color: var(--font-color2);
  font-size: 15px;
  white-space: pre-line;
  letter-spacing: 0;
  overflow: auto;
  height: 100%;
}
</style>
