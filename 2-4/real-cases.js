/* 과학탐구실험2 Ⅱ 미래 사회와 첨단 과학 탐구 — 실제 자료
   r1 바깥 공기의 이산화 탄소는 해마다 얼마나 늘까 — 마우나로아 관측소의 달 평균(1958 ~ )
   r2 하늘의 위성은 얼마나 늘었나 — 지구 둘레에 남아 있는 위성 수(1960~2025)
   자료: data/co2-mlo.js (NOAA), data/satcat.js (CelesTrak) */
(function () {
"use strict";
var C = window.REAL_CO2 || { rows: [] }, S = window.REAL_SAT || { rows: [] };
var AN = {}; C.rows.forEach(function (r) { (AN[r[0]] = AN[r[0]] || []).push(r[2]); });
function am(y) { var a = AN[y]; return a && a.length === 12 ? a.reduce(function (s, v) { return s + v; }, 0) / 12 : null; }
var A15 = am(2015), A25 = am(2025), GR = A15 && A25 ? (A25 - A15) / 10 : 2.5, A60 = am(1960);
var LAST = C.rows[C.rows.length - 1] || [2026, 1, 427];
var SR = S.rows;                                         /* [연도, 위성, 파편, 로켓 몸체·기타, 그해 새로 목록에 오른 위성] */
function sat(y) { for (var i = 0; i < SR.length; i++) if (SR[i][0] === y) return SR[i]; return [y, 1, 0, 0, 0]; }
var P15 = sat(2015)[1], P25 = sat(2025)[1], PR = P15 ? P25 / P15 : 4;
var SRC1 = "<small>출처: 미국 해양대기청(NOAA) 지구 감시 연구소 — 하와이 마우나로아 관측소(해발 3,397 m)의 달 평균 이산화 탄소 농도, 1958년 3월 ~ " + LAST[0] + "년 " + LAST[1] + "월. 사본은 data/co2-mlo.js.</small>";
var SRC2 = "<small>출처: CelesTrak 위성 목록(SATCAT) — 쏘아 올린 날·떨어진 날로 해마다 말에 지구 둘레에 남아 있던 물체를 셈(추적되는 약 10 cm 이상만). ‘위성’에는 작동을 멈춘 위성도 들어 있습니다. 목록은 파편을 부모 위성의 발사일로 적어 두므로, 물체가 나타난 해는 카탈로그 번호가 매겨진 해로 다시 잡았습니다. 사본은 data/satcat.js.</small>";

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료로 첨단 장치를 만들 때 기준값과 변화 추세를 함께 봐야 하는 까닭을 설명해 보세요.",
  cases: [
  {
    id: "r1", tag: "실제 자료 · 이산화 탄소", title: "바깥 공기의 이산화 탄소는 해마다 얼마나 늘까", short: "킬링 곡선",
    who: "🌋", name: "환기 알림 장치 팀",
    say: "“환기 알림 장치를 만들려면 ‘깨끗한 바깥 공기’의 이산화 탄소 농도를 알아야 해요. 도시와 멀리 떨어진 하와이 마우나로아 산꼭대기에서 1958년부터 잰 <b>실제 기록</b>입니다. <b>2015년과 2025년</b>의 한 해 평균을 비교해, 해마다 <b>몇 ppm씩</b> 늘었는지 구해 주세요.”",
    predict: {
      q: "곡선이 해마다 톱니처럼 오르내리는 까닭은 무엇일까요?",
      options: ["㉠ 측정기가 고장 나서", "㉡ 북반구 식물이 여름엔 광합성으로 흡수하고, 겨울엔 낙엽·흙의 분해로 내놓아서", "㉢ 사람들이 겨울에만 연료를 써서"],
      answer: 1
    },
    task: "2015~2025년 한 해 평균 증가량을 슬라이더로 맞추세요(± 0.2 ppm/년).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(280), ctx = cv.ctx, W = cv.W, g = 0;
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 60, x1 = 600, y0 = 26, y1 = cv.H - 36;
        function X(y, m) { return x0 + (y + (m - 0.5) / 12 - 1958) / 69 * (x1 - x0); }
        function Y(v) { return y1 - (v - 310) / 125 * (y1 - y0); }
        H.axes(ctx, x0, y0, x1, y1);
        [320, 350, 380, 410].forEach(function (v) { H.text(ctx, v, x0 - 6, Y(v) + 4, { s: 10, a: "right", c: H.v("--mist") }); });
        [1960, 1980, 2000, 2020].forEach(function (y) { H.text(ctx, y, X(y, 1), y1 + 15, { s: 10, a: "center", c: H.v("--mist") }); });
        H.line(ctx, C.rows.map(function (r) { return [X(r[0], r[1]), Y(r[2])]; }), H.v("--brand"), 1.4);
        [2015, 2025].forEach(function (y) { var v = am(y); if (v) H.dot(ctx, X(y, 6.5), Y(v), 6, H.v("--amber-700")); });
        H.text(ctx, "마우나로아의 이산화 탄소 (ppm)", x0 + 6, y0 - 10, { s: 11, w: "700", c: H.v("--mist") });
        H.rows(ctx, 640, 30, [["2015년 평균", A15 ? A15.toFixed(2) + " ppm" : "-"], ["2025년 평균", A25 ? A25.toFixed(2) + " ppm" : "-"], ["내 답 (해마다)", "+" + g.toFixed(1) + " ppm", null, true]], 62);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "해마다 늘어난 양", min: 0, max: 5, step: 0.1, value: 0, fmt: function (x) { return "+" + x.toFixed(1) + " ppm/년"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("ppm은 백만 분의 1입니다. 교실 기준(학교보건법 1,000 ppm)은 바깥 공기보다 훨씬 높은 값이라, 바깥 농도가 조금씩 올라도 환기는 여전히 효과가 있습니다. " + SRC1
        + "<div data-link='{\"id\":\"noaa-co2\",\"title\":\"마우나로아 이산화 탄소 추세\",\"src\":\"미국 해양대기청 NOAA\",\"url\":\"https://gml.noaa.gov/ccgg/trends/\",\"ask\":\"가장 최근 달의 이산화 탄소 농도와, 1년 전 같은 달의 농도를 찾아 적고 한 해 동안 얼마나 늘었는지 계산해 오세요.\"}'></div>");
      draw();
      return {
        judge: function () {
          if (Math.abs(g - GR) <= 0.2 + 1e-9) return { ok: true, msg: "(" + A25.toFixed(2) + " − " + A15.toFixed(2) + ") ÷ 10 ≈ " + GR.toFixed(2) + " ppm/년 — 1960년(" + (A60 ? A60.toFixed(0) : "317") + " ppm)에는 해마다 1 ppm도 안 늘었는데, 지금은 세 배 넘게 빨라졌습니다." };
          return { ok: false, msg: "+" + g.toFixed(1) + " 은 맞지 않습니다. 두 해의 차이를 햇수(10)로 나누세요." };
        }
      };
    },
    hints: ["2025년 평균 − 2015년 평균 = " + (A15 && A25 ? (A25 - A15).toFixed(2) : "?") + " ppm.", "그 차이를 10 년으로 나누세요."],
    solution: "약 <b>+" + GR.toFixed(1) + " ppm/년</b>.",
    why: "마우나로아 기록은 처음 시작한 과학자의 이름을 따 ‘킬링 곡선’이라 불립니다. 화석 연료를 태워 나온 이산화 탄소가 쌓이면서 농도는 1958년 약 315 ppm에서 지금 425 ppm을 넘었습니다. 해마다의 톱니는 북반구 식물의 광합성이 만드는 계절 변화입니다.<br>"
      + "센서 장치를 만들 때는 이렇게 믿을 수 있는 기준값으로 보정해야 합니다. 맑은 날 바깥에서 센서가 약 430 ppm 안팎(도시는 더 높을 수 있음)을 가리키는지 확인하는 것이 간단한 보정 방법입니다."
  },
  {
    id: "r2", tag: "실제 자료 · 우주 환경", title: "하늘의 위성은 얼마나 늘었나", short: "위성 수",
    who: "🚀", name: "우주 개발 토론 동아리",
    say: "“재사용 로켓으로 발사 비용이 줄자 위성이 크게 늘었어요. 해마다 말에 지구 둘레에 남아 있던 물체를 센 <b>실제 목록</b>입니다. 2025년 말 위성 수는 2015년 말의 <b>몇 배</b>일까요? 우주 쓰레기 문제를 토론할 근거로 써 봅시다.”",
    predict: {
      q: "지구 둘레에서 추적되는 물체 가운데 실제로 일하는 위성이 아닌 것은 무엇일까요?",
      options: ["㉠ 없다, 모두 일하는 위성이다", "㉡ 멈춘 위성·로켓 몸체·부서진 파편", "㉢ 별과 행성"],
      answer: 1
    },
    task: "2025년 위성 수 ÷ 2015년 위성 수 를 슬라이더로 맞추세요(± 0.3).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(280), ctx = cv.ctx, W = cv.W, g = 1;
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 60, x1 = 600, y0 = 26, y1 = cv.H - 36, bw = (x1 - x0) / Math.max(1, SR.length);
        var mx = Math.max.apply(null, SR.map(function (r) { return r[1] + r[2] + r[3]; })) * 1.08 || 1;
        function Y(v) { return y1 - v / mx * (y1 - y0); }
        H.axes(ctx, x0, y0, x1, y1);
        [0, 10000, 20000, 30000].forEach(function (v) { if (v < mx) H.text(ctx, v.toLocaleString(), x0 - 6, Y(v) + 4, { s: 10, a: "right", c: H.v("--mist") }); });
        SR.forEach(function (r, i) {
          var x = x0 + i * bw, a = Y(r[1]), b = Y(r[1] + r[2]), c = Y(r[1] + r[2] + r[3]);
          H.box(ctx, x, a, Math.max(1, bw - 1), y1 - a, H.v("--brand"), 0.9); H.box(ctx, x, b, Math.max(1, bw - 1), a - b, H.v("--rose-700"), 0.8); H.box(ctx, x, c, Math.max(1, bw - 1), b - c, H.v("--mist"), 0.7);
          if (r[0] % 10 === 0) H.text(ctx, r[0], x + bw / 2, y1 + 15, { s: 10, a: "center", c: H.v("--mist") });
        });
        H.text(ctx, "해마다 말 지구 둘레의 물체 — 파랑: 위성, 빨강: 파편, 회색: 로켓 몸체 등", x0 + 6, y0 - 10, { s: 11, w: "700", c: H.v("--mist") });
        H.rows(ctx, 640, 30, [["2015년 말 위성", P15.toLocaleString()], ["2025년 말 위성", P25.toLocaleString()], ["내 답 (몇 배)", g.toFixed(1) + " 배", null, true]], 62);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "2025년은 2015년의 몇 배", min: 1, max: 10, step: 0.1, value: 1, fmt: function (x) { return x.toFixed(1) + " 배"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("빨간 막대가 2007년(중국의 위성 요격 시험), 2009년(이리듐·코스모스 위성 충돌), 2021년(러시아의 위성 요격 시험)에 껑충 뛰는 것을 찾아보세요. 2020년대 파편 수가 조금 줄어든 것은 태양 활동이 강해져 높은 대기가 부풀고, 공기 저항으로 낮은 궤도의 파편이 빨리 떨어졌기 때문으로 보입니다. 2021년 요격 시험 파편이 낮은 궤도에 있어 빨리 떨어진 것도 한몫했습니다. " + SRC2
        + "<div data-link='{\"id\":\"esa-debris\",\"title\":\"숫자로 보는 우주 쓰레기\",\"src\":\"유럽 우주국 ESA\",\"url\":\"https://www.esa.int/Space_Safety/Space_Debris/Space_debris_by_the_numbers\",\"ask\":\"지구 둘레에 있는 1~10 cm 조각과 10 cm 이상 조각이 각각 몇 개로 추정되는지 적고, 추적되지 않는 작은 조각이 왜 위험한지 한 문장으로 적어 오세요.\"}'></div>");
      draw();
      return {
        judge: function () {
          if (Math.abs(g - PR) <= 0.3 + 1e-9) return { ok: true, msg: P25.toLocaleString() + " ÷ " + P15.toLocaleString() + " ≈ " + PR.toFixed(1) + " 배 — 10년 만에 이만큼 늘었고, 대부분은 수천 개를 무리 지어 운용하는 위성 인터넷 군집(스타링크 등)입니다." };
          return { ok: false, msg: g.toFixed(1) + " 배는 맞지 않습니다. 오른쪽 두 수를 나누세요." };
        }
      };
    },
    hints: ["오른쪽 판에 두 해의 위성 수가 있습니다.", P25 + " ÷ " + P15 + " = ?"],
    solution: "약 <b>" + PR.toFixed(1) + " 배</b>.",
    why: "위성이 많아지면 서로 부딪칠 위험이 커지고, 한 번 부딪치면 수천 개의 파편이 생겨 다른 위성을 또 부술 수 있습니다(케슬러 증후군). 2009년 미국 이리듐 위성과 러시아의 멈춘 위성이 충돌해 2,000 개 넘는 파편이 생긴 일이 실제로 있었어요.<br>"
      + "우주 개발 토론에서는 ‘우주가 지구 문제 해결에 주는 도움(기상·통신·재난 감시)’과 ‘우주 환경을 지키는 책임(수명이 끝난 위성 떨어뜨리기, 충돌 피하기)’을 함께 근거로 들 수 있습니다."
  }
  ]
});
})();
