/* 과학탐구실험2 Ⅰ 생활 속의 과학 탐구 — 실제 자료
   r1 난방한 교실의 습도 — 서울 1월 바깥 공기를 22 °C로 데우면 상대 습도는?
   r2 가습기는 물을 얼마나 내보내야 할까 — 교실 공기를 40%로 맞추는 데 드는 물
   자료: data/seoul-hum.js (NASA POWER 서울 기온·이슬점 달 평균 2001~2024) */
(function () {
"use strict";
var D = window.REAL_HUM || { monthly: [] };
function mean(m, i) { var a = D.monthly.filter(function (r) { return r[1] === m; }); return a.length ? a.reduce(function (s, r) { return s + r[i]; }, 0) / a.length : 0; }
var TJ = mean(1, 2), DJ = mean(1, 3);
function es(t) { return 6.112 * Math.exp(17.62 * t / (243.12 + t)); }          /* 포화 수증기압 hPa (물 위) */
function rho(t) { return 216.7 * es(t) / (t + 273.15); }                         /* 포화 수증기량 g/m³ */
var IN = 22, RS = rho(IN), RD = rho(DJ), RH = RD / RS * 100;
var VOL = 9 * 7 * 3, NEED = (0.4 * RS - RD) * VOL / 1000;
var SRC = "<small>출처: 미국 항공우주국(NASA) POWER 자료 서비스 — 서울(북위 37.57°, 동경 126.98°) 1월의 기온·이슬점 달 평균을 2001~2024년 24해로 평균한 값(기온 " + TJ.toFixed(1) + " °C, 이슬점 " + DJ.toFixed(1) + " °C). 포화 수증기량은 마그누스 식으로 계산했습니다. 약 50 km 격자 값이라 도심 관측소보다 조금 습하게 나옵니다. 사본은 data/seoul-hum.js.</small>";

/* ---- 밝은 스튜디오 · 입체 미니어처 도구 (kit.js) ---- */
var K = window.sthKit, LT = K.LT;
function kShadow(ctx, x, y, rx, ry, a) {
  var g = ctx.createRadialGradient(x, y, 1, x, y, rx);
  g.addColorStop(0, "rgba(20,30,50," + (a == null ? .26 : a) + ")"); g.addColorStop(1, "rgba(20,30,50,0)");
  ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx); ctx.translate(-x, -y); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rx, 0, 6.2832); ctx.fill(); ctx.restore();
}
function kTag(ctx, px, py, txt, dx, dy, col, box) {
  var q = { x: px + dx, y: py + dy };
  ctx.strokeStyle = "rgba(20,25,40,.75)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(q.x, q.y); ctx.stroke();
  ctx.fillStyle = "#111622"; ctx.beginPath(); ctx.arc(px, py, 2.5, 0, 6.283); ctx.fill();
  return K.pill(ctx, txt, q.x + (dx < 0 ? -4 : 4), q.y + 4, { s: 11.5, a: dx < 0 ? "right" : "left", c: col || "#e8ecff", box: box });
}
function kRows(ctx, x0, x1, y, list, gap) { list.forEach(function (r, i) { K.row(ctx, r[0], r[1], x0, x1, y + i * (gap || 28), r[2]); }); }
/* 유리 원기둥(시험관·병·비커) */
function kGlass(ctx, cx, by, r, h, lh, liq, o) {
  o = o || {}; var e = o.e || .3, ry = r * e, ty = by - h, ly = by - lh;
  if (!o.noShadow) kShadow(ctx, cx + r * .3, by + ry * .5, r * 1.6, ry * 1.6, .24);
  ctx.fillStyle = "rgba(205,222,245,.3)"; ctx.beginPath(); ctx.moveTo(cx - r, ty); ctx.lineTo(cx - r, by); ctx.ellipse(cx, by, r, ry, 0, Math.PI, 0, true); ctx.lineTo(cx + r, ty); ctx.ellipse(cx, ty, r, ry, 0, 0, Math.PI, true); ctx.closePath(); ctx.fill();
  if (lh > 0 && liq) {
    ctx.fillStyle = liq; ctx.beginPath(); ctx.moveTo(cx - r + 1.5, ly); ctx.lineTo(cx - r + 1.5, by); ctx.ellipse(cx, by, r - 1.5, ry - .5, 0, Math.PI, 0, true); ctx.lineTo(cx + r - 1.5, ly); ctx.closePath(); ctx.fill();
    var sh = ctx.createLinearGradient(cx - r, 0, cx + r, 0); sh.addColorStop(0, "rgba(0,0,30,.22)"); sh.addColorStop(.35, "rgba(255,255,255,.12)"); sh.addColorStop(1, "rgba(0,0,30,.28)"); ctx.fillStyle = sh; ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.beginPath(); ctx.ellipse(cx, ly, r - 1.5, ry - .5, 0, 0, 6.2832); ctx.fill();
  }
  if (o.inside) o.inside(ly, ry);
  ctx.strokeStyle = "rgba(80,110,150,.78)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx - r, ty); ctx.lineTo(cx - r, by); ctx.ellipse(cx, by, r, ry, 0, Math.PI, 0, true); ctx.lineTo(cx + r, ty); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx, ty, r, ry, 0, 0, 6.2832); ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(cx - r * .66, ty + ry + 4, r * .18, Math.max(0, h - ry - 10));
}
/* 작은 도시 블록(관측소 백엽상 포함): o.snow 눈 덮임, o.sun 해 */
function kCity(ctx, ox, oy, s, o) {
  o = o || {}; var I = K.iso({ ox: ox, oy: oy, s: s, L: 160, D: 110 });
  I.box(ctx, 0, 0, -14, 160, 110, 0, o.snow ? "#eef3f7" : "#8fbf73", "#8a6a4a", "#6d523a");
  I.box(ctx, 0, 54, 0, 160, 68, .6, "#8d8f94", "#7a7c82", "#6b6d72");
  [[12, 8, 34, 34, 74], [42, 10, 62, 32, 46], [94, 6, 118, 34, 96], [124, 10, 150, 34, 58], [18, 78, 42, 102, 42], [112, 80, 140, 104, 66]].forEach(function (b) {
    I.box(ctx, b[0], b[1], 0, b[2], b[3], b[4], o.snow ? "#ffffff" : "#dde2ea", "#c3cad5", "#9ea7b5");
    for (var z = 10; z < b[4] - 6; z += 12) for (var x = b[0] + 4; x < b[2] - 4; x += 7) I.quad(ctx, I.P(x, b[3], z), I.P(x + 3.5, b[3], z), I.P(x + 3.5, b[3], z + 6), I.P(x, b[3], z + 6), o.night ? "#ffd86b" : "#7d95b8");
  });
  I.tree(ctx, 80, 92, 0, .7); I.tree(ctx, 150, 92, 0, .6);
  [[66, 80], [72, 80], [66, 86], [72, 86]].forEach(function (q) { I.box(ctx, q[0], q[1], 0, q[0] + 1.5, q[1] + 1.5, 16, "#f4f4f0", "#d8d8d2", "#bdbdb6"); });
  I.box(ctx, 64, 78, 16, 76, 90, 28, "#ffffff", "#eceeea", "#cfd3cc");
  if (o.sun) K.sun(ctx, ox + 70 * s, oy - 70 * s, 7);
  return I;
}

