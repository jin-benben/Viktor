export default [
  {
    path: '/user',
    hideInMenu: true,
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      {
        path: '/user/login',
        hideInMenu: true,
        component: './users/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      { path: '/', redirect: '/welcome' },
      {
        name: '首页',
        icon: 'iconshouye',
        path: '/welcome',
        component: './welcome',
      },
      {
        name: '基础设置',
        icon: 'iconjichu',
        path: '/base',
        routes:[
          {
            name: '组织架构',
            icon: 'iconapartment',
            path: '/base/TI_Z003',
            component: './TI_Z003',
          },
          {
            name: '员工管理',
            icon: 'iconyuangong',
            path: '/base/TI_Z004',
            component: './TI_Z004',
          },
          {
            name: '数据权限设置',
            icon: 'iconyuangong',
            hideInMenu:true,
            path: '/base/dataAuthority',
            component: './TI_Z004/set',
          },
          {
            name: '邮箱管理',
            icon: 'iconEmailHili',
            path: '/base/TI_Z051',
            component: './TI_Z051',
          },
          {
            name: '转移分类',
            icon: 'iconyuangong',
            path: '/base/TI_Z050',
            component: './TI_Z050',
          },
          {
            name: '打印',
            icon: 'iconyuangong',
            path: '/base/print',
            hideInMenu:true,
            component: './print',
          },
          {
            name: '邮件发送',
            icon: 'iconyuangong',
            path: '/base/sendEmail',
            hideInMenu:true,
            component: './email',
          },
          {
            name: '打印记录',
            icon: 'icondayin',
            path: '/base/print/history',
            component: './print/history',
          },
          {
            name: '打印记录详情',
            icon: 'iconyuangong',
            hideInMenu:true,
            path: '/base/print/detail',
            component: './print/detail',
          },
          {
            name: '电子面单查询',
            icon: 'icondayin',
            path: '/base/express/history',
            component: './TI_Z048/history',
          },
          {
            name: '电子面单详情',
            icon: 'iconyuangong',
            hideInMenu:true,
            path: '/base/express/detail',
            component: './TI_Z048/detail',
          },
          {
            name: '邮件发送记录',
            icon: 'iconEmailHili',
            path: '/base/sendEmail/history',
            component: './email/history',
          },
          {
            name: '邮件发送记录详情',
            icon: 'iconyuangong',
            hideInMenu:true,
            path: '/base/sendEmail/detail',
            component: './email/detail',
          },
         
          {
            name: '权限管理',
            icon: 'iconjiaose',
            path: '/base/TI_Z014',
            routes:[
              {
                name: '角色添加',
                path: '/base/TI_Z014/edit',
                component: './TI_Z014/add'
              },
              {
                name: '角色查询',
                path: '/base/TI_Z014/search',
                component: './TI_Z014/search',
              },
              {
                name: '权限设置',
                hideInMenu: true,
                path: '/base/TI_Z014/set',
                component: './TI_Z014/set',
              },
              {
                name: '权限定义',
                path: '/base/TI_Z014/TI_Z013',
                component: './TI_Z013',
              },
              {
                name: '数据权限',
                path: '/base/TI_Z014/TI_Z004',
                component: './TI_Z004/set',
              },
            ]
          },
          {
            name: 'HTML模板',
            icon: 'iconxunjia',
            path: '/base/TI_Z049',
            routes:[
              {
                name: '添加',
                path: '/base/TI_Z049/add',
                component: './TI_Z049/TI_Z04901',
              },
              {
                name: '查询',
                path: '/base/TI_Z049/search',
                component: './TI_Z049/TI_Z04902',
              },
              {
                name: '详情',
                path: '/base/TI_Z049/detail',
                component: './TI_Z049/TI_Z04901',
              },
            ]
          },
          {
            name: '单据打印模板',
            path: '/base/TI_Z044',
            icon:"icontemplate",
            component: './TI_Z044',
          },
          {
            name: '邮件发送模板',
            path: '/base/TI_Z046',
            icon:"iconemail",
            component: './TI_Z046',
          },
        ]
      },
      {
        name: '业务主数据',
        icon: 'iconyezhushuju',
        path: '/main',
        routes:[
            {
              name: '产品相关',
              icon: 'iconchanpin',
              path:'/main/product',
              routes:[
                {
                  name: '品牌管理',
                  icon: 'iconpinpai',
                  path: '/main/product/TI_Z005',
                  component: './TI_Z005',
                },
                {
                  name: '品牌详情',
                  hideInMenu:true,
                  path: '/main/product/TI_Z005/detail',
                  component: './TI_Z005/detail',
                },
                {
                  name: '产品分类',
                  icon: 'iconwsdzb_zbgzt_xxzx_newpxb_type',
                  path: '/main/product/TI_Z010',
                  component: './TI_Z010',
                },
                {
                  name: '产地',
                  icon: 'iconwsdzb_zbgzt_xxzx_newpxb_type',
                  path: '/main/product/TI_Z042',
                  component: './TI_Z042',
                },
                {
                  name: '物料管理',
                  icon: 'iconSKU',
                  path: '/main/product/TI_Z009',
                  routes:[
                    {
                      name: '物料添加',
                      path: '/main/product/TI_Z009/TI_Z00901',
                      component: './TI_Z009/TI_Z00901',
                    },
                    {
                      name: '物料查询',
                      path: '/main/product/TI_Z009/TI_Z00902',
                      component: './TI_Z009/TI_Z00902',
                    },
                    {
                      name: '物料详情',
                      hideInMenu: true,
                      path: '/main/product/TI_Z009/TI_Z00903',
                      component: './TI_Z009/TI_Z00903',
                    }
                   
                  ]
                },
                {
                  name: 'SPU管理',
                  icon: 'iconSPUguanli',
                  path: '/main/product/TI_Z011',
                  routes:[
                    {
                      name: 'SPU添加',
                      path: '/main/product/TI_Z011/TI_Z01101',
                      component: './TI_Z011/add.js',
                    },
                    {
                      name: 'SPU查询',
                      path: '/main/product/TI_Z011/TI_Z01102',
                      component: './TI_Z011/search.js',
                    }
                  ]
                },
                {
                  name: '编码管理',
                  icon: 'iconcodec',
                  path: '/main/product/code',
                  routes:[
                    {
                      name: '国内海关编码',
                      path: '/main/product/code/hscode',
                      component: './code/hscode',
                    },
                    {
                      name: '国内海关编码详情',
                      hideInMenu:true,
                      path: '/main/product/code/hscode/detail',
                      component: './code/hscode/detail',
                    },
                    {
                      name: '国外海关编码',
                      path: '/main/product/code/fhscode',
                      component: './code/fhscode',
                    }
                  ]
                },
               
              ]
            },
            {
              name: '供应商管理',
              icon: 'icongongyingshang',
              path: '/main/TI_Z007',
              routes: [
                {
                  path: '/main/TI_Z007/add',
                  name: '供应商添加',
                  component: './TI_Z007/TI_Z00701',
                },
                {
                  path: '/main/TI_Z007/search',
                  name: '供应商查询',
                  component: './TI_Z007/TI_Z00702',
                },
                {
                  path: '/main/TI_Z007/detail',
                  name: '供应商详情',
                  hideInMenu: true,
                  component: './TI_Z007/TI_Z00701',
                },
              ],
            },
            {
              name: '客户管理',
              icon: 'iconkehu',
              path: '/main/TI_Z006',
              routes: [
                {
                  path: '/main/TI_Z006/add',
                  name: '客户添加',
                  component: './TI_Z006/TI_Z00601',
                },
                {
                  path: '/main/TI_Z006/serach',
                  name: '客户查询',
                  component: './TI_Z006/TI_Z00602',
                },
                {
                  path: `/main/TI_Z006/detail`,
                  name: '客户详情',
                  hideInMenu: true,
                  component: './TI_Z006/TI_Z00601',
                },
              ],
            },
        ]
      }, 
      {
        name: '销售业务',
        icon: 'iconxiaoshou',
        path: '/sellabout',
        routes:[
          {
            name: '客户询价单',
            icon: 'iconxunjia',
            path: '/sellabout/TI_Z026',
            routes:[
              {
                name: '单据添加',
                path: '/sellabout/TI_Z026/TI_Z02601',
                component: './TI_Z026/TI_Z02601',
              },
              {
                name: '单据查询',
                path: '/sellabout/TI_Z026/TI_Z02606',
                component: './TI_Z026/TI_Z02606',
              },
              {
                name: '明细查询',
                path: '/sellabout/TI_Z026/TI_Z02607',
                component: './TI_Z026/TI_Z02607',
              },
              {
                name: '轨迹查询',
                path: '/sellabout/TI_Z026/track',
                component: './TI_Z026/track',
              },
              {
                name: '客户询价详情',
                path: '/sellabout/TI_Z026/detail',
                hideInMenu: true,
                component: './TI_Z026/TI_Z02603',
              },
              {
                name: '客户询价单更新',
                path: '/sellabout/TI_Z026/TI_Z02602',
                hideInMenu: true,
                component: './TI_Z026/TI_Z02601',
              }
            ]
          },
          
          {
            name: '销售报价单',
            icon: 'iconquo',
            path: '/sellabout/TI_Z029',
            routes:[
              {
                name: '单据添加',
                path: '/sellabout/TI_Z029/add',
                component: './TI_Z029/TI_Z02901',
              },
              {
                name: '单据查询',
                path: '/sellabout/TI_Z029/search',
                component: './TI_Z029/TI_Z02906',
              },
              {
                name: '明细查询',
                path: '/sellabout/TI_Z029/searchLine',
                component: './TI_Z029/TI_Z02907',
              },
              {
                name: '销售报价单更新',
                hideInMenu: true,
                path: '/sellabout/TI_Z029/update',
                component: './TI_Z029/TI_Z02901',
              },
              {
                name: '销售报价单详情',
                hideInMenu: true,
                path: '/sellabout/TI_Z029/detail',
                component: './TI_Z029/TI_Z02903',
              },
              
            ]
          },
          {
            name: '销售合同',
            icon: 'iconhetong',
            path: '/sellabout/TI_Z030',
            routes:[
              {
                name: '单据添加',
                path: '/sellabout/TI_Z030/add',
                component: './TI_Z030/TI_Z03001',
              },
              {
                name: '单据查询',
                path: '/sellabout/TI_Z030/search',
                component: './TI_Z030/TI_Z03006',
              },
              {
                name: '明细查询',
                path: '/sellabout/TI_Z030/searchLine',
                component: './TI_Z030/TI_Z03007',
              },
              {
                name: '销售报价单详情',
                hideInMenu: true,
                path: '/sellabout/TI_Z030/detail',
                component: './TI_Z030/TI_Z03003',
              },
              {
                name: '销售合同更新',
                hideInMenu: true,
                path: '/sellabout/TI_Z030/update',
                component: './TI_Z030/TI_Z03001',
              },
             
            ]
          },
          {
            name: '交易查询',
            icon: 'iconxunjia',
            path: '/sellabout/transaction',
            component: './transaction',
          },
          {
            name: '订单详情',
            hideInMenu: true,
            path: '/sellabout/orderdetail',
            component: './transaction/orderDetail',
          },
          {
            name: '交货退货详情',
            hideInMenu: true,
            path: '/sellabout/odlnordnDetail',
            component: './transaction/odlnordnDetail',
          },
          {
            name: '发票贷项详情',
            hideInMenu: true,
            path: '/sellabout/oinvorinDetail',
            component: './transaction/oinvorinDetail',
          },
          
        ]
      }, 
      {
        name: '采购业务',
        icon: 'iconcaigou',
        path: '/purchase',
        routes:[
          {
            name: '采购询价单',
            icon: 'iconxunjia',
            path: '/purchase/TI_Z027',
            routes:[
              {
                name: '单据添加',
                path: '/purchase/TI_Z027/edit',
                component: './TI_Z027/TI_Z02701',
              },
              {
                name: '单据查询',
                path: '/purchase/TI_Z027/search',
                component: './TI_Z027/TI_Z02706',
              },
              {
                name: '明细查询',
                path: '/purchase/TI_Z027/searchLine',
                component: './TI_Z027/TI_Z02707',
              },
              {
                name: '采购询价单更新',
                hideInMenu: true,
                path: '/purchase/TI_Z027/update',
                component: './TI_Z027/TI_Z02702',
              },
              {
                name: '采购询价单详情',
                hideInMenu: true,
                path: '/purchase/TI_Z027/detail',
                component: './TI_Z027/TI_Z02703',
              }
             
            ]
          },
          {
            name: '采购询价确认单',
            icon: 'iconqueren',
            path: '/purchase/TI_Z028',
            routes:[
              {
                name: '单据添加',
                path: '/purchase/TI_Z028/TI_Z02801',
                component: './TI_Z028/TI_Z02801',
              },
              {
                name: '单据查询',
                path: '/purchase/TI_Z028/TI_Z02803',
                component: './TI_Z028/TI_Z02803',
              },
              {
                name: '明细查询',
                path: '/purchase/TI_Z028/TI_Z02804',
                component: './TI_Z028/TI_Z02804',
              },
              {
                name: '采购询价确认详情',
                path: '/purchase/TI_Z028/TI_Z02802',
                hideInMenu: true,
                component: './TI_Z028/TI_Z02802',
              }
            ]
          },
        ]
      }, 
      {
        name: '交货及应收',
        icon: 'iconjiaohuo',
        path: '/confrmBatch',
        routes:[
          {
            name: '确认交货',
            path: '/confrmBatch/ODLN',
            component: './ODLN',
          },
          {
            name: '应收发票',
            path: '/confrmBatch/OINV',
            component: './OINV',
          }
        ]  
      },
     
      {
        name: '消息管理',
        icon: 'iconxiaoxi-control',
        path: '/message',
        routes: [
          {
            path: '/message/dd',
            name: '钉钉消息',
            icon: 'icondingding',
            component: './message/dd',
          },
          {
            path: '/message/dd/detail',
            name: '钉钉消息详情',
            hideInMenu: true,
            component: './message/dd/detail',
          },
          {
            path: '/message/wx',
            name: '微信消息',
            icon: 'iconwx',
            component: './message/wx',
          },
          {
            path: '/message/wx/detail',
            name: '微信消息详情',
            hideInMenu: true,
            component: './message/wx/detail',
          },
          {
            path: '/message/pushlog',
            name: '推送日志',
            icon: 'iconpush',
            component: './message/pushlog',
          },
          {
            path: '/message/pushlog/detail',
            name: '推送日志详情',
            icon: 'iconpush',
            hideInMenu: true,
            component: './message/pushlog/detail',
          },
          {
            path: '/message/approve',
            icon:'iconshenpi',
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
            icon:'iconbangding',
            name: '微信绑定',
            component: './message/wxbind',
          },
        ],
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
    ],
  },
]