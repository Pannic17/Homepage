import {
	AddEquation,
	Color,
	NormalBlending,
	DepthTexture,
	SrcAlphaFactor,
	OneMinusSrcAlphaFactor,
	MeshNormalMaterial,
	MeshBasicMaterial,
	NearestFilter,
	NoBlending,
	RGBAFormat,
	ShaderMaterial,
	UniformsUtils,
	UnsignedShortType,
	WebGLRenderTarget,
	HalfFloatType, MeshStandardMaterial, MeshPhysicalMaterial,
} from 'three';
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { SSRShader } from './SSRShader.js';
import { SSRBlurShader } from './SSRShader.js';
import { SSRDepthShader } from './SSRShader.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';

class SSRPass extends Pass {

	constructor( { renderer, scene, camera, width, height, selects, bouncing = false, groundReflector } ) {

		super();

		this.width = ( width !== undefined ) ? width : 512;
		this.height = ( height !== undefined ) ? height : 512;

		this.clear = true;

		this.renderer = renderer;
		this.scene = scene;
		this.camera = camera;
		this.groundReflector = groundReflector;

		this.opacity = SSRShader.uniforms.opacity.value;
		this.output = 0;

		this.maxDistance = SSRShader.uniforms.maxDistance.value;
		this.thickness = SSRShader.uniforms.thickness.value;

		this.tempColor = new Color();

		this._selects = selects;
		// this.selective = Array.isArray( this._selects );

		Object.defineProperty( this, 'selects', {
			get() {

				return this._selects;

			},
			set( val ) {
				// noinspection JSMismatchedCollectionQueryUpdate
				/** ADD
				 * reconstruct selects properties
				 */
				let arr = [];
				val.forEach( obj3d=>{
					obj3d.traverseVisible( child=>{
						if ( child.material && typeof child.material.envMapIntensity === 'number' ){
							arr.push( child );
						}
					});
				});
				/** REMOVE
				arr = Array.from( new Set( arr ) );
				this._selects = arr;


				if ( this._selects === val ) return;
				this._selects = val;
				if ( Array.isArray( val ) ) {

					this.selective = true;
					this.ssrMaterial.defines.SELECTIVE = true;
					this.ssrMaterial.needsUpdate = true;

				} else {

					this.selective = false;
					this.ssrMaterial.defines.SELECTIVE = false;
					this.ssrMaterial.needsUpdate = true;

				}
				 */
			}
		} );


		this._bouncing = bouncing;
		Object.defineProperty( this, 'bouncing', {
			get() {

				return this._bouncing;

			},
			set( val ) {

				if ( this._bouncing === val ) return;
				this._bouncing = val;
				if ( val ) {

					this.ssrMaterial.uniforms[ 'tDiffuse' ].value = this.prevRenderTarget.texture;

				} else {

					/*
					this.ssrMaterial.uniforms[ 'tDiffuse' ].value = this.beautyRenderTarget.texture;
					*/

				}

			}
		} );

		this.blur = true;

		this._distanceAttenuation = SSRShader.defines.DISTANCE_ATTENUATION;
		Object.defineProperty( this, 'distanceAttenuation', {
			get() {

				return this._distanceAttenuation;

			},
			set( val ) {

				if ( this._distanceAttenuation === val ) return;
				this._distanceAttenuation = val;
				this.ssrMaterial.defines.DISTANCE_ATTENUATION = val;
				this.ssrMaterial.needsUpdate = true;

			}
		} );


		this._fresnel = SSRShader.defines.FRESNEL;
		Object.defineProperty( this, 'fresnel', {
			get() {

				return this._fresnel;

			},
			set( val ) {

				if ( this._fresnel === val ) return;
				this._fresnel = val;
				this.ssrMaterial.defines.FRESNEL = val;
				this.ssrMaterial.needsUpdate = true;

			}
		} );

		this._infiniteThick = SSRShader.defines.INFINITE_THICK;
		Object.defineProperty( this, 'infiniteThick', {
			get() {

				return this._infiniteThick;

			},
			set( val ) {

				if ( this._infiniteThick === val ) return;
				this._infiniteThick = val;
				this.ssrMaterial.defines.INFINITE_THICK = val;
				this.ssrMaterial.needsUpdate = true;

			}
		} );

		// beauty render target with depth buffer
		/** REMOVE
		const depthTexture = new DepthTexture();
		depthTexture.type = UnsignedShortType;
		depthTexture.minFilter = NearestFilter;
		depthTexture.magFilter = NearestFilter;
		 */


		/** REMOVE
		this.beautyRenderTarget = new WebGLRenderTarget( this.width, this.height, {
			minFilter: NearestFilter,
			magFilter: NearestFilter,
			format: RGBAFormat,
			depthTexture: depthTexture,
			depthBuffer: true
		} );
		 */


		//for bouncing
		this.prevRenderTarget = new WebGLRenderTarget( this.width, this.height, {
			minFilter: NearestFilter,
			magFilter: NearestFilter,
			format: RGBAFormat,
		} );


		// normal render target
		/** ADD
		 * normal render target with depth buffer
		 */
		const depthTexture = new DepthTexture();
		depthTexture.type = UnsignedShortType;
		depthTexture.minFilter = NearestFilter;
		depthTexture.magFilter = NearestFilter;

		this.normalRenderTarget = new WebGLRenderTarget( this.width, this.height, {
			minFilter: NearestFilter,
			magFilter: NearestFilter,
			format: RGBAFormat,
			type: HalfFloatType,
			depthTexture: depthTexture,
			depthBuffer: true
		} );

		// metalness render target

		this.metalnessRenderTarget = new WebGLRenderTarget( this.width, this.height, {
			minFilter: NearestFilter,
			magFilter: NearestFilter,
			format: RGBAFormat
		} );

		// roughness render target

		this.roughnessRenderTarget = new WebGLRenderTarget( this.width, this.height, {
			minFilter: NearestFilter,
			magFilter: NearestFilter,
			format: RGBAFormat
		} );

		// ssr render target

		this.ssrRenderTarget = new WebGLRenderTarget( this.width, this.height, {
			minFilter: NearestFilter,
			magFilter: NearestFilter,
			format: RGBAFormat
		} );

		this.blurRenderTarget = this.ssrRenderTarget.clone();
		this.blurRenderTarget2 = this.ssrRenderTarget.clone();
		this.blurRenderTarget3 = this.ssrRenderTarget.clone();

		// ssr material

		if ( SSRShader === undefined ) {

			console.error( 'THREE.SSRPass: The pass relies on SSRShader.' );

		}

		this.ssrMaterial = new ShaderMaterial( {
			defines: Object.assign( {}, SSRShader.defines, {
				MAX_STEP: Math.sqrt( this.width * this.width + this.height * this.height )
			} ),
			uniforms: UniformsUtils.clone( SSRShader.uniforms ),
			vertexShader: SSRShader.vertexShader,
			fragmentShader: SSRShader.fragmentShader,
			blending: NoBlending
		} );

		/** REMOVE
		this.ssrMaterial.uniforms[ 'tDiffuse' ].value = this.beautyRenderTarget.texture;
		 */
		this.ssrMaterial.uniforms[ 'tNormal' ].value = this.normalRenderTarget.texture;
		/** REMOVE
		this.ssrMaterial.defines.SELECTIVE = this.selective;
		 */
		this.ssrMaterial.needsUpdate = true;
		this.ssrMaterial.uniforms[ 'tMetalness' ].value = this.metalnessRenderTarget.texture;
		this.ssrMaterial.uniforms[ 'tRoughness' ].value = this.roughnessRenderTarget.texture;
		this.ssrMaterial.uniforms[ 'tDepth' ].value = this.normalRenderTarget.depthTexture; //CHANGED
		this.ssrMaterial.uniforms[ 'cameraNear' ].value = this.camera.near;
		this.ssrMaterial.uniforms[ 'cameraFar' ].value = this.camera.far;
		this.ssrMaterial.uniforms[ 'thickness' ].value = this.thickness;
		this.ssrMaterial.uniforms[ 'resolution' ].value.set( this.width, this.height );
		this.ssrMaterial.uniforms[ 'cameraProjectionMatrix' ].value.copy( this.camera.projectionMatrix );
		this.ssrMaterial.uniforms[ 'cameraInverseProjectionMatrix' ].value.copy( this.camera.projectionMatrixInverse );

		// normal material

		this.normalMaterial = new MeshNormalMaterial();
		this.normalMaterial.blending = NoBlending;

		/** REMOVE
		// metalnessOn material
		this.metalnessOnMaterial = new MeshBasicMaterial( {
			color: 'white'
		} );
		// metalnessOff material
		this.metalnessOffMaterial = new MeshBasicMaterial( {
			color: 'black'
		} );
		 */

		/** ADD
		 * replace metalness on/off with metalness and roughness
		 */
		// metalness material
		this.metalnessMaterial = new MeshBasicMaterial({ color: 'white' });
		// roughness material
		this.roughnessMaterial = new MeshBasicMaterial({ color: 'white' });

		// blur material

		this.blurMaterial = new ShaderMaterial( {
			defines: Object.assign( {}, SSRBlurShader.defines ),
			uniforms: UniformsUtils.clone( SSRBlurShader.uniforms ),
			vertexShader: SSRBlurShader.vertexShader,
			fragmentShader: SSRBlurShader.fragmentShader
		} );
		this.blurMaterial.uniforms[ 'tDiffuse' ].value = this.ssrRenderTarget.texture;
		this.blurMaterial.uniforms[ 'resolution' ].value.set( this.width, this.height );

		// blur material 2

		this.blurMaterial2 = new ShaderMaterial( {
			defines: Object.assign( {}, SSRBlurShader.defines ),
			uniforms: UniformsUtils.clone( SSRBlurShader.uniforms ),
			vertexShader: SSRBlurShader.vertexShader,
			fragmentShader: SSRBlurShader.fragmentShader
		} );
		this.blurMaterial2.uniforms[ 'tDiffuse' ].value = this.blurRenderTarget.texture;
		this.blurMaterial2.uniforms[ 'resolution' ].value.set( this.width, this.height );

		// blur material 3

		this.blurMaterial3 = new ShaderMaterial({
		  defines: Object.assign({}, SSRBlurShader.defines),
		  uniforms: UniformsUtils.clone(SSRBlurShader.uniforms),
		  vertexShader: SSRBlurShader.vertexShader,
		  fragmentShader: SSRBlurShader.fragmentShader
		});
		this.blurMaterial3.uniforms['tDiffuse'].value = this.blurRenderTarget2.texture;
		this.blurMaterial3.uniforms['resolution'].value.set(this.width, this.height);

		// material for rendering the depth

		this.depthRenderMaterial = new ShaderMaterial( {
			defines: Object.assign( {}, SSRDepthShader.defines ),
			uniforms: UniformsUtils.clone( SSRDepthShader.uniforms ),
			vertexShader: SSRDepthShader.vertexShader,
			fragmentShader: SSRDepthShader.fragmentShader,
			blending: NoBlending
		} );
		this.depthRenderMaterial.uniforms[ 'tDepth' ].value = this.normalRenderTarget.depthTexture; //CHANGED
		this.depthRenderMaterial.uniforms[ 'cameraNear' ].value = this.camera.near;
		this.depthRenderMaterial.uniforms[ 'cameraFar' ].value = this.camera.far;

		// material for rendering the content of a render target

		this.copyMaterial = new ShaderMaterial( {
			uniforms: UniformsUtils.clone( CopyShader.uniforms ),
			vertexShader: CopyShader.vertexShader,
			fragmentShader: CopyShader.fragmentShader,
			transparent: true,
			depthTest: false,
			depthWrite: false,
			blendSrc: SrcAlphaFactor,
			blendDst: OneMinusSrcAlphaFactor,
			blendEquation: AddEquation,
			blendSrcAlpha: SrcAlphaFactor,
			blendDstAlpha: OneMinusSrcAlphaFactor,
			blendEquationAlpha: AddEquation,
			// premultipliedAlpha:true,
		} );

		this.fsQuad = new FullScreenQuad( null );

		this.originalClearColor = new Color();

	}

