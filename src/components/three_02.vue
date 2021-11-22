<template>
  <body>
    <div id="three-canvas" style="width: 0.8vw; height: 0.45vw"></div>
  </body>
</template>


<script setup>
import * as THREE from 'three/';
import { onMounted } from "vue";
import { initScene } from "./ThreeInit";

function initThree (){
  let init = initScene();
  const scene = init.scene;
  const camera = init.camera;
  const renderer = init.renderer;

  const geometry = new THREE.TorusGeometry(1, .2, 10, 100)
  const material = new THREE.MeshPhongMaterial({color: 0xff0000});
  const obj = new THREE.Mesh(geometry, material);
  scene.add(obj);

  const light = new THREE.DirectionalLight(0xffffff, 1.2);
  light.position.x = 3;
  light.position.y = 4;
  light.position.z = 4;
  scene.add(light);

  scene.fog = new THREE.Fog(0xffffff, 0, 20000);
  renderer.setClearColor( scene.fog.color, 1 );

  obj.position.z = -5;
  obj.rotation.y = .2;
  obj.rotation.z = .2;
  const animate = function () {
    obj.rotation.x += 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();
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