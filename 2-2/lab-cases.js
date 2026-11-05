/* 과학탐구실험2 Ⅱ-1 미래 사회와 첨단 과학 탐구 — 응용 실험실
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

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 초음파 주차 센서 */
  {
    id: "c1", about: "02", tag: "센서의 원리 · 메아리로 거리 재기", title: "여름에도 겨울에도 맞는 주차 경보", short: "초음파 센서",
    who: "🚗", name: "자동차 부품 연구소",
    say: "“범퍼의 초음파 센서는 소리를 쏘고 장애물에 반사되어 돌아오는 시간(메아리 시간)을 잽니다. 메아리 시간이 기준보다 짧아지면 ‘삐—’ 경보가 울리죠. 장애물이 <b>0.5 m (± 5 cm)</b>에 왔을 때 울리게 기준 시간을 정해 주세요. 그런데 소리의 속력은 기온에 따라 달라요. <b>겨울(0 °C, 331 m/s)과 여름(30 °C, 349 m/s) 모두</b> 맞아야 합니다.”",
    predict: {
      q: "장애물까지 0.5 m 일 때, 초음파가 되돌아오기까지 소리가 가는 거리는?",
      options: ["㉠ 0.25 m", "㉡ 0.5 m", "㉢ 1 m — 갔다가 돌아오므로"],
      answer: 2
    },
    task: "경보 기준 시간을 정해 <b>겨울과 여름 모두</b> 0.45~0.55 m에서 경보가 울리게 하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, t = 5.0, season = "w";
      function dist(vs) { return vs * t / 1000 / 2; }
      function draw() {
        /* 입체 미니어처: 스튜디오 위 주차 연습 레일 두 줄(겨울·여름). 범퍼 초음파 센서에서 소리가 퍼지고, 경보가 울리는 거리에 반투명 경보면이 선다. 초록 띠 = 목표 0.45~0.55 m */
        var CH = cv.H, LW = 610, x0 = 128, sc = 380, okAll = true;
        ctx.clearRect(0, 0, W, CH);
        K.studio(ctx, 0, 0, LW, CH, null);
        [[331, "겨울 0 °C", 150, "#1c7ed6"], [349, "여름 30 °C", 266, "#e8590c"]].forEach(function (r) {
          var d = dist(r[0]), ly = r[2], good = d >= 0.45 && d <= 0.55, xd = Math.min(570, x0 + d * sc), m;
          if (!good) okAll = false;
          floorSh(ctx, 320, ly + 16, 300, 12, .22);
          slab(ctx, 24, ly, 556, 12, 26, "#eef1f6", "#c3cad6", "#a7afbd");
          var xa = x0 + 0.45 * sc, xb = x0 + 0.55 * sc;
          ctx.fillStyle = "rgba(15,159,118,.30)"; ctx.beginPath(); ctx.moveTo(xa, ly); ctx.lineTo(xa + 26, ly - 14.3); ctx.lineTo(xb + 26, ly - 14.3); ctx.lineTo(xb, ly); ctx.closePath(); ctx.fill();
          for (m = 0; m <= 1.2001; m += 0.25) { var tx = x0 + m * sc; ctx.fillStyle = "rgba(20,40,90,.45)"; ctx.fillRect(tx - .6, ly, 1.2, 6); lt(ctx, m.toFixed(2) + " m", tx, ly + 24, { s: 9.5, a: "center", w: "600", c: LT.mute }); }
          ctx.save(); ctx.strokeStyle = "rgba(28,126,214,.55)"; ctx.lineWidth = 1.6;
          for (var rr = 14; rr < xd - x0; rr += 20) { ctx.globalAlpha = Math.max(.15, 1 - rr / 300); var aa = Math.min(0.42, 30 / rr); ctx.beginPath(); ctx.arc(x0, ly - 20, rr, -aa, aa); ctx.stroke(); }
          ctx.restore();
          ctx.fillStyle = good ? "rgba(15,159,118,.20)" : "rgba(224,49,49,.18)"; ctx.strokeStyle = good ? LT.green : LT.red; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(xd, ly); ctx.lineTo(xd + 26, ly - 14.3); ctx.lineTo(xd + 26, ly - 64); ctx.lineTo(xd, ly - 50); ctx.closePath(); ctx.fill(); ctx.stroke();
          box3(ctx, 34, ly - 4, 92, 22, 20, r[3]);
          box3(ctx, 54, ly - 26, 48, 16, 16, "#dfe7f1");
          wheel(ctx, 52, ly - 4, 7); wheel(ctx, 108, ly - 4, 7);
          ctx.fillStyle = "#2b2f3a"; ctx.fillRect(x0 - 4, ly - 22, 5, 7);
          tag(ctx, r[1] + " · 소리 " + r[0] + " m/s", 140, ly - 70, LT.ink, "left", [0, LW]);
          tag(ctx, "경보 " + d.toFixed(2) + " m", xd + 14, ly - 70, good ? LT.green : LT.red, "left", [0, LW]);
        });
        K.bigText(ctx, "기준 " + t.toFixed(1) + " ms", 16, 40, 24, okAll ? "#8ff0c4" : "#ffffff");
        K.bigText(ctx, "거리 = 속력 × 시간 ÷ 2", 16, 62, 14, "#ffd35a");
        var cd = sideCard(ctx, LW + 10, W, CH, "주차 경보 시험");
        lt(ctx, t.toFixed(1) + " ms", cd.px, 64, { s: 24, w: "900", c: LT.blue });
        lt(ctx, "경보 기준 메아리 시간", cd.R, 64, { s: 11, a: "right", c: LT.mute });
        var dw = dist(331), ds = dist(349);
        K.row(ctx, "겨울 경보 거리", dw.toFixed(3) + " m", cd.px, cd.R, 104, dw >= 0.45 && dw <= 0.55 ? LT.green : LT.red);
        K.row(ctx, "여름 경보 거리", ds.toFixed(3) + " m", cd.px, cd.R, 132, ds >= 0.45 && ds <= 0.55 ? LT.green : LT.red);
        K.row(ctx, "목표", "0.45 ~ 0.55 m", cd.px, cd.R, 160, LT.green);
        K.tip(ctx, okAll ? "두 계절 모두 0.5 m 근처에서 울립니다" : "두 계절 모두 맞는 시간을 찾으세요", cd.px - 4, 180, cd.w + 8, okAll ? true : null);
        lt(ctx, "기온이 오르면 소리가 빨라져", cd.px, 240, { s: 11, w: "600", c: LT.mute });
        lt(ctx, "같은 시간에 더 먼 거리가 됩니다.", cd.px, 258, { s: 11, w: "600", c: LT.mute });
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "경보 기준 메아리 시간", min: 1, max: 8, step: 0.1, value: 5, fmt: function (x) { return x.toFixed(1) + " ms"; }, onInput: function (x) { t = x; draw(); } });
      api.info("거리 = 소리의 속력 × 메아리 시간 ÷ 2. 1 ms는 1000분의 1초입니다. 초록 띠가 목표 거리입니다.");
      draw();
      return {
        judge: function () {
          var dw = dist(331), ds = dist(349), okw = dw >= 0.45 && dw <= 0.55, oks = ds >= 0.45 && ds <= 0.55;
          if (okw && oks) return { ok: true, msg: "기준 " + t.toFixed(1) + " ms → 겨울 " + dw.toFixed(3) + " m, 여름 " + ds.toFixed(3) + " m. 두 계절 모두 0.5 m 근처에서 울립니다." };
          return { ok: false, msg: "겨울 " + dw.toFixed(2) + " m" + (okw ? " ✔" : " ✘") + ", 여름 " + ds.toFixed(2) + " m" + (oks ? " ✔" : " ✘") + ". 소리가 1 m(왕복)를 가는 데 걸리는 시간을 계산해 보세요." };
        }
      };
    },
    hints: [
      "왕복 1 m를 가는 시간 = 1 ÷ 331 초 ≈ 3.0 ms (겨울), 1 ÷ 349 초 ≈ 2.9 ms (여름).",
      "두 계절 모두 맞는 시간은 2.8~3.1 ms 사이입니다."
    ],
    solution: "기준 메아리 시간 <b>2.8~3.1 ms</b>.",
    why: "초음파 센서는 소리의 속력과 메아리 시간으로 거리를 계산합니다. 소리는 갔다가 돌아오므로 거리는 ‘속력 × 시간 ÷ 2’입니다. 기온이 오르면 소리가 빨라져 같은 시간에 더 먼 거리가 되므로, 정밀한 센서는 온도 센서를 함께 달아 속력을 고쳐 계산합니다.<br>" +
      "박쥐와 돌고래도 같은 원리(반향 정위)로 먹이를 찾고, 라이다는 소리 대신 빛을 씁니다. 하나의 원리가 여러 첨단 기술로 이어집니다."
  },

  /* ------------------------------------------------------------------ 2. 3D 프린팅 */
  {
    id: "c2", about: "01", tag: "첨단 제작 기술 · 품질과 시간의 균형", title: "과학 축제 전까지 출력하기", short: "3D 프린팅",
    who: "🖨️", name: "메이커 동아리",
    say: "“과학 축제에 전시할 높이 60 mm의 로켓 모형을 3D 프린터로 출력해야 해요. 한 층씩 녹인 플라스틱을 쌓는데, 층이 얇을수록 표면이 매끈하지만 층이 많아 오래 걸려요. 속을 채우는 비율(채움 밀도)을 높이면 튼튼하지만 역시 오래 걸리죠. <b>층 높이 0.2 mm 이하</b>(매끈함), <b>채움 밀도 40% 이상</b>(튼튼함), <b>4시간 안</b>에 끝나게 설정해 주세요.”",
    predict: {
      q: "층 높이를 0.2 mm에서 0.1 mm로 절반으로 줄이면 출력 시간은?",
      options: ["㉠ 절반으로 줄어든다", "㉡ 층 수가 두 배가 되어 약 두 배로 늘어난다", "㉢ 변하지 않는다"],
      answer: 1
    },
    task: "층 높이와 채움 밀도를 정해 <b>매끈함 · 튼튼함 · 4시간 이내</b>를 모두 맞추세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, lh = 0.3, den = 20;
      function layers() { return Math.round(60 / lh); }
      function minutes() { return layers() * (0.5 + 0.005 * den); }
      function draw() {
        /* 입체 미니어처: 금속 기둥과 받침의 3D 프린터 위에서 쌓인 로켓 모형. 층 높이가 두꺼우면 뾰족한 머리에 계단 무늬가 보이고, 잘라 낸 아래쪽 창으로 채움 격자가 보인다. */
        var CH = cv.H, LW = 560, n = layers(), m = minutes(), ok = lh <= 0.2 + 1e-9 && den >= 40 && m <= 240, i;
        ctx.clearRect(0, 0, W, CH);
        K.studio(ctx, 0, 0, LW, CH, null);
        floorSh(ctx, 300, 288, 210, 18, .3);
        box3(ctx, 130, 286, 290, 24, 40, "#3b4252");
        ctx.fillStyle = metalG(ctx, 140, 0, 152, 0); ctx.fillRect(140, 52, 12, 212);
        ctx.fillStyle = metalG(ctx, 398, 0, 410, 0); ctx.fillRect(398, 52, 12, 212);
        ctx.fillStyle = "#5b6476"; ctx.fillRect(134, 46, 282, 10);
        box3(ctx, 170, 258, 210, 8, 34, "#c9d1dc");
        var cx = 284, by = 250, hpx = 150, step = hpx / n, k = Math.max(1, Math.round(n / 90));
        function wv(f) { return f < 0.62 ? 34 : 34 * Math.max(0, Math.cos((f - 0.62) / 0.38 * Math.PI / 2)); }
        var bg = ctx.createLinearGradient(cx - 34, 0, cx + 34, 0); bg.addColorStop(0, "#c2410c"); bg.addColorStop(.35, "#ffa94d"); bg.addColorStop(1, "#a63a0a");
        ctx.fillStyle = bg; ctx.beginPath();
        for (i = 0; i < n; i += k) { var f = i / n, yy = by - i * step, hh = step * Math.min(k, n - i), ww = wv(f + (lh / 60) * k * .5); ctx.rect(cx - ww, yy - hh, ww * 2, hh + .4); }
        ctx.fill();
        if (step * k >= 1.6) { ctx.strokeStyle = "rgba(80,30,5,.35)"; ctx.lineWidth = .8; for (i = k; i < n; i += k) { var y2 = by - i * step, w2 = wv(i / n); if (w2 > 1) { ctx.beginPath(); ctx.moveTo(cx - w2, y2); ctx.lineTo(cx + w2, y2); ctx.stroke(); } } }
        ctx.fillStyle = "#e8590c"; ctx.beginPath(); ctx.moveTo(cx - 34, by); ctx.lineTo(cx - 52, by); ctx.lineTo(cx - 34, by - 40); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + 34, by); ctx.lineTo(cx + 52, by); ctx.lineTo(cx + 34, by - 40); ctx.closePath(); ctx.fill();
        var wx0 = cx - 26, wy0 = by - 82, ww0 = 26, wh0 = 70;
        ctx.fillStyle = "#fff4e6"; ctx.fillRect(wx0, wy0, ww0, wh0);
        ctx.save(); ctx.beginPath(); ctx.rect(wx0, wy0, ww0, wh0); ctx.clip();
        var gap = 3 + (100 - den) / 100 * 16; ctx.strokeStyle = "#e8590c"; ctx.lineWidth = 1.4;
        for (i = -wh0; i < ww0 + wh0; i += gap) { ctx.beginPath(); ctx.moveTo(wx0 + i, wy0); ctx.lineTo(wx0 + i + wh0, wy0 + wh0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(wx0 + i, wy0 + wh0); ctx.lineTo(wx0 + i + wh0, wy0); ctx.stroke(); }
        ctx.restore();
        ctx.strokeStyle = "rgba(80,30,5,.6)"; ctx.lineWidth = 1; ctx.strokeRect(wx0, wy0, ww0, wh0);
        var ny = by - hpx - 16;
        ctx.fillStyle = "#5b6476"; ctx.fillRect(146, ny - 6, 258, 7);
        box3(ctx, cx - 22, ny + 6, 44, 22, 16, "#343a46");
        ctx.fillStyle = metalG(ctx, cx - 4, 0, cx + 4, 0); ctx.beginPath(); ctx.moveTo(cx - 5, ny + 6); ctx.lineTo(cx + 5, ny + 6); ctx.lineTo(cx, ny + 14); ctx.closePath(); ctx.fill();
        tag(ctx, "잘라 본 속: 채움 " + den + "%", wx0 - 10, wy0 + 30, LT.orange, "right", [0, LW]);
        tag(ctx, "높이 60 mm", cx + 60, by - 120, LT.ink, "left", [0, LW]);
        K.bigText(ctx, n + "층 쌓기", 16, 40, 24, "#ffffff");
        K.bigText(ctx, "층 " + lh.toFixed(2) + " mm · " + Math.floor(m / 60) + "시간 " + Math.round(m % 60) + "분", 16, 62, 14, "#ffd35a");
        K.warn(ctx, LW - 12, CH - 10, "⚠ 층 두께는 보기 쉽게 과장", "right");
        var cd = sideCard(ctx, LW + 10, W, CH, "출력 설정 판정");
        K.row(ctx, "층 높이 (표면)", lh.toFixed(2) + " mm · " + (lh <= 0.2 + 1e-9 ? "매끈함" : "계단이 보임"), cd.px, cd.R, 60, lh <= 0.2 + 1e-9 ? LT.green : LT.red);
        K.row(ctx, "채움 밀도 (강도)", den + "% · " + (den >= 40 ? "튼튼함" : "약함"), cd.px, cd.R, 92, den >= 40 ? LT.green : LT.red);
        K.row(ctx, "출력 시간", Math.floor(m / 60) + "시간 " + Math.round(m % 60) + "분", cd.px, cd.R, 124, m <= 240 ? LT.green : LT.red);
        gauge(ctx, cd.px, 136, cd.w, m / 480, m <= 240 ? LT.green : LT.red, 0.5);
        lt(ctx, "4시간", cd.px + cd.w * .5, 166, { s: 10.5, a: "center", w: "800", c: LT.yellow });
        K.tip(ctx, ok ? "세 조건의 균형을 찾았습니다" : "매끈함 · 튼튼함 · 4시간을 모두 맞추세요", cd.px - 4, 184, cd.w + 8, ok ? true : null);
        lt(ctx, "층이 얇을수록 층 수가 늘어 오래 걸립니다.", cd.px, 244, { s: 11, w: "600", c: LT.mute });
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "층 높이", min: 0.05, max: 0.4, step: 0.05, value: 0.3, fmt: function (x) { return x.toFixed(2) + " mm"; }, onInput: function (x) { lh = x; draw(); } });
      api.slider({ label: "채움 밀도", min: 10, max: 100, step: 10, value: 20, fmt: function (x) { return x + "%"; }, onInput: function (x) { den = x; draw(); } });
      api.info("한 층을 쌓는 데 걸리는 시간 = 0.5 분 + 채움 밀도에 따른 시간(10%마다 0.05 분).");
      draw();
      return {
        judge: function () {
          var m = minutes();
          if (lh > 0.2 + 1e-9) return { ok: false, msg: "층 높이 " + lh.toFixed(2) + " mm는 표면에 계단 무늬가 보입니다." };
          if (den < 40) return { ok: false, msg: "채움 밀도 " + den + "%는 전시 중 부러질 수 있습니다." };
          if (m > 240) return { ok: false, msg: "출력에 " + Math.floor(m / 60) + "시간 " + Math.round(m % 60) + "분이 걸려 축제에 늦습니다. 무엇을 조금 양보할 수 있을까요?" };
          return { ok: true, msg: "층 " + lh.toFixed(2) + " mm · 채움 " + den + "% → " + Math.floor(m / 60) + "시간 " + Math.round(m % 60) + "분. 세 조건의 균형을 찾았습니다." };
        }
      };
    },
    hints: [
      "층 높이 0.2 mm면 300 층입니다. 층을 더 얇게 하면 시간이 크게 늘어납니다.",
      "0.2 mm에서 채움 밀도를 40~60%로 해 보세요."
    ],
    solution: "층 높이 <b>0.2 mm</b>, 채움 밀도 <b>40~60%</b>.",
    why: "3D 프린터는 설계 데이터를 얇은 층으로 잘라(슬라이싱) 녹인 재료를 한 층씩 쌓습니다. 층이 얇을수록 매끈하지만 층 수가 늘어 시간이 길어지고, 속을 많이 채울수록 튼튼하지만 재료와 시간이 더 듭니다.<br>" +
      "기술을 쓸 때는 여러 조건 사이의 <b>균형(트레이드오프)</b>을 찾아야 합니다. 과학 원리를 알면 무엇을 얼마나 양보할지 계산으로 정할 수 있습니다. ※ 시간은 수업용 모형입니다."
  },

  /* ------------------------------------------------------------------ 3. 유전자 가위 */
  {
    id: "c3", about: "01", tag: "생명 공학 기술 · 서열이 맞아야 자른다", title: "유전자 가위가 자를 곳 찾기", short: "유전자 가위",
    who: "🧬", name: "생명 공학 연구실",
    say: "“유전자 가위는 안내 RNA가 DNA에서 <b>한 가닥과 짝이 맞는(다른 가닥과 같은) 서열</b>을 찾아가 자릅니다. 그런데 아무 곳이나 자르는 게 아니라, 찾은 서열 바로 뒤 <b>한 글자 다음에 ‘GG’ 표지(NGG, PAM)</b>가 있어야만 자르지요. 안내 서열(DNA 글자로 적으면) <b>GATTACAG</b>를 DNA 위에서 움직여, 가위가 <b>실제로 자를 자리</b>를 찾아 주세요. 한 글자만 달라도 엉뚱한 곳을 자를 수 있으니 조심하고요.”",
    predict: {
      q: "안내 서열과 DNA 서열이 여덟 글자 중 일곱 글자만 같다면?",
      options: ["㉠ 충분히 비슷하니 여기를 자르는 것이 목표다", "㉡ 목표가 아닌 곳을 잘못 자를(표적 이탈) 위험이 있는 자리다", "㉢ 서열은 상관없다"],
      answer: 1
    },
    task: "안내 서열의 위치를 옮겨 <b>여덟 글자가 모두 같고 바로 뒤에 NGG가 있는</b> 자리를 찾으세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(320), ctx = cv.ctx, W = cv.W, pos = 0;
      var DNA = "CTAGATTACAGTAGATCACAGTGGTCGATTACAGAGGA", GUIDE = "GATTACAG";
      var COL = { A: "#e4572e", T: "#f3a712", G: "#29a36a", C: "#1f8fbf" };
      function match() { var m = 0; for (var i = 0; i < 8; i++) if (DNA[pos + i] === GUIDE[i]) m++; return m; }
      function pam() { return DNA.substr(pos + 9, 2) === "GG"; }
      function draw() {
        /* 입체 미니어처: 스튜디오 위 DNA 두 가닥(염기 블록)과 그 위에 내려앉는 안내 RNA + 캐스9(보라 덩어리). 여덟 글자가 맞고 바로 뒤 NGG가 있으면 PAM 3칸 앞을 자른다. */
        var CH = cv.H, SH = 232, cw = 21, x0 = (W - cw * DNA.length) / 2 - 6, y = 172, i;
        var CMP = { A: "T", T: "A", G: "C", C: "G" }, m = match(), p = pam(), ok = m === 8 && p;
  function pale(h, q) { var n = parseInt(h.slice(1), 16); function mm(v) { return Math.round(v + (255 - v) * q); } return "#" + ((1 << 24) + (mm((n >> 16) & 255) << 16) + (mm((n >> 8) & 255) << 8) + mm(n & 255)).toString(16).slice(1); }
        ctx.clearRect(0, 0, W, CH);
        K.studio(ctx, 0, 0, W, SH, null);
        floorSh(ctx, W / 2, SH - 14, 420, 14, .22);
        var cx9 = x0 + (pos + 5.5) * cw, cg = ctx.createRadialGradient(cx9 - 30, 110, 10, cx9, 140, 150);
        cg.addColorStop(0, "rgba(177,151,252,.55)"); cg.addColorStop(1, "rgba(112,72,232,.12)");
        ctx.fillStyle = cg; ctx.beginPath(); ctx.ellipse(cx9, 140, 150, 66, 0, 0, 6.2832); ctx.fill();
        for (i = 0; i < DNA.length; i++) {
          var inG = i >= pos && i < pos + 8, inP = i >= pos + 8 && i < pos + 11, bx = x0 + i * cw;
          ctx.strokeStyle = "rgba(20,40,90,.25)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx + 9, y + 2); ctx.lineTo(bx + 9, y + 18); ctx.stroke();
          box3(ctx, bx + 1, y + 34, cw - 4, 16, 6, pale(COL[CMP[DNA[i]]], .35));
          K.t(ctx, CMP[DNA[i]], bx + 1 + (cw - 4) / 2, y + 30, { s: 10, w: "900", a: "center", c: "rgba(255,255,255,.95)" });
          box3(ctx, bx + 1, y, cw - 4, 24, 7, inG || inP ? COL[DNA[i]] : pale(COL[DNA[i]], .45));
          K.t(ctx, DNA[i], bx + 1 + (cw - 4) / 2, y - 7, { s: 12.5, w: "900", a: "center", c: "#fff" });
        }
        for (var k = 0; k < 8; k++) {
          var gx = x0 + (pos + k) * cw, same = DNA[pos + k] === GUIDE[k];
          box3(ctx, gx + 1, y - 46, cw - 4, 22, 7, same ? "#0f9f76" : "#e03131");
          K.t(ctx, GUIDE[k], gx + 1 + (cw - 4) / 2, y - 52, { s: 12.5, w: "900", a: "center", c: "#fff" });
        }
        tag(ctx, "안내 RNA", x0 + pos * cw, y - 82, LT.violet, "left", [0, W]);
        if (pos > 14) tag(ctx, "DNA 두 가닥", x0 + 4, y - 36, LT.mute, "left", [0, W]); else tag(ctx, "DNA 두 가닥", W - 20, y - 36, LT.mute, "right", [0, W]);
        if (p) { ctx.strokeStyle = LT.green; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(x0 + (pos + 8) * cw - 1, y - 30, cw * 3, 36, 6); ctx.stroke(); tag(ctx, "PAM (NGG)", x0 + (pos + 8) * cw + 2, y - 40, LT.green, "left", [0, W]); }
        if (ok) {
          var cxx = x0 + (pos + 5) * cw - 1;
          ctx.strokeStyle = LT.red; ctx.lineWidth = 2.4; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(cxx, y - 30); ctx.lineTo(cxx, y + 40); ctx.stroke(); ctx.setLineDash([]);
          K.bigText(ctx, "✂", cxx - 12, y - 92, 28, "#ffffff");
        }
        K.bigText(ctx, "같은 글자 " + m + " / 8", 16, 40, 24, m === 8 ? "#8ff0c4" : "#ffffff");
        K.bigText(ctx, (pos + 1) + "번째 글자부터 · 뒤에 NGG " + (p ? "있음" : "없음"), 16, 62, 14, "#ffd35a");
        K.card(ctx, 0, SH + 8, W, CH - SH - 8, null);
        var cy = SH + 44;
        K.row(ctx, "같은 글자", m + " / 8", 24, 270, cy, m === 8 ? LT.green : LT.ink);
        K.row(ctx, "바로 뒤 NGG 표지", p ? "있음" : "없음", 310, 560, cy, p ? LT.green : LT.red);
        K.tip(ctx, ok ? "✂ 여기를 자른다" : (m === 7 && p ? "⚠ 잘못 자를 위험이 있는 자리" : "자르지 않는다"), 600, cy - 22, 282, ok ? true : (m === 7 && p ? false : null));
        lt(ctx, "캐스9은 PAM 바로 앞 3칸 자리에서 DNA 두 가닥을 자릅니다.", 24, cy + 28, { s: 11, w: "600", c: LT.mute });
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "안내 서열의 위치", min: 0, max: 27, step: 1, value: 0, fmt: function (x) { return (x + 1) + "번째 글자부터"; }, onInput: function (x) { pos = x; draw(); } });
      api.info("초록 칸은 같은 글자, 빨간 칸은 다른 글자입니다. 실제로는 안내 RNA가 DNA의 한쪽 가닥과 염기쌍을 이루며 결합하고, RNA 에는 T 대신 U가 들어갑니다(GAUUACAG).");
      draw();
      return {
        judge: function () {
          var m = match(), p = pam();
          if (m === 8 && p) return { ok: true, msg: (pos + 1) + "번째 글자부터 여덟 글자가 모두 같고, 바로 뒤에 NGG(AGG)가 있습니다. 가위가 이 자리를 자릅니다." };
          if (m === 8) return { ok: false, msg: "서열은 모두 같지만 바로 뒤에 NGG 표지가 없어 가위가 자르지 않습니다. 같은 서열이 또 있는지 찾아보세요." };
          if (m === 7 && p) return { ok: false, msg: "한 글자가 다른데 NGG가 있어 가위가 잘못 자를 수도 있는 자리입니다. 연구자들이 가장 조심하는 곳입니다." };
          return { ok: false, msg: "같은 글자가 " + m + "개뿐입니다." };
        }
      };
    },
    hints: [
      "GATTACAG는 이 DNA에 두 번 나옵니다. 둘 가운데 바로 뒤에 ‘아무 글자 하나 + GG’가 있는 쪽은?",
      "뒤쪽의 GATTACAG (27번째 글자부터)를 보세요."
    ],
    solution: "<b>27번째 글자부터</b> (GATTACAG 바로 뒤에 AGG).",
    why: "유전자 가위(크리스퍼 캐스9)는 안내 RNA의 염기 서열과 짝이 맞는 DNA를 찾아가, 그 옆에 특정한 짧은 표지(PAM, 흔히 쓰는 캐스9은 NGG)가 있을 때만 자릅니다. 두 조건 덕분에 원하는 자리만 골라 자를 수 있습니다.<br>" +
      "그러나 서열이 한두 글자만 다른 곳을 잘못 자르는 ‘표적 이탈’이 일어날 수 있어, 연구자들은 안내 서열을 고를 때 DNA 전체에 비슷한 서열이 없는지 컴퓨터로 확인합니다. 생명과학과 정보 기술이 함께 쓰이는 첨단 기술입니다."
  }
  ]
});
})();
