<template>
    <body>
        <div id="three-canvas"></div>
        <!--suppress HtmlUnknownTarget -->
        <img class="background" src="/image/shooting_star.jpg" alt="" />
        <div class="loading" v-if="state.loaded">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
        </div>
        <div class="overlay" v-if="state.loaded"></div>
    </body>
</template>

<script setup>


</script>


<script>
// Vue
import * as THREE from 'three/';
import { onMounted, onUnmounted, reactive, watch } from "vue";

import { saveAs } from 'file-saver';
import axios from "axios";
import { ThreeHelper } from "./ThreeHelper";

const PRESET = {
    modelPath: '/model/owl_gltf/1.gltf',
    hdrPath: '/hdr/xmas.hdr',
    bgPath: null,
    rotation: 0,
    hdrAngle: 0,
    autoPlay: false,
    ambientIntensity: 0.2,
    hdrExposure: 1.0,
    enablePostprocessing: true,
    toneMapping: 'ACESFilmic',
    maps: {
        arm: null,
        env: null,
    },
    postprocessing: {
        "enable": {
            "BLOOM": false,
            "SSR": true,
            "SSAO": true,
            "FXAA": false,
            "SMAA": false,
            "SSAA": true,
            "SHARP": true,
        },
        "SSAA": {
            "sampleLevel": 3,
            "unbiased": true
        },
        "BLOOM": {
            "strength": 1.5,
            "radius": 4,
            "threshold": 1
        },
        "SSAO": {
            "output": 0,
            "kernelRadius": 0.75,
            "minDistance": 0.00001,
            "maxDistance": 0.001,
            "contrast": 1
        },
        "SSR": {
            "output": 0,
            "thickness": 0.1,
            "maxDistance": 3,
            "opacity": 1,
            "surfDist": 0.001
        },
        "SHARP": {
            "intensity": 0.1
        }
    },
    "camera": {
        "position": {
            "x": 0,
            "y": -1,
            "z": -15
        },
        "rotation": {
            "x": 0,
            "y": 0,
            "z": 0
        },
        "lookAt": {
            "x": 0,
            "y": -1.5,
            "z": 0
        },
        "focalLength": 45
    }
}

// Global Variables
let three;

export default {
    name: "ThreeViewer",
    setup() {
        const state = reactive({ loaded: true });

        function clearAll( parent, child ){
            if( child.children === "undefined" || child.children == null){

            }else if( child.children.length ){
                let arr    = child.children.filter( x => x );
                arr.forEach( a=> {
                    clearAll( child, a )
                })
            }
            if( child instanceof THREE.Mesh ){
                if( child.material.map ) child.material.map.dispose();
                child.material.dispose();
                child.geometry.dispose();
            }else if( child.material ){
                child.material.dispose();
            }
            child.remove();
            parent.remove( child );
        }

        function save2JSON( parameters ) {
            let data = JSON.stringify(parameters, undefined, 4);
            let bolb = new Blob([data], {type: 'text/json'});
            saveAs( bolb, "parameters.json" );
        }


        /**
         * @summary Vue Mount ##################################################################################################
         */
        async function getJSON(){
            let data;
            await axios.get('./test.json').then(
                ( res ) =>{
                    data = res.data;
                    },
                ( error ) => {
                    let status = ( error.response && error.response.status && error.response.status)
                    if ( status === 404 ){
                        data = null;
                        console.log('No Such File')
                    }
                }
            )
            return data
        }


        onMounted(async () => {
            window.createImageBitmap = undefined; // Fix iOS Bug
            let data = await getJSON();
            console.log( state.loaded );
            // initThree( data );
            three = new ThreeHelper( data, state );
            window.addEventListener ( 'resize', three.onWindowResize );
            // if (isMobile ()) { gui.close (); }
        })

        onUnmounted(() => {
            console.log('UNMOUNTED')
            clearAll( three.scene, three.object );
            three.renderer.dispose();
            three.gui.destroy();
        })


        watch(
            () => state.loaded,
            () => {
                console.log('END LOADING');
            }
        )
        return { state }
    }
}
</script>

<style scoped lang="scss">
body{
    width: 100%;
    height: 100%;
    overflow: hidden;
}


#three-canvas{
    text-align: center;
}

.background{
    width: 100vw;
    height: 100vh;
    position: absolute;
    z-index: -1;
    left: 0;
    top: 0;
    object-fit: cover;
    user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
}

.loading{
    position: absolute;
    z-index: 1;
    left: 47vw;
    top: 40vh;
    width: 6vw;
    height: 6vh;
    text-align: center;

    div{
        background-color: #7ef6f2;
        height: 100%;
        width: 1vw;
        margin-right: 0.1vw;
        margin-left: 0.1vw;
        display: inline-block;

        -webkit-animation: stretchDelay 1.2s infinite ease-in-out;
        animation: stretchDelay 1.2s infinite ease-in-out;
    }
    .rect2 {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
    }
    .rect3 {
        -webkit-animation-delay: -1.0s;
        animation-delay: -1.0s;
    }
    .rect4 {
        -webkit-animation-delay: -0.9s;
        animation-delay: -0.9s;
    }
    .rect5 {
        -webkit-animation-delay: -0.8s;
        animation-delay: -0.8s;
    }
}

@-webkit-keyframes stretchDelay {
    0%, 40%, 100% {
        -webkit-transform: scaleY(0.4)
    }
    20% {
        -webkit-transform: scaleY(1.0)
    }
}

@keyframes stretchDelay {
    0%, 40%, 100% {
        transform: scaleY(0.4);
        -webkit-transform: scaleY(0.4);
    }
    20% {
        transform: scaleY(1.0);
        -webkit-transform: scaleY(1.0);
    }
}

.overlay{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #1d1d1d;
    opacity: 0.8;
}
</style>
