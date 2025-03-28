import axios from 'axios';

import {useBoundStore} from '../store';
import {shallow} from 'zustand/shallow';
import storage from './storage';

const request = axios.create({
  baseURL: 'http://10.0.2.2:28080',
  timeout: 20000,
  headers: {
    // 'Content-Type':'application/json'
  },
});
// 添加请求拦截器
request.interceptors.request.use(
  async config => {
    console.log(config);

    config.headers['Content-Type'] = 'application/json;';
    // 在发送请求之前做些什么
    let lang;
    storage
      .load({
        key: 'lang',
        autoSync: true,
        syncInBackground: true,
      })
      .then(res => {
        lang = res.lang;
      })
      .catch(err => {
        lang = 'zh_CN';
        storage.save('lang',{data:{lang:'zh_CN'}})
      })
      .finally(() => {
        console.log('开始发送数据', lang.lang);
        config.params = {
          ...config.params,
          lang: lang ? lang : 'zh_CN',
        };
        return config;
      });
        return config;

    // console.log('lang=', lang);

    // config.params={
    //   lang:lang
    // }
    // console.log("config-header",config.headers['accept-language']);
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

// 添加响应拦截器
request.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    console.log('response.config', response.config);

    // 对响应数据做点什么
    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  },
);

export default request;
