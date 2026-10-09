/* 과학탐구실험2 Ⅰ-2 생활 속의 과학 탐구 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 온천 달걀 */
  {
    id: "c1", tag: "요리 속 과학 · 단백질이 굳는 온도", title: "흰자는 몽글, 노른자는 촉촉한 달걀", short: "온천 달걀",
    who: "🥚", name: "학교 급식실 조리사",
    say: "“끓는 물에 삶으면 흰자는 고무처럼 질기고 노른자는 퍽퍽해져요. 흰자와 노른자의 단백질은 굳기 시작하는 온도가 달라서, 물의 온도와 시간을 잘 맞추면 흰자는 부드럽게 몽글, 노른자는 촉촉한 ‘온천 달걀’이 된대요. 물 온도와 담가 두는 시간을 정해 주세요.”",
    predict: {
      q: "달걀을 100 °C 대신 64 °C 물에 오래 담가 두면 어떻게 될까요?",
      options: ["㉠ 전혀 익지 않는다", "㉡ 굳는 온도가 낮은 단백질만 천천히 굳어, 끓인 달걀과 다른 식감이 된다", "㉢ 끓인 달걀과 똑같아진다"],
      answer: 1
    },
    task: "물 온도와 시간을 정해 <b>흰자는 부드럽게 익고 노른자는 촉촉한</b> 달걀을 만드세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(260), ctx = cv.ctx, W = cv.W, T = 80, tm = 20;
      function white() { var k = Math.min(1, tm / (40 * Math.pow(0.8, Math.max(0, T - 63) / 3))); return T < 60 ? 0 : (T < 63 ? 0.35 * k : (T < 70 ? 0.7 * k : Math.min(1, 0.7 + (T - 70) * 0.03) * k)); }
      function yolk() { var k = Math.min(1, tm / (45 * Math.pow(0.8, Math.max(0, T - 62) / 3))); return T < 62 ? 0 : (T < 67 ? 0.5 * k : Math.min(1, 0.5 + (T - 67) * 0.1) * k); }
      function wN(w) { return w < 0.3 ? "날것처럼 흐름" : (w < 0.6 ? "살짝 엉김" : (w < 0.85 ? "부드럽게 몽글" : "단단하고 질김")); }
      function yN(y) { return y < 0.2 ? "날것" : (y < 0.6 ? "촉촉한 크림 같음" : (y < 0.9 ? "꾸덕함" : "퍽퍽하게 굳음")); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var w = white(), y = yolk(), cx = 180, cy = 130;
        ctx.fillStyle = "rgba(255,255,255," + (0.35 + 0.6 * w) + ")"; ctx.strokeStyle = H.v("--line"); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(cx, cy, 110, 80, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "rgb(" + Math.round(250 - 10 * y) + "," + Math.round(180 + 30 * y) + "," + Math.round(20 + 60 * y) + ")";
        ctx.beginPath(); ctx.arc(cx + 8, cy + 4, 42, 0, Math.PI * 2); ctx.fill();
        H.text(ctx, "물 " + T + " °C · " + tm + "분", cx, 240, { s: 12.5, w: "800", a: "center" });
        var ok = w >= 0.6 && w < 0.85 && y >= 0.2 && y < 0.6;
        H.rows(ctx, 420, 50, [
          ["흰자", wN(w), w >= 0.6 && w < 0.85 ? "--green-700" : "--rose-700"],
          ["노른자", yN(y), y >= 0.2 && y < 0.6 ? "--green-700" : "--rose-700"],
          ["판정", ok ? "온천 달걀 완성!" : "아직 아님", ok ? "--green-700" : "--rose-700", true]
        ], 62);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "물 온도", min: 55, max: 90, step: 1, value: 80, fmt: function (x) { return x + " °C"; }, onInput: function (x) { T = x; draw(); } });
      api.slider({ label: "담가 두는 시간", min: 10, max: 60, step: 10, value: 20, fmt: function (x) { return x + "분"; }, onInput: function (x) { tm = x; draw(); } });
      api.info("단백질은 열을 받으면 구조가 풀리며(변성) 서로 엉겨 굳습니다. 흰자에서 가장 먼저 굳는 단백질(오보트랜스페린)은 약 62 °C, 흰자의 대부분인 오브알부민은 약 80 °C, 노른자는 약 63 ~ 65 °C 부터 천천히 굳기 시작해 70 °C 를 넘으면 빨리 굳어요. 온도가 높을수록 빨리 굳습니다.");
      draw();
      return {
        judge: function () {
          var w = white(), y = yolk();
          if (w >= 0.6 && w < 0.85 && y >= 0.2 && y < 0.6) return { ok: true, msg: T + " °C 에서 " + tm + "분 — 흰자는 부드럽게, 노른자는 촉촉하게 익었습니다. 단백질마다 굳는 온도가 다른 것을 이용했어요." };
          if (w >= 0.85 || y >= 0.6) return { ok: false, msg: "흰자 " + wN(w) + ", 노른자 " + yN(y) + ". 온도가 너무 높습니다." };
          return { ok: false, msg: "흰자 " + wN(w) + ", 노른자 " + yN(y) + ". 온도가 낮거나 시간이 짧아요." };
        }
      };
    },
    hints: [
      "끓는 물은 너무 뜨겁습니다. 흰자가 굳기 시작하는 63 °C 근처로 낮춰 보세요.",
      "63 ~ 67 °C 에서 40분 이상 두어 보세요."
    ],
    solution: "물 온도 <b>63 ~ 67 °C</b>, 시간 <b>40 ~ 60분</b> (65 °C 이상이면 30분부터).",
    why: "달걀의 단백질은 종류마다 굳는(변성) 온도가 다릅니다. 100 °C 물은 모든 단백질을 빠르게 굳혀 질기고 퍽퍽하지만, 63 ~ 67 °C 에서 오래 두면 일부 단백질만 천천히 굳어 전혀 다른 식감이 됩니다.<br>" +
      "일정한 낮은 온도의 물로 천천히 익히는 수비드 요리도 같은 원리입니다. 요리는 온도와 시간을 조절하는 과학 실험이에요. ※ 굳는 정도는 수업용 모형입니다."
  },

  /* ------------------------------------------------------------------ 2. 동조 질량 댐퍼 */
  {
    id: "c2", tag: "건축 속 과학 · 흔들림에 박자 맞추기", title: "초고층 빌딩 꼭대기의 거대한 추", short: "동조 질량 댐퍼",
    who: "🏙️", name: "초고층 빌딩 설계팀",
    say: "“높이 500 m 의 빌딩은 강한 바람에 약 <b>7 초</b>마다 한 번씩 좌우로 흔들립니다. 꼭대기에 커다란 추를 줄에 매달아, 건물이 흔들릴 때 추가 <b>같은 박자로 반대 방향</b>으로 움직이게 하면 흔들림이 줄어요. 추를 매단 줄의 길이를 정해, 건물의 흔들림을 <b>절반 이하</b>로 줄여 주세요.”",
    predict: {
      q: "추가 가장 효과적으로 흔들림을 줄이려면 추의 흔들리는 주기는?",
      options: ["㉠ 건물의 흔들림 주기보다 훨씬 짧아야 한다", "㉡ 건물의 흔들림 주기와 같아야 한다", "㉢ 상관없다"],
      answer: 1
    },
    task: "추를 매단 줄의 길이를 정해 <b>건물 꼭대기의 흔들림을 원래의 50% 이하</b>로 줄이세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, L = 4;
      function Td() { return 2 * Math.PI * Math.sqrt(L / 9.8); }
      function red() { var q = Td() / 7; return Math.min(1, 0.3 + 3.5 * Math.abs(1 - q)); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var bx = 160, gy = 255, rr = red(), sway = 40 * rr;
        ctx.save(); ctx.fillStyle = "rgba(90,130,190,0.25)"; ctx.strokeStyle = H.v("--ink"); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(bx - 40, gy); ctx.lineTo(bx + 40, gy); ctx.lineTo(bx + 22 + sway, 30); ctx.lineTo(bx - 22 + sway, 30); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
        var px = bx + sway, py = 40, len = 20 + L * 3;
        H.line(ctx, [[px, py], [px - sway * 0.9, py + len]], H.v("--ink"), 2);
        H.dot(ctx, px - sway * 0.9, py + len, 10, H.v("--amber-700"));
        H.line(ctx, [[40, gy], [320, gy]], H.v("--ink"), 3);
        var t = Td(), ok = rr <= 0.5;
        H.rows(ctx, 400, 50, [
          ["추의 흔들림 주기", t.toFixed(2) + " 초"],
          ["건물의 흔들림 주기", "7.00 초"],
          ["꼭대기 흔들림 (추 없을 때 = 100%)", Math.round(rr * 100) + "%", ok ? "--green-700" : "--rose-700", true]
        ], 64);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "추를 매단 줄의 길이", min: 2, max: 20, step: 0.5, value: 4, fmt: function (x) { return x.toFixed(1) + " m"; }, onInput: function (x) { L = x; draw(); } });
      api.info("줄에 매단 추(진자)의 주기 = 2π√(줄 길이 ÷ 9.8). 무게와는 상관없고 줄 길이로 정해집니다.");
      draw();
      return {
        judge: function () {
          var rr = red(), t = Td();
          if (rr <= 0.5) return { ok: true, msg: "줄 " + L.toFixed(1) + " m → 추의 주기 " + t.toFixed(2) + " 초. 건물과 박자가 맞아 흔들림이 " + Math.round(rr * 100) + "% 로 줄었습니다." };
          return { ok: false, msg: "추의 주기 " + t.toFixed(2) + " 초 — 건물(7 초)과 박자가 " + (t < 7 ? "빠릅니다" : "느립니다") + ". 흔들림이 " + Math.round(rr * 100) + "% 로 아직 큽니다." };
        }
      };
    },
    hints: [
      "추의 주기가 7 초가 되는 줄 길이를 계산해 보세요.",
      "9.8 × (7 ÷ 6.28)² ≈ 12 m 입니다."
    ],
    solution: "줄 길이 <b>11 ~ 13.5 m</b> (약 12 m).",
    why: "공진은 해로울 때도 있지만, 이렇게 거꾸로 이용할 수도 있습니다. 건물과 같은 박자로 흔들리도록 맞춘(동조) 추는 건물이 한쪽으로 기울 때 반대쪽으로 움직여 흔들림 에너지를 빼앗아 가요. 대만의 타이베이 101 빌딩에는 무게 660 톤의 추가 매달려 있습니다.<br>" +
      "이것이 <b>제진</b> 기술의 한 예입니다. 원리를 알면 문제를 일으킨 현상으로 문제를 해결하는 장치를 고안할 수 있습니다. ※ 감소율은 수업용 모형입니다."
  },

  /* ------------------------------------------------------------------ 3. 표본 크기와 유사과학 */
  {
    id: "c3", tag: "유사과학 비평 · 표본이 작으면 우연도 규칙처럼", title: "혈액형 설문, 몇 명에게 물어야 할까", short: "표본 크기",
    who: "📋", name: "학급 신문 기자",
    say: "“반 친구 20명에게 설문했더니 A형 친구가 ‘나는 소심한 편이다’에 다른 혈액형보다 12%p 나 더 많이 답했어요. 기사 제목을 ‘혈액형 성격설, 사실로 확인’으로 할까요? 조사 인원을 늘려 보고, 차이가 우연인지 판단할 수 있을 만큼 조사한 뒤(<b>오차 범위 ± 5%p 이하</b>) 알맞은 결론을 골라 주세요.”",
    predict: {
      q: "20명만 조사해서 12%p 차이가 났다면?",
      options: ["㉠ 혈액형과 성격이 관련 있다는 확실한 증거다", "㉡ 사람 수가 적어 우연히 생긴 차이일 수 있으니, 더 많이 조사해야 한다", "㉢ 20명이면 충분하다"],
      answer: 1
    },
    task: "조사 인원과 결론을 정하세요. <b>오차 범위 ± 5%p 이하</b>로 조사하고, 자료에 맞는 결론을 골라야 합니다.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(260), ctx = cv.ctx, W = cv.W;
      var NS = [20, 50, 100, 200, 500, 1000, 2000], DF = [12, 7, -4, 3, 1.5, 0.8, -0.5], i = 0, con = "yes";
      function moe(n) { return 138.6 / Math.sqrt(n); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var n = NS[i], d = DF[i], m = moe(n), x0 = 80, x1 = 560, y = 130;
        function X(p) { return x0 + (p + 40) / 80 * (x1 - x0); }
        H.line(ctx, [[x0, y], [x1, y]], H.v("--line"), 2);
        [-40, -20, 0, 20, 40].forEach(function (p) { H.line(ctx, [[X(p), y - 5], [X(p), y + 5]], H.v("--line"), 1.5); H.text(ctx, (p > 0 ? "+" : "") + p + "%p", X(p), y + 22, { s: 10, a: "center", c: H.v("--mist") }); });
        H.dash(ctx, X(0), y - 60, X(0), y + 10, H.v("--mist"), 1.5);
        H.text(ctx, "차이 없음", X(0), y - 64, { s: 10.5, w: "700", a: "center", c: H.v("--mist") });
        var L = Math.max(x0, X(d - m)), R = Math.min(x1, X(d + m));
        H.box(ctx, L, y - 30, R - L, 16, H.v(m <= 5 ? "--green-700" : "--amber-700"), 0.35);
        H.dot(ctx, X(d), y - 22, 6, H.v("--brand"));
        H.text(ctx, "‘소심하다’ 응답 차이 (A형 − 다른 혈액형) " + (d > 0 ? "+" : "") + d + "%p ± " + m.toFixed(1), x0, 40, { s: 13, w: "900" });
        H.text(ctx, "조사 인원 " + n + "명", x0, 64, { s: 12, w: "800", c: H.v("--mist") });
        H.rows(ctx, 620, 60, [["오차 범위", "± " + m.toFixed(1) + "%p", m <= 5 ? "--green-700" : "--rose-700", true], ["범위 안에 0 이 있나", (d - m <= 0 && d + m >= 0) ? "있다" : "없다"]], 70);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "조사 인원", min: 0, max: 6, step: 1, value: 0, fmt: function (x) { return NS[x] + "명"; }, onInput: function (x) { i = x; draw(); } });
      api.seg({ label: "기사의 결론", value: "yes", options: [{ v: "yes", t: "관련이 있다" }, { v: "no", t: "관련이 있다고 볼 수 없다" }, { v: "wait", t: "아직 판단할 수 없다" }], onPick: function (x) { con = x; draw(); } });
      api.info("오차 범위는 ‘조사를 다시 하면 이만큼은 달라질 수 있다’는 폭입니다(95% 신뢰 수준). 사람 수가 4배가 되면 오차 범위는 절반이 돼요.");
      draw();
      return {
        judge: function () {
          var n = NS[i], d = DF[i], m = moe(n), zeroIn = d - m <= 0 && d + m >= 0;
          if (m > 5) return { ok: false, msg: n + "명으로는 오차 범위가 ± " + m.toFixed(1) + "%p 나 돼, " + (con === "wait" ? "지금 판단을 미루는 것은 옳지만 과제는 결론을 내릴 만큼 조사하는 것입니다." : "어떤 결론도 내리기 이릅니다.") };
          if (con === "yes") return { ok: false, msg: "오차 범위(± " + m.toFixed(1) + "%p) 안에 ‘차이 없음(0)’이 들어 있습니다. 관련이 있다고 할 수 없어요." };
          if (con === "wait") return { ok: false, msg: "충분히 조사했으니 이제 결론을 내릴 수 있습니다." };
          if (!zeroIn) return { ok: false, msg: "범위 밖입니다." };
          return { ok: true, msg: n + "명 조사: 차이 " + d + "%p ± " + m.toFixed(1) + "%p. 20명일 때의 12%p 차이는 우연으로 설명할 수 있는 크기였습니다. ‘관련이 있다고 볼 수 없다’가 자료에 맞는 결론이에요." };
        }
      };
    },
    hints: [
      "이 모형(각 집단을 같은 수로 조사한다고 단순화)에서는 오차 범위가 5%p 이하가 되려면 1,000명 가까이 조사해야 합니다.",
      "1,000명 이상에서 범위 안에 0 이 들어 있다면, 차이가 있다고 할 수 없습니다."
    ],
    solution: "조사 인원 <b>1,000명 이상</b>, 결론 <b>‘관련이 있다고 볼 수 없다’</b>.",
    why: "적은 사람을 조사하면 우연한 차이가 규칙처럼 보이기 쉽습니다. 조사 인원을 늘리면 오차 범위가 줄어, 차이가 진짜인지 우연인지 가릴 수 있어요. 혈액형 성격설은 수천 명을 조사한 연구들에서 관련이 확인되지 않았습니다.<br>" +
      "여기에 자기 생각에 맞는 사례만 기억하는 <b>확증 편향</b>이 더해지면 유사과학이 퍼집니다. 주장을 비평할 때는 ‘몇 명을 어떻게 조사했나?’를 먼저 물어보세요. ※ 설문 값은 수업용으로 만든 것입니다."
  }
  ]
});
})();
