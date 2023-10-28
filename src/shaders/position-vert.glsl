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

float floatFromRgba (vec4 rgba) {
    vec4 b = rgba * 255.0;
    float decoded = b.a * 1.0 + b.b * 255.0 + b.g * 65025.0 + b.r * 16581375.0;
    float normalized = (decoded * invDecodeScale) * 2.0 - 1.0; // map to range (-1, 1)
    return normalized;
}

const float PX_PER_POS = 3.0;

void main() {
    float pointInd = floor(vertexInd / PX_PER_POS);
    vec4 xPixel = texture2D(positions, indToCoord(pointInd * PX_PER_POS));
    vec4 yPixel = texture2D(positions, indToCoord(pointInd * PX_PER_POS + 1.0));
    vec4 zPixel = texture2D(positions, indToCoord(pointInd * PX_PER_POS + 2.0));
    vec4 position = vec4(
        floatFromRgba(xPixel),
        floatFromRgba(yPixel),
        floatFromRgba(zPixel),
        1.0
    );

    gl_Position = proj * view * position;
}
