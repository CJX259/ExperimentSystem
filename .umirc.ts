import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
  theme: {
    'primary-color': '#008c8c',
    'error-color': '#cf1322',
  },
  dva: {},
  title: '广州大学实验报告上传系统',
  // 修改icon
  links: [
    // href的图片你可以放在public里面，直接./图片名.png 就可以了，也可以是cdn链接
    { rel: 'icon', href: './校徽.jpg' },
  ],
  routes: [
    {
      exact: false,
      path: '/',
      component: '@/layouts/index',
      routes: [
        {
          exact: true,
          path: '/',
          component: '@/pages/index',
          // wrappers: [
          //   '@/wrappers/haveLogin',
          // ],
        },
        { exact: true, path: '/login', component: '@/pages/login' },
        { exact: true, path: '/addcourse', component: '@/pages/addCourse' },
        {
          exact: true,
          path: '/selectcourse',
          component: '@/pages/selectCourse',
          wrappers: ['@/wrappers/haveLocationState'],
        },
        {
          exact: true,
          path: '/selectexperiment',
          component: '@/pages/selectExperiment',
          // 防止复制过来的url，没有state，报错
          wrappers: ['@/wrappers/haveLocationState'],
        },
        {
          exact: true,
          path: '/detailexperiment',
          component: '@/pages/detailExperiment',
          wrappers: ['@/wrappers/haveLocationState'],
        },
        {
          exact: true,
          path: '/updatepassword',
          component: '@/pages/updatePassword',
        },
        {
          exact: false,
          path: '*',
          component: '@/pages/notFound',
        },
      ],
    },
  ],
});
