/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import router from 'umi/router';
import { extend } from 'umi-request';
import { parse } from 'qs';
import { notification } from 'antd';
import { requestUrl } from './utils';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = error => {
  const { response = {} } = error;
  const errortext = codeMessage[response.status] || response.statusText;
  const { status, url } = response;
  notification.error({
    message: `请求错误 ${status}: ${url}`,
    description: errortext,
  });
  if (status === 403) {
    router.push('/exception/403');
    return;
  }
  if (status <= 504 && status >= 500) {
    router.push('/exception/500');
    return;
  }
  if (status >= 404 && status < 422) {
    router.push('/exception/404');
  }
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'same-origin', // 默认请求是否带上cookie
});

request.interceptors.request.use((url, options) => {
  const currentUser = localStorage.getItem('currentUser')
    ? parse(localStorage.getItem('currentUser'))
    : {};
  if (currentUser.UserCode && currentUser.Token && options.data)
    Object.assign(options.data, { UserCode: currentUser.UserCode, Tonken: currentUser.Token });
  return {
    url: requestUrl(url),
    options: { ...options, interceptors: true },
  };
});
/**
 * 5. 对于状态码实际是 200 的错误
 */
request.interceptors.response.use(async response => {
  // const {url} =response
  const data = await response.clone().json();
  if (data.Status !== 200) {
    notification.error({
      message: `请求错误 ${data.Status}`,
      description: data.Message,
    });
  }
  return response;
});

export default request;
