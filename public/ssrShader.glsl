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

vec3 getDirection(vec2 uv, float face, float rotationY) {
    uv = 2.0 * uv - 1.0;
    vec3 direction = vec3(uv, 1.0);
    if (face == 0.0) {
        direction = direction.zyx;
        direction.z *= -1.0;
    } else if (face == 1.0) {
        direction = direction.xzy;
        direction.z *= -1.0;
    } else if (face == 3.0) {
        direction = direction.zyx;
        direction.x *= -1.0;
    } else if (face == 4.0) {
        direction = direction.xzy;
        direction.y *= -1.0;
    } else if (face == 5.0) {
        direction.xz *= -1.0;
    }

    mat3 rotationMatrix = getRotationMatrix(vec3(0.0, 1.0, 0.0), -rotationY);
    direction = rotationMatrix * direction;

    return direction;
}
void main() {
    vOutputDirection = getDirection(uv, faceIndex, angle);
    gl_Position = vec4( position, 1.0 );
}


    #include <common>\
    varying vec2 vUv;\n\
    uniform sampler2D colorTexture;\n\
    uniform vec2 texSize;\
    uniform vec2 direction;\
    \
    float gaussianPdf(in float x, in float sigma) {\
        return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;\
    }\
    void main() {\n\
          vec2 invSize = 1.0 / texSize;\
          float fSigma = float(SIGMA);\
          float weightSum = gaussianPdf(0.0, fSigma);\
          float alphaSum = 0.0;\
          vec3 diffuseSum = texture2D( colorTexture, vUv).rgb * weightSum;\
          for( int i = 1; i < KERNEL_RADIUS; i ++ ) {\
            float x = float(i);\
            float w = gaussianPdf(x, fSigma);\
            vec2 uvOffset = direction * invSize * x;\
            vec4 sample1 = texture2D( colorTexture, vUv + uvOffset);\
            vec4 sample2 = texture2D( colorTexture, vUv - uvOffset);\
            diffuseSum += (sample1.rgb + sample2.rgb) * w;\
            alphaSum += (sample1.a + sample2.a) * w;\
            weightSum += 2.0 * w;\
          }\
          gl_FragColor = vec4(diffuseSum/weightSum, alphaSum/weightSum);\n\
    }