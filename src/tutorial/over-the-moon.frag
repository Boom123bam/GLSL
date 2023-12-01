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

float rand(float x){
  return fract(sin(x * 352.9)*253.2);
}

float taperBox(vec2 uv, float blur, float y1, float y2, float w1, float w2){
  float result = S(blur, - blur, uv.y - y1);
  result *= S(-blur, blur, uv.y - y2);

  uv.x = abs(uv.x);

  float height = y1 - y2;
  float width = mix(w2, w1, (uv.y - y2) / height);

  result *= S(blur, -blur, uv.x - width * .5);
  return result;
}

float tree(vec2 uv){
  float col;
  col += taperBox(uv, .005, -.5, -1., .1, .1);
  col += taperBox(uv, .005, 0., -0.5, .4, .8);
  col += taperBox(uv, .005, 0.5, 0., .2, .6);
  col += taperBox(uv, .005, 1., 0.5, 0., .4);

  col *= 1. - taperBox(uv + vec2(-.05, 0.), .01, -.5, -.6, .7, .0) * .9;
  col *= 1. - taperBox(uv + vec2(.3, 0.), .01, 0., -.1, 1.7, .0) * .9;
  col *= 1. - taperBox(uv + vec2(-.3, 0.), .01, 0.5, .4, 1.7, .0) * .9;
  return col;
}

float terrain(float x){
  return sin(x) * .29  + sin(x * .342) * .59 + sin(x * 3.18) * .025;
}

float layer(vec2 uv){
  float col;
  float id = floor(uv.x);
  float terrainHeight = terrain(uv.x);
  float treeHeight = .75 + rand(id * 3.) * .5;
  float treeYPos = terrain(id + .5);
  
  uv.x = fract(uv.x);

  uv.x += -.5;
  uv *= 1.5;
  uv.x += (rand(id) - .5) * .6;

  col += tree(uv * vec2(1,  treeHeight) + vec2(0, treeYPos - .8));
  // floor
  col += S(.01, -.01, uv.y + terrainHeight);
  return min(1.,col);
}

// void mainImage( out vec4 fragColor, in vec2 fragCoord )
void main()
{
  vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
  float t = iTime;

  uv *= 3.;


  float col;

  float scale;
  float Layer;
  for (float i = 0.; i < 1.; i+= 1./3.){
    scale = 1. - i;
    Layer = layer(uv * scale + vec2(t * (i + .2), 1. - i)) * (1. -i);
    col = mix(col, Layer, step(.01, Layer));
  }

  
  // col.r += S(.01, 0., uv.x) * S(-.01, 0., uv.x);
  // col.g += S(.01, 0., uv.y) * S(-.01, 0., uv.y);

  fragColor = vec4(col);
}

