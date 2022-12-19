// .vitepress/components/PostCard.vue
<template>
  <article class="post">

    <!-- 标题 -->
    <header class="post-header">
      <h2 class="post-title">
        <a :href="href">{{title}}</a>
      </h2>
    </header>

    <!-- 正文 -->
    <section class="post-excerpt">
      <p>{{ excerpt }}</p>
    </section>

    <footer class="post-meta">
      <a class="author-thumb" :href="'/author/' + author">
        {{ author }}
      </a> on 
      <!-- 文章标签 -->
      <span v-for="(tag, index) in tags"></span>
      <time class="post-date" :datetime="date">{{ date }}</time>
    </footer>
  </article>
</template>


<script>

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    href: {
      type: String,
      required: true,
    },
  },
  methods: {
    truncateText(text, length) {
      if (text.length > length) {
        return text.substring(0, length) + "...";
      }
      return text;
    },
  },
};
</script>

<style>
.post {
    position: relative;
    width: 75%;
    max-width: 900px;
    margin: 4rem auto;
    padding-bottom: 1rem;
    /* border-bottom: #EBF2F6 1px solid; */
    word-wrap: break-word;
}

.post-title {
  font-size: 3.2rem;
}

</style>