function curve(H, ctx, W, CH) {
  H.paper(ctx, W, CH);
  var g = K.chart(ctx, { x: 4, y: 8, w: 560, h: CH - 12, pl: 44, pt: 30, pb: 30, pr: 12, x0: -15, x1: 35, y0: 0, y1: 40, xt: 5, yt: 4, light: true, xf: function (t) { return Math.round(t) + "°"; } });
  function X(t) { return g.X(t); }
  function Y(v) { return g.Y(v); }
  var pts = []; for (var t = -15; t <= 35; t += 0.5) pts.push([t, rho(t)]);
  K.plot(ctx, g, pts, LT.blue, { w: 3, light: true });
  K.t(ctx, "포화 수증기량 (g/m³) — 공기 1 m³가 품을 수 있는 수증기의 최대량", g.L + 2, 22, { s: 11, w: "800", c: LT.mute });
  K.line(ctx, { x: X(DJ), y: Y(RD) }, { x: X(IN), y: Y(RD) }, LT.red, 1.8, [5, 4]);
  K.line(ctx, { x: X(IN), y: Y(RD) }, { x: X(IN), y: Y(RS) }, LT.yellow, 1.8, [5, 4]);
  [[X(DJ), Y(RD), LT.red], [X(IN), Y(RS), LT.yellow], [X(IN), Y(RD), LT.ink]].forEach(function (p) { ctx.fillStyle = p[2]; ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.stroke(); });
  K.t(ctx, "이슬점 " + DJ.toFixed(1) + "°", X(DJ) + 6, Y(RD) - 10, { s: 11, w: "900", c: LT.red });
  K.t(ctx, "교실 22°", X(IN) + 9, Y(RS) + 4, { s: 11, w: "900", c: "#b07400" });
  return { X: X, Y: Y };
}
/* 공기 1 m³ 상자: 같은 수증기 알갱이, 품을 수 있는 양(점선 높이)만 다르다 */
function airCube(ctx, ox, oy, cap, vap, warm) {
  var I = K.iso({ ox: ox, oy: oy, s: .42, L: 100, D: 100 }), Z = 100;
  kShadow(ctx, I.P(50, 50, 0).x + 6, I.P(50, 50, 0).y + 16, 46, 10, .22);
  I.quad(ctx, I.P(0, 0, 0), I.P(100, 0, 0), I.P(100, 0, Z), I.P(0, 0, Z), warm ? "rgba(255,200,160,.25)" : "rgba(170,205,240,.3)");
  I.quad(ctx, I.P(0, 0, 0), I.P(0, 100, 0), I.P(0, 100, Z), I.P(0, 0, Z), warm ? "rgba(255,190,150,.2)" : "rgba(160,195,235,.25)");
  var zc = Math.min(Z, cap / 22 * Z);
  I.plane(ctx, zc, warm ? "rgba(245,159,0,.18)" : "rgba(28,126,214,.18)", warm ? "rgba(245,159,0,.8)" : "rgba(28,126,214,.8)");
  var R0 = K.rng(7);
  for (var i = 0; i < Math.round(vap * 4); i++) { var p = I.P(10 + R0() * 80, 10 + R0() * 80, 4 + R0() * Math.min(zc, 40)); ctx.fillStyle = "rgba(28,100,200,.8)"; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, 6.2832); ctx.fill(); }
  I.quad(ctx, I.P(0, 100, 0), I.P(100, 100, 0), I.P(100, 100, Z), I.P(0, 100, Z), "rgba(255,255,255,.12)", "rgba(60,80,110,.6)");
  I.quad(ctx, I.P(100, 0, 0), I.P(100, 100, 0), I.P(100, 100, Z), I.P(100, 0, Z), "rgba(255,255,255,.08)", "rgba(60,80,110,.6)");
  I.plane(ctx, Z, null, "rgba(60,80,110,.6)");
  return I;
}

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료로 겨울 교실이 건조한 까닭과 가습 계획을 설명해 보세요.",
  cases: [
  {
    id: "r1", sec: "02", tag: "실제 자료 · 상대 습도", title: "난방한 교실의 습도", short: "데운 공기의 습도",
    who: "💧", name: "학급 환경 도우미",
    say: "“겨울 바깥 공기는 습도계로 보면 70%를 넘기도 하는데, 교실은 왜 이렇게 건조할까요? 서울 1월의 <b>실제 이슬점</b>은 약 " + DJ.toFixed(1) + " °C예요. 이 공기를 창틈·환기로 들여와 <b>22 °C로 데우면</b> 수증기 양은 그대로인데 상대 습도는 몇 %가 될까요?”",
    predict: {
      q: "수증기 양은 그대로 두고 공기를 데우면 상대 습도는 어떻게 될까요?",
      options: ["㉠ 높아진다", "㉡ 낮아진다 — 데운 공기는 더 많은 수증기를 품을 수 있어서", "㉢ 그대로다"],
      answer: 1
    },
    task: "22 °C 교실의 상대 습도를 슬라이더로 맞추세요(± 2%).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(290), ctx = cv.ctx, W = cv.W, g = 50;
      function draw() {
        curve(H, ctx, W, cv.H);
        var RX = 578, px = RX + 16, xr = W - 16;
        K.card(ctx, RX, 8, W - RX - 8, cv.H - 16, "공기 1 m³ 속 수증기");
        K.row(ctx, "이슬점 " + DJ.toFixed(1) + " °C의 포화량", RD.toFixed(2) + " g/m³", px, xr, 58, LT.red);
        K.row(ctx, "22 °C의 포화량", RS.toFixed(2) + " g/m³", px, xr, 86, "#b07400");
        K.row(ctx, "내 답 (상대 습도)", g + "%", px, xr, 114, LT.orange);
        airCube(ctx, RX + 74, 160, RD, RD, false); airCube(ctx, RX + 214, 160, RS, RD, true);
        K.t(ctx, "바깥 1월 공기", RX + 82, cv.H - 18, { s: 10.5, w: "800", a: "center", c: LT.blue });
        K.t(ctx, "22 °C로 데운 공기", RX + 222, cv.H - 18, { s: 10.5, w: "800", a: "center", c: "#b07400" });
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "22 °C 교실의 상대 습도", min: 0, max: 100, step: 1, value: 50, fmt: function (x) { return x + "%"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("상대 습도 = 실제 수증기량 ÷ 그 온도의 포화 수증기량 × 100. 공기 속 실제 수증기량은 이슬점의 포화 수증기량과 같아요. " + SRC
        + "<div data-link='{\"id\":\"kma-now\",\"title\":\"기상청 날씨누리\",\"src\":\"기상청\",\"url\":\"https://www.weather.go.kr/w/index.do\",\"ask\":\"오늘 우리 지역의 기온과 습도를 찾아 적고, 그 공기를 실내 온도 22 °C로 바꾸면(데우거나 식히면) 상대 습도가 높아질지 낮아질지 까닭과 함께 적어 오세요.\"}'></div>");
      draw();
      return {
        judge: function () {
          if (Math.abs(g - RH) <= 2) return { ok: true, msg: RD.toFixed(2) + " ÷ " + RS.toFixed(2) + " × 100 ≈ " + RH.toFixed(1) + "% — 사막만큼 건조합니다. 실내 권장 습도(40~60%)에 한참 못 미칩니다." };
          return { ok: false, msg: g + "%는 " + (g < RH ? "작습니다" : "큽니다") + ". 빨간 점(실제 수증기량)이 노란 점(22 °C에서 품을 수 있는 양)의 몇 % 인지 구하세요." };
        }
      };
    },
    hints: ["실제 수증기량 = 이슬점의 포화 수증기량 = " + RD.toFixed(2) + " g/m³.", RD.toFixed(2) + " ÷ " + RS.toFixed(2) + " × 100 ≈ ?"],
    solution: "약 <b>" + Math.round(RH) + "%</b>.",
    why: "차가운 공기는 품을 수 있는 수증기가 적어서, 수증기가 조금만 있어도 상대 습도가 높게 나옵니다. 그 공기를 데우면 품을 수 있는 양(포화 수증기량)은 몇 배로 커지는데 실제 수증기는 그대로라 상대 습도가 뚝 떨어집니다. 겨울 교실이 건조하고 목이 따가우며 정전기가 잘 생기는 까닭입니다.<br>"
      + "‘바깥 습도가 높은데 왜 실내가 건조하지?’라는 물음은 상대 습도와 실제 수증기량을 구별하면 풀립니다. 과학적 문제 해결은 이렇게 현상을 정확한 양으로 바꾸어 보는 데서 시작합니다."
  },
  {
    id: "r2", sec: "02", tag: "실제 자료 · 가습 계획", title: "가습기는 물을 얼마나 내보내야 할까", short: "가습할 물",
    who: "🫧", name: "학급 환경 도우미",
    say: "“가로 9 m, 세로 7 m, 높이 3 m 교실(" + VOL + " m³)의 공기를 22 °C에서 <b>상대 습도 40%</b>로 맞추려면 물이 얼마나 필요할까요? 바깥에서 들어온 1월 공기의 수증기량에서 시작해 <b>더 넣어야 할 수증기(kg)</b>를 구해 주세요. 환기는 잠시 없다고 칩니다.”",
    predict: {
      q: "교실 하나를 40%로 맞추는 데 필요한 물은 대략 얼마일까요?",
      options: ["㉠ 몇 방울(1 g 쯤)", "㉡ 생수 한두 병(1 kg 쯤)", "㉢ 욕조 하나(200 kg 쯤)"],
      answer: 1
    },
    task: "더 넣어야 할 수증기를 슬라이더로 맞추세요(± 0.1 kg).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(260), ctx = cv.ctx, W = cv.W, g = 0;
      var IR = K.iso({ ox: 150, oy: 62, s: .9, L: 180, D: 140 });
      function draw() {
        H.paper(ctx, W, cv.H);
        var RZ = 60, i;
        var rc = IR.P(90, 70, 0); kShadow(ctx, rc.x + 10, rc.y + 40, 200, 26, .25);
        IR.box(ctx, -4, -4, -8, 0, 0, RZ, "#c9ccd2", "#9aa0aa", "#9aa0aa");
        IR.box(ctx, -4, 0, -8, 0, 140, RZ, "#c9ccd2", "#9aa0aa", "#e9e4da");
        IR.box(ctx, 0, -4, -8, 180, 0, RZ, "#c9ccd2", "#efeae1", "#9aa0aa");
        IR.box(ctx, 0, 0, -8, 180, 140, 0, "#c9a777", "#8d8f96", "#6f727a");
        IR.box(ctx, 120, 90, 0, 136, 102, 18, "#f1f4f8", "#d4dae3", "#aeb7c4");
        var nz = IR.P(128, 96, 18); for (i = 0; i < 8; i++) { ctx.fillStyle = "rgba(90,150,225,.6)"; ctx.beginPath(); ctx.arc(nz.x + Math.sin(i) * 5, nz.y - 6 - i * 7, 2.2, 0, 6.2832); ctx.fill(); }
        IR.quad(ctx, IR.P(0, 140, 0), IR.P(180, 140, 0), IR.P(180, 140, RZ), IR.P(0, 140, RZ), "rgba(150,200,255,.12)", "rgba(60,90,140,.5)");
        IR.quad(ctx, IR.P(180, 0, 0), IR.P(180, 140, 0), IR.P(180, 140, RZ), IR.P(180, 0, RZ), "rgba(120,175,240,.14)", "rgba(60,90,140,.5)");
        var d1 = IR.P(90, 140, -8), d2 = IR.P(180, 70, -8), d3 = IR.P(0, 140, 30);
        K.t(ctx, "9 m", d1.x - 10, d1.y + 18, { s: 12, w: "900", a: "center", c: LT.ink });
        K.t(ctx, "7 m", d2.x + 16, d2.y + 12, { s: 12, w: "900", c: LT.ink });
        K.t(ctx, "3 m", d3.x - 8, d3.y, { s: 12, w: "900", a: "right", c: LT.ink });
        /* 더 넣을 물 = 2 L 병 */
        kGlass(ctx, 470, 232, 20, 92, Math.min(1, g / 2) * 86, "rgba(60,140,220,.6)");
        ctx.fillStyle = "#2f6aac"; ctx.beginPath(); ctx.roundRect(462, 132, 16, 10, 3); ctx.fill();
        K.t(ctx, "2 L 병 기준", 470, 252, { s: 10.5, w: "800", a: "center", c: LT.mute });
        var RX = 530, px = RX + 16, xr = W - 16;
        K.card(ctx, RX, 8, W - RX - 8, cv.H - 16, "가습 계획 (환기 없음)");
        kRows(ctx, px, xr, 56, [["지금 수증기량 (1월 공기)", RD.toFixed(2) + " g/m³"], ["40%일 때 (22 °C)", (0.4 * RS).toFixed(2) + " g/m³"], ["교실 부피", VOL + " m³"], ["내 답 (더 넣을 물)", g.toFixed(1) + " kg", LT.orange]], 28);
        K.t(ctx, "0.40 × " + RS.toFixed(2) + " = " + (0.4 * RS).toFixed(2) + " g/m³", px, 186, { s: 11, w: "700", c: LT.mute });
        K.t(ctx, "1 kg = 1,000 g", px, 206, { s: 11, w: "700", c: LT.mute });
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "더 넣어야 할 물", min: 0, max: 5, step: 0.1, value: 0, fmt: function (x) { return x.toFixed(1) + " kg"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("필요한 물(g) = (40% 일 때 수증기량 − 지금 수증기량) × 부피. 1 kg = 1,000 g. " + SRC);
      draw();
      return {
        judge: function () {
          if (Math.abs(g - NEED) <= 0.1 + 1e-9) return { ok: true, msg: "(" + (0.4 * RS).toFixed(2) + " − " + RD.toFixed(2) + ") × " + VOL + " ≈ " + Math.round(NEED * 1000) + " g ≈ " + NEED.toFixed(1) + " kg — 큰 생수(2 L) 반 병쯤입니다. 환기를 하면 이 물이 그대로 빠져나가 계속 보충해야 합니다." };
          return { ok: false, msg: g.toFixed(1) + " kg는 " + (g < NEED ? "적습니다" : "많습니다") + ". 1 m³에 더 넣을 양을 먼저 구한 뒤 부피를 곱하세요." };
        }
      };
    },
    hints: ["1 m³에 더 넣을 양 = " + (0.4 * RS).toFixed(2) + " − " + RD.toFixed(2) + " = " + (0.4 * RS - RD).toFixed(2) + " g.", (0.4 * RS - RD).toFixed(2) + " × " + VOL + " g을 kg으로 바꾸세요."],
    solution: "약 <b>" + NEED.toFixed(1) + " kg</b>.",
    why: "물을 수증기로 만들려면 1 kg에 약 2,400 kJ의 열이 필요합니다. 그래서 젖은 수건은 천천히 마르며 교실 열을 조금 빼앗고, 가습기는 전기로 물을 잘게 쪼개거나 끓여 내보냅니다. 환기로 공기가 한 시간에 몇 번씩 바뀐다면 필요한 물도 그만큼 늘어나므로, 가습기의 시간당 분무량(mL/h)과 환기 횟수를 함께 따져야 합니다.<br>"
      + "가설(가습기·젖은 수건이 습도를 올린다)을 시험할 때 이런 어림셈을 먼저 해 두면, 실험 결과가 그럴듯한지 판단하는 기준이 생깁니다."
  }
  ]
});
})();
