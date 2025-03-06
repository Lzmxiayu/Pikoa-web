<template>
  <div class="history-wrap" @scroll="handleScroll">
    <a-timeline label-position="relative">
      <a-timeline-item
        v-for="item in viewVideosByDate"
        :key="item.desc"
        :label="item.desc"
      >
        <template #label>
          <span class="catogory">{{ item.desc }}</span>
        </template>
        <template #dot>
          <div class="dot"></div>
        </template>
        <div class="history-list">
          <div
            v-for="history in item.list"
            :key="history.kid"
            class="history-list-item"
          >
            <HistoryViewItem :item="history" />
            <!-- <span>{{ history.title }}</span> -->
          </div>
        </div>
      </a-timeline-item>
    </a-timeline>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import HistoryViewItem from '@/components/common/HistoryViewItem.vue';
import { getViewHistory } from '@/server';
import { timestampToDateObj } from '@/utils/time_worker';

interface HistoryItem {
  cover: string;
  title: string;
  view_at: number;
  timeObj: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
  kid: number;
}

async function getViewedHistory(params: {
  max: any;
  view_at: any;
  business: string;
  ps: number;
  type: string;
  web_location: number;
}) {
  const res: any = await getViewHistory(params);
  res.list.forEach((item: any) => {
    item.cover = item.cover.replace(/i(0|1|2).hdslb.com/, 'localhost:8080');
    item.timeObj = timestampToDateObj(item.view_at * 1000);
  });
  historyList.value = historyList.value.concat(res.list);
  historyList.value.sort((a, b) => b.view_at - a.view_at);
}
const historyList = ref<HistoryItem[]>([]);

const viewVideosByDate = computed(() => {
  // 分成今天，昨天，近一周
  const catoryList: HistoryItem[][] = [[], [], [], []];
  const now = Date.now();
  const nowObj = timestampToDateObj(now);
  const todayBegin =
    now -
    (Number(nowObj.hour) * 3600 +
      Number(nowObj.minute) * 60 +
      Number(nowObj.second)) *
      1000;
  const yesterdayBegin = todayBegin - 24 * 3600 * 1000;
  const weekAgoBegin = todayBegin - 24 * 3600 * 1000 * 7;
  //   console.log('todayBegin', todayBegin, yesterdayBegin, weekAgoBegin)
  historyList.value.forEach(item => {
    const timeStamp = item.view_at * 1000;
    if (timeStamp >= todayBegin) {
      // 今天
      catoryList[0].push(item);
    } else if (timeStamp >= yesterdayBegin) {
      // 昨天
      catoryList[1].push(item);
    } else if (timeStamp >= weekAgoBegin) {
      // 近一周
      catoryList[2].push(item);
    } else {
      //一周前
      catoryList[3].push(item);
    }
  });
  const renderTimeline: { desc: string; list: HistoryItem[] }[] = [];
  const timeStr = ['今天', '昨天', '近一周', '一周前'];
  catoryList.forEach((item, index) => {
    if (item.length > 0) {
      renderTimeline.push({
        desc: timeStr[index],
        list: item,
      });
    }
  });
  return renderTimeline;
});
// 待实现函数：给定当前时间戳a和时间戳b，以及天数t, 判断b是否在a的前t天内

function handleScroll(e: Event) {
  const { scrollTop, offsetHeight, scrollHeight } = e.target as any;
  if (scrollTop + offsetHeight + 10 >= scrollHeight) {
    console.log('kid', historyList.value?.[historyList.value.length - 1]?.kid);
    // 已经滚动到底部
    const params = {
      max: historyList.value?.[historyList.value.length - 1]?.kid || 0,
      view_at: historyList.value?.[historyList.value.length - 1]?.view_at || 0,
      business: '',
      ps: 25,
      type: 'all',
      web_location: 333.1391,
    };
    getViewedHistory(params);
  }
}

onMounted(() => {
  const params = {
    max: 0,
    view_at: 0,
    business: '',
    ps: 25,
    type: 'all',
    web_location: 333.1391,
  };
  getViewedHistory(params);
});
</script>
<style lang="less" scoped>
.history-wrap {
  width: 100%;
  height: 100vh;
  padding: 100px 120px 100px 90px;
  overflow: auto;
}
.history-list {
  display: flex;
  flex-wrap: wrap;
}
.history-list-item {
  flex-basis: 20%;
  padding: 10px;
  margin-bottom: 20px;
}
.dot {
  width: 25px;
  height: 25px;
  border: 1px solid #d8d8d8;
  border-radius: 50%;
}
.catogory {
  font-size: 16px;
}
@media screen and (max-width: 1920px) {
  .history-wrap {
    padding: 50px 80px 50px 30px;
  }
  .history-list-item {
    flex-basis: 25%;
  }
}
@media screen and (max-width: 1500px) {
  .history-wrap {
    padding: 50px 60px 50px 10px;
  }
}
@media screen and (max-width: 1200px) {
  .history-wrap {
    padding: 50px 30px 50px 0px;
  }
  .history-list-item {
    flex-basis: 33%;
  }
}
</style>
