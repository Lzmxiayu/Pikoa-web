<template>
  <div class="login_view">
    <div class="bg"></div>
    <div class="frame">
      <img class="slide-right" src="@/assets/images/illustration/haikei.svg" />
      <div class="content">
        <div class="anime-area">
          <div class="title">
            <h1>Pikoa</h1>
            <!-- <h1>Moon</h1>
            <h1>Beach</h1> -->
          </div>
        </div>
        <div class="input-area">
          <a-input
            :style="{
              background: 'transparent',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              color: '#fff',
              marginBottom: '20px',
              borderRadius: '10px',
            }"
            placeholder="请输入用户名"
            allow-clear
          />
          <a-input-password
            :style="{
              background: 'transparent',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              color: '#fff',
              marginBottom: '20px',
              borderRadius: '10px',
            }"
            placeholder="请输入密码"
            allow-clear
          />
          <div class="tip">
            <a-checkbox value="1"
              ><span :style="{ color: '#fff' }">记住我</span></a-checkbox
            >
            <a :style="{ color: '#fff' }">忘记密码?</a>
          </div>
          <a-button class="signupBtn" :style="{ width: '140px' }"
            >登入</a-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script></script>

<style lang="less" scoped>
.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: url('@/assets/images/bg/kai_bg.svg') repeat center/cover;
}
.bg > svg {
  display: none;
  width: 100%;
  height: 100%;
}
@keyframes slide-fwd-center {
  0% {
    transform: translateY(50px);
  }
  100% {
    transform: translateY(0);
  }
}

.frame {
  width: 60%;
  height: 70%;
  position: fixed;
  top: 15%;
  left: 20%;
  z-index: 100;
  box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
  border-radius: 36px;
  animation: slide-fwd-center 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  display: flex;
  padding: 0 40px;
}

.frame > img {
  width: 50%;
  height: 100%;
}
.content {
  width: 40%;
  margin: 40px;
  padding: 80px 80px;
  display: flex;
  flex-direction: column;
}

.anime-area {
  height: 50%;
  width: 100%;
  display: flex;
  // flex-direction: column;
  justify-content: center;
  .title {
    display: flex;
    color: rgb(57, 185, 185);
    font-size: 24px;
  }
}
.input-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tip {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.signupBtn {
  border-radius: 10px;
  background-color: transparent !important;
  color: #fff !important;
  border-color: #fff !important;
  &:hover {
    background: rgba(255, 255, 255, 0.2) !important;
  }
}
</style>
