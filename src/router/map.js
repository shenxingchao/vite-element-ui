/**
 * 组件映射文件
 */
//Layout
export const map = {
  Layout: () => import('@/layout/index.vue'), // 基础布局
  Dashboard: () => import('@/views/dashboard/index.vue') // 控制面板
  // Article: () => import('@/layout/index.vue'), //文章管理
  // ArticleList: () => import('@/views/article/article-list.vue'), // 文章列表
  // ArticleAdd: () => import('@/views/article/article-add.vue'), // 文章添加
  // ArticleEdit: () => import('@/views/article/article-edit.vue') // 文章编辑
}
export default map
