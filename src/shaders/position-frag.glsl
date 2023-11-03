precision highp float;

uniform sampler2D frequencies;

const vec4 bitEncode = vec4(1.,255.,65025.,16581375.);
vec4 encodeFloat(float value) {
    vec4 encoded = bitEncode * value;
    encoded = fract(encoded);
    encoded -= encoded.yzww * vec2(1./255., 0.).xxxy;
    return encoded;
}

void main() {
    float ind = gl_FragCoord.x * 2048.0 + gl_FragCoord.y;
    float normInd = ind / (2048.0 * 2048.0);
    float modInd = mod(ind, 3.0);
    if (modInd < 1.0) {
        gl_FragColor = encodeFloat(normInd);
    } else if (modInd < 2.0) {
        gl_FragColor = encodeFloat(mod(ind, 2048.0) / 2048.0);
    } else {
        vec4 freq = texture2D(frequencies, vec2(normInd, 0.5));
        gl_FragColor = encodeFloat(freq.x);
    }
}
