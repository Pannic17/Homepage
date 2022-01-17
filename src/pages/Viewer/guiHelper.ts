// noinspection TypeScriptValidateJSTypes
import * as THREE from 'three/';

export function settingGUI( gui: any, parameters: any, renderer: any, ambientLight: any ) {
    const settingGUI = gui.addFolder('Settings');
    // settingGUI.add( parameters, 'intensity', 0, 1, 0.01).name('Light Intensity');
    ambientLightGUI( settingGUI, ambientLight );
    settingGUI.add( parameters, 'exposure', 0, 2, 0.01).name('HDR Exposure');
    settingGUI.add( parameters, 'enablePostprocessing').name('Postprocssing');
    toneMappingGUI( settingGUI, parameters, renderer );
}

export function ambientLightGUI( gui: any, ambientLight: any) {
    gui.add( ambientLight, 'intensity', 0, 10, 0.01).name('Ambient Intensity');
}

export const toneMappingOptions = {
    None: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
};

export function toneMappingGUI( gui: any, parameters: any, renderer: any ) {
    gui.add( parameters, 'toneMapping',
        Object.keys(toneMappingOptions)
    ).onChange( function () {
        renderer.toneMapping = toneMappingOptions[ parameters.toneMapping ];
    }).name('Tone Mapping');
}