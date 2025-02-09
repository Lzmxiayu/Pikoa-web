import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useVideoPlayerStore = defineStore('videoplayer', () => {
  const playerWidth = ref(0);
  const status = ref('not_ready'); // notReady | ready | playing | paused
  const duration = ref('00:00');
  const currentTime = ref('00:00');
  const speed = ref(1);
  const volume = ref(100);
  const isMuted = ref(false);
  const tabFullscreen = ref(false);
  const pending = ref(true);
  const autoPlay = ref(false);

  const controlBarState = ref({
    isShow: false,
  });

  function setPlayerWidth(width: number) {
    playerWidth.value = width;
  }

  function setContrilbarState(params: any) {
    controlBarState.value = params;
  }

  function setStatus(val: string) {
    status.value = val;
  }

  function setDuration(val: string) {
    duration.value = val;
  }
  function setCurrentTime(val: string) {
    currentTime.value = val;
  }
  function setSpeed(val: number) {
    speed.value = val;
  }
  function setVolume(val: number) {
    volume.value = val;
  }
  function setMute(val: boolean) {
    isMuted.value = val;
  }
  function setTabFullscreen(val: boolean) {
    tabFullscreen.value = val;
  }
  function setPending(val: boolean) {
    pending.value = val;
  }
  function setAutoPlay(val: boolean) {
    autoPlay.value = val;
  }

  return {
    playerWidth,
    setPlayerWidth,
    status,
    duration,
    currentTime,
    speed,
    volume,
    isMuted,
    pending,
    autoPlay,
    tabFullscreen,
    setStatus,
    controlBarState,
    setContrilbarState,
    setDuration,
    setCurrentTime,
    setSpeed,
    setVolume,
    setMute,
    setTabFullscreen,
    setPending,
    setAutoPlay,
  };
});
