/* 교과서 실험 — 교과서 탐구를 시뮬레이션으로 해 보고 하나만 바꿔 내 탐구로. 엔진: ../assets/inquiry.js
   교과서 쪽 번호는 비상교육 교과서. 내용은 교과서 문장을 옮기지 않고 짧게 줄여 새로 썼다. */
window.sthInquiry({ mount: "inq", key: "inq", result: "rInq", items: [
  { id: "e1", book: "과학탐구실험2", page: 24, title: "스마트 기기로 놀이기구 가속도 측정·비교", purpose: "놀이기구마다 스마트 기기 가속도 센서 값이 어떻게 달라지는지 비교해 기구의 운동을 설명한다.",
    steps: ["놀이기구의 운동과 관련된 과학 원리를 조사한다", "스마트 기기를 몸에 단단히 고정하고 놀이기구를 타며 가속도를 기록한다", "기구별 가속도-시간 그래프를 협업 플랫폼에 올려 비교한다", "가속도가 커지고 작아지는 때를 기구의 운동과 연결해 설명한다"],
    iv: "놀이기구 종류", dv: "센서 가속도의 가장 큰 값·가장 작은 값(m/s²)", cv: ["스마트 기기 위치·고정 방향", "측정 앱·설정"], safety: "탑승 안전 수칙을 지키고, 측정값은 내린 뒤에 확인한다.",
    extend: ["바이킹(그네)의 줄 길이만 바꾸면 가장 낮은 곳의 가속도가 달라질까", "바이킹이 올라가는 최대 각만 바꾸면 센서 값이 어떻게 달라질까", "회전 기구가 한 바퀴 도는 시간만 바꾸면?"],
    sim: { kind: "model", name: "가상 놀이기구 가속도계", noise: 0.03,
      note: "스마트폰 센서는 중력을 포함한 가속도(가만히 있으면 9.8 m/s²)를 잰다고 봅니다. 바이킹은 줄에 매달린 진자: 가장 낮은 곳 g(3−2cosθ), 끝점 g·cosθ. 회전 기구는 수평 등속 원운동: √(g²+(ω²r)²), ω = 2π/주기. 자이로드롭은 자유 낙하 중 0, 제동 거리를 낙하 거리의 절반으로 가정해 제동 중 3g. 마찰·공기 저항 무시, g = 9.8 m/s².",
      choices: [{ k: "ride", label: "놀이기구", opts: [["바이킹(진자)", 1], ["회전 기구(원운동)", 2], ["자이로드롭(낙하)", 3]], value: 1 }],
      inputs: [{ k: "L", label: "줄 길이 · 회전 반지름", unit: "m", min: 2, max: 20, step: 1, value: 10 },
               { k: "th", label: "바이킹 최대 각", unit: "°", min: 10, max: 80, step: 5, value: 60 },
               { k: "T", label: "회전 기구 한 바퀴 시간", unit: "s", min: 3, max: 12, step: 0.5, value: 6 }],
      outputs: [{ k: "amax", label: "센서 값 가장 클 때", unit: "m/s²", dp: 1, expr: "(function(){var g=9.8,c=Math.cos(th*Math.PI/180);if(ride==1)return g*(3-2*c);if(ride==2){var w=2*Math.PI/T;return Math.sqrt(g*g+Math.pow(w*w*L,2));}return 3*g;})()" },
                { k: "amin", label: "센서 값 가장 작을 때", unit: "m/s²", dp: 1, expr: "(function(){var g=9.8,c=Math.cos(th*Math.PI/180);if(ride==1)return g*c;if(ride==2){var w=2*Math.PI/T;return Math.sqrt(g*g+Math.pow(w*w*L,2));}return 0;})()" }] } },
  { id: "e2", book: "과학탐구실험2", page: 28, title: "진동 모터와 빨대 구조물로 제진 원리 실험", purpose: "진동 모터로 흔드는 빨대 구조물에 추를 매달았을 때와 아닐 때 흔들림을 비교해 제진 장치의 원리를 확인한다.",
    steps: ["진동 모터를 붙인 받침대를 만든다", "주름 빨대로 사각형 틀을 만들어 빵 끈으로 묶어 구조물을 세운다", "전원을 켜고 추 없이 흔들림을 본다", "구조물 위에 추를 실로 매달고 흔들림을 다시 비교한다"],
    iv: "구조물에 추를 매달기 여부", dv: "구조물 위쪽 흔들림 폭(mm)", cv: ["구조물 크기·재료", "진동 모터 세기", "받침대"], safety: "가위·칼을 쓸 때 손을 조심한다.",
    extend: ["추의 질량만 바꾸면 흔들림이 얼마나 줄어들까", "추를 매단 줄 길이만 바꿔 흔들림이 가장 줄어드는 길이 찾기", "모터 진동수만 바꾸면 추의 효과가 그대로일까"],
    sim: { kind: "model", name: "가상 제진 구조물", noise: 0.04,
      note: "받침대가 폭 1 mm로 흔들리는 2질량 진동 모형입니다. 구조물: 질량 200 g, 고유 진동수 3 Hz, 감쇠비 5 %. 매단 추는 실 길이 L인 진자(고유 진동수 √(g/L)/2π, 감쇠비 5 %)로 보고, 구조물 위쪽과 추가 정상 상태로 흔들리는 폭을 계산합니다.",
      choices: [{ k: "tmd", label: "추 매달기", opts: [["매닮", 1], ["매달지 않음", 0]], value: 1 }],
      inputs: [{ k: "f", label: "모터 진동수", unit: "Hz", min: 1, max: 6, step: 0.1, value: 3 },
               { k: "mt", label: "추의 질량", unit: "g", min: 5, max: 50, step: 5, value: 20 },
               { k: "L", label: "추를 매단 실 길이", unit: "cm", min: 1, max: 10, step: 0.5, value: 3 }],
      outputs: [{ k: "x1", label: "구조물 위쪽 흔들림 폭", unit: "mm", dp: 2, expr: "(function(){var w=2*Math.PI*f,m1=0.2,k1=m1*Math.pow(2*Math.PI*3,2),c1=2*0.05*Math.sqrt(k1*m1);function mul(a,b){return [a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];}function dv(a,b){var q=b[0]*b[0]+b[1]*b[1];return [(a[0]*b[0]+a[1]*b[1])/q,(a[1]*b[0]-a[0]*b[1])/q];}var Ka=[k1,w*c1],D=[k1-w*w*m1,w*c1];if(tmd==1){var m2=mt/1000,k2=m2*9.8/(L/100),c2=2*0.05*Math.sqrt(k2*m2),Kb=[k2,w*c2],T=[k2-w*w*m2,w*c2],KK=dv(mul(Kb,Kb),T);D=[D[0]+Kb[0]-KK[0],D[1]+Kb[1]-KK[1]];}var X=dv(Ka,D);return Math.sqrt(X[0]*X[0]+X[1]*X[1]);})()" },
                { k: "x2", label: "추의 흔들림 폭", unit: "mm", dp: 2, expr: "(function(){if(tmd!=1)return 0;var w=2*Math.PI*f,m1=0.2,k1=m1*Math.pow(2*Math.PI*3,2),c1=2*0.05*Math.sqrt(k1*m1);function mul(a,b){return [a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];}function dv(a,b){var q=b[0]*b[0]+b[1]*b[1];return [(a[0]*b[0]+a[1]*b[1])/q,(a[1]*b[0]-a[0]*b[1])/q];}var m2=mt/1000,k2=m2*9.8/(L/100),c2=2*0.05*Math.sqrt(k2*m2),Ka=[k1,w*c1],Kb=[k2,w*c2],T=[k2-w*w*m2,w*c2],KK=dv(mul(Kb,Kb),T),D=[k1-w*w*m1+k2-KK[0],w*c1+w*c2-KK[1]],X=dv(Ka,D),X2=dv(mul(Kb,X),T);return Math.sqrt(X2[0]*X2[0]+X2[1]*X2[1]);})()" }] } }
] });
