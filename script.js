const quizData = [
  {
    question: "What does '===' mean in JavaScript?",
    options: ["Equal", "Strict equality", "Assignment", "Loose equality"],
    correct: 1,
    explanation: "===' checks value and type both, while '==' checks value only."
  },
  {
    question: "Which method converts JSON to an object?",
    options: ["JSON.objectify()", "JSON.parse()", "JSON.stringify()", "parse.JSON()"],
    correct: 1,
    explanation: "JSON.parse() converts a JSON string into a JavaScript object."
  },
  {
    question: "Which array method adds items to the end?",
    options: ["shift()", "push()", "pop()", "unshift()"],
    correct: 1,
    explanation: "push() adds items to the end of an array."
  },
  {
    question: "Which keyword declares a constant variable?",
    options: ["var", "const", "let", "define"],
    correct: 1,
    explanation: "const is used to declare variables that cannot be reassigned."
  },
  {
    question: "Which is used to handle async code?",
    options: ["if-else", "try-catch", "Promise", "switch"],
    correct: 2,
    explanation: "Promises handle async operations like fetch, setTimeout, etc."
  },
  {
    question: "What is NaN in JavaScript?",
    options: ["A string", "An object", "Not a Number", "A function"],
    correct: 2,
    explanation: "NaN means 'Not a Number'."
  },
  {
    question: "Which loop will run at least once?",
    options: ["for", "while", "do...while", "foreach"],
    correct: 2,
    explanation: "do...while runs first, then checks the condition."
  },
  {
    question: "What does typeof [] return?",
    options: ["object", "array", "list", "undefined"],
    correct: 0,
    explanation: "Arrays are technically objects in JavaScript."
  },
  {
    question: "Which method removes the last array element?",
    options: ["pop()", "push()", "shift()", "splice()"],
    correct: 0,
    explanation: "pop() removes and returns the last item in an array."
  },
  {
    question: "What is the scope of let variables?",
    options: ["Global", "Block", "Function", "Module"],
    correct: 1,
    explanation: "let has block scope — available only inside {}."
  }
];

let shuffledQuestions = [];
let current = 0;
let score = 0;
let timeLeft = 15;
let timer;
let userName = "";

const startScreen = document.getElementById("start-screen");
const quizBox = document.getElementById("quiz");
const resultBox = document.getElementById("result");
const usernameInput = document.getElementById("username");
const questionEl = document.getElementById("question");
const answersList = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const timerEl = document.getElementById("timer");
const progressFill = document.getElementById("progress-fill");

function startQuiz() {
  userName = usernameInput.value.trim() || "Guest";
  startScreen.classList.add("hidden");
  quizBox.classList.remove("hidden");
  shuffledQuestions = [...quizData].sort(() => Math.random() - 0.5);
  current = 0;
  score = 0;
  loadQuestion();
}

function loadQuestion() {
  clearInterval(timer);
  timeLeft = 15;
  timerEl.textContent = `Time: ${timeLeft}`;
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time: ${timeLeft}`;
    if (timeLeft === 0) {
      clearInterval(timer);
      selectAnswer(-1);
    }
  }, 1000);

  progressFill.style.width = `${((current) / quizData.length) * 100}%`;

  const q = shuffledQuestions[current];
  questionEl.textContent = q.question;
  answersList.innerHTML = "";
  nextBtn.style.display = "none";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(i);
    const li = document.createElement("li");
    li.appendChild(btn);
    answersList.appendChild(li);
  });
}

function selectAnswer(index) {
  clearInterval(timer);
  const correctIndex = shuffledQuestions[current].correct;
  const buttons = answersList.querySelectorAll("button");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correctIndex) btn.classList.add("correct");
    else if (i === index) btn.classList.add("incorrect");
  });

  if (index === correctIndex) score++;

  const explanation = document.createElement("p");
  explanation.innerHTML = `<strong>Explanation:</strong> ${shuffledQuestions[current].explanation}`;
  answersList.appendChild(explanation);

  nextBtn.style.display = "block";
}

nextBtn.onclick = () => {
  current++;
  if (current < shuffledQuestions.length) {
    loadQuestion();
  } else {
    showResult();
  }
};

function showResult() {
  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");

  const highest = localStorage.getItem("jsQuizHighScore") || 0;
  const message = `
    <h2>Thank you, ${userName}!</h2>
    <p>Your Score: ${score} / ${quizData.length}</p>
    <p>High Score: ${Math.max(score, highest)}</p>
    <button onclick="restartQuiz()">Play Again</button>
  `;

  resultBox.innerHTML = message;

  if (score > highest) {
    localStorage.setItem("jsQuizHighScore", score);
  }
}

function restartQuiz() {
  resultBox.classList.add("hidden");
  startScreen.classList.remove("hidden");
}
