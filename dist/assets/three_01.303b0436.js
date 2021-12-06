import{V as p,i as x,N as S,af as w,a as D,M,ag as y,D as b}from"./ThreeInit.562ee8fc.js";import{E as U,R as j,S as h}from"./RenderPass.59a053fd.js";import{_ as P}from"./index.35ac8ade.js";import{m as z,o as I,a as V,p as B,d as R,b as C}from"./vendor.eebc2ca3.js";const E={uniforms:{tDiffuse:{value:null},tSize:{value:new p(256,256)},center:{value:new p(.5,.5)},angle:{value:1.57},scale:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform vec2 center;
		uniform float angle;
		uniform float scale;
		uniform vec2 tSize;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		float pattern() {

			float s = sin( angle ), c = cos( angle );

			vec2 tex = vUv * tSize - center;
			vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;

			return ( sin( point.x ) * sin( point.y ) ) * 4.0;

		}

		void main() {

			vec4 color = texture2D( tDiffuse, vUv );

			float average = ( color.r + color.g + color.b ) / 3.0;

			gl_FragColor = vec4( vec3( average * 10.0 - 5.0 + pattern() ), color.a );

		}`},F={uniforms:{tDiffuse:{value:null},amount:{value:.005},angle:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform float amount;
		uniform float angle;

		varying vec2 vUv;

		void main() {

			vec2 offset = amount * vec2( cos(angle), sin(angle));
			vec4 cr = texture2D(tDiffuse, vUv + offset);
			vec4 cga = texture2D(tDiffuse, vUv);
			vec4 cb = texture2D(tDiffuse, vUv - offset);
			gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);

		}`};const T=r=>(B("data-v-40549f65"),r=r(),R(),r),k=T(()=>C("div",{id:"three-canvas",style:{width:"0.8vw",height:"0.45vw"}},null,-1)),A=[k];function G(r){let a,s,c,f,t,o;function g(){let n=x();a=n.scene,s=n.camera,c=n.renderer,f=n.control,s.position.z=400,o=new S,a.add(o);const v=new w(1,4,4),_=new D({color:16777215,flatShading:!0});for(let m=0;m<100;m++){const e=new M(v,_);e.position.set(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize(),e.position.multiplyScalar(Math.random()*400),e.rotation.set(Math.random()*2,Math.random()*2,Math.random()*2),e.scale.x=e.scale.y=e.scale.z=Math.random()*50,o.add(e)}a.add(new y(2236962));const d=new b(16777215);d.position.set(1,1,1),a.add(d),t=new U(c),t.addPass(new j(a,s));const u=new h(E);u.uniforms.scale.value=4,t.addPass(u);const i=new h(F);i.uniforms.amount.value=.0015,i.renderToScreen=!0,t.addPass(i),l()}const l=function(){requestAnimationFrame(l),o.rotation.x+=.005,o.rotation.y+=.01,f.update(),t.render()};return z(()=>{g(),window.onresize=function(){location.reload()}}),(n,v)=>(I(),V("body",null,A))}const L={name:"three_01"},N=Object.assign(L,{setup:G});var K=P(N,[["__scopeId","data-v-40549f65"]]);export{K as default};
