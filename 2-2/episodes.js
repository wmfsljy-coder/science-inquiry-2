/* 과학탐구실험2 Ⅱ-1 미래 사회와 첨단 과학 탐구 — 이야기 두 편
   01 고양이를 못 알아보는 인공지능 / 02 방학 동안의 화분
   공용 부품: ../assets/theme.js (sthUnit·sthGate·sthWork), ../assets/story.js (sthStory·sthSort·sthOrder·sthPick) */
(function () {
"use strict";

window.sthUnit("gt2-2-2");

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
function orderDone(mount, steps) {
  $(mount).innerHTML = "<div class='order sort'><div class='slots'>" + steps.map(function (s) { return "<div class='slot filled'>" + s + "</div>"; }).join("") + "</div></div>";
}
function fmtN(n) { return n >= 10000 ? Math.round(n).toLocaleString() : String(Math.round(n)); }

/* =========================================================================
   이야기 ① 고양이를 못 알아보는 인공지능
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep1", key: "ep1", name: "첨단 탐구 ①", onDone: finish });

  window.sthGate({
    gate: "g1", key: "ai1", title: "부원의 첫 추측",
    question: "사진 속 고양이를 알아보는 인공지능은 구별하는 방법을 어떻게 익힐까요?",
    options: ["㉠ 사람이 ‘귀가 뾰족하면 고양이’ 같은 규칙을 하나하나 입력한다", "㉡ 이름표가 붙은 많은 사진을 보며, 고양이를 구별하는 특징의 패턴을 스스로 찾아낸다", "㉢ 인터넷에서 정답을 그때그때 검색한다", "㉣ 처음부터 모든 동물을 알고 태어난다"],
    onPick: function (i) { window.sthState("ai1OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 데이터 양 */
  (function () {
    var canvas = $("a-c-data"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, L = 1;
    var got = window.sthState("dataGot") || { a: false, q: false };
    function acc(l) { return 0.97 - 0.47 * Math.exp(-(l - 1) / 1.1); }
    function draw() {
      paper(ctx, W, H);
      var x0 = 70, x1 = 560, y0 = 20, y1 = 230;
      function X(l) { return x0 + (l - 1) / 5 * (x1 - x0); }
      function Y(a) { return y1 - (a - 0.4) / 0.6 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [0.5, 0.7, 0.9, 1].forEach(function (a) { text(ctx, Math.round(a * 100) + "%", x0 - 6, Y(a) + 4, { s: 10, a: "right", c: v("--mist") }); });
      ["10", "100", "1천", "1만", "10만", "100만"].forEach(function (s, i) { text(ctx, s, X(i + 1), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      text(ctx, "학습 사진 수 (눈금마다 10배)", x1, y1 + 34, { s: 11, w: "700", a: "right", c: v("--mist") });
      seg(ctx, x0, Y(0.9), x1, Y(0.9), v("--amber-700"), 1.5, true);
      ctx.save(); ctx.strokeStyle = v("--brand"); ctx.lineWidth = 2.5; ctx.beginPath();
      for (var l = 1; l <= 6.001; l += 0.05) { if (l === 1) ctx.moveTo(X(l), Y(acc(l))); else ctx.lineTo(X(l), Y(acc(l))); }
      ctx.stroke(); ctx.restore();
      var a = acc(L), ok = a >= 0.9 && acc(L - 0.1) < 0.9;
      dot(ctx, X(L), Y(a), 7, a >= 0.9 ? v("--green-700") : v("--ink"));
      text(ctx, "학습 사진 " + fmtN(Math.pow(10, L)) + " 장", 610, 60, { s: 15, w: "900" });
      text(ctx, "처음 보는 사진 정답률 " + (a * 100).toFixed(1) + "%", 610, 92, { s: 14, w: "800", c: a >= 0.9 ? v("--green-700") : v("--ink") });
      text(ctx, "사진 10배 → +" + ((acc(Math.min(6, L + 1)) - a) * 100).toFixed(1) + "%p", 610, 124, { s: 12.5, w: "700", c: v("--mist") });
      return ok;
    }
    function update() {
      var ok = draw(), a = acc(L);
      put("a-data-info", "학습 사진 " + fmtN(Math.pow(10, L)) + " 장: 처음 보는 사진을 " + (a * 100).toFixed(1) + "% 맞힙니다. "
        + (ok ? "✅ 약 1,260 장이 90%에 이르는 가장 적은 수입니다." : (a >= 0.9 ? "90%는 넘었지만 더 적은 사진으로도 됩니다." : "아직 90%에 못 미칩니다.")));
      if (ok && !got.a) { got.a = true; window.sthState("dataGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-2a"); if (got.q) done("m1-2b");
      if (got.a && got.q) {
        window.sthState("dataBest", "약 1,260 장에서 90%, 그 뒤로는 10배마다 조금씩");
        window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("dataBest") + ". 데이터가 많을수록 좋지만, 늘어나는 폭은 점점 줄어듭니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("a-n").addEventListener("input", function (ev) { L = +ev.target.value; $("a-n-val").textContent = fmtN(Math.pow(10, L)) + " 장"; update(); });
    window.sthPick({
      mount: "a-data-pick",
      q: "학습 사진을 1만 장에서 10만 장, 100만 장으로 10배씩 늘리면 정답률은 어떻게 될까요?",
      options: ["10배씩 늘 때마다 정답률도 10%p씩 계속 오른다", "계속 오르긴 하지만, 오르는 폭이 점점 작아진다", "사진이 많아지면 오히려 떨어진다"],
      answer: 1,
      why: ["그래프는 점점 평평해집니다.", "처음에는 조금만 늘려도 크게 오르지만, 이미 잘하는 인공지능은 훨씬 많은 사진이 있어야 조금 더 나아집니다.", "이 그래프에서는 떨어지지 않습니다. 다만 데이터의 질이 나쁘면 그럴 수도 있습니다."],
      onDone: function () { got.q = true; window.sthState("dataGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 3 — 데이터 편향 */
  (function () {
    var canvas = $("a-c-bias"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, p = 90;
    var got = window.sthState("biasGot") || { a: false, q: false };
    function aw(q) { return 0.95 - 0.22 * Math.pow(1 - q, 2); }
    function draw() {
      paper(ctx, W, H);
      var q = p / 100, w = aw(q), b = aw(1 - q);
      text(ctx, "학습 사진의 구성 (한 칸 = 1%)", 30, 26, { s: 12.5, w: "800", c: v("--mist") });
      for (var i = 0; i < 100; i++) {
        var x = 30 + (i % 25) * 18, y = 42 + Math.floor(i / 25) * 18;
        dot(ctx, x + 7, y + 7, 7, i < p ? "#f4f1ea" : "#23262d");
        ctx.strokeStyle = v("--line"); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x + 7, y + 7, 7, 0, Math.PI * 2); ctx.stroke();
      }
      text(ctx, "흰 고양이 " + p + " · 검은 고양이 " + (100 - p), 30, 138, { s: 12, w: "800" });
      [[w, "흰 고양이를 알아봄", "#c9b98f"], [b, "검은 고양이를 알아봄", "#23262d"]].forEach(function (r, k) {
        var y = 170 + k * 36;
        text(ctx, r[1], 30, y + 14, { s: 12, w: "700" });
        ctx.fillStyle = A(v("--line"), 0.5); ctx.fillRect(190, y, 300, 20);
        ctx.fillStyle = r[0] >= 0.85 ? v("--green-700") : v("--rose-700"); ctx.fillRect(190, y, 300 * r[0], 20);
        text(ctx, (r[0] * 100).toFixed(1) + "%", 500, y + 15, { s: 13, w: "900", c: r[0] >= 0.85 ? v("--green-700") : v("--rose-700") });
      });
      seg(ctx, 190 + 300 * 0.85, 162, 190 + 300 * 0.85, 234, v("--amber-700"), 1.5, true);
      text(ctx, "85%", 190 + 300 * 0.85, 158, { s: 10.5, w: "800", a: "center", c: v("--amber-700") });
      var ok = w >= 0.85 && b >= 0.85;
      text(ctx, ok ? "털색과 상관없이 알아본다" : "한쪽 고양이를 잘 못 알아본다", 600, 110, { s: 15, w: "900", c: ok ? v("--green-700") : v("--rose-700") });
      return ok;
    }
    function update() {
      var ok = draw(), q = p / 100;
      put("a-bias-info", "흰 고양이 " + p + "%, 검은 고양이 " + (100 - p) + "%로 학습: 흰 고양이 " + (aw(q) * 100).toFixed(1) + "%, 검은 고양이 " + (aw(1 - q) * 100).toFixed(1) + "%를 알아봅니다. "
        + (ok ? "✅ 두 고양이를 모두 잘 알아봅니다. 학습 데이터를 고르게 섞었기 때문입니다." : "적게 본 쪽을 잘 못 알아봅니다."));
      if (ok && !got.a) { got.a = true; window.sthState("biasGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-3a"); if (got.q) done("m1-3b");
      if (got.a && got.q) {
        window.sthState("biasBest", "흰·검은 고양이를 35~65%로 섞으면 둘 다 85% 이상");
        window.sthMission("m1-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("biasBest") + ". 인공지능의 판단은 학습 데이터를 닮습니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    $("a-p").addEventListener("input", function (ev) { p = +ev.target.value; $("a-p-val").textContent = p + "%"; update(); });
    window.sthPick({
      mount: "a-bias-pick",
      q: "학습 데이터가 한쪽으로 치우친 인공지능을 사람을 판단하는 일(얼굴 인식, 채용 등)에 쓰면 어떤 문제가 생길 수 있을까요?",
      options: ["아무 문제가 없다 — 인공지능은 늘 공정하다", "데이터에 적게 들어 있던 사람들을 더 자주 잘못 판단해 불공정한 결과가 생길 수 있다", "인공지능이 스스로 데이터를 고쳐 문제가 저절로 사라진다"],
      answer: 1,
      why: ["인공지능은 보여 준 데이터를 닮기 때문에 데이터의 치우침도 그대로 배웁니다.", "그래서 첨단 기술을 쓸 때는 데이터를 고르게 모으고, 결과를 여러 집단으로 나누어 확인해야 합니다.", "사람이 데이터를 살피고 고쳐야 합니다."],
      onDone: function () { got.q = true; window.sthState("biasGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 4 — 첨단 기술 속 과학 원리 */
  window.sthSort({
    mount: "a-sort",
    buckets: [{ id: "phy", label: "⚡ 물리 — 빛·전기·운동" }, { id: "chem", label: "🧪 화학 — 물질과 반응" }, { id: "bio", label: "🧬 생명과학 — 유전자·세포" }, { id: "info", label: "💻 정보 — 데이터·알고리즘" }],
    items: [
      { t: "자율 주행차의 라이다 — 레이저 빛이 반사되어 돌아오는 시간으로 거리를 잰다", a: "phy", why: "빛의 속력과 반사를 씁니다." },
      { t: "VR 헤드셋 — 두 눈에 조금씩 다른 영상을 보여 입체감을 만든다", a: "phy", why: "두 눈의 시차와 렌즈의 굴절을 씁니다." },
      { t: "리튬 이온 전지 — 리튬 이온이 두 전극 사이를 오가며 충전·방전된다", a: "chem", why: "산화·환원 반응을 씁니다." },
      { t: "수소 연료 전지차 — 수소와 산소가 반응해 물이 되며 전기를 만든다", a: "chem", why: "화학 반응의 에너지를 전기로 바꿉니다." },
      { t: "유전자 가위 — 특정 DNA 염기 서열을 찾아 자르고 고친다", a: "bio", why: "DNA 염기의 짝짓기를 이용합니다." },
      { t: "mRNA 백신 — 세포가 바이러스의 표면 단백질(항원)을 만들어 면역을 익히게 한다", a: "bio", why: "세포의 단백질 합성과 면역을 씁니다.", hint: "세포 속에서 무슨 일이 일어나나요?" },
      { t: "사진 속 고양이를 알아보는 인공지능 — 많은 사진에서 특징의 패턴을 학습한다", a: "info", why: "데이터에서 패턴을 찾는 알고리즘입니다." },
      { t: "동영상 추천 — 비슷한 사람들이 본 영상을 분석해 골라 준다", a: "info", why: "많은 사용 기록을 분석하는 알고리즘입니다." }
    ],
    onDone: function () { window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>첨단 기술도 결국 교과서의 과학 원리 위에 서 있습니다. 여러 분야의 원리를 함께 쓰는 기술도 많아요(자율 주행차 = 라이다 + 인공지능)."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m1-4", true);

  function finish() { window.sthState("r1", "완성 · " + (window.sthState("dataBest") || "") + " / " + (window.sthState("biasBest") || "")); }
  function vs() {
    $("e1-vs").innerHTML = "<b>나의 첫 추측</b> " + (window.sthState("ai1") || "기록 없음") + "<br><b>데이터의 양</b> " + (window.sthState("dataBest") || "-") + "<br><b>데이터의 구성</b> " + (window.sthState("biasBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk1", unitLabel: "[과학탐구실험2 Ⅱ-1] 이야기 ① 고양이를 못 알아보는 인공지능",
    items: [
      { id: "e1a", label: "인공지능이 배우는 방법", hint: "데이터의 양과 구성이 인공지능의 판단에 어떤 영향을 주는지, 이 장면의 결과를 들어 두세 문장으로 쓰세요." },
      { id: "e1b", label: "내가 고른 첨단 기술", hint: "관심 있는 첨단 기술 하나를 골라, 그 속의 과학 원리와 쓰임, 한계를 한 문단으로 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ② 방학 동안의 화분
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep2", key: "ep2", name: "첨단 탐구 ②", onDone: finish });

  window.sthGate({
    gate: "g2", key: "sens1", title: "부원의 첫 설계",
    question: "스스로 물을 주는 장치를 만들려면 어떤 부품들이 필요할까요?",
    options: ["㉠ 타이머 하나 — 정해진 시각마다 물을 준다", "㉡ 흙의 수분을 재는 센서, 값을 판단하는 제어 장치, 물을 보내는 펌프", "㉢ 커다란 물통 하나", "㉣ 카메라 하나"],
    onPick: function (i) { window.sthState("sens1OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 센서 보정 */
  (function () {
    var canvas = $("b-c-cal"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, dry = 1000, wet = 200;
    var got = window.sthState("calGot") || { a: false, q: false };
    var RD = 820, RW = 380;
    function raw(pct) { return RD - (RD - RW) * pct / 100; }
    function read(r) { return (dry - r) / (dry - wet) * 100; }
    function draw() {
      paper(ctx, W, H);
      var cols = [["바싹 마른 흙", 0, "#c89a5a"], ["흠뻑 젖은 흙", 100, "#5a3a20"], ["시험 흙 ① (실제 50%)", 50, "#8a6034"], ["시험 흙 ② (실제 30%)", 30, "#a57a45"]];
      cols.forEach(function (c, i) {
        var x = 40 + i * 205, r = raw(c[1]);
        ctx.fillStyle = c[2]; ctx.fillRect(x, 60, 150, 60);
        seg(ctx, x + 75, 30, x + 75, 90, v("--ink"), 4);
        text(ctx, c[0], x + 75, 145, { s: 11.5, w: "800", a: "center" });
        text(ctx, "센서 값 " + Math.round(r), x + 75, 168, { s: 13, w: "900", a: "center", c: v("--brand-700") });
        if (i >= 2) {
          var rd = read(r), ok = Math.abs(rd - c[1]) <= 3;
          text(ctx, "장치가 읽은 수분 " + rd.toFixed(1) + "%", x + 75, 196, { s: 12.5, w: "900", a: "center", c: ok ? v("--green-700") : v("--rose-700") });
        }
      });
      text(ctx, "입력한 보정값: 마른 흙 " + dry + " → 0%, 젖은 흙 " + wet + " → 100%", 40, 236, { s: 12, w: "700", c: v("--mist") });
      return Math.abs(read(raw(50)) - 50) <= 3 && Math.abs(read(raw(30)) - 30) <= 3;
    }
    function update() {
      var ok = draw();
      put("b-cal-info", "시험 흙 ① 은 " + read(raw(50)).toFixed(1) + "%, 시험 흙 ② 는 " + read(raw(30)).toFixed(1) + "%로 읽힙니다. "
        + (ok ? "✅ 두 시험 흙이 모두 제대로 읽힙니다. 센서의 숫자가 이제 ‘수분 %’라는 뜻을 갖게 되었습니다." : "마른 흙과 젖은 흙에 꽂았을 때 실제로 나온 센서 값을 입력해 보세요."));
      if (ok && !got.a) { got.a = true; got.dry = dry; got.wet = wet; window.sthState("calGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m2-2a"); if (got.q) done("m2-2b");
      if (got.a && got.q) {
        window.sthState("calBest", "마른 흙 " + (got.dry || 820) + " → 0%, 젖은 흙 " + (got.wet || 380) + " → 100%로 보정");
        window.sthMission("m2-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("calBest") + ". 센서의 숫자를 우리가 아는 단위로 바꾸는 것이 보정입니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("b-dry").addEventListener("input", function (ev) { dry = +ev.target.value; $("b-dry-val").textContent = dry; update(); });
    $("b-wet").addEventListener("input", function (ev) { wet = +ev.target.value; $("b-wet-val").textContent = wet; update(); });
    window.sthPick({
      mount: "b-cal-pick",
      q: "센서를 쓰기 전에 보정해야 하는 가장 큰 까닭은?",
      options: ["센서가 새것이라 한 번 켜 줘야 해서", "센서가 내는 숫자는 센서와 흙마다 달라, 알려진 기준(마른 흙·젖은 흙)과 맞춰야 뜻 있는 값이 되기 때문에", "보정하면 센서가 더 오래가서"],
      answer: 1,
      why: ["켜 두는 것과 보정은 다릅니다.", "같은 수분이라도 센서의 종류, 흙의 성분에 따라 숫자가 다릅니다. 기준점 두 개로 숫자와 실제 값을 이어 주는 것이 보정입니다.", "수명과는 관계가 없습니다."],
      onDone: function () { got.q = true; window.sthState("calGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 3 — 두 기준 (이력 제어) */
  (function () {
    var canvas = $("b-c-hys"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, on = 30, off = 30;
    var got = window.sthState("hysGot") || { a: false, q: false };
    function sim() {
      var M = 50, pump = false, starts = 0, mn = 100, mx = 0, ms = [], ps = [];
      for (var s = 0; s < 144; s++) {
        var hr = s / 6, r = (hr >= 6 && hr < 18) ? 0.55 : 0.2;
        M -= r; if (pump) M += 2;
        var rd = M + 2.4 * Math.sin(s * 2.1) + 1.2 * Math.sin(s * 5.3);
        if (!pump && rd < on) { pump = true; starts++; } else if (pump && rd >= off) pump = false;
        mn = Math.min(mn, M); mx = Math.max(mx, M); ms.push(M); ps.push(pump);
      }
      return { starts: starts, mn: mn, mx: mx, ms: ms, ps: ps };
    }
    function draw() {
      paper(ctx, W, H);
      var r = sim(), x0 = 60, x1 = 600, y0 = 20, y1 = 220;
      function X(s) { return x0 + s / 143 * (x1 - x0); }
      function Y(m) { return y1 - (m - 10) / 70 * (y1 - y0); }
      ctx.fillStyle = A(v("--green-700"), 0.08); ctx.fillRect(x0, Y(70), x1 - x0, Y(25) - Y(70));
      axes(ctx, x0, y0, x1, y1);
      [20, 40, 60, 80].forEach(function (m) { text(ctx, m + "%", x0 - 6, Y(m) + 4, { s: 10, a: "right", c: v("--mist") }); });
      [0, 6, 12, 18, 24].forEach(function (h) { text(ctx, h + "시", X(h * 6 - (h === 24 ? 1 : 0)), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      for (var s = 0; s < 144; s++) if (r.ps[s]) { ctx.fillStyle = A(v("--brand"), 0.25); ctx.fillRect(X(s), y1 + 22, (x1 - x0) / 143 + 0.5, 10); }
      text(ctx, "펌프 켜짐", x1 + 6, y1 + 31, { s: 10, w: "700", c: v("--brand-700") });
      seg(ctx, x0, Y(on), x1, Y(on), v("--coral-700"), 1.5, true);
      seg(ctx, x0, Y(off), x1, Y(off), v("--brand"), 1.5, true);
      ctx.save(); ctx.strokeStyle = v("--ink"); ctx.lineWidth = 2.2; ctx.beginPath();
      r.ms.forEach(function (m, i) { if (i) ctx.lineTo(X(i), Y(m)); else ctx.moveTo(X(i), Y(m)); }); ctx.stroke(); ctx.restore();
      var ok = r.starts <= 4 && r.mn >= 25 && r.mx <= 70 && off > on;
      text(ctx, "하루 펌프 켜짐 " + r.starts + "번", 640, 60, { s: 15, w: "900", c: r.starts <= 4 ? v("--green-700") : v("--rose-700") });
      text(ctx, "흙 수분 " + r.mn.toFixed(0) + " ~ " + r.mx.toFixed(0) + "%", 640, 92, { s: 14, w: "800", c: r.mn >= 25 && r.mx <= 70 ? v("--green-700") : v("--rose-700") });
      text(ctx, "켜기 " + on + "% (빨강) · 끄기 " + off + "% (파랑)", 640, 124, { s: 12, w: "700", c: v("--mist") });
      return ok;
    }
    function update() {
      var ok = draw(), r = sim();
      put("b-hys-info", "켜기 " + on + "%, 끄기 " + off + "%: 하루 동안 펌프가 " + r.starts + "번 켜지고, 흙 수분은 " + r.mn.toFixed(0) + " ~ " + r.mx.toFixed(0) + "% 였습니다. "
        + (ok ? "✅ 펌프가 떨지 않고, 흙도 알맞게 유지됩니다." : (off <= on ? "두 기준이 같거나 거꾸로면 센서 값의 작은 떨림에도 펌프가 계속 켜졌다 꺼집니다." : (r.starts > 4 ? "두 기준 사이가 좁아 아직 자주 켜집니다." : (r.mn < 25 ? "켜는 기준이 너무 낮아 흙이 너무 마릅니다." : "끄는 기준이 너무 높아 흙이 너무 축축해집니다(뿌리가 썩을 위험).")))));
      if (ok && !got.a) { got.a = true; got.on = on; got.off = off; window.sthState("hysGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m2-3a"); if (got.q) done("m2-3b");
      if (got.a && got.q) {
        window.sthState("hysBest", "켜기 " + (got.on || on) + "% · 끄기 " + (got.off || off) + "%처럼 기준 사이를 벌림");
        window.sthMission("m2-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("hysBest") + ". 기준 사이의 간격이 센서 값의 떨림을 흡수합니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    $("b-on").addEventListener("input", function (ev) { on = +ev.target.value; $("b-on-val").textContent = on + "%"; update(); });
    $("b-off").addEventListener("input", function (ev) { off = +ev.target.value; $("b-off-val").textContent = off + "%"; update(); });
    window.sthPick({
      mount: "b-hys-pick",
      q: "켜는 기준과 끄는 기준을 따로 두면 펌프가 떨지 않는 까닭은?",
      options: ["펌프가 더 강해지기 때문에", "센서 값이 기준 근처에서 조금 오르내려도, 두 기준 사이에서는 펌프 상태가 바뀌지 않기 때문에", "센서의 떨림이 완전히 사라지기 때문에"],
      answer: 1,
      why: ["펌프의 힘은 그대로입니다.", "한 번 켜지면 끄는 기준까지 올라갈 때까지, 한 번 꺼지면 켜는 기준까지 내려갈 때까지 기다립니다. 보일러 온도 조절기도 같은 방법을 씁니다.", "센서 값은 여전히 떨립니다. 다만 그 떨림에 반응하지 않을 뿐입니다."],
      onDone: function () { got.q = true; window.sthState("hysGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 4 — 산출물 공유 */
  (function () {
    var STEPS = [
      "산출물 정리하기 — 회로도, 코드, 부품 목록, 실험 기록을 모은다",
      "발표 자료 만들기 — 작동 영상과 그래프로 원리와 결과를 보여 준다",
      "학교 과학 축제에서 발표하기",
      "질문과 피드백 받기 — ‘비가 오면?’, ‘물통이 비면?’ 같은 질문을 기록한다",
      "피드백으로 장치 고치기 — 물통 수위 센서와 경고등을 더한다",
      "누리집에 설계도와 코드를 공개해 다른 학교도 만들 수 있게 한다"
    ];
    function ok() { window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>발표 → 피드백 → 개선 → 공개. 나눌수록 산출물이 나아지고, 더 많은 곳으로 퍼집니다."); ep.clear(3); ep.clear(4); }
    if (ep.cleared(3)) { orderDone("b-order", STEPS); window.sthMission("m2-4", true); }
    else window.sthOrder({ mount: "b-order", steps: STEPS, onDone: ok });
  })();

  function finish() { window.sthState("r2", "완성 · " + (window.sthState("calBest") || "") + " / " + (window.sthState("hysBest") || "")); }
  function vs() {
    $("e2-vs").innerHTML = "<b>나의 첫 설계</b> " + (window.sthState("sens1") || "기록 없음") + "<br><b>센서 보정</b> " + (window.sthState("calBest") || "-") + "<br><b>두 기준</b> " + (window.sthState("hysBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk2", unitLabel: "[과학탐구실험2 Ⅱ-1] 이야기 ② 방학 동안의 화분",
    items: [
      { id: "w1", label: "센서가 재는 것", hint: "고른 센서 하나가 무엇을 어떤 물리량으로 바꾸는지 쓰세요.", ph: "센서: … / 재는 것: … / 바꾸는 신호: …" },
      { id: "w2", label: "내가 만들고 싶은 것", hint: "해결하고 싶은 문제 하나와, 거기에 필요한 센서·동작을 적어 보세요.", ph: "문제: … / 센서: … / 판단 기준: … / 동작: …" }
    ]
  });
})();

/* ========================================================================= 05 정리하기 */
window.sthWork({
  mount: "wk", unitLabel: "[과학탐구실험2 Ⅱ-1] 미래 사회와 첨단 과학 탐구 — 정리",
  recap: [
    { key: "r1", label: "① 고양이를 못 알아보는 인공지능" },
    { key: "r2", label: "② 방학 동안의 화분" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  items: [
    { id: "all", label: "두 탐구를 꿰는 한 문장", hint: "인공지능과 자동 급수 장치, 두 이야기를 ‘데이터’와 ‘과학 원리’라는 말을 넣어 한 문장으로 이어 보세요." },
    { id: "w3", label: "아직 헷갈리는 것", hint: "다음 시간에 여기서부터 시작합니다." }
  ]
});

/* ========================================================================= 06 우리 반 */
window.sthShare({
  mount: "share", unit: "gt2-2-2", unitLabel: "[과학탐구실험2 Ⅱ-1] 미래 사회와 첨단 과학 탐구",
  rows: [
    { key: "r1", label: "① 고양이를 못 알아보는 인공지능" },
    { key: "r2", label: "② 방학 동안의 화분" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "두 탐구를 꿰는 한 문장" }
});

})();
