<template>
  <div class="heading">
    <img class="logo" alt="Cat Logo" src="../assets/image/logo_cat.png" @click="$router.push({name: 'Home'})"/>
    <a class="text" >PanNic</a>
  </div>



</template>

<script lang="ts">
export default {
  name: "Header"
}
</script>

<style scoped>
.heading{
  height: 40vmin;
  width: 30vmin;
  margin-left: 2vmin;
}

.logo{
  width: 30vmin;
}
.text {
  font-family: "Bauhaus 93", serif;
  font-size: 8vmin;
  line-height: 108%;
  color: #2c3e50;
  margin-left: 3vmin;
}
</style>