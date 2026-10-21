// Four quarter-circle modules from the brand mark, extruded into matte pillars.
const COLORS = [[.122, .620, .604], [.122, .141, .188], [.89, .88, .84], [.784, .647, .416]];
const TARGETS = [2.05, 2.65, 1.15, 1.65];
const ROOT_HALF = Math.SQRT1_2;

function makePillars() {
  const data = [];
  function vertex(point, normal, color, pillar = -1, lift = 0) { data.push(...point, ...normal, ...color, pillar, lift); }
  function triangle(points, normals, color, pillar = -1, lifts = [0, 0, 0]) {
    points.forEach((point, index) => vertex(point, Array.isArray(normals[0]) ? normals[index] : normals, color, pillar, lifts[index]));
  }
  function quad(points, normal, color, pillar = -1, lifts = [0, 0, 0, 0]) {
    triangle([points[0], points[1], points[2]], normal, color, pillar, [lifts[0], lifts[1], lifts[2]]);
    triangle([points[0], points[2], points[3]], normal, color, pillar, [lifts[0], lifts[2], lifts[3]]);
  }
  // A transparent contact shadow and a shallow solid foundation anchor the columns.
  quad([[-2.15,-2.15,-.025],[2.15,-2.15,-.025],[2.15,2.15,-.025],[-2.15,2.15,-.025]], [0,0,1], COLORS[1], -2);
  const edge = 1.36, bevel = .12, bottom = .02, top = .16;
  const outline = [[-edge+bevel,-edge],[edge-bevel,-edge],[edge,-edge+bevel],[edge,edge-bevel],[edge-bevel,edge],[-edge+bevel,edge],[-edge,edge-bevel],[-edge,-edge+bevel]];
  for (let i = 0; i < outline.length; i++) {
    const a = outline[i], b = outline[(i+1)%outline.length];
    const length = Math.hypot(b[0]-a[0], b[1]-a[1]);
    triangle([[0,0,top],[...a,top],[...b,top]], [0,0,1], [.91,.925,.915]);
    quad([[...a,bottom],[...b,bottom],[...b,top],[...a,top]], [(b[1]-a[1])/length,-(b[0]-a[0])/length,0], [.82,.845,.83]);
  }
  for (let pillar = 0; pillar < 4; pillar++) {
    const sx = pillar%2 ? -1 : 1, sy = pillar>1 ? -1 : 1;
    const origin = [-1.08*sx, -1.08*sy, top], color = COLORS[pillar], radius = .995;
    const point = angle => [origin[0]+Math.cos(angle)*radius*sx,origin[1]+Math.sin(angle)*radius*sy,top];
    for (let i = 0; i < 72; i++) {
      const a = i/72*Math.PI/2, b = (i+1)/72*Math.PI/2, p = point(a), q = point(b);
      triangle([origin,p,q], [0,0,1], color, pillar, [1,1,1]);
      const na = [Math.cos(a)*sx,Math.sin(a)*sy,0], nb = [Math.cos(b)*sx,Math.sin(b)*sy,0];
      triangle([p,q,q], [na,nb,nb], color, pillar, [0,0,1]);
      triangle([p,q,p], [na,nb,na], color, pillar, [0,1,1]);
    }
    quad([origin,point(0),point(0),origin], [0,-sy,0], color, pillar, [0,0,1,1]);
    quad([point(Math.PI/2),origin,origin,point(Math.PI/2)], [-sx,0,0], color, pillar, [0,0,1,1]);
  }
  return new Float32Array(data);
}

function pillarHeights(time, settled = false) {
  return TARGETS.map((height, index) => {
    const progress = settled ? 1 : Math.max(0,Math.min(1,(time-index*.3)/2.8));
    const ease = progress*progress*(3-2*progress);
    // A restrained wave continues after the entrance, with no jump or loop reset.
    const wave = settled ? 0 : Math.sin(time*.68-index*.9)*.12*ease;
    return .025+(height-.025)*ease+wave;
  });
}

