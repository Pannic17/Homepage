<template>
  <img alt="Vue logo" src="src/assets/logo.png" @click="$router.push({name: 'Home'})"/>
  <h1>PanNic</h1>
  <button type="button" @click="switchLanguage">{{ $t("home.language") }}</button>
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

</style>