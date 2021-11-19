<template>
  <Header></Header>
  <router-link to="/project">back</router-link>
  <br>
  <div>
    <router-link to="/web-three-js/01" class="part" active-class="active">01</router-link>
    <router-link to="/web-three-js/02" class="part" active-class="active">02</router-link>
  </div>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import Header from "../../components/Header.vue";
</script>

<script lang="ts">
export default {
  name: "Three"
}
</script>

<style scoped>
.part{
  margin: 2vmin;
}

.active{
  text-decoration: none;
}
</style>