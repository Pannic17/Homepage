<template>
  <body>
    <div id="three-canvas"></div>
  </body>
</template>

<script setup>
// Vue
import * as THREE from 'three/';
import { onMounted } from "vue";
// Three.js
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import stats from  'three/examples/jsm/libs/stats.module' //Display FPS
// Loader
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { RGBMLoader } from 'three/examples/jsm/loaders/RGBMLoader';
import { HDRCubeTextureLoader } from 'three/examples/jsm/loaders/HDRCubeTextureLoader.js';
// Control
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// Material
import { RoughnessMipmapper } from 'three/examples/jsm/utils/RoughnessMipmapper.js';
// Postprocessing
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
// SSR & SSAO
import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader';
import { ReflectorForSSRPass } from 'three/examples/jsm/objects/ReflectorForSSRPass.js';
// DEBUG
import { DebugEnvironment } from 'three/examples/jsm/environments/DebugEnvironment.js';



/*
Global Variables
 */
let scene, camera, renderer, canvas, obj;
let control, gui;
// For customized touch events
let startXRotate, startYRotate, startZoom, zoomDistance;
let speed = 0.001;
// Light;
let pointLight, ambientLight, dirLight, hemiLight, spotLight;
// Postprocessing
let composer;
let ssrPass, saoPass, groundGeometry, groundReflector;

// Global Variable for Three.js
let parameters = {
  envMap: 'HDR',
  ao: 0.0,
  roughness: 0.0,
  metalness: 0.0,
  enableSSR: true,
  darkenSSR: false,
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

/**
 * @summary Three Initiation ###########################################################################################
 */
// Renderer
function initRenderer() {
  renderer = new THREE.WebGLRenderer({antialias: false});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.physicallyCorrectLights = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.gammaOutput = true;
  renderer.gammaFactor = 2.2;
}

// Canvas
function initCanvas() {
  canvas = document.getElementById('three-canvas');
  let child = canvas.lastElementChild;
  while (child) {
    canvas.removeChild(child);
    child = canvas.lastElementChild;
  }
  canvas.appendChild( renderer.domElement );
}


// Controls
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

/**
 * @summary Touch Helper ###############################################################################################
 */
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

/**
 * @summary Three.js Main ##############################################################################################
 */
function initThree (){


  initRenderer();

  initCamera();

  initScene();

  initCanvas();

  initControl();

  touchListener();

  initLight();

  // initObject();
  // initMesh();

  initPost();



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
                console.log(child.material);
                roughnessMipmapper.generateMipmaps(child.material);
                // noinspection JSUnresolvedVariable
                // ssrPass.metalnessOnMaterial = child.material;
                // ssrPass.metalnessMap = child.material.metalnessMap;
                // ssrPass.metalnessRenderTarget.material = child.material;
              }
            })
            obj = gltf.scene;
            scene.add(obj);
            // roughnessMipmapper.dispose();
            animate();
          },
          function (xhr) {console.log((xhr.loaded / xhr.total * 100) + '% loaded');},
          function (error) {console.log('An error happened');}
      );
    });

  initGUI();
}

// Animation
function animate() {
  obj.rotation.y += 0.01;
  if (parameters.enableSSR){
    composer.render();
    // console.log(parameters.enableSSR);
  } else {
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
  update()
}

// Update on Change
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

/**
 * @summary Environment Setting ########################################################################################
 */
// Camera
function initCamera() {
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 1000 );
  camera.position.set(0,-1,-15);
  camera.lookAt(0,-1.5,0);
}

// Scene
function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xa0a0a0 );
  // scene.fog = new THREE.Fog( 0x443333, 1, 4 );
}

// Lights
function initLight() {
  pointLight = new THREE.PointLight( 0xffffff, 1, 100)
  pointLight.position.set( parameters.lightX, parameters.lightY, parameters.lightZ);
  // scene.add(pointLight);

  ambientLight = new THREE.AmbientLight( 0xffffff, 0x444444, parameters.intensity );
  scene.add( ambientLight );

  dirLight = new THREE.DirectionalLight( 0xffffff );
  dirLight.position.set( -3, 2, 10 );
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = - 2;
  dirLight.shadow.camera.left = - 2;
  dirLight.shadow.camera.right = 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;
  // scene.add( dirLight );

  hemiLight = new THREE.HemisphereLight( 0x443333, 0x111122 );
  // scene.add( hemiLight );

  spotLight = new THREE.SpotLight();
  spotLight.angle = Math.PI / 16;
  spotLight.penumbra = 0.5;
  // spotLight.castShadow = true;
  spotLight.position.set( - 1, 1, 1 );
  // scene.add( spotLight );
}


