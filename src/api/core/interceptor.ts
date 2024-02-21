import axios from "axios";

/**
 * 请求拦截器
 */
axios.interceptors.request.use(
  function (config) {
    console.log("🚀 ~ file:interceptor method: line:6 -----config:", config);
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    console.log(
      "🚀 ~ file:interceptor method: line:18 -----response:",
      response
    );
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
