import * as THREE from "three/";
import {MathUtils, Vector3} from "three";
// Postprocessing
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass';
// Shader
import {FXAAShader} from "three/examples/jsm/shaders/FXAAShader.js";
// Pass
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
import {SSAARenderPass} from './Postproceesing/SSAAPass';
// Customize
import {SSRPass} from "./Postproceesing/SSRPass";
import {SSAOPass} from "./Postproceesing/SSAOPass";
import {SMAAPass} from "three/examples/jsm/postprocessing/SMAAPass";

class PostHelper {
    constructor ( scene, composer, camera, renderer, gui ) {
        this.scene = scene;
        this.composer = composer;
        this.renderer = renderer;
        this.camera = camera;
        this.gui = gui.addFolder('Postprocessing').close();
        this.enable = {
            BLOOM: false,
            SSR: false,
            SSAO: true,
            FXAA: false,
            SSAA: false,
            SMAA: false,
            MSAA: false,
        }

        this.composer.setPixelRatio( 1 );
        this.passes = []

        this.aa = this.gui.addFolder('Anti-Aliasing');
        this.fxaa = this.initFXAA();
        this.smaa = this.initSMAA();
        this.ssaa = this.initSSAA();
        this.composer.addPass( this.ssaa );
        this.composer.addPass( this.initSSAO() );
        this.composer.addPass( this.initSSR() );
        this.composer.addPass( this.initBloom() );
    }

