<template>
  <body>
    <Header></Header>

    <div>
      <router-link to="/project" class="part">back</router-link>
      <router-link to="/three/01" class="part">01</router-link>
      <router-link to="/three/02" class="part">02</router-link>
      <router-link to="/three/03" class="part">03</router-link>
      <router-link to="/three/04" class="part">04</router-link>
      <router-link to="/three/05" class="part">05</router-link>
      <router-link to="/three/06" class="part">06</router-link>
      <router-link to="/three/07" class="part">07</router-link>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </body>
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

.router-link-active{
  text-decoration: none;
}
</style>