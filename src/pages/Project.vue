<template>
  <Header></Header>
  <Menu></Menu>

  <div>
    <h1>{{ $t("project.nn") }}</h1>
  </div>

  <div>
    <h1>{{ $t("project.web") }}</h1>
  </div>

  <div>
    <h1>{{ $t("project.ot") }}</h1>
  </div>

</template>

<script lang="ts">
export default {
  name: "Project"
}
</script>

<script setup lang="ts">
import Header from "../components/Header.vue";
import Menu from "../components/Menu.vue";
</script>

<style scoped>

</style>