<template>
  <br><a @click="switchLanguage" class="language"><u>{{ $t("menu.language")}}</u></a>
  <br><br><router-link to="about" class="link">{{ $t("menu.about") }}</router-link>
  <br><br><router-link to="game" class="link">{{ $t("menu.game") }}</router-link>
  <br><br><router-link to="project" class="link">{{ $t("menu.project") }}</router-link>
  <br><br><router-link to="artwork" class="link">{{ $t("menu.artwork") }}</router-link>
  <br><br><router-link v-if="$route.path!=='/'" to="contact" class="link">{{ $t("menu.home") }}</router-link>
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
  name: "Menu"
}
</script>

<style scoped>
.link{
  font-size: 6vmin;
  line-height: 108%;
  color: #2c3e50;
}

.language{
  font-size: 6vmin;
  line-height: 108%;
  color: #2c3e50;
}
</style>