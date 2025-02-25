<template>
  <div class="control-bar-wrap">
    <div
      ref="scrollBarWrap"
      class="scroll-bar-wrap"
      @mouseup="seekFn"
      @mousedown="beginDrag"
      @mousemove="moveDrag"
      @mouseleave="endDrag"
      @mouseenter="getAndRenderVideoShot"
    >
      <div class="scroll-bar" :style="{ width: `${scrollBarWidth}%` }"></div>
      <div
        class="scroll-bar-fragment-loaded"
        :style="{ width: `${fragementLoadedWidth}%` }"
      ></div>
      <img ref="previewImage" class="preview-image" />
    </div>
    <div class="icon-list">
      <div class="list-left">
        <div class="play-button">
          <icon-caret-right
            v-if="['ready', 'paused'].includes(status)"
            style="color: #fff"
            size="28"
            @click="videoPlayer.play()"
          />
          <icon-pause
            v-else
            style="color: #fff"
            size="28"
            @click="videoPlayer.pause()"
          />
        </div>

        <span class="time">{{ currentTime + ' / ' + duration }}</span>
        <div class="sound">
          <div
            class="slash"
            :class="{
              mute: isMuted || volume === 0,
              unmute: !isMuted && volume !== 0,
            }"
          ></div>
          <icon-sound-fill style="color: #fff" size="26" @click="setMuteFn" />
          <div class="sound-slider">
            <a-slider v-model:model-value="volume" :style="{ width: '80px' }" />
            <!-- <a-slider v-model:value="volume" vertical /> -->
          </div>
        </div>
      </div>
      <div class="list-right">
        <div class="quality-option">
          <span>{{ current_quality ? `${current_quality.height}p` : '' }}</span>
          <icon-plus
            v-if="current_quality?.hb"
            style="position: absolute; top: -2px; right: -8px"
            size="12"
          />
          <div v-if="video_quality.length > 0" class="quality-list">
            <div
              v-for="qualityItem in video_quality"
              :key="qualityItem.height"
              class="quality-list-item"
              :class="{
                selected:
                  current_quality.qualityIndex === qualityItem.qualityIndex,
              }"
              @click="changeQuality(qualityItem)"
            >
              <span>{{ `${qualityItem.height}p` }}</span>
              <icon-plus
                v-if="qualityItem.hb"
                style="position: absolute; top: 0px; right: -4px"
                size="12"
              />
            </div>
          </div>
        </div>

        <div class="barrage-operator-area">
          <!-- 弹幕操作区域 -->
          <a-switch v-model="showBarragesLocal" @click="handleShowBarrages">
            <template #checked> 弹幕 </template>
            <template #unchecked> 弹幕 </template>
          </a-switch>
        </div>

        <div class="setting">
          <icon-settings style="color: #fff" size="28" />
        </div>
        <div class="pic-in-pic" @click="setPicInPic">
          <div class="pic-in-pic-in"></div>
        </div>
        <div
          v-if="!tabFullscreen"
          class="web-screen-out"
          @click="requestTabFullscreen"
        >
          <div class="web-screen-rect"></div>
        </div>
        <div v-else class="web-screen-in" @click="exitTabFullscreen">
          <div class="web-screen-rect"></div>
        </div>
        <div class="fullscreen-button">
          <icon-fullscreen
            v-if="!isFullScreen"
            style="color: #fff"
            size="28"
            @click="requestFullScreen"
          />
          <icon-fullscreen-exit
            v-else
            style="color: #fff"
            size="28"
            @click="exitFullScreen"
          />
        </div>
      </div>
    </div>
    <div v-if="bitrateSwitching" class="biterate-tip">
      <span>{{ '切换清晰度' + toBitrate + '中...' }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import {
  IconCaretRight,
  IconPause,
  IconSettings,
  IconFullscreen,
  IconFullscreenExit,
  IconSoundFill,
  IconPlus,
} from '@arco-design/web-vue/es/icon';
import { throttle, formatTime } from '@/utils/index';
import { useVideoPlayerStore } from '@/stores/videoplayer';
import { storeToRefs } from 'pinia';
import { useVideoInfoStore } from '@/stores/videoInfo';
import { getVideoshot } from '@/server';
// import { debounce } from '@/utils';

const dashjs = window.dashjs;

const props = defineProps({
  videoPlayer: {
    type: Object,
    default: () => {},
  },
  videoPlayerEl: {
    type: Object,
    default: () => {},
  },
  videoEl: {
    type: Object,
    default: () => {},
  },
  isFullScreen: {
    type: Boolean,
    default: false,
  },
  showBarrages: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits([
  'handleEmit',
  'requestFullScreen',
  'exitFullScreen',
  'handleShowBarrages',
]);

const scrollBarWrap = ref();
const previewImage = ref(null);
const imgEl = new Image();
let videoshotInfo = {
  indo: {},
  cache: {},
};

const videoPlayerStore = useVideoPlayerStore();
const {
  status,
  duration,
  currentTime,
  volume,
  isMuted,
  tabFullscreen,
  autoPlay,
} = storeToRefs(videoPlayerStore);

const videoInfoStore = useVideoInfoStore();
const { baseInfo } = storeToRefs(videoInfoStore);

const current_quality = ref('');
const bitrateSwitching = ref(false);
const toBitrate = ref('');

// worker线程
// let videoShotWorker = null
// onMounted(() => {
//   videoShotWorker = new Worker('public/worker/videoshot.js')
//   videoShotWorker.addEventListener('message', e => {
//     console.timeEnd()
//     console.log('receive', e.data)

//     const img = document.createElement('img')

//     img.src = URL.createObjectURL(e.data)
//     img.onload = () => {
//       document.body.appendChild(img)
//     }
//   })
//   function test() {
//     const img = new Image()
//     img.src = '27795328431_csni5b-0001.jpg'
//     img.crossOrigin = 'anonymous'
//     img.onload = () => {
//       // const canvas = document.createElement('canvas')
//       // canvas.width = img.width
//       // canvas.height = img.height
//       // const ctx = canvas.getContext('2d')
//       // ctx.drawImage(img, 0, 0)
//       // const offScreenCanvas = canvas.transferControlToOffscreen()
//       // const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
//       // console.log('imageData', data)
//       // videoShotWorker.postMessage(
//       //   {
//       //     imageData: data,
//       //     offScreenCanvas,
//       //   },
//       //   [offScreenCanvas],
//       // )
//     }
//   }
//   test()
// })

// onUnmounted(() => {
//   videoShotWorker.terminate()
// })

/**清晰度 */
const video_quality = ref([]);

function changeQuality(item) {
  if (!props.videoPlayer) return;
  const { qualityIndex } = item;
  bitrateSwitching.value = true;
  // toBitrate.value = `${item.height}p`
  props.videoPlayer.setQualityFor('video', qualityIndex); //, true);
}

/** 滚动条 */
const scrollBarWidth = ref(0);
const fragementLoadedWidth = ref(0);
const isMovingScrollBar = ref(false);
function seekFn(e) {
  if (e.target && e.target.classList.contains('preview-image')) return;
  const val = (e.offsetX / e.target.offsetWidth).toFixed(2) * 100;
  videoPlayerStore.setPending(true);
  // 跳到这里播放
  props.videoPlayer?.seek(
    Math.round((val / 100) * props.videoPlayer.duration()),
  );
  if (props.videoPlayer.isPaused()) {
    props.videoPlayer.play();
  }
  scrollBarWidth.value = val;
  endDrag();
}

function beginDrag() {
  isMovingScrollBar.value = true;
}

// const moveVideoShot = window.requestAnimationFrame(getAndRenderVideoShot) //debounce(getAndRenderVideoShot, 10)
function moveDrag(e) {
  // moveVideoShot(e)
  if (e.target && e.target.classList.contains('preview-image')) return;
  requestAnimationFrame(() => getAndRenderVideoShot(e));
  if (!isMovingScrollBar.value) return;
  const val = (e.offsetX / e.target.offsetWidth).toFixed(2) * 100;
  scrollBarWidth.value = val;
}
function endDrag() {
  isMovingScrollBar.value = false;
}

function requestFullScreen() {
  emit('requestFullScreen');
}

/**
 * 退出全屏
 * @remarks
 * 仅在requestFullScreen之后有效
 */
function exitFullScreen() {
  emit('exitFullScreen');
}

function requestTabFullscreen() {
  videoPlayerStore.setTabFullscreen(true);
}

function exitTabFullscreen() {
  videoPlayerStore.setTabFullscreen(false);
}

function setMuteFn() {
  if (!props.videoPlayer) return;
  const isMuted = props.videoPlayer.isMuted();
  props.videoPlayer.setMute(!isMuted);
  videoPlayerStore.setMute(!isMuted);
  // if (!isMuted) {
  //   videoPlayerStore.setVolume(0)
  // } else {
  //   videoPlayerStore.setVolume(props.videoPlayer.getVolume() * 100)
  // }
}

function setPicInPic() {
  if (!props.videoEl) return;
  if (props.videoEl.requestPictureInPicture) {
    props.videoEl.requestPictureInPicture();
  }
}

function transToBase64(left) {
  const { info } = videoshotInfo;
  const perWidth = imgEl.width / (info.img_x_len || 10);
  const perHeight = imgEl.height / (info.img_y_len || 10);
  const barWidth = 240;
  let translateX =
    Math.floor(scrollBarWrap.value.offsetWidth * left) - barWidth / 2;
  translateX =
    translateX > 0
      ? Math.min(
          translateX,
          Math.floor(scrollBarWrap.value.offsetWidth - barWidth),
        )
      : 0;
  previewImage.value.style.transform = `translateX(${translateX}px)`;
  const time = Math.round(props.videoPlayer.duration() * Number(left));
  const count = info.index.findIndex(val => val > time) - 1;
  const x = (count % info.img_x_len) - 1;
  const y = Math.floor(count / info.img_x_len);
  const canvas = document.createElement('canvas');
  canvas.width = perWidth;
  canvas.height = perHeight;
  if (videoshotInfo.cache[count]) {
    previewImage.value.src = videoshotInfo.cache[count].src;
    return;
  }
  canvas
    .getContext('2d')
    .drawImage(
      imgEl,
      perWidth * x,
      perHeight * y,
      perWidth,
      perHeight,
      0,
      0,
      perWidth,
      perHeight,
    );
  const base64 = canvas.toDataURL('image/jpeg');
  const img = new Image();
  img.src = base64;
  img.onload = () => {
    previewImage.value.src = img.src;
    videoshotInfo.cache[count] = img;
  };
}

async function initVdeioshotImage(cb) {
  const { aid } = baseInfo.value;
  getVideoshot({ aid, index: 1 }).then(res => {
    videoshotInfo.info = res;
    const { image } = res;
    imgEl.src = image[0].replace('i0.hdslb.com', 'localhost:8080');
    imgEl.crossOrigin = 'anonymous';
    imgEl.onload = () => {
      if (cb) cb();
    };
  });
}
function getAndRenderVideoShot(e) {
  const left = (e.offsetX / e.target.offsetWidth).toFixed(2);
  if (imgEl.src) {
    transToBase64(left);
    return;
  }
  initVdeioshotImage(() => {
    transToBase64(left);
  });
}

function bindEvents() {
  // console.log('bindEvents', props.videoPlayer);

  // 可以播放
  props.videoPlayer.on(dashjs.MediaPlayer.events.CAN_PLAY, () => {
    // console.log('canplay', props.videoPlayer);
    videoPlayerStore.setPending(false);
    videoPlayerStore.setDuration(
      formatTime(Math.ceil(props.videoPlayer.duration())),
    );
    props.videoPlayer.setVolume(Number((volume.value / 100).toFixed(2)));
    videoPlayerStore.setStatus('ready');
    video_quality.value = props.videoPlayer.getBitrateInfoListFor('video');
    video_quality.value.forEach((item, index) => {
      if (
        index > 0 &&
        item.height === video_quality.value[index - 1].height &&
        item.bitrate > video_quality.value[index - 1].bitrate
      ) {
        item.hb = true;
      }
    });
    // const curQuality = props.videoPlayer.getQualityFor('video');
    current_quality.value = video_quality.value[video_quality.value.length - 1];
    //video_quality.value.find(
    //   item => item.qualityIndex === curQuality,
    // );
    console.log('current_quality.value', current_quality.value, video_quality);
    video_quality.value.reverse();
    if (autoPlay.value) {
      props.videoPlayer.play();
    }
  });

  // 开始播放
  props.videoPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_PLAYING, () => {
    // console.log('playing');
    videoPlayerStore.setStatus('playing');
  });

  // 播放时间点变化
  props.videoPlayer?.on(
    dashjs.MediaPlayer.events.PLAYBACK_TIME_UPDATED,
    throttle(() => {
      // 注意这里因为是节流,当seek时会与旧的e里的time冲突
      const curTime = props.videoPlayer.time();
      videoPlayerStore.setCurrentTime(formatTime(Math.ceil(curTime)));
      if (!isMovingScrollBar.value) {
        scrollBarWidth.value =
          (curTime / props.videoPlayer.duration()).toFixed(2) * 100;
      }
    }, 1000),
  );

  // 播放暂停
  props.videoPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_PAUSED, () => {
    // console.log('paused');
    videoPlayerStore.setStatus('paused');
  });

  // 跳转后触发
  props.videoPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_SEEKED, () => {
    // console.log('seekend', props.videoPlayer.time());
    videoPlayerStore.setPending(false);
  });

  props.videoPlayer.on(
    dashjs.MediaPlayer.events.FRAGMENT_LOADING_COMPLETED,
    e => {
      // console.log('FRAGMENT_LOADING_COMPLETED', e)
      const fragmentLoaded = Math.ceil(
        e.request.startTime + e.request.duration,
      );
      // console.log('fragmentLoaded', currentTime.value, fragmentLoaded)
      fragementLoadedWidth.value = Math.ceil(
        (fragmentLoaded / props.videoPlayer.duration()) * 100,
      );
    },
  );
  // 码率切换
  props.videoPlayer.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_RENDERED, e => {
    console.log('QUALITY_CHANGE_RENDERED', e, e.newQuality);
    if (e.mediaType === 'video' && e.newQuality !== e.oldQuality) {
      // 切换成功
      const curQuality = e.newQuality; //props.videoPlayer.getQualityFor('video');
      current_quality.value = video_quality.value.find(
        item => item.qualityIndex === curQuality,
      );
      bitrateSwitching.value = false;
    }
  });
}

