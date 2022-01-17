import * as THREE from "three/";
import { MathUtils, Vector3 } from "three";
// Postprocessing
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
// Shader
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
// Pass
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { TAARenderPass } from "three/examples/jsm/postprocessing/TAARenderPass.js";
// Customize
import { SSRPass } from "./SSRPass";


class PostHelper {
    constructor ( scene, composer, gui ) {
        this.scene = scene;
        this.composer = composer;
    }

    initBloom() {
        let bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, 4, 1);
        bloomPass.enabled = false;

        return bloomPass;
    }

    initSSR() {
        // composer = new EffectComposer( renderer );
        let ssrPass = new SSRPass({
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
        // noinspection JSUndefinedPropertyAssignment
        ssrPass.surfDist = 0.001;
        return ssrPass
    }

    initSSAO() {
        let ssaoPass = new SSAOPass(
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

            ssaoPass.ssaoMaterial.uniforms[ 'kernel' ].value.push(sample);

        }
        return ssaoPass
        // console.log(ssaoPass.kernelSize)
        // console.log(ssaoPass.kernel);
    }

    initTAA() {
        let taaPass = new TAARenderPass( scene, camera);
        taaPass.unbiased = false;
        taaPass.sampleLevel = 1;
        return taaPass
    }

    initFXAA() {
        let fxaaPass = new ShaderPass( FXAAShader );
    }
}

export { PostHelper };