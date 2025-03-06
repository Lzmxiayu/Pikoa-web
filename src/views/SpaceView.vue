<template>
  <div class="personal_channel">
    <!-- <div class="personal_channel_bg">
      <img src="" alt="" />
    </div> -->
    <div class="personal_channel_info">
      <div class="avatar">
        <img :src="info.face" alt="" />
      </div>
      <div class="description">
        <div class="name">{{ info.name }}</div>
        <!-- 2.64M 关注 -->
        <!-- <div class="data">{{ `  ${vlist.length} 投稿` }}</div> -->
        <div class="introduction">
          {{ info.sign }}
        </div>
        <!-- <div class="subscribe">
          <a-button shape="round">关注</a-button>
        </div> -->
      </div>
    </div>
    <div class="personal_channel_tab">
      <a-tabs default-active-key="1" size="large">
        <a-tab-pane key="1" title="稿件"></a-tab-pane>
        <!-- <a-tab-pane key="2" title="视频"> </a-tab-pane>
        <a-tab-pane key="3" title="收藏"> </a-tab-pane> -->
        <!-- <a-tab-pane key="4" title=""> </a-tab-pane> -->
      </a-tabs>
      <div class="personal_channel_list">
        <div
          class="personal_channel_list_item"
          v-for="item in vlist"
          :key="item.bvid"
        >
          <SpaceViewItem :item="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SpaceViewItem from '@/components/common/SpaceViewItem.vue';
import { getUserInfo, searchSpaceDetail } from '@/server';
import { parseUrlParams, timestampToDate2 } from '@/utils/index.ts';
import { init, generateWbiParams } from '@/utils/wbi.js';

const mid = ref('');
const info = ref({});
const vlist = ref([]);

async function getChannelUserInfo() {
  const params = {
    mid: mid.value,
  };
  const endParams = generateWbiParams(params);
  const res = await getUserInfo(endParams);
  info.value = {
    name: res.name,
    sign: res.sign,
    face: res.face.replace(
      /https:\/\/i(0|1|2).hdslb.com/,
      'http://localhost:8080',
    ),
    cover: res.top_photo.replace(/i(0|1|2).hdslb.com/, 'localhost:8080'),
  };
  console.log(res);
}

async function getChannelDetail() {
  const params = {
    pn: 1,
    ps: 42,
    mid: mid.value,
  };
  const endParams = generateWbiParams(params);
  const res = await searchSpaceDetail(endParams);
  if (res && res.list && res.list.vlist) {
    res.list.vlist.forEach(item => {
      item.cover = item.pic.replace(/i(0|1|2).hdslb.com/, 'localhost:8080');
      item.timeObj = timestampToDate2(item.created * 1000);
    });
    vlist.value = res.list.vlist;
  }
}

onMounted(async () => {
  mid.value = parseUrlParams(location.href)?.mid || '1655881099';
  await init();
  getChannelUserInfo();
  getChannelDetail();
});
</script>
<style lang="less" scoped>
.personal_channel {
  display: flex;
  flex-direction: column;
  padding: 40px;
  width: 100%;
  height: 100vh;
  overflow: auto;
}
.personal_channel_bg {
  img {
    width: 100%;
    height: 150px;
    background: #ccc;
  }
  margin-bottom: 30px;
}
.personal_channel_info {
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  .avatar {
    width: 200px;
    height: 200px;
    padding: 10px;
    img {
      width: 180px;
      height: 180px;
      border-radius: 50%;
    }
  }
  .description {
    margin-left: 10px;
    width: 400px;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .name {
      font-size: 38px;
      font-weight: bold;
    }
    .data {
      padding-left: 5px;
      font-size: 18px;
      color: #6a6969;
      margin-bottom: 5px;
    }
    .introduction {
      padding-left: 5px;
      font-size: 18px;
      color: #6a6969;
      margin-bottom: 5px;
    }
    .subscribe {
      font-size: 18px;
    }
  }
}
.personal_channel_tab {
  font-size: 24px;
  :deep(.arco-tabs-nav-tab) {
    height: 60px;
  }
  :deep(.arco-tabs-tab-title) {
    font-size: 18px;
  }
}
.personal_channel_list {
  display: flex;
  flex-wrap: wrap;
}
.personal_channel_list_item {
  flex-basis: 20%;
  padding: 15px;
  margin-bottom: 20px;
}
</style>
