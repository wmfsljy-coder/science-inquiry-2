/* 과학탐구실험2 Ⅱ-2 미래 사회와 첨단 과학 탐구 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";
var K = window.sthKit, LT = K.LT;
/* 흰 판정 카드 한 장: rows = [[이름, 값, 색], …], tip = [글, 좋음] */
function verdict(ctx, x, y, w, h, title, rows, tip, big) {
  K.card(ctx, x, y, w, h, title);
  var x0 = x + 16, x1 = x + w - 16, yy = y + 52;
  if (big) { K.t(ctx, big[0], x0, yy + 6, { s: 24, w: "900", c: big[1] }); yy += 38; }
  rows.forEach(function (r) { K.row(ctx, r[0], r[1], x0, x1, yy, r[2]); yy += 26; });
  if (tip) K.tip(ctx, tip[0], x0 - 4, y + h - 44, x1 - x0 + 8, tip[1]);
}
function legend(ctx, items, x, y) {
  items.forEach(function (it) {
    K.t(ctx, "●", x, y, { s: 11, w: "900", c: it[1] }); K.t(ctx, it[0], x + 13, y, { s: 11, w: "800", c: LT.mute });
    ctx.font = "800 11px " + K.FONT; x += 13 + ctx.measureText(it[0]).width + 16;
  });
}

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 태양광 패널 각도 */
  {
    id: "c1", about: "01", tag: "첨단 에너지 기술 · 빛을 정면으로", title: "계절마다 각도를 바꾸는 태양광 패널", short: "태양광 각도",
    who: "☀️", name: "학교 태양광 발전 동아리",
    say: "“우리 학교(북위 37°) 옥상의 태양광 패널은 햇빛을 <b>정면으로</b> 받을수록 전기를 많이 만듭니다. 한낮의 태양 고도는 여름(하지)에 76.5°, 겨울(동지)에 29.5°예요. 패널 기울기를 계절마다 바꿔, 두 계절 모두 한낮 발전량이 최대치의 <b>98% 이상</b>이 되게 해 주세요.”",
    predict: {
      q: "태양이 낮게 뜨는 겨울에는 패널을 어떻게 기울여야 할까요?",
      options: ["㉠ 눕혀야(기울기를 작게) 한다", "㉡ 세워야(기울기를 크게) 한다", "㉢ 계절과 상관없다"],
      answer: 1
    },
    task: "여름과 겨울의 패널 기울기를 정해 <b>두 계절 모두 98% 이상</b>이 되게 하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, ts = 37, tw = 37;
      function eff(alt, tilt) { return Math.max(0, Math.cos((90 - alt - tilt) * Math.PI / 180)); }
      /* 옥상 블록 위 태양광 패널(외쪽 = 남쪽). 패널은 아래 모서리를 축으로 tilt 만큼 세운다 */
      function panel(x, alt, tilt, name) {
        var HW = 442, X0 = x < 450 ? 0 : 458, e = eff(alt, tilt), ok = e >= 0.98;
        K.studio(ctx, X0, 0, HW, cv.H, { x: X0 + 150, y: 248, rx: 150, ry: 28 });
        var I = K.iso({ ox: X0 + 150, oy: 168, s: 0.8, L: 190, D: 90 }), ZB = 18, PW = 92, t = tilt * Math.PI / 180, a = alt * Math.PI / 180;
        I.box(ctx, 0, 0, 0, 190, 90, ZB, "#d9dee6", "#b9c0cc", "#9aa3b0");
        var xl = 48, zl = ZB + 10, xh = xl + PW * Math.cos(t), zh = zl + PW * Math.sin(t);
        K.line(ctx, I.P(xh, 25, ZB), I.P(xh, 25, zh), "#6b7280", 2.4); K.line(ctx, I.P(xh, 70, ZB), I.P(xh, 70, zh), "#6b7280", 2.4);
        K.line(ctx, I.P(xl, 25, ZB), I.P(xl, 25, zl), "#6b7280", 2.4); K.line(ctx, I.P(xl, 70, ZB), I.P(xl, 70, zl), "#6b7280", 2.4);
        var pg = ctx.createLinearGradient(I.P(xl, 15, zl).x, I.P(xl, 15, zl).y, I.P(xh, 80, zh).x, I.P(xh, 80, zh).y);
        pg.addColorStop(0, "#5b8def"); pg.addColorStop(1, "#1b3a8a");
        I.quad(ctx, I.P(xl, 15, zl), I.P(xh, 15, zh), I.P(xh, 80, zh), I.P(xl, 80, zl), pg, "#cfd8e6");
        for (var k = 1; k < 4; k++) K.line(ctx, I.P(xl, 15 + k * 65 / 4, zl), I.P(xh, 15 + k * 65 / 4, zh), "rgba(220,230,255,.55)", 1);
        K.line(ctx, I.P((xl + xh) / 2, 15, (zl + zh) / 2), I.P((xl + xh) / 2, 80, (zl + zh) / 2), "rgba(220,230,255,.55)", 1);
        /* 태양과 햇빛(패널 도착) */
        var cx = (xl + xh) / 2, cz = (zl + zh) / 2, sp = I.P(cx - 150 * Math.cos(a), 48, cz + 150 * Math.sin(a));
        K.sun(ctx, sp.x, sp.y, 9);
        [22, 48, 72].forEach(function (yy) { K.arrow(ctx, I.P(cx - 120 * Math.cos(a), yy, cz + 120 * Math.sin(a)), I.P(cx - 8 * Math.cos(a), yy, cz + 8 * Math.sin(a)), "#f59f00", 2.2, 8); });
        /* 패널에 수직인 방향(법선) */
        var nb = I.P(cx, 48, cz), ne = I.P(cx - 46 * Math.sin(t), 48, cz + 46 * Math.cos(t));
        K.line(ctx, nb, ne, ok ? LT.green : "#8a96a8", 1.6, [4, 3]);
        K.t(ctx, "패널에 수직", ne.x - 4, ne.y - 6, { s: 10.5, w: "800", a: "right", c: ok ? LT.green : LT.mute });
        K.t(ctx, "남 ←", I.P(0, 90, 0).x + 2, I.P(0, 90, 0).y + 16, { s: 10.5, w: "800", c: LT.mute });
        K.bigText(ctx, name, X0 + 14, 34, 18, "#ffffff");
        K.t(ctx, "태양 고도 " + alt + "°", X0 + 14, 56, { s: 12, w: "800", c: "#b7791f" });
        verdict(ctx, X0 + HW - 160, 76, 150, 200, "한낮 발전량", [["기울기", tilt + "°", LT.blue], ["기울기 + 고도", (tilt + alt) + "°", Math.abs(tilt + alt - 90) <= 12 ? LT.green : LT.ink]], [ok ? "98% 이상 달성" : "빛을 비스듬히 받음", ok], [(e * 100).toFixed(1) + "%", ok ? LT.green : LT.red]);
      }
      function draw() { ctx.clearRect(0, 0, W, cv.H); panel(230, 76.5, ts, "여름 한낮"); panel(660, 29.5, tw, "겨울 한낮"); }
      cv.canvas._redraw = draw;
      api.slider({ label: "여름 패널 기울기", min: 0, max: 90, step: 5, value: 37, fmt: function (x) { return x + "°"; }, onInput: function (x) { ts = x; draw(); } });
      api.slider({ label: "겨울 패널 기울기", min: 0, max: 90, step: 5, value: 37, fmt: function (x) { return x + "°"; }, onInput: function (x) { tw = x; draw(); } });
      api.info("발전량은 햇빛과 패널이 이루는 각에 따라 달라집니다. 햇빛이 패널에 수직으로 들어올 때(패널 기울기 + 태양 고도 = 90°) 가장 많습니다.");
      draw();
      return {
        judge: function () {
          var es = eff(76.5, ts), ew = eff(29.5, tw);
          if (es >= 0.98 && ew >= 0.98) return { ok: true, msg: "여름 " + ts + "° → " + (es * 100).toFixed(1) + "%, 겨울 " + tw + "° → " + (ew * 100).toFixed(1) + "%. 계절마다 햇빛을 정면으로 받습니다." };
          return { ok: false, msg: "여름 " + (es * 100).toFixed(1) + "%, 겨울 " + (ew * 100).toFixed(1) + "%. 패널 기울기 + 태양 고도 = 90°가 되게 해 보세요." };
        }
      };
    },
    hints: ["여름에는 90 − 76.5 = 13.5°, 겨울에는 90 − 29.5 = 60.5° 근처가 가장 좋습니다.", "여름 5~20°, 겨울 50~70°를 해 보세요."],
    solution: "여름 <b>5~20°</b>, 겨울 <b>50~70°</b>.",
    why: "태양 전지는 햇빛의 에너지를 전기로 바꾸는데, 같은 넓이의 패널이 받는 빛의 양은 햇빛이 수직으로 들어올 때 가장 많습니다. 태양 고도는 계절마다 달라서, 계절에 따라 기울기를 바꾸거나 태양을 따라 움직이는 추적 장치를 쓰면 발전량이 늘어납니다.<br>" +
      "기울기를 하나로 고정한다면 보통 그 지역의 위도(우리 학교 37°) 근처로 정합니다. 지구과학(태양 고도)과 물리(빛 에너지)가 만나는 첨단 기술입니다."
  },

  /* ------------------------------------------------------------------ 2. 드론 배터리 */
  {
    id: "c2", about: "02", tag: "첨단 운송 기술 · 무거우면 더 힘이 든다", title: "구호 물품 드론의 배터리 고르기", short: "드론 배터리",
    who: "🚁", name: "재난 구조 드론 연구팀",
    say: "“섬마을에 약을 나르는 드론을 만듭니다. 배터리 용량이 클수록 에너지가 많지만, 그만큼 배터리가 무거워져(1 Wh에 약 6.7 g) 떠 있는 데 힘이 더 듭니다. 드론 몸체와 약을 합친 무게는 1 kg이에요. <b>가장 오래</b>(23분 이상) 날 수 있는 배터리 용량을 골라 주세요.”",
    predict: {
      q: "배터리 용량을 두 배로 늘리면 비행 시간은?",
      options: ["㉠ 정확히 두 배가 된다", "㉡ 늘긴 하지만 무게도 늘어 두 배보다 적게 늘고, 너무 크면 오히려 줄 수 있다", "㉢ 변하지 않는다"],
      answer: 1
    },
    task: "배터리 용량을 정해 <b>비행 시간 23분 이상</b>을 만드세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(280), ctx = cv.ctx, W = cv.W, C = 60;
      function tmin(c) { return 0.4 * c / Math.pow(1 + c / 150, 1.5); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var t = tmin(C), ok = t >= 23, i;
        /* ── 왼쪽: 떠 있는 구호 드론 미니어처(배터리 상자가 용량만큼 커진다) ── */
        K.studio(ctx, 0, 0, 260, cv.H, { x: 130, y: 206, rx: 80, ry: 14 });
        var I = K.iso({ ox: 130, oy: 124, s: 0.9, L: 80, D: 80 }), Z = 34, bl = 10 + 44 * Math.sqrt(C / 400);
        [[0, 0], [80, 0], [0, 80], [80, 80]].forEach(function (q) { K.line(ctx, I.P(40, 40, Z + 6), I.P(q[0], q[1], Z + 8), "#495057", 3.2); });
        I.box(ctx, 40 - bl / 2, 30, Z - 12, 40 + bl / 2, 50, Z, "#ffd43b", "#f59f00", "#c77d00");
        I.box(ctx, 26, 26, Z, 54, 54, Z + 10, "#f1f3f5", "#ced4da", "#adb5bd");
        I.box(ctx, 33, 33, Z - 24, 47, 47, Z - 12, "#ffffff", "#ff8787", "#e03131");
        [[0, 0], [80, 0], [0, 80], [80, 80]].forEach(function (q) { var p = I.P(q[0], q[1], Z + 10); ctx.fillStyle = "rgba(120,140,170,.28)"; ctx.beginPath(); ctx.ellipse(p.x, p.y, 24, 11, 0, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "rgba(60,70,90,.5)"; ctx.lineWidth = 1; ctx.stroke(); K.planet(ctx, p.x, p.y, 3, "#868e96", "#343a40"); });
        var up = I.P(40, 40, Z + 18), dn = I.P(40, 40, Z - 26), lift = 16 + 30 * (1 + C / 150) / 3.7;
        K.arrow(ctx, { x: up.x + 74, y: up.y + 30 }, { x: up.x + 74, y: up.y + 30 - lift }, LT.blue, 3, 9);
        K.t(ctx, "들어 올리는 힘", up.x + 74, up.y + 46, { s: 10.5, w: "800", a: "center", c: LT.blue });
        K.arrow(ctx, { x: dn.x - 74, y: dn.y - 8 }, { x: dn.x - 74, y: dn.y - 8 + lift }, LT.red, 3, 9);
        K.t(ctx, "무게", dn.x - 82, dn.y + 4, { s: 10.5, w: "800", a: "right", c: LT.red });
        K.t(ctx, "노란 상자 = 배터리 " + C + " Wh", 130, cv.H - 14, { s: 11, w: "800", a: "center", c: "#b7791f" });
        K.bigText(ctx, t.toFixed(1) + "분", 14, 34, 22, ok ? "#7ee0a0" : "#ffffff");
        /* ── 가운데: 밝은 그래프 ── */
        K.studio(ctx, 268, 0, 372, cv.H, null);
        var g = K.chart(ctx, { x: 272, y: 26, w: 364, h: cv.H - 30, pl: 42, pb: 30, pt: 8, pr: 12, x0: 20, x1: 400, y0: 15, y1: 25, xt: 4, yt: 5, light: true, xl: "배터리 용량 (Wh)", yf: function (v) { return Math.round(v) + "분"; } });
        K.t(ctx, "용량에 따른 비행 시간", 284, 20, { s: 11.5, w: "800", c: LT.mute });
        ctx.fillStyle = "rgba(15,159,118,.08)"; ctx.fillRect(g.L, g.T, g.R - g.L, g.Y(23) - g.T);
        K.line(ctx, { x: g.L, y: g.Y(23) }, { x: g.R, y: g.Y(23) }, LT.orange, 1.5, [5, 4]);
        K.t(ctx, "목표 23분", g.L + 6, g.Y(23) - 6, { s: 11, w: "800", c: LT.orange });
        var pts = []; for (var c = 20; c <= 400; c += 10) pts.push([c, Math.max(15, tmin(c))]);
        K.plot(ctx, g, pts, LT.blue, { w: 2.6, light: true });
        K.planet(ctx, g.X(C), g.Y(Math.max(15, Math.min(25, t))), 6, ok ? "#69db7c" : "#ff8787", ok ? "#2b8a3e" : "#a61e1e");
        /* ── 오른쪽: 판정 카드 ── */
        verdict(ctx, 650, 0, 250, cv.H, "비행 기록", [["배터리 무게", (C / 150).toFixed(2) + " kg", LT.orange], ["전체 무게", (1 + C / 150).toFixed(2) + " kg", LT.ink], ["배터리 용량", C + " Wh", LT.blue]], [ok ? "23분 이상 난다" : (C < 260 ? "에너지가 모자람" : "너무 무거움"), ok], [t.toFixed(1) + " 분", ok ? LT.green : LT.red]);
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
    hints: ["그래프가 가장 높은 곳을 찾아보세요. 끝까지 늘리는 것이 답이 아닙니다.", "260~340 Wh 근처가 가장 깁니다."],
    solution: "배터리 용량 <b>260~340 Wh</b> (약 300 Wh).",
    why: "배터리를 키우면 에너지는 늘지만 무게도 늘어 떠 있는 데 드는 전력이 더 빨리 커집니다. 그래서 비행 시간은 어느 용량에서 가장 길고, 그보다 크면 오히려 줍니다. 이 모형에서는 배터리 무게가 몸체의 2배일 때가 가장 좋습니다.<br>" +
      "전기차, 인공위성, 우주 로켓도 같은 고민을 합니다. 배터리의 에너지 밀도(1 kg에 담긴 에너지)를 높이는 연구가 첨단 기술의 핵심인 까닭입니다. ※ 수업용 단순 모형입니다."
  },

  /* ------------------------------------------------------------------ 3. 우주 쓰레기 */
  {
    id: "c3", about: "03", tag: "과학 기술의 발전 방향 · 우주 환경", title: "위성 인터넷과 우주 쓰레기", short: "우주 쓰레기",
    who: "🛰️", name: "우주 교통 관리 위원회",
    say: "“한 위성 인터넷 회사가 위성 <b>20,000 기 이상</b>을 운영하려고 합니다. 그런데 수명이 끝난 위성을 그대로 두면 우주 쓰레기가 늘어 충돌 위험이 커지지요. 10년 뒤 한 해 충돌 위험이 <b>2% 이하</b>가 되도록, 올릴 위성 수와 다 쓴 위성의 처리 규칙을 정해 주세요.”",
    predict: {
      q: "수명이 끝난 위성을 빨리 대기권으로 끌어내려 태우면?",
      options: ["㉠ 우주 쓰레기가 줄어 충돌 위험이 낮아진다", "㉡ 아무 차이가 없다", "㉢ 오히려 충돌이 늘어난다"],
      answer: 0
    },
    task: "위성 수와 처리 규칙을 정해 <b>20,000 기 이상</b> 운영하면서 <b>충돌 위험 2% 이하</b>를 맞추세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(280), ctx = cv.ctx, W = cv.W, N = 30000, rule = "none";
      var F = { none: 1.0, y25: 0.6, y5: 0.1 };
      function debris() { return 30000 + N * F[rule]; }
      function risk() { return N * debris() / 4e8; }
      function draw() {
        H.paper(ctx, W, cv.H);
        var cx = 270, cy = 150, R = 74, d = debris(), i, rk = risk(), ok = N >= 20000 && rk <= 2;
        /* ── 왼쪽: 입체 지구와 낮은 궤도의 위성(파랑)·쓰레기(빨강·회색) ── */
        K.studio(ctx, 0, 0, 560, cv.H, { x: cx, y: cy + R + 40, rx: 150, ry: 18 });
        var nS = Math.round(N / 500), nOld = Math.round(N * F[rule] / 500), nBg = 60, Rq = K.rng(9);
        function orbitPt(k, tot, rr, tilt) { var a = k / tot * 6.2832 + rr * .01; return { x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr * tilt, back: Math.sin(a) < 0 }; }
        var pts = [];
        for (i = 0; i < nBg; i++) pts.push([orbitPt(i, nBg, R + 18 + Rq() * 40, .36 + Rq() * .1), 0]);
        for (i = 0; i < nOld; i++) pts.push([orbitPt(i * 1.7, nOld, R + 16 + Rq() * 38, .34 + Rq() * .12), 1]);
        for (i = 0; i < nS; i++) pts.push([orbitPt(i, nS, R + 22 + (i % 4) * 7, .30 + (i % 3) * .05), 2]);
        function dotP(q) { var p = q[0]; if (q[1] === 2) K.planet(ctx, p.x, p.y, 2.6, "#74c0fc", "#1864ab"); else if (q[1] === 1) K.planet(ctx, p.x, p.y, 2.2, "#ff8787", "#a61e1e"); else K.planet(ctx, p.x, p.y, 2, "#adb5bd", "#495057"); }
        pts.filter(function (q) { return q[0].back; }).forEach(dotP);
        K.earth(ctx, cx, cy, R);
        ctx.strokeStyle = "rgba(28,126,214,.35)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(cx, cy, R + 34, (R + 34) * .36, 0, 0, Math.PI); ctx.stroke();
        pts.filter(function (q) { return !q[0].back; }).forEach(dotP);
        K.bigText(ctx, "충돌 위험 " + rk.toFixed(2) + " %", 16, 36, 22, ok ? "#7ee0a0" : (rk <= 2 ? "#ffffff" : "#ff9a7a"));
        legend(ctx, [["위성", LT.blue], ["다 쓴 위성이 남긴 쓰레기", LT.red], ["원래 있던 쓰레기", "#868e96"]], 16, cv.H - 14);
        K.warn(ctx, 548, 30, "⚠ 점 하나 = 물체 500개, 궤도 높이는 과장", "right");
        /* ── 오른쪽: 판정 카드 ── */
        verdict(ctx, 572, 0, 328, cv.H, "10년 뒤 교통 상황", [["운영 위성", N.toLocaleString() + " 기", N >= 20000 ? LT.green : LT.red], ["우주 쓰레기", Math.round(d).toLocaleString() + " 개", LT.ink], ["다 쓴 위성 처리", { none: "그대로 둠", y25: "25년 안 제거", y5: "5년 안 제거" }[rule], LT.blue]],
          [N < 20000 ? "위성이 계획보다 적음" : (rk <= 2 ? "서비스와 우주 환경을 함께 지킴" : "충돌 위험 2% 초과"), ok], [rk.toFixed(2) + " %", rk <= 2 ? LT.green : LT.red]);
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
          if (N < 20000) return { ok: false, msg: "위성이 " + N.toLocaleString() + " 기뿐이라 계획한 20,000 기에 못 미칩니다." };
          if (rk > 2) return { ok: false, msg: "충돌 위험 " + rk.toFixed(2) + "% — 너무 높습니다. " + (rule !== "y5" ? "다 쓴 위성의 처리 규칙을 바꿔 보세요." : "위성 수를 줄여 보세요.") };
          return { ok: true, msg: N.toLocaleString() + " 기 · 5년 안 제거 → 충돌 위험 " + rk.toFixed(2) + "%. 서비스와 우주 환경을 함께 지켰습니다." };
        }
      };
    },
    hints: ["‘5년 안에 끌어내림’을 골라 보세요.", "위성 수는 꼭 필요한 20,000 기로 맞추세요."],
    solution: "<b>5년 안에 끌어내림</b>, 위성 <b>20,000 기</b>.",
    why: "궤도에 위성과 쓰레기가 많아지면 충돌이 늘고, 충돌로 생긴 조각이 다시 충돌을 부르는 연쇄(케슬러 증후군)가 일어날 수 있습니다. 그래서 수명이 끝난 위성을 정해진 기간 안에 대기권으로 끌어내려 태우는 규칙이 논의되고, 여러 나라가 규범을 강화하고 있습니다.<br>" +
      "첨단 기술의 발전 방향을 평가할 때는 편리함(기술 파급)과 함께 <b>환경과 미래 세대</b>에 미치는 영향까지 따져야 합니다. ※ 위험도 값은 수업용 모형입니다."
  }
  ]
});
})();
