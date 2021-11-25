<template>
  <body>
    <div id="three-canvas" style="width: 0.8vw; height: 0.45vw"></div>
  </body>
</template>


<script setup>
import * as THREE from 'three/';
import { onMounted } from "vue";
import { initScene } from "./ThreeInit";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {PCDLoader} from "three/examples/jsm/loaders/PCDLoader";

let scene, camera, renderer;

function initThree (){
  let init = initScene();
  scene = init.scene;
  camera = init.camera;
  renderer = init.renderer;

  camera.position.z = 1;

  const loader = new PCDLoader();
  loader.load(
      '../src/assets/model/eevee.fbx',
      function ( points ) {
        points.
      }
  )

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
  name: "three_02"
}
</script>

<style scoped>
#three-canvas{
  text-align: center;
  margin-left: 2vw;
}
</style>