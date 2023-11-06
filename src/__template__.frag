#define PI 3.14159265359

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
    //vec2 uv = fragCoord/iResolution.y;
    //vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;

    vec3 col = vec3(uv, 0.);

    fragColor = vec4(col,1.0);
}
