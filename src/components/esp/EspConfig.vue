<script setup>
import {ref, unref} from "vue";
import {NCollapse,NCollapseItem,NDivider,NGrid,NFormItemGi,NImage,NSlider, useMessage} from 'naive-ui'

const formServer = ref()
const formCamera = ref()
const udpServer = ref({
  ip: '192.168.123.166',
  port: 8080,
})
const imageUrl = ref({
  show: false,
  url: ''
})
const wifiOption = ref({
  ssid: 'LEDE',
  password: '',
})
const cameraIp = ref({
  ip: 'http://192.168.123.134:8080',
})
const cameraOption = ref({
  frameSize: Esp.FrameSize.HD_1280X720,
  pixFormat: Esp.PixFormat.JPEG,
  wbModel: Esp.WBMode.AUTO,
  jpegQuality: 2,
  freqMhz: 10,
  sleep: 5,
  brightness: 100,
  autoLight: false,
  light: false,
  hFlip: false,
  vFlip: false,
})
const wifiOptionRule = {
  ssid: {
    required: true,
    message: '请输入ssid',
    trigger: 'blur'
  }
}
const udpServerRule = {
  ip: {
    required: true,
    message: '请输入ip',
    trigger: 'blur'
  },
  port: {
    required: true,
    type: 'number',
    message: '请输入端口',
    trigger: 'blur'
  }
}
const cameraRule = {
  frameSize: {
    required: true,
    type: 'number',
    trigger: 'blur',
    message: '请输入端口',
  },
  port1: {
    required: true,
    type: 'number',
    message: '请输入端口',
    trigger: 'blur'
  },
}

