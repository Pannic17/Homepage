<template>
  <body>
    <div id="three-canvas" style="width: 0.8vw; height: 0.45vw"></div>
  </body>
</template>


<script setup>
import * as THREE from 'three/';
import {onMounted, render} from "vue";
import { initScene } from "./ThreeInit";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function initThree (){
  let init = initScene();
  const scene = init.scene;
  const camera = init.camera;
  const renderer = init.renderer;

  camera.position.z = 3;

  const loader = new GLTFLoader();

  const light = new THREE.AmbientLight(0x404040, 10); // soft white light
  scene.add(light);

  loader.load(
      '../src/assets/model/eevee.gltf',
      function (gltf) {
        var obj = gltf.scene.children[2];
        obj.position.y = -1;
        console.log(obj)

        const animate = function () {
          obj.rotation.z += 0.01;
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
        };

        animate();

        scene.add(gltf.scene);
        renderer.render(scene, camera);
      },
      function (xhr) {

        console.log((xhr.loaded / xhr.total * 100) + '% loaded');

      },
      function (error) {
        console.log('An error happened');

      }
  );


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
  name: "three_03"
}
</script>

<style scoped>
#three-canvas{
  text-align: center;
  margin-left: 2vw;
}
</style>