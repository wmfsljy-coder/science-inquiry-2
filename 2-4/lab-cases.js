/* 과학탐구실험2 Ⅱ-2 미래 사회와 첨단 과학 탐구 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 태양광 패널 각도 */
  {
    id: "c1", tag: "첨단 에너지 기술 · 빛을 정면으로", title: "계절마다 각도를 바꾸는 태양광 패널", short: "태양광 각도",
    who: "☀️", name: "학교 태양광 발전 동아리",
    say: "“우리 학교(북위 37°) 옥상의 태양광 패널은 햇빛을 <b>정면으로</b> 받을수록 전기를 많이 만듭니다. 한낮의 태양 고도는 여름(하지)에 76.5°, 겨울(동지)에 29.5° 예요. 패널 기울기를 계절마다 바꿔, 두 계절 모두 한낮 발전량이 최대치의 <b>98% 이상</b>이 되게 해 주세요.”",
    predict: {
      q: "태양이 낮게 뜨는 겨울에는 패널을 어떻게 기울여야 할까요?",
      options: ["㉠ 눕혀야(기울기를 작게) 한다", "㉡ 세워야(기울기를 크게) 한다", "㉢ 계절과 상관없다"],
      answer: 1
    },
    task: "여름과 겨울의 패널 기울기를 정해 <b>두 계절 모두 98% 이상</b>이 되게 하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, ts = 37, tw = 37;
      function eff(alt, tilt) { return Math.max(0, Math.cos((90 - alt - tilt) * Math.PI / 180)); }
      function panel(x, alt, tilt, name) {
        var gy = 220, r = alt * Math.PI / 180, t = tilt * Math.PI / 180;
        H.line(ctx, [[x - 110, gy], [x + 110, gy]], H.v("--ink"), 2);
        H.line(ctx, [[x - 60 * Math.cos(t), gy - 10 + 60 * Math.sin(t) * 0], [x + 60 * Math.cos(t), gy - 10 - 120 * Math.sin(t) / 1]], H.v("--brand"), 7);
        for (var k = -1; k <= 1; k++) H.arrow(ctx, x - 150 * Math.cos(r) + k * 30 * Math.sin(r), gy - 20 - 150 * Math.sin(r) - k * 30 * Math.cos(r), x - 40 * Math.cos(r) + k * 30 * Math.sin(r), gy - 20 - 40 * Math.sin(r) - k * 30 * Math.cos(r), H.v("--amber-700"), 2, 7);
        var e = eff(alt, tilt);
        H.text(ctx, name + " (태양 고도 " + alt + "°)", x, 26, { s: 12.5, w: "900", a: "center" });
        H.text(ctx, "기울기 " + tilt + "° → " + Math.round(e * 100) + "%", x, 250, { s: 13, w: "900", a: "center", c: e >= 0.98 ? H.v("--green-700") : H.v("--rose-700") });
      }
      function draw() { H.paper(ctx, W, cv.H); panel(230, 76.5, ts, "여름 한낮"); panel(660, 29.5, tw, "겨울 한낮"); }
      cv.canvas._redraw = draw;
      api.slider({ label: "여름 패널 기울기", min: 0, max: 90, step: 5, value: 37, fmt: function (x) { return x + "°"; }, onInput: function (x) { ts = x; draw(); } });
      api.slider({ label: "겨울 패널 기울기", min: 0, max: 90, step: 5, value: 37, fmt: function (x) { return x + "°"; }, onInput: function (x) { tw = x; draw(); } });
      api.info("발전량은 햇빛과 패널이 이루는 각에 따라 달라집니다. 햇빛이 패널에 수직으로 들어올 때(패널 기울기 + 태양 고도 = 90°) 가장 많아요.");
      draw();
      return {
        judge: function () {
          var es = eff(76.5, ts), ew = eff(29.5, tw);
          if (es >= 0.98 && ew >= 0.98) return { ok: true, msg: "여름 " + ts + "° → " + Math.round(es * 100) + "%, 겨울 " + tw + "° → " + Math.round(ew * 100) + "%. 계절마다 햇빛을 정면으로 받습니다." };
          return { ok: false, msg: "여름 " + Math.round(es * 100) + "%, 겨울 " + Math.round(ew * 100) + "%. 패널 기울기 + 태양 고도 = 90° 가 되게 해 보세요." };
        }
      };
    },
    hints: ["여름에는 90 − 76.5 = 13.5°, 겨울에는 90 − 29.5 = 60.5° 근처가 가장 좋습니다.", "여름 5 ~ 20°, 겨울 50 ~ 70° 를 해 보세요."],
    solution: "여름 <b>5 ~ 20°</b>, 겨울 <b>50 ~ 70°</b>.",
    why: "태양 전지는 햇빛의 에너지를 전기로 바꾸는데, 같은 넓이의 패널이 받는 빛의 양은 햇빛이 수직으로 들어올 때 가장 많습니다. 태양 고도는 계절마다 달라서, 계절에 따라 기울기를 바꾸거나 태양을 따라 움직이는 추적 장치를 쓰면 발전량이 늘어납니다.<br>" +
      "기울기를 하나로 고정한다면 보통 그 지역의 위도(우리 학교 37°) 근처로 정합니다. 지구과학(태양 고도)과 물리(빛 에너지)가 만나는 첨단 기술이에요."
  },

  /* ------------------------------------------------------------------ 2. 드론 배터리 */
  {
    id: "c2", tag: "첨단 운송 기술 · 무거우면 더 힘이 든다", title: "구호 물품 드론의 배터리 고르기", short: "드론 배터리",
    who: "🚁", name: "재난 구조 드론 연구팀",
    say: "“섬마을에 약을 나르는 드론을 만듭니다. 배터리 용량이 클수록 에너지가 많지만, 그만큼 배터리가 무거워져(1 Wh 에 약 6.7 g) 떠 있는 데 힘이 더 듭니다. 드론 몸체와 약을 합친 무게는 1 kg 이에요. <b>가장 오래</b>(23분 이상) 날 수 있는 배터리 용량을 골라 주세요.”",
    predict: {
      q: "배터리 용량을 두 배로 늘리면 비행 시간은?",
      options: ["㉠ 정확히 두 배가 된다", "㉡ 늘긴 하지만 무게도 늘어 두 배보다 적게 늘고, 너무 크면 오히려 줄 수 있다", "㉢ 변하지 않는다"],
      answer: 1
    },
    task: "배터리 용량을 정해 <b>비행 시간 23분 이상</b>을 만드세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(260), ctx = cv.ctx, W = cv.W, C = 60;
      function tmin(c) { return 0.4 * c / Math.pow(1 + c / 150, 1.5); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 60, x1 = 560, y0 = 20, y1 = 220;
        function X(c) { return x0 + (c - 20) / 380 * (x1 - x0); }
        function Y(t) { return y1 - t / 26 * (y1 - y0); }
        H.axes(ctx, x0, y0, x1, y1);
        [0, 10, 20].forEach(function (t) { H.text(ctx, t + "분", x0 - 6, Y(t) + 4, { s: 10, a: "right", c: H.v("--mist") }); });
        [20, 100, 200, 300, 400].forEach(function (c) { H.text(ctx, c + " Wh", X(c), y1 + 16, { s: 10, a: "center", c: H.v("--mist") }); });
        H.dash(ctx, x0, Y(23), x1, Y(23), H.v("--amber-700"), 1.5);
        var pts = []; for (var c = 20; c <= 400; c += 10) pts.push([X(c), Y(tmin(c))]);
        H.line(ctx, pts, H.v("--brand"), 2.5);
        var t = tmin(C), ok = t >= 23;
        H.dot(ctx, X(C), Y(t), 7, ok ? H.v("--green-700") : H.v("--rose-700"));
        H.rows(ctx, 600, 50, [
          ["배터리 무게", (C / 150).toFixed(2) + " kg"],
          ["전체 무게", (1 + C / 150).toFixed(2) + " kg"],
          ["비행 시간", t.toFixed(1) + " 분", ok ? "--green-700" : "--rose-700", true]
        ], 62);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "배터리 용량", min: 20, max: 400, step: 20, value: 60, fmt: function (x) { return x + " Wh"; }, onInput: function (x) { C = x; draw(); } });
      api.info("드론이 떠 있는 데 드는 힘(전력)은 전체 무게가 늘수록 더 빨리 커집니다(무게의 1.5제곱에 비례한다고 가정).");
      draw();
      return {
        judge: function () {
          var t = tmin(C);
          if (t >= 23) return { ok: true, msg: C + " Wh → " + t.toFixed(1) + "분. 에너지와 무게의 균형이 가장 좋은 곳입니다." };
          return { ok: false, msg: C + " Wh → " + t.toFixed(1) + "분. " + (C < 260 ? "에너지가 모자랍니다." : "배터리가 너무 무거워 오히려 짧아졌어요.") };
        }
      };
    },
    hints: ["그래프가 가장 높은 곳을 찾아보세요. 끝까지 늘리는 것이 답이 아닙니다.", "260 ~ 340 Wh 근처가 가장 깁니다."],
    solution: "배터리 용량 <b>260 ~ 340 Wh</b> (약 300 Wh).",
    why: "배터리를 키우면 에너지는 늘지만 무게도 늘어 떠 있는 데 드는 전력이 더 빨리 커집니다. 그래서 비행 시간은 어느 용량에서 가장 길고, 그보다 크면 오히려 줄어요. 이 모형에서는 배터리 무게가 몸체의 2배일 때가 가장 좋습니다.<br>" +
      "전기차, 인공위성, 우주 로켓도 같은 고민을 합니다. 배터리의 에너지 밀도(1 kg 에 담긴 에너지)를 높이는 연구가 첨단 기술의 핵심인 까닭이에요. ※ 수업용 단순 모형입니다."
  },

  /* ------------------------------------------------------------------ 3. 우주 쓰레기 */
  {
    id: "c3", tag: "과학 기술의 발전 방향 · 우주 환경", title: "위성 인터넷과 우주 쓰레기", short: "우주 쓰레기",
    who: "🛰️", name: "우주 교통 관리 위원회",
    say: "“위성 인터넷을 전 세계에 제공하려면 위성이 <b>20 000 기 이상</b> 필요합니다. 그런데 수명이 끝난 위성을 그대로 두면 우주 쓰레기가 늘어 충돌 위험이 커지지요. 10년 뒤 한 해 충돌 위험이 <b>2% 이하</b>가 되도록, 올릴 위성 수와 다 쓴 위성의 처리 규칙을 정해 주세요.”",
    predict: {
      q: "수명이 끝난 위성을 빨리 대기권으로 끌어내려 태우면?",
      options: ["㉠ 우주 쓰레기가 줄어 충돌 위험이 낮아진다", "㉡ 아무 차이가 없다", "㉢ 오히려 충돌이 늘어난다"],
      answer: 0
    },
    task: "위성 수와 처리 규칙을 정해 <b>20 000 기 이상</b> 운영하면서 <b>충돌 위험 2% 이하</b>를 맞추세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(260), ctx = cv.ctx, W = cv.W, N = 30000, rule = "none";
      var F = { none: 1.0, y25: 0.6, y5: 0.1 };
      function debris() { return 30000 + N * F[rule]; }
      function risk() { return N * debris() / 4e8; }
      function draw() {
        H.paper(ctx, W, cv.H);
        var cx = 170, cy = 130, R = 70, d = debris();
        H.dot(ctx, cx, cy, R, "#2f6fd6");
        ctx.strokeStyle = "rgba(47,111,214,0.25)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R + 30, 0, Math.PI * 2); ctx.stroke();
        var nd = Math.min(260, Math.round(d / 400));
        for (var i = 0; i < nd; i++) { var a = i * 2.39996, rr = R + 12 + (i * 37 % 40); H.dot(ctx, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 1.5, i < N * F[rule] / 400 ? H.v("--rose-700") : H.v("--mist")); }
        var rk = risk(), ok = N >= 20000 && rk <= 2;
        H.rows(ctx, 380, 40, [
          ["운영 위성", N.toLocaleString() + " 기", N >= 20000 ? "--green-700" : "--rose-700"],
          ["10년 뒤 우주 쓰레기", Math.round(d).toLocaleString() + " 개"],
          ["한 해 충돌 위험", rk.toFixed(2) + " %", rk <= 2 ? "--green-700" : "--rose-700", true]
        ], 62);
        H.text(ctx, "빨간 점 = 다 쓴 위성이 남긴 쓰레기", 380, 240, { s: 11, w: "700", c: H.v("--mist") });
        return ok;
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "운영할 위성 수", min: 5000, max: 40000, step: 5000, value: 30000, fmt: function (x) { return x.toLocaleString() + " 기"; }, onInput: function (x) { N = x; draw(); } });
      api.seg({ label: "수명이 끝난 위성 처리", value: "none", options: [{ v: "none", t: "그대로 둔다" }, { v: "y25", t: "25년 안에 끌어내림" }, { v: "y5", t: "5년 안에 끌어내림" }], onPick: function (x) { rule = x; draw(); } });
      api.info("충돌 위험은 궤도의 위성 수와 쓰레기 수가 많을수록 커집니다(둘을 곱한 값에 비례한다고 가정).");
      draw();
      return {
        judge: function () {
          var rk = risk();
          if (N < 20000) return { ok: false, msg: "위성이 " + N.toLocaleString() + " 기뿐이라 전 세계에 서비스를 할 수 없습니다." };
          if (rk > 2) return { ok: false, msg: "충돌 위험 " + rk.toFixed(2) + "% — 너무 높습니다. " + (rule !== "y5" ? "다 쓴 위성의 처리 규칙을 바꿔 보세요." : "위성 수를 줄여 보세요.") };
          return { ok: true, msg: N.toLocaleString() + " 기 · 5년 안 제거 → 충돌 위험 " + rk.toFixed(2) + "%. 서비스와 우주 환경을 함께 지켰습니다." };
        }
      };
    },
    hints: ["‘5년 안에 끌어내림’을 골라 보세요.", "위성 수는 꼭 필요한 20 000 기로 맞추세요."],
    solution: "<b>5년 안에 끌어내림</b>, 위성 <b>20 000 기</b>.",
    why: "궤도에 위성과 쓰레기가 많아지면 충돌이 늘고, 충돌로 생긴 조각이 다시 충돌을 부르는 연쇄(케슬러 증후군)가 일어날 수 있습니다. 그래서 수명이 끝난 위성을 정해진 기간 안에 대기권으로 끌어내려 태우는 규칙이 논의되고, 여러 나라가 규범을 강화하고 있어요.<br>" +
      "첨단 기술의 발전 방향을 평가할 때는 편리함(기술 파급)과 함께 <b>환경과 미래 세대</b>에 미치는 영향까지 따져야 합니다. ※ 위험도 값은 수업용 모형입니다."
  }
  ]
});
})();
