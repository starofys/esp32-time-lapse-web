<script setup>
import {ref, unref} from "vue";
import {NForm,NFormItem,NInput,NInputNumber,NButton} from 'naive-ui'
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
  wbModel: '',
  jpegQuality: 4,
  freqMHz: 20,
  sleep: 5
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

const doAction = (e,form,cls,model,filename) => {
  e.preventDefault()
  form.value.validate((errors)=>{
    if (!errors) {
      const option = new cls
      const val = unref(model)
      for(const k in val) {
        const fnName = 'set' + k.substring(0,1).toUpperCase() + k.substring(1)
        if (option[fnName]) {
          option[fnName](val[k])
        }
      }
      console.log(option.toObject())
      console.log(cameraIp.value.ip)
      // pb.post('http://' + cameraIp.value.ip + '/edit').then(console.log);
      const data = new FormData()
      data.append('file',new Blob([option.serializeBinary()],{
      }),filename)
      http.post( '/config/edit',data,{
      }).then(console.log)
    }
  });
}
const handleServerClick = (e) => {
  doAction(e,formServer,Esp.UdpServerOption,udpServer,'/config_udp_server.pb')
}
const handleServerUpload = ()=> {

}
const handleCameraClick = (e) => {
  e.preventDefault()
  formCamera.value.validate((errors)=>{
    console.log(errors)
    if (!errors) {

    }
  });
}

</script>
<template>

  <n-card title="相机ip地址">
    <n-input placeholder="camera ip地址" v-model:value="cameraIp.ip"></n-input>
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
            到出文件
          </n-button>
          <n-button attr-type="button" @click="handleServerUpload">
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
      <n-form-item label="格式" path="pixFormat">
        <n-select v-model:value="cameraOption.pixFormat" :options="pixFormatOpt" />
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" @click="handleCameraClick">
          到出文件
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
      pixFormatOpt: buildOptions(Esp.PixFormat)
    }
  }
}
</script>

<style>

</style>