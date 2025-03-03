<template>
  <el-card
      style="border: none;background: rgba(0,0,0,.15);color: #fff"
      :body-style="{
        height: '300px',
    }"
  >
    <template #header>
      <div class="flex-center">
        <span>音乐空间</span>
        <el-dropdown @command="switchSort">
          <span style="color: #fff;margin-left: 20px">
            {{ sort }}
            <el-icon >
              <ArrowDown/>
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in sortList" :key="item" :command="item">{{ item }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>

    <el-row type="flex" align="middle">
      <el-col>
        <h2>
          {{ musicInfo.name }} - {{ musicInfo.artistsname }}
        </h2>

        <div id="mse"></div>
        <canvas ref="audioRef" style="width: 100%;height: 150px;border-radius: 6px"></canvas>
        <div id="gc"></div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted, ref, onBeforeUnmount} from 'vue'
import {getMusicLyricAPI, musicAPI} from "@/service/API/third";
import {ElMessage} from "element-plus";
import {Location,ArrowDown} from '@element-plus/icons-vue'
import Player, {Events} from 'xgplayer'
import 'xgplayer/dist/index.min.css'
import MusicPreset, {Analyze,Lyric} from 'xgplayer-music'
import 'xgplayer-music/dist/index.min.css'
import {getQueryString} from '@/utils/util'

export default defineComponent({
  name: 'main-music',

  components: {Location,ArrowDown},

  setup() {
    const audioRef = ref<any>(null)
    const state = reactive({
      musicInfo: {} as any,
      sortList: ['热歌榜', '新歌榜', '飙升榜', '原创'],
      sort: '热歌榜',
      musicList: [],
      player: null,
      analyze: null
    })

    const switchSort = (sort:string)=>{
      state.sort = sort
      init()
    }
    const getMusic = () => {
      musicAPI({
        format: 'json',
        sort: state.sort
      }).then((res: any) => {
        state.musicInfo = res.data
        start()
      }).catch((err: any) => {
        ElMessage.warning(err.msg)
      })
    }
    const getMusicLyric = ()=>{
      const id = getQueryString('id', state.musicInfo.url)
      getMusicLyricAPI({id}).then((res:any)=>{
          if(res.code === 1){
            setMusicLyric(res.data)
          }
      })
    }
    const setMusicLyric = (lyricTxts:string)=>{
      clearMusicLyric()
      if( !state.player ){
        return
      }
      try {
        const lyric = new Lyric([lyricTxts], document.getElementById('gc'));
        lyric.bind(state.player)
        lyric.show();
        state.player.on(Events.DESTROY, () => {
          lyric.unbind(state.player)
        })
      }catch (e){

      }

    }
    const clearMusicLyric = ()=>{
      document.getElementById('gc')!.innerHTML = ''
    }
    const destory = ()=>{
      if( state.analyze ){
        state.analyze.destroy()
        state.analyze = null
      }
      if( state.player ){
        state.player.pause()
        state.player.destroy()
        state.player = null
      }
    }
    const start = () => {
      destory()
      // 代理替换,避免跨域
      let url = state.musicInfo.url.replace(/http(s)?:/, '')
      url = url.replace('music.163.com',`${location.host}/musicapi`)
      state.player = new Player({
        id: 'mse',
        url,
        volume: 0.8,
        width: '100%',
        height: 80,
        mediaType: 'audio',
        presets: ['default', MusicPreset],
        ignores: ['playbackrate'],
        controls: {
          initShow: true,
          mode: 'flex'
        },
        marginControls: true,
        videoConfig: {
          crossOrigin: "anonymous"
        },
        poster: state.musicInfo.picurl,
        music: {
          list: state.musicList
        }
      });
      state.player.crossOrigin = "anonymous";
      state.player.on(Events.PLAYNEXT, () => {
        init()
      })
      state.player.on(Events.READY, () => {
        state.player.play()
      })
      state.analyze = new Analyze(state.player, audioRef.value, {
        stroke: 1,
        mode: 'waves',
        bgColor: 'rgba(0,0,0,.3)'
      })
      getMusicLyric()
    }
    const init = ()=>{
      destory()
      getMusic()
    }

    onMounted(() => {
      init()
    })
    onBeforeUnmount(()=>{
      destory()
    })

    return {
      ...toRefs(state),
      audioRef,
      switchSort
    }
  }
})
</script>

<style lang="scss" scoped>
p {
  margin-bottom: 0;
  color: #333;
}

h2 {
  margin: 0;
}

h3 {
  color: #2574ff;
}

#mse {
  margin: 0 0 10px;
  background: transparent;
}
#mse .xgplayer-controls{
  background: transparent;
}
</style>
<style lang="scss">
#mse .xgplayer-controls{
  background: transparent;
}
#gc{
  position: relative;
  top: 6px;
  .xgplayer-lyric-item{
    opacity: 0;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    font-size: 23px;
    font-weight: 700;
    &.xgplayer-lyric-item-active{
      opacity: 1 !important;
      color: rgb(49, 194, 124) !important;
    }
  }
}
</style>
