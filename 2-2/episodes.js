/* 과학탐구실험2 Ⅱ-1 미래 사회와 첨단 과학 탐구 — 이야기 두 편
   01 고양이를 못 알아보는 인공지능 / 02 방학 동안의 화분
   공용 부품: ../assets/theme.js (sthUnit·sthGate·sthWork), ../assets/story.js (sthStory·sthSort·sthOrder·sthPick) */
(function () {
"use strict";

window.sthUnit("gt2-2-2");

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
function orderDone(mount, steps) {
  $(mount).innerHTML = "<div class='order sort'><div class='slots'>" + steps.map(function (s) { return "<div class='slot filled'>" + s + "</div>"; }).join("") + "</div></div>";
}
function fmtN(n) { return n >= 10000 ? Math.round(n).toLocaleString() : String(Math.round(n)); }

/* ---- 무대 그림 도구 (../assets/kit.js) ---- */
var K = window.sthKit, KC = K.C, REDUCE = K.REDUCE;
function playBtn(id, get, set, onL, offL) {
  var b = $(id); if (!b) return;
  function lab() { b.textContent = get() ? onL : offL; }
  b.addEventListener("click", function () { set(!get()); lab(); }); lab();
}
function hline(ctx, x0, x1, y, col, dash) { K.line(ctx, { x: x0, y: y }, { x: x1, y: y }, col, 1.2, dash || [5, 5]); }
function vline(ctx, x, y0, y1, col, dash) { K.line(ctx, { x: x, y: y0 }, { x: x, y: y1 }, col, 1.2, dash || [4, 4]); }
function readout(id, rows, ok) {
  var h = rows.map(function (r) { return "<span class='k'>" + r[0] + "</span><span class='v " + (r[2] || "") + "'>" + r[1] + "</span>" + (r[3] ? "<span class='sub'>" + r[3] + "</span>" : ""); }).join("");
  if (ok) h += "<span class='ok " + ok[0] + "'>" + ok[1] + "</span>";
  put(id, h);
}
/* ---- 밝은 스튜디오 + 입체 미니어처 (../assets/kit.js 의 K.studio · K.iso · K.card) ---- */
var LT = K.LT;
function lt(ctx, s, x, y, o) { o = o || {}; K.t(ctx, s, x, y, { s: o.s || 12, w: o.w || "700", a: o.a, c: o.c || LT.ink }); }
function sideCard(ctx, x, W, H, title, y0) { y0 = y0 || 0; K.card(ctx, x, y0, W - x, H - y0, title); return { px: x + 18, R: W - 18, w: W - x - 36 }; }
function tag(ctx, s, x, y, c, a, box) { return K.pill(ctx, s, x, y, { s: 11.5, a: a, c: c || LT.ink, bg: "rgba(255,255,255,.92)", line: "rgba(20,40,90,.18)", box: box }); }
function floorSh(ctx, x, y, rx, ry, a) {
  var g = ctx.createRadialGradient(x, y, 2, x, y, rx);
  g.addColorStop(0, "rgba(20,30,50," + (a || .28) + ")"); g.addColorStop(.6, "rgba(20,30,50,.07)"); g.addColorStop(1, "rgba(20,30,50,0)");
  ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx); ctx.translate(-x, -y); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rx, 0, 6.2832); ctx.fill(); ctx.restore();
}
function metalG(ctx, x0, y0, x1, y1) { var g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, "#f6f8fb"); g.addColorStop(.5, "#aab3c3"); g.addColorStop(1, "#5b6476"); return g; }
/* 비스듬한 상자: 앞면 x..x+w, 바닥 y, 높이 h, 깊이 d */
function box3(ctx, x, y, w, h, d, col, front) {
  if (h < .5) return;
  ctx.fillStyle = K.tint(col, 1.18); ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x + d, y - h - d * .55); ctx.lineTo(x + w + d, y - h - d * .55); ctx.lineTo(x + w, y - h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = K.tint(col, .72); ctx.beginPath(); ctx.moveTo(x + w, y - h); ctx.lineTo(x + w + d, y - h - d * .55); ctx.lineTo(x + w + d, y - d * .55); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fill();
  var g = ctx.createLinearGradient(0, y - h, 0, y); g.addColorStop(0, K.tint(col, 1.02)); g.addColorStop(1, K.tint(col, .85)); ctx.fillStyle = front || g; ctx.fillRect(x, y - h, w, h);
}
/* 글자 줄바꿈(카드 안) */
function lWrap(ctx, s, x, y, maxW, lh, o) {
  o = o || {}; ctx.font = (o.w || "600") + " " + (o.s || 11) + "px " + FONT;
  var line = "", n = 0, i;
  for (i = 0; i < s.length; i++) { var t = line + s.charAt(i); if (ctx.measureText(t).width > maxW && line.length) { lt(ctx, line, x, y + n * lh, { s: o.s || 11, w: o.w || "600", c: o.c || LT.mute }); n++; line = s.charAt(i); } else line = t; }
  if (line) { lt(ctx, line, x, y + n * lh, { s: o.s || 11, w: o.w || "600", c: o.c || LT.mute }); n++; }
  return n;
}
/* 고양이 얼굴 아이콘 (흰·검은) */
function catFace(ctx, x, y, r, white, alpha) {
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  var g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r * 1.1);
  if (white) { g.addColorStop(0, "#ffffff"); g.addColorStop(1, "#b7ae9e"); } else { g.addColorStop(0, "#5a5e6e"); g.addColorStop(1, "#101218"); }
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(x - r * 0.95, y - r * 0.15); ctx.lineTo(x - r * 0.8, y - r * 1.15); ctx.lineTo(x - r * 0.2, y - r * 0.8);
  ctx.lineTo(x + r * 0.2, y - r * 0.8); ctx.lineTo(x + r * 0.8, y - r * 1.15); ctx.lineTo(x + r * 0.95, y - r * 0.15); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(x, y + r * 0.05, r * 0.95, 0, 6.2832); ctx.fill();
  if (!white) { ctx.strokeStyle = "rgba(200,210,255,.35)"; ctx.lineWidth = 1; ctx.stroke(); }
  ctx.fillStyle = white ? "#3b3f52" : "#d7e86a";
  ctx.beginPath(); ctx.ellipse(x - r * 0.36, y - r * 0.05, r * 0.14, r * 0.2, 0, 0, 6.2832); ctx.ellipse(x + r * 0.36, y - r * 0.05, r * 0.14, r * 0.2, 0, 0, 6.2832); ctx.fill();
  ctx.fillStyle = "#e58aa0"; ctx.beginPath(); ctx.moveTo(x - r * 0.12, y + r * 0.25); ctx.lineTo(x + r * 0.12, y + r * 0.25); ctx.lineTo(x, y + r * 0.38); ctx.closePath(); ctx.fill();
  ctx.restore();
}

