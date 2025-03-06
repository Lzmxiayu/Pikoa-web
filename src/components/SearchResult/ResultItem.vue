<template>
  <div class="img-item" @mouseenter="previewVideo" @mouseleave="exitPreview">
    <a-skeleton-shape
      v-if="isloading"
      animation="true"
      size="large"
      style="width: 100%; height: 100%; border-radius: 10px"
    />
    <img
      v-show="!isloading && !isPreViewing"
      :src="item?.['pic']"
      @click="jumpVideo(item)"
      @load="endLoading"
    />
    <div v-show="!isloading && !isPreViewing" class="video-desc">
      <div class="video-desc-left">
        <icon-live-broadcast size="22" style="margin-right: 5px" />
        <span>{{ playdesciption(item?.['play']) }}</span>
        <icon-dice size="22" style="margin-left: 5px; margin-right: 5px" />
        <span>{{ item?.['danmaku'] }}</span>
      </div>
      <div class="video-desc-right">
        <span>{{ item?.['duration'] }}</span>
      </div>
    </div>
    <video
      v-show="isPreViewing"
      ref="video"
      class="videoPlayer"
      @click="jumpVideo(item)"
      @load="endLoading"
    ></video>
  </div>
  <template v-if="!isloading">
    <h3
      class="vdl-item-title"
      :title="item['title']"
      @click="jumpVideo(item)"
      v-html="item?.['title']"
    ></h3>
    <span class="author" @click="jumpSpace(item)">{{ item?.['author'] }}</span>
  </template>
  <template v-else>
    <a-skeleton-line rows="3" line-spacing="4" />
  </template>
</template>
<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { IconLiveBroadcast, IconDice } from '@arco-design/web-vue/es/icon';
import { getVideoView, getPlayList } from '@/server';
import initialize from '@/components/videoPlayer/mse.js';

const dashjs = window.dashjs;

const props = defineProps(['item']);

const isloading = ref(true);
const isPreViewing = ref(false);
const video = ref(null);
const videoPlayer = ref(null);
const baseInfo = ref({});
const playConfig = ref({});

// const videoInfoStore = useVideoInfoStore()

function endLoading() {
  isloading.value = false;
}

function playdesciption(val) {
  return val > 10000 ? Math.floor(val / 10000) + '万' : val;
}

function jumpVideo(item) {
  // videoInfoStore.setBvid(item.bvid)
  window.open(`${window.location.origin}/video?bvid=${item.bvid}`);
  // router.push({
  //   name: 'video',
  // })
}

function jumpSpace(item) {
  window.open(`${window.location.origin}/space?mid=${item.owner?.mid}`);
}
function getMpdInfo() {
  const { dash, timeStamp } = playConfig.value;
  if (!dash) return;
  const { video } = dash;
  const baseUri = 'http://localhost:8080/api/';
  const leftvideo = video
    .filter(el => !el.codecs.includes('hev'))
    .sort((a, b) => a.id - b.id);
  const videoConfig = leftvideo.slice(0, 1).map((item, index) => ({
    baseUrl: '/api/video/playStream?mimeType=video&track='
      .concat(index)
      .concat('&timeStamp='.concat(timeStamp)),
    bandwidth: item.bandwidth,
    height: item.height,
    width: item.width,
    frameRate: item.frameRate,
    codecs: item.codecs,
    // SegmentBase: item.SegmentBase,
  }));

  const { duration, minBufferTime } = dash;
  return {
    baseUri,
    video: videoConfig,
    audio: [],
    duration,
    minBufferTime: minBufferTime,
  };
}

function initPlayer() {
  const mpdInfo = getMpdInfo();
  videoPlayer.value = initialize(video.value, mpdInfo);
  videoPlayer.value.on(dashjs.MediaPlayer.events.CAN_PLAY, () => {
    videoPlayer.value.setMute(true);
    isPreViewing.value = true;
    if (isPreViewing.value) videoPlayer.value.play();
  });
}

async function getPlayConfig() {
  const { bvid = props.item.bvid, aid, cid = props.item.cid } = baseInfo.value;
  playConfig.value = await getPlayList({ bvid, avid: aid, cid });
}

async function getBaseInfo(params) {
  baseInfo.value = await getVideoView(params);
  // videoInfoStore.setBaseInfo(baseInfo.value)
}

async function getInfo() {
  // console.log(props.item);
  if (!props.item.cid) {
    await getBaseInfo({ bvid: props.item.bvid });
  }
  await getPlayConfig();
  // getBarrageFn()
}

async function previewVideo() {
  if (videoPlayer.value) {
    isPreViewing.value = true;
    videoPlayer.value.play();
    return;
  }
  // isPreViewing.value = true;
  await getInfo();
  initPlayer();
}

function exitPreview() {
  isPreViewing.value = false;
  if (videoPlayer.value) {
    videoPlayer.value.pause();
  }
}
onBeforeUnmount(() => {
  videoPlayer.value?.destroy();
});
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

.videoPlayer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  aspect-ratio: 16/10;
  border-radius: 10px;
  background: #000;
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

.author {
  text-align: start;
  color: var(--font-color2);
  font-size: 14px;
  line-height: 20px;
  &:hover {
    cursor: pointer;
    color: #00aeec;
  }
}
</style>
