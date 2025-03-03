import { URL_TYPE } from "@/library/src/utils/globalConfig";
import { FILE_TYPE, ALL_PHASE_TYPE } from "@/library/src/utils/gloableEnum";

/*
 * @name 去除表情,前后空格
 * */
export const trimStr = (str: string = ""): string => {
  if (str === "") {
    return "";
  }
  str = str.replace(
    /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi,
    ""
  );
  str = str.trim();
  return str;
};

/**
 * @name: 文件下载
 * @param url 下载文件完整地址
 */
export const downloadFile = (url: string, isResponce: boolean = true) => {
  let iframe = document.createElement("iframe");
  iframe.style.display = "none";
  if (isResponce) {
    iframe.src = url + "?response-content-type=application/octet-stream";
  } else {
    iframe.src = url;
  }
  iframe.onload = () => {
    document.body.removeChild(iframe);
  };
  document.body.appendChild(iframe);
};

/**
 * 生产随机id用于拼接上传文件路径
 */
export const generateUUID = () => {
  let s: any = [];
  let hexDigits = "0123456789abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23];
  return s.join("");
};

/**
 * 截取文件的后缀
 * @param {string} filename
 * @returns {string}
 */
export const get_suffix = (filename: string) => {
  let pos = filename.lastIndexOf(".");
  let suffix = "";
  if (pos !== -1) {
    suffix = filename.substring(pos);
  }
  return suffix;
};

/**
 * @name: 增加资源域名
 * @param url 文件地址
 * @return: 增加了资源域名的文件地址
 */
export const addFsUrl = (url: string): string => {
  if (url) {
    if (!/http/g.test(url)) {
      if (/doc_tp|tp@/g.test(url)) {
        url = URL_TYPE.obsPath + url;
      } else {
        url = URL_TYPE.aliyunPath + url;
      }
    }
  } else {
    url = "";
  }
  return url;
};

/**
 * @name: 删除资源域名
 * @param url 文件地址
 * @return: 删除了资源域名的文件地址
 */
export const removeFsUrl = (url: string): string => {
  return url.replace(URL_TYPE.aliyunPath, "");
};
/*
 * @name url文件下载
 * @params url地址
 * @params filename 文件名称
 * @params params 其他参数
 * @description blob下载,避免pdf文件浏览器直接打开
 * */
export const downLoadUrlBlobFile = (url: string, filename: string, params?: string): void => {
  let xhr = new XMLHttpRequest();
  params = params || ''
  const _url = url + "?response-content-type=application/octet-stream" + params;
  xhr.open("GET", _url, true);
  xhr.responseType = "blob";
  xhr.onload = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const navigator: any = window.navigator;
      let blob = new Blob([xhr.response]);
      if (!isNullOrUndefined(navigator.msSaveOrOpenBlob)) {
        navigator.msSaveBlob(blob, filename);
      } else {
        let a = document.createElement("a");
        let body: any = document.querySelector("body");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.style.display = "none";
        body.appendChild(a);
        a.click();
        a.onload = () => {
          body.removeChild(a);
          URL.revokeObjectURL(a.href);
        }
      }
    }
  };
  xhr.onprogress = function (e: any) {
    let total = 0
    try {
      total = e.total || e.currentTarget.response.size
    } catch (e) {
      total = 0
    }
    if (total === 0) {
      return
    }
    const progress = ((e.loaded / total) * 100).toFixed(1);
    let body: any = document.querySelector("body");
    let div: any = document.getElementById("download-progress");
    const hasDownload = !isNullOrUndefined(div);
    if (!hasDownload) {
      div = document.createElement("div");
    }

    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    div.style.width = "185px";
    div.style.height = "50px";
    div.style.position = "fixed";
    div.style.bottom = "0";
    div.style.left = "0";
    div.style.zIndex = "9999";
    div.style.color = "#fff";
    div.style.backgroundColor = "rgba(0,0,0,.5)";
    div.style.userSelect = "none";
    div.style.cursor = "pointer";
    div.id = "download-progress";
    div.innerText = `已下载: ${progress}% 丨 取消`;
    div.title = "点击可取消下载";
    div.addEventListener("click", () => {
      xhr.abort();
      body.removeChild(div);
    });
    if (!hasDownload) {
      body.appendChild(div);
    }
    if (parseInt(progress) == 100) {
      body.removeChild(div);
    }
  };
  xhr.send(null);
};