	dispose() {

		// dispose render targets

		// this.beautyRenderTarget.dispose();
		this.prevRenderTarget.dispose();
		this.normalRenderTarget.dispose();
		this.metalnessRenderTarget.dispose();
		this.roughnessRenderTarget.dispose();
		this.ssrRenderTarget.dispose();
		this.blurRenderTarget.dispose();
		this.blurRenderTarget2.dispose();
		this.blurRenderTarget3.dispose();

		// dispose materials

		this.normalMaterial.dispose();
		/** REMOVE
		this.metalnessOnMaterial.dispose();
		this.metalnessOffMaterial.dispose();
		 */
		this.metalnessMaterial.dispose();
		this.roughnessMaterial.dispose();
		this.blurMaterial.dispose();
		this.blurMaterial2.dispose();
		this.copyMaterial.dispose();
		this.depthRenderMaterial.dispose();

		// dipsose full screen quad

		this.fsQuad.dispose();

	}

	render( renderer, writeBuffer , readBuffer/*, deltaTime, maskActive */ ) {

		// render beauty and depth

		/** REMOVE
		renderer.setRenderTarget( this.beautyRenderTarget );
		renderer.clear();
		if ( this.groundReflector ) {

			this.groundReflector.visible = false;
			this.groundReflector.doRender( this.renderer, this.scene, this.camera );
			this.groundReflector.visible = true;

		}

		renderer.render( this.scene, this.camera );
		if ( this.groundReflector ) this.groundReflector.visible = false;
		 */

		// render normals and depths
		this.renderOverride( renderer, this.normalMaterial, this.normalRenderTarget, 0, 0 );

		// render metalness
		this.renderMetalness( renderer, this.metalnessRenderTarget, 0, 0);
		// rneder roughness
		this.renderRoughness( renderer, this.roughnessRenderTarget, 0, 0 );
		/**
		if ( this.selective ) {
			this.renderMetalness( renderer, this.metalnessOnMaterial, this.metalnessRenderTarget, 0, 0 );
		}
		 */

		// render SSR

		this.ssrMaterial.uniforms[ 'tDiffuse' ].value = readBuffer.texture; //ADD
		this.ssrMaterial.uniforms[ 'opacity' ].value = this.opacity;
		this.ssrMaterial.uniforms[ 'maxDistance' ].value = this.maxDistance;
		this.ssrMaterial.uniforms[ 'thickness' ].value = this.thickness;
		this.renderPass( renderer, this.ssrMaterial, this.ssrRenderTarget );


		// render blur

		if ( this.blur ) {

			this.renderPass( renderer, this.blurMaterial, this.blurRenderTarget );
			this.renderPass( renderer, this.blurMaterial2, this.blurRenderTarget2 );
			this.renderPass( renderer, this.blurMaterial3, this.blurRenderTarget3 );

		}

		// output result to screen

		switch ( this.output ) {

			case SSRPass.OUTPUT.Default:

				if ( this.bouncing ) {

					this.copyMaterial.uniforms[ 'tDiffuse' ].value = readBuffer.texture; //CHANGED
					this.copyMaterial.blending = NoBlending;
					this.renderPass( renderer, this.copyMaterial, this.prevRenderTarget );

					if ( this.blur )
						this.copyMaterial.uniforms[ 'tDiffuse' ].value = this.blurRenderTarget2.texture;
					else
						this.copyMaterial.uniforms[ 'tDiffuse' ].value = this.ssrRenderTarget.texture;
					this.copyMaterial.blending = NormalBlending;
					this.renderPass( renderer, this.copyMaterial, this.prevRenderTarget );

					this.copyMaterial.uniforms[ 'tDiffuse' ].value = this.prevRenderTarget.texture;
					this.copyMaterial.blending = NoBlending;
					this.renderPass( renderer, this.copyMaterial, this.renderToScreen ? null : writeBuffer );

				} else {

					this.copyMaterial.uniforms[ 'tDiffuse' ].value = readBuffer.texture; //CHANGED
					this.copyMaterial.blending = NoBlending;
					this.renderPass( renderer, this.copyMaterial, this.renderToScreen ? null : writeBuffer );

					if ( this.blur )
						this.copyMaterial.uniforms[ 'tDiffuse' ].value = this.blurRenderTarget2.texture;
					else
						this.copyMaterial.uniforms[ 'tDiffuse' ].value = this.ssrRenderTarget.texture;
					this.copyMaterial.blending = NormalBlending;
					this.renderPass( renderer, this.copyMaterial, this.renderToScreen ? null : writeBuffer );

				}

				break;
			case SSRPass.OUTPUT.SSR:

				if ( this.blur )
					this.copyMaterial.uniforms[ 'tDiffuse' ].value = this.blurRenderTarget2.texture;
				else
					this.copyMaterial.uniforms[ 'tDiffuse' ].value = this.ssrRenderTarget.texture;
				this.copyMaterial.blending = NoBlending;
				this.renderPass( renderer, this.copyMaterial, this.renderToScreen ? null : writeBuffer );

				if ( this.bouncing ) {

					if ( this.blur )
						this.copyMaterial.uniforms[ 'tDiffuse' ].value = this.blurRenderTarget2.texture;
					else
						this.copyMaterial.uniforms[ 'tDiffuse' ].value = readBuffer.texture; //CHANGED
					this.copyMaterial.blending = NoBlending;
					this.renderPass( renderer, this.copyMaterial, this.prevRenderTarget );

					this.copyMaterial.uniforms[ 'tDiffuse' ].value = this.ssrRenderTarget.texture;
					this.copyMaterial.blending = NormalBlending;
					this.renderPass( renderer, this.copyMaterial, this.prevRenderTarget );

				}

				break;

			/**
			case SSRPass.OUTPUT.Beauty:

				this.copyMaterial.uniforms[ 'tDiffuse' ].value = readBuffer.texture; //CHANGED
				this.copyMaterial.blending = NoBlending;
				this.renderPass( renderer, this.copyMaterial, this.renderToScreen ? null : writeBuffer );

				break;
			 */


			case SSRPass.OUTPUT.Depth:

				this.renderPass( renderer, this.depthRenderMaterial, this.renderToScreen ? null : writeBuffer );

				break;

			case SSRPass.OUTPUT.Normal:

				this.copyMaterial.uniforms[ 'tDiffuse' ].value = this.normalRenderTarget.texture;
				this.copyMaterial.blending = NoBlending;
				this.renderPass( renderer, this.copyMaterial, this.renderToScreen ? null : writeBuffer );

				break;

			case SSRPass.OUTPUT.Metalness:

				this.copyMaterial.uniforms[ 'tDiffuse' ].value = this.metalnessRenderTarget.texture;
				this.copyMaterial.blending = NoBlending;
				this.renderPass( renderer, this.copyMaterial, this.renderToScreen ? null : writeBuffer );

				break;

			case SSRPass.OUTPUT.Roughness:

				this.copyMaterial.uniforms[ 'tDiffuse' ].value = this.roughnessRenderTarget.texture;
				this.copyMaterial.blending = NoBlending;
				this.renderPass( renderer, this.copyMaterial, this.renderToScreen ? null : writeBuffer );

				break;

			default:
				console.warn( 'THREE.SSRPass: Unknown output type.' );

		}

	}

