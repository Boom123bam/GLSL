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
############################################
*/

#define PI 3.14159265359
#define S(a,b,c) smoothstep(a,b,c)
#define SECTIONS 8.

vec3 hsl2rgb( in vec3 c )
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

float line(float ang, float thickness){
  float col = S(-thickness, thickness, ang + .01 )
  * S(thickness, -thickness, ang - .01 );

  return col;
}

float wave(float d, float t){
  return 
  sin(d + t) * 2. + 
  sin(5. * d + t * 2.3) * .2 + 
  sin(6.94 * d + t * 6.83) * .12 +
  sin(12.9 * d + t * 12.3) * .05;
}

// void mainImage( out vec4 fragColor, in vec2 fragCoord )
void main()
{
  vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
  uv *= 5.5;

  float ang = atan(uv.x, uv.y);
  float d = length(uv);

  float t = iTime;

  vec3 col;

  float recD = 1./d;

  vec3 lineCol = hsl2rgb(vec3(recD * 5. + t, 1, 0.8));

  for (float i = 0.; i < SECTIONS; i++){
    uv *= rot(2. * PI / SECTIONS);
    ang = atan(uv.x, uv.y) + sin(recD) * 2.;
    col += line(ang + wave(recD * 3., t) * .7, .01 * recD) * lineCol * 1.5;
    col += line(ang + wave(recD * 3., t) * .7, .6 * recD) * lineCol;
    col += line(-ang + wave(recD * 3., t) * .7, .01 * recD) * lineCol * 1.5;
    col += line(-ang + wave(recD * 3., t) * .7, .6 * recD) * lineCol;
  }

  col *= S(0., 2. , d - 1.);

  fragColor = vec4(col,1.0);
}

