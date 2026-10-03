/* 과학탐구실험2 Ⅰ-1 생활 속의 과학 탐구 — 이야기 두 편
   01 비행기 안의 고요 / 02 목이 따가운 교실
   공용 부품: ../assets/theme.js (sthUnit·sthGate·sthWork), ../assets/story.js (sthStory·sthSort·sthOrder·sthPick) */
(function () {
"use strict";

window.sthUnit("gt2-2-1");

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
function wave(ctx, x0, x1, y, amp, ph, cyc, col, w) {
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 2.5; ctx.beginPath();
  for (var x = x0; x <= x1; x += 3) { var t = (x - x0) / (x1 - x0) * cyc * Math.PI * 2; var yy = y - amp * Math.sin(t + ph); if (x === x0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); }
  ctx.stroke(); ctx.restore();
}
function orderDone(mount, steps) {
  $(mount).innerHTML = "<div class='order sort'><div class='slots'>" + steps.map(function (s) { return "<div class='slot filled'>" + s + "</div>"; }).join("") + "</div></div>";
}

/* =========================================================================
   이야기 ① 비행기 안의 고요
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep1", key: "ep1", name: "생활 탐구 ①", onDone: finish });

  window.sthGate({
    gate: "g1", key: "anc1", title: "나의 첫 추측",
    question: "노이즈 캔슬링 헤드폰은 바깥 마이크로 들은 소음을 어떻게 줄일까요?",
    options: ["㉠ 소음을 더 큰 음악으로 덮는다", "㉡ 소음과 반대 모양의 소리를 만들어 더해, 서로 지우게 한다", "㉢ 마이크가 소음을 빨아들인다", "㉣ 귀를 꽉 막는 것뿐이다"],
    onPick: function (i) { window.sthState("anc1OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 간섭 */
  (function () {
    var canvas = $("a-c-wave"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, ph = 0, am = 0.5;
    var got = window.sthState("waveGot") || { a: false, q: false };
    function R() { var p = ph * Math.PI / 180; return Math.sqrt(1 + am * am + 2 * am * Math.cos(p)); }
    function draw() {
      paper(ctx, W, H);
      var x0 = 170, x1 = 640, p = ph * Math.PI / 180;
      text(ctx, "엔진 소음", 20, 58, { s: 12, w: "800", c: v("--coral-700") }); wave(ctx, x0, x1, 55, 26, 0, 3, v("--coral-700"));
      text(ctx, "헤드폰이 만든 소리", 20, 138, { s: 12, w: "800", c: v("--brand-700") }); wave(ctx, x0, x1, 135, 26 * am, p, 3, v("--brand"));
      text(ctx, "귀에 들리는 소리", 20, 228, { s: 12, w: "800" });
      ctx.save(); ctx.strokeStyle = v("--ink"); ctx.lineWidth = 3; ctx.beginPath();
      for (var x = x0; x <= x1; x += 3) { var t = (x - x0) / (x1 - x0) * 6 * Math.PI; var yy = 225 - 26 * (Math.sin(t) + am * Math.sin(t + p)); if (x === x0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); }
      ctx.stroke(); ctx.restore();
      seg(ctx, x0, 225, x1, 225, A(v("--mist"), 0.4), 1, true);
      var r = R(), ok = r <= 0.1 + 1e-9;
      text(ctx, "남은 진폭 " + Math.round(r * 100) + "%", 670, 90, { s: 18, w: "900", c: ok ? v("--green-700") : (r > 1 ? v("--rose-700") : v("--ink")) });
      text(ctx, r > 1.0 ? "보강 간섭 — 더 커졌다" : (r < 0.3 ? "상쇄 간섭 — 거의 사라졌다" : "부분적으로 줄었다"), 670, 122, { s: 13, w: "800", c: v("--mist") });
      text(ctx, "소리 크기 " + (r < 0.01 ? "−40 dB 이하" : (20 * Math.log(r) / Math.LN10).toFixed(1) + " dB"), 670, 150, { s: 12.5, w: "700", c: v("--mist") });
      return ok;
    }
    function update() {
      var ok = draw(), r = R();
      put("a-wave-info", "위상차 " + ph + "°, 세기 " + am.toFixed(1) + ": 귀에 들리는 소리는 소음의 " + Math.round(r * 100) + "% 입니다. "
        + (ok ? "✅ 마루와 골이 만나 서로 지웠습니다. 위상은 반대(180°), 세기는 같게 — 상쇄 간섭입니다." : (ph < 90 ? "마루와 마루가 겹치면 오히려 커집니다." : "위상과 세기를 모두 맞춰야 완전히 지워집니다.")));
      if (ok && !got.a) { got.a = true; window.sthState("waveGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-2a"); if (got.q) done("m1-2b");
      if (got.a && got.q) {
        window.sthState("waveBest", "위상 반대(180°)·같은 세기 → 소음 10% 이하");
        window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("waveBest") + ". 두 파동이 만나 서로 지우는 것이 상쇄 간섭입니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("a-ph").addEventListener("input", function (ev) { ph = +ev.target.value; $("a-ph-val").textContent = ph + "°"; update(); });
    $("a-am").addEventListener("input", function (ev) { am = +ev.target.value; $("a-am-val").textContent = am.toFixed(1); update(); });
    window.sthPick({
      mount: "a-wave-pick",
      q: "헤드폰이 실수로 소음과 위상차 0° 인 소리(세기 1)를 만들면 어떻게 될까요?",
      options: ["소음이 사라진다", "마루와 마루가 겹쳐 소음이 약 2배로 커진다(보강 간섭)", "아무 변화가 없다"],
      answer: 1,
      why: ["위상이 같으면 지우지 못합니다.", "같은 위상의 두 파동이 더해지면 진폭이 커집니다. 그래서 헤드폰은 위상을 정확히 뒤집어야 해요.", "두 소리가 더해지니 변화가 생깁니다."],
      onDone: function () { got.q = true; window.sthState("waveGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 3 — 처리 지연과 진동수 */
  (function () {
    var canvas = $("a-c-lag"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, f = 200;
    var got = window.sthState("lagGot") || { a: false, q: false };
    var TAU = 0.0001;
    function err(ff) { return 360 * ff * TAU; }
    function R(ff) { return 2 * Math.sin(err(ff) / 2 * Math.PI / 180); }
    function draw() {
      paper(ctx, W, H);
      var x0 = 70, x1 = 560, y0 = 30, y1 = 220;
      function X(ff) { return x0 + (ff - 100) / 1900 * (x1 - x0); }
      function Y(red) { return y1 - red * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [0, 0.5, 1].forEach(function (q) { text(ctx, (q * 100) + "%", x0 - 6, Y(q) + 4, { s: 10, a: "right", c: v("--mist") }); });
      [100, 500, 1000, 1500, 2000].forEach(function (ff) { text(ctx, ff, X(ff), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      text(ctx, "소음을 줄인 비율", x0 + 6, y0 - 10, { s: 11, w: "700", c: v("--mist") });
      text(ctx, "진동수 (Hz)", x1, y1 + 34, { s: 11, w: "700", a: "right", c: v("--mist") });
      seg(ctx, x0, Y(0.5), x1, Y(0.5), v("--amber-700"), 1.5, true);
      ctx.save(); ctx.strokeStyle = v("--brand"); ctx.lineWidth = 2.5; ctx.beginPath();
      for (var ff = 100; ff <= 2000; ff += 20) { var red = Math.max(0, 1 - R(ff)); if (ff === 100) ctx.moveTo(X(ff), Y(red)); else ctx.lineTo(X(ff), Y(red)); }
      ctx.stroke(); ctx.restore();
      var red0 = 1 - R(f);
      dot(ctx, X(f), Y(Math.max(0, red0)), 7, red0 >= 0.5 ? v("--green-700") : v("--rose-700"));
      text(ctx, "진동수 " + f + " Hz", 610, 60, { s: 15, w: "900" });
      text(ctx, "0.1 ms 동안 위상이 " + err(f).toFixed(0) + "° 어긋남", 610, 90, { s: 12.5, w: "700", c: v("--mist") });
      text(ctx, red0 < 0 ? "오히려 " + Math.round(-red0 * 100) + "% 커짐" : "소음을 " + Math.round(red0 * 100) + "% 줄임", 610, 122, { s: 15, w: "900", c: red0 >= 0.5 ? v("--green-700") : v("--rose-700") });
      text(ctx, "엔진 소리 약 100 ~ 300 Hz", 610, 170, { s: 11.5, w: "700", c: v("--mist") });
      text(ctx, "말소리의 자음 약 1000 ~ 4000 Hz", 610, 192, { s: 11.5, w: "700", c: v("--mist") });
      return R(f) <= 0.5 && R(f + 100) > 0.5;
    }
    function update() {
      var ok = draw(), red0 = 1 - R(f);
      put("a-lag-info", f + " Hz 소음은 헤드폰이 소리를 만드는 0.1 ms 동안 위상이 " + err(f).toFixed(0) + "° 어긋나, " + (red0 < 0 ? "오히려 " + Math.round(-red0 * 100) + "% 커집니다(보강 간섭). " : Math.round(red0 * 100) + "% 만 줄어듭니다. ")
        + (ok ? "✅ 800 Hz 가 절반 이상 줄일 수 있는 가장 높은 진동수입니다. 그보다 높은 소리는 위상이 너무 많이 어긋나요." : (red0 >= 0.5 ? "아직 절반 넘게 줄어듭니다. 더 높은 진동수는?" : "절반도 못 줄입니다. 진동수를 낮춰 보세요.")));
      if (ok && !got.a) { got.a = true; window.sthState("lagGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-3a"); if (got.q) done("m1-3b");
      if (got.a && got.q) {
        window.sthState("lagBest", "처리 지연 0.1 ms → 800 Hz 넘는 소리는 절반도 못 지움");
        window.sthMission("m1-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("lagBest") + ". 낮은 엔진 소리는 잘 지우고, 높은 말소리는 남는 까닭입니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    $("a-f").addEventListener("input", function (ev) { f = +ev.target.value; $("a-f-val").textContent = f + " Hz"; update(); });
    window.sthPick({
      mount: "a-lag-pick",
      q: "노이즈 캔슬링 헤드폰을 써도 승무원의 말소리는 들리는 까닭으로 가장 알맞은 것은?",
      options: ["말소리가 엔진 소리보다 커서", "말소리에는 진동수가 높은 성분(자음 등)이 많아, 반대 소리를 만드는 짧은 시간 동안에도 위상이 크게 어긋나기 때문에", "헤드폰이 사람 목소리를 알아보고 일부러 들려주기 때문에"],
      answer: 1,
      why: ["엔진 소리가 훨씬 큽니다.", "진동수가 높을수록 같은 시간 지연에도 위상이 더 많이 어긋나 상쇄가 잘 안 됩니다.", "일부 제품에 그런 기능이 있지만, 기본 원리는 위상 어긋남입니다."],
      onDone: function () { got.q = true; window.sthState("lagGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 4 — 생활 속 과학 원리 지도 */
  window.sthSort({
    mount: "a-sort",
    buckets: [{ id: "wave", label: "🌊 파동 — 소리·빛·전파" }, { id: "heat", label: "🔥 열의 이동" }, { id: "force", label: "⚙️ 힘과 운동" }],
    items: [
      { t: "🎧 노이즈 캔슬링 헤드폰 — 반대 위상의 소리로 소음을 지운다 (미디어)", a: "wave", why: "소리 파동의 상쇄 간섭입니다." },
      { t: "📡 GPS 내비게이션 — 여러 위성의 전파가 도착하는 시간 차로 위치를 잰다 (미디어)", a: "wave", why: "빛의 속력으로 가는 전파의 도착 시간을 씁니다." },
      { t: "🎬 3D 영화 안경 — 양쪽 눈에 편광 방향이 다른 빛만 들어가게 한다 (영화)", a: "wave", why: "빛의 편광을 이용합니다." },
      { t: "🍱 보냉 도시락통 — 진공층이 열의 전도·대류를 막는다 (요리)", a: "heat", why: "열이 이동하는 길을 막습니다." },
      { t: "🏠 겨울 이중창 — 유리 사이 공기층이 열이 빠져나가는 것을 줄인다 (건축)", a: "heat", why: "공기는 열을 잘 전하지 않습니다." },
      { t: "🥩 수비드 요리 — 일정한 온도의 물로 고기를 천천히 익힌다 (요리)", a: "heat", why: "물의 열을 고르게 전달합니다.", hint: "무엇이 고기에게 전달되나요?" },
      { t: "🚗 자동차 에어백 — 부딪히는 시간을 늘려 몸이 받는 힘을 줄인다 (생활 안전)", a: "force", why: "충격량이 같을 때 시간이 길면 힘이 작아집니다." },
      { t: "⚽ 바나나킥 — 공을 회전시켜 휘어 날아가게 한다 (스포츠)", a: "force", why: "회전하는 공 둘레의 공기 흐름 차이가 옆으로 미는 힘(마그누스 힘)을 만듭니다." }
    ],
    onDone: function () { window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>영화·건축·요리·스포츠·미디어, 어디에서나 몇 가지 과학 원리가 되풀이해 쓰입니다. 원리를 알면 처음 보는 기술도 설명할 수 있어요."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m1-4", true);

  function finish() { window.sthState("r1", "완성 · " + (window.sthState("waveBest") || "") + " / " + (window.sthState("lagBest") || "")); }
  function vs() {
    $("e1-vs").innerHTML = "<b>나의 첫 추측</b> " + (window.sthState("anc1") || "기록 없음") + "<br><b>간섭</b> " + (window.sthState("waveBest") || "-") + "<br><b>처리 지연</b> " + (window.sthState("lagBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk1", unitLabel: "[과학탐구실험2 Ⅰ-1] 이야기 ① 비행기 안의 고요",
    items: [
      { id: "w1", label: "내 주변의 과학 원리", hint: "일상에서 고른 장면 하나에 어떤 과학 원리가 숨어 있는지 쓰세요.", ph: "장면: … / 숨은 원리: …" },
      { id: "e1a", label: "노이즈 캔슬링의 장단점", hint: "상쇄 간섭과 처리 지연을 들어, 노이즈 캔슬링 헤드폰이 잘 지우는 소리와 잘 못 지우는 소리를 설명하세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ② 목이 따가운 교실
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep2", key: "ep2", name: "생활 탐구 ②", onDone: finish });

  window.sthGate({
    gate: "g2", key: "dry1", title: "도우미의 첫 판단",
    question: "교실이 건조한 문제를 과학적으로 해결하려면 무엇부터 해야 할까요?",
    options: ["㉠ 가장 비싼 가습기부터 산다", "㉡ 습도계로 교실 습도를 재어 문제를 숫자로 확인하고, 해결 방법을 가설로 세운다", "㉢ 친구들에게 투표를 받는다", "㉣ 창문을 활짝 열어 둔다"],
    onPick: function (i) { window.sthState("dry1OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 가습기 */
  (function () {
    var canvas = $("b-c-hum"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, pow = "weak", t = 10;
    var got = window.sthState("humGot") || { a: false, b: false, q: false };
    var P = { weak: { eq: 55, tau: 60, n: "약하게" }, strong: { eq: 70, tau: 40, n: "강하게" } };
    function hum(p, tt) { return P[p].eq - (P[p].eq - 25) * Math.exp(-tt / P[p].tau); }
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 560, y0 = 20, y1 = 240;
      function X(tt) { return x0 + tt / 120 * (x1 - x0); }
      function Y(hh) { return y1 - (hh - 20) / 60 * (y1 - y0); }
      ctx.fillStyle = A(v("--green-700"), 0.1); ctx.fillRect(x0, Y(60), x1 - x0, Y(40) - Y(60));
      text(ctx, "알맞은 습도 40 ~ 60%", x1 - 6, Y(60) + 14, { s: 10.5, w: "800", a: "right", c: v("--green-700") });
      axes(ctx, x0, y0, x1, y1);
      [20, 40, 60, 80].forEach(function (hh) { text(ctx, hh + "%", x0 - 6, Y(hh) + 4, { s: 10, a: "right", c: v("--mist") }); });
      [0, 30, 60, 90, 120].forEach(function (tt) { text(ctx, tt + "분", X(tt), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      ["weak", "strong"].forEach(function (p) {
        ctx.save(); ctx.strokeStyle = p === pow ? v("--brand") : A(v("--mist"), 0.5); ctx.lineWidth = p === pow ? 3 : 1.5; ctx.beginPath();
        for (var tt = 0; tt <= 120; tt += 2) { if (tt === 0) ctx.moveTo(X(tt), Y(hum(p, tt))); else ctx.lineTo(X(tt), Y(hum(p, tt))); }
        ctx.stroke(); ctx.restore();
      });
      var hh = hum(pow, t), okr = hh >= 40 && hh <= 60;
      seg(ctx, X(t), y0, X(t), y1, v("--amber-700"), 1.5, true);
      dot(ctx, X(t), Y(hh), 7, okr ? v("--green-700") : (hh > 60 ? v("--rose-700") : v("--ink")));
      text(ctx, P[pow].n + " · " + t + "분", 610, 60, { s: 15, w: "900" });
      text(ctx, "습도 " + hh.toFixed(1) + "%", 610, 92, { s: 18, w: "900", c: okr ? v("--green-700") : (hh > 60 ? v("--rose-700") : v("--ink")) });
      text(ctx, hh > 60 ? "창문에 물방울 — 곰팡이 주의" : (okr ? "알맞음" : "아직 건조함"), 610, 122, { s: 13, w: "800", c: v("--mist") });
    }
    function update() {
      draw();
      var hh = hum(pow, t);
      if (t <= 30 && hh >= 40 && hh <= 60 && !got.a) got.a = true;
      if (pow === "strong" && hh > 60 && !got.b) got.b = true;
      window.sthState("humGot", got);
      put("b-hum-info", P[pow].n + " " + t + "분 가동: 습도 " + hh.toFixed(1) + "%. "
        + (hh > 60 ? "✅ 60% 를 넘었습니다. 창문에 물이 맺히고 곰팡이가 생기기 쉬워요." : (hh >= 40 ? (t <= 30 ? "✅ 30분 안에 알맞은 습도에 이르렀습니다." : "알맞은 습도지만 30분이 넘게 걸렸습니다.") : "아직 40% 가 안 됩니다.")));
      mission();
    }
    function mission() {
      if (got.a) done("m2-2a"); if (got.b) done("m2-2b"); if (got.q) done("m2-2c");
      if (got.a && got.b && got.q && !ep.cleared(1)) {
        window.sthState("humBest", "강하게 20 ~ 30분 → 40 ~ 50%, 1시간 넘게 틀면 60% 초과");
        window.sthMission("m2-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("humBest") + ". 가설(가습기로 습도가 오른다)이 지지되었고, 알맞게 쓰는 조건도 찾았습니다.");
        ep.clear(1);
      } else if (got.a && got.b && got.q) window.sthMission("m2-2", true);
    }
    canvas._redraw = draw;
    segWire("b-pow", "data-v", function (x) { pow = x; update(); });
    $("b-t").addEventListener("input", function (ev) { t = +ev.target.value; $("b-t-val").textContent = t + "분"; update(); });
    window.sthPick({
      mount: "b-hum-pick",
      q: "교실 습도를 알맞게 유지하는 방법으로 가장 알맞은 것은?",
      options: ["가습기를 강하게 하루 종일 틀어 둔다", "습도계를 보며 40 ~ 60% 를 넘지 않도록 세기와 시간을 조절한다", "습도는 높을수록 좋으니 신경 쓰지 않는다"],
      answer: 1,
      why: ["60% 를 넘어 결로와 곰팡이가 생깁니다.", "재면서 조절하는 것이 핵심입니다. 해결책도 결과를 확인하며 고쳐 가야 해요.", "너무 높은 습도는 곰팡이와 집먼지진드기를 늘립니다."],
      onDone: function () { got.q = true; window.sthState("humGot", got); mission(); }
    });
    update();
  })();

  /* 장면 3 — 젖은 수건 가설 */
  (function () {
    var canvas = $("b-c-towel"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, n = 2, win = "shut";
    var got = window.sthState("towelGot") || false;
    var PER = 50 / (180 * 17.3) * 100;   /* 수건 한 장이 한 시간에 올리는 습도 (%p) */
    function rise(k, w) { return k * PER * (w === "vent" ? 0.5 : 1); }
    function draw() {
      paper(ctx, W, H);
      text(ctx, "교실 180 m³ · 20 °C · 한 시간", 30, 26, { s: 12.5, w: "800", c: v("--mist") });
      seg(ctx, 40, 60, 520, 60, v("--line"), 2);
      for (var i = 0; i < n; i++) {
        var x = 60 + i * 38;
        ctx.fillStyle = A(v("--brand"), 0.5); ctx.fillRect(x, 62, 28, 60);
        for (var d = 0; d < 3; d++) dot(ctx, x + 6 + d * 8, 132 + (i + d) % 3 * 8, 2.2, A(v("--brand"), 0.8));
      }
      if (win === "vent") text(ctx, "🪟 20분마다 환기 → 수증기의 절반이 밖으로", 40, 200, { s: 12, w: "800", c: v("--amber-700") });
      var r = rise(n, win), ok = win === "shut" && r >= 10 && rise(n - 1, win) < 10;
      text(ctx, "수건 " + n + "장 → 물 " + (n * 50) + " g 증발", 580, 60, { s: 14, w: "900" });
      text(ctx, "습도 +" + r.toFixed(1) + "%p", 580, 94, { s: 20, w: "900", c: r >= 10 ? v("--green-700") : v("--ink") });
      text(ctx, "25% → " + (25 + r).toFixed(1) + "%", 580, 124, { s: 13, w: "800", c: v("--mist") });
      text(ctx, "한 장 = 50 g ÷ (180 m³ × 17.3 g/m³) ≈ " + PER.toFixed(1) + "%p", 580, 170, { s: 11, w: "700", c: v("--mist") });
      return ok;
    }
    function update() {
      var ok = draw(), r = rise(n, win);
      put("b-towel-info", "수건 " + n + "장, 창문 " + (win === "shut" ? "닫음" : "20분마다 환기") + ": 한 시간 동안 습도가 " + r.toFixed(1) + "%p 오릅니다. "
        + (ok ? "✅ 7장이 가장 적은 수입니다. 가설은 지지되지만, 가습기 한 대 몫을 내려면 수건 여러 장이 필요해요." : (win === "vent" ? "환기하면 수증기가 빠져나가 효과가 절반으로 줄어듭니다. 창문을 닫은 조건에서 찾으세요." : (r >= 10 ? "10%p 는 넘었지만 더 적은 수로도 됩니다." : "아직 10%p 가 안 됩니다."))));
      if (ok && !got) { got = true; window.sthState("towelGot", true); mission(); }
    }
    function mission() {
      if (got) {
        window.sthState("towelBest", "창문 닫고 수건 7장 → 한 시간에 +11%p");
        window.sthMission("m2-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("towelBest") + ". 증발량을 계산하면 해결책이 얼마나 쓸모 있는지 미리 판단할 수 있습니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    $("b-n").addEventListener("input", function (ev) { n = +ev.target.value; $("b-n-val").textContent = n + "장"; update(); });
    segWire("b-win", "data-v", function (x) { win = x; update(); });
    update(); mission();
  })();

  /* 장면 4 — 해결 과정 */
  (function () {
    var STEPS = [
      "문제 인식 — 겨울 교실이 건조해 목이 아프고 정전기가 난다 (습도 25%)",
      "가설 설정 — 가습기(또는 젖은 수건)를 쓰면 습도가 40 ~ 60% 로 오를 것이다",
      "탐구 설계 — 가동 시간·수건 수를 바꾸고, 교실 온도·창문 조건은 같게 한다",
      "탐구 수행 — 습도계로 5분마다 습도를 재어 기록한다",
      "자료 해석과 결론 — 그래프로 나타내 가설이 지지되는지 판단한다",
      "적용과 평가 — 교실에 적용해 보고, 결로나 비용 같은 새 문제가 없는지 살핀다"
    ];
    function ok() { window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>해결책을 적용한 뒤에도 새 문제가 보이면, 그것이 다음 탐구의 출발점이 됩니다."); ep.clear(3); ep.clear(4); }
    if (ep.cleared(3)) { orderDone("b-order", STEPS); window.sthMission("m2-4", true); }
    else window.sthOrder({ mount: "b-order", steps: STEPS, onDone: ok });
  })();

  function finish() { window.sthState("r2", "완성 · " + (window.sthState("humBest") || "") + " / " + (window.sthState("towelBest") || "")); }
  function vs() {
    $("e2-vs").innerHTML = "<b>나의 첫 판단</b> " + (window.sthState("dry1") || "기록 없음") + "<br><b>가습기</b> " + (window.sthState("humBest") || "-") + "<br><b>젖은 수건</b> " + (window.sthState("towelBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk2", unitLabel: "[과학탐구실험2 Ⅰ-1] 이야기 ② 목이 따가운 교실",
    items: [
      { id: "w2", label: "확인할 방법", hint: "내가 고른 생활 속 원리나 해결책이 맞는지 확인하려면 무엇을 어떻게 재야 하는지 쓰세요.", ph: "잴 것: … / 재는 방법: … / 같게 둘 조건: …" },
      { id: "e2a", label: "우리 집의 작은 문제", hint: "집이나 학교에서 겪는 작은 불편 하나를 골라, 과학적 문제 해결 과정의 첫 두 단계(문제 인식, 가설 설정)를 써 보세요." }
    ]
  });
})();

/* ========================================================================= 05 정리하기 */
window.sthWork({
  mount: "wk", unitLabel: "[과학탐구실험2 Ⅰ-1] 생활 속의 과학 탐구 — 정리",
  recap: [
    { key: "r1", label: "① 비행기 안의 고요" },
    { key: "r2", label: "② 목이 따가운 교실" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  items: [
    { id: "all", label: "두 탐구를 꿰는 한 문장", hint: "헤드폰과 교실 습도, 두 이야기를 ‘생활’과 ‘과학 원리’라는 말을 넣어 한 문장으로 이어 보세요." },
    { id: "w3", label: "아직 헷갈리는 것", hint: "다음 시간에 여기서부터 시작합니다." }
  ]
});

/* ========================================================================= 06 우리 반 */
window.sthShare({
  mount: "share", unit: "gt2-2-1", unitLabel: "[과학탐구실험2 Ⅰ-1] 생활 속의 과학 탐구",
  rows: [
    { key: "r1", label: "① 비행기 안의 고요" },
    { key: "r2", label: "② 목이 따가운 교실" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "두 탐구를 꿰는 한 문장" }
});

})();
