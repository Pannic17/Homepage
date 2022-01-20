<template>
    <body>
        <div id="three-canvas"></div>
        <!--suppress HtmlUnknownTarget -->
        <img class="background" src="/image/shooting_star.jpg" alt="" />
        <div class="loading" v-if="state.loaded">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
        </div>
        <div class="overlay" v-if="state.loaded"></div>
    </body>
</template>

<script setup>


</script>


<script>
// Vue
import * as THREE from 'three/';
import {getCurrentInstance, onMounted, onUnmounted, reactive, ref, watch} from "vue";
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
import {
initRenderer,
    initCanvas,
    initStats,
    initScene,
    initAmbient,
    initShadow
} from "./InitHelper";
import { LightHelper } from "./LightHelper";
import { CameraHelper } from './CameraHelper';
import { PostHelper } from "./PostHelper";
import { MeshHelper } from "./MeshHelper";
// import { PMREMGenerator } from "three";
import { PMREMGenerator } from "./Postproceesing/PMREMGenerator";

import { saveAs } from 'file-saver';
import axios from "axios";

const PRESET = {
    modelPath: '/model/owl_gltf/1.gltf',
    hdrPath: '/hdr/xmas.hdr',
    bgPath: null,
    rotation: 0,
    hdrAngle: 0,
    autoPlay: false,
    ambientIntensity: 0.2,
    hdrExposure: 1.0,
    enablePostprocessing: true,
    toneMapping: 'ACESFilmic',
    maps: {
        arm: null,
        env: null,
    },
    postprocessing: {
        "enable": {
            "BLOOM": false,
            "SSR": true,
            "SSAO": true,
            "FXAA": false,
            "SMAA": false,
            "SSAA": true,
            "SHARP": true,
        },
        "SSAA": {
            "sampleLevel": 3,
            "unbiased": true
        },
        "BLOOM": {
            "strength": 1.5,
            "radius": 4,
            "threshold": 1
        },
        "SSAO": {
            "output": 0,
            "kernelRadius": 0.75,
            "minDistance": 0.00001,
            "maxDistance": 0.001,
            "contrast": 1
        },
        "SSR": {
            "output": 0,
            "thickness": 0.1,
            "maxDistance": 3,
            "opacity": 1,
            "surfDist": 0.001
        },
        "SHARP": {
            "intensity": 0.1
        }
    },
    "camera": {
        "position": {
            "x": 0,
            "y": -1,
            "z": -15
        },
        "rotation": {
            "x": 0,
            "y": 0,
            "z": 0
        },
        "lookAt": {
            "x": 0,
            "y": -1.5,
            "z": 0
        },
        "focalLength": 45
    }
}

// Global Variables
let scene, renderer, canvas;
let gui, stats;
let object, model;
let lights, control, complex, camera;
let ambient, background, pmrem, hdr;
let composer;


