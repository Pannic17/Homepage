<template>
  <body>
    <div id="three-canvas" style="width: 0.8vw; height: 0.45vw"></div>
  </body>
</template>

<script setup>
import * as THREE from 'three/';
import stats from  'three/examples/jsm/libs/stats.module' //Display FPS
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import { onMounted } from "vue";
// Loader
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// Control
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// Material
import { HDRCubeTextureLoader } from 'three/examples/jsm/loaders/HDRCubeTextureLoader.js';
import { RGBMLoader } from 'three/examples/jsm/loaders/RGBMLoader.js';
import { DebugEnvironment } from 'three/examples/jsm/environments/DebugEnvironment.js';

/*
Global Variables
 */
let scene, camera, renderer, canvas, obj, control;
// For customized touch events
let startY
let speed = 0.001

// HDR envMap Variables
const parameters = {
  envMap: 'HDR',
  ao: 0.0,
  roughness: 0.0,
  metalness: 0.0,
  exposure: 0.0
}

/*
Renderer
 */
function initRenderer() {
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth*.96, window.innerWidth*.54);
  renderer.physicallyCorrectLights = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
}

/*
Canvas
 */
function initCanvas() {
  canvas = document.getElementById('three-canvas');
  let child = canvas.lastElementChild;
  while (child) {
    canvas.removeChild(child);
    child = canvas.lastElementChild;
  }
  canvas.appendChild( renderer.domElement );
}


/*
Controls
 */
function initControl() {
  control = new OrbitControls(camera, canvas);
  control.enableDamping = true;
  control.rotateSpeed = speed*10;
  initTouch();
}

function initTouch() {
  control.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN
  }
}

// Touch Helper
function onTouchStart(event) {
  startY = event.touches[0].pageY;
}

function onTouchMove(event) {
  let deltaY = ( event.touches[ 0 ].pageY - startY );
  camera.position.z += ( deltaY * speed );
}

function touchListener() {
  renderer.domElement.addEventListener( 'touchstart', onTouchStart, false );
  renderer.domElement.addEventListener( 'touchmove', onTouchMove, false );
}

function initThree (){


  initRenderer();

  initCamera();

  initScene();

  initCanvas();

  initControl();

  touchListener();

  initLight();

  initMesh();

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

  initGUI();
}

function animate () {
  obj.rotation.y += 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

/*
Environment Settings
 */
//Camera
function initCamera() {
  camera = new THREE.PerspectiveCamera( 45, 16/9, 1, 1000 );
  camera.position.set( 1, 2, - 3 );
  camera.lookAt( 0, 0, 0 );
}

//Scene
function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xa0a0a0 );
  scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );
}

//Lights
function initLight() {
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


}

/*
Mesh Setting
 */
function initMesh() {
  const materials = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: parameters.metalness,
    roughness: parameters.roughness,
  });
  const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add( mesh );
}

/*
GUI
 */
function initGUI() {
  const gui = new GUI();

  gui.add( parameters, 'metalness', 0,1,0.01);
  gui.add( parameters, 'roughness', 0, 1, 0.01 );
  gui.open();
}


/*
Mount
 */
onMounted(() => {
  initThree();
  window.onresize = function (){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }
})

</script>

<script>
export default {
  name: "ThreeViewer"
}
</script>

<style scoped>
#three-canvas{
  text-align: center;
  margin-left: 2vw;
}
</style>