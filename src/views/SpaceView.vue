<template>
  <div class="personal_channel">
    <!-- <div class="personal_channel_bg">
      <img src="" alt="" />
    </div> -->
    <div class="personal_channel_info">
      <div class="avatar">
        <img src="../assets/images/avartar2.jpg" alt="" />
      </div>
      <div class="description">
        <div class="name">Ru's Piano Ru味春捲</div>
        <div class="data">{{ '  2.64M 关注 636 投稿' }}</div>
        <div class="introduction">
          {{ 'I’m RuRu, an ACG pianist from Taiwan.' }}
        </div>
        <div class="subscribe">
          <a-button shape="round">关注</a-button>
        </div>
      </div>
    </div>
    <div class="personal_channel_tab">
      <a-tabs default-active-key="1" size="large">
        <a-tab-pane key="1" title="主页"></a-tab-pane>
        <a-tab-pane key="2" title="视频"> </a-tab-pane>
        <a-tab-pane key="3" title="收藏"> </a-tab-pane>
        <!-- <a-tab-pane key="4" title=""> </a-tab-pane> -->
      </a-tabs>
    </div>
  </div>
</template>

<script setup></script>
<style lang="less" scoped>
.personal_channel {
  display: flex;
  flex-direction: column;
  padding: 40px;
  width: 100%;
  height: 100vh;
  overflow: auto;
}
.personal_channel_bg {
  img {
    width: 100%;
    height: 150px;
    background: #ccc;
  }
  margin-bottom: 30px;
}
.personal_channel_info {
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  .avatar {
    width: 200px;
    height: 200px;
    padding: 10px;
    img {
      width: 180px;
      height: 180px;
      border-radius: 50%;
    }
  }
  .description {
    margin-left: 10px;
    width: 400px;
    height: 200px;
    .name {
      font-size: 38px;
      font-weight: bold;
    }
    .data {
      padding-left: 5px;
      font-size: 18px;
      color: #6a6969;
      margin-bottom: 5px;
    }
    .introduction {
      padding-left: 5px;
      font-size: 18px;
      color: #6a6969;
      margin-bottom: 5px;
    }
    .subscribe {
      font-size: 18px;
    }
  }
}
.personal_channel_tab {
  font-size: 24px;
  :deep(.arco-tabs-nav-tab) {
    height: 60px;
  }
  :deep(.arco-tabs-tab-title) {
    font-size: 18px;
  }
}
</style>
