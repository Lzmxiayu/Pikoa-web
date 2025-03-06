import { Service } from '@/axios';

export const searchAll = async (params: any) =>
  await Service({
    url: '/api/search/all',
    method: 'GET',
    params,
    config: undefined,
  });

export const getVideoView = async (params: any) =>
  Service({
    url: '/api/video/videoView',
    method: 'GET',
    params,
    config: undefined,
  });

export const getPlayList = async (params: any) =>
  Service({
    url: '/api/video/playUrl',
    method: 'GET',
    params,
    config: undefined,
  });

export const downloadFile = async (params?: any) =>
  Service({
    url: '/api/video/download',
    method: 'POST',
    params,
    config: undefined,
  });

export const getComments = async (params: any) =>
  Service({
    url: '/api/video/reply',
    method: 'GET',
    params,
    config: undefined,
  });

export const getRelatedVideos = async (params: any) =>
  Service({
    url: '/api/video/related',
    method: 'GET',
    params,
    config: undefined,
  });

export const getBarrage = async (params: any) =>
  Service({
    url: '/api/video/barrage',
    method: 'GET',
    params,
    config: {
      responseType: 'arraybuffer',
    },
  });

export const getVideoshot = async (params: any) =>
  Service({
    url: '/api/video/videoshot',
    method: 'GET',
    params,
    config: undefined,
  });

export const getFrontRecommendVideos = async (params?: any) =>
  Service({
    url: '/api/base/front_rmcd_video',
    method: 'GET',
    params,
    config: undefined,
  });

export const getViewHistory = async (params: any) =>
  Service({
    url: '/api/history/view',
    method: 'GET',
    params,
    config: undefined,
  });

export const getVideoDetail = async (params: any) =>
  Service({
    url: '/api/video/detail',
    method: 'GET',
    params,
    config: undefined,
  });

/** 创作 */
export const getUploadVideoInfo = async (params: any) =>
  Service({
    url: '/api/file/getUploadList',
    method: 'GET',
    params,
    config: undefined,
  });

export const uploadVideoFile = async (params?: any) =>
  Service({
    url: '/api/file/upload',
    method: 'POST',
    params,
    config: undefined,
  });

export const uploadVideoMerge = async (params?: any) =>
  Service({
    url: '/api/file/merge',
    method: 'POST',
    params,
    config: undefined,
  });
