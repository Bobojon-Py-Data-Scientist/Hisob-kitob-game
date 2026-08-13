const menu = document.getElementById('menu');
const game = document.getElementById('game');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const q = document.getElementById('q');
const ans = document.getElementById('ans');
const msg = document.getElementById('msg');
const check = document.getElementById('check');
const next = document.getElementById('next');

let score = 0;
let lives = 3;
let level = 1;
let questionNo = 0;
let correct = 0;
let answered = false;

// Level ko'rsatkichi
const levelBadge = document.createElement('div');
levelBadge.style.cssText =
  'display:inline-block;background:#b8f3ff;padding:8px 16px;border-radius:20px;font-weight:bold;margin:8px;';
q.parentElement.insertBefore(levelBadge, q);

const progress = document.createElement('div');
progress.style.cssText =
  'font-size:18px;font-weight:bold;margin:10px;color:#52627a;';
q.parentElement.insertBefore(progress, q);

function updateInfo() {
  levelBadge.textContent = `🏆 ${level}-LEVEL`;
  progress.textContent = `Savol: ${questionNo}/10`;
}

function start() {
  score = 0;
  lives = 3;
  level = 1;
  questionNo = 0;
  scoreEl.textContent = 0;
  livesEl.textContent = 3;

  menu.classList.add('hidden');
  game.classList.remove('hidden');

  newQuestion();
}

function newQuestion() {
  answered = false;
  ans.value = '';
  ans.className = '';
  msg.textContent = '';
  check.classList.remove('hidden');
  next.classList.add('hidden');

  questionNo++;
  updateInfo();

  let a, b, op;

  if (level === 1) {
    // 1-level: 10 gacha sodda misollar
    op = Math.random() < 0.5 ? '+' : '-';

    if (op === '+') {
      a = Math.floor(Math.random() * 6);
      b = Math.floor(Math.random() * (10 - a + 1));
      correct = a + b;
    } else {
      a = Math.floor(Math.random() * 11);
      b = Math.floor(Math.random() * (a + 1));
      correct = a - b;
    }
  } else {
    // 2-level: biroz qiyinroq, javob ham 10 ichida
    op = Math.random() < 0.5 ? '+' : '-';

    if (op === '+') {
      a = 1 + Math.floor(Math.random() * 9);
      b = 1 + Math.floor(Math.random() * (10 - a));
      correct = a + b;
    } else {
      a = 2 + Math.floor(Math.random() * 9);
      b = 1 + Math.floor(Math.random() * a);
      correct = a - b;
    }
  }

  q.textContent = `${a} ${op} ${b} = ?`;
  ans.focus();
}

function finishLevel() {
  answered = true;
  check.classList.add('hidden');
  next.classList.add('hidden');

  if (level === 1) {
    level = 2;
    questionNo = 0;

    msg.innerHTML =
      '🎉 <b>1-LEVEL TUGADI!</b><br>🚀 2-LEVEL boshlandi!<br>▶️ Davom etish uchun pastdagi tugmani bosing.';

    const startLevel2 = document.createElement('button');
    startLevel2.textContent = '🚀 2-LEVELNI BOSHLASH';
    startLevel2.id = 'startLevel2';
    startLevel2.onclick = () => {
      startLevel2.remove();
      newQuestion();
    };

    msg.appendChild(document.createElement('br'));
    msg.appendChild(startLevel2);
  } else {
    msg.innerHTML =
      `🏆 <b>O‘YIN TUGADI!</b><br>Natijangiz: <b>${score}</b> ball`;
    const restart = document.createElement('button');
    restart.textContent = '🔄 Qayta boshlash';
    restart.onclick = start;
    msg.appendChild(document.createElement('br'));
    msg.appendChild(restart);
  }
}

function checkAnswer() {
  if (answered) return;

  if (ans.value.trim() === '') {
    msg.textContent = '✏️ Avval javobni yoz!';
    return;
  }

  if (Number(ans.value) === correct) {
    answered = true;
    score++;
    scoreEl.textContent = score;

    ans.className = 'ok';
    msg.textContent = '🎉 Barakalla! To‘g‘ri!';

    check.classList.add('hidden');

    if (questionNo >= 10) {
      finishLevel();
    } else {
      next.classList.remove('hidden');
    }
  } else {
    lives--;
    livesEl.textContent = lives;
    ans.className = 'error';
    ans.value = '';

    if (lives > 0) {
      msg.textContent = `❌ Xato! Yana urinib ko‘r. ❤️ ${lives} ta jon qoldi.`;
    } else {
      answered = true;
      msg.innerHTML =
        '💔 <b>Jonlar tugadi!</b><br>Qaytadan boshlaymiz.';
      setTimeout(start, 1200);
    }
  }
}

document.getElementById('start').onclick = start;

document.getElementById('home').onclick = () => {
  game.classList.add('hidden');
  menu.classList.remove('hidden');
};

check.onclick = checkAnswer;
next.onclick = newQuestion;

ans.onkeydown = (e) => {
  if (e.key === 'Enter') checkAnswer();
};
