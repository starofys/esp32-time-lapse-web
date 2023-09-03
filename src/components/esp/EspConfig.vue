<script setup>
import {ref, unref} from "vue";
import {NForm,NFormItem,NInput,NInputNumber,NButton, useMessage} from 'naive-ui'

const formServer = ref()
const formCamera = ref()
const udpServer = ref({
  ip: '192.168.123.166',
  port: 8080,
})
const cameraIp = ref({
  ip: '192.168.123.12:8080',
})
const cameraOption = ref({
  frameSize: Esp.FrameSize.HD_1280X720,
  pixFormat: Esp.PixFormat.JPEG,
  wbModel: Esp.WBMode.AUTO,
  jpegQuality: 2,
  freqMhz: 10,
  sleep: 5,
  autoLight: false,
  light: false,
  hFlip: false,
  vFlip: false,
})

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
      data.append('file',new Blob([option.serializeBinary()],{
      }),filename)
      if (action === 'upload') {
        http.post( 'http://' + cameraIp.value.ip + '/edit',data,{
        }).then(()=> {
          message.success('上传成功')
        })
      }
    }
  });
}
const message = useMessage();
const handleServerClick = (e) => {
  doAction(e,formServer,Esp.UdpServerOption,udpServer,'/config_udp_server.pb',undefined,'upload')
}
const handleCameraClick = (e)=> {
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

  },'upload')
}
const getBaseIp = ()=> {
  return 'http://' + cameraIp.value.ip;
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
const reloadConfig = ()=> {
  const base = getBaseIp()
  http.get(base+'/reload').then(rs=> {
    message.success('重载成功')
  })
}
</script>
<template>

  <n-card title="相机ip地址">
    <n-space vertical>
      <n-input placeholder="camera ip地址" v-model:value="cameraIp.ip"></n-input>
      <n-button @click="loadConfig">加载</n-button>
      <n-button @click="reloadConfig">重载配置</n-button>
    </n-space>
  </n-card>

  <n-card title="服务器配置">
    <n-form
        ref="formServer"
        :label-width="80"
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
          <n-button attr-type="button" @click="handleServerClick">
            上传
          </n-button>
        </n-space>
      </n-form-item>
    </n-form>
  </n-card>
  <n-card title="相机配置">
    <n-form
        ref="formCamera"
        :label-width="80"
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
      <n-form-item label="闪光灯">
        <n-switch v-model:value="cameraOption.light" />
      </n-form-item>
      <n-form-item label="自动闪光灯">
        <n-switch v-model:value="cameraOption.autoLight" />
      </n-form-item>
      <n-form-item label="水平翻转">
        <n-switch v-model:value="cameraOption.hFlip" />
      </n-form-item>
      <n-form-item label="垂直翻转">
        <n-switch v-model:value="cameraOption.vFlip" />
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" @click="handleCameraClick">
          上传
        </n-button>
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