// Parametric geometry shared by the WebGL renderer and geometry checks.
const TAU = Math.PI * 2;

export function ribbonSurface(u, v, phase = 0) {
  const major = 170 + Math.sin(u * 2 + .7) * 28;
  const minor = 93 + Math.sin(u * 3) * 13 + Math.cos((v - phase) * 55) * 2.4;
  const radius = major + minor * Math.cos(v);
  const x = radius * Math.cos(u), y = radius * Math.sin(u);
  const z = minor * Math.sin(v) + Math.sin(u * 2) * 38;
  // Preserve the original sculpture's tilted, asymmetric silhouette.
  const tiltedY = y * Math.cos(.97) - z * Math.sin(.97);
  return [
    (x * Math.cos(-.6) - tiltedY * Math.sin(-.6)) * 1.3,
    -(x * Math.sin(-.6) + tiltedY * Math.cos(-.6)) * 1.64,
    y * Math.sin(.97) + z * Math.cos(.97)
  ];
}

export function buildRibbonMesh(majorSegments = 144, minorSegments = 440) {
  const vertexCount = (majorSegments + 1) * (minorSegments + 1);
  if (vertexCount > 65535) throw new RangeError('Ribbon exceeds 16-bit vertex indices');
  const vertices = new Float32Array(vertexCount * 2);
  const indices = new Uint16Array(majorSegments * minorSegments * 6);
  const minimum = [Infinity, Infinity, Infinity], maximum = [-Infinity, -Infinity, -Infinity];
  let offset = 0;
  for (let i = 0; i <= majorSegments; i++) {
    const u = i / majorSegments * TAU;
    for (let j = 0; j <= minorSegments; j++) {
      const v = j / minorSegments * TAU, point = ribbonSurface(u, v);
      for (let axis = 0; axis < 3; axis++) {
        minimum[axis] = Math.min(minimum[axis], point[axis]);
        maximum[axis] = Math.max(maximum[axis], point[axis]);
      }
      vertices[offset++] = u; vertices[offset++] = v;
    }
  }
  const center = minimum.map((value, axis) => (value + maximum[axis]) / 2);
  let radius = 0;
  for (let i = 0; i < vertices.length; i += 2) {
    const point = ribbonSurface(vertices[i], vertices[i + 1]);
    radius = Math.max(radius, Math.hypot(...point.map((value, axis) => value - center[axis])));
  }
  offset = 0;
  const stride = minorSegments + 1;
  for (let i = 0; i < majorSegments; i++) for (let j = 0; j < minorSegments; j++) {
    const a = i * stride + j, b = a + stride;
    indices.set([a, a + 1, b, a + 1, b + 1, b], offset);
    offset += 6;
  }
  // Allow up to 8 model units for moving ribs while keeping a fixed camera.
  return {vertices, indices, bounds: new Float32Array([...center, 1 / (radius + 9)])};
}

export function ribbonProjection(aspect) {
  const near = .1, far = 10, f = 4 * Math.min(1, aspect) / 1.12;
  return new Float32Array([
    f/aspect, 0, 0, 0, 0, f, 0, 0,
    0, 0, (far+near)/(near-far), -1, 0, 0, 2*far*near/(near-far), 0
  ]);
}
