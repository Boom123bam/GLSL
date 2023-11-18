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



vec3 random3(vec3 c) {
  float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
  vec3 r;
  r.z = fract(512.0*j);
  j *= .125;
  r.x = fract(512.0*j);
  j *= .125;
  r.y = fract(512.0*j);
  return r-0.5;
}

/* skew constants for 3d simplex functions */
const float F3 =  0.3333333;
const float G3 =  0.1666667;

/* 3d simplex noise by nikat */
float simplex3d(vec3 p) {
   /* 1. find current tetrahedron T and it's four vertices */
   /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
   /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/
   
   /* calculate s and x */
   vec3 s = floor(p + dot(p, vec3(F3)));
   vec3 x = p - s + dot(s, vec3(G3));
   
   /* calculate i1 and i2 */
   vec3 e = step(vec3(0.0), x - x.yzx);
   vec3 i1 = e*(1.0 - e.zxy);
   vec3 i2 = 1.0 - e.zxy*(1.0 - e);
     
   /* x1, x2, x3 */
   vec3 x1 = x - i1 + G3;
   vec3 x2 = x - i2 + 2.0*G3;
   vec3 x3 = x - 1.0 + 3.0*G3;
   
   /* 2. find four surflets and store them in d */
   vec4 w, d;
   
   /* calculate surflet weights */
   w.x = dot(x, x);
   w.y = dot(x1, x1);
   w.z = dot(x2, x2);
   w.w = dot(x3, x3);
   
   /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
   w = max(0.6 - w, 0.0);
   
   /* calculate surflet components */
   d.x = dot(random3(s), x);
   d.y = dot(random3(s + i1), x1);
   d.z = dot(random3(s + i2), x2);
   d.w = dot(random3(s + 1.0), x3);
   
   /* multiply d by w^4 */
   w *= w;
   w *= w;
   d *= w;
   
   /* 3. return the sum of the four surflets */
   return dot(d, vec4(52.0));
}

// void mainImage( out vec4 fragColor, in vec2 fragCoord )
void main()
{
    vec2 uv = fragCoord/iResolution.y;
    uv *= 10.;

    vec3 col1 = vec3(0.349, 0.4392, 0.851);
    vec3 col2 = vec3(0.7373, 0.7647, 0.8784);
    vec3 col = vec3(mix(col1,col2,simplex3d(vec3(floor(uv), iTime*.4))));
    
    vec2 centDist = abs(fract(uv)-.5);
    col *= step(max(centDist.x, centDist.y), 0.48);
    col *= step(length(centDist), 0.65);

    fragColor = vec4(col,1.0);
}

