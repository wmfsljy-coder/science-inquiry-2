/* 과학탐구실험2 Ⅱ-2 미래 사회와 첨단 과학 탐구 — 이야기 세 편
   01 겨울 딸기 온실 / 02 숨 막히는 5교시 / 03 우주 개발 토론회
   공용 부품: ../assets/theme.js (sthUnit·sthGate·sthWork), ../assets/story.js (sthStory·sthSort·sthOrder·sthPick) */
(function () {
"use strict";

window.sthUnit("gt2-2-4");

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
function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

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
/* 온실 단면: 유리 지붕·딸기 두둑. o.open 창 열림, o.led LED 켜짐 */
function greenhouse(ctx, x, y, w, h, o) {
  o = o || {};
  var roofH = h * 0.32, i;
  var gl = ctx.createLinearGradient(x, y, x + w, y + h); gl.addColorStop(0, "rgba(170,220,255,.22)"); gl.addColorStop(1, "rgba(120,170,230,.10)");
  ctx.fillStyle = gl; ctx.beginPath(); ctx.moveTo(x, y + roofH); ctx.lineTo(x + w / 2, y); ctx.lineTo(x + w, y + roofH); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "rgba(220,235,255,.65)"; ctx.lineWidth = 2; ctx.stroke();
  ctx.strokeStyle = "rgba(220,235,255,.25)"; ctx.lineWidth = 1;
  for (i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x + w * i / 4, y + (i === 2 ? 0 : roofH * (i === 1 ? 0.5 : 0.5))); ctx.lineTo(x + w * i / 4, y + h); ctx.stroke(); }
  /* 지붕 창 */
  ctx.save(); ctx.translate(x + w * 0.75, y + roofH * 0.5); ctx.rotate(Math.atan2(roofH, w / 2) - (o.open ? 0.5 : 0));
  ctx.fillStyle = o.open ? "rgba(127,211,255,.55)" : "rgba(170,220,255,.3)"; ctx.fillRect(-26, -4, 52, 6); ctx.restore();
  /* 두둑과 딸기 */
  var bed = ctx.createLinearGradient(0, y + h - 30, 0, y + h); bed.addColorStop(0, "#5a3a22"); bed.addColorStop(1, "#2e1d10");
  ctx.fillStyle = bed; ctx.fillRect(x + 10, y + h - 30, w - 20, 30);
  for (i = 0; i < 5; i++) {
    var px = x + 26 + i * (w - 52) / 4, py = y + h - 30;
    ctx.fillStyle = "#3fae4a"; [-1, 0, 1].forEach(function (k) { ctx.beginPath(); ctx.ellipse(px + k * 9, py - 10 - (k === 0 ? 6 : 0), 8, 5, k * 0.6, 0, 6.2832); ctx.fill(); });
    var bg = ctx.createRadialGradient(px + 4, py - 2, 1, px + 5, py, 6); bg.addColorStop(0, "#ff8a8a"); bg.addColorStop(1, "#b5102a");
    ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(px + 5, py - 1, 4.5, 0, 6.2832); ctx.fill();
  }
  /* LED 막대 */
  ctx.fillStyle = "#2b3150"; ctx.fillRect(x + 20, y + roofH + 10, w - 40, 6);
  if (o.led) for (i = 0; i < 6; i++) K.glow(ctx, x + 30 + i * (w - 60) / 5, y + roofH + 13, 2.4, "rgba(255,140,220,.95)", 3.4);
}

/* ---- 스튜디오 블록 모형 도구 ---- */
var LT = K.LT;
function tri(ctx, a, b, c, fill, stroke) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); } }
function ell(ctx, x, y, rx, ry) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 6.2832); }
/* 땅 블록(옆면 = 흙 단면) */
function soilBlock(ctx, I, zg, topFill, seed) {
  var bands = [[0, zg * .3, "#7c818a", "#6c7079"], [zg * .3, zg * .66, "#9a7650", "#876744"], [zg * .66, zg, "#5a3d26", "#4c3320"]];
  ["front", "right"].forEach(function (sd, k) {
    I.face(ctx, sd, function (Lw) {
      bands.forEach(function (b) { ctx.fillStyle = b[2 + k]; ctx.fillRect(0, b[0], Lw, b[1] - b[0]); });
      var R = K.rng((seed || 3) + k); ctx.fillStyle = "rgba(255,255,255,.28)";
      for (var q = 0; q < Lw / 3; q++) { ctx.beginPath(); ctx.arc(R() * Lw, R() * zg * .3, .8 + R() * 1.3, 0, 6.2832); ctx.fill(); }
    });
  });
  I.shade(ctx, "right", function () { return zg; });
  I.top(ctx, function () { return zg; }, topFill, 20);
  I.edges(ctx, zg, zg);
}
/* 딸기 포기 하나 */
function berry(ctx, p, sc) {
  sc = sc || 1;
  ctx.fillStyle = "rgba(0,0,0,.18)"; ell(ctx, p.x + 2, p.y + 1, 7 * sc, 2.4 * sc); ctx.fill();
  [[-5, -4, "#3f9a3f"], [5, -4, "#2f7f34"], [0, -8, "#4fb34a"]].forEach(function (q) { ctx.fillStyle = q[2]; ell(ctx, p.x + q[0] * sc, p.y + q[1] * sc, 5 * sc, 3.2 * sc); ctx.fill(); });
  K.planet(ctx, p.x + 3 * sc, p.y - 1 * sc, 2.6 * sc, "#ff5a6e", "#a3102a");
}
/* 아이소메트릭 유리 온실: o.open 0~1 지붕 창, o.led, o.pump, o.heat 0~1(안이 뜨거움), o.inside(ctx, I, ZG) 센서 등, o.ph 물방울 위상 */
function ghIso(ctx, I, o) {
  o = o || {};
  var ZG = 24, X0 = 30, X1 = 270, Y0 = 25, Y1 = 145, ZW = 92, ZR = 126, YR = 85, b, x;
  var glass = "rgba(190,225,255,.20)", frame = "rgba(110,130,155,.95)";
  function zr(y) { return ZR - (y - YR) / (Y1 - YR) * (ZR - ZW); }
  soilBlock(ctx, I, ZG, function (j) { return j % 2 ? "#eef3f8" : "#e4ebf3"; }, 5);
  [[8, 12], [290, 18], [292, 150], [6, 160]].forEach(function (t) { I.tree(ctx, t[0], t[1], ZG, .9); });
  I.plane(ctx, ZG + .3, "#7a5a3c", null, X0, X1, Y0, Y1);
  /* 뒤쪽 유리벽·박공·지붕 */
  I.quad(ctx, I.P(X0, Y0, ZG), I.P(X1, Y0, ZG), I.P(X1, Y0, ZW), I.P(X0, Y0, ZW), glass, frame);
  I.quad(ctx, I.P(X0, Y0, ZG), I.P(X0, Y1, ZG), I.P(X0, Y1, ZW), I.P(X0, Y0, ZW), glass, frame);
  tri(ctx, I.P(X0, Y0, ZW), I.P(X0, Y1, ZW), I.P(X0, YR, ZR), "rgba(190,225,255,.16)", frame);
  I.quad(ctx, I.P(X0, Y0, ZW), I.P(X1, Y0, ZW), I.P(X1, YR, ZR), I.P(X0, YR, ZR), "rgba(190,225,255,.14)", frame);
  /* 두둑·딸기·점적 관 */
  for (b = 0; b < 3; b++) {
    var y0 = 38 + b * 36, y1 = y0 + 20;
    I.box(ctx, 44, y0, ZG, 256, y1, ZG + 10, "#6a4428", "#8a5a36", "#5a3920");
    K.line(ctx, I.P(44, y1 - 3, ZG + 10.5), I.P(256, y1 - 3, ZG + 10.5), o.pump ? "#1c7ed6" : "#3d4b5c", 1.6);
    for (x = 54; x <= 246; x += 24) berry(ctx, I.P(x, (y0 + y1) / 2, ZG + 10), .95);
    if (o.pump) for (x = 58; x <= 246; x += 24) { var dp = I.P(x, y1 - 3, ZG + 10.5 - ((o.ph || 0) * 6 + x) % 6); K.planet(ctx, dp.x, dp.y + 2, 1.8, "#8fd0ff", "#1864ab"); }
  }
  /* LED 막대 */
  for (b = 0; b < 3; b++) {
    var yc = 46 + b * 36;
    if (o.led) {
      var a1 = I.P(50, yc, 84), a2 = I.P(250, yc, 84), a3 = I.P(250, yc + 14, ZG + 10), a4 = I.P(50, yc + 14, ZG + 10);
      var lg = ctx.createLinearGradient(0, a1.y, 0, a3.y); lg.addColorStop(0, "rgba(255,120,220,.30)"); lg.addColorStop(1, "rgba(255,120,220,.03)");
      I.quad(ctx, a1, a2, a3, a4, lg);
    }
    I.box(ctx, 50, yc - 2, 84, 250, yc + 2, 87, o.led ? "#ffd6f3" : "#5a6075", o.led ? "#ff8ad8" : "#3a3f55", o.led ? "#d25bb0" : "#2b3044");
    if (o.led) for (x = 62; x <= 240; x += 30) { var lp = I.P(x, yc + 2, 84); K.glow(ctx, lp.x, lp.y, 1.8, "rgba(255,140,220,.95)", 3); }
  }
  /* 펌프와 물통 */
  I.box(ctx, 252, 150, ZG, 268, 164, ZG + 14, "#7fa6d6", "#4f78a8", "#3a5f8a");
  if (o.inside) o.inside(ctx, I, ZG);
  /* 안이 뜨거우면 붉은 기운 */
  var hf = o.heat ? "rgba(255,90,50," + (o.heat * .26).toFixed(3) + ")" : null;
  /* 앞쪽 유리벽(창살) */
  I.quad(ctx, I.P(X0, Y1, ZG), I.P(X1, Y1, ZG), I.P(X1, Y1, ZW), I.P(X0, Y1, ZW), hf || glass, frame);
  I.quad(ctx, I.P(X1, Y0, ZG), I.P(X1, Y1, ZG), I.P(X1, Y1, ZW), I.P(X1, Y0, ZW), hf || "rgba(170,210,245,.24)", frame);
  tri(ctx, I.P(X1, Y0, ZW), I.P(X1, Y1, ZW), I.P(X1, YR, ZR), hf || "rgba(170,210,245,.26)", frame);
  for (x = X0 + 48; x < X1; x += 48) K.line(ctx, I.P(x, Y1, ZG), I.P(x, Y1, ZW), frame, 1.2);
  [55, 85, 115].forEach(function (y) { K.line(ctx, I.P(X1, y, ZG), I.P(X1, y, y === 85 ? ZR : ZW), frame, 1.2); });
  /* 앞 지붕(창 자리 비움) + 지붕 창 */
  var WX0 = 170, WX1 = 236, ya = YR + 5, yb = YR + 36, za = zr(ya), zb = zr(yb);
  ctx.save(); ctx.beginPath();
  [I.P(X0, Y1, ZW), I.P(X1, Y1, ZW), I.P(X1, YR, ZR), I.P(X0, YR, ZR)].forEach(function (p, i) { if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.closePath();
  [I.P(WX0, ya, za), I.P(WX0, yb, zb), I.P(WX1, yb, zb), I.P(WX1, ya, za)].forEach(function (p, i) { if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.closePath();
  ctx.fillStyle = "rgba(200,232,255,.30)"; ctx.fill("evenodd"); ctx.strokeStyle = frame; ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore();
  var op = Math.max(0, Math.min(1, o.open || 0)), ang = Math.atan2(zb - za, yb - ya) + op * 0.75, len = Math.sqrt((yb - ya) * (yb - ya) + (zb - za) * (zb - za));
  var ye = ya + Math.cos(ang) * len, ze = za + Math.sin(ang) * len;
  I.quad(ctx, I.P(WX0, ya, za), I.P(WX1, ya, za), I.P(WX1, ye, ze), I.P(WX0, ye, ze), op > .05 ? "rgba(160,215,255,.62)" : "rgba(200,232,255,.42)", "#5b6d85");
  if (op > .05) { K.line(ctx, I.P((WX0 + WX1) / 2, yb, zb), I.P((WX0 + WX1) / 2, ye, ze), "#5b6d85", 1.6); K.arrow(ctx, I.P(WX0 + 30, ya + 18, za + 4), I.P(WX0 + 6, ya + 6, za + 46), "#e8590c", 2.2, 8); }
  return { X0: X0, X1: X1, Y0: Y0, Y1: Y1, ZG: ZG, ZW: ZW, ZR: ZR, YR: YR, win: I.P(WX1, ye, ze) };
}
/* 센서 기둥(흰 상자) */
function sensorPost(ctx, I, x, y, z, hgt, col) {
  K.line(ctx, I.P(x, y, z), I.P(x, y, z + hgt), "#6b7280", 2);
  I.box(ctx, x - 5, y - 5, z + hgt, x + 5, y + 5, z + hgt + 10, "#ffffff", col || "#e9edf3", "#c3cad6");
}

/* =========================================================================
   이야기 ① 겨울 딸기 온실
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep1", key: "ep1", name: "첨단 탐구 ①", onDone: finish });

  window.sthGate({
    gate: "g1", key: "gh1", title: "나의 첫 설계",
    question: "할머니 대신 온실이 스스로 돌보게 하려면 어떻게 해야 할까요?",
    options: ["㉠ 할머니가 계속 직접 하신다", "㉡ 센서로 온도·빛·흙 수분을 재고, 마이크로컨트롤러가 기준과 비교해 창문·조명·펌프를 움직이게 한다", "㉢ 창문을 늘 열어 둔다", "㉣ 타이머로 정해진 시각마다 모든 장치를 켠다"],
    onPick: function (i) { window.sthState("gh1OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 규칙 설계 */
  (function () {
    var canvas = $("a-c-rule"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, T = 32, L = 1000, S = 15;
    var got = window.sthState("ruleGot") || false;
    var CASES = [
      { d: "맑은 한낮, 온도 29 °C", dev: "창문", want: true, act: function () { return 29 > T; } },
      { d: "선선한 아침, 온도 24 °C", dev: "창문", want: false, act: function () { return 24 > T; } },
      { d: "흐린 낮, 밝기 3,000 lux", dev: "LED", want: true, act: function () { return 3000 < L; } },
      { d: "맑은 낮, 밝기 15,000 lux", dev: "LED", want: false, act: function () { return 15000 < L; } },
      { d: "흙 수분 25%", dev: "펌프", want: true, act: function () { return 25 < S; } },
      { d: "흙 수분 45%", dev: "펌프", want: false, act: function () { return 45 < S; } }
    ];
    function nOk() { return CASES.filter(function (c) { return c.act() === c.want; }).length; }
    function icon(kind, x, y) {
      if (kind === "창문") { K.sun(ctx, x, y, 6); }
      else if (kind === "LED") { K.glow(ctx, x, y, 4, "rgba(255,140,220,.95)", 3); }
      else { ctx.fillStyle = "#5fb6f0"; ctx.beginPath(); ctx.moveTo(x, y - 9); ctx.quadraticCurveTo(x + 8, y + 2, x, y + 7); ctx.quadraticCurveTo(x - 8, y + 2, x, y - 9); ctx.fill(); }
    }
    /* 장치별 눈금(기준값 슬라이더 범위)과 두 시험 값 */
    var DEV = [
      { n: "🌡 창문", rule: function () { return "온도 > " + T + " °C → 열기"; }, lo: 20, hi: 36, v: function () { return T; }, cs: [1, 0], f: function (x) { return x + "°"; } },
      { n: "💡 LED", rule: function () { return "밝기 < " + fmt(L) + " lux → 켜기"; }, lo: 1000, hi: 20000, v: function () { return L; }, cs: [2, 3], f: function (x) { return Math.round(x / 1000) + "천"; } },
      { n: "💧 펌프", rule: function () { return "흙 수분 < " + S + "% → 켜기"; }, lo: 10, hi: 60, v: function () { return S; }, cs: [4, 5], f: function (x) { return x + "%"; } }
    ];
    var TESTV = [29, 24, 3000, 15000, 25, 45];
    var IG = K.iso({ ox: 236, oy: 126, s: 0.86, L: 300, D: 170 });
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var LW = 560, n = nOk();
      var res = CASES.map(function (c) { return { a: c.act(), ok: c.act() === c.want }; });
      /* ── 왼쪽: 겨울 온실 블록 모형 (기준대로라면 ‘필요한 상황’에서 장치가 켜지는지) ── */
      var fc = IG.P(150, 85, 0);
      K.studio(ctx, 0, 0, LW, H, { x: fc.x + 14, y: fc.y + 30, rx: 250, ry: 46 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      var g = ghIso(ctx, IG, { open: res[0].a ? 1 : 0, led: res[2].a, pump: res[4].a, ph: 0, inside: function (c2, I2, zg) {
        sensorPost(c2, I2, 36, 150, zg, 46);
        sensorPost(c2, I2, 150, 20, zg, 70, "#fff3bf");
        var pr = I2.P(120, 128, zg + 10); K.line(c2, pr, { x: pr.x, y: pr.y + 9 }, "#9aa3b0", 2); K.line(c2, { x: pr.x + 4, y: pr.y - 2 }, { x: pr.x + 4, y: pr.y + 7 }, "#9aa3b0", 2);
        I2.box(c2, 272, 60, 52, 276, 76, 66, "#2f9e44", "#2b8a3e", "#1e6b30");
      } });
      ctx.restore();
      var BX = [0, LW];
      IG.label(ctx, 203, 92, g.ZR - 2, "지붕 창 " + (res[0].a ? "열림" : "닫힘") + " (29 °C일 때)", 70, -40, res[0].ok ? "#c3f5dc" : "#ffd0c0", BX);
      IG.label(ctx, 50, 118, 86, "LED " + (res[2].a ? "켜짐" : "꺼짐") + " (3,000 lux일 때)", -56, 40, res[2].ok ? "#c3f5dc" : "#ffd0c0", BX);
      IG.label(ctx, 260, 157, g.ZG + 14, "펌프 " + (res[4].a ? "켜짐" : "꺼짐") + " (흙 수분 25%일 때)", 40, 34, res[4].ok ? "#c3f5dc" : "#ffd0c0", BX);
      IG.label(ctx, 36, 150, g.ZG + 56, "온도 센서", -30, 92, "#e8ecff", BX);
      IG.label(ctx, 274, 68, 66, "마이크로컨트롤러", 34, -18, "#e8ecff", BX);
      K.bigText(ctx, "옳게 움직인 상황 " + n + " / 6", 18, 40, 24, n === 6 ? "#7ee0a0" : "#ffffff");
      K.bigText(ctx, n === 6 ? "딸기가 편안한 온실" : "기준값을 고쳐 보세요", 18, 66, 15, "#ffd35a");
      K.warn(ctx, LW - 12, H - 12, "⚠ 장치 크기는 보기 쉽게 과장", "right");
      /* ── 오른쪽: 흰 판정 카드 — 장치마다 눈금 위 기준값과 두 시험 상황 ── */
      var RX = LW + 12, x0 = RX + 18, x1 = W - 18;
      K.card(ctx, RX, 0, W - RX, H, "여섯 상황으로 시험하기");
      DEV.forEach(function (d, k) {
        var y = 58 + k * 94, val = d.v(), okD = res[d.cs[0]].ok && res[d.cs[1]].ok;
        K.t(ctx, d.n, x0, y, { s: 12.5, w: "900", c: LT.ink });
        K.t(ctx, d.rule(), x1, y, { s: 11.5, w: "800", a: "right", c: okD ? LT.green : LT.orange });
        var gy = y + 12, gw = x1 - x0;
        function GX(q) { return x0 + (q - d.lo) / (d.hi - d.lo) * gw; }
        ctx.fillStyle = "#e3e9f1"; ctx.beginPath(); ctx.roundRect(x0, gy, gw, 8, 4); ctx.fill();
        d.cs.forEach(function (ci) { var tv = TESTV[ci], px = GX(tv); K.planet(ctx, px, gy + 4, 5, CASES[ci].want ? "#ff922b" : "#74c0fc", CASES[ci].want ? "#a33f00" : "#1864ab"); K.t(ctx, d.f(tv), px, gy + 24, { s: 10, w: "800", a: "center", c: LT.mute }); });
        var tx = GX(val); ctx.fillStyle = okD ? LT.green : LT.red; ctx.beginPath(); ctx.moveTo(tx, gy + 9); ctx.lineTo(tx - 6, gy - 3); ctx.lineTo(tx + 6, gy - 3); ctx.closePath(); ctx.fill();
        ctx.fillRect(tx - 1, gy - 3, 2, 14);
        d.cs.forEach(function (ci, j) {
          var r = res[ci];
          K.t(ctx, CASES[ci].d.replace(/, /, " · "), x0, gy + 44 + j * 18, { s: 11, w: "700", c: LT.mute });
          K.t(ctx, (r.a ? "켜짐" : "꺼짐") + (r.ok ? " ✔" : " ✘"), x1, gy + 44 + j * 18, { s: 11.5, w: "900", a: "right", c: r.ok ? LT.green : LT.red });
        });
      });
      K.t(ctx, "●", x0, H - 12, { s: 11, w: "900", c: "#e8590c" }); K.t(ctx, "켜야 할 상황", x0 + 13, H - 12, { s: 10.5, w: "700", c: LT.mute });
      K.t(ctx, "●", x0 + 104, H - 12, { s: 11, w: "900", c: "#1c7ed6" }); K.t(ctx, "꺼야 할 상황", x0 + 117, H - 12, { s: 10.5, w: "700", c: LT.mute });
      K.t(ctx, "▼ 기준값", x1, H - 12, { s: 10.5, w: "800", a: "right", c: LT.red });
      return n === 6;
    }
    function update() {
      var ok = draw();
      put("a-rule-info", "창문 " + T + " °C 초과, LED " + fmt(L) + " lux 미만, 펌프 " + S + "% 미만일 때 켜집니다. " + (ok ? "✅ 여섯 상황 모두 옳게 움직입니다. 딸기가 좋아하는 조건(과학 지식)이 기준값이 되었습니다." : "빨간 줄의 상황을 보고 기준값을 고쳐 보세요."));
      if (ok && !got) { got = true; window.sthState("ruleGot", true); mission(); }
    }
    function mission() {
      if (got) {
        window.sthState("ruleBest", "창문 24~28 °C, LED 4,000~15,000 lux, 펌프 30~45%에서 여섯 상황 모두 통과");
        window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("ruleBest") + ". 센서 값을 기준과 비교하는 규칙이 온실의 ‘두뇌’입니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("a-t").addEventListener("input", function (ev) { T = +ev.target.value; $("a-t-val").textContent = T + " °C"; update(); });
    $("a-l").addEventListener("input", function (ev) { L = +ev.target.value; $("a-l-val").textContent = fmt(L) + " lux"; update(); });
    $("a-s").addEventListener("input", function (ev) { S = +ev.target.value; $("a-s-val").textContent = S + "%"; update(); });
    update(); mission();
  })();

  /* 장면 3 — 센서 고장 대비 */
  (function () {
    var canvas = $("a-c-fail"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, f1 = 0, f2 = 0, f3 = 0;
    var got = window.sthState("failGot") || { a: false, q: false };
    function real(h) { return 10 + 28 * Math.max(0, Math.sin(Math.PI * (h - 6) / 13)); }
    function detect() { return f1 ? 6.2 : (f2 ? 9 : null); }
    var hc = 6, playing = !REDUCE;
    var IF = K.iso({ ox: 146, oy: 128, s: 0.7, L: 300, D: 170 });
    function calc() {
      var td = detect(), mx = 0, pts = [];
      for (var h = 6; h <= 18.001; h += 0.1) { var t = real(h); if (td !== null && h > td + 0.5) t = Math.min(t, 26); mx = Math.max(mx, t); pts.push([h, t]); }
      return { td: td, mx: mx, pts: pts, ok: td !== null && td - 6 <= 1 && !f3 };
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var c = calc(), LW = 340, hr = hc, tNow = c.pts[Math.min(c.pts.length - 1, Math.round((hr - 6) * 10))][1];
      var alarm = c.td !== null && hr >= c.td, open = (c.td !== null && hr > c.td + 0.5) || (f3 && hr >= 12 && hr < 13);
      /* ── 왼쪽: 온실 블록 모형 — 두 센서와 고장 알림등, 실제 온도만큼 붉어지는 안 공기 ── */
      var hot = Math.max(0, Math.min(1, (tNow - 20) / 18)), fc = IF.P(150, 85, 0);
      K.studio(ctx, 0, 0, LW, H, { x: fc.x + 10, y: fc.y + 22, rx: 165, ry: 32 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      var g0 = ghIso(ctx, IF, { open: open ? 1 : 0, heat: hot, inside: function (c2, I2, zg) {
        sensorPost(c2, I2, 70, 120, zg, 44, "#d0ebff");
        if (f1) sensorPost(c2, I2, 200, 120, zg, 44, "#ffe8cc");
        I2.box(c2, 272, 60, 52, 276, 76, 66, "#2f9e44", "#2b8a3e", "#1e6b30");
      } });
      ctx.restore();
      var lamp = IF.P(276, 68, 74);
      K.planet(ctx, lamp.x, lamp.y, 5, alarm ? "#ff6b6b" : "#c9ced6", alarm ? "#8a1c1c" : "#6b7280");
      if (alarm && Math.floor(hr * 6) % 2 === 0) K.glow(ctx, lamp.x, lamp.y, 5, "rgba(255,107,129,.95)", 3.4);
      function screen(x, y, val, broken, lab, dx) {
        var p = IF.P(x, y, g0.ZG + 56);
        K.line(ctx, p, { x: p.x + dx, y: p.y - 26 }, "rgba(20,25,40,.7)", 1.2);
        K.pill(ctx, lab + " " + val.toFixed(0) + " °C", p.x + dx, p.y - 26, { a: "center", s: 11.5, c: broken ? "#a5d8ff" : (val > 28 ? "#ffc9c9" : "#ffe8cc"), box: [0, LW] });
      }
      screen(70, 120, 20, true, "① 고장", -24);
      if (f1) screen(200, 120, tNow, false, "②", 26);
      K.pill(ctx, alarm ? "고장 알림!" : "알림 없음", lamp.x - 10, lamp.y - 14, { a: "right", s: 11, c: alarm ? "#ffc9c9" : "#e8ecff", box: [0, LW] });
      var hh = Math.floor(hr), mm = Math.floor((hr % 1) * 6) * 10;
      K.bigText(ctx, (hh < 10 ? "0" : "") + hh + ":" + (mm < 10 ? "0" : "") + mm, 16, 38, 24, "#ffffff");
      K.bigText(ctx, "실제 " + tNow.toFixed(0) + " °C" + (open ? " · 창 열림" : ""), 16, 62, 15, tNow > 28 ? "#ff9a7a" : "#7ee0a0");
      K.warn(ctx, LW - 10, H - 10, "⚠ 크기는 보기 쉽게 과장", "right");
      /* ── 오른쪽: 밝은 하루 온도 그래프 + 판정 띠 ── */
      var RX = LW + 10;
      K.studio(ctx, RX, 0, W - RX, H, null);
      K.t(ctx, "온실 온도 (6시~18시)", RX + 16, 26, { s: 12.5, w: "800", c: LT.mute });
      K.tip(ctx, c.ok ? "안전장치 합격 · 1시간 안에 알아챔" : (c.td === null ? "고장을 알아챌 방법이 없음" : (f3 ? "쓸데없는 동작이 있음" : "너무 늦게 알아챔")), W - 262, 8, 248, c.ok);
      var g = K.chart(ctx, { x: RX + 4, y: 44, w: W - RX - 10, h: H - 48, pl: 46, pb: 30, pt: 8, pr: 14, x0: 6, x1: 18, y0: 5, y1: 45, xt: 4, yt: 4, light: true, xf: function (h) { return Math.round(h) + "시"; }, yf: function (t) { return Math.round(t) + "°"; } });
      ctx.fillStyle = "rgba(224,49,49,.08)"; ctx.fillRect(g.L, g.T, g.R - g.L, g.Y(28) - g.T);
      hline(ctx, g.L, g.R, g.Y(28), LT.orange);
      K.t(ctx, "딸기 한계 28 °C", g.L + 8, g.Y(28) + 16, { s: 11, w: "800", c: LT.orange });
      hline(ctx, g.L, g.R, g.Y(20), LT.blue, [7, 5]);
      K.t(ctx, "고장 난 센서 ①: 늘 20 °C", g.R - 8, g.Y(20) + 18, { s: 11, w: "800", a: "right", c: LT.blue });
      K.plot(ctx, g, c.pts, LT.red, { w: 2.8, light: true });
      if (c.td !== null) { K.line(ctx, { x: g.X(c.td), y: g.T }, { x: g.X(c.td), y: g.B }, LT.green, 2); K.t(ctx, "고장 알림", g.X(c.td) + 6, g.T + 14, { s: 11, w: "900", c: LT.green }); }
      if (f3) { K.line(ctx, { x: g.X(12), y: g.T }, { x: g.X(12), y: g.B }, LT.mute, 1.4, [4, 4]); K.t(ctx, "정오 강제 개방", g.X(12) + 6, g.T + 32, { s: 11, w: "800", c: LT.mute }); }
      K.line(ctx, { x: g.X(hr), y: g.T }, { x: g.X(hr), y: g.B }, "rgba(245,159,0,.7)", 1.4, [4, 4]);
      K.planet(ctx, g.X(hr), g.Y(tNow), 5.5, "#ffc94d", "#8a5a00");
      K.t(ctx, "최고 " + c.mx.toFixed(0) + " °C", g.R - 8, g.T + 14, { s: 12, w: "900", a: "right", c: c.mx <= 28.5 ? LT.green : LT.red });
      return c.ok;
    }
    function update() {
      var ok = draw(), td = detect(), cc = calc();
      readout("a-fail-read", [
        ["실제 최고 온도", cc.mx.toFixed(0) + " °C", cc.mx <= 28.5 ? "g" : "r", "딸기 한계 28 °C"],
        ["고장을 알아챈 때", td === null ? "모름" : (td === 6.2 ? "6시 10분쯤" : "9시"), td !== null && td - 6 <= 1 ? "g" : "r", "고장은 6시에 일어남"],
        ["쓸데없는 동작", f3 ? "있음" : "없음", f3 ? "r" : "g", f3 ? "비 오는 날에도 창문이 열림" : ""]
      ], ok ? ["g", "안전장치 합격"] : ["r", "보완 필요"]);
      put("a-fail-info", (td === null ? "고장을 알아챌 방법이 없어, 딸기는 한낮 38 °C에 그대로 놓였습니다." : (f1 ? "두 센서의 값이 크게 달라지자 곧바로 고장 알림이 울렸습니다." : "3시간 뒤인 9시에야 알림이 울렸습니다. 그사이 온실이 뜨거워질 수 있습니다."))
        + (f3 ? " 정오 강제 개방은 추운 날이나 비 오는 날에도 창문을 열어 딸기를 해칠 수 있습니다." : "") + (ok ? " ✅ 1시간 안에 알아채고, 쓸데없는 동작도 없습니다." : ""));
      if (ok && !got.a) { got.a = true; window.sthState("failGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-3a"); if (got.q) done("m1-3b");
      if (got.a && got.q) {
        window.sthState("failBest", "센서 두 개를 비교해 고장을 곧바로 알아챔");
        window.sthMission("m1-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("failBest") + ". 자동 장치일수록 고장 났을 때를 대비한 설계가 중요합니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    playBtn("a-fail-play", function () { return playing; }, function (q) { playing = q; }, "⏸ 하루 멈추기", "▶ 하루 돌려 보기");
    K.animate(canvas, function (dt) { if (playing) { hc += dt / 1000 * 0.8; if (hc > 18) hc = 6; draw(); } });
    segWire("a-f1", "data-v", function (x) { f1 = +x; update(); });
    segWire("a-f2", "data-v", function (x) { f2 = +x; update(); });
    segWire("a-f3", "data-v", function (x) { f3 = +x; update(); });
    window.sthPick({
      mount: "a-fail-pick",
      q: "자동 온실에 고장 대비 장치가 꼭 필요한 까닭으로 가장 알맞은 것은?",
      options: ["센서는 절대 고장 나지 않으므로 필요 없다", "장치는 센서 값만 믿고 움직이므로, 센서가 틀리면 생명(작물)이 위험해질 수 있기 때문에", "부품을 많이 달수록 멋있어서"],
      answer: 1,
      why: ["센서도 고장 나거나 먼지·물 때문에 틀릴 수 있습니다.", "마이크로컨트롤러는 ‘틀린 값’도 그대로 믿습니다. 여러 센서를 비교하거나 이상한 값을 감지해 알려야 합니다.", "필요한 만큼만, 목적에 맞게 설계해야 합니다."],
      onDone: function () { got.q = true; window.sthState("failGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 4 — 부품 분류 */
  window.sthSort({
    mount: "a-sort",
    buckets: [{ id: "in", label: "📥 입력 — 잰다 (센서)" }, { id: "brain", label: "🧠 판단 — 비교한다 (제어)" }, { id: "out", label: "📤 출력 — 움직인다 (작동기)" }],
    items: [
      { t: "온습도 센서", a: "in", why: "공기의 온도와 습도를 잽니다." },
      { t: "조도 센서", a: "in", why: "빛의 밝기를 잽니다." },
      { t: "토양 수분 센서", a: "in", why: "흙의 수분을 잽니다." },
      { t: "마이크로컨트롤러(아두이노 보드)", a: "brain", why: "센서 값을 읽고 판단합니다." },
      { t: "‘28 °C 넘으면 창문 열기’ 같은 기준을 담은 프로그램", a: "brain", why: "판단의 규칙입니다.", hint: "무엇을 할지 정하는 것은 어느 쪽인가요?" },
      { t: "창문을 여닫는 모터", a: "out", why: "판단에 따라 움직입니다." },
      { t: "물 펌프", a: "out", why: "판단에 따라 물을 보냅니다." },
      { t: "식물 생장용 LED 조명", a: "out", why: "판단에 따라 켜집니다." }
    ],
    onDone: function () { window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>입력(센서) → 판단(마이크로컨트롤러) → 출력(작동기). 거의 모든 자동 장치가 이 구조를 따릅니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m1-4", true);

  function finish() { window.sthState("r1", "완성 · " + (window.sthState("ruleBest") || "") + " / " + (window.sthState("failBest") || "")); }
  function vs() {
    $("e1-vs").innerHTML = "<b>나의 첫 설계</b> " + (window.sthState("gh1") || "기록 없음") + "<br><b>규칙 설계</b> " + (window.sthState("ruleBest") || "-") + "<br><b>고장 대비</b> " + (window.sthState("failBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk1", unitLabel: "[과학탐구실험2 Ⅱ-2] 이야기 ① 겨울 딸기 온실",
    items: [
      { id: "w1", label: "제어의 조건", hint: "스마트 온실에서 어떤 값이 얼마를 넘으면 무엇이 작동하도록 정했는지, 그 기준을 정한 근거와 함께 쓰세요.", ph: "센서: … / 기준값: … / 작동: … / 근거: …" },
      { id: "e1a", label: "우리 학교 화단에 적용하기", hint: "스마트 온실의 원리를 학교 화단이나 교실 화분에 적용한다면 어떤 센서와 장치를 쓸지 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ② 숨 막히는 5교시
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep2", key: "ep2", name: "첨단 탐구 ②", onDone: finish });

  window.sthGate({
    gate: "g2", key: "inv2", title: "동아리의 첫 걸음",
    question: "센서를 활용한 생활 발명품 아이디어는 어디서부터 시작하면 좋을까요?",
    options: ["㉠ 멋진 부품부터 산다", "㉡ 생활 속 불편에서 해결할 문제를 찾고, 무엇을 재서(센서) 어떻게 움직일지(작동) 정한다", "㉢ 인터넷의 발명품을 그대로 따라 만든다", "㉣ 상 받기 쉬운 주제만 고른다"],
    onPick: function (i) { window.sthState("inv2OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 환기 알림 */
  (function () {
    var canvas = $("b-c-co2", 0), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, th = 1200;
    var got = window.sthState("co2Got") || false;
    function sim() {
      var C = 450, vent = 0, alarms = 0, mx = 450, pts = [], vs = [];
      for (var t = 0; t <= 50; t++) {
        pts.push(C); vs.push(vent > 0);
        if (vent > 0) { C = Math.max(450, C - 100); vent--; }
        else { C += 25; if (C >= th) { alarms++; vent = 5; } }
        mx = Math.max(mx, C);
      }
      return { pts: pts, vs: vs, alarms: alarms, mx: mx };
    }
    var mc = 0, playing = !REDUCE;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var r = sim(), ok = r.mx <= 1000 && r.alarms <= 3, LW = 340, i, m = Math.min(50, Math.floor(mc)), Cn = r.pts[m], vent = r.vs[m];
      var ring = !r.vs[m] && m < 50 && r.vs[m + 1];
      /* ── 왼쪽: 교실 블록 모형(두 벽·바닥만 남기고 잘라 냄) ── */
      var IC = K.iso({ ox: 156, oy: 112, s: 0.6, L: 260, D: 200 }), ZF = 14, ZT = 118, fc = IC.P(130, 100, 0);
      K.studio(ctx, 0, 0, LW, H, { x: fc.x + 8, y: fc.y + 24, rx: 160, ry: 30 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      ["front", "right"].forEach(function (sd, k) { IC.face(ctx, sd, function (Lw) { [[0, 5, "#8b8f96"], [5, 9, "#e0c36b"], [9, ZF, "#a3a7ae"]].forEach(function (b) { ctx.fillStyle = k ? K.tint(b[2], .82) : b[2]; ctx.fillRect(0, b[0], Lw, b[1] - b[0]); }); }); });
      IC.top(ctx, function () { return ZF; }, function (j) { return j % 2 ? "#e9dcc4" : "#e1d2b6"; }, 20);
      IC.edges(ctx, ZF, ZF);
      /* 뒤쪽 두 벽: 왼쪽(x = 0) 칠판 벽, 오른쪽(y = 0) 창문 벽 */
      IC.quad(ctx, IC.P(0, 0, ZF), IC.P(0, IC.D, ZF), IC.P(0, IC.D, ZT), IC.P(0, 0, ZT), "#e9e1d2");
      IC.quad(ctx, IC.P(0, 0, ZF), IC.P(IC.L, 0, ZF), IC.P(IC.L, 0, ZT), IC.P(0, 0, ZT), "#f3ece0");
      IC.quad(ctx, IC.P(0, 40, 52), IC.P(0, 150, 52), IC.P(0, 150, 96), IC.P(0, 40, 96), "#2f6b4f", "#8a6a42");
      var gl = ctx.createLinearGradient(0, IC.P(150, 0, 100).y, 0, IC.P(150, 0, 50).y); gl.addColorStop(0, vent ? "#bfe3ff" : "#8fb7d8"); gl.addColorStop(1, vent ? "#e7f5ff" : "#c5dbe9");
      IC.quad(ctx, IC.P(140, 0, 50), IC.P(236, 0, 50), IC.P(236, 0, 100), IC.P(140, 0, 100), gl, "#6b7280");
      K.line(ctx, IC.P(188, 0, 50), IC.P(188, 0, 100), "#6b7280", 1.4);
      if (vent) {
        IC.quad(ctx, IC.P(188, 0, 50), IC.P(206, 26, 50), IC.P(206, 26, 100), IC.P(188, 0, 100), "rgba(200,230,255,.75)", "#6b7280");
        for (i = 0; i < 3; i++) { var fa = (mc * 0.5 + i / 3) % 1; K.arrow(ctx, IC.P(160 - i * 6, 2 + fa * 60, 62 + i * 12), IC.P(150 - i * 6, 40 + fa * 70, 58 + i * 12), "#1c7ed6", 2.4, 9); }
      }
      /* 이산화 탄소 센서(창문 벽) */
      IC.quad(ctx, IC.P(56, 0, 74), IC.P(96, 0, 74), IC.P(96, 0, 96), IC.P(56, 0, 96), "#1f2433", "#9aa3b0");
      var sp = IC.P(76, 0, 85); K.t(ctx, String(Cn), sp.x, sp.y + 4, { s: 10, w: "900", a: "center", c: Cn > 1000 ? "#ff8787" : (Cn >= th ? "#ffd43b" : "#69db7c") });
      var lmp = IC.P(104, 0, 92); K.planet(ctx, lmp.x, lmp.y, 3.4, ring ? "#ffd43b" : "#c9ced6", ring ? "#a36b00" : "#6b7280"); if (ring) K.glow(ctx, lmp.x, lmp.y, 4, "rgba(255,211,107,.98)", 3.6);
      /* 책상과 학생(뒤에서 앞 순서) */
      [[60, 60], [130, 60], [200, 60], [60, 130], [130, 130], [200, 130]].forEach(function (q, k) {
        IC.box(ctx, q[0] - 15, q[1] - 9, ZF, q[0] + 15, q[1] + 9, ZF + 18, "#dcbc8c", "#b8955a", "#9a7a48");
        IC.person(ctx, q[0] + 4, q[1] + 22, ZF, ["#4dabf7", "#ff8787", "#69db7c", "#ffa94d", "#9775fa", "#38d9a9"][k], 1.7);
      });
      /* 이산화 탄소 분자(농도만큼) */
      var Rq = K.rng(5), nd = Math.max(0, Math.round((Cn - 400) / 16));
      for (i = 0; i < nd; i++) {
        var mp = IC.P(10 + Rq() * 240, 10 + Rq() * 180, 34 + Rq() * 76 + Math.sin(mc * 0.6 + i) * 3);
        K.planet(ctx, mp.x - 3.4, mp.y, 1.9, "#ff6b6b", "#7a1f1f"); K.planet(ctx, mp.x, mp.y, 2.2, "#5c6378", "#1f2330"); K.planet(ctx, mp.x + 3.4, mp.y, 1.9, "#ff6b6b", "#7a1f1f");
      }
      ctx.restore();
      var BX = [0, LW];
      IC.label(ctx, 76, 0, 96, "CO₂ 센서" + (ring ? " · 환기 알림!" : ""), -30, -30, ring ? "#ffe8a3" : "#e8ecff", BX);
      IC.label(ctx, 214, 0, 76, vent ? "창문 열고 환기 중" : "창문 닫힘", 30, -40, vent ? "#a5d8ff" : "#e8ecff", BX);
      K.bigText(ctx, Cn + " ppm", 16, 38, 24, Cn > 1000 ? "#ff9a7a" : (Cn >= th ? "#ffd35a" : "#7ee0a0"));
      K.bigText(ctx, "5교시 " + m + "분", 16, 62, 15, "#ffd35a");
      K.pill(ctx, "●●● = 이산화 탄소 분자 (많을수록 답답)", LW / 2, H - 12, { a: "center", s: 10.5, c: "#e4dcff", box: BX });
      /* ── 오른쪽: 밝은 농도 그래프 + 판정 띠 ── */
      var RX = LW + 10;
      K.studio(ctx, RX, 0, W - RX, H, null);
      K.t(ctx, "이산화 탄소 농도 (ppm)", RX + 16, 26, { s: 12.5, w: "800", c: LT.mute });
      K.tip(ctx, ok ? "공기는 맑게, 알림은 알맞게" : (r.mx > 1000 ? "기준이 너무 높아 1000 넘음" : "알림이 너무 잦음 (" + r.alarms + "번)"), W - 252, 8, 238, ok);
      var g = K.chart(ctx, { x: RX + 4, y: 44, w: W - RX - 10, h: H - 48, pl: 46, pb: 30, pt: 8, pr: 14, x0: 0, x1: 50, y0: 400, y1: 1600, xt: 5, yt: 3, light: true, xl: "수업 시간 (분)", xf: function (t) { return Math.round(t) + "분"; }, yf: function (c) { return Math.round(c) + ""; } });
      var cw = (g.R - g.L) / 50;
      r.vs.forEach(function (on, t) { if (on) { ctx.fillStyle = "rgba(28,126,214,.14)"; ctx.fillRect(g.X(t), g.T, cw + 0.5, g.B - g.T); } });
      ctx.fillStyle = "rgba(224,49,49,.07)"; ctx.fillRect(g.L, g.T, g.R - g.L, g.Y(1000) - g.T);
      hline(ctx, g.L, g.R, g.Y(1000), LT.red);
      K.t(ctx, "1000 ppm 넘으면 답답·졸림", g.L + 8, g.Y(1000) - 7, { s: 11, w: "800", c: LT.red });
      hline(ctx, g.L, g.R, g.Y(th), LT.yellow, [3, 4]);
      K.t(ctx, "알림 기준 " + th, g.R - 8, g.Y(th) + (th >= 1000 ? 16 : -7), { s: 11, w: "900", a: "right", c: "#b7791f" });
      K.plot(ctx, g, r.pts.map(function (c, t) { return [t, c]; }), LT.violet, { w: 2.6, light: true });
      K.line(ctx, { x: g.X(m), y: g.T }, { x: g.X(m), y: g.B }, "rgba(245,159,0,.7)", 1.4, [4, 4]);
      K.planet(ctx, g.X(m), g.Y(Cn), 5.5, "#ffc94d", "#8a5a00");
      K.t(ctx, "파란 띠 = 창문을 연 시간 · 최고 " + r.mx + " ppm · 알림 " + r.alarms + "번", g.R - 4, g.T + 14, { s: 10.5, w: "800", a: "right", c: LT.blue });
      return ok;
    }
    function update() {
      var ok = draw(), r = sim();
      readout("b-co2-read", [
        ["알림 기준", th + " ppm", "y"],
        ["가장 높았던 농도", r.mx + " ppm", r.mx <= 1000 ? "g" : "r", "1000 ppm을 넘지 않아야 함"],
        ["알림", r.alarms + "번", r.alarms <= 3 ? "g" : "r", "수업 50분 동안 3번 이하"]
      ], ok ? ["g", "공기는 맑게, 알림은 알맞게"] : ["r", r.mx > 1000 ? "기준이 너무 높음" : "알림이 너무 잦음"]);
      put("b-co2-info", "기준 " + th + " ppm: 수업 중 가장 높았던 농도는 " + r.mx + " ppm, 알림은 " + r.alarms + "번 울렸습니다. "
        + (ok ? "✅ 공기는 맑게, 알림은 알맞게." : (r.mx > 1000 ? "기준이 너무 높아 1000 ppm을 넘습니다." : "알림이 너무 자주 울립니다.")));
      if (ok && !got) { got = true; window.sthState("co2Got", true); mission(); }
    }
    function mission() {
      if (got) {
        window.sthState("co2Best", "알림 기준 700~1000 ppm → 1000 ppm을 넘지 않고 알림 3번 이하");
        window.sthMission("m2-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("co2Best") + ". 과학 지식(1000 ppm)과 사용하는 사람의 편의(알림 횟수)를 함께 따져 기준을 정했습니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    playBtn("b-co2-play", function () { return playing; }, function (q) { playing = q; }, "⏸ 수업 멈추기", "▶ 수업 돌려 보기");
    K.animate(canvas, function (dt) { if (playing) { mc = (mc + dt / 1000 * 3) % 51; draw(); } });
    $("b-th").addEventListener("input", function (ev) { th = +ev.target.value; $("b-th-val").textContent = th + " ppm"; update(); });
    update(); mission();
  })();

  /* 장면 3 — 윤리 판단 */
  (function () {
    var got = window.sthState("ethGot") || { a: false, b: false };
    function mission() {
      if (got.a) done("m2-3a"); if (got.b) done("m2-3b");
      if (got.a && got.b) {
        window.sthState("ethBest", "이상값은 원인과 제외 까닭을 밝히고, 가져온 코드는 출처와 조건을 지킴");
        window.sthMission("m2-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("ethBest") + ". 결과가 좋아 보이는 것보다 과정이 정직한 것이 먼저입니다.");
        ep.clear(2);
      }
    }
    window.sthPick({
      mount: "b-eth1",
      q: "햇볕 때문에 이상하게 나온 시험 자료 한 번은 어떻게 처리해야 할까요?",
      options: ["아무 말 없이 지운다", "그대로 평균에 넣는다", "원인(햇볕)을 기록하고, 그 자료를 뺀 까닭을 보고서에 밝히며, 가능하면 다시 시험한다", "다른 값과 비슷해 보이게 숫자를 고친다"],
      answer: 2,
      why: ["몰래 지우면 다른 사람이 결과를 검증할 수 없습니다. 자료를 밝히지 않고 지우는 것도 변조(임의 삭제)에 들어갑니다.", "원인이 분명한 잘못된 측정을 섞으면 결과가 틀려집니다. 뺄 수는 있지만 밝혀야 합니다.", "측정 과정의 실수도 정직하게 기록하는 것이 <b>연구 진실성</b>입니다.", "자료를 고치는 것은 <b>변조</b>로, 위조·표절과 함께 대표적인 연구 부정행위입니다."],
      onDone: function () { got.a = true; window.sthState("ethGot", got); mission(); }
    });
    window.sthPick({
      mount: "b-eth2",
      q: "인터넷의 공개 코드를 발명품에 쓸 때 가장 알맞은 방법은?",
      options: ["공개되어 있으니 내가 짠 것처럼 쓴다", "사용 허락 조건(라이선스)을 확인해 지키고, 발표 자료에 출처를 밝힌다", "코드를 조금 바꾸면 출처를 밝히지 않아도 된다"],
      answer: 1,
      why: ["공개되어 있어도 만든 사람의 권리가 있습니다.", "출처를 밝히고 조건을 지키는 것이 <b>지식 재산권 존중</b>입니다. 오픈 소스도 저마다 조건이 있습니다.", "조금 바꿔도 원래 만든 사람의 기여를 밝혀야 합니다."],
      onDone: function () { got.b = true; window.sthState("ethGot", got); mission(); }
    });
    mission();
  })();

  /* 장면 4 — 윤리 분류 */
  window.sthSort({
    mount: "b-sort",
    buckets: [{ id: "life", label: "🌱 생명 존중" }, { id: "honest", label: "📐 연구 진실성" }, { id: "ip", label: "©️ 지식 재산권 존중" }],
    items: [
      { t: "실험에 쓸 식물과 동물을 꼭 필요한 만큼만 쓰고, 고통을 줄인다", a: "life", why: "생명을 함부로 다루지 않습니다." },
      { t: "친구들의 호흡을 잴 때 미리 목적을 설명하고 동의를 받는다", a: "life", why: "사람을 대상으로 한 연구는 참여자의 동의가 먼저입니다." },
      { t: "관찰하려고 잡은 곤충을 관찰 뒤 원래 서식지에 돌려보낸다", a: "life", why: "생명을 존중하는 태도입니다." },
      { t: "측정하지 않은 값을 지어내 표를 채우지 않는다", a: "honest", why: "지어내는 것은 위조입니다." },
      { t: "예상과 다르게 나온 결과도 빼지 않고 기록한다", a: "honest", why: "불리한 결과를 숨기는 것도 진실성을 해칩니다." },
      { t: "함께 연구한 친구의 기여를 발표 자료에 정확히 밝힌다", a: "honest", why: "누가 무엇을 했는지 정직하게 밝혀야 합니다. 누가 했는지 속이면 연구 진실성을 해치는 부정행위(부당한 저자 표시)입니다.", hint: "누가 무엇을 했는지 정직하게 밝히는 것은?" },
      { t: "다른 사람의 사진이나 그림을 쓸 때 출처를 밝히고 허락을 받는다", a: "ip", why: "만든 사람의 권리를 존중합니다." },
      { t: "다른 학교 학생의 발명 아이디어를 허락 없이 내 것처럼 출품하지 않는다", a: "ip", why: "남의 아이디어를 도용하지 않습니다." }
    ],
    onDone: function () { window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>생명을 존중하고, 정직하게 기록하고, 남의 것을 존중한다. 연구 윤리는 좋은 탐구의 바탕입니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m2-4", true);

  function finish() { window.sthState("r2", "완성 · " + (window.sthState("co2Best") || "") + " / " + (window.sthState("ethBest") || "")); }
  function vs() {
    $("e2-vs").innerHTML = "<b>나의 첫 걸음</b> " + (window.sthState("inv2") || "기록 없음") + "<br><b>환기 알림</b> " + (window.sthState("co2Best") || "-") + "<br><b>윤리 판단</b> " + (window.sthState("ethBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk2", unitLabel: "[과학탐구실험2 Ⅱ-2] 이야기 ② 숨 막히는 5교시",
    items: [
      { id: "w2", label: "연구 윤리", hint: "내 탐구에서 지켜야 할 윤리 항목을 하나 고르고, 구체적으로 무엇을 하겠다는 것인지 쓰세요.", ph: "윤리 항목: … / 내가 할 일: …" },
      { id: "e2a", label: "나의 센서 발명품", hint: "생활 속 불편 하나를 골라, 어떤 센서로 무엇을 재어 어떤 동작을 할지 발명품 아이디어를 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ③ 우주 개발 토론회
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep3", key: "ep3", name: "첨단 탐구 ③", onDone: finish });

  window.sthGate({
    gate: "g3", key: "space2", title: "동아리의 첫 판단",
    question: "과학 기술(우주 개발)의 가치를 평가할 때 가장 알맞은 방법은?",
    options: ["㉠ 비용 하나만 본다", "㉡ 기술 파급·비용·국제 협력·환경 같은 여러 관점의 근거를 함께 따진다", "㉢ 유명한 사람의 의견을 따른다", "㉣ 느낌으로 정한다"],
    onPick: function (i) { window.sthState("space2OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 타임라인과 관점 */
  (function () {
    var canvas = $("c-c-tl"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, ev = 0, lens = "tech";
    var got = window.sthState("tlGot") || { evs: [], ls: [], q: false };
    if (!got.evs) got.evs = []; if (!got.ls) got.ls = [];
    var EV = [
      { y: "1957", n: "스푸트니크 1호 발사", tech: "인류 최초의 인공위성으로, 뒤의 통신·기상·항법(GPS) 위성 산업 전체의 출발점이 되었습니다.", cost: "체제 경쟁 속에서 막대한 비용이 들었지만, 뒤에 위성 통신 산업이 그 비용을 여러 배로 거두는 바탕이 되었습니다.", coop: "냉전 경쟁의 산물로 국제 협력과는 거리가 멀었고, 오히려 우주 개발 경쟁을 불붙였습니다." },
      { y: "1969", n: "아폴로 11호 유인 달 착륙", tech: "정밀 유도 항법, 소형 컴퓨터, 신소재 등 뒤에 민간 산업으로 퍼진 기술이 많이 개발되었습니다.", cost: "천문학적인 비용이 들어 실효성 논쟁이 꾸준히 이어졌습니다.", coop: "미국 단독 사업으로, 협력보다는 냉전 시대 국가 경쟁을 상징했습니다." },
      { y: "1998", n: "국제 우주 정거장 건설 시작", tech: "미세 중력 환경의 실험으로 신약·신소재 연구가 발전했습니다.", cost: "여러 나라가 비용을 나누었지만, 유지·보수에 계속 막대한 비용이 드는 것이 과제입니다.", coop: "미국·러시아·유럽·일본·캐나다 등이 함께한 대표적인 <b>국제 협력</b> 사업입니다." },
      { y: "2015~", n: "궤도 로켓 1단 회수·재사용", tech: "2015년 처음으로 궤도 로켓 1단을 땅에 내려 회수했고, 2017년 회수한 1단으로 다시 발사했습니다. 이 기술이 발전해 발사 비용을 크게 낮추는 계기가 되었습니다.", cost: "처음 개발 비용은 컸지만, 길게 보면 발사 한 번의 비용을 크게 낮춰 <b>실효성</b>을 높였습니다.", coop: "민간 기업이 이끌며 여러 나라의 위성을 함께 실어 쏘는 상업적 협력 모델을 만들었습니다." },
      { y: "2020년대", n: "저궤도 위성 인터넷망 구축", tech: "수천 개의 소형 위성으로 지상 통신망이 닿지 않는 곳까지 인터넷을 공급합니다.", cost: "초기 투자가 막대하지만, 오지·바다·항공 통신 같은 새 수요로 사업성을 검증받는 중입니다.", coop: "수천 개의 위성이 같은 궤도와 주파수를 나눠 써야 해서, 국제전기통신연합(ITU) 같은 국제기구에서 나라와 기업이 함께 주파수·궤도를 조정하고 우주 쓰레기를 줄일 규범을 논의합니다." }
    ];
    var LN = { tech: "기술 파급 효과", cost: "비용과 실효성", coop: "국제 협력" };
    var SHORT = ["스푸트니크", "아폴로 11호", "국제 우주 정거장", "재사용 로켓", "위성 인터넷망"];
    /* 밝은 스튜디오용 입체 미니어처(받침대 위 x, y 가 바닥 가운데) */
    function mini(i, x, y) {
      ctx.fillStyle = "rgba(0,0,0,.16)"; ctx.beginPath(); ctx.ellipse(x + 3, y, 22, 6, 0, 0, 6.2832); ctx.fill();
      if (i === 0) {
        ctx.strokeStyle = "#4b5263"; ctx.lineWidth = 1.6;
        [[-1, 1], [-1, .55], [1, 1], [1, .55]].forEach(function (q) { ctx.beginPath(); ctx.moveTo(x + q[0] * 5, y - 22); ctx.lineTo(x + q[0] * 26, y - 22 + q[1] * 20); ctx.stroke(); });
        K.planet(ctx, x, y - 26, 12, "#e3e7ef", "#5b6378");
      } else if (i === 1) {
        ctx.fillStyle = "#b9bcc4"; ctx.beginPath(); ctx.ellipse(x, y - 2, 26, 7, 0, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = "#6b6f78"; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(x - 12, y - 16); ctx.lineTo(x - 20, y - 2); ctx.moveTo(x + 12, y - 16); ctx.lineTo(x + 20, y - 2); ctx.stroke();
        var lg = ctx.createLinearGradient(x - 14, 0, x + 14, 0); lg.addColorStop(0, "#a8862a"); lg.addColorStop(.5, "#ffe08a"); lg.addColorStop(1, "#8a6a1a");
        ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(x - 14, y - 12); ctx.lineTo(x - 10, y - 26); ctx.lineTo(x + 10, y - 26); ctx.lineTo(x + 14, y - 12); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#d7dbe3"; ctx.beginPath(); ctx.roundRect(x - 8, y - 38, 16, 12, 3); ctx.fill(); ctx.strokeStyle = "#7a808c"; ctx.lineWidth = 1; ctx.stroke();
      } else if (i === 2) {
        ctx.strokeStyle = "#6b7280"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 18); ctx.stroke();
        ctx.fillStyle = "#c9ced6"; ctx.fillRect(x - 32, y - 30, 64, 4); ctx.fillStyle = "#e9edf3"; ctx.beginPath(); ctx.roundRect(x - 7, y - 36, 14, 16, 3); ctx.fill(); ctx.strokeStyle = "#8a919c"; ctx.stroke();
        [-30, -20, 12, 22].forEach(function (dx) { var sp = ctx.createLinearGradient(0, y - 48, 0, y - 10); sp.addColorStop(0, "#4c7be0"); sp.addColorStop(1, "#1b2f6a"); ctx.fillStyle = sp; ctx.fillRect(x + dx, y - 48, 8, 15); ctx.fillRect(x + dx, y - 25, 8, 15); });
      } else if (i === 3) {
        ctx.fillStyle = "#6b7280"; ctx.beginPath(); ctx.moveTo(x - 26, y - 4); ctx.lineTo(x + 26, y - 4); ctx.lineTo(x + 20, y + 2); ctx.lineTo(x - 20, y + 2); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "#3d4250"; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(x - 5, y - 14); ctx.lineTo(x - 14, y - 4); ctx.moveTo(x + 5, y - 14); ctx.lineTo(x + 14, y - 4); ctx.stroke();
        var rg = ctx.createLinearGradient(x - 6, 0, x + 6, 0); rg.addColorStop(0, "#9aa3ba"); rg.addColorStop(.5, "#ffffff"); rg.addColorStop(1, "#7a8399");
        ctx.fillStyle = rg; ctx.fillRect(x - 6, y - 52, 12, 44); ctx.fillStyle = "rgba(40,35,30,.55)"; ctx.fillRect(x - 6, y - 22, 12, 12);
        ctx.fillStyle = "#3d4250"; ctx.fillRect(x - 9, y - 50, 3, 4); ctx.fillRect(x + 6, y - 50, 3, 4);
      } else {
        K.earth(ctx, x, y - 22, 14);
        ctx.strokeStyle = "rgba(30,60,120,.35)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y - 22, 27, 10, -.3, 0, 6.2832); ctx.stroke();
        for (var k2 = 0; k2 < 12; k2++) { var a2 = k2 / 12 * 6.2832; var px = x + Math.cos(a2) * 27, py = y - 22 + Math.sin(a2) * 10 - Math.cos(a2) * 27 * Math.sin(-.3) * .3; ctx.fillStyle = "#1f2a44"; ctx.fillRect(px - 1.5, py - 1, 3, 2); }
      }
    }
    function glyph(i, x, y, on) {
      ctx.save(); ctx.globalAlpha = on ? 1 : 0.6;
      if (i === 0) {
        K.planet(ctx, x, y, 11, "#d9dde8", "#5b6378");
        ctx.strokeStyle = "#c9cfdd"; ctx.lineWidth = 1.5; [[-1, 1], [-1, 0.6], [1, 1], [1, 0.6]].forEach(function (q) { ctx.beginPath(); ctx.moveTo(x + q[0] * 6, y + 6); ctx.lineTo(x + q[0] * 26, y + 6 + q[1] * 20); ctx.stroke(); });
      } else if (i === 1) {
        var lg = ctx.createLinearGradient(x - 14, 0, x + 14, 0); lg.addColorStop(0, "#a8862a"); lg.addColorStop(0.5, "#ffe08a"); lg.addColorStop(1, "#8a6a1a");
        ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(x - 14, y + 4); ctx.lineTo(x - 9, y - 12); ctx.lineTo(x + 9, y - 12); ctx.lineTo(x + 14, y + 4); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "#c9cfdd"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x - 12, y + 4); ctx.lineTo(x - 20, y + 16); ctx.moveTo(x + 12, y + 4); ctx.lineTo(x + 20, y + 16); ctx.stroke();
        ctx.fillStyle = "#cfd3dc"; ctx.beginPath(); ctx.arc(x + 30, y - 16, 7, 0, 6.2832); ctx.fill();
      } else if (i === 2) {
        ctx.fillStyle = "#c9cfdd"; ctx.fillRect(x - 30, y - 2, 60, 4); ctx.fillRect(x - 6, y - 8, 12, 16);
        var sp = ctx.createLinearGradient(0, y - 18, 0, y + 18); sp.addColorStop(0, "#3a6ad0"); sp.addColorStop(1, "#1b2f6a");
        ctx.fillStyle = sp; [-28, -18, 12, 22].forEach(function (dx) { ctx.fillRect(x + dx, y - 18, 8, 14); ctx.fillRect(x + dx, y + 4, 8, 14); });
      } else if (i === 3) {
        var rg = ctx.createLinearGradient(x - 6, 0, x + 6, 0); rg.addColorStop(0, "#9aa3ba"); rg.addColorStop(0.5, "#f1f4fb"); rg.addColorStop(1, "#7a8399");
        ctx.fillStyle = rg; ctx.fillRect(x - 6, y - 24, 12, 38);
        ctx.strokeStyle = "#c9cfdd"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x - 6, y + 8); ctx.lineTo(x - 14, y + 18); ctx.moveTo(x + 6, y + 8); ctx.lineTo(x + 14, y + 18); ctx.stroke();
        K.glow(ctx, x, y + 18, 4, "rgba(255,179,92,.95)", 3);
      } else {
        K.earth(ctx, x, y + 14, 12);
        ctx.strokeStyle = "rgba(200,210,255,.35)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y + 14, 24, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
        for (var k = 0; k < 9; k++) { var a = Math.PI * (1.08 + k * 0.1); K.glow(ctx, x + Math.cos(a) * 24, y + 14 + Math.sin(a) * 24, 1.3, "rgba(255,255,255,.95)", 2.6); }
      }
      ctx.restore();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var LW = 620, BY = 206;
      /* ── 왼쪽: 다섯 받침대 위 우주 개발 미니어처 (고른 사건의 받침대가 올라온다) ── */
      K.studio(ctx, 0, 0, LW, H, { x: 310, y: BY + 26, rx: 300, ry: 36 });
      K.line(ctx, { x: 40, y: BY + 14 }, { x: LW - 40, y: BY + 14 }, "rgba(28,126,214,.35)", 3);
      EV.forEach(function (e, i) {
        var x = 74 + i * 118, on = i === ev, seen = got.evs.indexOf(i) >= 0, hp = on ? 44 : 22;
        var IP = K.iso({ ox: x, oy: BY - 12, s: 0.62, L: 50, D: 50 });
        IP.box(ctx, 0, 0, 0, 50, 50, hp, on ? "#d0ebff" : (seen ? "#d3f9d8" : "#eef1f5"), on ? "#74c0fc" : (seen ? "#8ce99a" : "#c9ced6"), on ? "#4dabf7" : (seen ? "#51cf66" : "#adb5bd"));
        var tp = IP.P(25, 25, hp);
        if (on) { var hg = ctx.createRadialGradient(tp.x, tp.y - 26, 4, tp.x, tp.y - 26, 56); hg.addColorStop(0, "rgba(77,171,247,.30)"); hg.addColorStop(1, "rgba(77,171,247,0)"); ctx.fillStyle = hg; ctx.fillRect(tp.x - 60, tp.y - 86, 120, 110); }
        ctx.save(); ctx.globalAlpha = on ? 1 : .8; mini(i, tp.x, tp.y); ctx.restore();
        K.pill(ctx, e.y, x, BY + 42, { a: "center", s: on ? 13 : 11.5, c: on ? "#ffffff" : (seen ? "#0b5d3b" : LT.mute), bg: on ? "#1c7ed6" : "rgba(255,255,255,.9)", line: on ? null : "rgba(20,40,90,.18)" });
        K.t(ctx, SHORT[i], x, BY + 64, { s: on ? 12 : 11, w: on ? "900" : "700", a: "center", c: on ? LT.ink : LT.mute });
      });
      K.bigText(ctx, "관점: " + LN[lens], 18, 40, 22, "#ffffff");
      K.bigText(ctx, "우주 개발 다섯 장면", 18, 64, 14, "#ffd35a");
      /* ── 오른쪽: 흰 카드 — 고른 사건과 살펴본 정도 ── */
      var RX = LW + 12, x0 = RX + 18, x1 = W - 18, nE = got.evs.length, nL = got.ls.length, all = nE >= 5 && nL >= 3;
      K.card(ctx, RX, 0, W - RX, H, "고른 사건");
      K.t(ctx, EV[ev].y, x0, 70, { s: 26, w: "900", c: LT.blue });
      K.t(ctx, EV[ev].n, x0, 96, { s: 13, w: "900", c: LT.ink });
      K.pill(ctx, "관점 · " + LN[lens], x0 + 2, 126, { s: 12, c: "#ffffff", bg: lens === "tech" ? LT.violet : (lens === "cost" ? LT.orange : LT.teal), box: [RX, W] });
      K.row(ctx, "살펴본 사건", nE + " / 5", x0, x1, 168, nE >= 5 ? LT.green : LT.ink); K.bar(ctx, x0, 176, x1 - x0, nE / 5, nE >= 5 ? LT.green : LT.blue);
      K.row(ctx, "살펴본 관점", nL + " / 3", x0, x1, 210, nL >= 3 ? LT.green : LT.ink); K.bar(ctx, x0, 218, x1 - x0, nL / 3, nL >= 3 ? LT.green : LT.blue);
      K.tip(ctx, all ? "다섯 사건 · 세 관점 모두 봄" : "사건과 관점을 더 바꿔 보세요", x0 - 4, 244, x1 - x0 + 8, all ? true : null);
    }
    function update() {
      if (got.evs.indexOf(ev) < 0) got.evs.push(ev);
      if (got.ls.indexOf(lens) < 0) got.ls.push(lens);
      window.sthState("tlGot", got);
      $("c-ev-val").textContent = EV[ev].y;
      draw();
      put("c-tl-info", "<b>" + EV[ev].y + " · " + EV[ev].n + "</b> — [" + LN[lens] + "] " + EV[ev][lens]);
      mission();
    }
    function mission() {
      var a = got.evs.length >= 5 && got.ls.length >= 3;
      if (a) done("m3-2a"); if (got.q) done("m3-2b");
      if (a && got.q && !ep.cleared(1)) {
        window.sthState("tlBest", "같은 사건도 관점마다 평가가 다르다 (예: 스푸트니크 — 기술 ↑, 협력 ↓)");
        window.sthMission("m3-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("tlBest") + ".");
        ep.clear(1);
      } else if (a && got.q) window.sthMission("m3-2", true);
    }
    canvas._redraw = draw;
    $("c-ev").addEventListener("input", function (e) { ev = +e.target.value; update(); });
    segWire("c-lens", "data-v", function (x) { lens = x; update(); });
    window.sthPick({
      mount: "c-tl-pick",
      q: "같은 우주 개발 사건이 관점에 따라 다르게 평가되는 까닭은?",
      options: ["평가하는 사람이 사실을 잘못 알고 있기 때문에", "과학 기술은 기술·경제·사회·환경에 동시에 영향을 주어, 어떤 가치를 중시하느냐에 따라 장단점이 달리 보이기 때문에", "우주 개발은 평가할 수 없는 일이기 때문에"],
      answer: 1,
      why: ["사실은 같아도 평가의 기준이 다를 수 있습니다.", "그래서 과학 기술의 발전 방향을 평가할 때는 여러 관점의 근거를 함께 따져야 합니다.", "근거를 모으면 평가할 수 있습니다."],
      onDone: function () { got.q = true; window.sthState("tlGot", got); mission(); }
    });
    update();
  })();

  /* 장면 3 — 재사용 로켓 비용 (잘라 보는 발사장 디오라마 + 발사 한 번 비용 블록 + 횟수별 막대) */
  (function () {
    var canvas = $("c-c-cost"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, n = 1;
    var got = window.sthState("costGot") || false;
    var playing = !REDUCE, ph = 0.84;
    function cost(k) { return 360 / k + 36 * (k - 1) / k + 240; }
    var DH = 430;                                         /* 위: 발사장 모형, 아래: 횟수별 막대 */
    var I = K.iso({ ox: 360, oy: 160, s: 0.62, L: 600, D: 240 });
    var L = I.L, D = I.D, LAND = 360, GZ = 40, SEA = 34, FLOOR = 10;
    var J = K.iso({ ox: 842, oy: 318, s: 0.62, L: 56, D: 56 });   /* 발사 한 번 비용 블록 */
    var ZC = 0.5;                                         /* 1억 원 = 0.5 그림 단위 */
    var box = [0, W];
    function quad(a, b, c, d, fill) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
    function cyl(x, yb, w, h, c0, c1, c2) {
      var g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0); g.addColorStop(0, c0); g.addColorStop(0.42, c1); g.addColorStop(1, c2);
      ctx.fillStyle = g; ctx.fillRect(x - w / 2, yb - h, w, h);
    }
    /* 1단(부스터) 하나: 바닥 가운데 (0,0) 기준, 위로 h. soot 0~1, legs 착륙 다리, flame 불꽃 */
    function booster(h, soot, legs, flame) {
      var w = 14, i;
      if (flame) {
        var fg = ctx.createLinearGradient(0, 0, 0, 34); fg.addColorStop(0, "rgba(255,240,180,.95)"); fg.addColorStop(0.5, "rgba(255,150,60,.75)"); fg.addColorStop(1, "rgba(255,90,40,0)");
        ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(6, 0); ctx.lineTo(0, 26 + flame * 10); ctx.closePath(); ctx.fill();
        K.glow(ctx, 0, 4, 4, "rgba(255,190,90,.9)", 3);
      }
      cyl(0, 0, w, h, "#6a7390", soot > 0 ? "#d6c7a8" : "#eef2fa", "#55607d");
      if (soot > 0) { ctx.fillStyle = "rgba(55,38,20," + (0.18 + soot * 0.4).toFixed(2) + ")"; ctx.fillRect(-w / 2, -h * 0.55, w, h * 0.55); }
      ctx.fillStyle = "#2b3046"; ctx.fillRect(-w / 2, -4, w, 4);
      ctx.strokeStyle = "#c9cfdd"; ctx.lineWidth = 2;
      ctx.beginPath();
      if (legs) { ctx.moveTo(-6, -14); ctx.lineTo(-17, 2); ctx.moveTo(6, -14); ctx.lineTo(17, 2); }
      else { ctx.moveTo(-7, -18); ctx.lineTo(-9, -2); ctx.moveTo(7, -18); ctx.lineTo(9, -2); }
      ctx.stroke();
      ctx.fillStyle = "#3a4466"; for (i = -1; i <= 1; i += 2) ctx.fillRect(i * 7 + (i < 0 ? -4 : 0), -h + 4, 4, 5);   /* 격자 날개 */
    }
    function drawModel(c0, ok) {
      var i, k, p;
      K.studio(ctx, 0, 0, W, DH, { x: 520, y: 395, rx: 380, ry: 52 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, W, DH, 14); ctx.clip();
      /* ── 블록 몸통: 앞면(땅 단면 + 바다 단면) ── */
      I.face(ctx, "front", function () {
        var g = ctx.createLinearGradient(0, 0, 0, GZ); g.addColorStop(0, "#5e4630"); g.addColorStop(0.6, "#8a6a45"); g.addColorStop(1, "#b49468");
        ctx.fillStyle = g; ctx.fillRect(0, 0, LAND, GZ);
        ctx.fillStyle = "#9aa0a8"; ctx.fillRect(0, GZ - 4, LAND, 4);                    /* 콘크리트 판 */
        ctx.strokeStyle = "rgba(50,35,20,.35)"; ctx.lineWidth = 1;
        for (k = 8; k < GZ - 6; k += 9) { ctx.beginPath(); ctx.moveTo(0, k); ctx.lineTo(LAND, k + 1.5); ctx.stroke(); }
        var sg = ctx.createLinearGradient(0, 0, 0, FLOOR); sg.addColorStop(0, "#6b5a45"); sg.addColorStop(1, "#c9b083");
        ctx.fillStyle = sg; ctx.fillRect(LAND, 0, L - LAND, FLOOR);
        var wg = ctx.createLinearGradient(0, SEA, 0, FLOOR); wg.addColorStop(0, "rgba(70,160,230,.72)"); wg.addColorStop(1, "rgba(15,60,130,.85)");
        ctx.fillStyle = wg; ctx.fillRect(LAND, FLOOR, L - LAND, SEA - FLOOR);
        ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(LAND, SEA); ctx.lineTo(L, SEA); ctx.stroke();
      });
      I.face(ctx, "right", function () {
        var sg = ctx.createLinearGradient(0, 0, 0, FLOOR); sg.addColorStop(0, "#5a4a38"); sg.addColorStop(1, "#a8926b");
        ctx.fillStyle = sg; ctx.fillRect(0, 0, D, FLOOR);
        var wg = ctx.createLinearGradient(0, SEA, 0, FLOOR); wg.addColorStop(0, "rgba(50,130,200,.78)"); wg.addColorStop(1, "rgba(10,45,105,.9)");
        ctx.fillStyle = wg; ctx.fillRect(0, FLOOR, D, SEA - FLOOR);
        ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(0, SEA); ctx.lineTo(D, SEA); ctx.stroke();
      });
      /* 땅 윗면(발사장 콘크리트)과 바닷가 옹벽 */
      I.plane(ctx, GZ, "#c3c7cd", null, 0, LAND, 0, D);
      ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 1;
      for (k = 60; k < LAND; k += 60) { var a1 = I.P(k, 0, GZ), b1 = I.P(k, D, GZ); ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.lineTo(b1.x, b1.y); ctx.stroke(); }
      quad(I.P(LAND, 0, FLOOR), I.P(LAND, D, FLOOR), I.P(LAND, D, GZ), I.P(LAND, 0, GZ), "#7d736a");
      /* 바다 윗면 */
      var s0 = I.P(LAND, 0, SEA), s1 = I.P(L, D, SEA), sgr = ctx.createLinearGradient(s0.x, s0.y, s1.x, s1.y);
      sgr.addColorStop(0, "rgba(120,200,250,.78)"); sgr.addColorStop(1, "rgba(30,110,195,.82)");
      I.plane(ctx, SEA, sgr, "rgba(255,255,255,.6)", LAND, L, 0, D);
      ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 1;
      for (i = 0; i < 8; i++) {
        var gx = LAND + 12 + ((i * 0.41 + ph * 0.3) % 1) * (L - LAND - 30), gy = 14 + ((i * 0.63) % 1) * (D - 28);
        var w1 = I.P(gx - 12, gy, SEA), w2 = I.P(gx + 8, gy, SEA);
        ctx.beginPath(); ctx.moveTo(w1.x, w1.y); ctx.quadraticCurveTo((w1.x + w2.x) / 2, w1.y - 3, w2.x, w2.y); ctx.stroke();
      }
      I.edges(ctx, SEA, SEA);
      /* ── 정비 격납고(앞쪽 왼편, 지붕과 앞벽은 잘라 냄) ── */
      I.box(ctx, 15, 150, GZ, 125, 232, GZ + 2, "#d9dbe0", "#b8bcc4", "#9da2ab");
      I.box(ctx, 15, 150, GZ, 125, 156, GZ + 44, "#e3e5ea", "#cfd3da", "#aeb3bc");
      I.box(ctx, 15, 150, GZ, 21, 232, GZ + 44, "#e3e5ea", "#b9bec7", "#c9cdd4");
      if (n > 1) {
        var h1 = I.P(32, 194, GZ + 10), h2 = I.P(112, 194, GZ + 10);
        ctx.save(); ctx.lineCap = "round";
        ctx.strokeStyle = "#5c6378"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(h1.x, h1.y); ctx.lineTo(h2.x, h2.y); ctx.stroke();
        ctx.strokeStyle = "#d6c7a8"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(h1.x, h1.y - 2); ctx.lineTo(h2.x, h2.y - 2); ctx.stroke();
        ctx.restore();
        [[40, 190], [100, 190]].forEach(function (q) { I.box(ctx, q[0] - 4, q[1] - 4, GZ + 2, q[0] + 4, q[1] + 8, GZ + 6, "#ffcf4a", "#d9a92a", "#b98e1e"); });
        I.person(ctx, 70, 218, GZ + 2, "#ffd35a", 0.95);
        I.person(ctx, 96, 214, GZ + 2, "#4fb6ff", 0.95);
      }
      I.label(ctx, 30, 232, GZ + 6, n > 1 ? "정비 격납고 · 한 번 정비 36억" : "격납고 비어 있음 · 정비할 1단 없음", -46, 46, n > 1 ? "#bff5dd" : "#e8ecff", box);
      /* ── 발사대·정비탑·로켓 ── */
      I.box(ctx, 160, 32, GZ, 238, 96, GZ + 12, "#cfd2d8", "#a9adb5", "#8d929b");
      I.box(ctx, 170, 62, GZ + 12, 180, 72, GZ + 250, "#9aa0ab", "#7b8190", "#636978");
      var tp = I.P(175, 72, GZ + 12);
      ctx.strokeStyle = "rgba(60,64,78,.6)"; ctx.lineWidth = 1;
      for (k = 0; k < 14; k++) { ctx.beginPath(); ctx.moveTo(tp.x - 6, tp.y - k * 11); ctx.lineTo(tp.x + 4, tp.y - k * 11 - 8); ctx.stroke(); }
      p = I.P(200, 60, GZ + 12);
      var rx = p.x, yb = p.y, s1h = 96;
      ctx.save(); ctx.translate(rx, yb); booster(s1h, n > 1 ? Math.min(1, (n - 1) / 8) : 0, false, 0); ctx.restore();
      if (n > 1) { ctx.fillStyle = "rgba(55,38,20,.45)"; for (i = 0; i < Math.min(n - 1, 8); i++) ctx.fillRect(rx - 7, yb - 18 - i * 9, 14, 2.5); }
      ctx.fillStyle = "#2b3046"; ctx.fillRect(rx - 7, yb - s1h - 4, 14, 4);
      cyl(rx, yb - s1h - 4, 14, 30, "#8a93ab", "#f4f6fb", "#6f7891");
      var ft = yb - s1h - 34;
      var fg = ctx.createLinearGradient(rx - 8, 0, rx + 8, 0); fg.addColorStop(0, "#8a93ab"); fg.addColorStop(0.45, "#ffffff"); fg.addColorStop(1, "#6f7891");
      ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(rx - 8, ft); ctx.lineTo(rx + 8, ft); ctx.lineTo(rx + 8, ft - 8); ctx.quadraticCurveTo(rx + 7, ft - 20, rx, ft - 24); ctx.quadraticCurveTo(rx - 7, ft - 20, rx - 8, ft - 8); ctx.closePath(); ctx.fill();
      /* 로켓 이름표: 2단은 오른쪽, 1단은 왼쪽 */
      K.line(ctx, { x: rx + 8, y: yb - s1h - 18 }, { x: rx + 22, y: yb - s1h - 22 }, "rgba(20,25,40,.75)", 1.2);
      K.pill(ctx, "2단·연료 (매번 새로)", rx + 26, yb - s1h - 17, { s: 11.5, c: "#e8ecff", box: box });
      K.line(ctx, { x: rx - 8, y: yb - 50 }, { x: rx - 32, y: yb - 54 }, "rgba(20,25,40,.75)", 1.2);
      K.pill(ctx, n > 1 ? "1단 ♻ " + n + "번째 비행" : "1단 · 새로 만든 것", rx - 36, yb - 50, { s: 11.5, a: "right", c: n > 1 ? "#5ff0c0" : "#ffb35c", box: box });
      /* ── 무인 회수선과 지난 발사의 1단 ── */
      if (n > 1) {
        I.box(ctx, 445, 100, SEA - 3, 525, 170, SEA + 5, "#5a606c", "#41464f", "#30343b");
        var dk = I.P(485, 135, SEA + 5);
        ctx.strokeStyle = "rgba(255,211,90,.9)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(dk.x, dk.y, 17, 9, 0, 0, 6.2832); ctx.stroke();
        I.label(ctx, 520, 160, SEA + 5, ph < 0.68 ? "무인 회수선 · 지난 1단이 내려앉는 중" : "무인 회수선 · 지난 1단 회수 완료", 34, 34, "#bff5dd", box);
        var t = ph, e = Math.min(1, t / 0.68), zb = SEA + 5 + 200 * Math.pow(1 - e, 2), q = I.P(485, 135, zb);
        if (t > 0.68) { ctx.fillStyle = "rgba(255,255,255," + (0.35 * (1 - (t - 0.68) / 0.32)).toFixed(2) + ")"; ctx.beginPath(); ctx.ellipse(dk.x, dk.y - 4, 26, 9, 0, 0, 6.2832); ctx.fill(); }
        ctx.save(); ctx.translate(q.x, q.y); booster(s1h, 0.6, e > 0.75, t < 0.68 ? 1 : 0); ctx.restore();

      } else {
        var t2 = ph, e2 = Math.min(1, t2 / 0.6), zf = SEA + 200 * (1 - e2 * e2), qf = I.P(430, 190, zf);
        if (t2 < 0.6) { ctx.save(); ctx.translate(qf.x, qf.y); ctx.rotate(0.3 + e2 * 1.1); booster(s1h, 0, false, 0); ctx.restore(); }
        else {
          var r = (t2 - 0.6) / 0.4, sp = I.P(430, 190, SEA);
          ctx.strokeStyle = "rgba(255,255,255," + (0.8 * (1 - r)).toFixed(2) + ")"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.ellipse(sp.x, sp.y, 10 + r * 34, 5 + r * 16, 0, 0, 6.2832); ctx.stroke();
          ctx.save(); ctx.beginPath(); ctx.rect(sp.x - 80, sp.y - 120, 160, 120); ctx.clip();
          ctx.translate(sp.x + 6, sp.y + 2 + r * 6); ctx.rotate(1.25); booster(s1h * 0.55, 0, false, 0); ctx.restore();
        }
        var sp2 = I.P(430, 190, SEA); K.line(ctx, { x: sp2.x + 4, y: sp2.y + 4 }, { x: sp2.x + 40, y: sp2.y + 36 }, "rgba(20,25,40,.75)", 1.2); K.pill(ctx, "지난 발사의 1단 · 바다에 떨어져 버려짐", sp2.x + 44, sp2.y + 44, { s: 11.5, c: "#ffb35c", box: box });
      }
      ctx.restore();
      /* ── 오른쪽: 발사 한 번 비용 블록 ── */
      var zR = 240 * ZC, zT = c0 * ZC, zG = 330 * ZC, zO = 600 * ZC, fl = J.P(28, 28, 0);
      ctx.fillStyle = "rgba(20,30,50,.18)"; ctx.beginPath(); ctx.ellipse(fl.x + 4, fl.y + 6, 50, 14, 0, 0, 6.2832); ctx.fill();
      J.box(ctx, 0, 0, 0, 56, 56, zR, "#7fa6f0", "#3d5fa8", "#2c4682");
      J.box(ctx, 0, 0, zR, 56, 56, zT, "#ffd08a", "#e08a32", "#a85c1c");
      if (n > 1) {
        ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = "rgba(60,70,95,.7)"; ctx.lineWidth = 1.2;
        var o1 = J.P(0, 56, zO), o2 = J.P(56, 56, zO), o3 = J.P(56, 0, zO), o4 = J.P(0, 0, zO);
        ctx.beginPath(); ctx.moveTo(o1.x, o1.y); ctx.lineTo(o2.x, o2.y); ctx.lineTo(o3.x, o3.y); ctx.lineTo(o4.x, o4.y); ctx.closePath();
        [[0, 56], [56, 56], [56, 0]].forEach(function (c) { var a2 = J.P(c[0], c[1], zT), b2 = J.P(c[0], c[1], zO); ctx.moveTo(a2.x, a2.y); ctx.lineTo(b2.x, b2.y); });
        ctx.stroke(); ctx.restore();
      }
      J.plane(ctx, zG, "rgba(255,211,107,.30)", "#e0a800", -14, 70, -14, 70);
      var labs = [
        { z: zT, t: "발사 한 번 " + Math.round(c0) + "억", c: c0 <= 330 ? "#5ff0c0" : "#ffb35c" },
        { z: zG, t: "목표 330억", c: "#ffd35a" },
        { z: (zR + zT) / 2, t: "1단 몫 " + Math.round(c0 - 240) + "억", c: "#ffcf9a" },
        { z: zR / 2, t: "나머지 240억", c: "#b9d0ff" }
      ];
      if (n > 1) labs.push({ z: zO, t: "처음 600억", c: "#c3c9da" });
      labs.forEach(function (l) { l.ay = J.P(0, 56, l.z).y; l.y = l.ay; });
      labs.sort(function (a3, b3) { return a3.y - b3.y; });
      for (i = 1; i < labs.length; i++) if (labs[i].y < labs[i - 1].y + 23) labs[i].y = labs[i - 1].y + 23;
      var ax = J.P(0, 56, 0).x;
      labs.forEach(function (l) {
        K.line(ctx, { x: 790, y: l.y - 4 }, { x: ax - 1, y: l.ay }, "rgba(20,25,40,.6)", 1);
        K.pill(ctx, l.t, 786, l.y, { s: 11.5, a: "right", c: l.c, box: box });
      });
      K.pill(ctx, "발사 한 번 비용 블록", fl.x, fl.y + 38, { s: 11, a: "center", c: "#e8ecff", box: box });
      /* ── 큰 제목·과장 표시 ── */
      var t1, t2b, c2 = "#ffd35a";
      if (n === 1) { t1 = "한 번 쓰고 바다에 버린다"; t2b = "발사 한 번 600억 원 · 1단은 매번 새로"; }
      else if (ok) { t1 = "330억 아래, 가장 적은 횟수"; t2b = "1단 " + n + "번 재사용 · 발사 한 번 " + Math.round(c0) + "억 원"; c2 = "#5ff0c0"; }
      else if (c0 <= 330) { t1 = "330억 아래로 내려왔다"; t2b = "1단 " + n + "번 · 더 적은 횟수로도 될까?"; c2 = "#5ff0c0"; }
      else { t1 = "다시 쓰지만 아직 비싸다"; t2b = "1단 " + n + "번 · 발사 한 번 " + Math.round(c0) + "억 원"; }
      K.bigText(ctx, t1, 22, 52, 27, "#ffffff");
      K.bigText(ctx, t2b, 22, 86, 17, c2);
      K.warn(ctx, 14, DH - 12, "⚠ 로켓·배·격납고 크기와 거리는 실제 비율이 아님");
    }
    function drawChart(c0) {
      var y0 = DH + 8, h = H - y0;
      K.stage(ctx, 0, y0, W, h, "lab", { seed: 14 });
      K.pill(ctx, "1단을 쓰는 횟수에 따른 발사 한 번 비용 (억 원)", 14, y0 + 24, { s: 12, c: KC.blue });
      var g = K.chart(ctx, { x: 4, y: y0 + 30, w: W - 12, h: h - 34, pt: 8, x0: 0, x1: 20, y0: 0, y1: 700, xt: 4, yt: 7, xl: "1단을 쓰는 횟수", xf: function () { return ""; }, yf: function (q) { return Math.round(q) + ""; } });
      var bwd = (g.R - g.L) / 20;
      for (var k = 1; k <= 20; k++) {
        var c = cost(k), on = k === n, x = g.L + (k - 1) * bwd + bwd * 0.16, tp = g.Y(c);
        var gr = ctx.createLinearGradient(0, tp, 0, g.B);
        if (on) { gr.addColorStop(0, c <= 330 ? "#5ff0c0" : "#ffb35c"); gr.addColorStop(1, c <= 330 ? "#1a7a5c" : "#8a4a1a"); } else { gr.addColorStop(0, "rgba(127,211,255,.55)"); gr.addColorStop(1, "rgba(60,110,200,.22)"); }
        ctx.save(); if (on) { ctx.shadowColor = c <= 330 ? KC.green : KC.orange; ctx.shadowBlur = 12; }
        ctx.fillStyle = gr; ctx.beginPath(); ctx.roundRect(x, tp, bwd * 0.68, g.B - tp, [4, 4, 0, 0]); ctx.fill(); ctx.restore();
        if (k === 1 || k % 5 === 0 || on) K.t(ctx, String(k), x + bwd * 0.34, g.B + 16, { s: 10.5, a: "center", c: on ? KC.ink : KC.mute, w: on ? "900" : "600" });
      }
      hline(ctx, g.L, g.R, g.Y(330), KC.yellow);
      K.pill(ctx, "목표 330억", g.L + 8, g.Y(330) + 20, { s: 10.5, c: KC.yellow });
      K.pill(ctx, Math.round(c0) + "억", g.L + (n - 0.5) * bwd, g.Y(c0) - 10, { a: "center", s: 11.5, c: c0 <= 330 ? KC.green : KC.orange, box: [0, W] });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var c0 = cost(n), ok = c0 <= 330 && cost(n - 1 > 0 ? n - 1 : 1) > 330 && n > 1;
      drawModel(c0, ok);
      drawChart(c0);
      return ok;
    }
    function update() {
      var ok = draw(), c0 = cost(n);
      readout("c-cost-read", [
        ["1단 몸", (360 / n + 36 * (n - 1) / n).toFixed(0) + "억", "y", "만드는 데 360억 ÷ " + n + "번 + 정비 36억 × " + (n - 1) + "번 ÷ " + n],
        ["나머지", "240억", "b", "2단·연료 등 매번 드는 비용"],
        ["발사 한 번", c0.toFixed(0) + "억 원", c0 <= 330 ? "g" : "r", "처음(600억)의 " + Math.round(c0 / 6) + "%"]
      ], ok ? ["g", "330억 아래로 내리는 가장 적은 횟수"] : (c0 <= 330 ? ["g", "330억 아래 · 더 적어도 됩니다"] : ["r", "아직 330억보다 비쌀"]));
      put("c-cost-info", "1단을 " + n + "번 쓰면 발사 한 번에 약 " + c0.toFixed(0) + "억 원이 듭니다. " + (ok ? "✅ 6번 쓰면 330억 원, 처음의 55%로 떨어집니다. 그 뒤로는 정비비 때문에 조금씩만 줍니다." : (c0 <= 330 ? "330억 원 아래지만 더 적은 횟수로도 됩니다." : "아직 330억 원보다 비쌉니다.")));
      if (ok && !got) { got = true; window.sthState("costGot", true); mission(); }
    }
    function mission() {
      if (got) {
        window.sthState("costBest", "1단 6번 재사용 → 발사 비용 600억 → 330억 원");
        window.sthMission("m3-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("costBest") + ". ‘비싸다’는 주장에도 계산한 근거로 답할 수 있습니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    playBtn("c-cost-play", function () { return playing; }, function (q) { playing = q; draw(); }, "⏸ 회수 장면 멈추기", "▶ 1단 회수 장면 보기");
    K.animate(canvas, function (dt) { if (playing) { ph = (ph + dt / 1000 / 4.2) % 1; draw(); } }, 24);
    $("c-n").addEventListener("input", function (e) { n = +e.target.value; $("c-n-val").textContent = n + "번"; update(); });
    update(); mission();
  })();

  /* 장면 4 — 근거 분류 */
  window.sthSort({
    mount: "c-sort",
    buckets: [{ id: "tech", label: "🔧 기술 파급 효과" }, { id: "cost", label: "💰 비용과 실효성" }, { id: "coop", label: "🤝 국제 협력" }, { id: "env", label: "🌍 환경과 윤리" }],
    items: [
      { t: "위성 항법(GPS)이 스마트폰 지도와 택배 배송에 쓰인다", a: "tech", why: "우주 기술이 생활로 퍼졌습니다." },
      { t: "우주복을 위해 개발한 소재가 소방복과 의료 기기에 쓰인다", a: "tech", why: "다른 산업으로 기술이 파급되었습니다." },
      { t: "재사용 로켓이 발사 한 번의 비용을 크게 낮췄다", a: "cost", why: "같은 목적을 더 적은 비용으로 이룹니다." },
      { t: "국제 우주 정거장의 유지비가 해마다 수조 원에 이른다", a: "cost", why: "비용 대비 효과를 따지는 근거입니다." },
      { t: "여러 나라가 국제 우주 정거장을 함께 짓고 운영한다", a: "coop", why: "대표적인 국제 협력 사례입니다." },
      { t: "여러 나라 우주 기관이 달 탐사 계획에 함께 참여하고 자료를 공유한다", a: "coop", why: "협력으로 비용과 위험을 나눕니다.", hint: "누가 함께하나요?" },
      { t: "수많은 위성 조각이 우주 쓰레기가 되어 충돌 위험을 높인다", a: "env", why: "우주 환경 문제입니다." },
      { t: "밤하늘을 가로지르는 수많은 위성이 천체 관측을 방해한다", a: "env", why: "과학 연구와 밤하늘이라는 공공의 가치를 해칩니다." }
    ],
    onDone: function () { window.sthMission("m3-4", true, "<span class='m-tag'>미션 완료</span>네 관점의 근거가 모두 갖춰졌습니다. 찬성이든 반대든 이제 근거로 토론할 수 있습니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m3-4", true);

  function finish() { window.sthState("r3", "완성 · " + (window.sthState("tlBest") || "") + " / " + (window.sthState("costBest") || "")); }
  function vs() {
    $("e3-vs").innerHTML = "<b>나의 첫 판단</b> " + (window.sthState("space2") || "기록 없음") + "<br><b>관점별 평가</b> " + (window.sthState("tlBest") || "-") + "<br><b>재사용 로켓</b> " + (window.sthState("costBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk3", unitLabel: "[과학탐구실험2 Ⅱ-2] 이야기 ③ 우주 개발 토론회",
    items: [
      { id: "e3a", label: "나의 토론 주장", hint: "‘우주 개발에 많은 돈을 쓰는 것은 가치 있는 일인가?’에 대한 내 주장을 두 가지 이상의 관점에서 근거를 들어 쓰세요." },
      { id: "e3b", label: "앞으로의 발전 방향", hint: "우주 개발이 앞으로 어떤 방향으로 나아가야 한다고 생각하는지, 우주 쓰레기 같은 문제를 고려해 쓰세요." }
    ]
  });
})();

/* ========================================================================= 06 정리하기 */
window.sthWork({
  mount: "wk", unitLabel: "[과학탐구실험2 Ⅱ-2] 미래 사회와 첨단 과학 탐구 — 정리",
  recap: [
    { key: "r1", label: "① 겨울 딸기 온실" },
    { key: "r2", label: "② 숨 막히는 5교시" },
    { key: "r3", label: "③ 우주 개발 토론회" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  items: [
    { id: "all", label: "세 탐구를 꿰는 한 문장", hint: "온실, 환기 알림, 우주 개발. 세 이야기를 ‘첨단 과학 기술’과 ‘책임’이라는 말을 넣어 한 문장으로 이어 보세요." },
    { id: "w3", label: "아직 헷갈리는 것", hint: "다음 시간에 여기서부터 시작합니다." }
  ]
});

/* ========================================================================= 07 우리 반 */
window.sthShare({
  mount: "share", unit: "gt2-2-4", unitLabel: "[과학탐구실험2 Ⅱ-2] 미래 사회와 첨단 과학 탐구",
  rows: [
    { key: "r1", label: "① 겨울 딸기 온실" },
    { key: "r2", label: "② 숨 막히는 5교시" },
    { key: "r3", label: "③ 우주 개발 토론회" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "세 탐구를 꿰는 한 문장" }
});

})();