    initBloom() {
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, 4, 1);
        bloomPass.enabled = this.enable.BLOOM;
        this.passes.push( bloomPass );
        this.bloomGUI( bloomPass );
        return bloomPass;
    }

    bloomGUI( bloomPass ) {
        const _this = this;
        const bloomGUI = this.gui.addFolder('Bloom Setting').close();
        bloomGUI.add( this.enable, 'BLOOM').name('Enable Bloom').onChange(function (){
            bloomPass.enabled = _this.enable.BLOOM;
        });
        bloomGUI.add( bloomPass, 'strength', 0, 3, 0.002).name('Strength');
        bloomGUI.add( bloomPass, 'radius', 0, 10, 0.01).name('Radius');
        bloomGUI.add( bloomPass, 'threshold', 0, 1, 0.001).name('Threshold');
    }

    /**
     * @summary Screen-Space ###########################################################################################
     */
    initSSR() {
        const renderer = this.renderer;
        const scene = this.scene;
        const camera = this.camera;
        const ssrPass = new SSRPass({
            renderer,
            scene,
            camera,
            width: innerWidth,
            height: innerHeight,
        })
        ssrPass.enabled = this.enable.SSR;
        ssrPass.thickness = 0.1;
        ssrPass.infiniteThick = false;
        ssrPass.maxDistance = 5;
        ssrPass.opacity = 1;
        // noinspection JSUndefinedPropertyAssignment
        ssrPass.surfDist = 0.001;
        this.passes.push( ssrPass );
        this.ssrGUI( ssrPass );
        return ssrPass;
    }

    ssrGUI( ssrPass ) {
        const _this = this;
        const ssrGUI = this.gui.addFolder('SSR Setting').close();
        ssrGUI.add( this.enable, 'SSR').name('Enable SSR').onChange(function (){
            ssrPass.enabled = _this.enable.SSR;
        })
        ssrGUI.add( ssrPass, 'output', {
            'Default': SSRPass.OUTPUT.Default,
            'SSR Only': SSRPass.OUTPUT.SSR,
            'Depth': SSRPass.OUTPUT.Depth,
            'Normal': SSRPass.OUTPUT.Normal,
            'Metalness': SSRPass.OUTPUT.Metalness,
            'Roughness': SSRPass.OUTPUT.Roughness,
        }).onChange( function(value) {
            ssrPass.output = parseInt( value );
        }).name('Output Mode');
        ssrGUI.add( ssrPass, 'maxDistance', 0, 5, 0.2).name('Max Distance');
        ssrGUI.add( ssrPass, 'opacity', 0, 1, 0.01).name('Opacity');
        ssrGUI.add( ssrPass, 'surfDist', 0, 0.002, 0.0001).name('Surface Distance');
    }

    initSSAO() {
        const ssaoPass = new SSAOPass(
            this.scene,
            this.camera,
            innerWidth,
            innerHeight
        )
        ssaoPass.renderToScreen = true;
        ssaoPass.enabled = this.enable.SSAO;
        ssaoPass.kernelRadius = 0.75;
        ssaoPass.minDistance = 0.00001;

        const customKernelSize = 32;

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
            ssaoPass.ssaoMaterial.uniforms[ 'kernel' ].value.push(sample);
        }

        this.passes.push( ssaoPass );
        this.ssaoGUI( ssaoPass );
        return ssaoPass;

    }

    ssaoGUI( ssaoPass ) {
        const _this = this;
        const ssaoGUI = this.gui.addFolder('SSAO Setting').close();
        ssaoGUI.add( this.enable, 'SSAO').name('Enable SSAO').onChange(function (){
            ssaoPass.enabled = _this.enable.SSAO;
        })
        ssaoGUI.add( ssaoPass, 'output', {
            'Default': SSAOPass.OUTPUT.Default,
            'SSAO Only': SSAOPass.OUTPUT.SSAO,
            'SSAO Only + Blur': SSAOPass.OUTPUT.Blur,
            'Beauty': SSAOPass.OUTPUT.Beauty,
            'Depth': SSAOPass.OUTPUT.Depth,
            'Normal': SSAOPass.OUTPUT.Normal
        }).onChange( function (value) {
            ssaoPass.output = parseInt( value );
        }).name('Output Mode');
        ssaoGUI.add( ssaoPass, 'kernelRadius', 0, 5, 0.001).name('Kernel Radius');
        ssaoGUI.add( ssaoPass, 'minDistance', 0.000001, 0.00002).name('Min Distance');
        ssaoGUI.add( ssaoPass, 'maxDistance', 0.000002, 0.001).name('Max Distance');
        ssaoGUI.add( ssaoPass, 'contrast', 0, 2).name('Level');
    }


    /**
     * @summary Anti-Aliasing ##########################################################################################
     */
    initFXAA() {
        const _this = this;
        const fxaaPass = new ShaderPass( FXAAShader );
        fxaaPass.enabled = this.enable.FXAA;
        this.aa.add( this.enable, 'FXAA').name('Enable FXAA').onChange(function (){
            fxaaPass.enabled = _this.enable.FXAA;
        });
        this.passes.push( fxaaPass );
        return fxaaPass;
    }

    getFXAA() {
        return this.fxaa;
    }

    initSMAA() {
        const _this = this;
        const smaaPass = new SMAAPass(
            window.innerWidth * this.renderer.getPixelRatio(),
            window.innerHeight * this.renderer.getPixelRatio()
        )
        this.aa.add( this.enable, 'SMAA').name('Enable SMAA').onChange(function (){
            smaaPass.enabled = _this.enable.SMAA;
        })
        this.passes.push( smaaPass );
        return smaaPass;
    }

    getSMAA() {
        return this.smaa;
    }

    initSSAA() {
        const _this = this;
        const _attr = {
            sampleLevel: 4,
            unbiased: true,
        }
        const ssaaPass = new SSAARenderPass( this.scene, this.camera );
        ssaaPass.enabled = this.enable.SSAA;
        this.aa.add( this.enable, 'SSAA').name('Enable SSAA').onChange(function (){
            ssaaPass.enabled = _this.enable.SSAA;
        });
        this.aa.add( _attr, "unbiased").onChange(function (){
            ssaaPass.unbiased = _attr.unbiased;
        }).name('Unbiased');
        this.aa.add( _attr, 'sampleLevel', {
            'Level 0: 1 Sample': 0,
            'Level 1: 2 Samples': 1,
            'Level 2: 4 Samples': 2,
            'Level 3: 8 Samples': 3,
            'Level 4: 16 Samples': 4,
            'Level 5: 32 Samples': 5
        }).onChange(function (){
            ssaaPass.sampleLevel = _attr.sampleLevel;
        }).name('Sample Level');

        const ssaaFormat = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            type: THREE.FloatType
        };
        ssaaPass.sampleRenderTarget = new THREE.WebGLRenderTarget ( window.innerWidth, window.innerHeight, ssaaFormat);

        this.passes.push( ssaaPass );
        return ssaaPass;
    }

    getSSAA(){
        return this.ssaa;
    }
}

export { PostHelper };