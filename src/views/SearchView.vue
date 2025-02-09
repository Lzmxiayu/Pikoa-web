<template>
  <div class="search-area">
    <div class="top-wrap">
      <a-input-search
        v-model="searchWord"
        :style="{ width: '450px' }"
        placeholder="输入搜索内容"
        search-button
        @press-enter="beginSearch"
        @search="beginSearch"
      />
    </div>
    <div ref="videoResultEl" class="content-wrap">
      <a-space
        v-if="isSearching"
        direction="vertical"
        size="large"
        :style="{ width: '100%' }"
      >
        <a-skeleton :animation="true">
          <a-space direction="vertical" :style="{ width: '100%' }" size="large">
            <a-skeleton-line :rows="12" />
            <a-skeleton-shape size="large" />
          </a-space>
        </a-skeleton>
      </a-space>
      <SearchResult v-else :results="curResult" />
      <!-- <div class="video-rect-list">
        <div
          class="video-rect-item"
          v-for="val in Array(42).fill(Date.now())"
          :key="val"
        ></div>
      </div> -->
    </div>
    <div class="bottom-wrap">
      <a-pagination
        v-if="curResult.length > 0 && !isSearching"
        v-model:current="page"
        :total="1000"
        :page-size="42"
        show-jumper
        @change="onSearch"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SearchResult from '@/components/SearchResult/index.vue';
import { searchAll } from '@/server';
import { parseUrlParams, changeUrlSearchParam } from '@/utils';

const page = ref(1);
const curResult = ref([]);
const isSearching = ref(false);

const searchWord = ref('');
const videoResultEl = ref(null);

function beginSearch() {
  curResult.value = [];
  page.value = 1;
  onSearch();
  changeUrlSearchParam([{ key: 'keyword', value: searchWord.value }]);
}

async function onSearch() {
  isSearching.value = true;
  let data = await searchAll({
    keyword: searchWord.value,
    page_size: 42,
    platform: 'pc',
    page: page.value,
  });
  data = data.result
    .find(rs => rs.result_type === 'video')
    .data.map(val => {
      let { pic } = val;
      const pic2 = pic
        .replace('i1.hdslb.com', 'localhost:8080')
        .replace('i0.hdslb.com', 'localhost:8080')
        .replace('i2.hdslb.com', 'localhost:8080');
      return { ...val, pic: pic2 };
    });
  // console.log(data)
  curResult.value = data;
  isSearching.value = false;
}
onMounted(() => {
  const { keyword } = parseUrlParams(window.location.href);
  if (keyword) {
    searchWord.value = keyword;
    onSearch();
  }
});
</script>

<style scoped>
.search-area {
  width: 100%;
  height: 100vh;
  overflow: auto;
  padding: 40px 80px;
}
.top-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}
.content-wrap {
  height: auto;
  width: 100%;
  border-top: 1px dashed #d8d8d8;
  padding: 20px 20px;
  /* margin: 0 */
}
.video-rect-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  overflow: hidden;
  min-width: 900px;
}
.video-rect-item {
  /* flex: 1; */
  flex: 0 0 25%;
  max-width: 25%;
  /* height: 176px; */
  /* min-width: 180px; */
  min-height: 176px;
  border: 1px solid #d8d8d8;
  margin-bottom: 20px;
}

@media screen and (min-width: 1200px) {
  .video-rect-item {
    flex: 0 0 20%;
    max-width: 20%;
  }
}
@media screen and (min-width: 1700px) {
  .video-rect-item {
    flex: 0 0 16.66666%;
    max-width: 16.66666%;
  }
}
@media screen and (min-width: 2200px) {
  .video-rect-item {
    flex: 0 0 14.2857%;
    max-width: 14.2857%;
  }
}
.bottom-wrap {
  display: flex;
  justify-content: end;
  padding-right: 60px;
}
</style>
