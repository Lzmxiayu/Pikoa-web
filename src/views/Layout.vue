<template>
  <div class="front_page">
    <a-layout>
      <a-layout-sider :width="70">
        <div class="pikoa">
          <div class="logo"></div>
        </div>
        <a-menu
          :default-open-keys="['1']"
          :default-selected-keys="['0_2']"
          @menu-item-click="onClickMenuItem"
        >
          <a-menu-item key="home">
            <icon-home size="24" />
            <!-- 主页 -->
          </a-menu-item>
          <a-menu-item key="search">
            <icon-search size="24" />
            <!-- 搜索 -->
          </a-menu-item>
          <a-menu-item key="history">
            <icon-history size="24" />
            <!-- 历史 -->
          </a-menu-item>
          <a-menu-item key="create">
            <icon-upload size="24" />
            <!-- 创作 -->
          </a-menu-item>
          <a-menu-item key="space">
            <icon-cloud size="24" />
            <!-- 空间 -->
          </a-menu-item>
          <a-menu-item key="care">
            <icon-select-all size="24" />
            <!-- 关注 -->
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <RouterView />
    </a-layout>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import {
  IconHome,
  IconSearch,
  IconHistory,
  IconUpload,
  IconCloud,
  IconSelectAll,
} from '@arco-design/web-vue/es/icon';
const router = useRouter();

function onClickMenuItem(key) {
  router.push({ name: key });
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

:deep(.arco-layout) {
  height: 100vh;
}

:deep(.arco-menu-item) {
  height: 60px;
  font-size: 16px;
  // padding: auto;
  display: flex;
  align-items: center;
  padding: 0 !important;
  display: flex;
  justify-content: center;
  .arco-icon {
    margin: 0 !important;
  }
}
:deep(.arco-menu-collapsed .arco-menu-pop) {
  :deep(.arco-menu-item) {
    display: block;
  }
}

.pikoa {
  height: 100px;
  display: flex;
  align-items: center;
  padding: 10px;
  .logo {
    width: 60px;
    height: 60px;
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
