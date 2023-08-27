<script lang="ts" setup>
import { useNotification } from 'naive-ui'
import { setNotification} from '@/utils/http'
const notify = useNotification()
setNotification(notify)
</script>
<template>

</template>

<script lang="ts">
export default {
  name: "Notify"
}
</script>
