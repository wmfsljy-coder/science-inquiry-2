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

/* ---- 무대 그림 도구 (../assets/kit.js) ---- */
var K = window.sthKit, KC = K.C, REDUCE = K.REDUCE;
function playBtn(id, get, set, onL, offL) {
  var b = $(id); if (!b) return;
  function lab() { b.textContent = get() ? onL : offL; }
  b.addEventListener("click", function () { set(!get()); lab(); }); lab();
}
function hline(ctx, x0, x1, y, col, dash) { K.line(ctx, { x: x0, y: y }, { x: x1, y: y }, col, 1.2, dash || [5, 5]); }
function vline(ctx, x, y0, y1, col, dash) { K.line(ctx, { x: x, y: y0 }, { x: x, y: y1 }, col, 1.2, dash || [4, 4]); }
function readout(id, rows, ok) {
  var h = rows.map(function (r) { return "<span class='k'>" + r[0] + "</span><span class='v " + (r[2] || "") + "'>" + r[1] + "</span>" + (r[3] ? "<span class='sub'>" + r[3] + "</span>" : ""); }).join("");
  if (ok) h += "<span class='ok " + ok[0] + "'>" + ok[1] + "</span>";
  put(id, h);
}
/* 고양이 얼굴 아이콘 (흰·검은) */
function catFace(ctx, x, y, r, white, alpha) {
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  var g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r * 1.1);
  if (white) { g.addColorStop(0, "#ffffff"); g.addColorStop(1, "#b7ae9e"); } else { g.addColorStop(0, "#5a5e6e"); g.addColorStop(1, "#101218"); }
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(x - r * 0.95, y - r * 0.15); ctx.lineTo(x - r * 0.8, y - r * 1.15); ctx.lineTo(x - r * 0.2, y - r * 0.8);
  ctx.lineTo(x + r * 0.2, y - r * 0.8); ctx.lineTo(x + r * 0.8, y - r * 1.15); ctx.lineTo(x + r * 0.95, y - r * 0.15); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(x, y + r * 0.05, r * 0.95, 0, 6.2832); ctx.fill();
  if (!white) { ctx.strokeStyle = "rgba(200,210,255,.35)"; ctx.lineWidth = 1; ctx.stroke(); }
  ctx.fillStyle = white ? "#3b3f52" : "#d7e86a";
  ctx.beginPath(); ctx.ellipse(x - r * 0.36, y - r * 0.05, r * 0.14, r * 0.2, 0, 0, 6.2832); ctx.ellipse(x + r * 0.36, y - r * 0.05, r * 0.14, r * 0.2, 0, 0, 6.2832); ctx.fill();
  ctx.fillStyle = "#e58aa0"; ctx.beginPath(); ctx.moveTo(x - r * 0.12, y + r * 0.25); ctx.lineTo(x + r * 0.12, y + r * 0.25); ctx.lineTo(x, y + r * 0.38); ctx.closePath(); ctx.fill();
  ctx.restore();
}

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
      ctx.clearRect(0, 0, W, H);
      var a = acc(L), ok = a >= 0.9 && acc(L - 0.1) < 0.9, LW = 330, i, j;
      var ac = a >= 0.9 ? KC.green : KC.yellow;
      /* ── 왼쪽: 사진 더미 → 인공지능 ── */
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 5, title: "학습 사진 → 인공지능" });
      var nC = Math.round(2 + L * 2.2);
      for (i = nC - 1; i >= 0; i--) {
        var px = 26 + i * 3.2, py = 190 - i * 9, rot = (i % 3 - 1) * 0.05;
        ctx.save(); ctx.translate(px + 40, py + 30); ctx.rotate(rot);
        var cg = ctx.createLinearGradient(-40, -30, 40, 30); cg.addColorStop(0, "#e9edf8"); cg.addColorStop(1, "#9aa3bd");
        ctx.fillStyle = cg; ctx.fillRect(-40, -30, 80, 60);
        var ph = ctx.createLinearGradient(-34, -24, 34, 18); ph.addColorStop(0, i % 2 ? "#2a4d7a" : "#5b3d6e"); ph.addColorStop(1, "#16203f");
        ctx.fillStyle = ph; ctx.fillRect(-34, -24, 68, 42);
        ctx.restore();
        if (i === 0) catFace(ctx, px + 40, py + 28, 12, true);
      }
      K.pill(ctx, "학습 사진 " + fmtN(Math.pow(10, L)) + "장", 66, H - 16, { a: "center", s: 12, c: KC.blue, box: [0, LW] });
      /* 신경망 모양 */
      var Lx = [178, 230, 284], Ly = [[96, 142, 188, 234], [80, 126, 172, 218, 264], [140, 204]], nodes = [];
      for (i = 0; i < 3; i++) { nodes.push(Ly[i].map(function (yy) { return { x: Lx[i], y: yy }; })); }
      K.arrow(ctx, { x: 150, y: 168 }, { x: 168, y: 168 }, KC.mute, 2, 8);
      for (i = 0; i < 2; i++) for (j = 0; j < nodes[i].length; j++) for (var k = 0; k < nodes[i + 1].length; k++) {
        var w8 = 0.15 + 0.6 * ((j * 7 + k * 3 + i) % 5) / 4 * (a - 0.4) / 0.6;
        K.line(ctx, nodes[i][j], nodes[i + 1][k], "rgba(127,211,255," + w8.toFixed(2) + ")", 1.2);
      }
      for (i = 0; i < 2; i++) nodes[i].forEach(function (n) { K.planet(ctx, n.x, n.y, 7, "#7fd3ff", "#173a6a"); });
      K.glow(ctx, nodes[2][0].x, nodes[2][0].y, 4 + 4 * (a - 0.4) / 0.6, "rgba(63,211,163,.95)", 3.4);
      K.glow(ctx, nodes[2][1].x, nodes[2][1].y, 4 + 4 * (1 - a) / 0.6, "rgba(255,107,129,.9)", 3.4);
      K.pill(ctx, "고양이 " + Math.round(a * 100) + "%", nodes[2][0].x + 2, nodes[2][0].y - 18, { a: "center", s: 11, c: KC.green, box: [0, LW] });
      K.pill(ctx, "아님", nodes[2][1].x + 2, nodes[2][1].y + 30, { a: "center", s: 11, c: KC.red, box: [0, LW] });
      K.pill(ctx, "인공지능(신경망)", 230, H - 16, { a: "center", s: 11, c: KC.mute, box: [140, LW] });

      /* ── 오른쪽: 사진 수와 정답률 ── */
      var RX = LW + 8, LB = ["10", "100", "1천", "1만", "10만", "100만"];
      K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 12, title: "처음 보는 사진의 정답률" });
      var g = K.chart(ctx, { x: RX + 4, y: 40, w: W - RX - 12, h: H - 46, x0: 1, x1: 6, y0: 0.4, y1: 1, xt: 5, yt: 6, xl: "학습 사진 수 (눈금마다 10배)",
        xf: function (q) { return LB[Math.round(q) - 1]; }, yf: function (q) { return Math.round(q * 100) + "%"; } });
      hline(ctx, g.L, g.R, g.Y(0.9), A(KC.yellow, 0.85));
      K.pill(ctx, "목표 90%", g.R - 8, g.Y(0.9) + 20, { a: "right", s: 10.5, c: KC.yellow });
      var pts = []; for (var l = 1; l <= 6.001; l += 0.05) pts.push([l, acc(l)]);
      K.plot(ctx, g, pts, KC.blue);
      if (L <= 5) {
        var a2 = acc(L + 1), xA = g.X(L), xB = g.X(L + 1);
        ctx.strokeStyle = A(KC.violet, 0.9); ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(xA, g.Y(a)); ctx.lineTo(xB, g.Y(a)); ctx.lineTo(xB, g.Y(a2)); ctx.stroke(); ctx.setLineDash([]);
        K.pill(ctx, "10배 → +" + ((a2 - a) * 100).toFixed(1) + "%p", xB + 8, (g.Y(a) + g.Y(a2)) / 2 + 22, { s: 11, c: KC.violet, box: [RX, W] });
      }
      var cx = g.X(L), cy = g.Y(a);
      vline(ctx, cx, cy, g.B, A(KC.yellow, 0.5));
      K.glow(ctx, cx, cy, 5, a >= 0.9 ? "rgba(63,211,163,.95)" : "rgba(255,211,107,.95)", 4);
      K.pill(ctx, (a * 100).toFixed(1) + "%", cx - 10, cy - 12, { a: "right", s: 12, c: ac, box: [RX, W] });
      return ok;
    }
    function update() {
      var ok = draw(), a = acc(L);
      readout("a-data-read", [
        ["학습 사진", fmtN(Math.pow(10, L)) + "장", "b", "10의 " + L.toFixed(1) + "제곱"],
        ["정답률", (a * 100).toFixed(1) + "%", a >= 0.9 ? "g" : "y", L < 6 ? "사진을 10배 늘리면 +" + ((acc(Math.min(6, L + 1)) - a) * 100).toFixed(1) + "%p" : ""]
      ], ok ? ["g", "90%에 이르는 가장 적은 수"] : (a >= 0.9 ? ["g", "90% 넘음 · 더 적어도 됩니다"] : ["r", "아직 90%에 못 미칩니다"]));
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
      ctx.clearRect(0, 0, W, H);
      var q = p / 100, w = aw(q), b = aw(1 - q), ok = w >= 0.85 && b >= 0.85, LW = 486, i;
      /* ── 왼쪽: 학습 사진 100장의 구성 ── */
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 14, title: "학습 사진의 구성 (한 마리 = 1%)" });
      for (i = 0; i < 100; i++) {
        var cx = 34 + (i % 20) * 22.4, cy = 70 + Math.floor(i / 20) * 30;
        catFace(ctx, cx, cy, 8.6, i < p);
      }
      var by = 232, bw = LW - 56;
      ctx.fillStyle = "#e9e4d8"; ctx.beginPath(); ctx.roundRect(28, by, bw * q, 16, [8, 0, 0, 8]); ctx.fill();
      ctx.fillStyle = "#1a1c24"; ctx.beginPath(); ctx.roundRect(28 + bw * q, by, bw * (1 - q), 16, [0, 8, 8, 0]); ctx.fill();
      ctx.strokeStyle = "rgba(200,210,255,.45)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.roundRect(28, by, bw, 16, 8); ctx.stroke();
      K.pill(ctx, "흰 고양이 " + p + "%", 28, by + 44, { s: 12, c: "#f4efe4" });
      K.pill(ctx, "검은 고양이 " + (100 - p) + "%", LW - 28, by + 44, { a: "right", s: 12, c: KC.mute });

      /* ── 오른쪽: 처음 보는 사진을 알아본 비율 ── */
      var RX = LW + 8, RW = W - RX;
      K.stage(ctx, RX, 0, RW, H, "lab", { seed: 3, title: "처음 보는 사진을 알아본 비율" });
      var gx = RX + 70, gw = RW - 100;
      function BX(x) { return gx + gw * (x - 0.5) / 0.5; }
      [[w, true, "흰 고양이"], [b, false, "검은 고양이"]].forEach(function (r, k) {
        var y = 96 + k * 82, good = r[0] >= 0.85, col = good ? KC.green : KC.red;
        catFace(ctx, RX + 38, y + 8, 20, r[1]);
        K.t(ctx, r[2], gx, y - 12, { s: 12, c: KC.mute });
        ctx.fillStyle = "rgba(255,255,255,.07)"; ctx.beginPath(); ctx.roundRect(gx, y, gw, 22, 11); ctx.fill();
        var fg = ctx.createLinearGradient(gx, 0, BX(r[0]), 0); fg.addColorStop(0, A(col, 0.35)); fg.addColorStop(1, col);
        ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 10; ctx.fillStyle = fg; ctx.beginPath(); ctx.roundRect(gx, y, Math.max(12, BX(r[0]) - gx), 22, 11); ctx.fill(); ctx.restore();
        K.pill(ctx, (r[0] * 100).toFixed(1) + "%", gx + gw, y - 10, { a: "right", s: 12.5, c: col, box: [RX, W] });
      });
      vline(ctx, BX(0.85), 76, 214, A(KC.yellow, 0.9));
      K.pill(ctx, "기준 85%", BX(0.85), 236, { a: "center", s: 11, c: KC.yellow, box: [RX, W] });
      K.t(ctx, "50%", gx, 236, { s: 10, c: KC.dim }); K.t(ctx, "100%", gx + gw, 236, { s: 10, a: "right", c: KC.dim });
      K.pill(ctx, ok ? "털색과 상관없이 알아봅니다" : "적게 본 쪽을 잘 못 알아봅니다", RX + RW / 2, H - 16, { a: "center", s: 12.5, c: ok ? KC.green : KC.red, box: [RX, W] });
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
      { id: "e1b", label: "내가 고른 첨단 기술", hint: "관심 있는 첨단 기술 하나를 골라, 그 속의 과학 원리와 쓰임, 한계를 한 문단으로 쓰세요." },
      { id: "e1c", label: "알게 된 것 나누기", hint: "보호소나 친구들에게 이번에 알아낸 것(데이터 편향과 고르게 모으는 방법)을 알리는 짧은 안내문이나 게시글을 써 보세요. 그래프 하나를 넣을지, 어디에 올릴지도 함께 적으세요." }
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
    function mix(a, b, q) { return "rgb(" + [0, 1, 2].map(function (k) { return Math.round(a[k] + (b[k] - a[k]) * q); }).join(",") + ")"; }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var LW = 548, i;
      var cols = [["마른 흙", 0], ["젖은 흙", 100], ["시험 흙 ①", 50], ["시험 흙 ②", 30]];
      /* ── 왼쪽: 네 화분과 센서 ── */
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 22, title: "흙에 꽂은 수분 센서" });
      cols.forEach(function (c, i) {
        var cx = 79 + i * 130, r = raw(c[1]), q = c[1] / 100, test = i >= 2, rd = read(r), good = Math.abs(rd - c[1]) <= 3;
        /* 화면(LCD) */
        ctx.fillStyle = "#1b2033"; ctx.beginPath(); ctx.roundRect(cx - 56, 44, 112, 58, 8); ctx.fill();
        var lg = ctx.createLinearGradient(0, 49, 0, 97); lg.addColorStop(0, "#1e4a35"); lg.addColorStop(1, "#0d2619");
        ctx.fillStyle = lg; ctx.beginPath(); ctx.roundRect(cx - 50, 49, 100, 48, 5); ctx.fill();
        K.t(ctx, "센서 값 " + Math.round(r), cx, 68, { s: 13, w: "900", a: "center", c: "#8dffc8" });
        if (test) K.t(ctx, "읽은 수분 " + rd.toFixed(1) + "%", cx, 88, { s: 11, w: "800", a: "center", c: good ? KC.green : KC.red });
        else K.t(ctx, "기준점 " + c[1] + "%", cx, 88, { s: 11, w: "700", a: "center", c: "#5fae88" });
        ctx.strokeStyle = "#2b2f44"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, 102); ctx.bezierCurveTo(cx + 18, 112, cx - 10, 116, cx, 124); ctx.stroke();
        /* 화분 */
        var pg = ctx.createLinearGradient(cx - 56, 0, cx + 56, 0); pg.addColorStop(0, "#7a3418"); pg.addColorStop(0.4, "#c8693d"); pg.addColorStop(1, "#6a2c13");
        ctx.fillStyle = pg; ctx.beginPath(); ctx.moveTo(cx - 56, 162); ctx.lineTo(cx + 56, 162); ctx.lineTo(cx + 42, 262); ctx.lineTo(cx - 42, 262); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#b5582e"; ctx.fillRect(cx - 60, 154, 120, 12);
        ctx.fillStyle = mix([196, 154, 94], [52, 32, 18], q); ctx.beginPath(); ctx.ellipse(cx, 160, 54, 7, 0, 0, 6.2832); ctx.fill();
        var Rs = K.rng(7 + i);
        for (var k = 0; k < 26; k++) { ctx.fillStyle = q > 0.5 ? "rgba(0,0,0,.35)" : "rgba(255,230,190,.35)"; ctx.beginPath(); ctx.arc(cx - 46 + Rs() * 92, 157 + Rs() * 7, 1.2, 0, 6.2832); ctx.fill(); }
        if (q >= 0.5) for (k = 0; k < Math.round(q * 6); k++) { var gx = cx - 40 + Rs() * 80; K.glow(ctx, gx, 158 + Rs() * 4, 1.4, "rgba(170,220,255,.9)", 2.6); }
        /* 센서 탐침(두 갈래) */
        ctx.fillStyle = "#11151f"; ctx.beginPath(); ctx.roundRect(cx - 13, 124, 26, 22, 4); ctx.fill();
        K.glow(ctx, cx + 7, 131, 1.6, "rgba(255,107,129,.95)", 2.4);
        [cx - 8, cx + 2].forEach(function (px) {
          var tg = ctx.createLinearGradient(px, 0, px + 6, 0); tg.addColorStop(0, "#1d6b46"); tg.addColorStop(0.5, "#3fae78"); tg.addColorStop(1, "#145a37");
          ctx.fillStyle = tg; ctx.fillRect(px, 146, 6, 12);
          ctx.globalAlpha = 0.35; ctx.fillRect(px, 158, 6, 70); ctx.globalAlpha = 1;
        });
        K.pill(ctx, c[0], cx, 288, { a: "center", s: 12, c: test ? KC.blue : KC.ink });
        K.t(ctx, "실제 수분 " + c[1] + "%", cx, 310, { s: 10.5, a: "center", c: KC.mute });
      });

      /* ── 오른쪽: 보정선 ── */
      var RX = LW + 8;
      K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 4, title: "보정선: 센서 값 → 수분 %" });
      var g = K.chart(ctx, { x: RX + 4, y: 44, w: W - RX - 12, h: H - 50, pl: 46, x0: 150, x1: 1050, y0: -20, y1: 120, xt: 6, yt: 7, xl: "센서 값", yf: function (q) { return Math.round(q) + "%"; } });
      ctx.save(); ctx.beginPath(); ctx.rect(g.L, g.T, g.R - g.L, g.B - g.T); ctx.clip();
      var lp = [[150, (dry - 150) / (dry - wet) * 100], [1050, (dry - 1050) / (dry - wet) * 100]];
      K.plot(ctx, g, lp, KC.yellow, { w: 2.6 });
      [[dry, 0], [wet, 100]].forEach(function (pq) { ctx.fillStyle = KC.yellow; ctx.fillRect(g.X(pq[0]) - 5, g.Y(pq[1]) - 5, 10, 10); });
      cols.forEach(function (c, i) {
        var r = raw(c[1]), rd = read(r), good = Math.abs(rd - c[1]) <= 3, X = g.X(r);
        if (i >= 2 && !good) { K.line(ctx, { x: X, y: g.Y(c[1]) }, { x: X, y: g.Y(rd) }, KC.red, 2, [3, 3]); }
        K.glow(ctx, X, g.Y(c[1]), 4, i >= 2 ? "rgba(127,211,255,.95)" : "rgba(232,236,255,.95)", 3.2);
      });
      ctx.restore();
      K.pill(ctx, "● 실제 수분", g.R - 8, g.T + 18, { a: "right", s: 10.5, c: KC.blue });
      K.pill(ctx, "■ 내가 입력한 두 점", g.R - 8, g.T + 42, { a: "right", s: 10.5, c: KC.yellow });
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
    var cs = 60, playing = !REDUCE;
    /* 위: 교실 창가의 자동 급수 장치를 블록으로 잘라 본 모형 · 아래: 하루 기록 */
    var TOP = 432;
    var I = K.iso({ ox: 330, oy: 95, s: 0.85, L: 520, D: 210 });
    var PX0 = 40, PX1 = 280, PY0 = 50, PY1 = 200, PZ0 = 20, PZ1 = 112, SZ = 98;   /* 화분 */
    var TX0 = 440, TX1 = 515, TY0 = 20, TY1 = 105;                               /* 물통 */
    function hx(c) { var h = Math.max(0, Math.min(255, Math.round(c))).toString(16); return h.length < 2 ? "0" + h : h; }
    function soilCol(M, f) {
      var q = Math.max(0, Math.min(1, (M - 10) / 70));
      return K.tint("#" + hx(196 - 144 * q) + hx(154 - 122 * q) + hx(94 - 76 * q), f || 1);
    }
    function quad(a, b, c, d, fill, stroke) { I.quad(ctx, a, b, c, d, fill, stroke); }
    function drawModel(r, si, M, pump, hr, day) {
      var i, P = I.P;
      K.studio(ctx, 0, 0, W, TOP - 8, { x: P(I.L / 2, I.D / 2, 0).x, y: P(I.L, I.D, 0).y - 40, rx: 360, ry: 50 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, W, TOP - 8, 14); ctx.clip();
      if (!day) { ctx.fillStyle = "rgba(16,24,64,.30)"; ctx.fillRect(0, 0, W, TOP - 8); }
      /* 책상 */
      I.box(ctx, 0, 0, 0, I.L, I.D, 20, "#d9b98a", "#b98f5d", "#9a7246");
      /* 물통(유리) — 펌프가 쓴 만큼 물이 줄어든다 */
      var used = 0, all = 0; for (i = 0; i < 144; i++) { if (r.ps[i]) { all++; if (i <= si) used++; } }
      var lvl = 20 + 100 * (0.95 - 0.55 * (all ? used / all : 0));
      I.box(ctx, TX0, TY0, 20, TX1, TY1, lvl, "rgba(120,190,245,.95)", "rgba(40,110,200,.92)", "rgba(30,85,170,.92)");
      quad(P(TX0, TY1, 20), P(TX1, TY1, 20), P(TX1, TY1, 128), P(TX0, TY1, 128), "rgba(210,232,255,.16)", "rgba(255,255,255,.75)");
      quad(P(TX1, TY0, 20), P(TX1, TY1, 20), P(TX1, TY1, 128), P(TX1, TY0, 128), "rgba(190,215,250,.14)", "rgba(255,255,255,.65)");
      quad(P(TX0, TY0, 128), P(TX1, TY0, 128), P(TX1, TY1, 128), P(TX0, TY1, 128), "rgba(230,242,255,.12)", "rgba(255,255,255,.7)");
      /* 마이크로컨트롤러 */
      I.box(ctx, 320, 30, 20, 380, 80, 25, "#1f8a5a", "#156b44", "#0f5233");
      I.box(ctx, 342, 45, 25, 362, 62, 29, "#23262e", "#16181d", "#0e0f12");
      var led = P(372, 72, 26); K.glow(ctx, led.x, led.y, 1.8, "rgba(255,90,90,.95)", 3);
      /* 펌프 */
      I.box(ctx, 400, 125, 20, 445, 172, 52, "#3a4160", "#2b3150", "#1e2338");
      var pl = P(438, 172, 44); K.glow(ctx, pl.x, pl.y, 2.6, pump ? "rgba(63,211,163,.98)" : "rgba(255,107,129,.8)", pump ? 4 : 2.5);
      /* 전선 */
      ctx.lineWidth = 1.6;
      var w1 = P(372, 80, 24), w2 = P(410, 128, 46), w3 = P(322, 60, 24), w4 = P(232, 194, 128);
      ctx.strokeStyle = "#e05a4a"; ctx.beginPath(); ctx.moveTo(w1.x, w1.y); ctx.quadraticCurveTo((w1.x + w2.x) / 2, w2.y - 30, w2.x, w2.y); ctx.stroke();
      ctx.strokeStyle = "#2f6fd0"; ctx.beginPath(); ctx.moveTo(w3.x, w3.y); ctx.bezierCurveTo(w3.x - 40, w3.y - 70, w4.x + 40, w4.y - 90, w4.x, w4.y); ctx.stroke();
      /* 화분: 오른쪽 면, 흙 윗면, 테두리, 앞면(잘라 낸 단면) */
      quad(P(PX1, PY0, PZ0), P(PX1, PY1, PZ0), P(PX1, PY1, PZ1), P(PX1, PY0, PZ1), "#9c4a24");
      quad(P(PX0 + 8, PY0 + 8, SZ), P(PX1 - 8, PY0 + 8, SZ), P(PX1 - 8, PY1 - 8, SZ), P(PX0 + 8, PY1 - 8, SZ), soilCol(M, 1.05));
      quad(P(PX0, PY0, PZ1), P(PX1, PY0, PZ1), P(PX1 - 8, PY0 + 8, PZ1), P(PX0 + 8, PY0 + 8, PZ1), "#c8693d");
      quad(P(PX0, PY0, PZ1), P(PX0 + 8, PY0 + 8, PZ1), P(PX0 + 8, PY1, PZ1), P(PX0, PY1, PZ1), "#b85f34");
      quad(P(PX1 - 8, PY0 + 8, PZ1), P(PX1, PY0, PZ1), P(PX1, PY1, PZ1), P(PX1 - 8, PY1, PZ1), "#b85f34");
      quad(P(PX0, PY1, PZ0), P(PX1, PY1, PZ0), P(PX1, PY1, PZ1), P(PX0, PY1, PZ1), "#c8693d");
      var c0 = P(PX0 + 8, PY1, PZ0 + 6), c1 = P(PX1 - 8, PY1, PZ0 + 6), c2 = P(PX1 - 8, PY1, SZ), c3 = P(PX0 + 8, PY1, SZ);
      ctx.save(); ctx.beginPath(); ctx.moveTo(c0.x, c0.y); ctx.lineTo(c1.x, c1.y); ctx.lineTo(c2.x, c2.y); ctx.lineTo(c3.x, c3.y); ctx.closePath(); ctx.clip();
      var sg = ctx.createLinearGradient(0, (c2.y + c3.y) / 2, 0, (c0.y + c1.y) / 2); sg.addColorStop(0, soilCol(M, 0.95)); sg.addColorStop(1, soilCol(Math.min(80, M + 12), 0.75));
      var yT = Math.min(c2.y, c3.y), yB = Math.max(c0.y, c1.y);
      ctx.fillStyle = sg; ctx.fillRect(c3.x - 5, yT - 5, c1.x - c3.x + 10, yB - yT + 10);
      var Rg = K.rng(11);
      for (i = 0; i < 140; i++) { var gp = P(PX0 + 10 + Rg() * (PX1 - PX0 - 20), PY1, PZ0 + 8 + Rg() * (SZ - PZ0 - 10)); ctx.fillStyle = Rg() > .5 ? "rgba(255,240,210,.22)" : "rgba(30,18,8,.35)"; ctx.fillRect(gp.x, gp.y, 1.8, 1.8); }
      /* 뿌리 */
      ctx.strokeStyle = "rgba(240,225,190,.75)"; ctx.lineWidth = 1.3;
      var rt = P(150, PY1, SZ);
      [[-40, 50], [-15, 62], [10, 66], [35, 52], [55, 38]].forEach(function (q) { var e = P(150 + q[0], PY1, SZ - q[1]); ctx.beginPath(); ctx.moveTo(rt.x, rt.y); ctx.quadraticCurveTo(rt.x + q[0] * 0.2, (rt.y + e.y) / 2, e.x, e.y); ctx.stroke(); });
      /* 흙 속 물기(수분이 많을수록 많이) */
      var nd = Math.round(Math.max(0, M - 15) / 4);
      for (i = 0; i < nd; i++) { var dp = P(PX0 + 14 + Rg() * (PX1 - PX0 - 28), PY1, PZ0 + 10 + Rg() * (SZ - PZ0 - 16)); K.glow(ctx, dp.x, dp.y, 1.3, "rgba(127,211,255,.85)", 2.2); }
      ctx.restore();
      ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(c3.x, c3.y); ctx.lineTo(c2.x, c2.y); ctx.stroke();
      /* 센서 — 갈래가 단면 안 흙에 꽂혀 있다 */
      var s1 = P(224, PY1, SZ + 2), s2 = P(224, PY1, 52), s3 = P(240, PY1, SZ + 2), s4 = P(240, PY1, 52);
      ctx.strokeStyle = "#e3c25a"; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(s1.x, s1.y); ctx.lineTo(s2.x, s2.y); ctx.moveTo(s3.x, s3.y); ctx.lineTo(s4.x, s4.y); ctx.stroke();
      I.box(ctx, 218, 192, SZ, 246, 200, 128, "#2a5fb8", "#1f4a92", "#173a74");
      /* 식물 */
      var B = P(150, 125, SZ), droop = M < 25 ? 0.5 : 0, sc = 1.1;
      ctx.strokeStyle = "#3c8a3a"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(B.x, B.y); ctx.quadraticCurveTo(B.x - 4, B.y - 44 * sc, B.x + 2, B.y - (84 - droop * 30) * sc); ctx.stroke();
      [[-1, 36], [1, 54], [-1, 72], [1, 84]].forEach(function (lf) {
        var lx = B.x + (lf[1] > 64 ? 2 : -2), ly = B.y - (lf[1] - droop * 24) * sc, ang = lf[0] > 0 ? (-0.5 + droop * 1.4) : (Math.PI + 0.5 - droop * 1.4);
        ctx.save(); ctx.translate(lx, ly); ctx.rotate(ang);
        var lgd = ctx.createLinearGradient(0, -8, 30, 8); lgd.addColorStop(0, droop ? "#b8c870" : "#7be07a"); lgd.addColorStop(1, droop ? "#7a7a32" : "#2b7a32");
        ctx.fillStyle = lgd; ctx.beginPath(); ctx.ellipse(20, 0, 22, 8, 0, 0, 6.2832); ctx.fill(); ctx.restore();
      });
      /* 호스와 물 */
      var h0 = P(420, 140, 52), h1 = P(215, 95, 128), hc = P(330, 90, 200);
      ctx.strokeStyle = "rgba(170,195,230,.95)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(h0.x, h0.y); ctx.quadraticCurveTo(hc.x, hc.y, h1.x, h1.y); ctx.stroke();
      if (pump) {
        for (i = 0; i < 6; i++) { var u = ((cs * 0.5 + i / 6) % 1), bx = (1 - u) * (1 - u) * h0.x + 2 * (1 - u) * u * hc.x + u * u * h1.x, byy = (1 - u) * (1 - u) * h0.y + 2 * (1 - u) * u * hc.y + u * u * h1.y; K.glow(ctx, bx, byy, 2, "rgba(127,211,255,.95)", 2.6); }
        var tp = P(215, 95, SZ); for (i = 0; i < 3; i++) { var fy = h1.y + ((cs * 0.9 + i / 3) % 1) * (tp.y - h1.y); K.glow(ctx, h1.x, fy, 1.8, "rgba(127,211,255,.95)", 2.4); }
      }
      I.edges(ctx, 20, 20);
      ctx.restore();
      /* 이름표 */
      var box = [0, W];
      I.label(ctx, TX1, (TY0 + TY1) / 2, lvl - 10, "물통", 46, -24, "#bfe6ff", box);
      I.label(ctx, 445, 150, 40, pump ? "펌프 켜짐" : "펌프 꺼짐", 60, 30, pump ? "#3fd3a3" : "#ffb3c0", box);
      I.label(ctx, 350, 30, 27, "마이크로컨트롤러", 60, -46, "#e8ecff", box);
      I.label(ctx, 232, 196, 128, "토양 수분 센서 " + M.toFixed(0) + "%", 70, 40, M >= 25 && M <= 70 ? "#3fd3a3" : "#ff9aac", box);
      I.label(ctx, 80, PY1, 55, "흙 단면", -50, 40, "#f4e2c4", box);
      /* 큰 글자 */
      var h1t, h2t, hc2 = "#ffd35a";
      if (off <= on) { h1t = "펌프가 딸깍딸깍 떤다"; h2t = "켜고 끄는 기준이 같거나 거꾸로 · 켜짐 " + r.starts + "번"; hc2 = "#ff9aac"; }
      else if (r.starts <= 4 && r.mn >= 25 && r.mx <= 70) { h1t = "떨지 않는 자동 급수"; h2t = "하루 켜짐 " + r.starts + "번 · 수분 " + r.mn.toFixed(0) + "~" + r.mx.toFixed(0) + "%"; hc2 = "#3fd3a3"; }
      else if (r.starts > 4) { h1t = "아직 펌프가 자주 켜진다"; h2t = "하루 켜짐 " + r.starts + "번"; }
      else if (r.mn < 25) { h1t = "흙이 너무 마른다"; h2t = "가장 마를 때 수분 " + r.mn.toFixed(0) + "%"; }
      else { h1t = "흙이 너무 축축하다"; h2t = "가장 젖을 때 수분 " + r.mx.toFixed(0) + "%"; }
      K.bigText(ctx, h1t, 22, 46, 26, "#ffffff");
      K.bigText(ctx, h2t, 22, 76, 15, hc2);
      K.warn(ctx, W - 14, 26, "⚠ 크기는 보기 쉽게 바꿈 · 흙 색은 수분을 과장", "right");
      K.pill(ctx, (day ? "☀ 낮 " : "☾ 밤 ") + (hr < 10 ? "0" : "") + Math.floor(hr) + ":" + (si % 6) + "0", W - 14, 56, { a: "right", s: 12, c: day ? KC.yellow : KC.blue });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var r = sim(), ok = r.starts <= 4 && r.mn >= 25 && r.mx <= 70 && off > on, i;
      var si = Math.min(143, Math.floor(cs)), M = r.ms[si], pump = r.ps[si], hr = si / 6, day = hr >= 6 && hr < 18;
      drawModel(r, si, M, pump, hr, day);
      /* ── 아래: 하루 기록 ── */
      K.stage(ctx, 0, TOP, W, H - TOP, "lab", { seed: 6, title: "하루 동안의 흙 수분과 펌프" });
      var g = K.chart(ctx, { x: 4, y: TOP + 36, w: W - 12, h: H - TOP - 42, x0: 0, x1: 24, y0: 10, y1: 80, xt: 4, yt: 7, xl: "시각 (시)", yf: function (m) { return Math.round(m) + "%"; } });
      ctx.fillStyle = A(KC.green, 0.11); ctx.fillRect(g.L, g.Y(70), g.R - g.L, g.Y(25) - g.Y(70));
      var cw = (g.R - g.L) / 144;
      for (i = 0; i < 144; i++) if (r.ps[i]) { ctx.fillStyle = A(KC.blue, 0.2); ctx.fillRect(g.X(i / 6), g.T, cw + 0.5, g.B - g.T); }
      hline(ctx, g.L, g.R, g.Y(on), KC.orange); hline(ctx, g.L, g.R, g.Y(off), KC.blue);
      var pts = r.ms.map(function (m, i2) { return [i2 / 6, m]; });
      K.plot(ctx, g, pts, KC.ink, { w: 2.2 });
      K.pill(ctx, "켜기 " + on + "%", g.L + 8, g.Y(on) + 18, { s: 10.5, c: KC.orange });
      K.pill(ctx, "끄기 " + off + "%", g.R - 8, g.Y(off) - 6, { a: "right", s: 10.5, c: KC.blue });
      K.pill(ctx, "알맞음 25~70%", g.X(12), g.Y(70) - 6, { a: "center", s: 10.5, c: KC.green });
      var cx = g.X(hr);
      vline(ctx, cx, g.T, g.B, A(KC.yellow, 0.7));
      K.glow(ctx, cx, g.Y(M), 4.5, "rgba(255,211,107,.95)", 4);
      K.t(ctx, "파란 띠 = 펌프가 켜진 때", W - 200, TOP + 24, { s: 10.5, c: KC.blue });
      return ok;
    }
    function update() {
      var ok = draw(), r = sim();
      readout("b-hys-read", [
        ["펌프 켜짐", r.starts + "번", r.starts <= 4 ? "g" : "r", "하루 동안 (4번 이하가 좋음)"],
        ["흙 수분", r.mn.toFixed(0) + " ~ " + r.mx.toFixed(0) + "%", r.mn >= 25 && r.mx <= 70 ? "g" : "r", "알맞은 범위 25~70%"],
        ["기준", "켜기 " + on + "% · 끄기 " + off + "%", "b"]
      ], ok ? ["g", "펌프가 떨지 않고 흙도 알맞음"] : ["r", off <= on ? "두 기준이 같거나 거꾸로입니다" : "아직 조건을 못 맞추었습니다"]);
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
    playBtn("b-hys-play", function () { return playing; }, function (q) { playing = q; }, "⏸ 하루 멈추기", "▶ 하루 돌려 보기");
    K.animate(canvas, function (dt) { if (playing) { cs = (cs + dt / 1000 * 8) % 144; draw(); } });
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
