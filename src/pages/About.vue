<template>

  <Header></Header>

  <p>{{ $t("about.about") }}</p>

  <p>
    <a href="https://github.com/Pannic17">Github</a>
  </p>
  <p>{{ $t("about.para") }}</p>
</template>

<script setup lang="ts">
import Header from "../components/Header.vue";
</script>

<script lang="ts">
export default {
  name: "About"
}
</script>

