// Particle quad vertex shader.
// a_position: quad corners in [-1, 1] space.

attribute vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_center;
uniform float u_radius;

varying vec2 v_pos;

void main() {
  v_pos = a_position;
  vec2 pos = u_center + a_position * u_radius;
  vec2 clip = vec2(
    (pos.x / u_resolution.x) * 2.0 - 1.0,
    1.0 - (pos.y / u_resolution.y) * 2.0
  );
  gl_Position = vec4(clip, 0.0, 1.0);
}
