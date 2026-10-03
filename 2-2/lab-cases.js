/* 과학탐구실험2 Ⅱ-1 미래 사회와 첨단 과학 탐구 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 초음파 주차 센서 */
  {
    id: "c1", tag: "센서의 원리 · 메아리로 거리 재기", title: "여름에도 겨울에도 맞는 주차 경보", short: "초음파 센서",
    who: "🚗", name: "자동차 부품 연구소",
    say: "“범퍼의 초음파 센서는 소리를 쏘고 장애물에 반사되어 돌아오는 시간(메아리 시간)을 잽니다. 메아리 시간이 기준보다 짧아지면 ‘삐—’ 경보가 울리죠. 장애물이 <b>0.5 m (± 5 cm)</b> 에 왔을 때 울리게 기준 시간을 정해 주세요. 그런데 소리의 속력은 기온에 따라 달라요. <b>겨울(0 °C, 331 m/s)과 여름(30 °C, 349 m/s) 모두</b> 맞아야 합니다.”",
    predict: {
      q: "장애물까지 0.5 m 일 때, 초음파가 되돌아오기까지 소리가 가는 거리는?",
      options: ["㉠ 0.25 m", "㉡ 0.5 m", "㉢ 1 m — 갔다가 돌아오므로"],
      answer: 2
    },
    task: "경보 기준 시간을 정해 <b>겨울과 여름 모두</b> 0.45 ~ 0.55 m 에서 경보가 울리게 하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(260), ctx = cv.ctx, W = cv.W, t = 5.0, season = "w";
      function dist(vs) { return vs * t / 1000 / 2; }
      function draw() {
        H.paper(ctx, W, cv.H);
        [[331, "겨울 0 °C", 70], [349, "여름 30 °C", 170]].forEach(function (r) {
          var d = dist(r[0]), y = r[2], x0 = 150, sc = 400;
          H.text(ctx, r[1] + " (" + r[0] + " m/s)", 20, y - 30, { s: 12, w: "800" });
          H.text(ctx, "🚗", x0 - 10, y + 8, { s: 22, a: "center" });
          H.box(ctx, x0 + 0.45 * sc, y - 22, 0.1 * sc, 44, H.v("--green-700"), 0.15);
          H.dash(ctx, x0 + d * sc, y - 26, x0 + d * sc, y + 26, H.v("--coral-700"), 2.5);
          H.text(ctx, "경보 " + d.toFixed(2) + " m", Math.min(x0 + d * sc + 6, 590), y - 12, { s: 12, w: "900", c: d >= 0.45 && d <= 0.55 ? H.v("--green-700") : H.v("--rose-700") });
          for (var m = 0; m <= 1.2; m += 0.25) H.text(ctx, m.toFixed(2), x0 + m * sc, y + 42, { s: 9.5, a: "center", c: H.v("--mist") });
        });
        H.rows(ctx, 700, 60, [["경보 기준 메아리 시간", t.toFixed(1) + " ms", null, true], ["목표 거리", "0.45 ~ 0.55 m"]], 70);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "경보 기준 메아리 시간", min: 1, max: 8, step: 0.1, value: 5, fmt: function (x) { return x.toFixed(1) + " ms"; }, onInput: function (x) { t = x; draw(); } });
      api.info("거리 = 소리의 속력 × 메아리 시간 ÷ 2. 1 ms 는 1000분의 1초입니다. 초록 띠가 목표 거리예요.");
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
      "왕복 1 m 를 가는 시간 = 1 ÷ 331 초 ≈ 3.0 ms (겨울), 1 ÷ 349 초 ≈ 2.9 ms (여름).",
      "두 계절 모두 맞는 시간은 2.8 ~ 3.1 ms 사이입니다."
    ],
    solution: "기준 메아리 시간 <b>2.8 ~ 3.1 ms</b>.",
    why: "초음파 센서는 소리의 속력과 메아리 시간으로 거리를 계산합니다. 소리는 갔다가 돌아오므로 거리는 ‘속력 × 시간 ÷ 2’ 입니다. 기온이 오르면 소리가 빨라져 같은 시간에 더 먼 거리가 되므로, 정밀한 센서는 온도 센서를 함께 달아 속력을 고쳐 계산합니다.<br>" +
      "박쥐와 돌고래도 같은 원리(반향 정위)로 먹이를 찾고, 라이다는 소리 대신 빛을 씁니다. 하나의 원리가 여러 첨단 기술로 이어져요."
  },

  /* ------------------------------------------------------------------ 2. 3D 프린팅 */
  {
    id: "c2", tag: "첨단 제작 기술 · 품질과 시간의 균형", title: "과학 축제 전까지 출력하기", short: "3D 프린팅",
    who: "🖨️", name: "메이커 동아리",
    say: "“과학 축제에 전시할 높이 60 mm 의 로켓 모형을 3D 프린터로 출력해야 해요. 한 층씩 녹인 플라스틱을 쌓는데, 층이 얇을수록 표면이 매끈하지만 층이 많아 오래 걸려요. 속을 채우는 비율(채움 밀도)을 높이면 튼튼하지만 역시 오래 걸리죠. <b>층 높이 0.2 mm 이하</b>(매끈함), <b>채움 밀도 40% 이상</b>(튼튼함), <b>4시간 안</b>에 끝나게 설정해 주세요.”",
    predict: {
      q: "층 높이를 0.2 mm 에서 0.1 mm 로 절반으로 줄이면 출력 시간은?",
      options: ["㉠ 절반으로 줄어든다", "㉡ 층 수가 두 배가 되어 약 두 배로 늘어난다", "㉢ 변하지 않는다"],
      answer: 1
    },
    task: "층 높이와 채움 밀도를 정해 <b>매끈함 · 튼튼함 · 4시간 이내</b>를 모두 맞추세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(250), ctx = cv.ctx, W = cv.W, lh = 0.3, den = 20;
      function layers() { return Math.round(60 / lh); }
      function minutes() { return layers() * (0.5 + 0.005 * den); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var n = layers(), x0 = 80, by = 220, hpx = 180, step = hpx / n;
        for (var i = 0; i < n; i += Math.max(1, Math.round(n / 60))) {
          var y = by - i * step, wv = 60 + 40 * Math.sin(i / n * Math.PI);
          H.box(ctx, x0 + 100 - wv, y - Math.max(1.5, step * Math.max(1, Math.round(n / 60))), 2 * wv, Math.max(1.5, step * Math.max(1, Math.round(n / 60))) - 0.6, i % 2 ? H.v("--brand") : H.v("--brand-700"), 0.8);
        }
        H.text(ctx, n + " 층", x0 + 100, by + 20, { s: 12, w: "800", a: "center" });
        var m = minutes(), ok = lh <= 0.2 + 1e-9 && den >= 40 && m <= 240;
        H.rows(ctx, 400, 36, [
          ["층 높이 (표면)", lh.toFixed(2) + " mm " + (lh <= 0.2 + 1e-9 ? "매끈함" : "계단이 보임"), lh <= 0.2 + 1e-9 ? "--green-700" : "--rose-700"],
          ["채움 밀도 (강도)", den + "% " + (den >= 40 ? "튼튼함" : "약함"), den >= 40 ? "--green-700" : "--rose-700"],
          ["출력 시간", Math.floor(m / 60) + "시간 " + Math.round(m % 60) + "분", m <= 240 ? "--green-700" : "--rose-700", true]
        ], 60);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "층 높이", min: 0.05, max: 0.4, step: 0.05, value: 0.3, fmt: function (x) { return x.toFixed(2) + " mm"; }, onInput: function (x) { lh = x; draw(); } });
      api.slider({ label: "채움 밀도", min: 10, max: 100, step: 10, value: 20, fmt: function (x) { return x + "%"; }, onInput: function (x) { den = x; draw(); } });
      api.info("한 층을 쌓는 데 걸리는 시간 = 0.5 분 + 채움 밀도에 따른 시간(10% 마다 0.05 분).");
      draw();
      return {
        judge: function () {
          var m = minutes();
          if (lh > 0.2 + 1e-9) return { ok: false, msg: "층 높이 " + lh.toFixed(2) + " mm 는 표면에 계단 무늬가 보입니다." };
          if (den < 40) return { ok: false, msg: "채움 밀도 " + den + "% 는 전시 중 부러질 수 있습니다." };
          if (m > 240) return { ok: false, msg: "출력에 " + Math.floor(m / 60) + "시간 " + Math.round(m % 60) + "분이 걸려 축제에 늦습니다. 무엇을 조금 양보할 수 있을까요?" };
          return { ok: true, msg: "층 " + lh.toFixed(2) + " mm · 채움 " + den + "% → " + Math.floor(m / 60) + "시간 " + Math.round(m % 60) + "분. 세 조건의 균형을 찾았습니다." };
        }
      };
    },
    hints: [
      "층 높이 0.2 mm 면 300 층입니다. 층을 더 얇게 하면 시간이 크게 늘어나요.",
      "0.2 mm 에서 채움 밀도를 40 ~ 60% 로 해 보세요."
    ],
    solution: "층 높이 <b>0.2 mm</b>, 채움 밀도 <b>40 ~ 60%</b>.",
    why: "3D 프린터는 설계 데이터를 얇은 층으로 잘라(슬라이싱) 녹인 재료를 한 층씩 쌓습니다. 층이 얇을수록 매끈하지만 층 수가 늘어 시간이 길어지고, 속을 많이 채울수록 튼튼하지만 재료와 시간이 더 듭니다.<br>" +
      "기술을 쓸 때는 여러 조건 사이의 <b>균형(트레이드오프)</b>을 찾아야 합니다. 과학 원리를 알면 무엇을 얼마나 양보할지 계산으로 정할 수 있어요. ※ 시간은 수업용 모형입니다."
  },

  /* ------------------------------------------------------------------ 3. 유전자 가위 */
  {
    id: "c3", tag: "생명 공학 기술 · 서열이 맞아야 자른다", title: "유전자 가위가 자를 곳 찾기", short: "유전자 가위",
    who: "🧬", name: "생명 공학 연구실",
    say: "“유전자 가위는 안내 RNA 가 DNA 에서 <b>한 가닥과 짝이 맞는(다른 가닥과 같은) 서열</b>을 찾아가 자릅니다. 그런데 아무 곳이나 자르는 게 아니라, 찾은 서열 바로 뒤 <b>한 글자 다음에 ‘GG’ 표지(NGG, PAM)</b>가 있어야만 자르지요. 안내 서열(DNA 글자로 적으면) <b>GATTACAG</b> 를 DNA 위에서 움직여, 가위가 <b>실제로 자를 자리</b>를 찾아 주세요. 한 글자만 달라도 엉뚱한 곳을 자를 수 있으니 조심하고요.”",
    predict: {
      q: "안내 서열과 DNA 서열이 여덟 글자 중 일곱 글자만 같다면?",
      options: ["㉠ 충분히 비슷하니 여기를 자르는 것이 목표다", "㉡ 목표가 아닌 곳을 잘못 자를(표적 이탈) 위험이 있는 자리다", "㉢ 서열은 상관없다"],
      answer: 1
    },
    task: "안내 서열의 위치를 옮겨 <b>여덟 글자가 모두 같고 바로 뒤에 NGG 가 있는</b> 자리를 찾으세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(250), ctx = cv.ctx, W = cv.W, pos = 0;
      var DNA = "CTAGATTACAGTAGATCACAGTGGTCGATTACAGAGGA", GUIDE = "GATTACAG";
      var COL = { A: "#e4572e", T: "#f3a712", G: "#29a36a", C: "#1f8fbf" };
      function match() { var m = 0; for (var i = 0; i < 8; i++) if (DNA[pos + i] === GUIDE[i]) m++; return m; }
      function pam() { return DNA.substr(pos + 9, 2) === "GG"; }
      function draw() {
        H.paper(ctx, W, cv.H);
        var cw = 21, x0 = (W - cw * DNA.length) / 2, y = 120;
        H.text(ctx, "DNA", x0, y + 34, { s: 11.5, w: "800", c: H.v("--mist") });
        for (var i = 0; i < DNA.length; i++) {
          var inG = i >= pos && i < pos + 8, inP = i >= pos + 8 && i < pos + 11;
          H.box(ctx, x0 + i * cw + 1, y - 18, cw - 2, 30, COL[DNA[i]], inG ? 0.95 : (inP ? 0.7 : 0.35));
          H.text(ctx, DNA[i], x0 + i * cw + cw / 2, y + 3, { s: 13, w: "900", a: "center", c: "#fff" });
        }
        for (var k = 0; k < 8; k++) {
          var gx = x0 + (pos + k) * cw, same = DNA[pos + k] === GUIDE[k];
          H.box(ctx, gx + 1, y - 64, cw - 2, 28, same ? H.v("--green-700") : H.v("--rose-700"), 0.85);
          H.text(ctx, GUIDE[k], gx + cw / 2, y - 45, { s: 13, w: "900", a: "center", c: "#fff" });
        }
        H.text(ctx, "안내 RNA", x0 + pos * cw, y - 72, { s: 11, w: "800", c: H.v("--brand-700") });
        if (pam()) H.text(ctx, "PAM", x0 + (pos + 9.5) * cw, y + 34, { s: 11, w: "900", a: "center", c: H.v("--green-700") });
        var m = match(), ok = m === 8 && pam();
        H.text(ctx, "같은 글자 " + m + " / 8", 60, 200, { s: 15, w: "900", c: m === 8 ? H.v("--green-700") : H.v("--ink") });
        H.text(ctx, "바로 뒤 NGG 표지: " + (pam() ? "있음" : "없음"), 260, 200, { s: 15, w: "900", c: pam() ? H.v("--green-700") : H.v("--rose-700") });
        H.text(ctx, ok ? "✂ 여기를 자른다" : (m === 7 && pam() ? "⚠ 잘못 자를 위험" : "자르지 않는다"), 560, 200, { s: 16, w: "900", c: ok ? H.v("--green-700") : (m === 7 && pam() ? H.v("--amber-700") : H.v("--mist")) });
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "안내 서열의 위치", min: 0, max: 27, step: 1, value: 0, fmt: function (x) { return (x + 1) + "번째 글자부터"; }, onInput: function (x) { pos = x; draw(); } });
      api.info("초록 칸은 같은 글자, 빨간 칸은 다른 글자입니다. 실제로는 안내 RNA 가 DNA 의 한쪽 가닥과 염기쌍을 이루며 결합하고, RNA 에는 T 대신 U 가 들어갑니다(GAUUACAG).");
      draw();
      return {
        judge: function () {
          var m = match(), p = pam();
          if (m === 8 && p) return { ok: true, msg: (pos + 1) + "번째 글자부터 여덟 글자가 모두 같고, 바로 뒤에 NGG(AGG) 가 있습니다. 가위가 이 자리를 자릅니다." };
          if (m === 8) return { ok: false, msg: "서열은 모두 같지만 바로 뒤에 NGG 표지가 없어 가위가 자르지 않습니다. 같은 서열이 또 있는지 찾아보세요." };
          if (m === 7 && p) return { ok: false, msg: "한 글자가 다른데 NGG 가 있어 가위가 잘못 자를 수도 있는 자리입니다. 연구자들이 가장 조심하는 곳이에요." };
          return { ok: false, msg: "같은 글자가 " + m + "개뿐입니다." };
        }
      };
    },
    hints: [
      "GATTACAG 는 이 DNA 에 두 번 나옵니다. 둘 가운데 바로 뒤에 ‘아무 글자 하나 + GG’ 가 있는 쪽은?",
      "뒤쪽의 GATTACAG (27번째 글자부터)를 보세요."
    ],
    solution: "<b>27번째 글자부터</b> (GATTACAG 바로 뒤에 AGG).",
    why: "유전자 가위(크리스퍼 캐스9)는 안내 RNA 의 염기 서열과 짝이 맞는 DNA 를 찾아가, 그 옆에 특정한 짧은 표지(PAM, 흔히 쓰는 캐스9 은 NGG)가 있을 때만 자릅니다. 두 조건 덕분에 원하는 자리만 골라 자를 수 있지요.<br>" +
      "그러나 서열이 한두 글자만 다른 곳을 잘못 자르는 ‘표적 이탈’이 일어날 수 있어, 연구자들은 안내 서열을 고를 때 DNA 전체에 비슷한 서열이 없는지 컴퓨터로 확인합니다. 생명과학과 정보 기술이 함께 쓰이는 첨단 기술입니다."
  }
  ]
});
})();
