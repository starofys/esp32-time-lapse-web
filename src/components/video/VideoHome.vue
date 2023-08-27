<script setup>
import {NEmpty,NButton,NDataTable} from 'naive-ui'
import {h, ref} from 'vue'
import {useRoute, useRouter} from "vue-router";
import VPlayer from './VPlayer.vue'
const router = useRouter()
const route = useRoute()
const videoList = ref([])
const loading = ref(true)
const play = () => '播放'
const columns = [
  {
    title: '日期',
    key: 'name'
  },
  {
    title: '动作',
    key: 'actions',
    render (row) {
      return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            onClick() {
              router.push({
                path: '/player',
                query: {
                  url: '/video/' + row.url
                }
              });
            }
          },
          { default: play }
      )
    }
  }
]
const loadVideoList = () => {
  console.log('loadVideoList')
  http.get('/video/').then(rs => {
    const reg = /"\d{8}_\d{2}_\d{2}_\d{2}\..{3}/g
    videoList.value = rs.data.match(reg)
        .map(s => {
          const date = s.substring(1, 5)
              + '-' + s.substring(5, 7)
              + '-' + s.substring(7, 9)
              + ' ' + s.substring(10, 12)
              + ':' + s.substring(13, 15)
              + ':' + s.substring(16, 18)
          return {
            name: date + s.substring(18),
            url:s.substring(1),
            type: s.substring(19),
            timestamp: new Date(date).getTime()
          };
        }).sort((a, b) => b.timestamp - a.timestamp);
  }).finally(() => {
    loading.value = false
  })
}

loadVideoList()

</script>
<template>
  <NDataTable
      v-show="!route.query.url"
      :columns="columns"
      :data="videoList"
      :loading="loading"
      :bordered="true"
  />
  <VPlayer v-if="route.query.url"></VPlayer>
</template>

<script>
import http from "axios";
export default {
  name: "VideoHome.",
}
</script>

<style>
</style>