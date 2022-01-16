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