/*
 * @name url文件导出
 * @params url地址
 * */
export const exportUrl = (url: string): void => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const response = xhr.response || xhr.responseText
      try {
        let res: any = JSON.parse(response);
        (window as any).alert(res.msg)
      } catch (e) {
        downloadFile(url, false)
      }
    }
  };
  xhr.send(null);
};

/**
 * @name: 判断是否为空,null或undefined
 * @return: boolean
 */
export const isNullOrUndefined = (ang: any): boolean => {
  return ang == null || typeof ang == "undefined" || ang === "";
};

/**
 * @name: 获取路由参数
 * @param name 必传 string类型为空
 * @param url 非必传 string类型,默认window.lcoaltion.href
 * @return: 成功:具体的值 失败: undefined
 * @description: 同时支持hash,history模式url,区分大小写
 */
export const getQueryString = (
  name: string = "",
  url: string = location.href
) => {
  let _: any = {};
  name += "";
  url += "";
  url.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m: any, key: string, value: any) => {
    _[key] = value;
    return url;
  });
  return _[name];
};
/**
 * 文件大小转换
 * @param {number} bytes
 * @returns {any}
 */
export const bytesToSize = (bytes: number) => {
  if (bytes === 0) {
    return "0 B";
  }
  let unitArr = new Array("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
  let index = 0;
  let srcsize = bytes;
  index = Math.floor(Math.log(srcsize) / Math.log(1024));
  let size = srcsize / Math.pow(1024, index);
  return size.toFixed(2) + unitArr[index];
};

/*
 *获取cookie
 */
export const getCookie = (name: string) => {
  var arr,
    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
  else return null;
};
/**
 * 时长转换
 * @param {number} timeLength
 * @returns {string}
 */
export const durationTrans = (timeLength: number) => {
  let time = timeLength / 1000;
  let b = "";
  let h = parseInt(JSON.stringify(time / 3600)),
    m = parseInt(JSON.stringify((time % 3600) / 60)),
    s = parseInt(JSON.stringify((time % 3600) % 60));
  if (h > 0) {
    let hour = h < 10 ? "0" + h : h;
    b += hour + ":";
  }
  let min = m < 10 ? "0" + m : m;
  let second = s < 10 ? "0" + s : s;
  b += min + ":" + second;
  return b;
};
/**
 * @name: 获取文件类型图标(图片形式:0:其它 1:文档 2:微课 3:音频 4:图片)
 * @param fileType 文件类型
 * @param fileUrl 文件Url
 * @return 文件类型图标
 */
export const getFileIcon = (fileType: number, fileUrl: string) => {
  let icon: string;
  switch (fileType) {
    case FILE_TYPE.AUDIO:
      icon = "img_music.png";
      break;
    case FILE_TYPE.VIDEO:
      icon = "img_video.png";
      break;
    // 文档,图片以图片形式展示
    case FILE_TYPE.IMG:
      icon = "img_img.png";
      break;
    case FILE_TYPE.DOC:
      if (/\.ppt/g.test(fileUrl)) {
        icon = "img_ppt.png";
      } else if (/\.doc/g.test(fileUrl)) {
        icon = "img_word.png";
      } else if (/\.pdf/g.test(fileUrl)) {
        icon = "img_pdf.png";
      } else if (/\.xls/g.test(fileUrl)) {
        icon = "img_excel.png";
      } else if (/\.txt/g.test(fileUrl)) {
        icon = "img_txt.png";
      } else {
        icon = "img_other.png";
      }
      break;
    default:
      icon = "other.png";
      break;
  }
  return icon;
};
/**
 * @name: 获取文件类型图标(icon形式:0:其它 1:文档 2:微课 3:音频 4:图片)
 * @param fileType 文件类型
 * @param fileUrl 文件Url
 * @return 文件类型图标
 */
export const getFileIconByType = (fileType: number, fileUrl: string, isFolder?: any) => {
  let icon: string;
  if (isFolder == 1) {
    icon = "iconweibiaoti-_huabanfuben";
    return icon;
  }
  switch (fileType) {
    case FILE_TYPE.AUDIO:
      icon = "iconyinpin";
      break;
    case FILE_TYPE.VIDEO:
      icon = "iconshipin";
      break;
    case FILE_TYPE.IMG:
      icon = "iconimg";
      break;
    case FILE_TYPE.DOC:
      if (/\.ppt/gi.test(fileUrl)) {
        icon = "iconppt";
      } else if (/\.doc/gi.test(fileUrl)) {
        icon = "iconword";
      } else if (/\.pdf/gi.test(fileUrl)) {
        icon = "iconpdf";
      } else if (/\.xls/gi.test(fileUrl)) {
        icon = "iconqita";
      } else if (/\.txt/gi.test(fileUrl)) {
        icon = "iconqita";
      } else {
        icon = "iconqita";
      }
      break;
    default:
      icon = "iconqita";
      break;
  }
  return icon;
};
/**
 * @name: 获取学段名称
 * @param phase 学段
 */
export const getPhaseName = (phase: string) => {
  phase = phase + ''
  let name = '其他'
  switch (phase) {
    case ALL_PHASE_TYPE.kinder:
      name = "幼儿园";
      break;
    case ALL_PHASE_TYPE.primary:
      name = "小学";
      break;
    case ALL_PHASE_TYPE.junior:
      name = "初中";
      break;
    case ALL_PHASE_TYPE.high:
      name = "高中";
      break;
    case ALL_PHASE_TYPE.secondary:
      name = "中职";
      break;
    case ALL_PHASE_TYPE.vocational:
      name = "高职";
      break;
    case ALL_PHASE_TYPE.university:
      name = "大学";
      break;
    case ALL_PHASE_TYPE.special:
      name = "特殊学校";
    default:
      name = "其他";
      break;
  }
  return name;
};
/**
 * @name: 获取年月日
 * @param date 对应日期
 * @return: 年月日字符串  格式: 2021/12/1
 */
export const getToday = (date: Date = new Date()) => {
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  let month = m < 10 ? "0" + m : m;
  let d = date.getDate();
  let day = d < 10 ? "0" + d : d;
  return "/" + y + "/" + month + "/" + day + "/";
};

/**
 * @name: 获取oss图片指定压缩尺寸地址
 * @param url 源地址
 * @param width 宽度
 * @param height 高度
 * @return: 转换后图片路径
 */
export const getOssResizeImg = (
  url: string = "",
  width: number = 192,
  height: number = 108
): string => {
  if (isNullOrUndefined(url)) return "";
  let symbol: string = "?";
  if (url.match(/\?/)) {
    symbol = ",";
  }
  return `${url}${symbol}x-oss-process=image/resize,t_m_fixed,w_${width},h_${height}`;
};

/**
 * @name: 复制文本
 * @param text 复制的文本内容
 */
export const copyText = (text: string): boolean => {
  const input = document.createElement("input");
  document.body.appendChild(input);
  input.setAttribute("readonly", "readonly");
  input.setAttribute("value", text);
  input.select();
  const isCopy: boolean = document.execCommand("Copy", false, text);
  document.body.removeChild(input);
  return isCopy;
};

/**
 * @name: 数值四舍五入并保留一位小数
 * @param val 值
 */
export const toDecimal = (val: number) => {
  var num = Math.round(val * 10) / 10; //此处x在做乘法是会进行隐士类型转换数值型，如果转换失败最终num=NaN
  if (isNaN(num)) {
    return val;
  }
  var str = num.toString();
  return str;
};
/**
 * 根据当前时间当前用户的学校id和用户id拼接文件夹路径
 * @returns {string}
 */
export const getDateForPath = (schoolId: string, userId: string) => {
  let date = new Date();
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let month = m < 10 ? "0" + m : m;
  let d = date.getDate();
  let day = d < 10 ? "0" + d : d;
  if (schoolId != "") {
    //当用户学校id不为空时
    return (
      "/" + y + "/" + month + "/" + day + "/" + schoolId + "/" + userId + "/"
    );
  } else {
    //当用户学校id为空时
    return "/" + y + "/" + month + "/" + day + "/" + userId + "/";
  }
};
/**
 * @name: 数组去重
 */
export const unique = (arr: Array<any>, key: any) => {
  let obj: any = {};
  arr = arr.reduce((item: Array<any>, next: Array<any>): Array<any> => {
    obj[next[key]] ? "" : (obj[next[key]] = true && item.push(next));
    return item;
  }, []);
  return arr;
};
/**
 * @name: 根据键值分组
 * @param list 数据集合
 * @param fieldName 对应键
 */
export const groupByKey = (list: any[], fieldName: any) => {
  if (list.length === 0) {
    return list;
  }
  let map: any = {},
    dest: any[] = [];
  for (let i = 0; i < list.length; i++) {
    const ai = list[i];
    if (!map[ai[fieldName]]) {
      dest.push({
        data: ai[fieldName],
        list: [ai],
      });
      map[ai[fieldName]] = ai;
    } else {
      for (let j = 0; j < dest.length; j++) {
        const dj = dest[j];
        if (dj.data == ai[fieldName]) {
          dj.list.push(ai);
          break;
        }
      }
    }
  }
  return dest;
};
/**
 * @name: 判断是否手机端
 * @return: Boolean
 */
export const isMobile = (): boolean => {
  let u: string = navigator.userAgent;
  u = u.toLowerCase();
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
   * @name 获取资源类型
   */
export const getResTypeByExt = (ext: any) => {
  switch (ext.toLowerCase()) {
    case 'mp4':
    case 'mpg':
    case 'mpeg':
    case 'm4v':
    case 'flv':
    case '3gp':
    case 'mov':
    case 'avi':
    case 'rmvb':
    case 'mkv':
    case 'wmv':
    case 'asf':
    case 'webm':
    case 'ogg':
      return FILE_TYPE.VIDEO;
    case 'jpg':
    case 'png':
    case 'jpeg':
    case 'jif':
    case 'jfif':
    case 'psd':
    case 'bmp':
    case 'gif':
    case 'ico':
      return FILE_TYPE.IMG;
    case 'doc':
    case 'docx':
    case 'pdf':
    case 'ppt':
    case 'pptx':
    case 'xls':
    case 'xlsx':
      return FILE_TYPE.DOC;
    case 'mp3':
    case 'wma':
    case 'rm':
    case 'wav':
    case 'midi':
    case 'ape':
    case 'flac':
      return FILE_TYPE.AUDIO;
    case 'zip':
    case 'rar':
    case '7z':
    case '压缩包':
      return FILE_TYPE.OTHER;
    default:
      return FILE_TYPE.OTHER;
  }
}
/**获取后缀名 */
export const get_type = (fileName: any) => {
  let arr = fileName.split('.');
  return arr[arr.length - 1];
};

/**根据文件名称判断文件类型 */
export const get_file_type = (fileName: any) => {
  let docType = get_type(fileName);
  switch (docType) {
    case 'mp4':
    case 'mpg':
    case 'mpeg':
    case 'm4v':
    case 'flv':
    case '3gp':
    case 'mov':
    case 'avi':
    case 'rmvb':
    case 'mkv':
    case 'wmv':
    case 'asf':
    case 'webm':
    case 'ogg':
      return 'video';
    case 'pdf':
      return 'pdf'
    case 'jpg':
    case 'png':
    case 'jpeg':
    case 'jif':
    case 'ico':
    case 'psd':
    case 'bmp':
    case 'gif':
    case 'dib':
    case 'pcp':
    case 'dif':
    case 'wmf':
    case 'tif':
    case 'eps':
    case 'cdr':
    case 'iff':
    case 'tga':
    case 'pcd':
    case 'mpt':
      return 'image'
    case 'doc':
    case 'docx':
      return 'word'
    case 'ppt':
    case 'pptx':
      return 'ppt'
    case 'mp3':
    case 'wma':
    case 'rm':
    case 'wav':
    case 'midi':
    case 'ape':
    case 'flac':
      return 'music'
    default:
      return 'other'
  }
};