	renderPass( renderer, passMaterial, renderTarget, clearColor, clearAlpha ) {

		// save original state
		this.originalClearColor.copy( renderer.getClearColor( this.tempColor ) );
		const originalClearAlpha = renderer.getClearAlpha( this.tempColor );
		const originalAutoClear = renderer.autoClear;

		renderer.setRenderTarget( renderTarget );

		// setup pass state
		renderer.autoClear = false;
		// if ( ( clearColor !== undefined ) && ( clearColor !== null ) ) {
		//
		// 	renderer.setClearColor( clearColor );
		// 	renderer.setClearAlpha( clearAlpha || 0.0 );
		// 	renderer.clear();
		//
		// }

		this.fsQuad.material = passMaterial;
		this.fsQuad.render( renderer );

		// restore original state
		renderer.autoClear = originalAutoClear;
		renderer.setClearColor( this.originalClearColor );
		renderer.setClearAlpha( originalClearAlpha );

	}

	renderOverride( renderer, overrideMaterial, renderTarget, clearColor, clearAlpha ) {

		this.originalClearColor.copy( renderer.getClearColor( this.tempColor ) );
		const originalClearAlpha = renderer.getClearAlpha( this.tempColor );
		const originalAutoClear = renderer.autoClear;

		renderer.setRenderTarget( renderTarget );
		renderer.autoClear = false;

		clearColor = overrideMaterial.clearColor || clearColor;
		clearAlpha = overrideMaterial.clearAlpha || clearAlpha;

		if ( ( clearColor !== undefined ) && ( clearColor !== null ) ) {

			renderer.setClearColor( clearColor );
			renderer.setClearAlpha( clearAlpha || 0.0 );
			renderer.clear();

		}

		this.scene.overrideMaterial = overrideMaterial;
		renderer.render( this.scene, this.camera );
		this.scene.overrideMaterial = null;

		// restore original state

		renderer.autoClear = originalAutoClear;
		renderer.setClearColor( this.originalClearColor );
		renderer.setClearAlpha( originalClearAlpha );

	}

