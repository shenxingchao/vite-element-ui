/**
 * 组件映射文件
 */
//Layout
import Layout from '@/layout/index.vue'
export const map = {
  Layout: () => Layout, // 基础布局
  Dashboard: () => import('@/views/dashboard/index.vue'), // 控制面板
  Article: () => Layout, //文章管理
  ArticleList: () => import('@/views/article/article-list.vue'), // 文章列表
  ArticleAdd: () => import('@/views/article/article-add.vue'), // 文章添加
  ArticleEdit: () => import('@/views/article/article-edit.vue') // 文章编辑
}
export default map
