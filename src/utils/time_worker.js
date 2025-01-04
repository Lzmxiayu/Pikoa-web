// （worker线程）
// self.addEventListener('message', e => {
//   // 接收到消息
//   console.log(e.data) // 主线程发送的消息
//   self.postMessage(timestampToDateObj(e.data)) // 向主线程发送消息
// })

export function timestampToDateObj(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  const second = date.getSeconds().toString().padStart(2, '0')
  const ampm = date.getHours() < 12 ? 'AM' : 'PM'

  return {
    year,
    month: Number(month),
    day: Number(day),
    hour,
    minute,
    second,
    ampm,
  }
}
