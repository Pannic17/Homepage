import{i as l,C as h,F as _,H as p,D as m,M as u,P as w,a as g}from"./ThreeInit.562ee8fc.js";import{G as v}from"./GLTFLoader.b7576f04.js";import{_ as x}from"./index.4f5d4636.js";import{m as b,o as L,a as j,p as y,d as I,b as M}from"./vendor.eebc2ca3.js";const S=n=>(y("data-v-81fb81d2"),n=n(),I(),n),F=S(()=>M("div",{id:"three-canvas",style:{width:"0.8vw",height:"0.45vw"}},null,-1)),G=[F];function P(n){let t,r,i,s;function c(){let a=l();t=a.scene,r=a.camera,i=a.renderer,r.position.z=3,f(),new v().load("../src/assets/model/eevee.gltf",function(o){s=o.scene.children[2],s.position.y=-1,t.add(s),d()},function(o){console.log(o.loaded/o.total*100+"% loaded")},function(o){console.log("An error happened")})}const d=function(){s.rotation.z+=.01,i.render(t,r),requestAnimationFrame(d)};function f(){t.background=new h(10526880),t.fog=new _(10526880,200,1e3);const a=new p(16777215,4473924);a.position.set(0,200,0),t.add(a);const e=new m(16777215);e.position.set(0,200,100),e.castShadow=!0,e.shadow.camera.top=180,e.shadow.camera.bottom=-100,e.shadow.camera.left=-120,e.shadow.camera.right=120,t.add(e);const o=new u(new w(2e3,2e3),new g({color:10066329,depthWrite:!1}));o.rotation.x=-Math.PI/2,o.receiveShadow=!0,t.add(o)}return b(()=>{c(),window.onresize=function(){location.reload()}}),(a,e)=>(L(),j("body",null,G))}const T={name:"three_03"},k=Object.assign(T,{setup:P});var D=x(k,[["__scopeId","data-v-81fb81d2"]]);export{D as default};