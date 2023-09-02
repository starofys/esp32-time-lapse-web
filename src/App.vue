<script lang="ts" setup>
import {dateZhCN, NConfigProvider, zhCN, NTabs, NTabPane, NMenu, NSpace,
  MenuOption,NNotificationProvider} from 'naive-ui'
import {onBeforeUnmount, onMounted, ref, unref} from "vue";
import {useRoute, useRouter} from "vue-router";
import Notify from './components/Notify.vue'
const isMobile = ref<boolean>(false);
const collapsed = ref<boolean>(false);
const currentPath = ref<string>('');
const mobileWidth = 950;



const r = useRoute()
const router = useRouter()
const checkMobileMode = () => {
  if (document.body.clientWidth <= mobileWidth) {
    isMobile.value = true;
  } else {
    isMobile.value = false;
  }
  collapsed.value = false;
};
const watchWidth = () => {
  const Width = document.body.clientWidth;
  if (Width <= mobileWidth) {
    collapsed.value = true;
  } else collapsed.value = false;
  checkMobileMode();
};
watchWidth();
onMounted(() => {
  window.addEventListener('resize', watchWidth);
});
onBeforeUnmount(()=>{
  window.removeEventListener('resize',watchWidth);
});
const onMenuClick = (key: string,item: MenuOption) => {
  router.replace(key)
}
</script>
<template>
  <n-config-provider
      class="flex"
      :class="{column: isMobile}"
      :locale="zhCN" :date-locale="dateZhCN"
  >
    <n-space>
      <NMenu :class="{'menu-horizontal':!isMobile}" :options="menus" :mode="isMobile?'horizontal':'vertical'"
             :value="r.path" :on-update-value="onMenuClick"/>
    </n-space>
    <n-notification-provider>
      <router-view></router-view>
      <Notify/>
    </n-notification-provider>
  </n-config-provider>
</template>

<script lang="ts">
import router from "./router";

const menus = router.getRoutes().filter(r => {
  return r.meta?.title
}).map(r =>{
  console.log(r)
  return {
    label: r.meta.title,
    key: r.path
  }
})
export default {
  name: "App",
  data() {
    return {
      menus
    }
  }
}
</script>

<style>
.flex {
  display: flex;
}
.column {
 flex-direction: column;
}
.menu-horizontal {
  width: 120px
}
</style>