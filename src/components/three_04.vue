<template>
  <body>
    <div id="three-canvas" style="width: 0.8vw; height: 0.45vw"></div>
  </body>
</template>


<script setup>
import * as THREE from 'three/';
import { onMounted } from "vue";
import {initLight, initScene} from "./ThreeInit";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

function initThree (){
  let init = initScene();
  const scene = init.scene;
  const camera = init.camera;
  const renderer = init.renderer;

  camera.position.z = 3;
  camera.far = 2000;

  initLight(scene);







}

onMounted(() => {
  initThree();
  window.onresize = function (){
    location.reload()
  }
})

</script>


<script>
export default {
  name: "three_04"
}
</script>

<style scoped>
#three-canvas{
  text-align: center;
  margin-left: 2vw;
}
</style>