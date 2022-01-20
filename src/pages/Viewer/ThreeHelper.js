import * as THREE from "three";
import {initRenderer, initCanvas, initStats, initAmbient, initScene, initShadow} from "./InitHelper";
import {settingGUI, toneMappingOptions} from "./GUIHelper";
import {CameraHelper} from "./CameraHelper";
import {LightHelper} from "./LightHelper";
import {PMREMGenerator} from "./Postproceesing/PMREMGenerator";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {RoughnessMipmapper} from "three/examples/jsm/utils/RoughnessMipmapper.js";
import {GUI} from "three/examples/jsm/libs/lil-gui.module.min";
import {saveAs} from 'file-saver';
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {PostHelper} from "./PostHelper";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {GammaCorrectionShader} from "three/examples/jsm/shaders/GammaCorrectionShader";

let scene, renderer, camera, composer;

class ThreeHelper {
    constructor( parameters, state) {
        this.initThree( parameters, state );
        window.addEventListener ( 'resize', this.onWindowResize );
        if (this.isMobile ()) {
            gui.close ();
        }
        this.state = state
    }



    initThree ( parameters, state ){
        let _this = this;
        if ( !parameters || (parameters === {}) ){
            console.log('Use Preset')
            parameters = PRESET;
        }
        renderer = initRenderer();
        this.renderer = renderer
        this.canvas = initCanvas(this.renderer);
        this.stats = initStats();
        this.canvas.appendChild( this.stats.dom );
        scene = initScene();
        console.log(scene);
        this.scene = scene
        this.ambient = initAmbient( parameters );
        this.scene.add( this.ambient );
        initShadow( this.renderer );
        this.initGUI( parameters );

        // addPlane( scene );
        // addTestObjects( scene );
        this.complex = new CameraHelper( this.scene, this.canvas, this.gui, parameters );
        camera = this.complex.getCamera();
        this.camera = camera
        this.control = this.complex.getControl();
        this.lights = new LightHelper( this.scene, this.gui, parameters );

        this.initPost( parameters );

        console.log('Scene Loaded')

        this.pmrem = new PMREMGenerator( this.renderer );

        new RGBELoader()
            .load( parameters.hdrPath, function ( texture ) {
                // texture.mapping = THREE.EquirectangularReflectionMapping;
                _this.hdr = texture;
                let hdrTexture = _this.pmrem.fromEquirectangular(texture, parameters.hdrAngle ).texture
                _this.scene.environment = hdrTexture;
                // scene.background = hdrTexture;
                _this.scene.fog = new THREE.Fog(0xaaaaaa, 200, 1000);
                _this.pmrem.compileEquirectangularShader();
                const roughnessMipmapper = new RoughnessMipmapper( _this.renderer );
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
                            _this.object = new THREE.Group();
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
                                    _this.object.add( child );
                                }
                            })
                            _this.object.rotation.y = (parameters.rotation + 180) * Math.PI / 180;
                            scene.add(_this.object);
                            roughnessMipmapper.dispose();
                            console.log('Fully Loaded');
                            state.loaded = false
                            animate();
                        },
                        function (xhr) { console.log("Model " + (xhr.loaded / xhr.total * 100) + '% Loaded'); },
                        function (error) { console.log('An error happened'); }
                    );
                }
                _this.pmrem.dispose();
            });

        function animate() {
            if ( parameters.autoPlay ){
                _this.object.rotation.y += 0.01;
                let degree = (_this.object.rotation.y * 180 / Math.PI) % 360 - 180;
                parameters.rotation = degree;
                // console.log(degree)
            }
            if ( parameters.enablePostprocessing ){
                // console.log(_this.composer)
                _this.composer.render();
            } else {
                _this.renderer.render( _this.scene, _this.camera );
            }
            requestAnimationFrame(animate);
            _this.renderer.toneMappingExposure = parameters.hdrExposure;
            _this.stats.update();
        }
    }

    initPost( parameters ) {
        let _this = this;
        const renderSetting = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            type: THREE.FloatType
        };
        const renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderSetting );
        renderTarget.texture.name = 'EffectComposer.rt1';
        composer = new EffectComposer( _this.renderer, renderTarget );
        this.composer = composer

        _this.renderer.toneMapping = toneMappingOptions[ parameters.toneMapping ];

        let renderPass = new RenderPass( _this.scene, _this.camera );
        _this.composer.addPass( renderPass );

        const postprocessing = new PostHelper( _this.scene, _this.composer, _this.camera, _this.renderer, _this.gui, parameters );

        _this.composer.addPass( new ShaderPass( GammaCorrectionShader ) );
        // composer.addPass( postprocessing.getFXAA() );
        // composer.addPass( postprocessing.getSSAA() );
        _this.composer.addPass( postprocessing.getSMAA() );
    }

    initGUI( parameters ) {
        let _this = this;
        this.gui = new GUI();
        let button = {
            'setting': saveSetting,
            'reset': resetObject,
            'rotation': parameters.rotation
        }
        function saveSetting() {
            _this.complex.logCamera( parameters, _this.camera, _this.control );
            button.rotation = parameters.rotation;
            _this.save2JSON( parameters );
        }
        function resetObject() {
            parameters.rotation = button.rotation;
            _this.object.rotation.y = (button.rotation + 180) * Math.PI / 180;
        }

        const controlGUI = _this.gui.addFolder('Control');
        controlGUI.add( parameters, 'autoPlay').name('Auto Play');
        controlGUI.add( parameters, 'rotation', -180, 180).name('Y-Axis Rotation').onChange(
            function (value) {
                _this.object.rotation.y = ( value + 180 ) * Math.PI / 180;
            }
        ).listen();
        controlGUI.add( button, 'setting').name('Save Settings');
        controlGUI.add( button, 'reset').name('Reset Object');
        controlGUI.add( parameters, 'hdrAngle', -360, 360).name('HDR Angle').onChange(
            function (value) {
                let radians = value * Math.PI / 180
                let hdrTexture = _this.pmrem.fromEquirectangular( _this.hdr, radians ).texture;
                _this.scene.environment = hdrTexture;
                // scene.background = hdrTexture;
            }
        );

        settingGUI( this.gui, parameters, this.renderer, this.ambient );

        _this.gui.open();
    }

    save2JSON( parameters ) {
        let data = JSON.stringify(parameters, undefined, 4);
        let bolb = new Blob([data], {type: 'text/json'});
        saveAs( bolb, "parameters.json" );
    }

    onWindowResize() {
        let focalLength = camera.getFocalLength();
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.setFocalLength(focalLength);
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        composer.setSize( window.innerWidth, window.innerHeight );
        // backgroundFit( background );
    }

    isMobile() {
        return navigator.userAgent.match (/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
    }

    backgroundFit( texture ) {
        const targetAspect = window.innerWidth / window.innerHeight;
        const imageAspect = texture.image.width / texture.image.height;
        const factor = imageAspect / targetAspect;
        scene.background.offset.x = factor > 1 ? (1 - 1 / factor) / 2 : 0;
        scene.background.repeat.x = factor > 1 ? 1 / factor : 1;
        scene.background.offset.y = factor > 1 ? 0 : (1 - factor) / 2;
        scene.background.repeat.y = factor > 1 ? 1 : factor;
    }
}

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

export { ThreeHelper };
