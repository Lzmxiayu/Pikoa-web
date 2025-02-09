<template>
  <div class="video-rect-list">
    <div
      v-for="result in results.slice(0, sliceLength)"
      :key="result"
      class="video-rect-item"
    >
      <ResultItem :item="result" />
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import ResultItem from './ResultItem.vue';

const props = defineProps({
  results: {
    type: Array,
    default: () => [],
  },
  width: {
    type: Number,
    default: 0,
  },
});

const sliceLength = ref(42);

const singleWidth = [0, 1200, 1700, 2200, 2700];

const observer = new ResizeObserver(entries => {
  const width = entries[0].contentRect.width;
  const single = 4 + singleWidth.findIndex(item => width < item) - 1;
  sliceLength.value = Math.floor(props.results.length / single) * single;
});

watch(
  () => props.results,
  () => {
    const width = document.querySelector('html').offsetWidth;
    const single = 4 + singleWidth.findIndex(item => width < item) - 1;
    sliceLength.value = Math.floor(props.results.length / single) * single;
  },
);
onMounted(() => {
  observer.observe(document.querySelector('html'));
});
</script>

<style scoped>
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
  /* border: 1px solid #d8d8d8; */
  margin-bottom: 30px;
  padding: 0 15px;
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
</style>
