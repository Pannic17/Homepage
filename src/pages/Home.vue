<template>

  <Header></Header>
  <p>
    {{ $t("home.intro") }}
  </p>

  <p>
    <a href="https://github.com/Pannic17">Github</a>
  </p>

  <button type="button" @click="count++">count is: {{ count }}</button>
  <p>
    Build on Vue.js
  </p>

  <Menu></Menu>

</template>

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