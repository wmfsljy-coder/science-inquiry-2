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
function floatUp(ctx, n, seed, tt, x0, x1, yB, yT, col, r, drift) {
  var Rn = K.rng(seed);
  for (var i = 0; i < n; i++) {
    var sx = x0 + Rn() * (x1 - x0), sp = 0.5 + Rn() * 0.7, ph = Rn(), u = (ph + tt * sp) % 1;
    var x = sx + Math.sin(u * 5 + i) * 8 * u + (drift || 0) * u, y = yB - u * (yB - yT);
    ctx.globalAlpha = Math.sin(u * Math.PI) * 0.85;
    K.glow(ctx, x, y, r || 2, col, 3);
  }
  ctx.globalAlpha = 1;
}
/* 딸기: o.dark(열풍에 상함) o.frost(얼음 결정) o.wrink(주름) */
function berry(ctx, x, y, r, o) {
  o = o || {};
  ctx.save();
  ctx.beginPath(); ctx.moveTo(x, y + r * 1.15);
  ctx.bezierCurveTo(x - r * 1.15, y + r * 0.45, x - r * 1.05, y - r * 0.9, x, y - r * 0.78);
  ctx.bezierCurveTo(x + r * 1.05, y - r * 0.9, x + r * 1.15, y + r * 0.45, x, y + r * 1.15); ctx.closePath();
  var g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r * 1.3);
  if (o.dark) { g.addColorStop(0, "#c0533a"); g.addColorStop(0.5, "#8a2a1c"); g.addColorStop(1, "#3e0f0a"); }
  else { g.addColorStop(0, "#ff9a8a"); g.addColorStop(0.35, "#f0303a"); g.addColorStop(1, "#8a0c1c"); }
  ctx.fillStyle = g; ctx.fill(); ctx.clip();
  var R = K.rng(3);
  for (var i = 0; i < 30; i++) {
    var sx = x + (R() - 0.5) * r * 1.8, sy = y + (R() - 0.55) * r * 1.9;
    ctx.fillStyle = o.dark ? "rgba(210,170,90,.7)" : "#ffe08a"; ctx.beginPath(); ctx.ellipse(sx, sy, r * 0.035 + 0.8, r * 0.055 + 1, 0, 0, 6.2832); ctx.fill();
  }
  if (o.wrink) { ctx.strokeStyle = "rgba(30,5,0,.55)"; ctx.lineWidth = 2; for (i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(x - r * 0.8, y - r * 0.5 + i * r * 0.3); ctx.quadraticCurveTo(x, y - r * 0.3 + i * r * 0.3 + (i % 2 ? 6 : -6), x + r * 0.8, y - r * 0.55 + i * r * 0.3); ctx.stroke(); } }
  if (o.frost) { for (i = 0; i < 46; i++) { ctx.fillStyle = "rgba(235,245,255," + (0.35 + R() * 0.5).toFixed(2) + ")"; ctx.beginPath(); ctx.arc(x + (R() - 0.5) * r * 2, y + (R() - 0.5) * r * 2, 0.8 + R() * 1.6, 0, 6.2832); ctx.fill(); } }
  ctx.restore();
  ctx.fillStyle = o.dark ? "#4f6a2a" : "#3fae4a";
  for (i = 0; i < 5; i++) { var a = -Math.PI / 2 + (i - 2) * 0.55; ctx.beginPath(); ctx.moveTo(x - 4, y - r * 0.78); ctx.lineTo(x + Math.cos(a) * r * 0.55, y - r * 0.78 + Math.sin(a) * r * 0.3 - 2); ctx.lineTo(x + 4, y - r * 0.78); ctx.closePath(); ctx.fill(); }
}

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
    var tt = 0, playing = !REDUCE;
    var SHORT = { sub: "승화 중 · 얼음 → 수증기", ice: "얼음 그대로", warm: "녹지 않고 승화 · 딸기가 데워짐", boil: "녹아서 끓음", liq: "녹아서 흘러내림" };
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var st = state(), ok = st === "sub" && T <= -10, LW = 330, P = PS[pi], sc = st === "sub" ? KC.green : KC.red, i;
      /* ── 왼쪽: 동결 건조기 ── */
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 9, title: "동결 건조기 속" });
      var mg = ctx.createLinearGradient(20, 0, 250, 0); mg.addColorStop(0, "#5d6782"); mg.addColorStop(0.35, "#c3cbe0"); mg.addColorStop(0.7, "#7b849e"); mg.addColorStop(1, "#3e4560");
      ctx.fillStyle = mg; ctx.beginPath(); ctx.roundRect(20, 52, 232, 250, 22); ctx.fill();
      var gw = ctx.createLinearGradient(40, 76, 232, 278);
      if (T < 0) { gw.addColorStop(0, "#163a66"); gw.addColorStop(1, "#06142c"); } else { gw.addColorStop(0, "#5a2a1a"); gw.addColorStop(1, "#1c0c08"); }
      ctx.fillStyle = gw; ctx.beginPath(); ctx.roundRect(40, 76, 192, 202, 14); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(60, 270); ctx.lineTo(120, 84); ctx.stroke();
      var shelf = ctx.createLinearGradient(0, 226, 0, 234); shelf.addColorStop(0, "#dfe5f2"); shelf.addColorStop(1, "#6c7590");
      ctx.fillStyle = shelf; ctx.fillRect(52, 226, 168, 8);
      var melt = st === "liq" || st === "boil";
      berry(ctx, 136, 188, 30, { frost: T < 0, dark: false });
      if (melt) { for (i = 0; i < 4; i++) { var du = (tt * 0.6 + i * 0.25) % 1; ctx.globalAlpha = 1 - du; ctx.fillStyle = "rgba(255,120,130,.85)"; ctx.beginPath(); ctx.ellipse(118 + i * 12, 226 + du * 40, 2.6, 3.6, 0, 0, 6.2832); ctx.fill(); } ctx.globalAlpha = 1; }
      if (st === "sub" || st === "warm") floatUp(ctx, st === "warm" ? 26 : 18, 5, tt * 0.3, 112, 160, 166, 86, "rgba(190,225,255,.85)", 2.2, 0);
      if (st === "boil") floatUp(ctx, 22, 8, tt * 0.5, 100, 172, 222, 86, "rgba(255,220,200,.8)", 2.6, 0);
      K.pill(ctx, SHORT[st], 136, 104, { a: "center", s: 11, c: sc, box: [40, 232] });
      /* 진공 펌프와 압력계 */
      ctx.strokeStyle = "#8d97b8"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(252, 250); ctx.lineTo(284, 250); ctx.lineTo(284, 272); ctx.stroke();
      ctx.fillStyle = "#2b3150"; ctx.beginPath(); ctx.roundRect(262, 272, 48, 30, 6); ctx.fill();
      K.glow(ctx, 300, 280, 2.2, P < 101325 ? "rgba(63,211,163,.95)" : "rgba(120,130,160,.6)", 3);
      if (P < 101325) K.arrow(ctx, { x: 262, y: 238 }, { x: 300, y: 238 }, KC.blue, 1.8, 7);
      K.pill(ctx, "진공 펌프", 286, 324, { a: "center", s: 10.5, c: KC.mute, box: [0, LW] });
      var gx = 286, gy = 112, gr = 30, a0 = Math.PI * 0.75, a1 = Math.PI * 2.25, q = (log10(P) - 1) / 4.006;
      var dg = ctx.createRadialGradient(gx - 8, gy - 10, 3, gx, gy, gr + 4); dg.addColorStop(0, "#2c3566"); dg.addColorStop(1, "#0d1130");
      ctx.fillStyle = dg; ctx.beginPath(); ctx.arc(gx, gy, gr + 4, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "#8d97c4"; ctx.lineWidth = 2; ctx.stroke();
      for (i = 0; i <= 4; i++) { var aa = a0 + (a1 - a0) * i / 4; ctx.strokeStyle = "rgba(230,236,255,.7)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(gx + Math.cos(aa) * (gr - 8), gy + Math.sin(aa) * (gr - 8)); ctx.lineTo(gx + Math.cos(aa) * (gr - 2), gy + Math.sin(aa) * (gr - 2)); ctx.stroke(); }
      var an = a0 + (a1 - a0) * q;
      ctx.strokeStyle = KC.yellow; ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + Math.cos(an) * (gr - 6), gy + Math.sin(an) * (gr - 6)); ctx.stroke(); ctx.lineCap = "butt";
      K.pill(ctx, "압력계", gx, gy + gr + 26, { a: "center", s: 10.5, c: KC.mute, box: [0, LW] });
      K.pill(ctx, T + " °C", 136, 296, { a: "center", s: 12, c: T < 0 ? KC.blue : KC.orange });

      /* ── 오른쪽: 물의 상평형 그림 ── */
      var RX = LW + 8, PL = ["1", "10", "100", "1k", "10k", "100k", "1M"];
      K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 11, title: "물의 상태 지도 (상평형 그림)" });
      var g = K.chart(ctx, { x: RX + 4, y: 40, w: W - RX - 12, h: H - 46, x0: -40, x1: 60, y0: 0, y1: 6, xt: 5, yt: 6, xl: "온도 (°C)", yl: "압력 (Pa, 눈금마다 10배)",
        xf: function (t) { return Math.round(t) + ""; }, yf: function (p) { return PL[Math.round(p)]; } });
      function Y(p) { return g.Y(log10(p)); }
      var t;
      ctx.fillStyle = "rgba(127,211,255,.13)"; ctx.beginPath(); ctx.moveTo(g.X(-40), g.T);
      for (t = -40; t <= 0; t += 2) ctx.lineTo(g.X(t), Y(pIce(t))); ctx.lineTo(g.X(0), g.T); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(63,211,163,.12)"; ctx.beginPath(); ctx.moveTo(g.X(0), g.T); ctx.lineTo(g.X(0), Y(611));
      for (t = 0; t <= 60; t += 2) ctx.lineTo(g.X(t), Y(pWat(t))); ctx.lineTo(g.X(60), g.T); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(182,156,255,.12)"; ctx.beginPath(); ctx.moveTo(g.X(-40), g.B);
      for (t = -40; t <= 0; t += 2) ctx.lineTo(g.X(t), Y(pIce(t))); for (t = 0; t <= 60; t += 2) ctx.lineTo(g.X(t), Y(pWat(t))); ctx.lineTo(g.X(60), g.B); ctx.closePath(); ctx.fill();
      var cur = []; for (t = -40; t <= 0; t += 1) cur.push([t, log10(pIce(t))]); for (t = 0; t <= 60; t += 1) cur.push([t, log10(pWat(t))]);
      K.plot(ctx, g, cur, KC.blue);
      K.plot(ctx, g, [[0.01, log10(611)], [0, 6]], KC.blue);
      hline(ctx, g.L, g.R, Y(101325), A(KC.mute, 0.7), [2, 4]);
      K.pill(ctx, "1기압", g.R - 8, Y(101325) - 6, { a: "right", s: 10, c: KC.mute });
      K.pill(ctx, "얼음 (고체)", g.X(-22), Y(20000), { a: "center", s: 12, c: KC.blue });
      K.pill(ctx, "물 (액체)", g.X(30), Y(25000), { a: "center", s: 12, c: KC.green });
      K.pill(ctx, "수증기 (기체)", g.X(30), Y(12), { a: "center", s: 12, c: KC.violet });
      K.glow(ctx, g.X(0.01), Y(611), 3.4, "rgba(255,211,107,.95)", 3.5);
      K.pill(ctx, "삼중점 611 Pa", g.X(0.01) + 10, Y(611) + 22, { s: 10.5, c: KC.yellow });
      var px = g.X(T), py = Y(P);
      K.glow(ctx, px, py, 5.5, ok ? "rgba(63,211,163,.95)" : "rgba(255,107,129,.95)", 4);
      ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(px, py, 10, 0, 6.2832); ctx.stroke();
      return ok;
    }
    function update() {
      var ok = draw(), st = state();
      readout("a-ph-read", [
        ["건조실", T + " °C · " + PS[pi].toLocaleString() + " Pa", "b"],
        ["얼음이 승화하는 압력", T < 0 ? Math.round(pIce(T)).toLocaleString() + " Pa 미만" : "0 °C 이상은 녹음", "y", "이 온도에서 얼음의 증기 압력"],
        ["상태", SHORT[st], st === "sub" ? "g" : "r"]
      ], ok ? ["g", "동결 건조 조건"] : ["r", st === "sub" ? "승화는 되지만 −10 °C보다 따뜻함" : "아직 동결 건조가 아님"]);
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
    playBtn("a-ph-play", function () { return playing; }, function (q) { playing = q; }, "⏸ 움직임 멈추기", "▶ 움직임 보기");
    K.animate(canvas, function (dt) { if (playing && state() !== "ice") { tt += dt / 1000; draw(); } });
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
      ctx.clearRect(0, 0, W, H);
      var r = res(), ok = r.vit >= 80 && r.vol >= 90, LW = 420, fz = method === "freeze", i;
      /* ── 왼쪽: 말린 딸기와 건조기 ── */
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 13, title: fz ? "동결 건조한 딸기" : "열풍 " + ht + " °C로 말린 딸기" });
      var R0 = 62, R = R0 * Math.sqrt(r.vol / 100), cx = 150, cy = 170;
      ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(cx, cy + R0 * 1.15); ctx.bezierCurveTo(cx - R0 * 1.15, cy + R0 * 0.45, cx - R0 * 1.05, cy - R0 * 0.9, cx, cy - R0 * 0.78);
      ctx.bezierCurveTo(cx + R0 * 1.05, cy - R0 * 0.9, cx + R0 * 1.15, cy + R0 * 0.45, cx, cy + R0 * 1.15); ctx.stroke(); ctx.setLineDash([]);
      var plate = ctx.createRadialGradient(cx, cy + R0 * 1.2, 4, cx, cy + R0 * 1.2, 110); plate.addColorStop(0, "rgba(220,228,245,.35)"); plate.addColorStop(1, "rgba(220,228,245,0)");
      ctx.fillStyle = plate; ctx.beginPath(); ctx.ellipse(cx, cy + R0 * 1.2, 110, 16, 0, 0, 6.2832); ctx.fill();
      berry(ctx, cx, cy + (R0 - R) * 1.1, R, { dark: !fz, wrink: !fz, frost: fz });
      K.pill(ctx, "점선 = 원래 크기", cx, H - 44, { a: "center", s: 10.5, c: KC.mute });
      K.pill(ctx, fz ? "모양 그대로 · 얼음 자리가 구멍으로" : "쪼그라들고 갈라짐", cx, H - 16, { a: "center", s: 11.5, c: fz ? KC.green : KC.orange, box: [0, 300] });
      /* 건조 방식 그림 */
      var bx = 306, by = 60, bw = 100, bh = 200;
      var mg = ctx.createLinearGradient(bx, 0, bx + bw, 0); mg.addColorStop(0, "#4b546f"); mg.addColorStop(0.5, "#a9b2c9"); mg.addColorStop(1, "#3d4560");
      ctx.fillStyle = mg; ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 12); ctx.fill();
      ctx.fillStyle = fz ? "#0b1f3d" : "#2a0f08"; ctx.beginPath(); ctx.roundRect(bx + 10, by + 12, bw - 20, bh - 24, 8); ctx.fill();
      if (fz) {
        for (i = 0; i < 3; i++) { var sx = bx + 30 + i * 22, sy = by + 50 + (i % 2) * 40; ctx.strokeStyle = "rgba(190,225,255,.9)"; ctx.lineWidth = 1.6; for (var k = 0; k < 3; k++) { var a = k * Math.PI / 3; ctx.beginPath(); ctx.moveTo(sx - Math.cos(a) * 8, sy - Math.sin(a) * 8); ctx.lineTo(sx + Math.cos(a) * 8, sy + Math.sin(a) * 8); ctx.stroke(); } }
        K.t(ctx, "저온·저압", bx + bw / 2, by + 150, { s: 11, a: "center", c: KC.blue });
      } else {
        for (i = 0; i < 3; i++) { ctx.save(); ctx.shadowColor = KC.orange; ctx.shadowBlur = 10; ctx.strokeStyle = ht >= 70 ? "#ff7a3a" : "#ffb35c"; ctx.lineWidth = 3; ctx.beginPath(); for (var x = bx + 18; x <= bx + bw - 18; x += 4) { var yy = by + 46 + i * 40 + Math.sin((x - bx) * 0.25) * 5; if (x === bx + 18) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); } ctx.stroke(); ctx.restore(); }
        K.t(ctx, "뜨거운 바람", bx + bw / 2, by + 150, { s: 11, a: "center", c: KC.orange });
      }
      K.pill(ctx, fz ? "동결 건조기" : "열풍 건조기", bx + bw / 2, by + bh + 24, { a: "center", s: 11, c: KC.mute, box: [300, LW] });

      /* ── 오른쪽: 합격 기준 ── */
      var RX = LW + 8, RW = W - RX, gx = RX + 28, gw = RW - 56;
      K.stage(ctx, RX, 0, RW, H, "lab", { seed: 7, title: "우주 식량 합격 기준" });
      [["비타민 C 남은 양", r.vit, 80], ["원래 부피 대비", r.vol, 90]].forEach(function (b, k) {
        var y = 82 + k * 78, good = b[1] >= b[2], col = good ? KC.green : KC.red;
        K.t(ctx, b[0], gx, y - 10, { s: 12, c: KC.mute });
        ctx.fillStyle = "rgba(255,255,255,.07)"; ctx.beginPath(); ctx.roundRect(gx, y, gw, 22, 11); ctx.fill();
        var fg = ctx.createLinearGradient(gx, 0, gx + gw * b[1] / 100, 0); fg.addColorStop(0, A(col, 0.35)); fg.addColorStop(1, col);
        ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 10; ctx.fillStyle = fg; ctx.beginPath(); ctx.roundRect(gx, y, Math.max(12, gw * b[1] / 100), 22, 11); ctx.fill(); ctx.restore();
        vline(ctx, gx + gw * b[2] / 100, y - 6, y + 28, KC.yellow);
        K.pill(ctx, "기준 " + b[2] + "%", gx + gw * b[2] / 100, y + 46, { a: "center", s: 10.5, c: KC.yellow, box: [RX, W] });
        K.pill(ctx, b[1].toFixed(0) + "%", gx + gw, y - 8, { a: "right", s: 12.5, c: col, box: [RX, W] });
      });
      K.pill(ctx, "⏱ 건조 시간 약 " + r.time.toFixed(0) + "시간", gx, 252, { s: 12, c: KC.blue });
      K.pill(ctx, ok ? "우주 식량 합격" : "우주 식량 불합격", RX + RW / 2, H - 16, { a: "center", s: 14, c: ok ? KC.green : KC.red, box: [RX, W] });
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
    var u = 0, playing = !REDUCE;
    function rideScene(LW) {
      var i, gu = g(u), car;
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      var fl = ctx.createLinearGradient(0, H - 40, 0, H); fl.addColorStop(0, "#2b3a2a"); fl.addColorStop(1, "#141c14"); ctx.fillStyle = fl; ctx.fillRect(0, H - 40, LW, 40);
      ctx.restore();
      if (ride === "bumper") {
        ctx.fillStyle = "#1c2238"; ctx.beginPath(); ctx.ellipse(LW / 2, 214, 136, 58, 0, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = "#ffb35c"; ctx.lineWidth = 6; ctx.stroke();
        for (i = 0; i < 14; i++) K.glow(ctx, LW / 2 + Math.cos(i / 14 * 6.2832) * 136, 214 + Math.sin(i / 14 * 6.2832) * 58, 1.6, "rgba(255,220,150,.9)", 3);
        var xA = u < 0.35 ? 150 - u / 0.35 * 120 : (u < 0.72 ? 30 + (u - 0.35) / 0.37 * 160 : 190 - (u - 0.72) / 0.28 * 40);
        car = { x: xA, y: 214 };
        [[226, "#4fa3d9", "#1f5f8f"], [xA, "#ff6b81", "#9c2a3e"]].forEach(function (c) {
          var cg = ctx.createLinearGradient(0, 196, 0, 232); cg.addColorStop(0, c[1]); cg.addColorStop(1, c[2]);
          ctx.fillStyle = "#11131c"; ctx.beginPath(); ctx.roundRect(c[0] - 26, 214, 52, 14, 7); ctx.fill();
          ctx.fillStyle = cg; ctx.beginPath(); ctx.roundRect(c[0] - 22, 196, 44, 24, 9); ctx.fill();
          ctx.strokeStyle = "#d9dce8"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(c[0], 196); ctx.lineTo(c[0], 150); ctx.stroke();
        });
        if (Math.abs(u - 0.35) < 0.03) K.glow(ctx, 20, 214, 8, "rgba(255,220,120,.95)", 3);
        if (Math.abs(u - 0.72) < 0.03) K.glow(ctx, 206, 210, 8, "rgba(255,220,120,.95)", 3);
      } else if (ride === "coaster") {
        var pts = [];
        for (i = 0; i <= 100; i++) { var tq = i / 100; pts.push({ x: 18 + tq * (LW - 36), y: tq < 0.15 ? 196 : 196 + 62 * Math.sin((tq - 0.15) * Math.PI * 4) }); }
        pts.forEach(function (p2, k) { if (k % 8 === 0) { ctx.strokeStyle = "#3a4466"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p2.x, p2.y + 4); ctx.lineTo(p2.x, H - 40); ctx.stroke(); } });
        ctx.save(); ctx.strokeStyle = "#c9d2ea"; ctx.lineWidth = 4; ctx.shadowColor = "#7fd3ff"; ctx.shadowBlur = 6; ctx.beginPath(); pts.forEach(function (p2, k) { if (k) ctx.lineTo(p2.x, p2.y); else ctx.moveTo(p2.x, p2.y); }); ctx.stroke(); ctx.restore();
        car = { x: 18 + u * (LW - 36), y: (u < 0.15 ? 196 : 196 + 62 * Math.sin((u - 0.15) * Math.PI * 4)) - 10 };
        var cg2 = ctx.createLinearGradient(0, car.y - 10, 0, car.y + 10); cg2.addColorStop(0, "#ffd36b"); cg2.addColorStop(1, "#b57a1a");
        ctx.fillStyle = cg2; ctx.beginPath(); ctx.roundRect(car.x - 16, car.y - 10, 32, 18, 6); ctx.fill();
      } else {
        var tx = 150, top = 60, bot = H - 40;
        var tg = ctx.createLinearGradient(tx - 10, 0, tx + 10, 0); tg.addColorStop(0, "#5d6782"); tg.addColorStop(0.5, "#c3cbe0"); tg.addColorStop(1, "#3e4560");
        ctx.fillStyle = tg; ctx.fillRect(tx - 9, top, 18, bot - top);
        K.glow(ctx, tx, top - 4, 3, "rgba(255,107,129,.95)", 3.4);
        var cy = u < 0.3 ? 96 : (u < 0.5 ? 96 + 134 * Math.pow((u - 0.3) / 0.2, 2) : (u < 0.56 ? 230 + 20 * Math.sin((u - 0.5) / 0.06 * Math.PI / 2) : 250));
        car = { x: tx, y: cy };
        var rg = ctx.createLinearGradient(tx - 40, 0, tx + 40, 0); rg.addColorStop(0, "#9c2a3e"); rg.addColorStop(0.5, "#ff6b81"); rg.addColorStop(1, "#9c2a3e");
        ctx.fillStyle = rg; ctx.beginPath(); ctx.roundRect(tx - 42, cy - 12, 84, 24, 10); ctx.fill();
        if (u >= 0.3 && u < 0.5) { for (i = 0; i < 4; i++) K.line(ctx, { x: tx - 30 + i * 20, y: cy - 20 }, { x: tx - 30 + i * 20, y: cy - 44 }, "rgba(200,220,255,.5)", 1.5); }
        if (u >= 0.5 && u < 0.56) K.glow(ctx, tx, cy + 14, 6, "rgba(255,179,92,.95)", 3);
      }
      /* 스마트폰과 지금 값 */
      ctx.fillStyle = "#11131c"; ctx.beginPath(); ctx.roundRect(car.x - 6, car.y - 32, 12, 20, 3); ctx.fill();
      ctx.fillStyle = "#7fd3ff"; ctx.fillRect(car.x - 4, car.y - 30, 8, 14);
      K.pill(ctx, "지금 " + gu.toFixed(1) + " g", car.x, car.y - 40, { a: "center", s: 11.5, c: gu > 2 ? KC.red : (gu < 0.5 ? KC.blue : KC.ink), box: [0, LW] });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var LW = 300, i;
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 19, title: NM[ride] + " · 몸에 단 스마트폰" });
      rideScene(LW);
      var RX = LW + 8;
      K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 2, title: "가속도 센서 기록" });
      var gr = K.chart(ctx, { x: RX + 4, y: 40, w: W - RX - 12, h: H - 46, x0: 0, x1: 1, y0: 0, y1: 5, xt: 4, yt: 5, xl: "시간 →", xf: function () { return ""; }, yf: function (q) { return Math.round(q) + " g"; } });
      if (ride === "drop") {
        ctx.fillStyle = A(KC.yellow, 0.12); ctx.fillRect(gr.X(0.3), gr.T, gr.X(0.5) - gr.X(0.3), gr.B - gr.T);
        K.pill(ctx, "떨어지는 중", gr.X(0.4), gr.T + 20, { a: "center", s: 11, c: KC.yellow });
      }
      hline(ctx, gr.L, gr.R, gr.Y(1), "rgba(200,210,255,.55)");
      K.pill(ctx, "가만히 있을 때 1 g", gr.R - 8, gr.Y(1) + 22, { a: "right", s: 10.5, c: KC.mute });
      var pts = [], mx = 0, mn = 9, tmx = 0, tmn = 0;
      for (i = 0; i <= 400; i++) { var t = i / 400, a = g(t); pts.push([t, a]); if (a > mx) { mx = a; tmx = t; } if (a < mn) { mn = a; tmn = t; } }
      K.plot(ctx, gr, pts, KC.blue, { w: 2.4 });
      K.pill(ctx, "가장 큰 값 " + mx.toFixed(1) + " g", gr.X(tmx) + 10, gr.Y(mx) + 4, { s: 11, c: KC.red, box: [RX, W] });
      K.pill(ctx, "가장 작은 값 " + mn.toFixed(1) + " g", gr.X(tmn) + 10, Math.min(gr.B - 8, gr.Y(mn) + 26), { s: 11, c: KC.blue, box: [RX, W] });
      var cx = gr.X(u);
      vline(ctx, cx, gr.T, gr.B, A(KC.yellow, 0.7));
      K.glow(ctx, cx, gr.Y(g(u)), 4.5, "rgba(255,211,107,.95)", 4);
      K.pill(ctx, "살펴본 놀이기구 " + got.seen.length + " / 3", W - 12, 28, { a: "right", s: 11.5, c: got.seen.length >= 3 ? KC.green : KC.mute, box: [RX, W] });
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
    playBtn("b-acc-play", function () { return playing; }, function (q) { playing = q; }, "⏸ 탑승 멈추기", "▶ 탑승 다시 보기");
    K.animate(canvas, function (dt) { if (playing) { u = (u + dt / 7000) % 1; draw(); } });
    segWire("b-ride", "data-v", function (x) { ride = x; u = 0; update(); });
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
    var u = 0, playing = !REDUCE;
    function path(cx, by, sc) {
      var P = [], i, N = 120;
      function bz(p0, p1, p2, p3, t) { var m = 1 - t; return m * m * m * p0 + 3 * m * m * t * p1 + 3 * m * t * t * p2 + t * t * t * p3; }
      if (shape === "circle") { var R = r * sc; for (i = 0; i <= N; i++) { var a = Math.PI / 2 - i / N * 2 * Math.PI; P.push({ x: cx + R * Math.cos(a), y: by - R + R * Math.sin(a) }); } }
      else {
        var hgt = 2.5 * r * sc, rb = 3 * r * sc;
        for (i = 0; i <= N / 2; i++) { var t = i / (N / 2); P.push({ x: bz(cx, cx + rb * 0.9, cx + r * sc * 1.2, cx, t), y: bz(by, by, by - hgt, by - hgt, t) }); }
        for (i = 1; i <= N / 2; i++) { t = i / (N / 2); P.push({ x: bz(cx, cx - r * sc * 1.2, cx - rb * 0.9, cx, t), y: bz(by - hgt, by - hgt, by, by, t) }); }
      }
      return P;
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var tp = top(), bt = bot(), okT = tp >= 0.3, okB = bt <= 5, LW = 560, i;
      var cx = 300, by = H - 44, sc = Math.min(7, 236 / ((shape === "circle" ? 2 : 2.5) * r));
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 23, title: shape === "circle" ? "동그란 루프 · 반지름 " + r + " m" : "물방울 루프 · 꼭대기 " + r + " m · 바닥 " + (3 * r) + " m" });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      var fl = ctx.createLinearGradient(0, by + 6, 0, H); fl.addColorStop(0, "#2b3a2a"); fl.addColorStop(1, "#141c14"); ctx.fillStyle = fl; ctx.fillRect(0, by + 6, LW, H - by);
      ctx.restore();
      var P = path(cx, by, sc);
      P.forEach(function (p, k) { if (k % 10 === 5 && p.y < by - 20) { ctx.strokeStyle = "#2c3456"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p.x, p.y + 4); ctx.lineTo(p.x, by + 6); ctx.stroke(); } });
      ctx.strokeStyle = "#c9d2ea"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(20, by); ctx.lineTo(LW - 20, by); ctx.stroke();
      ctx.save(); ctx.shadowColor = "#7fd3ff"; ctx.shadowBlur = 8; ctx.strokeStyle = "#dfe6f7"; ctx.lineWidth = 5; ctx.beginPath();
      P.forEach(function (p, k) { if (k) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.stroke(); ctx.restore();
      ctx.strokeStyle = "#5b6690"; ctx.lineWidth = 1.5; ctx.beginPath(); P.forEach(function (p, k) { if (k) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.stroke();
      /* 힘 화살표: 꼭대기(좌석이 몸을 누르는 힘, 아래쪽) · 바닥(위쪽) */
      var topY = Math.min.apply(null, P.map(function (p) { return p.y; }));
      var lt = Math.max(-40, Math.min(70, tp * 18)), lb = Math.min(110, bt * 12);
      if (Math.abs(lt) > 2) K.arrow(ctx, { x: cx + 26, y: topY + 6 }, { x: cx + 26, y: topY + 6 + lt }, okT ? KC.green : KC.red, 3, 10);
      K.arrow(ctx, { x: cx - 30, y: by - 6 }, { x: cx - 30, y: by - 6 - lb }, okB ? KC.green : KC.red, 3, 10);
      K.pill(ctx, "꼭대기 " + tp.toFixed(1) + " g", cx + 40, Math.max(56, topY + 18), { s: 12, c: okT ? KC.green : KC.red, box: [0, LW] });
      K.pill(ctx, "바닥 " + bt.toFixed(1) + " g", cx - 44, by - 20, { a: "right", s: 12, c: okB ? KC.green : KC.red, box: [0, LW] });
      /* 돌아가는 열차 */
      var k = Math.floor(u * (P.length - 1)), p0 = P[k], p1 = P[Math.min(P.length - 1, k + 1)];
      ctx.save(); ctx.translate(p0.x, p0.y); ctx.rotate(Math.atan2(p1.y - p0.y, p1.x - p0.x));
      var cg = ctx.createLinearGradient(0, -14, 0, 0); cg.addColorStop(0, "#ffd36b"); cg.addColorStop(1, "#b57a1a");
      ctx.fillStyle = cg; ctx.beginPath(); ctx.roundRect(-14, -14, 28, 12, 5); ctx.fill(); ctx.restore();
      K.glow(ctx, p0.x, p0.y, 2, "rgba(255,240,200,.95)", 3);
      K.warn(ctx, 14, H - 12, "⚠ 열차 크기와 화살표 길이는 눈으로 보기 위한 표시");

      /* ── 오른쪽: 몸이 받는 힘 눈금 ── */
      var RX = LW + 8, RW = W - RX;
      K.stage(ctx, RX, 0, RW, H, "lab", { seed: 5, title: "몸이 받는 힘 (g)" });
      var yT = 70, yB = H - 50;
      function Y(q) { return yB - (Math.max(-1, Math.min(8, q)) + 1) / 9 * (yB - yT); }
      [[RX + 90, "꼭대기", tp, okT, 0.3, 8], [RX + 230, "바닥", bt, okB, -1, 5]].forEach(function (m) {
        var x = m[0], col = m[3] ? KC.green : KC.red;
        ctx.fillStyle = "rgba(255,255,255,.06)"; ctx.beginPath(); ctx.roundRect(x - 18, yT, 36, yB - yT, 10); ctx.fill();
        ctx.fillStyle = A(KC.green, 0.16); ctx.fillRect(x - 18, Y(m[5]), 36, Y(m[4]) - Y(m[5]));
        var y0 = Y(0), y1 = Y(m[2]);
        var fg = ctx.createLinearGradient(0, Math.min(y0, y1), 0, Math.max(y0, y1)); fg.addColorStop(0, col); fg.addColorStop(1, A(col, 0.4));
        ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 10; ctx.fillStyle = fg; ctx.fillRect(x - 10, Math.min(y0, y1), 20, Math.max(2, Math.abs(y1 - y0))); ctx.restore();
        K.pill(ctx, m[1], x, yB + 28, { a: "center", s: 12, c: KC.ink, box: [RX, W] });
        K.pill(ctx, m[2].toFixed(1) + " g", x + 26, Math.max(yT + 12, Math.min(yB, y1 + 5)), { s: 11.5, c: col, box: [RX, W] });
      });
      for (i = -1; i <= 8; i++) { K.t(ctx, String(i), RX + 30, Y(i) + 4, { s: 10, a: "right", c: KC.dim }); hline(ctx, RX + 34, RX + 290, Y(i), "rgba(200,210,255,.08)", [1, 0]); }
      hline(ctx, RX + 34, RX + 290, Y(0.3), A(KC.yellow, 0.8)); hline(ctx, RX + 34, RX + 290, Y(5), A(KC.yellow, 0.8));
      K.t(ctx, "0.3", RX + 64, Y(0.3) - 4, { s: 10, a: "right", c: KC.yellow });
      K.t(ctx, "5", RX + 204, Y(5) - 4, { s: 10, a: "right", c: KC.yellow });
      K.t(ctx, "초록 = 안전한 범위", W - 14, 54, { s: 10.5, a: "right", c: KC.green });
      return okT && okB;
    }
    function update() {
      var ok = draw(), tp = top(), bt = bot();
      readout("b-loop-read", [
        ["꼭대기", tp.toFixed(1) + " g", tp >= 0.3 ? "g" : "r", "몸이 좌석에 눌리는 힘 · 0.3 g 이상이면 안정"],
        ["바닥", bt.toFixed(1) + " g", bt <= 5 ? "g" : "r", "5 g를 넘으면 위험"],
        ["꼭대기 구심 가속도", (vv * vv / r).toFixed(1) + " m/s²", "b", "속력² ÷ 반지름 = " + vv + "² ÷ " + r]
      ], ok ? ["g", "두 조건을 모두 만족"] : ["r", tp < 0.3 ? "꼭대기에서 눌림이 부족" : "바닥에서 힘이 너무 큼"]);
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
    playBtn("b-loop-play", function () { return playing; }, function (q) { playing = q; }, "⏸ 열차 멈추기", "▶ 열차 달리기");
    K.animate(canvas, function (dt) { if (playing) { u = (u + dt / 5000) % 1; draw(); } });
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
    var tt = 0, playing = !REDUCE;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var LW = 470, a = A_(n), rr = 0.1 * n / TG, i;
      /* ── 왼쪽: 층수별 흔들림 ── */
      K.stage(ctx, 0, 0, LW, H, "lab", { seed: 4, title: "층수에 따라 땅보다 몇 배 흔들리나" });
      var g = K.chart(ctx, { x: 6, y: 44, w: LW - 14, h: H - 50, x0: 0, x1: 12, y0: 0, y1: 12, xt: 1, yt: 4, xl: "층수", xf: function () { return ""; }, yf: function (q) { return Math.round(q) + "배"; } });
      var bw = (g.R - g.L) / 12;
      for (var k = 1; k <= 12; k++) {
        var hv = A_(k), on = k === n, x = g.L + (k - 1) * bw + bw * 0.16, top = g.Y(hv);
        var bg = ctx.createLinearGradient(0, top, 0, g.B);
        if (on) { bg.addColorStop(0, "#ffb35c"); bg.addColorStop(1, "#b5402a"); } else { bg.addColorStop(0, "rgba(127,211,255,.55)"); bg.addColorStop(1, "rgba(60,110,200,.25)"); }
        ctx.save(); if (on) { ctx.shadowColor = KC.orange; ctx.shadowBlur = 12; }
        ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(x, top, bw * 0.68, g.B - top, [5, 5, 0, 0]); ctx.fill(); ctx.restore();
        K.t(ctx, String(k), x + bw * 0.34, g.B + 16, { s: 10.5, a: "center", c: on ? KC.ink : KC.mute, w: on ? "900" : "600" });
      }
      hline(ctx, g.L, g.R, g.Y(1), "rgba(200,210,255,.5)");
      K.pill(ctx, "땅과 같음 (1배)", g.R - 8, g.Y(1) - 8, { a: "right", s: 10.5, c: KC.mute });

      /* ── 오른쪽: 흔들리는 건물 ── */
      var RX = LW + 8, RW = W - RX, bx = RX + RW / 2, gy = H - 54;
      K.stage(ctx, RX, 0, RW, H, "night", { seed: 31, title: "지진 때 " + n + "층 건물" });
      var w = 2 * Math.PI / TG, ph = Math.atan2(2 * 0.05 * rr, 1 - rr * rr), gx0 = 4 * Math.sin(w * tt), topX = Math.min(64, 4 * a) * Math.sin(w * tt - ph);
      var eg = ctx.createLinearGradient(0, gy, 0, H); eg.addColorStop(0, "#4a3626"); eg.addColorStop(1, "#1d140c");
      ctx.save(); ctx.beginPath(); ctx.roundRect(RX, 0, RW, H, 14); ctx.clip();
      var Rk = K.rng(8);
      for (i = 0; i < 9; i++) { var sx = RX + i * 48 + Rk() * 10, sh = 50 + Rk() * 120; if (Math.abs(sx + 20 - bx) < 80) continue; ctx.fillStyle = "rgba(40,48,90,.85)"; ctx.fillRect(sx, gy - sh, 40, sh); for (var lw = 0; lw < 6; lw++) { if (Rk() > 0.55) { ctx.fillStyle = "rgba(255,226,150,.35)"; ctx.fillRect(sx + 6 + (lw % 2) * 18, gy - sh + 10 + Math.floor(lw / 2) * 22, 8, 8); } } }
      ctx.fillStyle = eg; ctx.fillRect(RX - 10 + gx0, gy, RW + 20, H - gy);
      ctx.strokeStyle = "rgba(255,200,150,.25)"; ctx.lineWidth = 1; for (i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(RX + i * 50 + gx0, gy + 8); ctx.lineTo(RX + i * 50 + 24 + gx0, gy + 8); ctx.stroke(); }
      ctx.restore();
      var fh = Math.min(18, 196 / n), bwid = 96;
      for (var f = 0; f < n; f++) {
        var s0 = gx0 + (topX - gx0) * f / n, s1 = gx0 + (topX - gx0) * (f + 1) / n, yb = gy - f * fh, yt = gy - (f + 1) * fh;
        var cg = ctx.createLinearGradient(bx - bwid / 2, 0, bx + bwid / 2, 0); cg.addColorStop(0, "#5b6378"); cg.addColorStop(0.5, "#9aa3ba"); cg.addColorStop(1, "#4a5167");
        ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(bx - bwid / 2 + s0, yb); ctx.lineTo(bx + bwid / 2 + s0, yb); ctx.lineTo(bx + bwid / 2 + s1, yt); ctx.lineTo(bx - bwid / 2 + s1, yt); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(20,24,40,.6)"; ctx.lineWidth = 1; ctx.stroke();
        for (var wi = 0; wi < 3; wi++) { var wx = bx - 30 + wi * 30 + (s0 + s1) / 2; ctx.fillStyle = (f + wi) % 3 ? "rgba(255,226,150,.85)" : "rgba(40,60,110,.9)"; ctx.fillRect(wx - 6, yt + fh * 0.25, 12, fh * 0.45); }
      }
      var roofY = gy - n * fh;
      K.arrow(ctx, { x: bx - 70 + gx0, y: gy + 22 }, { x: bx - 40 + gx0, y: gy + 22 }, KC.yellow, 2, 8);
      K.arrow(ctx, { x: bx - 70 + gx0, y: gy + 22 }, { x: bx - 100 + gx0, y: gy + 22 }, KC.yellow, 2, 8);
      K.pill(ctx, "땅: 0.5초마다 한 번", bx + 30, gy + 28, { s: 11, c: KC.yellow, box: [RX, W] });
      K.pill(ctx, "고유 주기 " + (0.1 * n).toFixed(1) + "초", bx, Math.max(58, roofY - 16), { a: "center", s: 12, c: Math.abs(rr - 1) < 0.01 ? KC.orange : KC.blue, box: [RX, W] });
      K.warn(ctx, W - 12, 54, "⚠ 흔들림 폭은 과장 · 3배 느리게", "right");
      return n === 5;
    }
    function update() {
      var ok = draw(), a = A_(n);
      readout("c-res-read", [
        ["건물 고유 주기", (0.1 * n).toFixed(1) + " 초", "b", n + "층 × 0.1 초 (어림)"],
        ["땅의 흔들림 주기", "0.5 초", "y"],
        ["건물 흔들림", "땅의 " + a.toFixed(1) + "배", a > 5 ? "r" : "g"]
      ], ok ? ["g", "박자가 맞아 흔들림이 쌓임 · 공진"] : ["r", "가장 크게 흔들리는 층수를 찾아 보세요"]);
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
    playBtn("c-res-play", function () { return playing; }, function (q) { playing = q; }, "⏸ 흔들림 멈추기", "▶ 흔들림 보기");
    K.animate(canvas, function (dt) { if (playing) { tt += dt / 3000; draw(); } });
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
    var tt = 0, playing = !REDUCE;
    /* ── 블록 모형: 땅 블록 위 5층 학교 본관, x = 운동장 쪽(오른쪽 아래), y = 깊이 ── */
    var DH = 410;
    var I = K.iso({ ox: 330, oy: 150, s: 0.62, L: 560, D: 280 });
    var GZ = 56, X0 = 170, X1 = 420, Y0 = 70, Y1 = 200, FH = 40, BH = 30;
    function shade(hex, f) { return K.tint(hex, f); }
    function quad(c, a, b, d, e, fill) { c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.lineTo(d.x, d.y); c.lineTo(e.x, e.y); c.closePath(); c.fillStyle = fill; c.fill(); }
    function lineP(c, a, b, col, w) { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); }
    /* 땅 블록(흔들림만큼 x 로 밀림) */
    function ground(gx) {
      var P = I.P, L = I.L, D = I.D;
      /* 앞면: 흙·자갈·암반 지층 */
      var layers = [[0, 18, "#5a4a3c"], [18, 36, "#7a6248"], [36, GZ - 6, "#9a7a55"], [GZ - 6, GZ, "#6f8f4a"]];
      layers.forEach(function (q, k) {
        quad(ctx, P(gx, D, q[0]), P(L + gx, D, q[0]), P(L + gx, D, q[1]), P(gx, D, q[1]), shade(q[2], 1));
        quad(ctx, P(L + gx, 0, q[0]), P(L + gx, D, q[0]), P(L + gx, D, q[1]), P(L + gx, 0, q[1]), shade(q[2], 0.72));
      });
      var R = K.rng(41);
      for (var i = 0; i < 150; i++) {
        var u = R() * L, z = R() * (GZ - 8), p = P(u + gx, D, z);
        ctx.fillStyle = R() > 0.5 ? "rgba(255,255,255,.14)" : "rgba(30,20,10,.28)"; ctx.fillRect(p.x, p.y, 2, 2);
      }
      /* 윗면: 운동장 흙(앞쪽)과 잔디 */
      quad(ctx, P(gx, 0, GZ), P(L + gx, 0, GZ), P(L + gx, D, GZ), P(gx, D, GZ), "#8fb06a");
      quad(ctx, P(440 + gx, 20, GZ + 0.1), P(L - 20 + gx, 20, GZ + 0.1), P(L - 20 + gx, D - 20, GZ + 0.1), P(440 + gx, D - 20, GZ + 0.1), "#c9a874");
      lineP(ctx, P(470 + gx, 140, GZ + 0.2), P(L - 50 + gx, 140, GZ + 0.2), "rgba(255,255,255,.6)", 1.2);
      /* 블록 모서리 */
      lineP(ctx, P(gx, D, 0), P(L + gx, D, 0), "rgba(255,255,255,.5)", 1.2);
      lineP(ctx, P(L + gx, D, 0), P(L + gx, 0, 0), "rgba(255,255,255,.5)", 1.2);
      lineP(ctx, P(L + gx, D, 0), P(L + gx, D, GZ), "rgba(255,255,255,.5)", 1.2);
      /* 나무 몇 그루 */
      [[60, 40], [40, 150], [90, 250], [300, 18], [520, 40]].forEach(function (t, k) { I.tree(ctx, t[0] + gx, t[1], GZ, 0.9 + (k % 2) * 0.15); });
    }
    /* 고무 받침(면진): 층층이 겹친 고무·철판, 아래는 땅을 따라, 위는 건물을 따라 움직인다 */
    function bearings(gx, b0) {
      var pts = [[X0 + 18, Y0 + 16], [(X0 + X1) / 2, Y0 + 16], [X1 - 18, Y0 + 16], [X0 + 18, Y1 - 16], [(X0 + X1) / 2, Y1 - 16], [X1 - 18, Y1 - 16]];
      /* 받침이 놓인 기초판 */
      I.box(ctx, X0 - 8 + gx, Y0 - 8, GZ, X1 + 8 + gx, Y1 + 8, GZ + 3, "#b9bec8", "#9ba1ad", "#7e8592");
      pts.forEach(function (q) {
        for (var k = 0; k < 6; k++) {
          var f0 = k / 6, f1 = (k + 1) / 6, off = gx + (b0 - gx) * (f0 + f1) / 2;
          I.box(ctx, q[0] - 10 + off, q[1] - 10, GZ + 3 + (BH - 3) * f0, q[0] + 10 + off, q[1] + 10, GZ + 3 + (BH - 3) * f1,
            k % 2 ? "#d7dbe3" : "#3a3d46", k % 2 ? "#b8bdc8" : "#24262d", k % 2 ? "#9ea4b0" : "#17181d");
        }
      });
    }
    function building(b0, topX, a, c, gx) {
      var P = I.P, zb = GZ + (t2 ? BH : 0), f, over = a > c;
      if (!t2) I.box(ctx, X0 - 6 + gx, Y0 - 6, GZ, X1 + 6 + gx, Y1 + 6, zb + 2, "#a4a9b3", "#8c919c", "#6f7480");
      for (f = 0; f < 5; f++) {
        var s0 = b0 + (topX - b0) * Math.pow(f / 5, 1.3), s1 = b0 + (topX - b0) * Math.pow((f + 1) / 5, 1.3);
        var z0 = zb + f * FH, z1 = z0 + FH;
        var heat = over ? Math.min(1, (a - c) / 0.4) * (0.35 + 0.65 * (f + 1) / 5) : 0;
        var wall = heat > 0 ? "rgb(" + Math.round(214 + 30 * heat) + "," + Math.round(214 - 90 * heat) + "," + Math.round(206 - 100 * heat) + ")" : "#d6d3c8";
        /* 앞면·오른쪽 면(층마다 기울어진 평행사변형) */
        quad(ctx, P(X0 + s0, Y1, z0), P(X1 + s0, Y1, z0), P(X1 + s1, Y1, z1), P(X0 + s1, Y1, z1), wall);
        quad(ctx, P(X1 + s0, Y0, z0), P(X1 + s0, Y1, z0), P(X1 + s1, Y1, z1), P(X1 + s1, Y0, z1), shade(wall.charAt(0) === "#" ? wall : "#c9b9ad", heat > 0 ? 0.8 : 0.74));
        /* 층 바닥판 */
        quad(ctx, P(X0 + s0, Y1, z0), P(X1 + s0, Y1, z0), P(X1 + s0, Y1, z0 + 4), P(X0 + s0, Y1, z0 + 4), "#8a8f9a");
        quad(ctx, P(X1 + s0, Y0, z0), P(X1 + s0, Y1, z0), P(X1 + s0, Y1, z0 + 4), P(X1 + s0, Y0, z0 + 4), "#6f7480");
        function F(u, v) { return P(X0 + (X1 - X0) * u + s0 + (s1 - s0) * v, Y1, z0 + (z1 - z0) * v); }
        function Rf(u, v) { return P(X1 + s0 + (s1 - s0) * v, Y0 + (Y1 - Y0) * u, z0 + (z1 - z0) * v); }
        /* 창문 */
        var wi;
        for (wi = 0; wi < 6; wi++) {
          var u0 = 0.06 + wi * 0.155, u1 = u0 + 0.1, lit = (f + wi) % 3 !== 0;
          quad(ctx, F(u0, 0.3), F(u1, 0.3), F(u1, 0.8), F(u0, 0.8), lit ? "#ffe39a" : "#4c6a9a");
        }
        for (wi = 0; wi < 3; wi++) {
          var r0 = 0.1 + wi * 0.3, r1 = r0 + 0.18;
          quad(ctx, Rf(r0, 0.3), Rf(r1, 0.3), Rf(r1, 0.8), Rf(r0, 0.8), (f + wi) % 2 ? "#e0c784" : "#3d5680");
        }
        /* 내진: 굵은 기둥 + X 자 철골 가새 */
        if (t1) {
          [0, 0.5, 1].forEach(function (u) { quad(ctx, F(u - 0.018, 0), F(u + 0.018, 0), F(u + 0.018, 1), F(u - 0.018, 1), "#4a4f5c"); });
          ctx.save(); ctx.lineCap = "round";
          [[0.03, 0.47], [0.53, 0.97]].forEach(function (bay) {
            lineP(ctx, F(bay[0], 0.06), F(bay[1], 0.94), "#e08a3a", 3);
            lineP(ctx, F(bay[1], 0.06), F(bay[0], 0.94), "#e08a3a", 3);
          });
          ctx.restore();
        }
        /* 제진: 오른쪽 면 대각선 오일 댐퍼(1·3·5층) */
        if (t3 && f % 2 === 0) {
          var d0 = Rf(0.12, 0.08), d1 = Rf(0.88, 0.92);
          lineP(ctx, d0, d1, "#c9cfdd", 2.4);
          var mx = (d0.x + d1.x) / 2, my = (d0.y + d1.y) / 2, ang = Math.atan2(d1.y - d0.y, d1.x - d0.x);
          ctx.save(); ctx.translate(mx, my); ctx.rotate(ang);
          var yg = ctx.createLinearGradient(0, -6, 0, 6); yg.addColorStop(0, "#ffe08a"); yg.addColorStop(1, "#b5862a");
          ctx.fillStyle = yg; ctx.beginPath(); ctx.roundRect(-15, -5.5, 30, 11, 4); ctx.fill(); ctx.restore();
        }
        /* 층 모서리 선 */
        lineP(ctx, P(X1 + s0, Y1, z0), P(X1 + s1, Y1, z1), "rgba(255,255,255,.55)", 1);
      }
      /* 옥상 */
      var zt = zb + 5 * FH;
      quad(ctx, P(X0 + topX, Y0, zt), P(X1 + topX, Y0, zt), P(X1 + topX, Y1, zt), P(X0 + topX, Y1, zt), "#9aa0ab");
      quad(ctx, P(X0 + 10 + topX, Y0 + 10, zt + 0.1), P(X1 - 10 + topX, Y0 + 10, zt + 0.1), P(X1 - 10 + topX, Y1 - 10, zt + 0.1), P(X0 + 10 + topX, Y1 - 10, zt + 0.1), "#b6bcc6");
      I.box(ctx, X0 + 30 + topX, Y0 + 30, zt, X0 + 70 + topX, Y0 + 60, zt + 14, "#e8ecf2", "#c9ced6", "#9aa3b0");
      return zt;
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var a = acc(), c = cap(), ok = a <= c && t1 && (t1 + t2 + t3) >= 2, n = t1 + t2 + t3;
      var w = 2 * Math.PI / TG, gx0 = 7 * Math.sin(w * tt);
      var b0 = t2 ? gx0 * 0.2 : gx0;
      var topX = b0 + Math.min(70, a * 70) * Math.sin(w * tt - 0.6);
      var box = [0, W];
      /* ── 위: 블록 모형 ── */
      K.studio(ctx, 0, 0, W, DH, { x: I.P(I.L / 2, I.D / 2, 0).x, y: I.P(I.L, I.D, 0).y - 30, rx: 360, ry: 60 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, W, DH, 14); ctx.clip();
      ground(gx0);
      if (t2) bearings(gx0, b0);
      var zt = building(b0, topX, a, c, gx0);
      /* 땅의 흔들림 화살표(앞면) */
      var ga = I.P(70 + gx0, I.D, GZ / 2);
      K.arrow(ctx, { x: ga.x + 4, y: ga.y + 6 }, { x: ga.x + 40, y: ga.y + 26 }, KC.yellow, 2.4, 9);
      K.arrow(ctx, { x: ga.x + 4, y: ga.y + 6 }, { x: ga.x - 32, y: ga.y - 14 }, KC.yellow, 2.4, 9);
      ctx.restore();
      /* 이름표 */
      I.label(ctx, X1 - 20 + topX, Y0 + 10, zt, "우리 학교 본관 (5층)", 70, -30, "#e8ecff", box);
      var tp = I.P(X1 + topX, Y1, zt);
      K.pill(ctx, "꼭대기 흔들림 " + a.toFixed(2) + " g", tp.x + 16, tp.y + 6, { s: 12, c: a <= c ? KC.green : KC.red, box: box });
      I.label(ctx, 70 + gx0, I.D, 6, "땅의 흔들림 · 0.5초마다", -30, 34, "#ffd36b", box);
      if (t1) I.label(ctx, X0 + 40 + b0, Y1, GZ + (t2 ? BH : 0) + 30, "철골 가새·굵은 기둥 (내진)", -70, -10, "#ffb35c", box);
      if (t2) I.label(ctx, X1 - 18 + b0, Y1 - 6, GZ + BH / 2, "고무 받침 (면진)", 90, 34, "#7fd3ff", box);
      if (t3) I.label(ctx, X1 + (b0 + topX) / 2, (Y0 + Y1) / 2, GZ + 120, "오일 댐퍼 (제진)", 110, -20, "#ffd36b", box);
      /* 큰 제목 */
      var h1, h2, c2 = "#ffd35a";
      if (ok) { h1 = "흔들려도 버틴다"; h2 = "흔들림 " + a.toFixed(2) + " g ≤ 견디는 힘 " + c.toFixed(2) + " g"; c2 = "#7ef0c0"; }
      else if (!t1 && n >= 1) { h1 = "기본 뼈대가 빠졌다"; h2 = "견디는 힘 " + c.toFixed(2) + " g · 장치만으로는 부족"; }
      else if (a > c) { h1 = n === 0 ? "박자가 맞아 크게 흔들린다" : "꼭대기가 견디는 힘을 넘었다"; h2 = "흔들림 " + a.toFixed(2) + " g > 견디는 힘 " + c.toFixed(2) + " g"; c2 = "#ff9aac"; }
      else { h1 = "기술 하나로는 부족하다"; h2 = "흔들림 " + a.toFixed(2) + " g · 견디는 힘 " + c.toFixed(2) + " g"; }
      K.bigText(ctx, h1, 22, 50, 28, "#ffffff");
      K.bigText(ctx, h2, 22, 82, 17, c2);
      K.warn(ctx, W - 14, 30, "⚠ 흔들림 폭·받침·장치 크기는 보기 쉽게 과장", "right");

      /* ── 아래: 흔들림과 견디는 힘 ── */
      var y0 = DH + 8, gx = 40, gw = W - 300;
      K.stage(ctx, 0, y0, W, H - y0, "lab", { seed: 8 });
      K.pill(ctx, "꼭대기 층 흔들림 vs 견디는 힘", 16, y0 + 24, { s: 12, c: KC.blue });
      function BX(q) { return gx + gw * Math.min(1, q); }
      var col = a <= c ? KC.green : KC.red, by = y0 + 72;
      ctx.fillStyle = "rgba(255,255,255,.07)"; ctx.beginPath(); ctx.roundRect(gx, by, gw, 26, 13); ctx.fill();
      var fg = ctx.createLinearGradient(gx, 0, BX(a), 0); fg.addColorStop(0, A(col, 0.35)); fg.addColorStop(1, col);
      ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 12; ctx.fillStyle = fg; ctx.beginPath(); ctx.roundRect(gx, by, Math.max(14, BX(a) - gx), 26, 13); ctx.fill(); ctx.restore();
      ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(BX(c), by - 10); ctx.lineTo(BX(c), by + 36); ctx.stroke();
      K.pill(ctx, "흔들림 " + a.toFixed(2) + " g", gx, by - 14, { s: 12.5, c: col, box: [0, W - 250] });
      K.pill(ctx, "견디는 힘 " + c.toFixed(2) + " g", BX(c), by + 56, { a: "center", s: 11.5, c: KC.ink, box: [0, W - 250] });
      K.t(ctx, "0", gx, by + 86, { s: 10, c: KC.dim }); K.t(ctx, "1 g", gx + gw, by + 86, { s: 10, a: "right", c: KC.dim });
      var RX = W - 220;
      [["내진", t1, KC.orange], ["면진", t2, KC.blue], ["제진", t3, KC.yellow]].forEach(function (q, k) {
        K.pill(ctx, (q[1] ? "● " : "○ ") + q[0], RX + 10 + k * 68, y0 + 60, { s: 12, c: q[1] ? q[2] : KC.dim, box: [RX, W] });
      });
      K.pill(ctx, ok ? "학교 건물 안전" : (!t1 && (t2 || t3) ? "보완 필요 · 기본 내진 없음" : "보완 필요"), RX + 100, y0 + 124, { a: "center", s: 14, c: ok ? KC.green : KC.red, box: [RX, W] });
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
    playBtn("c-tech-play", function () { return playing; }, function (q) { playing = q; }, "⏸ 흔들림 멈추기", "▶ 흔들림 보기");
    K.animate(canvas, function (dt) { if (playing) { tt += dt / 3000; draw(); } });
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
    function nutria(x, y, s) {
      var bg = ctx.createRadialGradient(x - 4 * s, y - 4 * s, 1, x, y, 16 * s); bg.addColorStop(0, "#a5764a"); bg.addColorStop(1, "#4a2f1a");
      ctx.fillStyle = bg; ctx.beginPath(); ctx.ellipse(x, y, 16 * s, 8 * s, 0, Math.PI, 0); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x + 15 * s, y - 3 * s, 6 * s, 5 * s, 0, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "#ff9d3a"; ctx.fillRect(x + 18 * s, y - 1 * s, 2.5 * s, 3 * s);
      ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(x + 17 * s, y - 5 * s, 1.1 * s, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = "rgba(190,230,255,.45)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y + 1, 20 * s, 3 * s, 0, 0, 6.2832); ctx.stroke();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var r = run(hh), n10 = r.ns[10], a10 = r.as[10], ok = n10 >= 60 && run(hh - 5).ns[10] < 60, LW = 360, i;
      /* ── 왼쪽: 10년 뒤 저수지 ── */
      K.stage(ctx, 0, 0, LW, H, "sky", { seed: 3, title: "10년 뒤 저수지 · 포획률 " + hh + "%" });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      var hill = ctx.createLinearGradient(0, 110, 0, 170); hill.addColorStop(0, "#4f8a4a"); hill.addColorStop(1, "#2b5a2c");
      ctx.fillStyle = hill; ctx.beginPath(); ctx.moveTo(0, 150); ctx.quadraticCurveTo(110, 96, 220, 140); ctx.quadraticCurveTo(300, 116, LW, 132); ctx.lineTo(LW, 180); ctx.lineTo(0, 180); ctx.closePath(); ctx.fill();
      var wg = ctx.createLinearGradient(0, 160, 0, H); wg.addColorStop(0, "#2e7fb8"); wg.addColorStop(1, "#0a2a4f");
      ctx.fillStyle = wg; ctx.fillRect(0, 160, LW, H - 160);
      for (i = 0; i < 6; i++) { ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(20 + i * 60, 176 + (i % 3) * 30); ctx.lineTo(56 + i * 60, 176 + (i % 3) * 30); ctx.stroke(); }
      ctx.restore();
      var Rr = K.rng(21), nPlant = Math.round(n10 / 100 * 26);
      for (i = 0; i < 26; i++) {
        var px = 14 + Rr() * (LW - 28), py = 166 + Rr() * 14, hgt = 22 + Rr() * 26, alive = i < nPlant;
        ctx.strokeStyle = alive ? "#6fd06a" : "rgba(120,110,80,.45)"; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.quadraticCurveTo(px + 4, py - hgt / 2, px + (alive ? 2 : 10), py - hgt * (alive ? 1 : 0.5)); ctx.stroke();
        if (alive && i % 3 === 0) { ctx.fillStyle = "#8a5a2a"; ctx.beginPath(); ctx.ellipse(px + 2, py - hgt, 2.4, 6, 0, 0, 6.2832); ctx.fill(); }
      }
      var nFish = Math.round(n10 / 100 * 8);
      for (i = 0; i < nFish; i++) { var fx = 30 + (i * 83) % (LW - 60), fy = 236 + (i * 37) % 70; ctx.fillStyle = "rgba(200,230,255,.75)"; ctx.beginPath(); ctx.ellipse(fx, fy, 9, 4, 0, 0, 6.2832); ctx.fill(); ctx.beginPath(); ctx.moveTo(fx - 8, fy); ctx.lineTo(fx - 14, fy - 4); ctx.lineTo(fx - 14, fy + 4); ctx.closePath(); ctx.fill(); }
      var nN = Math.round(a10 / 100 * 12);
      for (i = 0; i < nN; i++) nutria(26 + (i * 97) % (LW - 70), 196 + (i * 53) % 110, 0.9);
      K.pill(ctx, "토종 생물 " + n10.toFixed(0) + "%", 14, H - 14, { s: 12, c: n10 >= 60 ? KC.green : KC.red });
      K.pill(ctx, "뉴트리아 " + a10.toFixed(0) + "%", LW - 14, H - 14, { a: "right", s: 12, c: KC.orange });

      /* ── 오른쪽: 10년 동안의 변화 ── */
      var RX = LW + 8;
      K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 15, title: "개체수 변화 (처음 토종 = 100%)" });
      var g = K.chart(ctx, { x: RX + 4, y: 40, w: W - RX - 12, h: H - 46, pr: 92, x0: 0, x1: 10, y0: 0, y1: 120, xt: 5, yt: 4, xl: "해", xf: function (t) { return Math.round(t) + "년"; }, yf: function (p) { return Math.round(p) + "%"; } });
      hline(ctx, g.L, g.R, g.Y(60), A(KC.yellow, 0.85));
      K.pill(ctx, "목표 60%", g.L + 8, g.Y(60) + 20, { s: 10.5, c: KC.yellow });
      var ln = r.ns.map(function (p, t) { return [t, p]; }), la = r.as.map(function (p, t) { return [t, p]; });
      K.plot(ctx, g, ln, KC.green, { dots: 3 }); K.plot(ctx, g, la, KC.orange, { dots: 3 });
      var yN = g.Y(n10), yA = g.Y(a10);
      if (Math.abs(yN - yA) < 24) { if (yN < yA) { yN -= 12; yA += 12; } else { yN += 12; yA -= 12; } }
      K.pill(ctx, "토종 " + n10.toFixed(0) + "%", g.R + 10, yN + 4, { s: 11, c: KC.green, box: [RX, W] });
      K.pill(ctx, "뉴트리아 " + a10.toFixed(0) + "%", g.R + 10, yA + 4, { s: 11, c: KC.orange, box: [RX, W] });
      return ok;
    }
    function update() {
      var ok = draw(), r = run(hh);
      readout("d-eco-read", [
        ["포획률", hh + "% / 년", "b"],
        ["10년 뒤 토종 생물", r.ns[10].toFixed(0) + "%", r.ns[10] >= 60 ? "g" : "r", "목표 60% 이상"],
        ["10년 뒤 뉴트리아", r.as[10].toFixed(0) + "%", "y"]
      ], ok ? ["g", "목표를 지키는 가장 낮은 포획률"] : (r.ns[10] >= 60 ? ["g", "목표는 지킴 · 더 낮아도 됩니다"] : ["r", "토종 생물이 크게 줄어듭니다"]));
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
    var tt = 0, playing = !REDUCE;
    function tree(x, y, s) {
      ctx.fillStyle = "#5a3a22"; ctx.fillRect(x - 3 * s, y - 26 * s, 6 * s, 26 * s);
      var tg = ctx.createRadialGradient(x - 6 * s, y - 44 * s, 3, x, y - 38 * s, 24 * s); tg.addColorStop(0, "#8fe08a"); tg.addColorStop(1, "#2b6a2e");
      ctx.fillStyle = tg; ctx.beginPath(); ctx.arc(x, y - 40 * s, 22 * s, 0, 6.2832); ctx.fill();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var d = D[loc], LW = 470, i, gy = 236, UNIT = "\u338d/m\u00b3";
      /* ── 왼쪽: 측정한 곳 ── */
      K.stage(ctx, 0, 0, LW, H, "sky", { seed: 4, title: d.n + " · 오전 8시" });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      ctx.fillStyle = "rgba(150,140,120," + (d.pm / 52 * 0.35).toFixed(2) + ")"; ctx.fillRect(0, 0, LW, gy);
      if (loc === "park") {
        var gg = ctx.createLinearGradient(0, gy, 0, H); gg.addColorStop(0, "#4f9a4a"); gg.addColorStop(1, "#2a5a28"); ctx.fillStyle = gg; ctx.fillRect(0, gy, LW, H - gy);
        [[60, 1.2], [150, 1.5], [250, 1.1], [340, 1.4], [420, 1.0]].forEach(function (q) { tree(q[0], gy + 6, q[1]); });
        ctx.fillStyle = "#c9b48a"; ctx.beginPath(); ctx.moveTo(180, H); ctx.quadraticCurveTo(230, gy + 30, 300, gy); ctx.lineTo(320, gy); ctx.quadraticCurveTo(260, gy + 40, 240, H); ctx.closePath(); ctx.fill();
      } else if (loc === "field") {
        var fg = ctx.createLinearGradient(0, gy, 0, H); fg.addColorStop(0, "#b58a5a"); fg.addColorStop(1, "#7a5634"); ctx.fillStyle = fg; ctx.fillRect(0, gy, LW, H - gy);
        ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(LW / 2, gy + 44, 190, 30, 0, 0, 6.2832); ctx.stroke();
        ctx.strokeStyle = "#e9edf8"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(380, gy + 10); ctx.lineTo(380, gy - 50); ctx.lineTo(440, gy - 50); ctx.lineTo(440, gy + 10); ctx.stroke();
        var sg = ctx.createLinearGradient(30, 0, 150, 0); sg.addColorStop(0, "#6f7a96"); sg.addColorStop(0.5, "#aab3c9"); sg.addColorStop(1, "#5b6378");
        ctx.fillStyle = sg; ctx.fillRect(30, gy - 70, 120, 70); ctx.fillStyle = "rgba(40,60,110,.9)"; for (i = 0; i < 4; i++) ctx.fillRect(40 + i * 28, gy - 58, 18, 22);
      } else {
        ctx.fillStyle = "#3a3f4f"; ctx.fillRect(0, gy, LW, H - gy);
        ctx.strokeStyle = "#ffd36b"; ctx.lineWidth = 3; ctx.setLineDash([22, 16]); ctx.beginPath(); ctx.moveTo(0, gy + 40); ctx.lineTo(LW, gy + 40); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = "#8a95b0"; ctx.fillRect(16, gy - 16, LW - 32, 12);
        [[0.0, "#ff6b81", gy + 24], [0.33, "#7fd3ff", gy + 62], [0.6, "#ffd36b", gy + 24], [0.82, "#b69cff", gy + 62]].forEach(function (c, k) {
          var dir = c[2] < gy + 40 ? 1 : -1, x = ((c[0] + tt * 0.08 * dir) % 1 + 1) % 1 * (LW + 120) - 60;
          var cg = ctx.createLinearGradient(0, c[2] - 14, 0, c[2] + 8); cg.addColorStop(0, c[1]); cg.addColorStop(1, "#1b2033");
          ctx.fillStyle = cg; ctx.beginPath(); ctx.roundRect(x - 30, c[2] - 14, 60, 20, 6); ctx.fill();
          ctx.fillStyle = "#11131c"; ctx.beginPath(); ctx.arc(x - 16, c[2] + 6, 5, 0, 6.2832); ctx.arc(x + 16, c[2] + 6, 5, 0, 6.2832); ctx.fill();
          ctx.fillStyle = "rgba(90,90,100,.35)"; ctx.beginPath(); ctx.arc(x - 34 * dir, c[2], 6 + (tt * 3 + k) % 4, 0, 6.2832); ctx.fill();
        });
        var pg = ctx.createLinearGradient(0, gy - 90, 0, gy); pg.addColorStop(0, "#9aa3ba"); pg.addColorStop(1, "#5b6378");
        ctx.fillStyle = pg; ctx.fillRect(LW - 110, gy - 90, 14, 74); ctx.fillRect(LW - 30, gy - 90, 14, 74);
      }
      ctx.restore();
      if (loc === "gate") K.pill(ctx, "학교 정문", LW - 63, gy - 100, { a: "center", s: 11, c: KC.ink, box: [0, LW] });
      if (loc === "field") K.pill(ctx, "학교 건물", 90, gy - 80, { a: "center", s: 11, c: KC.ink, box: [0, LW] });
      /* 미세먼지 알갱이와 소리 물결 */
      var Rp = K.rng(17), np = Math.round(d.pm * 1.6);
      for (i = 0; i < np; i++) { var px = (Rp() * LW + tt * (6 + Rp() * 10)) % LW, py = 50 + Rp() * (gy - 40) + Math.sin(tt + i) * 4; ctx.fillStyle = "rgba(60,50,40,.55)"; ctx.beginPath(); ctx.arc(px, py, 1.4 + Rp() * 1.2, 0, 6.2832); ctx.fill(); }
      var srcX = loc === "gate" ? LW / 2 : (loc === "field" ? 300 : 230), srcY = gy + 20, nw = Math.round((d.db - 40) / 8);
      for (i = 0; i < nw; i++) { var rr = 20 + ((tt * 30 + i * 26) % (nw * 26)); ctx.strokeStyle = "rgba(255,211,107," + (0.6 * (1 - rr / (nw * 26 + 20))).toFixed(2) + ")"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(srcX, srcY, rr, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
      K.pill(ctx, "간이 측정기 · PM2.5 " + d.pm + " " + UNIT + " · 소음 " + d.db + " dB", LW / 2, H - 14, { a: "center", s: 12, c: KC.ink, box: [0, LW] });

      /* ── 오른쪽: 기준과 비교 ── */
      var RX = LW + 8, RW = W - RX, gx = RX + 24, gw = RW - 48;
      K.stage(ctx, RX, 0, RW, H, "lab", { seed: 9, title: "기준과 비교" });
      [["미세먼지 PM2.5", d.pm, 35, 100, UNIT, "35 넘으면 나쁨"], ["소음", d.db, 65, 100, "dB", "낮 65 넘으면 기준 초과"]].forEach(function (b, k) {
        var y = 84 + k * 92, over = b[1] > b[2], col = over ? KC.red : KC.green;
        K.t(ctx, b[0], gx, y - 12, { s: 12, c: KC.mute });
        ctx.fillStyle = "rgba(255,255,255,.07)"; ctx.beginPath(); ctx.roundRect(gx, y, gw, 22, 11); ctx.fill();
        var fgr = ctx.createLinearGradient(gx, 0, gx + gw * b[1] / b[3], 0); fgr.addColorStop(0, A(col, 0.35)); fgr.addColorStop(1, col);
        ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 10; ctx.fillStyle = fgr; ctx.beginPath(); ctx.roundRect(gx, y, gw * b[1] / b[3], 22, 11); ctx.fill(); ctx.restore();
        vline(ctx, gx + gw * b[2] / b[3], y - 6, y + 28, KC.yellow);
        K.pill(ctx, b[5], gx + gw * b[2] / b[3], y + 46, { a: "center", s: 10.5, c: KC.yellow, box: [RX, W] });
        K.pill(ctx, b[1] + " " + b[4], gx + gw, y - 10, { a: "right", s: 12.5, c: col, box: [RX, W] });
      });
      K.t(ctx, "측정한 곳", gx, 272, { s: 11, c: KC.mute });
      ["park", "field", "gate"].forEach(function (k, j) {
        var seen = got.seen.indexOf(k) >= 0;
        K.pill(ctx, (seen ? "✔ " : "· ") + D[k].n.replace("학교 뒤 ", "").replace("정문 앞 ", ""), gx + j * (gw / 3) + 6, 302, { s: 10.5, c: seen ? (k === loc ? KC.blue : KC.ink) : KC.dim, box: [RX, W] });
      });
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
    playBtn("d-pol-play", function () { return playing; }, function (q) { playing = q; }, "⏸ 움직임 멈추기", "▶ 움직임 보기");
    K.animate(canvas, function (dt) { if (playing) { tt += dt / 1000; draw(); } });
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
    { key: "rInq", label: "교과서 실험" },
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
    { key: "rInq", label: "교과서 실험" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "네 탐구를 꿰는 한 문장" }
});

})();