function initializePillars() {
  const canvas = document.querySelector('#hero-art'), toggle = document.querySelector('.ribbon-motion-toggle');
  if (!canvas || !toggle) return;
  const mesh = makePillars(), reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let gl, program, buffer, disposed = false, paused = reduced.matches, visible = true;
  let elapsed = reduced.matches ? 6 : 0, frameId = 0, previous = 0, painted = 0;
  let width = 0, height = 0, observer, resizeObserver;
  try { gl = canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false,powerPreference:'low-power'}); } catch {}

  function updateButton() {
    toggle.dataset.paused = String(paused);
    const label = paused ? 'Запустить движение' : 'Приостановить движение';
    toggle.setAttribute('aria-label',label); toggle.title = label;
  }
  function stop() { cancelAnimationFrame(frameId); frameId = 0; previous = 0; painted = 0; }
  function updateAnimation() {
    stop();
    if (!disposed && !paused && visible && !document.hidden) frameId = requestAnimationFrame(frame);
  }
  function frame(time) {
    frameId = 0;
    if (disposed || paused || !visible || document.hidden) return;
    if (previous) elapsed += Math.min(time-previous,100)/1000;
    previous = time;
    if (!painted || time-painted >= 1000/30-1) { draw(); painted = time; }
    frameId = requestAnimationFrame(frame);
  }
  function toggleMotion() { paused = !paused; updateButton(); updateAnimation(); }
  function preferenceChanged(event) {
    paused = event.matches;
    if (paused) { elapsed = Math.max(elapsed,6); draw(true); }
    updateButton(); updateAnimation();
  }
  function resize() {
    if (disposed) return;
    width = Math.round(canvas.clientWidth); height = Math.round(canvas.clientHeight);
    if (!width || !height) return;
    const ratio = Math.min(devicePixelRatio || 1, width < 400 ? 1.5 : 2);
    canvas.width = Math.round(width*ratio); canvas.height = Math.round(height*ratio);
    gl.viewport(0,0,canvas.width,canvas.height);
    const aspect = width/height;
    gl.uniform2f(gl.getUniformLocation(program,'uScale'),2/(5.2*Math.max(1,aspect)),2/(5.2*Math.max(1,1/aspect)));
    draw(reduced.matches);
  }
  function draw(settled = false) {
    if (disposed || !width || !height) return;
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.uniform4fv(gl.getUniformLocation(program,'uHeights'),pillarHeights(elapsed,settled));
    gl.drawArrays(gl.TRIANGLES,0,mesh.length/11);
  }
  function staticFallback() {
    if (disposed) return;
    stop(); disposed = true;
    observer?.disconnect(); resizeObserver?.disconnect();
    document.removeEventListener('visibilitychange',updateAnimation);
    window.removeEventListener('resize',resize);
    reduced.removeEventListener('change',preferenceChanged);
    toggle.removeEventListener('click',toggleMotion); toggle.hidden = true;
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
    const still = canvas.cloneNode(false);
    canvas.replaceWith(still);
    const context = still.getContext('2d');
    if (!context) return;
    function paint() {
      const w = still.clientWidth, h = still.clientHeight;
      if (!w || !h) return;
      const ratio = Math.min(devicePixelRatio || 1,2), scale = Math.min(w,h)/5.2;
      still.width = Math.round(w*ratio); still.height = Math.round(h*ratio);
      context.setTransform(ratio,0,0,ratio,0,0);
      const heights = pillarHeights(6,true), faces = [];
      for (let i = 6*11; i < mesh.length; i += 33) {
        const points = [], depths = [];
        for (let j = 0; j < 3; j++) {
          const at = i+j*11, x = mesh[at], y = mesh[at+1], z = mesh[at+2]+mesh[at+10]*(heights[mesh[at+9]] || 0);
          points.push([w/2+(x-y)*ROOT_HALF*scale,h/2-(-(x+y)*.362+z*.859-.75)*scale]);
          depths.push((x+y)*.607+z*.512);
        }
        const light = Math.max(0,mesh[i+3]*-.47+mesh[i+4]*.21+mesh[i+5]*.86);
        faces.push({points,depth:depths.reduce((a,b)=>a+b)/3,color:`rgb(${[mesh[i+6],mesh[i+7],mesh[i+8]].map(c=>Math.round(c*(.64+.36*light)*255)).join(',')})`});
      }
      context.save(); context.translate(w/2,h*.76); context.scale(1,.27);
      const shadow = context.createRadialGradient(0,0,0,0,0,w*.43);
      shadow.addColorStop(0,'#1f243024'); shadow.addColorStop(1,'#1f243000');
      context.fillStyle = shadow; context.fillRect(-w/2,-w/2,w,w); context.restore();
      faces.sort((a,b)=>a.depth-b.depth);
      for (const face of faces) {
        context.beginPath(); face.points.forEach(([x,y],index)=>index?context.lineTo(x,y):context.moveTo(x,y)); context.closePath();
        context.fillStyle = face.color; context.strokeStyle = face.color; context.lineWidth = .4; context.fill(); context.stroke();
      }
    }
    if ('ResizeObserver' in window) new ResizeObserver(paint).observe(still);
    window.addEventListener('resize',paint,{passive:true}); paint();
  }
  if (!gl) { staticFallback(); return; }
  try {
    const shaders = [
      [gl.VERTEX_SHADER,`
        attribute vec3 aPosition; attribute vec3 aNormal; attribute vec3 aColor;
        attribute float aPillar; attribute float aLift;
        uniform vec4 uHeights; uniform vec2 uScale;
        varying vec3 vColor; varying vec3 vNormal; varying vec3 vPosition; varying float vGround;
        void main() {
          float height = aPillar < .5 ? uHeights.x : aPillar < 1.5 ? uHeights.y : aPillar < 2.5 ? uHeights.z : uHeights.w;
          vec3 point = aPosition + vec3(0.,0.,aLift*height);
          float x = (point.x-point.y)*.70710678;
          float y = -(point.x+point.y)*.362+point.z*.859-.75;
          float depth = (point.x+point.y)*.607+point.z*.512;
          gl_Position = vec4(vec2(x,y)*uScale,-depth*.1,1.);
          vColor = aColor; vNormal = aNormal; vPosition = point; vGround = aPillar < -1.5 ? 1. : 0.;
        }
      `],
      [gl.FRAGMENT_SHADER,`
        precision mediump float;
        varying vec3 vColor; varying vec3 vNormal; varying vec3 vPosition; varying float vGround;
        void main() {
          if (vGround > .5) {
            vec2 distance = vPosition.xy*vec2(.8,.8);
            float alpha = exp(-dot(distance,distance)*1.15)*.18;
            gl_FragColor = vec4(.122,.141,.188,alpha);
          } else {
            vec3 normal = normalize(vNormal);
            float diffuse = max(dot(normal,normalize(vec3(-.55,.25,1.))),0.);
            float fill = max(dot(normal,normalize(vec3(1.,1.,.6))),0.);
            float ambient = .64+.29*diffuse+.12*fill;
            float contact = smoothstep(.12,.65,vPosition.z);
            vec3 color = vColor*ambient*mix(.89,1.,contact);
            gl_FragColor = vec4(color,1.);
          }
        }
      `]
    ].map(([type,source]) => {
      const shader = gl.createShader(type); gl.shaderSource(shader,source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) { const message = gl.getShaderInfoLog(shader); gl.deleteShader(shader); throw new Error(message); }
      return shader;
    });
    program = gl.createProgram(); shaders.forEach(shader=>gl.attachShader(program,shader)); gl.linkProgram(program);
    shaders.forEach(shader=>gl.deleteShader(shader));
    if (!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program); buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer); gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);
    for (const [name,size,offset] of [['aPosition',3,0],['aNormal',3,3],['aColor',3,6],['aPillar',1,9],['aLift',1,10]]) {
      const attribute = gl.getAttribLocation(program,name);
      gl.enableVertexAttribArray(attribute); gl.vertexAttribPointer(attribute,size,gl.FLOAT,false,44,offset*4);
    }
    gl.enable(gl.DEPTH_TEST); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA); gl.clearColor(0,0,0,0);
    resize();
    if (gl.getError() !== gl.NO_ERROR) throw new Error('Unable to initialize the pillars');
    toggle.hidden = false; updateButton(); toggle.addEventListener('click',toggleMotion);
    document.addEventListener('visibilitychange',updateAnimation); window.addEventListener('resize',resize,{passive:true});
    reduced.addEventListener('change',preferenceChanged);
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();staticFallback();},{once:true});
    if ('ResizeObserver' in window) { resizeObserver = new ResizeObserver(resize); resizeObserver.observe(canvas); }
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries=>{visible = entries[0].isIntersecting;updateAnimation();},{threshold:0}); observer.observe(canvas);
    }
    updateAnimation();
  } catch (error) { console.warn('Showing the static pillars instead of the animation',error); staticFallback(); }
}

if (document.readyState !== 'loading') initializePillars();
else document.addEventListener('DOMContentLoaded',initializePillars,{once:true});
