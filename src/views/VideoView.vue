<template>
  <div class="video-page">
    <div class="video-player-area">
      <VideoPlayer
        :baseInfo="baseInfo"
        :playConfig="playConfig"
        :barrageInfo="barrageInfo"
        :endPe="endPe"
        @getBarrageFn="getBarrageFn"
      />
    </div>
    <div class="right-area">
      <a-tabs default-active-key="1" v-model:active-key="rightAreaKey">
        <a-tab-pane key="1" title="简介"> </a-tab-pane>
        <a-tab-pane key="2" title="推荐"> </a-tab-pane>
        <a-tab-pane key="3" title="弹幕区"> </a-tab-pane>
        <a-tab-pane key="4" title="评论区"> </a-tab-pane>
      </a-tabs>
      <div class="right-content-wrap">
        <div class="desc-collection" v-show="rightAreaKey === '1'">
          <div
            class="collection-container"
            v-show="collectionInfo?.list?.length > 0"
          >
            <CollectionList :collectionInfo="collectionInfo" :bvid="bvid" />
            <!-- <RelatedVideos></RelatedVideos> -->
          </div>
          <div class="desc-container">
            <span>简介：</span>
            <VideoIntroduction :baseInfo="baseInfo" />
          </div>
        </div>
        <RelatedVideos v-show="rightAreaKey === '2'"></RelatedVideos>
        <BarrageList
          :barrageInfo="barrageInfo"
          v-show="rightAreaKey === '3'"
        ></BarrageList>
        <Comments :baseInfo="baseInfo" v-show="rightAreaKey === '4'"></Comments>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch, ref, computed } from 'vue'
import VideoPlayer from '@/components/VideoPlayer/index.vue'
import BarrageList from '@/components/BarrageList/index.vue'
import Comments from '@/components/Comments/index.vue'
import RelatedVideos from '@/components/RelatedVideos/index.vue'
import VideoIntroduction from '@/components/VideoIntroduction.vue'
import CollectionList from '@/components/CollectionList/index.vue'
import { getVideoView, getPlayList, getBarrage, getVideoDetail } from '@/server'
import { parseUrlParams, handleProtoBuf } from '@/utils'
import { init, generateWbiParams } from '@/utils/wbi.js'
import { useVideoInfoStore } from '@/stores/videoInfo'
import { storeToRefs } from 'pinia'

const rightAreaKey = ref('1')

const baseInfo = ref(null)
const playConfig = ref(null)
const barrageInfo = ref({
  colorfulSrc: [],
  elems: [],
})
const endPe = ref(120000)

const videoInfoStore = useVideoInfoStore()
const { bvid } = storeToRefs(videoInfoStore)

const collectionInfo = computed(() => {
  if (!baseInfo?.value)
    return {
      list: [],
    }
  const { ugc_season } = baseInfo.value
  if (!ugc_season)
    return {
      list: [],
    }
  const {
    title = '',
    intro = '',
    stat: { view = -1 },
  } = ugc_season
  const list = ugc_season?.sections?.[0]?.episodes || []
  return {
    title,
    intro,
    view,
    list,
  }
})

async function getBaseInfo(params) {
  baseInfo.value = await getVideoView(params)
  videoInfoStore.setBaseInfo(baseInfo.value)
}

async function getPlayConfig() {
  const { bvid, aid, cid } = baseInfo.value
  playConfig.value = await getPlayList({ bvid, avid: aid, cid })
  videoInfoStore.setPlayConfig(playConfig.value)
}

function getBarrageFn(ps = 0, pe = 120000) {
  if (pe < endPe.value) return
  const params = {
    type: '1',
    oid: baseInfo.value.cid, //'500001661119018',
    pid: baseInfo.value.aid, //'113018104973407',
    segment_index: '1',
    pull_mode: 1,
    ps,
    pe,
    web_location: '1315873',
    // 'w_rid': '45f75f530ca9c91ff04670f504730f8c',
    // 'wts': '1730621517'
  }
  const oldPe = endPe.value
  try {
    endPe.value = pe
    const endParams = generateWbiParams(params)
    getBarrage(endParams).then(res => {
      const { elems, colorfulSrc } = handleProtoBuf(res)
      let newElems = barrageInfo.value.elems.concat(elems)
      newElems = newElems.filter((item, index) => {
        return newElems.findIndex(t => t.uhash === item.uhash) === index
      })
      console.log('newElems', newElems)
      // processBarrage(newElems)
      barrageInfo.value = {
        elems: newElems,
        colorfulSrc,
      }
    })
  } catch {
    endPe.value = oldPe
  }
}

async function getInfo() {
  await getBaseInfo({ bvid: bvid.value })
  await getPlayConfig()
  endPe.value = 120000
  barrageInfo.value = { elems: [], colorfulSrc: [] }
  getBarrageFn()
}

watch(
  () => bvid.value,
  () => {
    if (bvid.value) {
      getInfo()
    }
  },
)

onMounted(async () => {
  await init()
  if (bvid.value) {
    getInfo()
  } else {
    const { bvid } = parseUrlParams(window.location.href)
    videoInfoStore.setBvid(bvid)
    getInfo()
  }
})
</script>
<style lang="less" scoped>
.video-page {
  /* width: 100vw; */
  height: 100vh;
  overflow: auto;
  padding: 20px 50px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
.video-player-area {
  width: 73%;
  aspect-ratio: 16/9;
}
.right-area {
  width: 25%;
  min-width: 300px;
  margin-top: 40px;
  height: calc(100vh - 80px);
}
.right-content-wrap {
  height: calc(100% - 56px);
}
.desc-collection {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 5px 10px;
  .desc-container {
    margin-top: 10px;
    // max-height: 40%;
  }
  .collection-container {
    // min-height: 60%;
  }
}
.desc-collection::-webkit-scrollbar {
  width: 6px;
}
.desc-collection::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 5px;
}

.desc-collection::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 5px;
}
input {
  position: fixed;
  bottom: 10px;
  left: 540px;
}
/* :deep(.arco-tabs-content) {
  height: calc(100vh - 80px);
} */
</style>
