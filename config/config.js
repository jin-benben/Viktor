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
          icon: 'iconkehu',
          path: '/TI_Z006',
          routes: [
            {
              path: '/TI_Z006/TI_Z00602',
              name: '客户查询',
              component: './TI_Z006/TI_Z00602',
            },
            {
              path: '/TI_Z006/TI_Z00601',
              name: '客户添加',
              component: './TI_Z006/TI_Z00601',
            },
            {
              path: `/TI_Z006/TI_Z00603`,
              name: '客户详情',
              hideInMenu: true,
              component: './TI_Z006/TI_Z00601',
            },
          ],
        },
        {
          name: '供应商管理',
          icon: 'icongongyingshang',
          path: '/TI_Z007',
          routes: [
            {
              path: '/TI_Z007/TI_Z00702',
              name: '供应商查询',
              component: './TI_Z007/TI_Z00702',
            },
            {
              path: '/TI_Z007/TI_Z00703',
              name: '供应商详情',
              component: './TI_Z007/TI_Z00701',
            },
            {
              path: '/TI_Z007/TI_Z00701',
              name: '供应商添加',
              component: './TI_Z007/TI_Z00701',
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
              component: './message/dd',
            },
            {
              path: '/message/wx',
              name: '微信消息',
              component: './message/wx',
            },
            {
              path: '/message/log',
              name: '推送日志',
              component: './message/pushlog',
            },
            {
              path: '/message/approve',
              name: '钉钉审批单',
              component: './message/ddapprove',
            },
            {
              path: '/message/approve/detail',
              name: '钉钉审批单详情',
              hideInMenu: true,
              component: './message/ddapprove/detail',
            },
            {
              path: '/message/bind',
              name: '微信绑定',
              component: './message/wxbind',
            },
          ],
        },
        {
          name: '员工管理',
          icon: 'iconyuangong',
          path: '/TI_Z004',
          component: './TI_Z004',
        },
        {
          name: '产品分类',
          icon: 'iconwsdzb_zbgzt_xxzx_newpxb_type',
          path: '/TI_Z010',
          component: './TI_Z010',
        },
        {
          name: '组织架构',
          icon: 'iconapartment',
          path: '/TI_Z003',
          component: './TI_Z003',
        },
        {
          name: '权限定义',
          icon: 'iconquanxian',
          path: '/TI_Z0013',
          component: './TI_Z0013',
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
          icon: 'iconpinpai',
          path: '/TI_Z005',
          component: './TI_Z005',
        },
        {
          name: 'exception',
          icon: 'smile',
          hideInMenu: true,
          path: '/exception',
          routes:[
            {
              name: '404',
              path: '/exception/404',
              component: './exception/404',
            },
            {
              name: '403',
              path: '/exception/403',
              component: './exception/403',
            },
            {
              name: '500',
              path: '/exception/500',
              component: './exception/500',
            }
          ]
        },
        {
          name: '客户询价单',
          icon: 'iconxunjia',
          path: '/TI_Z026',
          routes:[
            {
              name: '客户询价单查询',
              path: '/TI_Z026/TI_Z02606',
              component: './TI_Z026/TI_Z02606',
            },
            {
              name: '物料明细查询',
              path: '/TI_Z026/TI_Z02607',
              component: './TI_Z026/TI_Z02607',
            },
            {
              name: '客户询价单编辑',
              path: '/TI_Z026/TI_Z02601',
              component: './TI_Z026/TI_Z02601',
            },
            {
              name: '客户询价单详情',
              icon: 'smile',
              path: '/TI_Z026/TI_Z02602',
              hideInMenu: true,
              component: './TI_Z026/TI_Z02602',
            }
          ]
        },
        {
          name: '采购询价确认单',
          icon: 'iconqueren',
          path: '/TI_Z028',
          routes:[
            {
              name: '采购询价确认单查询',
              path: '/TI_Z028/TI_Z02803',
              component: './TI_Z028/TI_Z02803',
            },
            {
              name: '采购询价确认物料明细查询',
              path: '/TI_Z028/TI_Z02804',
              component: './TI_Z028/TI_Z02804',
            },
            {
              name: '采购询价确认编辑',
              path: '/TI_Z028/TI_Z028',
              component: './TI_Z028/TI_Z02801',
            },
            {
              name: '采购询价确认详情',
              path: '/TI_Z028/TI_Z02802',
              hideInMenu: true,
              component: './TI_Z028/TI_Z02802',
            }
          ]
        },
        {
          name: '销售报价单',
          icon: 'iconquo',
          path: '/TI_Z029',
          routes:[
            {
              name: '销售报价单据查询',
              path: '/TI_Z029/search',
              component: './TI_Z029/TI_Z02906',
            },
            {
              name: '销售报价单明细查询',
              path: '/TI_Z029/searchLine',
              component: './TI_Z029/TI_Z02907',
            },
            {
              name: '销售报价单详情',
              hideInMenu: true,
              path: '/TI_Z029/detail',
              component: './TI_Z029/TI_Z02901',
            },
            {
              name: '销售报价单添加',
              path: '/TI_Z029/edit',
              component: './TI_Z029/TI_Z02901',
            }
          ]
        },
        {
          name: '销售合同',
          icon: 'iconhetong',
          path: '/TI_Z030',
          routes:[
            {
              name: '销售合同单据查询',
              path: '/TI_Z030/search',
              component: './TI_Z030/TI_Z03006',
            },
            {
              name: '销售合同明细查询',
              path: '/TI_Z030/searchLine',
              component: './TI_Z030/TI_Z03007',
            },
            {
              name: '销售合同详情',
              hideInMenu: true,
              path: '/TI_Z030/detail',
              component: './TI_Z030/TI_Z03001',
            },
            {
              name: '销售合同添加',
              path: '/TI_Z030/edit',
              component: './TI_Z030/TI_Z03001',
            }
          ]
        },
        {
          name: '供应商询价单',
          icon: 'iconxunjia',
          path: '/TI_Z027',
          routes:[
            {
              name: '单据查询',
              path: '/TI_Z027/search',
              component: './TI_Z027/TI_Z02706',
            },
            {
              name: '明细查询',
              path: '/TI_Z027/searchLine',
              component: './TI_Z027/TI_Z02707',
            },
            {
              name: '供应商询价单更新',
              hideInMenu: true,
              path: '/TI_Z027/TI_Z02702',
              component: './TI_Z027/TI_Z02702',
            },
            {
              name: '添加',
              path: '/TI_Z027/edit',
              component: './TI_Z027/TI_Z02701',
            }
          ]
        },
        {
          name: '物料管理',
          icon: 'iconSKU',
          path: '/TI_Z009',
          routes:[
            {
              name: '物料查询',
              path: '/TI_Z009/TI_Z00902',
              component: './TI_Z009/TI_Z00902',
            },
            {
              name: '物料详情',
              hideInMenu: true,
              path: '/TI_Z009/TI_Z00903',
              component: './TI_Z009/TI_Z00903',
            },
            {
              name: '物料添加',
              path: '/TI_Z009/TI_Z00901',
              component: './TI_Z009/TI_Z00901',
            }
          ]
        },
        {
          name: '角色管理',
          icon: 'iconjiaose',
          path: '/TI_Z014',
          routes:[
            {
              name: '查询',
              path: '/TI_Z014/search',
              component: './TI_Z014/search',
            },
            {
              name: '权限设置',
              hideInMenu: true,
              path: '/TI_Z014/set',
              component: './TI_Z014/set',
            },
            {
              name: '添加',
              path: '/TI_Z014/edit',
              component: './TI_Z014/add',
            }
          ]
        },
        {
          name: 'SPU管理',
          icon: 'iconSPUguanli',
          path: '/TI_Z011',
          routes:[
            {
              name: 'SPU查询',
              path: '/TI_Z011/TI_Z01102',
              component: './TI_Z011/search.js',
            },
            {
              name: 'SPU添加',
              path: '/TI_Z011/TI_Z01101',
              component: './TI_Z011/add.js',
            }
          ]
        },
        {
          name: '编码管理',
          icon: 'iconcodec',
          path: '/code',
          routes:[
            {
              name: 'hscode',
              path: '/code/hscode',
              component: './code/hscode',
            },
            {
              name: 'fhscode',
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
