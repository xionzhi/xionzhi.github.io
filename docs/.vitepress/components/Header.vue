// .vitepress/components/home.vue
<template>
  <div class="site-wrapper">
    <header class="main-background">
    <img src="https://xionzhi.com/content/images/file/DSCF0609.webp" />
    </header>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  // 请求每日一图
  methods: {

  },
};
</script>

<style>
.site-wrapper {
    position: relative;
    z-index: 10;
    min-height: 100%;
    background: #fff;
    -webkit-transition: -webkit-transform 0.5s ease;
    transition: transform 0.5s ease;
}

.main-header {
    position: relative;
    display: table;
    width: 100%;
    height: 100vh;
    margin-bottom: 5rem;
    text-align: center;
    background: #222 no-repeat center center;
    background-size: cover;
    overflow: hidden;
}
</style>
