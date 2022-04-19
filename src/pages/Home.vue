<template>
    <body>
        <div class="heading"><Header /></div>
        <div class="menu"><Menu /></div>

        <div class="socialCanvas">
            <a href="mailto:pannic1984@outlook.com"><img class="social" src="../assets/image/icon_email.png" alt="Email"></a>
            <a href="https://github.com/Pannic17"><img class="social" src="../assets/image/icon_github.png" alt="Github"/></a>
            <a href="https://space.bilibili.com/26919749"><img class="social" src="../assets/image/icon_bili.png" alt="Bilibili"></a>
            <a href="https://www.instagram.com/pannic17/"><img class="social" src="../assets/image/icon_ins.png" alt="Instagram"></a>
            <br/>
            苏ICP备2021057142号-1  
            <a href="https://beian.miit.gov.cn"></a>
        </div>
    </body>
</template>



<script setup lang="ts">
import Header from "../components/Header.vue";
import Menu from "../components/Menu.vue";
</script>

<script lang="ts">
export default {
    name: "Home",
}
</script>

<style scoped>
body{
    width: 100%;
    height: 100%;
}



.socialCanvas{
    margin-right: 5vmin;
    position: fixed;
    bottom: 0;
    right: 0;
}


.social{
    height: 10vmin;
    width: 10vmin;
    margin: 2vmin;
}
</style>
