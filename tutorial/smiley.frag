#define S(a,b,c) smoothstep(a,b,c)
#define faceCol vec3(.9, .6, 0)
vec3 face(vec2 uv){
    vec3 col;
    float d = distance(vec2(0), uv);
    col = step(d,.5) * vec3(.6, .4, 0); // edge

    vec3 innerCol = faceCol; // face
    innerCol -= smoothstep(.4,.48, d) * .15;
    col = mix(col, innerCol, step(d,0.48));
    
    float highlights = step(d,.4) * smoothstep(-0.2, 1., uv.y);
    col = mix(col,vec3(1), highlights);

    return col;
}

vec4 eye(vec2 pos, vec2 uv, vec2 m, float smile){
    float d = distance(pos, uv);

    vec3 innerCol = vec3(1);
    innerCol -= smoothstep(.1,.15, d) * vec3(.2,.2,.1);
    
    vec4 col;
    col.a = smoothstep(.17, .16, d);
    
    float mask = S(.15,.14, d);
    
    col.rgb = mix(faceCol, innerCol, mask); // orange, white
    
    d = distance(pos + (m - .5) * .1, uv);
    
    float innerMask = S(.1,.09,d);
    
    col.rgb = mix(col.rgb, vec3(0), innerMask * mask); // black
    col.rgb = mix(col.rgb, vec3(.5,.7 ,1.), S(.09,.085,d) * mask); // blue
    
    d = distance(pos + (m - .5) * .15, uv);
    
    float pupilSize = .04 + smile*.1;
    
    col.rgb = mix(col.rgb, vec3(0), S(pupilSize+.02,pupilSize,d) * innerMask * mask); // black
    
    uv.y += sin(uv.x * 20. + iTime * 2.) * .01;
    uv.x += sin(uv.y * 25. + iTime * 2.) * .01;
    
    d = distance(pos + vec2(.04), uv); // highlight top
    col.rgb = mix(col.rgb, vec3(1), S(.04,.03,d));
    
    d = distance(pos + vec2(-.04), uv); // highlight bottom
    col.rgb = mix(col.rgb, vec3(1), S(.03,.02,d));
    
    return col;
}

vec4 cheek(vec2 pos, vec2 uv){
    vec3 col = vec3(1,0,0);
    float d = distance(pos, uv);
    return vec4(col, smoothstep(.15,0.,d)*.5);
}

vec4 mouth(vec2 uv, float smile){
    uv.x *= 1. - smile*.5;
    uv.y *= 1.5;
    uv.y += uv.x*uv.x*-6. * smile;
    float d = distance(vec2(0,-.35), uv);
    vec4 col;
    col.rgb = vec3(.5, .2, .2);
    
    col.a = S(.15,.14,d);
    
    vec3 toothCol = vec3(1);
    toothCol -= S(.1,.15,d) * .4; // shadow
    
    d = distance(vec2(0,-.2), uv);
    col.rgb = mix(col.rgb,toothCol, S(.1,.09,d)); // teeth
    
    d = distance(vec2(0,-.5), uv);
    col.rgb = mix(col.rgb,vec3(.8,.3,.3), S(.1,.05,d)); 
    
    
    return col;
}

vec4 brow(vec2 uv, float smile){
    float blur = .015;
    
    
    uv.y += uv.x*uv.x*(1. - smile*.5) -.05;
    uv.y -= smile*.02;
    

    float circ1 = S(.18,.18-blur,distance(uv, vec2(.21,.19)));
    float circ2 = S(.25,.25-blur,distance(uv, vec2(.22,.07)));
    
    
    vec4 col;
    col.a = max(circ1 - circ2,0.);
    col.rgb = vec3(.5, .3, .1);
    
    vec3 highlight = vec3(1) * S(.32, .35, uv.y) * .5;
    
    col.rgb = mix(col.rgb, highlight, S(.9,1.,col.a)) ;

    return col;

}

vec3 smiley(vec2 uv, vec2 m, float smile){
    vec3 col = face(uv);
    
    vec4 cheek1 = cheek(vec2(0.3,-0.2), uv);
    col = mix(col, cheek1.rgb, cheek1.a);
    vec4 cheek2 = cheek(vec2(-0.3,-0.2), uv);
    col = mix(col, cheek2.rgb, cheek2.a);
    
    vec4 eye1 = eye(vec2(0.2,0.1), uv, m, smile);
    col = mix(col, eye1.rgb, eye1.a);
    
    vec4 eye2 = eye(vec2(-0.2,0.1), uv, m, smile);
    col = mix(col, eye2.rgb, eye2.a);
    
    vec4 mouth = mouth(uv, smile);
    col = mix(col, mouth.rgb, mouth.a);
    
    vec4 brow1 = brow(uv, smile);
    col = mix(col, brow1.rgb, brow1.a);
    
    vec4 brow2 = brow(uv * vec2(-1,1), smile);
    col = mix(col, brow2.rgb, brow2.a);
    return col;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
    uv -= .5;
    uv.x *= iResolution.x/iResolution.y;
    
    float smile = .5 - .5 * cos(iTime);
    
    vec2 m = iMouse.xy/iResolution.xy;
    
    uv -= (m-.5) * (.25 - dot(uv,uv));

    fragColor = vec4(smiley(uv, m, smile),1.0);
}