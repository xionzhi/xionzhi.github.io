// .vitepress/components/home.vue
<template>
  <div>
    <ul>
      <li v-for="article in $site.articles" :key="article">
        <nuxt-link :to="article">{{ $page.frontmatter.title }}</nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  // 获取文章列表
  async asyncData({ app }) {
    console.log(articles);
    return {
      articles: app.articles
    }
  }
}
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
