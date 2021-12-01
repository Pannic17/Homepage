<template>
  <body>
    <Header></Header>
    <Menu></Menu>


    <div>
      <h1>{{ $t("project.web") }}</h1>
    </div>

    <div>
      <h1>{{ $t("project.nn") }}</h1>
    </div>

    <div>
      <h1>{{ $t("project.cp") }}</h1>
      <router-link to="three">Three.js</router-link>
      <p>Processing</p>
    </div>

    <div>
      <h1>{{ $t("project.ot") }}</h1>
    </div>
  </body>


</template>



<script setup lang="ts">
import Header from "../../components/Header.vue";
import Menu from "../../components/Menu.vue";
</script>

<script lang="ts">
export default {
  name: "Project"
}
</script>

<style scoped>

</style>