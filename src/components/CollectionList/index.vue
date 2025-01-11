<template>
  <div class="collection-area">
    <div class="collection-area-header">
      <span class="collection-title">{{ collectionInfo.title }}</span>
      <span class="collection-index">{{
        ' (' + (index + 1) + '/' + showList.length + ')'
      }}</span>
    </div>
    <div class="collection-area-desc">{{ collectionInfo.intro }}</div>
    <div class="collection-area-list">
      <FixedList
        ref="fixedListEl"
        :list="showList"
        :itemHeight="itemHeight"
        :hashSize="10"
        :containerHeight="showList.length >= 10 ? 400 : showList.length * 40"
      >
        <!-- <template v-slot:empty v-if="showList.length === 0">
          <div class="barrage-list-empty">
            <a-empty
              :style="{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }"
            />
          </div>
        </template> -->
        <template v-slot:single="{ item }">
          <div
            class="collection-area-list-item"
            :class="{
              'collectin-selected': index === item.index,
            }"
            @click="jumpVideo(item)"
          >
            <PlayingGif
              :color="'#00aeec'"
              size="12"
              :style="'margin-right: 5px'"
              v-if="index === item.index"
            />
            <span class="title">{{ item.title }}</span>
            <span class="duration">{{
              formatTime(Math.floor(item.page.duration))
            }}</span>
          </div>
        </template>
      </FixedList>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref, nextTick } from 'vue'
import FixedList from '@/components/common/FixedList.vue'
import PlayingGif from '@/components/Icon/PlayingGif.vue'
import { useVideoInfoStore } from '@/stores/videoInfo'
import { useVideoPlayerStore } from '@/stores/videoplayer'

import { formatTime, changeUrlSearchParam } from '@/utils'

const props = defineProps(['collectionInfo', 'bvid'])

const fixedListEl = ref(null)
const itemHeight = ref(40)
const index = ref(-1)

const showList = computed(() => {
  const list =
    props.collectionInfo?.list?.map((item, index) =>
      Object.assign({}, item, { index }),
    ) || []
  index.value = list?.findIndex(item => item.bvid === props.bvid)
  nextTick(() => {
    fixedListEl.value?.initialScroll(index.value)
  })
  return list
})

const videoPlayerStore = useVideoPlayerStore()
const videoInfoStore = useVideoInfoStore()

function jumpVideo(item) {
  videoPlayerStore.setAutoPlay(true)
  videoInfoStore.setBvid(item.bvid)
}

onMounted(() => {})
</script>
<style lang="less" scoped>
.collection-area {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f8f8;
  border-radius: 8px;
  padding: 10px 0 15px 0;
}
.collection-area-header,
.collection-area-desc {
  padding: 0 15px;
}
.collection-area-header {
  .collection-title {
    font-weight: bold;
    font-size: 18px;
  }
  .collection-index {
    color: #bebebe;
  }
}
.collection-area-list {
  flex: 1;
  overflow: auto;
}
.collection-area-list-item {
  width: calc(100% - 14px);
  display: flex;
  margin: 0 7px;
  padding: 0 8px;
  align-items: center;
  .title {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100% - 80px);
  }
  .duration {
    width: 80px;
    text-align: right;
    color: #bebebe;
  }
  &:hover {
    .title {
      color: #00aeec;
    }
    cursor: pointer;
  }
}
.collectin-selected {
  background: #fff;
  border-radius: 6px;
  .title {
    color: #00aeec;
  }
}
</style>
