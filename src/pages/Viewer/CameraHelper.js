class CameraHelper {
    constructor ( scene, camera, gui, control ) {
        // Inputs
        this.scene = scene;
        this.camera = camera;
        this.gui = gui.addFolder('Toggle Camera').close();
        this.control = control;
        this.menu = null;

        this.enableToggle();
    }

    enableToggle() {
        let setting = {
            'Enable': false,
            'initGUI': initGUI,
            'control': this.control,
            'menu': this.menu,
            'scene': this.scene,
            'gui': this.gui,
            'camera': this.camera
        };

        this.gui.add( setting, 'Enable' ).onChange(function (){
            if (setting.Enable){
                setting.control.enabled = false;
                setting.initGUI();
            } else {
                setting.control.enabled = true;
                setting.menu.destroy();
            }
        });

        function initGUI(){
            setting.menu = cameraGUI( setting.camera, setting.gui );
        }
    }
}

function cameraGUI( camera, gui ){
    const cameraPosition = gui.addFolder('Camera Position');
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

export { CameraHelper };