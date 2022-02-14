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
import { useRoute } from "vue-router";


// Global Variables
let three, params;

export default {
    name: "ThreeViewer",
    setup() {
        let route = useRoute();
        params = route.query;
        console.log(params)
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

        async function getJSON( url ){
            let data;
            await axios.get( url ).then(
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
            let url;
            if (params.url) {
                url = params.url;
            } else  {
                url = './2.json';
            }
            let data = await getJSON( url );
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
