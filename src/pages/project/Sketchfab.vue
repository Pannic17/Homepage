<template>
  <body>
    <Header></Header>
    <div>
      <router-link to="/project" class="link">back</router-link>
    </div>

  </body>
</template>

<script>
import Header from "../../components/Header.vue";
export default {
  name: "Sketchfab",
  components: {Header}
}
</script>

<style scoped>
.link{
  margin: 2vmin;
}
</style>