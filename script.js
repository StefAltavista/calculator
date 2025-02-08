let equation = "";
let history = [];
let result = "";

const input = document.querySelector("#display");
const buttons = document.querySelectorAll(".btn");
const historyElement = document.querySelector("#history");
const errorMessage = document.querySelector(".error");


document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keydown", handleKeyPress);
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      let value = event.target.getAttribute("data-value");
      if (value) handleButtonPress(value);
    });
  });
});

function handleButtonPress(value) {
  if (value === "C") clear();
  else if (value === "CE") clearEntry();
  else if (value === "=") calculate();
  else append(value);
}

function append(value) {
  if (/[0-9+\-*/%]/.test(value)) {
      equation += value;
  }
  updateDisplay();
}

function clear() {
  equation = "";
  updateDisplay();
}

function clearEntry() {
  equation = equation.slice(0, -1);
  updateDisplay();
}

function calculate() {
  try {
    result = simpleEvaluate(equation);
    history.push(`${equation} = ${result}`);
    equation = result.toString();
  } catch {
    result = "Error";
  }
  updateDisplay();
  updateHistory();
}

function simpleEvaluate(expression) {
  let match = expression.match(/(-?\d+)([+\-*/%])(-?\d+)/);
  if (!match) return "Error";

  let a = parseFloat(match[1]);
  let operator = match[2];
  let b = parseFloat(match[3]);

  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b !== 0 ? a / b : "Error";
    case "%":
      return b !== 0 ? a % b : "Error";
    default:
      return "Error";
  }
}


function handleKeyPress(event) {
  let key = event.key;
  if (/\d|[+\-*/%]|Shift|Control/.test(key)) {
          append(key);
  } else if (key === "Enter") {
      calculate();
  } else if (key === "Backspace") {
      clearEntry();
  } else if (key === "Escape") {
    clear();
  } else {
    console.log("error");
    errorMessage.classList.remove("hide");

    setTimeout(() => {
      errorMessage.classList.add("hide");
    }, 500);
  }
}

function updateDisplay() {
  input.value = equation;
}

function updateHistory() {
  historyElement.value = history.join("\n");
}
