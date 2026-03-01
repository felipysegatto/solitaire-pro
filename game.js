let drawMode=1;
let score=0;
let startTime;
let stats=JSON.parse(localStorage.getItem("solitaireStats"))||{
  wins:0,
  totalTime:0
};

document.getElementById("drawModeBtn").onclick=()=>{
  drawMode = drawMode===1?3:1;
  document.getElementById("drawModeBtn").innerText="Modo: "+drawMode+" Carta(s)";
};

document.getElementById("newGameBtn").onclick=startGame;

function startGame(){
  score=0;
  document.getElementById("score").innerText=score;
  startTime=Date.now();
  document.getElementById("victoryScreen").classList.add("hidden");
}

function updateTimer(){
  let t=Math.floor((Date.now()-startTime)/1000);
  let m=String(Math.floor(t/60)).padStart(2,"0");
  let s=String(t%60).padStart(2,"0");
  document.getElementById("timer").innerText=m+":"+s;
}
setInterval(updateTimer,1000);

function winGame(){
  let timeSpent=Math.floor((Date.now()-startTime)/1000);
  stats.wins++;
  stats.totalTime+=timeSpent;
  localStorage.setItem("solitaireStats",JSON.stringify(stats));

  let avg=Math.floor(stats.totalTime/stats.wins);
  document.getElementById("statsText").innerText=
    "Vitórias: "+stats.wins+
    " | Tempo médio: "+avg+"s";

  document.getElementById("victoryScreen").classList.remove("hidden");
  startConfetti();
}

/* Confetti */
function startConfetti(){
  const canvas=document.getElementById("confetti");
  const ctx=canvas.getContext("2d");
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;

  let pieces=[];
  for(let i=0;i<150;i++){
    pieces.push({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      r:Math.random()*6+4,
      d:Math.random()*50
    });
  }

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="hsl("+Math.random()*360+",100%,50%)";
    pieces.forEach(p=>{
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
      p.y+=2;
      if(p.y>canvas.height)p.y=0;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

function startGame(){
  score=0;
  document.getElementById("score").innerText=score;
  startTime=Date.now();
  document.getElementById("victoryScreen").classList.add("hidden");

  // Limpa confetti
  const canvas=document.getElementById("confetti");
  const ctx=canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // IMPORTANTE: não chamar winGame aqui
}

/* Registrar service worker */
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("service-worker.js");
}
