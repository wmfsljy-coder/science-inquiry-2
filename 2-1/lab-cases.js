/* 과학탐구실험2 Ⅰ-1 생활 속의 과학 탐구 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 전자레인지와 초콜릿 */
  {
    id: "c1", tag: "요리 속 파동 · 정상파", title: "초콜릿으로 빛의 속력 재기", short: "전자레인지 정상파",
    who: "🍫", name: "과학 요리 동아리",
    say: "“전자레인지 안에서는 마이크로파(진동수 2.45 GHz)가 벽에 반사되어 <b>전기장이 세게 진동하는 곳과 거의 진동하지 않는 곳</b>이 번갈아 생긴대요. 회전판을 빼고 초콜릿 판을 잠깐 데우면 세게 진동하는 곳만 녹아요. 녹은 자국 사이 거리는 파장의 절반이니, 빛의 속력 = 2 × 자국 간격 × 진동수 로 빛(전자기파)의 속력을 구할 수 있지요. 자를 맞춰 간격을 재고 <b>빛의 속력(3 × 10⁸ m/s)의 ± 5%</b> 안으로 구해 주세요.”",
    predict: {
      q: "회전판을 그대로 둔 채 초콜릿을 데우면 어떻게 될까요?",
      options: ["㉠ 녹은 자국이 더 뚜렷해진다", "㉡ 초콜릿이 돌면서 여러 곳을 지나 고르게 녹아, 자국 간격을 잴 수 없다", "㉢ 전혀 녹지 않는다"],
      answer: 1
    },
    task: "회전판을 정하고 자의 눈금 간격을 녹은 자국에 맞춰, <b>빛의 속력 2.85~3.15 × 10⁸ m/s</b>를 구하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(260), ctx = cv.ctx, W = cv.W;
      var turn = "on", d = 4.0, TRUE_D = 6.12;
      function c() { return 2 * d / 100 * 2.45e9; }
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 60, len = 520, pxcm = len / 26, y = 70;
        H.box(ctx, x0, y, len, 60, "#6b3e1f", 0.9);
        if (turn === "off") {
          for (var k = 0; k * TRUE_D <= 25; k++) { var cx = x0 + (1 + k * TRUE_D) * pxcm; ctx.fillStyle = "rgba(255,220,170,0.75)"; ctx.beginPath(); ctx.ellipse(cx, y + 30, 16, 22, 0, 0, Math.PI * 2); ctx.fill(); }
        } else {
          ctx.fillStyle = "rgba(255,220,170,0.25)"; ctx.fillRect(x0, y, len, 60);
        }
        H.text(ctx, turn === "off" ? "녹은 자국" : "고르게 조금씩 녹음", x0, y - 10, { s: 11.5, w: "800", c: H.v("--mist") });
        /* 자 */
        var ry = y + 90;
        H.box(ctx, x0, ry, len, 26, H.v("--amber-700"), 0.25);
        for (var j = 0; j * d <= 25.5; j++) { var tx = x0 + (1 + j * d) * pxcm; H.line(ctx, [[tx, ry - 8], [tx, ry + 26]], H.v("--ink"), 2); }
        for (var cm = 0; cm <= 26; cm += 2) H.text(ctx, cm, x0 + cm * pxcm, ry + 42, { s: 9.5, a: "center", c: H.v("--mist") });
        H.text(ctx, "cm", x0 + len + 12, ry + 42, { s: 9.5, c: H.v("--mist") });
        var v = c() / 1e8, ok = turn === "off" && v >= 2.85 && v <= 3.15;
        H.rows(ctx, 640, 50, [
          ["자 눈금 간격 (= 자국 간격)", d.toFixed(1) + " cm"],
          ["파장 = 2 × 간격", (2 * d).toFixed(1) + " cm"],
          ["빛의 속력", v.toFixed(2) + " × 10⁸ m/s", ok ? "--green-700" : "--rose-700", true]
        ], 64);
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "회전판", value: "on", options: [{ v: "on", t: "그대로 둔다" }, { v: "off", t: "빼고 초콜릿을 고정한다" }], onPick: function (x) { turn = x; draw(); } });
      api.slider({ label: "자 눈금 간격", min: 3, max: 10, step: 0.1, value: 4, fmt: function (x) { return x.toFixed(1) + " cm"; }, onInput: function (x) { d = x; draw(); } });
      api.info("검은 눈금이 녹은 자국의 한가운데를 차례로 지나도록 간격을 맞추세요. 첫 눈금은 1 cm 자리입니다.");
      draw();
      return {
        judge: function () {
          var v = c() / 1e8;
          if (turn !== "off") return { ok: false, msg: "회전판이 돌면 초콜릿이 고르게 녹아 자국이 생기지 않습니다. 회전판을 빼세요." };
          if (v < 2.85 || v > 3.15) return { ok: false, msg: "계산한 속력 " + v.toFixed(2) + " × 10⁸ m/s. 눈금이 자국과 어긋나 있어요. 간격을 다시 맞춰 보세요." };
          return { ok: true, msg: "자국 간격 " + d.toFixed(1) + " cm → 빛의 속력 " + v.toFixed(2) + " × 10⁸ m/s. 부엌에서 우주에서 가장 빠른 속력을 쟀습니다!" };
        }
      };
    },
    hints: [
      "먼저 회전판을 빼세요. 그러면 녹은 자국이 나란히 생깁니다.",
      "자국은 약 6 cm 간격입니다. 2 × 0.06 m × 2.45 × 10⁹ Hz ≈ 2.9 × 10⁸ m/s."
    ],
    solution: "<b>회전판을 빼고</b>, 눈금 간격 <b>5.9~6.4 cm</b> (자국 간격 약 6.1 cm).",
    why: "전자레인지 안에서는 벽에 반사된 마이크로파가 서로 간섭해 <b>정상파</b>가 생깁니다. 전기장이 세게 진동하는 곳(배)끼리의 거리는 파장의 절반이라, 녹은 자국 간격 × 2가 파장이고, 파장 × 진동수 = 파동의 속력입니다.<br>" +
      "회전판은 음식이 배와 마디를 고루 지나게 해 고르게 데우려고 있는 것입니다. 생활 도구의 설계에도 파동의 원리가 들어 있습니다. ※ 실제로 해 볼 때는 선생님과 함께, 짧게(20초 안팎) 데우세요."
  },

  /* ------------------------------------------------------------------ 2. 높이뛰기 매트 */
  {
    id: "c2", tag: "스포츠 속 힘 · 멈추는 거리를 늘리면", title: "높이뛰기 매트의 두께", short: "착지 매트",
    who: "🤸", name: "학교 체육부",
    say: "“높이뛰기 선수는 2 m 높이에서 등으로 떨어집니다. 몸이 받는 평균 힘이 <b>몸무게의 6배 이하</b>여야 다치지 않는다고 해요. 매트는 두께의 80%까지 눌리며 선수를 멈춥니다. 너무 두꺼운 매트는 비싸고 착지가 불안정하니 <b>0.8 m 이하</b>로 골라 주세요.”",
    predict: {
      q: "같은 높이에서 떨어질 때 모래보다 두꺼운 매트가 덜 아픈 까닭은?",
      options: ["㉠ 매트가 선수를 가볍게 만들어서", "㉡ 멈추기까지의 거리와 시간이 길어져, 받는 힘이 작아지기 때문에", "㉢ 매트가 떨어지는 속력을 없애 주어서"],
      answer: 1
    },
    task: "착지면과 매트 두께를 정해 <b>받는 힘 ≤ 몸무게 × 6</b>, <b>두께 ≤ 0.8 m</b>를 함께 맞추세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W;
      var surf = "sand", t = 0.2, HT = 2;
      function stopD() { return surf === "concrete" ? 0.01 : (surf === "sand" ? 0.08 : 0.8 * t); }
      function ratio() { return 1 + HT / stopD(); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var gy = 230, x = 200, sc = 80;
        H.line(ctx, [[40, gy], [520, gy]], H.v("--ink"), 3);
        var th = surf === "mat" ? t * sc : (surf === "sand" ? 16 : 4);
        H.box(ctx, 90, gy - th, 260, th, surf === "mat" ? H.v("--brand") : (surf === "sand" ? "#d9b56b" : "#9aa3ad"), surf === "mat" ? 0.55 : 0.9);
        H.dash(ctx, x, gy - th - HT * sc * 0.9, x, gy - th - 12, H.v("--mist"), 1.5);
        H.text(ctx, "🤸", x, gy - th - HT * sc * 0.9, { s: 24, a: "center" });
        H.text(ctx, "2 m", x + 16, gy - th - HT * sc * 0.45, { s: 11, w: "800", c: H.v("--mist") });
        H.text(ctx, surf === "mat" ? "매트 " + t.toFixed(2) + " m (멈추는 거리 " + stopD().toFixed(2) + " m)" : (surf === "sand" ? "모래 (멈추는 거리 약 0.08 m)" : "콘크리트 (멈추는 거리 약 0.01 m)"), 90, gy + 24, { s: 11.5, w: "800" });
        var r = ratio(), ok = surf === "mat" && r <= 6 && t <= 0.8;
        H.rows(ctx, 580, 50, [
          ["평균 힘 ÷ 몸무게", r.toFixed(1) + " 배", r <= 6 ? "--green-700" : "--rose-700", true],
          ["안전 기준", "6 배 이하"],
          ["판정", ok ? "안전하게 착지" : (surf !== "mat" ? "다칠 위험" : (t > 0.8 ? "너무 두껍다" : "아직 위험")), ok ? "--green-700" : "--rose-700"]
        ], 66);
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "착지면", value: "sand", options: [{ v: "concrete", t: "콘크리트" }, { v: "sand", t: "모래밭" }, { v: "mat", t: "스펀지 매트" }], onPick: function (x) { surf = x; draw(); } });
      api.slider({ label: "매트 두께", min: 0.1, max: 1.2, step: 0.05, value: 0.2, fmt: function (x) { return x.toFixed(2) + " m"; }, onInput: function (x) { t = x; draw(); } });
      api.info("떨어진 높이만큼 얻은 에너지를 멈추는 거리 동안 없애야 합니다. 평균 힘 ≈ 몸무게 × (1 + 떨어진 높이 ÷ 멈추는 거리).");
      draw();
      return {
        judge: function () {
          var r = ratio();
          if (surf !== "mat") return { ok: false, msg: (surf === "sand" ? "모래" : "콘크리트") + "에서는 몸무게의 " + r.toFixed(0) + "배 힘을 받습니다. 멈추는 거리가 너무 짧습니다." };
          if (t > 0.8) return { ok: false, msg: "힘은 작지만 매트가 " + t.toFixed(2) + " m로 너무 두껍습니다." };
          if (r > 6) return { ok: false, msg: "매트 " + t.toFixed(2) + " m → 몸무게의 " + r.toFixed(1) + "배. 조금 더 두꺼워야 합니다." };
          return { ok: true, msg: "매트 " + t.toFixed(2) + " m → 몸무게의 " + r.toFixed(1) + "배. 멈추는 거리를 늘려 받는 힘을 줄였습니다." };
        }
      };
    },
    hints: [
      "먼저 스펀지 매트를 고르세요.",
      "1 + 2 ÷ (0.8 × 두께) ≤ 6이 되려면 두께가 0.5 m 이상이어야 합니다."
    ],
    solution: "<b>스펀지 매트</b>, 두께 <b>0.5~0.8 m</b>.",
    why: "떨어지는 몸을 멈추는 데 필요한 ‘힘 × 거리’(일)는 떨어진 높이와 눌린 거리를 합한 높이만큼의 위치 에너지로 정해집니다. 그래서 멈추는 거리를 늘리면 받는 힘이 줍니다. 시간으로 보면, 같은 운동량을 없애는 데 걸리는 시간이 길어질수록 힘이 작아지는 것(충격량)과 같은 원리입니다.<br>" +
      "자동차 에어백, 헬멧 속 스티로폼, 운동화 쿠션도 모두 멈추는 거리와 시간을 늘리는 장치입니다. ※ 몸을 한 점으로 본 단순화한 계산입니다."
  },

  /* ------------------------------------------------------------------ 3. 이중창 공기층 */
  {
    id: "c3", tag: "건축 속 열 · 전도와 대류", title: "이중창 공기층은 넓을수록 좋을까", short: "이중창",
    who: "🏠", name: "학교 리모델링 설계팀",
    say: "“교실 창을 바꾸려고 해요. 유리 안쪽에 복사열을 막는 로이(Low-E) 코팅을 한 이중창은 유리 사이 공기층이 열이 빠져나가는 것을 막아 줍니다. 공기층을 넓힐수록 좋을 것 같지만, 너무 넓으면 공기가 안에서 빙글빙글 돌기 시작한대요. 창의 열 손실 값(U, 작을수록 좋음)을 <b>1.5 W/(m²·K) 이하</b>로 만드는 공기층 두께를 찾아 주세요.”",
    predict: {
      q: "공기층을 5 mm에서 30 mm로 계속 넓히면 열 손실은?",
      options: ["㉠ 넓힐수록 계속 줄어든다", "㉡ 어느 두께까지는 줄다가, 그보다 넓으면 공기가 돌며(대류) 오히려 조금 늘어난다", "㉢ 두께와 상관없다"],
      answer: 1
    },
    task: "창의 종류와 공기층 두께를 정해 <b>U ≤ 1.5</b>가 되게 하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, type = "single", g = 6;
      function U(gg) { if (type === "single") return 5.8; var R = gg <= 13 ? 0.04 * gg : 0.52 - 0.006 * (gg - 13); return 1 / (0.17 + R); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 60, x1 = 500, y0 = 20, y1 = 220;
        function X(gg) { return x0 + gg / 30 * (x1 - x0); }
        function Y(u) { return y1 - (u - 1) / 5 * (y1 - y0); }
        H.axes(ctx, x0, y0, x1, y1);
        [1, 2, 3, 4, 5, 6].forEach(function (u) { H.text(ctx, u, x0 - 6, Y(u) + 4, { s: 10, a: "right", c: H.v("--mist") }); });
        [0, 10, 20, 30].forEach(function (gg) { H.text(ctx, gg + " mm", X(gg), y1 + 16, { s: 10, a: "center", c: H.v("--mist") }); });
        H.text(ctx, "열 손실 U", x0 + 6, y0 + 4, { s: 11, w: "700", c: H.v("--mist") });
        H.dash(ctx, x0, Y(1.5), x1, Y(1.5), H.v("--amber-700"), 1.5);
        if (type === "double") {
          var pts = []; for (var gg = 1; gg <= 30; gg++) pts.push([X(gg), Y(U(gg))]);
          H.line(ctx, pts, H.v("--brand"), 2.5);
          H.dot(ctx, X(g), Y(U(g)), 7, U(g) <= 1.5 ? H.v("--green-700") : H.v("--rose-700"));
        } else H.dot(ctx, X(0), Y(5.8), 7, H.v("--rose-700"));
        /* 창 단면 */
        var wx = 560, wy = 40;
        H.box(ctx, wx, wy, 8, 170, "#9ecbe8", 0.9);
        if (type === "double") {
          var gp = Math.max(4, g * 3);
          H.box(ctx, wx + 8, wy, gp, 170, H.v("--panel-2") || "#eef", 0.9);
          H.box(ctx, wx + 8 + gp, wy, 8, 170, "#9ecbe8", 0.9);
          if (g > 13) H.text(ctx, "↻", wx + 8 + gp / 2, wy + 90, { s: 18, a: "center", c: H.v("--coral-700") });
        }
        H.text(ctx, "안 20 °C", wx + 120, wy + 20, { s: 11, w: "700", c: H.v("--coral-700") });
        H.text(ctx, "밖 0 °C", wx - 50, wy + 20, { s: 11, w: "700", c: H.v("--brand-700") });
        H.text(ctx, "U = " + U(g).toFixed(2), wx + 120, wy + 110, { s: 18, w: "900", c: U(g) <= 1.5 ? H.v("--green-700") : H.v("--rose-700") });
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "창의 종류", value: "single", options: [{ v: "single", t: "유리 한 장 (단창)" }, { v: "double", t: "로이 이중창" }], onPick: function (x) { type = x; draw(); } });
      api.slider({ label: "공기층 두께", min: 1, max: 30, step: 1, value: 6, fmt: function (x) { return x + " mm"; }, onInput: function (x) { g = x; draw(); } });
      api.info("공기는 열을 잘 전하지 않는(전도가 느린) 물질입니다. 하지만 공간이 넓으면 따뜻한 쪽 공기는 오르고 찬 쪽 공기는 내려오며 돌아(대류) 열을 옮깁니다.");
      draw();
      return {
        judge: function () {
          var u = U(g);
          if (type !== "double") return { ok: false, msg: "유리 한 장은 U = 5.8로 열이 많이 빠져나갑니다." };
          if (u > 1.5) return { ok: false, msg: "공기층 " + g + " mm → U = " + u.toFixed(2) + ". " + (g < 13 ? "공기층이 너무 얇습니다." : "너무 넓어 공기가 돌기 시작했어요.") };
          return { ok: true, msg: "공기층 " + g + " mm → U = " + u.toFixed(2) + ". 전도를 막을 만큼 넓고, 대류가 생기지 않을 만큼 좁은 두께입니다." };
        }
      };
    },
    hints: [
      "이중창을 고른 뒤, 그래프에서 U가 가장 낮아지는 곳을 찾아보세요.",
      "13~16 mm 근처가 가장 낮습니다."
    ],
    solution: "<b>로이 이중창</b>, 공기층 <b>13~16 mm</b>.",
    why: "공기층이 얇을 때는 공기가 넓을수록 열의 <b>전도</b>를 더 잘 막습니다. 그런데 너무 넓으면 공기층 안에서 공기가 도는 <b>대류</b>가 생겨 열을 옮기므로, 가장 좋은 두께가 따로 있습니다. 실제 이중창도 공기층을 12~16 mm 안팎으로 만듭니다. 코팅 없는 보통 이중창은 유리 사이 <b>복사</b>로도 열이 건너가 U가 2.8 안팎이고, 1.5 이하는 로이 코팅(복사 차단)이나 아르곤 충전으로 얻습니다.<br>" +
      "‘많을수록 좋다’가 늘 맞지는 않습니다. 원리를 알면 가장 알맞은 값을 찾아 설계할 수 있습니다. ※ U 값은 수업용 모형입니다."
  }
  ]
});
})();
