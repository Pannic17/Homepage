import * as THREE from "three/";
import { MathUtils, Vector3 } from "three";
// Postprocessing
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
// Shader
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
// Pass
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { TAARenderPass } from "three/examples/jsm/postprocessing/TAARenderPass.js";
// Customize
import { SSRPass } from "./SSRPass";
import { SSAOPass } from "./SSAOPass";

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
            FXAA: false
        }

        this.passes = []

        this.fxaa = this.initFXAA();
        this.composer.addPass( this.initSSAO() );
        this.composer.addPass( this.initSSR() );
        this.composer.addPass( this.initBloom() );
    }

    initBloom() {
        let bloomPass = new UnrealBloomPass(
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

    initSSR() {
        let renderer = this.renderer;
        let scene = this.scene;
        let camera = this.camera;
        let ssrPass = new SSRPass({
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
        let scene = this.scene;
        let camera = this.camera;
        let ssaoPass = new SSAOPass(
            scene,
            camera,
            innerWidth,
            innerHeight
        )
        ssaoPass.enabled = this.enable.SSAO;
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

    initTAA() {
        let taaPass = new TAARenderPass( scene, camera);
        taaPass.unbiased = false;
        taaPass.sampleLevel = 1;
        return taaPass
    }

    initFXAA() {
        const _this = this
        let fxaaPass = new ShaderPass( FXAAShader );
        this.gui.add( this.enable, 'FXAA').name('Enable FXAA').onChange(function (){
            fxaaPass.enabled = _this.enable.FXAA;
        });
        this.passes.push( fxaaPass );
        return fxaaPass;
    }

    getFXAA (){
        return this.fxaa;
    }
}

export { PostHelper };