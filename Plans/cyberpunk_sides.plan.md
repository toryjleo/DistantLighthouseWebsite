# Cyberpunk Window Shader Plan

## Goal
Replace the current “bubble”/ambient background on the Cyberpunk Ledger page with a stylized cyberpunk scene:
- A scrolling grid on a plane
- Vertex-displaced “mountain range” on the plane via noise in the vertex shader
- A glowing sphere (“sun”) behind the plane
- All key colors and light settings exposed as shader inputs/uniforms
- Camera positioned close to the plane (near `y = 1`) facing the scene

## Scope
- Applies only to `/projects/cyberpunk-ledger` (do not affect other pages)
- WebGL scene rendered in a fixed “window” layer behind the ledger UI
- No external 3D assets; everything generated procedurally

## Technical Approach
1. **Create a new component** for the cyberpunk window scene (React + Three/Fiber).
   - File: `src/components/Cyberpunk/CyberpunkWindow.jsx`
2. **Render a plane** with a custom `ShaderMaterial`:
   - Vertex shader: apply 2D noise to displace vertices for a rolling mountain range.
   - Fragment shader: draw a scrolling grid (UV-based), with optional glow/scanline effects.
3. **Add a glowing sphere** behind the plane:
   - Mesh: `sphereGeometry`
   - Material: emissive or shader-based glow
4. **Expose shader uniforms** for colors and lighting:
   - `uGridColor`, `uGlowColor`, `uSunColor`, `uAmbient`, `uLightDir`, `uLightStrength`
   - `uHeightScale`, `uNoiseScale`, `uScrollSpeed`, `uTime`
5. **Camera placement**:
   - Positioned near plane, e.g. `camera.position = [0, 1, 4]`
   - Look at `0, 0, 0`
6. **Integrate on Cyberpunk Ledger page**:
   - Add the new component as a background layer in `src/pages/CyberpunkLedger.jsx`
   - Ensure it sits behind content (z-index) and doesn’t capture pointer events

## Uniform Defaults (Initial)
- `uGridColor`: `#62f2ff`
- `uGlowColor`: `#ff4f8b`
- `uSunColor`: `#ff9f5a`
- `uAmbient`: `0.35`
- `uLightDir`: `[0.4, 0.8, 0.5]`
- `uLightStrength`: `0.85`
- `uHeightScale`: `0.45`
- `uNoiseScale`: `1.5`
- `uScrollSpeed`: `0.2`

## Acceptance Criteria
- The grid scrolls smoothly with time.
- The plane shows noticeable vertex-displaced “mountains.”
- The sphere glows behind the plane and is visually distinct.
- Colors and light are easily adjusted via shader uniforms.
- The effect only appears on the Cyberpunk Ledger page.

## Risks / Considerations
- Performance: use modest plane subdivisions and cap DPR to 2.
- Visual layering: ensure the scene stays behind ledger UI with proper z-index.
- Accessibility: keep brightness controlled to avoid overpowering text.

## Next Steps (Execution Order)
1. Build the new Cyberpunk window component with shaders.
2. Integrate it into the Cyberpunk Ledger page layout.
3. Tune uniforms and camera position for visual balance.
4. Verify the effect only appears on the target route.
