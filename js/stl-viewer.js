/* ==========================================================================
   Tiny STL viewer (WebGL, no dependencies).
   STLViewer.mount(canvas, url, onReady, onFail) draws a binary .stl file as a
   dark solid with light-blue edges. It sways gently on its own and can be
   dragged to turn it. If anything is missing (WebGL, the file) onFail runs and
   the page keeps its fallback picture.
   ========================================================================== */
(function () {
  'use strict';

  var VERT = [
    'attribute vec3 aPos;',
    'attribute vec3 aNormal;',
    'uniform mat4 uProj;',
    'uniform mat3 uRot;',
    'uniform float uDist;',
    'varying vec3 vNormal;',
    'varying vec3 vPos;',
    'void main() {',
    '  vec3 p = uRot * aPos;',
    '  p.z -= uDist;',
    '  vNormal = uRot * aNormal;',
    '  vPos = p;',
    '  gl_Position = uProj * vec4(p, 1.0);',
    '}'
  ].join('\n');

  var FRAG = [
    'precision mediump float;',
    'varying vec3 vNormal;',
    'varying vec3 vPos;',
    'uniform float uLine;',
    'void main() {',
    '  if (uLine > 0.5) { gl_FragColor = vec4(0.45, 0.82, 1.0, 1.0); return; }',
    '  vec3 n = normalize(vNormal);',
    '  if (!gl_FrontFacing) n = -n;',
    '  vec3 key = normalize(vec3(-0.5, 0.62, 0.6));',
    '  vec3 rim = normalize(vec3(0.75, -0.4, 0.2));',
    '  vec3 v = normalize(-vPos);',
    '  float d = max(dot(n, key), 0.0);',
    '  float r = pow(max(dot(n, rim), 0.0), 2.0);',
    '  float s = pow(max(dot(n, normalize(key + v)), 0.0), 40.0);',
    '  vec3 col = vec3(0.04, 0.06, 0.085)',
    '    + d * vec3(0.16, 0.36, 0.52)',
    '    + r * vec3(0.5, 0.08, 0.13)',
    '    + s * vec3(0.5, 0.7, 0.85);',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  /* ---------- geometry ---------- */

  // Binary STL: 80-byte header, triangle count, then 50 bytes per triangle.
  function parse(buffer) {
    if (buffer.byteLength < 84) return null;
    var view = new DataView(buffer);
    var count = view.getUint32(80, true);
    if (count === 0 || 84 + count * 50 !== buffer.byteLength) return null;

    var pos = new Float32Array(count * 9);
    var min = [Infinity, Infinity, Infinity];
    var max = [-Infinity, -Infinity, -Infinity];
    for (var t = 0; t < count; t++) {
      var at = 84 + t * 50 + 12;
      for (var k = 0; k < 9; k++) {
        var value = view.getFloat32(at + k * 4, true);
        pos[t * 9 + k] = value;
        var axis = k % 3;
        if (value < min[axis]) min[axis] = value;
        if (value > max[axis]) max[axis] = value;
      }
    }

    // Centre the model and scale its longest side to 2 units.
    var size = Math.max(max[0] - min[0], max[1] - min[1], max[2] - min[2]) || 1;
    var scale = 2 / size;
    for (var i = 0; i < pos.length; i++) {
      var a = i % 3;
      pos[i] = (pos[i] - (min[a] + max[a]) / 2) * scale;
    }

    // One flat normal per triangle.
    var nrm = new Float32Array(count * 9);
    for (t = 0; t < count; t++) {
      var o = t * 9;
      var ux = pos[o + 3] - pos[o], uy = pos[o + 4] - pos[o + 1], uz = pos[o + 5] - pos[o + 2];
      var vx = pos[o + 6] - pos[o], vy = pos[o + 7] - pos[o + 1], vz = pos[o + 8] - pos[o + 2];
      var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      var len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      nx /= len; ny /= len; nz /= len;
      for (k = 0; k < 3; k++) { nrm[o + k * 3] = nx; nrm[o + k * 3 + 1] = ny; nrm[o + k * 3 + 2] = nz; }
    }

    var half = [(max[0] - min[0]) * scale / 2, (max[1] - min[1]) * scale / 2, (max[2] - min[2]) * scale / 2];
    return { count: count, pos: pos, nrm: nrm, half: half, lines: featureEdges(pos, nrm, count) };
  }

  // Keep only the edges where the surface turns sharply: the outline a drawing would show.
  function featureEdges(pos, nrm, count) {
    var ids = new Map();
    var edges = new Map();
    var total = count * 3;
    function vertexId(o) {
      var key = Math.round(pos[o] * 2000) + ',' + Math.round(pos[o + 1] * 2000) + ',' + Math.round(pos[o + 2] * 2000);
      var id = ids.get(key);
      if (id === undefined) { id = ids.size; ids.set(key, id); }
      return id;
    }
    for (var t = 0; t < count; t++) {
      var o = t * 9;
      var corner = [vertexId(o), vertexId(o + 3), vertexId(o + 6)];
      for (var e = 0; e < 3; e++) {
        var a = corner[e], b = corner[(e + 1) % 3];
        if (a === b) continue;
        var key = a < b ? a * total + b : b * total + a;
        var edge = edges.get(key);
        if (!edge) {
          edges.set(key, { p: o + e * 3, q: o + ((e + 1) % 3) * 3, n: o, faces: 1, sharp: false });
        } else {
          edge.faces++;
          var dot = nrm[edge.n] * nrm[o] + nrm[edge.n + 1] * nrm[o + 1] + nrm[edge.n + 2] * nrm[o + 2];
          if (edge.faces > 2 || dot < 0.9) edge.sharp = true;
        }
      }
    }
    var out = [];
    edges.forEach(function (edge) {
      if (!edge.sharp && edge.faces !== 1) return;
      out.push(pos[edge.p], pos[edge.p + 1], pos[edge.p + 2], pos[edge.q], pos[edge.q + 1], pos[edge.q + 2]);
    });
    return new Float32Array(out);
  }

  /* ---------- WebGL ---------- */

  function compile(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  }

  function start(canvas, mesh) {
    var gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false });
    if (!gl) return false;
    var vs = compile(gl, gl.VERTEX_SHADER, VERT);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return false;
    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
    gl.useProgram(program);

    var aPos = gl.getAttribLocation(program, 'aPos');
    var aNormal = gl.getAttribLocation(program, 'aNormal');
    var uProj = gl.getUniformLocation(program, 'uProj');
    var uRot = gl.getUniformLocation(program, 'uRot');
    var uDist = gl.getUniformLocation(program, 'uDist');
    var uLine = gl.getUniformLocation(program, 'uLine');

    function buffer(data) {
      var b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      return b;
    }
    var posBuf = buffer(mesh.pos);
    var nrmBuf = buffer(mesh.nrm);
    var lineBuf = buffer(mesh.lines);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.clearColor(0, 0, 0, 0);

    var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var state = { yaw: -0.2, pitch: -0.62, sway: reduce ? 0 : 1, dragging: false, visible: false, raf: 0, lastX: 0, lastY: 0 };
    var FOV = 30 * Math.PI / 180;
    // Room the model needs on screen: turning mixes width with depth, tilting mixes height with depth.
    var needW = 1.1 * Math.sqrt(mesh.half[0] * mesh.half[0] + mesh.half[2] * mesh.half[2]);
    var needH = 1.1 * Math.sqrt(mesh.half[1] * mesh.half[1] + mesh.half[2] * mesh.half[2]) + 0.15 * mesh.half[0];

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      var h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    }

    function draw(now) {
      resize();
      var w = canvas.width, h = canvas.height;
      var aspect = w / h;
      var t = now / 1000;
      var yaw = state.yaw + state.sway * Math.sin(t * 0.55) * 0.6;
      var pitch = state.pitch + state.sway * Math.sin(t * 0.38 + 1.1) * 0.12;

      // Rotation = tilt (x axis) after turn (y axis), stored column by column.
      var cy = Math.cos(yaw), sy = Math.sin(yaw), cx = Math.cos(pitch), sx = Math.sin(pitch);
      var rot = new Float32Array([
        cy, sx * sy, -cx * sy,
        0, cx, sx,
        sy, -sx * cy, cx * cy
      ]);

      // Far enough back that the whole model fits, whatever the shape of the canvas.
      var f = 1 / Math.tan(FOV / 2);
      var dist = Math.max(needH * f, needW * f / aspect) + 0.3;
      var near = Math.max(0.1, dist - 2.5), far = dist + 2.5;
      var proj = new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) / (near - far), -1,
        0, 0, 2 * far * near / (near - far), 0
      ]);

      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniformMatrix4fv(uProj, false, proj);
      gl.uniformMatrix3fv(uRot, false, rot);
      gl.uniform1f(uDist, dist);

      // Solid, pushed back a hair so the edge lines sit cleanly on top.
      gl.uniform1f(uLine, 0);
      gl.enable(gl.POLYGON_OFFSET_FILL);
      gl.polygonOffset(1, 1);
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, nrmBuf);
      gl.enableVertexAttribArray(aNormal);
      gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, mesh.count * 3);
      gl.disable(gl.POLYGON_OFFSET_FILL);

      // Edges.
      gl.uniform1f(uLine, 1);
      gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
      gl.disableVertexAttribArray(aNormal);
      gl.vertexAttrib3f(aNormal, 0, 0, 1);
      gl.drawArrays(gl.LINES, 0, mesh.lines.length / 3);
    }

    function frame(now) {
      state.raf = 0;
      if (!reduce) {
        // The idle sway fades out while the model is held and back in afterwards.
        var target = state.dragging ? 0 : 1;
        state.sway += (target - state.sway) * 0.05;
      }
      draw(now);
      if (state.visible && (!reduce || state.dragging)) request();
    }
    function request() {
      if (!state.raf) state.raf = requestAnimationFrame(frame);
    }

    canvas.addEventListener('pointerdown', function (e) {
      state.dragging = true;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
      canvas.classList.add('is-grabbing');
      if (canvas.setPointerCapture) { try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* not capturable */ } }
      request();
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!state.dragging) return;
      state.yaw += (e.clientX - state.lastX) * 0.011;
      state.pitch = Math.max(-1.15, Math.min(1.15, state.pitch + (e.clientY - state.lastY) * 0.011));
      state.lastX = e.clientX;
      state.lastY = e.clientY;
      request();
    });
    function release() {
      state.dragging = false;
      canvas.classList.remove('is-grabbing');
    }
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);

    // Only animate while the model is actually on screen.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        state.visible = entries[0].isIntersecting;
        if (state.visible) request();
      }, { threshold: 0.05 }).observe(canvas);
    } else {
      state.visible = true;
    }
    if ('ResizeObserver' in window) new ResizeObserver(request).observe(canvas);
    window.addEventListener('resize', request);
    request();
    return true;
  }

  window.STLViewer = {
    mount: function (canvas, url, onReady, onFail) {
      function fail() { if (onFail) onFail(); }
      if (!canvas || !window.fetch || !window.WebGLRenderingContext) { fail(); return; }
      fetch(url)
        .then(function (res) { if (!res.ok) throw new Error('missing'); return res.arrayBuffer(); })
        .then(function (data) {
          var mesh = parse(data);
          if (!mesh || !start(canvas, mesh)) { fail(); return; }
          if (onReady) onReady();
        })
        .catch(fail);
    }
  };
})();
