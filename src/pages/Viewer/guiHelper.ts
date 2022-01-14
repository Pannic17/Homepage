// noinspection TypeScriptValidateJSTypes

import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';

export function settingGUI(gui: any, parameters: any, fxaaPass: any) {
    const settingGUI = gui.addFolder('Settings');
    settingGUI.add( parameters, 'intensity', 0, 1, 0.01).name('Light Intensity');
    settingGUI.add( parameters, 'enableFXAA').name('Enable FXAA').onChange(function (){
        fxaaPass.enabled = parameters.enableFXAA;
    });
    settingGUI.add( parameters, 'enableSSR').name('Enable Postprocssing');
}

export function ssrGUI(gui: any, parameters: any, ssrPass: any) {
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

export function ssaoGUI(gui: any, parameters: any, ssaoPass: any) {
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