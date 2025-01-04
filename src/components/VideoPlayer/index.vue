<template>
  <div class="video-player-container">
    <div class="header-info">
      <h1 :title="baseInfo?.title">{{ baseInfo?.title || '' }}</h1>
      <div class="header-info-desc">
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
      </div>
    </div>
    <div
      class="video-player"
      ref="videoPlayerEl"
      :class="{
        hiddenCursor: !controlBarState.isShow,
        'tab-full-screen': tabFullscreen,
      }"
      @click="clickScreenFn"
      @mouseenter="setControlBarShow(true)"
      @mousemove="e => setControlBarShow(true, e)"
      @mouseleave="setControlBarShow(false)"
    >
      <div class="video-wrap">
        <div class="video-wrap-loading" v-if="pending">
          <div class="rocket-launcher">
            <Rocket />
          </div>
          <!-- <span>{{ '拼命加载中...' }}</span> -->
        </div>
        <video
          id="videoPlayer"
          ref="video"
          :class="{
            'tab-full-screen': tabFullscreen,
          }"
        ></video>
      </div>
      <br />
      <div class="control-bar" ref="controlBarEl" @click.stop="">
        <ControlBar
          :class="{
            hidden: !controlBarState.isShow,
          }"
          :isFullScreen="isFullScreen"
          :videoEl="video"
          :videoPlayer="videoPlayer"
          :videoPlayerEl="videoPlayerEl"
          @requestFullScreen="requestFullScreen"
          @exitFullScreen="exitFullScreen"
        />
      </div>
      <Barrage
        v-if="videoPlayer"
        :showBarrages="showBarrages"
        :barrageInfo="barrageInfo"
        :playerState="playerState"
        :videoPlayer="videoPlayer"
      />
    </div>
    <div class="barrage-operator-area">
      <!-- 弹幕操作区域 -->
      <a-switch v-model="showBarrages">
        <template #checked> 开启弹幕 </template>
        <template #unchecked> 关闭弹幕 </template>
      </a-switch>
    </div>
    <!-- <div class="description">
      <span>{{ baseInfo?.desc || '' }}</span>
    </div> -->
    <!-- <div class="operation-tools" @click="downloadFileFn">
      <button>{{ '下载' }}</button>
    </div> -->
  </div>
</template>
<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import ControlBar from '@/components/VideoPlayer/ControlBar.vue'
import Barrage from './Barrage.vue'
import Rocket from './Rocket.vue'
import { timestampToDate } from '@/utils/index'
import { downloadFile } from '@/server/index'
import eventBus from '@/eventBus'
import initialize from './mse.js'
import { useVideoPlayerStore } from '@/stores/videoplayer'
import { storeToRefs } from 'pinia'
import { load } from 'protobufjs'

const props = defineProps([
  'bvid',
  'baseInfo',
  'playConfig',
  'barrageInfo',
  'endPe',
])

const emit = defineEmits(['getBarrageFn'])

const showBarrages = ref(true)

const videoPlayerStore = useVideoPlayerStore()
const { status, controlBarState, tabFullscreen, pending } =
  storeToRefs(videoPlayerStore)

const video = ref(null)
const videoPlayerEl = ref(null)
const videoPlayer = ref(null)
const playerState = ref({
  currentTime: 0,
  duration: 99999,
})
const dashjs = window.dashjs

const isFullScreen = ref(false)
function requestFullScreen() {
  // 拦截dahsjs的全屏操作，变成div全屏
  try {
    videoPlayerEl.value.requestFullscreen()
    isFullScreen.value = true
  } catch (e) {
    console.log(e)
  }
}

/**
 * 退出全屏
 * @remarks
 * 仅在requestFullScreen之后有效
 */
function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  }
  isFullScreen.value = false
}

function keydownHandleFn(e) {
  // console.log(e)
  if (e.keyCode === 32) {
    clickScreenFn()
  } else if (e.keyCode === 70) {
    const cb = isFullScreen.value ? exitFullScreen : requestFullScreen
    cb()
  } else if (e.keyCode === 77) {
  }
}

onMounted(() => {
  const observer = new ResizeObserver(entries => {
    const videoPlayerStore = useVideoPlayerStore()
    // 处理元素大小变化的逻辑
    // console.log(entries[0].contentRect.width)
    videoPlayerStore.setPlayerWidth(entries[0].contentRect.width)
  })
  observer.observe(video.value)
  document.addEventListener('keydown', keydownHandleFn)
})

onUnmounted(() => {
  hiddenControlbarTimer.value && clearTimeout(hiddenControlbarTimer.value)
  document.removeEventListener('keydown', keydownHandleFn)
})

const controlBarEl = ref()
const hiddenControlbarTimer = ref(null)

/** ControlBar */
function setControlBarShow(flag, e) {
  hiddenControlbarTimer.value && clearTimeout(hiddenControlbarTimer.value)
  videoPlayerStore.setContrilbarState({
    ...controlBarState.value,
    isShow: flag,
  })
  // 不在ControlBar内时，3秒后隐藏
  const isInControlBar = e && e.target && controlBarEl.value.contains(e.target)
  if (flag && !isInControlBar) {
    hiddenControlbarTimer.value = setTimeout(() => {
      videoPlayerStore.setContrilbarState({
        ...controlBarState.value,
        isShow: false,
      })
    }, 3000)
  }
}

