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

function curve(H, ctx, W, CH) {
  H.paper(ctx, W, CH);
  var x0 = 60, x1 = 560, y0 = 26, y1 = CH - 36;
  function X(t) { return x0 + (t + 15) / 50 * (x1 - x0); }
  function Y(v) { return y1 - v / 40 * (y1 - y0); }
  H.axes(ctx, x0, y0, x1, y1);
  [0, 10, 20, 30, 40].forEach(function (v) { H.text(ctx, v, x0 - 6, Y(v) + 4, { s: 10, a: "right", c: H.v("--mist") }); });
  [-10, 0, 10, 20, 30].forEach(function (t) { H.text(ctx, t + "°", X(t), y1 + 15, { s: 10, a: "center", c: H.v("--mist") }); });
  var pts = []; for (var t = -15; t <= 35; t += 0.5) pts.push([X(t), Y(rho(t))]);
  H.line(ctx, pts, H.v("--brand"), 2.5);
  H.text(ctx, "포화 수증기량 (g/m³) — 그 온도에서 공기 1 m³가 품을 수 있는 수증기의 최대량", x0 + 6, y0 - 10, { s: 11, w: "700", c: H.v("--mist") });
  H.dash(ctx, X(DJ), Y(RD), X(IN), Y(RD), H.v("--coral-700"), 1.6);
  H.dash(ctx, X(IN), Y(RD), X(IN), Y(RS), H.v("--amber-700"), 1.6);
  H.dot(ctx, X(DJ), Y(RD), 6, H.v("--coral-700")); H.dot(ctx, X(IN), Y(RS), 6, H.v("--amber-700")); H.dot(ctx, X(IN), Y(RD), 5, H.v("--ink"));
  H.text(ctx, "이슬점 " + DJ.toFixed(1) + "°", X(DJ) + 4, Y(RD) - 10, { s: 10.5, w: "800", c: H.v("--coral-700") });
  H.text(ctx, "교실 22°", X(IN) + 8, Y(RS) + 4, { s: 10.5, w: "800", c: H.v("--amber-700") });
  return { X: X, Y: Y };
}

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료로 겨울 교실이 건조한 까닭과 가습 계획을 설명해 보세요.",
  cases: [
  {
    id: "r1", tag: "실제 자료 · 상대 습도", title: "난방한 교실의 습도", short: "데운 공기의 습도",
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
        H.rows(ctx, 610, 30, [["이슬점 " + DJ.toFixed(1) + " °C의 포화 수증기량", RD.toFixed(2) + " g/m³", "--coral-700"], ["22 °C의 포화 수증기량", RS.toFixed(2) + " g/m³", "--amber-700"], ["내 답 (상대 습도)", g + "%", null, true]], 62);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "22 °C 교실의 상대 습도", min: 0, max: 100, step: 1, value: 50, fmt: function (x) { return x + "%"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("상대 습도 = 실제 수증기량 ÷ 그 온도의 포화 수증기량 × 100. 공기 속 실제 수증기량은 이슬점의 포화 수증기량과 같아요. " + SRC
        + "<div data-link='{\"id\":\"kma-now\",\"title\":\"기상청 날씨누리\",\"src\":\"기상청\",\"url\":\"https://www.weather.go.kr/w/index.do\",\"ask\":\"오늘 우리 지역의 기온과 습도를 찾아 적고, 그 공기를 22 °C로 데우면 상대 습도가 높아질지 낮아질지 까닭과 함께 적어 오세요.\"}'></div>");
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
    id: "r2", tag: "실제 자료 · 가습 계획", title: "가습기는 물을 얼마나 내보내야 할까", short: "가습할 물",
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
      function draw() {
        H.paper(ctx, W, cv.H);
        ctx.save(); ctx.strokeStyle = H.v("--line"); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(60, 200); ctx.lineTo(300, 200); ctx.lineTo(380, 150); ctx.lineTo(380, 50); ctx.lineTo(140, 50); ctx.lineTo(60, 100); ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(60, 100); ctx.lineTo(300, 100); ctx.lineTo(380, 50); ctx.moveTo(300, 100); ctx.lineTo(300, 200); ctx.stroke(); ctx.restore();
        H.text(ctx, "9 m", 180, 218, { s: 11, w: "800", a: "center", c: H.v("--mist") }); H.text(ctx, "7 m", 352, 186, { s: 11, w: "800", a: "center", c: H.v("--mist") }); H.text(ctx, "3 m", 44, 154, { s: 11, w: "800", a: "center", c: H.v("--mist") });
        H.rows(ctx, 430, 24, [["지금 수증기량 (1월 공기)", RD.toFixed(2) + " g/m³"], ["40% 일 때 수증기량 (22 °C)", "0.40 × " + RS.toFixed(2) + " = " + (0.4 * RS).toFixed(2) + " g/m³"], ["교실 부피", VOL + " m³"], ["내 답 (더 넣을 물)", g.toFixed(1) + " kg", null, true]], 54);
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
