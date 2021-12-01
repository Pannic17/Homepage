<template>
  <body>
    <div id="three-canvas" style="width: 0.8vw; height: 0.45vw"></div>
  </body>
</template>


<script setup>
import * as THREE from 'three/';
import { onMounted } from "vue";
import { initScene } from "../ThreeInit";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

let scene, camera, renderer, texture, model, modelGeometry;

function initThree (){
  let init = initScene();
  scene = init.scene;
  camera = init.camera;
  renderer = init.renderer;

  camera.position.z = 2;

  texture = new THREE.TextureLoader();

  const loader = new GLTFLoader();
  loader.load(
      '../src/assets/model/eevee.gltf',
      function ( gltf ) {
        model = gltf.scene.children[2];
        modelGeometry = model.geometry;
        const modelMaterial = new THREE.PointsMaterial({
          size: 0.02,
          sizeAttenuation: true
        })
        const particles = new THREE.Points(modelGeometry, modelMaterial);
        scene.add(particles);
        renderer.render(scene, camera);
      })
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