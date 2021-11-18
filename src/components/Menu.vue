<template>
  <br><router-link to="about">{{ $t("menu.about") }}</router-link>
  <br><router-link to="game">{{ $t("menu.game") }}</router-link>
  <br><router-link to="project">{{ $t("menu.project") }}</router-link>
  <br><router-link to="artwork">{{ $t("menu.artwork") }}</router-link>
  <br><router-link v-if="$route.path!=='/'" to="contact">{{ $t("menu.home") }}</router-link>
</template>

<script>
export default {
  name: "Menu"
}
</script>

<style scoped>

</style>