// noinspection TypeScriptValidateJSTypes
import * as THREE from 'three/';
import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';

export function settingGUI( gui: any, parameters: any, fxaaPass: any ) {
    const settingGUI = gui.addFolder('Settings');
    // settingGUI.add( parameters, 'intensity', 0, 1, 0.01).name('Light Intensity');
    settingGUI.add( parameters, 'exposure', 0, 2, 0.01).name('HDR Exposure');
    settingGUI.add( parameters, 'enableFXAA').name('Enable FXAA').onChange(function (){
        fxaaPass.enabled = parameters.enableFXAA;
    });
    settingGUI.add( parameters, 'enableSSR').name('Enable Postprocssing');
}

export function ssrGUI( gui: any, parameters: any, ssrPass: any ) {
    const ssrGUI = gui.addFolder('SSR Setting');

    ssrGUI.add( ssrPass, 'output', {
        'Default': SSRPass.OUTPUT.Default,
        'SSR Only': SSRPass.OUTPUT.SSR,
        'Beauty': SSRPass.OUTPUT.Beauty,
        'Depth': SSRPass.OUTPUT.Depth,
        'Normal': SSRPass.OUTPUT.Normal,
        'Metalness': SSRPass.OUTPUT.Metalness,
    }).onChange( function(value: any) {
        ssrPass.output = parseInt( value );
    }).name('Output Mode');
    ssrGUI.add( ssrPass, 'maxDistance', 0, 20, 0.2).name('Max Distance');
    ssrGUI.add( ssrPass, 'opacity', 0, 1, 0.01).name('Opacity');
    ssrGUI.add( ssrPass, 'surfDist', 0, 0.002, 0.0001).name('Surface Distance');
}

export function ssaoGUI( gui: any, parameters: any, ssaoPass: any ) {
    const ssaoGUI = gui.addFolder('SSAO Setting');
    ssaoGUI.add( ssaoPass, 'output', {
        'Default': SSAOPass.OUTPUT.Default,
        'SSAO Only': SSAOPass.OUTPUT.SSAO,
        'SSAO Only + Blur': SSAOPass.OUTPUT.Blur,
        'Beauty': SSAOPass.OUTPUT.Beauty,
        'Depth': SSAOPass.OUTPUT.Depth,
        'Normal': SSAOPass.OUTPUT.Normal
    }).onChange( function (value: any) {
        ssaoPass.output = parseInt( value );
    }).name('Output Mode');
    ssaoGUI.add( ssaoPass, 'kernelRadius', 0, 5, 0.001).name('Kernel Radius');
    ssaoGUI.add( ssaoPass, 'minDistance', 0.00001, 0.0002).name('Min Distance');
    ssaoGUI.add( ssaoPass, 'minDistance', 0.0002, 3).name('Max Distance');
}

export function lightGUI( gui: any, parameters: any ) {
    const lightGUI = gui.addFolder('Directional Light Setting');
    lightGUI.add( parameters.light, 'intensity', 0, 10, 0.01).name('Light Intensity');
    lightGUI.add( parameters.light, 'r', 0, 50, 0.01).name('Rotate Radius');
    lightGUI.add( parameters.light, 'a', -360, 360, 0.5).name('Rotate Angle');
    lightGUI.add( parameters.light, 'h', 1, 20, 0.01).name('Light Height');
    lightGUI.add( parameters.light.shadow, 'near', 0, 0.5, 0.001).name('Shadow Near');
    lightGUI.add( parameters.light.shadow, 'far', 10, 500, 1).name('Shadow Far');
    lightGUI.add( parameters.light.shadow, 'radius', 1, 10, 0.01).name('Shadow Radius');
    lightGUI.add( parameters.light.shadow, 'blurSamples', 1, 10, 1).name('Shadow Blur Samples');
}

export function lightUpdate( dirLight: any, parameters: any ) {
    // dirLight.position.set( parameters.light.x, parameters.light.y, parameters.light.z );
    let x = parameters.light.r * Math.cos( parameters.light.a * Math.PI / 180);
    let z = parameters.light.r * Math.sin( parameters.light.a * Math.PI / 180);
    dirLight.position.set( x, parameters.light.h, z);
    dirLight.intensity = parameters.light.intensity;
    dirLight.shadow.camera.near = parameters.light.shadow.near;
    dirLight.shadow.camera.far = parameters.light.shadow.far;
    dirLight.shadow.radius = parameters.light.shadow.radius;
    dirLight.shadow.blurSamples = parameters.light.shadow.blurSamples;
}

export function lightLog( dirLight: any, parameters: any ) {
    let x = parameters.light.r * Math.cos( parameters.light.a * Math.PI / 180);
    let z = parameters.light.r * Math.sin( parameters.light.a * Math.PI / 180);
    console.log('### Directional Light Settings\n' +
        'x: ' + x + ';\n' +
        'y: ' + parameters.light.h + ';\n' +
        'z: ' + z + ';\n' +
        'radius: ' + parameters.light.r + ';\n' +
        'angle: ' + parameters.light.a + ';\n' +
        'intensity: ' + parameters.light.intensity + ';\n' +
        'shadow radius: ' + parameters.light.shadow.radius + ';\n' +
        'shadow sample: ' + parameters.light.shadow.blurSamples + ';'
    )
}

export function cameraGUI( gui: any, parameters: any ) {
    const cameraGUI = gui.addFolder('Camera Setting');
    const cameraPos = cameraGUI.addFolder('Camera Position')
    cameraPos.add( parameters.camera.position, 'x', -25, 25, 0.5);
    cameraPos.add( parameters.camera.position, 'y', -25, 25, 0.5);
    cameraPos.add( parameters.camera.position, 'z', -25, 25, 0.5);
    const cameraAt = cameraGUI.addFolder("Camera Look At")
    cameraAt.add( parameters.camera.lookAt, 'x', -5, 5, 0.05);
    cameraAt.add( parameters.camera.lookAt, 'y', -5, 5, 0.05);
    cameraAt.add( parameters.camera.lookAt, 'z', -5, 5, 0.05);
}

export function cameraUpdate( camera: any, parameters: any ) {
    camera.position.set( parameters.camera.position.x, parameters.camera.position.y, parameters.camera.position.z );
    camera.lookAt( parameters.camera.lookAt.x, parameters.camera.lookAt.y, parameters.camera.lookAt.z );
}

export function cameraLog( camera: any, parameters: any ) {
    console.log('### Camera Settings\n' +
        'Position --- ' +
        'x: ' + parameters.camera.position.x + '; ' +
        'y: ' + parameters.camera.position.y + '; ' +
        'z: ' + parameters.camera.position.z + '; ' + '\n' +
        'Look At --- ' +
        'x: ' + parameters.camera.lookAt.x + '; ' +
        'y: ' + parameters.camera.lookAt.y + '; ' +
        'z: ' + parameters.camera.lookAt.z + '; '
    )
}

export const toneMappingOptions = {
    None: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
};

export function toneMappingGUI( gui: any, parameters: any, renderer: any) {
    gui.add( parameters, 'toneMapping',
        Object.keys(toneMappingOptions)
    ).onChange( function () {
        renderer.toneMapping = toneMappingOptions[ parameters.toneMapping ];
    }).name('Tone Mapping');
}