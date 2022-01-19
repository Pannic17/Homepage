<template>
    <body>
        <Header></Header>
        <Menu></Menu>

        <div>
            <h1>{{ $t("game.demo") }}</h1>

            <div>
                <h2>{{ $t("game.cat.title") }}</h2>
                <p>
                    {{ $t("game.cat.intro1") }}<br>
                    {{ $t("game.cat.intro2") }}
                </p>
                <p>
                    {{ $t("game.cat.detail") }}
                </p>
                <p>
                    {{ $t("game.cat.download") }}<br>
                    {{ $t("game.cat.windows") }}<a href="https://1drv.ms/u/s!Ag4vhDewz-hX0xFpGyUyfORWu7bF?e=7jwP1l">CatNet.zip</a> <br>
                    {{ $t("game.cat.android") }}<a href="https://1drv.ms/u/s!Ag4vhDewz-hX0w-XpRU-601Wdad-?e=Ge341I">CatNet.apk</a> <br>
                </p>
            </div>
            <div>
                <h2>{{ $t("game.meta.title") }}</h2>
                <p>
                    {{ $t("game.meta.intro") }}<br>
                    {{ $t("game.meta.para0") }}
                    <a href="http://www.kaiwuart.io/">{{ $t("game.meta.site") }}</a>
                    {{ $t("game.meta.para1") }}
                </p>
            </div>
        </div>

        <br>

        <div>
            <h1>{{ $t("game.concept") }}</h1>

            <div>
                <h2>Cat Caf&#233</h2>
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
