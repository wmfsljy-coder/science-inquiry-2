/* 과학탐구실험2 Ⅱ-2 미래 사회와 첨단 과학 탐구 — 이야기 세 편
   01 겨울 딸기 온실 / 02 숨 막히는 5교시 / 03 우주 개발 토론회
   공용 부품: ../assets/theme.js (sthUnit·sthGate·sthWork), ../assets/story.js (sthStory·sthSort·sthOrder·sthPick) */
(function () {
"use strict";

window.sthUnit("gt2-2-4");

var FONT = "'Gothic A1','Segoe UI',sans-serif";
function $(id) { return document.getElementById(id); }
function v(name) { return window.cssVar(name); }
function done(id) { var e = $(id); if (e) e.classList.add("done"); }
function put(id, html) { var e = $(id); if (e) e.innerHTML = html; }
function paper(ctx, W, H) { ctx.clearRect(0, 0, W, H); ctx.fillStyle = v("--panel"); ctx.fillRect(0, 0, W, H); }
function text(ctx, s, x, y, o) {
  o = o || {};
  ctx.font = (o.w || "500") + " " + (o.s || 12) + "px " + FONT;
  ctx.fillStyle = o.c || v("--ink"); ctx.textAlign = o.a || "left";
  ctx.fillText(s, x, y);
}
function axes(ctx, x0, y0, x1, y1) { ctx.strokeStyle = v("--line"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke(); }
function dot(ctx, x, y, r, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
function seg(ctx, x1, y1, x2, y2, c, w, dash) { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = w || 2; if (dash) ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); }
function A(hex, a) {
  hex = String(hex || "#888").trim();
  if (hex.charAt(0) !== "#") return hex;
  if (hex.length === 4) hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  return "rgba(" + parseInt(hex.substr(1, 2), 16) + "," + parseInt(hex.substr(3, 2), 16) + "," + parseInt(hex.substr(5, 2), 16) + "," + a + ")";
}
function segWire(id, attr, onPick) {
  var btns = Array.prototype.slice.call($(id).querySelectorAll("button"));
  btns.forEach(function (b) {
    b.type = "button";
    b.addEventListener("click", function () { btns.forEach(function (x) { x.classList.toggle("on", x === b); }); onPick(b.getAttribute(attr)); });
  });
}
function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

/* =========================================================================
   이야기 ① 겨울 딸기 온실
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep1", key: "ep1", name: "첨단 탐구 ①", onDone: finish });

  window.sthGate({
    gate: "g1", key: "gh1", title: "나의 첫 설계",
    question: "할머니 대신 온실이 스스로 돌보게 하려면 어떻게 해야 할까요?",
    options: ["㉠ 할머니가 계속 직접 하신다", "㉡ 센서로 온도·빛·흙 수분을 재고, 마이크로컨트롤러가 기준과 비교해 창문·조명·펌프를 움직이게 한다", "㉢ 창문을 늘 열어 둔다", "㉣ 타이머로 정해진 시각마다 모든 장치를 켠다"],
    onPick: function (i) { window.sthState("gh1OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 규칙 설계 */
  (function () {
    var canvas = $("a-c-rule"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, T = 32, L = 1000, S = 15;
    var got = window.sthState("ruleGot") || false;
    var CASES = [
      { d: "맑은 한낮, 온도 29 °C", dev: "창문", want: true, act: function () { return 29 > T; } },
      { d: "선선한 아침, 온도 24 °C", dev: "창문", want: false, act: function () { return 24 > T; } },
      { d: "흐린 낮, 밝기 3 000 lux", dev: "LED", want: true, act: function () { return 3000 < L; } },
      { d: "맑은 낮, 밝기 15 000 lux", dev: "LED", want: false, act: function () { return 15000 < L; } },
      { d: "흙 수분 25%", dev: "펌프", want: true, act: function () { return 25 < S; } },
      { d: "흙 수분 45%", dev: "펌프", want: false, act: function () { return 45 < S; } }
    ];
    function nOk() { return CASES.filter(function (c) { return c.act() === c.want; }).length; }
    function draw() {
      paper(ctx, W, H);
      text(ctx, "상황", 30, 26, { s: 11.5, w: "800", c: v("--mist") });
      text(ctx, "장치", 330, 26, { s: 11.5, w: "800", c: v("--mist") });
      text(ctx, "딸기에게 필요한 것", 430, 26, { s: 11.5, w: "800", c: v("--mist") });
      text(ctx, "온실의 동작", 620, 26, { s: 11.5, w: "800", c: v("--mist") });
      CASES.forEach(function (c, i) {
        var y = 56 + i * 36, a = c.act(), ok = a === c.want;
        ctx.fillStyle = A(ok ? v("--green-700") : v("--rose-700"), 0.08); ctx.fillRect(20, y - 20, 860, 30);
        text(ctx, c.d, 30, y, { s: 13, w: "700" });
        text(ctx, c.dev, 330, y, { s: 13, w: "800" });
        text(ctx, c.want ? "켜기(열기)" : "끄기(닫기)", 430, y, { s: 13, w: "700" });
        text(ctx, (a ? "켜짐(열림)" : "꺼짐(닫힘)") + (ok ? "  ✔" : "  ✘"), 620, y, { s: 13, w: "900", c: ok ? v("--green-700") : v("--rose-700") });
      });
      text(ctx, "옳게 움직인 상황 " + nOk() + " / 6", 30, 280, { s: 14, w: "900", c: nOk() === 6 ? v("--green-700") : v("--ink") });
      return nOk() === 6;
    }
    function update() {
      var ok = draw();
      put("a-rule-info", "창문 " + T + " °C 초과, LED " + fmt(L) + " lux 미만, 펌프 " + S + "% 미만일 때 켜집니다. " + (ok ? "✅ 여섯 상황 모두 옳게 움직입니다. 딸기가 좋아하는 조건(과학 지식)이 기준값이 되었어요." : "빨간 줄의 상황을 보고 기준값을 고쳐 보세요."));
      if (ok && !got) { got = true; window.sthState("ruleGot", true); mission(); }
    }
    function mission() {
      if (got) {
        window.sthState("ruleBest", "창문 24 ~ 28 °C, LED 4 000 ~ 15 000 lux, 펌프 30 ~ 45% 에서 여섯 상황 모두 통과");
        window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("ruleBest") + ". 센서 값을 기준과 비교하는 규칙이 온실의 ‘두뇌’입니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("a-t").addEventListener("input", function (ev) { T = +ev.target.value; $("a-t-val").textContent = T + " °C"; update(); });
    $("a-l").addEventListener("input", function (ev) { L = +ev.target.value; $("a-l-val").textContent = fmt(L) + " lux"; update(); });
    $("a-s").addEventListener("input", function (ev) { S = +ev.target.value; $("a-s-val").textContent = S + "%"; update(); });
    update(); mission();
  })();

  /* 장면 3 — 센서 고장 대비 */
  (function () {
    var canvas = $("a-c-fail"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, f1 = 0, f2 = 0, f3 = 0;
    var got = window.sthState("failGot") || { a: false, q: false };
    function real(h) { return 10 + 28 * Math.max(0, Math.sin(Math.PI * (h - 6) / 13)); }
    function detect() { return f1 ? 6.2 : (f2 ? 9 : null); }
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 560, y0 = 20, y1 = 230;
      function X(h) { return x0 + (h - 6) / 12 * (x1 - x0); }
      function Y(t) { return y1 - (t - 5) / 38 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [10, 20, 30, 40].forEach(function (t) { text(ctx, t + "°C", x0 - 6, Y(t) + 4, { s: 10, a: "right", c: v("--mist") }); });
      [6, 9, 12, 15, 18].forEach(function (h) { text(ctx, h + "시", X(h), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      seg(ctx, x0, Y(28), x1, Y(28), v("--amber-700"), 1.5, true);
      text(ctx, "딸기 한계 28 °C", x1 - 4, Y(28) - 5, { s: 10, w: "700", a: "right", c: v("--amber-700") });
      var td = detect(), mx = 0;
      ctx.save(); ctx.strokeStyle = v("--coral-700"); ctx.lineWidth = 3; ctx.beginPath();
      for (var h = 6; h <= 18.001; h += 0.1) { var t = real(h); if (td !== null && h > td + 0.5) t = Math.min(t, 26); mx = Math.max(mx, t); if (h === 6) ctx.moveTo(X(h), Y(t)); else ctx.lineTo(X(h), Y(t)); }
      ctx.stroke(); ctx.restore();
      seg(ctx, X(6), Y(20), X(18), Y(20), v("--brand"), 2.5, true);
      text(ctx, "고장 난 센서: 늘 20 °C", X(6) + 6, Y(20) + 16, { s: 10.5, w: "800", c: v("--brand-700") });
      if (td !== null) { seg(ctx, X(td), y0, X(td), y1, v("--green-700"), 2); text(ctx, "고장 알림", X(td) + 4, y0 + 12, { s: 10.5, w: "800", c: v("--green-700") }); }
      if (f3) { seg(ctx, X(12), y0, X(12), y1, v("--mist"), 1.5, true); text(ctx, "정오 강제 개방", X(12) + 4, y0 + 28, { s: 10, w: "700", c: v("--mist") }); }
      var ok = td !== null && td - 6 <= 1 && !f3;
      text(ctx, "실제 최고 온도 " + mx.toFixed(0) + " °C", 610, 60, { s: 14, w: "900", c: mx <= 28.5 ? v("--green-700") : v("--rose-700") });
      text(ctx, "고장을 알아챈 때: " + (td === null ? "모름" : (td === 6.2 ? "6시 10분쯤" : "9시")), 610, 90, { s: 13, w: "800" });
      text(ctx, f3 ? "비 오는 날에도 창문이 열림 ✘" : "쓸데없는 동작 없음", 610, 118, { s: 12.5, w: "700", c: f3 ? v("--rose-700") : v("--mist") });
      text(ctx, ok ? "안전장치 합격" : "보완 필요", 610, 160, { s: 16, w: "900", c: ok ? v("--green-700") : v("--rose-700") });
      return ok;
    }
    function update() {
      var ok = draw(), td = detect();
      put("a-fail-info", (td === null ? "고장을 알아챌 방법이 없어, 딸기는 한낮 38 °C 에 그대로 놓였습니다." : (f1 ? "두 센서의 값이 크게 달라지자 곧바로 고장 알림이 울렸습니다." : "3시간 뒤인 9시에야 알림이 울렸어요. 그사이 온실이 뜨거워질 수 있습니다."))
        + (f3 ? " 정오 강제 개방은 추운 날이나 비 오는 날에도 창문을 열어 딸기를 해칠 수 있습니다." : "") + (ok ? " ✅ 1시간 안에 알아채고, 쓸데없는 동작도 없습니다." : ""));
      if (ok && !got.a) { got.a = true; window.sthState("failGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-3a"); if (got.q) done("m1-3b");
      if (got.a && got.q) {
        window.sthState("failBest", "센서 두 개를 비교해 고장을 곧바로 알아챔");
        window.sthMission("m1-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("failBest") + ". 자동 장치일수록 고장 났을 때를 대비한 설계가 중요합니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    segWire("a-f1", "data-v", function (x) { f1 = +x; update(); });
    segWire("a-f2", "data-v", function (x) { f2 = +x; update(); });
    segWire("a-f3", "data-v", function (x) { f3 = +x; update(); });
    window.sthPick({
      mount: "a-fail-pick",
      q: "자동 온실에 고장 대비 장치가 꼭 필요한 까닭으로 가장 알맞은 것은?",
      options: ["센서는 절대 고장 나지 않으므로 필요 없다", "장치는 센서 값만 믿고 움직이므로, 센서가 틀리면 생명(작물)이 위험해질 수 있기 때문에", "부품을 많이 달수록 멋있어서"],
      answer: 1,
      why: ["센서도 고장 나거나 먼지·물 때문에 틀릴 수 있습니다.", "마이크로컨트롤러는 ‘틀린 값’도 그대로 믿습니다. 여러 센서를 비교하거나 이상한 값을 감지해 알려야 해요.", "필요한 만큼만, 목적에 맞게 설계해야 합니다."],
      onDone: function () { got.q = true; window.sthState("failGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 4 — 부품 분류 */
  window.sthSort({
    mount: "a-sort",
    buckets: [{ id: "in", label: "📥 입력 — 잰다 (센서)" }, { id: "brain", label: "🧠 판단 — 비교한다 (제어)" }, { id: "out", label: "📤 출력 — 움직인다 (작동기)" }],
    items: [
      { t: "온습도 센서", a: "in", why: "공기의 온도와 습도를 잽니다." },
      { t: "조도 센서", a: "in", why: "빛의 밝기를 잽니다." },
      { t: "토양 수분 센서", a: "in", why: "흙의 수분을 잽니다." },
      { t: "마이크로컨트롤러(아두이노 보드)", a: "brain", why: "센서 값을 읽고 판단합니다." },
      { t: "‘29 °C 넘으면 창문 열기’ 같은 기준을 담은 프로그램", a: "brain", why: "판단의 규칙입니다.", hint: "무엇을 할지 정하는 것은 어느 쪽인가요?" },
      { t: "창문을 여닫는 모터", a: "out", why: "판단에 따라 움직입니다." },
      { t: "물 펌프", a: "out", why: "판단에 따라 물을 보냅니다." },
      { t: "식물 생장용 LED 조명", a: "out", why: "판단에 따라 켜집니다." }
    ],
    onDone: function () { window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>입력(센서) → 판단(마이크로컨트롤러) → 출력(작동기). 거의 모든 자동 장치가 이 구조를 따릅니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m1-4", true);

  function finish() { window.sthState("r1", "완성 · " + (window.sthState("ruleBest") || "") + " / " + (window.sthState("failBest") || "")); }
  function vs() {
    $("e1-vs").innerHTML = "<b>나의 첫 설계</b> " + (window.sthState("gh1") || "기록 없음") + "<br><b>규칙 설계</b> " + (window.sthState("ruleBest") || "-") + "<br><b>고장 대비</b> " + (window.sthState("failBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk1", unitLabel: "[과학탐구실험2 Ⅱ-2] 이야기 ① 겨울 딸기 온실",
    items: [
      { id: "w1", label: "제어의 조건", hint: "스마트 온실에서 어떤 값이 얼마를 넘으면 무엇이 작동하도록 정했는지, 그 기준을 정한 근거와 함께 쓰세요.", ph: "센서: … / 기준값: … / 작동: … / 근거: …" },
      { id: "e1a", label: "우리 학교 화단에 적용하기", hint: "스마트 온실의 원리를 학교 화단이나 교실 화분에 적용한다면 어떤 센서와 장치를 쓸지 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ② 숨 막히는 5교시
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep2", key: "ep2", name: "첨단 탐구 ②", onDone: finish });

  window.sthGate({
    gate: "g2", key: "inv2", title: "동아리의 첫 걸음",
    question: "센서를 활용한 생활 발명품 아이디어는 어디서부터 시작하면 좋을까요?",
    options: ["㉠ 멋진 부품부터 산다", "㉡ 생활 속 불편에서 해결할 문제를 찾고, 무엇을 재서(센서) 어떻게 움직일지(작동) 정한다", "㉢ 인터넷의 발명품을 그대로 따라 만든다", "㉣ 상 받기 쉬운 주제만 고른다"],
    onPick: function (i) { window.sthState("inv2OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 환기 알림 */
  (function () {
    var canvas = $("b-c-co2", 0), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, th = 1200;
    var got = window.sthState("co2Got") || false;
    function sim() {
      var C = 450, vent = 0, alarms = 0, mx = 450, pts = [], vs = [];
      for (var t = 0; t <= 50; t++) {
        pts.push(C); vs.push(vent > 0);
        if (vent > 0) { C = Math.max(450, C - 100); vent--; }
        else { C += 25; if (C >= th) { alarms++; vent = 5; } }
        mx = Math.max(mx, C);
      }
      return { pts: pts, vs: vs, alarms: alarms, mx: mx };
    }
    function draw() {
      paper(ctx, W, H);
      var r = sim(), x0 = 60, x1 = 560, y0 = 20, y1 = 230;
      function X(t) { return x0 + t / 50 * (x1 - x0); }
      function Y(c) { return y1 - (c - 400) / 1200 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [400, 800, 1200, 1600].forEach(function (c) { text(ctx, c, x0 - 6, Y(c) + 4, { s: 10, a: "right", c: v("--mist") }); });
      [0, 10, 20, 30, 40, 50].forEach(function (t) { text(ctx, t + "분", X(t), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      text(ctx, "이산화 탄소 (ppm)", x0 + 6, y0 + 4, { s: 11, w: "700", c: v("--mist") });
      r.vs.forEach(function (on, t) { if (on) { ctx.fillStyle = A(v("--brand"), 0.12); ctx.fillRect(X(t), y0, (x1 - x0) / 50, y1 - y0); } });
      seg(ctx, x0, Y(1000), x1, Y(1000), v("--rose-700"), 1.5, true);
      text(ctx, "1000 ppm", x1 - 4, Y(1000) - 5, { s: 10, w: "800", a: "right", c: v("--rose-700") });
      seg(ctx, x0, Y(th), x1, Y(th), v("--amber-700"), 1.5, true);
      ctx.save(); ctx.strokeStyle = v("--ink"); ctx.lineWidth = 2.5; ctx.beginPath();
      r.pts.forEach(function (c, t) { if (t) ctx.lineTo(X(t), Y(c)); else ctx.moveTo(X(t), Y(c)); }); ctx.stroke(); ctx.restore();
      var ok = r.mx <= 1000 && r.alarms <= 3;
      text(ctx, "알림 기준 " + th + " ppm", 610, 60, { s: 15, w: "900" });
      text(ctx, "가장 높았던 농도 " + r.mx + " ppm", 610, 92, { s: 13, w: "800", c: r.mx <= 1000 ? v("--green-700") : v("--rose-700") });
      text(ctx, "알림 " + r.alarms + "번", 610, 120, { s: 13, w: "800", c: r.alarms <= 3 ? v("--green-700") : v("--rose-700") });
      text(ctx, "파란 칸 = 창문을 연 시간", 610, 150, { s: 11, w: "700", c: v("--brand-700") });
      return ok;
    }
    function update() {
      var ok = draw(), r = sim();
      put("b-co2-info", "기준 " + th + " ppm: 수업 중 가장 높았던 농도는 " + r.mx + " ppm, 알림은 " + r.alarms + "번 울렸습니다. "
        + (ok ? "✅ 공기는 맑게, 알림은 알맞게." : (r.mx > 1000 ? "기준이 너무 높아 1000 ppm 을 넘습니다." : "알림이 너무 자주 울립니다.")));
      if (ok && !got) { got = true; window.sthState("co2Got", true); mission(); }
    }
    function mission() {
      if (got) {
        window.sthState("co2Best", "알림 기준 700 ~ 1000 ppm → 1000 ppm 을 넘지 않고 알림 3번 이하");
        window.sthMission("m2-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("co2Best") + ". 과학 지식(1000 ppm)과 사용하는 사람의 편의(알림 횟수)를 함께 따져 기준을 정했습니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("b-th").addEventListener("input", function (ev) { th = +ev.target.value; $("b-th-val").textContent = th + " ppm"; update(); });
    update(); mission();
  })();

  /* 장면 3 — 윤리 판단 */
  (function () {
    var got = window.sthState("ethGot") || { a: false, b: false };
    function mission() {
      if (got.a) done("m2-3a"); if (got.b) done("m2-3b");
      if (got.a && got.b) {
        window.sthState("ethBest", "이상값은 원인과 제외 까닭을 밝히고, 가져온 코드는 출처와 조건을 지킴");
        window.sthMission("m2-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("ethBest") + ". 결과가 좋아 보이는 것보다 과정이 정직한 것이 먼저입니다.");
        ep.clear(2);
      }
    }
    window.sthPick({
      mount: "b-eth1",
      q: "햇볕 때문에 이상하게 나온 시험 자료 한 번은 어떻게 처리해야 할까요?",
      options: ["아무 말 없이 지운다", "그대로 평균에 넣는다", "원인(햇볕)을 기록하고, 그 자료를 뺀 까닭을 보고서에 밝히며, 가능하면 다시 시험한다", "다른 값과 비슷해 보이게 숫자를 고친다"],
      answer: 2,
      why: ["몰래 지우면 다른 사람이 결과를 검증할 수 없습니다.", "원인이 분명한 잘못된 측정을 섞으면 결과가 틀려집니다. 뺄 수는 있지만 밝혀야 해요.", "측정 과정의 실수도 정직하게 기록하는 것이 <b>연구 진실성</b>입니다.", "자료를 고치는 것은 <b>변조</b>로, 가장 심각한 연구 부정입니다."],
      onDone: function () { got.a = true; window.sthState("ethGot", got); mission(); }
    });
    window.sthPick({
      mount: "b-eth2",
      q: "인터넷의 공개 코드를 발명품에 쓸 때 가장 알맞은 방법은?",
      options: ["공개되어 있으니 내가 짠 것처럼 쓴다", "사용 허락 조건(라이선스)을 확인해 지키고, 발표 자료에 출처를 밝힌다", "코드를 조금 바꾸면 출처를 밝히지 않아도 된다"],
      answer: 1,
      why: ["공개되어 있어도 만든 사람의 권리가 있습니다.", "출처를 밝히고 조건을 지키는 것이 <b>지식 재산권 존중</b>입니다. 오픈 소스도 저마다 조건이 있어요.", "조금 바꿔도 원래 만든 사람의 기여를 밝혀야 합니다."],
      onDone: function () { got.b = true; window.sthState("ethGot", got); mission(); }
    });
    mission();
  })();

  /* 장면 4 — 윤리 분류 */
  window.sthSort({
    mount: "b-sort",
    buckets: [{ id: "life", label: "🌱 생명 존중" }, { id: "honest", label: "📐 연구 진실성" }, { id: "ip", label: "©️ 지식 재산권 존중" }],
    items: [
      { t: "실험에 쓸 식물과 동물을 꼭 필요한 만큼만 쓰고, 고통을 줄인다", a: "life", why: "생명을 함부로 다루지 않습니다." },
      { t: "친구들의 호흡을 잴 때 미리 목적을 설명하고 동의를 받는다", a: "life", why: "사람을 대상으로 한 연구는 참여자의 동의가 먼저입니다." },
      { t: "관찰하려고 잡은 곤충을 관찰 뒤 원래 서식지에 돌려보낸다", a: "life", why: "생명을 존중하는 태도입니다." },
      { t: "측정하지 않은 값을 지어내 표를 채우지 않는다", a: "honest", why: "지어내는 것은 위조입니다." },
      { t: "예상과 다르게 나온 결과도 빼지 않고 기록한다", a: "honest", why: "불리한 결과를 숨기는 것도 진실성을 해칩니다." },
      { t: "함께 연구한 친구의 기여를 발표 자료에 정확히 밝힌다", a: "honest", why: "누가 무엇을 했는지 정직하게 밝혀야 합니다.", hint: "누가 무엇을 했는지 정직하게 밝히는 것은?" },
      { t: "다른 사람의 사진이나 그림을 쓸 때 출처를 밝히고 허락을 받는다", a: "ip", why: "만든 사람의 권리를 존중합니다." },
      { t: "다른 학교 학생의 발명 아이디어를 허락 없이 내 것처럼 출품하지 않는다", a: "ip", why: "남의 아이디어를 도용하지 않습니다." }
    ],
    onDone: function () { window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>생명을 존중하고, 정직하게 기록하고, 남의 것을 존중한다. 연구 윤리는 좋은 탐구의 바탕입니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m2-4", true);

  function finish() { window.sthState("r2", "완성 · " + (window.sthState("co2Best") || "") + " / " + (window.sthState("ethBest") || "")); }
  function vs() {
    $("e2-vs").innerHTML = "<b>나의 첫 걸음</b> " + (window.sthState("inv2") || "기록 없음") + "<br><b>환기 알림</b> " + (window.sthState("co2Best") || "-") + "<br><b>윤리 판단</b> " + (window.sthState("ethBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk2", unitLabel: "[과학탐구실험2 Ⅱ-2] 이야기 ② 숨 막히는 5교시",
    items: [
      { id: "w2", label: "연구 윤리", hint: "내 탐구에서 지켜야 할 윤리 항목을 하나 고르고, 구체적으로 무엇을 하겠다는 것인지 쓰세요.", ph: "윤리 항목: … / 내가 할 일: …" },
      { id: "e2a", label: "나의 센서 발명품", hint: "생활 속 불편 하나를 골라, 어떤 센서로 무엇을 재어 어떤 동작을 할지 발명품 아이디어를 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ③ 우주 개발 토론회
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep3", key: "ep3", name: "첨단 탐구 ③", onDone: finish });

  window.sthGate({
    gate: "g3", key: "space2", title: "동아리의 첫 판단",
    question: "과학 기술(우주 개발)의 가치를 평가할 때 가장 알맞은 방법은?",
    options: ["㉠ 비용 하나만 본다", "㉡ 기술 파급·비용·국제 협력·환경 같은 여러 관점의 근거를 함께 따진다", "㉢ 유명한 사람의 의견을 따른다", "㉣ 느낌으로 정한다"],
    onPick: function (i) { window.sthState("space2OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 타임라인과 관점 */
  (function () {
    var canvas = $("c-c-tl"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, ev = 0, lens = "tech";
    var got = window.sthState("tlGot") || { evs: [], ls: [], q: false };
    if (!got.evs) got.evs = []; if (!got.ls) got.ls = [];
    var EV = [
      { y: "1957", n: "스푸트니크 1호 발사", tech: "인류 최초의 인공위성으로, 뒤의 통신·기상·항법(GPS) 위성 산업 전체의 출발점이 되었습니다.", cost: "체제 경쟁 속에서 막대한 비용이 들었지만, 뒤에 위성 통신 산업이 그 비용을 여러 배로 거두는 바탕이 되었습니다.", coop: "냉전 경쟁의 산물로 국제 협력과는 거리가 멀었고, 오히려 우주 개발 경쟁을 불붙였습니다." },
      { y: "1969", n: "아폴로 11호 유인 달 착륙", tech: "정밀 유도 항법, 소형 컴퓨터, 신소재 등 뒤에 민간 산업으로 퍼진 기술이 많이 개발되었습니다.", cost: "천문학적인 비용이 들어 실효성 논쟁이 꾸준히 이어졌습니다.", coop: "미국 단독 사업으로, 협력보다는 냉전 시대 국가 경쟁을 상징했습니다." },
      { y: "1998", n: "국제 우주 정거장 건설 시작", tech: "미세 중력 환경의 실험으로 신약·신소재 연구가 발전했습니다.", cost: "여러 나라가 비용을 나누었지만, 유지·보수에 계속 막대한 비용이 드는 것이 과제입니다.", coop: "미국·러시아·유럽·일본·캐나다 등이 함께한 대표적인 <b>국제 협력</b> 사업입니다." },
      { y: "2008~", n: "재사용 로켓 개발", tech: "로켓 1단을 회수해 다시 쓰는 기술이 발전해 발사 비용을 크게 낮추는 계기가 되었습니다.", cost: "처음 개발 비용은 컸지만, 길게 보면 발사 한 번의 비용을 크게 낮춰 <b>실효성</b>을 높였습니다.", coop: "민간 기업이 이끌며 여러 나라의 위성을 함께 실어 쏘는 상업적 협력 모델을 만들었습니다." },
      { y: "2020년대", n: "저궤도 위성 인터넷망 구축", tech: "수천 개의 소형 위성으로 지상 통신망이 닿지 않는 곳까지 인터넷을 공급합니다.", cost: "초기 투자가 막대하지만, 오지·바다·항공 통신 같은 새 수요로 사업성을 검증받는 중입니다.", coop: "급증한 위성만큼 <b>우주 쓰레기</b>와 전파 간섭 문제가 생겨 국제 규범 논의가 활발합니다." }
    ];
    var LN = { tech: "기술 파급 효과", cost: "비용과 실효성", coop: "국제 협력" };
    function draw() {
      paper(ctx, W, H);
      var x0 = 80, x1 = 820, y = 80;
      seg(ctx, x0, y, x1, y, v("--line"), 3);
      EV.forEach(function (e, i) {
        var x = x0 + i / 4 * (x1 - x0), on = i === ev, seen = got.evs.indexOf(i) >= 0;
        dot(ctx, x, y, on ? 11 : 7, on ? v("--brand") : (seen ? v("--teal") : v("--line")));
        text(ctx, e.y, x, y - 20, { s: on ? 13 : 11, w: on ? "900" : "700", a: "center", c: on ? v("--ink") : v("--mist") });
        text(ctx, e.n, x, y + 30 + (i % 2) * 18, { s: 10.5, w: on ? "800" : "600", a: "center", c: on ? v("--ink") : v("--mist") });
      });
      text(ctx, "살펴본 사건 " + got.evs.length + " / 5 · 관점 " + got.ls.length + " / 3", 80, 180, { s: 12, w: "800", c: got.evs.length >= 5 && got.ls.length >= 3 ? v("--green-700") : v("--mist") });
    }
    function update() {
      if (got.evs.indexOf(ev) < 0) got.evs.push(ev);
      if (got.ls.indexOf(lens) < 0) got.ls.push(lens);
      window.sthState("tlGot", got);
      $("c-ev-val").textContent = EV[ev].y;
      draw();
      put("c-tl-info", "<b>" + EV[ev].y + " · " + EV[ev].n + "</b> — [" + LN[lens] + "] " + EV[ev][lens]);
      mission();
    }
    function mission() {
      var a = got.evs.length >= 5 && got.ls.length >= 3;
      if (a) done("m3-2a"); if (got.q) done("m3-2b");
      if (a && got.q && !ep.cleared(1)) {
        window.sthState("tlBest", "같은 사건도 관점마다 평가가 다르다 (예: 스푸트니크 — 기술 ↑, 협력 ↓)");
        window.sthMission("m3-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("tlBest") + ".");
        ep.clear(1);
      } else if (a && got.q) window.sthMission("m3-2", true);
    }
    canvas._redraw = draw;
    $("c-ev").addEventListener("input", function (e) { ev = +e.target.value; update(); });
    segWire("c-lens", "data-v", function (x) { lens = x; update(); });
    window.sthPick({
      mount: "c-tl-pick",
      q: "같은 우주 개발 사건이 관점에 따라 다르게 평가되는 까닭은?",
      options: ["평가하는 사람이 사실을 잘못 알고 있기 때문에", "과학 기술은 기술·경제·사회·환경에 동시에 영향을 주어, 어떤 가치를 중시하느냐에 따라 장단점이 달리 보이기 때문에", "우주 개발은 평가할 수 없는 일이기 때문에"],
      answer: 1,
      why: ["사실은 같아도 평가의 기준이 다를 수 있습니다.", "그래서 과학 기술의 발전 방향을 평가할 때는 여러 관점의 근거를 함께 따져야 합니다.", "근거를 모으면 평가할 수 있습니다."],
      onDone: function () { got.q = true; window.sthState("tlGot", got); mission(); }
    });
    update();
  })();

  /* 장면 3 — 재사용 로켓 비용 */
  (function () {
    var canvas = $("c-c-cost"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, n = 1;
    var got = window.sthState("costGot") || false;
    function cost(k) { return 360 / k + 36 * (k - 1) / k + 240; }
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 560, y0 = 20, y1 = 220, bw = (x1 - x0) / 20;
      function Y(c) { return y1 - c / 650 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [0, 200, 400, 600].forEach(function (c) { text(ctx, c, x0 - 6, Y(c) + 4, { s: 10, a: "right", c: v("--mist") }); });
      text(ctx, "발사 한 번 비용 (억 원)", x0 + 6, y0 + 4, { s: 11, w: "700", c: v("--mist") });
      for (var k = 1; k <= 20; k++) {
        var c = cost(k), on = k === n;
        ctx.fillStyle = on ? (c <= 330 ? v("--green-700") : v("--coral-700")) : A(v("--brand"), 0.35);
        ctx.fillRect(x0 + (k - 1) * bw + bw * 0.15, Y(c), bw * 0.7, y1 - Y(c));
        if (k === 1 || k % 5 === 0) text(ctx, k, x0 + (k - 0.5) * bw, y1 + 16, { s: 10, a: "center", c: v("--mist") });
      }
      seg(ctx, x0, Y(330), x1, Y(330), v("--amber-700"), 1.5, true);
      text(ctx, "330억", x1 + 4, Y(330) + 4, { s: 10, w: "800", c: v("--amber-700") });
      var c0 = cost(n), ok = c0 <= 330 && cost(n - 1 > 0 ? n - 1 : 1) > 330;
      text(ctx, "1단을 " + n + "번 사용", 610, 60, { s: 15, w: "900" });
      text(ctx, "1단 몫 " + (360 / n + 36 * (n - 1) / n).toFixed(0) + "억 + 나머지 240억", 610, 90, { s: 12, w: "700", c: v("--mist") });
      text(ctx, "= " + c0.toFixed(0) + "억 원 (" + Math.round(c0 / 6) + "%)", 610, 120, { s: 16, w: "900", c: c0 <= 330 ? v("--green-700") : v("--ink") });
      return ok && n > 1;
    }
    function update() {
      var ok = draw(), c0 = cost(n);
      put("c-cost-info", "1단을 " + n + "번 쓰면 발사 한 번에 약 " + c0.toFixed(0) + "억 원이 듭니다. " + (ok ? "✅ 6번 쓰면 330억 원, 처음의 55% 로 떨어집니다. 그 뒤로는 정비비 때문에 조금씩만 줄어요." : (c0 <= 330 ? "330억 원 아래지만 더 적은 횟수로도 됩니다." : "아직 330억 원보다 비쌉니다.")));
      if (ok && !got) { got = true; window.sthState("costGot", true); mission(); }
    }
    function mission() {
      if (got) {
        window.sthState("costBest", "1단 6번 재사용 → 발사 비용 600억 → 330억 원");
        window.sthMission("m3-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("costBest") + ". ‘비싸다’는 주장에도 계산한 근거로 답할 수 있습니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    $("c-n").addEventListener("input", function (e) { n = +e.target.value; $("c-n-val").textContent = n + "번"; update(); });
    update(); mission();
  })();

  /* 장면 4 — 근거 분류 */
  window.sthSort({
    mount: "c-sort",
    buckets: [{ id: "tech", label: "🔧 기술 파급 효과" }, { id: "cost", label: "💰 비용과 실효성" }, { id: "coop", label: "🤝 국제 협력" }, { id: "env", label: "🌍 환경과 윤리" }],
    items: [
      { t: "위성 항법(GPS)이 스마트폰 지도와 택배 배송에 쓰인다", a: "tech", why: "우주 기술이 생활로 퍼졌습니다." },
      { t: "우주복을 위해 개발한 소재가 소방복과 의료 기기에 쓰인다", a: "tech", why: "다른 산업으로 기술이 파급되었습니다." },
      { t: "재사용 로켓이 발사 한 번의 비용을 크게 낮췄다", a: "cost", why: "같은 목적을 더 적은 비용으로 이룹니다." },
      { t: "국제 우주 정거장의 유지비가 해마다 수조 원에 이른다", a: "cost", why: "비용 대비 효과를 따지는 근거입니다." },
      { t: "여러 나라가 국제 우주 정거장을 함께 짓고 운영한다", a: "coop", why: "대표적인 국제 협력 사례입니다." },
      { t: "여러 나라 우주 기관이 달 탐사 계획에 함께 참여하고 자료를 공유한다", a: "coop", why: "협력으로 비용과 위험을 나눕니다.", hint: "누가 함께하나요?" },
      { t: "수많은 위성 조각이 우주 쓰레기가 되어 충돌 위험을 높인다", a: "env", why: "우주 환경 문제입니다." },
      { t: "밤하늘을 가로지르는 수많은 위성이 천체 관측을 방해한다", a: "env", why: "과학 연구와 밤하늘이라는 공공의 가치를 해칩니다." }
    ],
    onDone: function () { window.sthMission("m3-4", true, "<span class='m-tag'>미션 완료</span>네 관점의 근거가 모두 갖춰졌습니다. 찬성이든 반대든 이제 근거로 토론할 수 있어요."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m3-4", true);

  function finish() { window.sthState("r3", "완성 · " + (window.sthState("tlBest") || "") + " / " + (window.sthState("costBest") || "")); }
  function vs() {
    $("e3-vs").innerHTML = "<b>나의 첫 판단</b> " + (window.sthState("space2") || "기록 없음") + "<br><b>관점별 평가</b> " + (window.sthState("tlBest") || "-") + "<br><b>재사용 로켓</b> " + (window.sthState("costBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk3", unitLabel: "[과학탐구실험2 Ⅱ-2] 이야기 ③ 우주 개발 토론회",
    items: [
      { id: "e3a", label: "나의 토론 주장", hint: "‘우주 개발에 많은 돈을 쓰는 것은 가치 있는 일인가?’에 대한 내 주장을 두 가지 이상의 관점에서 근거를 들어 쓰세요." },
      { id: "e3b", label: "앞으로의 발전 방향", hint: "우주 개발이 앞으로 어떤 방향으로 나아가야 한다고 생각하는지, 우주 쓰레기 같은 문제를 고려해 쓰세요." }
    ]
  });
})();

/* ========================================================================= 06 정리하기 */
window.sthWork({
  mount: "wk", unitLabel: "[과학탐구실험2 Ⅱ-2] 미래 사회와 첨단 과학 탐구 — 정리",
  recap: [
    { key: "r1", label: "① 겨울 딸기 온실" },
    { key: "r2", label: "② 숨 막히는 5교시" },
    { key: "r3", label: "③ 우주 개발 토론회" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" }
  ],
  items: [
    { id: "all", label: "세 탐구를 꿰는 한 문장", hint: "온실, 환기 알림, 우주 개발. 세 이야기를 ‘첨단 과학 기술’과 ‘책임’이라는 말을 넣어 한 문장으로 이어 보세요." },
    { id: "w3", label: "아직 헷갈리는 것", hint: "다음 시간에 여기서부터 시작합니다." }
  ]
});

/* ========================================================================= 07 우리 반 */
window.sthShare({
  mount: "share", unit: "gt2-2-4", unitLabel: "[과학탐구실험2 Ⅱ-2] 미래 사회와 첨단 과학 탐구",
  rows: [
    { key: "r1", label: "① 겨울 딸기 온실" },
    { key: "r2", label: "② 숨 막히는 5교시" },
    { key: "r3", label: "③ 우주 개발 토론회" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" }
  ],
  line: { id: "all", label: "세 탐구를 꿰는 한 문장" }
});

})();
