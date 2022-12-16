<!--.vitepress/theme/PostLayout.vue-->
<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'

const { Layout } = DefaultTheme

const { frontmatter } = useData() // 这里的frontmatter就是各个md文件中自己写在最上面的东西

</script>

<template>
  <Layout>
    <template #doc-before>
      <h1 class="page-title">{{ frontmatter.title }}</h1>
      <span class="page-info">{{ frontmatter.author }}</span>
      <span class="page-info">{{ frontmatter.date }}</span>
      <span>
        <span class="page-info" v-for="item in frontmatter.tags" :key="item">{{ item }}</span>
      </span>
    </template>
  </Layout>
</template>

<style>
  .page-title{
    letter-spacing: -0.4px;
    line-height: 40px;
    font-size: 32px;
    font-weight: 700;
    white-space: pre-wrap;
    margin-bottom: 20px;
  }
  .page-info{
    flex-grow: 1;
    padding-top: 8px;
    line-height: 24px;
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-text-2);
    margin-right: 10px;
  }
</style>
