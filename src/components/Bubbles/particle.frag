// Particle fragment shader: outline + highlights only.

precision mediump float;

varying vec2 v_pos;

uniform vec3 u_light_pos;
uniform float u_outline;
uniform float u_outline_soft;
uniform float u_outline_alpha;
uniform float u_diffuse;
uniform float u_specular;
uniform float u_specular_power;
uniform float u_alpha;

void main() {
  float r = length(v_pos);
  if (r > 1.0) {
    discard;
  }

  float z = sqrt(max(1.0 - r * r, 0.0));
  vec3 normal = normalize(vec3(v_pos, z));
  vec3 lightDir = normalize(u_light_pos);
  vec3 viewDir = vec3(0.0, 0.0, 1.0);

  float diffuse = abs(dot(normal, lightDir)) * u_diffuse;
  vec3 reflectDir = reflect(-lightDir, normal);
  float spec = pow(max(dot(reflectDir, viewDir), 0.0), u_specular_power) * u_specular;

  float outlineOuter = smoothstep(1.0 - u_outline_soft, 1.0, r);
  float outlineInner = smoothstep(1.0 - u_outline - u_outline_soft, 1.0 - u_outline, r);
  float outline = clamp(outlineOuter * (1.0 - outlineInner), 0.0, 1.0) * u_outline_alpha;

  float alpha = clamp(max(outline, diffuse + spec), 0.0, 1.0) * u_alpha;

  gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}
