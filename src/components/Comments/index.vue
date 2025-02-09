<template>
  <div ref="commentsWrap" class="comments-wrap" @scroll="handleScrollFn">
    <div class="comments">
      <div
        v-for="comment in replies"
        :key="comment.dynamic_id"
        class="single-comment"
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
            <span :style="{ marginRight: '10px' }">{{
              timestampToDate2(comment.ctime * 1000)
            }}</span>
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
    <div v-if="loading" class="loading-line">
      <a-spin dot />
    </div>
    <div v-if="next_offset === '{}'" class="end-tips">没有更多评论了......</div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { getComments } from '@/server';
import { generateWbiParams } from '@/utils/wbi.js';
import { processAvatarLink, timestampToDate2, throttle } from '@/utils';

const props = defineProps({
  baseInfo: {
    type: Object,
    default: () => {},
  },
});

const commentsWrap = ref(null);
const replies = ref([]);
const next_offset = ref('');
const loading = ref(false);

function handleScroll(e) {
  // console.log(
  //   commentsWrap.value.scrollTop,
  //   commentsWrap.value.offsetHeight,
  //   commentsWrap.value.scrollHeight,
  // )
  const { scrollTop, offsetHeight, scrollHeight } = e.target;
  if (scrollTop + offsetHeight + 10 >= scrollHeight) {
    // 已经滚动到底部
    if (next_offset.value === '{}') return;
    getNextReply();
  }
}

const handleScrollFn = throttle(handleScroll, 50);

function getNextReply() {
  const params = {
    oid: props.baseInfo.aid,
    type: 1,
    mode: 3,
    // pagination_str: '{ offset: '' }',
    plat: 1,
    seek_rpid: '',
    web_location: 1315875,
    pagination_str: next_offset.value,
  };
  const endParams = generateWbiParams(params);
  loading.value = true;
  getComments(endParams).then(res => {
    replies.value = replies.value.concat(res.replies);
    next_offset.value = JSON.stringify({
      offset: res.cursor.pagination_reply.next_offset,
    });
    loading.value = false;
    // console.log(next_offset.value)
  });
}

// 列表宽度变化时重新计算高度
// const observer = new ResizeObserver(entries => {
//   // console.log(entries)
//   handleScroll({ target: commentsWrap.value })
// })

watch(
  () => props.baseInfo,
  () => {
    replies.value = [];
    next_offset.value = '';
    getNextReply();
  },
);

onMounted(() => {
  // observer.observe(commentsWrap.value)
});
</script>

<style scoped>
.comments-wrap {
  height: 100%;
  overflow: auto;
  overflow-x: hidden;
  margin: 0px 0 5px 10px;
  position: relative;
}
.loading-line {
  display: flex;
  justify-content: center;
}
.end-tips {
  text-align: center;
  font-size: 16px;
  color: #858181;
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
  min-height: 150px;
  border-bottom: 1px dashed #e6e6e6;
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
