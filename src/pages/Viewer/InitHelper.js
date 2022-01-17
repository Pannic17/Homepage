import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";

export function initRenderer() {
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.physicallyCorrectLights = true;
    /**
     * @function Gamma
     * DISCARD -> UNAVAILABLE
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
     */
    return renderer;
}

export function initCanvas( renderer ) {
    const canvas = document.getElementById('three-canvas');
    let child = canvas.lastElementChild;
    while (child) {
        canvas.removeChild(child);
        child = canvas.lastElementChild;
    }
    canvas.appendChild( renderer.domElement );
    return canvas;
}

export function initStats() {
    return new Stats();
}

export function initCamera() {
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 1000 );
    camera.position.set( 0, -1, -15 );
    camera.lookAt( 0, -1.5 ,0 );
    return camera;
}

export function initScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    // scene.fog = new THREE.Fog( 0x443333, 1, 4 );
    return scene;
}

export function initAmbient() {
    return new THREE.AmbientLight( 0xffffff, 0.2 );
}

export function initShadow( renderer ) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
}