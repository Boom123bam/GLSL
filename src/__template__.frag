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

// void mainImage( out vec4 fragColor, in vec2 fragCoord )
void main()
{
  vec2 uv = fragCoord/iResolution.xy;
  //vec2 uv = fragCoord/iResolution.y;
  //vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;

  vec3 col = vec3(uv, 0.);

  fragColor = vec4(col,1.0);
}

