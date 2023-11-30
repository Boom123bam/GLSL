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

float line(float ang, float thickness, float blur){
  float col = S(-blur, blur, ang + thickness );
  col *= S(blur, -blur, ang - thickness );
  return col;
}

float wave(float distFromCent, float dist, float t){
  return 
  sin(distFromCent + dist) * 2.5 + 
  sin(5. * distFromCent + dist * 2.3) * .2 + 
  sin(6.94 * distFromCent + t * .683) * .12 +
  sin(12.9 * distFromCent + t * 1.23) * .05;
}


// void mainImage( out vec4 fragColor, in vec2 fragCoord )
void main()
{
  vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
  uv *= 4.;
  float dist = iMouse.x * 10. / iResolution.x;
  float glow = iMouse.y / iResolution.y;


  float ang = atan(uv.x, uv.y);
  float d = length(uv);

  vec3 col;

  float recD = 1./d;

  vec3 lineCol = hsl2rgb(vec3(recD * 5. + dist, 1, 0.8));

  vec2 newUv;
  
  float blur;
  float thickness;
  for (float i = 0.; i < SECTIONS; i++){
    newUv = uv * rot(2. * PI / SECTIONS * i - dist);
    ang = atan(newUv.x, newUv.y);
    blur = (1. - glow) * .75  * recD;
    thickness = .05;

    col += line(ang + wave(recD * 3., dist, iTime) * .7, thickness, 0.02 ) * lineCol * 1.5;
    // col += line(ang + wave(recD * 3., dist, iTime) * .7, 0., .05 * recD) * lineCol;

    col += line(-ang + wave(recD * 3., dist, iTime) * .7, thickness, 0.02 ) * lineCol * 1.5;
    // col += line(-ang + wave(recD * 3., dist, iTime) * .7, 0., .05 * recD) * lineCol;
  }

  // col *= S(0., .1 , d - .5 - glow * 2.);
  col *= S(0., 2. + glow * 5. , d - .75 - glow * 2.);

  fragColor = vec4(col,1.0);
}

