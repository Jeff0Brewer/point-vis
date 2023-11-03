precision highp float;

uniform sampler2D frequencies;

void main() {
    vec2 scaled = gl_FragCoord.xy / 2048.0 * 0.5;
    vec2 coord = vec2(scaled.x + scaled.y, 0.5);
    vec4 freq = texture2D(frequencies, coord);
    gl_FragColor = freq;
}
