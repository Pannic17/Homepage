// @ts-ignore
import * as THREE from 'three/';

export function initScene (){
    let canvas = document.getElementById('three-canvas');

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({antialias: true});
    const camera = new THREE.PerspectiveCamera(75, 16 / 9, 1);
    renderer.setSize(window.innerWidth*.96, window.innerWidth*.54);
    // @ts-ignore
    canvas.appendChild( renderer.domElement );

    return {scene, camera, renderer}
}

export function initLight (scene: THREE.Scene){
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0 , 200, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0,200,100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = - 100;
    dirLight.shadow.camera.left = - 120;
    dirLight.shadow.camera.right = 120;
    scene.add( dirLight );

    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );
}
