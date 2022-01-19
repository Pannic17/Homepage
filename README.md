# HOMEPAGE includes portofolio and introduction
[pannic.art](http://pannic.art)  
[tencent cloud](https://homepage-2glz1j8c64ea8b56-1308663829.ap-shanghai.app.tcloudbase.com)  
Mounted on Tencent Cloud

# High Quality 3D Viewer
-GUI
-MODEL
  gltf loader with ORM texture and transmission
  enable hdr and hdr rotation
  with adjustable default ambient light
-CAMERA & LIGHTS
  camera and orbit control, available at both pc and mobile
  record camera information and can reset
  light preset and light controller, can add up-to 3 lights (number of lights will affect performace)
  enable shadow for point light and directional light
-POSTPROCESSING
  bloom with customized shader
  screen-space reflection with customized shader
  screen-space ambient occulusion with customized shader
  SMAA and SSAA, defalt 8 samples
-OTHER
  gamma correction of 2.2
  enable tone mapping choice
-COMMUNICATION
  with default scene setting
  read parameters from json files
  export json file of parameters for download



# Vue 3 + Typescript + Vite

This template should help get you started developing with Vue 3 and Typescript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.
