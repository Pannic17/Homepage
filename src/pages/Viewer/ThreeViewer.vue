<template>
  <body>
    <div id="three-canvas"></div>
    <img class="background" src="public/image/galaxy.jpg" alt="" />
  </body>
</template>

<script setup>
// Vue
import * as THREE from 'three/';
import { onMounted, onUnmounted } from "vue";
import { settingGUI } from "./GUIHelper";
import { toneMappingOptions } from './GUIHelper';
// import { addPlane, addTestObjects } from "./DebugHelper";
// Three.js
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
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
// import { PMREMGenerator } from "three";
import { PMREMGenerator } from "./Postproceesing/PMREMGenerator";
import {
  initRenderer,
  initCanvas,
  initStats,
  initCamera,
  initScene,
  initAmbient,
  initShadow
} from "./InitHelper";



/*
Global Variables
 */
let scene, camera, renderer, canvas;
let gui, stats;
let object, model;
let lights, control;
// For customized touch events
// Light;
let ambient, background, pmrem, hdr;
// Postprocessing
let composer, aa;
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
 * @summary Three.js Main ##############################################################################################
 */
function initThree (){

  // initRenderer();

  renderer = initRenderer();
  canvas = initCanvas( renderer );

  stats = initStats();
  canvas.appendChild( stats.dom );

  camera = initCamera();
  scene = initScene();

  ambient = initAmbient();
  scene.add( ambient );
  initShadow( renderer );

  initGUI();

  // addPlane( scene );
  // addTestObjects( scene );
  control = new CameraHelper( scene, camera, canvas, gui );
  lights = new LightHelper( scene, gui );

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
      scene.fog = new THREE.Fog(0xaaaaaa, 200, 1000);
      pmrem.compileEquirectangularShader();

      const roughnessMipmapper = new RoughnessMipmapper( renderer );
      const backgroundLoader = new THREE.TextureLoader();
      backgroundLoader.load(
          '/image/galaxy.jpg',
          function ( texture ) {
            background = texture;
            // scene.background = background;
            scene.background.toneMapped = false;
            console.log( background );
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
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.aoIntensity = 0;
                child.material.aoMap = null;
                object.add( child );
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
 * @summary Postprocessing #############################################################################################
 */
function initPost() {
  const rennderSetting = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType
  };
  const renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, rennderSetting );
  renderTarget.texture.name = 'EffectComposer.rt1';
  composer = new EffectComposer( renderer, renderTarget );

  renderer.toneMapping = toneMappingOptions[ rennderSetting.toneMapping ];

  let renderPass = new RenderPass( scene, camera );
  composer.addPass( renderPass );

  const postprocessing = new PostHelper( scene, composer, camera, renderer, gui );

  // composer.addPass( postprocessing.getFXAA() );
  // composer.addPass( postprocessing.getSSAA() );
  composer.addPass( postprocessing.getSMAA() );

  composer.addPass( new ShaderPass( GammaCorrectionShader ) );
}


/**
 * @summary Original GUI ###############################################################################################
 */
function initGUI() {
  gui = new GUI();

  const controlGUI = gui.addFolder('Control');
  controlGUI.add( parameters, 'autoPlay').name('Auto Play');
  // controlGUI.add( save, 'saveSettings').name('Save Settings');
  controlGUI.add( parameters, 'envAngle', -360, 360).name('HDR Angle').onChange(
      function (value) {
        let radians = value * Math.PI / 180
        let hdrTexture = pmrem.fromEquirectangular( hdr, radians ).texture;
        scene.environment = hdrTexture;
        scene.background = hdrTexture;
      }
  );

  settingGUI( gui, parameters, renderer, ambient );

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

.background{
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
  left: 0;
  top: 0;
}
</style>