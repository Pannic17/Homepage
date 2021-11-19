<template>
  <body>
    <div id="canvas" style="width: 0.8vw; height: 0.45vw"></div>
  </body>
</template>


<script setup>
import * as THREE from 'three/';
import { onMounted } from "vue";

function initThree (){
  let canvas = document.getElementById('canvas')

  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({antialias: true});
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);

  renderer.setSize(window.innerWidth*.8, window.innerHeight*.8);
  canvas.appendChild( renderer.domElement );

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({color: 0xff0000});
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.z = -5;
  cube.rotation.y = .2;
  cube.rotation.z = .2;
  const animate = function () {
    cube.rotation.x += 0.01;
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
  name: "three_01"
}
</script>

<style scoped>

</style>