<template>
  <body>
    <div id="three-canvas"></div>
  </body>
</template>

<script setup>
import * as THREE from 'three/';
import stats from  'three/examples/jsm/libs/stats.module' //Display FPS
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import { onMounted } from "vue";
// Loader
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
// Control
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// Material
import { RoughnessMipmapper } from 'three/examples/jsm/utils/RoughnessMipmapper.js';
import { HDRCubeTextureLoader } from 'three/examples/jsm/loaders/HDRCubeTextureLoader.js';
import { RGBMLoader } from 'three/examples/jsm/loaders/RGBMLoader.js';
import { DebugEnvironment } from 'three/examples/jsm/environments/DebugEnvironment.js';

/*
Global Variables
 */
let scene, camera, renderer, canvas, obj;
let control, gui;
// For customized touch events
let startXRotate, startYRotate, startZoom, zoomDistance;
let speed = 0.001;
let pointLight, ambientLight;

// HDR envMap Variables
let parameters = {
  envMap: 'HDR',
  ao: 0.0,
  roughness: 0.0,
  metalness: 0.0,
  exposure: 0.0,
  intensity: 1,
  cameraPos: {
    x: 0,
    y: 2,
    z: -15,
  },
  cameraAt: {
    x: 0,
    y: 0,
    z: 0,
  }
}




/*
Renderer
 */
function initRenderer() {
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.physicallyCorrectLights = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.gammaOutput = true;
  renderer.gammaFactor = 2.2;
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
  control.rotateSpeed = speed * 1000;
  control.maxDistance = 100;
  control.target = new THREE.Vector3(0, 0, 0);
  // initTouch();
}

function initTouch() {
  control.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN
  }
}

// Touch Helper
function onSingleTouchStart(event) {
  startXRotate = event.touches[0].pageX
  startYRotate = event.touches[0].pageY;
}

function onSingleTouchMove(event) {
  let deltaX = (event.touches[0].pageX - startXRotate);
  let deltaY = (event.touches[0].pageY - startYRotate);
  // camera.position.x += deltaX * speed
  camera.position.y += deltaY * speed

}

function onDoubleTouchStart(event) {
  startZoom = event.touches[0].pageY;
  zoomDistance = Math.abs(event.touches[0].pageY - event.touches[1].pageY);
}

function onDoubleTouchMove(event) {
  let offsetZoom = Math.abs(event.touches[0].pageY - startZoom);
  let deltaDistance = Math.abs(event.touches[0].pageY - event.touches[1].pageY) - zoomDistance;
  if (deltaDistance > 0){
    // zoom in
    let delta = offsetZoom * speed;
    if (camera.position.z >= -1 || (camera.position.z + delta) >= -1 ) {
      camera.position.z = -1
    } else {
      camera.position.z += delta;
    }
  } else if (deltaDistance < 0){
    // zoom out
    let delta = offsetZoom * speed;
    if (camera.position.z <= -100 || (camera.position.z - delta) <= -100) {
      camera.position.z = -100
    } else {
      camera.position.z -= delta;
    }
  }
}

function touchListener() {
  // renderer.domElement.addEventListener( 'touchstart', onSingleTouchStart, false );
  // renderer.domElement.addEventListener( 'touchmove', onSingleTouchMove, false );



  renderer.domElement.addEventListener( 'touchstart', function (event) {
    let touches = event.touches;
    // noinspection EqualityComparisonWithCoercionJS
    if (touches && touches.length == 1) {
      onSingleTouchStart(event);
    } else if (touches && touches.length >= 2) {
      onDoubleTouchStart(event);
    }
  }, false);

  renderer.domElement.addEventListener( 'touchmove', function (event) {
    let touches = event.touches;
    // noinspection EqualityComparisonWithCoercionJS
    if (touches && touches.length == 1) {
      onSingleTouchMove(event);
    } else if (touches && touches.length >= 2) {
      onDoubleTouchMove(event);
    }
  }, false);
}

function initThree (){


  initRenderer();

  initCamera();

  initScene();

  initCanvas();

  initControl();

  touchListener();

  initLight();

  // initMesh();


  new RGBELoader()
    .load('piece-nb-01.hdr', function ( texture ) {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      scene.background = texture;
      scene.environment = texture;

      const roughnessMipmapper = new RoughnessMipmapper( renderer );
      const loader = new GLTFLoader();

      loader.load(
          '/model/maoty_gltf/1.gltf',
          function (gltf) {
            gltf.scene.traverse( function (child) {
              if (child instanceof THREE.Mesh) {
                console.log("###MESH")
                roughnessMipmapper.generateMipmaps(child.material);

              }
            })
            obj = gltf.scene.children[0];
            scene.add(obj);
            roughnessMipmapper.dispose();
            animate();
          },
          function (xhr) {console.log((xhr.loaded / xhr.total * 100) + '% loaded');},
          function (error) {console.log('An error happened');}
      );
    });

  initGUI();
}

function animate() {
  obj.rotation.y += 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  update()
}

function update() {
  pointLight.intensity = parameters.intensity;
  ambientLight.intensity = parameters.intensity;
  /*
  camera.position.x = parameters.cameraPos.x;
  camera.position.y = parameters.cameraPos.y;
  camera.position.z = parameters.cameraPos.z;
  camera.lookAt( parameters.cameraAt.x, parameters.cameraAt.y, parameters.cameraAt.z );
   */
}

/*
Environment Settings
 */
//Camera
function initCamera() {
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 1000 );
  camera.position.set(0,-1,-15);
  camera.lookAt(0,-1.5,0);
}

//Scene
function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xa0a0a0 );
  // scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );
}

//Lights
function initLight() {
  pointLight = new THREE.PointLight( 0xffffff, 1, 100)
  pointLight.position.set( parameters.lightX, parameters.lightY, parameters.lightZ);
  // scene.add(pointLight);

  ambientLight = new THREE.AmbientLight( 0xffffff, 0x444444, parameters.intensity );
  scene.add( ambientLight );

  const dirLight = new THREE.DirectionalLight( 0xffffff );
  dirLight.position.set( -3, 2, 10 );
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
  const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 500, 500 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add( mesh );
}

/*
GUI
 */
function initGUI() {
  gui = new GUI();

  // gui.add( parameters, 'metalness', 0, 1, 0.01);
  // gui.add( parameters, 'roughness', 0, 1, 0.01 );
  gui.add( parameters, 'intensity', 0, 1, 0.01)
  /*
  const cameraPos = gui.addFolder('Camera Position')
  cameraPos.add( parameters.cameraPos, 'x', -5, 5, 0.5);
  cameraPos.add( parameters.cameraPos, 'y', -5, 5, 0.5);
  cameraPos.add( parameters.cameraPos, 'z', -20, 20, 1);
  const cameraAt = gui.addFolder("Camera Look At")
  cameraAt.add( parameters.cameraAt, 'x', -5, 5, 0.05);
  cameraAt.add( parameters.cameraAt, 'y', -5, 5, 0.05);
  cameraAt.add( parameters.cameraAt, 'z', -5, 5, 0.05);
   */

  gui.open();
}


/*
Mount
 */
onMounted(() => {

  // ############################# IOS BUG FIX
  window.createImageBitmap = undefined;
  initThree();
  window.onresize = function (){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }
  window.createImageBitmap = undefined;
  window.onbeforeunload = function (){
    gui.close();
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
}
</style>