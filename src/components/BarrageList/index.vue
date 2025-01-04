<template>
  <div class="barrage-list-wrap">
    <div class="barrage-list">
      <div class="barrage-list-item header">
        <div class="stime">
          {{ '时间' }}
        </div>
        <div class="content">{{ '当前弹幕' }}</div>
        <div class="date">{{ '发送时间' }}</div>
      </div>
      <div class="barrage-list-fixed">
        <FixedList :list="showList" :itemHeight="itemHeight" ref="fixedListEl">
          <!-- <template v-slot:header>
          <div class="barrage-list-item">
            <div class="stime">
              {{ '时间' }}
            </div>
            <div class="content">{{ '弹幕' }}</div>
            <div class="date">{{ '发送时间' }}</div>
          </div>
        </template> -->
          <template v-slot:empty v-if="showList.length === 0">
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
          </template>
          <template v-slot:single="{ item }">
            <div class="barrage-list-item">
              <div class="stime">
                {{ formatTime(Math.floor(item.stime / 1000)) }}
              </div>
              <div class="content">
                <span
                  :title="item.text"
                  :style="{
                    color: item.color,
                  }"
                >
                  {{ item.text }}
                </span>
              </div>
              <div class="date">
                {{ timestampToDate2(item.date * 1000).slice(5) }}
              </div>
            </div>
          </template>
        </FixedList>
      </div>
    </div>
  </div>
</template>
<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import FixedList from '../common/FixedList.vue'
import { timestampToDate2, formatTime, rgb888ToRgb } from '@/utils'
import eventBus from '@/eventBus.ts'

const props = defineProps(['barrageInfo'])

const list = ref([])
const fixedListEl = ref(null)
const showList = ref([])
const itemHeight = ref(40)
const curTime = ref(0)

function updateList({ time }) {
  curTime.value = time
  showList.value = list.value.filter(item => item.stime < curTime.value * 1000)
  const { fixedListWrap, scrollToBottom } = fixedListEl.value
  if (
    fixedListWrap.scrollTop + fixedListWrap.offsetHeight + 5 >=
    fixedListWrap.scrollHeight
  ) {
    nextTick(scrollToBottom)
  }
}

watch(
  () => props.barrageInfo,
  newVal => {
    const newList = newVal.elems.sort((a, b) => a.stime - b.stime)
    list.value = newList.map((elem, index) => {
      const color = rgb888ToRgb(elem.color)
      return {
        ...elem,
        index,
        id: elem.uhash,
        color: color === 'rgb(255, 255, 255)' ? '#000' : color,
      }
    })

    showList.value = list.value.filter(
      item => item.stime < curTime.value * 1000,
    )
  },
  {
    immediate: true,
  },
)

onMounted(() => {
  eventBus.on('video_time_update', updateList)
})
onUnmounted(() => {
  eventBus.off('video_time_update', updateList)
})
</script>
<style lang="less" scoped>
.barrage-list-wrap {
  height: calc(100% - 25px);
  margin: 0 16px;
}
.barrage-list {
  height: 100%;
}
.barrage-list-empty {
  width: 100%;
  height: calc(100% - 40px);
  text-align: center;
}
.barrage-list-fixed {
  height: calc(100% - 40px);
}
.header {
  .stime,
  .date {
    color: #000;
  }
}
.barrage-list-item {
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  border-bottom: 1px dashed #e6e6e6;
}
.stime {
  width: 80px;
  color: #adadad;
}
.content {
  margin-left: 5px;
  flex: 1;
  max-width: calc(100% - 225px);
  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: absolute;
    top: 8px;
    max-width: calc(100% - 225px);
  }
}
.date {
  margin-left: 5px;
  width: 135px;
  color: #adadad;
}
</style>
