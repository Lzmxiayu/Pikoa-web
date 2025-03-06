<template>
  <a-spin
    dot
    :loading="relatedList.length === 0"
    style="width: 100%; height: 100%"
  >
    <div className="related-list">
      <div
        v-for="item in relatedList"
        :key="item.bvid || Date.now()"
        class="related-item"
        @click="handleVideoItemClick(item)"
      >
        <img :alt="item.title" :src="processPic(item.pic)" />
        <p :title="item.title">{{ item.title }}</p>
      </div>
    </div>
  </a-spin>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useVideoInfoStore } from '@/stores/videoInfo';
import { storeToRefs } from 'pinia';
import { getRelatedVideos } from '@/server';
import { processPic } from '@/utils';

const videoInfoStore = useVideoInfoStore();
const { bvid } = storeToRefs(videoInfoStore);
const relatedList = ref([]);

async function getRelatedVideosFn() {
  relatedList.value = [];
  const res = await getRelatedVideos({
    bvid: bvid.value,
  });
  relatedList.value = res;
}

function handleVideoItemClick(item) {
  videoInfoStore.setBvid(item.bvid);
}
watch(
  () => bvid.value,
  () => {
    if (bvid.value) {
      getRelatedVideosFn();
    }
  },
);
</script>

<style lang="less" scoped>
.related-list {
  padding: 0 10px;
  height: 100%;
  overflow: auto;
}
.related-list::-webkit-scrollbar {
  display: none;
}
.related-item {
  display: flex;
  margin-bottom: 15px;
  border-radius: 6px;
  width: 100%;
  position: relative;
  img {
    // position: absolute;
    // top: 0;
    // left: 0;
    aspect-ratio: 16/9;
    border-radius: 6px;
    width: 160px;
    height: 90px;
  }
  p {
    margin: 0px 10px;
    // position: absolute;
    // top: 0;
    max-height: 78px;
    font-size: 15px;
    line-height: 26px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-break: anywhere;
    word-break: break-all;
    &:hover {
      color: rgb(87, 146, 255);
    }
  }
}
.related-item:hover {
  cursor: pointer;
  background: rgba(79, 79, 79, 0.1);
}

@media screen and (max-width: 1920px) {
  .related-item {
    height: 90px;
    img {
      width: 160px;
      height: 90px;
    }
    p {
      left: 255px;
    }
  }
}
@media screen and (max-width: 2560px) {
  .related-item {
    height: 108px;
    img {
      width: 192px;
      height: 108px;
    }
    p {
      left: 255px;
    }
  }
}
</style>
