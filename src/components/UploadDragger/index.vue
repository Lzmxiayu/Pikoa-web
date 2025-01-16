<template>
  <div class="upload-dragger-wrap">
    <div
      class="upload-dragger-rect"
      @click="beginUpload"
      v-if="status === 'init'"
    >
      <icon-upload size="88" color="#696161" />
      <h1>投稿</h1>
      <span>点击或拖拽文件上传 </span>
      <span>(支持格式: mp4, mkv, flv, m3u8)</span>
    </div>
    <div class="upload-loading-rect" v-else-if="status === 'uploading'">
      <a-space size="large" style="margin-bottom: 20px">
        <a-progress
          :status="progressStatus"
          type="circle"
          size="large"
          animation
          :percent="percent"
        />
        <!-- <a-progress type="circle" status="warning" :percent="percent" /> -->
        <!-- <a-progress type="circle" status="danger" :percent="percent" /> -->
        <!-- <a-progress type="circle" status="success" :percent="percent" /> -->
      </a-space>
      <div class="upload-dragger-filelist">
        <div class="upload-dragger-fileitem">
          <icon-file-video size="28" />
          <div class="progress"><span>这是一个文件.mp4</span></div>
          <icon-delete size="28" />
        </div>
      </div>
    </div>

    <input
      ref="fileUploadEl"
      class="file-upload-el"
      type="file"
      @change="handleFileChange"
    />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import {
  IconUpload,
  IconFileVideo,
  IconDelete,
  IconDriveFile,
} from '@arco-design/web-vue/es/icon'
import SparkMD5 from 'spark-md5'
import { throttle } from '@/utils/index'
import { getUploadVideoInfo, uploadVideoFile, uploadVideoMerge } from '@/server'

const fileUploadEl = ref(null)
const status = ref('init')
const percent = ref(0)
const progressStatus = ref('normal')
const successPercent = ref(0)
// const fileMd5Worker = new Worker('worker/fileMd5Worker.js')

const handlePercentUpdate = () => {
  if (status.value !== 'uploading') return
  if (percent.value > successPercent.value) return
  if (successPercent.value === 1) {
    percent.value = 0.99
    setTimeout(() => {
      percent.value = 1.0
      progressStatus.value = 'success'
    }, 500)
  } else {
    percent.value = successPercent.value
  }
}

const updateProgress = throttle(() => {
  console.log('节流更新进度条')
  handlePercentUpdate()
}, 100)

function updatePercent(val) {
  console.log('percent', val, Number((val / 100).toFixed(2)))
  successPercent.value = Number((val / 100).toFixed(2))
  // 节流更新
  updateProgress()
}

function beginUpload() {
  if (status.value !== 'init') return
  fileUploadEl.value.click()
}

/** 固定随机位置取文件切片计算hash
 * 1. 两个相同的文件通过该方法得到的结果一致
 * 2. 两个不同的文件通过该方法得到的结果不一致
 * 3. 当chunkSize跟上传时的保持一致，外面变动时,随机取几个切片的方案会存在问题
 * 4. 计算md5时的切片固定吧，不要跟上传时的混在一起
 * 5. 最终采用固定选取几个切片结合file信息的方案(抽样法)
 */
function getMd5FileArr(file) {
  const md5Arr = []
  const chunkSize = 2 * 1024 * 1024
  const total = Math.ceil(file.size / chunkSize)
  if (total <= 20) {
    return file
  }
  // offset是这里影响判断的量，依赖于file.size
  // 当两个文件file.size一致时, offset一致，结果取决于取的切片 ①
  // 当两个文件file.size不一致时， offset不一致, 结果取决于取的切片 ②
  // 不管offset是否一致，结果都取决于取的切片
  // 疑问: file.size是否存储在前2M的数据中，如果是，则②的情况无需担忧错误的出现
  let offset = Math.floor((total - 6) / 5)
  // console.log(total)
  for (let i = 0; i < total; i++) {
    // console.log('md5FileArr index: ', i)
    md5Arr.push(file.slice(i * chunkSize, (i + 1) * chunkSize))
    i += offset
    if (md5Arr.length === 6) break
  }
  return md5Arr
}
/** 取头尾2M, 中间每个2m切片分别取头尾2kb
 * 1. 两个相同的文件通过该方法得到的结果一致
 * 2. 两个不同的文件通过该方法得到的结果不一致
 * 3. 考虑计算和slice的时间和内存
 */
function getMd5FileArr2(file) {
  if (file.sizd <= 4 * 1024 * 1024) {
    return file
  }
  const offset = 2 * 1024 * 1024
  const chunks = [file.slice(0, offset)]
  let i = 0
  // console.time()
  while (i < file.size - offset) {
    const begin = i
    const end =
      i + offset <= file.size - offset ? i + offset : file.size - offset
    const mid = Math.floor((begin + end) / 2)
    chunks.push(file.slice(begin, begin + 2))
    chunks.push(file.slice(mid, mid + 2))
    chunks.push(file.slice(end - 2, end))
    i += offset
    // console.log('md5FileArr index: ', i)
  }
  // console.timeEnd()
  chunks.push(file.slice(-offset))
  // console.log(file, chunks)
  const blob = new Blob(chunks, { type: file.type })
  // console.log('blob', blob)
  return [blob]
}

