vec2 rand2(vec2 st){
    st = vec2( dot(st,vec2(122.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}


float perlin(vec2 st){
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f); 
    
    vec2 a = rand2(i + vec2(0.,0.));
    vec2 b = rand2(i + vec2(1.,0.));
    vec2 c = rand2(i + vec2(0.,1.));
    vec2 d = rand2(i + vec2(1.,1.));
    

    float xTop = mix(
        dot(a, f - vec2(0.,0.)),
        dot(b, f - vec2(1.,0.)),
        u.x);
    float xBot = mix(
        dot(c, f - vec2(0.,1.)),
        dot(d, f - vec2(1.,1.)),
        u.x);
        
    return mix(xTop, xBot, u.y);
}


float onLine(vec2 uv){
    return smoothstep(fract(1. - uv.y), 0.45, 0.55);
}

float noise(float x){
    float i = floor(x);
    float f = fract(x);
    return mix(fract(sin(i)* 3428005.235),fract(sin(i+1.)* 3428005.235), smoothstep(0.,1.,f));
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.y;
    uv *= 5.;
    uv.y += iTime;
    
    float onLine = onLine(uv + perlin(uv/4. + vec2(noise(iTime/5.), -iTime/3.)) * 3.);
    
    vec3 color = vec3 (onLine);

    fragColor = vec4(color,1.0);
}
