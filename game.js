const suits=["♠","♥","♦","♣"];
const values=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

let deck=[];
let tableaus=[];
let foundations=[[],[],[],[]];
let stock=[];
let waste=[];
let score=0;
let startTime;
let drawMode=1;

const game=document.getElementById("game");

function createDeck(){
  deck=[];
  suits.forEach(s=>{
    values.forEach((v,i)=>{
      deck.push({
        suit:s,
        value:v,
        rank:i+1,
        color:(s==="♥"||s==="♦")?"red":"black"
      });
    });
  });
}

function shuffle(){
  deck.sort(()=>Math.random()-0.5);
}

function startGame(){
  score=0;
  document.getElementById("score").innerText=0;
  startTime=Date.now();
  document.getElementById("victoryScreen").classList.add("hidden");

  game.innerHTML="";
  foundations=[[],[],[],[]];
  tableaus=[[],[],[],[],[],[],[]];
  stock=[];
  waste=[];

  createDeck();
  shuffle();

  for(let i=0;i<7;i++){
    for(let j=0;j<=i;j++){
      let card=deck.pop();
      card.faceUp=(j===i);
      tableaus[i].push(card);
    }
  }

  stock=[...deck];
  render();
}

function render(){
  game.innerHTML="";
  
  const topRow=document.createElement("div");
  topRow.style.display="flex";
  topRow.style.gap="20px";

  const stockDiv=createPile();
  stockDiv.onclick=drawCard;
  topRow.appendChild(stockDiv);

  const wasteDiv=createPile();
  if(waste.length){
    wasteDiv.appendChild(createCard(waste[waste.length-1]));
  }
  topRow.appendChild(wasteDiv);

  topRow.appendChild(document.createElement("div")).style.flex=1;

  foundations.forEach((f,i)=>{
    const fDiv=createPile();
    if(f.length){
      fDiv.appendChild(createCard(f[f.length-1]));
    }
    topRow.appendChild(fDiv);
  });

  game.appendChild(topRow);

  const bottomRow=document.createElement("div");
  bottomRow.style.display="flex";
  bottomRow.style.gap="20px";
  bottomRow.style.marginTop="30px";

  tableaus.forEach((pile,i)=>{
    const tDiv=createPile();
    pile.forEach((card,index)=>{
      const el=createCard(card);
      el.style.position="relative";
      el.style.top=(index*25)+"px";
      tDiv.appendChild(el);
    });
    bottomRow.appendChild(tDiv);
  });

  game.appendChild(bottomRow);

  checkWin();
}

function createPile(){
  const div=document.createElement("div");
  div.style.width="90px";
  div.style.height="130px";
  div.style.borderRadius="10px";
  div.style.background="rgba(255,255,255,0.1)";
  return div;
}

function createCard(card){
  const div=document.createElement("div");
  div.style.width="90px";
  div.style.height="130px";
  div.style.borderRadius="10px";
  div.style.background="white";
  div.style.boxShadow="0 4px 10px rgba(0,0,0,0.4)";
  div.style.display="flex";
  div.style.flexDirection="column";
  div.style.justifyContent="space-between";
  div.style.padding="8px";
  div.style.fontWeight="bold";
  div.style.color=card.color==="red"?"#c62828":"#111";

  if(!card.faceUp){
    div.style.background="linear-gradient(135deg,#1e3c72,#2a5298)";
    return div;
  }

  div.innerHTML=`<div>${card.value}${card.suit}</div>
                 <div style="align-self:flex-end">${card.value}${card.suit}</div>`;

  div.ondblclick=()=>autoMove(card);

  return div;
}

function drawCard(){
  if(stock.length===0){
    stock=[...waste.reverse()];
    waste=[];
    render();
    return;
  }

  for(let i=0;i<drawMode;i++){
    if(stock.length){
      let c=stock.pop();
      c.faceUp=true;
      waste.push(c);
    }
  }

  render();
}

function autoMove(card){
  for(let i=0;i<4;i++){
    let f=foundations[i];
    if(f.length===0 && card.rank===1){
      f.push(card);
      removeCard(card);
      score+=10;
      render();
      return;
    }
    if(f.length && f[f.length-1].suit===card.suit && card.rank===f[f.length-1].rank+1){
      f.push(card);
      removeCard(card);
      score+=10;
      render();
      return;
    }
  }
}

function removeCard(card){
  tableaus.forEach(p=>{
    let index=p.indexOf(card);
    if(index>-1){
      p.splice(index,1);
      if(p.length && !p[p.length-1].faceUp){
        p[p.length-1].faceUp=true;
      }
    }
  });

  let wIndex=waste.indexOf(card);
  if(wIndex>-1) waste.splice(wIndex,1);
}

function checkWin(){
  if(foundations.every(f=>f.length===13)){
    winGame();
  }
}

function winGame(){
  document.getElementById("victoryScreen").classList.remove("hidden");
}

document.getElementById("drawModeBtn").onclick=()=>{
  drawMode=drawMode===1?3:1;
  document.getElementById("drawModeBtn").innerText="Modo: "+drawMode+" Carta(s)";
};

document.getElementById("newGameBtn").onclick=startGame;

startGame();
