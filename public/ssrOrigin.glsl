
float metalness=texture2D(tMetalness,vUv).r;
if(metalness==0.) return;

float depth = getDepth( vUv );
float viewZ = getViewZ( depth );
if(-viewZ>=cameraFar) return;

float clipW = cameraProjectionMatrix[2][3] * viewZ+cameraProjectionMatrix[3][3];
vec3 viewPosition=getViewPosition( vUv, depth, clipW );

vec2 d0=gl_FragCoord.xy;
vec2 d1;

vec3 viewNormal=getViewNormal( vUv );

#ifdef PERSPECTIVE_CAMERA
vec3 viewIncidentDir=normalize(viewPosition);
vec3 viewReflectDir=reflect(viewIncidentDir,viewNormal);
#else
vec3 viewIncidentDir=vec3(0,0,-1);
vec3 viewReflectDir=reflect(viewIncidentDir,viewNormal);
#endif

float maxReflectRayLen=maxDistance/dot(-viewIncidentDir,viewNormal);
// dot(a,b)==length(a)*length(b)*cos(theta) // https://www.mathsisfun.com/algebra/vectors-dot-product.html
// if(a.isNormalized&&b.isNormalized) dot(a,b)==cos(theta)
// maxDistance/maxReflectRayLen=cos(theta)
// maxDistance/maxReflectRayLen==dot(a,b)
// maxReflectRayLen==maxDistance/dot(a,b)

vec3 d1viewPosition=viewPosition+viewReflectDir*maxReflectRayLen;
#ifdef PERSPECTIVE_CAMERA
if(d1viewPosition.z>-cameraNear){
    //https://tutorial.math.lamar.edu/Classes/CalcIII/EqnsOfLines.aspx
    float t=(-cameraNear-viewPosition.z)/viewReflectDir.z;
    d1viewPosition=viewPosition+viewReflectDir*t;
}
    #endif
d1=viewPositionToXY(d1viewPosition);

float totalLen=length(d1-d0);
float xLen=d1.x-d0.x;
float yLen=d1.y-d0.y;
float totalStep=max(abs(xLen),abs(yLen));
float xSpan=xLen/totalStep;
float ySpan=yLen/totalStep;
for(float i=0.;i<float(MAX_STEP);i++){
if(i>=totalStep) break;
vec2 xy=vec2(d0.x+i*xSpan,d0.y+i*ySpan);
if(xy.x<0.||xy.x>resolution.x||xy.y<0.||xy.y>resolution.y) break;
float s=length(xy-d0)/totalLen;
vec2 uv=xy/resolution;

float d = getDepth(uv);
float vZ = getViewZ( d );
if(-vZ>=cameraFar) continue;
float cW = cameraProjectionMatrix[2][3] * vZ+cameraProjectionMatrix[3][3];
vec3 vP=getViewPosition( uv, d, cW );

#ifdef PERSPECTIVE_CAMERA
// https://www.comp.nus.edu.sg/~lowkl/publications/lowk_persp_interp_techrep.pdf
float recipVPZ=1./viewPosition.z;
float viewReflectRayZ=1./(recipVPZ+s*(1./d1viewPosition.z-recipVPZ));
#else
float viewReflectRayZ=viewPosition.z+s*(d1viewPosition.z-viewPosition.z);
#endif

// if(viewReflectRayZ>vZ) continue; // will cause "npm run make-screenshot webgl_postprocessing_ssr" high probability hang.
// https://github.com/mrdoob/three.js/pull/21539#issuecomment-821061164
if(viewReflectRayZ<=vZ){

bool hit;
#ifdef INFINITE_THICK
hit=true;
#else
float away=pointToLineDistance(vP,viewPosition,d1viewPosition);

float minThickness;
vec2 xyNeighbor=xy;
xyNeighbor.x+=1.;
vec2 uvNeighbor=xyNeighbor/resolution;
vec3 vPNeighbor=getViewPosition(uvNeighbor,d,cW);
minThickness=vPNeighbor.x-vP.x;
minThickness*=3.;
float tk=max(minThickness,thickness);

hit=away<=tk;
#endif


float adjust = clamp((((1.0 - occlusion) - 1.0) * contrast + 1.0), 0.0, 1.0);
