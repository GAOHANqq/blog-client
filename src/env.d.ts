/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
interface ImportMetaEnv{
  readonly VITE_APP_API_URL: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_SOCKET_URl: string
}
interface ImportMeta{
  readonly env: ImportMetaEnv
}
declare let io:any
declare let IMSDK:any
declare let ssoClient:any
declare module '@kangc/*'
declare module 'codemirror'
declare module 'axios'
declare module 'qs'
declare module 'ali-oss'
declare module 'canvas-nest.js'
