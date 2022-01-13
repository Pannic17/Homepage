<template>
  <body>
    <div id="three-canvas" style="width: 0.8vw; height: 0.45vw"></div>
  </body>
</template>


<script setup>
import * as THREE from 'three/';
import { onMounted } from "vue";
import { initScene} from "../ThreeInit";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let scene, camera, renderer, obj;

function initThree (){
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth*.96, window.innerWidth*.54);



  camera = new THREE.PerspectiveCamera( 45, 16/9, 1, 1000 );
  camera.position.set( 1, 2, - 3 );
  camera.lookAt( 0, 1, 0 );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xa0a0a0 );
  scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

  let canvas = document.getElementById('three-canvas');
  const control = new OrbitControls(camera, canvas);
  control.enableDamping = true;
  control.rotateSpeed = 0.1;

  let child = canvas.lastElementChild;
  while (child) {
    // @ts-ignore
    canvas.removeChild(child);
    // @ts-ignore
    child = canvas.lastElementChild;
  }
  // @ts-ignore
  canvas.appendChild( renderer.domElement );

  initLight();

  const loader = new GLTFLoader();
  loader.load(
      '/model/maoty_gltf/1.gltf',
      function (gltf) {
        obj = gltf.scene.children[0];
        scene.add(obj);
        animate();
      },
      function (xhr) {console.log((xhr.loaded / xhr.total * 100) + '% loaded');},
      function (error) {console.log('An error happened');}
  );
}

const animate = function () {
  obj.rotation.y += 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

function initLight (){
  const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
  hemiLight.position.set( 0, 20, 0 );
  scene.add( hemiLight );

  const dirLight = new THREE.DirectionalLight( 0xffffff );
  dirLight.position.set( - 3, 10, - 10 );
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = - 2;
  dirLight.shadow.camera.left = - 2;
  dirLight.shadow.camera.right = 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;
  scene.add( dirLight );

  const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add( mesh );
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