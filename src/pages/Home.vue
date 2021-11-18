<template>

  <Header></Header>

  <div class="menu"><Menu></Menu></div>



  <div class="c_social">
    <a href="mailto:pannic1984@outlook.com"><img class="social" src="../assets/image/icon_email.png" alt="Email"></a>
    <a href="https://github.com/Pannic17"><img class="social" src="../assets/image/icon_github.png"  alt="Github"/></a>
    <a href="https://space.bilibili.com/26919749"><img class="social" src="../assets/image/icon_bili.png" alt="Bilibili"></a>
    <a href="https://www.instagram.com/pannic17/"><img class="social" src="../assets/image/icon_ins.png" alt="Instagram"></a>
  </div>



</template>

<style>
.c_social{
  background-color: white;
}
.social{
  height: 5vw;
  width: 5vw;
  margin: 1vw;
}
</style>

<script setup lang="ts">
import {ref} from 'vue'
const count = ref(0)
import Header from "../components/Header.vue";
import Menu from "../components/Menu.vue";
</script>

<script lang="ts">
export default {
  name: "Home",
}
</script>

<style scoped>
.menu{
  margin-left: 3vmin;
}

.c_social{
  float: right;
  margin-right: 3vmin;
}
</style>
