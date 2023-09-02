<script setup>
import Player from 'dplayer';
import {onBeforeUnmount, onMounted, shallowRef, nextTick, onUnmounted} from 'vue'
import {onBeforeRouteUpdate, useRoute} from "vue-router";
const mse = shallowRef()
const player = shallowRef()
const route = useRoute()
const destroy = ()=> {
  if (player.value) {
    console.log('销毁播放器')
    player.value.destroy();
    player.value = null
  }
}
const doPlay = (url) => {
  destroy()
  if (!url) {
    return
  }
  console.log('创建播放器',url)
  player.value = new Player({
    container: mse.value,
    live: false,
    autoplay: true,
    airplay: true,
    video: {
      url: url,
      type: 'auto'
    },
    subtitle: {
      url: url.replace(url.substring(url.lastIndexOf('.')),".vtt"),
      type: 'webvtt'
    },
    pluginOptions: {
      flv: {
        mediaDataSource: {
          duration: 60*1000*5
        },
        config: {
        },
      },
    },
  })
}
onMounted(()=>{
  if (!route.query.url) {
    return
  }
  doPlay(route.query.url)
})
onBeforeUnmount(()=> {
  destroy()
})
onBeforeRouteUpdate((to)=> {
  if (to.query.url) {
    nextTick(()=>{
      doPlay(to.query.url)
    })
  }
})
</script>
<template>
  <div ref="mse"></div>
</template>

<script>
import Flv from 'flv.js'
window.flvjs = Flv
export default {
  name: "VPlayer2"
}
</script>
