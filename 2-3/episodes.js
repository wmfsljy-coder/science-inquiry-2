/* 과학탐구실험2 Ⅰ-2 생활 속의 과학 탐구 — 이야기 네 편
   01 우주로 가는 딸기 / 02 스마트폰을 태운 롤러코스터 / 03 5층 건물만 크게 흔들렸다 / 04 동네 환경 탐사대
   공용 부품: ../assets/theme.js (sthUnit·sthGate·sthWork), ../assets/story.js (sthStory·sthSort·sthOrder·sthPick) */
(function () {
"use strict";

window.sthUnit("gt2-2-3");

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
function log10(x) { return Math.log(x) / Math.LN10; }

/* =========================================================================
   이야기 ① 우주로 가는 딸기
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep1", key: "ep1", name: "생활 탐구 ①", onDone: finish });

  window.sthGate({
    gate: "g1", key: "fd1", title: "연구원의 첫 제안",
    question: "딸기의 모양과 영양을 지키면서 물만 빼려면 어떻게 하는 것이 좋을까요?",
    options: ["㉠ 뜨거운 바람으로 빨리 말린다", "㉡ 얼린 뒤 압력을 아주 낮춰, 얼음이 녹지 않고 곧바로 수증기가 되게 한다", "㉢ 설탕에 절여 물을 뺀다", "㉣ 햇볕에 며칠 말린다"],
    onPick: function (i) { window.sthState("fd1OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 상평형 */
  (function () {
    var canvas = $("a-c-ph"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, T = 20, pi = 7;
    var got = window.sthState("phGot") || false;
    var PS = [10, 30, 100, 300, 1000, 3000, 10000, 101325];
    function pIce(t) { return 611 * Math.exp(22.46 * t / (272.62 + t)); }
    function pWat(t) { return 611 * Math.exp(17.27 * t / (237.3 + t)); }
    function state() {
      var P = PS[pi];
      if (T < 0) return P < pIce(T) ? "sub" : "ice";
      if (P < 611) return "warm";
      return P < pWat(T) ? "boil" : "liq";
    }
    var SN = { sub: "얼음이 곧바로 수증기로 (승화)", ice: "얼음 그대로 — 물이 빠지지 않음", warm: "녹지는 않고 빠르게 승화 — 딸기가 데워짐", boil: "얼음이 녹아 물이 되고, 그 물이 끓어 날아감", liq: "얼음이 녹아 물로 흘러내림" };
    function draw() {
      paper(ctx, W, H);
      var x0 = 70, x1 = 520, y0 = 20, y1 = 250;
      function X(t) { return x0 + (t + 45) / 110 * (x1 - x0); }
      function Y(p) { return y1 - (log10(p) - 0.5) / 5 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [-40, -20, 0, 20, 40, 60].forEach(function (t) { text(ctx, t + "°C", X(t), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      [10, 100, 1000, 10000, 100000].forEach(function (p) { text(ctx, p >= 1000 ? (p / 1000) + "k" : p, x0 - 6, Y(p) + 4, { s: 10, a: "right", c: v("--mist") }); });
      text(ctx, "압력 (Pa)", x0 + 6, y0 + 4, { s: 11, w: "700", c: v("--mist") });
      ctx.save(); ctx.strokeStyle = v("--brand"); ctx.lineWidth = 2.5; ctx.beginPath();
      for (var t = -45; t <= 0; t += 1) { var yy = Y(pIce(t)); if (t === -45) ctx.moveTo(X(t), yy); else ctx.lineTo(X(t), yy); }
      for (t = 0; t <= 60; t += 1) ctx.lineTo(X(t), Y(pWat(t)));
      ctx.stroke(); ctx.restore();
      seg(ctx, X(0), Y(611), X(0), y0, v("--brand"), 2.5);
      text(ctx, "얼음", X(-30), Y(20000), { s: 13, w: "900", a: "center", c: v("--brand-700") });
      text(ctx, "물", X(30), Y(40000), { s: 13, w: "900", a: "center", c: v("--brand-700") });
      text(ctx, "수증기", X(20), Y(60), { s: 13, w: "900", a: "center", c: v("--brand-700") });
      dot(ctx, X(0.01), Y(611), 4, v("--amber-700"));
      text(ctx, "삼중점", X(0.01) + 6, Y(611) + 14, { s: 10, w: "700", c: v("--amber-700") });
      var st = state(), ok = st === "sub" && T <= -10;
      dot(ctx, X(T), Y(PS[pi]), 8, ok ? v("--green-700") : v("--rose-700"));
      text(ctx, T + " °C · " + PS[pi].toLocaleString() + " Pa", 570, 60, { s: 15, w: "900" });
      text(ctx, SN[st], 570, 92, { s: 13, w: "800", c: st === "sub" ? v("--green-700") : v("--rose-700") });
      text(ctx, T < 0 ? "이 온도에서 얼음이 승화하는 압력: " + Math.round(pIce(T)) + " Pa 미만" : "0 °C 이상에서는 얼음이 녹는다", 570, 124, { s: 11.5, w: "700", c: v("--mist") });
      return ok;
    }
    function update() {
      var ok = draw(), st = state();
      put("a-ph-info", T + " °C, " + PS[pi].toLocaleString() + " Pa: " + SN[st] + ". "
        + (ok ? "✅ 딸기는 언 채로, 얼음만 수증기가 되어 빠져나갑니다. 동결 건조의 조건입니다." : (st === "sub" ? "승화는 일어나지만 −10 °C보다 따뜻해 딸기가 물러질 수 있어요. 더 차갑게 해 보세요." : (T >= 0 ? (st === "warm" ? "압력이 삼중점(611 Pa)보다 낮아 녹지는 않지만, 딸기가 데워져 얼음이 빠르게 승화하는 동안 조직이 상할 수 있어요. −10 °C 이하로 유지하세요." : "딸기가 녹아 버립니다. 온도를 영하로 낮추세요.") : "압력이 높아 얼음이 그대로입니다. 압력을 더 낮춰 보세요."))));
      if (ok && !got) { got = true; window.sthState("phGot", true); mission(); }
    }
    function mission() {
      if (got) {
        window.sthState("phBest", "−10 °C 이하, 얼음의 증기압보다 낮은 압력 → 승화");
        window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("phBest") + ". 압력을 낮추면 물질의 상태가 바뀌는 조건도 바뀝니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("a-t").addEventListener("input", function (ev) { T = +ev.target.value; $("a-t-val").textContent = T + " °C"; update(); });
    $("a-p").addEventListener("input", function (ev) { pi = +ev.target.value; $("a-p-val").textContent = PS[pi].toLocaleString() + " Pa" + (pi === 7 ? " (1기압)" : ""); update(); });
    update(); mission();
  })();

  /* 장면 3 — 열풍과 동결 */
  (function () {
    var canvas = $("a-c-dry"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, method = "hot", ht = 60;
    var got = window.sthState("dryGot") || { temps: [], fz: false, q: false };
    if (!got.temps) got.temps = [];
    function res() {
      if (method === "freeze") return { vit: 92, vol: 95, time: 24 };
      var th = 240 / (ht - 20);
      return { vit: 100 * Math.exp(-0.004 * (ht - 30) * th), vol: 45 - (ht - 40) * 0.1, time: th };
    }
    function draw() {
      paper(ctx, W, H);
      var r = res(), cx = 170, cy = 130, R = 80 * Math.sqrt(r.vol / 100);
      ctx.fillStyle = method === "hot" ? "#9c3b2b" : "#e8483a"; ctx.beginPath(); ctx.ellipse(cx, cy, R * 0.85, R, 0, 0, Math.PI * 2); ctx.fill();
      if (method === "freeze") { for (var i = 0; i < 40; i++) dot(ctx, cx + Math.cos(i * 2.4) * R * 0.7 * ((i * 37) % 10) / 10, cy + Math.sin(i * 2.4) * R * 0.8 * ((i * 53) % 10) / 10, 2.5, "rgba(255,255,255,0.45)"); }
      else { ctx.strokeStyle = "rgba(0,0,0,0.35)"; ctx.lineWidth = 2; for (var j = 0; j < 7; j++) { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(j) * R * 0.8, cy + Math.sin(j) * R * 0.9); ctx.stroke(); } }
      text(ctx, "🍓", cx, cy - R - 10, { s: 18, a: "center" });
      text(ctx, method === "freeze" ? "동결 건조 — 모양 그대로, 구멍이 송송" : "열풍 " + ht + " °C — 쪼그라들고 갈라짐", cx, 250, { s: 12, w: "800", a: "center" });
      var ok = r.vit >= 80 && r.vol >= 90;
      [["비타민 C 남은 양", r.vit, 80, "%"], ["원래 부피 대비", r.vol, 90, "%"]].forEach(function (b, k) {
        var y = 60 + k * 60;
        text(ctx, b[0], 400, y, { s: 12, w: "800", c: v("--mist") });
        ctx.fillStyle = A(v("--line"), 0.5); ctx.fillRect(400, y + 8, 300, 18);
        ctx.fillStyle = b[1] >= b[2] ? v("--green-700") : v("--rose-700"); ctx.fillRect(400, y + 8, 3 * b[1], 18);
        seg(ctx, 400 + 3 * b[2], y + 2, 400 + 3 * b[2], y + 32, v("--amber-700"), 2, true);
        text(ctx, b[1].toFixed(0) + b[3], 712, y + 22, { s: 13, w: "900", c: b[1] >= b[2] ? v("--green-700") : v("--rose-700") });
      });
      text(ctx, "건조 시간 약 " + r.time.toFixed(0) + " 시간", 400, 200, { s: 12.5, w: "800" });
      text(ctx, ok ? "우주 식량 합격" : "우주 식량 불합격", 400, 232, { s: 16, w: "900", c: ok ? v("--green-700") : v("--rose-700") });
    }
    function update() {
      if (method === "hot" && got.temps.indexOf(ht) < 0) got.temps.push(ht);
      if (method === "freeze") got.fz = true;
      window.sthState("dryGot", got);
      draw();
      var r = res();
      put("a-dry-info", (method === "freeze" ? "동결 건조" : "열풍 " + ht + " °C") + ": 비타민 C " + r.vit.toFixed(0) + "%, 부피 " + r.vol.toFixed(0) + "%, 약 " + r.time.toFixed(0) + " 시간. "
        + (method === "hot" ? (ht >= 70 ? "온도를 높이면 빨리 마르지만 열에 약한 비타민이 더 많이 부서집니다." : "온도를 낮추면 오래 걸려, 그동안 비타민이 조금씩 부서집니다.") + " <span style='color:var(--mist)'>(확인한 열풍 온도: " + got.temps.sort(function (a, b) { return a - b; }).join(", ") + " °C)</span>" : "✅ 높은 온도 없이 얼음을 승화시켜, 영양과 모양을 모두 지켰습니다. 대신 시간과 전기가 많이 들어 값이 비쌉니다."));
      mission();
    }
    function mission() {
      var a = got.temps.length >= 2;
      if (a) done("m1-3a"); if (got.fz) done("m1-3b"); if (got.q) done("m1-3c");
      if (a && got.fz && got.q && !ep.cleared(2)) {
        window.sthState("dryBest", "열풍은 어느 온도에서도 불합격, 동결 건조는 비타민 C 92% · 부피 95%");
        window.sthMission("m1-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("dryBest") + ". 과학 원리를 알면 목적에 맞는 방법을 고를 수 있습니다.");
        ep.clear(2);
      } else if (a && got.fz && got.q) window.sthMission("m1-3", true);
    }
    canvas._redraw = draw;
    segWire("a-method", "data-v", function (x) { method = x; update(); });
    $("a-ht").addEventListener("input", function (ev) { ht = +ev.target.value; $("a-ht-val").textContent = ht + " °C"; update(); });
    window.sthPick({
      mount: "a-dry-pick",
      q: "동결 건조한 딸기가 원래 모양을 지키고, 물을 부으면 빠르게 되살아나는 까닭은?",
      options: ["딸기에 방부제를 넣어서", "얼음이 액체를 거치지 않고 승화해 세포가 무너지지 않고, 얼음이 있던 자리가 작은 구멍으로 남아 물이 잘 스며들기 때문에", "딸기를 압축했기 때문에"],
      answer: 1,
      why: ["방부제는 쓰지 않았습니다.", "액체 물이 흘러나오며 세포를 무너뜨리는 일이 없어, 얼음 결정 모양 그대로 빈 구멍이 남습니다(다공질).", "압축하면 모양이 달라집니다."],
      onDone: function () { got.q = true; window.sthState("dryGot", got); mission(); }
    });
    update();
  })();

  /* 장면 4 — 생활 제품 속 과학 */
  window.sthSort({
    mount: "a-sort",
    buckets: [{ id: "press", label: "🌡️ 압력과 상태 변화" }, { id: "light", label: "☀️ 빛" }, { id: "heat", label: "🔥 열의 이동" }, { id: "surf", label: "🦎 표면과 분자 사이의 힘" }],
    items: [
      { t: "🍚 압력밥솥 — 압력을 높여 물의 끓는점을 100 °C보다 높인다", a: "press", why: "압력이 높을수록 끓는점이 올라갑니다." },
      { t: "☕ 동결 건조 커피 — 얼린 커피를 낮은 압력에서 승화시켜 가루로 만든다", a: "press", why: "낮은 압력에서의 승화를 씁니다." },
      { t: "💡 자외선 살균기 — 짧은 파장의 자외선이 미생물의 DNA를 망가뜨린다", a: "light", why: "빛의 에너지를 씁니다." },
      { t: "🕶️ 편광 선글라스 — 물이나 도로에 반사된 눈부신 빛을 걸러 낸다", a: "light", why: "빛의 편광을 씁니다." },
      { t: "🧴 보온병 — 진공층이 전도·대류를, 은색 면이 복사를 막는다", a: "heat", why: "세 가지 열 이동을 모두 막습니다." },
      { t: "🧊 아이스팩 — 차가운 팩을 대면 다친 곳의 열이 팩으로 옮겨 간다", a: "heat", why: "온도가 높은 몸에서 차가운 팩으로 열이 이동합니다.", hint: "열이 어느 쪽에서 어느 쪽으로 옮겨 가나요?" },
      { t: "🦎 게코 테이프 — 수많은 미세한 털이 표면과 분자 사이의 힘으로 붙는다", a: "surf", why: "도마뱀 발바닥을 본뜬 반데르발스 힘입니다." },
      { t: "☂️ 연잎 발수 우산 — 미세한 돌기가 물방울을 굴러떨어지게 한다", a: "surf", why: "표면 구조가 물이 퍼지지 못하게 합니다." }
    ],
    onDone: function () { window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>압력밥솥과 동결 건조는 같은 원리(압력과 상태 변화)를 반대로 씁니다. 원리를 알면 제품을 새로 고안할 수도 있습니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m1-4", true);

  function finish() { window.sthState("r1", "완성 · " + (window.sthState("phBest") || "") + " / " + (window.sthState("dryBest") || "")); }
  function vs() {
    $("e1-vs").innerHTML = "<b>나의 첫 제안</b> " + (window.sthState("fd1") || "기록 없음") + "<br><b>승화 조건</b> " + (window.sthState("phBest") || "-") + "<br><b>건조 방식 비교</b> " + (window.sthState("dryBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk1", unitLabel: "[과학탐구실험2 Ⅰ-2] 이야기 ① 우주로 가는 딸기",
    items: [
      { id: "e1a", label: "동결 건조의 원리", hint: "동결 건조가 열풍 건조보다 모양과 영양을 잘 지키는 까닭을 ‘승화’와 ‘압력’이라는 말을 넣어 설명하세요." },
      { id: "e1b", label: "내가 고안한 생활 제품", hint: "이 장면의 원리 가운데 하나를 써서 생활을 편하게 할 제품을 떠올리고, 원리와 쓰임을 적어 보세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ② 스마트폰을 태운 롤러코스터
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep2", key: "ep2", name: "생활 탐구 ②", onDone: finish });

  window.sthGate({
    gate: "g2", key: "ride1", title: "부원의 첫 계획",
    question: "놀이기구가 몸에 주는 힘을 스마트폰으로 재려면 어떻게 해야 할까요?",
    options: ["㉠ 타고 난 뒤 느낌을 점수로 적는다", "㉡ 스마트폰을 몸에 단단히 고정하고, 가속도 센서 앱으로 시간에 따른 가속도를 기록한다", "㉢ 놀이기구 사진을 찍는다", "㉣ 줄 선 시간을 잰다"],
    onPick: function (i) { window.sthState("ride1OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 세 놀이기구의 그래프 */
  (function () {
    var canvas = $("b-c-acc"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, ride = "bumper";
    var got = window.sthState("accGot") || { seen: [], q: false };
    if (!got.seen) got.seen = [];
    var NM = { bumper: "범퍼카", coaster: "롤러코스터", drop: "자이로드롭" };
    function g(t) {
      if (ride === "bumper") return 1 + (Math.abs(t - 0.35) < 0.015 ? 1.8 : 0) + (Math.abs(t - 0.72) < 0.012 ? 1.3 : 0) + 0.05 * Math.sin(t * 60);
      if (ride === "coaster") { if (t < 0.15) return 1; var s = Math.sin((t - 0.15) * Math.PI * 4); return 1 + 2.2 * Math.pow(Math.max(0, s), 2) - 0.8 * Math.pow(Math.max(0, -s), 2); }
      if (t < 0.3) return 1;
      if (t < 0.5) return 0.05;
      if (t < 0.56) return 4.2;
      return 1 + 0.4 * Math.exp(-(t - 0.56) * 12);
    }
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 600, y0 = 20, y1 = 240;
      function X(t) { return x0 + t * (x1 - x0); }
      function Y(a) { return y1 - a / 4.5 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [0, 1, 2, 3, 4].forEach(function (a) { text(ctx, a + " g", x0 - 6, Y(a) + 4, { s: 10, a: "right", c: v("--mist") }); });
      seg(ctx, x0, Y(1), x1, Y(1), A(v("--mist"), 0.6), 1, true);
      text(ctx, "가만히 있을 때", x1 - 4, Y(1) - 6, { s: 10, w: "700", a: "right", c: v("--mist") });
      text(ctx, "시간 →", x1, y1 + 18, { s: 11, w: "700", a: "right", c: v("--mist") });
      ctx.save(); ctx.strokeStyle = v("--brand"); ctx.lineWidth = 2.5; ctx.beginPath();
      var mx = 0, mn = 9;
      for (var i = 0; i <= 400; i++) { var t = i / 400, a = g(t); mx = Math.max(mx, a); mn = Math.min(mn, a); if (i) ctx.lineTo(X(t), Y(a)); else ctx.moveTo(X(t), Y(a)); }
      ctx.stroke(); ctx.restore();
      if (ride === "drop") { ctx.fillStyle = A(v("--amber-700"), 0.12); ctx.fillRect(X(0.3), y0, X(0.5) - X(0.3), y1 - y0); text(ctx, "떨어지는 중", X(0.4), y0 + 14, { s: 11, w: "800", a: "center", c: v("--amber-700") }); }
      text(ctx, NM[ride], 640, 60, { s: 16, w: "900" });
      text(ctx, "가장 큰 값 " + mx.toFixed(1) + " g", 640, 92, { s: 13, w: "800", c: v("--coral-700") });
      text(ctx, "가장 작은 값 " + mn.toFixed(1) + " g", 640, 118, { s: 13, w: "800", c: v("--brand-700") });
      text(ctx, "살펴본 놀이기구 " + got.seen.length + " / 3", 640, 160, { s: 12, w: "700", c: got.seen.length >= 3 ? v("--green-700") : v("--mist") });
    }
    var MSG = {
      bumper: "<b>범퍼카</b> — 평소엔 1 g 근처로 잔잔하다가, <b>부딪치는 순간</b>에만 짧고 뾰족하게 치솟습니다. 짧은 시간에 속도가 확 바뀌기 때문입니다.",
      coaster: "<b>롤러코스터</b> — 곡선과 골짜기를 지날 때마다 3 g 넘게 오르고, 언덕 꼭대기에서는 1 g 아래로 내려가 몸이 붕 뜨는 느낌이 듭니다.",
      drop: "<b>자이로드롭</b> — 떨어지는 동안 센서가 <b>거의 0 g</b>를 가리키다가, 브레이크가 걸리는 순간 4 g 넘게 치솟습니다."
    };
    function update() {
      if (got.seen.indexOf(ride) < 0) { got.seen.push(ride); window.sthState("accGot", got); }
      draw();
      put("b-acc-info", MSG[ride] + (got.seen.length >= 3 ? " ✅ 세 놀이기구를 모두 살펴보았습니다." : ""));
      mission();
    }
    function mission() {
      if (got.seen.length >= 3) done("m2-2a"); if (got.q) done("m2-2b");
      if (got.seen.length >= 3 && got.q && !ep.cleared(1)) {
        window.sthState("accBest", "범퍼카 뾰족 · 롤러코스터 오르내림 · 자이로드롭 0 g 뒤 4 g");
        window.sthMission("m2-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("accBest") + ". 그래프 모양만 보고도 어떤 운동인지 알 수 있습니다.");
        ep.clear(1);
      } else if (got.seen.length >= 3 && got.q) window.sthMission("m2-2", true);
    }
    canvas._redraw = draw;
    segWire("b-ride", "data-v", function (x) { ride = x; update(); });
    window.sthPick({
      mount: "b-acc-pick",
      q: "자이로드롭이 떨어지는 동안 가속도 센서가 거의 0 g를 가리킨 까닭은?",
      options: ["센서가 고장 났기 때문에", "사람과 스마트폰이 함께 자유 낙하해, 몸이 무게를 느끼지 못하는 무중력 상태가 되었기 때문에", "떨어지는 동안에는 중력이 사라지기 때문에"],
      answer: 1,
      why: ["고장이 아니라 정상적인 측정입니다.", "모두 같은 가속도로 함께 떨어지면 서로 누르지 않아 무게를 느끼지 못합니다. 우주 정거장의 우주인이 떠 있는 것도 같은 까닭입니다.", "중력은 그대로 작용합니다. 그 중력 때문에 떨어지는 것입니다."],
      onDone: function () { got.q = true; window.sthState("accGot", got); mission(); }
    });
    update();
  })();

  /* 장면 3 — 루프 설계 */
  (function () {
    var canvas = $("b-c-loop"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, shape = "circle", vv = 10, r = 10;
    var got = window.sthState("loopGot") || { a: false, q: false };
    function top() { return vv * vv / (9.8 * r) - 1; }
    function bot() { return shape === "circle" ? (vv * vv + 4 * 9.8 * r) / (9.8 * r) + 1 : (vv * vv + 5 * 9.8 * r) / (3 * 9.8 * r) + 1; }
    function draw() {
      paper(ctx, W, H);
      var cx = 250, by = 262, sc = Math.min(7, 225 / ((shape === "circle" ? 2 : 2.5) * r));
      ctx.save(); ctx.strokeStyle = v("--ink"); ctx.lineWidth = 4; ctx.beginPath();
      if (shape === "circle") { ctx.arc(cx, by - r * sc, r * sc, 0, Math.PI * 2); }
      else {
        var hgt = 2.5 * r * sc, rb = 3 * r * sc;
        ctx.moveTo(cx, by);
        ctx.bezierCurveTo(cx + rb * 0.9, by, cx + r * sc * 1.2, by - hgt, cx, by - hgt);
        ctx.bezierCurveTo(cx - r * sc * 1.2, by - hgt, cx - rb * 0.9, by, cx, by);
      }
      ctx.stroke(); ctx.restore();
      var tp = top(), bt = bot(), okT = tp >= 0.3, okB = bt <= 5;
      var topY = shape === "circle" ? by - 2 * r * sc : by - 2.5 * r * sc;
      text(ctx, "🚃", cx, topY - 6, { s: 18, a: "center" });
      text(ctx, "꼭대기 " + tp.toFixed(1) + " g", cx + 60, Math.max(16, topY + 4), { s: 12.5, w: "900", c: okT ? v("--green-700") : v("--rose-700") });
      text(ctx, "바닥 " + bt.toFixed(1) + " g", cx + 60, by - 6, { s: 12.5, w: "900", c: okB ? v("--green-700") : v("--rose-700") });
      text(ctx, shape === "circle" ? "동그란 루프 (반지름 " + r + " m)" : "물방울 루프 (꼭대기 " + r + " m · 바닥 " + (3 * r) + " m)", 560, 50, { s: 14, w: "900" });
      text(ctx, "꼭대기 속력 " + vv + " m/s", 560, 80, { s: 13, w: "800", c: v("--mist") });
      text(ctx, "꼭대기: " + (okT ? "좌석에 잘 눌림 ✔" : (tp < 0 ? "몸이 좌석에서 떠오름 ✘" : "눌림이 약함 ✘")), 560, 120, { s: 13, w: "800", c: okT ? v("--green-700") : v("--rose-700") });
      text(ctx, "바닥: " + (okB ? "안전한 힘 ✔" : "몸이 너무 무겁게 눌림 ✘"), 560, 148, { s: 13, w: "800", c: okB ? v("--green-700") : v("--rose-700") });
      return okT && okB;
    }
    function update() {
      var ok = draw();
      put("b-loop-info", "꼭대기에서 몸이 좌석에 " + top().toFixed(1) + " g로 눌리고, 바닥에서는 " + bot().toFixed(1) + " g를 받습니다. "
        + (ok ? "✅ 두 조건을 모두 맞췄습니다." : (shape === "circle" ? "동그란 루프는 꼭대기를 안전하게 지날 만큼 빠르면 바닥에서 늘 6 g를 넘습니다. 모양을 바꿔 보세요." : (top() < 0.3 ? "꼭대기에서 너무 느리거나 반지름이 커서 몸이 떠오를 수 있습니다." : "너무 빨라 바닥에서 힘이 너무 큽니다."))));
      if (ok && !got.a) { got.a = true; window.sthState("loopGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m2-3a"); if (got.q) done("m2-3b");
      if (got.a && got.q) {
        window.sthState("loopBest", "물방울 루프로 꼭대기 0.3 g 이상 · 바닥 5 g 이하");
        window.sthMission("m2-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("loopBest") + ". 원운동의 원리(구심 가속도 = 속력² ÷ 반지름)로 안전한 모양을 설계했습니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    segWire("b-shape", "data-v", function (x) { shape = x; update(); });
    $("b-v").addEventListener("input", function (ev) { vv = +ev.target.value; $("b-v-val").textContent = vv + " m/s"; update(); });
    $("b-r").addEventListener("input", function (ev) { r = +ev.target.value; $("b-r-val").textContent = r + " m"; update(); });
    window.sthPick({
      mount: "b-loop-pick",
      q: "요즘 롤러코스터가 동그란 루프 대신 꼭대기는 좁고 바닥은 넓은 물방울 모양 루프를 쓰는 까닭은?",
      options: ["보기에 더 멋있어서", "빠르게 들어오는 바닥은 반지름을 크게 해 힘을 줄이고, 느려지는 꼭대기는 반지름을 작게 해 몸이 좌석에 눌리게 할 수 있어서", "만들기가 더 쉬워서"],
      answer: 1,
      why: ["모양보다 안전이 까닭입니다.", "구심 가속도는 속력² ÷ 반지름. 빠른 곳은 반지름을 크게, 느린 곳은 작게 하면 어디서나 알맞은 힘이 됩니다.", "곡률이 계속 변해 오히려 만들기가 어렵습니다."],
      onDone: function () { got.q = true; window.sthState("loopGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 4 — 안전 장치 */
  window.sthSort({
    mount: "b-sort",
    buckets: [{ id: "acc", label: "📳 가속도 센서" }, { id: "gyro", label: "🧭 자이로(회전) 센서" }, { id: "press", label: "👣 압력 센서" }, { id: "opt", label: "💓 광학 센서" }],
    items: [
      { t: "🪖 충격 감지 헬멧 — 머리에 큰 충격이 오면 보호자에게 알린다", a: "acc", why: "짧고 큰 가속도(범퍼카처럼 뾰족한 값)를 감지합니다." },
      { t: "📱 낙상 감지 스마트폰 — 잠깐 0 g가 된 뒤 큰 충격이 오면 넘어진 것으로 판단한다", a: "acc", why: "자이로드롭처럼 0 g → 큰 값의 모양을 찾습니다." },
      { t: "🦯 낙상 감지 지팡이 — 급격히 기울어지면 넘어진 것으로 판단한다", a: "gyro", why: "기울기와 회전 속도를 잽니다." },
      { t: "⛷️ 스키 자세 교정 밴드 — 무릎이 안쪽으로 꺾이는 각도를 알려 준다", a: "gyro", why: "관절의 회전 각도를 잽니다." },
      { t: "🦵 스마트 무릎 보호대 — 무릎에 실리는 압력이 기준을 넘으면 진동으로 알린다", a: "press", why: "무릎에 실리는 압력(힘)을 재서 알려 줍니다." },
      { t: "👟 스마트 깔창 — 발바닥 압력이 한쪽에 쏠리면 부상 위험을 알려 준다", a: "press", why: "발바닥의 압력 분포를 잽니다.", hint: "발바닥이 무엇을 받나요?" },
      { t: "⌚ 심박 이상 감지 시계 — 운동 중 심박수가 위험 수준이면 쉬라고 알린다", a: "opt", why: "피부에 빛을 비춰 혈류 변화를 잽니다." },
      { t: "🏊 수영장 익수 감지 카메라 — 물속에 오래 멈춰 있는 사람을 알아본다", a: "opt", why: "빛(영상)으로 사람의 움직임을 분석합니다." }
    ],
    onDone: function () { window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>놀이기구에서 읽은 그래프 모양이 그대로 안전 장치의 판단 기준이 됩니다. 측정 원리를 알면 새 장치를 고안할 수 있습니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m2-4", true);

  function finish() { window.sthState("r2", "완성 · " + (window.sthState("accBest") || "") + " / " + (window.sthState("loopBest") || "")); }
  function vs() {
    $("e2-vs").innerHTML = "<b>나의 첫 계획</b> " + (window.sthState("ride1") || "기록 없음") + "<br><b>가속도 그래프</b> " + (window.sthState("accBest") || "-") + "<br><b>루프 설계</b> " + (window.sthState("loopBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk2", unitLabel: "[과학탐구실험2 Ⅰ-2] 이야기 ② 스마트폰을 태운 롤러코스터",
    items: [
      { id: "e2a", label: "그래프로 읽은 운동", hint: "세 놀이기구 가운데 하나를 골라, 그래프의 모양이 어떤 운동을 뜻하는지 설명하세요." },
      { id: "e2b", label: "내가 고안한 안전 장치", hint: "학교 체육 시간에 일어나는 사고 하나를 골라, 어떤 센서로 무엇을 재어 어떻게 막을지 설계하세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ③ 5층 건물만 크게 흔들렸다
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep3", key: "ep3", name: "생활 탐구 ③", onDone: finish });

  window.sthGate({
    gate: "g3", key: "quake1", title: "조사단의 첫 판단",
    question: "지진에 강한 건물을 짓는 방법에 대한 생각으로 가장 알맞은 것은?",
    options: ["㉠ 무조건 두껍고 무겁게 지으면 된다", "㉡ 튼튼하게 짓는 것을 바탕으로, 흔들림을 떼어 내거나 흡수하는 기술을 함께 쓴다", "㉢ 고무 받침 하나만 있으면 된다", "㉣ 높은 건물일수록 반드시 더 위험하다"],
    onPick: function (i) { window.sthState("quake1OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  function amp(r, z) { return 1 / Math.sqrt(Math.pow(1 - r * r, 2) + Math.pow(2 * z * r, 2)); }
  var TG = 0.5;

  /* 장면 2 — 공진 */
  (function () {
    var canvas = $("c-c-res"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, n = 2;
    var got = window.sthState("resGot") || { a: false, q: false };
    function A_(k) { return amp(0.1 * k / TG, 0.05); }
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 520, y0 = 20, y1 = 240, bw = (x1 - x0) / 12;
      axes(ctx, x0, y0, x1, y1);
      [0, 5, 10].forEach(function (a) { text(ctx, a + "배", x0 - 6, y1 - a / 11 * (y1 - y0) + 4, { s: 10, a: "right", c: v("--mist") }); });
      text(ctx, "땅보다 몇 배 흔들리나", x0 + 6, y0 + 4, { s: 11, w: "700", c: v("--mist") });
      for (var k = 1; k <= 12; k++) {
        var h = A_(k) / 11 * (y1 - y0), on = k === n;
        ctx.fillStyle = on ? v("--coral-700") : A(v("--brand"), 0.4); ctx.fillRect(x0 + (k - 1) * bw + bw * 0.15, y1 - h, bw * 0.7, h);
        text(ctx, k, x0 + (k - 0.5) * bw, y1 + 16, { s: 10, a: "center", c: on ? v("--ink") : v("--mist") });
      }
      text(ctx, "층수", x1, y1 + 32, { s: 11, w: "700", a: "right", c: v("--mist") });
      /* 건물 그림 */
      var bx = 700, gy = 260, sway = Math.min(60, A_(n) * 6);
      for (var f = 0; f < n; f++) { var dx = sway * (f + 1) / n; ctx.fillStyle = f % 2 ? v("--panel-2") || "#eef" : A(v("--brand"), 0.25); ctx.strokeStyle = v("--line"); ctx.fillRect(bx - 30 + dx, gy - (f + 1) * 16, 60, 14); ctx.strokeRect(bx - 30 + dx, gy - (f + 1) * 16, 60, 14); }
      seg(ctx, 600, gy + 2, 820, gy + 2, v("--ink"), 3);
      text(ctx, n + "층 · 고유 주기 " + (0.1 * n).toFixed(1) + " 초", 700, gy + 22, { s: 12, w: "800", a: "center" });
      return n === 5;
    }
    function update() {
      var ok = draw(), a = A_(n);
      put("c-res-info", n + "층 건물의 고유 주기는 약 " + (0.1 * n).toFixed(1) + " 초, 땅은 0.5 초마다 흔들립니다. 건물은 땅보다 " + a.toFixed(1) + "배 흔들려요. "
        + (ok ? "✅ 박자가 맞아 흔들림이 10배로 커졌습니다. 이것이 공진입니다." : (0.1 * n < TG ? (0.1 * n < 0.25 ? "건물의 박자가 땅보다 훨씬 빨라 땅을 그대로 따라 움직입니다." : "박자가 조금 어긋나 흔들림이 덜 쌓입니다.") : "건물의 박자가 땅보다 느려 흔들림을 덜 따라갑니다.")));
      if (ok && !got.a) { got.a = true; window.sthState("resGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m3-2a"); if (got.q) done("m3-2b");
      if (got.a && got.q) {
        window.sthState("resBest", "고유 주기 0.5 초인 5층 건물이 10배로 흔들림 (공진)");
        window.sthMission("m3-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("resBest") + ". 피해가 층수에 따라 달랐던 까닭이 풀렸습니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("c-n").addEventListener("input", function (ev) { n = +ev.target.value; $("c-n-val").textContent = n + "층"; update(); });
    window.sthPick({
      mount: "c-res-pick",
      q: "5층 건물이 특히 크게 흔들린 까닭은?",
      options: ["5층 건물이 가장 약하게 지어졌기 때문에", "건물의 고유 주기가 땅이 흔들리는 주기와 같아, 흔들림이 점점 쌓여 커졌기(공진) 때문에", "5층이 땅에서 가장 가깝기 때문에"],
      answer: 1,
      why: ["같은 기준으로 지었어도 층수에 따라 흔들림이 달랐습니다.", "그네를 박자 맞춰 밀면 점점 높이 올라가듯, 박자가 맞으면 작은 흔들림도 크게 쌓입니다.", "낮은 건물은 오히려 덜 흔들렸습니다."],
      onDone: function () { got.q = true; window.sthState("resGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 3 — 기술 조합 */
  (function () {
    var canvas = $("c-c-tech"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, t1 = 0, t2 = 0, t3 = 0;
    var got = window.sthState("techGot") || false;
    var PGA = 0.08;
    function acc() {
      var z = t3 ? 0.25 : 0.05, r = t2 ? 2.0 / TG : 0.5 / TG;
      return PGA * amp(r, t2 ? Math.max(z, 0.1) : z);
    }
    function cap() { return t1 ? 0.5 : 0.12; }
    function draw() {
      paper(ctx, W, H);
      var a = acc(), c = cap(), gy = 250, bx = 200, sway = Math.min(70, a * 60);
      if (t2) { for (var k = 0; k < 4; k++) { ctx.fillStyle = "#3a3a3a"; ctx.fillRect(bx - 45 + k * 26, gy - 12, 16, 12); } }
      for (var f = 0; f < 5; f++) {
        var y = gy - (t2 ? 12 : 0) - (f + 1) * 34, dx = sway * (f + 1) / 5;
        ctx.fillStyle = A(v("--brand"), 0.18); ctx.fillRect(bx - 55 + dx, y, 110, 32);
        ctx.strokeStyle = v("--ink"); ctx.lineWidth = t1 ? 3.5 : 1.5; ctx.strokeRect(bx - 55 + dx, y, 110, 32);
        if (t1) { seg(ctx, bx - 55 + dx, y, bx + 55 + dx, y + 32, A(v("--ink"), 0.5), 2); seg(ctx, bx + 55 + dx, y, bx - 55 + dx, y + 32, A(v("--ink"), 0.5), 2); }
        if (t3 && f % 2 === 1) { ctx.fillStyle = v("--amber-700"); ctx.fillRect(bx - 8 + dx, y + 8, 16, 16); }
      }
      seg(ctx, 60, gy, 360, gy, v("--ink"), 3);
      var ok = a <= c && t1 && (t1 + t2 + t3) >= 2;
      text(ctx, "꼭대기 층 흔들림 " + a.toFixed(2) + " g", 440, 60, { s: 15, w: "900", c: a <= c ? v("--green-700") : v("--rose-700") });
      text(ctx, "건물이 견디는 흔들림 " + c.toFixed(2) + " g", 440, 90, { s: 13, w: "800", c: v("--mist") });
      ctx.fillStyle = A(v("--line"), 0.5); ctx.fillRect(440, 110, 360, 16);
      ctx.fillStyle = a <= c ? v("--green-700") : v("--rose-700"); ctx.fillRect(440, 110, Math.min(360, a / 1.0 * 360), 16);
      seg(ctx, 440 + c * 360, 104, 440 + c * 360, 132, v("--ink"), 2);
      text(ctx, "쓴 기술: " + ([t1 ? "내진" : "", t2 ? "면진" : "", t3 ? "제진" : ""].filter(function (s) { return s; }).join(" + ") || "없음"), 440, 160, { s: 12.5, w: "800" });
      text(ctx, ok ? "학교 건물 안전" : (!t1 && (t2 || t3) ? "보완 필요 — 기본 내진 없음" : "보완 필요"), 440, 196, { s: 16, w: "900", c: ok ? v("--green-700") : v("--rose-700") });
      return ok;
    }
    function update() {
      var ok = draw(), a = acc(), c = cap(), n = t1 + t2 + t3, msg;
      if (ok) msg = "✅ 튼튼한 뼈대(내진) 위에 " + (t2 && t3 ? "면진과 제진을 모두" : (t2 ? "면진을" : "제진을")) + " 더해 흔들림(" + a.toFixed(2) + " g)이 견디는 힘(" + c.toFixed(2) + " g)보다 작아졌습니다.";
      else if (!t1 && n >= 1) msg = "면진이나 제진만 쓰는 건물은 없습니다. 모든 건물은 기본으로 기둥과 벽을 튼튼하게 하는 <b>내진</b> 설계를 갖추어야 합니다.";
      else if (n < 2) msg = a > c ? "흔들림 " + a.toFixed(2) + " g가 견디는 힘 " + c.toFixed(2) + " g보다 큽니다. 공진으로 흔들림이 크게 쌓였습니다." : "한 가지 기술로는 부족합니다. 기술을 함께 써 보세요.";
      else msg = "흔들림이 아직 견디는 힘보다 큽니다.";
      put("c-tech-info", msg);
      if (ok && !got) { got = true; window.sthState("techGot", true); mission(); }
    }
    function mission() {
      if (got) {
        window.sthState("techBest", "내진을 바탕으로 면진 또는 제진을 더함");
        window.sthMission("m3-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("techBest") + ". 면진은 건물의 고유 주기를 늘려 공진을 피하고, 제진은 흔들림 에너지를 흡수합니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    segWire("c-t1", "data-v", function (x) { t1 = +x; update(); });
    segWire("c-t2", "data-v", function (x) { t2 = +x; update(); });
    segWire("c-t3", "data-v", function (x) { t3 = +x; update(); });
    update(); mission();
  })();

  /* 장면 4 — 기술 분류 */
  window.sthSort({
    mount: "c-sort",
    buckets: [{ id: "resist", label: "💪 내진 — 튼튼하게 버틴다" }, { id: "iso", label: "🛞 면진 — 땅의 흔들림을 떼어 낸다" }, { id: "damp", label: "🧽 제진 — 흔들림 에너지를 흡수한다" }],
    items: [
      { t: "기둥과 보를 굵게 하고 철근을 촘촘히 넣는다", a: "resist", why: "건물 자체의 강도를 높입니다." },
      { t: "벽에 X 자 모양의 철골 가새를 댄다", a: "resist", why: "옆으로 미는 힘에 버티게 합니다." },
      { t: "1층이 기둥만 있는 필로티 건물의 기둥을 보강한다", a: "resist", why: "약한 층을 튼튼하게 합니다.", hint: "무엇을 더 튼튼하게 하나요?" },
      { t: "건물과 땅 사이에 고무와 철판을 겹친 받침을 넣는다", a: "iso", why: "땅이 흔들려도 건물은 천천히 움직이게 합니다." },
      { t: "건물 아래에 미끄러지는 받침을 두어 땅만 미끄러지게 한다", a: "iso", why: "땅의 흔들림이 건물로 덜 전달됩니다." },
      { t: "기둥 사이에 오일 댐퍼를 달아 흔들림을 줄인다", a: "damp", why: "흔들림 에너지를 열로 바꿔 흡수합니다." },
      { t: "건물 꼭대기에 거대한 추(동조 질량 댐퍼)를 매단다", a: "damp", why: "건물과 반대로 흔들리며 흔들림을 줄입니다(타이베이 101)." },
      { t: "벽 속에 휘어지며 에너지를 흡수하는 금속 장치를 넣는다", a: "damp", why: "금속이 휘며 에너지를 흡수합니다." }
    ],
    onDone: function () { window.sthMission("m3-4", true, "<span class='m-tag'>미션 완료</span>버티기(내진), 떼어 내기(면진), 흡수하기(제진). 실제 건물은 튼튼함을 바탕으로 여러 기술을 함께 씁니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m3-4", true);

  function finish() { window.sthState("r3", "완성 · " + (window.sthState("resBest") || "") + " / " + (window.sthState("techBest") || "")); }
  function vs() {
    $("e3-vs").innerHTML = "<b>나의 첫 판단</b> " + (window.sthState("quake1") || "기록 없음") + "<br><b>공진</b> " + (window.sthState("resBest") || "-") + "<br><b>기술 조합</b> " + (window.sthState("techBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk3", unitLabel: "[과학탐구실험2 Ⅰ-2] 이야기 ③ 5층 건물만 크게 흔들렸다",
    items: [
      { id: "w2", label: "내진·면진·제진", hint: "세 기술이 각각 지진 에너지를 어떻게 다루는지 한 줄씩 구분해 쓰세요.", ph: "내진: … / 면진: … / 제진: …" },
      { id: "e3a", label: "우리 학교 건물 점검", hint: "우리 학교 건물의 층수와 모양(필로티 여부 등)을 떠올려, 지진에 대비해 점검하거나 보강할 점을 한두 가지 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ④ 동네 환경 탐사대
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep4", key: "ep4", name: "생활 탐구 ④", onDone: finish });

  window.sthGate({
    gate: "g4", key: "env1", title: "탐사대의 첫 결정",
    question: "동아리가 고를 좋은 탐구 문제는 어떤 것일까요?",
    options: ["㉠ 가장 신기한 소문", "㉡ 우리 주변의 실제 문제이면서, 재거나 조사해서 답을 확인할 수 있는 문제", "㉢ 답이 이미 교과서에 있는 문제", "㉣ 아무도 확인할 수 없는 문제"],
    onPick: function (i) { window.sthState("env1OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 외래종 */
  (function () {
    var canvas = $("d-c-eco"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, hh = 0;
    var got = window.sthState("ecoGot") || { a: false, q: false };
    function run(h) { var N = 100, Al = 10, ns = [N], as = [Al]; for (var t = 0; t < 10; t++) { var n = N + 0.3 * N * (1 - N / 100) - 0.006 * Al * N; var a = Al + 0.6 * Al * (1 - Al / 100) - h / 100 * Al; N = Math.max(0, n); Al = Math.max(0, a); ns.push(N); as.push(Al); } return { ns: ns, as: as }; }
    function draw() {
      paper(ctx, W, H);
      var r = run(hh), x0 = 60, x1 = 560, y0 = 20, y1 = 240;
      function X(t) { return x0 + t / 10 * (x1 - x0); }
      function Y(p) { return y1 - p / 110 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [0, 50, 100].forEach(function (p) { text(ctx, p + "%", x0 - 6, Y(p) + 4, { s: 10, a: "right", c: v("--mist") }); });
      [0, 2, 4, 6, 8, 10].forEach(function (t) { text(ctx, t + "년", X(t), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      seg(ctx, x0, Y(60), x1, Y(60), v("--amber-700"), 1.5, true);
      [[r.ns, v("--green-700"), "토종 생물"], [r.as, v("--coral-700"), "뉴트리아"]].forEach(function (L) {
        ctx.save(); ctx.strokeStyle = L[1]; ctx.lineWidth = 3; ctx.beginPath();
        L[0].forEach(function (p, t) { if (t) ctx.lineTo(X(t), Y(p)); else ctx.moveTo(X(t), Y(p)); }); ctx.stroke(); ctx.restore();
        text(ctx, L[2], X(10) + 6, Y(L[0][10]) + 4, { s: 11, w: "800", c: L[1] });
      });
      var n10 = r.ns[10], ok = n10 >= 60 && run(hh - 5).ns[10] < 60;
      text(ctx, "포획률 " + hh + "% / 년", 660, 60, { s: 15, w: "900" });
      text(ctx, "10년 뒤 토종 생물 " + n10.toFixed(0) + "%", 660, 92, { s: 14, w: "800", c: n10 >= 60 ? v("--green-700") : v("--rose-700") });
      text(ctx, "10년 뒤 뉴트리아 " + r.as[10].toFixed(0) + "%", 660, 120, { s: 13, w: "800", c: v("--coral-700") });
      return ok;
    }
    function update() {
      var ok = draw(), r = run(hh);
      put("d-eco-info", "해마다 " + hh + "% 포획하면 10년 뒤 토종 생물은 처음의 " + r.ns[10].toFixed(0) + "%가 남습니다. "
        + (ok ? "✅ 40%가 목표를 지키는 가장 낮은 포획률입니다." : (r.ns[10] >= 60 ? "목표는 지키지만 더 낮은 포획률로도 됩니다." : "천적이 없는 뉴트리아가 빠르게 늘어 토종 생물이 크게 줄어듭니다.")));
      if (ok && !got.a) { got.a = true; window.sthState("ecoGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m4-2a"); if (got.q) done("m4-2b");
      if (got.a && got.q) {
        window.sthState("ecoBest", "해마다 40% 포획 → 10년 뒤 토종 생물 63%");
        window.sthMission("m4-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("ecoBest") + ". 모형으로 계산하면 관리 계획을 미리 세울 수 있습니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("d-h").addEventListener("input", function (ev) { hh = +ev.target.value; $("d-h-val").textContent = hh + "%"; update(); });
    window.sthPick({
      mount: "d-eco-pick",
      q: "외래종이 생물다양성을 해치는 까닭으로 가장 알맞은 것은?",
      options: ["외래종은 모두 독이 있기 때문에", "새 환경에 천적이 거의 없어 빠르게 늘며, 토종 생물과 먹이·서식지를 두고 경쟁하거나 잡아먹기 때문에", "외래종은 토종과 똑같은 생물이기 때문에"],
      answer: 1,
      why: ["독이 없는 외래종도 많습니다.", "천적과 경쟁자가 없으면 개체수가 폭발적으로 늘어 토종 생물의 자리를 빼앗습니다. 뉴트리아, 배스, 가시박이 그런 예입니다.", "외래종은 원래 살던 곳이 다른 생물입니다."],
      onDone: function () { got.q = true; window.sthState("ecoGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 3 — 등굣길 측정 */
  (function () {
    var canvas = $("d-c-pol"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, loc = "park";
    var got = window.sthState("polGot") || { seen: [], q: false };
    if (!got.seen) got.seen = [];
    var D = { park: { n: "학교 뒤 공원", pm: 14, db: 48 }, field: { n: "운동장", pm: 26, db: 58 }, gate: { n: "정문 앞 큰길", pm: 52, db: 72 } };
    function draw() {
      paper(ctx, W, H);
      var d = D[loc];
      text(ctx, d.n + " · 오전 8시", 30, 30, { s: 15, w: "900" });
      [["미세먼지 PM2.5", d.pm, 35, 100, "㎍/m³", "35 넘으면 나쁨"], ["소음", d.db, 65, 100, "dB", "65 넘으면 기준 초과"]].forEach(function (b, k) {
        var y = 70 + k * 80, over = b[1] > b[2];
        text(ctx, b[0], 30, y, { s: 12.5, w: "800", c: v("--mist") });
        ctx.fillStyle = A(v("--line"), 0.5); ctx.fillRect(30, y + 10, 500, 22);
        ctx.fillStyle = over ? v("--rose-700") : v("--green-700"); ctx.fillRect(30, y + 10, 500 * b[1] / b[3], 22);
        seg(ctx, 30 + 500 * b[2] / b[3], y + 2, 30 + 500 * b[2] / b[3], y + 40, v("--ink"), 2);
        text(ctx, b[5], 30 + 500 * b[2] / b[3] + 6, y + 52, { s: 10.5, w: "700", c: v("--mist") });
        text(ctx, b[1] + " " + b[4], 545, y + 27, { s: 15, w: "900", c: over ? v("--rose-700") : v("--green-700") });
      });
      text(ctx, "측정한 곳: " + got.seen.map(function (k) { return D[k].n; }).join(", "), 30, 244, { s: 11.5, w: "700", c: v("--mist") });
    }
    function update() {
      if (got.seen.indexOf(loc) < 0) { got.seen.push(loc); window.sthState("polGot", got); }
      draw();
      var d = D[loc], both = d.pm > 35 && d.db > 65;
      put("d-pol-info", d.n + ": 미세먼지 " + d.pm + " ㎍/m³, 소음 " + d.db + " dB. " + (both ? "두 항목 모두 기준을 넘습니다. 차가 많은 큰길 옆입니다." : "기준 안입니다.") + (got.seen.length >= 3 ? " ✅ 세 곳을 모두 쟀습니다." : ""));
      mission();
    }
    function mission() {
      if (got.seen.length >= 3) done("m4-3a"); if (got.q) done("m4-3b");
      if (got.seen.length >= 3 && got.q && !ep.cleared(2)) {
        window.sthState("polBest", "정문 앞 큰길: 미세먼지 52 · 소음 72 dB 모두 기준 초과");
        window.sthMission("m4-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("polBest") + ". 측정값을 기준과 비교해야 ‘숨 막힌다’는 느낌이 해결할 문제가 됩니다.");
        ep.clear(2);
      } else if (got.seen.length >= 3 && got.q) window.sthMission("m4-3", true);
    }
    canvas._redraw = draw;
    segWire("d-loc", "data-v", function (x) { loc = x; update(); });
    window.sthPick({
      mount: "d-pol-pick",
      q: "측정 결과를 바탕으로 탐사대가 제안할 해결 방안으로 가장 알맞은 것은?",
      options: ["측정기가 틀렸을 테니 다시는 재지 않는다", "등교 동선을 공원 쪽으로 바꾸고, 정문 앞에 나무를 심어 생울타리를 만들자고 제안하며, 측정 자료를 구청에 전달한다", "정문 앞에서 더 오래 머무르게 한다", "양파를 교실마다 둔다"],
      answer: 1,
      why: ["한 번 잰 값만으로 버리지 말고, 여러 날 같은 시각에 되풀이해 재어 확인합니다.", "측정 자료가 해결 방안의 근거가 됩니다. 나무는 소음과 먼지를 어느 정도 막아 줍니다. 적용한 뒤 다시 재서 효과를 확인하면 더 좋습니다.", "오염이 심한 곳에 오래 있으면 해롭습니다.", "측정 근거가 없는 방법입니다."],
      onDone: function () { got.q = true; window.sthState("polGot", got); mission(); }
    });
    update();
  })();

  /* 장면 4 — 과학 / 유사과학 */
  window.sthSort({
    mount: "d-sort",
    buckets: [{ id: "sci", label: "🔬 과학적 주장", sub: "반증 가능 · 재현 · 측정 근거" }, { id: "pseudo", label: "🎭 유사과학", sub: "근거 없음 · 재현 안 됨" }],
    items: [
      { t: "뉴트리아가 늘어난 저수지에서 토종 수초가 줄었다 — 해마다 같은 방법으로 조사한 자료", a: "sci", why: "되풀이해 측정한 자료가 있습니다." },
      { t: "미세먼지(PM2.5)가 높은 날 천식으로 병원을 찾는 사람이 늘었다 — 여러 도시의 대규모 자료", a: "sci", why: "많은 자료에서 되풀이해 확인되었습니다." },
      { t: "대륙은 해마다 몇 cm씩 움직인다 — GPS 측정으로 확인", a: "sci", why: "처음에는 의심받았지만 측정으로 검증되었습니다." },
      { t: "나무를 심은 길은 소음이 줄었다 — 심기 전후로 같은 시각에 잰 값 비교", a: "sci", why: "전후 비교로 확인할 수 있는 주장입니다." },
      { t: "방에 양파를 두면 미세먼지를 빨아들인다", a: "pseudo", why: "양파가 미세먼지를 줄인다는 측정 근거가 없습니다." },
      { t: "혈액형으로 성격을 알 수 있다", a: "pseudo", why: "대규모 연구에서 되풀이해 확인되지 않았습니다(확증 편향)." },
      { t: "자석 팔찌를 차면 통증이 사라진다", a: "pseudo", why: "가짜 팔찌와 비교한 실험에서 차이가 없었습니다." },
      { t: "음이온 목걸이가 공기를 맑게 하고 면역력을 높인다", a: "pseudo", why: "측정해 보니 나오는 음이온이 무시할 만큼 적었고, 효과도 확인되지 않았습니다.", hint: "광고의 숫자를 누가 측정했을까요?" }
    ],
    onDone: function () { window.sthMission("m4-4", true, "<span class='m-tag'>미션 완료</span>과학적 주장은 <b>틀렸음을 확인할 방법</b>이 있고, <b>되풀이해도 같은 결과</b>가 나오며, <b>측정한 근거</b>가 있습니다. 그럴듯한 과학 용어만으로는 과학이 되지 않습니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m4-4", true);

  function finish() { window.sthState("r4", "완성 · " + (window.sthState("ecoBest") || "") + " / " + (window.sthState("polBest") || "")); }
  function vs() {
    $("e4-vs").innerHTML = "<b>나의 첫 결정</b> " + (window.sthState("env1") || "기록 없음") + "<br><b>외래종</b> " + (window.sthState("ecoBest") || "-") + "<br><b>등굣길 측정</b> " + (window.sthState("polBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk4", unitLabel: "[과학탐구실험2 Ⅰ-2] 이야기 ④ 동네 환경 탐사대",
    items: [
      { id: "w3", label: "유사과학을 가르는 기준", hint: "어떤 주장이 과학인지 아닌지 판단할 때 무엇을 보는지 쓰세요.", ph: "기준 ① … / 기준 ② … / 기준 ③ …" },
      { id: "e4a", label: "우리 동네 탐구 문제", hint: "우리 동네에서 재어 보고 싶은 환경 문제 하나를 골라, 무엇을 어디서 언제 잴지 계획을 쓰세요." }
    ]
  });
})();

/* ========================================================================= 07 정리하기 */
window.sthWork({
  mount: "wk", unitLabel: "[과학탐구실험2 Ⅰ-2] 생활 속의 과학 탐구 — 정리",
  recap: [
    { key: "r1", label: "① 우주로 가는 딸기" },
    { key: "r2", label: "② 스마트폰을 태운 롤러코스터" },
    { key: "r3", label: "③ 5층 건물만 크게 흔들렸다" },
    { key: "r4", label: "④ 동네 환경 탐사대" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  items: [
    { id: "all", label: "네 탐구를 꿰는 한 문장", hint: "딸기, 롤러코스터, 건물, 동네. 네 이야기를 ‘생활 속 문제’와 ‘과학 원리’라는 말을 넣어 한 문장으로 이어 보세요." },
    { id: "w1", label: "고른 탐구 하나", hint: "네 이야기의 탐구 가운데 하나를 골라, 무엇을 재서 무엇을 알아냈는지 쓰세요." },
    { id: "w4", label: "아직 헷갈리는 것", hint: "다음 시간에 여기서부터 시작합니다." }
  ]
});

/* ========================================================================= 08 우리 반 */
window.sthShare({
  mount: "share", unit: "gt2-2-3", unitLabel: "[과학탐구실험2 Ⅰ-2] 생활 속의 과학 탐구",
  rows: [
    { key: "r1", label: "① 우주로 가는 딸기" },
    { key: "r2", label: "② 스마트폰을 태운 롤러코스터" },
    { key: "r3", label: "③ 5층 건물만 크게 흔들렸다" },
    { key: "r4", label: "④ 동네 환경 탐사대" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "네 탐구를 꿰는 한 문장" }
});

})();
