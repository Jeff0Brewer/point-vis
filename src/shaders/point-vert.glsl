attribute float vertexInd;

uniform sampler2D positions;
uniform mat4 view;
uniform mat4 proj;
uniform vec2 textureSize;
uniform float invDecodeScale;

vec2 indToCoord (float ind) {
    float row = floor(ind / textureSize.x);
    float col = mod(ind, textureSize.x);
    // add 0.5 to center coord on pixel
    return vec2(
        (col + 0.5) / textureSize.x,
        (row + 0.5) / textureSize.y
    );
}

const vec4 bitDecode = 1.0 / vec4(1.,255.,65025.,16581375.);
float decodeFloat (vec4 rgba) {
    float decoded = dot(rgba, bitDecode);
    return decoded * 2.0 - 1.0; // map to range (-1, 1)
}

const float PX_PER_POS = 3.0;

void main() {
    float pointInd = floor(vertexInd / PX_PER_POS);
    vec4 xPixel = texture2D(positions, indToCoord(pointInd * PX_PER_POS));
    vec4 yPixel = texture2D(positions, indToCoord(pointInd * PX_PER_POS + 1.0));
    vec4 zPixel = texture2D(positions, indToCoord(pointInd * PX_PER_POS + 2.0));
    vec4 position = vec4(
        decodeFloat(xPixel),
        decodeFloat(yPixel),
        decodeFloat(zPixel),
        1.0
    );

    gl_Position = proj * view * position;
}
