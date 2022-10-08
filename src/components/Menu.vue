<template>
    <p><a @click="switchLanguage" class="language"><u>{{ $t("menu.language")}}</u></a></p>
    <p><router-link to="about" class="link">{{ $t("menu.about") }}</router-link></p>
    <p><router-link to="course" class="link">{{ $t("menu.course") }}</router-link></p>
    <p><router-link to="game" class="link">{{ $t("menu.game") }}</router-link></p>
    <p><router-link to="project" class="link">{{ $t("menu.project") }}</router-link></p>
    <p><router-link to="artwork" class="link">{{ $t("menu.artwork") }}</router-link></p>
    <p><router-link v-if="$route.path!=='/'" to="contact" class="link">{{ $t("menu.home") }}</router-link></p>
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
p{
    margin-bottom: 4vmin;
    margin-left: 5vmin;
}
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

.router-link-active{
    text-decoration: line-through;
}
</style>
