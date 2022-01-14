import * as THREE from 'three/';

export function addPlane( scene: any ) {
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry( 500, 500 ),
        new THREE.MeshPhongMaterial( {
            color: 0xaaaaaa,
            shininess: 0,
            specular: 0x222222
        })
    );
    ground.rotation.x = - Math.PI / 2;
    ground.position.y = -5;
    ground.castShadow = true;
    ground.receiveShadow = true;
    scene.add( ground );
}

export function addTestObjects( scene: any ) {
    const boxGeometry = new THREE.BoxBufferGeometry( 2, 2, 0.5 );
    const boxMaterial = new THREE.MeshStandardMaterial( {
        color: 'cyan',
    });
    const boxMesh = new THREE.Mesh( boxGeometry, boxMaterial );
    boxMesh.position.set( -3, 3, - 3 );
    scene.add( boxMesh );
    const sphereGeometry = new THREE.IcosahedronBufferGeometry( 2, 4 );
    const sphereMaterial = new THREE.MeshStandardMaterial( {
        color: 'red',
    });
    const sphereMesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
    sphereMesh.position.set( 3, 3, - 3 );
    scene.add( sphereMesh );
}