// Animated water mask fragment shader.
// Outputs a black stencil with alpha based on a wavy waterline.
// Uniforms:
//   u_time        : seconds
//   u_time_scale  : time multiplier
//   u_resolution  : viewport size in pixels
//   u_alpha       : overall opacity (0-1)
//   u_depth       : base water height from bottom (0-1)
//   u_edge        : soft edge size (0-1)
//   u_height      : vertical offset for waves (positive moves down)
//   u_w1_scale    : uv.x multiplier for wave 1
//   u_w2_scale    : uv.x multiplier for wave 2
//   u_w3_scale    : uv.x multiplier for wave 3

precision mediump float;

varying vec2 v_uv;

uniform float u_time;
uniform float u_time_scale;
uniform vec2 u_resolution;
uniform float u_alpha;
uniform float u_depth;
uniform float u_edge;
uniform float u_height;
uniform float u_w1_scale;
uniform float u_w2_scale;
uniform float u_w3_scale;

float wave(vec2 uv) {
  float t = u_time * u_time_scale;
  float w1 = sin((uv.x * u_w1_scale + t) * 1.2);
  float w2 = sin((uv.x * u_w2_scale - t * 1.4) + uv.y * 6.0);
  float w3 = sin((uv.x * u_w3_scale + uv.y * 3.0) - t * 0.9);
  return (w1 * 0.5 + w2 * 0.35 + w3 * 0.15);
}

void main() {
  vec2 uv = v_uv;
  uv.y = clamp(uv.y + u_height, 0.0, 1.0);

  // Normalize for aspect ratio so waves look consistent.
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 waveUv = vec2(uv.x * aspect, uv.y);

  float w = wave(waveUv) * 0.03;
  float waterline = clamp(u_depth + w, 0.0, 1.0);

  // Mask: 1.0 below the waterline, 0.0 above.
  float edge = max(u_edge, 0.001);
  float mask = 1.0 - smoothstep(waterline, waterline + edge, uv.y);

  gl_FragColor = vec4(0.0, 0.0, 0.0, mask * u_alpha);
}
