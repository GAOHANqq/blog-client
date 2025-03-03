import moment from 'moment'


export const getFilePath = (file: File) => {
    const date = formatDate()
    const suffix = getSuffix(file.name)
    return `blogimg/${date}/${getUuid()}/f${suffix}`
}

export const formatDate = () => {
    const date = new Date()
    const yy = date.getFullYear()
    let mm: any = date.getMonth() + 1
    let dd: any = date.getDate()
    mm = mm > 10 ? mm : `0` + mm
    dd = dd > 10 ? dd : `0` + dd
    return `${yy}/${mm}/${dd}`
}

export const getUuid = () => {
    return Math.random().toString(36).slice(2)
}

export const getSuffix = (filename: string) => {
    let pos = filename.lastIndexOf('.');
    let suffix = '';
    if (pos !== -1) {
        suffix = filename.substring(pos);
    }
    return suffix;
}

export const fromatTime = (time: number) => {
    return moment(new Date(parseInt(time + '000'))).format('YYYY-MM-DD HH:mm')
}
/**
 * @name: 增加资源域名
 * @param url 文件地址
 * @return: 增加了资源域名的文件地址
 */
export const addFsUrl = (url: string): string => {
    if (!url) {
        return url
    }
    if (!/http/g.test(url)) {
        if (isTest()) {
            url = `http://fs.xjjswh.cn/${url}`
        } else {
            url = `${import.meta.env.VITE_APP_API_URL}/${url}`
        }
    }
    return url
}

/**
 * @name: 删除资源域名
 * @param url 文件地址
 * @return: 删除了资源域名的文件地址
 */
export const removeFsUrl = (url: string): string => {
    url = url.replace(/http(s)?:\/\/fs.xjjswh.cn\//, '')
    return url
}

/**
 * @name: 判断是否手机端
 * @return: Boolean
 */
export const isMobile = (): boolean => {
    let u = navigator.userAgent.toLowerCase();
    const isIpad = /ipad/gi.test(u);
    const isIphoneOs = /iphone os/gi.test(u);
    const isMidp = /midp/gi.test(u);
    const isUc7 = /rv:1.2.3.4/gi.test(u);
    const isUc = /ucweb/gi.test(u);
    const isAndroid = /android/gi.test(u);
    const isCE = /windows ce/gi.test(u);
    const isWM = /windows mobile/gi.test(u);
    if (isIpad || isIphoneOs || isMidp || isUc7 || isUc || isAndroid || isCE || isWM) {
        return true;
    } else {
        return false;
    }
};
/**
 * @name: 是否测试环境
 */
export const isTest = (): boolean => {
    return process.env.NODE_ENV === 'dev'
}

export const getQueryString = (name: string, url: string = window.location.href) => {
    const reg = new RegExp("([&?])" + name + "=([^&]*)(&|$)", "i");
    const r = url.match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
}

export const debounce = function (fn: Function, delay: number) {
    let timer;
    return () => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn();
        }, delay);
    };
}
