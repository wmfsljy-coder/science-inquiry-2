/* 과학탐구실험2 Ⅰ 생활 속의 과학 탐구 — 실제 자료
   r1 우주 정거장의 속력 — 국제 우주 정거장(ISS)의 실제 궤도 주기와 높이로 속력 구하기
   r2 경주와 포항, 어느 지진이 더 컸나 — USGS 목록과 기상청 발표가 다른 까닭
   자료: data/satcat.js (CelesTrak 위성 목록), data/usgs-korea.js (USGS 지진 목록) */
(function () {
"use strict";
var S = window.REAL_SAT || { iss: ["ISS (ZARYA)", 92.98, 425, 416, 51.63] }, Q = window.REAL_EQ || { rows: [] };
var I = S.iss, RE = 6371, HM = (I[2] + I[3]) / 2, V = 2 * Math.PI * (RE + HM) / (I[1] * 60);
var EQ = Q.rows;                                       /* [날짜, 규모, 종류, 위도, 경도, 깊이, 설명] */
var BIG = 0; EQ.forEach(function (r, i) { if (r[1] > EQ[BIG][1]) BIG = i; });
var KO = { Gyeongju: "경주", Heunghae: "포항(흥해)", Pohang: "포항", Sinan: "신안", Ulsan: "울산", Pyeongchang: "평창", "T’aebaek": "태백", Kyosai: "거제", Santyoku: "삼척", Tonghae: "동해", Sokcho: "속초", Gaigeturi: "제주", Iksan: "익산", Mungyeong: "문경", Puan: "부안", Ongjin: "옹진" };
var DK = { N: "북", S: "남", E: "동", W: "서" };
function where(r) { var m = /^(\d+)\s?km\s+([NSEW]+)\s+of\s+(.+?),/.exec(r[6]); if (m) { var n = KO[m[3]] || m[3]; return +m[1] >= 30 ? n + " " + m[2].split("").map(function (c) { return DK[c]; }).join("") + "쪽 " + m[1] + " km" : n; } return "북위 " + r[3].toFixed(1) + "°, 동경 " + r[4].toFixed(1) + "°"; }
var SRC1 = "<small>출처: CelesTrak 위성 목록(SATCAT) — 국제 우주 정거장 " + I[0] + " 의 궤도 주기 " + I[1] + " 분, 원지점 " + I[2] + " km, 근지점 " + I[3] + " km, 궤도 기울기 " + I[4] + "°. 정거장은 공기 저항으로 조금씩 낮아져 가끔 엔진으로 높이를 올립니다. 사본은 data/satcat.js.</small>";
var SRC2 = "<small>출처: 미국 지질조사국(USGS) 지진 목록 — 남한과 둘레 바다에서 1990~2025년 규모 2.5 이상으로 기록된 지진 " + EQ.length + "건(세계 관측망 기준이라 작은 지진은 빠진 것이 많음). 기상청 발표 규모(국지 규모 ML): 2016년 경주 5.8, 2017년 포항 5.4. 사본은 data/usgs-korea.js.</small>";

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료로 측정값을 비교할 때 단위·기준을 확인해야 하는 까닭을 설명해 보세요.",
  cases: [
  {
    id: "r1", tag: "실제 자료 · 원운동", title: "우주 정거장의 속력", short: "ISS의 속력",
    who: "🛰️", name: "우주 딸기 실험팀",
    say: "“우리 딸기 간식이 실려 갈 국제 우주 정거장은 지구 둘레를 쉬지 않고 돌아요. 위성 목록에 적힌 <b>실제 궤도 주기</b>와 <b>높이</b>로 정거장의 <b>속력(km/s)</b>을 구해 주세요. 지구 반지름은 6,371 km, 궤도는 원이라고 칩니다.”",
    predict: {
      q: "우주 정거장은 대략 얼마나 빠를까요?",
      options: ["㉠ 여객기쯤 (0.25 km/s)", "㉡ 소리의 몇 배 (1 km/s)", "㉢ 소리의 20배 넘게 (수 km/s)"],
      answer: 2
    },
    task: "정거장의 속력을 슬라이더로 맞추세요(± 0.1 km/s).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, g = 3;
      function draw() {
        H.paper(ctx, W, cv.H);
        var cx = 200, cy = 135, r = 95, ro = r * (RE + HM) / RE;
        ctx.save(); ctx.fillStyle = H.v("--brand"); ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        ctx.save(); ctx.strokeStyle = H.v("--amber-700"); ctx.setLineDash([5, 4]); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, ro, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        H.dot(ctx, cx + ro, cy, 6, H.v("--amber-700"));
        H.text(ctx, "지구", cx, cy + 4, { s: 12, w: "900", a: "center" });
        H.text(ctx, "궤도 (같은 비율로 그리면 이렇게 지구에 바짝 붙어 있어요)", cx, cy + ro + 22, { s: 10.5, a: "center", c: H.v("--mist") });
        H.rows(ctx, 440, 24, [["궤도 주기", I[1] + " 분"], ["평균 높이", HM + " km"], ["궤도 반지름", (RE + HM).toLocaleString() + " km"], ["내 답 (속력)", g.toFixed(2) + " km/s", null, true]], 54);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "정거장의 속력", min: 3, max: 12, step: 0.05, value: 3, fmt: function (x) { return x.toFixed(2) + " km/s"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("속력 = 한 바퀴 거리 ÷ 걸린 시간 = 2 × 3.14 × 궤도 반지름 ÷ (주기를 초로). " + SRC1
        + "<div data-link='{\"id\":\"spot-station\",\"title\":\"Spot the Station\",\"src\":\"미국 항공우주국\",\"url\":\"https://www.nasa.gov/spot-the-station/\",\"ask\":\"우리 지역(가까운 도시)을 골라, 국제 우주 정거장이 하늘을 지나가는 다음 날짜·시각과 보이는 시간(분)을 적어 오세요.\"}'></div>");
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
    id: "r2", tag: "실제 자료 · 측정의 기준", title: "경주와 포항, 어느 지진이 더 컸나", short: "두 지진의 규모",
    who: "🌐", name: "지진 자료 분석실",
    say: "“기상청은 2016년 경주 지진을 규모 <b>5.8</b>, 2017년 포항 지진을 <b>5.4</b>로 발표했어요. 그런데 미국 지질조사국(USGS)의 <b>실제 목록</b>을 보면 순서가 달라 보입니다. 목록에서 <b>가장 큰 지진</b>을 찾고, 두 기관의 값이 다른 까닭을 골라 주세요.”",
    predict: {
      q: "같은 지진의 규모를 두 기관이 다르게 발표했다면, 가장 먼저 무엇을 확인해야 할까요?",
      options: ["㉠ 어느 기관이 거짓말을 했는지", "㉡ 두 기관이 규모를 어떤 방법(척도)으로 쟀는지", "㉢ 지진이 일어난 시각"],
      answer: 1
    },
    task: "USGS 목록에서 가장 큰 지진을 고르고, 두 기관 값이 다른 까닭을 고르세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(280), ctx = cv.ctx, W = cv.W, i = 0, why = "none";
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 60, x1 = 600, y0 = 26, y1 = cv.H - 36;
        function X(d) { var y = +d.slice(0, 4) + (+d.slice(5, 7) - 1) / 12; return x0 + (y - 1990) / 36 * (x1 - x0); }
        function Y(m) { return y1 - (m - 2.5) / 3.5 * (y1 - y0); }
        H.axes(ctx, x0, y0, x1, y1);
        [3, 4, 5, 6].forEach(function (m) { H.text(ctx, m, x0 - 6, Y(m) + 4, { s: 10, a: "right", c: H.v("--mist") }); });
        [1990, 2000, 2010, 2020].forEach(function (y) { H.text(ctx, y, X(y + "-01"), y1 + 15, { s: 10, a: "center", c: H.v("--mist") }); });
        EQ.forEach(function (r, j) { H.dot(ctx, X(r[0]), Y(r[1]), j === i ? 7 : 4, j === i ? H.v("--amber-700") : H.v("--brand")); });
        H.text(ctx, "USGS가 기록한 남한 둘레 지진의 규모", x0 + 6, y0 - 10, { s: 11, w: "700", c: H.v("--mist") });
        var r = EQ[i] || ["", 0, "", 0, 0, 0, ""];
        H.rows(ctx, 640, 30, [["고른 지진", r[0], "--amber-700"], ["곳", where(r)], ["USGS 규모", r[1].toFixed(1) + " (" + r[2] + ")", null, true], ["깊이", r[5] + " km"]], 52);
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
  }
  ]
});
})();
