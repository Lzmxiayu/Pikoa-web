<template>
  <div class="comments-wrap" @scroll="handleScrollFn" ref="commentsWrap">
    <div
      class="comments"
      :style="{
        height: `${totalHeight}px`,
      }"
    >
      <div
        class="single-comment"
        v-for="comment in showList"
        :key="comment.dynamic_id"
        :style="{ top: `${comment.top}px` }"
      >
        <div class="single-comment-avatar">
          <img
            :alt="comment.member.uname"
            :src="processAvatarLink(comment.member.avatar)"
          />
        </div>
        <div class="single-comment-content">
          <div class="single-comment-content-title">
            {{ comment.member.uname }}
          </div>
          <div class="single-comment-content-text">
            {{ comment.content.message }}
          </div>
          <div class="single-comment-content-info">
            <span :style="{ marginRight: '10px' }">2022-10-05 12:00</span>
            <div class="{classes.container}">
              <!-- <ThumbLike class="{classes.icon24}" /> -->
            </div>
            <div class="{classes.container}">
              <!-- <ThumbDislike class="{classes.icon24}" /> -->
            </div>
          </div>
          <div class="single-comment-content-reply"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { getComments } from '@/server'
import { generateWbiParams } from '@/utils/wbi.js'
import { processAvatarLink, debounce, throttle } from '@/utils'

const props = defineProps(['baseInfo'])

const commentsWrap = ref(null)
const replies = ref([])
const next_offset = ref('')
const showList = ref([])
const totalHeight = ref(0) // 列表总高度
const summation = ref([]) // 累加高度数组

function generateTextDom() {
  const text = document.createElement('div')
  text.classList.add('single-comment-content-text')
  commentsWrap.value.querySelector('.comments').appendChild(text)
  text.innerText = 'abcfuck'
  console.log(text.offsetHeight)
  text.innerText =
    'abdqwdqwddqwcfuckabdqwdqwddqwcfuckabdqwdqwddqwcfuckabdqwdqwddqwcfuckabdqwdqwddqwcfuckabdqwdqwddqwcfuckabdqwdqwddqwcfuckabdqwdqwddqwcfuckabdqwdqwddqwcfuckabdqwdqwddqwcfuckabdqwdqwddqwcfuckabdqwdqwddqwcfuckabdqwdqwddqwcfuckabdqwdqwddqwcfuckabdqwdqwddqwcfuckabdqwdqwddqwcfuckabdqwdqwddqwcfuckabdqwdqwddqwcfuck'
  console.log(text.offsetHeight)
}

function getHeight() {
  // generateTextDom()
  const singleMessageWidth = commentsWrap.value.offsetWidth - 80 - 20
  const fontSize = 16
  const lineHeight = 22
  summation.value = [0]
  totalHeight.value = replies.value.reduce((pre, cur, idx) => {
    cur.top = pre
    const lines = Math.ceil(
      cur.content.message.length / Math.floor(singleMessageWidth / fontSize),
    )
    const height = lines * lineHeight + (26 + 10) + 10 + 23 + 20
    console.log(height)
    summation.value.push(pre + (height > 150 ? height : 150))
    return pre + (height > 150 ? height : 150)
  }, 0)
}

function handleScroll(e) {
  // console.log(e.target.scrollTop)
  // console.log(e.target.offsetHeight)
  const start = Math.max(
    summation.value.findIndex(item => item >= e.target.scrollTop - 25) - 2,
    0,
  )
  const end = Math.min(
    summation.value.findIndex(
      item => item >= e.target.scrollTop + e.target.offsetHeight - 25,
    ) + 2,
    replies.value.length,
  )
  console.log(start, end)
  showList.value = replies.value.slice(start, end)
}

const handleScrollFn = throttle(handleScroll, 50)

function getReply() {
  const params = {
    oid: props.baseInfo.aid,
    type: 1,
    mode: 3,
    // pagination_str: '{ offset: '' }',
    plat: 1,
    seek_rpid: '',
    web_location: 1315875,
    // pagination_str:
    //   next_offset.value === ''
    //     ? {}
    //     : {
    //         offset: next_offset.value,
    //       },
    pagination_str: JSON.stringify({
      offset: JSON.stringify({
        type: 1,
        direction: 1,
        data: {
          pn: 2,
        },
      }),
    }),
  }
  const endParams = generateWbiParams(params)
  getComments(endParams).then(res => {
    replies.value = res.replies
    console.log(res)
    getHeight()
    handleScroll({ target: commentsWrap.value })
  })
}

// 列表宽度变化时重新计算高度
const observer = new ResizeObserver(entries => {
  // console.log(entries)
  getHeight()
  handleScroll({ target: commentsWrap.value })
})

watch(() => props.baseInfo, getReply)

onMounted(() => {
  observer.observe(commentsWrap.value)
})
</script>

<style scoped>
.comments-wrap {
  height: calc(100% - 25px);
  overflow: auto;
  margin: 20px 0 5px 10px;
  position: relative;
}

.comments {
  height: auto;
  margin: 20px 0 5px 10px;
  position: relative;
}
.fixed-list::-webkit-scrollbar {
  width: 4px;
}
.fixed-list::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 5px;
}

.fixed-list::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 5px;
}

.single-comment {
  display: flex;
  max-height: 700px;
  min-height: 150px;
  border-bottom: 1px dashed #e6e6e6;
  position: absolute;
}

.comments-wrap::-webkit-scrollbar {
  width: 6px;
}
.comments-wrap::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 5px;
}

.comments-wrap::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 5px;
}

.single-comment-avatar {
  width: 80px;
  height: 100%;
}
.single-comment-avatar > img {
  width: 60px;
  height: 60px;
  margin: 10px;
  border-radius: 50%;
}

.single-comment-content {
  flex: 1;
  height: 100%;
  display: flex;
  padding: 10px;
  flex-direction: column;
  /* background-color: #eee; */
}

.single-comment-content-title {
  font-size: 16px;
  color: #61666d;
  margin-bottom: 10px;
}
.single-comment-content-text {
  margin-bottom: 10px;
  min-height: 66px;
}

.single-comment-content-info {
  color: #9499a0;
  font-size: 14px;
  /* padding: 0 10px; */
  display: flex;
  align-items: center;
  justify-self: flex-end;
}
</style>
<style>
.single-comment-content-text {
  margin-bottom: 10px;
  min-height: 66px;
}
</style>
