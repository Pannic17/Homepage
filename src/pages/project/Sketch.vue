<template>
    <body>
    <!--
        <Header></Header>
        <router-link to="/project" class="link">back</router-link>
    -->
        <div class="sketchfab-embed-wrapper">
            <iframe class="sketch"
                    id="api-frame"
                    title="KW00104000_snake_gold"
                    frameborder="0"
                    allowfullscreen
                    mozallowfullscreen="true"
                    webkitallowfullscreen="true"
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    xr-spatial-tracking
                    execution-while-out-of-viewport
                    execution-while-not-rendered
                    web-share
                    src="https://sketchfab.com/models/8b542ea1e8384744a694be425c3ac89f/embed?api_version=1.10.4&api_id=1_api-frame&annotation=0&annotations_visible=1&autospin=0&autostart=1&cardboard=0&camera=0&preload=1&ui_stop=0&transparent=0&ui_animations=0&ui_annotations=0&ui_controls=0&ui_fullscreen=0&ui_general_controls=1&ui_help=0&ui_hint=0&ui_infos=0&ui_vr=0&ui_watermark_link=0&ui_color=ffcccc&ui_watermark=0">
            </iframe>
            <!--
            <p style="font-size: 13px; font-weight: normal; margin: 5px; color: #4A4A4A;">
                <a href="https://sketchfab.com/3d-models/kw00104000-snake-gold-bb2e636585184f37bc79ff14087ead71?utm_medium=embed&utm_campaign=share-popup&utm_content=bb2e636585184f37bc79ff14087ead71" target="_blank" style="font-weight: bold; color: #1CAAD9;">
                    KW00104000_snake_gold
                </a> by
                <a href="https://sketchfab.com/kaiwuart.io?utm_medium=embed&utm_campaign=share-popup&utm_content=bb2e636585184f37bc79ff14087ead71" target="_blank" style="font-weight: bold; color: #1CAAD9;">
                    kaiwuart.io
                </a> on
                <a href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=bb2e636585184f37bc79ff14087ead71" target="_blank" style="font-weight: bold; color: #1CAAD9;">
                    Sketchfab
                </a>
            </p>
            -->
        </div>
    </body>
</template>


<script setup>
</script>

<script>
import Header from "../../components/Header.vue";
export default {
    name: "Sketchfab",
    components: { Header }
}
</script>

<style scoped>
div{
    text-align: center;
}
.link{
    margin: 2vmin;
}
iframe{
    margin-top: 3vw;
    width: 100vw;
    height: 210vw;
}
</style>
