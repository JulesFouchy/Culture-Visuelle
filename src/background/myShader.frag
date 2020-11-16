precision mediump float;

varying vec2 vTexCoord;
uniform float uAspectRatio;
uniform float uHeight;
uniform float scale;
uniform vec2 translation;
uniform float x1[100];
uniform float y1[100];
uniform float x2[100];
uniform float y2[100];

uniform int showEdges[100];
uniform float progress;

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

    float thickness = 0.15 / uHeight;
    float d = 100000.;
    for (int i = 0; i < 100; ++i) {
        if (showEdges[i] == 1) {
            vec2 p1 = vec2(x1[i], y1[i]);
            vec2 p2 = vec2(x2[i], y2[i]);
            d = min(d, sdSegment(uv, p1, p1 + progress * (p2-p1), thickness));
        }
        else if (showEdges[i] == -1) {
            vec2 p1 = vec2(x1[i], y1[i]);
            vec2 p2 = vec2(x2[i], y2[i]);
            d = min(d, sdSegment(uv, p2, p2 + progress * (p1-p2), thickness));
        }
    }
    float t = smoothstep(0., max(d, 0.), thickness * 3.);
    
    gl_FragColor = vec4(vec3(1.), t);
}