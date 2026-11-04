const { chromium } = require('playwright');
const fs = require('fs');
const logo = 'data:image/png;base64,' + fs.readFileSync('logo-badge.png').toString('base64');
const css = (m) => `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{width:${m?1080:1920}px;height:${m?1080:600}px;overflow:hidden;font-family:Poppins,sans-serif;color:#fff;
 background:radial-gradient(ellipse at ${m?'80% 75%':'78% 50%'},rgba(255,120,30,.38),transparent 55%),radial-gradient(ellipse at 10% 0%,rgba(245,179,1,.22),transparent 50%),linear-gradient(135deg,#1a0d05,#120804 55%,#2a1205);position:relative}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:48px 48px}
.mtn{position:absolute;left:0;right:0;bottom:0;height:${m?220:150}px;opacity:.18;background:#f5b301;clip-path:polygon(0 100%,0 60%,8% 30%,16% 62%,26% 18%,36% 58%,46% 34%,56% 66%,66% 22%,76% 55%,86% 30%,94% 58%,100% 40%,100% 100%)}
.left{position:absolute;left:${m?64:96}px;top:${m?64:44}px;width:${m?952:1000}px}
.brand{display:flex;align-items:center;gap:${m?20:16}px}
.brand img{width:${m?104:84}px;height:${m?104:84}px;border-radius:50%;box-shadow:0 0 0 3px rgba(245,179,1,.5)}
.brand b{font-size:${m?32:28}px;letter-spacing:1px;font-weight:700}.brand b span{color:#f5b301}
.brand i{display:block;font-style:normal;font-size:${m?20:17}px;color:#d6c3a8;letter-spacing:.5px}
.tag{display:inline-block;margin-top:${m?40:20}px;padding:${m?10:8}px ${m?22:18}px;border:1.5px solid rgba(255,140,40,.6);background:rgba(255,120,30,.15);border-radius:10px;color:#ffb347;font-weight:700;letter-spacing:1.5px;font-size:${m?24:20}px}
h1{margin-top:${m?18:14}px;font-weight:900;line-height:1;font-size:${m?92:76}px;letter-spacing:-2px}
h1 span{display:block;background:linear-gradient(90deg,#ffd34d,#ff8a1f);-webkit-background-clip:text;color:transparent}
.sub{margin-top:${m?20:12}px;font-size:${m?30:24}px;font-weight:500;color:#f1e4d0}
.chips{display:flex;${m?'flex-direction:column;align-items:flex-start;':''}gap:12px;margin-top:${m?26:16}px}
.chip{padding:${m?10:8}px ${m?22:18}px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);font-size:${m?24:19}px;font-weight:600}
.chip:before{content:"✓ ";color:#f5b301}
.cta{display:inline-flex;align-items:center;gap:14px;margin-top:${m?34:20}px;padding:${m?22:14}px ${m?44:34}px;border-radius:999px;background:linear-gradient(90deg,#ffd34d,#ff9a1f);color:#1a0d05;font-weight:800;font-size:${m?34:26}px;box-shadow:0 10px 40px rgba(255,150,30,.45)}
.right{position:absolute;${m?'right:56px;bottom:150px;width:430px':'right:110px;top:70px;width:560px'};display:flex;flex-direction:column;gap:${m?14:16}px}
.card{display:flex;align-items:center;gap:${m?16:20}px;background:#fffaf2;color:#1a0d05;border-radius:18px;padding:${m?16:20}px ${m?20:24}px;box-shadow:0 14px 40px rgba(0,0,0,.45)}
.card:nth-child(1){transform:rotate(-2deg)}.card:nth-child(2){transform:rotate(1.5deg) translateX(${m?-20:30}px)}.card:nth-child(3){transform:rotate(-1deg)}
.ic{flex:none;width:${m?54:64}px;height:${m?54:64}px;border-radius:14px;display:grid;place-items:center;font-size:${m?28:34}px;background:linear-gradient(135deg,#ffb347,#e86a10)}
.card b{display:block;font-size:${m?22:26}px;font-weight:700}.card small{font-size:${m?16:18}px;color:#6b5a48;font-weight:500}
.free{position:absolute;${m?'right:40px;top:56px':'right:56px;bottom:42px'};width:${m?190:180}px;height:${m?190:180}px;border-radius:50%;display:grid;place-items:center;text-align:center;background:radial-gradient(circle at 35% 30%,#3df0a6,#0d9b62);border:5px solid rgba(255,255,255,.85);transform:rotate(-10deg);box-shadow:0 12px 40px rgba(0,0,0,.45);font-weight:900;line-height:1.05;font-size:${m?30:28}px;color:#05301e}
.free small{display:block;font-size:${m?20:18}px;font-weight:700}
`;
const body = (m) => `<div class="grid"></div><div class="mtn"></div>
<div class="left">
 <div class="brand"><img src="${logo}"><div><b>UKPSC <span>DECODED</span></b><i>Prepare smarter · Rank higher</i></div></div>
 <div class="tag">LAST MONTH · UKPSC PRELIMS 2026</div>
 <h1>Final Revision<span>Test Series</span></h1>
 <p class="sub">One test a day, finished before the exam</p>
 <div class="chips"><div class="chip">6 live-ranked full mocks</div><div class="chip">800 Uttarakhand GK Q</div><div class="chip">600 Current Affairs Q</div></div>
 <div class="cta">Start Revision →</div>
</div>
<div class="right">
 <div class="card"><div class="ic">🏆</div><div><b>Mock Mahasangram</b><small>6 full mocks · live Uttarakhand rank</small></div></div>
 <div class="card"><div class="ic">⛰️</div><div><b>Uttarakhand GK</b><small>8 tests · 800 questions</small></div></div>
 <div class="card"><div class="ic">📰</div><div><b>Current Affairs</b><small>6 tests · 600 questions + 2 CSAT</small></div></div>
</div>
<div class="free"><div>MOCK 1<br>FREE<small>for everyone</small></div></div>`;
(async () => {
  const b = await chromium.launch();
  for (const m of [false, true]) {
    const p = await b.newPage({ viewport: { width: m ? 1080 : 1920, height: m ? 1080 : 600 } });
    await p.setContent(`<html><head><style>${css(m)}</style></head><body>${body(m)}</body></html>`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(500);
    await p.screenshot({ path: m ? 'revision-mobile.png' : 'revision-desktop.png' });
  }
  await b.close();
})();
