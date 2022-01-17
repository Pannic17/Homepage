<template>
  <body>
    <div id="three-canvas"></div>
  </body>
</template>

<script setup>
// Vue
import * as THREE from 'three/';
import {onBeforeMount, onBeforeUpdate, onDeactivated, onMounted, onUnmounted, onUpdated} from "vue";
import {
  settingGUI,
  toneMappingGUI,
  ambientLightGUI,
} from "./guiHelper";
import { toneMappingOptions } from './guiHelper';
import { addPlane, addTestObjects } from "./debugHelper";
// Three.js
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import Stats from  'three/examples/jsm/libs/stats.module' //Display FPS
// Loader
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
// Material
import { RoughnessMipmapper } from 'three/examples/jsm/utils/RoughnessMipmapper.js';
// Postprocessing
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
// SSR & SSAO
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader';
// DEBUG
import { LightHelper } from "./LightHelper";
import { CameraHelper } from './CameraHelper';
import { PostHelper } from "./PostHelper";
// import { PMREMGenerator} from "three";
import { PMREMGenerator } from "./PMREMGenerator";



/*
Global Variables
 */
let scene, camera, renderer, canvas;
let gui, stats;
let object, model;
// For customized touch events
// Light;
let ambientLight, background, pmrem, hdr;
// Postprocessing
let composer;
// Global Variable for Three.js
let parameters = {
  envMap: 'HDR',
  envAngle: 0,
  autoPlay: false,
  enablePostprocessing: true,
  exposure: 1.0,
  toneMapping: 'ACESFilmic',
  maps: {
    arm: null,
    env: null,
  }
}

/**
 * @summary Three Initiation ###########################################################################################
 */
// Renderer
function initRenderer() {
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  /**
   * @function Gamma
   * DISCARD -> UNAVAILABLE
   */
  renderer.physicallyCorrectLights = true;
  // renderer.gammaOutput = true;
  // renderer.gammaFactor = 2.2;
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
  stats = new Stats();
  canvas.appendChild( stats.dom );
}


/**
 * @summary Three.js Main ##############################################################################################
 */
function initThree (){

  initRenderer();

  initCamera();

  initScene();

  initCanvas();

  initAmbient();

  initShadow();

  initGUI();

  // addPlane( scene );
  // addTestObjects( scene );

  const lightsMenu = new LightHelper( scene, gui );
  const cameraMenu = new CameraHelper( scene, camera, canvas, gui );
  initPost();

  pmrem = new PMREMGenerator( renderer );

  new RGBELoader()
    .load('/hdr/xmas.hdr', function ( texture ) {
      // texture.mapping = THREE.EquirectangularReflectionMapping;
      hdr = texture;
      let hdrTexture = pmrem.fromEquirectangular(texture, parameters.envAngle ).texture
      scene.environment = hdrTexture;
      // scene.background = hdrTexture;
      // scene.background = 'black'
      scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
      pmrem.compileEquirectangularShader();

      const roughnessMipmapper = new RoughnessMipmapper( renderer );
      const backgroundLoader = new THREE.TextureLoader();
      backgroundLoader.load(
          '/image/galaxy.jpg',
          function ( texture ) {
            background = texture;
            scene.background = background;
            backgroundFit( background );
          }
      );

      const loader = new GLTFLoader();
      loader.load(
          '/model/owl_gltf/1.gltf',
          function (gltf) {
            object = new THREE.Group();
            gltf.scene.traverse( function (child) {
              if (child instanceof THREE.Mesh) {
                console.log(child.material);
                roughnessMipmapper.generateMipmaps(child.material);
                // noinspection JSUnresolvedVariable
                // ssrPass.metalnessMap = child.material.metalnessMap;
                // child.material.envMap = camera.renderTarget.texture;
                child.castShadow = true;
                child.receiveShadow = true;
                // noinspection JSUnresolvedVariable
                child.material.aoIntensity = 0;
                child.material.aoMap = null;
                object.add( child );
                // scene.add( child );
                /**
                 * @function Disable AO
                 * DISCARD
                 * for debug only
                child.material.aoIntensity = 0;
                child.material.aoMap = null;
                scene.add(child);
                 */
                /**
                 * @function View ARM
                 * DISCARD -> RECONSTRUCT
                 * realized in reload
                parameters.maps.arm = child.material.aoMap;
                let viewMaterial = new THREE.MeshPhongMaterial({
                  color: 0x0000ff,
                  map: parameters.maps.arm
                })
                let viewMesh = new THREE.Mesh(child.geometry, viewMaterial);
                scene.add(viewMesh);
                 */
              }
            })
            // object = gltf.scene;
            object.rotation.y = 180 * Math.PI / 180;
            scene.add(object);
            roughnessMipmapper.dispose();
            animate();
          },
          function (xhr) {console.log((xhr.loaded / xhr.total * 100) + '% loaded');},
          function (error) {console.log('An error happened');}
      );

      pmrem.dispose();
    });
}

