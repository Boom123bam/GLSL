# GLSL Shaders

This is my personal collection of GLSL shaders

## Setup

The setup replicates the ShaderToy setup in VsCode

1. Clone repo
2. In VsCode, install the glslCanvas extension, and optionally a GLSL linting extension
3. Open a .frag file
4. Run "Show glslCanvas"

## Porting from ShaderToy

First ,add this snippet in front of the file (also found in \_\_template\_\_.frag)

```glsl
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

#define fragCoord gl_FragCoord.xy
#define iResolution u_resolution
#define iTime u_time
#define fragColor gl_FragColor
#define iMouse vec4(u_mouse,0.,0.)
```

Next, change the following:

```
void mainImage( out vec4 fragColor, in vec2 fragCoord )
```

to

```
void main()
```

Done! Vice versa when porting to ShaderToy.

---

### Remarks

- There is a shadertoy plugin that works without having to change any code, but it is slightly buggy, and less feature rich.
