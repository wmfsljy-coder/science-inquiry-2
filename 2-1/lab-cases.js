/* 과학탐구실험2 Ⅰ-1 생활 속의 과학 탐구 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";

/* ---- 밝은 스튜디오 · 입체 미니어처 도구 (kit.js) ---- */
var K = window.sthKit, LT = K.LT;
function kShadow(ctx, x, y, rx, ry, a) {
  var g = ctx.createRadialGradient(x, y, 1, x, y, rx);
  g.addColorStop(0, "rgba(20,30,50," + (a == null ? .26 : a) + ")"); g.addColorStop(1, "rgba(20,30,50,0)");
  ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx); ctx.translate(-x, -y); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rx, 0, 6.2832); ctx.fill(); ctx.restore();
}
function kTag(ctx, px, py, txt, dx, dy, col, box) {
  var q = { x: px + dx, y: py + dy };
  ctx.strokeStyle = "rgba(20,25,40,.75)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(q.x, q.y); ctx.stroke();
  ctx.fillStyle = "#111622"; ctx.beginPath(); ctx.arc(px, py, 2.5, 0, 6.283); ctx.fill();
  return K.pill(ctx, txt, q.x + (dx < 0 ? -4 : 4), q.y + 4, { s: 11.5, a: dx < 0 ? "right" : "left", c: col || "#e8ecff", box: box });
}
function kRows(ctx, x0, x1, y, list, gap) { list.forEach(function (r, i) { K.row(ctx, r[0], r[1], x0, x1, y + i * (gap || 28), r[2]); }); }
/* 유리 원기둥(시험관·병·비커) */
function kGlass(ctx, cx, by, r, h, lh, liq, o) {
  o = o || {}; var e = o.e || .3, ry = r * e, ty = by - h, ly = by - lh;
  if (!o.noShadow) kShadow(ctx, cx + r * .3, by + ry * .5, r * 1.6, ry * 1.6, .24);
  ctx.fillStyle = "rgba(205,222,245,.3)"; ctx.beginPath(); ctx.moveTo(cx - r, ty); ctx.lineTo(cx - r, by); ctx.ellipse(cx, by, r, ry, 0, Math.PI, 0, true); ctx.lineTo(cx + r, ty); ctx.ellipse(cx, ty, r, ry, 0, 0, Math.PI, true); ctx.closePath(); ctx.fill();
  if (lh > 0 && liq) {
    ctx.fillStyle = liq; ctx.beginPath(); ctx.moveTo(cx - r + 1.5, ly); ctx.lineTo(cx - r + 1.5, by); ctx.ellipse(cx, by, r - 1.5, ry - .5, 0, Math.PI, 0, true); ctx.lineTo(cx + r - 1.5, ly); ctx.closePath(); ctx.fill();
    var sh = ctx.createLinearGradient(cx - r, 0, cx + r, 0); sh.addColorStop(0, "rgba(0,0,30,.22)"); sh.addColorStop(.35, "rgba(255,255,255,.12)"); sh.addColorStop(1, "rgba(0,0,30,.28)"); ctx.fillStyle = sh; ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.beginPath(); ctx.ellipse(cx, ly, r - 1.5, ry - .5, 0, 0, 6.2832); ctx.fill();
  }
  if (o.inside) o.inside(ly, ry);
  ctx.strokeStyle = "rgba(80,110,150,.78)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx - r, ty); ctx.lineTo(cx - r, by); ctx.ellipse(cx, by, r, ry, 0, Math.PI, 0, true); ctx.lineTo(cx + r, ty); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx, ty, r, ry, 0, 0, 6.2832); ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(cx - r * .66, ty + ry + 4, r * .18, Math.max(0, h - ry - 10));
}
/* 작은 도시 블록(관측소 백엽상 포함): o.snow 눈 덮임, o.sun 해 */
function kCity(ctx, ox, oy, s, o) {
  o = o || {}; var I = K.iso({ ox: ox, oy: oy, s: s, L: 160, D: 110 });
  I.box(ctx, 0, 0, -14, 160, 110, 0, o.snow ? "#eef3f7" : "#8fbf73", "#8a6a4a", "#6d523a");
  I.box(ctx, 0, 54, 0, 160, 68, .6, "#8d8f94", "#7a7c82", "#6b6d72");
  [[12, 8, 34, 34, 74], [42, 10, 62, 32, 46], [94, 6, 118, 34, 96], [124, 10, 150, 34, 58], [18, 78, 42, 102, 42], [112, 80, 140, 104, 66]].forEach(function (b) {
    I.box(ctx, b[0], b[1], 0, b[2], b[3], b[4], o.snow ? "#ffffff" : "#dde2ea", "#c3cad5", "#9ea7b5");
    for (var z = 10; z < b[4] - 6; z += 12) for (var x = b[0] + 4; x < b[2] - 4; x += 7) I.quad(ctx, I.P(x, b[3], z), I.P(x + 3.5, b[3], z), I.P(x + 3.5, b[3], z + 6), I.P(x, b[3], z + 6), o.night ? "#ffd86b" : "#7d95b8");
  });
  I.tree(ctx, 80, 92, 0, .7); I.tree(ctx, 150, 92, 0, .6);
  [[66, 80], [72, 80], [66, 86], [72, 86]].forEach(function (q) { I.box(ctx, q[0], q[1], 0, q[0] + 1.5, q[1] + 1.5, 16, "#f4f4f0", "#d8d8d2", "#bdbdb6"); });
  I.box(ctx, 64, 78, 16, 76, 90, 28, "#ffffff", "#eceeea", "#cfd3cc");
  if (o.sun) K.sun(ctx, ox + 70 * s, oy - 70 * s, 7);
  return I;
}

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 전자레인지와 초콜릿 */
  {
    id: "c1", about: "01", tag: "요리 속 파동 · 정상파", title: "초콜릿으로 빛의 속력 재기", short: "전자레인지 정상파",
    who: "🍫", name: "과학 요리 동아리",
    say: "“전자레인지 안에서는 마이크로파(진동수 2.45 GHz)가 벽에 반사되어 <b>전기장이 세게 진동하는 곳과 거의 진동하지 않는 곳</b>이 번갈아 생긴대요. 회전판을 빼고 초콜릿 판을 잠깐 데우면 세게 진동하는 곳만 녹아요. 녹은 자국 사이 거리는 파장의 절반이니, 빛의 속력 = 2 × 자국 간격 × 진동수 로 빛(전자기파)의 속력을 구할 수 있지요. 자를 맞춰 간격을 재고 <b>빛의 속력(3 × 10⁸ m/s)의 ± 5%</b> 안으로 구해 주세요.”",
    predict: {
      q: "회전판을 그대로 둔 채 초콜릿을 데우면 어떻게 될까요?",
      options: ["㉠ 녹은 자국이 더 뚜렷해진다", "㉡ 초콜릿이 돌면서 여러 곳을 지나 고르게 녹아, 자국 간격을 잴 수 없다", "㉢ 전혀 녹지 않는다"],
      answer: 1
    },
    task: "회전판을 정하고 자의 눈금 간격을 녹은 자국에 맞춰, <b>빛의 속력 2.85~3.15 × 10⁸ m/s</b>를 구하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W;
      var turn = "on", d = 4.0, TRUE_D = 6.12;
      function c() { return 2 * d / 100 * 2.45e9; }
      var IC = K.iso({ ox: 92, oy: 108, s: .55, L: 520, D: 104 }), IO = K.iso({ ox: 430, oy: 84, s: .48, L: 170, D: 130 });
      function blob(cx, cy, rx, ry, z, col) { ctx.beginPath(); for (var k = 0; k <= 20; k++) { var a = k / 20 * 6.2832, p = IC.P(cx + rx * Math.cos(a), cy + ry * Math.sin(a), z); if (k) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); }
      function draw() {
        H.paper(ctx, W, cv.H);
        /* 전자레인지 */
        var oc = IO.P(85, 65, 0); kShadow(ctx, oc.x + 10, oc.y + 30, 80, 14, .25);
        IO.box(ctx, 0, 0, 0, 170, 130, 104, "#eef0f4", "#cfd4dc", "#a3abb8");
        IO.quad(ctx, IO.P(12, 130, 14), IO.P(122, 130, 14), IO.P(122, 130, 92), IO.P(12, 130, 92), "#1f2633", "rgba(0,0,0,.4)");
        if (turn === "on") { var tp0 = IO.P(67, 130, 30); ctx.strokeStyle = "rgba(160,200,240,.8)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(tp0.x, tp0.y, 30, 7, 0, 0, 6.2832); ctx.stroke(); }
        IO.quad(ctx, IO.P(132, 130, 20), IO.P(160, 130, 20), IO.P(160, 130, 92), IO.P(132, 130, 92), "#3a4054");
        K.t(ctx, turn === "on" ? "회전판 있음" : "회전판 뺌", IO.P(170, 130, 0).x - 10, IO.P(170, 130, 0).y + 18, { s: 11, w: "800", a: "center", c: LT.mute });
        /* 초콜릿 판 */
        var c0 = IC.P(260, 40, 0); kShadow(ctx, c0.x + 20, c0.y + 30, 250, 30, .25);
        IC.box(ctx, 0, 0, 0, 520, 60, 8, "#7a4524", "#4e2a12", "#3e210e");
        ctx.strokeStyle = "rgba(40,20,8,.45)"; ctx.lineWidth = 1;
        for (var q = 40; q < 520; q += 40) { var a = IC.P(q, 0, 8), b = IC.P(q, 60, 8); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        if (turn === "off") { for (var k = 0; k * TRUE_D <= 25; k++) { var mx = (1 + k * TRUE_D) * 20; blob(mx, 30, 16, 24, 8.2, "rgba(214,160,110,.95)"); blob(mx - 3, 26, 8, 12, 8.4, "rgba(255,226,190,.8)"); } }
        else blob(260, 30, 250, 26, 8.2, "rgba(214,160,110,.35)");
        /* 자 */
        IC.box(ctx, 0, 76, 0, 520, 98, 4, "#f6ecca", "#d9c79a", "#bfae80");
        for (var j = 0; j * d <= 25.5; j++) { var tx = (1 + j * d) * 20, t0 = IC.P(tx, 76, 4), t1 = IC.P(tx, 98, 4); ctx.strokeStyle = LT.ink; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(t0.x, t0.y); ctx.lineTo(t1.x, t1.y); ctx.stroke(); }
        for (var cm = 0; cm <= 24; cm += 4) { var lp = IC.P(cm * 20, 98, 0); K.t(ctx, cm + (cm === 24 ? " cm" : ""), lp.x - 2, lp.y + 13, { s: 9.5, w: "700", a: "center", c: LT.mute }); }
        var box = [0, 560];
        if (turn === "off") { var sp = IC.P((1 + TRUE_D) * 20, 30, 8); kTag(ctx, sp.x, sp.y, "녹은 자국", -40, -44, "#ffe2cc", box); }
        var rp = IC.P(20, 76, 4); kTag(ctx, rp.x, rp.y, "자 눈금 (첫 눈금 1 cm)", -14, -46, "#e8ecff", box);
        var v = c() / 1e8, ok = turn === "off" && v >= 2.85 && v <= 3.15;
        var RX = 600, px = RX + 18, xr = W - 18;
        K.card(ctx, RX, 8, W - RX - 8, cv.H - 16, "자국 간격으로 빛의 속력 재기");
        K.row(ctx, "자 눈금 간격 (= 자국 간격)", d.toFixed(1) + " cm", px, xr, 64);
        K.row(ctx, "파장 = 2 × 간격", (2 * d).toFixed(1) + " cm", px, xr, 92);
        K.row(ctx, "진동수", "2.45 GHz", px, xr, 120);
        K.t(ctx, "빛의 속력", px, 160, { s: 12, w: "800", c: LT.mute });
        K.t(ctx, v.toFixed(2) + " × 10⁸ m/s", px, 188, { s: 21, w: "900", c: ok ? LT.green : LT.red });
        K.tip(ctx, turn !== "off" ? "회전판이 돌면 고르게 녹는다" : (ok ? "빛의 속력에 가깝다" : "눈금이 자국과 어긋난다"), px - 4, 206, xr - px + 8, ok);
        K.t(ctx, "빛의 속력 = 2 × 간격 × 진동수", px, 266, { s: 11, w: "700", c: LT.mute });
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
    id: "c2", about: "01", tag: "스포츠 속 힘 · 멈추는 거리를 늘리면", title: "높이뛰기 매트의 두께", short: "착지 매트",
    who: "🤸", name: "학교 체육부",
    say: "“높이뛰기 선수는 2 m 높이에서 등으로 떨어집니다. 몸이 받는 평균 힘이 <b>몸무게의 6배 이하</b>여야 다치지 않는다고 해요. 매트는 두께의 80%까지 눌리며 선수를 멈춥니다. 너무 두꺼운 매트는 비싸고 착지가 불안정하니 <b>0.8 m 이하</b>로 골라 주세요.”",
    predict: {
      q: "같은 높이에서 떨어질 때 모래보다 두꺼운 매트가 덜 아픈 까닭은?",
      options: ["㉠ 매트가 선수를 가볍게 만들어서", "㉡ 멈추기까지의 거리와 시간이 길어져, 받는 힘이 작아지기 때문에", "㉢ 매트가 떨어지는 속력을 없애 주어서"],
      answer: 1
    },
    task: "착지면과 매트 두께를 정해 <b>받는 힘 ≤ 몸무게 × 6</b>, <b>두께 ≤ 0.8 m</b>를 함께 맞추세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W;
      var surf = "sand", t = 0.2, HT = 2;
      function stopD() { return surf === "concrete" ? 0.01 : (surf === "sand" ? 0.08 : 0.8 * t); }
      function ratio() { return 1 + HT / stopD(); }
      var IG = K.iso({ ox: 200, oy: 150, s: .5, L: 320, D: 200 });
      function draw() {
        H.paper(ctx, W, cv.H);
        var th = surf === "mat" ? t * 100 : (surf === "sand" ? 10 : 3), ct = IG.P(160, 100, 0), box = [0, 470];
        kShadow(ctx, ct.x + 20, ct.y + 40, 210, 30, .25);
        IG.box(ctx, 0, 0, -16, 320, 200, 0, "#8fbf73", "#8a6a4a", "#6d523a");
        /* 착지면 */
        var top = surf === "mat" ? "#5b8fd6" : (surf === "sand" ? "#e3c07a" : "#b6bcc4"), fr = surf === "mat" ? "#3d6fb3" : (surf === "sand" ? "#c9a35c" : "#9aa1aa"), rt = surf === "mat" ? "#2e5590" : (surf === "sand" ? "#ab8746" : "#828993");
        IG.box(ctx, 70, 50, 0, 250, 170, th, top, fr, rt);
        /* 바(2 m) 기둥 */
        IG.box(ctx, 56, 20, 0, 62, 26, 200, "#e6e9ee", "#c9ced6", "#9aa3b0"); IG.box(ctx, 56, 180, 0, 62, 186, 200, "#e6e9ee", "#c9ced6", "#9aa3b0");
        var b0 = IG.P(59, 23, 200), b1 = IG.P(59, 183, 200); ctx.strokeStyle = "#e8590c"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(b0.x, b0.y); ctx.lineTo(b1.x, b1.y); ctx.stroke();
        /* 떨어지는 선수 */
        var pz = th + 200, pp = IG.P(160, 110, pz), pg = IG.P(160, 110, th);
        K.line(ctx, { x: pp.x, y: pp.y + 4 }, { x: pg.x, y: pg.y }, "rgba(20,40,90,.5)", 1.5, [5, 4]);
        IG.person(ctx, 160, 110, pz, "#7048e8", 2.4);
        K.t(ctx, "2 m", (pp.x + pg.x) / 2 + 10, (pp.y + pg.y) / 2, { s: 12, w: "900", c: LT.ink });
        var sl = IG.P(250, 170, th); kTag(ctx, sl.x, sl.y, surf === "mat" ? "매트 " + t.toFixed(2) + " m (멈추는 거리 " + stopD().toFixed(2) + " m)" : (surf === "sand" ? "모래 (멈추는 거리 약 0.08 m)" : "콘크리트 (멈추는 거리 약 0.01 m)"), 20, 34, "#e8ecff", box);
        var r = ratio(), ok = surf === "mat" && r <= 6 && t <= 0.8;
        var RX = 500, px = RX + 18, xr = W - 18;
        K.card(ctx, RX, 8, W - RX - 8, cv.H - 16, "선수가 받는 평균 힘");
        K.t(ctx, r.toFixed(1) + " 배", px, 72, { s: 26, w: "900", c: r <= 6 ? LT.green : LT.red });
        K.t(ctx, "몸무게의", px + 120, 72, { s: 12, w: "700", c: LT.mute });
        K.bar(ctx, px, 86, xr - px, Math.min(r, 30) / 30, r <= 6 ? LT.green : LT.red);
        K.t(ctx, "안전 기준 6배", px + (xr - px) * 6 / 30, 116, { s: 10.5, w: "800", a: "center", c: LT.mute });
        K.line(ctx, { x: px + (xr - px) * 6 / 30, y: 82 }, { x: px + (xr - px) * 6 / 30, y: 102 }, LT.ink, 1.5);
        K.row(ctx, "멈추는 거리", stopD().toFixed(2) + " m", px, xr, 150);
        K.row(ctx, "매트 두께 한계", "0.8 m 이하", px, xr, 178, t > 0.8 && surf === "mat" ? LT.red : LT.ink);
        K.tip(ctx, ok ? "안전하게 착지" : (surf !== "mat" ? "다칠 위험" : (t > 0.8 ? "너무 두껍다" : "아직 위험")), px - 4, 196, xr - px + 8, ok);
        K.t(ctx, "평균 힘 ≈ 몸무게 × (1 + 높이 ÷ 멈추는 거리)", px, 262, { s: 10.5, w: "700", c: LT.mute });
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
    id: "c3", about: "01", tag: "건축 속 열 · 전도와 대류", title: "이중창 공기층은 넓을수록 좋을까", short: "이중창",
    who: "🏠", name: "학교 리모델링 설계팀",
    say: "“교실 창을 바꾸려고 해요. 유리 안쪽에 복사열을 막는 로이(Low-E) 코팅을 한 이중창은 유리 사이 공기층이 열이 빠져나가는 것을 막아 줍니다. 공기층을 넓힐수록 좋을 것 같지만, 너무 넓으면 공기가 안에서 빙글빙글 돌기 시작한대요. 창의 열 손실 값(U, 작을수록 좋음)을 <b>1.5 W/(m²·K) 이하</b>로 만드는 공기층 두께를 찾아 주세요.”",
    predict: {
      q: "공기층을 5 mm에서 30 mm로 계속 넓히면 열 손실은?",
      options: ["㉠ 넓힐수록 계속 줄어든다", "㉡ 어느 두께까지는 줄다가, 그보다 넓으면 공기가 돌며(대류) 오히려 조금 늘어난다", "㉢ 두께와 상관없다"],
      answer: 1
    },
    task: "창의 종류와 공기층 두께를 정해 <b>U ≤ 1.5</b>가 되게 하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, type = "single", g = 6;
      function U(gg) { if (type === "single") return 5.8; var R = gg <= 13 ? 0.04 * gg : 0.52 - 0.006 * (gg - 13); return 1 / (0.17 + R); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var gr = K.chart(ctx, { x: 4, y: 8, w: 420, h: cv.H - 12, pl: 40, pt: 28, pb: 32, pr: 12, x0: 0, x1: 30, y0: 1, y1: 6, xt: 3, yt: 5, light: true, xf: function (v) { return v + " mm"; }, yf: function (v) { return String(Math.round(v)); } });
        K.t(ctx, "열 손실 U", gr.L + 2, 22, { s: 11.5, w: "800", c: LT.mute });
        K.line(ctx, { x: gr.L, y: gr.Y(1.5) }, { x: gr.R, y: gr.Y(1.5) }, LT.yellow, 1.6, [5, 4]);
        K.t(ctx, "목표 1.5", gr.R - 4, gr.Y(1.5) - 6, { s: 10.5, w: "800", a: "right", c: "#b07400" });
        if (type === "double") { var pts = []; for (var gg = 1; gg <= 30; gg++) pts.push([gg, U(gg)]); K.plot(ctx, gr, pts, LT.blue, { w: 3, light: true }); }
        var ux = type === "double" ? g : 0, uy = U(g); ctx.fillStyle = uy <= 1.5 ? LT.green : LT.red; ctx.beginPath(); ctx.arc(gr.X(ux), gr.Y(uy), 6.5, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.stroke();
        /* 창 단면 입체 모형 */
        var gp = type === "double" ? Math.max(4, g * 2.4) : 0, LX = 16 + gp + (type === "double" ? 8 : 0) + 16;
        var IW = K.iso({ ox: 592, oy: 74, s: .7, L: LX, D: 120 });
        var mc = IW.P(LX / 2, 60, 0); kShadow(ctx, mc.x + 10, mc.y + 40, 90, 14, .25);
        IW.box(ctx, 0, 0, 0, LX, 120, 10, "#d8dde5", "#b7bfcb", "#9aa3b0");
        IW.box(ctx, 16, 0, 10, 24, 120, 170, "rgba(170,215,240,.85)", "rgba(140,195,230,.7)", "rgba(110,170,215,.8)");
        if (type === "double") {
          IW.box(ctx, 24, 0, 10, 24 + gp, 120, 170, "rgba(240,246,252,.35)", "rgba(230,240,250,.25)", "rgba(220,232,246,.3)");
          IW.box(ctx, 24 + gp, 0, 10, 32 + gp, 120, 170, "rgba(190,225,200,.85)", "rgba(150,205,170,.7)", "rgba(120,180,145,.8)");
          if (g > 13) { var lc = [IW.P(24 + gp * .3, 120, 40), IW.P(24 + gp * .3, 120, 140), IW.P(24 + gp * .7, 120, 140), IW.P(24 + gp * .7, 120, 40)]; K.arrow(ctx, lc[0], lc[1], LT.red, 2, 8); K.arrow(ctx, lc[2], lc[3], LT.blue, 2, 8); }
        }
        IW.box(ctx, 0, 0, 170, LX, 120, 180, "#d8dde5", "#b7bfcb", "#9aa3b0");
        var po = IW.P(0, 0, 180), pi = IW.P(LX, 120, 20);
        K.pill(ctx, "밖 0 °C", po.x - 8, po.y - 6, { s: 11.5, a: "right", c: "#bfe6ff" });
        K.pill(ctx, "안 20 °C", pi.x + 8, pi.y + 18, { s: 11.5, c: "#ffd0c0", box: [0, 686] });
        if (type === "double") { var pg = IW.P(24 + gp / 2, 120, 12); K.t(ctx, "공기층 " + g + " mm", pg.x, pg.y + 22, { s: 11, w: "800", a: "center", c: LT.mute }); }
        var RX = 690, px = RX + 16, xr = W - 16;
        K.card(ctx, RX, 8, W - RX - 8, cv.H - 16, "창의 열 손실");
        K.t(ctx, "U = " + uy.toFixed(2), px, 70, { s: 22, w: "900", c: uy <= 1.5 ? LT.green : LT.red });
        K.row(ctx, "창의 종류", type === "single" ? "유리 한 장" : "로이 이중창", px, xr, 104);
        K.row(ctx, "공기층", type === "single" ? "없음" : g + " mm", px, xr, 132);
        K.row(ctx, "공기의 움직임", type === "double" && g > 13 ? "돌기 시작(대류)" : "거의 멈춤", px, xr, 160, type === "double" && g > 13 ? LT.red : LT.ink);
        K.tip(ctx, uy <= 1.5 ? "목표 달성" : "U 가 아직 크다", px - 4, 180, xr - px + 8, uy <= 1.5);
        K.t(ctx, "단위 W/(m²·K) · 작을수록 좋음", px, 262, { s: 10, w: "700", c: LT.mute });
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
