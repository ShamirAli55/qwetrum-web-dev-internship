const questions = [
  {
    question: "What is the capital of Pakistan?",
    options: ["Lahore", "Karachi", "Islamabad", "Peshawar"],
    answer: "Islamabad",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Venus", "Jupiter"],
    answer: "Mars",
  },
  {
    question: "Who developed JavaScript?",
    options: ["Brendan Eich", "Bill Gates", "Mark Zuckerberg", "Elon Musk"],
    answer: "Brendan Eich",
  },
  {
    question: "HTML stands for?",
    options: [
      "Hyper Text Markup Language",
      "High Text Machine Language",
      "Hyper Tool Multi Language",
      "None",
    ],
    answer: "Hyper Text Markup Language",
  },
  {
    question: "Which company developed Java?",
    options: ["Google", "Sun Microsystems", "Apple", "Microsoft"],
    answer: "Sun Microsystems",
  },
  {
    question: "CSS is used for?",
    options: ["Styling", "Database", "Programming", "Server"],
    answer: "Styling",
  },
  {
    question: "How many continents are there?",
    options: ["5", "6", "7", "8"],
    answer: "7",
  },
  {
    question: "What is 5 + 5?",
    options: ["8", "9", "10", "11"],
    answer: "10",
  },
  {
    question: "Which language runs in browser?",
    options: ["Python", "Java", "JavaScript", "C++"],
    answer: "JavaScript",
  },
  {
    question: "What does CPU stand for?",
    options: [
      "Central Process Unit",
      "Central Processing Unit",
      "Computer Personal Unit",
      "Control Process Unit",
    ],
    answer: "Central Processing Unit",
  },
];

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const progressElement = document.getElementById("progress");
const progressBar = document.getElementById("progressBar");
const timerElement = document.getElementById("timer");
const nextBtn = document.getElementById("nextBtn");

const quizContainer = document.querySelector(".quiz-container");
const resultContainer = document.getElementById("resultContainer");
const scoreText = document.getElementById("scoreText");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 30;
let shuffledQuestions = [];

function shuffleQuestions() {
  shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
}

function loadQuestion() {
  clearInterval(timer);
  timeLeft = 30;
  timerElement.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft === 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);

  const q = shuffledQuestions[currentQuestion];

  questionElement.textContent = q.question;
  optionsElement.innerHTML = "";

  progressElement.textContent = `Question ${currentQuestion + 1} of ${shuffledQuestions.length}`;
  progressBar.style.width =
    ((currentQuestion + 1) / shuffledQuestions.length) * 100 + "%";

  q.options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("option-btn");

    button.addEventListener("click", () => checkAnswer(button, option));

    optionsElement.appendChild(button);
  });
}

function checkAnswer(button, selectedOption) {
  clearInterval(timer);

  const correctAnswer = shuffledQuestions[currentQuestion].answer;
  const buttons = document.querySelectorAll(".option-btn");

  buttons.forEach((btn) => (btn.disabled = true));

  if (selectedOption === correctAnswer) {
    button.classList.add("correct");
    score++;
  } else {
    button.classList.add("wrong");

    buttons.forEach((btn) => {
      if (btn.textContent === correctAnswer) {
        btn.classList.add("correct");
      }
    });
  }
}

nextBtn.addEventListener("click", nextQuestion);

function nextQuestion() {
  currentQuestion++;

  if (currentQuestion < shuffledQuestions.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  quizContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");

  const percentage = (score / shuffledQuestions.length) * 100;

  scoreText.textContent = `Your Score: ${score}/${shuffledQuestions.length} (${percentage}%)`;

  if (percentage >= 80) {
    message.textContent = "Excellent!";
  } else if (percentage >= 50) {
    message.textContent = "Good Job!";
  } else {
    message.textContent = "Try Again!";
  }
}

restartBtn.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;

  shuffleQuestions();

  resultContainer.classList.add("hidden");
  quizContainer.classList.remove("hidden");

  loadQuestion();
});

shuffleQuestions();
loadQuestion();
