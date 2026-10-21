// Parametric geometry shared by the WebGL renderer and geometry checks.
const TAU = Math.PI * 2;

function surface(u, v) {
  const major = 170 + Math.sin(u * 2 + .7) * 28;
  const minor = 93 + Math.sin(u * 3) * 13 + Math.cos(v * 55) * 2.4;
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
  const vertices = new Float32Array(vertexCount * 7);
  const indices = new Uint16Array(majorSegments * minorSegments * 6);
  const minimum = [Infinity, Infinity, Infinity], maximum = [-Infinity, -Infinity, -Infinity];
  const epsilon = .0001;
  let offset = 0;
  for (let i = 0; i <= majorSegments; i++) {
    const u = i / majorSegments * TAU;
    for (let j = 0; j <= minorSegments; j++) {
      const v = j / minorSegments * TAU, point = surface(u, v);
      const u0 = surface(u - epsilon, v), u1 = surface(u + epsilon, v);
      const v0 = surface(u, v - epsilon), v1 = surface(u, v + epsilon);
      const a = v1.map((value, axis) => value - v0[axis]);
      const b = u1.map((value, axis) => value - u0[axis]);
      const normal = [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
      const length = Math.hypot(...normal);
      for (let axis = 0; axis < 3; axis++) {
        vertices[offset + axis] = point[axis];
        vertices[offset + axis + 3] = normal[axis] / length;
        minimum[axis] = Math.min(minimum[axis], point[axis]);
        maximum[axis] = Math.max(maximum[axis], point[axis]);
      }
      vertices[offset + 6] = Math.pow(Math.max(0, Math.cos(u - 1.05)), 4) * .18;
      offset += 7;
    }
  }
  const center = minimum.map((value, axis) => (value + maximum[axis]) / 2);
  let radius = 0;
  for (let i = 0; i < vertices.length; i += 7) {
    for (let axis = 0; axis < 3; axis++) vertices[i + axis] -= center[axis];
    radius = Math.max(radius, Math.hypot(vertices[i], vertices[i + 1], vertices[i + 2]));
  }
  // A bounding sphere keeps the whole sculpture in frame throughout a full turn.
  for (let i = 0; i < vertices.length; i += 7) {
    vertices[i] /= radius; vertices[i + 1] /= radius; vertices[i + 2] /= radius;
  }
  offset = 0;
  const stride = minorSegments + 1;
  for (let i = 0; i < majorSegments; i++) for (let j = 0; j < minorSegments; j++) {
    const a = i * stride + j, b = a + stride;
    indices.set([a, a + 1, b, a + 1, b + 1, b], offset);
    offset += 6;
  }
  return {vertices, indices};
}

export function ribbonRotation(angle) {
  const tilt = Math.sin(angle) * .12;
  const cy = Math.cos(angle), sy = Math.sin(angle), cx = Math.cos(tilt), sx = Math.sin(tilt);
  return new Float32Array([cy, 0, -sy, sy*sx, cx, cy*sx, sy*cx, -sx, cy*cx]);
}

export function ribbonProjection(aspect) {
  const near = .1, far = 10, f = 4 * Math.min(1, aspect) / 1.12;
  return new Float32Array([
    f/aspect, 0, 0, 0, 0, f, 0, 0,
    0, 0, (far+near)/(near-far), -1, 0, 0, 2*far*near/(near-far), 0
  ]);
}
