/* 과학탐구실험2 Ⅰ-2 생활 속의 과학 탐구 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";
/* ---- 밝은 스튜디오 + 입체 미니어처 (../assets/kit.js 의 K.studio · K.card) ---- */
var K = window.sthKit, LT = K.LT;
function lt(ctx, s, x, y, o) { o = o || {}; K.t(ctx, s, x, y, { s: o.s || 12, w: o.w || "700", a: o.a, c: o.c || LT.ink }); }
function sideCard(ctx, x, W, H, title) { K.card(ctx, x, 0, W - x, H, title); return { px: x + 18, R: W - 18, w: W - x - 36 }; }
function tag(ctx, s, x, y, c, a, box) { return K.pill(ctx, s, x, y, { s: 11.5, a: a, c: c || LT.ink, bg: "rgba(255,255,255,.92)", line: "rgba(20,40,90,.18)", box: box }); }
function floorSh(ctx, x, y, rx, ry, a) {
  var g = ctx.createRadialGradient(x, y, 2, x, y, rx);
  g.addColorStop(0, "rgba(20,30,50," + (a || .28) + ")"); g.addColorStop(.6, "rgba(20,30,50,.07)"); g.addColorStop(1, "rgba(20,30,50,0)");
  ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx); ctx.translate(-x, -y); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rx, 0, 6.2832); ctx.fill(); ctx.restore();
}
function metalG(ctx, x0, y0, x1, y1) { var g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, "#f6f8fb"); g.addColorStop(.5, "#aab3c3"); g.addColorStop(1, "#5b6476"); return g; }
/* 앞에서 비스듬히 내려다본 판: 윗면 + 앞면 + 오른쪽 옆면 (x, y = 앞면 왼쪽 위) */
function slab(ctx, x, y, w, h, d, cTop, cFront, cSide) {
  ctx.fillStyle = cTop; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + d, y - d * .55); ctx.lineTo(x + w + d, y - d * .55); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fill();
  if (cSide) { ctx.fillStyle = cSide; ctx.beginPath(); ctx.moveTo(x + w, y); ctx.lineTo(x + w + d, y - d * .55); ctx.lineTo(x + w + d, y + h - d * .55); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = cFront; ctx.fillRect(x, y, w, h);
}
/* 비스듬한 상자: 앞면 x..x+w, 바닥 y, 높이 h, 깊이 d */
function box3(ctx, x, y, w, h, d, col, front) {
  if (h < .5) return;
  ctx.fillStyle = K.tint(col, 1.18); ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x + d, y - h - d * .55); ctx.lineTo(x + w + d, y - h - d * .55); ctx.lineTo(x + w, y - h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = K.tint(col, .72); ctx.beginPath(); ctx.moveTo(x + w, y - h); ctx.lineTo(x + w + d, y - h - d * .55); ctx.lineTo(x + w + d, y - d * .55); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fill();
  var g = ctx.createLinearGradient(0, y - h, 0, y); g.addColorStop(0, K.tint(col, 1.02)); g.addColorStop(1, K.tint(col, .85)); ctx.fillStyle = front || g; ctx.fillRect(x, y - h, w, h);
}
function wheel(ctx, x, y, r) { K.planet(ctx, x, y, r, "#6b7484", "#1f232b"); ctx.fillStyle = "#c9d0da"; ctx.beginPath(); ctx.arc(x, y, r * .38, 0, 6.2832); ctx.fill(); }
/* 카드 안 가로 막대 + 기준 눈금 */
function gauge(ctx, x, y, w, f, col, mark) { K.bar(ctx, x, y, w, f, col); if (mark != null) { ctx.fillStyle = LT.ink; ctx.fillRect(x + w * Math.max(0, Math.min(1, mark)) - 1, y - 4, 2, 18); } }

