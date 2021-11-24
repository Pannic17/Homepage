<template>
  <body>
    <div id="three-canvas" style="width: 0.8vw; height: 0.45vw"></div>
  </body>
</template>


<script setup>
import * as THREE from 'three/';
import { onMounted } from "vue";
import { initLight, initScene} from "./ThreeInit";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";


var clock, renderer, scene, camera;
let portalParticles = [];


function initThree (){
  let init = initScene();
  scene = init.scene;
  camera = init.camera;
  renderer = init.renderer;

  camera.position.z = 1000;
  camera.far = 1000;

  const light = new THREE.DirectionalLight(0xffffff,0.5);
  light.position.set(0,0,1);
  scene.add(light);

  initParticle();
}




const initParticle = function (){
  let loader = new THREE.TextureLoader();
  loader.load("../src/assets/image/smoke.png", function (texture){
    const portalGeo = new THREE.PlaneBufferGeometry(350, 350);
    const portalMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true
    });

    for(let p=880; p>250; p--){
      let particle =  new THREE.Mesh(portalGeo, portalMaterial);
      particle.position.set(
          0.5*p*Math.cos((4*p*Math.PI)/180),
          0.5*p*Math.sin((4*p*Math.PI)/180),
          0.1*p
      );
      particle.rotation.z = Math.random()*360;
      portalParticles.push(particle);
      scene.add(particle);
    }
    clock = new THREE.Clock();
    animate();
  })
}

const animate = function () {
  let delta = clock.getDelta();
  portalParticles.forEach(p => {
    p.rotation.z -= delta *1.5;
  });
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
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