	renderMetalness( renderer, renderTarget, clearColor, clearAlpha ) {

		this.originalClearColor.copy( renderer.getClearColor( this.tempColor ) );
		const originalClearAlpha = renderer.getClearAlpha( this.tempColor );
		const originalAutoClear = renderer.autoClear;

		renderer.setRenderTarget( renderTarget );
		renderer.autoClear = false;



		if ( ( clearColor !== undefined ) && ( clearColor !== null ) ) {

			renderer.setClearColor( clearColor );
			renderer.setClearAlpha( clearAlpha || 0.0 );
			renderer.clear();

		}

		this.scene.traverseVisible( child => {

			/** REMOVE
			child._SSRPassBackupMaterial = child.material;
			if ( this._selects.includes( child ) ) {
				child.material = this.metalnessOnMaterial;
			} else {
				child.material = this.metalnessOffMaterial;
			}
			 */

			if ( child.material instanceof MeshStandardMaterial || child.material instanceof MeshPhysicalMaterial ){
				this.metalnessMaterial.color.r = 0;
				this.metalnessMaterial.color.g = 0;
				this.metalnessMaterial.color.b = 1;

				this.metalnessMaterial.map = child.material.metalnessMap;
			} else {
				this.metalnessMaterial.color.setScalar( this.defaultIntensity );
			}

			let materialTemp = child.material;
			child.material = this.metalnessMaterial;
			renderer.render( child, this.camera );
			child.material = materialTemp;
		} );

		/** REMOVE
		renderer.render( this.scene, this.camera );
		this.scene.traverseVisible( child => {

			child.material = child._SSRPassBackupMaterial;

		} );
		 */

		// restore original state
		renderer.autoClear = originalAutoClear;
		renderer.setClearColor( this.originalClearColor );
		renderer.setClearAlpha( originalClearAlpha );
	}

