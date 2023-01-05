// .vitepress/components/PostCard.vue
<template>
  <div v-for="item in PostDocs.slice().reverse()" :key="item.link" class="docs">
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

  <!-- 翻页 -->
  <div v-show="seen" id="hide" class="more-hide">
    <a href="#" @click="morePost">more</a>
  </div>
</template>

<script>
import PostsArray from './posts.json'

export default{
  created() {
    this.seen = true
    this.AllPostDocs = PostsArray
    this.page = 1
    this.size = 5
    this.PostDocs = this.AllPostDocs.slice(-this.size)
    if(this.PostDocs.length == this.AllPostDocs.length){
      this.seen = false
    }
  },

  methods: {
    morePost() {
      this.page++;
      this.PostDocs = this.AllPostDocs.slice(-(this.size * this.page))
      this.moreSeen();
    },
    moreSeen() {
      if (this.size * this.page >= this.AllPostDocs.length) {
        this.seen = false
      }
      this.$forceUpdate()
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

.more-hide {
  text-align: center;
}
</style>