const getFileMd5 = async (md5Arr, infoArr) => {
  return new Promise((resolve, reject) => {
    // const fileReader = new FileReader()
    // fileReader.onload = e => {
    //   const fileMd5 = SparkMD5.ArrayBuffer.hash(e.target.result)
    //   // console.log(fileMd5)
    //   resolve(fileMd5)
    // }
    // fileReader.onerror = e => {
    //   reject('文件读取失败', e)
    // }
    // fileReader.readAsArrayBuffer(file)

    // 使用web-worker, 另开线程, 避免主线程阻塞(多文件上传时考虑维护线程池, 控制线程数量)
    const fileMd5Worker = new Worker('worker/fileMd5Worker.js')
    fileMd5Worker.addEventListener('message', e => {
      // console.log('received', e.data)
      resolve(e.data)
      fileMd5Worker.terminate()
    })
    fileMd5Worker.addEventListener('error', e => {
      reject()
    })
    fileMd5Worker.postMessage({ md5Arr, infoArr })
  })
}

async function handleFileChange(e) {
  // console.log(e.target.files)
  status.value = 'uploading'
  const { files } = e.target
  console.log(files)
  Array.from(files).forEach(async file => {
    console.time()
    // 格式检验

    // 拼接用于计算md5的切片及文件信息
    const chunkSize = 10 * 1024 * 1024
    const total = Math.ceil(file.size / chunkSize)
    const md5Arr = getMd5FileArr(file) // getMd5FileArr2(file)
    const encoder = new TextEncoder('utf-8')
    const infoArr = [file.size, file.name, file.type].map(
      val => encoder.encode(val).buffer,
    )
    // console.log(md5Arr, infoArr)
    // 计算MD5
    // 方案,固定大小选取几个切片结合file信息, 计算（其实限定userid会减少很多问题，可以限定userid这个参数）
    const fileMd5 = await getFileMd5(md5Arr, infoArr)
    console.timeEnd()
    console.log(fileMd5)
    return
    // 请求查询
    const info = await getUploadVideoInfo({ fileMd5, fileName: file.name })
    console.log(info)
    if (info.code === 1) {
      if (info.data.end === true) {
        // 已经上传过了, 直接提示成功
        updatePercent(100)
        return
      } else {
        const { uploadedList } = info.data
        // 切片
        // sliceFile(file)
        uploadFileQueue(file, fileMd5)
      }
    }
  })
  e.target.value = null
}

function uploadFileQueue(file, fileMd5, chunkSize = 10 * 1024 * 1024) {
  const fileName = file.name
  const total = Math.ceil(file.size / chunkSize)
  const formData = new FormData()
  formData.set('fileMd5', fileMd5)
  formData.set('fileName', fileName)
  formData.set('total', total)
  // 单个请求
  const uploadChunk = pos => {
    return new Promise(async (resolve, reject) => {
      const chunk = file.slice(pos * chunkSize, (pos + 1) * chunkSize)
      chunk.name = fileName.concat(pos)
      console.log(chunk)
      formData.set('chunk', chunk)
      formData.set('index', pos)
      const res = await uploadVideoFile(formData)
      if (res.code === 1 && res.data === true) {
        resolve()
      } else {
        reject()
      }
    })
  }
  // 控制请求并发数，维护一个队列
  const pool = new Set()
  const waitQueue = []

  const uploadFn = pos => {
    return new Promise(async (resolve, reject) => {
      const isFull = pool.size > 4
      const fn = async () => {
        const req = uploadChunk(pos)
        req.finally(() => {
          // 一个请求结束，空出位给队列的
          pool.delete(fn)
          const next = waitQueue.shift()
          next && pool.add(next)
          setTimeout(() => next?.())
        })
        req.then(resolve)
        req.catch(reject)
        return fn
      }
      if (isFull) {
        // 池子满了，进入等待队列
        waitQueue.push(fn)
      } else {
        // 池子未满，进入池子，执行
        pool.add(fn)
        fn()
      }
    })
  }
  console.log('total', total)
  let count = 0
  for (let i = 0; i < total; i++) {
    uploadFn(i).then(() => {
      console.log('上传完成', i)

      count++
      updatePercent((100 * count) / total)
      if (count === total) {
        updatePercent(100)
        // 请求合并
        const formData = new FormData()
        formData.set('hash', fileMd5)
        formData.set('fileName', fileName)
        uploadVideoMerge(formData)
      }
    })
  }
}
</script>
<style lang="less" scoped>
.upload-dragger-wrap {
  // width: 100%;
  // height: 100%;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // margin-top: 140px;
  // flex-direction: column;
}
.upload-dragger-rect,
.upload-loading-rect {
  width: 600px;
  height: 400px;
  border: 1px dashed #696161;
  border-radius: 10px;
  padding: 100px 20px 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #696161;
  span {
    color: #ccc;
  }
}
.upload-dragger-rect:hover {
  cursor: pointer;
  background: #bcbbbb;
  color: #fff;
  span {
    color: #fff;
  }
}

.upload-loading-rect {
  padding-top: 120px;
}

.upload-dragger-filelist {
  width: 40%;
  height: 400px;
  display: flex;
  flex-direction: column;
}
.upload-dragger-fileitem {
  width: 100%;
  display: flex;
  .progress {
    margin: 0 5px;
    flex: 1;
    span {
      font-size: 16px;
    }
  }
  :deep(.arco-icon) {
    color: #696161;
  }
  :deep(.arco-icon-delete):hover {
    color: #000;
    cursor: pointer;
  }
}
.file-upload-el {
  opacity: 0;
  width: 0;
  height: 0;
}
</style>
