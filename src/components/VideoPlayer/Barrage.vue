<template>
  <div class="barrage-wrap" :class="{ hidden: !showBarrages }">
    <div
      v-for="elem in showList"
      :key="elem.uhash"
      class="barrage-item"
      :style="{
        top: `${elem.top || 0}px`,
        size: `${elem.size}px`,
        color: rgb888ToRgb(elem.color),
        '--translateX': `${elem.translateX}px`,
        '--duration': `${elem.duration}s`,
        '--left': `${elem.left}px`,
        'animation-play-state': status === 'playing' ? 'running' : 'paused',
      }"
    >
      {{ elem.text }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { rgb888ToRgb } from '@/utils'
import { useVideoPlayerStore } from '@/stores/videoplayer'
import { storeToRefs } from 'pinia'

const props = defineProps([
  'barrageInfo',
  'playerState',
  'videoPlayer',
  'showBarrages',
])

const videoPlayerStore = useVideoPlayerStore()
const { playerWidth, pending, status } = storeToRefs(videoPlayerStore)

const processedElems = ref([])
const showList = ref([])
const isSeeking = ref(false)

function processBarrage(newElems) {
  newElems.sort((a, b) => a.stime - b.stime)
  // console.log('playerWidth', playerWidth)
  for (let i = 0; i < newElems.length; i++) {
    // 初始位置
    newElems[i].left = playerWidth.value + 200
    newElems[i].top = 0
    //newElems[i - 1].left + newElems[i - 1].text.length * 25 + 50 // playerWidth.value + 200
    if (i > 0 && newElems[i].stime - newElems[i - 1].stime < 3000) {
      newElems[i].left = newElems[i - 1].left + newElems[i - 1].text.length * 25
      if (newElems[i].left > playerWidth.value * 2) {
        newElems[i].left = playerWidth.value + 200
        newElems[i].top = newElems[i - 1].top + 35
      }
    }
    // top属性, 影响重叠
    if (i > 0 && newElems[i].stime - newElems[i - 1].stime < 1000) {
      const distance = (newElems[i - 1].top || 0) + 35
      newElems[i].top = distance > 800 ? 0 : distance
    }

    // 偏移属性
    newElems[i].translateX = -(
      newElems[i].left +
      newElems[i].text.length * 25 +
      50
    )
    // 偏移时间
    newElems[i].duration = (
      Math.abs(playerWidth.value - newElems[i].translateX) / 200
    ).toFixed(2)
    // 初始状态, 未入场
    newElems[i].status = 'unIn'
  }
  processedElems.value = newElems
}

// 播放时间变化, 弹幕入场, 离场
watch(
  () => props.playerState.currentTime,
  newVal => {
    if (isSeeking.value) return
    // 找到已经在播放的弹幕
    const tempList = showList.value.slice().filter(item => item.status === 'in')
    // 筛选弹幕， 给每个弹幕计算leftDuration, 当leftDuration小于0时, 踢出数组
    tempList.forEach(elem => {
      elem.leftDuration -= 1
      elem.leftDuration <= 0 && (elem.status = 'out')
    })

    // 得到所有stime大于播放时间且还未播放的弹幕
    const allUnPlayedItems = processedElems.value.filter(elem => {
      return Math.floor(elem.stime / 1000) <= newVal && elem.status === 'unIn'
    })

    // console.log('tempList.length', tempList.length, tempList)
    allUnPlayedItems.forEach(item => {
      item.status = 'in'
      item.leftDuration = item.duration
    })
    // 拼接两部分弹幕， 限制列表大小为200
    showList.value = [
      ...tempList,
      ...allUnPlayedItems.slice(0, 200 - tempList.length),
    ]
    // console.log('showList.value.length', showList.value.length, showList)
  },
)

// 弹幕信息变化, 重新计算
watch(
  () => props.barrageInfo.elems,
  newVal => {
    processBarrage(newVal.map(item => ({ ...item })))
  },
  {
    immediate: true,
  },
)

// 播放器宽度变化时, 重新计算偏移位置
// watch(
//   () => playerWidth.value,
//   () => {
//     processBarrage(props.barrageInfo.elems.map(item => ({ ...item })))
//   },
// )

onMounted(() => {
  // processBarrage(props.barrageInfo.elems)
  // console.log(videoPlayer)
  props.videoPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_SEEKING, e => {
    // console.log('seeking', props.videoPlayer.time())
    // seek时清空当前弹幕
    isSeeking.value = true
    showList.value = []
    processBarrage(props.barrageInfo.elems.map(item => ({ ...item })))
  })
  props.videoPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_SEEKED, e => {
    // console.log('seekend', props.videoPlayer.time())
    const curTime = props.videoPlayer.time()
    processedElems.value.forEach(elem => {
      if (Math.floor(elem.stime / 1000) <= curTime) {
        elem.status = 'out'
      }
    })
    isSeeking.value = false
  })
})
</script>

<style>
.barrage-wrap {
  width: 100%;
  height: 80%;
  position: absolute;
  top: 0;
  background-color: transparent;
  overflow: hidden;
}

@keyframes roll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(var(--translateX));
  }
}
.barrage-item {
  font-size: 25px;
  position: absolute;
  white-space: nowrap;
  top: 0;
  color: #fff;
  left: var(--left);
  opacity: 0.7;
  animation: roll var(--duration) forwards;
  user-select: none;
  pointer-events: none;
  z-index: 20;
  --textShadow: 1px 0 1px #000000, 0 1px 1px #000000, 0 -1px 1px #000000,
    -1px 0 1px #000000;
  text-shadow: var(--textShadow);
}
.hidden {
  visibility: hidden;
  pointer-events: none;
}
</style>
//alternate;
