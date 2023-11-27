precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

#define fragCoord gl_FragCoord.xy
#define iResolution u_resolution
#define iTime u_time
#define fragColor gl_FragColor

#define PI 3.14159265359

void main(){
    vec2 p = (-iResolution.xy + 2.0*fragCoord)/iResolution.y;
        
    vec2 offset = vec2(0,.5);

    // angle of each pixel to the center of the screen
    float a = atan(p.y,p.x) + iTime * .1;
    
    float r = length(p);
    
    r /= min(abs(1./cos(a)), abs(1./cos(a + PI/2.)));
    
    vec2 uv = vec2( 1.0/r + 0.2*iTime, a );

    float f = step(0.,cos(12.0*uv.x)*cos(6.0*uv.y));

    vec3 col = vec3(f);
    
    col *= r;
    
    // output: pixel color
    fragColor = vec4( col, 1. );
}