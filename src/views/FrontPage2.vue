<template>
  <div class="front_page">
    <a-layout>
      <!-- breakpoint="lg"
      collapsible
        :collapsed="collapsed"
        @collapse="onCollapse" -->

      <a-layout-sider :width="220">
        <div class="moon_beach">
          <div class="logo"></div>
          MoonBeach
        </div>
        <a-menu
          :defaultOpenKeys="['1']"
          :defaultSelectedKeys="['0_2']"
          @menuItemClick="onClickMenuItem"
        >
          <!-- <a-menu-item key="0_1" disabled>
            <div class="moon_beach">
              <div class="logo"></div>
              MoonBeach
            </div>
          </a-menu-item> -->
          <a-menu-item key="home">
            <icon-home size="24" />
            主页
          </a-menu-item>
          <a-menu-item key="search">
            <icon-search size="24" />
            搜索
          </a-menu-item>
          <!-- <a-menu-item key="video">
            <icon-play-circle size="24" />
            视频
          </a-menu-item> -->
          <a-menu-item key="history">
            <icon-history size="24" />
            历史
          </a-menu-item>
          <a-menu-item key="create">
            <icon-upload size="24" />
            创作
          </a-menu-item>
          <a-menu-item key="space">
            <icon-cloud size="24" />
            空间
          </a-menu-item>
          <a-menu-item key="care">
            <icon-select-all size="24" />
            关注
          </a-menu-item>
          <!-- <a-sub-menu key="1">
            <template #title>
              <span><IconCalendar />Navigation 1</span>
            </template>
            <a-menu-item key="1_1">Menu 1</a-menu-item>
            <a-menu-item key="1_2">Menu 2</a-menu-item>
            <a-sub-menu key="2" title="Navigation 2">
              <a-menu-item key="2_1">Menu 1</a-menu-item>
              <a-menu-item key="2_2">Menu 2</a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="3" title="Navigation 3">
              <a-menu-item key="3_1">Menu 1</a-menu-item>
              <a-menu-item key="3_2">Menu 2</a-menu-item>
              <a-menu-item key="3_3">Menu 3</a-menu-item>
            </a-sub-menu>
          </a-sub-menu>
          <a-sub-menu key="4">
            <template #title>
              <span><IconCalendar />Navigation 4</span>
            </template>
            <a-menu-item key="4_1">Menu 1</a-menu-item>
            <a-menu-item key="4_2">Menu 2</a-menu-item>
            <a-menu-item key="4_3">Menu 3</a-menu-item>
          </a-sub-menu> -->
        </a-menu>
      </a-layout-sider>
      <RouterView />

      <!-- <a-layout style="height: 100vh">
        <a-layout-header
          style="
            height: 100px;
            position: sticky;
            top: 0;
            z-index: 100;
            background-color: #fff;
          "
        >
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
        <a-layout-footer style="height: 40px"
          ><span :style="{ color: '#6d6d6d', textAlign: 'center' }"
            >Moon_Beach</span
          ></a-layout-footer
        >
      </a-layout> -->
    </a-layout>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  IconRefresh,
  IconHome,
  IconSearch,
  IconPlayCircle,
  IconHistory,
  IconUpload,
  IconCloud,
  IconSelectAll,
} from '@arco-design/web-vue/es/icon'
// import { getFrontRecommendVideos } from '@/server'
// import Animation from '@/components/Animation/index.vue'
// import ResultItem from '@/components/SearchResult/ResultItem.vue'

// const rmcdVideos = ref([])
// async function getFrontRecommendVideosFn() {
//   const res = await getFrontRecommendVideos()
//   rmcdVideos.value = res.item
//   rmcdVideos.value = (rmcdVideos.value || []).map(item => {
//     return Object.assign({}, item, {
//       danmaku: item.stat.danmaku,
//       pic: item.pic
//         .replace('i1.hdslb.com', 'localhost:8080')
//         .replace('i0.hdslb.com', 'localhost:8080')
//         .replace('i2.hdslb.com', 'localhost:8080'),
//       author: item.owner.name,
//       play: item.stat.view,
//     })
//   })
//   console.log(res)
// }

// const images = computed(() => {
//   return (rmcdVideos.value || []).map(item => item.pic)
// })

// function jumpSearch(e) {
//   console.log(e.target.value)
//   window.open(`${window.location.origin}/search?keyword=${e.target.value}`)
// }

// onMounted(async () => {
//   await getFrontRecommendVideosFn()
// })

const router = useRouter()

function onClickMenuItem(key) {
  router.push({ name: key })
}
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
  font-size: 16px;
}
.front_page :deep(.arco-layout-header) {
  margin-bottom: 40px;
}

:deep(.arco-menu-item) {
  height: 60px;
  font-size: 16px;
  // padding: auto;
  display: flex;
  align-items: center;
}
:deep(.arco-menu-collapsed .arco-menu-pop) {
  :deep(.arco-menu-item) {
    display: block;
  }
}

.moon_beach {
  width: 100;
  height: 100px;
  display: flex;
  align-items: center;
  padding: 10px;
  .logo {
    width: 50px;
    height: 50px;
    margin-right: 10px;
    background: url('@/assets/images/mu.png') no-repeat center/contain;
  }
  font-size: 18px;
  font-weight: bold;
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
@media screen and(min-width: 1920px) {
  .main-content {
    padding: 0 100px;
  }
}
</style>
