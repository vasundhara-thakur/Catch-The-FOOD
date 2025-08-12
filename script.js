const screens = document.querySelectorAll('.screen');
const choose_food_btns = document.querySelectorAll('.choose-food-btn');
const start_btn = document.getElementById('start-btn');
const home_btn = document.getElementById('home-btn');
const exit_btn = document.getElementById('exit-btn');
const game_container = document.getElementById('game-container');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const message = document.getElementById('message');

let seconds = 0;
let score = 0;
let selected_food = {};
let gameInterval = null;
let suppressEndPrompt = false;

const defaultMessageHtml = message.innerHTML || 'Are you hungry yet? <br> Try to catch all the food!';


start_btn.addEventListener('click', () => screens[0].classList.add('up'));

choose_food_btns.forEach(btn => {
  btn.addEventListener('click', () => {
    const img = btn.querySelector('img');
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt');
    selected_food = { src, alt };
    screens[1].classList.add('up');
    setTimeout(createFood, 2000);
    startGame();
  });
});


function startGame() {

  clearInterval(gameInterval);
  gameInterval = setInterval(increaseTime, 1000);
}

function pauseGame() {
  clearInterval(gameInterval);
  gameInterval = null;
}

function increaseTime() {
  let m = Math.floor(seconds / 60);
  let s = seconds % 60;
  m = m < 10 ? `0${m}` : m;
  s = s < 10 ? `0${s}` : s;
  timeEl.innerHTML = `Time:${m}:${s}`;
  seconds++;
}


function createFood() {
  const food = document.createElement('div');
  food.classList.add('food');
  const { x, y } = getRandomLocation();
  food.style.top = `${y}px`;
  food.style.left = `${x}px`;
  food.innerHTML = `<img src="${selected_food.src}" alt="${selected_food.alt}" style="transform: rotate(${Math.random() * 360}deg)" />`;

  food.addEventListener('click', catchFood);
  game_container.appendChild(food);
}

function getRandomLocation() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const marginX = 150;
  const marginY = 150;
  const x = Math.random() * (width - marginX * 2) + marginX;
  const y = Math.random() * (height - marginY * 2) + marginY;
  return { x, y };
}

function catchFood() {
  increaseScore();
  this.classList.add('caught');
  setTimeout(() => this.remove(), 2000);
  addFoods();
}

function addFoods() {
  setTimeout(createFood, 2000);
  setTimeout(createFood, 1500);
}

function increaseScore() {
  score++;
  scoreEl.innerHTML = `Score:${score}`;

  if (score >= 25 && !suppressEndPrompt) {
    showEndPrompt();
  }
}


function showEndPrompt() {
  
  pauseGame();


  message.innerHTML = `
    <div>🎯 You reached ${score} points!</div>
    <div style="margin-top:8px">Do you want to continue?</div>
    <div style="margin-top:12px">
      <button id="end-yes" class="btn">Yes</button>
      <button id="end-no" class="btn">No</button>
    </div>
  `;
  message.classList.add('visible');


  document.getElementById('end-yes').addEventListener('click', () => {
    message.innerHTML = `<div>🍔 Enjoy the food items! 🍕</div>`;
    suppressEndPrompt = true;
    setTimeout(() => {
      message.classList.remove('visible');
      message.innerHTML = defaultMessageHtml;
      startGame(); 
    }, 2000);
  });


  document.getElementById('end-no').addEventListener('click', () => {
    showExitConfirmInsidePrompt();
  });
}

function showExitConfirmInsidePrompt() {
  message.innerHTML = `
    <div>Do you want to exit?</div>
    <div style="margin-top:12px">
      <button id="exit-yes" class="btn">Yes</button>
      <button id="exit-no" class="btn">No</button>
    </div>
  `;

  document.getElementById('exit-yes').addEventListener('click', () => {
    
    resetGame();
    screens.forEach(s => s.classList.remove('up'));
    message.classList.remove('visible');
    message.innerHTML = defaultMessageHtml;
  });

  document.getElementById('exit-no').addEventListener('click', () => {

    suppressEndPrompt = true;
    message.classList.remove('visible');
    message.innerHTML = defaultMessageHtml;
    startGame();
  });
}


exit_btn.addEventListener('click', () => {

  pauseGame();

  message.innerHTML = `
    <div>Do you want to exit?</div>
    <div style="margin-top:12px">
      <button id="bottom-exit-yes" class="btn">Yes</button>
      <button id="bottom-exit-no" class="btn">No</button>
    </div>
  `;
  message.classList.add('visible');

  document.getElementById('bottom-exit-yes').addEventListener('click', () => {
    resetGame();
    screens.forEach(s => s.classList.remove('up'));
    message.classList.remove('visible');
    message.innerHTML = defaultMessageHtml;
  });

  document.getElementById('bottom-exit-no').addEventListener('click', () => {

    message.classList.remove('visible');
    message.innerHTML = defaultMessageHtml;
    startGame();
  });
});


home_btn.addEventListener('click', () => {
  pauseGame();
  resetGame();
  screens.forEach(s => s.classList.remove('up'));
});


function resetGame() {
  score = 0;
  seconds = 0;
  suppressEndPrompt = false;
  scoreEl.innerHTML = `Score: 0`;
  timeEl.innerHTML = `Time: 00:00`;


  game_container.querySelectorAll('.food').forEach(f => f.remove());


  message.classList.remove('visible');
  message.innerHTML = defaultMessageHtml;

  
  pauseGame();
}
