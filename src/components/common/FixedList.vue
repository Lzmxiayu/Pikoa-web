<template>
  <div
    ref="fixedListWrap"
    class="fixed-list-wrap"
    :style="{ height: `${containerHeight}px` }"
    @scroll="handleScrollFn"
  >
    <slot name="header"> </slot>
    <slot name="empty"> </slot>
    <div
      class="fixed-list"
      :style="{
        height: `${totalHeight}px`,
      }"
    >
      <div
        v-for="item in showList"
        :key="item.id"
        class="single-item"
        :style="{
          top: `${item.index * itemHeight}px`,
          height: `${itemHeight}px`,
        }"
      >
        <slot name="single" :item="item"> </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { throttle } from '@/utils';

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  itemHeight: {
    type: Number,
    default: 0,
  },
  hashSize: {
    type: Number,
    default: 10,
  },
  containerHeight: {
    type: Number,
    default: 0,
  },
});

const totalHeight = ref(0);
const fixedListWrap = ref(null);
const showList = ref([]);

function handleScroll() {
  //   console.log(fixedListWrap.value.scrollTop)
  //   console.log(fixedListWrap.value.offsetHeight)
  let start = Math.floor(fixedListWrap.value.scrollTop / props.itemHeight);
  let end =
    start +
    Math.ceil(props.containerHeight / props.itemHeight) +
    props.hashSize;
  start = Math.max(start - props.hashSize, 0);
  //   console.log(start, end)
  showList.value = props.list.slice(start, end);
}

const handleScrollFn = throttle(handleScroll, 50);

function scrollToBottom() {
  fixedListWrap.value.scrollTop = fixedListWrap.value.scrollHeight;
}

function initialScroll(index) {
  fixedListWrap.value.scrollTop = index * props.itemHeight;
}

defineExpose({
  fixedListWrap,
  scrollToBottom,
  initialScroll,
});

watch(
  () => props.list,
  newVal => {
    totalHeight.value = newVal.length * props.itemHeight;
    handleScroll();
  },
);
</script>

<style scoped>
.fixed-list-wrap {
  height: 100%;
  overflow: auto;
  position: relative;
}

.fixed-list-wrap::-webkit-scrollbar {
  width: 6px;
}
.fixed-list-wrap::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 5px;
}

.fixed-list-wrap::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 5px;
}

.fixed-list {
  height: auto;
  position: relative;
}
.fixed-list::-webkit-scrollbar {
  width: 4px;
}
.fixed-list::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 5px;
}

.fixed-list::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 5px;
}

.single-item {
  display: flex;
  /* border-bottom: 1px dashed #e6e6e6; */
  position: absolute;
  width: 100%;
}
</style>
