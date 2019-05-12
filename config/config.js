// ref: https://umijs.org/config/
import { primaryColor } from '../src/defaultSettings';
export default {
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: { hmr: true },
        targets: { ie: 11 },
        locale: {
          enable: true,
          // default false
          default: 'zh-CN',
          // default zh-CN
          baseNavigator: true,
        },
        // default true, when it is true, will use `navigator.language` overwrite default
        dynamicImport: { loadingComponent: './components/PageLoading/index' },
      },
    ],
    [
      'umi-plugin-pro-block',
      {
        moveMock: false,
        moveService: false,
        modifyRequest: true,
        autoAddMenu: true,
      },
    ],
  ],
  targets: { ie: 11 },
  /**
   * 路由相关配置
   */
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          path: '/user',
          component: './Welcome',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/BasicLayout',
      routes: [
        {
          path: '/',
          redirect: '/welcome',
        },
        // dashboard
        {
          path: '/welcome',
          name: 'welcome',
          icon: 'smile',
          component: './Welcome',
        },
        {
          path: 'https://github.com/umijs/umi-blocks/tree/master/ant-design-pro',
          name: 'more-blocks',
          icon: 'block',
        },
        {
          name: '客户管理',
          icon: 'smile',
          path: '/company',
          routes:[
            {
              path: '/company/search',
              name: '客户查询',
              icon: 'smile',
              component: './company/search',
            },
            {
              path: '/company/edit',
              name: '客户添加',
              icon: 'smile',
              component: './company/edit',
            },
          ]
        },
        {
          name: '供应商管理',
          icon: 'smile',
          path: '/supplier',
          routes:[
            {
              path: '/supplier/search',
              name: '供应商查询',
              icon: 'smile',
              component: './supplier/search',
            },
            {
              path: '/supplier/edit',
              name: '供应商添加',
              icon: 'smile',
              component: './supplier/edit',
            },
          ]
        },
        {
          name: '消息管理',
          icon: 'smile',
          path: '/message',
          routes:[
            {
              path: '/message/dd',
              name: '钉钉消息',
              icon: 'smile',
              component: './message/dd',
            },
            {
              path: '/message/wx',
              name: '微信消息',
              icon: 'smile',
              component: './message/wx',
            },
          ]
        },
        {
          name: '员工管理',
          icon: 'smile',
          path: '/staffs',
          component: './staffs',
        },
        {
          name: '产品分类',
          icon: 'smile',
          path: '/category',
          component: './category',
        },
        {
          name: '组织架构',
          icon: 'smile',
          path: '/organization',
          component: './organization',
        },
        {
          name: '权限定义',
          icon: 'smile',
          path: '/authority',
          component: './authority',
        },
        {
          name: '用户查询',
          icon: 'smile',
          path: '/users',
          component: './users',
        },
        {
          name: '品牌管理',
          icon: 'smile',
          path: '/brand',
          component: './brand',
        },
        
      ],
    },
  ],
  disableRedirectHoist: true,
  /**
   * webpack 相关配置
   */
  define: { APP_TYPE: process.env.APP_TYPE || '' },
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: { 'primary-color': primaryColor },
  externals: { '@antv/data-set': 'DataSet' },
  ignoreMomentLocale: true,
  lessLoaderOptions: { javascriptEnabled: true },
};
