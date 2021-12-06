<template>
  <body>
    <div id="three-canvas" style="width: 0.8vw; height: 0.45vw"></div>
  </body>
</template>



<script setup>
import * as THREE from 'three/';
import { onMounted } from "vue";
import { initScene } from "../ThreeInit";

import {BloomEffect, BlendFunction, KernelSize, TextureEffect, EffectPass} from 'postprocessing';
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";

let scene, camera, renderer, composer;
let cloudGeo, cloudMaterial, textureEffect;
let cloudParticles = []



function initThree (){
  let init = initScene();
  scene = init.scene;
  camera = init.camera;
  renderer = init.renderer;
  init.control.enabled = false;

  camera.position.z = 1;
  camera.rotation.x = 1.16;
  camera.rotation.y = -0.12;
  camera.rotation.z = 0.27;

  initLight();
  initCloud();
  
  const galaxy = new THREE.TextureLoader();
  galaxy.load("../static/image/galaxy.jpg", function (texture){
    textureEffect = new TextureEffect({
      blendFunction: BlendFunction.COLOR_DODGE,
      texture: texture
    });

    textureEffect.blendMode.opacity.value = 0.2;
    postEffect();
  });

  animate();
}

function initLight (){
  let ambientLight = new THREE.AmbientLight(0x555555);
  scene.add(ambientLight);

  let directionalLight = new THREE.DirectionalLight(0xff8c19);
  directionalLight.position.set(0,0,1);
  scene.add(directionalLight);

  let orangeLight = new THREE.PointLight(0xcc6600,50,450,1.7);
  orangeLight.position.set(200,300,100);
  scene.add(orangeLight);
  let redLight = new THREE.PointLight(0xd8547e,50,450,1.7);
  redLight.position.set(100,300,100);
  scene.add(redLight);
  let blueLight = new THREE.PointLight(0x3677ac,50,450,1.7);
  blueLight.position.set(300,300,200);
  scene.add(blueLight);

  scene.fog = new  THREE.FogExp2(0x03544e, 0.001);
  renderer.setClearColor(scene.fog.color);
}

const initCloud = function (){
  const texture = new THREE.TextureLoader();
  texture.load("/public/image/smoke_2.png", function(texture){
    cloudGeo = new THREE.PlaneBufferGeometry(500,500);
    cloudMaterial = new THREE.MeshLambertMaterial({
      map:texture,
      transparent: true,
      depthTest: false
    });

    for(let p=0; p<50; p++) {
      let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
      cloud.position.set(
          Math.random()*800 -400,
          500,
          Math.random()*500-500
      );
      cloud.rotation.x = 1.16;
      cloud.rotation.y = -0.12;
      cloud.rotation.z = Math.random()*2*Math.PI;
      cloud.material.opacity = 0.55;
      cloudParticles.push(cloud);
      scene.add(cloud);
    }
  });
}

const animate = function (){
  cloudParticles.forEach(p => {
    p.rotation.z -=0.002;
  });
  renderer.render(scene,camera);
  requestAnimationFrame(animate);
}

const postEffect = function (){
  const bloomEffect = new BloomEffect({
    blendFunction: BlendFunction.COLOR_DODGE,
    kernelSize: KernelSize.SMALL,
    useLuminanceFilter: true,
    luminanceThreshold: 0.3,
    luminanceSmoothing: 0.75
  });
  bloomEffect.blendMode.opacity.value = 1.5;
  let effectPass = new EffectPass(
      camera,
      bloomEffect,
      textureEffect
  );
  effectPass.renderToScreen = true;

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(effectPass);
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
  name: "three_06"
}
</script>

<style scoped>
#three-canvas{
  text-align: center;
  margin-left: 2vw;
}
</style>