<template>
  <div class="img-item">
    <a-skeleton-shape
      v-if="isloading"
      animation="true"
      size="large"
      style="width: 100%; height: 100%; border-radius: 10px"
    />
    <img
      v-show="!isloading"
      :src="item?.['cover']"
      @click="jumpVideo(item)"
      @load="endLoading"
    />
    <div v-show="!isloading" class="video-desc">
      <div class="video-desc-left"></div>
      <div class="video-desc-right">
        <span>{{ view_time }}</span>
      </div>
      <div class="scroll-bar" :style="{ width: `${scrollBarWidth}%` }"></div>
    </div>
  </div>
  <template v-if="!isloading">
    <div class="title_line">
      <h3
        class="vdl-item-title"
        :title="item['title']"
        @click="jumpVideo(item)"
        v-html="item?.['title']"
      ></h3>
      <icon-delete size="24" class="deleteIcon" />
    </div>
    <div class="last_line">
      <span class="author">{{ item?.['author_name'] }}</span>
      <span class="view_at"
        ><icon-live-broadcast size="18" />{{ view_at }}</span
      >
    </div>
  </template>
  <template v-else>
    <a-skeleton-line :rows="3" :line-spacing="4" />
  </template>
</template>
<script setup>
import { computed, ref } from 'vue';
import { IconLiveBroadcast, IconDelete } from '@arco-design/web-vue/es/icon';
import { formatTime } from '@/utils';

const props = defineProps(['item']);

const isloading = ref(true);

const view_time = computed(() => {
  if (!props.item?.['progress'] || !props.item?.['duration'])
    return '00:00/00:00';
  const duration = formatTime(props.item?.['duration'] || 0);
  if (props?.item?.['progress'] === -1) return `${duration}/${duration}`;
  return formatTime(props.item?.['progress'] || 0) + '/' + duration;
});

const view_at = computed(() => {
  if (!props.item?.['timeObj']) return;
  const { month, day, hour, minute } = props.item?.['timeObj'] || {};
  return `${month}-${day} ${hour}:${minute}`;
});

const scrollBarWidth = computed(() => {
  if (!props.item?.['progress'] || !props.item?.['duration']) return 0;
  if (props?.item?.['progress'] === -1) return 100;
  return Math.ceil((props.item?.['progress'] / props.item?.['duration']) * 100);
});

function endLoading() {
  isloading.value = false;
}

function jumpVideo(item) {
  window.open(`${window.location.origin}/video?bvid=${item.history.bvid}`);
  // router.push({
  //   name: 'video',
  // })
}
</script>

<style lang="less" scoped>
.videolist-item {
  box-sizing: border-box;
  min-width: 251px;
  padding: 0 8px;
  height: auto;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: calc(100% / 6);
}

.img-item {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 10px;
  position: relative;
  z-index: 10;
  overflow: hidden;
  margin-bottom: 5px;
  // border: 1px solid #ffffff;
  &:hover {
    cursor: pointer;
  }
}
img,
video {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.video-desc {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  position: absolute;
  bottom: 0px;
  left: 0px;
  padding: 10px 10px;
  background-image: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
  z-index: 10;
  span {
    font-size: 16px;
    line-height: 1.2;
  }
  &-left {
    display: flex;
    align-items: center;
  }
  &-right {
    display: flex;
    align-items: center;
  }
}

.vdl-item-title {
  width: 100%;
  text-align: start;
  height: 44px;
  overflow: hidden;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  line-height: 22px;
  font-size: 15px;
  font-weight: 500;
  margin: 0;
  &:hover {
    color: #00aeec;
    cursor: pointer;
  }
}

.scroll-bar {
  position: absolute;
  left: 0;
  bottom: 0;
  background: rgb(110, 187, 217);
  height: 5px;
  border-radius: 4px;
  pointer-events: none;
  z-index: 5;
}
.title_line {
  display: flex;
  // align-items: center;
}
.deleteIcon:hover {
  cursor: pointer;
  color: #00aeec;
}
.last_line {
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
}
.author,
.view_at {
  text-align: start;
  color: var(--font-color2);
  font-size: 14px;
  line-height: 20px;
}
.author:hover {
  cursor: pointer;
}
.view_at {
  display: flex;
  align-items: center;
}
</style>
