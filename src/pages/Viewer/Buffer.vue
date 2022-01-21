<template>
    <router-link to="viewer"></router-link>
    <div class="buffer"></div>
</template>

<script>

import {useRouter} from "vue-router";
import {onMounted} from "vue";

export default {
    name: "Buffer",
    setup() {
        const router = useRouter();

        onMounted(() => {
            router.push({
                path: '/viewer'
            })
        })
    }
}
</script>

<style scoped>
.buffer{
    width: 100%;
    height: 100%;
    background: #1d1d1d;
}
</style>
