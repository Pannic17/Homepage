// @ts-ignore
import * as THREE from 'three/';

export function initScene (){
    let canvas = document.getElementById('three-canvas');

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({antialias: true});
    const camera = new THREE.PerspectiveCamera(75, 16 / 9);
    renderer.setSize(window.innerWidth*.96, window.innerWidth*.54);
    // @ts-ignore
    canvas.appendChild( renderer.domElement );

    return {scene, camera, renderer}
}