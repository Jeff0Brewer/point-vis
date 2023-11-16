precision highp float;

uniform float texSize;
uniform sampler2D tex0; // frequencies
uniform sampler2D tex1; // last positions

const float EPSILON = 0.01;

// encodes float values in range (0, 1) to rgba bytes
const vec4 bitEncode = vec4(1.0, 255.0, 65025.0, 16581375.0);
vec4 encodeFloat(float value) {
    value = value * 0.9999; // scale down to prevent errors on encoding 1.0
    vec4 encoded = bitEncode * value;
    encoded = fract(encoded);
    encoded -= encoded.yzww * vec2(1.0 / 255.0, 0.0).xxxy;
    return encoded;
}

// decode rgba values to floats in range (0, 1)
const vec4 bitDecode = 1.0 / bitEncode;
float decodeFloat (vec4 rgba) {
    float decoded = dot(rgba, bitDecode);
    return decoded;
}

vec2 indToCoord (float ind) {
    float row = floor(ind / texSize);
    float col = mod(ind, texSize);
    // add 0.5 to center coord on pixel
    return vec2(
        (col + 0.5) / texSize,
        (row + 0.5) / texSize
    );
}

void main() {
    vec2 coord = gl_FragCoord.xy - 0.5;
    float ind = coord.x + coord.y * texSize;

    float modInd = mod(ind, 3.0);
    float normInd = 3.0 * ind / (texSize * texSize);

    vec2 lastPosCoord = indToCoord(ind);
    vec4 lastPosEncoded = texture2D(tex1, lastPosCoord);
    float lastPos = decodeFloat(lastPosEncoded);
    float freq = texture2D(tex0, vec2(normInd, 0.5)).x;

    if (modInd < EPSILON) {
        gl_FragColor = encodeFloat(lastPos);
    } else if (modInd < 1.0 + EPSILON) {
        gl_FragColor = encodeFloat(lastPos);
    } else {
        float zPosition = clamp(lastPos + (freq * 2.0 - 1.0) * 0.05, 1.0, 0.0);
        gl_FragColor = encodeFloat(zPosition);
    }
}
