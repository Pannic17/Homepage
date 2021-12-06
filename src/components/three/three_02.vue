<template>
  <body>
    <div id="three-canvas" style="width: 0.8vw; height: 0.45vw"></div>
  </body>
</template>


<script setup>
import * as THREE from 'three/';
import { onMounted } from "vue";
import { initScene } from "../ThreeInit";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

let scene, camera, renderer, control, model, sphereParticles;

function initThree (){
  let init = initScene();
  scene = init.scene;
  camera = init.camera;
  renderer = init.renderer;
  control = init.control;

  camera.position.z = 2;

  const loader = new GLTFLoader();
  loader.load(
      "./public/model/eevee.gltf",
      function ( gltf ) {
        model = gltf.scene.children[2];
        const modelGeometry = model.geometry;
        const particleTexture = new THREE.TextureLoader().load('/public/image/circle.png');
        const modelMaterial = new THREE.PointsMaterial({
          size: 0.08,
          map: particleTexture,
          color: new THREE.Color('#8bffff'),
          opacity: 0.5,
          transparent: true,
          depthTest: false,
          blending: THREE.AdditiveBlending
        });
        const modelParticles = new THREE.Points(modelGeometry, modelMaterial);
        scene.add(modelParticles);
        initSphere();
        initRandom();
        animate();
      })
}

function initSphere (){
  const sphereGeometry = new THREE.SphereBufferGeometry(1, 32, 32);
  const sphereMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
  })
  sphereParticles = new THREE.Points(sphereGeometry, sphereMaterial);
  scene.add(sphereParticles);
}

function initRandom(){
  const count = 5000;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count*3);
  for (let i=0;i<count*3;i++){
    positions[i] = Math.random()*2-1;
  }
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.01,
    sizeAttenuation: true,
    color: new THREE.Color('#ff88cc'),
    transparent: true,
    depthTest: false
  });
  const randomParticles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(randomParticles);
}

const animate = function () {
  sphereParticles.rotation.y += 0.5
  control.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

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