export default {
    name: "ThreeViewer",
    setup() {
        const state = reactive({ loaded: true });
        /**
         * @summary Three.js Main ##############################################################################################
         */
        function initThree ( parameters ){
            if ( !parameters || (parameters === {}) ){
                console.log('Use Preset')
                parameters = PRESET;
            }
            renderer = initRenderer();
            canvas = initCanvas( renderer );
            stats = initStats();
            canvas.appendChild( stats.dom );
            scene = initScene();
            ambient = initAmbient( parameters );
            scene.add( ambient );
            initShadow( renderer );
            initGUI( parameters );

            // addPlane( scene );
            // addTestObjects( scene );
            complex = new CameraHelper( scene, canvas, gui, parameters );
            camera = complex.getCamera();
            control = complex.getControl();
            lights = new LightHelper( scene, gui, parameters );

            initPost( parameters );

            console.log('Scene Loaded')

            pmrem = new PMREMGenerator( renderer );

            new RGBELoader()
                .load( parameters.hdrPath, function ( texture ) {
                    // texture.mapping = THREE.EquirectangularReflectionMapping;
                    hdr = texture;
                    let hdrTexture = pmrem.fromEquirectangular(texture, parameters.hdrAngle ).texture
                    scene.environment = hdrTexture;
                    // scene.background = hdrTexture;
                    scene.fog = new THREE.Fog(0xaaaaaa, 200, 1000);
                    pmrem.compileEquirectangularShader();
                    const roughnessMipmapper = new RoughnessMipmapper( renderer );
                    const backgroundLoader = new THREE.TextureLoader();
                    /**
                     * @function Background in Canvas
                     * DISCARD
                    backgroundLoader.load(
                        '/image/galaxy.jpg',
                        function ( texture ) {
                            background = texture;
                            // scene.background = background;
                            // backgroundFit( background );
                        });
                     */

                    const loader = new GLTFLoader();
                    if ( parameters.modelPath ){
                        loader.load(
                            parameters.modelPath,
                            function (gltf) {
                                object = new THREE.Group();
                                // let meshGUI = gui.addFolder('Meshes').close();
                                let index = 0;
                                gltf.scene.traverse( function (child) {
                                    if (child instanceof THREE.Mesh) {
                                        index += 1;
                                        console.log(child.material);
                                        roughnessMipmapper.generateMipmaps(child.material);
                                        child.castShadow = true;
                                        child.receiveShadow = true;
                                        child.material.aoIntensity = 0;
                                        child.material.aoMap = null;
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
                                        // const mesh = new MeshHelper( child, meshGUI, parameters, index );
                                        object.add( child );
                                    }
                                })
                                object.rotation.y = (parameters.rotation + 180) * Math.PI / 180;
                                scene.add(object);
                                roughnessMipmapper.dispose();
                                console.log('Fully Loaded');
                                state.loaded = false
                                animate();
                            },
                            function (xhr) { console.log("Model " + (xhr.loaded / xhr.total * 100) + '% Loaded'); },
                            function (error) { console.log('An error happened'); }
                        );
                    }
                    pmrem.dispose();
                });

            function animate() {
                if ( parameters.autoPlay ){
                    object.rotation.y += 0.01;
                    let degree = (object.rotation.y * 180 / Math.PI) % 360 - 180;
                    parameters.rotation = degree;
                    // console.log(degree)
                }
                if ( parameters.enablePostprocessing ){
                    composer.render();
                } else {
                    renderer.render( scene, camera );
                }
                requestAnimationFrame(animate);
                renderer.toneMappingExposure = parameters.hdrExposure;
                stats.update();
            }
        }


        /**
         * @summary Postprocessing #############################################################################################
         */
        function initPost( parameters ) {
            const renderSetting = {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.FloatType
            };
            const renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderSetting );
            renderTarget.texture.name = 'EffectComposer.rt1';
            composer = new EffectComposer( renderer, renderTarget );

            renderer.toneMapping = toneMappingOptions[ parameters.toneMapping ];

            let renderPass = new RenderPass( scene, camera );
            composer.addPass( renderPass );

            const postprocessing = new PostHelper( scene, composer, camera, renderer, gui, parameters );

            composer.addPass( new ShaderPass( GammaCorrectionShader ) );
            // composer.addPass( postprocessing.getFXAA() );
            // composer.addPass( postprocessing.getSSAA() );
            composer.addPass( postprocessing.getSMAA() );
        }


        /**
         * @summary Original GUI ###############################################################################################
         */
        function initGUI( parameters ) {
            gui = new GUI();
            let button = {
                'setting': saveSetting,
                'reset': resetObject,
                'rotation': parameters.rotation
            }
            function saveSetting() {
                complex.logCamera( parameters, camera, control );
                button.rotation = parameters.rotation;
                save2JSON( parameters );
            }
            function resetObject() {
                parameters.rotation = button.rotation;
                object.rotation.y = (button.rotation + 180) * Math.PI / 180;
            }

            const controlGUI = gui.addFolder('Control');
            controlGUI.add( parameters, 'autoPlay').name('Auto Play');
            controlGUI.add( parameters, 'rotation', -180, 180).name('Y-Axis Rotation').onChange(
                function (value) {
                    object.rotation.y = value * Math.PI / 180;
                }
            ).listen();
            controlGUI.add( button, 'setting').name('Save Settings');
            controlGUI.add( button, 'reset').name('Reset Object');
            controlGUI.add( parameters, 'hdrAngle', -360, 360).name('HDR Angle').onChange(
                function (value) {
                    let radians = value * Math.PI / 180
                    let hdrTexture = pmrem.fromEquirectangular( hdr, radians ).texture;
                    scene.environment = hdrTexture;
                    // scene.background = hdrTexture;
                }
            );

            settingGUI( gui, parameters, renderer, ambient );

            gui.open();
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
            // backgroundFit( background );
        }

        function isMobile() {
            return navigator.userAgent.match (/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
        }

        function clearAll( parent, child ){
            if( child.children && child.children.length ){
                let arr    = child.children.filter( x => x );
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

        function save2JSON( parameters ) {
            let data = JSON.stringify(parameters, undefined, 4);
            let bolb = new Blob([data], {type: 'text/json'});
            saveAs( bolb, "parameters.json" );
        }


        /**
         * @summary Vue Mount ##################################################################################################
         */
        async function getJSON(){
            let data;
            await axios.get('./test.json').then(
                ( res ) =>{
                    data = res.data;
                    },
                ( error ) => {
                    let status = ( error.response && error.response.status && error.response.status)
                    if ( status === 404 ){
                        data = null;
                        console.log('No Such File')
                    }
                }
            )
            return data
        }


        onMounted(async () => {
            window.createImageBitmap = undefined; // Fix iOS Bug
            let data = await getJSON();
            console.log( state.loaded );
            initThree();
            window.addEventListener ( 'resize', onWindowResize );
            if (isMobile ()) {
                gui.close ();
            }
        })

        onUnmounted(() => {
            console.log('UNMOUNTED')
            clearAll( scene, object );
            renderer.dispose();
            gui.destroy();
        })


        watch(
            () => state.loaded,
            () => {
                console.log('END LOADING');
            }
        )
        return { state }
    }
}
</script>

<style scoped lang="scss">
body{
    width: 100%;
    height: 100%;
    overflow: hidden;
}


#three-canvas{
    text-align: center;
}

.background{
    width: 100vw;
    height: 100vh;
    position: absolute;
    z-index: -1;
    left: 0;
    top: 0;
    object-fit: cover;
    user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
}

.loading{
    position: absolute;
    z-index: 1;
    left: 47vw;
    top: 40vh;
    width: 6vw;
    height: 6vh;
    text-align: center;

    div{
        background-color: #7ef6f2;
        height: 100%;
        width: 1vw;
        margin-right: 0.1vw;
        margin-left: 0.1vw;
        display: inline-block;

        -webkit-animation: stretchDelay 1.2s infinite ease-in-out;
        animation: stretchDelay 1.2s infinite ease-in-out;
    }
    .rect2 {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
    }
    .rect3 {
        -webkit-animation-delay: -1.0s;
        animation-delay: -1.0s;
    }
    .rect4 {
        -webkit-animation-delay: -0.9s;
        animation-delay: -0.9s;
    }
    .rect5 {
        -webkit-animation-delay: -0.8s;
        animation-delay: -0.8s;
    }
}

@-webkit-keyframes stretchDelay {
    0%, 40%, 100% {
        -webkit-transform: scaleY(0.4)
    }
    20% {
        -webkit-transform: scaleY(1.0)
    }
}

@keyframes stretchDelay {
    0%, 40%, 100% {
        transform: scaleY(0.4);
        -webkit-transform: scaleY(0.4);
    }
    20% {
        transform: scaleY(1.0);
        -webkit-transform: scaleY(1.0);
    }
}

.overlay{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #1d1d1d;
    opacity: 0.8;
}
</style>
