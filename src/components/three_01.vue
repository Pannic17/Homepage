<template>
  <body>
    <div id="three-canvas" style="width: 0.8vw; height: 0.45vw"></div>
  </body>
</template>


<script setup>
import * as THREE from 'three/';
import { onMounted } from "vue";
import { initScene } from "./ThreeInit";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { DotScreenShader } from "three/examples/jsm/shaders/DotScreenShader";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader";

let scene, camera, renderer, composer, object;

function initThree (){
  let init = initScene();
  scene = init.scene;
  camera = init.camera;
  renderer = init.renderer;

  camera.position.z = 400;

  object = new THREE.Object3D();
  scene.add(object);

  const geometry = new THREE.SphereBufferGeometry(1, 4, 4);
  const material = new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true});
  for (let i = 0; i < 100; i++){
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    mesh.position.multiplyScalar(Math.random() * 400);
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50; // eslint-disable-line no-multi-assign
    object.add(mesh);
  }
  scene.add(new THREE.AmbientLight(0x222222));

  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1);
  scene.add(light);

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const effect1 = new ShaderPass(DotScreenShader);
  effect1.uniforms.scale.value = 4;
  composer.addPass(effect1);

  const effect2 = new ShaderPass(RGBShiftShader);
  effect2.uniforms.amount.value = 0.0015;
  effect2.renderToScreen = true;
  composer.addPass(effect2);

  animate();
}

const animate = function () {
  requestAnimationFrame(animate);
  object.rotation.x += 0.005;
  object.rotation.y += 0.01;
  composer.render();
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
#three-canvas{
  text-align: center;
  color: red;
  margin-left: 2vw;
}
</style>