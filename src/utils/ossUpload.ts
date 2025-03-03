import OSS from 'ali-oss'
import {getSTSTokenAPI} from '@/service/API/third'

class OSSUpload {
    constructor() {
        this.initConfig()
    }
    private async initConfig(): void {
        //使用STS临时授权数据初始化OSS对象
        // @ts-ignore
        return getSTSTokenAPI().then((res:any)=>{
            if(res.code === 1){
                this.client = new OSS({
                    accessKeyId: res.data.AccessKeyId,
                    accessKeySecret: res.data.AccessKeySecret,
                    region: res.data.region,
                    bucket: res.data.bucket,
                    stsToken: res.data.SecurityToken
                });
            }
        })
    };
    /**
     * @name: 取消上传
     */
    async cancelUpload() {
        // @ts-ignore
        this.client.cancel()
        // @ts-ignore
        this.client = null
    };
    /**
     * @name: 上传文件
     * @param file 文件对象
     * @param filePath 文件地址
     * @param cb 进度回调函数
     */
    async uploadFile(file: File, filePath: string, cb?: Function): Promise<any> {
        // @ts-ignore
        if (!this.client) {
           await this.initConfig();
        }
        return new Promise((resolve, reject) => {
            console.log("[oss] : 开始上传,文件地址:" + filePath);
            //调用OSS的上传方法，将file上传到res.filepath
            // @ts-ignore
            this.client.multipartUpload(filePath, file, {
                progress: async function (progress: any) {
                    //上传进度回调;
                    console.log('上传文件:' + progress)
                    cb && cb(progress, file)
                }
            }).then((result: any) => {
                //上传完成;
                const {res} = result
                let data: any = [];
                res.requestUrls.forEach((element: any) => {
                    let url = element
                    let index = url.indexOf('?');
                    if (index != -1) {
                        url = url.substring(0, url.lastIndexOf('?'))
                    }
                    url = url.replace(/http(s)?:\/\//, 'http://')
                    url = url.replace("yuezhou.oss-cn-beijing.aliyuncs.com/", 'fs.xjjswh.cn/')
                    data.push(url)
                });
                resolve(data)
                console.log("[oss] :上传成功,res:" + data);
            }).catch((err: any) => {
                //上传失败
                console.error("[oss] :上传失败,res:" + err);
                reject(err)
            });
        })
    };
    /**
     * @name: 上传文件
     * @param base64 文件base64
     * @param filePath 文件地址
     * @param fileName 文件名称
     */
    uploadBase64File(base64: string, filePath: string, fileName: string, cb: Function): Promise<any> {
        if (filePath.indexOf('?') >= 0) {
            filePath = filePath.substring(0, filePath.indexOf('?'));
        }
        var file = this.blobToFile(this.dataURLtoBlob(base64), fileName);
        return this.uploadFile(file, filePath, cb);
    };
    /**
     * @name: base64转blob
     * @param dataurl base64数据
     */
    dataURLtoBlob(dataurl: string): Blob {
        var arr: any = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };
    /**
     * @name: blob转file
     * @param theBlob blob数据
     * @param fileName 文件名称
     */
    blobToFile(theBlob: Blob, fileName: string): File {
        return new File([theBlob], fileName);
    };
    /*
    * @name 多文件上传
    * @params list Array<File>
    * @description file.path需要在外部手动拼接
    * */
    uploadListFile(list: Array<any>, cb?: Function): Promise<any> {
        if( list.length == 0 ){
            cb&&cb(1)
            return Promise.resolve([])
        }
        let self:any = this;
        let promise:Promise<any> = Promise.all(
            list.map((file:any) => {
                return self.uploadFile(file.file, file.path)
            })
        )
        return promise.then((res:any)=>{
            let result:string[] = []
            res.forEach((item:string[])=>{
                result = [...result,...item]
            })
            return result
        })
    }
    uploadBase64ListFile (list: Array<any>, cb?: Function): Promise<any> {
        if( list.length == 0 ){
            cb&&cb(1)
            return Promise.resolve([])
        }
        let self:any = this;
        let promise:Promise<any> = Promise.all(
            list.map((file:any) => {
                return self.uploadBase64File(file.base64, file.path, file.name)
            })
        )
        return promise.then((res:any)=>{
            let result:string[] = []
            res.forEach((item:string[])=>{
                result = [...result,...item]
            })
            return result
        })
    }
}
export default new OSSUpload()
