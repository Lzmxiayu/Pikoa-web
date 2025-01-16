importScripts('spark-md5.min.js')
self.addEventListener('message', e => {
  //   console.log('e.data', e.data)
  // console.time()
  // 计算整个文件的MD5
  //   const { file } = e.data
  //   const fileReader = new FileReader()
  //   fileReader.readAsArrayBuffer(file)
  //   fileReader.onload = e => {
  //     const fileMd5 = SparkMD5.ArrayBuffer.hash(e.target.result)
  //     // console.log(fileMd5)
  //     console.timeEnd()
  //     self.postMessage(fileMd5)
  //   }
  //   fileReader.onerror = e => {
  //     console.log(e)
  //   }

  // 固定取几个分片
  const { md5Arr, infoArr } = e.data
  const spark = new self.SparkMD5.ArrayBuffer()
  const calculateChunk = index => {
    const fileReader = new FileReader()
    fileReader.readAsArrayBuffer(md5Arr[index])
    fileReader.onload = e => {
      spark.append(e.target.result)
      if (index === md5Arr.length - 1) {
        infoArr.forEach(val => {
          spark.append(val)
        })
        // console.timeEnd()
        self.postMessage(spark.end())
      } else {
        calculateChunk(index + 1)
      }
    }
    fileReader.onerror = e => {
      console.log(e)
    }
  }
  calculateChunk(0)

  // 限定2M为单位，头尾取2M, 中间每个2M单位取头中尾2kb
  // const { md5Arr, infoArr } = e.data
  // const fileReader = new FileReader()
  // const spark = new self.SparkMD5.ArrayBuffer()
  // fileReader.readAsArrayBuffer(md5Arr[0])
  // fileReader.onload = e => {
  //   spark.append(e.target.result)
  //   infoArr.forEach(val => {
  //     spark.append(val)
  //   })
  //   self.postMessage(spark.end())
  //   // console.timeEnd()
  // }
  // fileReader.onerror = e => {
  //   console.log(e)
  // }
})
