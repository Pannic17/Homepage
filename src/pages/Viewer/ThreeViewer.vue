<template>
  <body>
    <div id="three-canvas"></div>
  </body>
</template>

<script setup>
// Vue
import * as THREE from 'three/';
import { onMounted } from "vue";
import { settingGUI, ssrGUI, ssaoGUI } from "./guiHelper";
import { addPlane } from "./debugHelper";
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
import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';
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


/*
Global Variables
 */
let scene, camera, renderer, canvas, obj;
let control, gui, stats;
// For customized touch events
let startX, startY, startZoom, startDist;
let speed = 0.001;
// Light;
let pointLight, ambientLight, dirLight, hemiLight, spotLight;
// Postprocessing
let composer;
let ssrPass, ssaoPass, groundGeometry, groundReflector;
let taaPass, fxaaPass;
let bloomPass, filmEffect;

// Global Variable for Three.js
let parameters = {
  envMap: 'HDR',
  autoPlay: false,
  enableSSR: true,
  darkenSSR: false,
  enableFXAA: false,
  enableBloom: true,
  enableFilm: true,
  exposure: 1.0,
  cameraPos: {
    x: 0,
    y: 2,
    z: -15,
  },
  cameraAt: {
    x: 0,
    y: 0,
    z: 0,
  },
  maps: {
    arm: null,
  },
  light: {
    intensity: 1,
    x: 3,
    y: 12,
    z: 17,
    shadow: {
      near: 0.1,
      far: 500,
      right: 17,
      left: -17,
      top: 17,
      bottom: -17,
      radius: 4,
      bias: -0.0005,
      blurSamples: 8
    }
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
   * @function Tone Mapping
   * @function Gamma
   * UNEXPOSED -> Alter
   */
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

  initControl();

  // touchListener();
  // touchListenerHelper()

  initLight();

  initShadow();

  // initObject();
  // initMesh();
  addPlane(scene);


  initPost();



  new RGBELoader()
    .load('/hdr/club.hdr', function ( texture ) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
      scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

      const roughnessMipmapper = new RoughnessMipmapper( renderer );

      const loader = new GLTFLoader();
      loader.load(
          '/model/owl_gltf/1.gltf',
          function (gltf) {
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
                /**
                 * @function View ARM
                 * DISCARD -> RECONSTRUCT
                 * realized in reload
                parameters.maps.arm = child.material.aoMap;
                let viewMaterial = new THREE.MeshPhongMaterial({
                  color: 0xff0000,
                  map: parameters.maps.arm
                })
                let viewMesh = new THREE.Mesh(child.geometry, viewMaterial);
                scene.add(viewMesh);
                 */
              }
            })
            obj = gltf.scene;
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

/**
 * @summary Animation ##################################################################################################
 */
// Animation
function animate() {
  if (parameters.autoPlay){
    obj.rotation.y += 0.01;
  }
  if (parameters.enableSSR){
    composer.render();
    // console.log(parameters.enableSSR);
  } else {
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
  update()
  stats.update();
}

// Update on Change
function update() {
  renderer.toneMappingExposure = parameters.exposure

  dirLight.position.set( parameters.light.x, parameters.light.y, parameters.light.z );
  dirLight.intensity = parameters.light.intensity;
  dirLight.castShadow = true;
  dirLight.shadow.camera.near = parameters.light.shadow.near;
  dirLight.shadow.camera.far = parameters.light.shadow.far;
  dirLight.shadow.camera.right = parameters.light.shadow.right;
  dirLight.shadow.camera.left = - parameters.light.shadow.left;
  dirLight.shadow.camera.top	= parameters.light.shadow.top;
  dirLight.shadow.camera.bottom = parameters.light.shadow.bottom;
  dirLight.shadow.mapSize.width = 512;
  dirLight.shadow.mapSize.height = 512;
  dirLight.shadow.radius = parameters.light.shadow.radius;
  dirLight.shadow.bias = - 0.0005;
  dirLight.shadow.blurSamples = parameters.light.shadow.blurSamples;
  /**
   * @function Toggle Camera
   * UNEXPOSED -> Debugger
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
  // scene.add( ambientLight );

  dirLight = new THREE.DirectionalLight( 0xffffff );
  dirLight.position.set( 3, 12, 17 );
  dirLight.castShadow = true;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 500;
  dirLight.shadow.camera.right = 17;
  dirLight.shadow.camera.left = - 17;
  dirLight.shadow.camera.top	= 17;
  dirLight.shadow.camera.bottom = - 17;
  dirLight.shadow.mapSize.width = 512;
  dirLight.shadow.mapSize.height = 512;
  dirLight.shadow.radius = 4;
  dirLight.shadow.bias = - 0.0005;
  dirLight.shadow.blurSamples = 8;
  scene.add( dirLight );

  hemiLight = new THREE.HemisphereLight( 0x443333, 0x111122 );
  // scene.add( hemiLight );

  spotLight = new THREE.SpotLight();
  spotLight.angle = Math.PI / 16;
  spotLight.penumbra = 0.5;
  // spotLight.castShadow = true;
  spotLight.position.set( - 1, 1, 1 );
  // scene.add( spotLight );
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

  initSSR();

  let renderPass = new RenderPass( scene, camera );

  initSSAO();

  // composer.addPass( ssaoPass );
  composer.addPass( renderPass );
  // composer.addPass( ssrPass );
  composer.addPass( ssaoPass );
  composer.addPass(new ShaderPass(GammaCorrectionShader));

  // initTAA()
  initFXAA();
  // composer.addPass( taaPass );
  // composer.addPass( fxaaPass );

  /**
   * @function Bloom Effect
   * UNEXPOSED -> Add & Alter
  #### Bloom Effect ####
  bloomPass = new UnrealBloomPass( new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 4, 1);
  composer.addPass( bloomPass );
   */
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
  ssrPass.maxDistance = 25;
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

  console.log(ssaoPass.kernelSize)
  console.log(ssaoPass.kernel);
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

  settingGUI(gui, parameters, fxaaPass);

  // ssrGUI(gui, parameters, ssrPass);

  // ssaoGUI(gui, parameters, ssaoPass);

  const lightGUI = gui.addFolder('Light Setting');
  lightGUI.add( parameters.light, 'intensity', 0, 1, 0.01);
  lightGUI.add( parameters.light, 'x', -5, 5, 0.01);
  lightGUI.add( parameters.light, 'y', -20, 20, 0.01);
  lightGUI.add( parameters.light, 'z', -20, 20, 0.01);
  lightGUI.add( parameters.light.shadow, 'near', 0, 0.5, 0.001);
  lightGUI.add( parameters.light.shadow, 'far', 10, 500, 1);
  lightGUI.add( parameters.light.shadow, 'right', -10, 50, 0.01);
  lightGUI.add( parameters.light.shadow, 'left', -50, 10, 0.01);
  lightGUI.add( parameters.light.shadow, 'top', -10, 50, 0.01);
  lightGUI.add( parameters.light.shadow, 'bottom', -50, 10, 0.01);
  lightGUI.add( parameters.light.shadow, 'radius', 1, 10, 0.01);
  lightGUI.add( parameters.light.shadow, 'blurSamples', 1, 10, 1);


  /**
   * @function Toggle Camera
   * UNEXPOSED -> Debugger
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
  window.createImageBitmap = undefined; // Fix iOS Bug
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