<template>
  <div class="heading">
    <img class="logo" alt="Cat Logo" src="../assets/image/logo_cat.png" @click="$router.push({name: 'Home'})"/>
    <a class="text" >PanNic</a>
  </div>



</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n";

const i18n = useI18n();
const switchLanguage = () => {
  if (i18n.locale.value == 'zh-CN'){
    i18n.locale.value = 'en-US'

  }else {
    i18n.locale.value = 'zh-CN'
  }
}
</script>

<script lang="ts">
export default {
  name: "Header"
}
</script>

<style scoped>
.heading{
  height: 40vmin;
  width: 30vmin;
}

.logo{
  width: 30vmin;
}
.text {
  font-family: "Bauhaus 93", serif;
  font-size: 8vmin;
  line-height: 108%;
  color: #2c3e50;
  margin-left: 3vmin;
}
</style>