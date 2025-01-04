import { Service } from '@/axios'

export const searchAll = async (params: any) =>
  await Service({
    url: '/api/search/all',
    method: 'GET',
    params,
    config: undefined,
  })

export const getVideoView = async (params: any) =>
  Service({
    url: '/api/videoView',
    method: 'GET',
    params,
    config: undefined,
  })

export const getPlayList = async (params: any) =>
  Service({
    url: '/api/playUrl',
    method: 'GET',
    params,
    config: undefined,
  })

export const downloadFile = async (params?: any) =>
  Service({
    url: '/api/download',
    method: 'POST',
    params,
    config: undefined,
  })

export const getComments = async (params: any) =>
  Service({
    url: '/api/reply',
    method: 'GET',
    params,
    config: undefined,
  })

export const getRelatedVideos = async (params: any) =>
  Service({
    url: '/api/related',
    method: 'GET',
    params,
    config: undefined,
  })

export const getBarrage = async (params: any) =>
  Service({
    url: '/api/barrage',
    method: 'GET',
    params,
    config: {
      responseType: 'arraybuffer',
    },
  })

export const getVideoshot = async (params: any) =>
  Service({
    url: '/api/videoshot',
    method: 'GET',
    params,
    config: undefined,
  })

export const getFrontRecommendVideos = async (params: any) =>
  Service({
    url: '/api/front_rmcd_video',
    method: 'GET',
    params,
    config: undefined,
  })

export const getViewHistory = async (params: any) =>
  Service({
    url: '/api//history/view',
    method: 'GET',
    params,
    config: undefined,
  })

export const getVideoDetail = async (params: any) =>
  Service({
    url: '/api/video/detail',
    method: 'GET',
    params,
    config: undefined,
  })
