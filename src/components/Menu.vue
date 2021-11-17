<template>
  <p @click="$router.push({name: 'About'})">{{ $t("menu.about") }}</p>
  <p @click="$router.push({name: 'Game'})">{{ $t("menu.game") }}</p>
  <p @click="$router.push({name: 'Project'})">{{ $t("menu.project") }}</p>
  <p @click="$router.push({name: 'Artwork'})">{{ $t("menu.artwork") }}</p>
  <p v-if="$route.path!=='/'" @click="$router.push({name: 'Contact'})">{{ $t("menu.home") }}</p>
</template>

<script>
export default {
  name: "Menu"
}
</script>

<style scoped>

</style>