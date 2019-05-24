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
          enable: false,
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
      hideInMenu: true,
      component: '../layouts/UserLayout',
      routes: [
        {
          path: '/user',
          hideInMenu: true,
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
          hideInMenu: true,
          redirect: '/welcome',
        },
        // dashboard
        {
          path: '/welcome',
          name: 'welcome',
          hideInMenu: true,
          icon: 'smile',
          component: './Welcome',
        },
        {
          path: 'https://github.com/umijs/umi-blocks/tree/master/ant-design-pro',
          name: 'more-blocks',
          hideInMenu: true,
          icon: 'block',
        },
        {
          name: '客户管理',
          icon: 'smile',
          path: '/company',
          routes: [
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
            {
              path: `/company/detail`,
              name: '客户详情',
              hideInMenu: true,
              icon: 'smile',
              component: './company/edit',
            },
          ],
        },
        {
          name: '供应商管理',
          icon: 'smile',
          path: '/supplier',
          routes: [
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
          ],
        },
        {
          name: '消息管理',
          icon: 'smile',
          hideInMenu: true,
          path: '/message',
          routes: [
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
            {
              path: '/message/log',
              name: '推送日志',
              icon: 'smile',
              component: './message/pushlog',
            },
            {
              path: '/message/approve',
              name: '钉钉审批单',
              icon: 'smile',
              component: './message/ddapprove',
            },
            {
              path: '/message/approve/detail',
              name: '钉钉审批单详情',
              hideInMenu: true,
              icon: 'smile',
              component: './message/ddapprove/detail',
            },
            {
              path: '/message/bind',
              name: '微信绑定',
              icon: 'smile',
              component: './message/wxbind',
            },
          ],
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
          hideInMenu: true,
          component: './users',
        },
        {
          name: '品牌管理',
          icon: 'smile',
          path: '/brand',
          component: './brand',
        },
        {
          name: 'exception',
          icon: 'smile',
          hideInMenu: true,
          path: '/exception',
          routes:[
            {
              name: '404',
              icon: 'smile',
              path: '/exception/404',
              component: './exception/404',
            },
            {
              name: '403',
              icon: 'smile',
              path: '/exception/403',
              component: './exception/403',
            },
            {
              name: '500',
              icon: 'smile',
              path: '/exception/500',
              component: './exception/500',
            }
          ]
        },
        {
          name: '客户询价单',
          icon: 'smile',
          path: '/inquiry',
          routes:[
            {
              name: '客户询价单查询',
              icon: 'smile',
              path: '/inquiry/search',
              component: './inquiry/list',
            },
            {
              name: '物料明细查询',
              icon: 'smile',
              path: '/inquiry/lineDetail',
              component: './inquiry/lineDetail',
            },
            {
              name: '客户询价单编辑',
              icon: 'smile',
              path: '/inquiry/edit',
              component: './inquiry/edit',
            },
            {
              name: '客户询价单详情',
              icon: 'smile',
              path: '/inquiry/detail',
              hideInMenu: true,
              component: './inquiry/edit',
            }
          ]
        },
        {
          name: '采购询价确认单',
          icon: 'smile',
          path: '/TI_Z028',
          routes:[
            {
              name: '采购询价确认单查询',
              icon: 'smile',
              path: '/TI_Z028/TI_Z02803',
              component: './TI_Z028/TI_Z02803',
            },
            {
              name: '采购询价确认物料明细查询',
              icon: 'smile',
              path: '/TI_Z028/TI_Z02804',
              component: './TI_Z028/TI_Z02804',
            },
            {
              name: '采购询价确认编辑',
              icon: 'smile',
              path: '/TI_Z028/TI_Z028',
              component: './TI_Z028/TI_Z02801',
            },
            {
              name: '采购询价确认详情',
              icon: 'smile',
              path: '/TI_Z028/TI_Z02802',
              hideInMenu: true,
              component: './TI_Z028/TI_Z02802',
            }
          ]
        },
        {
          name: '销售报价单',
          icon: 'smile',
          path: '/TI_Z029',
          routes:[
            {
              name: '销售报价单据查询',
              icon: 'smile',
              path: '/TI_Z029/search',
              component: './TI_Z029/TI_Z02906',
            },
            {
              name: '销售报价单明细查询',
              icon: 'smile',
              path: '/TI_Z029/searchLine',
              component: './TI_Z029/TI_Z02907',
            },
            {
              name: '销售报价单添加',
              icon: 'smile',
              path: '/TI_Z029/edit',
              component: './TI_Z029/TI_Z02901',
            }
          ]
        },
        {
          name: '销售合同',
          icon: 'smile',
          path: '/TI_Z030',
          routes:[
            {
              name: '销售合同单据查询',
              icon: 'smile',
              path: '/TI_Z030/search',
              component: './TI_Z030/TI_Z03006',
            },
            {
              name: '销售合同明细查询',
              icon: 'smile',
              path: '/TI_Z030/searchLine',
              component: './TI_Z030/TI_Z03007',
            },
            {
              name: '销售合同添加',
              icon: 'smile',
              path: '/TI_Z030/edit',
              component: './TI_Z030/TI_Z03001',
            }
          ]
        },
        {
          name: '供应商询价单',
          icon: 'smile',
          path: '/TI_Z027',
          routes:[
            {
              name: '单据查询',
              icon: 'smile',
              path: '/TI_Z027/search',
              component: './TI_Z027/TI_Z02706',
            },
            {
              name: '明细查询',
              icon: 'smile',
              path: '/TI_Z027/searchLine',
              component: './TI_Z027/TI_Z02707',
            },
            {
              name: '供应商询价单更新',
              icon: 'smile',
              hideInMenu: true,
              path: '/TI_Z027/TI_Z02702',
              component: './TI_Z027/TI_Z02702',
            },
            {
              name: '添加',
              icon: 'smile',
              path: '/TI_Z027/edit',
              component: './TI_Z027/TI_Z02701',
            }
          ]
        },
        {
          name: '物料管理',
          icon: 'smile',
          path: '/sku',
          routes:[
            {
              name: '物料查询',
              icon: 'smile',
              path: '/sku/search',
              component: './sku/search.js',
            },
            {
              name: '物料详情',
              icon: 'smile',
              hideInMenu: true,
              path: '/sku/detail',
              component: './sku/detail',
            },
            {
              name: '物料添加',
              icon: 'smile',
              path: '/sku/add',
              component: './sku/add.js',
            }
          ]
        },
        {
          name: '角色管理',
          icon: 'smile',
          path: '/TI_Z014',
          routes:[
            {
              name: '查询',
              icon: 'smile',
              path: '/TI_Z014/search',
              component: './TI_Z014/search',
            },
            {
              name: '权限设置',
              icon: 'smile',
              hideInMenu: true,
              path: '/TI_Z014/set',
              component: './TI_Z014/set',
            },
            {
              name: '添加',
              icon: 'smile',
              path: '/TI_Z014/edit',
              component: './TI_Z014/add',
            }
          ]
        },
        {
          name: 'SPU管理',
          icon: 'smile',
          path: '/spu',
          routes:[
            {
              name: 'SPU查询',
              icon: 'smile',
              path: '/spu/search',
              component: './spu/search.js',
            },
            {
              name: 'SPU添加',
              icon: 'smile',
              path: '/spu/add',
              component: './spu/add.js',
            }
          ]
        },
        {
          name: '编码管理',
          icon: 'smile',
          path: '/code',
          routes:[
            {
              name: 'hscode',
              icon: 'smile',
              path: '/code/hscode',
              component: './code/hscode',
            },
            {
              name: 'fhscode',
              icon: 'smile',
              path: '/code/fhscode',
              component: './code/fhscode',
            }
          ]
        }
      ],
    },
  ],
  proxy: {
    "/MDM": {
      "target": "http://117.149.160.231:9301/",
      "changeOrigin": true,
      "pathRewrite": { "^/MDM" : "/" }
    },
    "/OMS": {
      "target": "http://117.149.160.231:9302/",
      "changeOrigin": true,
      "pathRewrite": { "^/OMS" : "/" }
    }
  },
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