const doAction = (e,form,cls,model,filename,cb,action) => {
  e.preventDefault()
  form.value.validate((errors)=>{
    if (!errors) {
      const option = new cls
      const val = unref(model)
      for(const k in val) {
        const fnName = 'set' + k.substring(0,1).toUpperCase() + k.substring(1)
        console.log(fnName)
        if (option[fnName]) {
          option[fnName](val[k])
        }
      }
      if (cb) cb(option)
      console.log(option,option.toObject())
      // pb.post('http://' + cameraIp.value.ip + '/edit').then(console.log);
      const data = new FormData()
      const blob = new Blob([option.serializeBinary()],{
      })
      data.append('file',blob,filename)
      if (!action || action === 'upload') {
        http.post( cameraIp.value.ip + '/edit',data,{
        }).then(()=> {
          message.success('上传成功')
        })
      } else if (action === 'save') {
        const pickerOptions = {
          suggestedName: filename.substring(1),
          types: [
            {
              description: 'application/x-protobuf',
              accept: {
                '*/*': ['.pb'],
              },
            },
          ],
        };
        //window.showSaveFilePicker(pickerOptions)
        // const writableFileStream = await fileHandle.createWritable();
        // await writableFileStream.write(taBlob);
        // await writableFileStream.close();

      }
    }
  });
}
const message = useMessage();
const handleServerClick = (e,action) => {
  doAction(e,formServer,Esp.UdpServerOption,udpServer,'/config_udp_server.pb',undefined,action)
}
const handleCameraClick = (e,action)=> {
  doAction(e,formCamera,Esp.CameraOption,cameraOption,'/config_camera.pb',(option)=>{
    let flag = 0;
    if (cameraOption.value.hFlip) {
      flag |= 1;
    }
    if (cameraOption.value.vFlip) {
      flag |= 1 << 1;
    }
    if (cameraOption.value.light) {
      flag |= 1 << 2;
    }
    if (cameraOption.value.autoLight) {
      flag |= 1 << 3;
    }
    option.setFlag(flag);

  },action)
}
const getBaseIp = ()=> {
  return cameraIp.value.ip;
}
const getConfig = (file,cls)=> {
  const base = getBaseIp()
  return pb.get(base+file).then(rs=>{
    const obj = cls.deserializeBinary(new Uint8Array(rs.data))
    return obj.toObject();
  })
}
const loadConfig = ()=> {
  getConfig('/config_udp_server.pb',Esp.UdpServerOption)
      .then(rs => {
        udpServer.value = rs
      });
  getConfig('/config_wifi.pb',Esp.UdpServerOption)
      .then(rs => {
        wifiOption.value = rs
      });
  getConfig('/config_camera.pb',Esp.CameraOption)
      .then(rs => {
        cameraOption.value = rs
        const flag = rs.flag
        let i=0;
        cameraOption.value.hFlip = !!(flag & 1 << i++);
        cameraOption.value.vFlip = !!(flag & 1 << i++);
        cameraOption.value.light = !!(flag & 1 << i++);
        cameraOption.value.autoLight = !!(flag & 1 << i++);
      })
}
const handleWifiClick = (e,action) => {
  doAction(e,formServer,Esp.WifiOption,wifiOption,'/config_wifi.pb',undefined,action)
}
const reboot = ()=> {
  http.get(getBaseIp()+'/reboot').then(rs=> {
    message.success('重启成功')
  })
}
const reloadConfig = ()=> {
  const base = getBaseIp()
  http.get(base+'/reload').then(rs=> {
    message.success('重载成功')
  })
}
const preview = ()=> {
  imageUrl.value.show = !imageUrl.value.show;
  if (imageUrl.value.show) {
    imageUrl.value.url = cameraIp.value.ip+'/capture'
  }
}
</script>
<template>
  <n-card title="相机url地址">
    <n-space vertical>
      <n-input placeholder="camera ip地址" v-model:value="cameraIp.ip"></n-input>
      <n-space>
        <n-button @click="loadConfig">加载</n-button>
        <n-button @click="reloadConfig">重载配置</n-button>
        <n-button @click="reboot">重启</n-button>
        <n-button @click="preview">预览图片</n-button>
      </n-space>
      <n-image v-if="imageUrl.show"
               width="400"
          :src="imageUrl.url"
      />
      <n-divider />
      <n-collapse>
        <n-collapse-item title="WIFI配置" name="1">
          <n-form
              ref="formServer"
              label-placement="left"
              label-width="120"
              :model="wifiOption"
              :rules="wifiOptionRule"
          >
            <n-form-item label="WIFI名称" path="ssid">
              <n-input v-model:value="wifiOption.ssid" placeholder="WIFI名称" />
            </n-form-item>
            <n-form-item label="密码">
              <n-input type="password" v-model:value="wifiOption.password" placeholder="密码" />
            </n-form-item>

            <n-form-item>
              <n-space>
                <n-button attr-type="button" @click="handleWifiClick" data-action="upload">上传</n-button>
                <n-button attr-type="button" @click="(e)=>handleWifiClick(e,'save')" data-action="save">保存</n-button>
              </n-space>
            </n-form-item>
          </n-form>
        </n-collapse-item>
        <n-collapse-item title="服务器配置" name="2">
          <n-form
              ref="formServer"
              label-placement="left"
              label-width="120"
              :model="udpServer"
              :rules="udpServerRule"
          >
            <n-form-item label="服务端ip" path="ip">
              <n-input v-model:value="udpServer.ip" placeholder="服务端ip" />
            </n-form-item>
            <n-form-item label="端口" path="port1">
              <n-input-number v-model:value="udpServer.port" placeholder="端口" />
            </n-form-item>
            <n-form-item>
              <n-space>
                <n-button attr-type="button" @click="handleServerClick" data-action="upload">上传</n-button>
                <n-button attr-type="button" @click="(e)=>handleServerClick(e,'save')" data-action="save">保存</n-button>

              </n-space>
            </n-form-item>
          </n-form>
        </n-collapse-item>
      </n-collapse>
    </n-space>
  </n-card>


  <n-card title="相机配置">
    <n-form
        label-placement="left"
        label-width="120"
        ref="formCamera"
        :model="cameraOption"
        :rules="cameraRule"
    >
      <n-form-item label="分辨率" path="frameSize">
        <n-select v-model:value="cameraOption.frameSize" :options="frameSizeOpt" />
      </n-form-item>
      <n-form-item label="白平衡">
        <n-select v-model:value="cameraOption.wbModel" :options="wbModeOpt" />
      </n-form-item>
      <n-form-item label="间隔时间">
        <n-input-number :min="5" v-model:value="cameraOption.sleep" />
      </n-form-item>
      <n-form-item label="时钟">
        <n-input-number :min="1" :max="35" v-model:value="cameraOption.freqMhz" />
      </n-form-item>
      <n-form-item label="闪光灯亮度">
        <n-slider v-model:value="cameraOption.brightness" :min="0" :max="250" :step="1" />
      </n-form-item>
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="8" label="闪光灯">
          <n-switch v-model:value="cameraOption.light" />
        </n-form-item-gi>
        <n-form-item-gi :span="8" label="自动">
          <n-switch v-model:value="cameraOption.autoLight" />
        </n-form-item-gi>
      </n-grid>
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="6" label="水平翻转">
          <n-switch v-model:value="cameraOption.hFlip" />
        </n-form-item-gi>
        <n-form-item-gi :span="6" label="垂直翻转">
          <n-switch v-model:value="cameraOption.vFlip" />
        </n-form-item-gi>
      </n-grid>
      <n-form-item>
        <n-space>
          <n-button attr-type="button" @click="handleCameraClick" data-action="upload">上传</n-button>
          <n-button attr-type="button" @click="(e) => handleCameraClick(e,'save') ">保存</n-button>
        </n-space>
      </n-form-item>
    </n-form>
  </n-card>
</template>

<script>
import {Esp,buildOptions} from '/src/proto/'
import http, {pb} from '@/utils/http'
console.log(Esp)
export default {
  name: "EspConfig",
  data (){
    return {
      frameSizeOpt: buildOptions(Esp.FrameSize),
      wbModeOpt: buildOptions(Esp.WBMode)
    }
  }
}
</script>

<style>

</style>