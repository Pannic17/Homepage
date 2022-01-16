import * as THREE from "three/";

class LightHelper {
    constructor( scene, gui ) {
        // Inputs
        this.scene = scene;
        this.gui = gui.addFolder('Lights');

        this.lights = [];

        this.addSelection = 0
        this.addMenu();
    }



    addMenu() {
        const addMenu = this.gui.addFolder('Add Light');
        addMenu.add( this, 'addSelection', {
            'None': LightHelper.LIGHT.None,
            'Point': LightHelper.LIGHT.Point,
            'Directional': LightHelper.LIGHT.Directional,
            'Spot': LightHelper.LIGHT.Spot,
            'Hemisphere': LightHelper.LIGHT.Hemisphere,
        }).name('Light Type');
        addMenu.add( this, 'addSelective').name('Add')
    }

    addSelective() {
        switch ( this.addSelection ) {
            case LightHelper.LIGHT.None:
                break;
            case LightHelper.LIGHT.Point:
                this.initPointLight();
        }
    }

    removeLight( light, gui ){
        this.scene.remove( light );
        light.dispose();
        gui.destroy();
    }

    initPointLight() {
        let pointLight = new THREE.PointLight(0xffffff, 40, 100);
        pointLight.position.set(3, 3, 3);
        this.scene.add( pointLight );
        this.lights.push( pointLight );
        let index = this.lights.length;
        this.pointLightGUI( index, pointLight );
        return pointLight;
    }

    pointLightGUI( index, pointLight ){
        let lightName = '#' + index + ' PointLight';
        const pointLightGUI = this.gui.addFolder( lightName );
        pointLightGUI.add( pointLight, 'intensity', 0, 100).name('Intensity');
        pointLightGUI.add( pointLight, 'distance', 0, 500).name('Distance');
        pointLightGUI.addColor( pointLight, 'color' ).name('Color');
        pointLightGUI.add( pointLight.position, 'x', -20, 20);
        pointLightGUI.add( pointLight.position, 'y', -20, 20);
        pointLightGUI.add( pointLight.position, 'z', -20, 20);
        pointLightGUI.add( pointLight, 'decay', 1, 5).name('Decay');
        pointLightGUI.add( pointLight, 'power', 1, 1000).name('Power');
        let helper = this
        function remove () {
            console.log('remove')
            helper.removeLight( pointLight, pointLightGUI );
        }
        let setting = { 'remove': remove };
        pointLightGUI.add( setting, 'remove').name('Remove');
    }

    initDirLight() {
        let dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.position.set( x, parameters.light.h, z);
        dirLight.intensity = parameters.light.intensity;
        dirLight.shadow.camera.near = parameters.light.shadow.near;
        dirLight.shadow.camera.far = parameters.light.shadow.far;
        dirLight.shadow.radius = parameters.light.shadow.radius;
        dirLight.shadow.blurSamples = parameters.light.shadow.blurSamples;
        dirLight.castShadow = true;
        dirLight.shadow.camera.right = 15;
        dirLight.shadow.camera.left = - 15;
        dirLight.shadow.camera.top	= 15;
        dirLight.shadow.camera.bottom = - 15;
        dirLight.shadow.mapSize.width = 512;
        dirLight.shadow.mapSize.height = 512;
        dirLight.shadow.bias = - 0.0005;
    }
}

LightHelper.LIGHT = {
    'None': 0,
    'Point': 1,
    'Directional': 2,
    'Spot': 3,
    'Hemisphere': 4
}

LightHelper.ADD = new function() {
    this.addLight = function () {

    }
}

export { LightHelper };