const suits=["♠","♥","♦","♣"];
const values=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

let state;
let drawMode=1;
let timerInterval;
let startTime;

document.getElementById("drawModeBtn").onclick=()=>{
  drawMode = drawMode===1?3:1;
  document.getElementById("drawModeBtn").innerText="Modo: "+drawMode;
};

function newGame(){

document.getElementById("victory").classList.add("hidden");

  state={
    stock:[],
    waste:[],
    tableau:[[],[],[],[],[],[],[]],
    foundation:[[],[],[],[]],
    score:0
  };

  createDeck();
  shuffle(state.stock);
  deal();
  startTimer();
  render();
}

function createDeck(){
  suits.forEach(s=>{
    values.forEach((v,i)=>{
      state.stock.push({
        suit:s,
        value:v,
        rank:i+1,
        color:(s==="♥"||s==="♦")?"red":"black",
        faceUp:false
      });
    });
  });
}

function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }
}

function deal(){
  for(let i=0;i<7;i++){
    for(let j=0;j<=i;j++){
      let card=state.stock.pop();
      if(j===i) card.faceUp=true;
      state.tableau[i].push(card);
    }
  }
}

function drawCards(){
  for(let i=0;i<drawMode;i++){
    if(state.stock.length===0){
      state.stock = state.waste.reverse().map(c=>({...c,faceUp:false}));
      state.waste=[];
      return;
    }
    let card=state.stock.pop();
    card.faceUp=true;
    state.waste.push(card);
  }
  render();
}

function validTableauMove(card,target){
  if(target.length===0) return card.rank===13;
  let top=target[target.length-1];
  return card.color!==top.color && card.rank===top.rank-1;
}

function validFoundationMove(card,target){
  if(target.length===0) return card.rank===1;
  let top=target[target.length-1];
  return card.suit===top.suit && card.rank===top.rank+1;
}

function autoMove(card){
  for(let f of state.foundation){
    if(validFoundationMove(card,f)){
      f.push(card);
      removeCard(card);
      state.score+=10;
      checkWin();
      return true;
    }
  }
  return false;
}

function removeCard(card){

  // remover do waste
  let wIndex = state.waste.indexOf(card);
  if(wIndex > -1){
    state.waste.splice(wIndex,1);
    return;
  }

  // remover do tableau
  for(let pile of state.tableau){
    let index = pile.indexOf(card);
    if(index > -1){
      pile.splice(index,1);

      if(pile.length && !pile[pile.length-1].faceUp){
        pile[pile.length-1].faceUp = true;
      }
      return;
    }
  }
}

function checkWin(){
  if(state.foundation.every(f=>f.length===13)){
    document.getElementById("victory").classList.remove("hidden");
  }
}

function render(){
  const game=document.getElementById("game");
  game.innerHTML="";

  const topRow=document.createElement("div");
  topRow.className="row";

  const stockDiv=createPile(state.stock,true);
  stockDiv.onclick=drawCards;
  topRow.appendChild(stockDiv);

  topRow.appendChild(createPile(state.waste));
  topRow.appendChild(document.createElement("div")).style.flex=1;

  state.foundation.forEach(f=>{
    topRow.appendChild(createPile(f));
  });

  game.appendChild(topRow);

  const bottomRow=document.createElement("div");
  bottomRow.className="row";

  state.tableau.forEach(t=>{
    bottomRow.appendChild(createPile(t));
  });

  game.appendChild(bottomRow);

  document.getElementById("score").innerText=state.score;
}

function createPile(pile,isStock=false,isFoundation=false){

  const div=document.createElement("div");
  div.className="pile";

  pile.forEach((card,i)=>{

    const el=document.createElement("div");
    el.className="card "+(card.faceUp?card.color:"back");

    // STOCK e FOUNDATION não descem
    if(isStock || isFoundation){
      el.style.top="0px";
    }else{
      el.style.top=(i*25)+"px";
    }

    if(card.faceUp){
      el.innerText=card.value+card.suit;

      // DUPLO CLIQUE → auto mover
      el.ondblclick=()=>{
        if(autoMove(card)){
          render();
        }
      };

      // BOTÃO DIREITO → mover para foundation
      el.oncontextmenu=(e)=>{
        e.preventDefault();
        if(autoMove(card)){
          render();
        }
      };
    }

    div.appendChild(el);
  });

  return div;
}

  return div;
}

function startTimer(){
  clearInterval(timerInterval);
  startTime=Date.now();
  timerInterval=setInterval(()=>{
    let t=Math.floor((Date.now()-startTime)/1000);
    let m=String(Math.floor(t/60)).padStart(2,"0");
    let s=String(t%60).padStart(2,"0");
    document.getElementById("timer").innerText=m+":"+s;
  },1000);
}

newGame();





