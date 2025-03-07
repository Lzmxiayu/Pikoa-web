<template>
  <div class="home" ref="homeEl">
    <a-layout style="height: 100vh">
      <!-- <a-layout-header
        style="height: 100px; position: sticky; top: 0; z-index: 100"
      > -->
      <!-- <a-input-search
          :style="{
            width: '450px',
            position: 'absolute',
            left: 'calc(50% - 225px)',
            top: '10px',
          }"
          placeholder="输入搜索内容"
          search-button
          @press-enter="jumpSearch"
        /> -->
      <!-- @search="jumpSearch" -->
      <!-- </a-layout-header> -->
      <a-layout-content>
        <div class="main-content">
          <div class="rcmd_area">
            <div
              v-for="item in rmcdVideos"
              :key="item.id"
              class="rcmd_area_right_item"
            >
              <ResultItem :item="item" />
            </div>
          </div>

          <a-button
            v-if="rmcdVideos?.length > 0"
            class="fresh_button"
            size="large"
            @click="getFrontRecommendVideosFn"
          >
            <template #icon>
              <icon-refresh />
            </template>
          </a-button>

          <a-button class="top_button" size="large" @click="scrollToTop">
            <template #icon>
              <icon-to-top />
            </template>
          </a-button>
        </div>
      </a-layout-content>
      <a-layout-footer style="height: 40px"
        ><span :style="{ color: '#6d6d6d', textAlign: 'center' }"
          >Pikoa</span
        ></a-layout-footer
      >
    </a-layout>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IconToTop, IconRefresh } from '@arco-design/web-vue/es/icon';
import { getFrontRecommendVideos } from '@/server';
import ResultItem from '@/components/SearchResult/ResultItem.vue';

interface Video {
  id: number;
  title: string;
  pic: string;
  author: string;
  play: number;
  danmaku: number;
}

const homeEl = ref<HTMLElement | null>(null);
function scrollToTop() {
  homeEl.value?.scrollTo(0, 0);
}

const rmcdVideos = ref<Video[]>([]);
async function getFrontRecommendVideosFn() {
  const res: any = await getFrontRecommendVideos();
  rmcdVideos.value = res.item;
  rmcdVideos.value = (rmcdVideos.value || []).map((item: any) => {
    return Object.assign({}, item, {
      danmaku: item.stat.danmaku,
      pic: item.pic
        .replace('i1.hdslb.com', 'localhost:8080')
        .replace('i0.hdslb.com', 'localhost:8080')
        .replace('i2.hdslb.com', 'localhost:8080'),
      author: item.owner.name,
      play: item.stat.view,
    });
  });
  // console.log(res);
}

// const images = computed(() => {
//   return (rmcdVideos.value || []).map(item => item.pic);
// });

// function jumpSearch(e: { target: { value: string } }) {
//   // console.log(e.target.value);
//   const keyword = e.target.value;
// }

onMounted(async () => {
  await getFrontRecommendVideosFn();
});
</script>
<style lang="less" scoped>
.home {
  width: 100vw;
  height: 100vh;
  padding: 0 80px;
  overflow: auto;
}
.home :deep(.arco-layout-header),
.home :deep(.arco-layout-footer),
.home :deep(.arco-layout-sider-children),
.home :deep(.arco-layout-content) {
  display: flex;
  flex-direction: column;
  font-size: 16px;
}
.home :deep(.arco-layout-header) {
  margin-bottom: 40px;
}

.main-content {
  position: relative;
  padding: 50px;
}

.rcmd_area {
  min-width: 1180px;
  // padding: 10px 10%;
  width: 100%;
  height: auto;
  display: grid;
  position: relative;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  &_left {
    grid-column: 1/3;
    grid-row: 1/3;
    border-radius: 8px;
    padding: 0 10px 0 0;
    overflow: hidden;
  }
  &_item {
    padding: 0 10px 10px 10px;
  }
  margin-bottom: 60px;
}

:deep(.arco-btn-size-large.arco-btn-only-icon) {
  width: 48px;
  height: 48px;
  font-size: 20px;
}
.top_button {
  position: fixed;
  bottom: 60px;
  right: 30px;
  border-radius: 4px;
}

.fresh_button {
  position: fixed;
  bottom: 120px;
  right: 30px;
  border-radius: 4px;
}

@media screen and(max-width: 1300px) {
  .main-content {
    margin: 10px 10px;
  }
}
@media screen and(max-width: 1500px) {
  .rcmd_area {
    grid-template-columns: repeat(4, 1fr);
  }
  .main-content {
    padding: 5px 30px;
  }
}
@media screen and(min-width: 1501px) {
  .main-content {
    padding: 0 70px;
  }
}
@media screen and(min-width: 2560px) {
  .main-content {
    padding: 0 100px;
  }
}
</style>
