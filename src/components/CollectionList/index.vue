<template>
  <div class="collection-area">
    <div class="collection-area-header">
      <span class="collection-title">{{ collectionInfo.title }}</span>
      <span class="collection-index">{{
        ' (' + (curIndex + 1) + '/' + showList.length + ')'
      }}</span>
    </div>
    <div class="collection-area-desc">{{ collectionInfo.intro }}</div>
    <div class="collection-area-list">
      <FixedList
        ref="fixedListEl"
        :list="showList"
        :item-height="itemHeight"
        :hash-size="5"
        :container-height="showList.length >= 10 ? 400 : showList.length * 40"
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
        <template #single="{ item }">
          <div
            class="collection-area-list-item"
            :class="{
              'collectin-selected': curIndex === item.index,
            }"
            @click="jumpVideo(item)"
          >
            <PlayingGif
              v-if="curIndex === item.index"
              :color="'#00aeec'"
              size="12"
              :style="'margin-right: 5px'"
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
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import FixedList from '@/components/common/FixedList.vue';
import PlayingGif from '@/components/Icon/PlayingGif.vue';
import { useVideoInfoStore } from '@/stores/videoInfo';
import { useVideoPlayerStore } from '@/stores/videoplayer';

import { formatTime } from '@/utils';

const props = defineProps(['collectionInfo', 'bvid']);

const fixedListEl = ref(null);
const itemHeight = ref(40);

const showList = computed(() => {
  const list =
    props.collectionInfo?.list?.map((item, index) =>
      Object.assign({}, item, { index }),
    ) || [];
  return list;
});

const curIndex = computed(() => {
  if (showList.value.length === 0) return -1;
  return showList.value?.findIndex(item => item.bvid === props.bvid);
});

watch(
  () => curIndex.value,
  newVal => {
    nextTick(() => {
      fixedListEl.value?.initialScroll(newVal);
    });
  },
);

const videoPlayerStore = useVideoPlayerStore();
const videoInfoStore = useVideoInfoStore();

function jumpVideo(item) {
  videoPlayerStore.setAutoPlay(true);
  videoInfoStore.setBvid(item.bvid);
}

onMounted(() => {});
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
