import * as THREE from "three/";
import { Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const SPEED = 0.001;

class CameraHelper {
    constructor ( scene, camera, canvas, gui ) {
        // Inputs
        this.scene = scene;
        this.camera = camera;
        this.canvas = canvas;
        this.gui = gui.addFolder('Camera Setting').close();
        this.control = this.initControl();
        this.menu = null;

        this.cameraGUI();
    }

    cameraGUI() {
        let _attr = {
            'focusLength': this.camera.getFocalLength(),
            'Save': logInfo,
            'Reset': resetCamera,
        }
        let _this = this;
        this.gui.add( _attr, 'focusLength', 24, 200).onChange(function (value){
            _this.camera.setFocalLength(value);
        }).name('Focus Length');
        this.gui.add( _attr, 'Save');
        this.gui.add( _attr, 'Reset');

        function logInfo() {
            _this.cameraLog( _this.camera );
            _this.control.saveState();
        }

        function resetCamera() {
            _this.control.reset();
            _this.control.update();
        }
    }

    cameraLog( camera ) {
        console.log('### Camera Settings\n' +
            'Position --- ' +
            'x: ' + camera.position.x + '; ' +
            'y: ' + camera.position.y + '; ' +
            'z: ' + camera.position.z + '; ' + '\n' +
            'Rotation --- ' +
            'x: ' + camera.rotation.x + '; ' +
            'y: ' + camera.rotation.y + '; ' +
            'z: ' + camera.rotation.z + '; ' + '\n'
        )
    }

    initControl() {
        let control = new OrbitControls( this.camera, this.canvas );
        control.target = new Vector3( 0, -1.5, 0);
        control.update();
        control.saveState();
        // control.enableDamping = true;
        control.rotateSpeed = SPEED*1000;
        control.maxDistance = 100;
        control.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
        }
        return control
    }

    enableToggle() {
        let setting = {
            'Enable': false,
            'initGUI': initGUI
        };
        let _this = this;

        this.gui.add( setting, 'Enable' ).onChange(function (){
            if (setting.Enable){
                _this.control.dispose();
                setting.initGUI();
            } else {
                _this.camera.position.set(
                    _this.camera.position.x,
                    _this.camera.position.y,
                    _this.camera.position.z );
                _this.menu.destroy();
                _this.control = _this.initControl();
            }
        });

        function initGUI(){
            _this.menu = cameraToggleGUI( _this.camera, _this.gui, _this.control );
        }
    }
}

function cameraToggleGUI( camera, gui, control ){
    const cameraPosition = gui.addFolder('Camera Position');
    let _attr = {
        radius: control.getDistance(),
        theta: control.getPolarAngle(),
        phi: control.getAzimuthalAngle(),
        fl: camera.getFocalLength()
    };
    cameraPosition.add( _attr, 'radius', 1, 25).onChange(function (value){
        let coordinate = spherical2Cartesian( value, _attr.theta, _attr.phi );
        camera.position.set( coordinate.x, coordinate.y, coordinate.z );
        control.update();
    });
    cameraPosition.add( _attr, 'theta', -Math.PI, Math.PI).onChange(function (value){
        let coordinate = spherical2Cartesian( _attr.radius, value, _attr.phi );
        camera.position.set( coordinate.x, coordinate.y, coordinate.z );
        control.update();
    });
    cameraPosition.add( _attr, 'phi', -Math.PI, Math.PI).onChange(function (value){
        let coordinate = spherical2Cartesian( _attr.radius, _attr.theta, value );
        camera.position.set( coordinate.x, coordinate.y, coordinate.z );
        control.update();
    });
    cameraPosition.add( _attr, 'fl', 24, 200).onChange(function (value){
        camera.setFocalLength(value);
    })


    cameraPosition.add( camera.position, 'x', -25, 25).onChange(function (value){
        camera.position.x = value;
    });
    cameraPosition.add( camera.position, 'y', -15, 15).onChange(function (value){
        camera.position.y = value;
    });
    cameraPosition.add( camera.position, 'z', -25, 25).onChange(function (value){
        camera.position.z = value;
    });
    return cameraPosition;
}

function spherical2Cartesian( radius, theta, phi ){
    let x = radius * Math.sin(theta) * Math.cos(phi);
    let y = radius * Math.sin(theta) * Math.sin(phi);
    let z = radius * Math.cos(theta);
    return { x, y, z };
}

export { CameraHelper };