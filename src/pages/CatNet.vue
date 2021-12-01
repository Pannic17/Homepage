<template>
  <body>
    <Header></Header>
    <Menu></Menu>

    <div>
      <h1>{{ $t("game.demo") }}</h1>

      <div>
        <h2>{{ $t("game.catTitle") }}</h2>
        <p>
          {{ $t("game.catIntro") }}<br>
          {{ $t("game.catPara") }}
        </p>
      </div>
      <div>
        <h2>{{ $t("game.metaTitle") }}</h2>
        <p>
          {{ $t("game.metaIntro") }}<br>
          {{ $t("game.metaPara") }}
        </p>
      </div>
    </div>

    <br>

    <div>
      <h1>{{ $t("game.concept") }}</h1>

      <div>
        <h2>Cat Caf&#233</h2>
      </div>
      <div>
        <h2>PSY-I</h2>
      </div>
    </div>
  </body>


</template>

<script lang="ts">
export default {
  name: "Game"
}
</script>

<script setup lang="ts">
import Header from "../components/Header.vue";
import Menu from "../components/Menu.vue";
</script>

<style scoped>

</style>