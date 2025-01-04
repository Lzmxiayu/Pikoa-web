import axios, { type AxiosRequestConfig } from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  // timeout: 5000,
})

const cancelSourceMap = new Map()

const Service = async (configs: {
  url: any
  method?: 'GET' | any
  params: any
  config: any
}) => {
  const { url, method = 'GET', params, config } = configs

  if (cancelSourceMap.has(url)) {
    cancelSourceMap.get(url).cancel()
    cancelSourceMap.delete(url)
  }
  const cancelTokenSource = axios.CancelToken.source()
  cancelSourceMap.set(url, cancelTokenSource)
  if (method === 'GET') {
    const data = await Service.get(url, params, config, cancelTokenSource)
    return data
  } else if (method === 'POST') {
    const data = await Service.post(url, params, config, cancelTokenSource)
    return data
  }
}

Service.get = async (
  url: string,
  params: any,
  config: AxiosRequestConfig<any> | any,
  cancelTokenSource: { token: any },
) => {
  // console.log(Date.now(), params)
  let data = {}
  await instance
    .get(url, {
      params,
      ...config,
      cancelToken: cancelTokenSource.token,
    })
    .then((res: { data: {} }) => {
      // console.log('res', res);
      data = res.data
    })
  return data
}

Service.post = async (
  url: string,
  params: any,
  config: AxiosRequestConfig<any> | any,
  cancelTokenSource: any,
) => {
  // console.log(Date.now());
  let data = {}
  await instance
    .post(url, params, {
      ...config,
      cancelToken: cancelTokenSource.token,
    })
    .then((res: { data: {} }) => {
      // console.log('res', res);
      data = res.data
    })
  return data
}

export { Service }
