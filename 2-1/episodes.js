/* 과학탐구실험2 Ⅰ-1 생활 속의 과학 탐구 — 이야기 두 편
   01 비행기 안의 고요 / 02 목이 따가운 교실
   공용 부품: ../assets/theme.js (sthUnit·sthGate·sthWork), ../assets/story.js (sthStory·sthSort·sthOrder·sthPick) */
(function () {
"use strict";

window.sthUnit("gt2-2-1");

var FONT = "'Gothic A1','Segoe UI',sans-serif";
function $(id) { return document.getElementById(id); }
function v(name) { return window.cssVar(name); }
function done(id) { var e = $(id); if (e) e.classList.add("done"); }
function put(id, html) { var e = $(id); if (e) e.innerHTML = html; }
function paper(ctx, W, H) { ctx.clearRect(0, 0, W, H); ctx.fillStyle = v("--panel"); ctx.fillRect(0, 0, W, H); }
function text(ctx, s, x, y, o) {
  o = o || {};
  ctx.font = (o.w || "500") + " " + (o.s || 12) + "px " + FONT;
  ctx.fillStyle = o.c || v("--ink"); ctx.textAlign = o.a || "left";
  ctx.fillText(s, x, y);
}
function axes(ctx, x0, y0, x1, y1) { ctx.strokeStyle = v("--line"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke(); }
function dot(ctx, x, y, r, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
function seg(ctx, x1, y1, x2, y2, c, w, dash) { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = w || 2; if (dash) ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); }
function A(hex, a) {
  hex = String(hex || "#888").trim();
  if (hex.charAt(0) !== "#") return hex;
  if (hex.length === 4) hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  return "rgba(" + parseInt(hex.substr(1, 2), 16) + "," + parseInt(hex.substr(3, 2), 16) + "," + parseInt(hex.substr(5, 2), 16) + "," + a + ")";
}
function segWire(id, attr, onPick) {
  var btns = Array.prototype.slice.call($(id).querySelectorAll("button"));
  btns.forEach(function (b) {
    b.type = "button";
    b.addEventListener("click", function () { btns.forEach(function (x) { x.classList.toggle("on", x === b); }); onPick(b.getAttribute(attr)); });
  });
}
function wave(ctx, x0, x1, y, amp, ph, cyc, col, w) {
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 2.5; ctx.beginPath();
  for (var x = x0; x <= x1; x += 3) { var t = (x - x0) / (x1 - x0) * cyc * Math.PI * 2; var yy = y - amp * Math.sin(t + ph); if (x === x0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); }
  ctx.stroke(); ctx.restore();
}
function orderDone(mount, steps) {
  $(mount).innerHTML = "<div class='order sort'><div class='slots'>" + steps.map(function (s) { return "<div class='slot filled'>" + s + "</div>"; }).join("") + "</div></div>";
}

/* ---- 무대 그림 도구 (../assets/kit.js) ---- */
var K = window.sthKit, KC = K.C, REDUCE = K.REDUCE;
function playBtn(id, get, set, onL, offL) {
  var b = $(id); if (!b) return;
  function lab() { b.textContent = get() ? onL : offL; }
  b.addEventListener("click", function () { set(!get()); lab(); }); lab();
}
/* 빛나는 파동 선: fn(u) 는 0~1 구간에서 -1~1 값 */
function gwave(ctx, x0, x1, cy, amp, fn, col, w) {
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 2.4; ctx.lineJoin = "round"; ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath();
  for (var x = x0; x <= x1; x += 2) { var yy = cy - amp * fn((x - x0) / (x1 - x0)); if (x === x0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); }
  ctx.stroke(); ctx.restore();
}
function hline(ctx, x0, x1, y, col, dash) { K.line(ctx, { x: x0, y: y }, { x: x1, y: y }, col, 1.2, dash || [5, 5]); }
function vline(ctx, x, y0, y1, col, dash) { K.line(ctx, { x: x, y: y0 }, { x: x, y: y1 }, col, 1.2, dash || [4, 4]); }
/* 읽음판: rows = [[이름, 값, 색(b·y·g·r), 보조]], ok = [g·r, 글] */
function readout(id, rows, ok) {
  var h = rows.map(function (r) { return "<span class='k'>" + r[0] + "</span><span class='v " + (r[2] || "") + "'>" + r[1] + "</span>" + (r[3] ? "<span class='sub'>" + r[3] + "</span>" : ""); }).join("");
  if (ok) h += "<span class='ok " + ok[0] + "'>" + ok[1] + "</span>";
  put(id, h);
}
/* 떠오르는 입자(김·수증기): 시간 tt 로 위치가 정해진다 */
function floatUp(ctx, n, seed, tt, x0, x1, yB, yT, col, r, drift) {
  var Rn = K.rng(seed);
  for (var i = 0; i < n; i++) {
    var sx = x0 + Rn() * (x1 - x0), sp = 0.5 + Rn() * 0.7, ph = Rn(), u = (ph + tt * sp) % 1;
    var x = sx + Math.sin(u * 5 + i) * 8 * u + (drift || 0) * u, y = yB - u * (yB - yT);
    ctx.globalAlpha = Math.sin(u * Math.PI) * 0.85;
    K.glow(ctx, x, y, r || 2, col, 3);
  }
  ctx.globalAlpha = 1;
}

/* ---- 밝은 스튜디오 · 입체 미니어처 도구 (본보기: earth-science-2/2-1 부정합, integrated-science-2/2-1 엘니뇨) ---- */
var LT = K.LT;
function rgbOf(c) {
  c = String(c || "#888").trim();
  if (c.charAt(0) === "#") { if (c.length === 4) c = "#" + c[1] + c[1] + c[2] + c[2] + c[3] + c[3]; return [parseInt(c.substr(1, 2), 16), parseInt(c.substr(3, 2), 16), parseInt(c.substr(5, 2), 16)]; }
  var m = /(\d+)\D+(\d+)\D+(\d+)/.exec(c); return m ? [+m[1], +m[2], +m[3]] : [200, 210, 255];
}
function tintC(c, k) { var r = rgbOf(c); return "rgb(" + r.map(function (q) { return Math.max(0, Math.min(255, Math.round(q * k))); }).join(",") + ")"; }
function floorShadow(ctx, x, y, rx, ry, a) {
  var g = ctx.createRadialGradient(x, y, 1, x, y, rx);
  g.addColorStop(0, "rgba(20,30,50," + (a == null ? .28 : a) + ")"); g.addColorStop(1, "rgba(20,30,50,0)");
  ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx); ctx.translate(-x, -y);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rx, 0, 6.2832); ctx.fill(); ctx.restore();
}
function tag(ctx, px, py, txt, dx, dy, col, box) {
  var q = { x: px + dx, y: py + dy };
  ctx.strokeStyle = "rgba(20,25,40,.75)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(q.x, q.y); ctx.stroke();
  ctx.fillStyle = "#111622"; ctx.beginPath(); ctx.arc(px, py, 2.5, 0, 6.283); ctx.fill();
  return K.pill(ctx, txt, q.x + (dx < 0 ? -4 : 4), q.y + 4, { s: 12, a: dx < 0 ? "right" : "left", c: col || "#e8ecff", box: box });
}
function cardHead(ctx, s, x, y, col, size) { K.t(ctx, s, x, y, { s: size || 21, w: "900", c: col || LT.ink }); }
/* 밝은 바탕용 파동 선 */
function lwave(ctx, x0, x1, cy, amp, fn, col, w) {
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 2.4; ctx.lineJoin = "round"; ctx.beginPath();
  for (var x = x0; x <= x1; x += 2) { var yy = cy - amp * fn((x - x0) / (x1 - x0)); if (x === x0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); }
  ctx.stroke(); ctx.restore();
}

/* =========================================================================
   이야기 ① 비행기 안의 고요
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep1", key: "ep1", name: "생활 탐구 ①", onDone: finish });

  window.sthGate({
    gate: "g1", key: "anc1", title: "나의 첫 추측",
    question: "노이즈 캔슬링 헤드폰은 바깥 마이크로 들은 소음을 어떻게 줄일까요?",
    options: ["㉠ 소음을 더 큰 음악으로 덮는다", "㉡ 소음과 반대 모양의 소리를 만들어 더해, 서로 지우게 한다", "㉢ 마이크가 소음을 빨아들인다", "㉣ 귀를 꽉 막는 것뿐이다"],
    onPick: function (i) { window.sthState("anc1OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 간섭 */
  (function () {
    var canvas = $("a-c-wave"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, ph = 0, am = 0.5;
    var got = window.sthState("waveGot") || { a: false, q: false };
    var tt = 0, playing = !REDUCE;
    function R() { var p = ph * Math.PI / 180; return Math.sqrt(1 + am * am + 2 * am * Math.cos(p)); }
    var MH = 270, MW = 570;
    /* 귀덮개를 한가운데에서 세로로 잘라 낸 모형(앞면 = 절단면, 뒤로 깊이) */
    function earcup(x0, y0, sc, p, r, rcL) {
      var DEP = 46, d, i;
      function M(u, z, dd) { return { x: x0 + u * sc + (dd || 0) * .55 * sc, y: y0 - z * sc - (dd || 0) * .4 * sc }; }
      function outer(dd) {
        var a = function (u, z) { return M(u, z, dd); };
        ctx.beginPath(); var s0 = a(110, 0); ctx.moveTo(s0.x, s0.y);
        var c1 = a(0, 0), c2 = a(0, 200), c3 = a(110, 200);
        ctx.arcTo(c1.x, c1.y, c2.x, c2.y, 40 * sc); ctx.arcTo(c2.x, c2.y, c3.x, c3.y, 40 * sc); ctx.lineTo(c3.x, c3.y);
      }
      function shell(dd) {
        outer(dd);
        var a = function (u, z) { return M(u, z, dd); }, e1 = a(110, 190), e2 = a(10, 190), e3 = a(10, 10), e4 = a(110, 10);
        ctx.lineTo(e1.x, e1.y); ctx.arcTo(e2.x, e2.y, e3.x, e3.y, 32 * sc); ctx.arcTo(e3.x, e3.y, e4.x, e4.y, 32 * sc); ctx.lineTo(e4.x, e4.y); ctx.closePath();
      }
      floorShadow(ctx, x0 + 80 * sc, y0 + 8, 150 * sc, 18, .28);
      /* 머리띠(뒤로 넘어가는 활 모양) */
      ctx.save(); ctx.lineCap = "round";
      var hb0 = M(55, 200, DEP * .6), hb1 = M(160, 250, DEP * .6);
      ctx.strokeStyle = "#3a4054"; ctx.lineWidth = 14 * sc; ctx.beginPath(); ctx.moveTo(hb0.x, hb0.y); ctx.quadraticCurveTo(hb0.x + 10, hb1.y - 20, hb1.x + 40, hb1.y); ctx.stroke();
      ctx.strokeStyle = "#5a6178"; ctx.lineWidth = 5 * sc; ctx.stroke(); ctx.restore();
      /* 귀덮개 안쪽 벽(먼 쪽 반) */
      outer(DEP); var bk = M(110, 0, DEP); ctx.lineTo(bk.x, bk.y); ctx.closePath(); ctx.fillStyle = "#1f2333"; ctx.fill();
      for (d = DEP; d > 0; d -= 3) { shell(d); ctx.fillStyle = tintC("#3a4157", 0.85 + 0.4 * (1 - d / DEP)); ctx.fill(); }
      /* 귀 쿠션(링의 단면) */
      [186, 14].forEach(function (zc) {
        for (d = DEP; d >= 0; d -= 3) { var q = M(126, zc, d); ctx.fillStyle = tintC("#3d4252", 0.8 + 0.4 * (1 - d / DEP)); ctx.beginPath(); ctx.ellipse(q.x, q.y, 16 * sc, 14 * sc, 0, 0, 6.2832); ctx.fill(); }
        var c = M(126, zc, 0); ctx.fillStyle = "#d8c49b"; ctx.beginPath(); ctx.ellipse(c.x, c.y, 14 * sc, 12 * sc, 0, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = "#2b2f3c"; ctx.lineWidth = 3 * sc; ctx.stroke();
        var R0 = K.rng(zc); ctx.fillStyle = "rgba(150,120,70,.45)"; for (i = 0; i < 18; i++) ctx.fillRect(c.x - 9 * sc + R0() * 18 * sc, c.y - 8 * sc + R0() * 16 * sc, 1.4, 1.4);
      });
      /* 스피커 받침판 */
      for (d = DEP; d >= 0; d -= 4) { var b0 = M(92, 12, d), b1 = M(96, 188, d); ctx.fillStyle = d ? tintC("#5a6178", 0.85 + 0.3 * (1 - d / DEP)) : "#a3abbd"; ctx.fillRect(b0.x, b1.y, b1.x - b0.x, b0.y - b1.y); }
      /* 절단면: 껍데기 */
      shell(0); ctx.fillStyle = "#a9b1c2"; ctx.fill(); ctx.save(); ctx.clip();
      ctx.strokeStyle = "rgba(40,45,60,.25)"; ctx.lineWidth = 1; var t0 = M(-20, 0, 0);
      for (i = -40; i < 260; i += 7) { ctx.beginPath(); ctx.moveTo(t0.x + i * sc, t0.y); ctx.lineTo(t0.x + (i + 200) * sc, t0.y - 200 * sc); ctx.stroke(); }
      ctx.restore(); shell(0); ctx.strokeStyle = "#2b3040"; ctx.lineWidth = 1.4; ctx.stroke();
      /* 스피커: 자석 + 진동판(귀 쪽을 향함) */
      var m0 = M(64, 118), m1 = M(80, 82), mg = ctx.createLinearGradient(m0.x, 0, m1.x, 0); mg.addColorStop(0, "#7b8496"); mg.addColorStop(.5, "#d9dee8"); mg.addColorStop(1, "#6a7385");
      ctx.fillStyle = mg; ctx.fillRect(m0.x, m0.y, m1.x - m0.x, m1.y - m0.y);
      var cn = [M(80, 92), M(92, 60), M(92, 140), M(80, 108)];
      var cg = ctx.createLinearGradient(cn[0].x, 0, cn[1].x, 0); cg.addColorStop(0, "#2d3140"); cg.addColorStop(1, "#5c6378");
      ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(cn[0].x, cn[0].y); ctx.lineTo(cn[1].x, cn[1].y); ctx.lineTo(cn[2].x, cn[2].y); ctx.lineTo(cn[3].x, cn[3].y); ctx.closePath(); ctx.fill();
      var dc = M(82, 100); ctx.fillStyle = "#c7ccd6"; ctx.beginPath(); ctx.ellipse(dc.x, dc.y, 4 * sc, 8 * sc, 0, 0, 6.2832); ctx.fill();
      /* 회로판(반대 소리 계산) */
      var p0 = M(24, 130), p1 = M(60, 120); ctx.fillStyle = "#1f8a5a"; ctx.fillRect(p0.x, p0.y, p1.x - p0.x, p1.y - p0.y);
      ctx.fillStyle = "#111522"; ctx.fillRect(M(32, 134).x, M(32, 134).y, 12 * sc, 4 * sc); ctx.fillRect(M(48, 133).x, M(48, 133).y, 7 * sc, 3 * sc);
      ctx.fillStyle = "#d9b45a"; for (i = 0; i < 5; i++) ctx.fillRect(M(27 + i * 7, 120).x, M(27, 120).y, 2.5 * sc, 2 * sc);
      /* 바깥 마이크 */
      var mc = M(-5, 158), mc2 = M(4, 144); ctx.fillStyle = "#14171f"; ctx.beginPath(); ctx.roundRect(mc.x, mc.y, mc2.x - mc.x, mc2.y - mc.y, 3); ctx.fill();
      K.glow(ctx, M(-5, 151).x, M(-5, 151).y, 2.6, "rgba(255,150,60,.95)", 3);
      ctx.strokeStyle = "#c9a24a"; ctx.lineWidth = 1.2;
      var w1 = M(4, 151), w2 = M(24, 126), w3 = M(60, 124), w4 = M(70, 118);
      ctx.beginPath(); ctx.moveTo(w1.x, w1.y); ctx.lineTo(w2.x, w2.y); ctx.moveTo(w3.x, w3.y); ctx.lineTo(w4.x, w4.y); ctx.stroke();
      /* 귀 */
      var ea = M(160, 100), eg = ctx.createRadialGradient(ea.x - 4, ea.y - 10, 2, ea.x, ea.y, 48 * sc); eg.addColorStop(0, "#f6d2b4"); eg.addColorStop(1, "#c98a68");
      ctx.fillStyle = eg; ctx.beginPath(); ctx.ellipse(ea.x, ea.y, 13 * sc, 46 * sc, 0, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = "rgba(120,60,40,.6)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(ea.x + 2, ea.y - 6, 7 * sc, 30 * sc, 0, -1.3, 1.6); ctx.stroke();
      var ec = M(153, 100); ctx.fillStyle = "#5b2c22"; ctx.beginPath(); ctx.ellipse(ec.x, ec.y, 3.5 * sc, 7 * sc, 0, 0, 6.2832); ctx.fill();
      /* 소리: 바깥 엔진 소음 · 스피커의 반대 소리 · 귀에 남은 소리 */
      var lft = M(-3, 0).x, nc = M(-170, 100);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 92, lft, MH - 92); ctx.clip();
      for (i = 0; i < 4; i++) { var rr = (tt * 30 + i * 30) % 120; ctx.strokeStyle = A(LT.orange, 0.8 * (1 - rr / 120)); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(nc.x, nc.y, 110 * sc + rr, -0.5, 0.5); ctx.stroke(); }
      ctx.restore();
      var sp = M(92, 100), ep0 = M(140, 0).x;
      ctx.save(); ctx.beginPath(); ctx.rect(sp.x, 40, ep0 - sp.x, MH - 40); ctx.clip();
      for (i = 0; i < 3; i++) { var br = (tt * 22 + i * 18) % 54; ctx.strokeStyle = A(LT.blue, Math.min(1, 0.35 + 0.5 * am) * (1 - br / 54)); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(sp.x, sp.y, (8 + br) * sc, -0.7, 0.7); ctx.stroke(); }
      ctx.restore();
      ctx.save(); ctx.strokeStyle = rcL; ctx.lineWidth = 2.4; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(ec.x, ec.y, (5 + 13 * Math.min(r, 2)) * sc, 0, 6.2832); ctx.stroke(); ctx.restore();
      return { mic: M(-5, 151), pcb: M(42, 130), cone: M(90, 70), ear: M(160, 140) };
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var p = ph * Math.PI / 180, r = R(), ok = r <= 0.1 + 1e-9, i, box = [0, MW];
      var rcL = ok ? LT.green : (r > 1 ? LT.red : LT.yellow);
      K.studio(ctx, 0, 0, MW, MH);
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, MW, MH, 14); ctx.clip();
      var pt = earcup(284, 258, 0.78, p, r, rcL);
      ctx.restore();
      tag(ctx, pt.mic.x, pt.mic.y, "바깥 마이크", -40, -30, "#ffd0a0", box);
      tag(ctx, pt.pcb.x, pt.pcb.y, "반대 소리 계산 회로", 150, -80, "#c9f5dc", box);
      tag(ctx, pt.cone.x, pt.cone.y, "스피커 진동판", 120, 44, "#bfe6ff", box);
      tag(ctx, pt.ear.x, pt.ear.y, "귀", 60, -30, "#ffe2cc", box);
      K.pill(ctx, "엔진 소음 →", 16, MH - 18, { s: 12, c: "#ffd0a0" });
      K.bigText(ctx, "귀에 남은 소리 " + Math.round(r * 100) + "%", 18, 44, 24, ok ? "#7ff0c0" : (r > 1 ? "#ff8a8a" : "#ffffff"));
      K.bigText(ctx, r > 1 ? "보강 간섭 · 오히려 커졌다" : (ok ? "상쇄 간섭 · 거의 사라졌다" : "위상과 세기를 맞춰 보세요"), 18, 72, 15, "#ffd35a");
      K.warn(ctx, MW - 14, 30, "⚠ 부품 크기는 보기 쉽게 그림", "right");
      /* 오른쪽 판정 카드 */
      var RX = MW + 10, px = RX + 18, xr = W - 18;
      K.card(ctx, RX, 0, W - RX, MH, "판정");
      cardHead(ctx, ok ? "상쇄 간섭" : (r > 1 ? "보강 간섭" : "부분 상쇄"), px, 62, ok ? LT.green : (r > 1 ? LT.red : LT.orange));
      K.row(ctx, "위상차", ph + "°", px, xr, 96);
      K.row(ctx, "만든 소리의 세기", am.toFixed(1) + " 배", px, xr, 124);
      K.row(ctx, "귀에 남은 소리", Math.round(r * 100) + "%", px, xr, 152, ok ? LT.green : (r > 1 ? LT.red : LT.ink));
      K.row(ctx, "소리 크기", r < 0.01 ? "−40 dB 이하" : (20 * Math.log(r) / Math.LN10).toFixed(1) + " dB", px, xr, 180);
      K.bar(ctx, px, 192, xr - px, Math.min(r, 2) / 2, rcL);
      K.tip(ctx, ok ? "마루와 골이 만나 지웠다" : (r > 1 ? "마루와 마루가 겹쳤다" : "10% 이하로 줄여 보세요"), px - 4, 216, xr - px + 8, ok ? true : (r > 1 ? false : null));
      /* 아래: 귀 앞에서 겹치는 세 파동 */
      var y0 = MH + 8, x0 = 190, x1 = W - 22, k = 3 * 2 * Math.PI, wt = tt * 2.2, rows = [y0 + 40, y0 + 86, y0 + 136];
      K.card(ctx, 0, y0, W, H - y0, "귀 앞에서 겹치는 세 파동");
      function nz(u) { return Math.sin(k * u - wt); }
      function an(u) { return am * Math.sin(k * u - wt + p); }
      for (i = -1; i < 4; i++) {
        var uc = (Math.PI / 2 + wt + 2 * Math.PI * i) / k; uc -= Math.floor(uc * 3) / 3; uc += i / 3;
        if (uc < 0 || uc > 1) continue;
        K.line(ctx, { x: x0 + uc * (x1 - x0), y: rows[0] - 18 }, { x: x0 + uc * (x1 - x0), y: H - 12 }, "rgba(245,159,0,.35)", 1.2, [4, 4]);
      }
      rows.forEach(function (yy) { K.line(ctx, { x: x0, y: yy }, { x: x1, y: yy }, "rgba(20,40,90,.14)", 1); });
      lwave(ctx, x0, x1, rows[0], 15, nz, LT.orange, 2.4);
      lwave(ctx, x0, x1, rows[1], 15, an, LT.blue, 2.4);
      K.line(ctx, { x: x0, y: rows[2] - 13 }, { x: x1, y: rows[2] - 13 }, "rgba(232,89,12,.4)", 1.2, [3, 5]);
      K.line(ctx, { x: x0, y: rows[2] + 13 }, { x: x1, y: rows[2] + 13 }, "rgba(232,89,12,.4)", 1.2, [3, 5]);
      lwave(ctx, x0, x1, rows[2], 13, function (u) { return nz(u) + an(u); }, rcL, 3);
      K.t(ctx, "① 엔진 소음", 18, rows[0] + 4, { s: 12.5, w: "900", c: LT.orange });
      K.t(ctx, "② 헤드폰이 만든 소리", 18, rows[1] - 2, { s: 12.5, w: "900", c: LT.blue });
      K.t(ctx, "위상차 " + ph + "° · 세기 " + am.toFixed(1), 18, rows[1] + 15, { s: 11, w: "700", c: LT.mute });
      K.t(ctx, "③ 귀에 들리는 소리", 18, rows[2] - 2, { s: 12.5, w: "900", c: LT.ink });
      K.t(ctx, "= ① + ② · 점선은 원래 소음 크기", 18, rows[2] + 15, { s: 11, w: "700", c: LT.mute });
      return ok;
    }
    function update() {
      var ok = draw(), r = R();
      readout("a-wave-read", [
        ["귀에 남은 소리", Math.round(r * 100) + "%", ok ? "g" : (r > 1 ? "r" : "y"), "소리 크기 " + (r < 0.01 ? "−40 dB 이하" : (20 * Math.log(r) / Math.LN10).toFixed(1) + " dB") + " (소음 = 100%)"],
        ["만든 소리", ph + "° · " + am.toFixed(1) + "배", "b", "위상차 · 세기"]
      ], ok ? ["g", "상쇄 간섭 · 10% 이하로 줄임"] : (r > 1 ? ["r", "보강 간섭 · 오히려 커졌습니다"] : ["r", "아직 10%보다 큽니다"]));
      put("a-wave-info", "위상차 " + ph + "°, 세기 " + am.toFixed(1) + ": 귀에 들리는 소리는 소음의 " + Math.round(r * 100) + "%입니다. "
        + (ok ? "✅ 마루와 골이 만나 서로 지웠습니다. 위상은 반대(180°), 세기는 같게 — 상쇄 간섭입니다." : (ph < 90 ? "마루와 마루가 겹치면 오히려 커집니다." : "위상과 세기를 모두 맞춰야 완전히 지워집니다.")));
      if (ok && !got.a) { got.a = true; window.sthState("waveGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-2a"); if (got.q) done("m1-2b");
      if (got.a && got.q) {
        window.sthState("waveBest", "위상 반대(180°)·같은 세기 → 소음 10% 이하");
        window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("waveBest") + ". 두 파동이 만나 서로 지우는 것이 상쇄 간섭입니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    playBtn("a-wave-play", function () { return playing; }, function (q) { playing = q; }, "⏸ 파동 멈추기", "▶ 파동 움직이기");
    K.animate(canvas, function (dt) { if (playing) { tt += dt / 1000; draw(); } });
    $("a-ph").addEventListener("input", function (ev) { ph = +ev.target.value; $("a-ph-val").textContent = ph + "°"; update(); });
    $("a-am").addEventListener("input", function (ev) { am = +ev.target.value; $("a-am-val").textContent = am.toFixed(1); update(); });
    window.sthPick({
      mount: "a-wave-pick",
      q: "헤드폰이 실수로 소음과 위상차 0° 인 소리(세기 1)를 만들면 어떻게 될까요?",
      options: ["소음이 사라진다", "마루와 마루가 겹쳐 소음이 약 2배로 커진다(보강 간섭)", "아무 변화가 없다"],
      answer: 1,
      why: ["위상이 같으면 지우지 못합니다.", "같은 위상의 두 파동이 더해지면 진폭이 커집니다. 그래서 헤드폰은 위상을 정확히 뒤집어야 합니다.", "두 소리가 더해지니 변화가 생깁니다."],
      onDone: function () { got.q = true; window.sthState("waveGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 3 — 처리 지연과 진동수 */
  (function () {
    var canvas = $("a-c-lag"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, f = 200;
    var got = window.sthState("lagGot") || { a: false, q: false };
    var TAU = 0.0001;
    function err(ff) { return 360 * ff * TAU; }
    function R(ff) { return 2 * Math.sin(err(ff) / 2 * Math.PI / 180); }
    var tt = 0, playing = !REDUCE;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var LW = 560, red0 = 1 - R(f), good = red0 >= 0.5, gcL = good ? LT.green : LT.red, ff;
      K.studio(ctx, 0, 0, LW, H);
      var g = K.chart(ctx, { x: 6, y: 86, w: LW - 12, h: H - 90, pl: 50, pt: 8, pb: 34, pr: 16, x0: 0, x1: 2000, y0: -0.2, y1: 1, xt: 4, yt: 6, xl: "소음의 진동수 (Hz)", light: true, yf: function (q) { return Math.round(q * 100) + "%"; } });
      ctx.fillStyle = "rgba(232,89,12,.12)"; ctx.fillRect(g.X(100), g.T, g.X(300) - g.X(100), g.B - g.T);
      ctx.fillStyle = "rgba(112,72,232,.09)"; ctx.fillRect(g.X(1000), g.T, g.R - g.X(1000), g.B - g.T);
      ctx.fillStyle = "rgba(224,49,49,.08)"; ctx.fillRect(g.L, g.Y(0), g.R - g.L, g.B - g.Y(0));
      K.t(ctx, "엔진 소리", g.X(200), g.Y(0.12), { s: 11, w: "800", a: "center", c: LT.orange });
      K.t(ctx, "말소리의 자음 (1000 Hz 이상)", g.X(1500), g.T + 18, { s: 11, w: "800", a: "center", c: LT.violet });
      K.t(ctx, "아래는 오히려 커짐", g.L + 8, g.B - 6, { s: 10.5, w: "800", c: LT.red });
      K.line(ctx, { x: g.L, y: g.Y(0.5) }, { x: g.R, y: g.Y(0.5) }, LT.yellow, 1.4, [5, 5]);
      K.t(ctx, "절반 줄임", g.L + 8, g.Y(0.5) - 6, { s: 10.5, w: "800", c: "#b07400" });
      var pts = []; for (ff = 100; ff <= 2000; ff += 20) pts.push([ff, 1 - R(ff)]);
      K.plot(ctx, g, pts, LT.blue, { w: 3, light: true });
      var px0 = g.X(f), py0 = g.Y(red0);
      K.line(ctx, { x: px0, y: g.T }, { x: px0, y: g.B }, "rgba(245,159,0,.7)", 1.2, [4, 4]);
      ctx.fillStyle = gcL; ctx.beginPath(); ctx.arc(px0, py0, 6, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.stroke();
      K.pill(ctx, f + " Hz · " + (red0 < 0 ? Math.round(-red0 * 100) + "% 커짐" : Math.round(red0 * 100) + "% 줄임"), px0 + (f > 1300 ? -12 : 12), py0 + (red0 > 0.8 ? 26 : -12), { a: f > 1300 ? "right" : "left", s: 11.5, c: gcL, bg: "rgba(255,255,255,.92)", line: "rgba(20,40,90,.2)", box: [g.L, g.R] });
      K.bigText(ctx, f + " Hz → " + (red0 < 0 ? Math.round(-red0 * 100) + "% 커짐" : Math.round(red0 * 100) + "% 줄임"), 18, 44, 24, good ? "#7ff0c0" : "#ff8a8a");
      K.bigText(ctx, "0.1 ms 늦으면 위상이 " + err(f).toFixed(0) + "° 어긋난다", 18, 72, 15, "#ffd35a");
      /* 오른쪽 판정 카드 */
      var RX = LW + 10, px = RX + 18, xr = W - 18, ok = R(f) <= 0.5 && R(f + 100) > 0.5;
      K.card(ctx, RX, 0, W - RX, H, "판정 · 0.1 ms 늦은 반대 소리");
      cardHead(ctx, ok ? "절반을 넘기는 한계" : (good ? "절반 넘게 줄임" : "절반도 못 줄임"), px, 62, good ? LT.green : LT.red, 19);
      K.row(ctx, "소음의 진동수", f + " Hz", px, xr, 96);
      K.row(ctx, "한 주기", (1000 / f).toFixed(f >= 1000 ? 2 : 1) + " ms", px, xr, 124);
      K.row(ctx, "위상 어긋남", err(f).toFixed(0) + "°", px, xr, 152, "#b07400");
      K.row(ctx, "소음", red0 < 0 ? Math.round(-red0 * 100) + "% 커짐" : Math.round(red0 * 100) + "% 줄임", px, xr, 180, gcL);
      /* 작은 파동 모형: 소음과 늦게 나온 반대 소리, 그리고 합 */
      var x0 = px, x1 = xr, d = f * TAU * 0.5, wt = tt * 2;
      function nz(u) { return Math.sin(4 * Math.PI * u - wt); }
      function an(u) { return -Math.sin(4 * Math.PI * (u - d) - wt); }
      K.t(ctx, "소음(주황)과 늦은 반대 소리(파랑)", px, 206, { s: 11, w: "800", c: LT.mute });
      K.line(ctx, { x: x0, y: 236 }, { x: x1, y: 236 }, "rgba(20,40,90,.14)", 1);
      lwave(ctx, x0, x1, 236, 14, nz, LT.orange, 2); lwave(ctx, x0, x1, 236, 14, an, LT.blue, 2);
      K.t(ctx, "합친 소리", px, 266, { s: 11, w: "800", c: LT.mute });
      K.line(ctx, { x: x0, y: 290 }, { x: x1, y: 290 }, "rgba(20,40,90,.14)", 1);
      lwave(ctx, x0, x1, 290, 12, function (u) { return nz(u) + an(u); }, gcL, 2.6);
      K.tip(ctx, ok ? "800 Hz · 이보다 높으면 절반도 못 지움" : (good ? "더 높은 진동수는 어떨까?" : "진동수를 낮춰 보세요"), px - 4, 318, xr - px + 8, ok ? true : (good ? null : false));
      K.t(ctx, "어긋남 = 360° × 진동수 × 0.0001 s", px, 368, { s: 10.5, w: "700", c: LT.mute });
      return ok;
    }
    function update() {
      var ok = draw(), red0 = 1 - R(f);
      readout("a-lag-read", [
        ["소음의 진동수", f + " Hz", "b", "한 주기 " + (1000 / f).toFixed(f >= 1000 ? 2 : 1) + " ms"],
        ["위상 어긋남", err(f).toFixed(0) + "°", "y", "0.1 ms = 360° × 진동수 × 0.0001 s"],
        ["소음", red0 < 0 ? Math.round(-red0 * 100) + "% 커짐" : Math.round(red0 * 100) + "% 줄임", red0 >= 0.5 ? "g" : "r"]
      ], ok ? ["g", "절반 이상 줄이는 가장 높은 진동수"] : (red0 >= 0.5 ? ["g", "절반 넘게 줄어듭니다"] : ["r", "절반도 못 줄입니다"]));
      put("a-lag-info", f + " Hz 소음은 헤드폰이 소리를 만드는 0.1 ms 동안 위상이 " + err(f).toFixed(0) + "° 어긋나, " + (red0 < 0 ? "오히려 " + Math.round(-red0 * 100) + "% 커집니다(보강 간섭). " : Math.round(red0 * 100) + "%만 줄어듭니다. ")
        + (ok ? "✅ 800 Hz가 절반 이상 줄일 수 있는 가장 높은 진동수입니다. 그보다 높은 소리는 위상이 너무 많이 어긋납니다." : (red0 >= 0.5 ? "아직 절반 넘게 줄어듭니다. 더 높은 진동수는?" : "절반도 못 줄입니다. 진동수를 낮춰 보세요.")));
      if (ok && !got.a) { got.a = true; window.sthState("lagGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-3a"); if (got.q) done("m1-3b");
      if (got.a && got.q) {
        window.sthState("lagBest", "처리 지연 0.1 ms → 800 Hz 넘는 소리는 절반도 못 지움");
        window.sthMission("m1-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("lagBest") + ". 낮은 엔진 소리는 잘 지우고, 높은 말소리는 남는 까닭입니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    playBtn("a-lag-play", function () { return playing; }, function (q) { playing = q; }, "⏸ 파동 멈추기", "▶ 파동 움직이기");
    K.animate(canvas, function (dt) { if (playing) { tt += dt / 1000; draw(); } });
    $("a-f").addEventListener("input", function (ev) { f = +ev.target.value; $("a-f-val").textContent = f + " Hz"; update(); });
    window.sthPick({
      mount: "a-lag-pick",
      q: "노이즈 캔슬링 헤드폰을 써도 승무원의 말소리는 들리는 까닭으로 가장 알맞은 것은?",
      options: ["말소리가 엔진 소리보다 커서", "말소리에는 진동수가 높은 성분(자음 등)이 많아, 반대 소리를 만드는 짧은 시간 동안에도 위상이 크게 어긋나기 때문에", "헤드폰이 사람 목소리를 알아보고 일부러 들려주기 때문에"],
      answer: 1,
      why: ["엔진 소리가 훨씬 큽니다.", "진동수가 높을수록 같은 시간 지연에도 위상이 더 많이 어긋나 상쇄가 잘 안 됩니다.", "일부 제품에 그런 기능이 있지만, 기본 원리는 위상 어긋남입니다."],
      onDone: function () { got.q = true; window.sthState("lagGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 4 — 생활 속 과학 원리 지도 */
  window.sthSort({
    mount: "a-sort",
    buckets: [{ id: "wave", label: "🌊 파동 — 소리·빛·전파" }, { id: "heat", label: "🔥 열의 이동" }, { id: "force", label: "⚙️ 힘과 운동" }],
    items: [
      { t: "🎧 노이즈 캔슬링 헤드폰 — 반대 위상의 소리로 소음을 지운다 (미디어)", a: "wave", why: "소리 파동의 상쇄 간섭입니다." },
      { t: "📡 GPS 내비게이션 — 여러 위성의 전파가 도착하는 시간 차로 위치를 잰다 (생활 서비스)", a: "wave", why: "빛의 속력으로 가는 전파의 도착 시간을 씁니다." },
      { t: "🎬 3D 영화 안경 — 양쪽 눈에 편광 방향이 다른 빛만 들어가게 한다 (영화)", a: "wave", why: "빛의 편광을 이용합니다." },
      { t: "🍱 보냉 도시락통 — 진공층이 열의 전도·대류를 막는다 (요리)", a: "heat", why: "열이 이동하는 길을 막습니다." },
      { t: "🏠 겨울 이중창 — 유리 사이 공기층이 열이 빠져나가는 것을 줄인다 (건축)", a: "heat", why: "공기는 열을 잘 전하지 않습니다." },
      { t: "🥩 수비드 요리 — 일정한 온도의 물로 고기를 천천히 익힌다 (요리)", a: "heat", why: "물의 열을 고르게 전달합니다.", hint: "무엇이 고기에게 전달되나요?" },
      { t: "🚗 자동차 에어백 — 부딪히는 시간을 늘려 몸이 받는 힘을 줄인다 (생활 안전)", a: "force", why: "충격량이 같을 때 시간이 길면 힘이 작아집니다." },
      { t: "⚽ 바나나킥 — 공을 회전시켜 휘어 날아가게 한다 (스포츠)", a: "force", why: "회전하는 공 둘레의 공기 흐름 차이가 옆으로 미는 힘(마그누스 힘)을 만듭니다." }
    ],
    onDone: function () { window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>영화·건축·요리·스포츠·미디어, 어디에서나 몇 가지 과학 원리가 되풀이해 쓰입니다. 원리를 알면 처음 보는 기술도 설명할 수 있습니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m1-4", true);

  function finish() { window.sthState("r1", "완성 · " + (window.sthState("waveBest") || "") + " / " + (window.sthState("lagBest") || "")); }
  function vs() {
    $("e1-vs").innerHTML = "<b>나의 첫 추측</b> " + (window.sthState("anc1") || "기록 없음") + "<br><b>간섭</b> " + (window.sthState("waveBest") || "-") + "<br><b>처리 지연</b> " + (window.sthState("lagBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk1", unitLabel: "[과학탐구실험2 Ⅰ-1] 이야기 ① 비행기 안의 고요",
    items: [
      { id: "w1", label: "내 주변의 과학 원리", hint: "일상에서 고른 장면 하나에 어떤 과학 원리가 숨어 있는지 쓰세요.", ph: "장면: … / 숨은 원리: …" },
      { id: "e1a", label: "노이즈 캔슬링의 장단점", hint: "상쇄 간섭과 처리 지연을 들어, 노이즈 캔슬링 헤드폰이 잘 지우는 소리와 잘 못 지우는 소리를 설명하세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ② 목이 따가운 교실
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep2", key: "ep2", name: "생활 탐구 ②", onDone: finish });

  window.sthGate({
    gate: "g2", key: "dry1", title: "도우미의 첫 판단",
    question: "교실이 건조한 문제를 과학적으로 해결하려면 무엇부터 해야 할까요?",
    options: ["㉠ 가장 비싼 가습기부터 산다", "㉡ 습도계로 교실 습도를 재어 문제를 숫자로 확인하고, 해결 방법을 가설로 세운다", "㉢ 친구들에게 투표를 받는다", "㉣ 창문을 활짝 열어 둔다"],
    onPick: function (i) { window.sthState("dry1OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 가습기 */
  (function () {
    var canvas = $("b-c-hum"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, pow = "weak", t = 10;
    var got = window.sthState("humGot") || { a: false, b: false, q: false };
    var P = { weak: { eq: 55, tau: 60, n: "약하게" }, strong: { eq: 70, tau: 40, n: "강하게" } };
    function hum(p, tt) { return P[p].eq - (P[p].eq - 25) * Math.exp(-tt / P[p].tau); }
    var tt = 0, playing = !REDUCE;
    var IC = K.iso({ ox: 252, oy: 170, s: 0.55, L: 400, D: 300 }), CL = 400, CD = 300, WZ = 160;
    var VAP = (function () { var R0 = K.rng(17), out = [], i; for (i = 0; i < 90; i++) out.push([20 + R0() * (CL - 40), 20 + R0() * (CD - 40), 20 + R0() * (WZ - 40), R0()]); return out; })();
    function Q(pts, fill, stroke, lw) {
      ctx.beginPath(); pts.forEach(function (p, k) { var q = IC.P(p[0], p[1], p[2]); if (k) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }); ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var hh = hum(pow, t), okr = hh >= 40 && hh <= 60, LW = 510, i, box = [0, LW];
      var hcL = okr ? LT.green : (hh > 60 ? LT.red : LT.yellow);
      K.studio(ctx, 0, 0, LW, H, { x: IC.P(CL, CD, 0).x - 30, y: IC.P(CL, CD, 0).y + 6, rx: 280, ry: 40 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      /* 벽 두 장 + 바닥 단면 */
      IC.box(ctx, -10, -10, -14, 0, 0, WZ, "#c9ccd2", "#9aa0aa", "#9aa0aa");
      IC.box(ctx, -10, 0, -14, 0, CD, WZ, "#c9ccd2", "#9aa0aa", "#e9e4da");
      IC.box(ctx, 0, -10, -14, CL, 0, WZ, "#c9ccd2", "#efeae1", "#9aa0aa");
      IC.box(ctx, 0, 0, -14, CL, CD, 0, "#c9a777", "#8d8f96", "#6f727a");
      ctx.strokeStyle = "rgba(90,60,30,.18)"; ctx.lineWidth = 1;
      for (i = 1; i < 10; i++) { var f0 = IC.P(i * 40, 0, 0), f1 = IC.P(i * 40, CD, 0); ctx.beginPath(); ctx.moveTo(f0.x, f0.y); ctx.lineTo(f1.x, f1.y); ctx.stroke(); }
      /* 창문(뒤 벽) — 60%를 넘으면 물방울이 맺힌다 */
      Q([[200, 0, 50], [356, 0, 50], [356, 0, 142], [200, 0, 142]], "#8a7660");
      var sky = ctx.createLinearGradient(0, IC.P(204, 0, 138).y, 0, IC.P(352, 0, 54).y); sky.addColorStop(0, "#5d86b8"); sky.addColorStop(1, "#2c4a78");
      Q([[204, 0, 54], [352, 0, 54], [352, 0, 138], [204, 0, 138]], sky);
      Q([[276, 0, 54], [280, 0, 54], [280, 0, 138], [276, 0, 138]], "#8a7660");
      if (hh > 60) {
        var Rd = K.rng(12), nd = Math.round((hh - 60) * 7);
        for (i = 0; i < nd; i++) { var dp = IC.P(208 + Rd() * 140, 0, 58 + Rd() * 76), dr = 1.4 + Rd() * 2; ctx.fillStyle = "rgba(200,230,255,.75)"; ctx.beginPath(); ctx.arc(dp.x, dp.y, dr, 0, 6.2832); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.beginPath(); ctx.arc(dp.x - dr * .35, dp.y - dr * .35, dr * .35, 0, 6.2832); ctx.fill(); }
      } else { ctx.strokeStyle = "rgba(255,255,255,.3)"; ctx.lineWidth = 3; var g0 = IC.P(214, 0, 60), g1 = IC.P(236, 0, 132); ctx.beginPath(); ctx.moveTo(g0.x, g0.y); ctx.lineTo(g1.x, g1.y); ctx.stroke(); }
      /* 책상과 의자 */
      [[50, 70], [50, 170], [140, 70], [140, 170]].forEach(function (d) {
        IC.box(ctx, d[0], d[1], 0, d[0] + 30, d[1] + 46, 44, "#d9b98a", "#a98353", "#8a6a43");
        IC.box(ctx, d[0] + 40, d[1] + 12, 0, d[0] + 58, d[1] + 34, 26, "#7f8fb3", "#5b6a8c", "#4a5675");
        IC.box(ctx, d[0] + 54, d[1] + 12, 26, d[0] + 58, d[1] + 34, 58, "#7f8fb3", "#5b6a8c", "#4a5675");
      });
      /* 가습기 */
      var HX = 300, HY = 200;
      floorShadow(ctx, IC.P(HX + 20, HY + 15, 0).x + 6, IC.P(HX + 20, HY + 15, 0).y + 4, 30, 9, .3);
      IC.box(ctx, HX, HY, 0, HX + 40, HY + 30, 46, "#f1f4f8", "#d4dae3", "#aeb7c4");
      var tg = ctx.createLinearGradient(0, IC.P(HX + 6, HY + 30, 36).y, 0, IC.P(HX + 6, HY + 30, 8).y); tg.addColorStop(0, "rgba(120,190,240,.5)"); tg.addColorStop(1, "rgba(30,110,210,.9)");
      Q([[HX + 6, HY + 30, 8], [HX + 34, HY + 30, 8], [HX + 34, HY + 30, 36], [HX + 6, HY + 30, 36]], tg, "rgba(40,60,90,.4)");
      IC.box(ctx, HX + 15, HY + 10, 46, HX + 25, HY + 20, 52, "#5b6680", "#3a4466", "#2c3450");
      var nz0 = IC.P(HX + 20, HY + 15, 52);
      K.glow(ctx, IC.P(HX + 36, HY + 30, 40).x, IC.P(HX + 36, HY + 30, 40).y, 2.2, t > 0 ? "rgba(15,159,118,.95)" : "rgba(120,130,160,.6)", 2.6);
      if (t > 0) floatUp(ctx, pow === "strong" ? 34 : 18, 31, tt * 0.35, nz0.x - 10, nz0.x + 10, nz0.y - 4, nz0.y - 110, "rgba(110,165,230,.85)", pow === "strong" ? 3 : 2.4, 0);
      /* 공기 속 수증기 입자: 습도만큼 */
      var nv = Math.round(Math.max(0, hh - 15) * 1.25);
      for (i = 0; i < Math.min(nv, VAP.length); i++) { var v0 = VAP[i], vp = IC.P(v0[0] + Math.sin(tt * .8 + i) * 6, v0[1], v0[2] + Math.cos(tt * .7 + v0[3] * 6) * 5); ctx.fillStyle = "rgba(60,130,220,.55)"; ctx.beginPath(); ctx.arc(vp.x, vp.y, 2, 0, 6.2832); ctx.fill(); }
      /* 잘린 두 면: 엷은 공기 */
      var haze = 0.04 + Math.max(0, hh - 25) / 45 * 0.12;
      Q([[0, CD, 0], [CL, CD, 0], [CL, CD, WZ], [0, CD, WZ]], "rgba(150,200,255," + haze.toFixed(3) + ")");
      Q([[CL, 0, 0], [CL, CD, 0], [CL, CD, WZ], [CL, 0, WZ]], "rgba(120,175,240," + (haze * 1.2).toFixed(3) + ")");
      ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = "rgba(60,90,140,.45)"; ctx.lineWidth = 1.2;
      [[[0, CD, WZ], [CL, CD, WZ]], [[CL, CD, WZ], [CL, 0, WZ]], [[CL, CD, 0], [CL, CD, WZ]]].forEach(function (e) { var a = IC.P(e[0][0], e[0][1], e[0][2]), b = IC.P(e[1][0], e[1][1], e[1][2]); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); });
      ctx.restore();
      /* 벽 습도계(왼쪽 벽) */
      var hp = IC.P(0, 150, 104), cx = hp.x, cy = hp.y, rr = 20, a0 = Math.PI * 0.75, a1 = Math.PI * 2.25;
      function ang(q) { return a0 + (a1 - a0) * q / 100; }
      ctx.fillStyle = "#20283a"; ctx.beginPath(); ctx.arc(cx, cy, rr + 4, 0, 6.2832); ctx.fill();
      [[0, 40, LT.yellow], [40, 60, LT.green], [60, 100, LT.red]].forEach(function (b) { ctx.strokeStyle = b[2]; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(cx, cy, rr - 2, ang(b[0]), ang(b[1])); ctx.stroke(); });
      var an = ang(hh); ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(an) * (rr - 6), cy + Math.sin(an) * (rr - 6)); ctx.stroke(); ctx.lineCap = "butt";
      ctx.restore();
      tag(ctx, cx - rr - 2, cy, "습도계 " + Math.round(hh) + "%", -30, 34, okr ? "#9ff0c8" : (hh > 60 ? "#ffb3b3" : "#ffe08a"), box);
      var wl = IC.P(356, 0, 140); tag(ctx, wl.x, wl.y, hh > 60 ? "창문에 물방울(결로)" : "창문", 40, -24, hh > 60 ? "#ffb3b3" : "#e8ecff", box);
      var hl2 = IC.P(HX + 40, HY + 30, 20); tag(ctx, hl2.x, hl2.y, "가습기 · " + P[pow].n, 40, 40, "#bfe6ff", box);
      K.bigText(ctx, "습도 " + hh.toFixed(1) + "%", 18, 44, 25, okr ? "#7ff0c0" : (hh > 60 ? "#ff8a8a" : "#ffffff"));
      K.bigText(ctx, hh > 60 ? "60% 초과 · 결로와 곰팡이 주의" : (okr ? (t <= 30 ? "30분 안에 알맞은 습도" : "알맞지만 30분이 넘게 걸림") : "아직 건조하다 · " + t + "분 가동"), 18, 72, 15, "#ffd35a");
      K.warn(ctx, 18, H - 16, "⚠ 수증기 입자는 보기 쉽게 크게 그림");
      /* 오른쪽 카드 + 습도 기록 그래프 */
      var RX = LW + 10, px = RX + 18, xr = W - 18;
      K.card(ctx, RX, 0, W - RX, H, "습도계 기록");
      cardHead(ctx, "교실 습도 " + hh.toFixed(1) + "%", px, 62, hcL, 20);
      K.row(ctx, "가습기", P[pow].n + " · " + t + "분", px, xr, 92);
      K.tip(ctx, hh > 60 ? "60% 넘으면 결로·곰팡이" : (okr ? (t <= 30 ? "30분 안에 40~60%" : "30분을 넘겨 도달") : "아직 40%가 안 됨"), px - 4, 104, xr - px + 8, okr && t <= 30 ? true : (hh > 60 ? false : null));
      var g = K.chart(ctx, { x: RX + 6, y: 146, w: W - RX - 14, h: H - 152, pl: 44, pt: 10, pb: 34, pr: 12, x0: 0, x1: 120, y0: 20, y1: 80, xt: 4, yt: 3, xl: "가동 시간 (분)", light: true, yf: function (q) { return Math.round(q) + "%"; } });
      ctx.fillStyle = "rgba(15,159,118,.12)"; ctx.fillRect(g.L, g.Y(60), g.R - g.L, g.Y(40) - g.Y(60));
      ctx.fillStyle = "rgba(224,49,49,.08)"; ctx.fillRect(g.L, g.T, g.R - g.L, g.Y(60) - g.T);
      K.t(ctx, "알맞은 습도 40~60%", g.L + 6, g.Y(40) - 6, { s: 10.5, w: "800", c: LT.green });
      K.t(ctx, "결로 위험", g.L + 6, g.T + 14, { s: 10.5, w: "800", c: LT.red });
      K.line(ctx, { x: g.X(30), y: g.T }, { x: g.X(30), y: g.B }, "rgba(15,159,118,.6)", 1.2, [4, 4]);
      ["weak", "strong"].forEach(function (pp) {
        var pts = []; for (var q = 0; q <= 120; q += 2) pts.push([q, hum(pp, q)]);
        if (pp === pow) K.plot(ctx, g, pts, LT.blue, { w: 3, light: true });
        else K.plot(ctx, g, pts, "rgba(92,112,134,.45)", { w: 1.6, dash: [5, 4], glow: false });
      });
      K.t(ctx, pow === "weak" ? "약하게(파랑) · 강하게(점선)" : "강하게(파랑) · 약하게(점선)", g.R - 4, g.T + 14, { s: 10.5, w: "700", a: "right", c: LT.mute });
      var gx = g.X(t), gy = g.Y(hh);
      ctx.fillStyle = hcL; ctx.beginPath(); ctx.arc(gx, gy, 5.5, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.stroke();
    }
    function update() {
      draw();
      var hh = hum(pow, t), okr = hh >= 40 && hh <= 60;
      readout("b-hum-read", [
        ["교실 습도", hh.toFixed(1) + "%", okr ? "g" : (hh > 60 ? "r" : "y"), "처음 25% · 알맞은 범위 40~60%"],
        ["가동", P[pow].n + " · " + t + "분", "b"]
      ], hh > 60 ? ["r", "60% 초과 · 결로와 곰팡이 주의"] : (okr ? (t <= 30 ? ["g", "30분 안에 알맞은 습도"] : ["g", "알맞지만 30분을 넘겨 걸림"]) : ["r", "아직 건조합니다"]));
      if (t <= 30 && hh >= 40 && hh <= 60 && !got.a) got.a = true;
      if (pow === "strong" && hh > 60 && !got.b) got.b = true;
      window.sthState("humGot", got);
      put("b-hum-info", P[pow].n + " " + t + "분 가동: 습도 " + hh.toFixed(1) + "%. "
        + (hh > 60 ? "✅ 60%를 넘었습니다. 창문에 물이 맺히고 곰팡이가 생기기 쉽습니다." : (hh >= 40 ? (t <= 30 ? "✅ 30분 안에 알맞은 습도에 이르렀습니다." : "알맞은 습도지만 30분이 넘게 걸렸습니다.") : "아직 40%가 안 됩니다.")));
      mission();
    }
    function mission() {
      if (got.a) done("m2-2a"); if (got.b) done("m2-2b"); if (got.q) done("m2-2c");
      if (got.a && got.b && got.q && !ep.cleared(1)) {
        window.sthState("humBest", "강하게 20~30분 → 40~50%, 1시간 넘게 틀면 60% 초과");
        window.sthMission("m2-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("humBest") + ". 가설(가습기로 습도가 오른다)이 지지되었고, 알맞게 쓰는 조건도 찾았습니다.");
        ep.clear(1);
      } else if (got.a && got.b && got.q) window.sthMission("m2-2", true);
    }
    canvas._redraw = draw;
    playBtn("b-hum-play", function () { return playing; }, function (q) { playing = q; }, "⏸ 김 멈추기", "▶ 김 움직이기");
    K.animate(canvas, function (dt) { if (playing && t > 0) { tt += dt / 1000; draw(); } });
    segWire("b-pow", "data-v", function (x) { pow = x; update(); });
    $("b-t").addEventListener("input", function (ev) { t = +ev.target.value; $("b-t-val").textContent = t + "분"; update(); });
    window.sthPick({
      mount: "b-hum-pick",
      q: "교실 습도를 알맞게 유지하는 방법으로 가장 알맞은 것은?",
      options: ["가습기를 강하게 하루 종일 틀어 둔다", "습도계를 보며 40~60%를 넘지 않도록 세기와 시간을 조절한다", "습도는 높을수록 좋으니 신경 쓰지 않는다"],
      answer: 1,
      why: ["60%를 넘어 결로와 곰팡이가 생깁니다.", "재면서 조절하는 것이 핵심입니다. 해결책도 결과를 확인하며 고쳐 가야 합니다.", "너무 높은 습도는 곰팡이와 집먼지진드기를 늘립니다."],
      onDone: function () { got.q = true; window.sthState("humGot", got); mission(); }
    });
    update();
  })();

  /* 장면 3 — 젖은 수건 가설 */
  (function () {
    var canvas = $("b-c-towel"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, n = 2, win = "shut";
    var got = window.sthState("towelGot") || false;
    var PER = 50 / (180 * 17.3) * 100;   /* 수건 한 장이 한 시간에 올리는 습도 (%p) */
    function rise(k, w) { return k * PER * (w === "vent" ? 0.5 : 1); }
    var tt = 0, playing = !REDUCE;
    var TC = [["#4fa3d9", "#1f5f8f"], ["#3fd3a3", "#1a7a5c"], ["#ff9d63", "#b5562a"], ["#b69cff", "#5f45b0"]];
    /* 위: 교실을 블록처럼 잘라 낸 모형(K.iso) · 아래: 한 시간 뒤 습도 막대 */
    var MH = 420;                                        /* 모형 칸 높이 */
    var I = K.iso({ ox: 430, oy: 140, s: 0.66, L: 480, D: 300 });
    var RL = I.L, RD = I.D, WH = 180, RY = 110, TX0 = 160, TW = 21, TS = 26;
    function Q(pts, fill, stroke, lw) {
      ctx.beginPath(); pts.forEach(function (p, k) { var q = I.P(p[0], p[1], p[2]); if (k) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }); ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); }
    }
    function desk(x, y) {
      I.box(ctx, x, y, 0, x + 30, y + 46, 44, "#d9b98a", "#a98353", "#8a6a43");          /* 책상 */
      I.box(ctx, x + 40, y + 12, 0, x + 58, y + 34, 26, "#7f8fb3", "#5b6a8c", "#4a5675");  /* 의자 */
      I.box(ctx, x + 54, y + 12, 26, x + 58, y + 34, 58, "#7f8fb3", "#5b6a8c", "#4a5675");
    }
    function drawModel(r, ok, open) {
      var i, haze = Math.min(0.2, 0.035 + r / 20 * 0.15);
      K.studio(ctx, 0, 0, W, MH, { x: I.P(RL, RD, 0).x - 40, y: 404, rx: 320, ry: 40 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, W, MH, 14); ctx.clip();
      /* 벽 두 장(왼쪽: 칠판 벽, 뒤: 창문 벽) — 끝을 잘라 단면이 보인다 */
      I.box(ctx, -12, -12, -16, 0, 0, WH, "#c9ccd2", "#9aa0aa", "#9aa0aa");
      I.box(ctx, -12, 0, -16, 0, RD, WH, "#c9ccd2", "#9aa0aa", "#e9e4da");
      I.box(ctx, 0, -12, -16, RL, 0, WH, "#c9ccd2", "#efeae1", "#9aa0aa");
      Q([[0, 0, 0], [0, RD, 0], [0, RD, 6], [0, 0, 6]], "#b9ad98");                        /* 걸레받이 */
      Q([[0, 0, 0], [RL, 0, 0], [RL, 0, 6], [0, 0, 6]], "#b9ad98");
      /* 칠판 */
      Q([[0, 66, 66], [0, 254, 66], [0, 254, 154], [0, 66, 154]], "#6b4a2c");
      var cb = ctx.createLinearGradient(I.P(0, 70, 150).x, 0, I.P(0, 250, 70).x, 0); cb.addColorStop(0, "#2f6b52"); cb.addColorStop(1, "#1a4232");
      Q([[0, 70, 70], [0, 250, 70], [0, 250, 150], [0, 70, 150]], cb);
      ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 1.4;
      var c1 = I.P(0, 110, 128), c2 = I.P(0, 190, 128); ctx.beginPath(); ctx.moveTo(c1.x, c1.y); ctx.lineTo(c2.x, c2.y); ctx.stroke();
      c1 = I.P(0, 110, 110); c2 = I.P(0, 160, 110); ctx.beginPath(); ctx.moveTo(c1.x, c1.y); ctx.lineTo(c2.x, c2.y); ctx.stroke();
      /* 창문(뒤 벽) */
      Q([[296, 0, 56], [424, 0, 56], [424, 0, 156], [296, 0, 156]], "#8a7660");
      var sky = ctx.createLinearGradient(0, I.P(300, 0, 150).y, 0, I.P(420, 0, 60).y);
      sky.addColorStop(0, open ? "#9fd0ff" : "#5d86b8"); sky.addColorStop(1, open ? "#e4f3ff" : "#2c4a78");
      Q([[300, 0, 60], [420, 0, 60], [420, 0, 152], [300, 0, 152]], sky);
      Q([[358, 0, 60], [362, 0, 60], [362, 0, 152], [358, 0, 152]], "#8a7660");
      if (open) Q([[300, 0, 62], [300 + 40, 46, 62], [300 + 40, 46, 150], [300, 0, 150]], "rgba(190,225,255,.55)", "#8a7660", 2.5);   /* 안으로 열린 창 */
      else { ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 3; c1 = I.P(312, 0, 66); c2 = I.P(340, 0, 146); ctx.beginPath(); ctx.moveTo(c1.x, c1.y); ctx.lineTo(c2.x, c2.y); ctx.stroke(); }
      /* 벽 습도계 */
      Q([[118, 0, 112], [168, 0, 112], [168, 0, 142], [118, 0, 142]], "#20283a", "#5b6a8c", 1.5);
      Q([[124, 0, 118], [162, 0, 118], [162, 0, 136], [124, 0, 136]], r >= 10 ? "#2fbf8f" : "#6fb8e8");
      /* 바닥(단면) */
      I.box(ctx, 0, 0, -16, RL, RD, 0, "#c9a777", "#8d8f96", "#6f727a");
      ctx.save(); ctx.strokeStyle = "rgba(90,60,30,.18)"; ctx.lineWidth = 1;
      for (i = 1; i < 12; i++) { c1 = I.P(i * 40, 0, 0); c2 = I.P(i * 40, RD, 0); ctx.beginPath(); ctx.moveTo(c1.x, c1.y); ctx.lineTo(c2.x, c2.y); ctx.stroke(); }
      ctx.restore();
      I.face(ctx, "front", function (Lw) {                          /* 바닥 단면: 콘크리트 알갱이 */
        var R = K.rng(5); ctx.fillStyle = "rgba(255,255,255,.18)";
        for (var k = 0; k < 120; k++) ctx.fillRect(R() * Lw, -16 + R() * 15, 1.6, 1.6);
      });
      /* 건조대와 젖은 수건 */
      var xe = TX0 + Math.max(n, 1) * TS + 4;
      [TX0 - 6, Math.max(xe, TX0 + 120)].forEach(function (lx) {
        I.box(ctx, lx - 2, RY - 22, 0, lx + 2, RY - 18, 4, "#8d97b4", "#6f7896", "#5b647f");
        I.box(ctx, lx - 2, RY + 18, 0, lx + 2, RY + 22, 4, "#8d97b4", "#6f7896", "#5b647f");
        Q([[lx, RY - 20, 2], [lx, RY, 128], [lx, RY + 20, 2]], null, "#9aa3bf", 3);
      });
      Q([[TX0 - 6, RY, 128], [Math.max(xe, TX0 + 120), RY, 128]], null, "#7d88a8", 3.5);
      for (i = 0; i < n; i++) {
        var x = TX0 + i * TS + 2, c = TC[i % 4], a = I.P(x, RY, 126), b = I.P(x + TW, RY, 40);
        var tg = ctx.createLinearGradient(a.x, 0, b.x, 0); tg.addColorStop(0, c[1]); tg.addColorStop(0.5, c[0]); tg.addColorStop(1, c[1]);
        Q([[x, RY, 126], [x + TW, RY, 126], [x + TW, RY, 40], [x, RY, 40]], tg);
        Q([[x, RY, 58], [x + TW, RY, 58], [x + TW, RY, 40], [x, RY, 40]], "rgba(0,0,40,.30)");   /* 젖어서 짙은 아랫단 */
        var du = (tt * 0.7 + i * 0.37) % 1, dp = I.P(x + TW / 2, RY, 38 - du * 34);
        ctx.globalAlpha = 1 - du; K.glow(ctx, dp.x, dp.y, 1.8, "rgba(127,211,255,.95)", 2); ctx.globalAlpha = 1;
      }
      /* 책상과 의자 */
      [[40, 186], [40, 244], [120, 186], [120, 244]].forEach(function (d) { desk(d[0], d[1]); });
      /* 수증기: 닫으면 방에 머물고, 환기하면 절반이 창밖으로 */
      if (n > 0) {
        var t0 = I.P(TX0, RY, 128), t1 = I.P(TX0 + n * TS, RY, 128);
        floatUp(ctx, n * 5, 41, tt * 0.22, t0.x, t1.x, Math.max(t0.y, t1.y) - 4, Math.min(t0.y, t1.y) - 110, "rgba(200,230,255,.85)", 2.6, 0);
        if (open) {
          var wc = I.P(360, 0, 110);
          floatUp(ctx, n * 2, 57, tt * 0.25, t0.x, t1.x, Math.min(t0.y, t1.y) - 10, wc.y, "rgba(200,230,255,.85)", 2.2, wc.x - (t0.x + t1.x) / 2);
          var ar0 = I.P(TX0 + n * 13, RY - 30, 150), ar1 = I.P(360, 8, 120);
          K.arrow(ctx, ar0, ar1, KC.yellow, 2.4, 10);
        }
      }
      /* 교실 공기: 잘린 두 면을 엷은 유리처럼 — 수증기가 늘수록 뿌옇게 */
      Q([[0, RD, 0], [RL, RD, 0], [RL, RD, WH], [0, RD, WH]], "rgba(150,200,255," + haze.toFixed(3) + ")");
      Q([[RL, 0, 0], [RL, RD, 0], [RL, RD, WH], [RL, 0, WH]], "rgba(120,175,240," + (haze * 1.2).toFixed(3) + ")");
      ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = "rgba(60,90,140,.45)"; ctx.lineWidth = 1.2;
      [[[0, RD, WH], [RL, RD, WH]], [[RL, RD, WH], [RL, 0, WH]], [[RL, RD, 0], [RL, RD, WH]]].forEach(function (e) { var p = I.P(e[0][0], e[0][1], e[0][2]), q = I.P(e[1][0], e[1][1], e[1][2]); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); });
      ctx.restore();
      ctx.restore();
      /* 이름표 */
      var box = [0, W];
      I.label(ctx, 143, 0, 142, "벽 습도계 " + (25 + r).toFixed(1) + "%", 80, -40, r >= 10 ? KC.green : "#bfe6ff", box);
      I.label(ctx, 424, 0, 150, open ? "창문 열림 · 20분마다 환기" : "창문 닫힘", 76, -8, open ? KC.yellow : "#e8ecff", box);
      I.label(ctx, TX0 + Math.max(n, 1) * TS / 2, RY, 40, n > 0 ? "젖은 수건 " + n + "장 · 물 " + (n * 50) + " g" : "빈 건조대 — 수건을 널어 보세요", 190, 96, "#bfe6ff", box);
      K.pill(ctx, "교실 공기 180 m³ · 20 °C · 한 시간", 18, 304, { s: 11.5, c: "#e8ecff", box: box });
      if (open) K.pill(ctx, "환기하면 수증기의 절반이 창밖으로", 18, 334, { s: 11.5, c: KC.yellow, box: box });
      /* 큰 글자 */
      var h1, h2;
      if (n === 0) { h1 = "수건 없는 교실"; h2 = "습도 25% 그대로"; }
      else if (ok) { h1 = "가장 적은 수로 넘었다"; h2 = "수건 " + n + "장 · 한 시간에 +" + r.toFixed(1) + "%p"; }
      else if (open) { h1 = "창문으로 수증기가 샌다"; h2 = "환기하면 효과가 절반 · +" + r.toFixed(1) + "%p"; }
      else if (r >= 10) { h1 = "목표는 넘었다"; h2 = "더 적은 수건으로도 될까?"; }
      else { h1 = "아직 목표에 못 미친다"; h2 = "수건 " + n + "장 · +" + r.toFixed(1) + "%p (목표 +10%p)"; }
      K.bigText(ctx, h1, 22, 48, 24, ok ? "#ffd35a" : "#ffffff");
      K.bigText(ctx, h2, 22, 78, 16, ok ? "#ffffff" : "#bfe6ff");
      K.warn(ctx, W - 14, 404, "⚠ 방·가구 크기와 수증기 알갱이는 보기 쉽게 그림", "right");
    }
    function drawBar(r, ok) {
      var y0 = MH + 8, now = 25 + r, bx0 = 60, bx1 = 840, yc = y0 + 90, i;
      function X(q) { return bx0 + (Math.max(20, Math.min(50, q)) - 20) / 30 * (bx1 - bx0); }
      K.card(ctx, 0, y0, W, H - y0, "한 시간 뒤 교실 습도");
      K.t(ctx, "수건 한 장 = 50 g ÷ (180 m³ × 17.3 g/m³) ≈ +" + PER.toFixed(1) + "%p", W - 18, y0 + 28, { s: 11, w: "700", c: LT.mute, a: "right" });
      ctx.fillStyle = "#e3e9f1"; ctx.beginPath(); ctx.roundRect(bx0, yc - 13, bx1 - bx0, 26, 13); ctx.fill();
      var lg = ctx.createLinearGradient(bx0, 0, X(now), 0); lg.addColorStop(0, "#1c7ed6"); lg.addColorStop(1, r >= 10 ? "#20c997" : "#74c0fc");
      ctx.fillStyle = lg; ctx.beginPath(); ctx.roundRect(bx0 + 3, yc - 10, Math.max(8, X(now) - bx0 - 6), 20, 10); ctx.fill();
      for (i = 20; i <= 50; i += 5) { ctx.strokeStyle = "rgba(20,40,90,.4)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(i), yc + 14); ctx.lineTo(X(i), yc + 20); ctx.stroke(); K.t(ctx, i + "%", X(i), yc + 34, { s: 10.5, w: "700", c: LT.mute, a: "center" }); }
      K.line(ctx, { x: X(25), y: yc - 22 }, { x: X(25), y: yc + 14 }, "rgba(20,40,90,.55)", 1.2, [3, 3]);
      K.t(ctx, "처음 25%", X(25), yc - 28, { s: 11, w: "800", a: "center", c: LT.mute });
      K.line(ctx, { x: X(35), y: yc - 22 }, { x: X(35), y: yc + 14 }, LT.yellow, 2.2, [5, 4]);
      K.t(ctx, "목표 35% (+10%p)", X(35), yc - 28, { s: 11, w: "800", a: "center", c: "#b07400" });
      ctx.fillStyle = r >= 10 ? LT.green : LT.blue; ctx.beginPath(); ctx.arc(X(now), yc, 6, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.stroke();
      K.t(ctx, "지금 " + now.toFixed(1) + "%", X(now), yc + 58, { s: 13, w: "900", a: "center", c: r >= 10 ? LT.green : LT.blue });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var r = rise(n, win), ok = win === "shut" && r >= 10 && rise(n - 1, win) < 10;
      drawModel(r, ok, win === "vent");
      drawBar(r, ok);
      return ok;
    }
    function update() {
      var ok = draw(), r = rise(n, win);
      readout("b-towel-read", [
        ["증발한 물", (n * 50) + " g", "b", "수건 " + n + "장 × 50 g" + (win === "vent" ? " · 환기로 절반이 밖으로" : "")],
        ["습도 변화", "+" + r.toFixed(1) + "%p", r >= 10 ? "g" : "y", "25% → " + (25 + r).toFixed(1) + "% · 한 장 = 50 g ÷ (180 m³ × 17.3 g/m³) ≈ " + PER.toFixed(1) + "%p"]
      ], ok ? ["g", "10%p를 넘기는 가장 적은 수"] : (r >= 10 ? ["g", "10%p 넘음 · 더 적게도 됩니다"] : ["r", win === "vent" ? "환기하면 효과가 절반" : "아직 10%p가 안 됩니다"]));
      put("b-towel-info", "수건 " + n + "장, 창문 " + (win === "shut" ? "닫음" : "20분마다 환기") + ": 한 시간 동안 습도가 " + r.toFixed(1) + "%p 오릅니다. "
        + (ok ? "✅ 7장이 가장 적은 수입니다. 가설은 지지되지만, 가습기 한 대 몫을 내려면 수건 여러 장이 필요합니다." : (win === "vent" ? "환기하면 수증기가 빠져나가 효과가 절반으로 줄어듭니다. 창문을 닫은 조건에서 찾으세요." : (r >= 10 ? "10%p는 넘었지만 더 적은 수로도 됩니다." : "아직 10%p가 안 됩니다."))));
      if (ok && !got) { got = true; window.sthState("towelGot", true); mission(); }
    }
    function mission() {
      if (got) {
        window.sthState("towelBest", "창문 닫고 수건 7장 → 한 시간에 +11%p");
        window.sthMission("m2-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("towelBest") + ". 증발량을 계산하면 해결책이 얼마나 쓸모 있는지 미리 판단할 수 있습니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    playBtn("b-towel-play", function () { return playing; }, function (q) { playing = q; }, "⏸ 수증기 멈추기", "▶ 수증기 움직이기");
    K.animate(canvas, function (dt) { if (playing && n > 0) { tt += dt / 1000; draw(); } });
    $("b-n").addEventListener("input", function (ev) { n = +ev.target.value; $("b-n-val").textContent = n + "장"; update(); });
    segWire("b-win", "data-v", function (x) { win = x; update(); });
    update(); mission();
  })();

  /* 장면 4 — 해결 과정 */
  (function () {
    var STEPS = [
      "문제 인식 — 겨울 교실이 건조해 목이 아프고 정전기가 난다 (습도 25%)",
      "가설 설정 — 가습기(또는 젖은 수건)를 쓰면 습도가 40~60%로 오를 것이다",
      "탐구 설계 — 가동 시간·수건 수를 바꾸고, 교실 온도·창문 조건은 같게 한다",
      "탐구 수행 — 습도계로 5분마다 습도를 재어 기록한다",
      "자료 해석과 결론 — 그래프로 나타내 가설이 지지되는지 판단한다",
      "적용과 평가 — 교실에 적용해 보고, 결로나 비용 같은 새 문제가 없는지 살핀다"
    ];
    function ok() { window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>해결책을 적용한 뒤에도 새 문제가 보이면, 그것이 다음 탐구의 출발점이 됩니다."); ep.clear(3); ep.clear(4); }
    if (ep.cleared(3)) { orderDone("b-order", STEPS); window.sthMission("m2-4", true); }
    else window.sthOrder({ mount: "b-order", steps: STEPS, onDone: ok });
  })();

  function finish() { window.sthState("r2", "완성 · " + (window.sthState("humBest") || "") + " / " + (window.sthState("towelBest") || "")); }
  function vs() {
    $("e2-vs").innerHTML = "<b>나의 첫 판단</b> " + (window.sthState("dry1") || "기록 없음") + "<br><b>가습기</b> " + (window.sthState("humBest") || "-") + "<br><b>젖은 수건</b> " + (window.sthState("towelBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk2", unitLabel: "[과학탐구실험2 Ⅰ-1] 이야기 ② 목이 따가운 교실",
    items: [
      { id: "w2", label: "확인할 방법", hint: "내가 고른 생활 속 원리나 해결책이 맞는지 확인하려면 무엇을 어떻게 재야 하는지 쓰세요.", ph: "잴 것: … / 재는 방법: … / 같게 둘 조건: …" },
      { id: "e2a", label: "우리 집의 작은 문제", hint: "집이나 학교에서 겪는 작은 불편 하나를 골라, 과학적 문제 해결 과정의 첫 두 단계(문제 인식, 가설 설정)를 써 보세요." }
    ]
  });
})();

/* ========================================================================= 05 정리하기 */
window.sthWork({
  mount: "wk", unitLabel: "[과학탐구실험2 Ⅰ-1] 생활 속의 과학 탐구 — 정리",
  recap: [
    { key: "r1", label: "① 비행기 안의 고요" },
    { key: "r2", label: "② 목이 따가운 교실" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  items: [
    { id: "all", label: "두 탐구를 꿰는 한 문장", hint: "헤드폰과 교실 습도, 두 이야기를 ‘생활’과 ‘과학 원리’라는 말을 넣어 한 문장으로 이어 보세요." },
    { id: "w3", label: "아직 헷갈리는 것", hint: "다음 시간에 여기서부터 시작합니다." }
  ]
});

/* ========================================================================= 06 우리 반 */
window.sthShare({
  mount: "share", unit: "gt2-2-1", unitLabel: "[과학탐구실험2 Ⅰ-1] 생활 속의 과학 탐구",
  rows: [
    { key: "r1", label: "① 비행기 안의 고요" },
    { key: "r2", label: "② 목이 따가운 교실" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "두 탐구를 꿰는 한 문장" }
});

})();
