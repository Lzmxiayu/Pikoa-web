<template>
  <div class="front_page">
    <a-layout style="height: 100vh">
      <a-layout-header style="height: 20%">
        <Animation />
        <a-input-search
          :style="{
            width: '450px',
            position: 'absolute',
            left: 'calc(50% - 225px)',
            top: '10px',
          }"
          placeholder="输入搜索内容"
          search-button
          @press-enter="jumpSearch"
          @search="jumpSearch"
        />
      </a-layout-header>
      <a-layout-content>
        <div class="main-content">
          <div class="rcmd_area">
            <div class="rcmd_area_left">
              <a-carousel
                :style="{
                  width: '100%',
                  height: '90%',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }"
                :auto-play="true"
                indicator-type="dot"
                show-arrow="hover"
              >
                <a-carousel-item v-for="image in images" :key="image">
                  <img
                    :src="image"
                    :style="{
                      width: '100%',
                      height: '100%',
                      borderRadius: '8px',
                    }"
                  />
                </a-carousel-item>
              </a-carousel>
            </div>
            <div
              v-for="item in rmcdVideos"
              :key="item.id"
              class="rcmd_area_right_item"
            >
              <ResultItem :item="item" />
            </div>
            <a-button
              v-if="rmcdVideos?.length > 0"
              class="another_button"
              @click="getFrontRecommendVideosFn"
            >
              <template #icon>
                <icon-refresh />
              </template>
            </a-button>
          </div>
        </div>
      </a-layout-content>
      <a-layout-footer style="height: 15vh">Footer</a-layout-footer>
    </a-layout>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { IconRefresh } from '@arco-design/web-vue/es/icon';
import { getFrontRecommendVideos } from '@/server';
import Animation from '@/components/Animation/index.vue';
import ResultItem from '@/components/SearchResult/ResultItem.vue';

const rmcdVideos = ref([]);
async function getFrontRecommendVideosFn() {
  const res = await getFrontRecommendVideos();
  rmcdVideos.value = res.item;
  rmcdVideos.value = (rmcdVideos.value || []).map(item => {
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
  console.log(res);
}

const images = computed(() => {
  return (rmcdVideos.value || []).map(item => item.pic);
});

onMounted(async () => {
  await getFrontRecommendVideosFn();
});
</script>
<style lang="less" scoped>
.front_page {
  width: 100vw;
  height: 100vh;
  overflow: auto;
}
.front_page :deep(.arco-layout-header),
.front_page :deep(.arco-layout-footer),
.front_page :deep(.arco-layout-sider-children),
.front_page :deep(.arco-layout-content) {
  display: flex;
  flex-direction: column;
  //   justify-content: center;
  //   color: var(--color-white);
  font-size: 16px;
  //   font-stretch: condensed;
  //   text-align: center;
}
.front_page :deep(.arco-layout-header) {
  margin-bottom: 40px;
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
  .another_button {
    position: absolute;
    top: 0;
    right: -40px;
    border-radius: 4px;
  }
  margin-bottom: 60px;
}

@media screen and (max-width: 1300px) {
  .main-content {
    margin: 10px 10px;
  }
}
@media screen and (max-width: 1500px) {
  .rcmd_area_right_item:nth-of-type(n + 6) {
    margin-top: 40px;
  }
  .rcmd_area {
    grid-template-columns: repeat(4, 1fr);
  }
  .main-content {
    padding: 10px 60px;
  }
}
@media screen and (min-width: 1501px) {
  .rcmd_area_right_item:nth-of-type(n + 8) {
    margin-top: 40px;
  }
  .main-content {
    padding: 0 140px;
  }
}
@media screen and (min-width: 1920px) {
  .main-content {
    padding: 0 200px;
  }
}
</style>
