precision highp float;

uniform float texSize;
uniform sampler2D frequencies;

const float EPSILON = 0.01;

const vec4 bitEncode = vec4(1.0, 255.0, 65025.0, 16581375.0);
vec4 encodeFloat(float value) {
    vec4 encoded = bitEncode * value;
    encoded = fract(encoded);
    encoded -= encoded.yzww * vec2(1.0 / 255.0, 0.0).xxxy;
    return encoded;
}

void main() {
    vec2 coord = gl_FragCoord.xy - 0.5;
    float ind = coord.x + coord.y * texSize;

    float modInd = mod(ind, 3.0);
    float normInd = 3.0 * ind / (texSize * texSize);

    if (modInd < EPSILON) {
        gl_FragColor = encodeFloat(normInd);
    } else if (modInd < 1.0 + EPSILON) {
        gl_FragColor = encodeFloat(0.0);
    } else {
        vec4 freq = texture2D(frequencies, vec2(normInd, 0.5));
        gl_FragColor = encodeFloat(freq.x);
    }
}
