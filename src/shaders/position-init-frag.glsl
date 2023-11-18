precision highp float;

uniform float texSize;

const float EPSILON = 0.01;
const float NUM_ROTATE = 1.0;
const float PI = 3.14159;

// encodes float values in range (0, 1) to rgba bytes
const vec4 bitEncode = vec4(1.0, 255.0, 65025.0, 16581375.0);
vec4 encodeFloat(float value) {
    value = value * 0.9999; // scale down to prevent errors on encoding 1.0
    vec4 encoded = bitEncode * value;
    encoded = fract(encoded);
    encoded -= encoded.yzww * vec2(1.0 / 255.0, 0.0).xxxy;
    return encoded;
}

void main() {
    vec2 coord = gl_FragCoord.xy - 0.5;
    float ind = coord.x + coord.y * texSize;
    float maxInd = texSize * texSize / 3.0;

    float angle = ind / maxInd * NUM_ROTATE * PI * 2.0 + PI * 0.5;

    float xyz = mod(ind, 3.0);
    float pos = 0.0;
    if (xyz < 1.0 - EPSILON) {
        pos = (cos(angle) + 1.0) * 0.5;
    } else if (xyz < 2.0 - EPSILON) {
        pos = 0.0;
    } else {
        pos = (sin(angle) + 1.0) * 0.5;
    }
    gl_FragColor = encodeFloat(pos);
}