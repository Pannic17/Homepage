<template>
  <body>
    <Header></Header>

    <div>
      <router-link to="/project" class="link">back</router-link>
      <router-link to="/three/01" class="link">01</router-link>
      <router-link to="/three/02" class="link">02</router-link>
      <router-link to="/three/03" class="link">03</router-link>
      <router-link to="/three/04" class="link">04</router-link>
      <router-link to="/three/05" class="link">05</router-link>
      <router-link to="/three/06" class="link">06</router-link>
      <router-link to="/three/07" class="link">07</router-link>
      <router-link to="/three/08" class="link">08</router-link>
      <router-link to="/three/09" class="link">09</router-link>
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
.link{
  margin: 2vmin;
}

.router-link-active{
  text-decoration: none;
}
</style>