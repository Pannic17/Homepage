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

</style>