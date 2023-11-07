precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

#define fragCoord gl_FragCoord.xy
#define iResolution u_resolution
#define iTime u_time
#define fragColor gl_FragColor
#define iMouse vec4(u_mouse,0.,0.)

#define PI 3.14159265359


float rand(float x){
  return fract(sin(x)*953884.234);
}

float noise(float x){
  float i = floor(x);
  float f = smoothstep(0.,1.,fract(x));
  return mix(rand(i), rand(i+1.), f);
}


float rand2D(vec2 x){
  float v = dot(x, vec2(8523.438, 47246.34));
  return fract(sin(v)*953884.234);
}

float noise2D(vec2 x){
  vec2 i = floor(x);
  vec2 f = smoothstep(0.,1.,fract(x));
  float top = mix(rand2D(i + vec2(0,0)), rand2D(i + vec2(1,0)), f.x);
  float bot = mix(rand2D(i + vec2(0,1)), rand2D(i + vec2(1,1)), f.x);
  return mix(top, bot, f.y);
}

float fbm(float x){
  float val = 0.;
  float amp = .5;
  float gain = 0.6;
  float sq = 2.;
  for (int i = 0; i < 7; i++){
    val += amp * noise(x);
    amp *= gain;
    x *= sq;
  }
  return val;
}

float fbm(vec2 st){
  float val = 0.;
  float amp = .5;
  float gain = 0.6;
  float sq = 2.;
  for (int i = 0; i < 10; i++){
    val += amp * noise2D(st);
    amp *= gain;
    st *= sq;
  }
  return val;
}


// void mainImage( out vec4 fragColor, in vec2 fragCoord )
void main()
{
    vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;

    uv *= 2.;

    uv += iTime/10.;
    
    float n =fbm(uv);

    vec3 col = vec3(n);

    fragColor = vec4(col,1.0);
}
