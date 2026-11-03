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

/* ---- 무대 그림 도구 (../assets/kit.js) ---- */
var K = window.sthKit, KC = K.C, REDUCE = K.REDUCE;
function playBtn(id, get, set, onL, offL) {
  var b = $(id); if (!b) return;
  function lab() { b.textContent = get() ? onL : offL; }
  b.addEventListener("click", function () { set(!get()); lab(); }); lab();
}
/* 빛나는 파동 선: fn(u) 는 0~1 구간에서 -1~1 값 */
function gwave(ctx, x0, x1, cy, amp, fn, col, w) {
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 2.4; ctx.lineJoin = "round"; ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath();
  for (var x = x0; x <= x1; x += 2) { var yy = cy - amp * fn((x - x0) / (x1 - x0)); if (x === x0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); }
  ctx.stroke(); ctx.restore();
}
function hline(ctx, x0, x1, y, col, dash) { K.line(ctx, { x: x0, y: y }, { x: x1, y: y }, col, 1.2, dash || [5, 5]); }
function vline(ctx, x, y0, y1, col, dash) { K.line(ctx, { x: x, y: y0 }, { x: x, y: y1 }, col, 1.2, dash || [4, 4]); }
/* 읽음판: rows = [[이름, 값, 색(b·y·g·r), 보조]], ok = [g·r, 글] */
function readout(id, rows, ok) {
  var h = rows.map(function (r) { return "<span class='k'>" + r[0] + "</span><span class='v " + (r[2] || "") + "'>" + r[1] + "</span>" + (r[3] ? "<span class='sub'>" + r[3] + "</span>" : ""); }).join("");
  if (ok) h += "<span class='ok " + ok[0] + "'>" + ok[1] + "</span>";
  put(id, h);
}
/* 떠오르는 입자(김·수증기): 시간 tt 로 위치가 정해진다 */
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
    var tt = 0, playing = !REDUCE;
    function R() { var p = ph * Math.PI / 180; return Math.sqrt(1 + am * am + 2 * am * Math.cos(p)); }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var p = ph * Math.PI / 180, r = R(), ok = r <= 0.1 + 1e-9, LW = 300, i;
      var rc = ok ? KC.green : (r > 1 ? KC.red : KC.yellow);
      /* ── 왼쪽: 헤드폰 속 ── */
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 4, title: "헤드폰 속" });
      ctx.save(); ctx.beginPath(); ctx.rect(0, 44, 98, H - 44); ctx.clip();
      for (i = 0; i < 4; i++) {
        var rr = (tt * 30 + i * 32) % 128;
        ctx.strokeStyle = A(KC.orange, 0.75 * (1 - rr / 128)); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(-60, 214, 70 + rr, -0.62, 0.62); ctx.stroke();
      }
      ctx.restore();
      K.pill(ctx, "엔진 소음", 12, 300, { c: KC.orange });
      /* 머리띠·귀덮개 */
      ctx.strokeStyle = "#3b4470"; ctx.lineWidth = 10; ctx.lineCap = "round";
      ctx.beginPath(); ctx.arc(252, 104, 100, Math.PI * 1.06, Math.PI * 1.5); ctx.stroke(); ctx.lineCap = "butt";
      var cg = ctx.createLinearGradient(96, 0, 208, 0); cg.addColorStop(0, "#56618f"); cg.addColorStop(0.45, "#2c355c"); cg.addColorStop(1, "#181d3a");
      ctx.fillStyle = cg; ctx.beginPath(); ctx.roundRect(96, 92, 112, 228, 46); ctx.fill();
      ctx.strokeStyle = "rgba(200,210,255,.35)"; ctx.lineWidth = 1.5; ctx.stroke();
      var cu = ctx.createLinearGradient(200, 0, 232, 0); cu.addColorStop(0, "#62667f"); cu.addColorStop(1, "#2b2e45");
      ctx.fillStyle = cu; ctx.beginPath(); ctx.roundRect(200, 104, 30, 204, 14); ctx.fill();
      /* 마이크 → 칩 → 스피커 */
      ctx.fillStyle = "#11152b"; ctx.beginPath(); ctx.roundRect(92, 132, 12, 18, 5); ctx.fill();
      K.glow(ctx, 98, 141, 3.2, "rgba(255,179,92,.95)", 4);
      K.pill(ctx, "바깥 마이크", 12, 128, { s: 11, c: KC.orange });
      var pcb = ctx.createLinearGradient(130, 148, 176, 176); pcb.addColorStop(0, "#1f7a55"); pcb.addColorStop(1, "#0e3b2a");
      ctx.fillStyle = pcb; ctx.beginPath(); ctx.roundRect(130, 148, 46, 28, 4); ctx.fill();
      ctx.fillStyle = "#d9b45a"; for (i = 0; i < 4; i++) { ctx.fillRect(135 + i * 10, 144, 4, 4); ctx.fillRect(135 + i * 10, 176, 4, 4); }
      ctx.fillStyle = "#0b0f20"; ctx.fillRect(143, 155, 20, 14);
      K.pill(ctx, "반대 소리 계산", 153, 200, { a: "center", s: 11, c: KC.green });
      K.arrow(ctx, { x: 104, y: 144 }, { x: 128, y: 158 }, KC.mute, 1.6, 7);
      K.arrow(ctx, { x: 156, y: 206 }, { x: 166, y: 236 }, KC.mute, 1.6, 7);
      var sx = 176, sy = 262;
      var sg = ctx.createLinearGradient(sx - 14, 0, sx + 14, 0); sg.addColorStop(0, "#232a4d"); sg.addColorStop(1, "#8a96c4");
      ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(sx - 12, sy - 10); ctx.lineTo(sx + 12, sy - 24); ctx.lineTo(sx + 12, sy + 24); ctx.lineTo(sx - 12, sy + 10); ctx.closePath(); ctx.fill();
      K.glow(ctx, sx - 9, sy, 3, "rgba(127,211,255,.95)", 4);
      K.pill(ctx, "스피커", 150, 306, { a: "center", s: 11, c: KC.blue });
      /* 스피커가 내는 반대 소리 */
      ctx.save(); ctx.beginPath(); ctx.rect(sx + 12, 200, 80, 130); ctx.clip();
      for (i = 0; i < 3; i++) {
        var br = (tt * 22 + i * 22) % 66;
        ctx.strokeStyle = A(KC.blue, Math.min(1, 0.35 + 0.4 * am) * (1 - br / 66)); ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(sx + 12, sy, 8 + br, -0.55, 0.55); ctx.stroke();
      }
      ctx.restore();
      /* 귀와 남은 소리 */
      var eg = ctx.createRadialGradient(258, 250, 2, 266, 262, 32); eg.addColorStop(0, "#f6cfae"); eg.addColorStop(1, "#c47f5e");
      ctx.fillStyle = eg; ctx.beginPath(); ctx.ellipse(266, 262, 18, 30, 0, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = "rgba(120,60,40,.65)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(268, 258, 10, Math.PI * 0.6, Math.PI * 1.9); ctx.stroke();
      var ring = 5 + 14 * Math.min(r, 2);
      ctx.strokeStyle = A(rc, 0.85); ctx.lineWidth = 2; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.arc(262, 266, ring, 0, 6.2832); ctx.stroke(); ctx.setLineDash([]);
      K.pill(ctx, "귀에 남은 소리 " + Math.round(r * 100) + "%", 262, 222, { a: "center", s: 11, c: rc, box: [0, LW] });

      /* ── 오른쪽: 귀 앞에서 겹치는 세 파동 ── */
      var RX = LW + 8, x0 = RX + 24, x1 = W - 24, k = 3 * 2 * Math.PI, wt = tt * 2.2;
      K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 9, title: "귀 앞에서 겹치는 세 파동" });
      function nz(u) { return Math.sin(k * u - wt); }
      function an(u) { return am * Math.sin(k * u - wt + p); }
      /* 소음의 마루 자리(세로 점선) — 아래 두 줄에서 무엇을 만나는지 보인다 */
      for (i = -1; i < 4; i++) {
        var uc = (Math.PI / 2 + wt + 2 * Math.PI * i) / k; uc -= Math.floor(uc * 3) / 3; uc += i / 3;
        if (uc < 0 || uc > 1) continue;
        vline(ctx, x0 + uc * (x1 - x0), 80, 372, "rgba(255,211,107,.22)");
      }
      hline(ctx, x0, x1, 100, "rgba(200,210,255,.22)");
      gwave(ctx, x0, x1, 100, 22, nz, KC.orange, 2.6);
      K.pill(ctx, "① 엔진 소음 (마이크가 들은 소리)", x0, 62, { s: 12, c: KC.orange });
      hline(ctx, x0, x1, 196, "rgba(200,210,255,.22)");
      gwave(ctx, x0, x1, 196, 22, an, KC.blue, 2.6);
      K.pill(ctx, "② 헤드폰이 만든 소리 · 위상차 " + ph + "° · 세기 " + am.toFixed(1), x0, 150, { s: 12, c: KC.blue });
      hline(ctx, x0, x1, 318, "rgba(200,210,255,.22)");
      hline(ctx, x0, x1, 298, A(KC.orange, 0.35), [3, 5]); hline(ctx, x0, x1, 338, A(KC.orange, 0.35), [3, 5]);
      gwave(ctx, x0, x1, 318, 20, function (u) { return nz(u) + an(u); }, rc, 3);
      K.pill(ctx, "③ 귀에 들리는 소리 = ① + ②", x0, 258, { s: 12, c: KC.ink });
      K.pill(ctx, r > 1 ? "보강 간섭 · 더 커짐" : (r < 0.3 ? "상쇄 간섭 · 거의 사라짐" : "부분적으로 줄어듦"), x1, 258, { a: "right", s: 12, c: rc });
      K.t(ctx, "점선 = 원래 소음의 크기", x1, H - 8, { s: 10, a: "right", c: KC.dim });
      return ok;
    }
    function update() {
      var ok = draw(), r = R();
      readout("a-wave-read", [
        ["귀에 남은 소리", Math.round(r * 100) + "%", ok ? "g" : (r > 1 ? "r" : "y"), "소리 크기 " + (r < 0.01 ? "−40 dB 이하" : (20 * Math.log(r) / Math.LN10).toFixed(1) + " dB") + " (소음 = 100%)"],
        ["만든 소리", ph + "° · " + am.toFixed(1) + "배", "b", "위상차 · 세기"]
      ], ok ? ["g", "상쇄 간섭 · 10% 이하로 줄임"] : (r > 1 ? ["r", "보강 간섭 · 오히려 커졌습니다"] : ["r", "아직 10%보다 큽니다"]));
      put("a-wave-info", "위상차 " + ph + "°, 세기 " + am.toFixed(1) + ": 귀에 들리는 소리는 소음의 " + Math.round(r * 100) + "%입니다. "
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
    playBtn("a-wave-play", function () { return playing; }, function (q) { playing = q; }, "⏸ 파동 멈추기", "▶ 파동 움직이기");
    K.animate(canvas, function (dt) { if (playing) { tt += dt / 1000; draw(); } });
    $("a-ph").addEventListener("input", function (ev) { ph = +ev.target.value; $("a-ph-val").textContent = ph + "°"; update(); });
    $("a-am").addEventListener("input", function (ev) { am = +ev.target.value; $("a-am-val").textContent = am.toFixed(1); update(); });
    window.sthPick({
      mount: "a-wave-pick",
      q: "헤드폰이 실수로 소음과 위상차 0° 인 소리(세기 1)를 만들면 어떻게 될까요?",
      options: ["소음이 사라진다", "마루와 마루가 겹쳐 소음이 약 2배로 커진다(보강 간섭)", "아무 변화가 없다"],
      answer: 1,
      why: ["위상이 같으면 지우지 못합니다.", "같은 위상의 두 파동이 더해지면 진폭이 커집니다. 그래서 헤드폰은 위상을 정확히 뒤집어야 합니다.", "두 소리가 더해지니 변화가 생깁니다."],
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
    var tt = 0, playing = !REDUCE;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var LW = 552, red0 = 1 - R(f), good = red0 >= 0.5, gc = good ? KC.green : KC.red, ff;
      /* ── 왼쪽: 진동수에 따른 줄임 비율 ── */
      K.stage(ctx, 0, 0, LW, H, "lab", { seed: 3, title: "진동수에 따라 소음을 줄이는 비율" });
      var g = K.chart(ctx, { x: 6, y: 44, w: LW - 14, h: H - 50, x0: 0, x1: 2000, y0: -0.2, y1: 1, xt: 4, yt: 6, xl: "소음의 진동수 (Hz)", yf: function (q) { return Math.round(q * 100) + "%"; } });
      ctx.fillStyle = A(KC.orange, 0.14); ctx.fillRect(g.X(100), g.T, g.X(300) - g.X(100), g.B - g.T);
      ctx.fillStyle = A(KC.violet, 0.12); ctx.fillRect(g.X(1000), g.T, g.R - g.X(1000), g.B - g.T);
      ctx.fillStyle = A(KC.red, 0.10); ctx.fillRect(g.L, g.Y(0), g.R - g.L, g.B - g.Y(0));
      K.pill(ctx, "엔진 소리", g.X(200), g.Y(0.2), { a: "center", s: 11, c: KC.orange });
      K.pill(ctx, "말소리의 자음 (1000~4000 Hz)", g.X(1500), g.T + 20, { a: "center", s: 11, c: KC.violet });
      K.pill(ctx, "아래는 오히려 커짐", g.L + 8, g.B - 7, { s: 10.5, c: KC.red });
      hline(ctx, g.L, g.R, g.Y(0.5), A(KC.yellow, 0.8));
      K.pill(ctx, "절반 줄임", g.L + 8, g.Y(0.5) - 6, { s: 10.5, c: KC.yellow });
      var pts = []; for (ff = 100; ff <= 2000; ff += 20) pts.push([ff, 1 - R(ff)]);
      K.plot(ctx, g, pts, KC.blue);
      var px = g.X(f), py = g.Y(red0);
      vline(ctx, px, g.T, g.B, A(KC.yellow, 0.55));
      K.glow(ctx, px, py, 5, good ? "rgba(63,211,163,.95)" : "rgba(255,107,129,.95)", 4);
      K.pill(ctx, f + " Hz · " + (red0 < 0 ? Math.round(-red0 * 100) + "% 커짐" : Math.round(red0 * 100) + "% 줄임"), px + (f > 1300 ? -12 : 12), py + (red0 > 0.8 ? 26 : -12), { a: f > 1300 ? "right" : "left", s: 11.5, c: gc, box: [0, LW] });

      /* ── 오른쪽: 0.1 ms 늦은 반대 소리 (두 주기를 같은 폭으로) ── */
      var RX = LW + 8, x0 = RX + 18, x1 = W - 18, d = f * TAU * 0.5, wt = tt * 2;
      K.stage(ctx, RX, 0, W - RX, H, "night", { seed: 21, title: "0.1 ms 늦게 나온 반대 소리" });
      function nz(u) { return Math.sin(4 * Math.PI * u - wt); }
      function an(u) { return -Math.sin(4 * Math.PI * (u - d) - wt); }
      var uc = ((Math.PI / 2 + wt) / (4 * Math.PI)) % 0.5; if (uc < 0.08) uc += 0.5; if (uc + d > 0.97) uc -= 0.5;
      var xa = x0 + uc * (x1 - x0), xb = x0 + (uc + d) * (x1 - x0);
      vline(ctx, xa, 70, 196, A(KC.orange, 0.6)); vline(ctx, xb, 70, 196, A(KC.blue, 0.6));
      hline(ctx, x0, x1, 92, "rgba(200,210,255,.2)"); gwave(ctx, x0, x1, 92, 20, nz, KC.orange, 2.4);
      K.pill(ctx, "소음", x0, 62, { s: 11.5, c: KC.orange });
      hline(ctx, x0, x1, 168, "rgba(200,210,255,.2)"); gwave(ctx, x0, x1, 168, 20, an, KC.blue, 2.4);
      K.pill(ctx, "반대 소리 (0.1 ms 늦음)", x0, 138, { s: 11.5, c: KC.blue });
      K.bracket(ctx, Math.min(xa, xb), Math.max(xa, xb) + 0.01, 200, KC.yellow, null, false);
      hline(ctx, x0, x1, 262, "rgba(200,210,255,.2)"); gwave(ctx, x0, x1, 262, 20, function (u) { return nz(u) + an(u); }, gc, 2.8);
      K.pill(ctx, "합친 소리", x0, 228, { s: 11.5, c: KC.ink });
      K.pill(ctx, "0.1 ms = 한 주기의 " + (f * TAU * 100).toFixed(0) + "% → 위상 " + err(f).toFixed(0) + "° 어긋남", RX + (W - RX) / 2, H - 12, { a: "center", s: 11, c: KC.yellow, box: [RX, W] });
      return R(f) <= 0.5 && R(f + 100) > 0.5;
    }
    function update() {
      var ok = draw(), red0 = 1 - R(f);
      readout("a-lag-read", [
        ["소음의 진동수", f + " Hz", "b", "한 주기 " + (1000 / f).toFixed(f >= 1000 ? 2 : 1) + " ms"],
        ["위상 어긋남", err(f).toFixed(0) + "°", "y", "0.1 ms = 360° × 진동수 × 0.0001 s"],
        ["소음", red0 < 0 ? Math.round(-red0 * 100) + "% 커짐" : Math.round(red0 * 100) + "% 줄임", red0 >= 0.5 ? "g" : "r"]
      ], ok ? ["g", "절반 이상 줄이는 가장 높은 진동수"] : (red0 >= 0.5 ? ["g", "절반 넘게 줄어듭니다"] : ["r", "절반도 못 줄입니다"]));
      put("a-lag-info", f + " Hz 소음은 헤드폰이 소리를 만드는 0.1 ms 동안 위상이 " + err(f).toFixed(0) + "° 어긋나, " + (red0 < 0 ? "오히려 " + Math.round(-red0 * 100) + "% 커집니다(보강 간섭). " : Math.round(red0 * 100) + "%만 줄어듭니다. ")
        + (ok ? "✅ 800 Hz가 절반 이상 줄일 수 있는 가장 높은 진동수입니다. 그보다 높은 소리는 위상이 너무 많이 어긋납니다." : (red0 >= 0.5 ? "아직 절반 넘게 줄어듭니다. 더 높은 진동수는?" : "절반도 못 줄입니다. 진동수를 낮춰 보세요.")));
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
    playBtn("a-lag-play", function () { return playing; }, function (q) { playing = q; }, "⏸ 파동 멈추기", "▶ 파동 움직이기");
    K.animate(canvas, function (dt) { if (playing) { tt += dt / 1000; draw(); } });
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
      { t: "📡 GPS 내비게이션 — 여러 위성의 전파가 도착하는 시간 차로 위치를 잰다 (생활 서비스)", a: "wave", why: "빛의 속력으로 가는 전파의 도착 시간을 씁니다." },
      { t: "🎬 3D 영화 안경 — 양쪽 눈에 편광 방향이 다른 빛만 들어가게 한다 (영화)", a: "wave", why: "빛의 편광을 이용합니다." },
      { t: "🍱 보냉 도시락통 — 진공층이 열의 전도·대류를 막는다 (요리)", a: "heat", why: "열이 이동하는 길을 막습니다." },
      { t: "🏠 겨울 이중창 — 유리 사이 공기층이 열이 빠져나가는 것을 줄인다 (건축)", a: "heat", why: "공기는 열을 잘 전하지 않습니다." },
      { t: "🥩 수비드 요리 — 일정한 온도의 물로 고기를 천천히 익힌다 (요리)", a: "heat", why: "물의 열을 고르게 전달합니다.", hint: "무엇이 고기에게 전달되나요?" },
      { t: "🚗 자동차 에어백 — 부딪히는 시간을 늘려 몸이 받는 힘을 줄인다 (생활 안전)", a: "force", why: "충격량이 같을 때 시간이 길면 힘이 작아집니다." },
      { t: "⚽ 바나나킥 — 공을 회전시켜 휘어 날아가게 한다 (스포츠)", a: "force", why: "회전하는 공 둘레의 공기 흐름 차이가 옆으로 미는 힘(마그누스 힘)을 만듭니다." }
    ],
    onDone: function () { window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>영화·건축·요리·스포츠·미디어, 어디에서나 몇 가지 과학 원리가 되풀이해 쓰입니다. 원리를 알면 처음 보는 기술도 설명할 수 있습니다."); ep.clear(3); ep.clear(4); }
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
    var tt = 0, playing = !REDUCE;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var hh = hum(pow, t), okr = hh >= 40 && hh <= 60, LW = 330, i;
      var hc = okr ? KC.green : (hh > 60 ? KC.red : KC.yellow);
      /* ── 왼쪽: 교실 ── */
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 6, title: "교실 · 가습기 " + t + "분 가동" });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      var fl = ctx.createLinearGradient(0, H - 66, 0, H); fl.addColorStop(0, "#3d2e22"); fl.addColorStop(1, "#1d140d");
      ctx.fillStyle = fl; ctx.fillRect(0, H - 66, LW, 66);
      ctx.strokeStyle = "rgba(0,0,0,.28)"; ctx.lineWidth = 1;
      for (i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(i * 56, H - 66); ctx.lineTo(i * 56 - 36, H); ctx.stroke(); }
      /* 습도가 오를수록 방 안이 엷게 뿌옇해진다 */
      ctx.fillStyle = "rgba(150,200,255," + (Math.max(0, hh - 25) / 45 * 0.16).toFixed(3) + ")"; ctx.fillRect(0, 0, LW, H - 66);
      ctx.restore();
      /* 창문 */
      var wx = 192, wy = 52, ww = 118, wh = 118;
      ctx.fillStyle = "#6b5a48"; ctx.fillRect(wx - 6, wy - 6, ww + 12, wh + 12);
      var gl = ctx.createLinearGradient(wx, wy, wx + ww, wy + wh); gl.addColorStop(0, "#24477c"); gl.addColorStop(1, "#0b1a38");
      ctx.fillStyle = gl; ctx.fillRect(wx, wy, ww, wh);
      ctx.strokeStyle = "rgba(255,255,255,.13)"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(wx + 16, wy + wh); ctx.lineTo(wx + 62, wy); ctx.stroke();
      if (hh > 60) {
        var Rd = K.rng(12), nd = Math.round((hh - 60) * 7);
        for (i = 0; i < nd; i++) {
          var dx = wx + 4 + Rd() * (ww - 8), dy = wy + 4 + Rd() * (wh - 8), dr = 1.5 + Rd() * 2.2;
          ctx.fillStyle = "rgba(190,225,255,.55)"; ctx.beginPath(); ctx.arc(dx, dy, dr, 0, 6.2832); ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.beginPath(); ctx.arc(dx - dr * 0.35, dy - dr * 0.35, dr * 0.35, 0, 6.2832); ctx.fill();
        }
      }
      ctx.fillStyle = "#6b5a48"; ctx.fillRect(wx + ww / 2 - 2, wy, 4, wh); ctx.fillRect(wx, wy + wh / 2 - 2, ww, 4);
      K.pill(ctx, hh > 60 ? "창문에 물방울(결로)" : "창문", wx + ww / 2, wy - 12, { a: "center", s: 11, c: hh > 60 ? KC.red : KC.mute, box: [0, LW] });
      /* 습도계 */
      var cx = 84, cy = 116, rr = 44, a0 = Math.PI * 0.75, a1 = Math.PI * 2.25;
      function ang(q) { return a0 + (a1 - a0) * q / 100; }
      var dg = ctx.createRadialGradient(cx - 12, cy - 14, 4, cx, cy, rr + 6); dg.addColorStop(0, "#2c3566"); dg.addColorStop(1, "#0d1130");
      ctx.fillStyle = dg; ctx.beginPath(); ctx.arc(cx, cy, rr + 6, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = "#8d97c4"; ctx.lineWidth = 2; ctx.stroke();
      [[0, 40, KC.yellow], [40, 60, KC.green], [60, 100, KC.red]].forEach(function (b) { ctx.strokeStyle = A(b[2], 0.8); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cx, cy, rr - 4, ang(b[0]), ang(b[1])); ctx.stroke(); });
      for (i = 0; i <= 10; i++) { var aa = ang(i * 10); ctx.strokeStyle = "rgba(230,236,255,.7)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(cx + Math.cos(aa) * (rr - 12), cy + Math.sin(aa) * (rr - 12)); ctx.lineTo(cx + Math.cos(aa) * (rr - 7), cy + Math.sin(aa) * (rr - 7)); ctx.stroke(); }
      var an = ang(hh);
      ctx.strokeStyle = hc; ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(an) * (rr - 10), cy + Math.sin(an) * (rr - 10)); ctx.stroke(); ctx.lineCap = "butt";
      K.glow(ctx, cx, cy, 3, "rgba(255,255,255,.9)", 2.5);
      K.t(ctx, Math.round(hh) + "%", cx, cy + 30, { s: 13, w: "900", a: "center", c: hc });
      K.pill(ctx, "습도계", cx, cy + rr + 32, { a: "center", s: 11, c: KC.mute });
      /* 가습기와 김 */
      var hx = 250, hy = H - 128;
      var body = ctx.createLinearGradient(hx - 40, 0, hx + 40, 0); body.addColorStop(0, "#9aa6c4"); body.addColorStop(0.45, "#d6ddef"); body.addColorStop(1, "#6c7795");
      ctx.fillStyle = body; ctx.beginPath(); ctx.roundRect(hx - 38, hy, 76, 92, 18); ctx.fill();
      var tank = ctx.createLinearGradient(0, hy + 30, 0, hy + 80); tank.addColorStop(0, "rgba(127,211,255,.35)"); tank.addColorStop(1, "rgba(40,120,220,.85)");
      ctx.fillStyle = tank; ctx.beginPath(); ctx.roundRect(hx - 24, hy + 30, 48, 48, 8); ctx.fill();
      ctx.fillStyle = "#3a4466"; ctx.beginPath(); ctx.roundRect(hx - 12, hy - 10, 24, 14, 5); ctx.fill();
      K.glow(ctx, hx + 26, hy + 16, 2.4, t > 0 ? "rgba(63,211,163,.95)" : "rgba(120,130,160,.6)", 3);
      if (t > 0) floatUp(ctx, pow === "strong" ? 34 : 18, 31, tt * 0.35, hx - 10, hx + 10, hy - 12, 60, "rgba(210,235,255,.75)", pow === "strong" ? 3 : 2.4, 0);
      K.pill(ctx, "가습기 · " + P[pow].n, hx, H - 12, { a: "center", s: 11.5, c: KC.blue });

      /* ── 오른쪽: 습도 기록 ── */
      var RX = LW + 8;
      K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 8, title: "습도계 기록" });
      var g = K.chart(ctx, { x: RX + 4, y: 40, w: W - RX - 12, h: H - 46, x0: 0, x1: 120, y0: 20, y1: 80, xt: 4, yt: 3, xl: "가동 시간 (분)", yf: function (q) { return Math.round(q) + "%"; } });
      ctx.fillStyle = A(KC.green, 0.13); ctx.fillRect(g.L, g.Y(60), g.R - g.L, g.Y(40) - g.Y(60));
      ctx.fillStyle = A(KC.red, 0.10); ctx.fillRect(g.L, g.T, g.R - g.L, g.Y(60) - g.T);
      K.pill(ctx, "알맞은 습도 40~60%", g.L + 8, g.Y(60) + 18, { s: 10.5, c: KC.green });
      K.pill(ctx, "60% 넘으면 결로·곰팡이 위험", g.L + 8, g.Y(75), { s: 10.5, c: KC.red });
      vline(ctx, g.X(30), g.T, g.B, A(KC.green, 0.5));
      K.pill(ctx, "30분", g.X(30), g.B - 8, { a: "center", s: 10.5, c: KC.green });
      ["weak", "strong"].forEach(function (p) {
        var pts = []; for (var q = 0; q <= 120; q += 2) pts.push([q, hum(p, q)]);
        if (p === pow) K.plot(ctx, g, pts, KC.blue, { w: 3 });
        else K.plot(ctx, g, pts, "rgba(160,175,220,.45)", { w: 1.6, dash: [5, 4], glow: false });
      });
      K.pill(ctx, "약하게", g.R - 74, g.T + 18, { a: "right", s: 10.5, c: pow === "weak" ? KC.blue : KC.dim });
      K.pill(ctx, "강하게", g.R - 8, g.T + 18, { a: "right", s: 10.5, c: pow === "strong" ? KC.blue : KC.dim });
      var px = g.X(t), py = g.Y(hh);
      vline(ctx, px, g.T, g.B, A(KC.yellow, 0.6));
      K.glow(ctx, px, py, 5, okr ? "rgba(63,211,163,.95)" : (hh > 60 ? "rgba(255,107,129,.95)" : "rgba(255,211,107,.95)"), 4);
      K.pill(ctx, t + "분 · " + hh.toFixed(1) + "%", px + (t > 80 ? -12 : 12), py + (hh > 50 ? 26 : -12), { a: t > 80 ? "right" : "left", s: 11.5, c: hc, box: [RX, W] });
    }
    function update() {
      draw();
      var hh = hum(pow, t), okr = hh >= 40 && hh <= 60;
      readout("b-hum-read", [
        ["교실 습도", hh.toFixed(1) + "%", okr ? "g" : (hh > 60 ? "r" : "y"), "처음 25% · 알맞은 범위 40~60%"],
        ["가동", P[pow].n + " · " + t + "분", "b"]
      ], hh > 60 ? ["r", "60% 초과 · 결로와 곰팡이 주의"] : (okr ? (t <= 30 ? ["g", "30분 안에 알맞은 습도"] : ["g", "알맞지만 30분을 넘겨 걸림"]) : ["r", "아직 건조합니다"]));
      if (t <= 30 && hh >= 40 && hh <= 60 && !got.a) got.a = true;
      if (pow === "strong" && hh > 60 && !got.b) got.b = true;
      window.sthState("humGot", got);
      put("b-hum-info", P[pow].n + " " + t + "분 가동: 습도 " + hh.toFixed(1) + "%. "
        + (hh > 60 ? "✅ 60%를 넘었습니다. 창문에 물이 맺히고 곰팡이가 생기기 쉽습니다." : (hh >= 40 ? (t <= 30 ? "✅ 30분 안에 알맞은 습도에 이르렀습니다." : "알맞은 습도지만 30분이 넘게 걸렸습니다.") : "아직 40%가 안 됩니다.")));
      mission();
    }
    function mission() {
      if (got.a) done("m2-2a"); if (got.b) done("m2-2b"); if (got.q) done("m2-2c");
      if (got.a && got.b && got.q && !ep.cleared(1)) {
        window.sthState("humBest", "강하게 20~30분 → 40~50%, 1시간 넘게 틀면 60% 초과");
        window.sthMission("m2-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("humBest") + ". 가설(가습기로 습도가 오른다)이 지지되었고, 알맞게 쓰는 조건도 찾았습니다.");
        ep.clear(1);
      } else if (got.a && got.b && got.q) window.sthMission("m2-2", true);
    }
    canvas._redraw = draw;
    playBtn("b-hum-play", function () { return playing; }, function (q) { playing = q; }, "⏸ 김 멈추기", "▶ 김 움직이기");
    K.animate(canvas, function (dt) { if (playing && t > 0) { tt += dt / 1000; draw(); } });
    segWire("b-pow", "data-v", function (x) { pow = x; update(); });
    $("b-t").addEventListener("input", function (ev) { t = +ev.target.value; $("b-t-val").textContent = t + "분"; update(); });
    window.sthPick({
      mount: "b-hum-pick",
      q: "교실 습도를 알맞게 유지하는 방법으로 가장 알맞은 것은?",
      options: ["가습기를 강하게 하루 종일 틀어 둔다", "습도계를 보며 40~60%를 넘지 않도록 세기와 시간을 조절한다", "습도는 높을수록 좋으니 신경 쓰지 않는다"],
      answer: 1,
      why: ["60%를 넘어 결로와 곰팡이가 생깁니다.", "재면서 조절하는 것이 핵심입니다. 해결책도 결과를 확인하며 고쳐 가야 합니다.", "너무 높은 습도는 곰팡이와 집먼지진드기를 늘립니다."],
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
    var tt = 0, playing = !REDUCE;
    var TC = [["#4fa3d9", "#1f5f8f"], ["#3fd3a3", "#1a7a5c"], ["#ff9d63", "#b5562a"], ["#b69cff", "#5f45b0"]];
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var r = rise(n, win), ok = win === "shut" && r >= 10 && rise(n - 1, win) < 10, LW = 580, i;
      /* ── 왼쪽: 교실 단면 ── */
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 15, title: "교실 180 m³ · 20 °C · 한 시간" });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      var fl = ctx.createLinearGradient(0, H - 56, 0, H); fl.addColorStop(0, "#3d2e22"); fl.addColorStop(1, "#1d140d");
      ctx.fillStyle = fl; ctx.fillRect(0, H - 56, LW, 56);
      ctx.fillStyle = "rgba(150,200,255," + (r / 20 * 0.16).toFixed(3) + ")"; ctx.fillRect(0, 0, LW, H - 56);
      ctx.restore();
      /* 창문 (오른쪽 벽) */
      var wx = 506, wy = 70, ww = 56, wh = 120, open = win === "vent";
      ctx.fillStyle = "#6b5a48"; ctx.fillRect(wx - 5, wy - 5, ww + 10, wh + 10);
      var gl = ctx.createLinearGradient(wx, wy, wx + ww, wy + wh); gl.addColorStop(0, open ? "#5a8fd0" : "#24477c"); gl.addColorStop(1, open ? "#9cc8f0" : "#0b1a38");
      ctx.fillStyle = gl; ctx.fillRect(wx, wy, ww, wh);
      if (open) { ctx.fillStyle = "rgba(20,30,60,.85)"; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx + 22, wy + 10); ctx.lineTo(wx + 22, wy + wh - 10); ctx.lineTo(wx, wy + wh); ctx.closePath(); ctx.fill(); }
      else { ctx.strokeStyle = "rgba(255,255,255,.13)"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(wx + 10, wy + wh); ctx.lineTo(wx + 40, wy); ctx.stroke(); }
      /* 칠판 (뒤쪽 벽) */
      ctx.fillStyle = "#6b4a2c"; ctx.fillRect(96, 116, 300, 92);
      var cb = ctx.createLinearGradient(100, 120, 392, 204); cb.addColorStop(0, "#2a5a45"); cb.addColorStop(1, "#16382a");
      ctx.fillStyle = cb; ctx.fillRect(100, 120, 292, 84);
      /* 빨래 건조대와 수건 */
      var bar = ctx.createLinearGradient(0, 88, 0, 96); bar.addColorStop(0, "#e3e8f5"); bar.addColorStop(1, "#6f7896");
      ctx.fillStyle = bar; ctx.fillRect(30, 88, 456, 7);
      ctx.fillStyle = "#5b647f"; ctx.fillRect(34, 95, 5, H - 151); ctx.fillRect(477, 95, 5, H - 151);
      for (i = 0; i < n; i++) {
        var x = 46 + i * 36, c = TC[i % 4], cg = ctx.createLinearGradient(x, 0, x + 28, 0);
        cg.addColorStop(0, c[1]); cg.addColorStop(0.5, c[0]); cg.addColorStop(1, c[1]);
        ctx.fillStyle = cg; ctx.beginPath(); ctx.roundRect(x, 94, 28, 120, [2, 2, 5, 5]); ctx.fill();
        ctx.fillStyle = "rgba(0,0,30,.28)"; ctx.fillRect(x, 182, 28, 32);
        ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 1; for (var s = 0; s < 4; s++) { ctx.beginPath(); ctx.moveTo(x + 3, 110 + s * 24); ctx.lineTo(x + 25, 110 + s * 22); ctx.stroke(); }
        var du = (tt * 0.7 + i * 0.37) % 1;
        ctx.globalAlpha = 1 - du; ctx.fillStyle = "rgba(127,211,255,.9)"; ctx.beginPath(); ctx.arc(x + 14, 218 + du * 40, 2.2, 0, 6.2832); ctx.fill(); ctx.globalAlpha = 1;
      }
      /* 수증기: 닫으면 방에 머물고, 환기하면 절반이 창밖으로 */
      if (n > 0) {
        floatUp(ctx, n * 5, 41, tt * 0.22, 46, 46 + n * 36 - 8, 200, 40, "rgba(200,230,255,.8)", 2.6, 0);
        if (open) floatUp(ctx, n * 2, 57, tt * 0.25, 46 + n * 18, 46 + n * 36, 150, 120, "rgba(200,230,255,.8)", 2.2, wx - 46 - n * 27);
      }
      if (open) {
        K.arrow(ctx, { x: wx - 70, y: 140 }, { x: wx + 40, y: 140 }, KC.yellow, 2.2, 10);
        K.pill(ctx, "20분마다 환기 → 수증기의 절반이 밖으로", LW - 14, 248, { a: "right", s: 11.5, c: KC.yellow, box: [0, LW] });
      }
      K.pill(ctx, n > 0 ? "젖은 수건 " + n + "장 · 물 " + (n * 50) + " g이 수증기로" : "수건을 널어 보세요", 16, H - 16, { s: 12, c: KC.blue });
      K.pill(ctx, open ? "창문 열림" : "창문 닫힘", wx + ww / 2, wy + wh + 28, { a: "center", s: 11, c: open ? KC.yellow : KC.mute, box: [0, LW] });

      /* ── 오른쪽: 습도 막대 ── */
      var RX = LW + 8;
      K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 2, title: "한 시간 뒤 습도" });
      var bx = RX + 120, bw = 44, yT = 64, yB = H - 30;
      function Y(q) { return yB - (q - 20) / 30 * (yB - yT); }
      var tg = ctx.createLinearGradient(bx, 0, bx + bw, 0); tg.addColorStop(0, "rgba(255,255,255,.04)"); tg.addColorStop(0.5, "rgba(255,255,255,.12)"); tg.addColorStop(1, "rgba(255,255,255,.04)");
      ctx.fillStyle = tg; ctx.beginPath(); ctx.roundRect(bx, yT, bw, yB - yT, 12); ctx.fill();
      ctx.strokeStyle = "rgba(200,210,255,.4)"; ctx.lineWidth = 1.5; ctx.stroke();
      var now = 25 + r, lg = ctx.createLinearGradient(0, Y(now), 0, yB); lg.addColorStop(0, ok || r >= 10 ? "#5ff0c0" : "#8fd8ff"); lg.addColorStop(1, "#1d5fa8");
      ctx.save(); ctx.shadowColor = r >= 10 ? KC.green : KC.blue; ctx.shadowBlur = 12;
      ctx.fillStyle = lg; ctx.beginPath(); ctx.roundRect(bx + 6, Y(now), bw - 12, yB - Y(now) - 6, 8); ctx.fill(); ctx.restore();
      [20, 30, 40, 50].forEach(function (q) { ctx.strokeStyle = "rgba(200,210,255,.45)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(bx + bw, Y(q)); ctx.lineTo(bx + bw + 8, Y(q)); ctx.stroke(); K.t(ctx, q + "%", bx + bw + 12, Y(q) + 4, { s: 10.5, c: KC.mute }); });
      hline(ctx, bx - 30, bx + bw + 100, Y(35), A(KC.yellow, 0.85));
      K.pill(ctx, "목표 35% (+10%p)", W - 12, Y(35) - 8, { a: "right", s: 11, c: KC.yellow, box: [RX, W] });
      ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(bx - 8, Y(25)); ctx.lineTo(bx + bw, Y(25)); ctx.stroke(); ctx.setLineDash([]);
      if (r >= 3) K.pill(ctx, "처음 25%", bx - 12, Y(25) + 4, { a: "right", s: 11, c: KC.mute, box: [RX, W] });
      K.pill(ctx, "지금 " + now.toFixed(1) + "%", bx - 12, Y(now) + 4, { a: "right", s: 12, c: r >= 10 ? KC.green : KC.blue, box: [RX, W] });
      return ok;
    }
    function update() {
      var ok = draw(), r = rise(n, win);
      readout("b-towel-read", [
        ["증발한 물", (n * 50) + " g", "b", "수건 " + n + "장 × 50 g" + (win === "vent" ? " · 환기로 절반이 밖으로" : "")],
        ["습도 변화", "+" + r.toFixed(1) + "%p", r >= 10 ? "g" : "y", "25% → " + (25 + r).toFixed(1) + "% · 한 장 = 50 g ÷ (180 m³ × 17.3 g/m³) ≈ " + PER.toFixed(1) + "%p"]
      ], ok ? ["g", "10%p를 넘기는 가장 적은 수"] : (r >= 10 ? ["g", "10%p 넘음 · 더 적게도 됩니다"] : ["r", win === "vent" ? "환기하면 효과가 절반" : "아직 10%p가 안 됩니다"]));
      put("b-towel-info", "수건 " + n + "장, 창문 " + (win === "shut" ? "닫음" : "20분마다 환기") + ": 한 시간 동안 습도가 " + r.toFixed(1) + "%p 오릅니다. "
        + (ok ? "✅ 7장이 가장 적은 수입니다. 가설은 지지되지만, 가습기 한 대 몫을 내려면 수건 여러 장이 필요합니다." : (win === "vent" ? "환기하면 수증기가 빠져나가 효과가 절반으로 줄어듭니다. 창문을 닫은 조건에서 찾으세요." : (r >= 10 ? "10%p는 넘었지만 더 적은 수로도 됩니다." : "아직 10%p가 안 됩니다."))));
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
    playBtn("b-towel-play", function () { return playing; }, function (q) { playing = q; }, "⏸ 수증기 멈추기", "▶ 수증기 움직이기");
    K.animate(canvas, function (dt) { if (playing && n > 0) { tt += dt / 1000; draw(); } });
    $("b-n").addEventListener("input", function (ev) { n = +ev.target.value; $("b-n-val").textContent = n + "장"; update(); });
    segWire("b-win", "data-v", function (x) { win = x; update(); });
    update(); mission();
  })();

  /* 장면 4 — 해결 과정 */
  (function () {
    var STEPS = [
      "문제 인식 — 겨울 교실이 건조해 목이 아프고 정전기가 난다 (습도 25%)",
      "가설 설정 — 가습기(또는 젖은 수건)를 쓰면 습도가 40~60%로 오를 것이다",
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