/**
 * @summary Custom Mesh & Object #######################################################################################
 */
// Mesh & Plane
function initMesh() {
  const materials = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: parameters.metalness,
    roughness: parameters.roughness,
  });
  const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry( 500, 500 ),
      new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add( mesh );
}

// Objects
function initObject() {
  let boxGeometry = new THREE.BoxBufferGeometry( 2, 2, 0.5 );
  let boxMaterial = new THREE.MeshStandardMaterial( {
    color: 'cyan',
  });
  let boxMesh = new THREE.Mesh( boxGeometry, boxMaterial );
  boxMesh.position.set( -3, 3, - 3 );
  scene.add( boxMesh );
  selects.push( boxMesh );
  let sphereGeometry = new THREE.IcosahedronBufferGeometry( 2, 4 );
  let sphereMaterial = new THREE.MeshStandardMaterial( {
    color: 'red',
  });
  let sphereMesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
  sphereMesh.position.set( 3, 3, - 3 );
  scene.add( sphereMesh );
  selects.push( sphereMesh );
}


/**
 * @summary Postprocessing #############################################################################################
 */
function initPost() {
  composer = new EffectComposer( renderer );


  initSSR();
  initSAO();

  let renderPass = new RenderPass( scene, camera );
  composer.addPass( renderPass );
  composer.addPass( saoPass );
  // composer.addPass( ssrPass );
  composer.addPass( new ShaderPass( GammaCorrectionShader ) );
}

// SSR Pass
function initSSR() {
  ssrPass = new SSRPass({
    renderer,
    scene,
    camera,
    width: innerWidth,
    height: innerHeight,
  })


  ssrPass.thickness = 0.1;
  ssrPass.infiniteThick = false;
  ssrPass.maxDistance = 25;
  ssrPass.opacity = 1;
  ssrPass.surfDist = 0.001
  // ssrPass.selects = selects;
  // ssrPass.groundReflector = groundReflector;
}

// SSAO Pass
function initSAO() {
  saoPass = new SSAOPass(
      scene,
      camera,
      innerWidth,
      innerHeight
  );
  saoPass.kernelRadius = 16;
}

/**
 * @summary Original GUI ###############################################################################################
 */
function initGUI() {
  gui = new GUI();

  // gui.add( parameters, 'metalness', 0, 1, 0.01);
  // gui.add( parameters, 'roughness', 0, 1, 0.01 );
  const lightGUI = gui.addFolder('Light Setting');
  lightGUI.add( parameters, 'intensity', 0, 1, 0.01);

  const ssrGUI = gui.addFolder('SSR Setting');
  ssrGUI.add( parameters, 'enableSSR').name('Enable SSR');
  ssrGUI.add( ssrPass, 'output', {
    'Default': SSRPass.OUTPUT.Default,
    'SSR Only': SSRPass.OUTPUT.SSR,
    'Beauty': SSRPass.OUTPUT.Beauty,
    'Depth': SSRPass.OUTPUT.Depth,
    'Normal': SSRPass.OUTPUT.Normal,
    'Metalness': SSRPass.OUTPUT.Metalness,
  }).onChange( function(value) {
    ssrPass.output = parseInt( value );
  });
  ssrGUI.add( ssrPass, 'maxDistance', 0, 20, 0.2).name('Max Distance');
  ssrGUI.add( ssrPass, 'opacity', 0, 1, 0.01).name('Opacity');
  ssrGUI.add( ssrPass, 'surfDist', 0, 0.002, 0.0001).name('Surface Distance');

  const saoGUI = gui.addFolder('SSAO Setting');
  saoGUI.add( saoPass, 'output', {
    'Default': SSAOPass.OUTPUT.Default,
    'SSAO Only': SSAOPass.OUTPUT.SSAO,
    'SSAO Only + Blur': SSAOPass.OUTPUT.Blur,
    'Beauty': SSAOPass.OUTPUT.Beauty,
    'Depth': SSAOPass.OUTPUT.Depth,
    'Normal': SSAOPass.OUTPUT.Normal
  }).onChange( function (value) {
    saoPass.output = parseInt( value );
  });
  saoGUI.add( saoPass, 'kernelRadius', 0.01, 16, 0.01).name('Kernel Radius');
  saoGUI.add( saoPass, 'minDistance', 0.00001, 0.0002).name('Min Distance');
  saoGUI.add( saoPass, 'maxDistance', 0.0002, 3).name('Max Distance');
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


/**
 * @summary Vue Mount ##################################################################################################
 */
onMounted(() => {
  // ############################# IOS BUG FIX
  window.createImageBitmap = undefined;
  initThree();
  window.onresize = function (){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    composer.setSize( window.innerWidth, window.innerHeight );
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