attribute float vertexInd;

uniform mat4 view;
uniform mat4 proj;
uniform float texSize;
uniform sampler2D positions;

const float PX_PER_POS = 3.0;

const vec4 bitDecode = 1.0 / vec4(1.,255.,65025.,16581375.);
float decodeFloat (vec4 rgba) {
    float decoded = dot(rgba, bitDecode);
    return decoded * 2.0 - 1.0; // map to range (-1, 1)
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
    float pointInd = floor(vertexInd / PX_PER_POS);
    vec4 xPixel = texture2D(positions, indToCoord(pointInd * PX_PER_POS));
    vec4 yPixel = texture2D(positions, indToCoord(pointInd * PX_PER_POS + 1.0));
    vec4 zPixel = texture2D(positions, indToCoord(pointInd * PX_PER_POS + 2.0));
    vec4 position = vec4(
        decodeFloat(xPixel),
        decodeFloat(yPixel) * 15.0,
        decodeFloat(zPixel),
        1.0
    );

    gl_Position = proj * view * position;
}
