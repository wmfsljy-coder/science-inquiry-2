/* 과학탐구실험2 Ⅱ 미래 사회와 첨단 과학 탐구 — 실제 자료
   r1 여름 방학 동안 화분에서 날아가는 물 — 서울의 하루 기준 증발산량(ET0)을 더해 물탱크 크기 정하기
   r2 겨울 방학은 더 긴데 — 여름과 겨울의 하루 평균 증발산량 비교
   자료: data/et0-seoul.js (ERA5 재분석, Open-Meteo) */
(function () {
"use strict";
var E = window.REAL_ET0 || { summer: [], winter: [] };
var SU = E.summer, WI = E.winter;
function tot(a) { return a.reduce(function (s, r) { return s + r[1]; }, 0); }
var TS = tot(SU), TW = tot(WI), PS = TS / Math.max(1, SU.length), PW = TW / Math.max(1, WI.length), RAT = PW ? PS / PW : 3;
var AREA = Math.PI * 0.1 * 0.1, LIT = TS * AREA;       /* mm × m² = L */
var SRC = "<small>출처: 유럽 중기예보센터 ERA5 재분석(Open-Meteo 과거 날씨 API) — 서울(북위 37.57°, 동경 126.98°)의 하루 기준 증발산량(FAO-56 ET0). 바깥의 짧은 풀밭이 하루 동안 증발·증산으로 잃는 물의 깊이(mm)로, 햇빛·바람이 적은 교실 안 화분은 이보다 덜 잃습니다. 여름 방학 " + SU.length + "일(2024-07-20 ~ 08-20), 겨울 방학 " + WI.length + "일(2024-12-24 ~ 2025-02-28). 사본은 data/et0-seoul.js.</small>";
function dko(d) { return (+d.slice(5, 7)) + "/" + (+d.slice(8, 10)); }

function bars(H, ctx, W, CH, a, mx, col, label) {
  H.paper(ctx, W, CH);
  var x0 = 60, x1 = 600, y0 = 26, y1 = CH - 36, bw = (x1 - x0) / Math.max(1, a.length);
  function Y(v) { return y1 - v / mx * (y1 - y0); }
  H.axes(ctx, x0, y0, x1, y1);
  for (var v = 0; v <= mx; v += 2) H.text(ctx, v, x0 - 6, Y(v) + 4, { s: 10, a: "right", c: H.v("--mist") });
  a.forEach(function (r, i) {
    H.box(ctx, x0 + i * bw + 1, Y(r[1]), Math.max(1, bw - 2), y1 - Y(r[1]), col, 0.85);
    if (i % Math.ceil(a.length / 8) === 0) H.text(ctx, dko(r[0]), x0 + i * bw + bw / 2, y1 + 15, { s: 10, a: "center", c: H.v("--mist") });
  });
  H.text(ctx, label, x0 + 6, y0 - 10, { s: 11, w: "700", c: H.v("--mist") });
}

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료로 자동 급수 장치의 물탱크 크기를 정한 근거를 설명해 보세요.",
  cases: [
  {
    id: "r1", tag: "실제 자료 · 증발산량", title: "여름 방학 동안 날아가는 물", short: "물탱크 크기",
    who: "🪴", name: "자동 급수 장치 팀",
    say: "“자동 급수 장치의 <b>물탱크</b>는 방학 내내 버틸 만큼 커야 해요. 2024년 여름 방학(" + SU.length + "일) 동안 서울에서 하루마다 날아간 물의 깊이(기준 증발산량)가 <b>실제 자료</b>로 있습니다. 모두 더해, 지름 20 cm 화분 하나가 잃을 수 있는 물이 <b>몇 L</b> 인지 구해 주세요.”",
    predict: {
      q: "1 m² 의 땅에서 물이 1 mm 깊이만큼 날아가면, 날아간 물은 몇 L 일까요?",
      options: ["㉠ 0.1 L", "㉡ 1 L", "㉢ 10 L"],
      answer: 1
    },
    task: "방학 동안 화분 하나가 잃는 물(L)을 슬라이더로 맞추세요(± 0.2 L).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, g = 0;
      function draw() {
        bars(H, ctx, W, cv.H, SU, 6, H.v("--brand"), "여름 방학 하루 기준 증발산량 (mm)");
        H.rows(ctx, 640, 30, [["방학 동안 합", TS.toFixed(1) + " mm"], ["화분 넓이 (지름 20 cm)", AREA.toFixed(4) + " m²"], ["내 답 (잃는 물)", g.toFixed(1) + " L", null, true]], 62);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "화분 하나가 잃는 물", min: 0, max: 10, step: 0.1, value: 0, fmt: function (x) { return x.toFixed(1) + " L"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("물의 부피(L) = 깊이(mm) × 넓이(m²). 화분 넓이 = 3.14 × 0.1 m × 0.1 m. " + SRC);
      draw();
      return {
        judge: function () {
          if (Math.abs(g - LIT) <= 0.2 + 1e-9) return { ok: true, msg: TS.toFixed(1) + " mm × " + AREA.toFixed(4) + " m² ≈ " + LIT.toFixed(1) + " L — 바깥 기준이니 교실 안이라면 이보다 적겠지만, 탱크는 여유 있게 " + Math.ceil(LIT) + " L 넘게 잡는 것이 안전합니다." };
          return { ok: false, msg: g.toFixed(1) + " L 는 " + (g < LIT ? "적습니다" : "많습니다") + ". 방학 동안 합(mm)에 화분 넓이(m²)를 곱하세요." };
        }
      };
    },
    hints: ["방학 동안 합 = " + TS.toFixed(1) + " mm, 넓이 = " + AREA.toFixed(4) + " m².", TS.toFixed(1) + " × " + AREA.toFixed(4) + " = ? L"],
    solution: "약 <b>" + LIT.toFixed(1) + " L</b>.",
    why: "흙 표면에서 증발하고 잎에서 증산하는 물의 양은 햇빛·기온·바람·습도가 정합니다. 기상학에서는 이를 표준 풀밭 기준의 ‘기준 증발산량’으로 계산해 농업용 물 계획에 써요. 장치를 설계할 때 이런 실제 자료로 최악의 경우를 어림하면, 탱크가 모자라거나 펌프가 너무 자주 도는 문제를 미리 막을 수 있습니다.<br>"
      + "실제 화분은 크기·흙·식물·놓인 곳에 따라 달라지므로, 방학 전에 며칠 동안 화분 무게를 재어 하루에 줄어드는 물을 확인하는 것이 좋은 보정 방법이에요."
  },
  {
    id: "r2", tag: "실제 자료 · 계절 비교", title: "겨울 방학은 더 긴데", short: "여름 대 겨울",
    who: "❄️", name: "자동 급수 장치 팀",
    say: "“지난겨울 방학에 화분이 말랐어요. 겨울 방학(" + WI.length + "일)이 여름(" + SU.length + "일)보다 깁니다. 두 방학의 <b>하루 평균</b> 기준 증발산량을 구해, 여름이 겨울의 <b>몇 배</b>인지 알려 주세요.”",
    predict: {
      q: "하루에 날아가는 물은 여름과 겨울 가운데 언제 더 많을까요?",
      options: ["㉠ 여름 — 햇빛이 세고 기온이 높아서", "㉡ 겨울 — 공기가 건조해서", "㉢ 같다"],
      answer: 0
    },
    task: "여름 하루 평균 ÷ 겨울 하루 평균 을 슬라이더로 맞추세요(± 0.3).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, g = 1;
      function draw() {
        bars(H, ctx, W, cv.H, WI, 6, H.v("--green-700"), "겨울 방학 하루 기준 증발산량 (mm) — 여름과 같은 눈금");
        H.rows(ctx, 640, 30, [["여름 " + SU.length + "일 합", TS.toFixed(1) + " mm"], ["겨울 " + WI.length + "일 합", TW.toFixed(1) + " mm"], ["내 답 (몇 배)", g.toFixed(1) + " 배", null, true]], 62);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "여름은 겨울의 몇 배", min: 0.5, max: 8, step: 0.1, value: 1, fmt: function (x) { return x.toFixed(1) + " 배"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("하루 평균 = 합 ÷ 날수. " + SRC);
      draw();
      return {
        judge: function () {
          if (Math.abs(g - RAT) <= 0.3 + 1e-9) return { ok: true, msg: "여름 " + PS.toFixed(2) + " mm/일, 겨울 " + PW.toFixed(2) + " mm/일 — 약 " + RAT.toFixed(1) + " 배입니다. 그런데도 겨울에 말랐다면, 방학이 길었고 난방한 실내 공기가 몹시 건조했기 때문일 수 있어요." };
          return { ok: false, msg: g.toFixed(1) + " 배는 맞지 않습니다. 두 방학의 날수가 다르니 하루 평균으로 비교하세요." };
        }
      };
    },
    hints: ["여름 하루 평균 = " + TS.toFixed(1) + " ÷ " + SU.length + ", 겨울 하루 평균 = " + TW.toFixed(1) + " ÷ " + WI.length + ".", PS.toFixed(2) + " ÷ " + PW.toFixed(2) + " = ?"],
    solution: "약 <b>" + RAT.toFixed(1) + " 배</b>.",
    why: "겨울 바깥은 햇빛이 약하고 기온이 낮아 하루에 날아가는 물이 여름보다 훨씬 적습니다. 하지만 겨울 방학은 날수가 두 배쯤이라 합이 여름의 60% 쯤까지 올라오고, 난방한 교실은 바깥보다 훨씬 건조해(상대 습도 20% 안팎) 흙이 생각보다 빨리 마를 수 있어요. 바깥 자료를 실내에 그대로 쓸 수 없는 까닭입니다.<br>"
      + "그래서 자동 급수 장치는 ‘며칠마다 몇 mL’처럼 시간으로 정하기보다, 토양 수분 센서로 흙이 실제로 말랐을 때 물을 주도록 만드는 것이 계절이 바뀌어도 잘 맞습니다."
  }
  ]
});
})();
