precision mediump float;

varying vec2 vTexCoord;
uniform float uAspectRatio;

void main() {
    vec2 uv = vTexCoord;
    uv.x *= uAspectRatio;
    uv.y = 1. - uv.y;
    
    gl_FragColor = vec4(uv, 0., 1.);
}