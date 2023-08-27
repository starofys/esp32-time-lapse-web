import axios, {AxiosError, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import type { NotificationApiInjection} from "naive-ui/es/notification/src/NotificationProvider";
const PROTOBUF_TYPE = 'application/x-protobuf'
const ACCEPT = PROTOBUF_TYPE + ',*/*'
let notification :NotificationApiInjection|undefined = undefined
const onError = (error: any) =>{
    if (error.isAxiosError && notification) {
        const err = error as AxiosError
        notification.error({
            title: err.config?.url || '错误',
            content: err.message,
            duration: 2500,
            keepAliveOnHover: true
        })
    }
    return Promise.reject(error);
}
const useReq = function (config: InternalAxiosRequestConfig) {
    // 在发送请求之前做些什么
    // console.log(config)
    return config;
}
const useRsp = function (rsp: AxiosResponse) {
    // 在发送请求之前做些什么
    // console.log(rsp)
    return rsp;
}
const pb = axios.create({
    baseURL: './', // api base_url
    responseType: 'arraybuffer',
    headers: {
        'Content-Type': PROTOBUF_TYPE,
        'Accept': ACCEPT
    },
})
const http = axios.create({
    baseURL: './', // api base_url
    responseType: 'json'
})
pb.interceptors.request.use(useReq, onError);
pb.interceptors.response.use(useRsp, onError);
http.interceptors.request.use(useReq, onError);
http.interceptors.response.use(useRsp, onError);

const setNotification = (n :NotificationApiInjection) => {
    notification = n
}
export default http
export {
    pb,
    setNotification
}