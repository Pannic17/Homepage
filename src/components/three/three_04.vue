<template>
    <body>
        <div id="three-canvas" style="width: 0.8vw; height: 0.45vw"></div>
    </body>
</template>


<script setup>
import * as THREE from 'three/';
import { onMounted } from "vue";
import { initScene} from "../ThreeInit";


let clock, renderer, scene, camera, point;
let portalParticles = [];
let smokeParticles = [];


function initThree (){
    let init = initScene();
    scene = init.scene;
    camera = init.camera;
    renderer = init.renderer;
    init.control.enabled = false;

    camera.position.z = 1000;
    camera.far = 10000;

    const light = new THREE.DirectionalLight(0xffffff,1);
    light.position.set(0,0,1);
    scene.add(light);

    point = new THREE.PointLight(0x062d89,30,350,1.7);
    point.position.set(0,0,250);
    scene.add(point);

    initParticle();
}

const initParticle = function (){
    let loader = new THREE.TextureLoader();
    loader.load("/image/smoke_3.png", function (texture){
        const portalGeo = new THREE.PlaneBufferGeometry(350, 350);
        const portalMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            opacity: 0.2
        });
        for(let p=480; p>240; p--){
            let particle =    new THREE.Mesh(portalGeo, portalMaterial);
            particle.position.set(
                0.7*p*Math.cos((4*p*Math.PI)/180),
                0.7*p*Math.sin((4*p*Math.PI)/180),
                0.1*p
            );
            particle.rotation.z = Math.random()*360;
            particle.material.opacity = Math.random()/2;
            portalParticles.push(particle);
            scene.add(particle);
        }

        const smokeGeo = new THREE.PlaneBufferGeometry(1000, 1000);
        const smokeMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            opacity: 0.1
        });

        for(let p=0; p<40; p++){
            let particle =    new THREE.Mesh(smokeGeo, smokeMaterial);
            particle.position.set(
                Math.random()*500-300,
                Math.random()*400-200,
                25
            );
            particle.rotation.z = Math.random()*360;
            smokeParticles.push(particle);
            scene.add(particle);
        }

        clock = new THREE.Clock();
        animate();
    })
}

const animate = function () {
    let delta = clock.getDelta();
    portalParticles.forEach(p => {
        p.rotation.z -= delta *1.5;
    });
    smokeParticles.forEach(p => {
        p.rotation.z -= delta *0.2;
    });
    if(Math.random()>0.9){
        point.power = 350 + Math.random()*100;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

onMounted(() => {
    initThree();
    window.onresize = function (){
        location.reload()
    }
})

</script>


<script>
export default {
    name: "three_04"
}
</script>

<style scoped>
#three-canvas{
    text-align: center;
    margin-left: 2vw;
}
</style>