/**
 * @summary Animation ##################################################################################################
 */
// Animation
function animate() {
  if (parameters.autoPlay){
    object.rotation.y += 0.01;
  }
  if (parameters.enablePostprocessing){
    composer.render();
  } else {
    renderer.render( scene, camera );
  }
  requestAnimationFrame(animate);
  update()
  stats.update();
}

// Update on Change
function update() {
  renderer.toneMappingExposure = parameters.exposure;
}

/**
 * @summary Environment Setting ########################################################################################
 */
// Camera
function initCamera() {
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 1000 );
  camera.position.set( 0, -1, -15 );
  camera.lookAt( 0, -1.5 ,0 );
}

// Scene
function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xa0a0a0 );
  // scene.fog = new THREE.Fog( 0x443333, 1, 4 );
}

// Ambient
function initAmbient() {
  ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
  scene.add( ambientLight );
}

// Shadow
function initShadow() {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
}


/**
 * @summary Postprocessing #############################################################################################
 */
function initPost() {
  composer = new EffectComposer( renderer );

  let renderPass = new RenderPass( scene, camera );
  composer.addPass( renderPass );

  const postprocessing = new PostHelper( scene, composer, camera, renderer, gui );

  composer.addPass( new ShaderPass( GammaCorrectionShader ));

  renderer.toneMapping = toneMappingOptions[ parameters.toneMapping ];

  composer.addPass( postprocessing.getFXAA() );
}


/**
 * @summary Original GUI ###############################################################################################
 */
function initGUI() {
  gui = new GUI();

  const controlGUI = gui.addFolder('Control');
  controlGUI.add( parameters, 'autoPlay').name('Auto Play');
  // controlGUI.add( save, 'saveSettings').name('Save Settings');
  controlGUI.add( parameters, 'envAngle', -Math.PI, Math.PI).name('HDR Angle').onChange(
      function (value) {
        let hdrTexture = pmrem.fromEquirectangular( hdr, value ).texture;
        scene.environment = hdrTexture;
        // scene.background = hdrTexture;
      }
  );

  settingGUI( gui, parameters, renderer, ambientLight );

  gui.open();
}

const save = new function() {
  this.saveSettings = function () {
    console.log( parameters );
  }
}


/**
 * @summary Helper Tools ###############################################################################################
 */
function backgroundFit( texture ) {
  const targetAspect = window.innerWidth / window.innerHeight;
  const imageAspect = texture.image.width / texture.image.height;
  const factor = imageAspect / targetAspect;
  scene.background.offset.x = factor > 1 ? (1 - 1 / factor) / 2 : 0;
  scene.background.repeat.x = factor > 1 ? 1 / factor : 1;
  scene.background.offset.y = factor > 1 ? 0 : (1 - factor) / 2;
  scene.background.repeat.y = factor > 1 ? 1 : factor;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  composer.setSize( window.innerWidth, window.innerHeight );
  backgroundFit( background );
}

function isMobile() {
  return navigator.userAgent.match (/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
}

function clearAll( parent, child ){
  if( child.children.length ){
    let arr  = child.children.filter( x => x );
    arr.forEach( a=> {
      clearAll( child, a )
    })
  }
  if( child instanceof THREE.Mesh ){
    if( child.material.map ) child.material.map.dispose();
    child.material.dispose();
    child.geometry.dispose();
  }else if( child.material ){
    child.material.dispose();
  }
  child.remove();
  parent.remove( child );
}

/**
 * @summary Vue Mount ##################################################################################################
 */
onMounted(() => {
  window.createImageBitmap = undefined; // Fix iOS Bug
  initThree();
  window.addEventListener( 'resize', onWindowResize);
  if ( isMobile() ){
    gui.close();
  }
})

onUnmounted(() => {
  console.log('UNMOUNTED')
  clearAll( scene, object );
  renderer.dispose();
  gui.destroy();
})

onDeactivated(() => {
  console.log('DEACTIVATED')
  gui.dispose();
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