watch(
  () => props.videoPlayer,
  () => {
    bindEvents();
  },
);
watch(
  () => volume.value,
  newVal => {
    if (!props.videoPlayer) return;
    const val = Number((newVal / 100).toFixed(2));
    props.videoPlayer.setVolume(val);
    if (val > 0) {
      props.videoPlayer.setMute(false);
      videoPlayerStore.setMute(false);
    }
  },
);
watch(
  () => baseInfo.value,
  () => {
    // 清除缓存
    for (let i = 0; i < videoshotInfo.cache.length; i++) {
      videoshotInfo.cache[i] = null;
    }
    initVdeioshotImage();
  },
);

/** 弹幕开关 */
const showBarragesLocal = ref(props.showBarrages);
function handleShowBarrages(e) {
  const next = !props.showBarrages;
  emit('handleShowBarrages', next);
  showBarragesLocal.value = next;
  console.log(next);
}
</script>

<style lang="less" scoped>
.control-bar-wrap {
  width: 100%;
  height: 100%;
  padding: 0 15px;
  position: relative;
}
.biterate-tip {
  position: absolute;
  top: -40px;
  left: 20px;
  color: #fff;
}
.scroll-bar-wrap {
  width: 100%;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  position: relative;
  border-radius: 4px;
  .scroll-bar {
    position: absolute;
    left: 0;
    top: 0;
    background: rgb(110, 187, 217);
    height: 100%;
    border-radius: 4px;
    pointer-events: none;
    z-index: 5;
  }
  .scroll-bar-fragment-loaded {
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(173, 216, 230, 0.5); // rgba(135, 206, 235); //
    height: 100%;
    border-radius: 4px;
    pointer-events: none;
  }
  &:hover {
    cursor: pointer;
    .preview-image {
      display: block;
    }
    &::after {
      content: '';
      position: absolute;
      top: -5px;
      width: 100%;
      height: 5px;
      left: 0px;
      background: transparent;
    }
  }
  .preview-image {
    width: 240px;
    height: 135px;
    z-index: 5;
    position: absolute;
    left: 0;
    bottom: calc(100% + 5px);
    border: none;
    background: transparent;
    display: none;
    // pointer-events: none;
    border-radius: 5px;
    border: 1px solid #fff;
    // &::after {
    //   content: '';
    //   position: absolute;
    //   bottom: -5px;
    //   width: 240px;
    //   height: 5px;
    //   // left: 0px;
    //   background: #fff;
    // }
  }
}
.icon-list {
  width: 100%;
  height: calc(100% - 8px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background-color: rgba(0, 0, 0, 0.5);
  // box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
.list-left,
.list-right {
  height: 28px;
  display: flex;
  align-items: center;
}
.play-button {
  height: 28px;
  &:hover {
    cursor: pointer;
  }
}
.fullscreen {
  color: #fff;
}
.time {
  color: #fff;
  margin-left: 10px;
}
@keyframes legend {
  0% {
    width: 0px;
  }
  100% {
    width: 30px;
  }
}
@keyframes weaken {
  0% {
    width: 34px;
  }
  100% {
    width: 0px;
  }
}
.sound {
  margin-left: 15px;
  height: 26px;
  width: 26px;
  position: relative;
  &:hover {
    cursor: pointer;
    .sound-slider {
      display: inline-block;
      width: 120px;
    }
  }
  .slash {
    transform: rotate(45deg);
    width: 100%;
    height: 100%;
    position: absolute;
    pointer-events: none;
  }
  .mute {
    &::before {
      content: '';
      position: absolute;
      top: 12px;
      left: -4px;
      height: 2px;
      animation: legend 0.3s forwards; // infinite;
      background: #fff;
    }
  }
  .unmute {
    &::before {
      content: '';
      position: absolute;
      top: 12px;
      left: -4px;
      height: 2px;
      animation: weaken 0.3s forwards !important; // infinite;
      background: #fff;
    }
  }
  &-slider {
    display: none;
    position: absolute;
    top: 2px;
    left: 130%;
    height: 26px;
    width: 0; //120px;
    transition: width 0.5s ease-in-out;
    &::after {
      content: '';
      position: absolute;
      left: -6px;
      height: 26px;
      width: 6px;
      background: transparent;
    }
  }
  :where(.css-dev-only-do-not-override-1p3hq3p).ant-slider-vertical {
    margin: 0 11px;
  }
}

.barrage-operator-area {
  display: flex;
  align-items: center;
  border-radius: 4px;
  margin-right: 15px;
}
.quality-option {
  margin-right: 15px;
  color: #fff;
  position: relative;
  width: 48px;
  text-align: center;
  font-weight: 500;
  font-size: 16px;
  .quality-list {
    display: none;
    position: absolute;
    bottom: calc(100% + 10px);
    left: -11px;
    width: 70px;
    max-height: 200px;
    overflow: auto;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    padding: 8px;
    &-item {
      text-align: left;
      height: 30px;
      position: relative;
      &:hover {
        color: rgb(110, 187, 217);
      }
      &-icon {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
    .selected {
      color: rgb(110, 187, 217);
    }
  }
  &::after {
    content: '';
    display: none;
    position: absolute;
    top: -10px;
    left: -11px;
    height: 10px;
    width: 70px;
    background: transparent;
  }

  .quality-list::-webkit-scrollbar {
    display: none;
  }
  &:hover {
    cursor: pointer;
    .quality-list {
      display: block;
    }
    &::after {
      display: block;
    }
  }
}
.setting {
  margin-right: 15px;
  height: 28px;
  width: 28px;
  &:hover {
    cursor: pointer;
  }
}
.pic-in-pic {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 2px solid #fff;
  background: transparent;
  position: relative;
  margin-right: 15px;
  &-in {
    width: 8px;
    height: 8px;
    background: #fff;
    border-radius: 2px;
    position: absolute;
    right: 2px;
    bottom: 2px;
  }
  &:hover {
    cursor: pointer;
  }
}
.web-screen-out,
.web-screen-in {
  margin-right: 15px;
  width: 24px;
  height: 24px;
  border: 2px solid #fff;
  position: relative;
  border-radius: 4px;
  .web-screen-rect {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    transform: rotate(45deg);
  }
  &:hover {
    cursor: pointer;
  }
}
.web-screen-out {
  background: transparent;
  .web-screen-rect {
    background: #fff;
  }
}
.web-screen-in {
  background: #fff;
  border: 2px solid #000;
  .web-screen-rect {
    background: #000;
  }
}

.fullscreen-button {
  height: 28px;
  &:hover {
    cursor: pointer;
  }
}
</style>
