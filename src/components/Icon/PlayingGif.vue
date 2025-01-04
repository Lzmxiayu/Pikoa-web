<template>
  <div
    class="playing-gif"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      '--color': color || '#456',
    }"
  >
    <div class="playing-gif-first"></div>
    <div class="playing-gif-second"></div>
    <div class="playing-gif-third"></div>
  </div>
</template>
<script setup>
const props = defineProps(['size', 'color'])
</script>
<style scoped>
@keyframes change {
  0% {
    height: 40%;
  }
  50% {
    height: 100%;
  }
  100% {
    height: 40%;
  }
}
@keyframes change2 {
  0% {
    height: 100%;
  }
  50% {
    height: 40%;
  }
  100% {
    height: 100%;
  }
}
.playing-gif {
  widows: 100%;
  height: 100%;
  display: flex;
  padding: 0;
  align-items: center;
}
.playing-gif-first,
.playing-gif-second,
.playing-gif-third {
  width: 27%;
  height: 90%;
  background: var(--color, '#000');
  animation: change 1s infinite;
}
.playing-gif-second {
  animation: change2 1s infinite;
}

.playing-gif-first,
.playing-gif-second {
  margin-right: 4.5%;
}
</style>
