precision mediump float;

varying vec2 vTexCoord;
uniform float uAspectRatio;
uniform float scale;
uniform vec2 translation;
uniform float x1;
uniform float y1;
uniform float x2;
uniform float y2;

float sdSegment(vec2 p, vec2 a, vec2 b, float r)
{
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - r;
}

void main() {
    vec2 uv = vTexCoord;
    uv.x *= uAspectRatio;
    uv -= translation;
    uv /= scale;
    
    gl_FragColor = vec4(0., 0, 0., smoothstep(sdSegment(uv, 
        vec2(x1, y1),
        vec2(x2, y2),
    0.01), 0., 0.01));
}