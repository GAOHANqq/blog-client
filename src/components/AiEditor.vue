<template>
  <div id="aiEditor" style="padding: 0;margin: 0">
    <div class="aie-container" style="background-color: #f3f4f6">
      <div class="aie-header-panel">
        <div class="aie-container-header" style="background: #fff;"></div>
      </div>
      <div class="aie-main">
        <div class="aie-directory-content">
          <div class="aie-directory">
            <h5>文档目录</h5>
            <div id="outline">
            </div>
          </div>
        </div>
        <div class="aie-container-panel">
          <div class="aie-container-main"></div>
        </div>
      </div>
      <div class="aie-container-footer"></div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted, onBeforeUnmount, watch} from 'vue'
import {AiEditor} from "aieditor";
import {getFilePath} from "@/utils/util";
import ossUpload from "@/utils/ossUpload";

export default defineComponent({
  name: 'ai-editor',

  emits: ['on-change'],

  props: {
    // 是否只读
    readonly: {
      type: Boolean,
      default: false
    },
    // 内容
    content: {
      type: String,
      default: ''
    }
  },

  setup(props, ctx) {
    const aiRef = ref(null)
    const aiEditor = ref<any>(null)

    const change = () => {
      const html = aiEditor.value.getMarkdown()
      ctx.emit('on-change', html)
    }

    const updateOutLine = (editor: AiEditor) => {
      const outlineContainer = document.querySelector("#outline");
      while (outlineContainer?.firstChild) {
        outlineContainer.removeChild(outlineContainer.firstChild)
      }

      const outlines = editor.getOutline();
      for (let outline of outlines) {
        const child = document.createElement("div")
        child.classList.add(`aie-title${outline.level}`)
        child.style.marginLeft = `${14 * (outline.level - 1)}px`
        child.innerHTML = `<a href="#${outline.id}">${outline.text}</a>`
        child.addEventListener("click", (e) => {
          e.preventDefault();
          const el = editor.innerEditor.view.dom.querySelector(`#${outline.id}`) as HTMLElement;
          el.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
          setTimeout(() => {
            editor.focusPos(outline.pos + outline.size - 1)
          }, 1000)
        })
        outlineContainer?.appendChild(child)
      }
    }

    const uploader = (file: File) => {
      const filePath = getFilePath(file);
      return ossUpload.uploadFile(file, filePath).then((res: any) => {
        return res[0]
      })
    }

    const init = () => {
      destory()
      let timer:any;
      aiEditor.value = new AiEditor({
        element: '#aiEditor',
        placeholder: "点击输入内容...",
        editable: !props.readonly,
        content: props.content,
        onCreated: (editor) => {
          updateOutLine(editor)
        },
        onChange: (editor) => {
          updateOutLine(editor)
          if (timer) {
            clearTimeout(timer);
          }
          timer = setTimeout(() => {
            change();
          }, 300);
        },
        image: {
          uploader,
          uploaderEvent: {
            onSuccess: (file, response) => {
              return {
                errorCode: 0,
                data: {
                  src: response,
                  alt: ""
                }
              }
            }
          }
        },
        video: {
          uploader,
          uploaderEvent: {
            onSuccess: (file, response) => {
              return {
                errorCode: 0,
                data: {
                  src: response,
                  poster: ""
                }
              }
            }
          }
        },
        attachment: {
          uploader,
          uploaderEvent: {
            onSuccess: (file, response) => {
              return {
                errorCode: 0,
                data: {
                  href: response,
                  fileName: ""
                }
              }
            }
          }
        },
        ai: {
          models: {
            spark: {
              appId: "9e868ce4",
              apiKey: "a15d512f688abe35982932ce2f294121",
              apiSecret: "N2Y5OTgwMDM4ODJkNWUxZjgwZWE1MzFj",
              version: "v3.1"
            }
          }
        }
      })
    }

    const destory = () => {
      aiEditor.value && aiEditor.value.destroy()
      aiEditor.value = null
    }

    watch(()=>props.content, ()=>{
     if(aiEditor.value){
       try {
         aiEditor.value.setContent(props.content)
       }catch (e) {

       }
     }else{
       init()
     }
    })

    onMounted(() => {
      init()
    })
    onBeforeUnmount(() => {
      destory()
    })

    return {
      aiRef
    }
  }
})
</script>