function clickScreenFn() {
  if (status.value === 'playing') {
    videoPlayer.value.pause()
  } else if (['ready', 'paused'].includes(status.value)) {
    videoPlayer.value.play()
  }
}

function getMpdInfo() {
  const { dash, timeStamp } = props.playConfig
  const { video, audio } = dash
  console.log(video)
  const baseUri = 'http://localhost:8080/api/'
  const videoConfig = video
    .map((item, index) => ({
      baseUrl: 'playStream?mimeType=video&track='
        .concat(index)
        .concat('&timeStamp='.concat(timeStamp)),
      bandwidth: item.bandwidth,
      height: item.height,
      width: item.width,
      frameRate: item.frameRate,
      codecs: item.codecs,
    }))
    .filter(el => !el.codecs.includes('hev'))
  const audioConfig = [
    {
      baseUrl: 'playStream?mimeType=audio&track=0'.concat(
        '&timeStamp='.concat(timeStamp),
      ),
      bandwidth: audio[0].bandwidth,
      codecs: audio[0].codecs,
    },
  ]
  const { duration, minBufferTime } = dash
  return {
    baseUri,
    video: videoConfig,
    audio: audioConfig,
    duration,
    minBufferTime: minBufferTime,
  }
}

function downloadFileFn() {
  const { video, audio } = props.playConfig.dash
  const formData = new FormData()
  formData.set('video_url', video[0].baseUrl)
  formData.set('audio_url', audio[0].baseUrl)
  formData.set('title', props.baseInfo?.title)
  formData.set('bvid', props.bvid)
  downloadFile(formData).then(res => {
    if (res.data === true) {
      alert('下载成功！')
    }
  })
}

function throttle(func, wait) {
  let timer = null
  return function () {
    if (timer) return
    timer = setTimeout(() => {
      func.apply(this, arguments)
      timer = null
    }, wait)
  }
}

function bindEvents() {
  // 播放时间变化
  videoPlayer.value?.on(
    dashjs.MediaPlayer.events.PLAYBACK_TIME_UPDATED,
    throttle(e => {
      // 这里的e包含当前播放时间信息
      // console.log(e)
      const currentTime = videoPlayer.value.time() // 当前播放时间
      if (currentTime >= props.endPe / 1000 - 2) {
        emit('getBarrageFn', props.endPe, props.endPe + 120000)
      }
      // const seekableRange = e.seekableRange // 可寻址的播放时间范围
      playerState.value.currentTime = currentTime
      eventBus.emit('video_time_update', { time: currentTime })
    }, 1000),
  )
}

function initPlayer() {
  if (videoPlayer.value) {
    videoPlayer.value.destroy()
  }
  const mpdInfo = getMpdInfo()
  videoPlayer.value = initialize(
    document.querySelector('#videoPlayer'),
    mpdInfo,
  )

  bindEvents()
}

watch(() => props.playConfig, initPlayer)
</script>
<style lang="less" scoped>
.hiddenCursor:hover {
  cursor: none;
}
.video-player {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  margin-bottom: 10px;
  //overflow: auto;
  position: relative;
  z-index: 200 !important;
}
.video-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
}
.video-wrap-loading {
  position: absolute;
  top: 0;
  height: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  span {
    color: #fff;
    font-size: 18px;
    pointer-events: none;
    text-align: center;
  }
}
.video-loading {
  // position: absolute;
  color: #fff;
  opacity: 0.5;
  z-index: 100;
}

.control-bar {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  z-index: 101;
  display: flex;
  align-items: center;
  // background: #fff;
}
.video-player::-webkit-scrollbar {
  display: none;
}

#videoPlayer {
  width: 100%;
  aspect-ratio: 16/9;
  background-color: #000;
}

.header-info {
  margin-bottom: 20px;
  h1 {
    margin: 0;
    margin-bottom: 10px;
    height: 34px;
    line-height: 1.2;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  span {
    color: #4f4f4f;
    margin-right: 8px;
  }
}
.barrage-operator-area {
  display: flex;
  height: 80px;
  align-items: center;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #4f4f4f;
}
.description {
  width: 95%;
  font-size: 15px;
  white-space: pre-line;
  letter-spacing: 0;
  color: #4f4f4f;
}
.operation-tools {
  position: absolute;
  right: 2.5%;
  bottom: 50px;
}

.download-btn:hover {
  cursor: pointer;
}

.tab-full-screen {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
}
// 采用visibility是为了解决里面动画重新渲染的问题
.hidden {
  visibility: hidden;
  pointer-events: none;
}

.rocket-launcher {
  position: relative;
  width: 90px;
  height: 90px;
  animation: rocket-launch 2s infinite;
}

.rocket-launcher::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: rocket-engine 1s infinite;
}

@keyframes rocket-launch {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-50px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes rocket-engine {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
