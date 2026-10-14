const DISCLAIMER="For fun & discussion only. Data from multiple sources; coverage and formats vary. Not official rankings or a prediction of match-day strength. Match day has the final say.";
let DATA={players:[],teams:[],public_rankings:[],last_season_rankings:[]};
const $=id=>document.getElementById(id);
const val=(o,...keys)=>{for(const k of keys) if(o && o[k]!==undefined && o[k]!==null && o[k]!=="") return o[k]; return null};
const fmt=(v,d=1)=>v===null||v===undefined||v===""?"—":(typeof v==="number"?v.toLocaleString("en-IN",{maximumFractionDigits:d}):v);
const money=v=>v===null||v===undefined?"—":"₹"+Number(v).toLocaleString("en-IN",{maximumFractionDigits:0});
const text=(v)=>String(v??"");
function role(p){return text(val(p,"Declared_Role")).replaceAll("_"," ")||"Role not specified"}
function score(p){return val(p,"Provisional_Score","Provisional_Score","Provisional_Intelligence_Score")}
function teamName(t){return val(t,"Team","team")||"Team"}
function playerName(p){return val(p,"Player","player")||"Player"}
function playerId(p){return val(p,"EGL_Player_ID","Auction_Player_ID")||""}
function findPlayerById(id){return DATA.players.find(p=>String(playerId(p))===String(id))}
function field(p,key){const map={"Provisional_Score":["Provisional_Score","Provisional_Intelligence_Score"],"Last_Season_Index":["Last_Season_Index","Last_Season_Performance_Index"],"Last_Season_Runs":["Last_Season_Runs","Last_Season_Runs_scored"],"Last_Season_Wickets":["Last_Season_Wickets"],"Last_Season_Batting_SR":["Last_Season_Batting_SR","Last_Season_Bat_SR"],"Auction_Price_INR":["Auction_Price_INR","Final_Auction_Price"]};return val(p,...(map[key]||[key]))}
function evidence(p){let m=field(p,"Last_Season_Matches");if(m!==null)return `Prior-season EGL data: ${fmt(m,0)} match(es)`;if(field(p,"Career_Matches")!==null)return "Career context only · lower confidence";return "Limited performance data available"}
function esc(s){return text(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderPlayers(){let q=$("playerSearch").value.toLowerCase(),team=$("teamFilter").value,rolef=$("roleFilter").value;
 let arr=DATA.players.filter(p=>(!team||teamName(p)===team)&&(!q||(playerName(p)+" "+role(p)+" "+teamName(p)).toLowerCase().includes(q))&&(!rolef||role(p).toLowerCase().includes(rolef.toLowerCase())));
 $("playerGrid").innerHTML=arr.map(p=>{let s=score(p),idx=field(p,"Last_Season_Index");return `<article class="tile"><div class="eyebrow">${esc(playerId(p))} · ${esc(val(p,"Category")||"SQUAD PLAYER")}</div><h3>${esc(playerName(p))}</h3><div class="meta">${esc(teamName(p))} · ${esc(role(p))}</div><div class="metric-row"><div><div class="score">${fmt(s)}</div><div class="score-label">PROVISIONAL SCORE</div></div><div style="text-align:right"><div style="font-weight:800">${fmt(idx)}</div><div class="score-label">PRIOR EGL INDEX</div></div></div><div class="mini-line"><span style="width:${Math.max(0,Math.min(100,Number(s)||0))}%"></span></div><div class="small">${esc(evidence(p))}. Scores are indicative, not definitive.</div><div class="actions"><button class="primary" data-player-card="${esc(playerId(p))}">Create player card</button><button data-player-detail="${esc(playerId(p))}">View data</button></div></article>`}).join("")||`<div class="empty">No players match this search.</div>`;
 document.querySelectorAll("[data-player-card]").forEach(b=>b.onclick=()=>{switchTab("share");$("cardType").value="player";populateCardSubjects();$("cardSubject").value="p:"+b.dataset.playerCard;renderCard()});
 document.querySelectorAll("[data-player-detail]").forEach(b=>b.onclick=()=>{let p=findPlayerById(b.dataset.playerDetail);alert(`${playerName(p)}\\n${teamName(p)} · ${role(p)}\\nPrior-season EGL index: ${fmt(field(p,"Last_Season_Index"))}\\nRuns: ${fmt(field(p,"Last_Season_Runs"),0)} · Wickets: ${fmt(field(p,"Last_Season_Wickets"),0)}\\n${evidence(p)}\\n\\n${DISCLAIMER}`)});
}
function renderTeams(){ $("teamGrid").innerHTML=DATA.teams.map(t=>`<article class="tile"><div class="eyebrow">TEAM SNAPSHOT · ${fmt(val(t,"Squad_Size"),0)} PLAYERS</div><h3>${esc(teamName(t))}</h3><div class="metric-row"><div><div class="score">${fmt(val(t,"Mean_Last_Season_Index"),1)}</div><div class="score-label">MEAN PRIOR-SEASON INDEX</div></div><div style="text-align:right"><div style="font-weight:800">${money(val(t,"Roster_Spend_INR"))}</div><div class="score-label">ROSTER SPEND</div></div></div><div class="small">Prior-season index coverage: ${fmt(val(t,"Players_With_Last_Season_Index"),0)}/${fmt(val(t,"Squad_Size"),0)} players. This describes available data, not team strength.</div><div class="small"><b>On-paper signal:</b> ${esc(val(t,"On_Paper_Strengths")||"No standout signal identified.")}</div><div class="small"><b>Questions:</b> ${esc(val(t,"Questions_to_Validate")||"Validate roles and availability.")}</div><div class="actions"><button class="primary" data-team-card="${esc(teamName(t))}">Create team card</button></div></article>`).join("");
 document.querySelectorAll("[data-team-card]").forEach(b=>b.onclick=()=>{switchTab("share");$("cardType").value="team";populateCardSubjects();$("cardSubject").value="t:"+b.dataset.teamCard;renderCard()});
}
function renderRankings(){let kind=$("rankType").value,q=$("rankSearch").value.toLowerCase();let arr=kind==="last"?DATA.last_season_rankings:DATA.public_rankings;
 arr=arr.filter(p=>(playerName(p)+" "+teamName(p)).toLowerCase().includes(q));
 $("rankBody").innerHTML=arr.slice(0,150).map((p,i)=>{let value=kind==="last"?field(p,"Last_Season_Index"):score(p);return `<tr><td>${fmt(val(p,"Rank")||i+1,0)}</td><td>${esc(playerName(p))}</td><td>${esc(teamName(p))}</td><td><strong>${fmt(value)}</strong></td><td class="muted">${esc(evidence(p))}</td><td><button class="tab" data-rank-card="${esc(playerId(p))}">Card</button></td></tr>`}).join("")||`<tr><td colspan="6">No ranking rows available.</td></tr>`;
 document.querySelectorAll("[data-rank-card]").forEach(b=>b.onclick=()=>{switchTab("share");$("cardType").value="player";populateCardSubjects();$("cardSubject").value="p:"+b.dataset.rankCard;renderCard()});
}
function switchTab(tab){document.querySelectorAll(".tab[data-tab]").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));["players","teams","rankings","share"].forEach(k=>$(k+"Pane").hidden=k!==tab)}
function populateFilters(){let names=[...new Set(DATA.teams.map(teamName))].sort();$("teamFilter").innerHTML='<option value="">All teams</option>'+names.map(n=>`<option>${esc(n)}</option>`).join("");}
function populateCardSubjects(){let type=$("cardType").value;let opts=type==="team"?DATA.teams.map(t=>({value:"t:"+teamName(t),label:teamName(t)})):DATA.players.map(p=>({value:"p:"+playerId(p),label:playerName(p)+" · "+teamName(p)}));$("cardSubject").innerHTML=opts.map(o=>`<option value="${esc(o.value)}">${esc(o.label)}</option>`).join("");}
function roundRect(ctx,x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.stroke()}}
function wrapText(ctx,txt,x,y,maxWidth,lineHeight,maxLines=3){let words=text(txt).split(/\s+/),line="",lines=0;for(let n=0;n<words.length;n++){let test=line+words[n]+" ";if(ctx.measureText(test).width>maxWidth&&n>0){ctx.fillText(line.trim(),x,y);line=words[n]+" ";y+=lineHeight;lines++;if(lines>=maxLines)return y;}else line=test}if(line.trim())ctx.fillText(line.trim(),x,y);return y+lineHeight}
const eglLogo=new Image();eglLogo.src="assets/egl-logo.jpeg";eglLogo.onload=()=>{if(DATA)renderCard()};const mcLogo=new Image();mcLogo.src="assets/mc-financial-services-logo.jpeg";mcLogo.onload=()=>{if(DATA)renderCard()};
function renderCard(){let canvas=$("cardCanvas"),ctx=canvas.getContext("2d"),type=$("cardType").value,sub=$("cardSubject").value,headline=$("cardHeadline").value||"WHAT THE NUMBERS SAY";let p=null,t=null;if(sub.startsWith("p:"))p=findPlayerById(sub.slice(2));if(sub.startsWith("t:"))t=DATA.teams.find(x=>teamName(x)===sub.slice(2));if(type==="team"&&!t&&DATA.teams.length)t=DATA.teams[0];if(type!=="team"&&!p&&DATA.players.length)p=DATA.players[0];
 let g=ctx.createLinearGradient(0,0,1080,1350);g.addColorStop(0,"#071426");g.addColorStop(.58,"#102746");g.addColorStop(1,"#080f1c");ctx.fillStyle=g;ctx.fillRect(0,0,1080,1350);
 ctx.fillStyle="#e33b42";ctx.fillRect(0,0,1080,18);ctx.fillStyle="#f4c45e";ctx.fillRect(64,74,90,8);
 if(eglLogo.complete&&eglLogo.naturalWidth)ctx.drawImage(eglLogo,64,48,78,78);
 ctx.fillStyle="#f4c45e";ctx.font="800 26px Arial";ctx.fillText("EGL 2.0  /  CRICKET INTELLIGENCE",160,100);
 ctx.fillStyle="#aebbd0";ctx.font="700 17px Arial";ctx.fillText("EXCLUSIVE PARTNER",160,132);if(mcLogo.complete&&mcLogo.naturalWidth)ctx.drawImage(mcLogo,730,48,286,97);
 ctx.fillStyle="#f4f7fb";ctx.font="900 68px Arial";let hy=wrapText(ctx,headline.toUpperCase(),64,220,920,78,2);
 if(type==="team"&&t){ctx.fillStyle="#b6ff36";ctx.font="900 54px Arial";hy=wrapText(ctx,teamName(t),64,hy+45,930,64,2);
 ctx.fillStyle="#aebbd0";ctx.font="26px Arial";ctx.fillText(`${fmt(val(t,"Squad_Size"),0)} PLAYERS  •  TEAM SNAPSHOT`,64,hy+12);
 roundRect(ctx,64,hy+55,952,235,22,"#0b192c","#263a55");
 ctx.fillStyle="#aebbd0";ctx.font="700 22px Arial";ctx.fillText("MEAN PRIOR-SEASON EGL INDEX",96,hy+105);
 ctx.fillStyle="#b6ff36";ctx.font="900 78px Arial";ctx.fillText(fmt(val(t,"Mean_Last_Season_Index")),96,hy+190);
 ctx.fillStyle="#f4c45e";ctx.font="700 24px Arial";ctx.fillText("ROSTER SPEND",570,hy+105);
 ctx.fillStyle="#f4f7fb";ctx.font="900 42px Arial";ctx.fillText(money(val(t,"Roster_Spend_INR")),570,hy+170);
 ctx.fillStyle="#aebbd0";ctx.font="23px Arial";ctx.fillText(`Prior-season coverage: ${fmt(val(t,"Players_With_Last_Season_Index"),0)}/${fmt(val(t,"Squad_Size"),0)} players`,96,hy+250);
 }else if(type==="stat"&&p){ctx.fillStyle="#b6ff36";ctx.font="900 58px Arial";hy=wrapText(ctx,playerName(p),64,hy+50,930,68,2);
 ctx.fillStyle="#aebbd0";ctx.font="27px Arial";ctx.fillText(`${teamName(p)}  •  ${role(p)}  •  ${playerId(p)}`,64,hy+8);
 const statKey=$("cardStat").value;
 const statLabels={"Provisional_Score":"PROVISIONAL INTELLIGENCE SCORE","Last_Season_Index":"PRIOR-SEASON EGL INDEX","Last_Season_Runs":"PRIOR-SEASON RUNS","Last_Season_Wickets":"PRIOR-SEASON WICKETS","Last_Season_Batting_SR":"PRIOR-SEASON BATTING STRIKE RATE","Auction_Price_INR":"FINAL AUCTION PRICE"};
 const statValue=field(p,statKey);
 roundRect(ctx,64,hy+50,952,280,22,"#0b192c","#263a55");
 ctx.fillStyle="#aebbd0";ctx.font="700 25px Arial";ctx.fillText(statLabels[statKey]||"PLAYER STAT",96,hy+112);
 ctx.fillStyle="#b6ff36";ctx.font="900 104px Arial";ctx.fillText(statKey==="Auction_Price_INR"?money(statValue):fmt(statValue,statKey==="Last_Season_Runs"||statKey==="Last_Season_Wickets"?0:1),96,hy+230);
 ctx.fillStyle="#aebbd0";ctx.font="23px Arial";wrapText(ctx,evidence(p),96,hy+282,850,30,2);
 }else if(p){ctx.fillStyle="#b6ff36";ctx.font="900 58px Arial";hy=wrapText(ctx,playerName(p),64,hy+50,930,68,2);
 ctx.fillStyle="#aebbd0";ctx.font="27px Arial";ctx.fillText(`${teamName(p)}  •  ${role(p)}  •  ${playerId(p)}`,64,hy+8);
 roundRect(ctx,64,hy+50,952,240,22,"#0b192c","#263a55");
 ctx.fillStyle="#aebbd0";ctx.font="700 22px Arial";ctx.fillText("PROVISIONAL INTELLIGENCE SCORE",96,hy+100);
 ctx.fillStyle="#b6ff36";ctx.font="900 88px Arial";ctx.fillText(fmt(score(p)),96,hy+192);
 ctx.fillStyle="#f4c45e";ctx.font="700 22px Arial";ctx.fillText("PRIOR-SEASON EGL INDEX",570,hy+100);
 ctx.fillStyle="#f4f7fb";ctx.font="900 62px Arial";ctx.fillText(fmt(field(p,"Last_Season_Index")),570,hy+174);
 ctx.fillStyle="#aebbd0";ctx.font="22px Arial";ctx.fillText(`Runs ${fmt(field(p,"Last_Season_Runs"),0)}  •  Wickets ${fmt(field(p,"Last_Season_Wickets"),0)}`,96,hy+250);
 }else{ctx.fillStyle="#f4f7fb";ctx.font="48px Arial";ctx.fillText("Data not available",64,350)}
 let baseY=1030;
 ctx.fillStyle="#f4c45e";ctx.font="800 26px Arial";ctx.fillText("THE NUMBERS HAVE A VIEW.",64,baseY);
 ctx.fillStyle="#f4f7fb";ctx.font="900 38px Arial";ctx.fillText("MATCH DAY HAS THE FINAL SAY.",64,baseY+55);
 ctx.fillStyle="#aebbd0";ctx.font="20px Arial";wrapText(ctx,"Sources: prior EGL dataset + mapped CricHeroes career profile statistics. Coverage and formats vary.",64,baseY+112,920,28,2);
 ctx.fillStyle="#f6e5b5";ctx.font="700 19px Arial";wrapText(ctx,"FOR FUN & DISCUSSION ONLY. Not official rankings, verified scouting or a prediction of actual match-day strength.",64,baseY+175,930,26,3);
 ctx.fillStyle="#e33b42";ctx.fillRect(64,1270,952,3);ctx.fillStyle="#f4f7fb";ctx.font="800 22px Arial";ctx.fillText("EGL CRICKET INTELLIGENCE",64,1315);ctx.fillStyle="#f4c45e";ctx.font="700 20px Arial";ctx.textAlign="right";ctx.fillText("EXCLUSIVE PARTNER · MC FINANCIAL SERVICES",1016,1315);ctx.textAlign="left";
}
async function init(){try{let res=await fetch("./data.json");DATA=await res.json();}catch(e){console.error(e);return}
 $("playerCount").textContent=DATA.players.length;$("teamCount").textContent=DATA.teams.length;
 populateFilters();renderPlayers();renderTeams();renderRankings();populateCardSubjects();renderCard();
 document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>switchTab(b.dataset.tab));
 ["playerSearch","teamFilter","roleFilter"].forEach(id=>$(id).addEventListener(id==="playerSearch"?"input":"change",renderPlayers));
 ["rankType","rankSearch"].forEach(id=>$(id).addEventListener(id==="rankSearch"?"input":"change",renderRankings));
 $("cardType").onchange=()=>{populateCardSubjects();renderCard()};$("cardSubject").onchange=renderCard;$("cardStat").onchange=renderCard;$("cardHeadline").oninput=renderCard;$("renderCard").onclick=renderCard;
 $("downloadCard").onclick=()=>{renderCard();let a=document.createElement("a");a.download="EGL-Cricket-Intelligence-Instagram-Card.png";a.href=$("cardCanvas").toDataURL("image/png");a.click()};
}
init();