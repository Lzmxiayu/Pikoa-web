<template>
  <div
    ref="barrageWrap"
    class="barrage-wrap"
    :class="{ hidden: !showBarrages }"
  >
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
import { ref, watch, onMounted } from 'vue';
import { rgb888ToRgb, throttle } from '@/utils';
import { useVideoPlayerStore } from '@/stores/videoplayer';
import { storeToRefs } from 'pinia';

const props = defineProps({
  barrageInfo: {
    type: Object,
    default: () => ({}),
  },
  playerState: {
    type: Object,
    default: () => ({}),
  },
  videoPlayer: {
    type: Object,
    default: () => ({}),
  },
  showBarrages: {
    type: Boolean,
    default: true,
  },
});

const videoPlayerStore = useVideoPlayerStore();
const { playerWidth, status } = storeToRefs(videoPlayerStore);

const dashjs = window.dashjs;

const processedElems = ref([]);
const showList = ref([]);
const isSeeking = ref(false);

const barrageWrap = ref(null);
const tracks = ref([]);
const hashList = ref([]);

// distance: 0, // 轨道已经走过的路程
// lasstItem: null, // 轨道上最后一个弹幕
// selectTracks: [], // 单条弹幕对应放的轨道

function getDistance(barrage) {
  return barrage.speed * barrage.time;
}

function updateTracksTime(time) {
  for (let i = 0; i < tracks.value.length; i++) {
    const track = tracks.value[i];
    if (track.length > 0) {
      // 轨道上最后一个弹幕
      const lastItem = track[track.length - 1];
      lastItem.time += time;
    }
  }
}

function addToTracks(elem) {
  for (let i = 0; i < tracks.value.length; i++) {
    const track = tracks.value[i];
    // console.log('curElems => track', i, track)
    const selectTracks = [];
    // 判断对应弹幕与对应轨道是否会碰撞
    if (track.length === 0) {
      selectTracks.push(i);
    } else {
      // 轨道上最后一个弹幕
      const lastItem = track[track.length - 1];
      const distance = getDistance(lastItem);
      // 画图, distance是lastItem头部到轨道末尾的距离
      // 两个弹幕的间距是lastItem的尾部到elem的头部的距离
      // lastItem结束时, lastItem的尾部在轨道头部
      if (
        distance > lastItem.width &&
        (elem.speed <= lastItem.speed ||
          (distance - lastItem.width) / (elem.speed - lastItem.speed) >
            (track.width + lastItem.width - distance) / lastItem.speed)
      ) {
        selectTracks.push(i);
      }
    }
    // 此处只考虑了弹幕单一轨道
    if (selectTracks.length > 0) {
      track.push(elem);
      elem.tracks = selectTracks;
      break;
    }
  }
}

function removeFromTracks() {
  for (let i = 0; i < tracks.value.length; i++) {
    const track = tracks.value[i];
    const num = track.filter(item => {
      const out = item.speed * item.time >= -item.translateX;
      if (out) {
        item.tracks = [];
      }
      return out;
    }).length;
    track.splice(0, num);
  }
}

function resetList() {
  for (let i = 0; i < tracks.value.length; i++) {
    const track = tracks.value[i];
    track.forEach(item => {
      item.tracks = [];
    });
    track.splice(0, track.length);
  }
  showList.value = [];
  hashList.value = [];
}

function processBarrage(newElems) {
  newElems.sort((a, b) => a.stime - b.stime);
  // console.log('playerWidth', playerWidth)
  for (let i = 0; i < newElems.length; i++) {
    // 初始位置
    newElems[i].left = playerWidth.value + 200;
    newElems[i].width = newElems[i].text.length * newElems[i].size; //+ Math.random() * 100
    // 偏移属性
    newElems[i].translateX = -(
      newElems[i].left +
      newElems[i].text.length * newElems[i].size +
      100
    );
    // 偏移时间
    newElems[i].duration = (playerWidth.value / 1920) * 10;
    newElems[i].time = 0;
    newElems[i].speed = Math.ceil(
      -newElems[i].translateX / newElems[i].duration,
    );
    newElems.tracks = [];
  }
  processedElems.value = newElems;
}

function updateBarrageView(newVal, interval) {
  if (isSeeking.value) return;

  // 获取在这一秒内的弹幕
  const curElems = processedElems.value.filter(elem => {
    return (
      elem.stime <= newVal * 1000 &&
      elem.stime >= newVal * 1000 - 1000 * interval
    );
  });
  curElems.forEach(elem => {
    if (hashList.value.findIndex(item => item.uhash === elem.uhash) === -1) {
      hashList.value.push(elem);
    }
  });
  // 判断离开视口的
  removeFromTracks();
  // 更新轨道上最后一项的值
  updateTracksTime(interval);
  hashList.value.forEach(elem => {
    if (!elem.tracks) {
      addToTracks(elem);
    }
  });

  // 轨道高度
  tracks.value.forEach((track, i) => {
    track.forEach(elem => {
      elem.top = i * 40;
    });
  });
  showList.value = tracks.value.flat();
}

// 播放时间变化, 弹幕入场, 离场
// watch(
//   () => props.playerState.currentTime,
//   newVal => updateBarrageView(newVal),
// )

// 弹幕信息变化, 重新计算
watch(
  () => props.barrageInfo.elems,
  newVal => {
    processBarrage(newVal.map(item => ({ ...item })));
  },
  {
    immediate: true,
  },
);

// 播放器宽度变化时, 重新计算偏移位置
watch(
  () => playerWidth.value,
  newVal => {
    processBarrage(props.barrageInfo.elems.map(item => ({ ...item })));
    // resetList()
    // updateBarrageView(props.videoPlayer.time(), 0.5)
    showList.value.concat(hashList.value).forEach(item => {
      // 初始位置
      item.left = newVal + 200;
      // 偏移属性
      item.translateX = -(item.left + item.text.length * item.size + 100);
      // 偏移时间
      item.duration = (newVal / 1920) * 10;
      item.speed = Math.ceil(-item.translateX / item.duration);
    });
  },
);

function init() {
  processedElems.value = [];
  showList.value = [];
  isSeeking.value = false;
  tracks.value = [];
  hashList.value = [];
  props.videoPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_SEEKING, () => {
    // console.log('seeking', props.videoPlayer.time())
    // seek时清空当前弹幕
    isSeeking.value = true;
    resetList();
  });
  props.videoPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_SEEKED, () => {
    // console.log('seekend', props.videoPlayer.time())
    isSeeking.value = false;
  });

  // 初始化轨道数量
  tracks.value = new Array(Math.floor(barrageWrap.value.offsetHeight / 40))
    .fill(1)
    .map(() => []);
  props.videoPlayer.on(
    dashjs.MediaPlayer.events.PLAYBACK_TIME_UPDATED,
    throttle(() => {
      const currentTime = props.videoPlayer.time();
      updateBarrageView(currentTime, 0.5);
    }, 500),
  );
}

watch(
  () => props.videoPlayer,
  newVal => {
    if (newVal) init();
  },
);

onMounted(() => {
  init();
});
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
  animation: roll var(--duration) linear forwards;
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
