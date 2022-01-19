<template>
    <body>
        <Header></Header>

        <div>
            <router-link to="/project" class="link">back</router-link>
            <router-link to="" class="link">01</router-link>
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
    name: "Css"
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