	renderRoughness( renderer, renderTarget, clearColor, clearAlpha ) {

		this.originalClearColor.copy( renderer.getClearColor( this.tempColor ) );
		const originalClearAlpha = renderer.getClearAlpha( this.tempColor );
		const originalAutoClear = renderer.autoClear;

		renderer.setRenderTarget( renderTarget );
		renderer.autoClear = false;

		if ( ( clearColor !== undefined ) && ( clearColor !== null ) ) {

			renderer.setClearColor( clearColor );
			renderer.setClearAlpha( clearAlpha || 0.0 );
			renderer.clear();

		}

		this.scene.traverseVisible( child => {

			if ( child.material instanceof MeshStandardMaterial || child.material instanceof MeshPhysicalMaterial ){
				this.roughnessMaterial.color.r = 0;
				this.roughnessMaterial.color.g = 1;
				this.roughnessMaterial.color.b = 0;
				this.roughnessMaterial.map = child.material.roughnessMap;
			} else {
				this.roughnessMaterial.color.setScalar( this.defaultIntensity );
			}

			let materialTemp = child.material;
			child.material = this.roughnessMaterial;
			renderer.render( child, this.camera, false ); // TODO: Will render all descendants?
			child.material = materialTemp;
		} );

		// restore original state
		renderer.autoClear = originalAutoClear;
		renderer.setClearColor( this.originalClearColor );
		renderer.setClearAlpha( originalClearAlpha );
	}

