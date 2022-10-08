<template>

    <Header></Header>
    <Menu></Menu>

    <h2>Maximilian.js</h2>
</template>

<script setup lang="ts">
import Header from "../components/Header.vue";
import Menu from "../components/Menu.vue";
let maxi;

initAudioEngine().then((dspEngine) => {
    maxi = dspEngine;
    // setup();
    maxi.setAudioCode("audioSet");
})
</script>

<script lang="ts">
// var osc1 = new Maximilian.maxiOsc();
export default {
    name: "Course",
    mounted() {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://mimicproject.com/libs/maximilian.v.0.1.js';
        document.body.appendChild(script);

    },
    methods: {

    }
}
</script>

<style scoped>

</style>