/* 카드 안 막대 + 합격 구간(초록 띠) */
function band(ctx, x, y, w, f, lo, hi, good) {
  ctx.fillStyle = "#e3e9f1"; ctx.beginPath(); ctx.roundRect(x, y, w, 12, 6); ctx.fill();
  ctx.fillStyle = "rgba(15,159,118,.22)"; ctx.fillRect(x + w * lo, y - 3, w * (hi - lo), 18);
  ctx.fillStyle = good ? LT.green : LT.red; ctx.beginPath(); ctx.roundRect(x, y, Math.max(6, w * Math.max(0, Math.min(1, f))), 12, 6); ctx.fill();
}

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 온천 달걀 */
  {
    id: "c1", about: "01", tag: "요리 속 과학 · 단백질이 굳는 온도", title: "흰자는 몽글, 노른자는 촉촉한 달걀", short: "온천 달걀",
    who: "🥚", name: "학교 급식실 조리사",
    say: "“끓는 물에 삶으면 흰자는 고무처럼 질기고 노른자는 퍽퍽해져요. 흰자와 노른자의 단백질은 굳기 시작하는 온도가 달라서, 물의 온도와 시간을 잘 맞추면 흰자는 부드럽게 몽글, 노른자는 촉촉한 ‘온천 달걀’이 된대요. 물 온도와 담가 두는 시간을 정해 주세요.”",
    predict: {
      q: "달걀을 100 °C 대신 64 °C 물에 오래 담가 두면 어떻게 될까요?",
      options: ["㉠ 전혀 익지 않는다", "㉡ 굳는 온도가 낮은 단백질만 천천히 굳어, 끓인 달걀과 다른 식감이 된다", "㉢ 끓인 달걀과 똑같아진다"],
      answer: 1
    },
    task: "물 온도와 시간을 정해 <b>흰자는 부드럽게 익고 노른자는 촉촉한</b> 달걀을 만드세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, T = 80, tm = 20;
      function white() { var k = Math.min(1, tm / (40 * Math.pow(0.8, Math.max(0, T - 63) / 3))); return T < 60 ? 0 : (T < 63 ? 0.35 * k : (T < 70 ? 0.7 * k : Math.min(1, 0.7 + (T - 70) * 0.03) * k)); }
      function yolk() { var k = Math.min(1, tm / (45 * Math.pow(0.8, Math.max(0, T - 62) / 3))); return T < 62 ? 0 : (T < 67 ? 0.5 * k : Math.min(1, 0.5 + (T - 67) * 0.1) * k); }
      function wN(w) { return w < 0.3 ? "날것처럼 흐름" : (w < 0.6 ? "살짝 엉김" : (w < 0.85 ? "부드럽게 몽글" : "단단하고 질김")); }
      function yN(y) { return y < 0.2 ? "날것" : (y < 0.6 ? "촉촉한 크림 같음" : (y < 0.9 ? "꾸덕함" : "퍽퍽하게 굳음")); }
      function draw() {
        /* 입체 미니어처: 스튜디오 위 금속 냄비(앞을 잘라 물속이 보임)에 달걀과 온도계, 오른쪽 흰 접시에 깨 본 달걀(흰자 투명도·노른자 색 = 익은 정도) */
        var CH = cv.H, LW = 560, w = white(), y = yolk(), ok = w >= 0.6 && w < 0.85 && y >= 0.2 && y < 0.6, i;
        ctx.clearRect(0, 0, W, CH);
        K.studio(ctx, 0, 0, LW, CH, null);
        var cx = 170, top = 132, bot = 262, rx = 96, ry = 22, hq = (T - 55) / 35;
        floorSh(ctx, cx + 10, bot + 18, 150, 18, .32);
        ctx.fillStyle = metalG(ctx, cx - rx, 0, cx + rx, 0); ctx.beginPath(); ctx.moveTo(cx - rx, top); ctx.lineTo(cx - rx, bot); ctx.ellipse(cx, bot, rx, ry, 0, Math.PI, 0, true); ctx.lineTo(cx + rx, top); ctx.closePath(); ctx.fill();
        ctx.save(); ctx.beginPath(); ctx.moveTo(cx - rx + 10, top + 34); ctx.lineTo(cx - rx + 10, bot - 6); ctx.ellipse(cx, bot - 6, rx - 10, ry - 6, 0, Math.PI, 0, true); ctx.lineTo(cx + rx - 10, top + 34); ctx.closePath(); ctx.clip();
        var wg = ctx.createLinearGradient(0, top + 30, 0, bot); wg.addColorStop(0, "rgb(" + Math.round(140 + 40 * hq) + ",205,245)"); wg.addColorStop(1, "rgb(" + Math.round(50 + 40 * hq) + ",130,210)");
        ctx.fillStyle = wg; ctx.fillRect(cx - rx, top + 20, 2 * rx, bot - top + 20);
        var eg = ctx.createRadialGradient(cx - 18, 192, 4, cx, 206, 40); eg.addColorStop(0, "#fffaf0"); eg.addColorStop(1, "#d9c3a0");
        ctx.fillStyle = eg; ctx.beginPath(); ctx.ellipse(cx, 210, 30, 38, 0.3, 0, 6.2832); ctx.fill();
        if (T >= 80) for (i = 0; i < 8; i++) K.planet(ctx, cx - 70 + i * 19, 240 - (i % 3) * 20, 2.4, "#e7f5ff", "#74c0fc");
        ctx.restore();
        ctx.strokeStyle = "rgba(60,80,110,.7)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - rx + 10, top + 34); ctx.lineTo(cx - rx + 10, bot - 6); ctx.moveTo(cx + rx - 10, top + 34); ctx.lineTo(cx + rx - 10, bot - 6); ctx.stroke();
        ctx.fillStyle = "#e9edf3"; ctx.beginPath(); ctx.ellipse(cx, top, rx, ry, 0, 0, 6.2832); ctx.fill();
        ctx.fillStyle = "rgba(100,160,220,.75)"; ctx.beginPath(); ctx.ellipse(cx, top + 4, rx - 8, ry - 6, 0, 0, 6.2832); ctx.fill();
        ctx.fillStyle = "#5b6476"; ctx.fillRect(cx + rx - 2, top + 6, 54, 9);
        if (T >= 75) { ctx.strokeStyle = "rgba(140,160,190,.55)"; ctx.lineWidth = 3; for (i = 0; i < 3; i++) { var sx = cx - 40 + i * 40; ctx.beginPath(); ctx.moveTo(sx, top - 8); ctx.bezierCurveTo(sx - 12, top - 30, sx + 12, top - 44, sx, top - 66); ctx.stroke(); } }
        ctx.fillStyle = "#f8f9fb"; ctx.fillRect(cx + 54, top - 40, 10, 130); ctx.strokeStyle = "rgba(60,80,110,.6)"; ctx.lineWidth = 1; ctx.strokeRect(cx + 54, top - 40, 10, 130);
        var th = 120 * (T - 40) / 60; ctx.fillStyle = LT.red; ctx.fillRect(cx + 57, top + 88 - th, 4, th); K.planet(ctx, cx + 59, top + 92, 7, "#ff8787", "#c92a2a");
        tag(ctx, T + " °C", cx + 72, top - 24, LT.red, "left", [0, LW]);
        var px = 432, py = 236;
        floorSh(ctx, px + 8, py + 18, 130, 16, .3);
        var pl = ctx.createLinearGradient(0, py - 14, 0, py + 18); pl.addColorStop(0, "#ffffff"); pl.addColorStop(1, "#c9d1dd");
        ctx.fillStyle = pl; ctx.beginPath(); ctx.ellipse(px, py, 112, 30, 0, 0, 6.2832); ctx.fill();
        ctx.fillStyle = "#eef2f7"; ctx.beginPath(); ctx.ellipse(px, py - 3, 88, 21, 0, 0, 6.2832); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255," + (0.35 + 0.6 * w).toFixed(2) + ")"; ctx.strokeStyle = "rgba(120,140,170,.5)"; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.ellipse(px, py - 8, 74, 20, 0, 0, 6.2832); ctx.fill(); ctx.stroke();
        if (w < 0.3) { ctx.fillStyle = "rgba(220,235,245,.55)"; ctx.beginPath(); ctx.ellipse(px - 30, py - 4, 56, 14, 0, 0, 6.2832); ctx.fill(); }
        K.planet(ctx, px + 6, py - 16, 22, "rgb(" + Math.round(250 - 10 * y) + "," + Math.round(180 + 30 * y) + "," + Math.round(20 + 60 * y) + ")", "rgb(" + Math.round(200 - 10 * y) + "," + Math.round(120 + 30 * y) + "," + Math.round(10 + 40 * y) + ")");
        tag(ctx, "깨 본 달걀", px, py + 50, LT.ink, "center", [0, LW]);
        K.bigText(ctx, "물 " + T + " °C · " + tm + "분", 16, 40, 24, ok ? "#8ff0c4" : "#ffffff");
        K.bigText(ctx, ok ? "온천 달걀 완성" : "흰자 " + wN(w) + " · 노른자 " + yN(y), 16, 64, 14, "#ffd35a");
        var cd = sideCard(ctx, LW + 10, W, CH, "익은 정도 판정");
        K.row(ctx, "흰자", wN(w), cd.px, cd.R, 64, w >= 0.6 && w < 0.85 ? LT.green : LT.red);
        band(ctx, cd.px, 76, cd.w, w, 0.6, 0.85, w >= 0.6 && w < 0.85);
        K.row(ctx, "노른자", yN(y), cd.px, cd.R, 126, y >= 0.2 && y < 0.6 ? LT.green : LT.red);
        band(ctx, cd.px, 138, cd.w, y, 0.2, 0.6, y >= 0.2 && y < 0.6);
        lt(ctx, "초록 띠 = 온천 달걀 구간", cd.px, 176, { s: 10.5, w: "800", c: LT.green });
        K.tip(ctx, ok ? "온천 달걀 완성!" : "아직 아님", cd.px - 4, 192, cd.w + 8, ok ? true : null);
        lt(ctx, "단백질마다 굳는 온도가 다릅니다.", cd.px, 254, { s: 11, w: "600", c: LT.mute });
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "물 온도", min: 55, max: 90, step: 1, value: 80, fmt: function (x) { return x + " °C"; }, onInput: function (x) { T = x; draw(); } });
      api.slider({ label: "담가 두는 시간", min: 10, max: 60, step: 10, value: 20, fmt: function (x) { return x + "분"; }, onInput: function (x) { tm = x; draw(); } });
      api.info("단백질은 열을 받으면 구조가 풀리며(변성) 서로 엉겨 굳습니다. 흰자에서 가장 먼저 굳는 단백질(오보트랜스페린)은 약 62 °C, 흰자의 대부분인 오브알부민은 약 80 °C, 노른자는 약 63~65 °C부터 천천히 굳기 시작해 70 °C를 넘으면 빠르게 굳습니다. 온도가 높을수록 빨리 굳습니다.");
      draw();
      return {
        judge: function () {
          var w = white(), y = yolk();
          if (w >= 0.6 && w < 0.85 && y >= 0.2 && y < 0.6) return { ok: true, msg: T + " °C에서 " + tm + "분 — 흰자는 부드럽게, 노른자는 촉촉하게 익었습니다. 단백질마다 굳는 온도가 다른 것을 이용했습니다." };
          if (w >= 0.85 || y >= 0.6) return { ok: false, msg: "흰자 " + wN(w) + ", 노른자 " + yN(y) + ". 온도가 너무 높습니다." };
          return { ok: false, msg: "흰자 " + wN(w) + ", 노른자 " + yN(y) + ". 온도가 낮거나 시간이 짧아요." };
        }
      };
    },
    hints: [
      "끓는 물은 너무 뜨겁습니다. 흰자가 굳기 시작하는 63 °C 근처로 낮춰 보세요.",
      "63~67 °C에서 40분 이상 두어 보세요."
    ],
    solution: "물 온도 <b>63~67 °C</b>, 시간 <b>40~60분</b> (65 °C 이상이면 30분부터).",
    why: "달걀의 단백질은 종류마다 굳는(변성) 온도가 다릅니다. 100 °C 물은 모든 단백질을 빠르게 굳혀 질기고 퍽퍽하지만, 63~67 °C에서 오래 두면 일부 단백질만 천천히 굳어 전혀 다른 식감이 됩니다.<br>" +
      "일정한 낮은 온도의 물로 천천히 익히는 수비드 요리도 같은 원리입니다. 요리는 온도와 시간을 조절하는 과학 실험입니다. ※ 굳는 정도는 수업용 모형입니다."
  },

  /* ------------------------------------------------------------------ 2. 동조 질량 댐퍼 */
  {
    id: "c2", about: "03", tag: "건축 속 과학 · 흔들림에 박자 맞추기", title: "초고층 빌딩 꼭대기의 거대한 추", short: "동조 질량 댐퍼",
    who: "🏙️", name: "초고층 빌딩 설계팀",
    say: "“높이 500 m의 빌딩은 강한 바람에 약 <b>7 초</b>마다 한 번씩 좌우로 흔들립니다. 꼭대기에 커다란 추를 줄에 매달아, 건물이 흔들릴 때 추가 <b>같은 박자로 반대 방향</b>으로 움직이게 하면 흔들림이 줄어요. 추를 매단 줄의 길이를 정해, 건물의 흔들림을 <b>절반 이하</b>로 줄여 주세요.”",
    predict: {
      q: "추가 가장 효과적으로 흔들림을 줄이려면 추의 흔들리는 주기는?",
      options: ["㉠ 건물의 흔들림 주기보다 훨씬 짧아야 한다", "㉡ 건물의 흔들림 주기와 같아야 한다", "㉢ 상관없다"],
      answer: 1
    },
    task: "추를 매단 줄의 길이를 정해 <b>건물 꼭대기의 흔들림을 원래의 50% 이하</b>로 줄이세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(320), ctx = cv.ctx, W = cv.W, L = 4;
      function Td() { return 2 * Math.PI * Math.sqrt(L / 9.8); }
      function red() { var q = Td() / 7; return Math.min(1, 0.3 + 3.5 * Math.abs(1 - q)); }
      function draw() {
        /* 입체 미니어처: 스튜디오 바닥판 위 초고층 빌딩(위층을 잘라 내 금빛 추가 보임). 바람에 기울어지는 만큼 = 흔들림, 추는 반대쪽으로 흔들린다. */
        var CH = cv.H, LW = 560, rr = red(), sway = 46 * rr, t = Td(), ok = rr <= 0.5, i;
        ctx.clearRect(0, 0, W, CH);
        K.studio(ctx, 0, 0, LW, CH, null);
        var bx = 250, gy = 292, top = 40, bw = 84, d = 40;
        floorSh(ctx, bx + 30, gy + 10, 200, 18, .3);
        box3(ctx, 70, gy + 10, 380, 12, 40, "#c6ccd6");
        function Fx(f) { return sway * f * f; }
        ctx.fillStyle = "#9aa6b8"; ctx.beginPath();
      for (i = 0; i <= 20; i++) { var fa = i / 20; ctx.lineTo(bx + bw / 2 + Fx(fa), gy - (gy - top) * fa); }
      for (i = 20; i >= 0; i--) { var fb = i / 20; ctx.lineTo(bx + bw / 2 + d + Fx(fb), gy - (gy - top) * fb - d * .55); }
      ctx.closePath(); ctx.fill();
        var fg = ctx.createLinearGradient(bx - bw / 2, 0, bx + bw / 2, 0); fg.addColorStop(0, "#dfe6ef"); fg.addColorStop(1, "#b8c3d2");
        ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(bx - bw / 2, gy); ctx.lineTo(bx + bw / 2, gy);
        for (i = 20; i >= 0; i--) { var f = i / 20; ctx.lineTo(bx + bw / 2 + Fx(f), gy - (gy - top) * f); }
        for (i = 0; i <= 20; i++) { var f2 = i / 20; ctx.lineTo(bx - bw / 2 + Fx(f2), gy - (gy - top) * f2); }
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(60,90,140,.35)"; ctx.lineWidth = 1;
        for (i = 1; i < 22; i++) { var f3 = i / 22, yy = gy - (gy - top) * f3; if (yy < top + 80) continue; ctx.beginPath(); ctx.moveTo(bx - bw / 2 + Fx(f3), yy); ctx.lineTo(bx + bw / 2 + Fx(f3), yy); ctx.stroke(); }
        ctx.fillStyle = "#c5cede"; ctx.beginPath(); ctx.moveTo(bx - bw / 2 + sway, top); ctx.lineTo(bx + bw / 2 + sway, top); ctx.lineTo(bx + bw / 2 + d + sway, top - d * .55); ctx.lineTo(bx - bw / 2 + d + sway, top - d * .55); ctx.closePath(); ctx.fill();
        var wy0 = top + 8, wy1 = top + 76, s0 = Fx(1 - 8 / (gy - top)), s1 = Fx(1 - 76 / (gy - top));
        ctx.fillStyle = "#2b3242"; ctx.beginPath(); ctx.moveTo(bx - bw / 2 + 6 + s0, wy0); ctx.lineTo(bx + bw / 2 - 6 + s0, wy0); ctx.lineTo(bx + bw / 2 - 6 + s1, wy1); ctx.lineTo(bx - bw / 2 + 6 + s1, wy1); ctx.closePath(); ctx.fill();
        var px = bx + s0, py = wy0 + 4, len = Math.min(60, 10 + L * 2.6), bxx = px - sway * 0.9 * (len / 60), byy = py + len;
        ctx.strokeStyle = "#e9ecef"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(bxx, byy - 8); ctx.stroke();
        K.planet(ctx, bxx, byy - 2, 10, "#ffd43b", "#a26b00");
        K.arrow(ctx, { x: 30, y: 120 }, { x: 120, y: 120 }, LT.blue, 3, 11);
        K.arrow(ctx, { x: 40, y: 160 }, { x: 130, y: 160 }, LT.blue, 3, 11);
        tag(ctx, "바람 · 7초마다 흔들림", 30, 100, LT.blue, "left", [0, LW]);
        tag(ctx, "금빛 추 (줄 " + L.toFixed(1) + " m)", bx + bw / 2 + d + sway + 12, top + 30, "#a26b00", "left", [0, LW]);
        K.bigText(ctx, "흔들림 " + Math.round(rr * 100) + "%", 16, 40, 24, ok ? "#8ff0c4" : "#ffffff");
        K.bigText(ctx, "추 " + t.toFixed(2) + "초 · 건물 7초", 16, 64, 14, "#ffd35a");
        K.warn(ctx, LW - 12, CH - 10, "⚠ 기울기·추 크기는 보기 쉽게 과장", "right");
        var cd = sideCard(ctx, LW + 10, W, CH, "동조 질량 댐퍼 판정");
        K.row(ctx, "추의 흔들림 주기", t.toFixed(2) + " 초", cd.px, cd.R, 62, LT.orange);
        K.row(ctx, "건물의 흔들림 주기", "7.00 초", cd.px, cd.R, 90, LT.blue);
        lt(ctx, Math.round(rr * 100) + "%", cd.px, 140, { s: 26, w: "900", c: ok ? LT.green : LT.red });
        lt(ctx, "꼭대기 흔들림 (추 없을 때 100%)", cd.R, 140, { s: 10.5, a: "right", c: LT.mute });
        gauge(ctx, cd.px, 154, cd.w, rr, ok ? LT.green : LT.red, 0.5);
        lt(ctx, "50%", cd.px + cd.w * .5, 184, { s: 10.5, a: "center", w: "800", c: LT.yellow });
        K.tip(ctx, ok ? "박자가 맞아 흔들림이 줄었습니다" : "추와 건물의 박자를 맞춰 보세요", cd.px - 4, 200, cd.w + 8, ok ? true : null);
        lt(ctx, "진자 주기 = 2π√(줄 길이 ÷ 9.8)", cd.px, 262, { s: 12, w: "900", c: LT.violet });
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "추를 매단 줄의 길이", min: 2, max: 20, step: 0.5, value: 4, fmt: function (x) { return x.toFixed(1) + " m"; }, onInput: function (x) { L = x; draw(); } });
      api.info("줄에 매단 추(진자)의 주기 = 2π√(줄 길이 ÷ 9.8). 무게와는 상관없고 줄 길이로 정해집니다.");
      draw();
      return {
        judge: function () {
          var rr = red(), t = Td();
          if (rr <= 0.5) return { ok: true, msg: "줄 " + L.toFixed(1) + " m → 추의 주기 " + t.toFixed(2) + " 초. 건물과 박자가 맞아 흔들림이 " + Math.round(rr * 100) + "%로 줄었습니다." };
          return { ok: false, msg: "추의 주기 " + t.toFixed(2) + " 초 — 건물(7 초)과 박자가 " + (t < 7 ? "빠릅니다" : "느립니다") + ". 흔들림이 " + Math.round(rr * 100) + "%로 아직 큽니다." };
        }
      };
    },
    hints: [
      "추의 주기가 7 초가 되는 줄 길이를 계산해 보세요.",
      "9.8 × (7 ÷ 6.28)² ≈ 12 m입니다."
    ],
    solution: "줄 길이 <b>11~13.5 m</b> (약 12 m).",
    why: "공진은 해로울 때도 있지만, 이렇게 거꾸로 이용할 수도 있습니다. 건물과 같은 박자로 흔들리도록 맞춘(동조) 추는 건물이 한쪽으로 기울 때 반대쪽으로 움직여 흔들림 에너지를 빼앗아 갑니다. 대만의 타이베이 101 빌딩에는 무게 660 톤의 추가 매달려 있습니다.<br>" +
      "이것이 <b>제진</b> 기술의 한 예입니다. 원리를 알면 문제를 일으킨 현상으로 문제를 해결하는 장치를 고안할 수 있습니다. ※ 감소율은 수업용 모형입니다."
  },

  /* ------------------------------------------------------------------ 3. 표본 크기와 유사과학 */
  {
    id: "c3", about: "04", tag: "유사과학 비평 · 표본이 작으면 우연도 규칙처럼", title: "혈액형 설문, 몇 명에게 물어야 할까", short: "표본 크기",
    who: "📋", name: "학급 신문 기자",
    say: "“반 친구 20명에게 설문했더니 A형 친구가 ‘나는 소심한 편이다’에 다른 혈액형보다 12%p나 더 많이 답했어요. 기사 제목을 ‘혈액형 성격설, 사실로 확인’으로 할까요? 조사 인원을 늘려 보고, 차이가 우연인지 판단할 수 있을 만큼 조사한 뒤(<b>오차 범위 ± 5%p 이하</b>) 알맞은 결론을 골라 주세요.”",
    predict: {
      q: "20명만 조사해서 12%p 차이가 났다면?",
      options: ["㉠ 혈액형과 성격이 관련 있다는 확실한 증거다", "㉡ 사람 수가 적어 우연히 생긴 차이일 수 있으니, 더 많이 조사해야 한다", "㉢ 20명이면 충분하다"],
      answer: 1
    },
    task: "조사 인원과 결론을 정하세요. <b>오차 범위 ± 5%p 이하</b>로 조사하고, 자료에 맞는 결론을 골라야 합니다.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W;
      var NS = [20, 50, 100, 200, 500, 1000, 2000], DF = [12, 7, -4, 3, 1.5, 0.8, -0.5], i = 0, con = "yes";
      function moe(n) { return 138.6 / Math.sqrt(n); }
      function draw() {
        /* 입체 미니어처: 바닥판 위에 조사한 사람 수만큼 선 작은 사람들(한 명 = 조사 인원/표시 인원) + 밝은 수직선 위 '차이 ± 오차 범위' 띠, 판정 카드 */
        var CH = cv.H, LW = 600, n = NS[i], d = DF[i], m = moe(n), zeroIn = d - m <= 0 && d + m >= 0, k;
        ctx.clearRect(0, 0, W, CH);
        K.studio(ctx, 0, 0, LW, CH, null);
        floorSh(ctx, 140, 280, 140, 16, .3);
        slab(ctx, 22, 262, 196, 12, 54, "#e9edf3", "#c3cad6", "#a7afbd");
        var show = Math.min(120, n), per = n / show, cols = 15, sp = 196 / cols;
        for (k = show - 1; k >= 0; k--) {
          var r = Math.floor(k / cols), c = k % cols, dep = (r % 8) / 8;
          var x = 30 + c * sp + dep * 50, y = 258 - dep * 28 - Math.floor(r / 8) * 0;
          if (r >= 8) continue;
          var col = ["#e03131", "#1c7ed6", "#0f9f76", "#f59f00"][(k * 7) % 4];
          ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.beginPath(); ctx.ellipse(x + 1.5, y, 4, 1.4, 0, 0, 6.2832); ctx.fill();
          ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x - 2.6, y - 11, 5.2, 9, 2); ctx.fill();
          ctx.fillStyle = "#f1c7a5"; ctx.beginPath(); ctx.arc(x, y - 13.5, 2.6, 0, 6.2832); ctx.fill();
        }
        tag(ctx, n + "명 조사" + (per > 1.01 ? " (한 명 = " + Math.round(per) + "명)" : ""), 132, 296, LT.ink, "center", [0, 280]);
        var x0 = 290, x1 = 584, ly = 220;
        function X(p) { return x0 + (p + 40) / 80 * (x1 - x0); }
        ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.beginPath(); ctx.roundRect(x0 - 14, 96, x1 - x0 + 28, 156, 12); ctx.fill();
        ctx.strokeStyle = LT.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, ly); ctx.lineTo(x1, ly); ctx.stroke();
        [-40, -20, 0, 20, 40].forEach(function (p) { ctx.fillStyle = LT.line; ctx.fillRect(X(p) - 1, ly - 5, 2, 10); lt(ctx, (p > 0 ? "+" : "") + p + "%p", X(p), ly + 22, { s: 10, a: "center", w: "600", c: LT.mute }); });
        K.line(ctx, { x: X(0), y: 152 }, { x: X(0), y: ly }, "rgba(20,40,90,.45)", 1.5, [4, 4]);
        lt(ctx, "차이 없음 (0)", X(0), 148, { s: 10.5, a: "center", w: "800", c: LT.mute });
        var L0 = Math.max(x0, X(d - m)), R0 = Math.min(x1, X(d + m));
        ctx.fillStyle = m <= 5 ? "rgba(15,159,118,.35)" : "rgba(245,159,0,.35)"; ctx.beginPath(); ctx.roundRect(L0, ly - 52, R0 - L0, 22, 8); ctx.fill();
        ctx.strokeStyle = m <= 5 ? LT.green : LT.yellow; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(X(d), ly - 41, 7, 0, 6.2832); ctx.fill(); ctx.fillStyle = LT.blue; ctx.beginPath(); ctx.arc(X(d), ly - 41, 5, 0, 6.2832); ctx.fill();
        lt(ctx, "‘소심하다’ 응답 차이 (A형 − 다른 혈액형)", x0 - 6, 120, { s: 11, w: "800", c: LT.ink });
        K.bigText(ctx, "차이 " + (d > 0 ? "+" : "") + d + "%p ± " + m.toFixed(1), 16, 40, 23, m <= 5 ? "#8ff0c4" : "#ffffff");
        K.bigText(ctx, "조사 인원 " + n + "명", 16, 64, 14, "#ffd35a");
        var CN = { yes: "관련이 있다", no: "관련이 있다고 볼 수 없다", wait: "아직 판단할 수 없다" };
        var cd = sideCard(ctx, LW + 10, W, CH, "기사 결론 점검");
        lt(ctx, "± " + m.toFixed(1) + "%p", cd.px, 66, { s: 24, w: "900", c: m <= 5 ? LT.green : LT.red });
        lt(ctx, "오차 범위", cd.R, 66, { s: 11, a: "right", c: LT.mute });
        K.row(ctx, "목표", "± 5%p 이하", cd.px, cd.R, 100, LT.green);
        K.row(ctx, "범위 안에 0이 있나", zeroIn ? "있다" : "없다", cd.px, cd.R, 128, zeroIn ? LT.orange : LT.blue);
        K.row(ctx, "고른 결론", CN[con] || "", cd.px, cd.R, 156, LT.violet);
        K.tip(ctx, m > 5 ? "사람이 적어 우연일 수 있습니다" : (zeroIn ? "차이가 우연의 범위 안입니다" : "차이가 범위 밖입니다"), cd.px - 4, 176, cd.w + 8, m > 5 ? false : null);
        lt(ctx, "사람 수가 4배면 오차 범위는 절반", cd.px, 238, { s: 11, w: "600", c: LT.mute });
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "조사 인원", min: 0, max: 6, step: 1, value: 0, fmt: function (x) { return NS[x] + "명"; }, onInput: function (x) { i = x; draw(); } });
      api.seg({ label: "기사의 결론", value: "yes", options: [{ v: "yes", t: "관련이 있다" }, { v: "no", t: "관련이 있다고 볼 수 없다" }, { v: "wait", t: "아직 판단할 수 없다" }], onPick: function (x) { con = x; draw(); } });
      api.info("오차 범위는 ‘조사를 다시 하면 이만큼은 달라질 수 있다’는 폭입니다(95% 신뢰 수준). 사람 수가 4배가 되면 오차 범위는 절반이 돼요.");
      draw();
      return {
        judge: function () {
          var n = NS[i], d = DF[i], m = moe(n), zeroIn = d - m <= 0 && d + m >= 0;
          if (m > 5) return { ok: false, msg: n + "명으로는 오차 범위가 ± " + m.toFixed(1) + "%p나 돼, " + (con === "wait" ? "지금 판단을 미루는 것은 옳지만 과제는 결론을 내릴 만큼 조사하는 것입니다." : "어떤 결론도 내리기 이릅니다.") };
          if (con === "yes") return { ok: false, msg: "오차 범위(± " + m.toFixed(1) + "%p) 안에 ‘차이 없음(0)’이 들어 있습니다. 관련이 있다고 할 수 없습니다." };
          if (con === "wait") return { ok: false, msg: "충분히 조사했으니 이제 결론을 내릴 수 있습니다." };
          if (!zeroIn) return { ok: false, msg: "범위 밖입니다." };
          return { ok: true, msg: n + "명 조사: 차이 " + d + "%p ± " + m.toFixed(1) + "%p. 20명일 때의 12%p 차이는 우연으로 설명할 수 있는 크기였습니다. ‘관련이 있다고 볼 수 없다’가 자료에 맞는 결론입니다." };
        }
      };
    },
    hints: [
      "이 모형(각 집단을 같은 수로 조사한다고 단순화)에서는 오차 범위가 5%p 이하가 되려면 1,000명 가까이 조사해야 합니다.",
      "1,000명 이상에서 범위 안에 0이 들어 있다면, 차이가 있다고 할 수 없습니다."
    ],
    solution: "조사 인원 <b>1,000명 이상</b>, 결론 <b>‘관련이 있다고 볼 수 없다’</b>.",
    why: "적은 사람을 조사하면 우연한 차이가 규칙처럼 보이기 쉽습니다. 조사 인원을 늘리면 오차 범위가 줄어, 차이가 진짜인지 우연인지 가릴 수 있습니다. 혈액형 성격설은 수천 명을 조사한 연구들에서 관련이 확인되지 않았습니다.<br>" +
      "여기에 자기 생각에 맞는 사례만 기억하는 <b>확증 편향</b>이 더해지면 유사과학이 퍼집니다. 주장을 비평할 때는 ‘몇 명을 어떻게 조사했나?’를 먼저 물어보세요. ※ 설문 값은 수업용으로 만든 것입니다."
  }
  ]
});
})();