	setSize( width, height ) {

		this.width = width;
		this.height = height;

		this.ssrMaterial.defines.MAX_STEP = Math.sqrt( width * width + height * height );
		this.ssrMaterial.needsUpdate = true;
		// this.beautyRenderTarget.setSize( width, height );
		this.prevRenderTarget.setSize( width, height );
		this.ssrRenderTarget.setSize( width, height );
		this.normalRenderTarget.setSize( width, height );
		this.metalnessRenderTarget.setSize( width, height );
		this.roughnessRenderTarget.setSize( width, height );
		this.blurRenderTarget.setSize( width, height );
		this.blurRenderTarget2.setSize( width, height );
		this.blurRenderTarget3.setSize(width, height);

		this.ssrMaterial.uniforms[ 'resolution' ].value.set( width, height );
		this.ssrMaterial.uniforms[ 'cameraProjectionMatrix' ].value.copy( this.camera.projectionMatrix );
		this.ssrMaterial.uniforms[ 'cameraInverseProjectionMatrix' ].value.copy( this.camera.projectionMatrixInverse );

		this.blurMaterial.uniforms[ 'resolution' ].value.set( width, height );
		this.blurMaterial2.uniforms[ 'resolution' ].value.set( width, height );

	}

}

SSRPass.OUTPUT = {
	'Default': 0,
	'SSR': 1,
	'Beauty': 3,
	'Depth': 4,
	'Normal': 5,
	'Metalness': 7,
	'Roughness': 8,
};

export { SSRPass };
