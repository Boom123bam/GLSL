/*
############################################
########## Porting from ShaderToy ##########
############################################
*/

precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

#define fragCoord gl_FragCoord.xy
#define iResolution u_resolution
#define iTime u_time
#define fragColor gl_FragColor
#define iMouse vec4(u_mouse,0.,0.)

/*
############################################
############# Starter Template #############
############################################
*/

#define PI 3.14159265359
#define S(a,b,c) smoothstep(a,b,c)
#define n 12.

vec3 hsl2rgb(in vec3 c)
  {
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
  }

mat2 rot(float ang){
  return mat2(
    cos(ang), -sin(ang),
    sin(ang), cos(ang)
  );
}

vec4 pattern(vec2 uv){
  float t = iTime;
  float size = length(floor(uv + sin(t * .5) * 2.) / 25.);
  uv += vec2(t * .3, t * .5);
  vec2 i = floor(uv);
  float d = max(abs(fract(uv.x) - .5), abs(fract(uv.y) - .5));
  // float d = length(fract(uv) - .5);
  vec4 col = vec4(mod(i.x + i.y,2.));
  col *= step(d, size);
  col.a *= size * 2.;
  col.rgb *=  hsl2rgb(vec3(uv.x + t,1, 0.9));
  return vec4(col);
}

vec4 repeatPattern(vec2 uv){
  vec4 col;

  for(float i = 0.; i < n * 2.; i++){
    col = mix(col, pattern(uv), pattern(uv).a);
    uv *= rot(PI/n);
  }

  return col;
}

// void mainImage( out vec4 fragColor, in vec2 fragCoord )
void main()
{
  vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
  float t = iTime;

  uv *= 5.;

  vec4 col = repeatPattern(uv);

  // fragColor = vec4(col);
  fragColor = vec4(col.xyz,1.);
}

