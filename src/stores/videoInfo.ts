import { ref } from 'vue'
import { defineStore } from 'pinia'
import { changeUrlSearchParam } from '@/utils'

export const useVideoInfoStore = defineStore('videoInfo', () => {
  const bvid = ref('')
  const baseInfo = ref({})
  const playConfig = ref({})
  const barrageInfo = ref({})

  const setBaseInfo = (data: {}) => {
    baseInfo.value = data
  }
  const setPlayConfig = (data: {}) => {
    playConfig.value = data
  }
  const setBarrageInfo = (data: {}) => {
    barrageInfo.value = data
  }
  const setBvid = (data: string) => {
    bvid.value = data
    changeUrlSearchParam([{ key: 'bvid', value: data }])
  }
  return {
    bvid,
    baseInfo,
    playConfig,
    barrageInfo,
    setBaseInfo,
    setPlayConfig,
    setBarrageInfo,
    setBvid,
  }
})
