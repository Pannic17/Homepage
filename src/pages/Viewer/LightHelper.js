import * as THREE from "three/";

class LightHelper {
    constructor( scene, gui ) {
        // Inputs
        this.scene = scene;
        this.gui = gui.addFolder('Lights').close();

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
            'Hemisphere': LightHelper.LIGHT.Hemisphere,
            'Spot': LightHelper.LIGHT.Spot,
        }).name('Light Type');
        addMenu.add( this, 'addSelective').name('Add')
    }

    addSelective() {
        switch ( this.addSelection ) {
            case LightHelper.LIGHT.None:
                break;
            case LightHelper.LIGHT.Point:
                this.initPointLight();
                break;
            case LightHelper.LIGHT.Directional:
                this.initDirLight();
                break;
            case LightHelper.LIGHT.Hemisphere:
                this.initHemiLight();
                break;
            case LightHelper.LIGHT.Spot:
                this.initSpotLight();
                break;
        }
    }

    removeLight( light, gui ){
        this.scene.remove( light );
        light.dispose();
        gui.destroy();
    }

    lightShadow( light ) {
        light.shadow.castShadow = true;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 500;
        light.shadow.radius = 4;
        light.shadow.blurSamples = 8;
        light.shadow.camera.right = 15;
        light.shadow.camera.left = - 15;
        light.shadow.camera.top	= 15;
        light.shadow.camera.bottom = - 15;
        light.shadow.mapSize.width = 512;
        light.shadow.mapSize.height = 512;
        light.shadow.bias = - 0.0005;
    }

    initPointLight() {
        let pointLight = new THREE.PointLight(0xffffff, 40, 100);
        pointLight.position.set(3, 3, 3);
        this.lightShadow( pointLight );
        this.scene.add( pointLight );
        this.lights.push( pointLight );
        let index = this.lights.length;
        this.pointLightGUI( index, pointLight );
        return pointLight;
    }

    initDirLight() {
        let dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.position.set( 20, 15, 0.5);
        dirLight.intensity = 0.5;
        this.lightShadow( dirLight );
        this.scene.add( dirLight );
        this.lights.push( dirLight );
        let index = this.lights.length;
        this.dirLightGUI( index, dirLight );
        return dirLight;
    }

    initHemiLight() {
        let hemiLight = new THREE.HemisphereLight( 0x443333, 0x111122 );
        this.scene.add( hemiLight );
        this.lights.push( hemiLight );
        let index = this.lights.length;
        this.hemiLightGUI( index, hemiLight );
        return hemiLight;
    }

    // ## TODO
    initSpotLight() {
        this.spotLightGUI();
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

        let setting = {
            'Enable': true,
            'Remove': remove
        };
        let _this = this
        pointLightGUI.add( setting, 'Enable').onChange(function (){
            if ( !setting.Enable ){
                _this.scene.remove( pointLight );
            } else {
                _this.scene.add( pointLight );
            }
        });
        function remove () {
            _this.removeLight( pointLight, pointLightGUI );
        }
        pointLightGUI.add( setting, 'Remove');
    }

    dirLightGUI( index, dirLight ){
        let lightName = '#' + index + ' Directional Light';
        let _attr = {
            r: 20,
            a: 90,
            h: 15
        }
        const dirLightGUI = this.gui.addFolder( lightName );
        dirLightGUI.add( dirLight, 'intensity', 0, 20).name('Intensity');
        dirLightGUI.addColor( dirLight, 'color' ).name('Color');
        dirLightGUI.add( _attr, 'r', 0, 50).onChange(function (value){
            let x = value * Math.cos( _attr.a * Math.PI / 180);
            let z = value * Math.sin( _attr.a * Math.PI / 180);
            dirLight.position.set( x, _attr.h, z);
        }).name('Rotate Radius');
        dirLightGUI.add( _attr, 'a', -360, 360).onChange(function (value){
            let x = _attr.r * Math.cos( value * Math.PI / 180);
            let z = _attr.r * Math.sin( value * Math.PI / 180);
            dirLight.position.set( x, _attr.h, z);
        }).name('Rotate Angle');
        dirLightGUI.add( _attr, 'h', 1, 20).onChange(function (value){
            dirLight.position.y = value
        }).name('Light Height');

        let setting = {
            'Enable': true,
            'Remove': remove
        };
        let _this = this
        dirLightGUI.add( setting, 'Enable').onChange(function (){
            if ( !setting.Enable ){
                _this.scene.remove( dirLight );
            } else {
                _this.scene.add( dirLight );
            }
        });
        function remove () {
            _this.removeLight( dirLight, dirLightGUI );
        }
        dirLightGUI.add( setting, 'Remove');
    }

    hemiLightGUI( index, hemiLight ) {
        let lightName = '#' + index + ' Hemisphere Light';
        const hemiLightGUI = this.gui.addFolder( lightName );
        hemiLightGUI.add( hemiLight, 'intensity', 0, 20).name('Intensity');
        hemiLightGUI.addColor( hemiLight, 'color' ).name('Sky Color');
        hemiLightGUI.addColor( hemiLight, 'groundColor' ).name('Ground Color');

        let setting = {
            'Enable': true,
            'Remove': remove
        };
        let _this = this;
        hemiLightGUI.add( setting, 'Enable' ).onChange(function (){
            if ( !setting.Enable ){
                _this.scene.remove( hemiLight );
            } else {
                _this.scene.add( hemiLight );
            }
        });
        function remove () {
            _this.removeLight( hemiLight, hemiLightGUI );
        }
        hemiLightGUI.add( setting, 'Remove');
    }

    spotLightGUI() {
        console.log('###TODO###')
    }
}

LightHelper.LIGHT = {
    'None': 0,
    'Point': 1,
    'Directional': 2,
    'Hemisphere': 3,
    'Spot': 4
}



export { LightHelper };