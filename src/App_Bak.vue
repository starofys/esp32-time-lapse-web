<script lang="ts" setup>
import {NConfigProvider, NInput, NDatePicker, NSpace, NSwitch,
    NLayout,NLayoutHeader,NMenu,NLayoutSider,NLayoutFooter,NDrawer,NIcon
} from 'naive-ui'

import {
  SettingOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  PoweroffOutlined,
  GithubOutlined,
  LockOutlined,
  ReloadOutlined,
  LogoutOutlined,
  UserOutlined,
  CheckOutlined,
} from '@vicons/antd';

// theme
import { createTheme, inputDark, datePickerDark ,darkTheme } from 'naive-ui'
// locale & dateLocale
import { zhCN, dateZhCN } from 'naive-ui'
import {ref, onMounted, onBeforeUnmount} from 'vue'
const collapsed = ref<boolean>(false);
const isMobile = ref<boolean>(false);
const showSideDrawer = ref<boolean>(true);
const mobileWidth = 950;
//判断是否触发移动端模式
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

onMounted(() => {
  checkMobileMode();
  window.addEventListener('resize', watchWidth);
});
onBeforeUnmount(()=>{
  window.removeEventListener('resize',watchWidth);
});
const menuWidth = 240;
</script>

<template>

  <n-config-provider
      class="flex"
      :locale="zhCN" :date-locale="dateZhCN"
      style="height: 100vh"
  >
    <n-layout has-sider>
      <n-layout-sider
          v-if="!isMobile"
          bordered
          collapse-mode="width"
          :collapsed-width="0"
          :width="menuWidth"
          :native-scrollbar="false"
      >
        <n-menu
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
        />
      </n-layout-sider>
      <n-drawer
          v-if="isMobile"
          v-model:show="showSideDrawer"
          placement="left"
          class="layout-side-drawer"
      >
        <n-layout-sider
            :collapsed="false"
            :width="menuWidth"
            :native-scrollbar="false"
        >
          <n-menu
              :collapsed-width="64"
              :collapsed-icon-size="22"
              :options="menuOptions"
          />
        </n-layout-sider>
      </n-drawer>
      <n-layout>
        <n-layout-header>
          <div @click="showSideDrawer = !showSideDrawer">
            <n-icon size="24" v-if="showSideDrawer">
              <MenuUnfoldOutlined />
            </n-icon>
            <n-icon size="24" v-else>
              <MenuFoldOutlined />
            </n-icon>
          </div>
        </n-layout-header>
        <n-layout-content content-style="padding: 24px;">
          平山道
          <router-view></router-view>
        </n-layout-content>
        <n-layout-footer position="absolute">
          <p style="text-align: center">ESP CONFIG</p>
        </n-layout-footer>
      </n-layout>
    </n-layout>
  </n-config-provider>
</template>

<script lang="ts">

const menuOptions = [
  {
    label: '且听风吟',
    key: 'hear-the-wind-sing',
  },
  {
    label: '1973年的弹珠玩具',
    key: 'pinball-1973',
    disabled: true,
    children: [
      {
        label: '鼠',
        key: 'rat'
      }
    ]
  },
  {
    label: '寻羊冒险记',
    key: 'a-wild-sheep-chase',
    disabled: true,
  },
  {
    label: '舞，舞，舞',
    key: 'dance-dance-dance',
    children: [
      {
        type: 'group',
        label: '人物',
        key: 'people',
        children: [
          {
            label: '叙事者',
            key: 'narrator',
          },
          {
            label: '羊男',
            key: 'sheep-man',
          }
        ]
      },
      {
        label: '饮品',
        key: 'beverage',
        children: [
          {
            label: '威士忌',
            key: 'whisky'
          }
        ]
      },
      {
        label: '食物',
        key: 'food',
        children: [
          {
            label: '三明治',
            key: 'sandwich'
          }
        ]
      },
      {
        label: '过去增多，未来减少',
        key: 'the-past-increases-the-future-recedes'
      }
    ]
  }
]

export default {
  name: "App",
  data() {
    return {
      menuOptions
    }
  }
}
</script>

<style>
.flex {
  display: flex;
}
</style>