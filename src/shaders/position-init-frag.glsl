precision highp float;

uniform float texSize;

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

void main() {
    vec2 coord = gl_FragCoord.xy - 0.5;
    float ind = coord.x + coord.y * texSize;

    float modInd = mod(ind, 3.0);
    float pointInd = floor(ind / 3.0);

    if (modInd < EPSILON) {
        float xPosition = mod(pointInd, 1000.0) / 1000.0;
        gl_FragColor = encodeFloat(xPosition);
    } else if (modInd < 1.0 + EPSILON) {
        float numPoints = (texSize * texSize) / 3.0;
        float yPosition = pointInd / numPoints;
        gl_FragColor = encodeFloat(yPosition);
    } else {
        gl_FragColor = encodeFloat(0.0);
    }
}