/* =========================================================================
   이야기 ① 고양이를 못 알아보는 인공지능
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep1", key: "ep1", name: "첨단 탐구 ①", onDone: finish });

  window.sthGate({
    gate: "g1", key: "ai1", title: "부원의 첫 추측",
    question: "사진 속 고양이를 알아보는 인공지능은 구별하는 방법을 어떻게 익힐까요?",
    options: ["㉠ 사람이 ‘귀가 뾰족하면 고양이’ 같은 규칙을 하나하나 입력한다", "㉡ 이름표가 붙은 많은 사진을 보며, 고양이를 구별하는 특징의 패턴을 스스로 찾아낸다", "㉢ 인터넷에서 정답을 그때그때 검색한다", "㉣ 처음부터 모든 동물을 알고 태어난다"],
    onPick: function (i) { window.sthState("ai1OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 데이터 양 */
  (function () {
    var canvas = $("a-c-data"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, L = 1;
    var got = window.sthState("dataGot") || { a: false, q: false };
    function acc(l) { return 0.97 - 0.47 * Math.exp(-(l - 1) / 1.1); }
    /* 입체 미니어처: 스튜디오 바닥 위에 쌓인 학습 사진 더미(맨 위 한 장에 고양이) → 인공지능 칩 상자와 그 위 유리판 신경망.
       사진이 많을수록 더미가 높고 연결선이 진해진다. 가운데는 밝은 그래프, 오른쪽은 판정 카드. */
    var LB2 = ["10", "100", "1천", "1만", "10만", "100만"];
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var a = acc(L), ok = a >= 0.9 && acc(L - 0.1) < 0.9, LW = 622, i, j;
      var ac = a >= 0.9 ? LT.green : LT.orange, fq = (a - 0.4) / 0.6;
      K.studio(ctx, 0, 0, LW, H, null);
      floorSh(ctx, 140, 292, 150, 20, .28);
      /* 사진 더미 */
      var nC = Math.round(2 + L * 2.2), sx = 22, sy = 290, sw = 84, sd = 30, th = 6.5;
      for (i = 0; i < nC; i++) box3(ctx, sx + (i % 3 - 1) * 1.5, sy - i * th, sw, th - 1, sd, i % 2 ? "#e6ebf3" : "#d3dbe7");
      var topY = sy - nC * th + 1;
      ctx.save(); ctx.transform(1, 0, -sd / 30, .55 * sd / 30, sx + sd, topY - .55 * sd);
      var phg = ctx.createLinearGradient(6, 2, sw - 6, 28); phg.addColorStop(0, "#3d6a9e"); phg.addColorStop(1, "#1c2e52");
      ctx.fillStyle = phg; ctx.fillRect(6, 3, sw - 12, 24);
      catFace(ctx, sw / 2, 17, 8, true);
      ctx.restore();
      tag(ctx, "학습 사진 " + fmtN(Math.pow(10, L)) + "장", 76, H - 12, LT.blue, "center", [0, LW]);
      /* 인공지능 칩 상자 */
      K.arrow(ctx, { x: 128, y: 250 }, { x: 150, y: 250 }, LT.mute, 2.2, 9);
      box3(ctx, 152, 292, 88, 30, 24, "#2f3a5c");
      for (i = 0; i < 4; i++) K.glow(ctx, 164 + i * 14, 278, 1.6, i < Math.round(1 + fq * 3) ? "rgba(63,211,163,.95)" : "rgba(150,160,180,.6)", 2.4);
      /* 유리판 + 신경망 */
      var gp = ctx.createLinearGradient(160, 96, 250, 250); gp.addColorStop(0, "rgba(255,255,255,.75)"); gp.addColorStop(1, "rgba(200,220,245,.45)");
      ctx.fillStyle = gp; ctx.beginPath(); ctx.moveTo(158, 252); ctx.lineTo(158, 104); ctx.lineTo(182, 90); ctx.lineTo(258, 90); ctx.lineTo(258, 240); ctx.lineTo(234, 252); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(90,120,160,.55)"; ctx.lineWidth = 1.2; ctx.stroke();
      var Lx = [176, 208, 240], Ly = [[118, 150, 182, 214], [110, 140, 170, 200, 230], [140, 200]], nodes = [];
      for (i = 0; i < 3; i++) { nodes.push(Ly[i].map(function (yy) { return { x: Lx[i], y: yy }; })); }
      for (i = 0; i < 2; i++) for (j = 0; j < nodes[i].length; j++) for (var k = 0; k < nodes[i + 1].length; k++) {
        var w8 = 0.1 + 0.75 * ((j * 7 + k * 3 + i) % 5) / 4 * fq;
        K.line(ctx, nodes[i][j], nodes[i + 1][k], "rgba(28,126,214," + w8.toFixed(2) + ")", 1.3);
      }
      for (i = 0; i < 2; i++) nodes[i].forEach(function (n) { K.planet(ctx, n.x, n.y, 6.5, "#74c0fc", "#1c4f8a"); });
      K.planet(ctx, nodes[2][0].x, nodes[2][0].y, 5 + 5 * fq, "#63e6be", "#087f5b");
      K.planet(ctx, nodes[2][1].x, nodes[2][1].y, 5 + 5 * (1 - fq), "#ff8787", "#a61e1e");
      lt(ctx, "고양이", nodes[2][0].x, nodes[2][0].y - 14, { s: 10.5, w: "900", a: "center", c: LT.green });
      lt(ctx, "아님", nodes[2][1].x, nodes[2][1].y + 22, { s: 10.5, w: "900", a: "center", c: LT.red });
      tag(ctx, "인공지능", 200, H - 12, LT.ink, "center", [140, 266]);
      K.bigText(ctx, "정답률 " + (a * 100).toFixed(1) + "%", 16, 42, 25, a >= 0.9 ? "#8ff0c4" : "#ffffff");
      K.bigText(ctx, "사진 " + fmtN(Math.pow(10, L)) + "장", 16, 70, 16, "#ffd35a");
      /* 가운데: 밝은 그래프 */
      var g = K.chart(ctx, { x: 268, y: 14, w: LW - 276, h: H - 20, light: true, x0: 1, x1: 6, y0: 0.4, y1: 1, xt: 5, yt: 6, xl: "학습 사진 수 (눈금마다 10배)",
        xf: function (q) { return LB2[Math.round(q) - 1]; }, yf: function (q) { return Math.round(q * 100) + "%"; } });
      ctx.fillStyle = "rgba(15,159,118,.08)"; ctx.fillRect(g.L, g.T, g.R - g.L, g.Y(0.9) - g.T);
      hline(ctx, g.L, g.R, g.Y(0.9), LT.yellow);
      tag(ctx, "목표 90%", g.R - 6, g.Y(0.9) + 22, LT.yellow, "right", [g.L, LW]);
      var pts = []; for (var l = 1; l <= 6.001; l += 0.05) pts.push([l, acc(l)]);
      K.plot(ctx, g, pts, LT.blue, { light: true, w: 3 });
      if (L <= 5) {
        var a2 = acc(L + 1), xA = g.X(L), xB = g.X(L + 1);
        ctx.strokeStyle = LT.violet; ctx.lineWidth = 1.6; ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(xA, g.Y(a)); ctx.lineTo(xB, g.Y(a)); ctx.lineTo(xB, g.Y(a2)); ctx.stroke(); ctx.setLineDash([]);
        tag(ctx, "10배 → +" + ((a2 - a) * 100).toFixed(1) + "%p", xB + 8, (g.Y(a) + g.Y(a2)) / 2 + 24, LT.violet, "left", [g.L, LW]);
      }
      var cx = g.X(L), cy = g.Y(a);
      vline(ctx, cx, cy, g.B, "rgba(20,40,90,.35)");
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx, cy, 7, 0, 6.2832); ctx.fill();
      ctx.fillStyle = ac; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 6.2832); ctx.fill();
      /* 오른쪽 판정 카드 */
      var cd = sideCard(ctx, LW + 10, W, H, "처음 보는 사진 시험");
      lt(ctx, (a * 100).toFixed(1) + "%", cd.px, 66, { s: 26, w: "900", c: ac });
      lt(ctx, "정답률", cd.R, 66, { s: 11.5, a: "right", c: LT.mute });
      K.row(ctx, "학습 사진", fmtN(Math.pow(10, L)) + "장", cd.px, cd.R, 102);
      K.row(ctx, "목표", "90% 이상", cd.px, cd.R, 128, LT.yellow);
      K.bar(ctx, cd.px, 140, cd.w, (a - 0.4) / 0.6, ac);
      ctx.fillStyle = LT.ink; ctx.fillRect(cd.px + cd.w * 5 / 6 - 1, 136, 2, 18);
      K.row(ctx, "사진 10배 더", L < 6 ? "+" + ((acc(Math.min(6, L + 1)) - a) * 100).toFixed(1) + "%p" : "-", cd.px, cd.R, 184, LT.violet);
      K.tip(ctx, ok ? "90%에 이르는 가장 적은 수" : (a >= 0.9 ? "90% 넘음 · 더 적어도 됩니다" : "아직 90%에 못 미칩니다"), cd.px - 4, 204, cd.w + 8, ok ? true : (a >= 0.9 ? null : false));
      lt(ctx, "사진이 많을수록 잘 맞히지만,", cd.px, 264, { s: 11, w: "600", c: LT.mute });
      lt(ctx, "오르는 폭은 점점 줄어듭니다.", cd.px, 282, { s: 11, w: "600", c: LT.mute });
      return ok;
    }
    function update() {
      var ok = draw(), a = acc(L);
      readout("a-data-read", [
        ["학습 사진", fmtN(Math.pow(10, L)) + "장", "b", "10의 " + L.toFixed(1) + "제곱"],
        ["정답률", (a * 100).toFixed(1) + "%", a >= 0.9 ? "g" : "y", L < 6 ? "사진을 10배 늘리면 +" + ((acc(Math.min(6, L + 1)) - a) * 100).toFixed(1) + "%p" : ""]
      ], ok ? ["g", "90%에 이르는 가장 적은 수"] : (a >= 0.9 ? ["g", "90% 넘음 · 더 적어도 됩니다"] : ["r", "아직 90%에 못 미칩니다"]));
      put("a-data-info", "학습 사진 " + fmtN(Math.pow(10, L)) + " 장: 처음 보는 사진을 " + (a * 100).toFixed(1) + "% 맞힙니다. "
        + (ok ? "✅ 약 1,260 장이 90%에 이르는 가장 적은 수입니다." : (a >= 0.9 ? "90%는 넘었지만 더 적은 사진으로도 됩니다." : "아직 90%에 못 미칩니다.")));
      if (ok && !got.a) { got.a = true; window.sthState("dataGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-2a"); if (got.q) done("m1-2b");
      if (got.a && got.q) {
        window.sthState("dataBest", "약 1,260 장에서 90%, 그 뒤로는 10배마다 조금씩");
        window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("dataBest") + ". 데이터가 많을수록 좋지만, 늘어나는 폭은 점점 줄어듭니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("a-n").addEventListener("input", function (ev) { L = +ev.target.value; $("a-n-val").textContent = fmtN(Math.pow(10, L)) + " 장"; update(); });
    window.sthPick({
      mount: "a-data-pick",
      q: "학습 사진을 1만 장에서 10만 장, 100만 장으로 10배씩 늘리면 정답률은 어떻게 될까요?",
      options: ["10배씩 늘 때마다 정답률도 10%p씩 계속 오른다", "계속 오르긴 하지만, 오르는 폭이 점점 작아진다", "사진이 많아지면 오히려 떨어진다"],
      answer: 1,
      why: ["그래프는 점점 평평해집니다.", "처음에는 조금만 늘려도 크게 오르지만, 이미 잘하는 인공지능은 훨씬 많은 사진이 있어야 조금 더 나아집니다.", "이 그래프에서는 떨어지지 않습니다. 다만 데이터의 질이 나쁘면 그럴 수도 있습니다."],
      onDone: function () { got.q = true; window.sthState("dataGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 3 — 데이터 편향 */
  (function () {
    var canvas = $("a-c-bias"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, p = 90;
    var got = window.sthState("biasGot") || { a: false, q: false };
    function aw(q) { return 0.95 - 0.22 * Math.pow(1 - q, 2); }
    /* 입체 미니어처: 학습 사진 100장을 고양이 인형 100개로 바꿔 나무 쟁반(블록) 위에 10 × 10으로 세운다(한 마리 = 1%).
       오른쪽 판정 카드: 학습 구성 띠 + 흰·검은 고양이를 알아본 비율 막대와 기준 85%. */
    var IB = K.iso({ ox: 300, oy: 92, s: 0.92, L: 196, D: 196 });
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var q = p / 100, w = aw(q), b = aw(1 - q), ok = w >= 0.85 && b >= 0.85, LW = 520, i, j;
      K.studio(ctx, 0, 0, LW, H, null);
      floorSh(ctx, 312, 276, 200, 26, .3);
      IB.box(ctx, 0, 0, 0, 196, 196, 14, "#e2c99f", "#c49a63", "#a57c48");
      ctx.save(); ctx.strokeStyle = "rgba(120,80,40,.25)"; ctx.lineWidth = 1;
      for (i = 1; i < 10; i++) { var a1 = IB.P(i * 19.6, 0, 14), a2 = IB.P(i * 19.6, 196, 14), b1 = IB.P(0, i * 19.6, 14), b2 = IB.P(196, i * 19.6, 14); K.line(ctx, a1, a2, "rgba(120,80,40,.22)", 1); K.line(ctx, b1, b2, "rgba(120,80,40,.22)", 1); }
      ctx.restore();
      for (var s0 = 0; s0 <= 18; s0++) for (i = Math.max(0, s0 - 9); i <= Math.min(9, s0); i++) {
        j = s0 - i;
        var idx = j * 10 + i, pp = IB.P(9.8 + i * 19.6, 9.8 + j * 19.6, 14);
        ctx.fillStyle = "rgba(40,30,20,.22)"; ctx.beginPath(); ctx.ellipse(pp.x + 2, pp.y + 1, 7, 2.6, 0, 0, 6.2832); ctx.fill();
        catFace(ctx, pp.x, pp.y - 8, 7.4, idx < p);
      }
      tag(ctx, "흰 고양이 사진 " + p + "장", 120, 250, "#7a5b2e", "center", [0, LW]);
      tag(ctx, "검은 고양이 사진 " + (100 - p) + "장", 470, 250, LT.ink, "center", [0, LW]);
      K.bigText(ctx, ok ? "둘 다 알아본다" : (w < b ? "흰 고양이를 놓친다" : "검은 고양이를 놓친다"), 16, 42, 24, ok ? "#8ff0c4" : "#ffffff");
      K.bigText(ctx, "학습 사진 100장 구성", 16, 68, 15, "#ffd35a");
      K.warn(ctx, LW - 12, H - 12, "⚠ 한 마리 = 학습 사진의 1%", "right");
      /* 오른쪽 판정 카드 */
      var cd = sideCard(ctx, LW + 10, W, H, "처음 보는 사진을 알아본 비율");
      var bw = cd.w;
      ctx.fillStyle = "#efe9dc"; ctx.beginPath(); ctx.roundRect(cd.px, 44, bw * q, 12, [6, 0, 0, 6]); ctx.fill();
      ctx.fillStyle = "#23262f"; ctx.beginPath(); ctx.roundRect(cd.px + bw * q, 44, bw * (1 - q), 12, [0, 6, 6, 0]); ctx.fill();
      ctx.strokeStyle = "rgba(20,40,90,.25)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.roundRect(cd.px, 44, bw, 12, 6); ctx.stroke();
      lt(ctx, "학습: 흰 " + p + "% · 검은 " + (100 - p) + "%", cd.px, 74, { s: 11, c: LT.mute });
      function BX(x) { return cd.px + 44 + (bw - 44) * (x - 0.5) / 0.5; }
      [[w, true, "흰 고양이"], [b, false, "검은 고양이"]].forEach(function (r, k) {
        var y = 104 + k * 62, col = r[0] >= 0.85 ? LT.green : LT.red;
        catFace(ctx, cd.px + 16, y + 12, 14, r[1]);
        K.row(ctx, r[2], (r[0] * 100).toFixed(1) + "%", cd.px + 44, cd.R, y, col);
        ctx.fillStyle = "#e3e9f1"; ctx.beginPath(); ctx.roundRect(cd.px + 44, y + 10, bw - 44, 12, 6); ctx.fill();
        ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(cd.px + 44, y + 10, Math.max(6, BX(r[0]) - cd.px - 44), 12, 6); ctx.fill();
      });
      ctx.strokeStyle = LT.yellow; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(BX(0.85), 96); ctx.lineTo(BX(0.85), 192); ctx.stroke(); ctx.setLineDash([]);
      lt(ctx, "기준 85%", BX(0.85), 208, { s: 11, a: "center", c: LT.yellow, w: "800" });
      lt(ctx, "50%", cd.px + 44, 208, { s: 10, c: LT.dim }); lt(ctx, "100%", cd.R, 208, { s: 10, a: "right", c: LT.dim });
      K.tip(ctx, ok ? "털색과 상관없이 알아봅니다" : "적게 본 쪽을 잘 못 알아봅니다", cd.px - 4, 224, bw + 8, ok);
      lt(ctx, "인공지능의 판단은 학습 데이터를 닮습니다.", cd.px, 280, { s: 11, c: LT.mute, w: "600" });
      return ok;
    }
    function update() {
      var ok = draw(), q = p / 100;
      put("a-bias-info", "흰 고양이 " + p + "%, 검은 고양이 " + (100 - p) + "%로 학습: 흰 고양이 " + (aw(q) * 100).toFixed(1) + "%, 검은 고양이 " + (aw(1 - q) * 100).toFixed(1) + "%를 알아봅니다. "
        + (ok ? "✅ 두 고양이를 모두 잘 알아봅니다. 학습 데이터를 고르게 섞었기 때문입니다." : "적게 본 쪽을 잘 못 알아봅니다."));
      if (ok && !got.a) { got.a = true; window.sthState("biasGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-3a"); if (got.q) done("m1-3b");
      if (got.a && got.q) {
        window.sthState("biasBest", "흰·검은 고양이를 35~65%로 섞으면 둘 다 85% 이상");
        window.sthMission("m1-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("biasBest") + ". 인공지능의 판단은 학습 데이터를 닮습니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    $("a-p").addEventListener("input", function (ev) { p = +ev.target.value; $("a-p-val").textContent = p + "%"; update(); });
    window.sthPick({
      mount: "a-bias-pick",
      q: "학습 데이터가 한쪽으로 치우친 인공지능을 사람을 판단하는 일(얼굴 인식, 채용 등)에 쓰면 어떤 문제가 생길 수 있을까요?",
      options: ["아무 문제가 없다 — 인공지능은 늘 공정하다", "데이터에 적게 들어 있던 사람들을 더 자주 잘못 판단해 불공정한 결과가 생길 수 있다", "인공지능이 스스로 데이터를 고쳐 문제가 저절로 사라진다"],
      answer: 1,
      why: ["인공지능은 보여 준 데이터를 닮기 때문에 데이터의 치우침도 그대로 배웁니다.", "그래서 첨단 기술을 쓸 때는 데이터를 고르게 모으고, 결과를 여러 집단으로 나누어 확인해야 합니다.", "사람이 데이터를 살피고 고쳐야 합니다."],
      onDone: function () { got.q = true; window.sthState("biasGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 4 — 첨단 기술 속 과학 원리 */
  window.sthSort({
    mount: "a-sort",
    buckets: [{ id: "phy", label: "⚡ 물리 — 빛·전기·운동" }, { id: "chem", label: "🧪 화학 — 물질과 반응" }, { id: "bio", label: "🧬 생명과학 — 유전자·세포" }, { id: "info", label: "💻 정보 — 데이터·알고리즘" }],
    items: [
      { t: "자율 주행차의 라이다 — 레이저 빛이 반사되어 돌아오는 시간으로 거리를 잰다", a: "phy", why: "빛의 속력과 반사를 씁니다." },
      { t: "VR 헤드셋 — 두 눈에 조금씩 다른 영상을 보여 입체감을 만든다", a: "phy", why: "두 눈의 시차와 렌즈의 굴절을 씁니다." },
      { t: "리튬 이온 전지 — 리튬 이온이 두 전극 사이를 오가며 충전·방전된다", a: "chem", why: "산화·환원 반응을 씁니다." },
      { t: "수소 연료 전지차 — 수소와 산소가 반응해 물이 되며 전기를 만든다", a: "chem", why: "화학 반응의 에너지를 전기로 바꿉니다." },
      { t: "유전자 가위 — 특정 DNA 염기 서열을 찾아 자르고 고친다", a: "bio", why: "DNA 염기의 짝짓기를 이용합니다." },
      { t: "mRNA 백신 — 세포가 바이러스의 표면 단백질(항원)을 만들어 면역을 익히게 한다", a: "bio", why: "세포의 단백질 합성과 면역을 씁니다.", hint: "세포 속에서 무슨 일이 일어나나요?" },
      { t: "사진 속 고양이를 알아보는 인공지능 — 많은 사진에서 특징의 패턴을 학습한다", a: "info", why: "데이터에서 패턴을 찾는 알고리즘입니다." },
      { t: "동영상 추천 — 비슷한 사람들이 본 영상을 분석해 골라 준다", a: "info", why: "많은 사용 기록을 분석하는 알고리즘입니다." }
    ],
    onDone: function () { window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>첨단 기술도 결국 교과서의 과학 원리 위에 서 있습니다. 여러 분야의 원리를 함께 쓰는 기술도 많아요(자율 주행차 = 라이다 + 인공지능)."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m1-4", true);

  function finish() { window.sthState("r1", "완성 · " + (window.sthState("dataBest") || "") + " / " + (window.sthState("biasBest") || "")); }
  function vs() {
    $("e1-vs").innerHTML = "<b>나의 첫 추측</b> " + (window.sthState("ai1") || "기록 없음") + "<br><b>데이터의 양</b> " + (window.sthState("dataBest") || "-") + "<br><b>데이터의 구성</b> " + (window.sthState("biasBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk1", unitLabel: "[과학탐구실험2 Ⅱ-1] 이야기 ① 고양이를 못 알아보는 인공지능",
    items: [
      { id: "e1a", label: "인공지능이 배우는 방법", hint: "데이터의 양과 구성이 인공지능의 판단에 어떤 영향을 주는지, 이 장면의 결과를 들어 두세 문장으로 쓰세요." },
      { id: "e1b", label: "내가 고른 첨단 기술", hint: "관심 있는 첨단 기술 하나를 골라, 그 속의 과학 원리와 쓰임, 한계를 한 문단으로 쓰세요." },
      { id: "e1c", label: "알게 된 것 나누기", hint: "보호소나 친구들에게 이번에 알아낸 것(데이터 편향과 고르게 모으는 방법)을 알리는 짧은 안내문이나 게시글을 써 보세요. 그래프 하나를 넣을지, 어디에 올릴지도 함께 적으세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ② 방학 동안의 화분
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep2", key: "ep2", name: "첨단 탐구 ②", onDone: finish });

  window.sthGate({
    gate: "g2", key: "sens1", title: "부원의 첫 설계",
    question: "스스로 물을 주는 장치를 만들려면 어떤 부품들이 필요할까요?",
    options: ["㉠ 타이머 하나 — 정해진 시각마다 물을 준다", "㉡ 흙의 수분을 재는 센서, 값을 판단하는 제어 장치, 물을 보내는 펌프", "㉢ 커다란 물통 하나", "㉣ 카메라 하나"],
    onPick: function (i) { window.sthState("sens1OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 센서 보정 */
  (function () {
    var canvas = $("b-c-cal"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, dry = 1000, wet = 200;
    var got = window.sthState("calGot") || { a: false, q: false };
    var RD = 820, RW = 380;
    function raw(pct) { return RD - (RD - RW) * pct / 100; }
    function read(r) { return (dry - r) / (dry - wet) * 100; }
    function mix(a, b, q) { return "rgb(" + [0, 1, 2].map(function (k) { return Math.round(a[k] + (b[k] - a[k]) * q); }).join(",") + ")"; }
    /* 입체 미니어처: 스튜디오 바닥 위 토분 네 개. 앞을 잘라 낸 단면으로 흙과 두 갈래 센서가 보이고,
       센서 위 작은 화면 모듈이 센서 값과 읽은 수분을 보여 준다. 오른쪽 판정 카드 안에 밝은 보정선 그래프. */
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var LW = 520, i;
      var cols = [["마른 흙", 0], ["젖은 흙", 100], ["시험 흙 ①", 50], ["시험 흙 ②", 30]];
      var r1 = read(raw(50)), r2 = read(raw(30)), ok = Math.abs(r1 - 50) <= 3 && Math.abs(r2 - 30) <= 3;
      function pc(q) { return isFinite(q) ? q.toFixed(1) + "%" : "계산 불가"; }
      K.studio(ctx, 0, 0, LW, H, null);
      floorSh(ctx, 260, 292, 250, 20, .26);
      cols.forEach(function (c, i) {
        var cx = 66 + i * 126, r = raw(c[1]), q = c[1] / 100, test = i >= 2, rd = read(r), good = Math.abs(rd - c[1]) <= 3;
        var soil = mix([206, 168, 112], [58, 36, 20], q), soilD = mix([170, 132, 84], [36, 22, 12], q);
        floorSh(ctx, cx + 6, 284, 64, 9, .32);
        /* 화분 몸통 */
        var pg = ctx.createLinearGradient(cx - 56, 0, cx + 56, 0); pg.addColorStop(0, "#8a3c1c"); pg.addColorStop(0.38, "#d9794a"); pg.addColorStop(1, "#7a3216");
        ctx.fillStyle = pg; ctx.beginPath(); ctx.moveTo(cx - 54, 182); ctx.lineTo(cx + 54, 182); ctx.lineTo(cx + 42, 282); ctx.lineTo(cx - 42, 282); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#6c2c12"; ctx.beginPath(); ctx.ellipse(cx, 282, 42, 6, 0, 0, Math.PI); ctx.fill();
        /* 앞을 잘라 낸 단면 */
        ctx.save(); ctx.beginPath(); ctx.moveTo(cx - 44, 192); ctx.lineTo(cx + 44, 192); ctx.lineTo(cx + 35, 272); ctx.lineTo(cx - 35, 272); ctx.closePath(); ctx.clip();
        var sg = ctx.createLinearGradient(0, 192, 0, 272); sg.addColorStop(0, soil); sg.addColorStop(1, soilD);
        ctx.fillStyle = sg; ctx.fillRect(cx - 46, 190, 92, 84);
        var Rs = K.rng(7 + i), k;
        for (k = 0; k < 70; k++) { ctx.fillStyle = Rs() > .5 ? "rgba(255,240,210,.25)" : "rgba(30,18,8,.32)"; ctx.fillRect(cx - 44 + Rs() * 88, 192 + Rs() * 80, 1.8, 1.8); }
        for (k = 0; k < Math.round(q * 14); k++) K.planet(ctx, cx - 36 + Rs() * 72, 200 + Rs() * 66, 1.8, "#a5d8ff", "#1c6fb8");
        [cx - 7, cx + 3].forEach(function (px) {
          var tg = ctx.createLinearGradient(px, 0, px + 5, 0); tg.addColorStop(0, "#b8860b"); tg.addColorStop(0.5, "#f5d67a"); tg.addColorStop(1, "#8a6508");
          ctx.fillStyle = tg; ctx.fillRect(px, 186, 5, 64);
        });
        ctx.restore();
        ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(cx - 44, 192); ctx.lineTo(cx + 44, 192); ctx.stroke();
        /* 테두리와 흙 윗면 */
        var rg = ctx.createLinearGradient(cx - 60, 0, cx + 60, 0); rg.addColorStop(0, "#a54a22"); rg.addColorStop(.4, "#e48b5a"); rg.addColorStop(1, "#8e3c18");
        ctx.fillStyle = rg; ctx.fillRect(cx - 60, 172, 120, 13);
        ctx.fillStyle = "#f0a072"; ctx.beginPath(); ctx.ellipse(cx, 172, 60, 8, 0, 0, 6.2832); ctx.fill();
        ctx.fillStyle = soil; ctx.beginPath(); ctx.ellipse(cx, 173, 53, 6, 0, 0, 6.2832); ctx.fill();
        /* 센서 머리와 화면 모듈 */
        box3(ctx, cx - 13, 175, 26, 16, 9, "#1f5fb4");
        K.glow(ctx, cx + 7, 167, 1.5, "rgba(255,80,90,.95)", 2.4);
        ctx.strokeStyle = "#2b2f3a"; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(cx + 2, 156); ctx.bezierCurveTo(cx + 16, 148, cx - 8, 146, cx, 136); ctx.stroke();
        box3(ctx, cx - 52, 136, 104, 50, 12, "#353b4a");
        var lg = ctx.createLinearGradient(0, 92, 0, 130); lg.addColorStop(0, "#2f7a55"); lg.addColorStop(1, "#164a31");
        ctx.fillStyle = lg; ctx.beginPath(); ctx.roundRect(cx - 46, 92, 92, 38, 4); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.fillRect(cx - 46, 92, 92, 10);
        K.t(ctx, "센서 값 " + Math.round(r), cx, 108, { s: 12.5, w: "900", a: "center", c: "#b8ffd9" });
        if (test) K.t(ctx, "읽음 " + pc(rd), cx, 124, { s: 11, w: "900", a: "center", c: good ? "#b8ffd9" : "#ffb3b3" });
        else K.t(ctx, "기준점 " + c[1] + "%", cx, 124, { s: 11, w: "700", a: "center", c: "#8fd9b0" });
        tag(ctx, c[0], cx, 312, test ? LT.blue : LT.ink, "center", [0, LW]);
        lt(ctx, "실제 수분 " + c[1] + "%", cx, 336, { s: 11, a: "center", c: LT.mute });
      });
      K.bigText(ctx, ok ? "보정 완료" : "숫자에 뜻이 없다", 16, 42, 24, ok ? "#8ff0c4" : "#ffffff");
      K.bigText(ctx, dry === wet ? "두 값이 같으면 보정선을 그을 수 없음" : "시험 흙 ① " + pc(r1) + " · ② " + pc(r2), 16, 68, 15, "#ffd35a");
      K.warn(ctx, LW - 12, 30, "⚠ 흙 색은 수분을 과장", "right");
      /* 오른쪽 판정 카드 + 보정선 */
      var cd = sideCard(ctx, LW + 10, W, H, "보정선: 센서 값 → 수분 %");
      var g = K.chart(ctx, { x: LW + 14, y: 40, w: W - LW - 22, h: H - 104, light: true, pl: 46, x0: 150, x1: 1050, y0: -20, y1: 120, xt: 6, yt: 7, xl: "센서 값", yf: function (q) { return Math.round(q) + "%"; } });
      ctx.save(); ctx.beginPath(); ctx.rect(g.L, g.T, g.R - g.L, g.B - g.T); ctx.clip();
      var lp = [[150, (dry - 150) / (dry - wet) * 100], [1050, (dry - 1050) / (dry - wet) * 100]];
      K.plot(ctx, g, lp, LT.yellow, { w: 3, light: true });
      [[dry, 0], [wet, 100]].forEach(function (pq) { ctx.fillStyle = LT.yellow; ctx.fillRect(g.X(pq[0]) - 5, g.Y(pq[1]) - 5, 10, 10); ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.strokeRect(g.X(pq[0]) - 5, g.Y(pq[1]) - 5, 10, 10); });
      cols.forEach(function (c, i) {
        var r = raw(c[1]), rd = read(r), good = Math.abs(rd - c[1]) <= 3, X = g.X(r);
        if (i >= 2 && !good) { K.line(ctx, { x: X, y: g.Y(c[1]) }, { x: X, y: g.Y(rd) }, LT.red, 2, [3, 3]); }
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(X, g.Y(c[1]), 6, 0, 6.2832); ctx.fill();
        ctx.fillStyle = i >= 2 ? LT.blue : LT.ink; ctx.beginPath(); ctx.arc(X, g.Y(c[1]), 4.2, 0, 6.2832); ctx.fill();
      });
      ctx.restore();
      tag(ctx, "● 실제 수분", g.R - 6, g.T + 18, LT.blue, "right", [g.L, W]);
      tag(ctx, "■ 내가 입력한 두 점", g.R - 6, g.T + 42, LT.yellow, "right", [g.L, W]);
      K.tip(ctx, ok ? "두 시험 흙이 ± 3% 안으로 읽힙니다" : "실제로 잰 값을 입력해 보세요", cd.px - 4, H - 50, cd.w + 8, ok ? true : false);
      return ok;
    }
    function update() {
      var ok = draw();
      put("b-cal-info", "시험 흙 ① 은 " + read(raw(50)).toFixed(1) + "%, 시험 흙 ② 는 " + read(raw(30)).toFixed(1) + "%로 읽힙니다. "
        + (ok ? "✅ 두 시험 흙이 모두 제대로 읽힙니다. 센서의 숫자가 이제 ‘수분 %’라는 뜻을 갖게 되었습니다." : "마른 흙과 젖은 흙에 꽂았을 때 실제로 나온 센서 값을 입력해 보세요."));
      if (ok && !got.a) { got.a = true; got.dry = dry; got.wet = wet; window.sthState("calGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m2-2a"); if (got.q) done("m2-2b");
      if (got.a && got.q) {
        window.sthState("calBest", "마른 흙 " + (got.dry || 820) + " → 0%, 젖은 흙 " + (got.wet || 380) + " → 100%로 보정");
        window.sthMission("m2-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("calBest") + ". 센서의 숫자를 우리가 아는 단위로 바꾸는 것이 보정입니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("b-dry").addEventListener("input", function (ev) { dry = +ev.target.value; $("b-dry-val").textContent = dry; update(); });
    $("b-wet").addEventListener("input", function (ev) { wet = +ev.target.value; $("b-wet-val").textContent = wet; update(); });
    window.sthPick({
      mount: "b-cal-pick",
      q: "센서를 쓰기 전에 보정해야 하는 가장 큰 까닭은?",
      options: ["센서가 새것이라 한 번 켜 줘야 해서", "센서가 내는 숫자는 센서와 흙마다 달라, 알려진 기준(마른 흙·젖은 흙)과 맞춰야 뜻 있는 값이 되기 때문에", "보정하면 센서가 더 오래가서"],
      answer: 1,
      why: ["켜 두는 것과 보정은 다릅니다.", "같은 수분이라도 센서의 종류, 흙의 성분에 따라 숫자가 다릅니다. 기준점 두 개로 숫자와 실제 값을 이어 주는 것이 보정입니다.", "수명과는 관계가 없습니다."],
      onDone: function () { got.q = true; window.sthState("calGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 3 — 두 기준 (이력 제어) */
  (function () {
    var canvas = $("b-c-hys"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, on = 30, off = 30;
    var got = window.sthState("hysGot") || { a: false, q: false };
    function sim() {
      var M = 50, pump = false, starts = 0, mn = 100, mx = 0, ms = [], ps = [];
      for (var s = 0; s < 144; s++) {
        var hr = s / 6, r = (hr >= 6 && hr < 18) ? 0.55 : 0.2;
        M -= r; if (pump) M += 2;
        var rd = M + 2.4 * Math.sin(s * 2.1) + 1.2 * Math.sin(s * 5.3);
        if (!pump && rd < on) { pump = true; starts++; } else if (pump && rd >= off) pump = false;
        mn = Math.min(mn, M); mx = Math.max(mx, M); ms.push(M); ps.push(pump);
      }
      return { starts: starts, mn: mn, mx: mx, ms: ms, ps: ps };
    }
    var cs = 60, playing = !REDUCE;
    /* 위: 교실 창가의 자동 급수 장치를 블록으로 잘라 본 모형 · 아래: 하루 기록 */
    var TOP = 432;
    var I = K.iso({ ox: 330, oy: 95, s: 0.85, L: 520, D: 210 });
    var PX0 = 40, PX1 = 280, PY0 = 50, PY1 = 200, PZ0 = 20, PZ1 = 112, SZ = 98;   /* 화분 */
    var TX0 = 440, TX1 = 515, TY0 = 20, TY1 = 105;                               /* 물통 */
    function hx(c) { var h = Math.max(0, Math.min(255, Math.round(c))).toString(16); return h.length < 2 ? "0" + h : h; }
    function soilCol(M, f) {
      var q = Math.max(0, Math.min(1, (M - 10) / 70));
      return K.tint("#" + hx(196 - 144 * q) + hx(154 - 122 * q) + hx(94 - 76 * q), f || 1);
    }
    function quad(a, b, c, d, fill, stroke) { I.quad(ctx, a, b, c, d, fill, stroke); }
    function drawModel(r, si, M, pump, hr, day) {
      var i, P = I.P;
      K.studio(ctx, 0, 0, W, TOP - 8, { x: P(I.L / 2, I.D / 2, 0).x, y: P(I.L, I.D, 0).y - 40, rx: 360, ry: 50 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, W, TOP - 8, 14); ctx.clip();
      if (!day) { ctx.fillStyle = "rgba(16,24,64,.30)"; ctx.fillRect(0, 0, W, TOP - 8); }
      /* 책상 */
      I.box(ctx, 0, 0, 0, I.L, I.D, 20, "#d9b98a", "#b98f5d", "#9a7246");
      /* 물통(유리) — 펌프가 쓴 만큼 물이 줄어든다 */
      var used = 0, all = 0; for (i = 0; i < 144; i++) { if (r.ps[i]) { all++; if (i <= si) used++; } }
      var lvl = 20 + 100 * (0.95 - 0.55 * (all ? used / all : 0));
      I.box(ctx, TX0, TY0, 20, TX1, TY1, lvl, "rgba(120,190,245,.95)", "rgba(40,110,200,.92)", "rgba(30,85,170,.92)");
      quad(P(TX0, TY1, 20), P(TX1, TY1, 20), P(TX1, TY1, 128), P(TX0, TY1, 128), "rgba(210,232,255,.16)", "rgba(255,255,255,.75)");
      quad(P(TX1, TY0, 20), P(TX1, TY1, 20), P(TX1, TY1, 128), P(TX1, TY0, 128), "rgba(190,215,250,.14)", "rgba(255,255,255,.65)");
      quad(P(TX0, TY0, 128), P(TX1, TY0, 128), P(TX1, TY1, 128), P(TX0, TY1, 128), "rgba(230,242,255,.12)", "rgba(255,255,255,.7)");
      /* 마이크로컨트롤러 */
      I.box(ctx, 320, 30, 20, 380, 80, 25, "#1f8a5a", "#156b44", "#0f5233");
      I.box(ctx, 342, 45, 25, 362, 62, 29, "#23262e", "#16181d", "#0e0f12");
      var led = P(372, 72, 26); K.glow(ctx, led.x, led.y, 1.8, "rgba(255,90,90,.95)", 3);
      /* 펌프 */
      I.box(ctx, 400, 125, 20, 445, 172, 52, "#3a4160", "#2b3150", "#1e2338");
      var pl = P(438, 172, 44); K.glow(ctx, pl.x, pl.y, 2.6, pump ? "rgba(63,211,163,.98)" : "rgba(255,107,129,.8)", pump ? 4 : 2.5);
      /* 전선 */
      ctx.lineWidth = 1.6;
      var w1 = P(372, 80, 24), w2 = P(410, 128, 46), w3 = P(322, 60, 24), w4 = P(232, 194, 128);
      ctx.strokeStyle = "#e05a4a"; ctx.beginPath(); ctx.moveTo(w1.x, w1.y); ctx.quadraticCurveTo((w1.x + w2.x) / 2, w2.y - 30, w2.x, w2.y); ctx.stroke();
      ctx.strokeStyle = "#2f6fd0"; ctx.beginPath(); ctx.moveTo(w3.x, w3.y); ctx.bezierCurveTo(w3.x - 40, w3.y - 70, w4.x + 40, w4.y - 90, w4.x, w4.y); ctx.stroke();
      /* 화분: 오른쪽 면, 흙 윗면, 테두리, 앞면(잘라 낸 단면) */
      quad(P(PX1, PY0, PZ0), P(PX1, PY1, PZ0), P(PX1, PY1, PZ1), P(PX1, PY0, PZ1), "#9c4a24");
      quad(P(PX0 + 8, PY0 + 8, SZ), P(PX1 - 8, PY0 + 8, SZ), P(PX1 - 8, PY1 - 8, SZ), P(PX0 + 8, PY1 - 8, SZ), soilCol(M, 1.05));
      quad(P(PX0, PY0, PZ1), P(PX1, PY0, PZ1), P(PX1 - 8, PY0 + 8, PZ1), P(PX0 + 8, PY0 + 8, PZ1), "#c8693d");
      quad(P(PX0, PY0, PZ1), P(PX0 + 8, PY0 + 8, PZ1), P(PX0 + 8, PY1, PZ1), P(PX0, PY1, PZ1), "#b85f34");
      quad(P(PX1 - 8, PY0 + 8, PZ1), P(PX1, PY0, PZ1), P(PX1, PY1, PZ1), P(PX1 - 8, PY1, PZ1), "#b85f34");
      quad(P(PX0, PY1, PZ0), P(PX1, PY1, PZ0), P(PX1, PY1, PZ1), P(PX0, PY1, PZ1), "#c8693d");
      var c0 = P(PX0 + 8, PY1, PZ0 + 6), c1 = P(PX1 - 8, PY1, PZ0 + 6), c2 = P(PX1 - 8, PY1, SZ), c3 = P(PX0 + 8, PY1, SZ);
      ctx.save(); ctx.beginPath(); ctx.moveTo(c0.x, c0.y); ctx.lineTo(c1.x, c1.y); ctx.lineTo(c2.x, c2.y); ctx.lineTo(c3.x, c3.y); ctx.closePath(); ctx.clip();
      var sg = ctx.createLinearGradient(0, (c2.y + c3.y) / 2, 0, (c0.y + c1.y) / 2); sg.addColorStop(0, soilCol(M, 0.95)); sg.addColorStop(1, soilCol(Math.min(80, M + 12), 0.75));
      var yT = Math.min(c2.y, c3.y), yB = Math.max(c0.y, c1.y);
      ctx.fillStyle = sg; ctx.fillRect(c3.x - 5, yT - 5, c1.x - c3.x + 10, yB - yT + 10);
      var Rg = K.rng(11);
      for (i = 0; i < 140; i++) { var gp = P(PX0 + 10 + Rg() * (PX1 - PX0 - 20), PY1, PZ0 + 8 + Rg() * (SZ - PZ0 - 10)); ctx.fillStyle = Rg() > .5 ? "rgba(255,240,210,.22)" : "rgba(30,18,8,.35)"; ctx.fillRect(gp.x, gp.y, 1.8, 1.8); }
      /* 뿌리 */
      ctx.strokeStyle = "rgba(240,225,190,.75)"; ctx.lineWidth = 1.3;
      var rt = P(150, PY1, SZ);
      [[-40, 50], [-15, 62], [10, 66], [35, 52], [55, 38]].forEach(function (q) { var e = P(150 + q[0], PY1, SZ - q[1]); ctx.beginPath(); ctx.moveTo(rt.x, rt.y); ctx.quadraticCurveTo(rt.x + q[0] * 0.2, (rt.y + e.y) / 2, e.x, e.y); ctx.stroke(); });
      /* 흙 속 물기(수분이 많을수록 많이) */
      var nd = Math.round(Math.max(0, M - 15) / 4);
      for (i = 0; i < nd; i++) { var dp = P(PX0 + 14 + Rg() * (PX1 - PX0 - 28), PY1, PZ0 + 10 + Rg() * (SZ - PZ0 - 16)); K.glow(ctx, dp.x, dp.y, 1.3, "rgba(127,211,255,.85)", 2.2); }
      ctx.restore();
      ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(c3.x, c3.y); ctx.lineTo(c2.x, c2.y); ctx.stroke();
      /* 센서 — 갈래가 단면 안 흙에 꽂혀 있다 */
      var s1 = P(224, PY1, SZ + 2), s2 = P(224, PY1, 52), s3 = P(240, PY1, SZ + 2), s4 = P(240, PY1, 52);
      ctx.strokeStyle = "#e3c25a"; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(s1.x, s1.y); ctx.lineTo(s2.x, s2.y); ctx.moveTo(s3.x, s3.y); ctx.lineTo(s4.x, s4.y); ctx.stroke();
      I.box(ctx, 218, 192, SZ, 246, 200, 128, "#2a5fb8", "#1f4a92", "#173a74");
      /* 식물 */
      var B = P(150, 125, SZ), droop = M < 25 ? 0.5 : 0, sc = 1.1;
      ctx.strokeStyle = "#3c8a3a"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(B.x, B.y); ctx.quadraticCurveTo(B.x - 4, B.y - 44 * sc, B.x + 2, B.y - (84 - droop * 30) * sc); ctx.stroke();
      [[-1, 36], [1, 54], [-1, 72], [1, 84]].forEach(function (lf) {
        var lx = B.x + (lf[1] > 64 ? 2 : -2), ly = B.y - (lf[1] - droop * 24) * sc, ang = lf[0] > 0 ? (-0.5 + droop * 1.4) : (Math.PI + 0.5 - droop * 1.4);
        ctx.save(); ctx.translate(lx, ly); ctx.rotate(ang);
        var lgd = ctx.createLinearGradient(0, -8, 30, 8); lgd.addColorStop(0, droop ? "#b8c870" : "#7be07a"); lgd.addColorStop(1, droop ? "#7a7a32" : "#2b7a32");
        ctx.fillStyle = lgd; ctx.beginPath(); ctx.ellipse(20, 0, 22, 8, 0, 0, 6.2832); ctx.fill(); ctx.restore();
      });
      /* 호스와 물 */
      var h0 = P(420, 140, 52), h1 = P(215, 95, 128), hc = P(330, 90, 200);
      ctx.strokeStyle = "rgba(170,195,230,.95)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(h0.x, h0.y); ctx.quadraticCurveTo(hc.x, hc.y, h1.x, h1.y); ctx.stroke();
      if (pump) {
        for (i = 0; i < 6; i++) { var u = ((cs * 0.5 + i / 6) % 1), bx = (1 - u) * (1 - u) * h0.x + 2 * (1 - u) * u * hc.x + u * u * h1.x, byy = (1 - u) * (1 - u) * h0.y + 2 * (1 - u) * u * hc.y + u * u * h1.y; K.glow(ctx, bx, byy, 2, "rgba(127,211,255,.95)", 2.6); }
        var tp = P(215, 95, SZ); for (i = 0; i < 3; i++) { var fy = h1.y + ((cs * 0.9 + i / 3) % 1) * (tp.y - h1.y); K.glow(ctx, h1.x, fy, 1.8, "rgba(127,211,255,.95)", 2.4); }
      }
      I.edges(ctx, 20, 20);
      ctx.restore();
      /* 이름표 */
      var box = [0, W];
      I.label(ctx, TX1, (TY0 + TY1) / 2, lvl - 10, "물통", 46, -24, "#bfe6ff", box);
      I.label(ctx, 445, 150, 40, pump ? "펌프 켜짐" : "펌프 꺼짐", 60, 30, pump ? "#3fd3a3" : "#ffb3c0", box);
      I.label(ctx, 350, 30, 27, "마이크로컨트롤러", 60, -46, "#e8ecff", box);
      I.label(ctx, 232, 196, 128, "토양 수분 센서 " + M.toFixed(0) + "%", 70, 40, M >= 25 && M <= 70 ? "#3fd3a3" : "#ff9aac", box);
      I.label(ctx, 80, PY1, 55, "흙 단면", -50, 40, "#f4e2c4", box);
      /* 큰 글자 */
      var h1t, h2t, hc2 = "#ffd35a";
      if (off <= on) { h1t = "펌프가 딸깍딸깍 떤다"; h2t = "켜고 끄는 기준이 같거나 거꾸로 · 켜짐 " + r.starts + "번"; hc2 = "#ff9aac"; }
      else if (r.starts <= 4 && r.mn >= 25 && r.mx <= 70) { h1t = "떨지 않는 자동 급수"; h2t = "하루 켜짐 " + r.starts + "번 · 수분 " + r.mn.toFixed(0) + "~" + r.mx.toFixed(0) + "%"; hc2 = "#3fd3a3"; }
      else if (r.starts > 4) { h1t = "아직 펌프가 자주 켜진다"; h2t = "하루 켜짐 " + r.starts + "번"; }
      else if (r.mn < 25) { h1t = "흙이 너무 마른다"; h2t = "가장 마를 때 수분 " + r.mn.toFixed(0) + "%"; }
      else { h1t = "흙이 너무 축축하다"; h2t = "가장 젖을 때 수분 " + r.mx.toFixed(0) + "%"; }
      K.bigText(ctx, h1t, 22, 46, 26, "#ffffff");
      K.bigText(ctx, h2t, 22, 76, 15, hc2);
      K.warn(ctx, W - 14, 26, "⚠ 크기는 보기 쉽게 바꿈 · 흙 색은 수분을 과장", "right");
      K.pill(ctx, (day ? "☀ 낮 " : "☾ 밤 ") + (hr < 10 ? "0" : "") + Math.floor(hr) + ":" + (si % 6) + "0", W - 14, 56, { a: "right", s: 12, c: day ? KC.yellow : KC.blue });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var r = sim(), ok = r.starts <= 4 && r.mn >= 25 && r.mx <= 70 && off > on, i;
      var si = Math.min(143, Math.floor(cs)), M = r.ms[si], pump = r.ps[si], hr = si / 6, day = hr >= 6 && hr < 18;
      drawModel(r, si, M, pump, hr, day);
      /* ── 아래: 하루 기록 ── */
      K.card(ctx, 0, TOP, W, H - TOP, "하루 동안의 흙 수분과 펌프");
      var g = K.chart(ctx, { x: 6, y: TOP + 36, w: W - 14, h: H - TOP - 42, light: true, x0: 0, x1: 24, y0: 10, y1: 80, xt: 4, yt: 7, xl: "시각 (시)", yf: function (m) { return Math.round(m) + "%"; } });
      ctx.fillStyle = "rgba(15,159,118,.10)"; ctx.fillRect(g.L, g.Y(70), g.R - g.L, g.Y(25) - g.Y(70));
      var cw = (g.R - g.L) / 144;
      for (i = 0; i < 144; i++) if (r.ps[i]) { ctx.fillStyle = "rgba(28,126,214,.16)"; ctx.fillRect(g.X(i / 6), g.T, cw + 0.5, g.B - g.T); }
      hline(ctx, g.L, g.R, g.Y(on), LT.orange); hline(ctx, g.L, g.R, g.Y(off), LT.blue);
      var pts = r.ms.map(function (m, i2) { return [i2 / 6, m]; });
      K.plot(ctx, g, pts, LT.ink, { w: 2.4, light: true });
      K.pill(ctx, "켜기 " + on + "%", g.L + 8, g.Y(on) + 18, { s: 10.5, c: LT.orange, bg: "rgba(255,255,255,.92)", line: "rgba(20,40,90,.18)" });
      K.pill(ctx, "끄기 " + off + "%", g.R - 8, g.Y(off) - 6, { a: "right", s: 10.5, c: LT.blue, bg: "rgba(255,255,255,.92)", line: "rgba(20,40,90,.18)" });
      K.pill(ctx, "알맞음 25~70%", g.X(12), g.Y(70) - 6, { a: "center", s: 10.5, c: LT.green, bg: "rgba(255,255,255,.92)", line: "rgba(20,40,90,.18)" });
      var cx = g.X(hr);
      vline(ctx, cx, g.T, g.B, "rgba(245,159,0,.8)");
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx, g.Y(M), 6.5, 0, 6.2832); ctx.fill();
      ctx.fillStyle = LT.yellow; ctx.beginPath(); ctx.arc(cx, g.Y(M), 4.6, 0, 6.2832); ctx.fill();
      K.t(ctx, "파란 띠 = 펌프가 켜진 때", W - 18, TOP + 28, { s: 11, a: "right", w: "800", c: LT.blue });
      return ok;
    }
    function update() {
      var ok = draw(), r = sim();
      readout("b-hys-read", [
        ["펌프 켜짐", r.starts + "번", r.starts <= 4 ? "g" : "r", "하루 동안 (4번 이하가 좋음)"],
        ["흙 수분", r.mn.toFixed(0) + " ~ " + r.mx.toFixed(0) + "%", r.mn >= 25 && r.mx <= 70 ? "g" : "r", "알맞은 범위 25~70%"],
        ["기준", "켜기 " + on + "% · 끄기 " + off + "%", "b"]
      ], ok ? ["g", "펌프가 떨지 않고 흙도 알맞음"] : ["r", off <= on ? "두 기준이 같거나 거꾸로입니다" : "아직 조건을 못 맞추었습니다"]);
      put("b-hys-info", "켜기 " + on + "%, 끄기 " + off + "%: 하루 동안 펌프가 " + r.starts + "번 켜지고, 흙 수분은 " + r.mn.toFixed(0) + " ~ " + r.mx.toFixed(0) + "% 였습니다. "
        + (ok ? "✅ 펌프가 떨지 않고, 흙도 알맞게 유지됩니다." : (off <= on ? "두 기준이 같거나 거꾸로면 센서 값의 작은 떨림에도 펌프가 계속 켜졌다 꺼집니다." : (r.starts > 4 ? "두 기준 사이가 좁아 아직 자주 켜집니다." : (r.mn < 25 ? "켜는 기준이 너무 낮아 흙이 너무 마릅니다." : "끄는 기준이 너무 높아 흙이 너무 축축해집니다(뿌리가 썩을 위험).")))));
      if (ok && !got.a) { got.a = true; got.on = on; got.off = off; window.sthState("hysGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m2-3a"); if (got.q) done("m2-3b");
      if (got.a && got.q) {
        window.sthState("hysBest", "켜기 " + (got.on || on) + "% · 끄기 " + (got.off || off) + "%처럼 기준 사이를 벌림");
        window.sthMission("m2-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("hysBest") + ". 기준 사이의 간격이 센서 값의 떨림을 흡수합니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    playBtn("b-hys-play", function () { return playing; }, function (q) { playing = q; }, "⏸ 하루 멈추기", "▶ 하루 돌려 보기");
    K.animate(canvas, function (dt) { if (playing) { cs = (cs + dt / 1000 * 8) % 144; draw(); } });
    $("b-on").addEventListener("input", function (ev) { on = +ev.target.value; $("b-on-val").textContent = on + "%"; update(); });
    $("b-off").addEventListener("input", function (ev) { off = +ev.target.value; $("b-off-val").textContent = off + "%"; update(); });
    window.sthPick({
      mount: "b-hys-pick",
      q: "켜는 기준과 끄는 기준을 따로 두면 펌프가 떨지 않는 까닭은?",
      options: ["펌프가 더 강해지기 때문에", "센서 값이 기준 근처에서 조금 오르내려도, 두 기준 사이에서는 펌프 상태가 바뀌지 않기 때문에", "센서의 떨림이 완전히 사라지기 때문에"],
      answer: 1,
      why: ["펌프의 힘은 그대로입니다.", "한 번 켜지면 끄는 기준까지 올라갈 때까지, 한 번 꺼지면 켜는 기준까지 내려갈 때까지 기다립니다. 보일러 온도 조절기도 같은 방법을 씁니다.", "센서 값은 여전히 떨립니다. 다만 그 떨림에 반응하지 않을 뿐입니다."],
      onDone: function () { got.q = true; window.sthState("hysGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 4 — 산출물 공유 */
  (function () {
    var STEPS = [
      "산출물 정리하기 — 회로도, 코드, 부품 목록, 실험 기록을 모은다",
      "발표 자료 만들기 — 작동 영상과 그래프로 원리와 결과를 보여 준다",
      "학교 과학 축제에서 발표하기",
      "질문과 피드백 받기 — ‘비가 오면?’, ‘물통이 비면?’ 같은 질문을 기록한다",
      "피드백으로 장치 고치기 — 물통 수위 센서와 경고등을 더한다",
      "누리집에 설계도와 코드를 공개해 다른 학교도 만들 수 있게 한다"
    ];
    function ok() { window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>발표 → 피드백 → 개선 → 공개. 나눌수록 산출물이 나아지고, 더 많은 곳으로 퍼집니다."); ep.clear(3); ep.clear(4); }
    if (ep.cleared(3)) { orderDone("b-order", STEPS); window.sthMission("m2-4", true); }
    else window.sthOrder({ mount: "b-order", steps: STEPS, onDone: ok });
  })();

  function finish() { window.sthState("r2", "완성 · " + (window.sthState("calBest") || "") + " / " + (window.sthState("hysBest") || "")); }
  function vs() {
    $("e2-vs").innerHTML = "<b>나의 첫 설계</b> " + (window.sthState("sens1") || "기록 없음") + "<br><b>센서 보정</b> " + (window.sthState("calBest") || "-") + "<br><b>두 기준</b> " + (window.sthState("hysBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk2", unitLabel: "[과학탐구실험2 Ⅱ-1] 이야기 ② 방학 동안의 화분",
    items: [
      { id: "w1", label: "센서가 재는 것", hint: "고른 센서 하나가 무엇을 어떤 물리량으로 바꾸는지 쓰세요.", ph: "센서: … / 재는 것: … / 바꾸는 신호: …" },
      { id: "w2", label: "내가 만들고 싶은 것", hint: "해결하고 싶은 문제 하나와, 거기에 필요한 센서·동작을 적어 보세요.", ph: "문제: … / 센서: … / 판단 기준: … / 동작: …" }
    ]
  });
})();

/* ========================================================================= 05 정리하기 */
window.sthWork({
  mount: "wk", unitLabel: "[과학탐구실험2 Ⅱ-1] 미래 사회와 첨단 과학 탐구 — 정리",
  recap: [
    { key: "r1", label: "① 고양이를 못 알아보는 인공지능" },
    { key: "r2", label: "② 방학 동안의 화분" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  items: [
    { id: "all", label: "두 탐구를 꿰는 한 문장", hint: "인공지능과 자동 급수 장치, 두 이야기를 ‘데이터’와 ‘과학 원리’라는 말을 넣어 한 문장으로 이어 보세요." },
    { id: "w3", label: "아직 헷갈리는 것", hint: "다음 시간에 여기서부터 시작합니다." }
  ]
});

/* ========================================================================= 06 우리 반 */
window.sthShare({
  mount: "share", unit: "gt2-2-2", unitLabel: "[과학탐구실험2 Ⅱ-1] 미래 사회와 첨단 과학 탐구",
  rows: [
    { key: "r1", label: "① 고양이를 못 알아보는 인공지능" },
    { key: "r2", label: "② 방학 동안의 화분" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "두 탐구를 꿰는 한 문장" }
});

})();
