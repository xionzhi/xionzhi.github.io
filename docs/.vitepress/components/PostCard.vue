// .vitepress/components/PostCard.vue
<template>
  <div v-for="item in PostDocs" :key="item.link" class="docs">
    <article class="post">

      <!-- 标题 -->
      <header class="post-header">
        <h2 class="post-title">
          <a :href="item.link">{{ item.title }}</a>
        </h2>
      </header>

      <!-- 正文 -->
      <section class="post-excerpt">
        <p>{{ item.excerpt }} <a :href="item.link"> »</a></p>
      </section>

      <footer class="post-meta">
        <a class="author-thumb" :href="'/author/' + item.author">
          {{ item.author }}
        </a> | 
        <!-- 文章标签 -->
        <span v-for="(tag, index) in item.tags">{{ tag }}&nbsp</span> | 
        <time class="post-date" :datetime="item.date">{{ item.date }}</time>
      </footer>
    </article>
  </div>
</template>

<script>
import PostDocs from './posts.json'

export default{
    data(){
        return{
          PostDocs: PostDocs
        }
    }
}
</script>

<style>
.post {
    position: relative;
    /* width: 75%; */
    max-width: 800px;
    margin: 1rem auto;
    padding-bottom: 1rem;
    /* border-bottom: #EBF2F6 1px solid; */
    word-wrap: break-word;
}

.post-title {
  font-size:1rem;
}

</style>
