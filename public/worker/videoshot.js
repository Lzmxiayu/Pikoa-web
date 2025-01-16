self.addEventListener('message', e => {
  console.log('videoshot', e.data)
  const { imageData, x = 20, y = 20, offScreenCanvas } = e.data
  const { width, height } = imageData
  const croppedImageData = new ImageData(200, 200)

  const sourceData = imageData.data
  const destinationData = croppedImageData.data
  const sourceWidth = imageData.width
  const sourceHeight = imageData.height

  console.log(x, y)
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      // rgba + 4个字节一个像素
      const sourceIndex = (i + y) * sourceWidth * 4 + (j + x) * 4
      const destinationIndex = i * width * 4 + j * 4
      destinationData[destinationIndex] = sourceData[sourceIndex]
      destinationData[destinationIndex + 1] = sourceData[sourceIndex + 1]
      destinationData[destinationIndex + 2] = sourceData[sourceIndex + 2]
      destinationData[destinationIndex + 3] = sourceData[sourceIndex + 3]
    }
  }
  console.log('croppedImageData', croppedImageData)

  for (let i = 0; i < sourceData.length; i++) {
    if (sourceData[i] !== destinationData[i]) {
      console.log(i)
      break
    }
  }
  // 将imageData转为base64
  // const offscreenCanvas = new OffscreenCanvas(200, 200) // new OffscreenCanvas(imageData.width, imageData.height)
  // const ctx = offscreenCanvas.getContext('2d')
  // console.log('切割', imageData)
  // ctx.putImageData(croppedImageData, 0, 0)

  offScreenCanvas.convertToBlob().then(blob => {
    console.log('blob', blob)
    self.postMessage(blob)
  })
})

self.addEventListener('error', e => {
  console.log('error', e)
})
