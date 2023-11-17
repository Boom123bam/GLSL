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

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}
float rand(float n){return fract(sin(n) * 43758.5453123);}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

// void mainImage( out vec4 fragColor, in vec2 fragCoord )
void main()
{
    // vec2 uv = fragCoord/iResolution.xy;
    vec2 uv = fragCoord/iResolution.y;
    // vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;

    float mouseDist = distance(uv, iMouse.xy/iResolution.y);
    uv *= 45.;
    uv.x += 2.;
    uv.y += floor(rand(floor(uv.x)) * iTime * 15.);
    // uv.y += iTime * 1.;

    vec3 pink = vec3(1., 200.0 / 255.0, 200.0 / 255.0);

    float colDelta = fract(rand(floor(uv)) + iTime * .01);

    float size = 1.75 - colDelta;

    size -= max(.5 - (mouseDist + .1) * .8, 0.);

    vec2 f = fract(uv);
    vec3 col = vec3(step(size/2., max(abs(f.x - .5),abs(f.y - .5))));
    col.gb -=  colDelta * .3;
    // col.gb *=  .7;

    fragColor = vec4(col,1.0);
}

