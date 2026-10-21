import {buildRibbonMesh, ribbonProjection} from './ribbon-geometry.js?v=matte-morph-1';

function initializeRibbon() {
  const original = document.querySelector('#hero-art');
  const toggle = document.querySelector('.ribbon-motion-toggle');
  if (!original || !toggle) return;
  const canvas = original.cloneNode(false);
  let gl;
  try {
    gl = canvas.getContext('webgl', {
      alpha: true, antialias: true, premultipliedAlpha: false, powerPreference: 'low-power'
    });
  } catch { return; }
  if (!gl) return; // The existing static canvas remains visible.

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches, visible = true, disposed = false;
  let phase = 0, animation = 0, previousTime = 0, paintedTime = 0;
  let width = 0, height = 0, ratio = 0, observer, resizeObserver, program;
  let resize = () => {}, updateAnimation = () => {};
  const buffers = [];
  const vertexSource = `
    attribute vec2 aSurface;
    uniform float uPhase;
    uniform vec4 uBounds;
    uniform mat4 uProjection;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vTint;
    vec3 pose(vec3 point) {
      float tiltedY = point.y * cos(0.97) - point.z * sin(0.97);
      return vec3(
        (point.x * cos(-0.6) - tiltedY * sin(-0.6)) * 1.3,
        -(point.x * sin(-0.6) + tiltedY * cos(-0.6)) * 1.64,
        point.y * sin(0.97) + point.z * cos(0.97)
      );
    }
    void main() {
      float u = aSurface.x, v = aSurface.y;
      float cu = cos(u), su = sin(u), cv = cos(v), sv = sin(v);
      float flow = v - uPhase;
      float breathing = sin(uPhase), wave = sin(2.0 * uPhase);
      float major = 170.0 + sin(2.0 * u + 0.7) * 28.0 + cos(u - 0.3) * breathing * 15.0;
      float minor = 93.0 + sin(3.0 * u) * 13.0 + sin(u + 0.5) * wave * 9.0
        + breathing * 3.0 + cos(flow * 55.0) * 2.4;
      float majorU = cos(2.0 * u + 0.7) * 56.0 - sin(u - 0.3) * breathing * 15.0;
      float minorU = cos(3.0 * u) * 39.0 + cos(u + 0.5) * wave * 9.0;
      float minorV = -sin(flow * 55.0) * 132.0;
      float spine = sin(2.0 * u) * 38.0 + sin(u + 0.6) * breathing * 20.0 + cos(3.0 * u) * wave * 10.0;
      float spineU = cos(2.0 * u) * 76.0 + cos(u + 0.6) * breathing * 20.0 - sin(3.0 * u) * wave * 30.0;
      float radial = major + minor * cv;
      float radialU = majorU + minorU * cv;
      float radialV = minorV * cv - minor * sv;
      vec3 point = vec3(radial * cu, radial * su, minor * sv + spine);
      vec3 tangentU = vec3(radialU * cu - radial * su, radialU * su + radial * cu, minorU * sv + spineU);
      vec3 tangentV = vec3(radialV * cu, radialV * su, minorV * sv + minor * cv);
      vPosition = (pose(point) - uBounds.xyz) * uBounds.w;
      vNormal = normalize(cross(pose(tangentV), pose(tangentU)));
      vTint = vec2(
        0.5 + 0.5 * sin(u + flow + 0.9 * breathing),
        0.5 + 0.5 * cos(2.0 * u - flow + uPhase)
      );
      gl_Position = uProjection * vec4(vPosition + vec3(0.0, 0.0, -4.0), 1.0);
    }
  `;
  const fragmentSource = `
    precision mediump float;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vTint;
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 view = normalize(vec3(0.0, 0.0, 4.0) - vPosition);
      vec3 key = normalize(vec3(-0.8, 0.9, 1.8));
      vec3 fill = normalize(vec3(1.0, -0.25, 1.0));
      vec3 teal = vec3(0.122, 0.620, 0.604);
      vec3 graphite = vec3(0.122, 0.141, 0.188);
      vec3 mint = vec3(0.53, 0.77, 0.70);
      vec3 gold = vec3(0.784, 0.647, 0.416);
      vec3 material = mix(teal, mint, (1.0 - vTint.y) * 0.38);
      material = mix(material, gold, smoothstep(0.60, 1.0, vTint.x) * 0.78);
      material = mix(material, graphite, smoothstep(0.65, 1.0, vTint.y) * 0.32);
      float diffuse = max(dot(normal, key), 0.0);
      float secondary = max(dot(normal, fill), 0.0);
      vec3 color = material * (0.62 + diffuse * 0.32 + secondary * 0.12);
      // Broad, tinted light gives the surface a matte finish without white glare.
      float specular = pow(max(dot(normal, normalize(key + view)), 0.0), 8.0) * 0.055;
      float edge = pow(1.0 - max(dot(normal, view), 0.0), 3.0) * 0.03;
      color += mix(material, mint, 0.5) * specular + teal * edge;
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader); gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  }
  function stop() {
    cancelAnimationFrame(animation); animation = 0; previousTime = 0; paintedTime = 0;
  }
  function fallback() {
    if (disposed) return;
    disposed = true; stop();
    observer?.disconnect(); resizeObserver?.disconnect();
    document.removeEventListener('visibilitychange', updateAnimation);
    window.removeEventListener('resize', resize);
    reducedMotion.removeEventListener('change', motionPreferenceChanged);
    toggle.removeEventListener('click', toggleMotion);
    toggle.hidden = true;
    if (canvas.isConnected) canvas.replaceWith(original);
    for (const buffer of buffers) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
  }

  try {
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    program = gl.createProgram();
    gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
    gl.deleteShader(vertex); gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);

    const mobile = matchMedia('(max-width: 760px)').matches;
    const mesh = mobile ? buildRibbonMesh(112, 330) : buildRibbonMesh();
    const vertexBuffer = gl.createBuffer(), indexBuffer = gl.createBuffer();
    buffers.push(vertexBuffer, indexBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);
    const surface = gl.getAttribLocation(program, 'aSurface');
    gl.enableVertexAttribArray(surface); gl.vertexAttribPointer(surface, 2, gl.FLOAT, false, 8, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);
    gl.enable(gl.DEPTH_TEST); gl.enable(gl.CULL_FACE);
    gl.clearColor(0, 0, 0, 0);
    const flowPhase = gl.getUniformLocation(program, 'uPhase');
    gl.uniform4fv(gl.getUniformLocation(program, 'uBounds'), mesh.bounds);
    const projection = gl.getUniformLocation(program, 'uProjection');
    const indexCount = mesh.indices.length;
    function draw() {
      if (disposed || !width || !height) return;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform1f(flowPhase, phase);
      gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
    }
    function frame(time) {
      animation = 0;
      if (disposed || paused || !visible || document.hidden) return;
      if (previousTime) phase = (phase + Math.min(time - previousTime, 100) * .00018) % (Math.PI * 2);
      previousTime = time;
      // Thirty rendered frames per second keep decorative movement inexpensive.
      if (!paintedTime || time - paintedTime >= 1000 / 30 - 1) { draw(); paintedTime = time; }
      animation = requestAnimationFrame(frame);
    }
    resize = function () {
      if (disposed) return;
      const nextWidth = Math.round(canvas.clientWidth), nextHeight = Math.round(canvas.clientHeight);
      const nextRatio = Math.min(devicePixelRatio || 1, mobile ? 1.25 : 1.5);
      if (!nextWidth || !nextHeight) return;
      if (nextWidth !== width || nextHeight !== height || nextRatio !== ratio) {
        width = nextWidth; height = nextHeight; ratio = nextRatio;
        canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniformMatrix4fv(projection, false, ribbonProjection(width / height));
      }
      draw();
    };
    updateAnimation = function () {
      stop();
      if (!disposed && !paused && visible && !document.hidden) animation = requestAnimationFrame(frame);
    };

    original.replaceWith(canvas);
    resize();
    if (gl.getError() !== gl.NO_ERROR) throw new Error('Unable to initialize the 3D ribbon');
    toggle.hidden = false; updateButton();
    toggle.addEventListener('click', toggleMotion);
    document.addEventListener('visibilitychange', updateAnimation);
    window.addEventListener('resize', resize, {passive: true});
    reducedMotion.addEventListener('change', motionPreferenceChanged);
    canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); fallback(); }, {once: true});
    if ('ResizeObserver' in window) { resizeObserver = new ResizeObserver(resize); resizeObserver.observe(canvas); }
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting; updateAnimation();
      }, {threshold: 0});
      observer.observe(canvas);
    }
    updateAnimation();
  } catch (error) {
    console.warn('The 3D ribbon is unavailable; showing the static sculpture', error);
    fallback();
  }

  function updateButton() {
    const label = paused ? 'Запустить движение' : 'Приостановить движение';
    toggle.setAttribute('aria-label', label); toggle.title = label;
    toggle.dataset.paused = String(paused);
  }
  function toggleMotion() { paused = !paused; updateButton(); updateAnimation(); }
  function motionPreferenceChanged(event) { paused = event.matches; updateButton(); updateAnimation(); }
}

// Wait for the static fallback and the other deferred scripts to finish first.
if (document.readyState === 'complete') initializeRibbon();
else document.addEventListener('DOMContentLoaded', initializeRibbon, {once: true});
