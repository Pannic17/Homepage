precision mediump float;
precision mediump int;

attribute vec3 position;
attribute vec2 uv;
attribute float faceIndex;

varying vec3 vOutputDirection;
uniform float angle;

mat3 getRotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat3(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c);
}

// RH coordinate system; PMREM face-indexing convention
vec3 getDirection( vec2 uv, float face, float rotationY ) {

    uv = 2.0 * uv - 1.0;

    vec3 direction = vec3( uv, 1.0 );

    if ( face == 0.0 ) {
        direction = direction.zyx;
        direction.x *= -1.0;
    } else if ( face == 1.0 ) {
        direction = direction.xzy;
        direction.z *= -1.0;
    } else if ( face == 2.0 ) {
        // direction.x *= -1.0; // ( -u, v, 1 ) pos z
    } else if ( face == 3.0 ) {
        direction = direction.zyx;
        direction.z *= -1.0;
    } else if ( face == 4.0 ) {
        direction = direction.xzy;
        direction.y *= -1.0;
    } else if ( face == 5.0 ) {
        direction.xz *= -1.0;
    }

    mat3 rotationMatrix = getRotationMatrix(vec3(0.0, 1.0, 0.0), -rotationY);
    direction = rotationMatrix * direction;

    return direction;
}

void main() {
    vOutputDirection = getDirection( uv, faceIndex, angle );
    gl_Position = vec4( position, 1.0 );

}


// precision highp float;
precision highp sampler2D;
varying vec2 vUv;
uniform sampler2D tDepth;
uniform sampler2D tNormal;
uniform sampler2D tMetalness;
uniform sampler2D tRoughness;
uniform sampler2D tDiffuse;
uniform float cameraRange;
uniform vec2 resolution;
uniform float opacity;
uniform float cameraNear;
uniform float cameraFar;
uniform float maxDistance;
uniform float thickness;
uniform float reflectivity;
uniform mat4 cameraProjectionMatrix;
uniform mat4 cameraInverseProjectionMatrix;
#include <packing>
const float PI = 3.14159265359;
// ADD--------------------------------------------------
float DistributionGGX(vec3 N, vec3 H, float roughness) {
    float a = roughness*roughness;
    float a2 = a*a;
    float NdotH = max(dot(N, H), 0.0);
    float NdotH2 = NdotH*NdotH;
    float nom = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;
    return nom / max(denom, 0.0000001);
    // prevent divide by zero for roughness=0.0 and NdotH=1.0
}
// ADD--------------------------------------------------
float GeometrySchlickGGX(float NdotV, float roughness) {
    float r = (roughness + 1.0);
    float k = (r*r) / 8.0;
    float nom = NdotV;
    float denom = NdotV * (1.0 - k) + k;
    return nom / denom;
}
// ADD--------------------------------------------------------
float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0);
    float ggx2 = GeometrySchlickGGX(NdotV, roughness);
    float ggx1 = GeometrySchlickGGX(NdotL, roughness);
    return ggx1 * ggx2;
}
// ADD----------------------------------------
vec3 fresnelSchlick(float cosTheta, vec3 F0) {
    return F0 + (1.0 - F0) * pow(max(1.0 - cosTheta, 0.0), 5.0);
}
// DIVIDE---------------------------------------------
float pointToLineDistance(vec3 x0, vec3 x1, vec3 x2) {
    //x0: point, x1: linePointA, x2: linePointB
    //https://mathworld.wolfram.com/Point-LineDistance3-Dimensional.html
    return length(cross(x0-x1,x0-x2))/length(x2-x1);
}
float pointPlaneDistance(vec3 point,vec3 planePoint,vec3 planeNormal){
    // https://mathworld.wolfram.com/Point-PlaneDistance.html
    //// https://en.wikipedia.org/wiki/Plane_(geometry)
    //// http://paulbourke.net/geometry/pointlineplane/
    float a=planeNormal.x,b=planeNormal.y,c=planeNormal.z;
    float x0=point.x,y0=point.y,z0=point.z;
    float x=planePoint.x,y=planePoint.y,z=planePoint.z;
    float d=-(a*x+b*y+c*z);
    float distance=(a*x0+b*y0+c*z0+d)/sqrt(a*a+b*b+c*c);
    return distance;
}
float getDepth( const in vec2 uv ) {
    return texture2D( tDepth, uv ).x;
}
float getViewZ( const in float depth ) {
    #ifdef PERSPECTIVE_CAMERA
    return perspectiveDepthToViewZ( depth, cameraNear, cameraFar );
    #else
    return orthographicDepthToViewZ( depth, cameraNear, cameraFar );
    #endif
}
vec3 getViewPosition( const in vec2 uv, const in float depth/*clip space*/, const in float clipW ) {
    vec4 clipPosition = vec4( ( vec3( uv, depth ) - 0.5 ) * 2.0, 1.0 );//ndc
    clipPosition *= clipW; //clip
    return ( cameraInverseProjectionMatrix * clipPosition ).xyz;//view
}
vec3 getViewNormal( const in vec2 uv ) {
    return unpackRGBToNormal( texture2D( tNormal, uv ).xyz );
}
vec2 viewPositionToXY(vec3 viewPosition){
    vec2 xy;
    vec4 clip=cameraProjectionMatrix*vec4(viewPosition,1);
    xy=clip.xy;//clip
    float clipW=clip.w;
    xy/=clipW;//NDC
    xy=(xy+1.)/2.;//uv
    xy*=resolution;//screen
    return xy;
}
void main(){

    float metalness=texture2D(tMetalness,vUv).b;
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

            if(hit){
                vec3 vN=getViewNormal( uv );
                if(dot(viewReflectDir,vN)>=0.) continue;
                float distance=pointPlaneDistance(vP,viewPosition,viewNormal);
                if(distance>maxDistance) break;
                float op=opacity;
                #ifdef DISTANCE_ATTENUATION
                float ratio=1.-(distance/maxDistance);
                float attenuation=ratio*ratio;
                op=opacity*attenuation;
                #endif
                #ifdef FRESNEL
                float fresnelCoe=(dot(viewIncidentDir,viewReflectDir)+1.)/2.;
                op*=fresnelCoe;
                #endif
                op*=metalness;
                vec4 reflectColor=texture2D(tDiffuse,uv);
                gl_FragColor.xyz=reflectColor.xyz;
                gl_FragColor.a=op;
                break;
            }
        }
    }
}


#include <common>
uniform sampler2D tDiffuse;
varying vec2 vUv;
uniform float width;
uniform float height;
uniform float kernel[9];
uniform float amount;

void main(){
    float step_w = 1.0/width;
    float step_h = 1.0/height;
    vec2 offset[9];
    float alpha = 0.0;
    offset[0] = vec2(-step_w, -step_h);
    offset[1] = vec2(0.0, -step_h);
    offset[2] = vec2(step_w, -step_h);
    offset[3] = vec2(-step_w, 0.0);
    offset[4] = vec2(0.0, 0.0);
    offset[5] = vec2(step_w, 0.0);
    offset[6] = vec2(-step_w, step_h);
    offset[7] = vec2(0.0, step_h);
    offset[8] = vec2(step_w, step_h);
    vec3 sum = vec3(0.0);
    for ( int i = 0; i < 9; i++) {
        sum += texture2D( tDiffuse, vUv + offset[i]).rgb * kernel[i] * amount;
        // alpha += texture2D( tDiffuse, vUv + offset[i]).a;
    }
    sum += texture2D( tDiffuse, vUv).rgb * 1.0;
    alpha = texture2D(tDiffuse, vUv).a;
    gl_FragColor = vec4(sum, alpha);
}
