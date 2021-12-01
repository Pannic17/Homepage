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
        <p>
          Download <br>
          Windows version: <a href="https://1drv.ms/u/s!Ag4vhDewz-hX0xFpGyUyfORWu7bF?e=7jwP1l">CatNet.zip</a> <br>
          Android Version: <a href="https://1drv.ms/u/s!Ag4vhDewz-hX0w-XpRU-601Wdad-?e=Ge341I">CatNet.apk</a> <br>
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



<script setup lang="ts">
import Header from "../components/Header.vue";
import Menu from "../components/Menu.vue";
</script>

<script lang="ts">
export default {
  name: "Game"
}
</script>

<style scoped>

</style>