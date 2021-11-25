<template>
  <body>
    <div id="three-canvas" style="width: 0.8vw; height: 0.45vw"></div>
  </body>
</template>


<script setup>
import * as THREE from 'three/';
import { onMounted } from "vue";
import {initScene, randomFlashColor} from "./ThreeInit";

let renderer, scene, camera, ambientLight, directionalLight, flash;
let cloudParticle = [];
let defaultColor = new THREE.Color(0x062d89);

function initThree (){
  let init = initScene();
  scene = init.scene;
  camera = init.camera;
  renderer = init.renderer;

  camera.position.z = 1;
  camera.rotation.x = 1.16;
  camera.rotation.y = -0.12;
  camera.rotation.z = 0.27

  initEnvironment();
  initParticle();
  initFlash();
}

const initEnvironment = function (){
  ambientLight = new THREE.AmbientLight(0x555555);
  scene.add(ambientLight);
  directionalLight = new THREE.DirectionalLight(0xffeedd);
  directionalLight.position.set(0,0,1);
  scene.add(directionalLight);

  scene.fog = new THREE.FogExp2(0x11111f, 0.002);
  renderer.setClearColor(scene.fog.color);
}

const initFlash = function (){
  flash = new THREE.PointLight(0x062d89, 30, 500, 1.7);
  flash.position.set(200,300,100);
  scene.add(flash);
}

const initParticle = function (){
  let loader = new THREE.TextureLoader();
  loader.load("../src/assets/image/smoke_2.png", function(texture){
    const cloudGeo = new THREE.PlaneBufferGeometry(500,500);
    const cloudMaterial = new THREE.MeshLambertMaterial({
      map: texture,
      transparent: true
    });
    for(let p=0; p<40; p++) {
      let cloud = new THREE.Mesh(cloudGeo,cloudMaterial);
      cloud.position.set(
          Math.random()*800 -400,
          500,
          Math.random()*500 - 450
      );
      cloud.rotation.x = 1.16;
      cloud.rotation.y = -0.12;
      cloud.rotation.z = Math.random()*360;
      cloud.material.opacity = 0.8;
      cloudParticle.push(cloud);
      scene.add(cloud);
    }
    animate();
  });
}


const animate = function (){
  cloudParticle.forEach(p => {
    p.rotation.z -=0.01
  });

  if(Math.random()>0.93||flash.power>100){
    flash.position.set(
        Math.random()*400,
        300 + Math.random() *200,
        100
    );
    let flashColor = randomFlashColor();
    if(flashColor.length!==8){
      flashColor = defaultColor
    }else {
      flashColor = new THREE.Color(+randomFlashColor());
    }
    if(Math.random()>0.8){
      flash.color = flashColor;
    }else {
      flash.color = defaultColor;
    }
    flash.power = 50 + Math.random() * 500;
  }

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
  name: "three_05"
}
</script>

<style scoped>
#three-canvas{
  text-align: center;
  margin-left: 2vw;
}
</style>