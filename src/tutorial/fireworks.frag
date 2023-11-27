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
#define S(a,b,c) smoothstep(a,b,c)
#define NUM_PARTICLES 30.
#define NUM_EXPLOSIONS 3.

vec2 hash12(float i){
  float x = fract(6324.3 * sin(i*234.23));
  float y = fract(3496.4 * sin(x + i*754.23));
  return vec2(x,y);
}

vec2 hash12polar(float i){
  float a = fract(6324.3 * sin(i*234.23)) * 2. * PI;
  float d = fract(3496.4 * sin(a + i*754.23));
  return vec2(d * cos(a),d * sin(a));
}

vec3 randCol(float i){
  float r = .75 + .25 * sin(i * 230.3);
  float g = .75 + .25 * sin(i * 231.3);
  float b = .75 + .25 * sin(i * 233.3);
  return vec3(r,g,b);
}

vec3 explosion(vec2 uv, float t, float tInt){
  float brightness = mix(.005, 0., t);
  brightness *= S(.8, .3, t);

  vec3 col;
  for (float i=0.; i < NUM_PARTICLES; i++){
    vec2 dir = hash12polar(i + tInt * 200.);
    vec2 displacement = dir * (-exp(-t * 5.) + 1.) + vec2(0, -.2 + .2 * pow((t * 3. -1.),2.));
    float distToCent = length(uv + displacement);
    col += randCol(tInt) * brightness * (.5 + sin(t * 20. + i) * .5)/distToCent;
  }
  return col;
}

// void mainImage( out vec4 fragColor, in vec2 fragCoord )
void main()
{
    // vec2 uv = fragCoord/iResolution.xy;
    //vec2 uv = fragCoord/iResolution.y;
    vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;

    vec3 col;

    for (float i= 0.;i < NUM_EXPLOSIONS;i++){
      float t = iTime + i/NUM_EXPLOSIONS;
      float tInt = floor(t);
      col += explosion(uv + hash12(i + tInt * 3.) - .5, fract(t), tInt);
    }



    fragColor = vec4(col,1.0);
}

