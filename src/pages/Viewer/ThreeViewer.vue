<template>
  <body>
    <div id="three-canvas"></div>
  </body>
</template>

<script setup>
// Vue
import * as THREE from 'three/';
import { onMounted } from "vue";
import {
  settingGUI,
  ssrGUI,
  ssaoGUI,
  dirlightLog,
  toneMappingGUI,
  bloomGUI, ambientLightGUI,
} from "./guiHelper";
import { toneMappingOptions } from './guiHelper';
import {addPlane, addTestObjects} from "./debugHelper";
// import { onSingleTouchStart, onSingleTouchMove, onDoubleTouchStart, onDoubleTouchMove} from "./touchHelper";
// Three.js
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import Stats from  'three/examples/jsm/libs/stats.module' //Display FPS
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
import { SSRPass } from './SSRPass';
import { SSAOPass } from './SSAOPass';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader';
import { ReflectorForSSRPass } from 'three/examples/jsm/objects/ReflectorForSSRPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
// Shader
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { TAARenderPass } from 'three/examples/jsm/postprocessing/TAARenderPass.js';
// DEBUG
import { DebugEnvironment } from 'three/examples/jsm/environments/DebugEnvironment.js';
import { MathUtils, Vector3, Texture } from "three";
import { LightHelper } from "./LightHelper";
import { CameraHelper } from './CameraHelper';
import { PostHelper } from "./PostHelper";
// import { PMREMGenerator} from "three";
import { PMREMGenerator } from "./PMREMGenerator";



/*
Global Variables
 */
let scene, camera, renderer, canvas;
let control, gui, stats;
let object, model;
// For customized touch events
let speed = 0.001;
// Light;
let ambientLight, background, pmrem, hdr;
// Postprocessing
let composer;
let ssrPass, ssaoPass, ssrrPass;
let taaPass, fxaaPass;
let bloomPass, filmEffect;

// Global Variable for Three.js
let parameters = {
  envMap: 'HDR',
  envAngle: 0,
  autoPlay: false,
  enablePostprocessing: true,
  enableBloom: true,
  exposure: 1.0,
  toneMapping: 'ACESFilmic',
  camera: {
    position: {
      x: 0,
      y: -3,
      z: -15,
    },
    lookAt: {
      x: 0,
      y: -1.5,
      z: 0,
    }

  },
  maps: {
    arm: null,
    env: null,
  },
  enable: {
    bloom: false,
    SSR: false,
    SSAO: true,
    FXAA: false
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


// Controls
function initControl() {
  control = new OrbitControls(camera, canvas);
  control.enableDamping = true;
  control.rotateSpeed = speed*1000;
  control.maxDistance = 100;
  control.target = new THREE.Vector3(0, 0, 0);
  initTouch();
}

function initTouch() {
  control.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN
  }
}


/**
 * @summary Three.js Main ##############################################################################################
 */
function initThree (){


  initRenderer();

  initCamera();

  initScene();

  initCanvas();

  // initControl();

  initLight();

  initShadow();

  initGUI();

  // addPlane( scene );
  // addTestObjects( scene );

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


  const lightsMenu = new LightHelper( scene, gui );
  const cameraMenu = new CameraHelper( scene, camera, canvas, gui );
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
    renderer.render(scene, camera);
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
  ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
  scene.add( ambientLight );
}

// Shadow
function initShadow() {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
}

function backgroundFit( texture ) {
  const targetAspect = window.innerWidth / window.innerHeight;
  const imageAspect = texture.image.width / texture.image.height;
  const factor = imageAspect / targetAspect;
  scene.background.offset.x = factor > 1 ? (1 - 1 / factor) / 2 : 0;
  scene.background.repeat.x = factor > 1 ? 1 / factor : 1;
  scene.background.offset.y = factor > 1 ? 0 : (1 - factor) / 2;
  scene.background.repeat.y = factor > 1 ? 1 : factor;
}

/**
 * @summary Postprocessing #############################################################################################
 */
function initPost() {
  composer = new EffectComposer( renderer );

  // initSSR();

  // initSSAO();

  // initFXAA();

  // initBloom();

  let renderPass = new RenderPass( scene, camera );
  composer.addPass( renderPass );

  const postprocessing = new PostHelper( scene, composer, camera, renderer, gui);
  // composer.addPass( ssaoPass );
  // composer.addPass( ssrPass );
  // composer.addPass( bloomPass );
  composer.addPass( new ShaderPass( GammaCorrectionShader ));

  renderer.toneMapping = toneMappingOptions[ parameters.toneMapping ];

  composer.addPass( postprocessing.getFXAA() );
  // composer.addPass( fxaaPass );
}

// Bloom Effect
function initBloom() {
  bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, 4, 1);
  bloomPass.enabled = false;
}

// SSR Pass
function initSSR() {
  // composer = new EffectComposer( renderer );
  ssrPass = new SSRPass({
    renderer,
    scene,
    camera,
    width: innerWidth,
    height: innerHeight,
    // encoding: THREE.sRGBEncoding,
  })

  ssrPass.thickness = 0.1;
  ssrPass.infiniteThick = false;
  ssrPass.maxDistance = 5;
  ssrPass.opacity = 1;
  ssrPass.surfDist = 0.001;
}

// SSAO Pass
function initSSAO() {
  ssaoPass = new SSAOPass(
      scene,
      camera,
      innerWidth,
      innerHeight
  )
  ssaoPass.kernelRadius = 0.75;
  ssaoPass.minDistance = 0.00001;

  let customKernelSize = 32;

  ssaoPass.ssaoMaterial.defines[ 'KERNEL_SIZE' ] = customKernelSize;
  ssaoPass.kernelSize = customKernelSize;

  // Override Internal Kernel
  for ( let i = 0; i < (customKernelSize-32); i ++ ) {

    const sample = new Vector3();
    sample.x = ( Math.random() * 2 ) - 1;
    sample.y = ( Math.random() * 2 ) - 1;
    sample.z = Math.random();

    sample.normalize();

    let scale = i / (customKernelSize-32);
    scale = MathUtils.lerp( 0.1, 1, scale * scale );
    sample.multiplyScalar( scale );

    // ssaoPass.ssaoMaterial.uniforms[ 'kernel' ].value.push(sample);

  }

  // console.log(ssaoPass.kernelSize)
  // console.log(ssaoPass.kernel);
}

function initTAA() {
  taaPass = new TAARenderPass( scene, camera);
  taaPass.unbiased = false;
  taaPass.sampleLevel = 1;
}

function initFXAA() {
  fxaaPass = new ShaderPass( FXAAShader );
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

  settingGUI( gui, parameters, renderer, fxaaPass, ambientLight );

  gui.open();
}

const save = new function() {
  this.saveSettings = function () {
    console.log(parameters);
  }
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