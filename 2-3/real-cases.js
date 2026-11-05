/* 과학탐구실험2 Ⅰ 생활 속의 과학 탐구 — 실제 자료
   r1 우주 정거장의 속력 — 국제 우주 정거장(ISS)의 실제 궤도 주기와 높이로 속력 구하기
   r2 경주와 포항, 어느 지진이 더 컸나 — USGS 목록과 기상청 발표가 다른 까닭
   r3 우리 동네 속설 검증 — 삼한사온은 진짜일까(창원 2025~26 겨울)
   자료: data/satcat.js (CelesTrak 위성 목록), data/usgs-korea.js (USGS 지진 목록), data/cw155.js */
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
var S = window.REAL_SAT || { iss: ["ISS (ZARYA)", 92.98, 425, 416, 51.63] }, Q = window.REAL_EQ || { rows: [] };
var I = S.iss, RE = 6371, HM = (I[2] + I[3]) / 2, V = 2 * Math.PI * (RE + HM) / (I[1] * 60);
var EQ = Q.rows;                                       /* [날짜, 규모, 종류, 위도, 경도, 깊이, 설명] */
var BIG = 0; EQ.forEach(function (r, i) { if (r[1] > EQ[BIG][1]) BIG = i; });
var KO = { Gyeongju: "경주", Heunghae: "포항(흥해)", Pohang: "포항", Sinan: "신안", Ulsan: "울산", Pyeongchang: "평창", "T’aebaek": "태백", Kyosai: "거제", Santyoku: "삼척", Tonghae: "동해", Sokcho: "속초", Gaigeturi: "제주", Iksan: "익산", Mungyeong: "문경", Puan: "부안", Ongjin: "옹진" };
var DK = { N: "북", S: "남", E: "동", W: "서" };
function where(r) { var m = /^(\d+)\s?km\s+([NSEW]+)\s+of\s+(.+?),/.exec(r[6]); if (m) { var n = KO[m[3]] || m[3]; return +m[1] >= 30 ? n + " " + m[2].split("").map(function (c) { return DK[c]; }).join("") + "쪽 " + m[1] + " km" : n; } return "북위 " + r[3].toFixed(1) + "°, 동경 " + r[4].toFixed(1) + "°"; }
var SRC1 = "<small>출처: CelesTrak 위성 목록(SATCAT) — 국제 우주 정거장 " + I[0] + " 의 궤도 주기 " + I[1] + " 분, 원지점 " + I[2] + " km, 근지점 " + I[3] + " km, 궤도 기울기 " + I[4] + "°. 정거장은 공기 저항으로 조금씩 낮아져 가끔 엔진으로 높이를 올립니다. 사본은 data/satcat.js.</small>";
var SRC2 = "<small>출처: 미국 지질조사국(USGS) 지진 목록 — 남한과 둘레 바다에서 1990~2025년 규모 2.5 이상으로 기록된 지진 " + EQ.length + "건(세계 관측망 기준이라 작은 지진은 빠진 것이 많음). 기상청 발표 규모(국지 규모 ML): 2016년 경주 5.8, 2017년 포항 5.4. 사본은 data/usgs-korea.js.</small>";
var ZW = (window.REAL_CW155 || {}).winter2526 || [];      /* 2025-12-01 ~ 2026-02-28 날마다 평균 기온 */
var ZWS = ZW.map(function (v, i) { var a = ZW.slice(Math.max(0, i - 1), i + 2); return a.reduce(function (s, x) { return s + x; }, 0) / a.length; });
var ZMIN = []; for (var zi = 2; zi < ZWS.length - 2; zi++) { var zok = true; for (var zj = zi - 2; zj <= zi + 2; zj++) if (ZWS[zj] < ZWS[zi]) zok = false; if (zok) ZMIN.push(zi); }
var ZGAPS = ZMIN.slice(1).map(function (v, i) { return v - ZMIN[i]; });
var Z_AVG = ZMIN.length > 1 ? (ZMIN[ZMIN.length - 1] - ZMIN[0]) / (ZMIN.length - 1) : 7;
function zW(i) { var t = new Date(Date.UTC(2025, 11, 1) + i * 864e5); return (t.getUTCMonth() + 1) + "/" + t.getUTCDate(); }
var SRC_Z = "<small>출처: 기상청 날씨누리 과거 관측 일별 자료, 창원(155) 2025년 12월 1일 ~ 2026년 2월 28일 날마다 평균 기온. ‘추운 고비’는 사흘씩 평균한 기온이 앞뒤 이틀보다 낮은 날. 사본은 data/cw155.js.</small>";

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료로 측정값을 비교할 때 단위·기준을 확인해야 하는 까닭을 설명해 보세요.",
  cases: [
  {
    id: "r1", sec: "01", tag: "실제 자료 · 원운동", title: "우주 정거장의 속력", short: "ISS의 속력",
    who: "🛰️", name: "우주 딸기 실험팀",
    say: "“우리 딸기 간식이 실려 갈 국제 우주 정거장은 지구 둘레를 쉬지 않고 돌아요. 위성 목록에 적힌 <b>실제 궤도 주기</b>와 <b>높이</b>로 정거장의 <b>속력(km/s)</b>을 구해 주세요. 지구 반지름은 6,371 km, 궤도는 원이라고 칩니다.”",
    predict: {
      q: "우주 정거장은 대략 얼마나 빠를까요?",
      options: ["㉠ 여객기쯤 (0.25 km/s)", "㉡ 소리의 몇 배 (1 km/s)", "㉢ 소리의 20배 넘게 (수 km/s)"],
      answer: 2
    },
    task: "정거장의 속력을 슬라이더로 맞추세요(± 0.1 km/s).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, g = 3;
      function draw() {
        /* 입체 미니어처: 스튜디오에 띄운 지구본과 실제 비율로 그린 궤도 고리(지구에 바짝 붙어 있음), 고리 앞쪽의 정거장 모형과 속도 화살표 */
        var CH = cv.H, LW = 600, cx = 300, cy = 168, r = 104, ro = r * (RE + HM) / RE, k;
        ctx.clearRect(0, 0, W, CH);
        K.studio(ctx, 0, 0, LW, CH, null);
        floorSh(ctx, cx + 10, cy + r + 18, 150, 16, .3);
        ctx.save(); ctx.strokeStyle = "rgba(232,89,12,.55)"; ctx.lineWidth = 2.2; ctx.setLineDash([6, 5]);
        ctx.beginPath(); ctx.ellipse(cx, cy, ro, ro * .32, -0.18, Math.PI, 2 * Math.PI); ctx.stroke(); ctx.restore();
        var eg = ctx.createRadialGradient(cx - r * .4, cy - r * .45, r * .1, cx, cy, r);
        eg.addColorStop(0, "#d0ebff"); eg.addColorStop(.45, "#339af0"); eg.addColorStop(1, "#1c4f8a");
        ctx.fillStyle = eg; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.2832); ctx.fill();
        ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.2832); ctx.clip();
        ctx.fillStyle = "rgba(81,207,102,.85)";
        [[-30, -30, 34, 22, .5], [30, 10, 30, 40, -.3], [-50, 40, 20, 14, .2], [50, -50, 22, 12, .8]].forEach(function (q) { ctx.beginPath(); ctx.ellipse(cx + q[0], cy + q[1], q[2], q[3], q[4], 0, 6.2832); ctx.fill(); });
        ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.beginPath(); ctx.ellipse(cx, cy - r + 10, 40, 10, 0, 0, 6.2832); ctx.fill();
        ctx.restore();
        ctx.save(); ctx.strokeStyle = "#e8590c"; ctx.lineWidth = 2.4; ctx.setLineDash([6, 5]);
        ctx.beginPath(); ctx.ellipse(cx, cy, ro, ro * .32, -0.18, 0, Math.PI); ctx.stroke(); ctx.restore();
        var an = 0.55, sx = cx + ro * Math.cos(an) * Math.cos(-0.18) - ro * .32 * Math.sin(an) * Math.sin(-0.18), sy = cy + ro * Math.cos(an) * Math.sin(-0.18) + ro * .32 * Math.sin(an) * Math.cos(-0.18);
        ctx.fillStyle = "#4dabf7"; ctx.fillRect(sx - 20, sy - 4, 13, 8); ctx.fillRect(sx + 7, sy - 4, 13, 8);
        ctx.strokeStyle = "#1c4f8a"; ctx.lineWidth = 1; ctx.strokeRect(sx - 20, sy - 4, 13, 8); ctx.strokeRect(sx + 7, sy - 4, 13, 8);
        ctx.fillStyle = metalG(ctx, sx - 6, 0, sx + 6, 0); ctx.fillRect(sx - 6, sy - 3, 12, 6);
        K.arrow(ctx, { x: sx + 4, y: sy + 8 }, { x: sx - 60, y: sy + 26 }, LT.orange, 3, 11);
        tag(ctx, "국제 우주 정거장", sx + 26, sy + 2, LT.orange, "left", [0, LW]);
        tag(ctx, "지구 반지름 6,371 km", cx - r - 10, cy + 6, LT.blue, "right", [0, LW]);
        K.warn(ctx, LW - 12, CH - 10, "⚠ 궤도 높이는 실제 비율 · 정거장 크기는 과장", "right");
        K.bigText(ctx, "한 바퀴 " + I[1] + "분", 16, 40, 24, "#ffffff");
        K.bigText(ctx, "평균 높이 " + HM + " km", 16, 64, 14, "#ffd35a");
        var cd = sideCard(ctx, LW + 10, W, CH, "정거장의 속력 구하기");
        K.row(ctx, "궤도 주기", I[1] + " 분", cd.px, cd.R, 60);
        K.row(ctx, "평균 높이", HM + " km", cd.px, cd.R, 86);
        K.row(ctx, "궤도 반지름", (RE + HM).toLocaleString() + " km", cd.px, cd.R, 112, LT.orange);
        lt(ctx, g.toFixed(2) + " km/s", cd.px, 160, { s: 24, w: "900", c: LT.blue });
        lt(ctx, "내 답", cd.R, 160, { s: 11, a: "right", c: LT.mute });
        K.tip(ctx, "속력 = 2π × 궤도 반지름 ÷ 주기(초)", cd.px - 4, 180, cd.w + 8, null);
        lt(ctx, "지구 반지름에 높이를 더해야 궤도 반지름", cd.px, 240, { s: 11, w: "600", c: LT.mute });
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "정거장의 속력", min: 3, max: 12, step: 0.05, value: 3, fmt: function (x) { return x.toFixed(2) + " km/s"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("속력 = 한 바퀴 거리 ÷ 걸린 시간 = 2 × 3.14 × 궤도 반지름 ÷ (주기를 초로). " + SRC1
        + "<div data-link='{\"id\":\"spot-station\",\"title\":\"Spot the Station\",\"src\":\"미국 항공우주국\",\"url\":\"https://www.nasa.gov/spot-the-station/\",\"ask\":\"쪽 가운데 ‘View Sightings by City’에서 Country 는 South Korea, City 는 Pusan(부산, 우리 학교에서 가장 가까운 곳)을 골라, 국제 우주 정거장이 하늘을 지나가는 다음 날짜·시각과 보이는 시간(분)을 적어 오세요.\"}'></div>");
      draw();
      return {
        judge: function () {
          if (Math.abs(g - V) <= 0.1 + 1e-9) return { ok: true, msg: "2 × 3.14 × " + (RE + HM).toLocaleString() + " km ÷ " + Math.round(I[1] * 60).toLocaleString() + " s ≈ " + V.toFixed(2) + " km/s — 시속 약 " + Math.round(V * 3600).toLocaleString() + " km, 하루에 지구를 약 " + (1440 / I[1]).toFixed(1) + " 바퀴 돕니다." };
          return { ok: false, msg: g.toFixed(2) + " km/s는 " + (g < V ? "느립니다" : "빠릅니다") + ". 궤도 반지름에 지구 반지름을 더했는지, 주기를 초로 바꾸었는지 확인하세요." };
        }
      };
    },
    hints: ["한 바퀴 거리 = 2 × 3.14 × " + (RE + HM) + " ≈ " + Math.round(2 * 3.14 * (RE + HM)).toLocaleString() + " km.", "주기 = " + I[1] + " × 60 ≈ " + Math.round(I[1] * 60).toLocaleString() + " s. 거리 ÷ 시간 = ?"],
    solution: "약 <b>" + V.toFixed(2) + " km/s</b>.",
    why: "정거장은 지구 쪽으로 계속 떨어지고 있지만 옆으로 아주 빠르게 움직여, 떨어지는 만큼 지구 표면이 둥글게 멀어지므로 땅에 닿지 않습니다. 이 높이에서 원 궤도를 돌려면 약 7.7 km/s가 필요합니다. 정거장 안의 사람과 물건이 함께 떨어지고 있어서 무게를 느끼지 않는 ‘무중력 상태’가 됩니다.<br>"
      + "그래서 우주에서 키운 식물은 위아래를 중력으로 알 수 없어, 뿌리가 아무 방향으로나 뻗기도 합니다. 우주 딸기 실험이 확인하려는 것도 이런 차이입니다."
  },
  {
    id: "r2", sec: "03", tag: "실제 자료 · 측정의 기준", title: "경주와 포항, 어느 지진이 더 컸나", short: "두 지진의 규모",
    who: "🌐", name: "지진 자료 분석실",
    say: "“기상청은 2016년 경주 지진을 규모 <b>5.8</b>, 2017년 포항 지진을 <b>5.4</b>로 발표했어요. 그런데 미국 지질조사국(USGS)의 <b>실제 목록</b>을 보면 순서가 달라 보입니다. 목록에서 <b>가장 큰 지진</b>을 찾고, 두 기관의 값이 다른 까닭을 골라 주세요.”",
    predict: {
      q: "같은 지진의 규모를 두 기관이 다르게 발표했다면, 가장 먼저 무엇을 확인해야 할까요?",
      options: ["㉠ 어느 기관이 거짓말을 했는지", "㉡ 두 기관이 규모를 어떤 방법(척도)으로 쟀는지", "㉢ 지진이 일어난 시각"],
      answer: 1
    },
    task: "USGS 목록에서 가장 큰 지진을 고르고, 두 기관 값이 다른 까닭을 고르세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(320), ctx = cv.ctx, W = cv.W, i = 0, why = "none";
      function draw() {
        /* 밝은 스튜디오: 연도별 지진 규모 그래프(고른 지진 강조) + 오른쪽 작은 땅 블록 모형에 고른 지진의 진원 깊이 표시, 판정 카드 */
        var CH = cv.H, LW = 610, r = EQ[i] || ["", 0, "", 0, 0, 0, ""];
        ctx.clearRect(0, 0, W, CH);
        K.studio(ctx, 0, 0, LW, CH, null);
        var gg = K.chart(ctx, { x: 8, y: 76, w: 440, h: CH - 82, light: true, pl: 40, x0: 1990, x1: 2026, y0: 2.5, y1: 6, xt: 4, yt: 7, xf: function (v) { return Math.round(v) + ""; }, yf: function (v) { return v.toFixed(1); } });
        function Xd(d) { return gg.X(+d.slice(0, 4) + (+d.slice(5, 7) - 1) / 12); }
        EQ.forEach(function (q, j) { if (j === i) return; ctx.fillStyle = "rgba(28,126,214,.55)"; ctx.beginPath(); ctx.arc(Xd(q[0]), gg.Y(q[1]), 3.6, 0, 6.2832); ctx.fill(); });
        if (EQ[i]) { var hx = Xd(r[0]), hy = gg.Y(r[1]); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(hx, hy, 9, 0, 6.2832); ctx.fill(); ctx.fillStyle = LT.orange; ctx.beginPath(); ctx.arc(hx, hy, 6.5, 0, 6.2832); ctx.fill(); tag(ctx, r[1].toFixed(1), hx, hy - 14, LT.orange, "center", [gg.L, gg.R]); }
        tag(ctx, "USGS가 기록한 남한 둘레 지진의 규모", gg.L + 6, gg.T + 18, LT.ink, "left", [gg.L, gg.R]);
        var IB = K.iso({ ox: 530, oy: 120, s: 0.6, L: 120, D: 90 }), P = IB.P, Z = 120;
        floorSh(ctx, 535, 270, 90, 12, .28);
        [[0, 30, "#7a5c45"], [30, 70, "#9c7a5a"], [70, 110, "#b8956b"], [110, Z, "#7cae55"]].forEach(function (q) {
          IB.quad(ctx, P(0, 90, q[0] - Z), P(120, 90, q[0] - Z), P(120, 90, q[1] - Z), P(0, 90, q[1] - Z), q[2]);
          IB.quad(ctx, P(120, 0, q[0] - Z), P(120, 90, q[0] - Z), P(120, 90, q[1] - Z), P(120, 0, q[1] - Z), K.tint(q[2], .72));
        });
        IB.plane(ctx, 0, "#8fbf62");
        var dz = -Math.min(40, r[5] || 0) / 40 * Z, hp = P(60, 90, dz), ep = P(60, 90, 0);
        K.line(ctx, ep, hp, "rgba(224,49,49,.8)", 1.6, [3, 3]);
        for (var w = 1; w <= 3; w++) { ctx.strokeStyle = "rgba(224,49,49," + (0.6 - w * .15) + ")"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(hp.x, hp.y, w * 9, 0, 6.2832); ctx.stroke(); }
        K.bigText(ctx, "✸", hp.x - 9, hp.y + 7, 18, "#ff6b6b");
        tag(ctx, "깊이 " + (r[5] || 0) + " km", hp.x + 26, hp.y + 4, LT.red, "left", [440, LW]);
        lt(ctx, "0 km", P(0, 90, 0).x - 6, P(0, 90, 0).y + 4, { s: 9.5, w: "600", a: "right", c: LT.mute });
        lt(ctx, "40 km", P(0, 90, -Z).x - 6, P(0, 90, -Z).y + 4, { s: 9.5, w: "600", a: "right", c: LT.mute });
        K.bigText(ctx, "규모 " + (r[1] ? r[1].toFixed(1) : "-") + " (" + (r[2] || "") + ")", 16, 40, 22, i === BIG ? "#8ff0c4" : "#ffffff");
        K.bigText(ctx, r[0] + " · " + where(r), 16, 64, 14, "#ffd35a");
        var cd = sideCard(ctx, LW + 10, W, CH, "고른 지진");
        K.row(ctx, "날짜", r[0], cd.px, cd.R, 60, LT.orange);
        K.row(ctx, "곳", where(r), cd.px, cd.R, 86);
        K.row(ctx, "USGS 규모", r[1].toFixed(1) + " (" + r[2] + ")", cd.px, cd.R, 112, LT.blue);
        K.row(ctx, "깊이", r[5] + " km", cd.px, cd.R, 138);
        var WHY = { none: "고르지 않음", scale: "척도가 달라서", wrong: "한 기관이 잘못 재서", deep: "포항이 더 깊어서" };
        K.row(ctx, "내가 고른 까닭", WHY[why] || "", cd.px, cd.R, 164, LT.violet);
        K.tip(ctx, i === BIG ? "목록에서 가장 큰 지진입니다" : "더 큰 지진이 있습니다", cd.px - 4, 184, cd.w + 8, i === BIG ? true : null);
        lt(ctx, "mww = 모멘트 규모 · 기상청 ML = 국지 규모", cd.px, 246, { s: 10.5, w: "600", c: LT.mute });
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "지진 (날짜 순)", min: 0, max: Math.max(0, EQ.length - 1), step: 1, value: 0, fmt: function (x) { return EQ[x] ? EQ[x][0] + " " + where(EQ[x]) : ""; }, onInput: function (x) { i = x; api.changed(); draw(); } });
      api.seg({ label: "두 기관 값이 다른 까닭", value: "none", options: [{ v: "scale", t: "규모를 재는 방법(척도)이 달라서" }, { v: "wrong", t: "한 기관이 잘못 재서" }, { v: "deep", t: "포항 지진이 더 깊어서" }], onPick: function (x) { why = x; api.changed(); } });
      api.info("규모 종류: mww·mwr·mwb·mwc·mw = 모멘트 규모(Mw, 단층이 미끄러진 넓이·거리로 구함), mb = 실체파 규모, ml = 국지 규모. 기상청의 ML은 가까운 지진계의 흔들림 크기로 구하는 국지 규모입니다. " + SRC2
        + "<div data-link='{\"id\":\"kma-eqk\",\"title\":\"국내 지진 조회\",\"src\":\"기상청\",\"url\":\"https://www.weather.go.kr/w/earthquake-volcano/search/korea.do\",\"ask\":\"2016년 9월 12일 경주 지진과 2017년 11월 15일 포항 지진을 찾아, 기상청이 발표한 규모와 진앙의 깊이를 적고 USGS 값과 비교해 오세요.\"}'></div>");
      draw();
      return {
        judge: function () {
          if (i !== BIG) return { ok: false, msg: (EQ[i] ? EQ[i][0] + " " + where(EQ[i]) + " 지진은 규모 " + EQ[i][1].toFixed(1) : "") + " 입니다. 더 큰 지진이 있습니다." };
          if (why !== "scale") return { ok: false, msg: "지진은 맞았습니다. " + (why === "deep" ? "오른쪽 판을 보세요 — 두 지진의 깊이는 비슷합니다." : why === "wrong" ? "둘 다 정상적인 측정입니다. 오른쪽 판의 ‘규모 종류’를 보세요." : "까닭을 골라 주세요.") };
          return { ok: true, msg: EQ[BIG][0] + " " + where(EQ[BIG]) + " 지진, USGS 규모 " + EQ[BIG][1].toFixed(1) + "(" + EQ[BIG][2] + ") — USGS의 모멘트 규모로는 포항(5.5)이 경주(5.4)보다 조금 크고, 기상청의 국지 규모로는 경주(5.8)가 포항(5.4)보다 큽니다. 같은 지진이라도 척도가 다르면 값이 다릅니다." };
        }
      };
    },
    hints: ["가장 높은 점으로 옮기세요. 2016년과 2017년 가을에 큰 점이 있어요.", "오른쪽 판의 규모 종류(mww)와 기상청 ML은 서로 다른 척도입니다."],
    solution: "<b>" + (EQ[BIG] ? EQ[BIG][0] + " " + where(EQ[BIG]) : "2017-11-15 포항") + "</b>, 규모를 재는 척도가 달라서.",
    why: "지진의 규모는 하나의 정해진 값이 아니라, 무엇을 재어 계산하느냐에 따라 여러 척도가 있습니다. 국지 규모(ML)는 가까운 지진계에 기록된 흔들림의 최대 크기로, 모멘트 규모(Mw)는 단층의 넓이와 미끄러진 거리로 구합니다. 큰 지진일수록 Mw가 에너지를 더 잘 나타내 국제 비교에 쓰입니다. 규모가 1 커지면 에너지는 약 32 배가 됩니다.<br>"
      + "포항 지진은 규모에 비해 피해가 컸는데, 진원이 얕고 무른 퇴적층 위에 도시가 있었기 때문입니다. 정부 조사 연구단은 2019년, 이 지진이 근처 지열 발전소의 물 주입으로 촉발되었다고 결론 내렸습니다. 피해에는 규모뿐 아니라 깊이·땅의 성질·건물의 흔들림(공진)이 함께 작용합니다."
  },
  {
    id: "r3", sec: "04", tag: "실제 자료 · 우리 동네 속설 검증", title: "‘삼한사온’은 진짜일까 — 지난겨울 창원", short: "삼한사온",
    who: "📍", name: "창원기상대(기상청)",
    say: "“‘사흘 춥고 나흘 따뜻하다(삼한사온)’는 말이 맞다면, 추운 고비가 <b>7일마다</b> 규칙적으로 와야 합니다. 아래는 진해와 가까운 <b>창원기상대</b>의 지난겨울(2025년 12월 ~ 2026년 2월) 날마다 평균 기온이고, 파란 점이 <b>추운 고비</b>예요. 첫 고비부터 마지막 고비까지 평균 며칠마다 추위가 왔는지 구해 주세요.”",
    predict: {
      q: "속설이 맞는지 알아보려면 어떻게 해야 할까요?",
      options: ["㉠ 어른들이 오래 써 온 말이니 맞다고 본다", "㉡ ‘7일마다 추위가 온다’처럼 확인할 수 있는 예측으로 바꿔 실제 자료와 견준다", "㉢ 지난주 날씨 하나만 보고 정한다"],
      answer: 1
    },
    task: "<b>(마지막 고비 날 − 첫 고비 날) ÷ (고비 수 − 1)</b>을 슬라이더로 맞추세요(± 0.5일).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(320), ctx = cv.ctx, W = cv.W, k = 3;
      var x0 = 50, x1 = 640, y0 = 24, y1 = 250, n = ZW.length || 1;
      function X(i) { return x0 + i / (n - 1) * (x1 - x0); }
      function Y(t) { return y1 - (t + 6) / 22 * (y1 - y0); }
      function draw() {
        /* 밝은 스튜디오: 창원 겨울 날마다 평균 기온(회색) + 사흘 평균(빨강) + 추운 고비(파란 점) 밝은 그래프, 오른쪽 판정 카드 */
        var CH = cv.H, LW = 640, n = ZW.length || 1;
        ctx.clearRect(0, 0, W, CH);
        K.studio(ctx, 0, 0, LW, CH, null);
        var gg = K.chart(ctx, { x: 8, y: 76, w: LW - 16, h: CH - 82, light: true, pl: 40, x0: 0, x1: Math.max(1, n - 1), y0: -6, y1: 16, xt: 3, yt: 4,
          xf: function (v) { return zW(Math.round(v)); }, yf: function (v) { return Math.round(v) + "°"; } });
        ctx.fillStyle = "rgba(28,126,214,.07)"; ctx.fillRect(gg.L, gg.Y(0), gg.R - gg.L, gg.B - gg.Y(0));
        K.plot(ctx, gg, ZW.map(function (v, j) { return [j, v]; }), "#adb5bd", { light: true, w: 1.4, glow: false });
        K.plot(ctx, gg, ZWS.map(function (v, j) { return [j, v]; }), LT.red, { light: true, w: 2.6 });
        ZMIN.forEach(function (j, q) {
          var px = gg.X(j), py = gg.Y(ZWS[j]);
          ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(px, py, 6.5, 0, 6.2832); ctx.fill(); ctx.fillStyle = LT.blue; ctx.beginPath(); ctx.arc(px, py, 4.6, 0, 6.2832); ctx.fill();
          lt(ctx, zW(j), px, py + (q % 2 ? 30 : 18), { s: 9.5, w: "800", a: "center", c: LT.blue });
        });
        tag(ctx, "회색 = 날마다 · 빨강 = 사흘 평균 · 파란 점 = 추운 고비", gg.L + 6, gg.T + 18, LT.ink, "left", [gg.L, gg.R]);
        K.bigText(ctx, "추운 고비 " + ZMIN.length + "번", 16, 40, 24, "#ffffff");
        K.bigText(ctx, "창원 2025년 12월 ~ 2026년 2월", 16, 64, 14, "#ffd35a");
        var cd = sideCard(ctx, LW + 10, W, CH, "삼한사온 검증");
        K.row(ctx, "추운 고비 수", ZMIN.length + "번", cd.px, cd.R, 60, LT.blue);
        K.row(ctx, "첫 → 마지막", ZMIN.length ? zW(ZMIN[0]) + " → " + zW(ZMIN[ZMIN.length - 1]) : "", cd.px, cd.R, 86);
        K.row(ctx, "그 사이 날 수", ZMIN.length ? (ZMIN[ZMIN.length - 1] - ZMIN[0]) + "일" : "", cd.px, cd.R, 112);
        lt(ctx, k.toFixed(1) + "일마다", cd.px, 160, { s: 24, w: "900", c: LT.violet });
        lt(ctx, "내 답", cd.R, 160, { s: 11, a: "right", c: LT.mute });
        K.tip(ctx, "간격 수 = 고비 수 − 1", cd.px - 4, 180, cd.w + 8, null);
        lt(ctx, "속설도 예측으로 바꾸면 시험할 수 있습니다.", cd.px, 240, { s: 10.5, w: "600", c: LT.mute });
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "추위가 오는 평균 간격", min: 2, max: 14, step: 0.1, value: 3, fmt: function (x) { return x.toFixed(1) + "일"; }, onInput: function (x) { k = x; api.changed(); draw(); } });
      api.info("회색 선은 날마다 평균 기온, 빨간 선은 사흘씩 평균해 들쭉날쭉함을 줄인 선입니다. 고비가 n번이면 그 사이 간격은 n − 1개입니다. " + SRC_Z);
      draw();
      return {
        judge: function () {
          if (Math.abs(k - Z_AVG) <= 0.5) return { ok: true, msg: "평균 " + Z_AVG.toFixed(1) + "일마다 추위가 왔습니다 — 7일에 가깝습니다. 하지만 간격 하나하나는 " + Math.min.apply(null, ZGAPS) + " ~ " + Math.max.apply(null, ZGAPS) + "일로 들쭉날쭉했습니다." };
          return { ok: false, msg: k.toFixed(1) + "일은 " + (k < Z_AVG ? "짧습니다" : "깁니다") + ". 오른쪽 ‘그 사이 날 수’를 (고비 수 − 1)로 나누세요." };
        }
      };
    },
    hints: ["그 사이 날 수 = " + (ZMIN.length ? (ZMIN[ZMIN.length - 1] - ZMIN[0]) : 0) + "일, 간격 수 = " + (ZMIN.length - 1) + "개", (ZMIN.length ? (ZMIN[ZMIN.length - 1] - ZMIN[0]) : 0) + " ÷ " + (ZMIN.length - 1) + " = ?"],
    solution: (ZMIN.length ? (ZMIN[ZMIN.length - 1] - ZMIN[0]) : 0) + " ÷ " + (ZMIN.length - 1) + " ≈ <b>" + Z_AVG.toFixed(1) + "일</b> (간격 하나하나: " + ZGAPS.join(", ") + "일).",
    why: "지난겨울 창원에서 추위는 평균 " + Z_AVG.toFixed(1) + "일마다 찾아와 ‘일주일 안팎’이라는 삼한사온의 느낌과 비슷했습니다. 겨울에 시베리아 고기압이 세졌다 약해졌다를 되풀이하며 찬 공기를 몇 날씩 내려보내기 때문입니다. 하지만 간격 하나하나는 " + Math.min.apply(null, ZGAPS) + "일부터 " + Math.max.apply(null, ZGAPS) + "일까지 들쭉날쭉해서, ‘사흘 춥고 나흘 따뜻하다’는 정확한 규칙이라기보다 대강의 경향입니다.<br>"
      + "유사과학과 과학을 가르는 것은 ‘확인할 수 있는 예측을 내놓고, 자료로 시험받는가’입니다. 속설도 이렇게 예측으로 바꿔 자료와 견주면 어디까지 맞고 어디부터 틀리는지 알 수 있습니다. 한 겨울만 보았으니 다른 해 겨울도 날씨누리에서 확인해 보세요."
  }
  ]
});
})();
